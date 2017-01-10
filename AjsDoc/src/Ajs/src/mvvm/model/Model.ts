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

namespace ajs.mvvm.model {

    export class Model {

        /** Hold reference to the model manager */
        protected _modelManager: ModelManager;

        /** Holds information if all initial async operations, such as data loading are done */
        protected _initialized: boolean;

        /** Holds the data ready notifier which notifies ViewModels the requested data is ready */
        protected _dataReadyNotifier: ajs.events.Notifier;

        /** Returns the data ready notifier which notifies ViewModels the requested data is ready */
        public get dataReadyNotifier(): ajs.events.Notifier { return this._dataReadyNotifier; }

        /** Constructs the model */
        public constructor(modelManager: ModelManager) {
            this._initialized = false;
            this._modelManager = modelManager;
            this._dataReadyNotifier = new ajs.events.Notifier();
            this._initialize();
        }

        /** Must be overriden in the inherited class */
        protected _initialize() {
            throw new NotImplementedException();
        }

        /**
         * This helper can be used to call specific method once the component is initialized 
         * @param exception Exception to be thrown when timeout occurs
         * @param callForward Method to be called when initialization is done
         * @param param Parameter to be passed to the method
         */
        protected _checkInitialized(exception: Error, callForward: Function): void {
            if (!this._initialized) {
                // if not initialized, wait for it up to 20 seconds (80 x 250ms)
                let timeout: number = 80;
                let w8timer = setInterval(
                    () => {
                        // if loaded, get menu and notify about it
                        if (this._initialized) {
                            clearInterval(w8timer);
                            callForward();
                            // otherwise check if we are timeouted
                        } else {
                            timeout--;
                            if (timeout <= 0) {
                                clearInterval(w8timer);
                                throw exception;
                            }
                        }
                }, 250);
            } else {
                callForward();
            }

        }

    }

}