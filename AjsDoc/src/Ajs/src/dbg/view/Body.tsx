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

///<reference path="../tsx/tsx.ts" />

namespace ajs.dbg.view {

    "use strict";

    export class Body implements tsx.IViewComponent {

        protected _console;

        protected _currentModule: IConsoleModule;
        public get currentModule(): IConsoleModule { return this._currentModule; }

        constructor(console: Console, currentModule: IConsoleModule) {
            this._console = console;
            this._currentModule = currentModule;
        }

        public onButtonClick(e: Event): void {
            if (this._currentModule !== (e.srcElement as any).ajsdata) {
                this._currentModule = (e.srcElement as any).ajsdata;
                this._console.refresh();
            }
        }

        public render(): HTMLElement {

            let buttons: any[] = [];
            let moduleToolbar: any = null;
            let moduleBody: any = null;

            for (var key in this._console.modules) {
                if (this._console.modules.hasOwnProperty(key)) {
                    buttons.push(
                        <input type="button"
                            value={this._console.modules[key].getButtonLabel()}
                            click={(e: Event) => { this.onButtonClick(e); } }
                            ajsdata={this._console.modules[key]} />
                    );
                }
            }

            buttons.push(
                <input type="button" value="Hide" click={() => { ajs.dbg.console.hide(); }} />
            );

            if (this._currentModule !== null) {
                moduleToolbar = (
                    <div class="ajsDebugToolbar">
                        {this._currentModule.renderToolbar()}
                    </div>
                );

                moduleBody = (
                    <div>
                        {this._currentModule.renderBody()}
                    </div>
                );
            }

            return (
                <div class="ajsDebug">
                    <div class="ajsDebugToolbar">
                        {buttons}
                    </div>
                    {moduleToolbar}
                    {moduleBody}
                    <div class="ajsDebugInfo" id="ajsDebugInfo">
                        Debugging console ready!
                    </div>
                </div>
            );
        }
    }

}
