/* *************************************************************************
The MIT License (MIT)
Copyright (c)2016-2017 Atom Software Studios. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to
deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.
**************************************************************************** */

namespace ajs.resources {

    "use strict";

    /** Storage cachedResourcesInfo key */
    export const STORAGE_INFO_KEY: string = "AJSRESOURCEINFO";

    /** Storage resource data item key prefix */
    export const STORAGE_RESOURCE_KEY_PREFIX: string = "AJSRESOURCE.";

    /** Storage key for testing if the resource fits the remaining free space */
    export const STORAGE_ADDTEST_KEY: string = "AJSADDTEST";


    /**
     * Represents the browser storage (memory/session/local, based on the configuration and storage provider of the extending class)
     * <strong>
     * Abstract class to be extended by the class for the reqiured resource storage type
     * </strong>
     * <p>
     * This class implements complete functionality for the storage data manipulation but requires to be extended and initialized
     * by the concrete implementation of the storage class (local, session, memory). The initialization must include checking if
     * the storage required storage type is supported and instancing or collecting instance of the storage provider for the
     * given storage type
     * </p>
     * <p>
     * If the resource is updated by the application (not by the request to the server) and requirement to persist this change exists
     * the updateResource method should be called after each resource data change
     * </p>
     * <p>
     * AjsStorage is using the following keys in the storage for internal purposes:
     * <ul>
     * AJSRESOURCESINFO
     * <li>JSONed ICachedResource[] where data at all items is set to null</li>
     * AJSRESOURCES.%URL%
     * <li>JSONed resource data where %URL% is URL of the data</li>
     * </ul>
     * These keys are stored in constants so should be simply changed if required, but Ajs must be recompiled afterwards.
     * </p>
     */

    /**
     * Abstract class to be implemented by the Storage for the reqiured resource storage type
     * <p>
     * Currently extended by StorageBrowser (then by StorageMemory, StorageSession, StorageLocal)
     */
    export abstract class AjsStorage {

        /** Indicates if the storage type (local, session) is supported by the browser */
        protected _supported: boolean;
        /** Returns if the storage type (local, session) is supported by the browser */
        public get supported(): boolean { return this._supported; }

        /** Holds maximum size of the cache available to AjsStorage */
        protected _cacheSize: number;
        /** Returns maximum size of the cache usable by the AjsStorage */
        public get cacheSize(): number { return this._cacheSize; };

        /** Stores approximate total size of all resources stored in the storage in bytes */
        protected _usedSpace: number;
        /** Returns approximate total size of all resources stored in the storage in bytes */
        public get usedSpace(): number { return this._usedSpace; }

        /** Holds information about resources stored in the storage */
        protected _resources: ICachedResource[];
        /** Returns information about resources stored in the storage */
        public get resources(): ICachedResource[] { return this._resources; }

        /** Stores instance of the storage provider used by the Storage to manipulate storage data */
        protected _storageProvider: IStorageProvider;
        /** Returns instance of the storage provider used by the Storage to manipulate storage data */
        public get storageProvider(): IStorageProvider { return this._storageProvider; }

        /** Returns type of the storage */
        public abstract get type(): STORAGE_TYPE;

        /**
         * Constructs and initializes the AjsStorage
         * @param cacheSize Maximum amount of the storage to be available as the cache
         */
        public constructor(cacheSize: number) {

            ajs.dbg.log(dbg.LogType.Constructor, 0, "ajs.resources", this);

            this._cacheSize = cacheSize;
            this._initialize();

            ajs.dbg.log(dbg.LogType.Exit, 0, "ajs.resources", this);

        }

        /**
         * Internally initializes the instance of the Storage class
         * Must be overriden and check if the required storage type is supprted and get / instantiate storage provider
         */
        protected abstract _initialize(): void;


        /**
         * Completely cleans all resources from the storage
         */
        public clear(): void {

            ajs.dbg.log(dbg.LogType.Enter, 0, "ajs.resources", this);

            ajs.dbg.log(dbg.LogType.Info, 0, "ajs.resources", this, "Clearing the storage");

            // remove all data items
            for (let i: number = 0; i < this._resources.length; i++) {
                this._storageProvider.removeItem(STORAGE_RESOURCE_KEY_PREFIX + this._resources[i].url);
            }

            // remove stored resources information
            this._usedSpace = 0;
            this._resources = [];
            this._storageProvider.setItem(STORAGE_INFO_KEY, JSON.stringify(this._resources));

            ajs.dbg.log(dbg.LogType.Exit, 0, "ajs.resources", this);
        }

        /**
         * Adds a new resource to the storage
         * @param resource Resource to be stored
         * @throws NotEnoughSpaceInStorageException Thrown when there is not enough space in the storage to store the resource
         */
        public addResource(resource: ICachedResource): void {

            ajs.dbg.log(dbg.LogType.Enter, 0, "ajs.resources", this);

            ajs.dbg.log(dbg.LogType.Info, 0, "ajs.resources", this,
                "Adding cached resource to the storage " + resource.url, resource);

            // if the resource exists, update it
            if (this.getResource(resource.url) !== null) {
                this.updateResource(resource);
                return;
            }

            let data: string;
            let dataSize: number;

            // prepare necessary variables
            if (resource.data instanceof Uint8Array) {
                // # this hack is because of safari
                let str: string = "";
                for (let i: number = 0; i < resource.data.length; i++) {
                    str += String.fromCharCode(resource.data[i]);
                }
                data = JSON.stringify(btoa(str));
            } else {
                data = JSON.stringify(resource.data);
            }

            let oldInfoSize: number = this._storageProvider.getItem(STORAGE_INFO_KEY).length;
            dataSize = data.length;

            // try to add the resource data to the storage
            try {
                this._storageProvider.setItem(STORAGE_RESOURCE_KEY_PREFIX + resource.url, data);
            } catch (e) {
                // if there is no space, clean the cache and try it once more - don't catch the exception, let it pass further
                this._cleanCache(dataSize);
                // another try to add the resource
                try {
                    this._storageProvider.setItem(STORAGE_RESOURCE_KEY_PREFIX + resource.url, data);
                } catch (e) {
                    ajs.dbg.log(dbg.LogType.Error, 0, "ajs.resources", this,
                        "Not enough space in the storage", e);
                    throw new NotEnoughSpaceInStorageException();
                }
            }

            // prepare the resource info to be added to this._resources
            let resourceInfo: ICachedResource = {
                url: resource.url,
                data: null,
                cachePolicy: resource.cachePolicy,
                lastModified: resource.lastModified,
                lastUsedTimestamp: new Date()
            };

            // add info about the resource to the list of stored resources
            this._resources.push(resourceInfo);

            // stringify the resources info
            let resourcesInfoStr: string = JSON.stringify(this._resources);
            let newInfoSize: number = resourcesInfoStr.length;

            // try to update info in the store
            try {
                this._storageProvider.setItem(STORAGE_INFO_KEY, resourcesInfoStr);
            } catch (e) {
                this._storageProvider.removeItem(STORAGE_RESOURCE_KEY_PREFIX + resource.url);

                ajs.dbg.log(dbg.LogType.Error, 0, "ajs.resources", this,
                    "Not enough space in the storage for the metadata", e);

                throw new NotEnoughSpaceInStorageException();
            }

            // compute new size of the occupied space
            this._usedSpace += (newInfoSize - oldInfoSize) + dataSize;

            ajs.dbg.log(dbg.LogType.Exit, 0, "ajs.resources", this);
        }

        /**
         * Returns the resource according the URL passed
         * @param url URL of the resource to be returned
         */
        public getResource(url: string): ICachedResource {

            ajs.dbg.log(dbg.LogType.Enter, 0, "ajs.resources", this);

            ajs.dbg.log(dbg.LogType.Info, 0, "ajs.resources", this,
                "Getting cached resource from the storage: " + url);

            for (let i: number = 0; i < this._resources.length; i++) {
                if (this._resources[i].url === url) {
                    // update last used timestamp
                    this._resources[i].lastUsedTimestamp = new Date();
                    let info: string = JSON.stringify(this._resources);
                    this._storageProvider.setItem(STORAGE_INFO_KEY, info);

                    // prepare data
                    let dataStr: string = JSON.parse(this._storageProvider.getItem(STORAGE_RESOURCE_KEY_PREFIX + url));
                    let data: any = dataStr;

                    // compose the ICachedResource
                    let resource: ICachedResource = {
                        url: this._resources[i].url,
                        data: data,
                        cachePolicy: this._resources[i].cachePolicy,
                        lastModified: this._resources[i].lastModified,
                        lastUsedTimestamp: this._resources[i].lastUsedTimestamp,
                        size: dataStr.length
                    };

                    ajs.dbg.log(dbg.LogType.Info, 0, "ajs.resources", this,
                        "Cached resource found in the storage: " + url);

                    ajs.dbg.log(dbg.LogType.Exit, 0, "ajs.resources", this);

                    return resource;
                }
            }

            ajs.dbg.log(dbg.LogType.Info, 0, "ajs.resources", this,
                "Cached resource not found in the storage: " + url);

            ajs.dbg.log(dbg.LogType.Exit, 0, "ajs.resources", this);

            return null;
        }

        /**
         * Updates a cached resource
         * @param resource Resource to be updated
         */
        public updateResource(resource: ICachedResource): void {

            ajs.dbg.log(dbg.LogType.Enter, 0, "ajs.resources", this);

            ajs.dbg.log(dbg.LogType.Info, 0, "ajs.resources", this,
                "Updating cached resource: " + resource.url, resource);

            // if the resource not exist, create it
            if (this.getResource(resource.url) === null) {
                this.addResource(resource);
                return;
            }

            // prepare necessary variables
            let data: string = JSON.stringify(resource.data);
            let dataSize: number = data.length;
            let oldInfoSize: number = this._storageProvider.getItem(STORAGE_INFO_KEY).length;
            let resourceKey: string = STORAGE_RESOURCE_KEY_PREFIX + resource.url;
            let oldDataSize: number = this._storageProvider.getItem(resourceKey).length;

            // try to update the resource data in the storage
            try {
                this._storageProvider.setItem(STORAGE_RESOURCE_KEY_PREFIX + resource.url, data);
            } catch (e) {
                // if there is no space, clean the cache and try it once more
                // don't catch the exception, let it pass further
                this._cleanCache(Math.abs(dataSize - oldDataSize));
                // another try to update the resource
                try {
                    this._storageProvider.setItem(STORAGE_RESOURCE_KEY_PREFIX + resource.url, data);
                } catch (e) {

                    ajs.dbg.log(dbg.LogType.Error, 0, "ajs.resources", this,
                        "Not enough space in the storage", e);

                    throw new NotEnoughSpaceInStorageException();
                }
            }

            // prepare the resource info to be added to this._resources
            let resourceInfo: ICachedResource = {
                url: resource.url,
                data: null,
                cachePolicy: resource.cachePolicy,
                lastModified: resource.lastModified,
                lastUsedTimestamp: new Date()
            };

            // update info about the resource to the list of stored resources
            this._resources[this._getResourceIndex(resource.url)] = resourceInfo;

            // stringify the resources info
            let resourcesInfoStr: string = JSON.stringify(this._resources);
            let newInfoSize: number = resourcesInfoStr.length;

            // try to update info in the store
            try {
                this._storageProvider.setItem(STORAGE_INFO_KEY, resourcesInfoStr);
            } catch (e) {

                ajs.dbg.log(dbg.LogType.Error, 0, "ajs.resources", this,
                    "Not enough space in the storage for the metadata", e);

                throw new NotEnoughSpaceInStorageException();
            }

            // compute new size of the occupied space
            this._usedSpace += (newInfoSize - oldInfoSize) + (dataSize - oldDataSize);

            ajs.dbg.log(dbg.LogType.Exit, 0, "ajs.resources", this);
        }

        /**
         * Removes the resource from the storage
         * @param url Url of the resource to be removed
         */
        public removeResource(url: string): void {

            ajs.dbg.log(dbg.LogType.Enter, 0, "ajs.resources", this);

            ajs.dbg.log(dbg.LogType.Info, 0, "ajs.resources", this,
                "Removing cached resource: " + url);

            // get reource from store and return if not exists
            let resource: ICachedResource = this.getResource(url);
            if (resource === null) {
                return;
            }

            // remove data
            this._storageProvider.removeItem(STORAGE_RESOURCE_KEY_PREFIX + url);
            this._usedSpace -= resource.size;

            // remove info
            let oldInfoSize: number = this._storageProvider.getItem(STORAGE_INFO_KEY).length;
            this._resources.splice(this._resources.indexOf(resource), 1);
            let info: string = JSON.stringify(this._resources);
            let newInfoSize: number = info.length;
            this._storageProvider.setItem(STORAGE_INFO_KEY, info);

            // update used space
            this._usedSpace -= oldInfoSize - newInfoSize;

            ajs.dbg.log(dbg.LogType.Exit, 0, "ajs.resources", this);
        }

        /**
         * Loads information about resources in the storage
         */
        protected _getResourcesInfo(): ICachedResource[] {

            ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.resources", this);

            let resources: ICachedResource[] = [];
            let cachedResourcesInfoStr: string = this._storageProvider.getItem(STORAGE_INFO_KEY);

            if (cachedResourcesInfoStr !== null) {
                // get space occupied by the resources info
                this._usedSpace = cachedResourcesInfoStr.length;
                // set array of all ICachedResource in given storage
                resources = JSON.parse(cachedResourcesInfoStr, this._resourceInfoJSONReviver);

                // compute storage used space from the data of all resources
                for (let i: number = 0; i < resources.length; i++) {
                    let resourceKey: string = STORAGE_RESOURCE_KEY_PREFIX + resources[i].url;
                    let item: string = this._storageProvider.getItem(resourceKey);
                    if (item !== null) {
                        this._usedSpace += item.length;
                    }
                }

            } else {
                this._storageProvider.setItem(STORAGE_INFO_KEY, JSON.stringify([]));
            }

            ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.resources", this);

            return resources;
        }

        /**
         * Cleans the storage (removes last recently used resources until there is required space in the storage)
         * @param requiredSpace If defined the method tries to remove old resources until there is enough space
         *                      in the storage, otherwise it removes all LRU resources
         */
        protected _cleanCache(requiredSpace?: number): void {

            ajs.dbg.log(dbg.LogType.Enter, 0, "ajs.resources", this);

            ajs.dbg.log(dbg.LogType.Info, 0, "ajs.resources", this,
                "Cleaning resource cache. Required space: " + (requiredSpace === undefined ? "Complete clean" : requiredSpace) );

            // delete lru resource until there is enough space required
            if (requiredSpace !== undefined) {

                // create string of required size
                let testString: string = "";
                for (let i: number = 0; i < requiredSpace; i++) {
                    testString += " ";
                }

                // sort the storage by last recently used resource
                let orderedResources: ICachedResource[] = this._resources.slice(0).sort(
                    (a: ICachedResource, b: ICachedResource) => {
                        return a.lastUsedTimestamp < b.lastUsedTimestamp ?
                            -1 : a.lastUsedTimestamp > b.lastUsedTimestamp ?
                                1 : 0;
                    });

                // remove oldest resources from the storage until the required space is created
                let enoughSpace: boolean = true;
                let i: number = 0;

                // try to remove LRU resources from the storage until there is enough
                // space in the storage
                while (i < orderedResources.length && !enoughSpace) {
                    if (orderedResources[i].cachePolicy === CACHE_POLICY.LASTRECENTLYUSED) {
                        this.removeResource(orderedResources[i].url);
                        // using a naive method check if there is enough space in the storage
                        try {
                            enoughSpace = true;
                            this._storageProvider.setItem(STORAGE_ADDTEST_KEY, testString);
                        } catch (e) {
                            enoughSpace = false;
                        }
                        if (enoughSpace) {
                            this._storageProvider.removeItem(STORAGE_ADDTEST_KEY);
                        }
                    } else {
                        i++;
                    }
                }

                // trow exception if there is not enough space for resource in the storage
                if (!enoughSpace) {
                    ajs.dbg.log(dbg.LogType.Error, 0, "ajs.resources", this,
                        "Not enough space in the storage");
                    throw new NotEnoughSpaceInStorageException();
                }

                // clean all non-permanent resources
            } else {
                let i: number = 0;
                // remove all LRU resources
                while (i < this._resources.length) {
                    if (this._resources[i].cachePolicy === CACHE_POLICY.LASTRECENTLYUSED) {
                        this.removeResource(this._resources[i].url);
                    } else {
                        i++;
                    }
                }
            }

            ajs.dbg.log(dbg.LogType.Exit, 0, "ajs.resources", this);

        }

        /**
         * Converts JSON string to Date
         * Used for resource info data loaded from storage and parsed from JSON to object
         * @param key
         * @param value
         */
        protected _resourceInfoJSONReviver(key: string, value: any): any {
            if (key === "lastModified" || key === "lastUsedTimestamp") {
                return new Date(value);
            }

            return value;
        }

        /**
         * Returns resource index from the URL
         * If the resource is not found it returns -1
         * @param url
         */
        protected _getResourceIndex(url: string): number {

            ajs.dbg.log(dbg.LogType.Enter, 0, "ajs.resources", this);

            for (let i: number = 0; i < this._resources.length; i++) {
                if (this._resources[i].url === url) {

                    ajs.dbg.log(dbg.LogType.Exit, 0, "ajs.resources", this);

                    return i;
                }
            }

            ajs.dbg.log(dbg.LogType.Exit, 0, "ajs.resources", this);

            return -1;
        }

    }
}