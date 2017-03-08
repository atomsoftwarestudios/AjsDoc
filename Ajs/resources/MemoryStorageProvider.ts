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
     * In-memory implementation of the Key/Value storage for the resource manager support
     * <p>
     * Unfortunately it is not possible to be implemented full as the Storage interface
     * as target is ES5 and its not possible to capture writes/read to indexed variables (arrays)
     * </p>
     */
    export class MemoryStorageProvider implements IStorageProvider {

        /** Stores numer of items in the storage */
        protected _length: number;
        /** Returns numer of items in the storage */
        public get length(): number { return this._length; }

        /** Key/value storage */
        protected _store: Object;

        /** Constructs the memory implementation of the key/value storage */
        constructor() {

            ajs.dbg.log(ajs.dbg.LogType.Constructor, 0, "ajs.resources", this);

            this.clear();

            ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.resources", this);
        }

        /** Clears the storage */
        public clear(): void {

            ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.resources", this);

            ajs.dbg.log(ajs.dbg.LogType.Info, 3, "ajs.resources", this, "Clearing storage");

            this._store = {};
            this._length = 0;

            ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.resources", this);
        }

        /**
         * Sets the specified string data under specified key
         * @param key Key to be used to store the data
         * @param data Data to be stored
         */
        public setItem(key: string, data: string): void {

            ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.resources", this);
            ajs.dbg.log(ajs.dbg.LogType.Info, 3, "ajs.resources", this, "Setting storage item: " + key, data);

            if (!this._store.hasOwnProperty(key)) {
                this._length++;
            }
            this._store[key] = data;

            ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.resources", this);
        }

        /**
         * Returns the string data for specified key or null if the key does not exist
         * @param key The key which data should be returned
         */
        public getItem(key: string): string {

            ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.resources", this);
            ajs.dbg.log(ajs.dbg.LogType.Info, 3, "ajs.resources", this, "Getting storage item: " + key);

            if (this._store.hasOwnProperty(key)) {
                ajs.dbg.log(ajs.dbg.LogType.Info, 3, "ajs.resources", this, "Item found", this._store[key]);
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.resources", this);
                return this._store[key];
            } else {
                ajs.dbg.log(ajs.dbg.LogType.Info, 3, "ajs.resources", this, "Key not found");
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.resources", this);
                return null;
            }
        }

        /**
         * Returns key of the specified index or null if the key does not exist
         * @param index Index of the key to be returned
         */
        public key(index: number): string {

            ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.resources", this);
            ajs.dbg.log(ajs.dbg.LogType.Info, 3, "ajs.resources", this, "Geting storage key by index: " + index);

            let i: number = 0;
            for (var key in this._store) {
                if (this._store.hasOwnProperty(key)) {
                    if (i === index) {
                        ajs.dbg.log(ajs.dbg.LogType.Info, 3, "ajs.resources", this, "Key found: " + key);
                        ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.resources", this);
                        return key;
                    }
                    i++;
                }
            }

            ajs.dbg.log(ajs.dbg.LogType.Info, 3, "ajs.resources", this, "Key not found");
            ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.resources", this);
            return null;
        }

        /**
         * Removes the item from the key/value store
         * @param key Key of the item to be removed
         */
        public removeItem(key: string): void {

            ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.resources", this);

            if (this._store.hasOwnProperty(key)) {
                ajs.dbg.log(ajs.dbg.LogType.Info, 3, "ajs.resources", this, "Removing storage key: " + key);
                delete this._store[key];
                this._length--;
            }

            ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.resources", this);
        }


    }
}