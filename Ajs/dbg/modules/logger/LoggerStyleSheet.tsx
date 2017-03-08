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

    export class LoggerStyleSheet implements tsx.IViewComponent {

        protected _log: Logger;

        constructor(log: Logger) {
            this._log = log;
        }

        public render(): HTMLElement {
            return (
                <style type="text/css">
                    .ajsDebugLogHeaderContainer ^
                        position: absolute;
                        left: 10px;
                        top: 70px;
                        right: 10px;
                        overflow: hidden;
                        border: solid 1px silver;
                        -webkit-overflow-scrolling: touch;
                        box-sizing: border-box;
                        white-space: nowrap;
                    $

                    .ajsDebugLogHeader ^
                        font-size: 12px;
                        display: inline-block;
                        box-sizing: border-box;
                    $

                    .ajsDebugLogHeader tr ^
                        display: inline-block;
                        box-sizing: border-box;
                    $

                    .ajsDebugLogHeader th ^
                        width: 1px;
                        padding: 0.25em;
                        white-space: nowrap;
                        border-right: solid 1px silver;
                        border-bottom: solid 1px silver;
                        background-color: grey;
                        color: white;
                        display: inline-block;
                        box-sizing: border-box;
                        overflow: hidden;
                    $

                    .ajsDebugLogContainer ^
                        position: absolute;
                        border: solid 1px silver;
                        left: 10px;
                        top: 90px;
                        bottom: 45px;
                        right: 10px;
                        overflow: auto;
                        -webkit-overflow-scrolling: touch;
                        box-sizing: border-box;
                    $

                    .ajsDebugLogHeaderBody ^
                        width: 100%;
                        border-left: solid 1px silver;
                        border-top: solid 1px silver;
                        font-size: 12px;
                    $

                    .ajsDebugLogBody tr[ajsselected="true"] ^
                        background-color: navy;
                        color: white;
                    $

                    .ajsDebugLogBody tr[ajsmarked="true"] ^
                        background-color: darkgrey;
                        color: white;
                    $

                    .ajsDebugLogBody tr[ajsbreakpoint="true"] ^
                        color: red;
                    $

                    .ajsDebugLogBody td ^
                        padding: 0.25em;
                        white-space: nowrap;
                        border-right: solid 1px silver;
                        border-bottom: solid 1px silver
                        box-sizing: border-box;
                        font-size: 12px;
                    $

                    .ajsDebugLogEnter ^
                        background-color: #F4FFF4;
                    $

                    .ajsDebugLogExit ^
                        background-color: #FCFCFC;
                    $

                    .ajsDebugLogConstructor ^
                        background-color: #FFEDFE;
                     $

                    .ajsDebugLogInfo ^
                        background-color: transparent;
                    $

                    .ajsDebugLogWarning ^
                        background-color: #FFE7C4;
                    $

                    .ajsDebugLogError ^
                        background-color: #FF6060;
                    $

                </style>
            );
        }
    }

}