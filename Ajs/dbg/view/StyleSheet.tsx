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

    export class StyleSheet implements tsx.IViewComponent {

        public render(): HTMLElement {
            return (
                <style type="text/css">
                    .ajsDebug ^
                        position: absolute;
                        left: 10px;
                        top: 10px;
                        right: 10px;
                        bottom: 10px;
                        z-index: 16384;
                        background-color: white;
                        border: solid 1px black;
                        border-radius: 10px;
                        opacity: 0.95;
                        overflow: auto;
                        font-family: Arial;
                        font-size: 12px;
                        padding-top: 5px;
                    $

                    .ajsDebugToolbar ^
                        margin-left: 10px;
                        margin-right: 10px;
                        height: 25px;
                        line-height: 25px;
                        text-align: center;
                        background-color: #F0F0F0;
                        verical-align: middle;
                        box-sizing: border-box;
                        border-radius: 10px;
                        margin-top: 5px;
                    $

                    .ajsDebugToolbar input[type='button'] ^
                        height: 20px;
                        width: 50px;
                        margin-top: 2px;
                        margin-left: 3px; margin-right: 3px;
                        padding: 2px;
                        -webkit-appearance: none;
                        border: solid 1px darkgrey;
                        border-radius: 10px;
                        font-size: 12px;
                        background-color: white;
                    $

                    .ajsDebugInfo ^
                        position: absolute;
                        left: 10px;
                        right: 10px;
                        bottom: 10px;
                        height: 25px;
                        border: solid 1px silver;
                        border-radius: 10px;
                        padding: 5px;
                        box-sizing: border-box;
                        font-size: 12px;
                    $

                </style>
            );
        }
    }

}
