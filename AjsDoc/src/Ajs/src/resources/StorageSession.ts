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

    /**
     * Represents the browser session storage (persistent until explicitly cleared)
     * The total amount of the data storable to the session storage is about 5MB
     *
     * updateResource method should be called after each resource data change
     *
     * Implementation is in the StorageBrowser, the storage provider is set here
     *
     * Items are stored under two keys in the storage:
     * AJSRESOURCESINFO   - JSONed ICachedResource[] where data at all items is set to null
     * AJSRESOURCES.%URL% - JSONed resource data where %URL% is URL of the data
     * AJSADDTEST         - string of spaces for testing if it is possible to add / update resource
     */
    export class StorageSession extends StorageBrowser {


        /** Returns type of the storage */
        public get type(): STORAGE_TYPE { return STORAGE_TYPE.SESSION; }

        /**
         * Construct the StorageSession object
         */
        public constructor() {
            super();
            this._supported = window.localStorage !== undefined;
            if (this._supported) {
                this._storageProvider = window.sessionStorage;
                this._usedSpace = 0;
                this._resources = this._getResourcesInfo();
            }
        }

    }
}