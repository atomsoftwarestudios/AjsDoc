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

    export class AjsStorage {

        /** Resources stored in the storage */
        protected _resources: ICachedResource[];

        /** Indicates if the storage type (local, session) is supported by the browser */
        protected _supported: boolean;
        /** Returns if the storage type (local, session) is supported by the browser */
        public get supported(): boolean { return this._supported; }

        /** Stores approximate total size of all resources stored in the storage in bytes */
        protected _usedSpace: number;
        /** Returns approximate total size of all resources stored in the storage in bytes */
        public get usedSpace(): number { return this._usedSpace; }

        /** Returns type of the storage */
        public get type(): STORAGE_TYPE {
            throw new NotImplementedException();
        }

        /**
         * Completely clears the storage
         * MUST BE OVERRIDEN IN INHERITED CLASS
         */
        public clear(): void {
            throw new NotImplementedException();
        }

        /**
         * Adds a new resource to the storage
         * MUST BE OVERRIDEN IN INHERITED CLASS
         * @param resource Resource to be stored
         */
        public addResource(resource: ICachedResource): void {
            throw new NotImplementedException;
        }

        /**
         * Returns the resource according the URL passed
         * MUST BE OVERRIDEN IN INHERITED CLASS
         * @param url URL of the resource to be returned
         */
        public getResource(url: string): ICachedResource {
            throw new NotImplementedException();
        }

        /**
         * Updates cached resource
         * MUST BE OVERRIDEN IN INHERITED CLASS
         * @param resource Resource to be updated
         */
        public updateResource(resource: ICachedResource): void {
            throw new NotImplementedException();
        }

        /**
         * Remove the resource from the storage
         * MUST BE OVERRIDEN IN INHERITED CLASS
         * @param url Url of the resource to be removed
         */
        public removeResource(url: string): void {
            throw new NotImplementedException;
        }
    }
}