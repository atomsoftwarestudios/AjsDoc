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
     * Represents the browser session storage (persistent until window is closed)
     */
    export class StorageSession extends StorageBrowser {


        /** Returns type of the storage */
        public get type(): STORAGE_TYPE { return STORAGE_TYPE.SESSION; }

        /** Constructs the StorageSession object */
        public constructor() {

            super();

            ajs.debug.log(debug.LogType.Constructor, 0, "ajs.resources", this);

            this._supported = window.localStorage !== undefined;
            if (this._supported) {
                this._storageProvider = window.sessionStorage;
                this._usedSpace = 0;
                this._resources = this._getResourcesInfo();
            }

            ajs.debug.log(debug.LogType.Exit, 0, "ajs.resources", this);
        }

    }
}