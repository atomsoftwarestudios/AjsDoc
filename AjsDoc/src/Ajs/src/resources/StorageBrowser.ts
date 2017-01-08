/* *************************************************************************
The MIT License (MIT)
Copyright (c)2016-2017 Atom Software Studios. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to
deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

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

    /**
     * Represents the browser local storage (persistent until explicitly cleared)
     * The total amount of the data storable to the local storage is about 5MB
     *
     * updateResource method should be called after each resource data change
     *
     * Items are stored under two keys in the storage:
     * AJSRESOURCESINFO   - JSONed ICachedResource[] where data at all items is set to null
     * AJSRESOURCES.%URL% - JSONed resource data where %URL% is URL of the data
     * AJSADDTEST         - string of spaces for testing if it is possible to add / update resource
     */
    export class StorageBrowser extends AjsStorage {

        protected _storageProvider: Storage;

        /**
         * Completely cleans all resources from the storage
         */
        public clear(): void {
            // remove all data items
            for (let i: number = 0; i < this._resources.length; i++) {
                this._storageProvider.removeItem(STORAGE_RESOURCE_KEY_PREFIX + this._resources[i].url);
            }

            // remove stored resources information
            this._usedSpace = 0;
            this._resources = [];
            this._storageProvider.setItem(STORAGE_INFO_KEY, JSON.stringify(this._resources));
        }

        /**
         * Adds a new resource to the storage
         * @param resource Resource to be stored
         * @throws NotEnoughSpaceInStorageException Thrown when there is not enough space in the storage to store the resource
         */
        public addResource(resource: ICachedResource): void {

            // if the resource exists, update it
            if (this.getResource(resource.url) !== null) {
                this.updateResource(resource);
                return;
            }

            // prepare necessary variables
            let data: string = JSON.stringify(resource.data);
            let oldInfoSize: number = this._storageProvider.getItem(STORAGE_INFO_KEY).length;
            let dataSize: number = data.length;

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
                throw new NotEnoughSpaceInStorageException();
            }

            // compute new size of the occupied space
            this._usedSpace += (newInfoSize - oldInfoSize) + dataSize;
        }

        /**
         * Returns the resource according the URL passed
         * @param url URL of the resource to be returned
         */
        public getResource(url: string): ICachedResource {
            for (let i: number = 0; i < this._resources.length; i++) {
                if (this._resources[i].url === url) {
                    // update last used timestamp
                    this._resources[i].lastUsedTimestamp = new Date();
                    let info: string = JSON.stringify(this._resources);
                    this._storageProvider.setItem(STORAGE_INFO_KEY, info);

                    // prepare data
                    let dataStr: string = this._storageProvider.getItem(STORAGE_RESOURCE_KEY_PREFIX + url);
                    let data: any = JSON.parse(dataStr);

                    // compose the ICachedResource
                    let resource: ICachedResource = {
                        url: this._resources[i].url,
                        data: data,
                        cachePolicy: this._resources[i].cachePolicy,
                        lastModified: this._resources[i].lastModified,
                        lastUsedTimestamp: this._resources[i].lastUsedTimestamp,
                        size: dataStr.length
                    };
                    return resource;
                }
            }
            return null;
        }

        /**
         * Updates cached resource
         * @param resource Resource to be updated
         * @throws NotEnoughSpaceInStorageException Thrown when there is not enough space
         *                                          in the storate to update the resource
         */
        public updateResource(resource: ICachedResource): void {
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
                throw new NotEnoughSpaceInStorageException();
            }

            // compute new size of the occupied space
            this._usedSpace += (newInfoSize - oldInfoSize) + (dataSize - oldDataSize);
        }

        /**
         * Remove the resource from the storage
         * @param url Url of the resource to be removed
         */
        public removeResource(url: string): void {
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
        }

        /**
         * Loads information about resources in the storage
         */
        protected _getResourcesInfoFromLocalStorage(): ICachedResource[] {
            let resources: ICachedResource[] = [];
            let cachedResourcesInfoStr: string = this._storageProvider.getItem(STORAGE_INFO_KEY);

            if (cachedResourcesInfoStr !== null) {
                // get space occupied by the resources info
                this._usedSpace = cachedResourcesInfoStr.length;
                // set array of all ICachedResource in given storage
                resources = JSON.parse(cachedResourcesInfoStr, this._resourceInfoJSONReviver);

                // compute storage used space from the data of all resources
                for (let i: number; i < resources.length; i++) {
                    let resourceKey: string = STORAGE_RESOURCE_KEY_PREFIX + resources[i].url;
                    let item: string = this._storageProvider.getItem(resourceKey);
                    if (item !== null) {
                        this._usedSpace += item.length;
                    }
                }

            } else {
                this._storageProvider.setItem(STORAGE_INFO_KEY, JSON.stringify([]));
            }
            return resources;
        }

        /**
         * Cleans the storage.
         * @param requiredSpace If defined the method tries to remove old
         *                      resources until there is enough space in the storage,
         *                      otherwise it removes all non-PERMANENT resources
         * @throws NotEnoughSpaceInStorageException If there is not required space in the store
         */
        protected _cleanCache(requiredSpace?: number): void {

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
                let enoughSpace: boolean;
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
            for (let i: number = 0; i < this._resources.length; i++) {
                if (this._resources[i].url === url) {
                    return i;
                }
            }
            return -1;
        }
    }
}