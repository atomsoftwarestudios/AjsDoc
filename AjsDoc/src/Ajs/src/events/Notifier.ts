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

namespace ajs.events {

    "use strict";

    export class Notifier {

        protected _listeners: IListener[];

        public constructor(...listeners: IListener[]) {
            this._listeners = [];
            for (let i: number = 0; i < listeners.length; i++) {
                this._listeners.push(listeners[i]);
            }
        }

        public subscribe(listener: IListener): void {
            if (this._listeners.indexOf(listener) === -1) {
                this._listeners.push(listener);
            }
        }

        public unsubscribe(listener: IListener): void {
            if (this._listeners.indexOf(listener) !== -1) {
                this._listeners.splice(this._listeners.indexOf(listener));
            }
        }

        public notify(sender: any, data?: any): void {
            for (let i: number = 0; i < this._listeners.length; i++) {
                let result: boolean = this._listeners[i](sender, data);
                if (!result) {
                    return;
                }
            }
        }

    }

}