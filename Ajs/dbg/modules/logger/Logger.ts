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
///<reference path="LogBody.tsx" />
///<reference path="LoggerStyleSheet.tsx" />
///<reference path="LoggerToolbar.tsx" />

/**
 * Contains view components of the log debug module
 */
namespace ajs.dbg.modules.logger {

    "use strict";

    export interface ISameTypeCounterCollection {
        [key: string]: number;
    }

    export interface IBreakPoint {
        recordTypeId: string;
        occurence: number;
    }

    export class Logger implements dbg.IConsoleModule {

        protected _console: ajs.dbg.Console;
        protected _config: ILoggerConfig;

        protected _initTime: number;
        public get initTime(): number { return this._initTime; }

        protected _records: ILogRecord[];
        public get records(): ILogRecord[] { return this._records; }

        protected _sameTypeCounter: ISameTypeCounterCollection;

        protected _breakpoints: IBreakPoint[];

        // view components
        protected _styleSheet: LoggerStyleSheet;
        protected _toolBar: LoggerToolbar;
        protected _body: LogBody;

        protected _bodyElement: HTMLElement;

        protected _selectedItem: ILogRecord;

        constructor(console: ajs.dbg.Console, config: ILoggerConfig) {
            this._initTime = (new Date()).getTime();
            this._console = console;
            this._config = config;
            this._records = [];
            this._sameTypeCounter = {};
            this._selectedItem = null;
            this._breakpoints = [];

            this._styleSheet = new LoggerStyleSheet(this);
            this._toolBar = new LoggerToolbar(this);
            this._body = new LogBody(this);

            if (sessionStorage) {
                let bkpsJSON: string = sessionStorage.getItem("AJS_DEBUG_LOGGER_BREAKPOINTS");
                if (bkpsJSON !== null) {
                    this._breakpoints = JSON.parse(bkpsJSON);
                }
            } else {
                alert("Breakpoints not supported");
            }
        }

        public setInfo(info: string): void {
            this._console.setInfo(info);
        }

        public refresh(): void {
            this._console.hide();
            this._console.show();
        }

        public setBreakpoint(): void {
            if (this._selectedItem !== null && !this._selectedItem.breakpoint) {
                this._selectedItem.breakpoint = true;
                this._body.setBreakpoint();
                this._breakpoints.push({
                    recordTypeId: this._selectedItem.sameTypeId,
                    occurence: this._selectedItem.occurence
                });
                sessionStorage.setItem("AJS_DEBUG_LOGGER_BREAKPOINTS", JSON.stringify(this._breakpoints));
            }
        }

        public resetBreakpoint(): void {
            if (this._selectedItem !== null && this._selectedItem.breakpoint) {
                this._selectedItem.breakpoint = false;
                this._body.unsetBreakpoint();
                for (let i: number = 0; i < this._breakpoints.length; i++) {
                    if (this._breakpoints[i].recordTypeId === this._selectedItem.sameTypeId &&
                        this._breakpoints[i].occurence === this._selectedItem.occurence) {
                        this._breakpoints.splice(i, 1);
                        break;
                    }
                }
                sessionStorage.setItem("AJS_DEBUG_LOGGER_BREAKPOINTS", JSON.stringify(this._breakpoints));
            }
        }

        public clearBreakpoints(): void {
            if (sessionStorage) {
                this._breakpoints = [];
                sessionStorage.setItem("AJS_DEBUG_LOGGER_BREAKPOINTS", JSON.stringify(this._breakpoints));
                this._body.clearBreakpoints();
            }
        }

        public itemSelected(item: ILogRecord): void {
            this._selectedItem = item;
            if (sessionStorage) {
                this._toolBar.enableBreakpoints();
            }
        }

        protected _getFunctionInfo(): IFunctionInfo {
            try {

                throw new Error("Error");

            } catch (e) {
                if (e.stack) {

                    let functions: RegExpMatchArray = (e.stack as string).match(/(at ).*(\()/g);

                    if (functions === null) {

                        functions = (e.stack as string).match(/.*@/g);
                        if (functions !== null) {
                            for (let i: number = 0; i < functions.length; i++) {
                                functions[i] = functions[i].substr(0, functions[i].length - 1);
                            }

                            if (functions.length > 3) {
                                functions.shift();
                                functions.shift();
                                functions.shift();
                                if (functions.length > 1) {
                                    return { name: functions[0], caller: functions[1] };
                                } else {
                                    return { name: functions[0], caller: "Unknown" };
                                }
                            }
                        }
                    }

                    if (functions && functions.length > 3) {
                        functions.shift();
                        functions.shift();
                        functions.shift();
                        if (functions.length > 1) {
                            return {
                                name: functions[0].substring(3, functions[0].length - 2),
                                caller: functions[1].substring(3, functions[1].length - 2)
                            };
                        } else {
                            return {
                                name: functions[0].substring(3, functions[0].length - 2),
                                caller: "Unknown"
                            };
                        }
                    }
                }

            }

            return { name: "Unknown", caller: "Unknown" };

        }

        public log(type: LogType, level: number, sourceModule: string, object: any, message?: string, ...data: any[]): void {

            if (this._config.logTypes.indexOf(type) === -1 || level > this._config.maxLevel || !this._config.enabled) {
                return;
            }

            if (this._config.sourceModules.indexOf(sourceModule) === -1) {
                return;
            }

            let fnInfo: IFunctionInfo = this._getFunctionInfo();

            let logRecord: ILogRecord = {
                sameTypeId: "",
                time: new Date(),
                occurence: 0,
                type: type,
                level: level,
                module: sourceModule,
                object: object,
                function: fnInfo.name,
                caller: fnInfo.caller,
                message: message || "",
                data: data instanceof Array ? data.length : 0,
                breakpoint: false
            };

            if (this._config.logDataToConsole) {

                let msg: string = message ? message : "";
                if (data[0]) {
                    window.console.log(this._records.length + ": " + LogType[type] + " " + msg + "[ " + logRecord.module + "." + logRecord.object +
                        "." + logRecord.function + " ]", data[0]);
                } else {
                    window.console.log(this._records.length + ": " + msg + "[ " + logRecord.module + "." + logRecord.object +
                        "." + logRecord.function + " ]");
                }

            }

            let sameTypeId: string = LogType[logRecord.type] + " " + level + " " +
                logRecord.module + " " + logRecord.object + " " + logRecord.function;

            sameTypeId = sameTypeId.replace(/\./g, "_");
            sameTypeId = sameTypeId.replace(/ /g, "_");
            sameTypeId = sameTypeId.replace(/\{/g, "");
            sameTypeId = sameTypeId.replace(/\}/g, "");
            sameTypeId = sameTypeId.replace(/\(/g, "");
            sameTypeId = sameTypeId.replace(/\)/g, "");
            sameTypeId = sameTypeId.replace(/\[/g, "");
            sameTypeId = sameTypeId.replace(/\]/g, "");
            sameTypeId = sameTypeId.replace(/\n/g, "");
            logRecord.sameTypeId = sameTypeId;
            if (this._sameTypeCounter.hasOwnProperty(sameTypeId)) {
                this._sameTypeCounter[sameTypeId]++;
                logRecord.occurence = this._sameTypeCounter[sameTypeId];
            } else {
                this._sameTypeCounter[sameTypeId] = 1;
                logRecord.occurence = 1;
            }
            logRecord.breakpoint = this._checkBreakPoint(sameTypeId, logRecord.occurence);

            this._records.push(logRecord);

            if (logRecord.breakpoint) {
                /* tslint:disable */
                debugger;
                /* tslint:enable */
            }
        }

        protected _checkBreakPoint(typeId: string, occurence: number): boolean {
            for (let i: number = 0; i < this._breakpoints.length; i++) {
                if (this._breakpoints[i].recordTypeId === typeId && this._breakpoints[i].occurence === occurence) {
                    return true;
                }
            }
            return false;
        }

        public getButtonLabel(): string {
            return "Log";
        }

        public renderStyleSheet(): any {
            return this._styleSheet.render();
        }

        public renderToolbar(): any {
            return this._toolBar.render();
        }

        public renderBody(): any {
            this._bodyElement = this._body.render();
            return this._body.render();
        }

        public bodyRendered(): void {
            this._body.rendered(this._bodyElement.ownerDocument);
        }

    }

}