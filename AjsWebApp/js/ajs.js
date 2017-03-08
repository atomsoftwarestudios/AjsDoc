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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var ajs;
(function (ajs) {
    "use strict";
    /** Thrown when the start is called before the application is configured */
    var ApplicationNotConfiguredException = (function (_super) {
        __extends(ApplicationNotConfiguredException, _super);
        function ApplicationNotConfiguredException() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return ApplicationNotConfiguredException;
    }(Error));
    ajs.ApplicationNotConfiguredException = ApplicationNotConfiguredException;
    /** Thrown the passed application constructor is not a function */
    var AppConstructorMustBeAFunctionException = (function (_super) {
        __extends(AppConstructorMustBeAFunctionException, _super);
        function AppConstructorMustBeAFunctionException() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return AppConstructorMustBeAFunctionException;
    }(Error));
    ajs.AppConstructorMustBeAFunctionException = AppConstructorMustBeAFunctionException;
})(ajs || (ajs = {}));
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
/**
 * The main AJS namespace
 * Contains the static Framework class, Framework exceptions and Ajs
 * configuration template
 */
var ajs;
(function (ajs) {
    "use strict";
    /**
     * Ajs framework class provides the complete framework functionality.
     * Initialization is called automatically from the ajs boot when the
     * window.onload event is fired. The framework, based on the boot configuration
     * file, initializes the user application class inherited from the ajs.app.Application
     * and starts it.
     */
    var Framework = (function () {
        function Framework() {
        }
        Object.defineProperty(Framework, "lastError", {
            /** Returns the last error caused by the framework component
             *  TODO: Think about the global / application error handler
             */
            get: function () { return Framework._lastError; },
            /**
             * Should be used internally by framework components only to set the error value
             * TODO: Think about the global / application error handler
             * TODO: Error handling should be done just by triggering and catching exceptions
             */
            set: function (value) { Framework._lastError = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Framework, "config", {
            /** Returns the framework configuration object */
            get: function () { return Framework._config; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Framework, "appConfig", {
            /** Returns the application configuration */
            get: function () { return Framework._appConfig; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Framework, "application", {
            /** Returns the application object */
            get: function () { return Framework._application; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Framework, "resourceManager", {
            /** Returns the ResourceManager object */
            get: function () { return Framework._resourceManager; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Framework, "stateManager", {
            /** Returns the StateManager object */
            get: function () { return Framework._stateManager; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Framework, "router", {
            /** Returns the ResourceManager object */
            get: function () { return Framework._router; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Framework, "navigator", {
            /** Returns the Navigator object */
            get: function () { return Framework._navigator; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Framework, "viewComponentManager", {
            /** Returns the ViewComponentManager object */
            get: function () { return Framework._viewComponentManager; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(Framework, "templateManager", {
            /** Returns the TemplateManager object */
            get: function () { return Framework._templateManager; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Framework, "modelManager", {
            /** Returns the ModuleManager object */
            get: function () { return Framework._modelManager; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Framework, "view", {
            /** Returns the View object */
            get: function () { return Framework._view; },
            enumerable: true,
            configurable: true
        });
        /** Basic framework initialization is called automatically from the boot when window.onload event occurs */
        Framework.initialize = function (config) {
            ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs", this);
            ajs.dbg.log(ajs.dbg.LogType.Warning, 0, "ajs", this, "IMPLEMENT: Framework.initialize - global error handler");
            window.onerror = Framework._errorHandler;
            // store config locally
            Framework._config = config;
            // basic initialization
            Framework._appConfig = null;
            Framework._application = null;
            // create framework components
            Framework._resourceManager = new ajs.resources.ResourceManager(config.resourceManager);
            Framework._stateManager = new ajs.state.StateManager(Framework._resourceManager);
            Framework._templateManager = new ajs.templating.TemplateManager(Framework._resourceManager);
            Framework._viewComponentManager = new ajs.mvvm.viewmodel.ViewComponentManager(Framework._templateManager);
            Framework._modelManager = new ajs.mvvm.model.ModelManager();
            Framework._view = new ajs.mvvm.view.View(Framework._viewComponentManager, config.view);
            Framework._router = new ajs.routing.Router(Framework._view, Framework._config.router);
            Framework._navigator = new ajs.navigation.Navigator(Framework._router, Framework._config.navigator);
            ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs", this);
        };
        /**
         * Configure the ajs application before it is instanced
         * Called automatically from boot when window.onload event occurs
         * @param config Application configuration file
         */
        Framework.configureApplication = function (config) {
            ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs", this);
            ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs", this, "Configuring application");
            Framework._appConfig = config;
            ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs", this);
        };
        /**
         * Instantiate and initialize the user application and start it.
         * Called automatically from boot when window.onload event occurs
         * @throws ApplicationNotConfiguredException Thrown when the start is called before the application is configured
         * @throws AppConstructorMustBeAFunctionException Thrown when the passed application constructor is not a function
         */
        Framework.start = function () {
            ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs", this);
            ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs", this, "Frameowrk is starting the application");
            if (Framework._appConfig === undefined || Framework._appConfig === null) {
                ajs.dbg.log(ajs.dbg.LogType.Error, 0, "ajs", this, "Application not configured");
                throw new ajs.ApplicationNotConfiguredException();
            }
            if (typeof (Framework._appConfig.appConstructor) === typeof (Function)) {
                Framework._application = new Framework._appConfig.appConstructor(Framework._appConfig.userConfig);
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs", this, "Initializing the application");
                Framework._application.initialize();
            }
            else {
                ajs.dbg.log(ajs.dbg.LogType.Error, 0, "ajs", this, "Application constructor is not a function!");
                throw new ajs.AppConstructorMustBeAFunctionException();
            }
            ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs", this);
        };
        /**
         * TODO: Think about the global / application error handler
         * @param msg
         * @param url
         * @param line
         * @param col
         * @param error
         */
        Framework._errorHandler = function (msg, url, line, col, error) {
            var text = "";
            var err = "";
            if (msg instanceof Error) {
                text = ajs.utils.getClassName(error) + ": " + msg.message;
                err = "<br />name: " + error.name +
                    "<br />message: " + error.message +
                    "<br />stacktrace:<br /> " + error.stack.replace(new RegExp("\n", "gm"), "<br />");
            }
            else {
                text = msg;
            }
            document.write("Exception: " +
                "<br />Message: (" + text + ")<br /> At: " + url +
                "<br />line " + line + " column " + col + err);
        };
        return Framework;
    }());
    ajs.Framework = Framework;
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    "use strict";
})(ajs || (ajs = {}));
/* *************************************************************************
The MIT License (MIT)

Copyright(c) 2014

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and / or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

Source: https://github.com/beatgammit/base64-js
**************************************************************************** */
var ajs;
(function (ajs) {
    var utils;
    (function (utils) {
        "use strict";
        var Base64 = (function () {
            function Base64() {
            }
            Base64.initialize = function () {
                for (var i = 0, len = Base64.code.length; i < len; ++i) {
                    Base64.lookup[i] = Base64.code[i];
                    Base64.revLookup[Base64.code.charCodeAt(i)] = i;
                }
                Base64.revLookup['-'.charCodeAt(0)] = 62;
                Base64.revLookup['_'.charCodeAt(0)] = 63;
            };
            Base64.placeHoldersCount = function (b64) {
                var len = b64.length;
                if (len % 4 > 0) {
                    throw new Error('Invalid string. Length must be a multiple of 4');
                }
                // the number of equal signs (place holders)
                // if there are two placeholders, than the two characters before it
                // represent one byte
                // if there is only one, then the three characters before it represent 2 bytes
                // this is just a cheap hack to not do indexOf twice
                return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0;
            };
            Base64.byteLength = function (b64) {
                // base64 is 4/3 + up to two characters of the original data
                return b64.length * 3 / 4 - Base64.placeHoldersCount(b64);
            };
            Base64.toByteArray = function (b64) {
                var i, j, l, tmp, placeHolders, arr;
                var len = b64.length;
                placeHolders = Base64.placeHoldersCount(b64);
                arr = new Base64.Arr(len * 3 / 4 - placeHolders);
                // if there are placeholders, only get up to the last complete 4 chars
                l = placeHolders > 0 ? len - 4 : len;
                var L = 0;
                for (i = 0, j = 0; i < l; i += 4, j += 3) {
                    tmp = (Base64.revLookup[b64.charCodeAt(i)] << 18) | (Base64.revLookup[b64.charCodeAt(i + 1)] << 12) | (Base64.revLookup[b64.charCodeAt(i + 2)] << 6) | Base64.revLookup[b64.charCodeAt(i + 3)];
                    arr[L++] = (tmp >> 16) & 0xFF;
                    arr[L++] = (tmp >> 8) & 0xFF;
                    arr[L++] = tmp & 0xFF;
                }
                if (placeHolders === 2) {
                    tmp = (Base64.revLookup[b64.charCodeAt(i)] << 2) | (Base64.revLookup[b64.charCodeAt(i + 1)] >> 4);
                    arr[L++] = tmp & 0xFF;
                }
                else if (placeHolders === 1) {
                    tmp = (Base64.revLookup[b64.charCodeAt(i)] << 10) | (Base64.revLookup[b64.charCodeAt(i + 1)] << 4) | (Base64.revLookup[b64.charCodeAt(i + 2)] >> 2);
                    arr[L++] = (tmp >> 8) & 0xFF;
                    arr[L++] = tmp & 0xFF;
                }
                return arr;
            };
            Base64.tripletToBase64 = function (num) {
                return Base64.lookup[num >> 18 & 0x3F] + Base64.lookup[num >> 12 & 0x3F] + Base64.lookup[num >> 6 & 0x3F] + Base64.lookup[num & 0x3F];
            };
            Base64.encodeChunk = function (uint8, start, end) {
                var tmp;
                var output = [];
                for (var i = start; i < end; i += 3) {
                    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
                    output.push(Base64.tripletToBase64(tmp));
                }
                return output.join('');
            };
            Base64.fromByteArray = function (uint8) {
                var tmp;
                var len = uint8.length;
                var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
                var output = '';
                var parts = [];
                var maxChunkLength = 16383; // must be multiple of 3
                // go through the array every three bytes, we'll deal with trailing stuff later
                for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
                    parts.push(Base64.encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)));
                }
                // pad the end with zeros, but make sure to not forget the extra bytes
                if (extraBytes === 1) {
                    tmp = uint8[len - 1];
                    output += Base64.lookup[tmp >> 2];
                    output += Base64.lookup[(tmp << 4) & 0x3F];
                    output += '==';
                }
                else if (extraBytes === 2) {
                    tmp = (uint8[len - 2] << 8) + (uint8[len - 1]);
                    output += Base64.lookup[tmp >> 10];
                    output += Base64.lookup[(tmp >> 4) & 0x3F];
                    output += Base64.lookup[(tmp << 2) & 0x3F];
                    output += '=';
                }
                parts.push(output);
                return parts.join('');
            };
            return Base64;
        }());
        Base64.lookup = [];
        Base64.revLookup = [];
        Base64.Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
        Base64.code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        utils.Base64 = Base64;
        Base64.initialize();
    })(utils = ajs.utils || (ajs.utils = {}));
})(ajs || (ajs = {}));
/* *************************************************************************
The MIT License (MIT)

Copyright (c) 2012 Nicholas Fisher

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

Source: https://github.com/KyleAMathews/deepmerge
**************************************************************************** */
var ajs;
(function (ajs) {
    var utils;
    (function (utils) {
        "use strict";
        var DeepMerge = (function () {
            function DeepMerge() {
            }
            DeepMerge.isMergeableObject = function (val) {
                var nonNullObject = val && typeof val === "object";
                return nonNullObject
                    && Object.prototype.toString.call(val) !== "[object RegExp]"
                    && Object.prototype.toString.call(val) !== "[object Date]";
            };
            DeepMerge.emptyTarget = function (val) {
                return Array.isArray(val) ? [] : {};
            };
            DeepMerge.cloneIfNecessary = function (value, optionsArgument) {
                var clone = optionsArgument && optionsArgument.clone === true;
                return (clone && DeepMerge.isMergeableObject(value)) ?
                    DeepMerge.merge(DeepMerge.emptyTarget(value), value, optionsArgument) : value;
            };
            DeepMerge.defaultArrayMerge = function (target, source, optionsArgument) {
                var destination = target.slice();
                source.forEach(function (e, i) {
                    if (typeof destination[i] === "undefined") {
                        destination[i] = DeepMerge.cloneIfNecessary(e, optionsArgument);
                    }
                    else if (DeepMerge.isMergeableObject(e)) {
                        destination[i] = DeepMerge.merge(target[i], e, optionsArgument);
                    }
                    else if (target.indexOf(e) === -1) {
                        destination.push(DeepMerge.cloneIfNecessary(e, optionsArgument));
                    }
                });
                return destination;
            };
            DeepMerge.mergeObject = function (target, source, optionsArgument) {
                var destination = {};
                if (DeepMerge.isMergeableObject(target)) {
                    Object.keys(target).forEach(function (key) {
                        destination[key] = DeepMerge.cloneIfNecessary(target[key], optionsArgument);
                    });
                }
                Object.keys(source).forEach(function (key) {
                    if (!DeepMerge.isMergeableObject(source[key]) || !target[key]) {
                        destination[key] = DeepMerge.cloneIfNecessary(source[key], optionsArgument);
                    }
                    else {
                        destination[key] = DeepMerge.merge(target[key], source[key], optionsArgument);
                    }
                });
                return destination;
            };
            DeepMerge.merge = function (target, source, optionsArgument) {
                var array = Array.isArray(source);
                var options = optionsArgument || { arrayMerge: DeepMerge.defaultArrayMerge };
                var arrayMerge = options.arrayMerge || DeepMerge.defaultArrayMerge;
                if (array) {
                    return Array.isArray(target) ?
                        arrayMerge(target, source, optionsArgument) : DeepMerge.cloneIfNecessary(source, optionsArgument);
                }
                else {
                    return DeepMerge.mergeObject(target, source, optionsArgument);
                }
            };
            return DeepMerge;
        }());
        utils.DeepMerge = DeepMerge;
    })(utils = ajs.utils || (ajs.utils = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var utils;
    (function (utils) {
        "use strict";
        utils.HTMLTags = [
            "A",
            "ABBR",
            "ACRONYM",
            "ADDRESS",
            "APPLET",
            "AREA",
            "ARTICLE",
            "ASIDE",
            "AUDIO",
            "B",
            "BASE",
            "BASEFONT",
            "BDI",
            "BDO",
            "BIG",
            "BLOCKQUOTE",
            "BODY",
            "BR",
            "BUTTON",
            "CANVAS",
            "CAPTION",
            "CENTER",
            "CITE",
            "CODE",
            "COL",
            "COLGROUP",
            "DATALIST",
            "DD",
            "DEL",
            "DETAILS",
            "DFN",
            "DIALOG",
            "DIR",
            "DIV",
            "DL",
            "DT",
            "EM",
            "EMBED",
            "FIELDSET",
            "FIGCAPTION",
            "FIGURE",
            "FONT",
            "FOOTER",
            "FORM",
            "FRAME",
            "FRAMESET",
            "H1",
            "H2",
            "H3",
            "H4",
            "H5",
            "H6",
            "HEAD",
            "HEADER",
            "HR",
            "HTML",
            "I",
            "IFRAME",
            "IMG",
            "INPUT",
            "INS",
            "KBD",
            "KEYGEN",
            "LABEL",
            "LEGEND",
            "LI",
            "LINK",
            "MAIN",
            "MAP",
            "MARK",
            "MENU",
            "MENUITEM",
            "META",
            "METER",
            "NAV",
            "NOFRAMES",
            "NOSCRIPT",
            "OBJECT",
            "OL",
            "OPTGROUP",
            "OPTION",
            "OUTPUT",
            "P",
            "PARAM",
            "PRE",
            "PROGRESS",
            "Q",
            "RP",
            "RT",
            "RUBY",
            "S",
            "SAMP",
            "SCRIPT",
            "SECTION",
            "SELECT",
            "SMALL",
            "SOURCE",
            "SPAN",
            "STRIKE",
            "STRONG",
            "STYLE",
            "SUB",
            "SUMMARY",
            "SUP",
            "TABLE",
            "TBODY",
            "TD",
            "TEXTAREA",
            "TFOOT",
            "TH",
            "THEAD",
            "TIME",
            "TITLE",
            "TR",
            "TRACK",
            "TT",
            "U",
            "UL",
            "VAR",
            "VIDEO",
            "WBR"
        ];
    })(utils = ajs.utils || (ajs.utils = {}));
})(ajs || (ajs = {}));
/* *************************************************************************
$Id: Iuppiter.js 3026 2010-06-23 10:03:13Z Bear $

Copyright (c) 2010 Nuwa Information Co., Ltd, and individual contributors.
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

  1. Redistributions of source code must retain the above copyright notice,
     this list of conditions and the following disclaimer.

  2. Redistributions in binary form must reproduce the above copyright
     notice, this list of conditions and the following disclaimer in the
     documentation and/or other materials provided with the distribution.

  3. Neither the name of Nuwa Information nor the names of its contributors
     may be used to endorse or promote products derived from this software
     without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

$Author: Bear $
$Date: 2010-06-23 18:03:13 +0800 (星期三, 23 六月 2010) $
$Revision: 3026 $

Source: https://github.com/vitorio/jslzjb/blob/master/Iuppiter.js
**************************************************************************** */
var ajs;
(function (ajs) {
    var utils;
    (function (utils) {
        "use strict";
        var LZJB = (function () {
            function LZJB() {
            }
            LZJB.init = function () {
                this.MATCH_MAX = ((1 << this.MATCH_BITS) + (this.MATCH_MIN - 1));
                this.OFFSET_MASK = ((1 << (16 - this.MATCH_BITS)) - 1);
            };
            /**
             * Convert string value to a byte array.
             *
             * @param {String} input The input string value.
             * @return {Array} A byte array from string value.
             */
            LZJB.toByteArray = function (input) {
                var b = [], i, unicode;
                for (i = 0; i < input.length; i++) {
                    unicode = input.charCodeAt(i);
                    // 0x00000000 - 0x0000007f -> 0xxxxxxx
                    if (unicode <= 0x7f) {
                        b.push(unicode);
                        // 0x00000080 - 0x000007ff -> 110xxxxx 10xxxxxx
                    }
                    else if (unicode <= 0x7ff) {
                        b.push((unicode >> 6) | 0xc0);
                        b.push((unicode & 0x3F) | 0x80);
                        // 0x00000800 - 0x0000ffff -> 1110xxxx 10xxxxxx 10xxxxxx
                    }
                    else if (unicode <= 0xffff) {
                        b.push((unicode >> 12) | 0xe0);
                        b.push(((unicode >> 6) & 0x3f) | 0x80);
                        b.push((unicode & 0x3f) | 0x80);
                        // 0x00010000 - 0x001fffff -> 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
                    }
                    else {
                        b.push((unicode >> 18) | 0xf0);
                        b.push(((unicode >> 12) & 0x3f) | 0x80);
                        b.push(((unicode >> 6) & 0x3f) | 0x80);
                        b.push((unicode & 0x3f) | 0x80);
                    }
                }
                return b;
            };
            /**
             * Compress string or byte array using fast and efficient algorithm.
             *
             * Because of weak of javascript's natural, many compression algorithm
             * become useless in javascript implementation. The main problem is
             * performance, even the simple Huffman, LZ77/78 algorithm will take many
             * many time to operate. We use LZJB algorithm to do that, it suprisingly
             * fulfills our requirement to compress string fastly and efficiently.
             *
             * Our implementation is based on
             * http://src.opensolaris.org/source/raw/onnv/onnv-gate/
             * usr/src/uts/common/os/compress.c
             * It is licensed under CDDL.
             *
             * Please note it depends on toByteArray utility function.
             *
             * @param {String|Array} input The string or byte array that you want to
             *                             compress.
             * @return {Array} Compressed byte array.
             */
            LZJB.compress = function (input) {
                var sstart, dstart = [], slen, src = 0, dst = 0, cpy, copymap, copymask = 1 << (this.NBBY - 1), mlen, offset, hp, lempel = new Array(this.LEMPEL_SIZE), i, bytes;
                this.init();
                // initialize lempel array.
                for (i = 0; i < this.LEMPEL_SIZE; i++)
                    lempel[i] = 3435973836;
                // using byte array or not.
                if (input.constructor === Array) {
                    sstart = input;
                    bytes = true;
                }
                else {
                    sstart = this.toByteArray(input);
                    bytes = false;
                }
                slen = sstart.length;
                while (src < slen) {
                    if ((copymask <<= 1) === (1 << this.NBBY)) {
                        if (dst >= slen - 1 - 2 * this.NBBY) {
                            mlen = slen;
                            for (src = 0, dst = 0; mlen; mlen--)
                                dstart[dst++] = sstart[src++];
                            return dstart;
                        }
                        copymask = 1;
                        copymap = dst;
                        dstart[dst++] = 0;
                    }
                    if (src > slen - this.MATCH_MAX) {
                        dstart[dst++] = sstart[src++];
                        continue;
                    }
                    hp = ((sstart[src] + 13) ^
                        (sstart[src + 1] - 13) ^
                        sstart[src + 2]) &
                        (this.LEMPEL_SIZE - 1);
                    offset = (src - lempel[hp]) & this.OFFSET_MASK;
                    lempel[hp] = src;
                    cpy = src - offset;
                    if (cpy >= 0 && cpy !== src &&
                        sstart[src] === sstart[cpy] &&
                        sstart[src + 1] === sstart[cpy + 1] &&
                        sstart[src + 2] === sstart[cpy + 2]) {
                        dstart[copymap] |= copymask;
                        for (mlen = this.MATCH_MIN; mlen < this.MATCH_MAX; mlen++)
                            if (sstart[src + mlen] !== sstart[cpy + mlen]) {
                                break;
                            }
                        dstart[dst++] = ((mlen - this.MATCH_MIN) << (this.NBBY - this.MATCH_BITS)) |
                            (offset >> this.NBBY);
                        dstart[dst++] = offset;
                        src += mlen;
                    }
                    else {
                        dstart[dst++] = sstart[src++];
                    }
                }
                return dstart;
            };
            ;
            return LZJB;
        }());
        LZJB.NBBY = 8;
        LZJB.MATCH_BITS = 6;
        LZJB.MATCH_MIN = 3;
        LZJB.MATCH_MAX = 0;
        LZJB.OFFSET_MASK = 0;
        LZJB.LEMPEL_SIZE = 256;
        /**
         * Decompress string or byte array using fast and efficient algorithm.
         *
         * Our implementation is based on
         * http://src.opensolaris.org/source/raw/onnv/onnv-gate/
         * usr/src/uts/common/os/compress.c
         * It is licensed under CDDL.
         *
         * Please note it depends on toByteArray utility function.
         *
         * @param {String|Array} input The string or byte array that you want to
         *                             compress.
         * @param {Boolean} _bytes Returns byte array if true otherwise string.
         * @return {String|Array} Decompressed string or byte array.
         */
        LZJB.decompress = function (input, _bytes) {
            var sstart, dstart = [], slen, src = 0, dst = 0, cpy, copymap, copymask = 1 << (this.NBBY - 1), mlen, offset, i, bytes, get;
            this.init();
            // using byte array or not.
            if (input.constructor === Array) {
                sstart = input;
                bytes = true;
            }
            else {
                sstart = this.toByteArray(input);
                bytes = false;
            }
            // default output string result.
            if (typeof (_bytes) === undefined) {
                bytes = false;
            }
            else {
                bytes = _bytes;
            }
            slen = sstart.length;
            get = function () {
                if (bytes) {
                    return dstart;
                }
                else {
                    // decompressed string.
                    for (i = 0; i < dst; i++)
                        dstart[i] = String.fromCharCode(dstart[i]);
                    return dstart.join("");
                }
            };
            while (src < slen) {
                if ((copymask <<= 1) === (1 << this.NBBY)) {
                    copymask = 1;
                    copymap = sstart[src++];
                }
                if (copymap & copymask) {
                    mlen = (sstart[src] >> (this.NBBY - this.MATCH_BITS)) + this.MATCH_MIN;
                    offset = ((sstart[src] << this.NBBY) | sstart[src + 1]) & this.OFFSET_MASK;
                    src += 2;
                    if ((cpy = dst - offset) >= 0) {
                        while (--mlen >= 0) {
                            dstart[dst++] = dstart[cpy++];
                        }
                    }
                    else {
                        /*
                         * offset before start of destination buffer
                         * indicates corrupt source data
                         */
                        return get();
                    }
                }
                else {
                    dstart[dst++] = sstart[src++];
                }
            }
            return get();
        };
    })(utils = ajs.utils || (ajs.utils = {}));
})(ajs || (ajs = {}));
;
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

Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
**************************************************************************** */
var ajs;
(function (ajs) {
    var utils;
    (function (utils) {
        "use strict";
        var Obj = (function () {
            function Obj() {
            }
            Obj.assign = function (target, varArgs) {
                if (target == null) {
                    throw new TypeError();
                }
                var to = Object(target);
                for (var i = 1; i < arguments.length; i++) {
                    var nextSource = arguments[i];
                    if (nextSource != null) {
                        for (var nextKey in nextSource) {
                            // avoid bugs when hasOwnProperty is shadowed
                            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                                to[nextKey] = nextSource[nextKey];
                            }
                        }
                    }
                }
                return to;
            };
            return Obj;
        }());
        utils.Obj = Obj;
    })(utils = ajs.utils || (ajs.utils = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var utils;
    (function (utils) {
        "use strict";
        /**
         * Helper to determine if variable is defined
         * @param object Object to be checked
         */
        function defined(object) {
            return object !== undefined;
        }
        utils.defined = defined;
        /**
         * Helper to determine if the variable is null
         * @param object Object to be checked
         */
        function isNull(object) {
            return object === null;
        }
        utils.isNull = isNull;
        /**
         * Helper to determine if the variable defined and not null
         * @param object Object to be checked
         */
        function definedAndNotNull(object) {
            return object !== undefined && object !== null;
        }
        utils.definedAndNotNull = definedAndNotNull;
        /**
         * Returns name of the constructor of the object
         * @param obj Object to be checked
         */
        function getClassName(obj) {
            if (obj && obj.constructor && obj.constructor.toString) {
                var arr = obj.constructor.toString().match(/function\s*(\w+)/);
                if (arr && arr.length === 2) {
                    return arr[1];
                }
            }
            return undefined;
        }
        utils.getClassName = getClassName;
        /**
         * Returns name of the function
         * @param fn Function which name has to be returned
         */
        function getFunctionName(fn) {
            if (fn instanceof Function) {
                var name_1 = /^function\s+([\w\$]+)\s*\(/.exec(fn.toString());
                if (name_1 && name_1.length === 2) {
                    return name_1[1];
                }
            }
            return undefined;
        }
        utils.getFunctionName = getFunctionName;
        /**
         * Returns the minimum usefull date (Thu Jan 01 1970 01:00:00 GMT+0100)
         */
        function minDate() {
            return new Date(0);
        }
        utils.minDate = minDate;
        /**
         * Returns the maximum date (Sat Sep 13 275760 02:00:00 GMT+0200)
         */
        function maxDate() {
            return new Date(8640000000000000);
        }
        utils.maxDate = maxDate;
        function ie10UTCDate(date) {
            var utc = date.toUTCString().replace("UTC", "GMT");
            var parts = utc.split(" ");
            if (parts[1].length === 1) {
                parts[1] = "0" + parts[1];
            }
            return parts.join(" ");
        }
        utils.ie10UTCDate = ie10UTCDate;
        ;
        /**
         * Measures the deep size of object. Levels to be measured could be limited
         * @param object Object to be measured
         * @param levels Number of children objects to measure
         * @param level Current level used internally by the function
         */
        function sizeOf(object, levels, level) {
            var size = 0;
            levels = levels || -1;
            level = level || 0;
            if (levels !== -1 && level > levels) {
                return 0;
            }
            // determine the type of the object
            switch (typeof (object)) {
                // the object is a boolean
                case "boolean":
                    size += 4;
                    break;
                // the object is a number
                case "number":
                    size += 8;
                    break;
                // the object is a string
                case "string":
                    size += 2 * object.length;
                    break;
                case "object":
                    // type Int8Array
                    if (object instanceof Int8Array) {
                        size += object.byteLength;
                    }
                    else {
                        // type Int16Array
                        if (object instanceof Int16Array) {
                            size += object.byteLength;
                        }
                        else {
                            // type Int32Array
                            if (object instanceof Int32Array) {
                                size += object.byteLength;
                            }
                            else {
                                // type common Array
                                if (object instanceof Array) {
                                    for (var i = 0; i < object.length; i++) {
                                        size += sizeOf(object[i], levels, level + 1);
                                    }
                                }
                                else {
                                    // type Date
                                    if (object instanceof Array) {
                                        size += 8;
                                    }
                                    else {
                                        // type common Object but not function
                                        if (!(object instanceof Function)) {
                                            for (var key in object) {
                                                if (object.hasOwnProperty(key)) {
                                                    size += sizeOf(object[key], levels, level);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
            }
            return size;
        }
        utils.sizeOf = sizeOf;
        /**
         * Escapes string to be usable in the regullar expression
         * @param str String to be escaped
         */
        function escapeRegExp(str) {
            return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        }
        utils.escapeRegExp = escapeRegExp;
        /**
         * Replaces all occurences of the searchValue by replaceValue in str
         * @param str String to be searched for occurences of searchValue and replaced with replaceValue
         * @param searchValue Value to be replaced
         * @param replaceValue Value to be used as replacement
         */
        function replaceAll(str, searchValue, replaceValue) {
            return str.replace(new RegExp(escapeRegExp(searchValue), "g"), replaceValue);
        }
        utils.replaceAll = replaceAll;
    })(utils = ajs.utils || (ajs.utils = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var ui;
    (function (ui) {
        "use strict";
    })(ui = ajs.ui || (ajs.ui = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var templating;
    (function (templating) {
        "use strict";
        var FailedToLoadTemplatesException = (function (_super) {
            __extends(FailedToLoadTemplatesException, _super);
            function FailedToLoadTemplatesException() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return FailedToLoadTemplatesException;
        }(Error));
        templating.FailedToLoadTemplatesException = FailedToLoadTemplatesException;
        var MissingTemplateNameException = (function (_super) {
            __extends(MissingTemplateNameException, _super);
            function MissingTemplateNameException() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return MissingTemplateNameException;
        }(Error));
        templating.MissingTemplateNameException = MissingTemplateNameException;
        var MissingVisualComponentNameException = (function (_super) {
            __extends(MissingVisualComponentNameException, _super);
            function MissingVisualComponentNameException() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return MissingVisualComponentNameException;
        }(Error));
        templating.MissingVisualComponentNameException = MissingVisualComponentNameException;
        var FailedToLoadTemplateStylesheetsException = (function (_super) {
            __extends(FailedToLoadTemplateStylesheetsException, _super);
            function FailedToLoadTemplateStylesheetsException() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return FailedToLoadTemplateStylesheetsException;
        }(Error));
        templating.FailedToLoadTemplateStylesheetsException = FailedToLoadTemplateStylesheetsException;
    })(templating = ajs.templating || (ajs.templating = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var templating;
    (function (templating) {
        "use strict";
    })(templating = ajs.templating || (ajs.templating = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var templating;
    (function (templating) {
        "use strict";
    })(templating = ajs.templating || (ajs.templating = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var templating;
    (function (templating) {
        "use strict";
    })(templating = ajs.templating || (ajs.templating = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var templating;
    (function (templating) {
        "use strict";
    })(templating = ajs.templating || (ajs.templating = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var templating;
    (function (templating) {
        "use strict";
    })(templating = ajs.templating || (ajs.templating = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var templating;
    (function (templating) {
        "use strict";
    })(templating = ajs.templating || (ajs.templating = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var templating;
    (function (templating) {
        "use strict";
    })(templating = ajs.templating || (ajs.templating = {}));
})(ajs || (ajs = {}));
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var ajs;
(function (ajs) {
    var templating;
    (function (templating) {
        "use strict";
        /**
         * Represents a HTML template containing a visual component tree
         * <p>
         * Instanced by the #see {ajs.templating.TemplateManager} when the template is requested to be loaded.
         * </p>
         * <p>
         * Automatically parses the template data and register all defined visual components to the template manager.
         * </p>
         * <p>
         * Stylesheets defined as the style tag directly in the template are stored in the stylesheets
         * </p>
         * <p>
         * Stylesheets defined as the URL (template attribute stylesheets) must be explicitly asked to be loaded by
         * the #see {ajs.templating.TemplateManager} once the constructor returns the Template object.
         * </p>
         */
        var Template = (function () {
            /**
             * Constructs the template object and loads the data from the template
             * @param templateManager
             * @param templateResource
             * @param storageType
             */
            function Template(templateManager, templateResource, storageType, cachePolicy) {
                this._templateManager = templateManager;
                this._name = "";
                this._storageType = storageType;
                this._cachePolicy = cachePolicy;
                this._template = document.implementation.createHTMLDocument("ajstemplate");
                // safari hack
                var data = templateResource.data;
                data = data.replace(/touchstart/g, "touchstart_ajs");
                data = data.replace(/touchmove/g, "touchmove_ajs");
                data = data.replace(/touchend/g, "touchend_ajs");
                this._template.body.innerHTML = data;
                this._styleSheetsLoaded = false;
                this._styleSheetsUrls = [];
                this._styleSheets = [];
                this._visualComponents = {};
                this._getTemplateData();
            }
            Object.defineProperty(Template.prototype, "templateManager", {
                get: function () { return this._templateManager; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Template.prototype, "name", {
                get: function () { return this._name; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Template.prototype, "storageType", {
                get: function () { return this._storageType; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Template.prototype, "cachePolicy", {
                get: function () { return this._cachePolicy; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Template.prototype, "styleSheetsUrls", {
                get: function () { return this._styleSheetsUrls; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Template.prototype, "styleSheets", {
                get: function () { return this._styleSheets; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Template.prototype, "template", {
                get: function () { return this._template; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Template.prototype, "visualComponents", {
                get: function () { return this._visualComponents; },
                enumerable: true,
                configurable: true
            });
            /**
             * Must be called from the template manager to load templates
             */
            Template.prototype.loadStyleSheets = function () {
                var _this = this;
                return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var resourcePromises, i, styleSheets, i, e_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                // return immediately if stylesheets were loaded already or there are no stylesheets to be loaded
                                if (this._styleSheetsLoaded || this._styleSheetsUrls.length === 0) {
                                    resolve();
                                }
                                resourcePromises = [];
                                for (i = 0; i < this._styleSheetsUrls.length; i++) {
                                    resourcePromises.push(this._templateManager.resourceManager.getResource(this._styleSheetsUrls[i], this._storageType, this._cachePolicy, ajs.resources.LOADING_PREFERENCE.CACHE));
                                }
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, Promise.all(resourcePromises)];
                            case 2:
                                styleSheets = _a.sent();
                                // store stylesheets
                                for (i = 0; i < styleSheets.length; i++) {
                                    this._styleSheets.push(styleSheets[i].data);
                                }
                                // done
                                this._styleSheetsLoaded = true;
                                return [3 /*break*/, 4];
                            case 3:
                                e_1 = _a.sent();
                                reject(new templating.FailedToLoadTemplateStylesheetsException(e_1));
                                return [3 /*break*/, 4];
                            case 4:
                                resolve();
                                return [2 /*return*/];
                        }
                    });
                }); });
            };
            /**
             * Helper to walk the DOM of the loaded template
             * @param element HTMLElement where to start
             * @param parentComponent Parent visual component (if discovered already)
             * @param elementProcessor Function to process the template elmenets
             */
            Template.prototype._walkHTMLTree = function (element, parentComponent, elementProcessor) {
                if (element instanceof HTMLElement) {
                    for (var i = 0; i < element.children.length; i++) {
                        if (element.children.item(i).nodeType === Node.ELEMENT_NODE) {
                            var pc = elementProcessor(element.children.item(i), parentComponent);
                            this._walkHTMLTree(element.children.item(i), pc, elementProcessor);
                        }
                    }
                }
            };
            /**
             * Parses the template and gets the template info and visual components it contains
             */
            Template.prototype._getTemplateData = function () {
                var _this = this;
                this._walkHTMLTree(this._template.body, null, function (element, parentComponent) {
                    // parse the TEMPLATE tag information
                    if (element.nodeName === "AJSTEMPLATE") {
                        if (element.hasAttribute("name")) {
                            _this._name = element.getAttribute("name");
                        }
                        else {
                            throw new templating.MissingTemplateNameException();
                        }
                        if (element.hasAttribute("stylesheets")) {
                            // get stylesheet from the stylesheets attribute (separated by ;)
                            var styleSheetsToLoad = element.getAttribute("stylesheets").split(";");
                            // trim urls
                            for (var i = 0; i < styleSheetsToLoad.length; i++) {
                                styleSheetsToLoad[i] = styleSheetsToLoad[i].trim();
                            }
                            // update stylesheets urls to be loaded - sheet load is done by template manager
                            _this._styleSheetsUrls = _this._styleSheetsUrls.concat(styleSheetsToLoad);
                        }
                    }
                    // is this tag a placeholder for dynamically added components? do we have parent visual component?
                    if (parentComponent !== null && element.hasAttribute("placeholder")) {
                        var id = element.getAttribute("placeholder");
                        parentComponent.placeholders[id] = {
                            placeholder: element
                        };
                    }
                    // store style if defined
                    if (parentComponent !== null && element.nodeName === "STYLE") {
                        _this._styleSheets.push(element.textContent);
                    }
                    // if the element has ID attribute it is instance of the view component
                    if (parentComponent !== null && element.hasAttribute("id")) {
                        var id = element.getAttribute("id");
                        var name_2 = element.getAttribute("name");
                        var cname = element.getAttribute("component");
                        if (cname !== null) {
                            parentComponent.children[id] = {
                                tagName: cname,
                                nameAttribute: null
                            };
                        }
                        else {
                            parentComponent.children[id] = {
                                tagName: element.nodeName.toUpperCase(),
                                nameAttribute: name_2
                            };
                        }
                    }
                    // is the tag COMPONENT? (its name is component or it has attribute named component)
                    if (element.nodeName === "COMPONENT" || element.hasAttribute("component")) {
                        var name_3;
                        if (element.nodeName === "COMPONENT" && element.hasAttribute("name")) {
                            name_3 = element.getAttribute("name").toUpperCase();
                        }
                        else {
                            if (element.hasAttribute("component")) {
                                name_3 = element.getAttribute("component").toUpperCase();
                            }
                            else {
                                throw new templating.MissingVisualComponentNameException();
                            }
                        }
                        // prepare visual component info
                        var visualComponent = {
                            component: element,
                            template: _this,
                            templateName: _this._name,
                            children: {},
                            placeholders: {}
                        };
                        // store visual component to the template
                        _this._visualComponents[name_3] = visualComponent;
                        // register visual component to template manager (holds of all visual components)
                        _this._templateManager.registerVisualComponent(name_3, visualComponent);
                        return _this._visualComponents[name_3];
                    }
                    return parentComponent;
                });
            };
            return Template;
        }());
        templating.Template = Template;
    })(templating = ajs.templating || (ajs.templating = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var templating;
    (function (templating) {
        "use strict";
        var TemplateManager = (function () {
            function TemplateManager(resourceManager) {
                this._resourceManager = resourceManager;
                this._templates = {};
                this._visualComponents = {};
            }
            Object.defineProperty(TemplateManager.prototype, "resourceManager", {
                get: function () { return this._resourceManager; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TemplateManager.prototype, "templates", {
                get: function () { return this._templates; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TemplateManager.prototype, "VisualComponents", {
                get: function () { return this._visualComponents; },
                enumerable: true,
                configurable: true
            });
            TemplateManager.prototype.loadTemplates = function (paths, storageType, cachePolicy, loadingPreference) {
                var _this = this;
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.templating", this);
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.templating", this);
                return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var templates, resourcePromises, i, resources_1, styleSheetLoaders, i, template, e_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                templates = [];
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 4, , 5]);
                                resourcePromises = [];
                                for (i = 0; i < paths.length; i++) {
                                    resourcePromises.push(this._resourceManager.getResource(paths[i], storageType, cachePolicy, loadingPreference));
                                }
                                return [4 /*yield*/, Promise.all(resourcePromises)];
                            case 2:
                                resources_1 = _a.sent();
                                styleSheetLoaders = [];
                                for (i = 0; i < resources_1.length; i++) {
                                    template = new templating.Template(this, resources_1[i], storageType, cachePolicy);
                                    templates.push(template);
                                    styleSheetLoaders.push(template.loadStyleSheets());
                                }
                                // wait for all styleSheets to be loaded
                                return [4 /*yield*/, Promise.all(styleSheetLoaders)];
                            case 3:
                                // wait for all styleSheets to be loaded
                                _a.sent();
                                return [3 /*break*/, 5];
                            case 4:
                                e_2 = _a.sent();
                                throw new templating.FailedToLoadTemplatesException(e_2);
                            case 5:
                                // finish
                                resolve(templates);
                                return [2 /*return*/];
                        }
                    });
                }); });
            };
            TemplateManager.prototype.getTemplate = function (name) {
                if (this._templates.hasOwnProperty(name)) {
                    return this._templates[name];
                }
                return null;
            };
            TemplateManager.prototype.registerVisualComponent = function (name, visualComponent) {
                if (visualComponent && visualComponent !== null) {
                    this._visualComponents[name] = visualComponent;
                }
            };
            TemplateManager.prototype.getVisualComponent = function (name) {
                if (this._visualComponents.hasOwnProperty(name.toUpperCase())) {
                    return this._visualComponents[name.toUpperCase()];
                }
                return null;
            };
            TemplateManager.prototype.getVisualComponentTemplate = function (name) {
                if (this._visualComponents.hasOwnProperty(name)) {
                    var templateName = this._visualComponents[name].templateName;
                    var template = this.getTemplate(templateName);
                    return template;
                }
                return null;
            };
            return TemplateManager;
        }());
        templating.TemplateManager = TemplateManager;
    })(templating = ajs.templating || (ajs.templating = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var resources;
    (function (resources_2) {
        "use strict";
        /**
         * This prefix shall be added to all managed resources which are not loaded from the server
         * <p>
         * All Ajs and application features using managed resources and creating them locally, not
         * by loading them form server (i.e.to session/ app state manager) shall use this prefix in the
         * resource URL in order to be possible to quilcky recognize the resource can't be loaded from
         * the server. If the prefix will not be used the delay in serving the resource can occur as try
         * to load / update it form server will be performed. Definitelly, request to the server will be
         * send what is unwanted behaviour at local resources.
         * </p>
         */
        resources_2.LOCAL_ONLY_PREFIX = "LOCAL.";
        /** Default cache sizes 20 / 4 / 4 MB */
        var MEMORY_CACHE_SIZE = 20 * 1024 * 1024;
        var SESSION_CACHE_SIZE = 4 * 1024 * 1024;
        var LOCAL_CACHE_SIZE = 4 * 1024 * 1024;
        var WAIT = 1;
        /** Indicates if loaded scripts should executed using the eval function or by adding the &lt;script&gt; tag */
        var USE_EVAL = true;
        /** Resource types and their file name extensions */
        var RESOURCE_TYPES = {
            /** JavaScript resource */
            script: [".js"],
            /** Cascading stylesheet resource */
            style: [".css"],
            /** Text resource, such as HTML, XML, JSON, TXT */
            text: [".htm", ".html", ".xml", ".json", ".txt"],
            /** Binary resource, such as PNG, JPG, GIF */
            binary: [".png", ".jpg", ".jpeg", "gif"]
        };
        /** List of possible resource types */
        var RESOURCE_TYPE;
        (function (RESOURCE_TYPE) {
            RESOURCE_TYPE[RESOURCE_TYPE["SCRIPT"] = 0] = "SCRIPT";
            RESOURCE_TYPE[RESOURCE_TYPE["STYLE"] = 1] = "STYLE";
            RESOURCE_TYPE[RESOURCE_TYPE["TEXT"] = 2] = "TEXT";
            RESOURCE_TYPE[RESOURCE_TYPE["BINARY"] = 3] = "BINARY";
            RESOURCE_TYPE[RESOURCE_TYPE["UNKNOWN"] = 4] = "UNKNOWN";
        })(RESOURCE_TYPE = resources_2.RESOURCE_TYPE || (resources_2.RESOURCE_TYPE = {}));
        /** Type of the storage - passed to the loadResource or loadResources methods */
        var STORAGE_TYPE;
        (function (STORAGE_TYPE) {
            STORAGE_TYPE[STORAGE_TYPE["NONE"] = 0] = "NONE";
            STORAGE_TYPE[STORAGE_TYPE["LOCAL"] = 1] = "LOCAL";
            STORAGE_TYPE[STORAGE_TYPE["SESSION"] = 2] = "SESSION";
            STORAGE_TYPE[STORAGE_TYPE["MEMORY"] = 3] = "MEMORY";
        })(STORAGE_TYPE = resources_2.STORAGE_TYPE || (resources_2.STORAGE_TYPE = {}));
        /**
         * Resource cache policy
         * <p>
         * RCP is used to determine if the resource shouls be accessible permanently (mainly in offline mode) or
         * if it can be removed from the cache if there is not enough space for another resource requested by the application
         * </p>
         */
        var CACHE_POLICY;
        (function (CACHE_POLICY) {
            /** Not used when the resource is cached, the resource is loaded directly from the server */
            CACHE_POLICY[CACHE_POLICY["NONE"] = 0] = "NONE";
            /** Resource is cached permanently, it can't be removed during the cache clean process */
            CACHE_POLICY[CACHE_POLICY["PERMANENT"] = 1] = "PERMANENT";
            /** Last recently used resources will be removed from the cache if there is no space for a new resource requested */
            CACHE_POLICY[CACHE_POLICY["LASTRECENTLYUSED"] = 2] = "LASTRECENTLYUSED";
        })(CACHE_POLICY = resources_2.CACHE_POLICY || (resources_2.CACHE_POLICY = {}));
        /**
         * Loading preference
         */
        var LOADING_PREFERENCE;
        (function (LOADING_PREFERENCE) {
            LOADING_PREFERENCE[LOADING_PREFERENCE["SERVER"] = 0] = "SERVER";
            LOADING_PREFERENCE[LOADING_PREFERENCE["CACHE"] = 1] = "CACHE";
        })(LOADING_PREFERENCE = resources_2.LOADING_PREFERENCE || (resources_2.LOADING_PREFERENCE = {}));
        /**
         * Resource manager takes care of loading of resources from the server and caching them in the appropriate cache
         * <ul>
         *    <li>GET method is used to load resources</li>
         *    <li>If the resource is type of SCRIPT it is evaulated automatically and immediately on load.</li>
         *    <ul>
         *       <li>Scripts can be evaluated using the eval method or by adding the script tag to the main document</li>
         *       <li>This is drivent by the USE_EVAL constant and should not be changed in runtime</li>
         *       <li>EVAL should be used only for debugging purposes as the visual studio and IE can't handle source maps
         *           when the &lt;script&gt; tag is added</li>
         *       <li>If multiple resources are about to be loaded the evaluation of scripts occcurs when all are loaded successfully
         *           as the order of scripts to be loaded is important, because some can require others to be evaluated earlier</li>
         *    </ul>
         *    <li>If the resource is type of STYLE it is automatically registered to the style manager</li>
         *    <li>Other types of resources are not evaluated automatically and are just returned / cached</li>
         * </ul>
         */
        var ResourceManager = (function () {
            /**
             * Constructs the ResourceManager
             * <p>
             * Initializes resource loader and resource storages and gets info about managed resources.
             * Basically, all resources remaining in storages after refresh / browser restart and
             * created during any previous session using the resource manager are automatically managed
             * in the new browser session. Ofcouse only those alived the user action (session data will
             * not be avalilable after browser restart)
             * <p>
             */
            function ResourceManager(config) {
                ajs.dbg.log(ajs.dbg.LogType.Constructor, 0, "ajs.resources", this, "", config);
                // store config locally
                if (config === undefined) {
                    this._config = this._defaultConfig();
                }
                else {
                    this._config = config;
                }
                this._resourceLoader = new resources_2.ResourceLoader();
                this._storageLocal = new resources_2.StorageLocal(this._config.localCacheSize);
                this._storageSession = new resources_2.StorageSession(this._config.sessionCacheSize);
                this._storageMemory = new resources_2.StorageMemory(this._config.memoryCacheSize);
                this._managedResources = this._getManagedResources();
                // do some logging
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.resources", this, "Local storage used space: " + this._storageLocal.usedSpace + "/" + this._storageLocal.cacheSize);
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.resources", this, "Local storage managed resources count: " + this._storageLocal.resources.length);
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.resources", this, "Session storage used space: " + this._storageSession.usedSpace + "/" + this._storageSession.cacheSize);
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.resources", this, "Session storage managed resources count: " + this._storageSession.resources.length);
                // this will be always 0/max/0, just for sure everything works fine
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.resources", this, "Memory storage used space: " + this._storageMemory.usedSpace + "/" + this._storageMemory.cacheSize);
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.resources", this, "Memory storage managed resources count: " + this._storageMemory.resources.length);
                if (this._config.removeResourcesOlderThan !== undefined) {
                    ajs.dbg.log(ajs.dbg.LogType.Warning, 0, "ajs.resources", this, "IMPLEMENT: ResourceManager.constructor - removeResourcesOlderThan functionality");
                }
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.resources", this);
            }
            Object.defineProperty(ResourceManager.prototype, "config", {
                get: function () { return this._config; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ResourceManager.prototype, "managedResources", {
                get: function () { return this._managedResources; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ResourceManager.prototype, "resourceLoader", {
                /** Returns referrence to the ResourceLoader object used by the Resource Manager */
                get: function () { return this.resourceLoader; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ResourceManager.prototype, "storageLocal", {
                /** Returns referrence to the StorageLocal object used by the Resource Manager */
                get: function () { return this._storageLocal; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ResourceManager.prototype, "storageSession", {
                /** Returns referrence to the StorageSession object used by the Resource Manager */
                get: function () { return this._storageSession; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ResourceManager.prototype, "storageMemory", {
                /** Returns referrence to the StorageMemory object used by the Resource Manager */
                get: function () { return this._storageMemory; },
                enumerable: true,
                configurable: true
            });
            /**
             * Returns the default ResourceManager configuration
             */
            ResourceManager.prototype._defaultConfig = function () {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.resources", this);
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.resources", this, "ResourceManager configuration not provided, fallback to default");
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.resources", this);
                return {
                    memoryCacheSize: MEMORY_CACHE_SIZE,
                    sessionCacheSize: SESSION_CACHE_SIZE,
                    localCacheSize: LOCAL_CACHE_SIZE
                };
            };
            /**
             * Gets resources managed last time (before browser reload/refresh/open/reopen)
             * <p>
             * Called from constructor to get list of cached resources in local and session storages
             */
            ResourceManager.prototype._getManagedResources = function () {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.resources", this);
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.resources", this, "Getting list of previously managed resources");
                var managedResources = [];
                // get managed resources for the local storage
                var tmp = this._storageLocal.resources;
                for (var i = 0; i < tmp.length; i++) {
                    managedResources.push({
                        url: tmp[i].url,
                        storageType: STORAGE_TYPE.LOCAL,
                        cachePolicy: tmp[i].cachePolicy
                    });
                }
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.resources", this, "Number of previously managed resources [local storage]: " + tmp.length);
                // get managed resources for the session storage
                tmp = this._storageSession.resources;
                for (var i = 0; i < tmp.length; i++) {
                    managedResources.push({
                        url: tmp[i].url,
                        storageType: STORAGE_TYPE.SESSION,
                        cachePolicy: tmp[i].cachePolicy
                    });
                }
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.resources", this, "Number of previously managed resources [session storage]: " + tmp.length);
                // there are no managed resources stored in memory storage for sure as open/reload occured
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.resources", this, "Number of previously managed resources [memory storage]: 0");
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.resources", this);
                return managedResources;
            };
            /**
             * Registers managed resources without preloading them (resources will be loaded/cached with first getResource)
             * <p>
             * Managed resource is uniquely identified by the URL, storage type and the caching policy. This means it can happen
             * the same resource (with the same url) will be placed in three different storage (memory, session, local). It up
             * to application developer to make sure the resource is available just in storages where it should be and don't
             * consumes the other storages if not necessary.
             * </p>
             * <p>
             * registerManagedResource should be used instead of getMultipleResources for all resources with the LRU policy.
             * This is because during the loadMultiple the "clean cache" mechanism can be executed when LRU resources will
             * not fit the maximum cache size so earlier resources loaded will be flushed and replaced with latest loaded. If
             * the resource is just registered it will be loaded (if it is not cached) at the time when getResource is called
             * so in the worst case the "clean cache" will be executed just to make a space for the resource required.
             * </p>
             * <p>
             * On other hand, if resources are required to be accessible offline developer have to make sure resources
             * will fit the cache. In this case resources shall be loaded instead of registered and also shall be using the
             * PERMANENT cache policy.
             * </p>
             */
            ResourceManager.prototype.registerManagedResources = function (managedResources) {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.resources", this);
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.resources", this, "Restering managed resources (" + managedResources.length + ")", managedResources);
                // go through all managed resources to be registered
                for (var i = 0; i < managedResources.length; i++) {
                    // check if it is registered
                    var managedResource = this._getManagedResourceInfo(managedResources[i].url, managedResources[i].storageType);
                    // regisret it if not
                    if (managedResource === null) {
                        ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.resources", this, "Registering a managed resource: " +
                            managedResources[i].url +
                            " [" + STORAGE_TYPE[managedResources[i].storageType] +
                            ":" + CACHE_POLICY[managedResources[i].cachePolicy] +
                            "]");
                        this.managedResources.push({
                            url: managedResources[i].url,
                            storageType: managedResources[i].storageType,
                            cachePolicy: managedResources[i].cachePolicy
                        });
                    }
                    else {
                        ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.resources", this, "Resource is managed already: " + managedResource.url +
                            " [" + STORAGE_TYPE[managedResource.storageType] +
                            ":" + CACHE_POLICY[managedResource.cachePolicy] +
                            "]");
                    }
                }
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.resources", this);
            };
            /**
             * Returns a cached resource if the resource is available in specified storage
             * @param url Url of the cached resource
             * @param storageType type of the storage to be used for lookup
             */
            ResourceManager.prototype.getCachedResource = function (url, storageType) {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.resources", this);
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.resources", this, "Getting cached resource '" + url + "', Storage: " + STORAGE_TYPE[storageType]);
                var storage = this._getStorageFromType(storageType);
                if (storage !== null) {
                    ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.resources", this);
                    return storage.getResource(url);
                }
                else {
                    ajs.dbg.log(ajs.dbg.LogType.Error, 0, "ajs.resources", this, "Invalid storage type");
                    throw new resources_2.InvalidStorageTypeException();
                }
            };
            /**
             * Creates or updates existing cached resource
             * Automatically creates a managed resource if the managed resource does not not exist
             * @param url Url of the cached resource
             * @param data Data to be stored or updated
             * @param storageType type of the storage to be used
             * @param cachePolicy cache policy to be used for new resources
             */
            ResourceManager.prototype.setCachedResource = function (url, data, storageType, cachePolicy) {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.resources", this);
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.resources", this, "Setting / Updating the cached resource " + url + " " + STORAGE_TYPE[storageType] + " " + CACHE_POLICY[cachePolicy]);
                var storage = this._getStorageFromType(storageType);
                if (storage !== null) {
                    // register managed resource
                    this.registerManagedResources([{
                            url: url,
                            storageType: storageType,
                            cachePolicy: cachePolicy
                        }]);
                    // store / update cached resource
                    var resource = {
                        url: url,
                        data: data,
                        cachePolicy: cachePolicy,
                        lastModified: new Date()
                    };
                    storage.updateResource(resource);
                }
                else {
                    ajs.dbg.log(ajs.dbg.LogType.Error, 0, "ajs.resources", this, "Invalid storage type");
                    throw new resources_2.InvalidStorageTypeException();
                }
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.resources", this);
            };
            /**
             * Removes existing cached resource
             * @param resource Resource to be created or updated
             * @param storageType Type of the storage to be used
             */
            ResourceManager.prototype.removeCachedResource = function (url, storageType) {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.resources", this);
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.resources", this, "Removing the cached resource " + url + " " + STORAGE_TYPE[storageType]);
                var storage = this._getStorageFromType(storageType);
                if (storage !== null) {
                    // remove the managed resource
                    for (var i = 0; i < this._managedResources.length; i++) {
                        if (this._managedResources[i].url === url && this._managedResources[i].storageType === storageType) {
                            this.managedResources.splice(i, 1);
                            break;
                        }
                    }
                    // remove the resource from the storage
                    storage.removeResource(url);
                }
                else {
                    ajs.dbg.log(ajs.dbg.LogType.Error, 0, "ajs.resources", this, "Invalid storage type");
                    throw new resources_2.InvalidStorageTypeException();
                }
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.resources", this);
            };
            /**
             * Removes all cached resources
             */
            ResourceManager.prototype.cleanCaches = function () {
                this._storageLocal.clear();
                this._storageSession.clear();
                this._storageMemory.clear();
                this._managedResources = [];
            };
            /**
             * Returns a resource from cache or from the server and updates the cache
             * <p>
             * If preference is set to CACHE and the resource is cached the promise is resolved immediately.
             * If the resource is not supposed to be local only (its URL prefix is #see {LOCAL_ONLY_PREFIX}) it
             * is checked if resource was updated on the server then the cache is synchronized. There are no
             * further notifications to the application the resource and the cache was updated so it is possible
             * the resource currently in use is one request older than the resource on the server and in the cache.
             * </p>
             * <p>
             * If the preference is server the standard load procedure is done.
             * </p>
             * @param url Url of the resource to be returned
             * @param storageType Resource storage type (if not specified the resource will be loaded from the server without caching)
             * @param cachePolicy Resource cache policy (if not specified the resource will be loaded from the server without caching)
             * @param loadingPreference Resource loading preference
             * @param runScript Specifies if the script resource should be started
             */
            ResourceManager.prototype.getResource = function (url, storageType, cachePolicy, loadingPreference, runScript) {
                var _this = this;
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.resources", this);
                // set default preference if not set by caller
                if (loadingPreference === undefined) {
                    loadingPreference = LOADING_PREFERENCE.CACHE;
                }
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.resources", this, "Getting a resource '" + url + "', Loading preference: " + LOADING_PREFERENCE[loadingPreference]);
                // determine if the resource is local only or from the server
                var localResource = url.substring(0, resources_2.LOCAL_ONLY_PREFIX.length) === resources_2.LOCAL_ONLY_PREFIX;
                // try to get the managed resource descriptor from the URL
                var managedResource;
                if (storageType !== undefined) {
                    managedResource = this._getManagedResourceInfo(url, storageType);
                }
                else {
                    managedResource = null;
                }
                // prepare resource promise
                var resourcePromise = new Promise(function (resolve) {
                    // update initial progress bar
                    if (ajs.ui.progressBar) {
                        ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.resources", _this, "Updating initial progress bar with resource to be loaded: '" + url + "'");
                        ajs.ui.progressBar.resourceLoading(url);
                    }
                    // let browser do its stuff like a UI updates
                    setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                        var storage, cachedResource, resource_1, rp, resource, e_3;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(managedResource !== null && (loadingPreference === LOADING_PREFERENCE.CACHE || localResource))) return [3 /*break*/, 1];
                                    storage = this._getStorageFromType(managedResource.storageType);
                                    // this should never fail as it is managed resource, but just to be sure
                                    if (storage !== null) {
                                        cachedResource = storage.getResource(url);
                                        // and if it was found, return it to caller
                                        if (cachedResource !== null) {
                                            ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.resources", this, "Cached resource found: " + cachedResource.url);
                                            // update initial progress bar
                                            ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.resources", this, "Updating initial progress bar with resource finished loading '" + url + "'");
                                            if (ajs.ui.progressBar) {
                                                ajs.ui.progressBar.resourceLoaded(url);
                                            }
                                            resource_1 = {
                                                url: url,
                                                type: this._getResourceTypeFromURL(url),
                                                data: cachedResource.data,
                                                cached: true,
                                                storage: storage,
                                                cachePolicy: cachedResource.cachePolicy,
                                                lastModified: cachedResource.lastModified
                                            };
                                            // again, let browser do its stuff (like ui update)
                                            setTimeout(function () {
                                                resolve(resource_1);
                                            }, WAIT);
                                            ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.resources", this, "Updating cached resource '" + url + "'");
                                            // try to update the resource from the server -> promise can be thrown out
                                            this._load(url, managedResource.storageType, managedResource.cachePolicy, runScript, false);
                                            ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.resources", this);
                                        }
                                        else {
                                            // if its a local resource, ready with null as it was not found in cache
                                            if (localResource) {
                                                ajs.dbg.log(ajs.dbg.LogType.Warning, 0, "ajs.resources", this, "Local resource requested but not exists in cache");
                                                resourcePromise = new Promise(function (resolve, reject) {
                                                    reject(new resources_2.LocalResourceRequestedDoesNotExistException(url));
                                                });
                                            }
                                            else {
                                                // otherwise try to load it from the server
                                                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.resources", this, "Resource not cached, trying to load it from server");
                                                resourcePromise = this._load(url, storageType, cachePolicy, runScript, true);
                                            }
                                        }
                                        // this should never occur on managed resources
                                    }
                                    else {
                                        ajs.dbg.log(ajs.dbg.LogType.Error, 0, "ajs.resources", this, "Invalid storage type");
                                        resourcePromise = new Promise(function (resolve, reject) {
                                            reject(new resources_2.InvalidStorageTypeException(url));
                                        });
                                    }
                                    return [3 /*break*/, 5];
                                case 1:
                                    if (localResource) {
                                        ajs.dbg.log(ajs.dbg.LogType.Warning, 0, "ajs.resources", this, "Local resource requested but not exists in cache");
                                        resourcePromise = new Promise(function (resolve, reject) {
                                            reject(new resources_2.LocalResourceRequestedDoesNotExistException(url));
                                        });
                                    }
                                    // otherwise try to load it from the server
                                    ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.resources", this, "Resource not managed, trying to load it from server");
                                    // if storage type or caching policy was not added don't create managed resource
                                    // just load it from server if possible
                                    if (storageType === undefined || cachePolicy === undefined) {
                                        storageType = STORAGE_TYPE.NONE;
                                        cachePolicy = CACHE_POLICY.NONE;
                                    }
                                    rp = this._load(url, storageType, cachePolicy, runScript, true);
                                    _a.label = 2;
                                case 2:
                                    _a.trys.push([2, 4, , 5]);
                                    return [4 /*yield*/, rp];
                                case 3:
                                    resource = _a.sent();
                                    resolve(resource);
                                    return [3 /*break*/, 5];
                                case 4:
                                    e_3 = _a.sent();
                                    throw new Error(e_3);
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); }, WAIT);
                });
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.resources", this);
                return resourcePromise;
            };
            /**
             * Returns multiple resources from a cache or from the server and updates the cache
             * <p>
             * Waits until all resources are available before resolving the promise.
             * If the resource is not supposed to be local only (its URL prefix is #see {LOCAL_ONLY_PREFIX}) it
             * is checked if resource was updated on the server then the cache is synchronized. There are no
             * further notifications to the application the resource and the cache was updated so it is possible
             * the resource currently in use is one request older than the resource on the server and in the cache.
             * </p>
             * <p>
             * If the preference is server the standard load procedure is done.
             * </p>
             * @param urls Urls of the resources to be returned
             * @param storageType Resource storage type (if not specified resources will be loaded from the server without caching)
             * @param cachePolicy Resource cache policy (if not specified resources will be loaded from the server without caching)
             * @param loadingPreference Resources loading preference
             * @param runScript Specifies if the script resources should be evaluated
             */
            ResourceManager.prototype.getMultipleResources = function (urls, storageType, cachePolicy, loadingPreference, runScripts) {
                var _this = this;
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.resources", this);
                // don't process anything else than array of urls
                if (!(urls instanceof Array)) {
                    urls = [];
                }
                // by default is loading preference CACHE
                if (loadingPreference === undefined) {
                    loadingPreference = LOADING_PREFERENCE.CACHE;
                }
                // by default run loaded scripts
                if (runScripts === undefined) {
                    runScripts = true;
                }
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.resources", this, "Getting multiple resources (" + urls.length + "), Storage: " + STORAGE_TYPE[storageType] +
                    ", Cache Policy: " + CACHE_POLICY[cachePolicy], urls);
                var resourcesPromise = new Promise(
                // get resources
                function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var gettedResources, resources, i, i, e_4;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                resources = [];
                                // push "load" promises to the resources array
                                for (i = 0; i < urls.length; i++) {
                                    resources.push(this.getResource(urls[i], storageType, cachePolicy, loadingPreference, false));
                                }
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, Promise.all(resources)];
                            case 2:
                                // hopefully getted resources are in the same order they were passed in
                                gettedResources = _a.sent();
                                // run scripts
                                if (runScripts) {
                                    for (i = 0; i < gettedResources.length; i++) {
                                        if (gettedResources[i].type === RESOURCE_TYPE.SCRIPT) {
                                            ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.resources", this, "Executing the getted script (load multiple): " + gettedResources[i].url);
                                            // use eval or insert the script tag to the code
                                            if (USE_EVAL) {
                                                this._evalScript(gettedResources[i]);
                                            }
                                            else {
                                                this._addScriptTag(gettedResources[i]);
                                            }
                                        }
                                    }
                                }
                                return [3 /*break*/, 4];
                            case 3:
                                e_4 = _a.sent();
                                reject(e_4);
                                return [3 /*break*/, 4];
                            case 4:
                                setTimeout(function () {
                                    resolve(gettedResources);
                                }, WAIT);
                                return [2 /*return*/];
                        }
                    });
                }); });
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.resources", this);
                return resourcesPromise;
            };
            /**
             * Load resource from server or cache
             * <p>
             *  If the "mode" is offline or resource was not modified since the last download the cached resource is returned
             * </p>
             * <p>
             * <ul>
             *    If caching of the resource is required the resource is created or updated in the cache of given type
             *    <li>GET method is used to load resources</li>
             *    <li>If the resource is type of SCRIPT it is (by default) evaulated automatically and immediately on load.
             *       <ul>
             *          <li>Scripts can be evaluated using the eval method or by adding the script tag to the main document</li>
             *          <li>This is drivent by the USE_EVAL constant and should not be changed in runtime</li>
             *          <li>EVAL should be used only for debugging purposes as the visual studio and IE can't handle source maps
             *              when the &lt;script&gt; tag is added</li>
             *       </ul>
             *    </li>
             *    <li>If the resource is type of STYLE it is automatically registered to the style manager</li>
             *    <li>Other types of resources are not evaluated automatically and are just returned / cached</li>
             * </ul>
             * </p>
             * @param url Url of the resource to be loaded
             * @param storageType Type of storage to be used to cache the resource.
             *                    If the storage is not specified the direct download will be used
             * @param cachePolicy If the storage is specified the cache policy will set the cache behavior
             * @param runScript Specifies if the script resource should be evaluated automatically
             * @param updateProgressBar Specified if UI progressbar should be updated
             */
            ResourceManager.prototype._load = function (url, storageType, cachePolicy, runScript, updateProgressBar) {
                var _this = this;
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.resources", this);
                if (runScript === undefined) {
                    runScript = true;
                }
                var resourcePromise = new Promise(
                // promise code
                function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var storage, resource, managedResource, cachedResource, response, e_5;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.resources", this, "Loading resource: '" + url +
                                    "', Storage: " + STORAGE_TYPE[storageType] +
                                    ", Cache Policy: " + CACHE_POLICY[cachePolicy]);
                                storage = this._getStorageFromType(storageType);
                                // basic checks and parameters update
                                if (storage !== null) {
                                    if (!storage.supported) {
                                        ajs.dbg.log(ajs.dbg.LogType.Error, 0, "ajs.resources", this, "Storage type not supported");
                                        reject(new resources_2.StorageTypeNotSupportedException());
                                    }
                                    if (cachePolicy === undefined || cachePolicy === CACHE_POLICY.NONE) {
                                        ajs.dbg.log(ajs.dbg.LogType.Error, 0, "ajs.resources", this, "Cache policy not set");
                                        reject(new resources_2.CachePolicyMustBeSetException());
                                    }
                                }
                                else {
                                    ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.resources", this, "Fallback to CACHE_POLICY.NONE");
                                    cachePolicy = CACHE_POLICY.NONE;
                                }
                                resource = null;
                                managedResource = this._getManagedResourceInfo(url, storageType);
                                if (managedResource !== null) {
                                    cachedResource = this.getCachedResource(url, managedResource.storageType);
                                    if (cachedResource !== null) {
                                        resource = {
                                            url: url,
                                            type: this._getResourceTypeFromURL(url),
                                            data: cachedResource.data,
                                            cached: true,
                                            storage: this._getStorageFromType(managedResource.storageType),
                                            cachePolicy: managedResource.cachePolicy,
                                            lastModified: cachedResource.lastModified
                                        };
                                    }
                                    // otherwise add resource to list of managed resources
                                }
                                else {
                                    if (storage !== null && cachePolicy !== CACHE_POLICY.NONE) {
                                        this._managedResources.push({
                                            url: url,
                                            storageType: storageType,
                                            cachePolicy: cachePolicy
                                        });
                                    }
                                }
                                // setup resource info anyway, even if the resource was not in cache or its not a managed resource
                                if (resource === null) {
                                    ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.resources", this, "Resource not cached");
                                    resource = {
                                        url: url,
                                        type: this._getResourceTypeFromURL(url),
                                        data: null,
                                        cached: false,
                                        storage: storage,
                                        cachePolicy: cachePolicy,
                                        lastModified: null
                                    };
                                }
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, this._resourceLoader.loadResource(url, resource.type === RESOURCE_TYPE.BINARY, resource.lastModified)];
                            case 2:
                                response = _a.sent();
                                resource = this._processResourceResponse(resource, response, runScript);
                                return [3 /*break*/, 4];
                            case 3:
                                e_5 = _a.sent();
                                reject(e_5);
                                return [3 /*break*/, 4];
                            case 4:
                                if (updateProgressBar) {
                                    // update initial progress bar
                                    ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.resources", this, "Updating initial progress bar with resource finished loading '" + resource.url + "'");
                                    if (ajs.ui.progressBar) {
                                        ajs.ui.progressBar.resourceLoaded(resource.url);
                                    }
                                }
                                setTimeout(function () {
                                    resolve(resource);
                                }, WAIT);
                                return [2 /*return*/];
                        }
                    });
                }); });
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.resources", this);
                return resourcePromise;
            };
            /**
             * DEPRECATED! Loads multiple resources from the server or the same storage type using the same caching policy
             * <p>
             * If resource is loaded from the server the cache is updated with this updated resource
             * </p?
             * @param url Array of resource URL's to be loaded
             * @param storageType Type of storage to be used to cache resources.
             *                    If the storage is not specified the direct download will be used
             * @param cachePolicy If the storage is specified the cache policy will set the cache behavior for all resources loading
             * @param runScripts Should be script resources evaluated on download? Default = true
             */
            ResourceManager.prototype._loadMultiple_DEPRECATED = function (urls, storageType, cachePolicy, runScripts) {
                var _this = this;
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.resources", this);
                // don't process anything else than array of urls
                if (!(urls instanceof Array)) {
                    urls = [];
                }
                // by default run loaded scripts
                if (runScripts === undefined) {
                    runScripts = true;
                }
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.resources", this, "Loading resources (" + urls.length + "), Storage: " + STORAGE_TYPE[storageType] +
                    ", Cache Policy: " + CACHE_POLICY[cachePolicy], urls);
                var resourcesPromise = new Promise(
                // load resources
                function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var loadedResources, resources, i, i, e_6;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                resources = [];
                                // push "load" promises to the resources array
                                for (i = 0; i < urls.length; i++) {
                                    resources.push(this._load(urls[i], storageType, cachePolicy, false));
                                }
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, Promise.all(resources)];
                            case 2:
                                // hopefully loaded resources are in the same order they were passed in
                                loadedResources = _a.sent();
                                // run scripts
                                if (runScripts) {
                                    for (i = 0; i < loadedResources.length; i++) {
                                        if (loadedResources[i].type === RESOURCE_TYPE.SCRIPT) {
                                            ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.resources", this, "Executing the loaded script (load multiple): " + loadedResources[i].url);
                                            // use eval or insert the script tag to the code
                                            if (USE_EVAL) {
                                                this._evalScript(loadedResources[i]);
                                            }
                                            else {
                                                this._addScriptTag(loadedResources[i]);
                                            }
                                        }
                                    }
                                }
                                return [3 /*break*/, 4];
                            case 3:
                                e_6 = _a.sent();
                                reject(e_6);
                                return [3 /*break*/, 4];
                            case 4:
                                resolve(loadedResources);
                                return [2 /*return*/];
                        }
                    });
                }); });
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.resources", this);
                return resourcesPromise;
            };
            /**
             * Called internally when loading of single resource ends and resource need to be processed
             * <p>If not explicitly specified, SCRIPT resources are automatically evaluated</p>
             * @param resource Cached or empty resource prepared in the load method
             * @param response Information about the resource loaded passed from the resource loader
             */
            ResourceManager.prototype._processResourceResponse = function (resource, response, runScript) {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.resources", this);
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.resources", this, "Processing loaded resource '" + resource.url + "'");
                var loaded;
                if (runScript === undefined) {
                    runScript = true;
                }
                // loaded successfully, update resource and also cache if necessary
                if (response.httpStatus === 200) {
                    // based on the resource type, get the data
                    switch (resource.type) {
                        case RESOURCE_TYPE.BINARY:
                            ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.resources", this, "Binary file loaded");
                            resource.data = new Uint8Array(response.data);
                            break;
                        default:
                            ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.resources", this, "Text file loaded");
                            resource.data = response.data;
                    }
                    // update cached resource
                    if (resource.storage !== null) {
                        ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.resources", this, "Loaded resource is requested to be cached. Caching/Updating." + resource.url);
                        var cachedResource = {
                            url: resource.url,
                            data: resource.data,
                            cachePolicy: resource.cachePolicy,
                            lastModified: new Date()
                        };
                        resource.storage.updateResource(cachedResource);
                        resource.cached = true;
                    }
                    loaded = true;
                }
                else {
                    // not modified / failed (the resource loaded from cache is already set in the resource parameter)
                    if (resource.cached) {
                        ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.resources", this, "Not modified, using cached resource" + resource.url);
                        loaded = true;
                    }
                    else {
                        ajs.dbg.log(ajs.dbg.LogType.Warning, 0, "ajs.resources", this, "Resource failed to load and is not cached " + resource.url);
                        loaded = false;
                    }
                }
                // if the resource was not loaded neither cached, exception
                if (!loaded) {
                    throw new resources_2.ResourceFailedToLoadException(response.httpStatus.toString());
                }
                // if the resource is script and should be executed, do it
                if (resource.type === RESOURCE_TYPE.SCRIPT && runScript) {
                    ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.resources", this, "Executing the loaded script");
                    // use eval or insert the script tag to the code
                    if (USE_EVAL) {
                        this._evalScript(resource);
                    }
                    else {
                        this._addScriptTag(resource);
                    }
                }
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.resources", this);
                return resource;
            };
            /**
             * Returns managed resource info if the resource is managed by the resource manager
             * <p>
             * As managed resource is uniquely identified by URL, storage and cache policy, all three parameters must match
             * in order to be possible to locate the managed resource.
             * </p>
             * @param url Url of the resource to be checked and #see {ajs.resources.IManagedResource} info to be returned for
             * @param storageType Storage type of the resource to be checked and #see {ajs.resources.IManagedResource} info to be returned for
             */
            ResourceManager.prototype._getManagedResourceInfo = function (url, storageType) {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.resources", this);
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.resources", this, "Looking for managed resource '" + url + "'");
                for (var i = 0; i < this._managedResources.length; i++) {
                    if (this._managedResources[i].url === url &&
                        this._managedResources[i].storageType === storageType) {
                        ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.resources", this);
                        return this._managedResources[i];
                    }
                }
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.resources", this);
                return null;
            };
            /**
             * Returns the storage instance from the storage type
             * @param storageType
             */
            ResourceManager.prototype._getStorageFromType = function (storageType) {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.resources", this);
                switch (storageType) {
                    case STORAGE_TYPE.LOCAL:
                        ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.resources", this);
                        return this._storageLocal;
                    case STORAGE_TYPE.SESSION:
                        ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.resources", this);
                        return this._storageSession;
                    case STORAGE_TYPE.MEMORY:
                        ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.resources", this);
                        return this._storageMemory;
                    default:
                        ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.resources", this);
                        return null;
                }
            };
            /**
             * Returns the resource type from the resource file extension
             * @param url
             */
            ResourceManager.prototype._getResourceTypeFromURL = function (url) {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.resources", this);
                var ext = url.substring(url.lastIndexOf("."));
                if (RESOURCE_TYPES.script.indexOf(ext) >= 0) {
                    return RESOURCE_TYPE.SCRIPT;
                }
                if (RESOURCE_TYPES.style.indexOf(ext) >= 0) {
                    return RESOURCE_TYPE.STYLE;
                }
                if (RESOURCE_TYPES.text.indexOf(ext) >= 0) {
                    return RESOURCE_TYPE.TEXT;
                }
                if (RESOURCE_TYPES.binary.indexOf(ext) >= 0) {
                    return RESOURCE_TYPE.BINARY;
                }
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.resources", this);
                return RESOURCE_TYPE.UNKNOWN;
            };
            /**
             * Evaluates the script resource - should be used only during debugging as IE / Visual Studio does not
             * work with source maps in the dynamically added <script> tag when debugging
             * @param resource Script resource to be evaluated
             */
            ResourceManager.prototype._evalScript = function (resource) {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.resources", this);
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.resources", this, "Evaluating sript resource", resource);
                if (resource !== null && resource.data != null) {
                    var content = resource.data;
                    if (content.indexOf("//# sourceMappingURL") !== -1) {
                        content =
                            content.substring(0, content.lastIndexOf("\n")) +
                                "\n//# sourceMappingURL=" + resource.url + ".map" +
                                "\n//# sourceURL=" + resource.url;
                    }
                    eval.call(null, content);
                }
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.resources", this);
            };
            /**
             * Creates the script tag and adds the resource data to it (script is then executed automatically)
             * @param resource Script resource to be evaluated
             */
            ResourceManager.prototype._addScriptTag = function (resource) {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.resources", this);
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.resources", this, "Adding a script resource to the HEAD as a tag", resource);
                // first check if the script was not added already
                var nodeList = document.head.getElementsByTagName("script");
                for (var i = 0; i < nodeList.length; i++) {
                    if (nodeList.item(i).id === resource.url) {
                        ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.resources", this);
                        return;
                    }
                }
                // add script and its content
                var script = document.createElement("script");
                script.id = resource.url;
                script.type = "text/javascript";
                script.innerText = resource.data;
                document.head.appendChild(script);
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.resources", this);
            };
            return ResourceManager;
        }());
        resources_2.ResourceManager = ResourceManager;
    })(resources = ajs.resources || (ajs.resources = {}));
})(ajs || (ajs = {}));
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
///<reference path="../resources/ResourceManager.ts" />
/**
 * State namespace contains the StateManager class usefull to persist the application and the session states
 * <p>
 * The state persistance management is important for the Application to keep the track of the state after the
 * browser window is closed or the web page is refreshed or the link is entered manually to the browser address
 * bar. In these cases the memory of the JavaSript (including all variables and objects) is freed and all
 * information is lost as the new request (even to the same url) behaves in the way the new page is loaded and
 * new JavaScript object instances are created.
 * </p>
 * <p>
 * It was written many times what the application and the session state is, so just to remember in short: On the web
 * the state information is availabe just during one HTTP request/response pair. If it is neccessary to keep the track
 * of some information and have it availabe during multiple requests it is necessary to use one of methods developed
 * for this puprose. Overall name for this process is state persistence management. For the JavaScript frontend applications
 * there are some additional considerations to be made compared to traditional client/server development as there are
 * additional tools and possibilities for the state persistence management. However, the basic principles are the same.
 * </p>
 * <p>
 * The application state is overall state of the application (except the session state) and can contain information
 * about i.e. last logged-in user and additional information to log in the user in when the application is restarted.
 * It can also persist users profiles to be available immediately after logging in to the application without need
 * of loading this information from the server or the database. Additionally, it can store differences to default
 * configuration of the application made by users. The application state in the Web Browser is available until user
 * explicitly (and manually) requests clearing of the local storage.
 * </p>
 * <p>
 * The session state is the state availabe trhough multiple request but just for one browser session. Basically, it
 * is available until the browser is closed. Session state storage usually presists the UI interface state - the view
 * state - i.e. what tab of the tab control was selected before the page was reloaded.
 * </p>
 * <p>
 * It is hard to recommend what data should be stored in what storage as it always depends on business needs and
 * architecture of the application and requirements. For example, business or security request to store of some type of
 * the data only on the server side (except the time when user works with them) may exist.
 * </p>
 * <p>
 * In general, states can be persisted on both, client and server sides in many ways. At least, the following options
 * for the the application / session state persistance between HTTP requests exists:
 * </p>
 * <ul>
 * <li>GET/POST data to server and back with each HTTP request/response (includes HTTP header manipulation techniques,
 *     posting hidden form fields or url parameters manipulation</li>
 * <li>Storing the data to be persistent in HTTP Cookies</li>
 * <li>Store the state data on the server and using any other method (i.e. WebSockets or JSON API)</li>
 * <li>Store the state data on the client side in storages desinged for it (localStorage, sessionStorage)</li>
 * <li>Store the data on the client side in the storage which was not designed for it (i.e. indexedDB)</li>
 * </ul>
 * </p>
 * <p>
 * Concrete implementation always depends on the overall application architecture. We will focus just on the client-side
 * as we are talking about the client side front end framework.
 * </p>
 * <p>
 * Ajs framework is using LocalStorage and SessionStorage features of the W3C HTML5 specification to handle the state
 * management. Bot storages, according the specification, are Key/Value storages and Ajs just wraps these storages to
 * the StateManager class which is using Resource Manager to access local and session storages. This is because storages
 * are used for multiple purposes and track of all of them must be kept in order to be possible to successfuly manage
 * all resources and caches. It is highly recommended not to use the local/session storage functionality provided by
 * browser directly from the application as it can lead to inconsistences and/or interferences between the Ajs and the
 * application data persitence. Only the Resource, Data and State managers should be used to manipulate the data in these
 * storages.
 * </p>
 * <p>
 * It is usually necessary to follow some security recommendations regarding the state management (and the application
 * development in general). The main security principles are: don't store sensitive data like passwords in any type of
 * storage and minimize storing of any information usefull for potential attackers to attack the application or the system.
 * For security recomendations related to web application design and development reffer to the <a href="www.owasp.org">OWASP</a>
 * web site. There is a very nice guide regarding secure application design and development.
 * </p>
 */
var ajs;
(function (ajs) {
    var state;
    (function (state) {
        "use strict";
        /**
         * Prefix for the key used to store the Application state value
         */
        var APP_STATE_PREFIX = ajs.resources.LOCAL_ONLY_PREFIX + "APPSTATE.";
        /**
         * Prefix for the key used to store the Session state value
         */
        var SESS_STATE_PREFIX = ajs.resources.LOCAL_ONLY_PREFIX + "SESSTATE.";
        /**
         * State manager is used for the application and session state persistance
         * State manager currently supports only string values so if it is required to store
         * arbitrary object it is necessary to JSONize it first.
         */
        var StateManager = (function () {
            /**
             * Constructs the state manager object
             * @param resourceManager Resource manager to be used to access the local and session storages
             */
            function StateManager(resourceManager) {
                ajs.dbg.log(ajs.dbg.LogType.Constructor, 0, "ajs.state", this);
                this._resourceManager = resourceManager;
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.state", this);
            }
            /**
             * Sets the application state value
             * @param key Key to be used for the application state value
             * @param value The value to be stored in the local storage under specified key
             */
            StateManager.prototype.setAppState = function (key, value) {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.state", this);
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.state", this, "Setting the application state: " + key + " : " + value);
                this._resourceManager.setCachedResource(APP_STATE_PREFIX + key, value, ajs.resources.STORAGE_TYPE.LOCAL, ajs.resources.CACHE_POLICY.PERMANENT);
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.state", this);
            };
            /**
             * Retrieves the application state value idetified by the given key
             * @param key Key for which the application state value should be returned.
             */
            StateManager.prototype.getAppState = function (key) {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.state", this);
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.state", this, "Retrieving the application state " + key);
                var resource = this._resourceManager.getCachedResource(APP_STATE_PREFIX + key, ajs.resources.STORAGE_TYPE.LOCAL);
                if (resource !== null) {
                    ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.state", this);
                    return resource.data;
                }
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.state", this);
                return null;
            };
            /**
             * Removes the application state key / value pair from the local storage
             * @param key Key to be removed
             */
            StateManager.prototype.removeAppState = function (key) {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.state", this);
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.state", this, "Removing the application state " + key);
                this._resourceManager.removeCachedResource(key, ajs.resources.STORAGE_TYPE.LOCAL);
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.state", this);
            };
            /**
             * Sets the session state value
             * @param key Key to be used for the session state value
             * @param value The value to be stored in the session storage under specified key
             */
            StateManager.prototype.setSessionState = function (key, value) {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.state", this);
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.state", this, "Setting the session state " + key + " : " + value);
                this._resourceManager.setCachedResource(SESS_STATE_PREFIX + key, value, ajs.resources.STORAGE_TYPE.SESSION, ajs.resources.CACHE_POLICY.PERMANENT);
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.state", this);
            };
            /**
             * Retrieves the session state value idetified by the given key
             * @param key Key for which the session state value should be returned.
             */
            StateManager.prototype.getSessionState = function (key) {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.state", this);
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.state", this, "Retireving the session state " + key);
                var resource = this._resourceManager.getCachedResource(SESS_STATE_PREFIX + key, ajs.resources.STORAGE_TYPE.SESSION);
                if (resource !== null) {
                    ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.state", this);
                    return resource.data;
                }
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.state", this);
                return null;
            };
            /**
             * Removes the session state key / value pair from the session storage
             * @param key Key to be removed
             */
            StateManager.prototype.removeSessionState = function (key) {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.state", this);
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.state", this, "Removing the session state " + key);
                this._resourceManager.removeCachedResource(key, ajs.resources.STORAGE_TYPE.SESSION);
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.state", this);
            };
            return StateManager;
        }());
        state.StateManager = StateManager;
    })(state = ajs.state || (ajs.state = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var routing;
    (function (routing) {
        "use strict";
    })(routing = ajs.routing || (ajs.routing = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var routing;
    (function (routing) {
        "use strict";
    })(routing = ajs.routing || (ajs.routing = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var routing;
    (function (routing) {
        "use strict";
    })(routing = ajs.routing || (ajs.routing = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var routing;
    (function (routing) {
        "use strict";
        var Router = (function () {
            function Router(view, routes) {
                ajs.dbg.log(ajs.dbg.LogType.Constructor, 0, "ajs.routing", this);
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.routing", this, "Registering routes (" + (routes ? routes.length : 0) + ")", routes);
                this._view = view;
                this._routes = routes || [];
                this._lastURL = "";
                this._lastViewComponentName = null;
                this._lastViewComponentInstance = null;
                this._currentRoute = { base: "", path: "", search: "", hash: "" };
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.routing", this);
            }
            Object.defineProperty(Router.prototype, "routes", {
                get: function () { return this._routes; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Router.prototype, "currentRoute", {
                get: function () { return this._currentRoute; },
                enumerable: true,
                configurable: true
            });
            Router.prototype.registerRoute = function (paths, viewComponentName) {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.routing", this);
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.routing", this, "Registering route", paths);
                this._routes.push({
                    paths: paths,
                    viewComponentName: viewComponentName
                });
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.routing", this);
            };
            Router.prototype.route = function () {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.routing", this);
                if (this._lastURL !== window.location.href) {
                    ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.routing", this, "Maping route for '" + window.location.href + "'");
                    this._lastURL = window.location.href;
                    var viewComponentName = this._getRouteViewComponent();
                    ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.routing", this, "Routing to " + viewComponentName);
                    if (viewComponentName !== null) {
                        if (this._lastViewComponentName !== viewComponentName) {
                            ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.routing", this, "Routing to a different than previous component");
                            this._lastViewComponentName = viewComponentName;
                            this._view.rootViewComponentName = viewComponentName;
                        }
                        else {
                            ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.routing", this, "Notifying component the navigation occured");
                            this._view.onNavigate();
                        }
                    }
                    else {
                        ajs.dbg.log(ajs.dbg.LogType.Error, 0, "ajs.routing", this, "ViewComponent not found for the path specified");
                        throw new routing.RouteNotFoundException();
                    }
                }
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.routing", this);
            };
            Router.prototype._getRouteViewComponent = function () {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.routing", this);
                for (var i = 0; i < this._routes.length; i++) {
                    for (var j = 0; j < this._routes[i].paths.length; j++) {
                        var rx = new RegExp(this._routes[i].paths[j].base + this._routes[i].paths[j].params, "g");
                        if (rx.test(window.location.pathname)) {
                            var routeURI = window.location.pathname + window.location.search + window.location.hash;
                            var base = routeURI.match(this._routes[i].paths[j].base)[0];
                            var path = routeURI.substr(base.length);
                            if (base[0] === "/") {
                                base = base.substr(1);
                            }
                            if (path.indexOf("#") !== -1) {
                                path = path.substr(0, path.indexOf("#"));
                            }
                            if (path.indexOf("?") !== -1) {
                                path = path.substr(0, path.indexOf("?"));
                            }
                            if (path[0] === "/") {
                                path = path.substr(1);
                            }
                            if (path[path.length - 1] === "/") {
                                path = path.substr(0, path.length - 1);
                            }
                            this._currentRoute = {
                                base: base,
                                path: path,
                                search: window.location.search.substr(1),
                                hash: window.location.hash.substr(1)
                            };
                            return this._routes[i].viewComponentName;
                        }
                    }
                }
                ajs.dbg.log(ajs.dbg.LogType.Warning, 0, "ajs.routing", this, "Route not found");
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.routing", this);
                return null;
            };
            return Router;
        }());
        routing.Router = Router;
    })(routing = ajs.routing || (ajs.routing = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var routing;
    (function (routing) {
        "use strict";
        var RouteNotFoundException = (function (_super) {
            __extends(RouteNotFoundException, _super);
            function RouteNotFoundException() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return RouteNotFoundException;
        }(Error));
        routing.RouteNotFoundException = RouteNotFoundException;
    })(routing = ajs.routing || (ajs.routing = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var resources;
    (function (resources_3) {
        "use strict";
        /** Storage cachedResourcesInfo key */
        resources_3.STORAGE_INFO_KEY = "AJSRESOURCEINFO";
        /** Storage resource data item key prefix */
        resources_3.STORAGE_RESOURCE_KEY_PREFIX = "AJSRESOURCE.";
        /** Storage key for testing if the resource fits the remaining free space */
        resources_3.STORAGE_ADDTEST_KEY = "AJSADDTEST";
        /**
         * Represents the browser storage (memory/session/local, based on the configuration and storage provider of the extending class)
         * <strong>
         * Abstract class to be extended by the class for the reqiured resource storage type
         * </strong>
         * <p>
         * This class implements complete functionality for the storage data manipulation but requires to be extended and initialized
         * by the concrete implementation of the storage class (local, session, memory). The initialization must include checking if
         * the storage required storage type is supported and instancing or collecting instance of the storage provider for the
         * given storage type
         * </p>
         * <p>
         * If the resource is updated by the application (not by the request to the server) and requirement to persist this change exists
         * the updateResource method should be called after each resource data change
         * </p>
         * <p>
         * AjsStorage is using the following keys in the storage for internal purposes:
         * <ul>
         * AJSRESOURCESINFO
         * <li>JSONed ICachedResource[] where data at all items is set to null</li>
         * AJSRESOURCES.%URL%
         * <li>JSONed resource data where %URL% is URL of the data</li>
         * </ul>
         * These keys are stored in constants so should be simply changed if required, but Ajs must be recompiled afterwards.
         * </p>
         */
        /**
         * Abstract class to be implemented by the Storage for the reqiured resource storage type
         * <p>
         * Currently extended by StorageBrowser (then by StorageMemory, StorageSession, StorageLocal)
         */
        var AjsStorage = (function () {
            /**
             * Constructs and initializes the AjsStorage
             * @param cacheSize Maximum amount of the storage to be available as the cache
             */
            function AjsStorage(cacheSize) {
                ajs.dbg.log(ajs.dbg.LogType.Constructor, 0, "ajs.resources", this);
                this._cacheSize = cacheSize;
                this._initialize();
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.resources", this);
            }
            Object.defineProperty(AjsStorage.prototype, "supported", {
                /** Returns if the storage type (local, session) is supported by the browser */
                get: function () { return this._supported; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AjsStorage.prototype, "cacheSize", {
                /** Returns maximum size of the cache usable by the AjsStorage */
                get: function () { return this._cacheSize; },
                enumerable: true,
                configurable: true
            });
            ;
            Object.defineProperty(AjsStorage.prototype, "usedSpace", {
                /** Returns approximate total size of all resources stored in the storage in bytes */
                get: function () { return this._usedSpace; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AjsStorage.prototype, "resources", {
                /** Returns information about resources stored in the storage */
                get: function () { return this._resources; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AjsStorage.prototype, "storageProvider", {
                /** Returns instance of the storage provider used by the Storage to manipulate storage data */
                get: function () { return this._storageProvider; },
                enumerable: true,
                configurable: true
            });
            /**
             * Completely cleans all resources from the storage
             */
            AjsStorage.prototype.clear = function () {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.resources", this);
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.resources", this, "Clearing the storage");
                // remove all data items
                for (var i = 0; i < this._resources.length; i++) {
                    this._storageProvider.removeItem(resources_3.STORAGE_RESOURCE_KEY_PREFIX + this._resources[i].url);
                }
                // remove stored resources information
                this._usedSpace = 0;
                this._resources = [];
                this._storageProvider.setItem(resources_3.STORAGE_INFO_KEY, JSON.stringify(this._resources));
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.resources", this);
            };
            /**
             * Adds a new resource to the storage
             * @param resource Resource to be stored
             * @throws NotEnoughSpaceInStorageException Thrown when there is not enough space in the storage to store the resource
             */
            AjsStorage.prototype.addResource = function (resource) {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.resources", this);
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.resources", this, "Adding cached resource to the storage " + resource.url, resource);
                // if the resource exists, update it
                if (this.getResource(resource.url) !== null) {
                    this.updateResource(resource);
                    return;
                }
                var data;
                var dataSize;
                // prepare necessary variables
                if (resource.data instanceof Uint8Array) {
                    // # this hack is because of safari
                    var str = "";
                    for (var i = 0; i < resource.data.length; i++) {
                        str += String.fromCharCode(resource.data[i]);
                    }
                    data = JSON.stringify(btoa(str));
                }
                else {
                    data = JSON.stringify(resource.data);
                }
                var oldInfoSize = this._storageProvider.getItem(resources_3.STORAGE_INFO_KEY).length;
                dataSize = data.length;
                // try to add the resource data to the storage
                try {
                    this._storageProvider.setItem(resources_3.STORAGE_RESOURCE_KEY_PREFIX + resource.url, data);
                }
                catch (e) {
                    // if there is no space, clean the cache and try it once more - don't catch the exception, let it pass further
                    this._cleanCache(dataSize);
                    // another try to add the resource
                    try {
                        this._storageProvider.setItem(resources_3.STORAGE_RESOURCE_KEY_PREFIX + resource.url, data);
                    }
                    catch (e) {
                        ajs.dbg.log(ajs.dbg.LogType.Error, 0, "ajs.resources", this, "Not enough space in the storage", e);
                        throw new resources_3.NotEnoughSpaceInStorageException();
                    }
                }
                // prepare the resource info to be added to this._resources
                var resourceInfo = {
                    url: resource.url,
                    data: null,
                    cachePolicy: resource.cachePolicy,
                    lastModified: resource.lastModified,
                    lastUsedTimestamp: new Date()
                };
                // add info about the resource to the list of stored resources
                this._resources.push(resourceInfo);
                // stringify the resources info
                var resourcesInfoStr = JSON.stringify(this._resources);
                var newInfoSize = resourcesInfoStr.length;
                // try to update info in the store
                try {
                    this._storageProvider.setItem(resources_3.STORAGE_INFO_KEY, resourcesInfoStr);
                }
                catch (e) {
                    this._storageProvider.removeItem(resources_3.STORAGE_RESOURCE_KEY_PREFIX + resource.url);
                    ajs.dbg.log(ajs.dbg.LogType.Error, 0, "ajs.resources", this, "Not enough space in the storage for the metadata", e);
                    throw new resources_3.NotEnoughSpaceInStorageException();
                }
                // compute new size of the occupied space
                this._usedSpace += (newInfoSize - oldInfoSize) + dataSize;
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.resources", this);
            };
            /**
             * Returns the resource according the URL passed
             * @param url URL of the resource to be returned
             */
            AjsStorage.prototype.getResource = function (url) {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.resources", this);
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.resources", this, "Getting cached resource from the storage: " + url);
                for (var i = 0; i < this._resources.length; i++) {
                    if (this._resources[i].url === url) {
                        // update last used timestamp
                        this._resources[i].lastUsedTimestamp = new Date();
                        var info = JSON.stringify(this._resources);
                        this._storageProvider.setItem(resources_3.STORAGE_INFO_KEY, info);
                        // prepare data
                        var dataStr = JSON.parse(this._storageProvider.getItem(resources_3.STORAGE_RESOURCE_KEY_PREFIX + url));
                        var data = dataStr;
                        // compose the ICachedResource
                        var resource = {
                            url: this._resources[i].url,
                            data: data,
                            cachePolicy: this._resources[i].cachePolicy,
                            lastModified: this._resources[i].lastModified,
                            lastUsedTimestamp: this._resources[i].lastUsedTimestamp,
                            size: dataStr.length
                        };
                        ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.resources", this, "Cached resource found in the storage: " + url);
                        ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.resources", this);
                        return resource;
                    }
                }
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.resources", this, "Cached resource not found in the storage: " + url);
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.resources", this);
                return null;
            };
            /**
             * Updates a cached resource
             * @param resource Resource to be updated
             */
            AjsStorage.prototype.updateResource = function (resource) {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.resources", this);
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.resources", this, "Updating cached resource: " + resource.url, resource);
                // if the resource not exist, create it
                if (this.getResource(resource.url) === null) {
                    this.addResource(resource);
                    return;
                }
                // prepare necessary variables
                var data;
                var dataSize;
                // prepare necessary variables
                if (resource.data instanceof Uint8Array) {
                    // # this hack is because of safari
                    var str = "";
                    for (var i = 0; i < resource.data.length; i++) {
                        str += String.fromCharCode(resource.data[i]);
                    }
                    data = JSON.stringify(btoa(str));
                }
                else {
                    data = JSON.stringify(resource.data);
                }
                dataSize = data.length;
                var oldInfoSize = this._storageProvider.getItem(resources_3.STORAGE_INFO_KEY).length;
                var resourceKey = resources_3.STORAGE_RESOURCE_KEY_PREFIX + resource.url;
                var oldDataSize = this._storageProvider.getItem(resourceKey).length;
                // try to update the resource data in the storage
                try {
                    this._storageProvider.setItem(resources_3.STORAGE_RESOURCE_KEY_PREFIX + resource.url, data);
                }
                catch (e) {
                    // if there is no space, clean the cache and try it once more
                    // don't catch the exception, let it pass further
                    this._cleanCache(Math.abs(dataSize - oldDataSize));
                    // another try to update the resource
                    try {
                        this._storageProvider.setItem(resources_3.STORAGE_RESOURCE_KEY_PREFIX + resource.url, data);
                    }
                    catch (e) {
                        ajs.dbg.log(ajs.dbg.LogType.Error, 0, "ajs.resources", this, "Not enough space in the storage", e);
                        throw new resources_3.NotEnoughSpaceInStorageException();
                    }
                }
                // prepare the resource info to be added to this._resources
                var resourceInfo = {
                    url: resource.url,
                    data: null,
                    cachePolicy: resource.cachePolicy,
                    lastModified: resource.lastModified,
                    lastUsedTimestamp: new Date()
                };
                // update info about the resource to the list of stored resources
                this._resources[this._getResourceIndex(resource.url)] = resourceInfo;
                // stringify the resources info
                var resourcesInfoStr = JSON.stringify(this._resources);
                var newInfoSize = resourcesInfoStr.length;
                // try to update info in the store
                try {
                    this._storageProvider.setItem(resources_3.STORAGE_INFO_KEY, resourcesInfoStr);
                }
                catch (e) {
                    ajs.dbg.log(ajs.dbg.LogType.Error, 0, "ajs.resources", this, "Not enough space in the storage for the metadata", e);
                    throw new resources_3.NotEnoughSpaceInStorageException();
                }
                // compute new size of the occupied space
                this._usedSpace += (newInfoSize - oldInfoSize) + (dataSize - oldDataSize);
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.resources", this);
            };
            /**
             * Removes the resource from the storage
             * @param url Url of the resource to be removed
             */
            AjsStorage.prototype.removeResource = function (url) {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.resources", this);
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.resources", this, "Removing cached resource: " + url);
                // get reource from store and return if not exists
                var resource = this.getResource(url);
                if (resource === null) {
                    return;
                }
                // remove data
                this._storageProvider.removeItem(resources_3.STORAGE_RESOURCE_KEY_PREFIX + url);
                this._usedSpace -= resource.size;
                // remove info
                var oldInfoSize = this._storageProvider.getItem(resources_3.STORAGE_INFO_KEY).length;
                this._resources.splice(this._resources.indexOf(resource), 1);
                var info = JSON.stringify(this._resources);
                var newInfoSize = info.length;
                this._storageProvider.setItem(resources_3.STORAGE_INFO_KEY, info);
                // update used space
                this._usedSpace -= oldInfoSize - newInfoSize;
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.resources", this);
            };
            /**
             * Loads information about resources in the storage
             */
            AjsStorage.prototype._getResourcesInfo = function () {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.resources", this);
                var resources = [];
                var cachedResourcesInfoStr = this._storageProvider.getItem(resources_3.STORAGE_INFO_KEY);
                if (cachedResourcesInfoStr !== null) {
                    // get space occupied by the resources info
                    this._usedSpace = cachedResourcesInfoStr.length;
                    // set array of all ICachedResource in given storage
                    resources = JSON.parse(cachedResourcesInfoStr, this._resourceInfoJSONReviver);
                    // compute storage used space from the data of all resources
                    for (var i = 0; i < resources.length; i++) {
                        var resourceKey = resources_3.STORAGE_RESOURCE_KEY_PREFIX + resources[i].url;
                        var item = this._storageProvider.getItem(resourceKey);
                        if (item !== null) {
                            this._usedSpace += item.length;
                        }
                    }
                }
                else {
                    this._storageProvider.setItem(resources_3.STORAGE_INFO_KEY, JSON.stringify([]));
                }
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.resources", this);
                return resources;
            };
            /**
             * Cleans the storage (removes last recently used resources until there is required space in the storage)
             * @param requiredSpace If defined the method tries to remove old resources until there is enough space
             *                      in the storage, otherwise it removes all LRU resources
             */
            AjsStorage.prototype._cleanCache = function (requiredSpace) {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.resources", this);
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.resources", this, "Cleaning resource cache. Required space: " + (requiredSpace === undefined ? "Complete clean" : requiredSpace));
                // delete lru resource until there is enough space required
                if (requiredSpace !== undefined) {
                    // create string of required size
                    var testString = "";
                    for (var i_1 = 0; i_1 < requiredSpace; i_1++) {
                        testString += " ";
                    }
                    // sort the storage by last recently used resource
                    var orderedResources = this._resources.slice(0).sort(function (a, b) {
                        return a.lastUsedTimestamp < b.lastUsedTimestamp ?
                            -1 : a.lastUsedTimestamp > b.lastUsedTimestamp ?
                            1 : 0;
                    });
                    // remove oldest resources from the storage until the required space is created
                    var enoughSpace = true;
                    var i = 0;
                    // try to remove LRU resources from the storage until there is enough
                    // space in the storage
                    while (i < orderedResources.length && !enoughSpace) {
                        if (orderedResources[i].cachePolicy === resources_3.CACHE_POLICY.LASTRECENTLYUSED) {
                            this.removeResource(orderedResources[i].url);
                            // using a naive method check if there is enough space in the storage
                            try {
                                enoughSpace = true;
                                this._storageProvider.setItem(resources_3.STORAGE_ADDTEST_KEY, testString);
                            }
                            catch (e) {
                                enoughSpace = false;
                            }
                            if (enoughSpace) {
                                this._storageProvider.removeItem(resources_3.STORAGE_ADDTEST_KEY);
                            }
                        }
                        else {
                            i++;
                        }
                    }
                    // trow exception if there is not enough space for resource in the storage
                    if (!enoughSpace) {
                        ajs.dbg.log(ajs.dbg.LogType.Error, 0, "ajs.resources", this, "Not enough space in the storage");
                        throw new resources_3.NotEnoughSpaceInStorageException();
                    }
                    // clean all non-permanent resources
                }
                else {
                    var i = 0;
                    // remove all LRU resources
                    while (i < this._resources.length) {
                        if (this._resources[i].cachePolicy === resources_3.CACHE_POLICY.LASTRECENTLYUSED) {
                            this.removeResource(this._resources[i].url);
                        }
                        else {
                            i++;
                        }
                    }
                }
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.resources", this);
            };
            /**
             * Converts JSON string to Date
             * Used for resource info data loaded from storage and parsed from JSON to object
             * @param key
             * @param value
             */
            AjsStorage.prototype._resourceInfoJSONReviver = function (key, value) {
                if (key === "lastModified" || key === "lastUsedTimestamp") {
                    return new Date(value);
                }
                return value;
            };
            /**
             * Returns resource index from the URL
             * If the resource is not found it returns -1
             * @param url
             */
            AjsStorage.prototype._getResourceIndex = function (url) {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.resources", this);
                for (var i = 0; i < this._resources.length; i++) {
                    if (this._resources[i].url === url) {
                        ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.resources", this);
                        return i;
                    }
                }
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.resources", this);
                return -1;
            };
            return AjsStorage;
        }());
        resources_3.AjsStorage = AjsStorage;
    })(resources = ajs.resources || (ajs.resources = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var resources;
    (function (resources) {
        "use strict";
        /** The required storage type is not supported by the browser */
        var StorageTypeNotSupportedException = (function (_super) {
            __extends(StorageTypeNotSupportedException, _super);
            function StorageTypeNotSupportedException() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return StorageTypeNotSupportedException;
        }(Error));
        resources.StorageTypeNotSupportedException = StorageTypeNotSupportedException;
        /** Storage type requested is not valid */
        var InvalidStorageTypeException = (function (_super) {
            __extends(InvalidStorageTypeException, _super);
            function InvalidStorageTypeException() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return InvalidStorageTypeException;
        }(Error));
        resources.InvalidStorageTypeException = InvalidStorageTypeException;
        /** If the storage is chosen the caching policy must be set */
        var CachePolicyMustBeSetException = (function (_super) {
            __extends(CachePolicyMustBeSetException, _super);
            function CachePolicyMustBeSetException() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return CachePolicyMustBeSetException;
        }(Error));
        resources.CachePolicyMustBeSetException = CachePolicyMustBeSetException;
        /** Resource was not found in the storage */
        var ResourceNotFoundException = (function (_super) {
            __extends(ResourceNotFoundException, _super);
            function ResourceNotFoundException() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return ResourceNotFoundException;
        }(Error));
        resources.ResourceNotFoundException = ResourceNotFoundException;
        /** Storage is out of space or the resource can't fit the storage */
        var NotEnoughSpaceInStorageException = (function (_super) {
            __extends(NotEnoughSpaceInStorageException, _super);
            function NotEnoughSpaceInStorageException() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return NotEnoughSpaceInStorageException;
        }(Error));
        resources.NotEnoughSpaceInStorageException = NotEnoughSpaceInStorageException;
        /** Load end handler passed must be a function */
        var LoadEndHandlerIsNotFunctionException = (function (_super) {
            __extends(LoadEndHandlerIsNotFunctionException, _super);
            function LoadEndHandlerIsNotFunctionException() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return LoadEndHandlerIsNotFunctionException;
        }(Error));
        resources.LoadEndHandlerIsNotFunctionException = LoadEndHandlerIsNotFunctionException;
        /** Invalid callback specified for getResource function */
        var InvalidResourceReadyCallbackException = (function (_super) {
            __extends(InvalidResourceReadyCallbackException, _super);
            function InvalidResourceReadyCallbackException() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return InvalidResourceReadyCallbackException;
        }(Error));
        resources.InvalidResourceReadyCallbackException = InvalidResourceReadyCallbackException;
        /** Requested local resource does not exist */
        var LocalResourceRequestedDoesNotExistException = (function (_super) {
            __extends(LocalResourceRequestedDoesNotExistException, _super);
            function LocalResourceRequestedDoesNotExistException() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return LocalResourceRequestedDoesNotExistException;
        }(Error));
        resources.LocalResourceRequestedDoesNotExistException = LocalResourceRequestedDoesNotExistException;
        /** Thrown when resource failed to load and was not located in the cache */
        var ResourceFailedToLoadException = (function (_super) {
            __extends(ResourceFailedToLoadException, _super);
            function ResourceFailedToLoadException() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return ResourceFailedToLoadException;
        }(Error));
        resources.ResourceFailedToLoadException = ResourceFailedToLoadException;
    })(resources = ajs.resources || (ajs.resources = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var resources;
    (function (resources) {
        "use strict";
    })(resources = ajs.resources || (ajs.resources = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var resources;
    (function (resources) {
        "use strict";
    })(resources = ajs.resources || (ajs.resources = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var resources;
    (function (resources) {
        "use strict";
    })(resources = ajs.resources || (ajs.resources = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var resources;
    (function (resources) {
        "use strict";
    })(resources = ajs.resources || (ajs.resources = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var resources;
    (function (resources) {
        "use strict";
    })(resources = ajs.resources || (ajs.resources = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var resources;
    (function (resources) {
        "use strict";
    })(resources = ajs.resources || (ajs.resources = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var resources;
    (function (resources) {
        "use strict";
    })(resources = ajs.resources || (ajs.resources = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var resources;
    (function (resources) {
        "use strict";
    })(resources = ajs.resources || (ajs.resources = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var resources;
    (function (resources) {
        "use strict";
    })(resources = ajs.resources || (ajs.resources = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var resources;
    (function (resources) {
        "use strict";
    })(resources = ajs.resources || (ajs.resources = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var resources;
    (function (resources) {
        "use strict";
        /**
         * In-memory implementation of the Key/Value storage for the resource manager support
         * <p>
         * Unfortunately it is not possible to be implemented full as the Storage interface
         * as target is ES5 and its not possible to capture writes/read to indexed variables (arrays)
         * </p>
         */
        var MemoryStorageProvider = (function () {
            /** Constructs the memory implementation of the key/value storage */
            function MemoryStorageProvider() {
                ajs.dbg.log(ajs.dbg.LogType.Constructor, 0, "ajs.resources", this);
                this.clear();
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.resources", this);
            }
            Object.defineProperty(MemoryStorageProvider.prototype, "length", {
                /** Returns numer of items in the storage */
                get: function () { return this._length; },
                enumerable: true,
                configurable: true
            });
            /** Clears the storage */
            MemoryStorageProvider.prototype.clear = function () {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.resources", this);
                ajs.dbg.log(ajs.dbg.LogType.Info, 3, "ajs.resources", this, "Clearing storage");
                this._store = {};
                this._length = 0;
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.resources", this);
            };
            /**
             * Sets the specified string data under specified key
             * @param key Key to be used to store the data
             * @param data Data to be stored
             */
            MemoryStorageProvider.prototype.setItem = function (key, data) {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.resources", this);
                ajs.dbg.log(ajs.dbg.LogType.Info, 3, "ajs.resources", this, "Setting storage item: " + key, data);
                if (!this._store.hasOwnProperty(key)) {
                    this._length++;
                }
                this._store[key] = data;
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.resources", this);
            };
            /**
             * Returns the string data for specified key or null if the key does not exist
             * @param key The key which data should be returned
             */
            MemoryStorageProvider.prototype.getItem = function (key) {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.resources", this);
                ajs.dbg.log(ajs.dbg.LogType.Info, 3, "ajs.resources", this, "Getting storage item: " + key);
                if (this._store.hasOwnProperty(key)) {
                    ajs.dbg.log(ajs.dbg.LogType.Info, 3, "ajs.resources", this, "Item found", this._store[key]);
                    ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.resources", this);
                    return this._store[key];
                }
                else {
                    ajs.dbg.log(ajs.dbg.LogType.Info, 3, "ajs.resources", this, "Key not found");
                    ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.resources", this);
                    return null;
                }
            };
            /**
             * Returns key of the specified index or null if the key does not exist
             * @param index Index of the key to be returned
             */
            MemoryStorageProvider.prototype.key = function (index) {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.resources", this);
                ajs.dbg.log(ajs.dbg.LogType.Info, 3, "ajs.resources", this, "Geting storage key by index: " + index);
                var i = 0;
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
            };
            /**
             * Removes the item from the key/value store
             * @param key Key of the item to be removed
             */
            MemoryStorageProvider.prototype.removeItem = function (key) {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.resources", this);
                if (this._store.hasOwnProperty(key)) {
                    ajs.dbg.log(ajs.dbg.LogType.Info, 3, "ajs.resources", this, "Removing storage key: " + key);
                    delete this._store[key];
                    this._length--;
                }
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.resources", this);
            };
            return MemoryStorageProvider;
        }());
        resources.MemoryStorageProvider = MemoryStorageProvider;
    })(resources = ajs.resources || (ajs.resources = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var resources;
    (function (resources) {
        "use strict";
        /**
         * ResourceLoader is used internally by the #see (ajs.resources.ResourceManager} to load a resource
         * <p>
         * It performs standard HTTP request to the server and obtains the resource from it. It
         * is using the standard XMLHttpRequest feature of the browser and resources are loaded isng the GET
         * method. It is supposed to be used for static resources only.
         * </p>
         */
        var ResourceLoader = (function () {
            function ResourceLoader() {
                ajs.dbg.log(ajs.dbg.LogType.Constructor, 0, "ajs.resources", this);
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.resources", this);
            }
            /**
             * Initiates loading of the resource
             * @param loadEndHandler Handler to be called when the resource loading finishes
             * @param url Resource locator
             * @param isBinary Identifies if binary data should be loaded
             * @param userData User data object to be passed to the handler
             * @param lastModified Information about resource last modification date/time
             */
            ResourceLoader.prototype.loadResource = function (url, isBinary, lastModified) {
                var _this = this;
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.resources", this);
                var response = new Promise(function (resolve, reject) {
                    ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.resources", _this, "Requesting [GET] resource '" + url + "'", isBinary, lastModified);
                    // prepare data for the loader
                    lastModified = lastModified || ajs.utils.minDate();
                    var requestData = {
                        url: url,
                        isBinary: isBinary,
                        lastModified: lastModified,
                        startTime: new Date(),
                        loadEndHandler: function (responseData) {
                            resolve(responseData);
                        }
                    };
                    _this._loadResource(requestData);
                });
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.resources", this);
                return response;
            };
            /**
             * Contructs the XHR, registers readystatechange listener and sends GET request it to the server
             * @param requestData Request data
             */
            ResourceLoader.prototype._loadResource = function (requestData) {
                var _this = this;
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.resources", this);
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.resources", this, "Initializing the XHR");
                // setup the xhr
                var xhr = new XMLHttpRequest();
                xhr.open("GET", encodeURI(requestData.url));
                xhr.resourceRequestData = requestData;
                if (requestData.isBinary) {
                    xhr.responseType = "arraybuffer";
                }
                // ie9 does not support loadend event
                xhr.addEventListener("readystatechange", function (event) {
                    _this._xhrStatusChanged(event);
                });
                if (requestData.lastModified !== null) {
                    xhr.setRequestHeader("If-Modified-Since", ajs.utils.ie10UTCDate(requestData.lastModified));
                }
                // send request to the server
                xhr.send();
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.resources", this);
            };
            /**
             * Called when XHR changes the loading status
             * @param e XHR State change event data
             */
            ResourceLoader.prototype._xhrStatusChanged = function (e) {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.resources", this);
                var xhr = e.target;
                var requestData = xhr.resourceRequestData;
                ajs.dbg.log(ajs.dbg.LogType.Info, 3, "ajs.resources", this, "Url: " + xhr.resourceRequestData.url + ", XHR readyState: " + xhr.readyState);
                // if completed
                if (xhr.readyState === xhr.DONE) {
                    // setup the result loading object
                    var responseData = {
                        type: xhr.responseType,
                        data: requestData.isBinary ? xhr.response : xhr.responseText,
                        httpStatus: xhr.status,
                        startTime: requestData.startTime,
                        endTime: new Date()
                    };
                    ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.resources", this, "XHR for '" + requestData.url + "' ready in " + (responseData.endTime.getTime() - responseData.startTime.getTime()) +
                        "ms with " + xhr.status + " " + xhr.statusText);
                    // for text data
                    // index.html should never pass the resource manager so if it passes
                    // it means it was provided by the app cache and we are offline now
                    if (responseData.httpStatus === 200 && typeof (responseData.data) === "string") {
                        var tmp = responseData.data.substr(0, 50);
                        if (tmp.indexOf("<!--offline-->") !== -1) {
                            responseData.httpStatus = 304;
                            ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.resources", this, "Offline mode detected, index.html served");
                        }
                    }
                    // for binary data
                    // index.html should never pass the resource manager so if it passes
                    // it means it was provided by the app cache and we are offline now
                    if (responseData.httpStatus === 200 &&
                        responseData.data instanceof ArrayBuffer) {
                        var buffer = new Int8Array(responseData.data);
                        var count = buffer.byteLength < 50 ? buffer.byteLength : 50;
                        var str = "";
                        for (var i = 0; i < count; i++) {
                            str += String.fromCharCode(buffer[i]);
                        }
                        if (str.indexOf("<!--offline-->") !== -1) {
                            responseData.httpStatus = 304;
                            ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.resources", this, "Offline mode detected, index.html served");
                        }
                    }
                    // call the handler
                    if (requestData.loadEndHandler instanceof Function) {
                        requestData.loadEndHandler(responseData);
                    }
                    else {
                        ajs.dbg.log(ajs.dbg.LogType.Error, 0, "Load end handler is not function", this);
                        throw new resources.LoadEndHandlerIsNotFunctionException();
                    }
                }
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.resources", this);
            };
            return ResourceLoader;
        }());
        resources.ResourceLoader = ResourceLoader;
    })(resources = ajs.resources || (ajs.resources = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var resources;
    (function (resources) {
        "use strict";
        /**
         * Represents the browser local storage (persistent until explicitly cleared)
         */
        var StorageLocal = (function (_super) {
            __extends(StorageLocal, _super);
            function StorageLocal() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object.defineProperty(StorageLocal.prototype, "type", {
                /** Returns type of the storage */
                get: function () { return resources.STORAGE_TYPE.LOCAL; },
                enumerable: true,
                configurable: true
            });
            /** Constructs the StorageLocal object */
            StorageLocal.prototype._initialize = function () {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.resources", this);
                this._supported = window.localStorage !== undefined;
                if (this._supported) {
                    ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.resources", this, "Local storage is supported.");
                    this._storageProvider = window.localStorage;
                    this._usedSpace = 0;
                    this._resources = this._getResourcesInfo();
                }
                else {
                    ajs.dbg.log(ajs.dbg.LogType.Warning, 0, "ajs.resources", this, "Local storage is not supported!");
                }
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.resources", this);
            };
            return StorageLocal;
        }(resources.AjsStorage));
        resources.StorageLocal = StorageLocal;
    })(resources = ajs.resources || (ajs.resources = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var resources;
    (function (resources) {
        "use strict";
        /**
         * Represents the memory storage (persistent until reload / close)
         */
        var StorageMemory = (function (_super) {
            __extends(StorageMemory, _super);
            function StorageMemory() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object.defineProperty(StorageMemory.prototype, "type", {
                /** Returns type of the storage */
                get: function () { return resources.STORAGE_TYPE.MEMORY; },
                enumerable: true,
                configurable: true
            });
            /** Constructs the StorageLocal object */
            StorageMemory.prototype._initialize = function () {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.resources", this);
                this._supported = true;
                if (this._supported) {
                    this._storageProvider = new resources.MemoryStorageProvider();
                    this._usedSpace = 0;
                    this._resources = this._getResourcesInfo();
                }
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.resources", this);
            };
            return StorageMemory;
        }(resources.AjsStorage));
        resources.StorageMemory = StorageMemory;
    })(resources = ajs.resources || (ajs.resources = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var resources;
    (function (resources) {
        "use strict";
        /**
         * Represents the browser session storage (persistent until window is closed)
         */
        var StorageSession = (function (_super) {
            __extends(StorageSession, _super);
            function StorageSession() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object.defineProperty(StorageSession.prototype, "type", {
                /** Returns type of the storage */
                get: function () { return resources.STORAGE_TYPE.SESSION; },
                enumerable: true,
                configurable: true
            });
            /** Constructs the StorageSession object */
            StorageSession.prototype._initialize = function () {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.resources", this);
                this._supported = window.sessionStorage !== undefined;
                if (this._supported) {
                    ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.resources", this, "Session storage is supported.");
                    this._storageProvider = window.sessionStorage;
                    this._usedSpace = 0;
                    this._resources = this._getResourcesInfo();
                }
                else {
                    ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.resources", this, "Session storage is not supported!");
                }
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.resources", this);
            };
            return StorageSession;
        }(resources.AjsStorage));
        resources.StorageSession = StorageSession;
    })(resources = ajs.resources || (ajs.resources = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var navigation;
    (function (navigation) {
        "use strict";
    })(navigation = ajs.navigation || (ajs.navigation = {}));
})(ajs || (ajs = {}));
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
/**
 * Navigation namespace hold the Navigator object and IRedirection interface
 * <p>
 * Navigator takes care of capturing the browser navigation events when
 * Forward / Back buttons are pressed.
 * </p>
 * <p>
 * Navigator should be also used by the application to navigate over the page
 * so all a hrefs should be modified to
 * &lt;a href="link" onclick="return ajs.Framework.navigator.linkClicked(event);"&gt;...
 * Button presses or another dynamic events leading to the navigaton
 * should use the #see {ajs.navigation.navigator.Navigate} Navigator method in
 * order to keep the framework state consistent with the browser.
 * <p>
 * Navigator also takes care of redirections so if the path of the url being
 * navigated is found in registered redirectons table the redirection to the
 * target will occur.
 * <p>
 * <p>
 * Navigator passes the actual path to the #see {Router}
 * which will take care about instancing the correct view model. During the boot,
 * prior the application is started the Navigator is disabled to prevent any
 * problems with navigating to uninitialized application.
 * </p>
 * <p>
 * Navigator redirections can be configured in the #see {IAjsConfig AJS Framework
 * configuration}. Redirections could be also registered using the #see {
 * Navigator.registerRedirection } method.
 * </p>
 */
var ajs;
(function (ajs) {
    var navigation;
    (function (navigation) {
        "use strict";
        /**
         * Navigator is used for navigation throughout the Ajs Application
         * <p>
         * Navigator takes care of capturing the browser navigation events when
         * Forward / Back buttons are pressed.
         * </p>
         * <p>
         * Navigator should be also used by the application to navigate over it. All a
         * href links should be changed to
         * &lt;<a href="link" onclick="return ajs.Framework.navigator.linkClicked(event);&gt;
         * Also, all button presses or another dynamic events leading to the navigaton
         * should use the same method in order to keep the browser state consistent
         * with the framework. Links in templates are replaced automatically to correct value
         * so it is not necessary to follow this rule there.
         * <p>
         * Navigator also takes care of redirections so if the path of the url being
         * navigated is found in registered redirectons table the redirection to the
         * target will occur.
         * <p>
         * <p>
         * Navigator passes the actual path to the #see {ajs.routing.Router}
         * which will take care about instancing the correct view model. During the boot,
         * prior the application is started the Navigator is disabled to prevent any
         * problems with navigating to uninitialized application.
         * </p>
         * <p>
         * Navigator redirections can be configured in the #see {IAjsConfig Ajs Framework
         * configuration}. Redirections could be also registered using the #see {
         * Navigator.registerRedirection } method.
         * </p>
         */
        var Navigator = (function () {
            /**
             * Constructs the object of the Navigator class
             * @param router Router to be used to forward navigation events
             * @param redirections List of redirections to be registered (taken from #see {IAjsConfig ajs config});
             */
            function Navigator(router, redirections) {
                var _this = this;
                ajs.dbg.log(ajs.dbg.LogType.Constructor, 0, "ajs.navigation", this);
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.navigation", this, "Registering redirections (" + (redirections ? redirections.length : 0) + ")", redirections);
                this._canNavigate = false;
                this._router = router;
                this._lastUrl = null;
                this._redirections = redirections || [];
                ajs.dbg.log(ajs.dbg.LogType.DomAddListener, 0, "ajs.navigation", this, "window.popstate");
                window.addEventListener("popstate", function (event) { _this._onPopState(event); });
                ajs.dbg.log(ajs.dbg.LogType.DomAddListener, 0, "ajs.navigation", this, "window.hashchange");
                window.addEventListener("hashchange", function (event) { _this._onHashChange(event); });
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.navigation", this);
            }
            Object.defineProperty(Navigator.prototype, "lastUrl", {
                /** Returns last url the navigator captured during various events */
                get: function () { return this._lastUrl; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Navigator.prototype, "redirections", {
                /** List of registered #see {IRedirection redirections#} */
                get: function () { return this._redirections; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Navigator.prototype, "router", {
                get: function () { return this.router; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Navigator.prototype, "canNavigate", {
                /** Returns information if the navigator should process navigation events */
                get: function () { return this._canNavigate; },
                /** Sets information if the navigator should process navigation events */
                set: function (value) { this._canNavigate = value; },
                enumerable: true,
                configurable: true
            });
            /**
             * Registers path for redirection
             * @param path Path to be redirected to a different path
             * @param target Target path
             */
            Navigator.prototype.registerRedirection = function (path, target) {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.navigation", this);
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.navigation", this, "Registering redirection (" + path + " : " + target + ")");
                this._redirections.push({
                    path: path,
                    target: target
                });
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.navigation", this);
            };
            /**
             * Called when any navigation event occurs to redirect a request or to forward the navigation information to the router
             */
            Navigator.prototype.navigated = function () {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.navigation", this);
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.navigation", this, "Navigation event occured: " + window.location.href);
                if (window.location.href !== this._lastUrl && this._canNavigate) {
                    this._lastUrl = window.location.href;
                    if (!this._redirect(window.location.pathname)) {
                        this._router.route();
                    }
                }
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.navigation", this);
            };
            /**
             * Navigates to specified url
             * @param url Target URL
             */
            Navigator.prototype.navigate = function (url) {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.navigation", this);
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.navigation", this, "Navigating to: " + url);
                if (window.location.href !== url) {
                    this._lastUrl = url;
                    window.history.pushState({}, "", url);
                    if (!this._redirect(url)) {
                        this._router.route();
                    }
                }
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.navigation", this);
            };
            /**
             * Should be called every time the user click the link to navigate
             * to appropriate location or open new tab / window
             * @param event The click MouseEvent event
             */
            Navigator.prototype.linkClicked = function (event) {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.navigation", this);
                if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
                    try {
                        var element = event.target;
                        while (element !== null && !(element instanceof HTMLAnchorElement)) {
                            element = element.parentElement;
                        }
                        if (element instanceof HTMLAnchorElement) {
                            ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.navigation", this, "Link clicked: " + element.href, element);
                            this.navigate(element.pathname);
                        }
                    }
                    catch (e) {
                        throw new Error(e);
                    }
                    finally {
                        ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.navigation", this);
                        return false;
                    }
                }
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.navigation", this);
                return true;
            };
            /**
             * Window.onpopstate event listener
             * @param event Event data passed from the browser
             */
            Navigator.prototype._onPopState = function (event) {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.navigation", this);
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.navigation", this, "window.popstate event occured");
                this.navigated();
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.navigation", this);
            };
            /**
             * Window.onhashchange event listener
             * @param event Event data passed from the browser
             */
            Navigator.prototype._onHashChange = function (event) {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.navigation", this);
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.navigation", this, "window.hashchange event occured");
                this.navigated();
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.navigation", this);
            };
            /**
             * Called internally to check if the url is registered for redirection and redirect to correct target it if so
             * @param url Current url to be checked
             * @returns true if redirection was performed or false if the ure was not found in registered paths for redirection
             */
            Navigator.prototype._redirect = function (url) {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.navigation", this);
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.navigation", this, "Redirecting to " + url);
                var redirected = false;
                for (var i = 0; i < this._redirections.length; i++) {
                    if (this._redirections[i].path === url) {
                        window.history.pushState({}, "", this._redirections[i].target);
                        redirected = true;
                        this._router.route();
                        break;
                    }
                }
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.navigation", this);
                return redirected;
            };
            return Navigator;
        }());
        navigation.Navigator = Navigator;
    })(navigation = ajs.navigation || (ajs.navigation = {}));
})(ajs || (ajs = {}));
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
/**
 * Model View View Component Model namespace
 * asd
 */
var ajs;
(function (ajs) {
    var mvvm;
    (function (mvvm) {
        var model;
        (function (model) {
            "use strict";
        })(model = mvvm.model || (mvvm.model = {}));
    })(mvvm = ajs.mvvm || (ajs.mvvm = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var mvvm;
    (function (mvvm) {
        var viewmodel;
        (function (viewmodel) {
            "use strict";
            var VisualComponentNotRegisteredException = (function (_super) {
                __extends(VisualComponentNotRegisteredException, _super);
                function VisualComponentNotRegisteredException() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return VisualComponentNotRegisteredException;
            }(Error));
            viewmodel.VisualComponentNotRegisteredException = VisualComponentNotRegisteredException;
            var InvalidAttributeIfValueException = (function (_super) {
                __extends(InvalidAttributeIfValueException, _super);
                function InvalidAttributeIfValueException() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return InvalidAttributeIfValueException;
            }(Error));
            viewmodel.InvalidAttributeIfValueException = InvalidAttributeIfValueException;
        })(viewmodel = mvvm.viewmodel || (mvvm.viewmodel = {}));
    })(mvvm = ajs.mvvm || (ajs.mvvm = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var mvvm;
    (function (mvvm) {
        var viewmodel;
        (function (viewmodel) {
            "use strict";
        })(viewmodel = mvvm.viewmodel || (mvvm.viewmodel = {}));
    })(mvvm = ajs.mvvm || (ajs.mvvm = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var mvvm;
    (function (mvvm) {
        var viewmodel;
        (function (viewmodel) {
            "use strict";
        })(viewmodel = mvvm.viewmodel || (mvvm.viewmodel = {}));
    })(mvvm = ajs.mvvm || (ajs.mvvm = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var mvvm;
    (function (mvvm) {
        var viewmodel;
        (function (viewmodel) {
            "use strict";
        })(viewmodel = mvvm.viewmodel || (mvvm.viewmodel = {}));
    })(mvvm = ajs.mvvm || (ajs.mvvm = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var mvvm;
    (function (mvvm) {
        var viewmodel;
        (function (viewmodel) {
            "use strict";
        })(viewmodel = mvvm.viewmodel || (mvvm.viewmodel = {}));
    })(mvvm = ajs.mvvm || (ajs.mvvm = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var mvvm;
    (function (mvvm) {
        var viewmodel;
        (function (viewmodel) {
            "use strict";
        })(viewmodel = mvvm.viewmodel || (mvvm.viewmodel = {}));
    })(mvvm = ajs.mvvm || (ajs.mvvm = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var mvvm;
    (function (mvvm) {
        var viewmodel;
        (function (viewmodel) {
            "use strict";
        })(viewmodel = mvvm.viewmodel || (mvvm.viewmodel = {}));
    })(mvvm = ajs.mvvm || (ajs.mvvm = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var mvvm;
    (function (mvvm) {
        var viewmodel;
        (function (viewmodel) {
            "use strict";
        })(viewmodel = mvvm.viewmodel || (mvvm.viewmodel = {}));
    })(mvvm = ajs.mvvm || (ajs.mvvm = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var mvvm;
    (function (mvvm) {
        var viewmodel;
        (function (viewmodel) {
            "use strict";
        })(viewmodel = mvvm.viewmodel || (mvvm.viewmodel = {}));
    })(mvvm = ajs.mvvm || (ajs.mvvm = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var mvvm;
    (function (mvvm) {
        var viewmodel;
        (function (viewmodel) {
            "use strict";
        })(viewmodel = mvvm.viewmodel || (mvvm.viewmodel = {}));
    })(mvvm = ajs.mvvm || (ajs.mvvm = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var mvvm;
    (function (mvvm) {
        var viewmodel;
        (function (viewmodel) {
            "use strict";
            var ViewComponent = (function () {
                function ViewComponent(view, viewComponentManager, id, componentViewId, parentComponent, visualComponent, state) {
                    // throw exception if the visual component was not assigned
                    if (visualComponent === null) {
                        throw new ajs.mvvm.view.VisualComponentNotRegisteredException(null);
                    }
                    ajs.dbg.log(ajs.dbg.LogType.Constructor, 0, "ajs.mvvm.viewmodel", this);
                    // initialize properties
                    this.componentViewId = componentViewId;
                    this.ajs = {
                        stylesheetsApplied: false,
                        initialized: false,
                        id: id,
                        view: view,
                        viewComponentManager: viewComponentManager,
                        parentComponent: parentComponent,
                        visualComponent: visualComponent,
                        templateElement: visualComponent.component,
                        key: null,
                        stateChanged: false,
                        stateKeys: [],
                        stateChangePrevented: false,
                        stateQueue: [],
                        processingStateQueue: false,
                        hasVisualStateTransition: false,
                        visualStateTransitionRunning: false,
                        visualStateTransitionBeginHandler: null,
                        transitionNewElement: null,
                        transitionOldElement: null,
                        // setup tag attribute processors for the_processAttributes method
                        attributeProcessors: {
                            "__default": this._attrDefault,
                            "component": this._attrComponent,
                            "if": this._attrIf,
                            "onclick": this._attrEventHandler,
                            "onmousedown": this._attrEventHandler,
                            "onmouseup": this._attrEventHandler,
                            "onkeydown": this._attrEventHandler,
                            "onkeyup": this._attrEventHandler,
                            "onchange": this._attrEventHandler,
                            "oninput": this._attrEventHandler,
                            "ontouchmove_ajs": this._attrEventHandler,
                            // non-standard tag events
                            "onanimationend": this._attrEventHandler,
                            // ajs specific events
                            "onstatetransitionbegin": this._attrTransitionBeginHanler
                        }
                    };
                    // initialize the component -> it can do some async operations so it have to
                    // set initialized to true once it is done            
                    this._initialize();
                    this._applyTemplateStylesheets();
                    // apply passed or default state
                    if (state && state !== null) {
                        var newState = ajs.utils.DeepMerge.merge(this._defaultState(), state);
                        ajs.utils.Obj.assign(state, newState);
                        this._applyState(state);
                    }
                    else {
                        this._applyState(this._defaultState());
                    }
                    // indicate the state was changed
                    this.ajs.stateChanged = true;
                    // ???????????????????????????????????????????????????????????????
                    // this.ajsProperties.view.notifyParentsChildrenStateChange(this._ajsParentComponent);
                    // ???????????????????????????????????????????????????????????????
                    ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.mvvm.viewmodel", this);
                }
                ViewComponent.prototype._applyTemplateStylesheets = function () {
                    var _this = this;
                    ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.mvvm.viewmodel", this);
                    // asynchronously apply style sheets from the view component template to the target document
                    this.ajs.view.documentManager.applyStyleSheetsFromTemplate(this.ajs.visualComponent.template).then(
                    // once style sheets are applied render the root view component
                    function () {
                        _this.ajs.stylesheetsApplied = true;
                    }, 
                    // if adding of stylesheets failed, log it and re-throw the exception
                    function (reason) {
                        ajs.dbg.log(ajs.dbg.LogType.Error, 0, "ajs.mvvm.view", _this, "Adding of template stylesheets failed: " +
                            ", Template: " + _this.ajs.visualComponent.template.name, reason, _this);
                        throw reason;
                    });
                    ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.mvvm.viewmodel", this);
                };
                ViewComponent.prototype._initialize = function () {
                    return;
                };
                ViewComponent.prototype.destroy = function () {
                    // remove all children components
                    this.clearState(false);
                    // finalize the component
                    this._finalize();
                    // if the component was rendered, remove it from the DOM tree
                    this.ajs.view.documentManager.removeNodeByUniqueId(this.componentViewId);
                    // unregister component instance from ViewComponent manager
                    ajs.Framework.viewComponentManager.removeComponentInstance(this);
                };
                ;
                ViewComponent.prototype._finalize = function () {
                    ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.mvvm.viewmodel", this);
                    ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.mvvm.viewmodel", this, "_finalize not overriden. Nothing to do.");
                    ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.mvvm.viewmodel", this);
                    return;
                };
                ViewComponent.prototype._defaultState = function () {
                    ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.mvvm.viewmodel", this);
                    ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.mvvm.viewmodel", this, "_defaultState not overriden. Setting {}");
                    ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.mvvm.viewmodel", this);
                    return {};
                };
                ViewComponent.prototype.setState = function (state) {
                    ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.mvvm.viewmodel", this);
                    ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.mvvm.viewmodel", this, "Setting component state: " + ajs.utils.getClassName(this) + ", id: " + this.ajs.id, ", viewId: " + this.componentViewId, state);
                    if (this.ajs.visualStateTransitionRunning) {
                        this._ajsVisualStateTransitionCancel();
                    }
                    this.ajs.stateQueue.push(state);
                    this._processStateQueue();
                    ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.mvvm.viewmodel", this);
                };
                ViewComponent.prototype._setPreventStateChange = function (value) {
                    ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.mvvm.viewmodel", this);
                    ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.mvvm.viewmodel", this, "Setting prevent state change to " + value + " (" + ajs.utils.getClassName(this) + ", id: " + this.ajs.id, ", viewId: " + this.componentViewId + ")");
                    this.ajs.stateChangePrevented = value;
                    var children = this.ajs.viewComponentManager.getChildrenComponentInstances(this);
                    for (var i = 0; i < children.length; i++) {
                        children[i]._setPreventStateChange(value);
                    }
                    if (!value) {
                        this._processStateQueue();
                    }
                    ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.mvvm.viewmodel", this);
                };
                ViewComponent.prototype._processStateQueue = function () {
                    ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.mvvm.viewmodel", this);
                    if (this.ajs.stateQueue.length === 0) {
                        ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.mvvm.viewmodel", this);
                        return;
                    }
                    if (this.ajs.processingStateQueue) {
                        ajs.dbg.log(ajs.dbg.LogType.Warning, 0, "ajs.mvvm.viewmodel", this, "Processing state already running!");
                        ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.mvvm.viewmodel", this);
                        return;
                    }
                    if (this.ajs.stateChangePrevented) {
                        ajs.dbg.log(ajs.dbg.LogType.Warning, 0, "ajs.mvvm.viewmodel", this, "State change is prevented: " + ajs.utils.getClassName(this) + ", id: " + this.ajs.id, ", viewId: " + this.componentViewId);
                        ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.mvvm.viewmodel", this);
                        return;
                    }
                    this.ajs.processingStateQueue = true;
                    ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.mvvm.viewmodel", this, "Processing state queue: " + ajs.utils.getClassName(this) + ", id: " + this.ajs.id, ", viewId: " + this.componentViewId + ", " +
                        this.ajs.stateQueue.length + " state changes queued", ajs.state);
                    while (this.ajs.stateQueue.length > 0) {
                        if (this.ajs.stateChangePrevented) {
                            ajs.dbg.log(ajs.dbg.LogType.Warning, 0, "ajs.mvvm.viewmodel", this, "State change is prevented: " + ajs.utils.getClassName(this) + ", id: " + this.ajs.id, ", viewId: " + this.componentViewId);
                            ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.mvvm.viewmodel", this);
                            return;
                        }
                        var state_1 = this.ajs.stateQueue.shift();
                        ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.mvvm.viewmodel", this, "Setting component state: " + ajs.utils.getClassName(this) + ", id: " + this.ajs.id, ", viewId: " + this.componentViewId + ", " +
                            this.ajs.stateQueue.length + " state changes queued", state_1);
                        if (this.ajs.hasVisualStateTransition) {
                            var node = this.ajs.view.documentManager.getTargetNodeByUniqueId(this.componentViewId);
                            this.ajs.transitionOldElement = node.cloneNode(true);
                        }
                        this.ajs.view.stateChangeBegin(this);
                        this._applyState(state_1);
                        this.ajs.view.stateChangeEnd(this);
                    }
                    this.ajs.processingStateQueue = false;
                    ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.mvvm.viewmodel", this);
                };
                /**
                 * Removes all state properties and destroys children component tree
                 * @param render
                 */
                ViewComponent.prototype.clearState = function (render) {
                    if (render) {
                        this.ajs.view.stateChangeBegin(this);
                    }
                    while (this.ajs.stateKeys.length > 0) {
                        if (this[this.ajs.stateKeys[0]] instanceof ViewComponent) {
                            this[this.ajs.stateKeys[0]].destroy();
                        }
                        if (this[this.ajs.stateKeys[0]] instanceof Array) {
                            for (var i = 0; i < this[this.ajs.stateKeys[0]].length; i++) {
                                if (this[this.ajs.stateKeys[0]][i] instanceof ViewComponent) {
                                    this[this.ajs.stateKeys[0]][i].destroy();
                                }
                            }
                        }
                        delete (this[this.ajs.stateKeys[0]]);
                        this.ajs.stateKeys.splice(0, 1);
                    }
                    if (render) {
                        this.ajs.stateChanged = true;
                        this.ajs.view.stateChangeEnd(this);
                    }
                };
                /**
                 * This method can be overriden to filter the full state before it is applied
                 * @param state
                 */
                ViewComponent.prototype._filterState = function (state) {
                    return state;
                };
                /**
                 * This method can be overriden to remap the state key or modify the state value
                 * @param key name of the key
                 * @param state state
                 */
                ViewComponent.prototype._filterStateKey = function (key, state) {
                    return {
                        filterApplied: false,
                        key: null,
                        state: null
                    };
                };
                /**
                 * This method can be overriden to remap the array state key or modify the state value
                 * @param state
                 */
                ViewComponent.prototype._filterStateArrayItem = function (key, index, length, state) {
                    return {
                        filterApplied: false,
                        key: null,
                        state: null
                    };
                };
                ViewComponent.prototype._applyState = function (state) {
                    // perform the state filtering
                    state = this._filterState(state);
                    // apply the state
                    if (state && state !== null) {
                        for (var key in state) {
                            if (state.hasOwnProperty(key)) {
                                // perform the state key/value filtering
                                var filteredState = this._filterStateKey(key, state[key]);
                                if (filteredState.filterApplied) {
                                    delete state[key];
                                    key = filteredState.key;
                                    state[key] = filteredState.state;
                                }
                                // if the state property exists in this ViewComponent, update it
                                if (this.hasOwnProperty(key)) {
                                    // update children component state
                                    if (this[key] instanceof ViewComponent) {
                                        this[key].setState(state[key]);
                                    }
                                    else {
                                        // set or update array of children components
                                        if (state[key] instanceof Array &&
                                            this.ajs.visualComponent.children.hasOwnProperty(key) &&
                                            this[key] instanceof Array) {
                                            // delete all components which does not exist in the array anymore
                                            var i = 0;
                                            while (i < this[key].length) {
                                                var del = true;
                                                // check if component still should exist
                                                for (var j = 0; j < state[key].length; j++) {
                                                    if (this[key][i].key === state[key][j].key) {
                                                        del = false;
                                                        break;
                                                    }
                                                }
                                                // delete component
                                                if (del) {
                                                    this[key][i].destroy();
                                                    this.ajs.view.notifyParentsChildrenStateChange(this[key][i].ajs.parentComponent);
                                                    this[key].splice(i, 1);
                                                    if (this[key].length === 0) {
                                                        this.ajs.stateKeys.splice(this.ajs.stateKeys.indexOf(key), 1);
                                                    }
                                                }
                                                else {
                                                    i++;
                                                }
                                            }
                                            // update and insert new components
                                            if (this.ajs.stateKeys.indexOf(key) === -1) {
                                                this.ajs.stateKeys.push(key);
                                            }
                                            for (i = 0; i < state[key].length; i++) {
                                                // update component state
                                                if (this[key].length > i && this[key][i].key === state[key][i].key) {
                                                    this[key][i].setState(state[key][i]);
                                                }
                                                else {
                                                    // create new component
                                                    var newViewComponent = this._createViewComponent(key, this.ajs.visualComponent.children[key], state[key][i]);
                                                    this[key].splice(i, 0, newViewComponent);
                                                }
                                            }
                                            // set or update current component property
                                        }
                                        else {
                                            if (this.ajs.stateKeys.indexOf(key) === -1) {
                                                this.ajs.stateKeys.push(key);
                                            }
                                            if (this[key] !== state[key]) {
                                                this[key] = state[key];
                                                this.ajs.stateChanged = true;
                                                this.ajs.view.notifyParentsChildrenStateChange(this.ajs.parentComponent);
                                            }
                                        }
                                    }
                                    // if the property does not exist, create it
                                }
                                else {
                                    // if the state is setting state of children component
                                    if (this.ajs.visualComponent.children.hasOwnProperty(key)) {
                                        // create array of components
                                        if (state[key] instanceof Array) {
                                            this[key] = [];
                                            this.ajs.stateKeys.push(key);
                                            for (var i = 0; i < state[key].length; i++) {
                                                var filteredState_1 = this._filterStateArrayItem(key, i, state[key].length, state[key][i]);
                                                if (filteredState_1.filterApplied && filteredState_1.state instanceof Array) {
                                                    var j = 0;
                                                    while (j < filteredState_1.state.length) {
                                                        var newViewComponent = void 0;
                                                        newViewComponent = this._createViewComponent(key, this.ajs.visualComponent.children[key], filteredState_1.state[j]);
                                                        if (j === 0) {
                                                            this[key][i] = newViewComponent;
                                                        }
                                                        else {
                                                            if (i < state[key].length - 1) {
                                                                this[key].splice(i + 1, 0, newViewComponent);
                                                            }
                                                            else {
                                                                this[key].push(newViewComponent);
                                                            }
                                                            i++;
                                                        }
                                                        j++;
                                                    }
                                                }
                                                else {
                                                    var newViewComponent = void 0;
                                                    newViewComponent = this._createViewComponent(key, this.ajs.visualComponent.children[key], filteredState_1.filterApplied && filteredState_1.key === key ? filteredState_1.state : state[key][i]);
                                                    this[key][i] = newViewComponent;
                                                }
                                            }
                                            // create a component and apply a state to it
                                        }
                                        else {
                                            this[key] = this._createViewComponent(key, this.ajs.visualComponent.children[key], state[key]);
                                            this.ajs.stateKeys.push(key);
                                        }
                                    }
                                    else {
                                        // if the state is array, try to filter the array and check if the state is applicable after array filtering
                                        var filteredStates = [];
                                        if (state[key] instanceof Array) {
                                            for (var i = 0; i < state[key].length; i++) {
                                                var filteredState_2 = this._filterStateArrayItem(key, i, state[key].length, state[key][i]);
                                                if (filteredState_2.filterApplied) {
                                                    if (filteredState_2.key !== key) {
                                                        filteredStates.push(filteredState_2);
                                                    }
                                                }
                                            }
                                        }
                                        // build a new filtered state
                                        if (filteredStates.length > 0) {
                                            var filteredState_3 = {};
                                            for (var i = 0; i < filteredStates.length; i++) {
                                                if (filteredState_3[filteredStates[i].key] === undefined) {
                                                    filteredState_3[filteredStates[i].key] = [];
                                                }
                                                if (filteredStates[i].state instanceof Array) {
                                                    for (var j = 0; j < filteredStates[i].state.length; j++) {
                                                        filteredState_3[filteredStates[i].key].push(filteredStates[i].state[j]);
                                                    }
                                                }
                                                else {
                                                    filteredState_3[filteredStates[i].key].push(filteredStates[i].state);
                                                }
                                            }
                                            // try to reapply the filtered state
                                            this._applyState(filteredState_3);
                                        }
                                        else {
                                            this[key] = state[key];
                                            this.ajs.stateKeys.push(key);
                                            this.ajs.stateChanged = true;
                                            this.ajs.view.notifyParentsChildrenStateChange(this.ajs.parentComponent);
                                        }
                                    }
                                }
                            }
                        }
                    }
                };
                /*protected _createViewComponent(
                    id: string,
                    viewComponentInfo: ajs.templating.IVisualComponentChildInfo,
                    state: IViewStateSet): Promise<ViewComponent> {
        
                    let name: string = viewComponentInfo.tagName;
                    if (name === "COMPONENT" && viewComponentInfo.nameAttribute) {
                        name = viewComponentInfo.nameAttribute;
                    }
        
                    return this.ajsProperties.viewComponentManager.createViewComponent(name, id, this.ajsProperties.view, this, state);
                }*/
                ViewComponent.prototype._createViewComponent = function (id, viewComponentInfo, state) {
                    var name = viewComponentInfo.tagName;
                    if (name === "COMPONENT" && viewComponentInfo.nameAttribute) {
                        name = viewComponentInfo.nameAttribute;
                    }
                    return this.ajs.viewComponentManager.createViewComponent(name, id, this.ajs.view, this, state);
                };
                /**
                 * render the ViewComponent to the target element (appenChild is used to add the element)
                 * @param parentElement element to be used as a parent for the component
                 * @param usingShadowDom information if the render is performed to the main DOM or shadow DOM
                 * @param clearStateChangeOnly informs renderer that rendering should not be done, just state changed flag should be cleared
                 */
                ViewComponent.prototype.render = function (parentElement, clearStateChangeOnly) {
                    var node;
                    // render the tree of the visual component related to the current view component
                    node = this._renderTree(this.ajs.visualComponent.component, parentElement, clearStateChangeOnly);
                    // reset the dirty state after change
                    this.ajs.stateChanged = false;
                    // if the render was not called just because of reseting the state change flag
                    // set view component data and return the view component
                    if (!clearStateChangeOnly) {
                        if (node instanceof HTMLElement) {
                            var componentNode = node;
                            componentNode.ajsData = componentNode.ajsData || {};
                            componentNode.ajsData.component = this;
                            componentNode.ajsData.ownerComponent = this;
                            return node;
                        }
                        else {
                            return null;
                        }
                    }
                    else {
                        return null;
                    }
                };
                ViewComponent.prototype._renderTree = function (sourceNode, targetNode, clearStateChangeOnly) {
                    var id = null;
                    if (sourceNode.nodeType === Node.ELEMENT_NODE) {
                        id = sourceNode.getAttribute("id");
                    }
                    // if the tag has attribute id, check if it is component or array of components
                    if (id !== null && this[id] !== undefined && (this[id] instanceof ViewComponent || this[id] instanceof Array)) {
                        // if it is a view component, render it
                        if (this[id] instanceof ViewComponent) {
                            this[id].render(targetNode, clearStateChangeOnly);
                        }
                        else {
                            // if it is an array
                            if (this[id] instanceof Array) {
                                // go through it and render all view components existing in the array
                                for (var i = 0; i < this[id].length; i++) {
                                    if (this[id][i] instanceof ViewComponent) {
                                        this[id][i].render(targetNode, clearStateChangeOnly);
                                    }
                                }
                            }
                        }
                    }
                    else {
                        // add node to target document (according to rules in the template)
                        var addedNode = void 0;
                        if (clearStateChangeOnly) {
                            addedNode = null;
                        }
                        else {
                            addedNode = this._renderNode(sourceNode, targetNode);
                        }
                        // check if the node is root node of the view component and if the component and its
                        // children components didn't change, just render it with skip flag and don't render
                        // children tags
                        var skip = sourceNode === this.ajs.visualComponent.component && !this.ajs.stateChanged;
                        if (addedNode !== null && skip) {
                            addedNode.ajsData = addedNode.ajsData || {};
                            addedNode.ajsData.skipUpdate = true;
                        }
                        // if the node was added, go through all its children
                        if (addedNode !== null && !skip) {
                            for (var i = 0; i < sourceNode.childNodes.length; i++) {
                                this._renderTree(sourceNode.childNodes.item(i), addedNode, false);
                            }
                            // otherwise, no children compnents in this children branch will be rendered but it is necessary to
                            // clear the _stateChange property on them
                        }
                        else {
                            for (var i = 0; i < sourceNode.childNodes.length; i++) {
                                this._renderTree(sourceNode.childNodes.item(i), null, true);
                            }
                        }
                        // return the added node - for the top level call it will be a root node of the view component
                        return addedNode;
                    }
                };
                /**
                 * clone/adopt/process the node from the template and add it to the document
                 * @param sourceNode node in the VisualComponent template
                 * @param targetNode node in the targer document
                 */
                ViewComponent.prototype._renderNode = function (sourceNode, targetNode) {
                    var clonedNode = sourceNode.cloneNode(false);
                    var adoptedNode = targetNode.ownerDocument.adoptNode(clonedNode);
                    var processedNode = this._processNode(adoptedNode);
                    if (processedNode && processedNode !== null) {
                        if (processedNode instanceof HTMLElement) {
                            processedNode.ajsData = processedNode.ajsData || {};
                            processedNode.ajsData.ownerComponent = this;
                        }
                        targetNode.appendChild(processedNode);
                    }
                    return processedNode;
                };
                /**
                 * process the node - see _processText and _processElement methods bellow for detail
                 * @param node The node in the template to be processed
                 */
                ViewComponent.prototype._processNode = function (node) {
                    switch (node.nodeType) {
                        case Node.ELEMENT_NODE:
                            return this._processElement(node);
                        case Node.TEXT_NODE:
                            return this._processText(node);
                    }
                };
                /**
                 * replace all template {} tags with the state value from the ViewComponent appropriate property
                 * @param node
                 */
                ViewComponent.prototype._processText = function (node) {
                    // extract all state property names from the template tag
                    var props = node.nodeValue.match(/{(.*?)}/g);
                    // and if any, locate them in state and replace the template text to state data
                    if (props !== null) {
                        // for all discovered state property names
                        for (var i = 0; i < props.length; i++) {
                            // use only the name without {} characters
                            var propName = props[i].substring(1, props[i].length - 1);
                            // locate the property name in the view component and set the correct value to the text node
                            if (this[propName] !== undefined && this[propName] !== null) {
                                node.nodeValue = node.nodeValue.replace(props[i], this[propName]);
                            }
                            else {
                                node.nodeValue = node.nodeValue.replace(props[i], "");
                            }
                        }
                    }
                    // if there is HTML in the node, replace the node by the HTML
                    if (node.nodeValue.substr(0, 8) === "#ASHTML:") {
                        var asHtml = document.createElement("ashtml");
                        asHtml.innerHTML = node.nodeValue.substr(8);
                        node = asHtml;
                    }
                    return node;
                };
                ViewComponent.prototype._linkMouseDown = function (e) {
                    e.returnValue = ajs.Framework.navigator.linkClicked(e);
                    if (!e.returnValue) {
                        e.cancelBubble = true;
                        e.preventDefault();
                        e.stopPropagation();
                    }
                };
                /**
                 * process the template tag
                 * @param element Template element to be processed
                 */
                ViewComponent.prototype._processElement = function (element) {
                    var _this = this;
                    element = this._processAttributes(element);
                    if (element instanceof HTMLAnchorElement) {
                        if (element.hasAttribute("href")) {
                            var href = element.getAttribute("href");
                            if (href.substr(0, 4) !== "http") {
                                var domEventListenerInfo = {
                                    source: this.ajs.templateElement,
                                    eventType: "mousedown",
                                    eventListener: function (e) { _this._linkMouseDown(e); }
                                };
                                var node = element;
                                node.ajsData = node.ajsData || {};
                                if (!(node.ajsData.eventListeners instanceof Array)) {
                                    node.ajsData.eventListeners = [];
                                }
                                node.ajsData.eventListeners.push(domEventListenerInfo);
                                domEventListenerInfo = {
                                    source: this.ajs.templateElement,
                                    eventType: "click",
                                    eventListener: function (e) {
                                        e.returnValue = false;
                                        e.cancelBubble = true;
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }
                                };
                                node.ajsData.eventListeners.push(domEventListenerInfo);
                            }
                        }
                    }
                    return element;
                };
                /**
                 * process the template tag attributes
                 * if the attribute processor returns false the element will be removed from further rendering
                 * @param element
                 */
                ViewComponent.prototype._processAttributes = function (element) {
                    var toRemove = [];
                    for (var i = 0; i < element.attributes.length; i++) {
                        if (this.ajs.attributeProcessors[element.attributes[i].nodeName] !== undefined) {
                            if (!this.ajs.attributeProcessors[element.attributes[i].nodeName].call(this, toRemove, element.attributes[i])) {
                                return null;
                            }
                        }
                        else {
                            if (!this.ajs.attributeProcessors.__default.call(this, toRemove, element.attributes[i])) {
                                return null;
                            }
                        }
                    }
                    for (var i = 0; i < toRemove.length; i++) {
                        element.removeAttribute(toRemove[i]);
                        if (element.hasOwnProperty(toRemove[i])) {
                            element[toRemove[i]] = null;
                        }
                    }
                    return element;
                };
                ViewComponent.prototype._attrComponent = function (toRemove, attr) {
                    toRemove.push(attr.nodeName);
                    return true;
                };
                ViewComponent.prototype._attrIf = function (toRemove, attr) {
                    var condition = attr.nodeValue;
                    try {
                        /* tslint:disable */
                        if (!eval(condition)) {
                            /* tslint:enable */
                            return false;
                        }
                    }
                    catch (e) {
                        throw new viewmodel.InvalidAttributeIfValueException(e);
                    }
                    toRemove.push(attr.nodeName);
                    return true;
                };
                ViewComponent.prototype._attrDefault = function (toRemove, attr) {
                    var props = attr.nodeValue.match(/{(.*?)}/);
                    if (props !== null) {
                        var propName = props[1];
                        if (this[propName] !== undefined && this[propName] !== null) {
                            attr.nodeValue = attr.nodeValue.replace(props[0], this[propName]);
                        }
                        else {
                            toRemove.push(attr.nodeName);
                        }
                    }
                    return true;
                };
                ViewComponent.prototype._attrEventHandler = function (toRemove, attr) {
                    var _this = this;
                    toRemove.push(attr.nodeName);
                    if (this[attr.nodeValue] !== undefined && typeof this[attr.nodeValue] === "function") {
                        var eventType = attr.nodeName.substring(2);
                        if (eventType.indexOf("_ajs") !== -1) {
                            eventType = eventType.substr(0, eventType.indexOf("_ajs"));
                        }
                        var eventHandlerName_1 = attr.nodeValue;
                        var listener = function (e) {
                            _this[eventHandlerName_1](e);
                        };
                        var domEventListenerInfo = {
                            source: this.ajs.templateElement,
                            eventType: eventType,
                            eventListener: listener
                        };
                        var node = attr.ownerElement;
                        node.ajsData = node.ajsData || {};
                        if (!(node.ajsData.eventListeners instanceof Array)) {
                            node.ajsData.eventListeners = [];
                        }
                        node.ajsData.eventListeners.push(domEventListenerInfo);
                    }
                    return true;
                };
                ViewComponent.prototype._attrTransitionBeginHanler = function (toRemove, attr) {
                    if (this[attr.nodeValue] !== undefined && typeof this[attr.nodeValue] === "function") {
                        this.ajs.hasVisualStateTransition = true;
                        this.ajs.visualStateTransitionBeginHandler = this[attr.nodeValue];
                    }
                    toRemove.push(attr.nodeName);
                    return true;
                };
                ViewComponent.prototype.insertChildComponent = function (viewComponentName, id, state, placeholder, index) {
                    if (state === null) {
                        state = {};
                    }
                    var visualComponent;
                    visualComponent = this.ajs.viewComponentManager.templateManager.getVisualComponent(viewComponentName);
                    if (visualComponent === null) {
                        throw new ajs.mvvm.view.VisualComponentNotRegisteredException(viewComponentName);
                    }
                    this._visualComponentInsertChild(placeholder, viewComponentName, id, index);
                    var thisState = {};
                    thisState[id] = state;
                    this.setState(thisState);
                };
                ViewComponent.prototype.removeChildComponent = function (placeholder, id) {
                    if (this.hasOwnProperty(id) && this[id] instanceof ViewComponent) {
                        this._visualComponentRemoveChild(placeholder, id);
                        this[id]._destroy();
                        delete this[id];
                        var i = this.ajs.stateKeys.indexOf(id);
                        if (i !== -1) {
                            this.ajs.stateKeys.splice(i, 1);
                        }
                    }
                };
                ViewComponent.prototype._visualComponentInsertChild = function (placeholder, componentName, id, index) {
                    if (this.ajs.visualComponent.placeholders.hasOwnProperty(placeholder)) {
                        var ph = this.ajs.visualComponent.placeholders[placeholder].placeholder;
                        var vc = ph.ownerDocument.createElement(componentName);
                        vc.setAttribute("id", id);
                        if (index !== undefined) {
                            // !!!!!!
                        }
                        else {
                            ph.appendChild(vc);
                        }
                        this.ajs.visualComponent.children[id] = {
                            tagName: componentName,
                            nameAttribute: null
                        };
                    }
                };
                ViewComponent.prototype._visualComponentRemoveChild = function (placeholder, id) {
                    if (this.ajs.visualComponent.placeholders.hasOwnProperty(placeholder)) {
                        var ph = this.ajs.visualComponent.placeholders[placeholder].placeholder;
                        var vc = null;
                        for (var i = 0; i < ph.childElementCount; i++) {
                            if (ph.children.item(i).hasAttribute("id") && ph.children.item(i).getAttribute("id") === id) {
                                vc = ph.children.item(i);
                                break;
                            }
                        }
                        if (vc !== null) {
                            ph.removeChild(vc);
                            delete this.ajs.visualComponent.children[id];
                        }
                    }
                };
                ViewComponent.prototype.ajsVisualStateTransitionBegin = function (newElement) {
                    if (this.ajs.visualStateTransitionRunning) {
                        this._ajsVisualStateTransitionCancel();
                    }
                    this.ajs.visualStateTransitionRunning = true;
                    // this.ajsProperties.view.preventStateChange.push(this);
                    this.ajs.transitionNewElement = newElement;
                    if (typeof this.ajs.visualStateTransitionBeginHandler === "function") {
                        var transitionType = this.ajs.visualStateTransitionBeginHandler.call(this);
                        if (transitionType !== null) {
                            this._ajsVisualStateTransitionStart(transitionType);
                        }
                        else {
                            this._ajsVisualStateTransitionEnd();
                        }
                    }
                    else {
                        this._ajsVisualStateTransitionEnd();
                    }
                };
                ViewComponent.prototype._ajsVisualStateTransitionStart = function (transitionType) {
                    if (this.ajs.transitionOldElement instanceof HTMLElement &&
                        this.ajs.transitionNewElement instanceof HTMLElement) {
                        this.ajs.transitionNewElement.parentElement.insertBefore(this.ajs.transitionOldElement, this.ajs.transitionNewElement);
                        this.ajs.transitionOldElement.setAttribute("statetransitiontypeold", transitionType.oldComponent);
                        this.ajs.transitionNewElement.setAttribute("statetransitiontypenew", transitionType.newComponent);
                    }
                };
                ViewComponent.prototype._ajsVisualStateTransitionCancel = function () {
                    if (this.ajs.transitionNewElement) {
                        this._ajsVisualStateTransitionEnd();
                    }
                };
                ViewComponent.prototype._ajsVisualStateTransitionEnd = function () {
                    if (this.ajs.visualStateTransitionRunning &&
                        this.ajs.transitionOldElement instanceof HTMLElement &&
                        this._childElementExists(this.ajs.transitionOldElement.parentElement, this.ajs.transitionOldElement)) {
                        this.ajs.transitionOldElement.removeAttribute("statetransitiontypeold");
                        this.ajs.transitionNewElement.removeAttribute("statetransitiontypenew");
                    }
                    this.ajs.view.documentManager.removeNode(this.ajs.transitionOldElement);
                    this.ajs.transitionOldElement = null;
                    this.ajs.transitionNewElement = null;
                    /*if (this.ajsProperties.view.preventStateChange.indexOf(this) !== -1) {
                        this.ajsProperties.view.preventStateChange.splice(
                            this.ajsProperties.view.preventStateChange.indexOf(this),
                            1
                        );
                    }*/
                    this.ajs.visualStateTransitionRunning = false;
                };
                ViewComponent.prototype._childElementExists = function (parent, child) {
                    if (parent instanceof HTMLElement) {
                        for (var i = 0; i < parent.childNodes.length; i++) {
                            if (parent.childNodes.item(i) === child) {
                                return true;
                            }
                        }
                    }
                    return false;
                };
                return ViewComponent;
            }());
            viewmodel.ViewComponent = ViewComponent;
        })(viewmodel = mvvm.viewmodel || (mvvm.viewmodel = {}));
    })(mvvm = ajs.mvvm || (ajs.mvvm = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var mvvm;
    (function (mvvm) {
        var viewmodel;
        (function (viewmodel) {
            "use strict";
            /**
             * Default time to wait for initialization of newly created view component
             * <p>
             * Once the view component is created it needs to be initialized (ie. by data provided by some Model). It is asynchronous operation
             * as it may be necessary to download some data from the server. The createViewComponent method is checking in
             * @see {ajs.mvvm.view.COMPONENT_INITIALIZATION_CHECK_INTERVAL} intervals if the component is initialized and if so it continues with
             * the standard component processing (like rendering). This constant is used to determine if initialization of the component does not
             * take too long and interrupts waiting after defined amount of time in specified in miliseconds.
             * </p>
             */
            // const COMPONENT_INITILAIZATION_TIMEOUT: number = 30000;
            var ViewComponentManager = (function () {
                function ViewComponentManager(templateManager) {
                    this._templateManager = templateManager;
                    this._components = {};
                    this._componentInstances = {};
                }
                Object.defineProperty(ViewComponentManager.prototype, "templateManager", {
                    /** Returns reference to the template manager used during the view construction */
                    get: function () { return this._templateManager; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ViewComponentManager.prototype, "components", {
                    get: function () { return this._components; },
                    enumerable: true,
                    configurable: true
                });
                ViewComponentManager.prototype.registerComponents = function () {
                    var componentConstructor = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        componentConstructor[_i] = arguments[_i];
                    }
                    for (var i = 0; i < componentConstructor.length; i++) {
                        if (componentConstructor[i] instanceof Function) {
                            this._registerComponent(componentConstructor[i]);
                        }
                    }
                };
                /**
                 *
                 * @param name Name of registered view component to be created
                 * @param id Id of the component (usually the id from the template)
                 * @param view View to which the view component relates
                 * @param parentComponent Parent view component
                 * @param state Initial state to be set
                 */
                ViewComponentManager.prototype.createViewComponent = function (name, id, view, parentComponent, state) {
                    ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.mvvm.viewmodel", this);
                    // get the visual component for the view component
                    var visualComponent;
                    visualComponent = this._templateManager.getVisualComponent(name);
                    // throw error if it does not exist
                    if (visualComponent === null) {
                        ajs.dbg.log(ajs.dbg.LogType.Error, 0, "ajs.mvvm.view", this, "Visual component is not defined (probably the appropriate template is not loaded): " + name);
                        throw new viewmodel.VisualComponentNotRegisteredException(name);
                    }
                    // get ViewComponent constructor from the vire component name
                    var viewComponentConstructor;
                    if (this._components.hasOwnProperty(name.toUpperCase())) {
                        viewComponentConstructor = this._components[name.toUpperCase()];
                    }
                    else {
                        viewComponentConstructor = viewmodel.ViewComponent;
                    }
                    // get new unique id for the new component
                    var componentViewId = view.getNewComponentId();
                    ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.mvvm.viewmodel", this, "Creating the view component instance: " + ajs.utils.getFunctionName(viewComponentConstructor) + "[" + componentViewId + "]:" + id, view, parentComponent, state);
                    // create view component and store its instance to the collection identified by id
                    var viewComponent;
                    viewComponent = new viewComponentConstructor(view, this, id, componentViewId, parentComponent, visualComponent, state);
                    this._componentInstances[componentViewId] = viewComponent;
                    ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.mvvm.viewmodel", this);
                    return viewComponent;
                };
                ViewComponentManager.prototype.removeComponentInstance = function (component) {
                    delete (this._componentInstances[component.componentViewId]);
                };
                // remove
                ViewComponentManager.prototype.getComponentConstructorByName = function (name) {
                    if (this._components.hasOwnProperty(name.toUpperCase())) {
                        return this._components[name.toUpperCase()];
                    }
                    return null;
                };
                ViewComponentManager.prototype.getComponentInstanceByComponentId = function (componentId) {
                    if (this._componentInstances.hasOwnProperty(componentId.toString())) {
                        return this._componentInstances[componentId];
                    }
                    return null;
                };
                ViewComponentManager.prototype._registerComponent = function (componentConstructor) {
                    if (componentConstructor instanceof Function) {
                        var componentName = "";
                        var parseName = /^function\s+([\w\$]+)\s*\(/.exec(componentConstructor.toString());
                        componentName = parseName ? parseName[1] : "";
                        componentName = componentName.toUpperCase();
                        if (this._components[componentName] === undefined) {
                            this._components[componentName] = componentConstructor;
                        }
                    }
                };
                ViewComponentManager.prototype.isComponentConstructorRegistered = function (componentConstructor) {
                    for (var key in this._components) {
                        if (this._components[key] === componentConstructor) {
                            return true;
                        }
                    }
                    return false;
                };
                ViewComponentManager.prototype.getChildrenComponentInstances = function (component) {
                    var childrenInstances = [];
                    for (var key in this._componentInstances) {
                        if (this._componentInstances.hasOwnProperty(key)) {
                            if (this._componentInstances[key].ajs.parentComponent === component) {
                                childrenInstances.push(component);
                            }
                        }
                    }
                    return childrenInstances;
                };
                ViewComponentManager.prototype.getComponentInstance = function (component, id, userKey) {
                    var viewComponentInstances = [];
                    var componentConstructorName = ajs.utils.getFunctionName(component);
                    for (var key in this._componentInstances) {
                        if (this._componentInstances.hasOwnProperty(key)) {
                            var constructorName = ajs.utils.getClassName(this._componentInstances[key]);
                            if (constructorName === componentConstructorName) {
                                if (id) {
                                    if (this._componentInstances[key].ajs.id === id) {
                                        if (userKey) {
                                            if (this._componentInstances[key].hasOwnProperty("key")) {
                                                if (this._componentInstances[key].ajs.key === userKey) {
                                                    viewComponentInstances.push(this._componentInstances[key]);
                                                }
                                            }
                                        }
                                        else {
                                            viewComponentInstances.push(this._componentInstances[key]);
                                        }
                                    }
                                }
                                else {
                                    viewComponentInstances.push(this._componentInstances[key]);
                                }
                            }
                        }
                    }
                    return viewComponentInstances;
                };
                ViewComponentManager.prototype.getFirstComponentInstance = function (component, id, userKey) {
                    var componentConstructorName = ajs.utils.getFunctionName(component);
                    for (var key in this._componentInstances) {
                        if (this._componentInstances.hasOwnProperty(key)) {
                            var constructorName = ajs.utils.getClassName(this._componentInstances[key]);
                            if (constructorName === componentConstructorName) {
                                if (id) {
                                    if (this._componentInstances[key].ajs.id === id) {
                                        if (userKey) {
                                            if (this._componentInstances[key].hasOwnProperty("key")) {
                                                if (this._componentInstances[key].ajs.key === userKey) {
                                                    return this._componentInstances[key];
                                                }
                                            }
                                        }
                                        else {
                                            return this._componentInstances[key];
                                        }
                                    }
                                }
                                else {
                                    return this._componentInstances[key];
                                }
                            }
                        }
                    }
                    return null;
                };
                return ViewComponentManager;
            }());
            viewmodel.ViewComponentManager = ViewComponentManager;
        })(viewmodel = mvvm.viewmodel || (mvvm.viewmodel = {}));
    })(mvvm = ajs.mvvm || (ajs.mvvm = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var mvvm;
    (function (mvvm) {
        var viewmodel;
        (function (viewmodel) {
            "use strict";
            var ViewComponentRender = (function () {
                function ViewComponentRender() {
                }
                return ViewComponentRender;
            }());
            viewmodel.ViewComponentRender = ViewComponentRender;
        })(viewmodel = mvvm.viewmodel || (mvvm.viewmodel = {}));
    })(mvvm = ajs.mvvm || (ajs.mvvm = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var mvvm;
    (function (mvvm) {
        var viewmodel;
        (function (viewmodel) {
            "use strict";
            var ViewComponentStateManager = (function () {
                function ViewComponentStateManager() {
                }
                return ViewComponentStateManager;
            }());
            viewmodel.ViewComponentStateManager = ViewComponentStateManager;
        })(viewmodel = mvvm.viewmodel || (mvvm.viewmodel = {}));
    })(mvvm = ajs.mvvm || (ajs.mvvm = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var mvvm;
    (function (mvvm) {
        var view;
        (function (view) {
            "use strict";
            var UpdateRootViewComponentFailedException = (function (_super) {
                __extends(UpdateRootViewComponentFailedException, _super);
                function UpdateRootViewComponentFailedException() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return UpdateRootViewComponentFailedException;
            }(Error));
            view.UpdateRootViewComponentFailedException = UpdateRootViewComponentFailedException;
            var VisualComponentNotRegisteredException = (function (_super) {
                __extends(VisualComponentNotRegisteredException, _super);
                function VisualComponentNotRegisteredException() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return VisualComponentNotRegisteredException;
            }(Error));
            view.VisualComponentNotRegisteredException = VisualComponentNotRegisteredException;
            var ViewComponentInitializationTimeoutException = (function (_super) {
                __extends(ViewComponentInitializationTimeoutException, _super);
                function ViewComponentInitializationTimeoutException() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return ViewComponentInitializationTimeoutException;
            }(Error));
            view.ViewComponentInitializationTimeoutException = ViewComponentInitializationTimeoutException;
        })(view = mvvm.view || (mvvm.view = {}));
    })(mvvm = ajs.mvvm || (ajs.mvvm = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var mvvm;
    (function (mvvm) {
        var view;
        (function (view) {
            "use strict";
        })(view = mvvm.view || (mvvm.view = {}));
    })(mvvm = ajs.mvvm || (ajs.mvvm = {}));
})(ajs || (ajs = {}));
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
/**
 * Document namespace contains the document manager and related interfaces
 * It is used internally by the view to manage document stylesheets and update
 * the DOM node tree if it is changed.
 */
var ajs;
(function (ajs) {
    var doc;
    (function (doc) {
        "use strict";
        /**
         * Document manager is wrapper around the DOM Document with support of additional features
         * <p>
         * Document manager currently supports IComponents to be used as document HTML components. Internally, by Ajs,
         * the IComponent represents ViewComponent instances assignet to root nodes of each view component.
         * </p>
         * <p>
         * Document manager also performs the DOM structure update. It is based on the React idea so it updates
         * only changed nodes and attributes in order to be as fastest as possible.
         * </p>
         * <p>
         * It also supports loading of style sheets from templates and updating them with the managed resource
         * values so basically, offline resources can be used in stylesheets without explicit need of storing them
         * in the application cache.
         * </p>
         *
         */
        var DocumentManager = (function () {
            /**
             * Constructs the document manager
             * @param targetDocument The document to be managed
             */
            function DocumentManager(renderTarget) {
                ajs.dbg.log(ajs.dbg.LogType.Constructor, 0, "ajs.doc", this);
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.doc", this, "Managing the DOM document", renderTarget.ownerDocument);
                this._renderTarget = renderTarget;
                this._targetDocument = renderTarget.ownerDocument;
                this._styleSheets = [];
                this._touchEventsCount = 0;
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.doc", this);
            }
            Object.defineProperty(DocumentManager.prototype, "renderTarget", {
                get: function () { return this._renderTarget; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DocumentManager.prototype, "uniqeId", {
                get: function () { this._uniqueId++; return this._uniqueId; },
                enumerable: true,
                configurable: true
            });
            ;
            /**
             * Cleans up the managed document
             */
            DocumentManager.prototype.clean = function (renderTarget) {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.doc", this);
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.doc", this, "Cleaning up the target document and render target", this._targetDocument, renderTarget);
                // check if the renderTarget requested to be clean is in the managed document
                if (renderTarget.ownerDocument !== this._targetDocument) {
                    ajs.dbg.log(ajs.dbg.LogType.Error, 0, "ajs.doc", this, "Render target is not contained in the managed document", this._targetDocument, renderTarget);
                    throw new doc.RenderTargetNotInManagedDocumentException();
                }
                // remove managed stylesheets
                var styleSheets = this._targetDocument.head.getElementsByTagName("style");
                for (var i = 0; i < styleSheets.length; i++) {
                    if (styleSheets.item(i).hasAttribute("id") &&
                        this._styleSheets.indexOf(styleSheets.item(i).getAttribute("id")) !== -1) {
                        this._targetDocument.head.removeChild(styleSheets.item(i));
                    }
                }
                // clean stylesheets
                this._styleSheets = [];
                // removes tree bottom down from node
                function removeTree(node) {
                    // do the following procedure for all children
                    for (var i = 0; i < node.childNodes.length; i++) {
                        removeTree(node.childNodes.item(i));
                    }
                    // if node has ajsData
                    if (node.ajsData) {
                        // remove event listeners
                        for (var i = 0; i < node.ajsData.eventListeners.length; i++) {
                            node.removeEventListener(node.ajsData.eventListeners[i].eventType, node.ajsData.eventListeners[i].eventListener);
                        }
                        // and remove ajsData from node
                        node.ajsData = null;
                        delete node.ajsData;
                    }
                    node.parentNode.removeChild(node);
                }
                // all elements in render target
                for (var i = 0; i < this._renderTarget.childNodes.length; i++) {
                    removeTree(this._renderTarget.childNodes.item(i));
                }
                renderTarget.innerHTML = "";
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.doc", this);
            };
            /**
             * Walks the target DOM and applies changes from source (usually shadow) DOM
             * @param source DOM node (usually from shadow DOM) structure to be set to target
             * @param target Target to be updated
             */
            DocumentManager.prototype.updateDom = function (source, target) {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.doc", this);
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.doc", this, "Updating DOM structure", source, target);
                // check if the renderTarget requested to be updated is in the managed document
                if (target.ownerDocument !== this._targetDocument) {
                    ajs.dbg.log(ajs.dbg.LogType.Error, 0, "ajs.doc", this, "Render target is not contained in the managed document", this._targetDocument, target);
                    throw new doc.RenderTargetNotInManagedDocumentException();
                }
                // just retype the node to INode, extended information is checked in all cases
                var src = source;
                var tgt = target;
                // if the source has a metadata and the target has no any or has a different metadata than the source
                if (src.ajsData && (!tgt.ajsData || src.ajsData.component !== tgt.ajsData.component)) {
                    // this is just safety check. theoretically, situation with unknown target or parent should not never occur
                    if (target !== undefined && target !== null && target.parentNode !== undefined && target.parentNode !== null) {
                        var nodeToUpdate = this._findSameComponent(src, tgt);
                        // if the obesrver is the same object, just update it
                        if (nodeToUpdate === null) {
                            if (target === this._renderTarget) {
                                nodeToUpdate = this._appendNode(src, tgt);
                            }
                            else {
                                // otherwise insert new node with a different observer before
                                nodeToUpdate = this._insertBefore(src, tgt);
                            }
                        }
                        // update found or added node and its children
                        this.updateDom(src, nodeToUpdate);
                    }
                    else {
                        ajs.dbg.log(ajs.dbg.LogType.Error, 0, "ajs.doc", this, "Target or its parent is unknown!", this._targetDocument, target);
                        throw new doc.TargetOrParentIsUnknownException();
                    }
                }
                else {
                    // real dom update starts here
                    // update only if the src node has no metadata or should not be skipped
                    if (src.ajsData === undefined || !src.ajsData.skipUpdate) {
                        // compare node names
                        if (src.nodeName === tgt.nodeName) {
                            // update the node attributes
                            this._updateNodeAttributes(src, tgt);
                            // update or add children nodes - the updateDom for children is called inside the method
                            this._updateChildren(src, tgt);
                            // remove any additional children nodes not existing with the source
                            // it is not neccessary to inform components as they should not exist anymore after state update
                            while (source.childNodes.length < target.childNodes.length) {
                                tgt.removeChild(tgt.childNodes.item(src.childNodes.length));
                            }
                        }
                        else {
                            // the source node is different to target so replace target with source
                            var adoptedNode = this._replaceNode(src, tgt);
                            this.updateDom(source, adoptedNode);
                        }
                    }
                }
            };
            /**
             * Finds a target node which has assigned the source node in the metadata
             * @param src Source node (usually from the template) to be searched for
             */
            DocumentManager.prototype.getTargetNodeByUniqueId = function (id) {
                function searchNode(id, tgtNode) {
                    // if the target node has assigned required source node, remove it and stop searching
                    if (tgtNode.ajsData && tgtNode.ajsData.component && tgtNode.ajsData.component.componentViewId === id) {
                        return tgtNode;
                    }
                    // search children nodes until the node is found and removed
                    for (var i = 0; i < tgtNode.childNodes.length; i++) {
                        var node = searchNode(id, tgtNode.childNodes.item(i));
                        if (node !== null) {
                            return node;
                        }
                    }
                    return null;
                }
                return searchNode(id, this._targetDocument.body);
            };
            /**
             * Removes target node which has assigned the source node
             * @param src Source node (usually the node in the template) to be searched for
             */
            DocumentManager.prototype.removeNodeByUniqueId = function (id) {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.doc", this);
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.doc", this, "Removing the target node by assigned to the source node " + id);
                var node = this.getTargetNodeByUniqueId(id);
                if (node !== null) {
                    this.removeNode(node);
                }
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.doc", this);
            };
            /**
             * Searches the target parent for the same component (just the same level, not children)
             * @param src Source node (usually from the template) assigned to the target to be searched
             * @param tgt Target which parent will be searched for the component
             */
            DocumentManager.prototype._findSameComponent = function (src, tgt) {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.doc", this);
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.doc", this, "Looking for the same component", src, tgt);
                if (src.ajsData !== undefined && src.ajsData.component !== undefined) {
                    for (var i = 0; i < tgt.parentNode.childNodes.length; i++) {
                        var targetNode = tgt.parentNode.childNodes.item(i);
                        if (targetNode.ajsData && targetNode.ajsData.component === src.ajsData.component) {
                            ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.doc", this, "Component found", tgt.parentNode.childNodes.item(i));
                            ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.doc", this);
                            return tgt.parentNode.childNodes.item(i);
                        }
                    }
                }
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.doc", this, "Component not found");
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.doc", this);
                return null;
            };
            /**
             * Update or add children nodes
             * @param src Source node (from shadow DOM) its children are about to be added or which data to be set to target children nodes
             * @param tgt Target node which children are about to be updated or added from source children nodes
             */
            DocumentManager.prototype._updateChildren = function (src, tgt) {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.doc", this);
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.doc", this, "Updating children node", src, tgt);
                for (var i = 0; i < src.childNodes.length; i++) {
                    var child = void 0;
                    if (i < tgt.childNodes.length) {
                        // if there are enough child nodes to be compared in the target document
                        // continue with these children
                        child = tgt.childNodes.item(i);
                    }
                    else {
                        // otherwise append the node and continue with its tree
                        child = this._appendNode(src.childNodes.item(i), tgt);
                    }
                    // update child node tree
                    this.updateDom(src.childNodes.item(i), child);
                }
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.doc", this);
            };
            /**
             * Append new node to the target node
             * @param src Appends the source node (from shadow DOM) to the target
             * @param tgt Target for the source node
             */
            DocumentManager.prototype._appendNode = function (src, tgt) {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.doc", this);
                ajs.dbg.log(ajs.dbg.LogType.DomAppendChild, 0, "ajs.doc", this, "Appending new node", src, tgt);
                var clonedNode = src.cloneNode(false);
                var adoptedNode = tgt.ownerDocument.adoptNode(clonedNode);
                tgt.appendChild(adoptedNode);
                this._setNodeMetadata(src, adoptedNode);
                this._registerEventListeners(src, adoptedNode);
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.doc", this);
                return adoptedNode;
            };
            /**
             * Insert new node before target node
             * @param src Inserts the source node (from shadow DOM) before the target node
             * @param tgt Target node before which the source will be inserted
             */
            DocumentManager.prototype._insertBefore = function (src, tgt) {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.doc", this);
                ajs.dbg.log(ajs.dbg.LogType.DomAppendChild, 0, "ajs.doc", this, "Inserting new node before", src, tgt);
                // clone, adapt and insert node from shadow dom to target document
                var clonedNode = src.cloneNode(false);
                var adoptedNode = tgt.ownerDocument.adoptNode(clonedNode);
                tgt.parentNode.insertBefore(adoptedNode, tgt);
                this._setNodeMetadata(src, adoptedNode);
                this._registerEventListeners(src, adoptedNode);
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.doc", this);
                return adoptedNode;
            };
            /**
             * Remove target element and replace it by a new tree
             * @param src Source node (from shadow DOM) used to replace existing target
             * @param tgt Target node to be replaced
             */
            DocumentManager.prototype._replaceNode = function (src, tgt) {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.doc", this);
                ajs.dbg.log(ajs.dbg.LogType.DomReplaceChild, 0, "ajs.doc", this, "Replacing target node with source node", src, tgt);
                // do necessary cleanup - this is maybe not necessary as the node will be discarded completely
                if (tgt.ajsData) {
                    // unregister event listeners
                    if (tgt.ajsData.eventListeners instanceof Array) {
                        for (var i = 0; i < tgt.ajsData.eventListeners.length; i++) {
                            tgt.removeEventListener(tgt.ajsData.eventListeners[i].eventType, tgt.ajsData.eventListeners[i].eventListener);
                        }
                    }
                    // remove metadata
                    tgt.ajsData = null;
                    delete (tgt.ajsData);
                }
                var clonedNode = src.cloneNode(false);
                var adoptedNode = tgt.ownerDocument.adoptNode(clonedNode);
                tgt.parentNode.replaceChild(adoptedNode, tgt);
                this._setNodeMetadata(src, adoptedNode);
                this._registerEventListeners(src, adoptedNode);
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.doc", this);
                return adoptedNode;
            };
            /**
             * Removes the node including all children with necessary cleanup
             * @param tgt Target node to be removed
             */
            DocumentManager.prototype.removeNode = function (target) {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.doc", this);
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.doc", this, "Removing the target node", target);
                // the target was probably removed already
                if (!target || target === null) {
                    ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.doc", this);
                    return;
                }
                // check if the renderTarget requested to be removed is in the managed document
                if (target.ownerDocument !== this._targetDocument) {
                    ajs.dbg.log(ajs.dbg.LogType.Error, 0, "ajs.doc", this, "Render target is not contained in the managed document", this._targetDocument, target);
                    throw new doc.RenderTargetNotInManagedDocumentException();
                }
                // remove all children
                for (var i = 0; i < target.childNodes.length; i++) {
                    this.removeNode(target.childNodes.item(i));
                }
                var tgt = target;
                // do necessary cleanup - this is maybe not necessary as the node will be discarded completely
                if (tgt.ajsData) {
                    // unregister event listeners
                    if (tgt.ajsData.eventListeners instanceof Array) {
                        for (var i = 0; i < tgt.ajsData.eventListeners.length; i++) {
                            tgt.removeEventListener(tgt.ajsData.eventListeners[i].eventType, tgt.ajsData.eventListeners[i].eventListener);
                        }
                    }
                    // remove metadata
                    tgt.ajsData = null;
                    delete (tgt.ajsData);
                }
                // remove the target node
                if (tgt.parentNode !== null) {
                    tgt.parentNode.removeChild(tgt);
                }
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.doc", this);
            };
            /**
             * Updates node attributes (removes non-existing, adds new and updates existing values)
             * @param source Source node (from shadow DOM) which attributes should be set to target node
             * @param target Target node which attributes will be updated
             */
            DocumentManager.prototype._updateNodeAttributes = function (source, target) {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.doc", this);
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.doc", this, "Updating node attributes", source, target);
                if (source.nodeType === Node.ELEMENT_NODE) {
                    // remove non-existing atributes
                    var i = 0;
                    while (i < target.attributes.length) {
                        if (!source.hasAttribute(target.attributes.item(i).nodeName)) {
                            ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.doc", this, "Removing attribute ", target.attributes.item(i).nodeName);
                            try {
                                target.attributes.removeNamedItem(target.attributes.item(i).nodeName);
                            }
                            catch (e) {
                                ajs.dbg.log(ajs.dbg.LogType.Error, 0, "ajs.doc", this, "Removing attribute " + target.attributes.item(i).nodeName + " failed.");
                                break;
                            }
                        }
                        else {
                            i++;
                        }
                    }
                    // add missing attributes and update differences
                    for (i = 0; i < source.attributes.length; i++) {
                        var tattr = target.attributes.getNamedItem(source.attributes.item(i).nodeName);
                        if (tattr === null) {
                            ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.doc", this, "Adding attribute " + source.attributes.item(i).nodeName + "=" + source.attributes.item(i).nodeValue);
                            tattr = target.ownerDocument.createAttribute(source.attributes.item(i).nodeName);
                            tattr.value = source.attributes.item(i).nodeValue;
                            target.attributes.setNamedItem(tattr);
                        }
                        else {
                            if (tattr.nodeValue !== source.attributes.item(i).nodeValue) {
                                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.doc", this, "Updating the attribute value " + tattr.nodeName + "=" + source.attributes.item(i).nodeValue);
                                tattr.nodeValue = source.attributes.item(i).nodeValue;
                            }
                        }
                    }
                }
                else {
                    if (source.nodeType === Node.TEXT_NODE) {
                        if (source.nodeValue !== target.nodeValue) {
                            target.nodeValue = source.nodeValue;
                        }
                    }
                }
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.doc", this);
            };
            /**
             * Copies metadata from source to the target element
             * @param src Source node (from shadow DOM) containing the metadata to be set to target node
             * @param tgt Target node of which metadata will be set
             */
            DocumentManager.prototype._setNodeMetadata = function (src, tgt) {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.doc", this);
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.doc", this, "Setting node metadata", src, tgt);
                if (src.ajsData) {
                    tgt.ajsData = src.ajsData;
                }
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.doc", this);
            };
            /**
             * Registers defined event listeners (from source node metadata) to the target node if there are any
             * @param src Source node (from shadow DOM) containing event listeners to be registered with the target node
             * @param tgt Target node to which event listeners will be added
             */
            DocumentManager.prototype._registerEventListeners = function (src, tgt) {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.doc", this);
                if (src.ajsData && src.ajsData.eventListeners instanceof Array) {
                    for (var i = 0; i < src.ajsData.eventListeners.length; i++) {
                        ajs.dbg.log(ajs.dbg.LogType.DomAddListener, 0, "ajs.doc", this, "Registering event listener " + src.ajsData.eventListeners[i].eventType, src, tgt);
                        tgt.addEventListener(src.ajsData.eventListeners[i].eventType, src.ajsData.eventListeners[i].eventListener);
                    }
                }
            };
            /**
             * Applies stylesheets from the template to the target document
             * Asynchronously loads necessary resources (i.e. images) and replaces appropriate URLs with the resource Base64 representation
             * @param template Template which stylesheets have to be applied
             */
            DocumentManager.prototype.applyStyleSheetsFromTemplate = function (template) {
                var _this = this;
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.doc", this);
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.doc", this, "Applying Style Sheets from template " + template.name + "(" + template.styleSheets.length + ")");
                var styleSheetsToProcess = [];
                for (var i = 0; i < template.styleSheets.length; i++) {
                    var id = template.name + i;
                    if (this._styleSheets.indexOf(id) === -1) {
                        this._styleSheets.push(id);
                        styleSheetsToProcess.push(this._processStyleSheet(template, i));
                    }
                }
                ;
                var applyPromise = new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var styleSheets, i, id, style, e_7;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, Promise.all(styleSheetsToProcess)];
                            case 1:
                                styleSheets = _a.sent();
                                for (i = 0; i < styleSheets.length; i++) {
                                    id = template.name + i;
                                    style = this._targetDocument.createElement("style");
                                    style.setAttribute("type", "text/css");
                                    style.setAttribute("id", id);
                                    style.textContent = template.styleSheets[i];
                                    ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.doc", this, "Adding processed stylesheet to the render target", template.styleSheets[i]);
                                    this._targetDocument.head.appendChild(style);
                                }
                                return [3 /*break*/, 3];
                            case 2:
                                e_7 = _a.sent();
                                ajs.dbg.log(ajs.dbg.LogType.Error, 0, "ajs.doc", this, "Required CSS resource can't be reached", e_7);
                                throw new doc.CSSRequiredResourceNotLoadedException(e_7);
                            case 3:
                                resolve();
                                return [2 /*return*/];
                        }
                    });
                }); });
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.doc", this);
                return applyPromise;
            };
            /**
             * Processes the stylesheet, replaces URLs with Base64 data if url is managed resource in the same storage as the template
             * @param template
             * @param index
             */
            DocumentManager.prototype._processStyleSheet = function (template, index) {
                var _this = this;
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.doc", this);
                // resources to be checked
                var resourcesPromises = [];
                // find all url(...) in the stylesheet
                var urls = template.styleSheets[index].match(/url\(('|")(.*)('|")\)/g);
                // fix them to just the url and get all resources
                if (urls !== null) {
                    for (var i = 0; i < urls.length; i++) {
                        var url = (/('|")(.*)('|")/g).exec(urls[i]);
                        if (url.length < 2) {
                            ajs.dbg.log(ajs.dbg.LogType.Error, 0, "ajs.doc", this, "CSS Invalid URL specification " + urls[i]);
                            throw new doc.CSSInvalidResourceSpecificationException();
                        }
                        if (url[2].substr(0, 4) !== "data") {
                            resourcesPromises.push(template.templateManager.resourceManager.getResource(url[2], template.storageType));
                        }
                    }
                }
                // wait for all resources with given URLS
                var styleSheetPromise = new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var resources_4, i, e_8;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, Promise.all(resourcesPromises)];
                            case 1:
                                resources_4 = _a.sent();
                                for (i = 0; i < resources_4.length; i++) {
                                    template.styleSheets[index] = ajs.utils.replaceAll(template.styleSheets[index], resources_4[i].url, "data:image;base64," + resources_4[i].data);
                                }
                                return [3 /*break*/, 3];
                            case 2:
                                e_8 = _a.sent();
                                ajs.dbg.log(ajs.dbg.LogType.Warning, 0, "ajs.doc", this, "Unable to reach one of requested resources for the stylesheet", e_8);
                                reject(e_8);
                                return [3 /*break*/, 3];
                            case 3:
                                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.doc", this, "Discovered style sheet resources succesfully loaded");
                                resolve(template.styleSheets[index]);
                                return [2 /*return*/];
                        }
                    });
                }); });
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.doc", this);
                return styleSheetPromise;
            };
            return DocumentManager;
        }());
        doc.DocumentManager = DocumentManager;
    })(doc = ajs.doc || (ajs.doc = {}));
})(ajs || (ajs = {}));
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
///<reference path="../../doc/DocumentManager.ts" />
///<reference path="../viewmodel/ViewComponentManager.ts" />
/**
 * View namespace is dedicated to view and its exceptions only
 */
var ajs;
(function (ajs) {
    var mvvm;
    (function (mvvm) {
        var view;
        (function (view) {
            "use strict";
            var ViewComponentManager = ajs.mvvm.viewmodel.ViewComponentManager;
            var DocumentManager = ajs.doc.DocumentManager;
            /**
             * View class represents a view composed from the view components. It manages the tree of instanced view components to be displayed.
             * <p>
             * It is recommended to keep just one view for one render target (and basically, only one view for the whole HTML document) as
             * it the code is not designed to exchange the data between multiple views and also interferrences can occur during the style sheet
             * management if multiple views are trying to add / remove style sheets.
             * </p>
             * <p>
             * Automatically builds the view component tree based on the passed rootViewComponentName. It automatically instantiates the root
             * component which takes care of instantiating children view components. The initial state of the root component must be set in this
             * component as it is not possible to pass the default state from the View.
             * </p>
             * <p>
             * View also catches state changes occured in the children view components and initiates the ViewComponent tree rendering
             * to the shadow DOM it manages and performs the final DOM update (using the DocumentManager) at the end of the state change.
             * Rendering and the DOM update occurs only if the state of the "state change" root component or its children was really changed.
             * This is evaluated in the particular view component. If only one of children view components of the root state change components
             * was changed the whole state chane root view component will get rendered to the shadow DOM but only changed nodes are transferred
             * to the render target so the target DOM manipulation is minimized as much as possible.
             * </p>
             */
            var View = (function () {
                /**
                 * Constructs a view. This constructor is called from the ajs.Framework during initialization
                 * <p>
                 * View is supposed to be just one in the application. All the "view" functionality should be
                 * in view components itself.
                 * </p>
                 * @param templateManager template manager must be instantiated before the view
                 * @param viewComponentManager view component manager must be instantiated before the view
                 */
                function View(viewComponentManager, config) {
                    ajs.dbg.log(ajs.dbg.LogType.Constructor, 0, "ajs.mvvm.view", this, "", ViewComponentManager, config);
                    // store the configuration
                    if (config) {
                        this._config = config;
                    }
                    else {
                        this._config = this._defaultConfig();
                    }
                    // instantiate notifiers
                    this._navigationNotifier = new ajs.events.Notifier();
                    this._renderDoneNotifier = new ajs.events.Notifier();
                    // store references to the template and view component managers
                    this._viewComponentManager = viewComponentManager;
                    // store the render target for the root view component and instantiate the document manager
                    this._renderTarget = this._config.renderTarget;
                    this._documentManager = new DocumentManager(this._renderTarget);
                    // basic initialization of the view
                    this._rootViewComponentName = null;
                    this._rootViewComponent = null;
                    this._stateChangeRootComponent = null;
                    // prepare shadow DOM as a ViewComponent render target
                    this._shadowDom = document.implementation.createHTMLDocument("shadowDom");
                    this._shadowDom.body.innerHTML = "";
                    this._lastComponentId = 0;
                    ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.mvvm.view", this);
                }
                Object.defineProperty(View.prototype, "config", {
                    get: function () { return this._config; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(View.prototype, "viewComponentManager", {
                    /** Returns reference to the view manager used during the view construction */
                    get: function () { return this._viewComponentManager; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(View.prototype, "documentManager", {
                    /** Returns reference to the document manager */
                    get: function () { return this._documentManager; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(View.prototype, "renderTarget", {
                    /** Returns reference to the element serving as a render target for the root view component */
                    get: function () { return this._renderTarget; },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(View.prototype, "rootViewComponentName", {
                    /** Returns currently set name of the root view component */
                    get: function () { return this._rootViewComponentName; },
                    /**
                     * Sets the name of the root view component and internally instantiates it and its tree.
                     * Additionally, it destroys the previously assigned root component and its tree and performs necessary cleanup
                     */
                    set: function (value) { this._rootUpdated(value); },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(View.prototype, "rootViewComponent", {
                    /** Returns root view component currently in use */
                    get: function () { return this._rootViewComponent; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(View.prototype, "stateChangeRootComponent", {
                    /** Returns the current change root component. Valid when the stage change is in progress only */
                    get: function () { return this._stateChangeRootComponent; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(View.prototype, "navigationNotifier", {
                    get: function () { return this._navigationNotifier; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(View.prototype, "renderDoneNotifier", {
                    get: function () { return this._renderDoneNotifier; },
                    enumerable: true,
                    configurable: true
                });
                /** Returns unique ID number each time it is asked for it. Currently, the view component
                 *  is using this generator to assign view component unique identification, but this identification is not in use now
                 */
                View.prototype.getNewComponentId = function () { this._lastComponentId++; return this._lastComponentId; };
                /**
                 * Default view configuration
                 */
                View.prototype._defaultConfig = function () {
                    return {
                        renderTarget: window.document.body
                    };
                };
                /**
                 * Called from router when navigation occurs but root component remains the same
                 */
                View.prototype.onNavigate = function () {
                    this._navigationNotifier.notify(this);
                };
                /**
                 * Called from the view component when it is requested to set the new state
                 * <p>
                 * This information must be passed in order to be possible to recognize the
                 * state change root in order to be possible to update just the correct DOM
                 * tree.
                 * </p>
                 * @param viewComponent
                 */
                View.prototype.stateChangeBegin = function (viewComponent) {
                    ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.mvvm.view", this);
                    ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.mvvm.view", this, "State change begun (" + ajs.utils.getClassName(viewComponent) + "), " +
                        "id: " + viewComponent.ajs.id + ", viewId: " + viewComponent.componentViewId, viewComponent);
                    // if there is no root assigned to the change, the passed component is the root of the change
                    if (this._stateChangeRootComponent === null) {
                        ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.mvvm.view", this, "The " + ajs.utils.getClassName(viewComponent) + ":" + viewComponent.ajs.id + " is root of the state change");
                        this._stateChangeRootComponent = viewComponent;
                    }
                    ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.mvvm.view", this);
                };
                /**
                 * Called from the view component when it finishes the state change
                 * @param viewComponent
                 */
                View.prototype.stateChangeEnd = function (viewComponent) {
                    ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.mvvm.view", this);
                    ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.mvvm.view", this, "State change end (" + ajs.utils.getClassName(viewComponent) + "), " +
                        "id: " + viewComponent.ajs.id + ", viewId: " + viewComponent.componentViewId +
                        ", state changed: " + viewComponent.ajs.stateChanged, viewComponent);
                    if (this._stateChangeRootComponent === viewComponent) {
                        // render only if the root view component was rendered already
                        // initial rendering of the root component is ensured from the _rootUpdated method
                        if (this._rootViewComponent !== null) {
                            // render the root change view component
                            var targetNewNode = this.render(viewComponent);
                            // notify registered subscribers the rendering is over
                            this._renderDoneNotifier.notify(this);
                            // begin the visual transition
                            if (viewComponent.ajs.hasVisualStateTransition) {
                                viewComponent.ajsVisualStateTransitionBegin(targetNewNode);
                            }
                        }
                        // finish the state change by clearing of the root component
                        this._stateChangeRootComponent = null;
                    }
                    ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.mvvm.view", this);
                };
                /**
                 * Called from the view component to inform all parents in the tree (up to state change root) the state of it has changed
                 * <p>
                 * This is necessary to inform the state change root component it has to render the tree of components the changed component
                 * relates to. Basically, it will render all children but those trees roots which state was not changed will be marked with the
                 * skip flag (and children not rendered at all) to inform DOM updater is is not necessary to update these nodes
                 * </p>
                 * @param viewComponent
                 */
                View.prototype.notifyParentsChildrenStateChange = function (viewComponent) {
                    ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.mvvm.view", this);
                    if (viewComponent !== null && this._stateChangeRootComponent !== null) {
                        ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.mvvm.view", this, "Notifying parents about the component change: " + viewComponent.ajs.id + " " + viewComponent.componentViewId);
                        while (viewComponent !== this._stateChangeRootComponent.ajs.parentComponent && viewComponent !== null) {
                            viewComponent.ajs.stateChanged = true;
                            ;
                            viewComponent = viewComponent.ajs.parentComponent;
                        }
                    }
                    ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.mvvm.view", this);
                };
                /**
                 *
                 * @param viewComponent
                 */
                View.prototype.render = function (viewComponent) {
                    ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.mvvm.view", this);
                    ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.mvvm.view", this, "Rendering component, id: " + viewComponent.ajs.id + ", viewId: " + viewComponent.componentViewId, viewComponent);
                    // try to locate the target root - if null is returned this is complete new render
                    var targetUpdateRoot = this._documentManager.getTargetNodeByUniqueId(viewComponent.componentViewId);
                    // try to locate the template element in the target DOM
                    // if it is there we are updating a DOM, otherwise render parent first
                    if (targetUpdateRoot === null) {
                        if (viewComponent.ajs.parentComponent === null) {
                            targetUpdateRoot = this._renderTarget;
                        }
                        else {
                            this.render(viewComponent.ajs.parentComponent);
                            return;
                        }
                    }
                    // render the view component to shadow DOM
                    var componentElement = viewComponent.render(this._shadowDom.body, false);
                    // if the component was rendered to shadow DOM, update the target DOM
                    if (componentElement !== null) {
                        try {
                            // update target DOM from shadow DOM
                            this._documentManager.updateDom(componentElement, targetUpdateRoot);
                        }
                        catch (e) {
                            this._shadowDom.body.innerHTML = "";
                            ajs.dbg.log(ajs.dbg.LogType.Error, 0, "ajs.mvvm.view", this, "Error while updating the DOM!", e);
                            throw new Error(e);
                        }
                        finally {
                            // clean up the shadow DOM
                            this._shadowDom.body.innerHTML = "";
                        }
                        // target root should be always element
                        if (targetUpdateRoot instanceof Element) {
                            // we need to return root node of the component, not render target
                            if (targetUpdateRoot === this._renderTarget) {
                                targetUpdateRoot = this._documentManager.getTargetNodeByUniqueId(viewComponent.componentViewId);
                            }
                            if (targetUpdateRoot !== null) {
                                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.mvvm.view", this);
                                return targetUpdateRoot;
                            }
                            else {
                                ajs.dbg.log(ajs.dbg.LogType.Error, 0, "ajs.mvvm.view", this, "Something went wrong during the DOM update as the root element of the view component can't be located!");
                                throw new Error("Unrecoverable internal error. \
                            Something went wrong during the DOM update as the root element of the view component can't be located!");
                            }
                        }
                        else {
                            ajs.dbg.log(ajs.dbg.LogType.Error, 0, "ajs.mvvm.view", this, "Root of the component must be always element!");
                            throw new Error("Unrecoverable internal error. Root of the component must be always element!");
                        }
                    }
                    else {
                        // here is some bullshit, who knows what is used to be for. If null is returned no change was made at all or error occured
                        // lets test first
                        // if it was not rendered it should be removed from the target
                        /*if (targetUpdateRoot !== null) {
                            this._documentManager.removeNode(targetUpdateRoot);
                        }*/
                    }
                    ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.mvvm.view", this);
                };
                /**
                 * Called internally when the view root component is updated (usually initiated by the router)
                 * <p>
                 * Performs the target document clean up and initiates a state change and initial rendering of the rootview component
                 * including its children
                 * </p>
                 * @param rootComponentName
                 */
                View.prototype._rootUpdated = function (rootComponentName) {
                    ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.mvvm.view", this);
                    ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.mvvm.view", this, "Root component updated: " + rootComponentName);
                    // clean the target document including the render target
                    this._documentManager.clean(this.renderTarget);
                    // destroy the previous root component (including all its children)
                    if (this._rootViewComponent !== null) {
                        this.rootViewComponent.destroy();
                    }
                    // setup the new root view component
                    this._rootViewComponentName = rootComponentName;
                    // create the view component including its component tree with the default state
                    this._rootViewComponent = this._viewComponentManager.createViewComponent(rootComponentName, "rootViewComponent", this, null);
                    // hopefully the root component sunscribed navigated event
                    this._navigationNotifier.notify(this);
                    ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.mvvm.view", this);
                };
                return View;
            }());
            view.View = View;
        })(view = mvvm.view || (mvvm.view = {}));
    })(mvvm = ajs.mvvm || (ajs.mvvm = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var mvvm;
    (function (mvvm) {
        var model;
        (function (model) {
            "use strict";
            var NotImplementedException = (function (_super) {
                __extends(NotImplementedException, _super);
                function NotImplementedException() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return NotImplementedException;
            }(Error));
            model.NotImplementedException = NotImplementedException;
            var ModelConstructorIsNotFunctionException = (function (_super) {
                __extends(ModelConstructorIsNotFunctionException, _super);
                function ModelConstructorIsNotFunctionException() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return ModelConstructorIsNotFunctionException;
            }(Error));
            model.ModelConstructorIsNotFunctionException = ModelConstructorIsNotFunctionException;
        })(model = mvvm.model || (mvvm.model = {}));
    })(mvvm = ajs.mvvm || (ajs.mvvm = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var mvvm;
    (function (mvvm) {
        var model;
        (function (model) {
            "use strict";
        })(model = mvvm.model || (mvvm.model = {}));
    })(mvvm = ajs.mvvm || (ajs.mvvm = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var mvvm;
    (function (mvvm) {
        var model;
        (function (model) {
            "use strict";
            var Model = (function () {
                /** Constructs the model */
                function Model(modelManager) {
                    this._initialized = false;
                    this._modelManager = modelManager;
                    this._dataReadyNotifier = new ajs.events.Notifier();
                    this._initialize();
                }
                Object.defineProperty(Model.prototype, "initialized", {
                    /** Returm information if all initial async operations, such as data loading are done */
                    get: function () { return this._initialized; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Model.prototype, "dataReadyNotifier", {
                    /** Returns the data ready notifier which notifies ViewModels the requested data is ready */
                    get: function () { return this._dataReadyNotifier; },
                    enumerable: true,
                    configurable: true
                });
                /** Must be overriden in the inherited class */
                Model.prototype._initialize = function () {
                    throw new model.NotImplementedException();
                };
                /**
                 * This helper can be used to call specific method once the component is initialized
                 * @param exception Exception to be thrown when timeout occurs
                 * @param callForward Method to be called when initialization is done
                 * @param param Parameter to be passed to the method
                 */
                Model.prototype._checkInitialized = function (exception, callForward) {
                    var _this = this;
                    if (!this._initialized) {
                        // if not initialized, wait for it up to 20 seconds (80 x 250ms)
                        var timeout_1 = 80;
                        var w8timer_1 = setInterval(function () {
                            // if loaded, get menu and notify about it
                            if (_this._initialized) {
                                clearInterval(w8timer_1);
                                callForward();
                                // otherwise check if we are timeouted
                            }
                            else {
                                timeout_1--;
                                if (timeout_1 <= 0) {
                                    clearInterval(w8timer_1);
                                    throw exception;
                                }
                            }
                        }, 250);
                    }
                    else {
                        callForward();
                    }
                };
                return Model;
            }());
            model.Model = Model;
        })(model = mvvm.model || (mvvm.model = {}));
    })(mvvm = ajs.mvvm || (ajs.mvvm = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var mvvm;
    (function (mvvm) {
        var model;
        (function (model_1) {
            "use strict";
            var ModelManager = (function () {
                function ModelManager() {
                    this._modelInstances = {};
                }
                ModelManager.prototype._getModelName = function (modelConstructor) {
                    if (modelConstructor instanceof Function) {
                        var modelName = "";
                        var parseName = /^function\s+([\w\$]+)\s*\(/.exec(modelConstructor.toString());
                        modelName = parseName ? parseName[1] : "";
                        return modelName;
                    }
                    else {
                        throw new model_1.ModelConstructorIsNotFunctionException();
                    }
                };
                ModelManager.prototype.getModelInstance = function (modelConstructor) {
                    if (modelConstructor instanceof Function) {
                        var modelName = this._getModelName(modelConstructor);
                        if (this._modelInstances.hasOwnProperty(modelName)) {
                            this._modelInstances[modelName].referenceCount++;
                            return this._modelInstances[modelName].model;
                        }
                        else {
                            var model_2 = new modelConstructor(this);
                            this._modelInstances[modelName] = {
                                referenceCount: 1,
                                model: model_2
                            };
                            return model_2;
                        }
                    }
                    else {
                        throw new model_1.ModelConstructorIsNotFunctionException();
                    }
                };
                ModelManager.prototype.freeModelInstance = function (modelConstructor) {
                    if (modelConstructor instanceof Function) {
                        var modelName = this._getModelName(modelConstructor);
                        if (this._modelInstances.hasOwnProperty(modelName)) {
                            this._modelInstances[modelName].referenceCount--;
                            if (this._modelInstances[modelName].referenceCount === 0) {
                                delete this._modelInstances[modelName];
                            }
                        }
                    }
                    else {
                        throw new model_1.ModelConstructorIsNotFunctionException();
                    }
                };
                return ModelManager;
            }());
            model_1.ModelManager = ModelManager;
        })(model = mvvm.model || (mvvm.model = {}));
    })(mvvm = ajs.mvvm || (ajs.mvvm = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var events;
    (function (events) {
        "use strict";
    })(events = ajs.events || (ajs.events = {}));
})(ajs || (ajs = {}));
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
/**
 * Events namespace contains Notifier class
 * Notifier clas can be instanced and used as the event notificator similiar to
 * #C delegates or addEventListener in the DOM. Listener should be a lambda function
 * to follow the TypeScript requirements regarding using of the this instance
 * identifier. The function must be defined according to the IListener interface.
 */
var ajs;
(function (ajs) {
    var events;
    (function (events) {
        "use strict";
        /** Notifier can be instanced to let subscribers register within it and notify them about particular events */
        var Notifier = (function () {
            /**
             * Instantiates the Notifier and subscribes listeners passed as parameter
             * @param listeners
             */
            function Notifier() {
                var listeners = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    listeners[_i] = arguments[_i];
                }
                ajs.dbg.log(ajs.dbg.LogType.Constructor, 0, "ajs.events", this);
                this._listeners = [];
                for (var i = 0; i < listeners.length; i++) {
                    this._listeners.push(listeners[i]);
                }
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.events", this);
            }
            /**
             * Subscribes listener to obtain notifications passed through the current instance of Notifier
             * @param listener Listener to be subscribed
             */
            Notifier.prototype.subscribe = function (listener) {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.events", this);
                if (this._listeners.indexOf(listener) === -1) {
                    this._listeners.push(listener);
                }
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.events", this, "Registered subscribers: " + this._listeners.length, this._listeners);
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.events", this);
            };
            /**
             * Unsubscribes the listener from the current instance of the notifier
             * @param listener Listener to be subscribed
             */
            Notifier.prototype.unsubscribe = function (listener) {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.events", this);
                if (this._listeners.indexOf(listener) !== -1) {
                    this._listeners.splice(this._listeners.indexOf(listener));
                }
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.events", this, "Registered subscribers: " + this._listeners.length, this._listeners);
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.events", this);
            };
            /**
             * Notifies registered subscribers the event occured
             * Subscribers can cancel propagation to other subscribers by returning false from listener function
             * @param sender Sender object identifier
             * @param data Data to be passed to subscribers
             */
            Notifier.prototype.notify = function (sender, data) {
                ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.events", this);
                ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.events", this, "Notifying subscribers. Sender: " + ajs.utils.getClassName(sender), sender, data);
                for (var i = 0; i < this._listeners.length; i++) {
                    var result = this._listeners[i](sender, data);
                    if (!result) {
                        return;
                    }
                }
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.events", this);
            };
            return Notifier;
        }());
        events.Notifier = Notifier;
    })(events = ajs.events || (ajs.events = {}));
})(ajs || (ajs = {}));
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
/**
 * dom namespace contains the DOM updater and related interfaces
 */
var ajs;
(function (ajs) {
    var doc;
    (function (doc) {
        "use strict";
        var RenderTargetNotInManagedDocumentException = (function (_super) {
            __extends(RenderTargetNotInManagedDocumentException, _super);
            function RenderTargetNotInManagedDocumentException() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return RenderTargetNotInManagedDocumentException;
        }(Error));
        doc.RenderTargetNotInManagedDocumentException = RenderTargetNotInManagedDocumentException;
        ;
        var TargetOrParentIsUnknownException = (function (_super) {
            __extends(TargetOrParentIsUnknownException, _super);
            function TargetOrParentIsUnknownException() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return TargetOrParentIsUnknownException;
        }(Error));
        doc.TargetOrParentIsUnknownException = TargetOrParentIsUnknownException;
        ;
        var SourceNodeHasNoComponentAssignedException = (function (_super) {
            __extends(SourceNodeHasNoComponentAssignedException, _super);
            function SourceNodeHasNoComponentAssignedException() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SourceNodeHasNoComponentAssignedException;
        }(Error));
        doc.SourceNodeHasNoComponentAssignedException = SourceNodeHasNoComponentAssignedException;
        ;
        var CSSRequiredResourceNotLoadedException = (function (_super) {
            __extends(CSSRequiredResourceNotLoadedException, _super);
            function CSSRequiredResourceNotLoadedException() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return CSSRequiredResourceNotLoadedException;
        }(Error));
        doc.CSSRequiredResourceNotLoadedException = CSSRequiredResourceNotLoadedException;
        ;
        var CSSInvalidResourceSpecificationException = (function (_super) {
            __extends(CSSInvalidResourceSpecificationException, _super);
            function CSSInvalidResourceSpecificationException() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return CSSInvalidResourceSpecificationException;
        }(Error));
        doc.CSSInvalidResourceSpecificationException = CSSInvalidResourceSpecificationException;
        ;
    })(doc = ajs.doc || (ajs.doc = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var doc;
    (function (doc) {
        "use strict";
    })(doc = ajs.doc || (ajs.doc = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var doc;
    (function (doc) {
        "use strict";
    })(doc = ajs.doc || (ajs.doc = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var doc;
    (function (doc) {
        "use strict";
    })(doc = ajs.doc || (ajs.doc = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var doc;
    (function (doc) {
        "use strict";
    })(doc = ajs.doc || (ajs.doc = {}));
})(ajs || (ajs = {}));
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
/**
 * ajs.tsx "replaces" the React.js
 * <p>
 * TSX is very very very limited reactive renderer without updating support (so elements must be
 * removed and re-rendered completely. It does not support custom components as it is not neccessary
 * for debugging interface. Its purpose is just to make development of the debug module views easier
 * and better maintanable.
 * </p>
 * <p>
 * <strong>
 * The tsx is not supposed to be used in Applications. It is for internal puproses of the ajs.debug
 * namespace only!
 * </strong>
 * </p>
 * <p>
 * It makes possible usingof the TSX compiler within the Ajs. tsx is needed just for the debug namespace
 * to render components and because storing of the HTML in string is not nice and not well mainanable the
 * decision to use the TSX was made. It is not possible to use the Ajs internally as it would interferre
 * together.
 * </p>
 * <p>
 * If the build solution configuration is "Release" the tsx as well as all debugging functions will be
 * removed from the resulting Ajs and Application JavaScript code using the post-processor.
 * </p>
 */
var ajs;
(function (ajs) {
    var dbg;
    (function (dbg) {
        var tsx;
        (function (tsx) {
            "use strict";
            /**
             * Just throws an exception with the given message
             * @param message
             */
            function exception(message) {
                throw message;
            }
            /**
             * Renders style tag. As { and } are not supported by TSX, the ^ and $ are used instead.
             * @param style Style string to be rendered
             */
            function renderStyle(style) {
                style = style.replace(/\^/g, "{").replace(/\$/g, "}");
                var element = ajs.dbg.console.config.styleRenderTarget.ownerDocument.createElement("style");
                element.setAttribute("type", "text/css");
                element.textContent = style;
                return element;
            }
            /**
             * Renders the tag defined in the TSX template
             * @param tag Tag to be rendered
             * @param props Properties and the data of the tag
             * @param children Children tags and nodess
             */
            function renderTag(tag, props) {
                var children = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    children[_i - 2] = arguments[_i];
                }
                var element = null;
                if (ajs.utils.HTMLTags.indexOf(tag.toUpperCase()) !== -1) {
                    element = ajs.dbg.console.config.styleRenderTarget.ownerDocument.createElement(tag);
                    if (children instanceof Array) {
                        processChildren(element, children);
                    }
                }
                setElementAttribs(element, props);
                return element;
            }
            /**
             * Processes all children of the given TSX tag
             * @param element HTML element created in the renderTag function
             * @param children TSX children to be processed
             */
            function processChildren(element, children) {
                for (var i = 0; i < children.length; i++) {
                    processChild(element, children[i]);
                }
            }
            /**
             * Processes single child of the given TSX tag
             * @param element HTML element created in the
             * @param child TSX child to be processed
             */
            function processChild(element, child) {
                if (child instanceof Array) {
                    processChildren(element, child);
                }
                else {
                    if (child instanceof HTMLElement) {
                        element.appendChild(child);
                    }
                    if (typeof child === "string" || typeof child === "number") {
                        child = "" + child;
                        var node = ajs.dbg.console.config.styleRenderTarget.ownerDocument.createTextNode(child);
                        element.appendChild(node);
                    }
                }
            }
            /**
             * Processes the tag properties and creates appropriate attributes
             * <p>If the property key is 'ajsdata' the data of this property are assigned to the HTML element object under the ajsdata property </p>
             * <p>If the property is instance of a function the event listener with the same name as the property is added to the tag</p>
             * <p>In all other cases, the attribute is added</p>
             * @param element HTML element created in the
             * @param props TSX properties passed from the TSX template
             */
            function setElementAttribs(element, props) {
                if (props) {
                    for (var key in props) {
                        if (props.hasOwnProperty(key)) {
                            if (key !== "ajsdata") {
                                if (props[key] instanceof Function) {
                                    element.addEventListener(key, props[key]);
                                }
                                else {
                                    element.setAttribute(key, props[key]);
                                }
                            }
                            else {
                                element[key] = props[key];
                            }
                        }
                    }
                }
            }
            /**
             * Creates an HTML element from the TSX template including all its children and properties defined in TSX.
             * <p>The owner document of the #see {ajs.debug.console.config.styleRenderTarget} is used to create the element</p>
             * @param tag Tag the element will be created from
             * @param props Element attributes, event listeners and data properties
             * @param children Children elements and text nodes
             */
            function createElement(tag, props) {
                var children = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    children[_i - 2] = arguments[_i];
                }
                var element = null;
                switch (tag) {
                    case "style":
                        element = (children.length === 1) ? renderStyle(children[0]) : exception("Unexpected style data!");
                        break;
                    default:
                        element = renderTag(tag, props, children);
                }
                if (element === null) {
                    throw "Invalid tag";
                }
                return element;
            }
            tsx.createElement = createElement;
        })(tsx = dbg.tsx || (dbg.tsx = {}));
    })(dbg = ajs.dbg || (ajs.dbg = {}));
})(ajs || (ajs = {}));
/* tslint:disable:no-unused-variable */
var AjsDebugTsxFactory = ajs.dbg.tsx;
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
/**
 * Contains the debug view components
 */
var ajs;
(function (ajs) {
    var dbg;
    (function (dbg) {
        var view;
        (function (view) {
            "use strict";
            var Body = (function () {
                function Body(console, currentModule) {
                    this._console = console;
                    this._currentModule = currentModule;
                }
                Object.defineProperty(Body.prototype, "currentModule", {
                    get: function () { return this._currentModule; },
                    enumerable: true,
                    configurable: true
                });
                Body.prototype.onButtonClick = function (e) {
                    if (this._currentModule !== e.srcElement.ajsdata) {
                        this._currentModule = e.srcElement.ajsdata;
                        this._console.refresh();
                    }
                };
                Body.prototype.render = function () {
                    var _this = this;
                    var buttons = [];
                    var moduleToolbar = null;
                    var moduleBody = null;
                    for (var key in this._console.modules) {
                        if (this._console.modules.hasOwnProperty(key)) {
                            buttons.push(AjsDebugTsxFactory.createElement("input", { type: "button", value: this._console.modules[key].getButtonLabel(), click: function (e) { _this.onButtonClick(e); }, ajsdata: this._console.modules[key] }));
                        }
                    }
                    buttons.push(AjsDebugTsxFactory.createElement("input", { type: "button", value: "Hide", click: function () { ajs.dbg.console.hide(); } }));
                    if (this._currentModule !== null) {
                        moduleToolbar = (AjsDebugTsxFactory.createElement("div", { class: "ajsDebugToolbar" }, this._currentModule.renderToolbar()));
                        moduleBody = (AjsDebugTsxFactory.createElement("div", null, this._currentModule.renderBody()));
                    }
                    return (AjsDebugTsxFactory.createElement("div", { class: "ajsDebug" },
                        AjsDebugTsxFactory.createElement("div", { class: "ajsDebugToolbar" }, buttons),
                        moduleToolbar,
                        moduleBody,
                        AjsDebugTsxFactory.createElement("div", { class: "ajsDebugInfo", id: "ajsDebugInfo" }, "Debugging console ready!")));
                };
                return Body;
            }());
            view.Body = Body;
        })(view = dbg.view || (dbg.view = {}));
    })(dbg = ajs.dbg || (ajs.dbg = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var dbg;
    (function (dbg) {
        var view;
        (function (view) {
            "use strict";
            var StyleSheet = (function () {
                function StyleSheet() {
                }
                StyleSheet.prototype.render = function () {
                    return (AjsDebugTsxFactory.createElement("style", { type: "text/css" }, ".ajsDebug ^ position: absolute; left: 10px; top: 10px; right: 10px; bottom: 10px; z-index: 16384; background-color: white; border: solid 1px black; border-radius: 10px; opacity: 0.95; overflow: auto; font-family: Arial; font-size: 12px; padding-top: 5px; $ .ajsDebugToolbar ^ margin-left: 10px; margin-right: 10px; height: 25px; line-height: 25px; text-align: center; background-color: #F0F0F0; verical-align: middle; box-sizing: border-box; border-radius: 10px; margin-top: 5px; $ .ajsDebugToolbar input[type='button'] ^ height: 20px; width: 50px; margin-top: 2px; margin-left: 3px; margin-right: 3px; padding: 2px; -webkit-appearance: none; border: solid 1px darkgrey; border-radius: 10px; font-size: 12px; background-color: white; $ .ajsDebugInfo ^ position: absolute; left: 10px; right: 10px; bottom: 10px; height: 25px; border: solid 1px silver; border-radius: 10px; padding: 5px; box-sizing: border-box; font-size: 12px; $"));
                };
                return StyleSheet;
            }());
            view.StyleSheet = StyleSheet;
        })(view = dbg.view || (dbg.view = {}));
    })(dbg = ajs.dbg || (ajs.dbg = {}));
})(ajs || (ajs = {}));
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
/**
 * The debugging namespace contain the debugging console and debugging tools for Ajs and Application developers
 */
var ajs;
(function (ajs) {
    var dbg;
    (function (dbg) {
        "use strict";
        var Console = (function () {
            function Console(config) {
                var defaultModule = "logger";
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
            Object.defineProperty(Console.prototype, "config", {
                get: function () { return this._config; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Console.prototype, "modules", {
                get: function () { return this._modules; },
                enumerable: true,
                configurable: true
            });
            Console.prototype.setInfo = function (info) {
                if (this._infoElement !== null) {
                    this._infoElement.textContent = info;
                }
            };
            Console.prototype.refresh = function () {
                if (this._bodyElement !== null) {
                    this._bodyElement.parentElement.removeChild(this._bodyElement);
                    this._bodyElement = this._body.render();
                    this._config.bodyRenderTarget.appendChild(this._bodyElement);
                    this._infoElement = this._config.bodyRenderTarget.ownerDocument.getElementById("ajsDebugInfo");
                    this._body.currentModule.bodyRendered();
                }
            };
            Console.prototype.show = function () {
                if (this._bodyElement === null) {
                    this._bodyElement = this._body.render();
                    this._config.bodyRenderTarget.appendChild(this._bodyElement);
                    var styleElement = this._styleSheet.render();
                    this._config.styleRenderTarget.appendChild(styleElement);
                    this._styleElements.push(styleElement);
                    for (var key in this._modules) {
                        if (this._modules.hasOwnProperty(key)) {
                            styleElement = this._modules[key].renderStyleSheet();
                            this._config.styleRenderTarget.appendChild(styleElement);
                            this._styleElements.push(styleElement);
                        }
                    }
                    this._infoElement = this._config.bodyRenderTarget.ownerDocument.getElementById("ajsDebugInfo");
                    this._body.currentModule.bodyRendered();
                }
            };
            Console.prototype.hide = function () {
                if (this._bodyElement !== null) {
                    this._bodyElement.parentElement.removeChild(this._bodyElement);
                    this._bodyElement = null;
                    for (var i = 0; i < this._styleElements.length; i++) {
                        this._styleElements[i].parentElement.removeChild(this._styleElements[i]);
                    }
                    this._styleElements = [];
                }
            };
            Console.prototype.getModule = function (name) {
                if (this._modules.hasOwnProperty(name)) {
                    return this._modules[name];
                }
                else {
                    throw ("Invalid console module: " + name);
                }
            };
            Console.prototype._registerModule = function (name, module) {
                this._modules[name] = module;
            };
            Console.prototype._registerModules = function () {
                this._registerModule("logger", new ajs.dbg.modules.logger.Logger(this, this._config.loggerConfig));
            };
            return Console;
        }());
        dbg.Console = Console;
        dbg.console = null;
        function init(config) {
            if (dbg.console === null) {
                dbg.console = new Console(config);
                if (config.showOnBootDelay > 0) {
                    setTimeout(function () { dbg.console.show(); }, config.showOnBootDelay);
                }
            }
        }
        dbg.init = init;
    })(dbg = ajs.dbg || (ajs.dbg = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var dbg;
    (function (dbg) {
        "use strict";
    })(dbg = ajs.dbg || (ajs.dbg = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var dbg;
    (function (dbg) {
        "use strict";
    })(dbg = ajs.dbg || (ajs.dbg = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var dbg;
    (function (dbg) {
        "use strict";
    })(dbg = ajs.dbg || (ajs.dbg = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var dbg;
    (function (dbg) {
        var modules;
        (function (modules) {
            var logger;
            (function (logger_1) {
                "use strict";
                var LogBody = (function () {
                    function LogBody(logger) {
                        this._logger = logger;
                        this._log = logger.records;
                        this._lastSelected = null;
                        this._lastMarked = null;
                    }
                    LogBody.prototype._selectRow = function (e) {
                        var row = e.currentTarget;
                        if (row !== this._lastSelected) {
                            if (this._lastSelected !== null && row !== this._lastSelected) {
                                var r1 = this._lastSelected.ajsdata;
                                var r2 = row.ajsdata;
                                this._logger.setInfo("Time to last selected record: " + Math.abs(r1.time.getTime() - r2.time.getTime()) + "ms");
                            }
                            if (this._lastSelected !== null) {
                                this._lastSelected.removeAttribute("ajsselected");
                                if (this._lastMarked !== null) {
                                    this._lastMarked.removeAttribute("ajsmarked");
                                }
                                this._lastMarked = this._lastSelected;
                                this._lastMarked.setAttribute("ajsmarked", "true");
                            }
                            this._lastSelected = row;
                            this._lastSelected.setAttribute("ajsselected", "true");
                        }
                        else {
                            if (this._lastMarked !== null) {
                                this._lastMarked.removeAttribute("ajsmarked");
                                this._lastMarked = null;
                            }
                        }
                        this._logger.itemSelected(this._lastSelected.ajsdata);
                    };
                    LogBody.prototype._scroll = function (e) {
                        var doc = e.currentTarget.ownerDocument;
                        var hdr = (doc.getElementsByClassName("ajsDebugLogHeader")[0].parentElement);
                        var bdy = (doc.getElementsByClassName("ajsDebugLogBody")[0].parentElement);
                        hdr.scrollLeft = bdy.scrollLeft;
                    };
                    LogBody.prototype.setBreakpoint = function () {
                        this._lastSelected.setAttribute("ajsbreakpoint", "true");
                    };
                    LogBody.prototype.unsetBreakpoint = function () {
                        this._lastSelected.setAttribute("ajsbreakpoint", "false");
                    };
                    LogBody.prototype.clearBreakpoints = function () {
                        var tableElement = this._logElement.children[1].children[0];
                        for (var i = 0; i < tableElement.childElementCount; i++) {
                            if (tableElement.childNodes[i] instanceof HTMLTableRowElement &&
                                tableElement.childNodes[i].hasAttribute("ajsbreakpoint")) {
                                tableElement.childNodes[i].removeAttribute("ajsbreakpoint");
                            }
                        }
                    };
                    ;
                    LogBody.prototype.render = function () {
                        var _this = this;
                        this._lastSelected = null;
                        var lines = [];
                        for (var i = 0; i < this._log.length; i++) {
                            var className = "ajsDebugLog" + dbg.LogType[this._log[i].type];
                            lines.push(AjsDebugTsxFactory.createElement("tr", { class: className, ajsbreakpoint: this._log[i].breakpoint, mousedown: function (e) { return (_this._selectRow(e)); }, ajsdata: this._log[i] },
                                AjsDebugTsxFactory.createElement("td", null, i),
                                AjsDebugTsxFactory.createElement("td", null, this._log[i].occurence),
                                AjsDebugTsxFactory.createElement("td", null, this._log[i].time.getTime() - this._logger.initTime),
                                AjsDebugTsxFactory.createElement("td", null, dbg.LogType[this._log[i].type]),
                                AjsDebugTsxFactory.createElement("td", null, this._log[i].level),
                                AjsDebugTsxFactory.createElement("td", null, this._log[i].module),
                                AjsDebugTsxFactory.createElement("td", null, this._getType(this._log[i].object)),
                                AjsDebugTsxFactory.createElement("td", null, this._log[i].function),
                                AjsDebugTsxFactory.createElement("td", null, this._log[i].caller),
                                AjsDebugTsxFactory.createElement("td", null, this._log[i].message),
                                AjsDebugTsxFactory.createElement("td", null, this._log[i].data)));
                        }
                        this._logElement = (AjsDebugTsxFactory.createElement("div", null,
                            AjsDebugTsxFactory.createElement("div", { class: "ajsDebugLogHeaderContainer" },
                                AjsDebugTsxFactory.createElement("table", { cellpadding: "0", cellspacing: "0", class: "ajsDebugLogHeader" },
                                    AjsDebugTsxFactory.createElement("tr", null,
                                        AjsDebugTsxFactory.createElement("th", null, "No."),
                                        AjsDebugTsxFactory.createElement("th", null, "Occ"),
                                        AjsDebugTsxFactory.createElement("th", null, "Time"),
                                        AjsDebugTsxFactory.createElement("th", null, "Type"),
                                        AjsDebugTsxFactory.createElement("th", null, "Lvl"),
                                        AjsDebugTsxFactory.createElement("th", null, "Module"),
                                        AjsDebugTsxFactory.createElement("th", null, "Object"),
                                        AjsDebugTsxFactory.createElement("th", null, "Function"),
                                        AjsDebugTsxFactory.createElement("th", null, "Caller"),
                                        AjsDebugTsxFactory.createElement("th", null, "Message"),
                                        AjsDebugTsxFactory.createElement("th", null, "Data")))),
                            AjsDebugTsxFactory.createElement("div", { class: "ajsDebugLogContainer", scroll: function (e) { return (_this._scroll(e)); } },
                                AjsDebugTsxFactory.createElement("table", { cellpadding: "0", cellspacing: "0", class: "ajsDebugLogBody" }, lines))));
                        return this._logElement;
                    };
                    LogBody.prototype._getType = function (object) {
                        switch (typeof (object)) {
                            case "string":
                                return "string";
                            case "number":
                                return "number";
                            case "object":
                                if (object === null) {
                                    return "null";
                                }
                                else {
                                    if (object.constructor) {
                                        return ajs.utils.getClassName(object);
                                    }
                                }
                                return "object";
                        }
                    };
                    LogBody.prototype.rendered = function (doc) {
                        var hdr = doc.getElementsByClassName("ajsDebugLogHeader")[0];
                        var bdy = doc.getElementsByClassName("ajsDebugLogBody")[0];
                        for (var i = 0; i < hdr.firstChild.childNodes.length; i++) {
                            var hth = hdr.firstChild.childNodes[i];
                            var btd = bdy.firstChild.childNodes[i];
                            var hcs = window.getComputedStyle(hth);
                            var bcs = window.getComputedStyle(btd);
                            var hthSize = parseFloat(hcs.paddingLeft) + parseFloat(hcs.paddingRight) +
                                parseFloat(hcs.borderLeftWidth) + parseFloat(hcs.borderRightWidth) +
                                parseFloat(hcs.marginLeft) + parseFloat(hcs.marginRight) + parseFloat(hcs.width);
                            var bcsSize = parseFloat(bcs.paddingLeft) + parseFloat(bcs.paddingRight) +
                                parseFloat(bcs.borderLeftWidth) + parseFloat(bcs.borderRightWidth) +
                                parseFloat(bcs.marginLeft) + parseFloat(bcs.marginRight) + parseFloat(bcs.width);
                            if (hthSize > bcsSize) {
                                btd.style.width = hthSize + "px";
                            }
                            else {
                                hth.style.width = bcsSize + "px";
                            }
                        }
                    };
                    return LogBody;
                }());
                logger_1.LogBody = LogBody;
            })(logger = modules.logger || (modules.logger = {}));
        })(modules = dbg.modules || (dbg.modules = {}));
    })(dbg = ajs.dbg || (ajs.dbg = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var dbg;
    (function (dbg) {
        var modules;
        (function (modules) {
            var logger;
            (function (logger) {
                "use strict";
                var LoggerStyleSheet = (function () {
                    function LoggerStyleSheet(log) {
                        this._log = log;
                    }
                    LoggerStyleSheet.prototype.render = function () {
                        return (AjsDebugTsxFactory.createElement("style", { type: "text/css" }, ".ajsDebugLogHeaderContainer ^ position: absolute; left: 10px; top: 70px; right: 10px; overflow: hidden; border: solid 1px silver; -webkit-overflow-scrolling: touch; box-sizing: border-box; white-space: nowrap; $ .ajsDebugLogHeader ^ font-size: 12px; display: inline-block; box-sizing: border-box; $ .ajsDebugLogHeader tr ^ display: inline-block; box-sizing: border-box; $ .ajsDebugLogHeader th ^ width: 1px; padding: 0.25em; white-space: nowrap; border-right: solid 1px silver; border-bottom: solid 1px silver; background-color: grey; color: white; display: inline-block; box-sizing: border-box; overflow: hidden; $ .ajsDebugLogContainer ^ position: absolute; border: solid 1px silver; left: 10px; top: 90px; bottom: 45px; right: 10px; overflow: auto; -webkit-overflow-scrolling: touch; box-sizing: border-box; $ .ajsDebugLogHeaderBody ^ width: 100%; border-left: solid 1px silver; border-top: solid 1px silver; font-size: 12px; $ .ajsDebugLogBody tr[ajsselected=\"true\"] ^ background-color: navy; color: white; $ .ajsDebugLogBody tr[ajsmarked=\"true\"] ^ background-color: darkgrey; color: white; $ .ajsDebugLogBody tr[ajsbreakpoint=\"true\"] ^ color: red; $ .ajsDebugLogBody td ^ padding: 0.25em; white-space: nowrap; border-right: solid 1px silver; border-bottom: solid 1px silver box-sizing: border-box; font-size: 12px; $ .ajsDebugLogEnter ^ background-color: #F4FFF4; $ .ajsDebugLogExit ^ background-color: #FCFCFC; $ .ajsDebugLogConstructor ^ background-color: #FFEDFE; $ .ajsDebugLogInfo ^ background-color: transparent; $ .ajsDebugLogWarning ^ background-color: #FFE7C4; $ .ajsDebugLogError ^ background-color: #FF6060; $"));
                    };
                    return LoggerStyleSheet;
                }());
                logger.LoggerStyleSheet = LoggerStyleSheet;
            })(logger = modules.logger || (modules.logger = {}));
        })(modules = dbg.modules || (dbg.modules = {}));
    })(dbg = ajs.dbg || (ajs.dbg = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var dbg;
    (function (dbg) {
        var modules;
        (function (modules) {
            var logger;
            (function (logger) {
                "use strict";
                var LoggerToolbar = (function () {
                    function LoggerToolbar(log) {
                        this._log = log;
                    }
                    LoggerToolbar.prototype._refreshClick = function (e) {
                        this._log.refresh();
                    };
                    LoggerToolbar.prototype._setBreakpointClick = function (e) {
                        this._log.setBreakpoint();
                    };
                    LoggerToolbar.prototype._resetBreakpointClick = function (e) {
                        this._log.resetBreakpoint();
                    };
                    LoggerToolbar.prototype._clearBreakpointsClick = function (e) {
                        this._log.clearBreakpoints();
                    };
                    LoggerToolbar.prototype.enableBreakpoints = function () {
                        this._element.ownerDocument.getElementById("asjLogToolbarSetBkp").removeAttribute("disabled");
                        this._element.ownerDocument.getElementById("asjLogToolbarResetBkp").removeAttribute("disabled");
                    };
                    LoggerToolbar.prototype.render = function () {
                        var _this = this;
                        this._element = (AjsDebugTsxFactory.createElement("div", null,
                            AjsDebugTsxFactory.createElement("input", { type: "button", value: "Refresh", click: function (e) { _this._refreshClick(e); } }),
                            AjsDebugTsxFactory.createElement("input", { type: "button", value: "Set Bkp", click: function (e) { _this._setBreakpointClick(e); }, disabled: "true", id: "asjLogToolbarSetBkp" }),
                            AjsDebugTsxFactory.createElement("input", { type: "button", value: "Res Bkp", click: function (e) { _this._resetBreakpointClick(e); }, disabled: "true", id: "asjLogToolbarResetBkp" }),
                            AjsDebugTsxFactory.createElement("input", { type: "button", value: "Clr Bkps", click: function (e) { _this._clearBreakpointsClick(e); } })));
                        return this._element;
                    };
                    return LoggerToolbar;
                }());
                logger.LoggerToolbar = LoggerToolbar;
            })(logger = modules.logger || (modules.logger = {}));
        })(modules = dbg.modules || (dbg.modules = {}));
    })(dbg = ajs.dbg || (ajs.dbg = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var dbg;
    (function (dbg) {
        var modules;
        (function (modules) {
            var logger;
            (function (logger) {
                "use strict";
                var Logger = (function () {
                    function Logger(console, config) {
                        this._initTime = (new Date()).getTime();
                        this._console = console;
                        this._config = config;
                        this._records = [];
                        this._sameTypeCounter = {};
                        this._selectedItem = null;
                        this._breakpoints = [];
                        this._styleSheet = new logger.LoggerStyleSheet(this);
                        this._toolBar = new logger.LoggerToolbar(this);
                        this._body = new logger.LogBody(this);
                        if (sessionStorage) {
                            var bkpsJSON = sessionStorage.getItem("AJS_DEBUG_LOGGER_BREAKPOINTS");
                            if (bkpsJSON !== null) {
                                this._breakpoints = JSON.parse(bkpsJSON);
                            }
                        }
                        else {
                            alert("Breakpoints not supported");
                        }
                    }
                    Object.defineProperty(Logger.prototype, "initTime", {
                        get: function () { return this._initTime; },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(Logger.prototype, "records", {
                        get: function () { return this._records; },
                        enumerable: true,
                        configurable: true
                    });
                    Logger.prototype.setInfo = function (info) {
                        this._console.setInfo(info);
                    };
                    Logger.prototype.refresh = function () {
                        this._console.hide();
                        this._console.show();
                    };
                    Logger.prototype.setBreakpoint = function () {
                        if (this._selectedItem !== null && !this._selectedItem.breakpoint) {
                            this._selectedItem.breakpoint = true;
                            this._body.setBreakpoint();
                            this._breakpoints.push({
                                recordTypeId: this._selectedItem.sameTypeId,
                                occurence: this._selectedItem.occurence
                            });
                            sessionStorage.setItem("AJS_DEBUG_LOGGER_BREAKPOINTS", JSON.stringify(this._breakpoints));
                        }
                    };
                    Logger.prototype.resetBreakpoint = function () {
                        if (this._selectedItem !== null && this._selectedItem.breakpoint) {
                            this._selectedItem.breakpoint = false;
                            this._body.unsetBreakpoint();
                            for (var i = 0; i < this._breakpoints.length; i++) {
                                if (this._breakpoints[i].recordTypeId === this._selectedItem.sameTypeId &&
                                    this._breakpoints[i].occurence === this._selectedItem.occurence) {
                                    this._breakpoints.splice(i, 1);
                                    break;
                                }
                            }
                            sessionStorage.setItem("AJS_DEBUG_LOGGER_BREAKPOINTS", JSON.stringify(this._breakpoints));
                        }
                    };
                    Logger.prototype.clearBreakpoints = function () {
                        if (sessionStorage) {
                            this._breakpoints = [];
                            sessionStorage.setItem("AJS_DEBUG_LOGGER_BREAKPOINTS", JSON.stringify(this._breakpoints));
                            this._body.clearBreakpoints();
                        }
                    };
                    Logger.prototype.itemSelected = function (item) {
                        this._selectedItem = item;
                        if (sessionStorage) {
                            this._toolBar.enableBreakpoints();
                        }
                    };
                    Logger.prototype._getFunctionInfo = function () {
                        try {
                            throw new Error("Error");
                        }
                        catch (e) {
                            if (e.stack) {
                                var functions = e.stack.match(/(at ).*(\()/g);
                                if (functions === null) {
                                    functions = e.stack.match(/.*@/g);
                                    if (functions !== null) {
                                        for (var i = 0; i < functions.length; i++) {
                                            functions[i] = functions[i].substr(0, functions[i].length - 1);
                                        }
                                        if (functions.length > 3) {
                                            functions.shift();
                                            functions.shift();
                                            functions.shift();
                                            if (functions.length > 1) {
                                                return { name: functions[0], caller: functions[1] };
                                            }
                                            else {
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
                                    }
                                    else {
                                        return {
                                            name: functions[0].substring(3, functions[0].length - 2),
                                            caller: "Unknown"
                                        };
                                    }
                                }
                            }
                        }
                        return { name: "Unknown", caller: "Unknown" };
                    };
                    Logger.prototype.log = function (type, level, sourceModule, object, message) {
                        var data = [];
                        for (var _i = 5; _i < arguments.length; _i++) {
                            data[_i - 5] = arguments[_i];
                        }
                        if (this._config.logTypes.indexOf(type) === -1 || level > this._config.maxLevel || !this._config.enabled) {
                            return;
                        }
                        if (this._config.sourceModules.indexOf(sourceModule) === -1) {
                            return;
                        }
                        var fnInfo = this._getFunctionInfo();
                        var logRecord = {
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
                            var msg = message ? message : "";
                            if (data[0]) {
                                window.console.log(this._records.length + ": " + dbg.LogType[type] + " " + msg + "[ " + logRecord.module + "." + logRecord.object +
                                    "." + logRecord.function + " ]", data[0]);
                            }
                            else {
                                window.console.log(this._records.length + ": " + msg + "[ " + logRecord.module + "." + logRecord.object +
                                    "." + logRecord.function + " ]");
                            }
                        }
                        var sameTypeId = dbg.LogType[logRecord.type] + " " + level + " " +
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
                        }
                        else {
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
                    };
                    Logger.prototype._checkBreakPoint = function (typeId, occurence) {
                        for (var i = 0; i < this._breakpoints.length; i++) {
                            if (this._breakpoints[i].recordTypeId === typeId && this._breakpoints[i].occurence === occurence) {
                                return true;
                            }
                        }
                        return false;
                    };
                    Logger.prototype.getButtonLabel = function () {
                        return "Log";
                    };
                    Logger.prototype.renderStyleSheet = function () {
                        return this._styleSheet.render();
                    };
                    Logger.prototype.renderToolbar = function () {
                        return this._toolBar.render();
                    };
                    Logger.prototype.renderBody = function () {
                        this._bodyElement = this._body.render();
                        return this._body.render();
                    };
                    Logger.prototype.bodyRendered = function () {
                        this._body.rendered(this._bodyElement.ownerDocument);
                    };
                    return Logger;
                }());
                logger.Logger = Logger;
            })(logger = modules.logger || (modules.logger = {}));
        })(modules = dbg.modules || (dbg.modules = {}));
    })(dbg = ajs.dbg || (ajs.dbg = {}));
})(ajs || (ajs = {}));
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
///<reference path="Console.ts" />
///<reference path="modules/logger/Logger.ts" />
/**
 * The debugging namespace
 */
var ajs;
(function (ajs) {
    var dbg;
    (function (dbg) {
        "use strict";
        var LogType;
        (function (LogType) {
            LogType[LogType["Enter"] = 0] = "Enter";
            LogType[LogType["Exit"] = 1] = "Exit";
            LogType[LogType["Constructor"] = 2] = "Constructor";
            LogType[LogType["Info"] = 3] = "Info";
            LogType[LogType["Warning"] = 4] = "Warning";
            LogType[LogType["Error"] = 5] = "Error";
            LogType[LogType["DomAddListener"] = 6] = "DomAddListener";
            LogType[LogType["DomRemoveListener"] = 7] = "DomRemoveListener";
            LogType[LogType["DomAppendChild"] = 8] = "DomAppendChild";
            LogType[LogType["DomRemoveChild"] = 9] = "DomRemoveChild";
            LogType[LogType["DomReplaceChild"] = 10] = "DomReplaceChild";
        })(LogType = dbg.LogType || (dbg.LogType = {}));
        function log(type, level, module, object, message) {
            var data = [];
            for (var _i = 5; _i < arguments.length; _i++) {
                data[_i - 5] = arguments[_i];
            }
            if (ajs.dbg.console !== null) {
                if (message) {
                    if (data instanceof Array) {
                        ajs.dbg.console.getModule("logger").
                            log(type, level, module, object, message, data);
                    }
                    else {
                        ajs.dbg.console.getModule("logger").
                            log(type, level, module, object, message);
                    }
                }
                else {
                    ajs.dbg.console.getModule("logger").
                        log(type, level, module, object);
                }
            }
        }
        dbg.log = log;
    })(dbg = ajs.dbg || (ajs.dbg = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var dbg;
    (function (dbg) {
        var tsx;
        (function (tsx) {
            "use strict";
        })(tsx = dbg.tsx || (dbg.tsx = {}));
    })(dbg = ajs.dbg || (ajs.dbg = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var dbg;
    (function (dbg) {
        var modules;
        (function (modules) {
            var logger;
            (function (logger) {
                "use strict";
            })(logger = modules.logger || (modules.logger = {}));
        })(modules = dbg.modules || (dbg.modules = {}));
    })(dbg = ajs.dbg || (ajs.dbg = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var dbg;
    (function (dbg) {
        var modules;
        (function (modules) {
            var logger;
            (function (logger) {
                "use strict";
            })(logger = modules.logger || (modules.logger = {}));
        })(modules = dbg.modules || (dbg.modules = {}));
    })(dbg = ajs.dbg || (ajs.dbg = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var dbg;
    (function (dbg) {
        var modules;
        (function (modules) {
            var logger;
            (function (logger) {
                "use strict";
            })(logger = modules.logger || (modules.logger = {}));
        })(modules = dbg.modules || (dbg.modules = {}));
    })(dbg = ajs.dbg || (ajs.dbg = {}));
})(ajs || (ajs = {}));
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
///<reference path="../utils/Utils.ts" />
///<reference path="../dbg/Console.ts" />
///<reference path="../dbg/log.ts" />
/**
 * Boot namespace contains the boot loader and associated interfaces
 * <p>
 * _boot function is called automatically when window.onload event occur. It
 * loads resources configured in the ajs.boot.config and intializes and
 * starts the framework.
 * </p>
 * Boot expect the ajs.boot namespace contain following functions implementation:
 * <ul>
 *    <li>getResourceLists = function(): IResourceLists {
 *        let resourceLists: IResourceLists = { ... }; return resourceLists; }</li>
 *    <li>getAjsConfig(): IAajsConfig {
 *        let ajsConfig: IAjsConfig = { ... }; return ajsConfig; }</li>
 *    <li>getApplicationConfig = function(): ajs.app.IApplicationConfig {
 *        let applicationConfig = { ... }; return applicationConfig }</li>
 * </ul>
 */
var ajs;
(function (ajs) {
    var boot;
    (function (boot) {
        "use strict";
        /**
         * Holds collected ajs config
         */
        var config;
        var bootStarted = false;
        /**
         * Return default boot config
         */
        function _defaultConfig() {
            return {
                bootResourcesLoadingPreference: ajs.resources.LOADING_PREFERENCE.CACHE
            };
        }
        /**
         * Main entry point (executed on application cache events cahced/noupdate/error or window.onload event)
         * Initializes the framework and initiate loading of configured resources)
         */
        function _boot() {
            // get Ajs config
            if (!(boot.getAjsConfig instanceof Function)) {
                throw new boot.GetAjsConfigFunctionNotDefinedException();
            }
            config = boot.getAjsConfig();
            // if debugging is configured, start it up
            if (config.debugging) {
                ajs.dbg.init(config.debugging);
            }
            if (config.boot === undefined) {
                config.boot = _defaultConfig();
            }
            // do some basic logging
            ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.boot", null, "Ajs Framework, (c)2016-2017 Atom Software Studios, s.r.o");
            ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.boot", this);
            ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.boot", null, "Booting up Ajs Framework");
            // initialize config
            ajs.Framework.initialize(config);
            // continue by loading resources and application configuration
            _loadResources();
            ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.boot", this);
        }
        /**
         * Loads resources and continues to the _config function
         */
        function _loadResources() {
            var _this = this;
            ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.boot", this);
            if (!(boot.getResourceLists instanceof Function)) {
                throw new boot.GetResourceListFunctionNotDefinedException();
            }
            var res = boot.getResourceLists();
            // prepare information about resources to be loaded - always prefer to update resources prior using them from cache
            // review if it is possible to use cached resources rather than server ones
            var _resourcesLoadingInfo = [
                ajs.Framework.resourceManager.getMultipleResources(res.localPermanent, ajs.resources.STORAGE_TYPE.LOCAL, ajs.resources.CACHE_POLICY.PERMANENT, config.boot.bootResourcesLoadingPreference),
                ajs.Framework.resourceManager.getMultipleResources(res.localLastRecentlyUsed, ajs.resources.STORAGE_TYPE.LOCAL, ajs.resources.CACHE_POLICY.LASTRECENTLYUSED, config.boot.bootResourcesLoadingPreference),
                ajs.Framework.resourceManager.getMultipleResources(res.sessionPermanent, ajs.resources.STORAGE_TYPE.SESSION, ajs.resources.CACHE_POLICY.PERMANENT, config.boot.bootResourcesLoadingPreference),
                ajs.Framework.resourceManager.getMultipleResources(res.sessionLastRecentlyUsed, ajs.resources.STORAGE_TYPE.SESSION, ajs.resources.CACHE_POLICY.LASTRECENTLYUSED, config.boot.bootResourcesLoadingPreference),
                ajs.Framework.resourceManager.getMultipleResources(res.memoryPermanent, ajs.resources.STORAGE_TYPE.MEMORY, ajs.resources.CACHE_POLICY.PERMANENT, config.boot.bootResourcesLoadingPreference),
                ajs.Framework.resourceManager.getMultipleResources(res.memoryLastRecentlyUsed, ajs.resources.STORAGE_TYPE.MEMORY, ajs.resources.CACHE_POLICY.LASTRECENTLYUSED, config.boot.bootResourcesLoadingPreference),
                ajs.Framework.resourceManager.getMultipleResources(res.direct, undefined, undefined)
            ];
            // wait till resources are loaded and
            Promise.all(_resourcesLoadingInfo).
                // continue by configuring application
                then(function () {
                _configureApplication();
            }).
                // catch the problem
                catch(function (e) {
                ajs.dbg.log(ajs.dbg.LogType.Error, 0, "ajs.boot", _this, "Something went wrong during resource loading " + e, e);
                throw new boot.ResourcesLoadingFailedException();
            });
            ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.boot", this);
        }
        /**
         * Configures the application before it is started
         */
        function _configureApplication() {
            ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.boot", this);
            ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.boot", this, "Getting the Application config");
            if (!(boot.getApplicationConfig instanceof Function)) {
                ajs.dbg.log(ajs.dbg.LogType.Error, 0, this, "GetApplicationConfigFunctionNotDefinedException");
                throw new boot.GetApplicationConfigFunctionNotDefinedException();
            }
            var appConfig = boot.getApplicationConfig();
            ajs.Framework.configureApplication(appConfig);
            _start();
            ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.boot", this);
        }
        /**
         *  Start the framework / application
         */
        function _start() {
            ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.boot", this);
            ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.boot", this, "Starting the framework");
            ajs.Framework.start();
            ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.boot", this);
        }
        /**
         * Performs update of cached files (cleans all caches and forces window to reload)
         * <p>
         * It is called when the application cache recognizes there are updated files on the server.
         * It is simplest possible solution to load updated application resources.
         * </p>
         * <p>
         * the update of cached files is ready. at this time it is not possile to configure what will happen next
         * its hardcoded the complete resource cache managed by the resource manager will be cleaned up and reload is perofrmed
         * to ensure the latest boot/ajs versions are in use and also latest versions of the application code and application
         * resources will be used
         * </p>
         */
        function _update() {
            // does not make sense to log, reload performed
            var resMan = new ajs.resources.ResourceManager();
            resMan.cleanCaches();
            window.location.reload();
        }
        /**
         * Setup listeners related to Application cache feature used to start the booting process
         * <p>
         * During tests it was confirmed the application cache feature, especially notifications
         * processed bellow is not stable (this statement is valid for all tested browsers) and it
         * is necessary to perform, at least, fallback by timer, otherwise it can happen the framework
         * neither the application will get started.
         * </p>
         */
        function _setupEventListeners() {
            // cant use logger as it is possible it is not loaded at this time
            if (window.applicationCache) {
                // process cached event (no change in cached files, boot directly)
                window.applicationCache.addEventListener("cached", function () {
                    if (!bootStarted) {
                        bootStarted = true;
                        _boot();
                    }
                });
                // process noupdate - means that cached files (mainly the cache.manifest) were not updated
                window.applicationCache.addEventListener("noupdate", function () {
                    if (!bootStarted) {
                        bootStarted = true;
                        _boot();
                    }
                });
                // the error occured during the accesing files on the server or another problem during its loading (i.e. offline)
                window.applicationCache.addEventListener("error", function (e) {
                    if (!bootStarted) {
                        bootStarted = true;
                        _boot();
                    }
                });
                // the update of cached files is ready. at this time it is not possile to configure what will happen next
                // its hardcoded the complete resource cache managed by the resource manager will be cleaned up and reload is perofrmed
                // to ensure the latest boot/ajs versions are in use and also latest versions of the application code and application
                // resources will be used
                window.applicationCache.addEventListener("updateready", function () {
                    applicationCache.swapCache();
                    if (!bootStarted) {
                        bootStarted = true;
                        _update();
                    }
                });
                // if appcache is not supported make sure the framework will boot
            }
            // this is fallback if no event is called
            window.addEventListener("load", function () {
                setTimeout(function () {
                    if (!bootStarted) {
                        bootStarted = true;
                        _boot();
                    }
                }, 500);
            });
        }
        // ********************************************************************************
        // this code is executed immediately when the ajs.js script is loaded and evaluated
        // takes care of the debug console initialization and starts the ajs boot process
        // ********************************************************************************
        _setupEventListeners();
    })(boot = ajs.boot || (ajs.boot = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var boot;
    (function (boot) {
        "use strict";
        /** Fired if the ajs.boot.getAjsConfig function is not defined */
        var GetAjsConfigFunctionNotDefinedException = (function (_super) {
            __extends(GetAjsConfigFunctionNotDefinedException, _super);
            function GetAjsConfigFunctionNotDefinedException() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return GetAjsConfigFunctionNotDefinedException;
        }(Error));
        boot.GetAjsConfigFunctionNotDefinedException = GetAjsConfigFunctionNotDefinedException;
        /** Fired if the ajs.boot.getAjsConfig function is not defined */
        var GetApplicationConfigFunctionNotDefinedException = (function (_super) {
            __extends(GetApplicationConfigFunctionNotDefinedException, _super);
            function GetApplicationConfigFunctionNotDefinedException() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return GetApplicationConfigFunctionNotDefinedException;
        }(Error));
        boot.GetApplicationConfigFunctionNotDefinedException = GetApplicationConfigFunctionNotDefinedException;
        /** Fired if the ajs.boot.getResourceList function is not defined */
        var GetResourceListFunctionNotDefinedException = (function (_super) {
            __extends(GetResourceListFunctionNotDefinedException, _super);
            function GetResourceListFunctionNotDefinedException() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return GetResourceListFunctionNotDefinedException;
        }(Error));
        boot.GetResourceListFunctionNotDefinedException = GetResourceListFunctionNotDefinedException;
        /** Fired when loading resources specified in the configuration file fails */
        var ResourcesLoadingFailedException = (function (_super) {
            __extends(ResourcesLoadingFailedException, _super);
            function ResourcesLoadingFailedException() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return ResourcesLoadingFailedException;
        }(Error));
        boot.ResourcesLoadingFailedException = ResourcesLoadingFailedException;
    })(boot = ajs.boot || (ajs.boot = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var boot;
    (function (boot) {
        "use strict";
    })(boot = ajs.boot || (ajs.boot = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var boot;
    (function (boot) {
        "use strict";
    })(boot = ajs.boot || (ajs.boot = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var boot;
    (function (boot) {
        "use strict";
    })(boot = ajs.boot || (ajs.boot = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var boot;
    (function (boot) {
        "use strict";
    })(boot = ajs.boot || (ajs.boot = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var boot;
    (function (boot) {
        "use strict";
    })(boot = ajs.boot || (ajs.boot = {}));
})(ajs || (ajs = {}));
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
// TypeDoc testing
var ajs;
(function (ajs) {
    var app;
    (function (app) {
        "use strict";
        /**
         * this is signature 4
         * @param test
         */
        function test(test) {
            return null;
        }
        app.test = test;
        /**
         * this is test1 signature
         * @param x rrr
         */
        function test1(x) {
            return null;
        }
        app.test1 = test1;
        /**
         * this is test2 function
         */
        function test2() {
            return 0;
        }
        /**
         * this is test3 function
         */
        function test3(test) {
            return "";
        }
        /**
         * This is class 1
         */
        var Class1 = (function () {
            function Class1() {
            }
            return Class1;
        }());
        /**
         * This is class 2
         */
        var Class2 = (function (_super) {
            __extends(Class2, _super);
            function Class2() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return Class2;
        }(Class1));
        /**
         * This is class 3
         */
        var Class3 = (function (_super) {
            __extends(Class3, _super);
            function Class3() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return Class3;
        }(Class2));
        /**
         * This is class 4
         */
        var Class4 = (function (_super) {
            __extends(Class4, _super);
            function Class4() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return Class4;
        }(Class3));
    })(app = ajs.app || (ajs.app = {}));
})(ajs || (ajs = {}));
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
/**
 * Contains base classes for the Ajs Application, application configuration and exceptions.
 * <p>The Application class has to be derived by the user code to initialize the
 * application, load necessary resources and setup routes.</p>
 * <p>The derived application class is construced and initialized during the
 * framework boot process. The boot manager calls the framework to instantiate,
 * configure and initialize the application.</p>
 * <p>As the application initialization can be an asynchronous process (resources
 * could be loading and additional user tasks can be done during the initialization)
 * so it is necessary to call the _initDone method once the initialization is completed.</p>
 * <h5>Application Initialization Example</h5>
 * #example app_init
 *
 */
var ajs;
(function (ajs) {
    var app;
    (function (app) {
        "use strict";
        /**
         * The application class should be derived by the user application class in order
         * to perform basic application tasks such as application initialization, application
         * resource loading, routes setup, application state loading and so on
         */
        var Application = (function () {
            /**
             * Constructs the application object, stores the configuration to it and add event listener
             * for beforeunload window event. The _finalize method is called when the navigation is
             * going out of the page
             * @param config Application configuration. TODO: Not in use now. It can be used by the user application
             */
            function Application(config) {
                var _this = this;
                this._config = config;
                window.addEventListener("beforeunload", function (e) {
                    _this._finalize();
                });
            }
            Object.defineProperty(Application.prototype, "config", {
                /** Returns the application configuration */
                get: function () { return this._config; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Application.prototype, "initialized", {
                /** Returns the application initialization status */
                get: function () { return this._initialized; },
                enumerable: true,
                configurable: true
            });
            /**
             * MUST BE OVERRIDEN IN THE INHERITED APPLICATION CLASS
             * Called from the framework during as a last step of the initialization procedure
             * Must be overriden by the children class to initialize the user application. The
             * overriden method (or async methods called in the chain) must make sure the
             * this._initDone() method is called in order to run the application
             */
            Application.prototype.initialize = function () {
                throw new app.NotImplementedException;
            };
            /**
             * Must be called by inherited class super.initDone(); at the end of initialization
             * of the user application in order the application will get started
             */
            Application.prototype._initDone = function () {
                this._initialized = true;
                this._run();
            };
            /**
             * Starts the application by navigating to the page specified in the url adress bar of the browser
             * @throws NotInitializedException Thrown when _run is called but the application was not
             *                                 initialized by calling the _initDone method
             */
            Application.prototype._run = function () {
                if (!this._initialized) {
                    throw new app.NotInitializedException();
                }
                ajs.Framework.navigator.canNavigate = true;
                ajs.Framework.navigator.navigated();
            };
            /**
             * MUST BE OVERRIDEN IN THE INHERITED APPLICATION CLASS
             * Called on window.beforeunload event in order to store the application state before
             * user leaves the page or to cleanup procedures (such as clearing timers and so on). This
             * method should not be used for displaying the dialog and asking user if he is sure to leave
             * the page. This should be done directly in the user application by adding additional
             * beforeunload event handler (will be usualy done in some root ViewComponent)
             */
            Application.prototype._finalize = function () {
                throw new app.NotImplementedException;
            };
            return Application;
        }());
        app.Application = Application;
    })(app = ajs.app || (ajs.app = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var app;
    (function (app) {
        "use strict";
        /**
         * Thrown when the application recognizes it was not initialized before calling the _run method
         * @
         */
        var NotInitializedException = (function (_super) {
            __extends(NotInitializedException, _super);
            function NotInitializedException() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return NotInitializedException;
        }(Error));
        app.NotInitializedException = NotInitializedException;
        /**
         * Thrown when the inherited application does not implement required functionality
         * @
         */
        var NotImplementedException = (function (_super) {
            __extends(NotImplementedException, _super);
            function NotImplementedException() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return NotImplementedException;
        }(Error));
        app.NotImplementedException = NotImplementedException;
    })(app = ajs.app || (ajs.app = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var app;
    (function (app) {
        "use strict";
    })(app = ajs.app || (ajs.app = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var app;
    (function (app) {
        "use strict";
    })(app = ajs.app || (ajs.app = {}));
})(ajs || (ajs = {}));
//# sourceMappingURL=ajs.js.map