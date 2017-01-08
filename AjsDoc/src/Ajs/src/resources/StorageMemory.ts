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
     * Represents larger but slow memory storage mainly for resources
     * which does not need to be stored in the session or local storages.
     * Typical use would be caching of static pages/templates loaded from
     * the server.
     * 
     * Resources should not be updated heavily because the size of the resource
     * is recalculated everythime the resource is created or updated and the
     * storage mechanisms are executed in order to cleanup storage
     *
     * updateResource method should be called after each resource data change
     * If the same referece to resource data is used to modify the data the
     * storage internally does not know the data was changed so the size of the
     * data is out of sync the caching mechanism so the storage can quickly grow
     * above the limit set.
     *
     * Resources with both types of the storage policy counts into the resultant
     * size of the storage
     */
    export class StorageMemory extends AjsStorage {

        /** Stores the maximum size of the storage in bytes */
        protected _maxSize: number;
        /** Returns the maximum size of the storage in bytes */
        public get maxSize(): number { return this._maxSize; }

        /**
         * Construct the StorageMemory object
         * @param size The maximum size of the memory storage
         */
        public constructor(size: number) {
            super();
            this._supported = true;
            this._maxSize = size;
            this._usedSpace = 0;
            this._resources = [];
        }

        /**
         * Completely cleans all resources from the storage
         */
        public clear(): void {
            this._usedSpace = 0;
            this._resources = [];
        }

        /**
         * Adds a new resource to the storage
         * @param resource Resource to be stored
         * @throws CachePolicyMustBeSetException when the caching policy was not set or was NONE
         */
        public addResource(resource: ICachedResource): void {
            if (this.getResource(resource.url) !== null) {
                this.updateResource(resource);
                return;
            }

            if (resource.cachePolicy === CACHE_POLICY.NONE) {
                throw new CachePolicyMustBeSetException();
            }
            let size: number = ajs.utils.sizeOf(resource);
            if (this._usedSpace + size > this._maxSize) {
                this._cleanCache(this._maxSize - (size));
            }

            this._usedSpace += size;
            resource.size = size;
            resource.lastUsedTimestamp = new Date();

            this._resources.push(resource);
        }

        /**
         * Returns the resource according the URL passed
         * @param url URL of the resource to be returned
         */
        public getResource(url: string): ICachedResource {
            for (let i: number = 0; i < this._resources.length; i++) {
                if (this._resources[i].url === url) {
                    this._resources[i].lastUsedTimestamp = new Date();
                    return this._resources[i];
                }
            }
            return null;
        }

        /**
         * Updates cached resource
         * @param resource Resource to be updated
         */
        public updateResource(resource: ICachedResource): void {
            let cachedResource: ICachedResource = this.getResource(resource.url);
            if (cachedResource === null) {
                this.addResource(resource);
                return;
            }

            let oldSize: number = cachedResource.size;

            let newSize: number = ajs.utils.sizeOf(cachedResource);
            if (newSize > oldSize && this._usedSpace + (newSize - oldSize) > this._maxSize) {
                this._cleanCache(newSize - oldSize);
            }
            this._usedSpace += newSize - oldSize;
            resource.size = newSize;
            resource.lastUsedTimestamp = new Date();
        }

        /**
         * Remove the resource from the storage
         * @param url Url of the resource to be removed
         */
        public removeResource(url: string): void {
            for (let i: number = 0; i < this._resources.length; i++) {
                if (this._resources[i].url === url) {
                    this._usedSpace -= this._resources[i].size;
                    this._resources.splice(i, 1);
                    break;
                }
            }
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
                // sort the storage by last recently used resource
                let orderedResources: ICachedResource[] = this._resources.slice(0).sort((a: ICachedResource, b: ICachedResource) => {
                    return a.lastUsedTimestamp < b.lastUsedTimestamp ? -1 : a.lastUsedTimestamp > b.lastUsedTimestamp ? 1 : 0;
                });
                // remove oldest resources from the storage
                let i: number = 0;
                while (i < orderedResources.length || this._usedSpace + requiredSpace > this._maxSize) {
                    if (orderedResources[i].cachePolicy === CACHE_POLICY.LASTRECENTLYUSED) {
                        this.removeResource(orderedResources[i].url);
                    } else {
                        i++;
                    }
                }
                // trow exception if there is not enough space for resource in the storage
                if (this._usedSpace + requiredSpace > this._maxSize) {
                    throw new NotEnoughSpaceInStorageException();
                }

            // clean all non-permanent resources
            } else {
                let i: number = 0;
                while (i < this._resources.length) {
                    if (this._resources[i].cachePolicy === CACHE_POLICY.LASTRECENTLYUSED) {
                        this._usedSpace -= this._resources[i].size;
                        this._resources.splice(i, 1);
                    } else {
                        i++;
                    }
                }
            }

        }

    }
}