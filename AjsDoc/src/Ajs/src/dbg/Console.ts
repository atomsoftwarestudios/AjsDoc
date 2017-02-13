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

///<reference path="view/Body.tsx" />
///<reference path="view/StyleSheet.tsx" />

namespace ajs.dbg {
    "use strict";

    export class Console {

        // config
        protected _config: IConsoleConfig;
        public get config(): IConsoleConfig { return this._config; }

        // debugging modules
        protected _modules: IConsoleModuleCollection;
        public get modules(): IConsoleModuleCollection { return this._modules; }

        // debug interface style element
        protected _styleElements: HTMLElement[];

        // debug interface element
        protected _bodyElement: HTMLElement;

        // view components
        protected _body: view.Body;
        protected _styleSheet: view.StyleSheet;

        protected _infoElement: HTMLDivElement;

        public constructor(config: IConsoleConfig) {

            let defaultModule: string = "logger";

            this._config = config;

            // init console
            this._styleElements = [];
            this._bodyElement = null;
            this._infoElement = null;

            // register debugging modules
            this._modules = {};
            this._registerModules();

            // init view components
            this._body = new ajs.dbg.view.Body(this, this._modules[defaultModule]);
            this._styleSheet = new ajs.dbg.view.StyleSheet();
        }

        public setInfo(info: string): void {
            if (this._infoElement !== null) {
                this._infoElement.textContent = info;
            }
        }

        public refresh(): void {
            if (this._bodyElement !== null) {
                this._bodyElement.parentElement.removeChild(this._bodyElement);
                this._bodyElement = this._body.render();
                this._config.bodyRenderTarget.appendChild(this._bodyElement);
                this._infoElement = this._config.bodyRenderTarget.ownerDocument.getElementById("ajsDebugInfo") as HTMLDivElement;
                this._body.currentModule.bodyRendered();
            }
        }

        public show(): void {
            if (this._bodyElement === null) {

                this._bodyElement = this._body.render();
                this._config.bodyRenderTarget.appendChild(this._bodyElement);

                let styleElement: HTMLElement = this._styleSheet.render();
                this._config.styleRenderTarget.appendChild(styleElement);
                this._styleElements.push(styleElement);

                for (var key in this._modules) {
                    if (this._modules.hasOwnProperty(key)) {
                        styleElement = this._modules[key].renderStyleSheet();
                        this._config.styleRenderTarget.appendChild(styleElement);
                        this._styleElements.push(styleElement);
                    }
                }

                this._infoElement = this._config.bodyRenderTarget.ownerDocument.getElementById("ajsDebugInfo") as HTMLDivElement;

                this._body.currentModule.bodyRendered();
            }
        }

        public hide(): void {
            if (this._bodyElement !== null) {
                this._bodyElement.parentElement.removeChild(this._bodyElement);
                this._bodyElement = null;

                for (let i: number = 0; i < this._styleElements.length; i++) {
                    this._styleElements[i].parentElement.removeChild(this._styleElements[i]);
                }
                this._styleElements = [];
            }
        }

        public getModule(name: string): IConsoleModule {
            if (this._modules.hasOwnProperty(name)) {
                return this._modules[name];
            } else {
                throw ("Invalid console module: " + name);
            }
        }

        protected _registerModule(name: string, module: IConsoleModule): void {
            this._modules[name] = module;
        }

        protected _registerModules(): void {
            this._registerModule("logger",new ajs.dbg.modules.logger.Logger(this, this._config.loggerConfig));
        }

    }

    export let console: Console = null;

    export function init(config: IConsoleConfig): void {
        if (console === null) {
            console = new Console(config);
            if (config.showOnBootDelay > 0) {
                setTimeout(
                    () => { console.show(); },
                    config.showOnBootDelay
                );
            }
        }
    }

}
