/*! ************************************************************************
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

///<reference path="../../tsx/tsx.ts" />

namespace ajs.dbg.modules.logger {

    "use strict";

    export class LoggerToolbar implements tsx.IViewComponent {

        protected _log: Logger;
        protected _element: HTMLElement;

        constructor(log: Logger) {
            this._log = log;
        }

        protected _refreshClick(e: MouseEvent): void {
            this._log.refresh();
        }

        protected _setBreakpointClick(e: MouseEvent): void {
            this._log.setBreakpoint();
        }

        protected _resetBreakpointClick(e: MouseEvent): void {
            this._log.resetBreakpoint();
        }

        protected _clearBreakpointsClick(e: MouseEvent): void {
            this._log.clearBreakpoints();
        }

        public enableBreakpoints(): void {
            this._element.ownerDocument.getElementById("asjLogToolbarSetBkp").removeAttribute("disabled");
            this._element.ownerDocument.getElementById("asjLogToolbarResetBkp").removeAttribute("disabled");
        }


        public render(): HTMLElement {

            this._element = (
                <div>
                    <input type="button" value="Refresh" click={(e: MouseEvent) => { this._refreshClick(e); } } />

                    <input type="button" value="Set Bkp" click={(e: MouseEvent) => { this._setBreakpointClick(e); } }
                        disabled="true" id="asjLogToolbarSetBkp" />

                    <input type="button" value="Res Bkp" click={(e: MouseEvent) => { this._resetBreakpointClick(e); } }
                        disabled="true" id="asjLogToolbarResetBkp" />

                    <input type="button" value="Clr Bkps" click={(e: MouseEvent) => { this._clearBreakpointsClick(e); } } />
                </div>
            );

            return this._element;
        }

    }

}