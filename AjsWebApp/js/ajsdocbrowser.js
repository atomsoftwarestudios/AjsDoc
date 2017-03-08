/*! ************************************************************************
The MIT License (MIT)
Copyright (c)2017 Atom Software Studios. All rights reserved.

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
var ajsdoc;
(function (ajsdoc) {
    "use strict";
    /** The pplication configuration will be available globally after application initialization */
    ajsdoc.config = null;
    ajsdoc.resources = [];
})(ajsdoc || (ajsdoc = {}));
/* *************************************************************************
The MIT License (MIT)
Copyright (c)2017 Atom Software Studios. All rights reserved.

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
var ajsdoc;
(function (ajsdoc) {
    "use strict";
    /**
     * The AjsDocBrowser application
     */
    var AjsDocBrowser = (function (_super) {
        __extends(AjsDocBrowser, _super);
        function AjsDocBrowser() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * Starts application intitalization by loading template list file defined in the config
         */
        AjsDocBrowser.prototype.initialize = function () {
            ajsdoc.config = this._config;
            this._loadTemplatesList();
        };
        /**
         * Loads a list of templates to be loaded and continues with loadTemplates
         */
        AjsDocBrowser.prototype._loadTemplatesList = function () {
            var _this = this;
            // load template list (JSON file)
            var templateList = ajs.Framework.resourceManager.getResource(this._config.templateList, this._config.storageType, ajs.resources.CACHE_POLICY.PERMANENT, this._config.templateLoadingPreference);
            templateList.
                // on success parse the templates list and load templates
                then(function (resource) {
                _this._loadTemplates(JSON.parse(resource.data));
            }).
                // otherwise crash
                catch(function (reason) {
                throw new Error("Failed to load template list." + reason);
            });
        };
        /**
         * Initiate loading of templates defined in the template list
         */
        AjsDocBrowser.prototype._loadTemplates = function (templateUrls) {
            var _this = this;
            var templatePromise = ajs.Framework.templateManager.loadTemplates(templateUrls, ajsdoc.config.storageType, ajs.resources.CACHE_POLICY.PERMANENT, this._config.templateLoadingPreference);
            templatePromise.then(function (templates) {
                _this._loadResourcesList();
            }).catch(function (reason) {
                throw new Error("Failed to load templates");
            });
        };
        /**
         * Initiates loading of the resources list file
         */
        AjsDocBrowser.prototype._loadResourcesList = function () {
            var _this = this;
            // load template list (JSON file)
            var resourceList = ajs.Framework.resourceManager.getResource(this._config.resourceList, this._config.storageType, ajs.resources.CACHE_POLICY.PERMANENT, this._config.resourceLoadingPreference);
            resourceList.
                // on success parse the templates list and load templates
                then(function (resource) {
                _this._loadResources(JSON.parse(resource.data));
            }).
                // otherwise crash
                catch(function (reason) {
                throw new Error("Failed to load resources configuration");
            });
        };
        /**
         * Initiates loading of resources specified in the resources list file + data
         */
        AjsDocBrowser.prototype._loadResources = function (resourceUrls) {
            var _this = this;
            resourceUrls.push(ajsdoc.config.dataSources.program);
            resourceUrls.push(ajsdoc.config.dataSources.toc);
            var resourcesPromise = ajs.Framework.resourceManager.getMultipleResources(resourceUrls, this._config.storageType, ajs.resources.CACHE_POLICY.PERMANENT, this._config.resourceLoadingPreference);
            // void promise, don't store/return, just resolve
            /* tslint:disable */
            new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                var e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, resourcesPromise];
                        case 1:
                            _a.sent();
                            this._initDone();
                            return [3 /*break*/, 3];
                        case 2:
                            e_1 = _a.sent();
                            throw new Error("Failed to load templates");
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            /* tslint:enable */
        };
        /**
         * Finalizes the application when the browser tab is about to be closed
         */
        AjsDocBrowser.prototype._finalize = function () {
            console.warn("IMPLEMENT: AjsDocBrowser.application.finalize");
        };
        return AjsDocBrowser;
    }(ajs.app.Application));
    ajsdoc.AjsDocBrowser = AjsDocBrowser;
})(ajsdoc || (ajsdoc = {}));
/* *************************************************************************
The MIT License (MIT)
Copyright (c)2017 Atom Software Studios. All rights reserved.

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
var ajsdoc;
(function (ajsdoc) {
    "use strict";
    var InvalidPathException = (function () {
        function InvalidPathException() {
        }
        return InvalidPathException;
    }());
    ajsdoc.InvalidPathException = InvalidPathException;
})(ajsdoc || (ajsdoc = {}));
/* *************************************************************************
The MIT License (MIT)
Copyright (c)2017 Atom Software Studios. All rights reserved.

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
var ajsdoc;
(function (ajsdoc) {
    "use strict";
})(ajsdoc || (ajsdoc = {}));
/* *************************************************************************
The MIT License (MIT)
Copyright (c)2017 Atom Software Studios. All rights reserved.

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
var ajsdoc;
(function (ajsdoc) {
    "use strict";
})(ajsdoc || (ajsdoc = {}));
/* *************************************************************************
The MIT License (MIT)
Copyright (c)2017 Atom Software Studios. All rights reserved.

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
var ajsdoc;
(function (ajsdoc) {
    "use strict";
})(ajsdoc || (ajsdoc = {}));
/* *************************************************************************
The MIT License (MIT)
Copyright (c)2017 Atom Software Studios. All rights reserved.

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
var ajsdoc;
(function (ajsdoc) {
    "use strict";
})(ajsdoc || (ajsdoc = {}));
/* *************************************************************************
The MIT License (MIT)
Copyright (c)2017 Atom Software Studios. All rights reserved.

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
var ajsdoc;
(function (ajsdoc) {
    "use strict";
})(ajsdoc || (ajsdoc = {}));
/* *************************************************************************
The MIT License (MIT)
Copyright (c)2017 Atom Software Studios. All rights reserved.

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
var ajsdoc;
(function (ajsdoc) {
    "use strict";
})(ajsdoc || (ajsdoc = {}));
/* *************************************************************************
The MIT License (MIT)
Copyright (c)2017 Atom Software Studios. All rights reserved.

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
var ajsdoc;
(function (ajsdoc) {
    "use strict";
    ;
})(ajsdoc || (ajsdoc = {}));
/* *************************************************************************
The MIT License (MIT)
Copyright (c)2017 Atom Software Studios. All rights reserved.

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
var ajsdoc;
(function (ajsdoc) {
    "use strict";
})(ajsdoc || (ajsdoc = {}));
/* *************************************************************************
The MIT License (MIT)
Copyright (c)2017 Atom Software Studios. All rights reserved.

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
var ajsdoc;
(function (ajsdoc) {
    "use strict";
})(ajsdoc || (ajsdoc = {}));
/* *************************************************************************
The MIT License (MIT)
Copyright (c)2017 Atom Software Studios. All rights reserved.

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
var ajsdoc;
(function (ajsdoc) {
    "use strict";
})(ajsdoc || (ajsdoc = {}));
/* *************************************************************************
The MIT License (MIT)
Copyright (c)2017 Atom Software Studios. All rights reserved.

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
var ajsdoc;
(function (ajsdoc) {
    "use strict";
})(ajsdoc || (ajsdoc = {}));
/* *************************************************************************
The MIT License (MIT)
Copyright (c)2017 Atom Software Studios. All rights reserved.

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
var ajsdoc;
(function (ajsdoc) {
    "use strict";
    var ContentModel = (function (_super) {
        __extends(ContentModel, _super);
        function ContentModel() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ContentModel.prototype.getMenu = function (path) {
            var _this = this;
            this._checkInitialized(new Error("Documentation contents loading timeout"), function () { _this._getMenu(path); });
        };
        ContentModel.prototype.getNavBar = function (path) {
            var _this = this;
            this._checkInitialized(new Error("Program data loading timeout"), function () { _this._getNavBar(path); });
        };
        ContentModel.prototype.getContent = function (path) {
            var _this = this;
            this._checkInitialized(new Error("Documentation contents loading timeout"), function () { _this._getContent(path); });
        };
        ContentModel.prototype._initialize = function () {
            var _this = this;
            var resPromise = ajs.Framework.resourceManager.getResource(ajsdoc.config.dataSources.toc, ajsdoc.config.storageType, ajs.resources.CACHE_POLICY.PERMANENT, ajs.resources.LOADING_PREFERENCE.CACHE);
            resPromise.then(function (resource) { return __awaiter(_this, void 0, void 0, function () {
                var contents, e_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            this._data = JSON.parse(resource.data);
                            contents = [];
                            contents.push(ajs.Framework.resourceManager.getResource(this._data.defaultPath, ajsdoc.config.storageType, ajs.resources.CACHE_POLICY.PERMANENT, ajs.resources.LOADING_PREFERENCE.CACHE));
                            this._getResourcesFromData(this._data.toc, contents);
                            return [4 /*yield*/, Promise.all(contents)];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            e_2 = _a.sent();
                            throw new Error("Failed to load documentation contents");
                        case 3:
                            this._prepareData();
                            this._initialized = true;
                            return [2 /*return*/];
                    }
                });
            }); }).catch(function (e) {
                throw new Error("Failed to load table of contents");
            });
        };
        ContentModel.prototype._getResourcesFromData = function (article, contents) {
            if (article.path) {
                contents.push(ajs.Framework.resourceManager.getResource(article.path, ajsdoc.config.storageType, ajs.resources.CACHE_POLICY.PERMANENT, ajs.resources.LOADING_PREFERENCE.CACHE));
            }
            if (article.children) {
                for (var i = 0; i < article.children.length; i++) {
                    this._getResourcesFromData(article.children[i], contents);
                }
            }
        };
        ContentModel.prototype._prepareData = function (article, parent, key) {
            if (article === undefined) {
                this._prepareData(this._data.toc, null, "0");
            }
            else {
                article.parent = parent;
                article.key = key;
                article.label = this._getLabel(article);
                article.navPath = parent && parent !== null ? parent.navPath + "/" : "";
                article.navPath += article.label.replace(/ /g, "-");
                article.label = article.label.substr(article.label.indexOf(" ") + 1);
                if (article.children instanceof Array) {
                    for (var i = 0; i < article.children.length; i++) {
                        this._prepareData(article.children[i], article, key + "." + i);
                    }
                }
            }
        };
        ContentModel.prototype._getLabel = function (article) {
            var path;
            var label;
            if (article.hasOwnProperty("path")) {
                path = article.path;
            }
            else {
                return "";
            }
            label = path.substr(path.lastIndexOf("/") + 1);
            label = label.substr(0, label.lastIndexOf("."));
            return label;
        };
        ContentModel.prototype._getMenu = function (navPath) {
            var article = this.navigate(navPath);
            if (article.children === undefined || article.children.length === 0) {
                article = article.parent;
            }
            var menu = {
                parentLabel: "",
                parentPath: "",
                label: "",
                groups: [],
                items: [],
            };
            if (article.parent !== null && article.parent) {
                menu.items.push({
                    key: article.navPath,
                    label: article.label,
                    path: article.navPath,
                    selected: article.navPath === ("/" + navPath),
                    expandable: false
                });
            }
            for (var i = 0; i < article.children.length; i++) {
                var item = {
                    key: article.navPath,
                    label: article.children[i].label,
                    path: article.children[i].navPath,
                    selected: article.children[i].navPath === ("/" + navPath),
                    expandable: article.children[i].children instanceof Array && article.children[i].children.length > 0
                };
                menu.label = article.parent && article.parent.label ? article.parent.label : "Guide & Examples";
                menu.parentPath = article.parent && article.parent !== null ?
                    article.parent.navPath !== "" ? article.parent.navPath : "/"
                    :
                        "";
                menu.items.push(item);
            }
            this._dataReadyNotifier.notify(this, { menuState: menu });
        };
        ContentModel.prototype._getContent = function (path) {
            var _this = this;
            var article = this.navigate(path);
            if (article.path) {
                var resource = ajs.Framework.resourceManager.getResource(article.path, ajsdoc.config.storageType, ajs.resources.CACHE_POLICY.PERMANENT, ajs.resources.LOADING_PREFERENCE.CACHE);
                resource.then(function (resource) {
                    _this._dataReadyNotifier.notify(_this, { articleState: resource.data });
                }).catch(function (reason) {
                    throw "Resource " + article.path + " was not loaded";
                });
            }
            else {
                this._dataReadyNotifier.notify(this, { articleState: "" });
            }
        };
        ContentModel.prototype._getNavBar = function (path) {
            var items = [];
            var adata = this.navigate(path);
            var key = 0;
            while (adata !== null) {
                var navBarItem = {
                    key: key.toString(),
                    firstItem: false,
                    itemPath: adata.navPath,
                    itemType: "",
                    itemLabel: adata.label
                };
                if (adata.parent !== null) {
                    items.unshift(navBarItem);
                    key++;
                }
                adata = adata.parent;
            }
            if (items.length > 0) {
                items[0].firstItem = true;
            }
            this._dataReadyNotifier.notify(this, { navBarState: items });
        };
        ContentModel.prototype.navigate = function (path) {
            var article = this._data.toc;
            if (path === "") {
                return article;
            }
            else {
                path = "/" + path;
            }
            var found = false;
            while (article !== null && !found) {
                if (article.navPath === path) {
                    found = true;
                    break;
                }
                else {
                    var newArticle = null;
                    if (article.children) {
                        for (var i = 0; i < article.children.length; i++) {
                            var artPath = article.children[i].navPath;
                            if (path.substr(0, artPath.length) === artPath) {
                                newArticle = article.children[i];
                                break;
                            }
                        }
                    }
                    article = newArticle;
                }
            }
            if (article === null) {
                throw new ajsdoc.InvalidPathException();
            }
            return article;
        };
        return ContentModel;
    }(ajs.mvvm.model.Model));
    ajsdoc.ContentModel = ContentModel;
})(ajsdoc || (ajsdoc = {}));
/* *************************************************************************
The MIT License (MIT)
Copyright (c)2017 Atom Software Studios. All rights reserved.

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
var ajsdoc;
(function (ajsdoc) {
    "use strict";
    var KIND_MAP = {
        Module: "Modules",
        Class: "Classes",
        Interface: "Interfaces",
        Function: "Functions",
        Property: "Properties",
        Method: "Methods",
        Accessor: "Accessors",
        Variable: "Variables",
        Enumeration: "Enumerations",
        Object_literal: "Object literals",
        Constructor: "Constructor"
    };
    var MENU_DONT_EXPAND = [
        "Interface",
        "Variable",
        "Enumeration",
        "Object literal",
        "Function",
        "Constructor",
        "Method",
        "Property",
        "Accessor"
    ];
    var ProgramModel = (function (_super) {
        __extends(ProgramModel, _super);
        function ProgramModel() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ProgramModel.prototype.getMenu = function (path) {
            var _this = this;
            this._checkInitialized(new Error("Program data loading timeout"), function () { _this._getMenu(path); });
        };
        ProgramModel.prototype.getNavBar = function (path) {
            var _this = this;
            this._checkInitialized(new Error("Program data loading timeout"), function () { _this._getNavBar(path); });
        };
        ProgramModel.prototype.getContent = function (path) {
            var _this = this;
            this._checkInitialized(new Error("Program data loading timeout"), function () { _this._getContent(path); });
        };
        ProgramModel.prototype._initialize = function () {
            var _this = this;
            var res = ajs.Framework.resourceManager.getResource(ajsdoc.config.dataSources.program, ajsdoc.config.storageType, ajs.resources.CACHE_POLICY.PERMANENT, ajs.resources.LOADING_PREFERENCE.CACHE);
            res.then(function (resource) {
                // parse loaded data and prepare internal structures
                _this._itemsById = {};
                _this._jsonData = resource.data;
                _this._data = JSON.parse(_this._jsonData);
                _this._data.kindString = "";
                _this._data.name = "";
                _this._data.comment = { shortText: "<span></span>" };
                _this._data.kind = -1;
                _this._prepareData(_this._data, null);
                _this._initialized = true;
            }).catch(function (reason) {
                throw new Error("Unable to load program data");
            });
        };
        // anotate the data with additional information
        ProgramModel.prototype._prepareData = function (node, parent) {
            node.parent = parent;
            if (node.id !== undefined) {
                this._itemsById[node.id] = node;
            }
            if (parent && parent !== null) {
                if (node.parent && node.parent.path) {
                    node.path = parent.path;
                }
                node.path = node.path && node.name ? node.path += "/" + node.name : node.path = "/" + node.name;
            }
            else {
                if (node !== this._data && node.name) {
                    node.path = "/" + node.name;
                }
                else {
                    node.path = "";
                }
            }
            if (node.children) {
                for (var i = 0; i < node.children.length; i++) {
                    this._prepareData(node.children[i], node);
                }
            }
        };
        ProgramModel.prototype._getMenu = function (navPath) {
            var node = this.navigate(navPath, true);
            if (!(node.children instanceof Array) || node.children.length === 0) {
                node = node.parent;
            }
            var parentLabel = node.parent !== null && node.parent.kind !== 0 ?
                node.parent.kindString + " " + node.parent.name : null;
            var parentPath;
            if (node.parent !== null) {
                if (node.parent === this._data) {
                    parentPath = "";
                }
                else {
                    parentPath = "/ref" + node.parent.path;
                }
            }
            else {
                parentPath = "";
            }
            var label = node.parent && node.parent.kind !== 0 ? node.parent.kindString + " " + node.parent.name : null;
            var menu = {
                parentLabel: parentLabel,
                parentPath: parentPath,
                label: label,
                groups: [],
                items: []
            };
            if (node.parent.kind !== -1) {
                menu.items.push({
                    key: "/ref" + node.path,
                    path: "/ref" + node.path,
                    label: node.kindString + " " + node.name,
                    selected: node.path === ("/" + navPath),
                    expandable: false
                });
            }
            if (node.children) {
                for (var i = 0; i < node.children.length; i++) {
                    var kindMapped = "Unknown [" + node.children[i].kindString + "]";
                    if (KIND_MAP.hasOwnProperty(node.children[i].kindString.replace(" ", "_"))) {
                        kindMapped = KIND_MAP[node.children[i].kindString.replace(" ", "_")];
                    }
                    var isFromLibDTs = false;
                    // ignore everyithing from lib.d.ts
                    if (node.children[i].sources instanceof Array) {
                        for (var j = 0; j < node.children[i].sources.length; j++) {
                            if (node.children[i].sources[j].fileName.indexOf("lib.d.ts") !== -1) {
                                isFromLibDTs = true;
                                break;
                            }
                        }
                    }
                    var itemGroupIndex = this._getGroupIndex(menu, kindMapped);
                    if (itemGroupIndex === -1 && !isFromLibDTs) {
                        menu.groups.push({
                            key: kindMapped + node.children[i].id,
                            label: kindMapped,
                            items: []
                        });
                        itemGroupIndex = menu.groups.length - 1;
                    }
                    if (this._includeInMenu(node.children[i].kindString) && !isFromLibDTs) {
                        menu.groups[itemGroupIndex].items.push({
                            key: node.children[i].id.toString(),
                            path: "/ref" + node.children[i].path,
                            label: node.children[i].name,
                            selected: node.children[i].path === ("/" + navPath),
                            expandable: node.children[i].children instanceof Array &&
                                node.children[i].children.length > 0 &&
                                MENU_DONT_EXPAND.indexOf(node.children[i].kindString) === -1
                        });
                    }
                }
            }
            this._dataReadyNotifier.notify(this, { menuState: menu });
        };
        ProgramModel.prototype._getNavBar = function (path) {
            var items = [];
            var node = this.navigate(path);
            var key = 0;
            while (node !== null) {
                var navBarItem = {
                    key: key.toString(),
                    firstItem: false,
                    itemPath: "/ref" + node.path,
                    itemType: node.kindString,
                    itemLabel: node.name
                };
                if (node.kind !== -1) {
                    items.unshift(navBarItem);
                    key++;
                }
                node = node.parent;
            }
            if (items.length > 0) {
                items[0].firstItem = true;
            }
            this._dataReadyNotifier.notify(this, { navBarState: items });
        };
        ProgramModel.prototype._getContent = function (path) {
            this._dataReadyNotifier.notify(this, { articleState: this.navigate(path) });
        };
        ProgramModel.prototype._getGroupIndex = function (menu, label) {
            for (var i = 0; i < menu.groups.length; i++) {
                if (menu.groups[i].label === label) {
                    return i;
                }
            }
            return -1;
        };
        ProgramModel.prototype._includeInMenu = function (nodeKind) {
            return true;
        };
        ProgramModel.prototype.navigate = function (path, dontExpandAll) {
            var node = this._data;
            if (path === "") {
                return node;
            }
            if (path[path.length - 1] === "/") {
                path = path.substr(0, path.length - 1);
            }
            var names = path.split("/");
            path = "";
            for (var i = 0; i < names.length; i++) {
                if (path.length === 0) {
                    path = names[i];
                }
                else {
                    path = path + "/" + names[i];
                }
                node = this._searchId(node, names[i]);
                if (node === null) {
                    throw new ajsdoc.InvalidPathException();
                }
            }
            if (dontExpandAll && MENU_DONT_EXPAND.indexOf(node.kindString) !== -1) {
                return node.parent;
            }
            return node;
        };
        // searches for the id under given node children
        ProgramModel.prototype._searchId = function (node, name) {
            for (var i = 0; i < node.children.length; i++) {
                if (node.children[i].name === name) {
                    return node.children[i];
                }
            }
            return null;
        };
        // searches for the item with the given id in the whole tree
        ProgramModel.prototype.getItemById = function (id) {
            if (this._itemsById.hasOwnProperty(id.toString())) {
                return this._itemsById[id];
            }
            return null;
        };
        return ProgramModel;
    }(ajs.mvvm.model.Model));
    ajsdoc.ProgramModel = ProgramModel;
})(ajsdoc || (ajsdoc = {}));
/* *************************************************************************
The MIT License (MIT)
Copyright (c)2017 Atom Software Studios. All rights reserved.

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
/* *************************************************************************
The MIT License (MIT)
Copyright (c)2017 Atom Software Studios. All rights reserved.

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
var ajsdoc;
(function (ajsdoc) {
    "use strict";
    var AjsDoc = (function (_super) {
        __extends(AjsDoc, _super);
        function AjsDoc() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        AjsDoc.prototype._defaultState = function () {
            return {
                ajsDocLayout: {
                    menuVisible: true,
                    ajsDocHeader: {},
                    ajsDocLayoutMenuButton: {},
                    ajsDocContextSwitcher: {},
                    ajsDocMenu: {},
                    ajsDocArticle: {},
                    ajsDocNavBar: {},
                    ajsDocFooter: {}
                }
            };
        };
        /**
         * Synchronous initialization of the view component
         * Subscribes to the navigation notifier, inititalizes the view component and
         * initiates loading of resources. Once resources are loaded the _initAsync
         * method is called to finish the initialization and perform initial state
         * set call
         */
        AjsDoc.prototype._initialize = function () {
            var _this = this;
            // create models
            this._progModel = ajs.Framework.modelManager.getModelInstance(ajsdoc.ProgramModel);
            this._contentModel = ajs.Framework.modelManager.getModelInstance(ajsdoc.ContentModel);
            // subscribe to _navigated event
            this._navigatedListener = function (sender) {
                _this._navigated();
                return true;
            };
            this.ajs.view.navigationNotifier.subscribe(this._navigatedListener);
            // subscribe to program model data ready notifier
            this._programDataReady = function (sender, data) {
                _this._processProgramData(data);
                return true;
            };
            this._progModel.dataReadyNotifier.subscribe(this._programDataReady);
            // subscribe to content model data ready notifier
            this._contentDataReady = function (sender, data) {
                _this._processContentData(data);
                return true;
            };
            this._contentModel.dataReadyNotifier.subscribe(this._contentDataReady);
        };
        /**
         * Unsubscribe event listeners and frees models
         */
        AjsDoc.prototype._finalize = function () {
            this.ajs.view.navigationNotifier.unsubscribe(this._navigatedListener);
            this._progModel.dataReadyNotifier.unsubscribe(this._programDataReady);
            this._contentModel.dataReadyNotifier.unsubscribe(this._contentDataReady);
            ajs.Framework.modelManager.freeModelInstance(ajsdoc.ProgramModel);
            ajs.Framework.modelManager.freeModelInstance(ajsdoc.ContentModel);
        };
        /**
         * Executed when the browser navigation occurs
         * This method is called from the notifier registered in the _initialize method
         */
        AjsDoc.prototype._navigated = function () {
            this._updateView();
        };
        /**
         * Called when the ProgramModel asynchronously prepares the state to be set
         * @param data State to be set. Can be a menuState, navBarState or a contentState
         */
        AjsDoc.prototype._processProgramData = function (data) {
            var _this = this;
            if (data.menuState) {
                this.ajsDocLayout.ajsDocMenu.setState(data.menuState);
            }
            if (data.navBarState) {
                var navBarState = {
                    items: data.navBarState
                };
                this.ajsDocLayout.ajsDocNavBar.setState(navBarState);
            }
            if (data.articleState) {
                var articleState = this._prepareArticleState(data.articleState);
                articleState.then(function (state) {
                    _this.ajsDocLayout.ajsDocArticle.clearState(false);
                    _this.ajsDocLayout.ajsDocArticle.setState(state);
                });
            }
        };
        /**
         * Called when the ContentModel asynchronously prepares the state to be set
         * @param data State to be set. Can be a menuState or a contentState
         */
        AjsDoc.prototype._processContentData = function (data) {
            var _this = this;
            if (data.menuState) {
                this.ajsDocLayout.ajsDocMenu.setState(data.menuState);
            }
            if (data.navBarState) {
                var navBarState = {
                    items: data.navBarState
                };
                this.ajsDocLayout.ajsDocNavBar.setState(navBarState);
            }
            if (data.articleState) {
                var descPromise = this._setupHTMLContent("<div class=\"ajsDocArticleContent\">" + data.articleState + "</div>");
                descPromise.then(function (desc) {
                    var articleState = {
                        caption: "",
                        description: desc
                    };
                    _this.ajsDocLayout.ajsDocArticle.clearState(false);
                    _this.ajsDocLayout.ajsDocArticle.setState(articleState);
                });
            }
        };
        /**
         * updates the view based on the navigation path
         * @param updateLayout Specifies if the full layout render should be performed at once or if separate components should be rendered
         */
        AjsDoc.prototype._updateView = function () {
            var path;
            var routeInfo = ajs.Framework.router.currentRoute;
            if (routeInfo.base.substr(0, 3) === "ref") {
                if (routeInfo.base.substr(3, 1) === "/") {
                    path = routeInfo.base.substr(4);
                }
                else {
                    path = routeInfo.base.substr(3);
                }
                this._progModel.getMenu(path);
                this._progModel.getNavBar(path);
                this._progModel.getContent(path);
            }
            else {
                this._contentModel.getMenu(routeInfo.base);
                this._contentModel.getNavBar(routeInfo.base);
                this._contentModel.getContent(routeInfo.base);
            }
        };
        /**
         * Prepares the article state based on the current navigation path and data types to be displayed
         * @param node Node from the data has to be collected
         */
        AjsDoc.prototype._prepareArticleState = function (node) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var hierarchyNode = _this._buildHierarchy(node);
                var retVal = {};
                retVal.caption = node.kindString + " " + node.name;
                var syntaxes = [];
                // if (node.kindString === "Function" || node.kindString === "Interface" || node.kindString === "Method") {
                var desc = _this._getComment(node);
                syntaxes.push(node);
                if (node.signatures && node.signatures.length > 0) {
                    for (var i = 0; i < node.signatures.length; i++) {
                        syntaxes.push(node.signatures[i]);
                        if (desc === "DOCUMENTATION IS MISSING!") {
                            desc = "";
                        }
                        desc += "<p>" + _this._getComment(node.signatures[i]) + "</p>";
                    }
                }
                _this._setupHTMLContent(desc)
                    .then(function (desc) {
                    retVal.description = desc;
                    if (hierarchyNode) {
                        retVal.hierarchy = hierarchyNode;
                    }
                    if (syntaxes.length > 0) {
                        retVal.syntaxes = syntaxes;
                    }
                    if (node.implementedTypes) {
                        retVal.implements = [];
                        for (var i = 0; i < node.implementedTypes.length; i++) {
                            retVal.implements.push({
                                key: node.implementedTypes[i].id.toString(),
                                name: node.implementedTypes[i].name,
                                path: _this._progModel.getItemById(node.implementedTypes[i].id).path
                            });
                        }
                    }
                    retVal.members = node.children;
                    resolve(retVal);
                })
                    .catch(function (reason) {
                    reject(reason);
                });
                /*} else {
                    retVal.description = this._setupHTMLContent(this._getComment(node));
                }*/
            });
        };
        /**
         * Builds the hierarchy (for classes and interfaces) to be displayed under the article
         * @param node
         */
        AjsDoc.prototype._buildHierarchy = function (node) {
            var hierarchyNode;
            if (node.kindString === "Class" || node.kindString === "Interface") {
                if (node.extendedTypes) {
                    hierarchyNode = {
                        path: node.path,
                        name: node.name
                    };
                    if (node.extendedTypes && node.extendedTypes.length > 0) {
                        var id = node.extendedTypes[0].id;
                        if (id) {
                            var h = hierarchyNode;
                            while (id !== 0) {
                                node = this._progModel.getItemById(id);
                                if (node !== null) {
                                    h.extends = {
                                        path: node.path,
                                        name: node.name
                                    };
                                    h = h.extends;
                                    if (node.extendedTypes && node.extendedTypes.length > 0) {
                                        id = node.extendedTypes[0].id;
                                    }
                                    else {
                                        id = 0;
                                    }
                                }
                                else {
                                    id = 0;
                                }
                            }
                        }
                        else {
                            hierarchyNode.extends = {
                                name: node.extendedTypes[0].name
                            };
                        }
                    }
                }
            }
            return hierarchyNode;
        };
        /**
         * Reads the documentation comment from particular documentation node
         * @param node The node the commend has to be get from
         * @param firstLineOnly Specifies if the full comment is returned or its first line only
         */
        AjsDoc.prototype._getComment = function (node, firstLineOnly) {
            if (node && node.comment && node.comment.shortText &&
                node.comment.shortText !== null && node.comment.shortText.trim() !== "") {
                if (firstLineOnly && node.comment.shortText.indexOf("\n") !== -1) {
                    return node.comment.shortText.substring(0, node.comment.shortText.indexOf("\n"));
                }
                else {
                    return node.comment.shortText;
                }
            }
            else {
                return "DOCUMENTATION IS MISSING!";
            }
        };
        /**
         * Sets the #ASHTML to let the AjsFw know the text shoule be rendered as HTML
         * Also processes additional AjsDoc comment tags and includes external resources
         * to the string
         * @param text The text to be converted and updated
         */
        AjsDoc.prototype._setupHTMLContent = function (text) {
            var _this = this;
            return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                var e_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            text = "#ASHTML:" + text;
                            return [4 /*yield*/, this._includeExamples(text)];
                        case 1:
                            text = _a.sent();
                            return [4 /*yield*/, this._includeCharts(text)];
                        case 2:
                            text = _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            e_3 = _a.sent();
                            reject(e_3);
                            return [3 /*break*/, 4];
                        case 4:
                            resolve(text);
                            return [2 /*return*/];
                    }
                });
            }); });
        };
        AjsDoc.prototype._includeExamples = function (text) {
            var _this = this;
            var examples = text.match(/#example.*/g);
            var resourcePromises = [];
            if (examples && examples !== null) {
                for (var i = 0; i < examples.length; i++) {
                    var example = examples[i].substring(9, examples[i].length);
                    resourcePromises.push(ajs.Framework.resourceManager.getResource(example, ajsdoc.config.storageType, ajs.resources.CACHE_POLICY.PERMANENT, ajs.resources.LOADING_PREFERENCE.CACHE));
                }
                return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var resources_1, i, e_4;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, Promise.all(resourcePromises)];
                            case 1:
                                resources_1 = _a.sent();
                                for (i = 0; i < resources_1.length; i++) {
                                    text = text.replace(new RegExp("#example " + resources_1[i].url + ".*", "g"), "<pre class=\"ajsDocExample\"><code class=\"typescript\">" + resources_1[i].data + "</pre></code>");
                                }
                                return [3 /*break*/, 3];
                            case 2:
                                e_4 = _a.sent();
                                reject(e_4);
                                return [3 /*break*/, 3];
                            case 3:
                                resolve(text);
                                return [2 /*return*/];
                        }
                    });
                }); });
            }
            else {
                return new Promise(function (resolve) {
                    resolve(text);
                });
            }
        };
        AjsDoc.prototype._includeCharts = function (text) {
            var _this = this;
            var charts = text.match(/#chart.*/g);
            var resourcePromises = [];
            if (charts && charts !== null) {
                for (var i = 0; i < charts.length; i++) {
                    var chart = charts[i].substring(7, charts[i].length);
                    resourcePromises.push(ajs.Framework.resourceManager.getResource(chart, ajsdoc.config.storageType, ajs.resources.CACHE_POLICY.PERMANENT, ajs.resources.LOADING_PREFERENCE.CACHE));
                }
                return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var resources_2, i, e_5;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, Promise.all(resourcePromises)];
                            case 1:
                                resources_2 = _a.sent();
                                for (i = 0; i < resources_2.length; i++) {
                                    text = text.replace(new RegExp("#chart " + resources_2[i].url + ".*", "g"), "<div class=\"ajsDocChart\">" + resources_2[i].data + "</div>");
                                }
                                return [3 /*break*/, 3];
                            case 2:
                                e_5 = _a.sent();
                                reject(e_5);
                                return [3 /*break*/, 3];
                            case 3:
                                resolve(text);
                                return [2 /*return*/];
                        }
                    });
                }); });
            }
            else {
                return new Promise(function (resolve) {
                    resolve(text);
                });
            }
        };
        return AjsDoc;
    }(ajs.mvvm.viewmodel.ViewComponent));
    ajsdoc.AjsDoc = AjsDoc;
    /** Register the component to ViewComponentManager */
    ajs.Framework.viewComponentManager.registerComponents(AjsDoc);
})(ajsdoc || (ajsdoc = {}));
/* *************************************************************************
The MIT License (MIT)
Copyright (c)2017 Atom Software Studios. All rights reserved.

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
var ajsdoc;
(function (ajsdoc) {
    "use strict";
    var AjsDocArticle = (function (_super) {
        __extends(AjsDocArticle, _super);
        function AjsDocArticle() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(AjsDocArticle.prototype, "hasSyntaxes", {
            get: function () { return this.syntaxes instanceof Array && this.syntaxes.length > 0; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AjsDocArticle.prototype, "hasHierarchy", {
            get: function () { return this.hierarchy !== undefined && this.hierarchy !== null; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AjsDocArticle.prototype, "hasModules", {
            get: function () { return this.modules instanceof Array && this.modules.length > 0; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AjsDocArticle.prototype, "hasFunctions", {
            get: function () { return this.functions instanceof Array && this.functions.length > 0; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AjsDocArticle.prototype, "hasClasses", {
            get: function () { return this.classes instanceof Array && this.classes.length > 0; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AjsDocArticle.prototype, "hasInterfaces", {
            get: function () { return this.interfaces instanceof Array && this.interfaces.length > 0; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AjsDocArticle.prototype, "hasVariables", {
            get: function () { return this.variables instanceof Array && this.variables.length > 0; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AjsDocArticle.prototype, "hasEnumerations", {
            get: function () { return this.enumerations instanceof Array && this.enumerations.length > 0; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AjsDocArticle.prototype, "hasObjectLiterals", {
            get: function () { return this.objectLiterals instanceof Array && this.objectLiterals.length > 0; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AjsDocArticle.prototype, "hasProperties", {
            get: function () { return this.properties instanceof Array && this.properties.length > 0; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AjsDocArticle.prototype, "hasMethods", {
            get: function () { return this.methods instanceof Array && this.methods.length > 0; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AjsDocArticle.prototype, "hasAccessors", {
            get: function () { return this.accessors instanceof Array && this.accessors.length > 0; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AjsDocArticle.prototype, "hasEnumMembers", {
            get: function () { return this.enumMembers instanceof Array && this.enumMembers.length > 0; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AjsDocArticle.prototype, "hasConstructors", {
            get: function () { return this.constructors instanceof Array && this.constructors.length > 0; },
            enumerable: true,
            configurable: true
        });
        AjsDocArticle.prototype.setState = function (state) {
            _super.prototype.setState.call(this, state);
        };
        AjsDocArticle.prototype._initialize = function () {
            var _this = this;
            this._renderedListener = function (sender) {
                _this._rendered();
                return true;
            };
            this.ajs.view.renderDoneNotifier.subscribe(this._renderedListener);
        };
        AjsDocArticle.prototype._finalize = function () {
            this.ajs.view.renderDoneNotifier.unsubscribe(this._renderedListener);
        };
        AjsDocArticle.prototype._rendered = function () {
            var pre = document.getElementsByTagName("pre");
            for (var i = 0; i < pre.length; i++) {
                hljs.highlightBlock(pre[i]);
            }
        };
        AjsDocArticle.prototype._filterState = function (state) {
            return state;
        };
        AjsDocArticle.prototype._filterStateKey = function (key, state) {
            return {
                filterApplied: false,
                key: null,
                state: null
            };
        };
        AjsDocArticle.prototype._filterStateArrayItem = function (key, index, length, state) {
            if (key === "members" || key === "syntaxes") {
                // Ignore everyithing from lib.d.ts
                if (state.sources instanceof Array) {
                    for (var i = 0; i < state.sources.length; i++) {
                        if (state.sources[i].fileName.indexOf("lib.d.ts") !== -1) {
                            return {
                                filterApplied: true,
                                key: key,
                                state: state
                            };
                        }
                    }
                }
                // Prepare new state values (Keep the original data untouched)
                var newState = {
                    key: state.id.toString(),
                    comment: {
                        shortText: state.comment && state.comment.shortText ? state.comment.shortText : null,
                        longText: null
                    },
                    kindString: state.kindString,
                    isLast: index === length - 1
                };
                // Copy rest of the data from the original data (state) to the new state
                for (var k in state) {
                    if (state.hasOwnProperty(k) && !newState.hasOwnProperty(k)) {
                        newState[k] = state[k];
                    }
                }
                // Get path from INode tree
                var path = "";
                if (key === "members") {
                    var pathBrowser = state;
                    while (pathBrowser !== null && pathBrowser.parent !== null) {
                        if (pathBrowser.name) {
                            if (pathBrowser.parent !== null) {
                                path = "/" + path;
                            }
                            path = pathBrowser.name + path;
                        }
                        pathBrowser = pathBrowser.parent;
                    }
                    if (path !== "" && path[path.length - 1] === "/") {
                        path = path.substr(0, path.length - 1);
                    }
                }
                else {
                    path = null;
                }
                newState.path = path;
                // Update comments
                if (newState.comment && newState.comment.shortText) {
                    if (newState.comment.shortText.indexOf("\n") !== -1) {
                        newState.comment = {};
                        newState.comment.longText = state.comment.shortText;
                        newState.comment.shortText = state.comment.shortText.substr(0, state.comment.shortText.indexOf("\n"));
                    }
                }
                // We want lower case keywords
                newState.kindString = newState.kindString.toLowerCase();
                // Based on the type set the state of appropriate member
                switch (newState.kindString) {
                    case "constructor":
                        return { filterApplied: true, key: key !== "members" ? key : "constructors", state: this._function(newState, key === "members") };
                    case "module":
                        return { filterApplied: true, key: key !== "members" ? key : "modules", state: newState };
                    case "call signature":
                        return { filterApplied: true, key: key !== "members" ? key : "functions", state: this._function(newState, key === "members") };
                    case "function":
                        return { filterApplied: true, key: key !== "members" ? key : "functions", state: this._function(newState, key === "members") };
                    case "class":
                        return { filterApplied: true, key: key !== "members" ? key : "classes", state: newState };
                    case "interface":
                        return { filterApplied: true, key: key !== "members" ? key : "interfaces", state: newState };
                    case "variable":
                        return { filterApplied: true, key: key !== "members" ? key : "variables", state: this._variable(newState) };
                    case "enumeration":
                        return { filterApplied: true, key: key !== "members" ? key : "enumerations", state: newState };
                    case "object literal":
                        return { filterApplied: true, key: key !== "members" ? key : "objectLiterals", state: newState };
                    case "property":
                        return { filterApplied: true, key: key !== "members" ? key : "properties", state: newState };
                    case "method":
                        return { filterApplied: true, key: key !== "members" ? key : "methods", state: this._function(newState, key === "members") };
                    case "accessor":
                        return { filterApplied: true, key: key !== "members" ? key : "accessors", state: this._accessor(newState) };
                    case "enumeration member":
                        return { filterApplied: true, key: key !== "members" ? key : "enumMembers", state: newState };
                }
            }
            return {
                filterApplied: false,
                key: null,
                state: null
            };
        };
        AjsDocArticle.prototype._variable = function (state) {
            var newState;
            if (state.name.toUpperCase() === state.name) {
                newState = { kindString: "const" };
            }
            else {
                newState = { kindString: "var" };
            }
            for (var key in state) {
                if (state.hasOwnProperty(key) && !newState.hasOwnProperty(key)) {
                    newState[key] = state[key];
                }
            }
            return newState;
        };
        AjsDocArticle.prototype._function = function (state, expand) {
            var expandedState = this._expandSignatures(state, expand);
            if (expandedState instanceof Array) {
                var nodes = expandedState;
                for (var i = 0; i < nodes.length; i++) {
                    if (nodes[i].parameters) {
                        for (var j = 0; j < nodes[i].parameters.length; j++) {
                            if (j === nodes[i].parameters.length - 1) {
                                nodes[i].parameters[j].isLast = true;
                            }
                            nodes[i].parameters[j] = this._type(nodes[i].parameters[j], false);
                        }
                    }
                    nodes[i] = this._type(nodes[i], true);
                }
                return nodes;
            }
            else {
                var node = this._type(expandedState, true);
                node.parameters = node.parameters || [];
                if (node.parameters.length > 0) {
                    node.parameters[node.parameters.length - 1].isLast = true;
                }
                return node;
            }
        };
        AjsDocArticle.prototype._accessor = function (state) {
            var accessors = [];
            function addSignature(signature) {
                var newState = {
                    kindString: signature.name.substr(2),
                    name: state.name,
                    type: signature.type,
                    parameters: signature.parameters || []
                };
                if (newState.parameters instanceof Array && newState.parameters.length > 0) {
                    newState.parameters[newState.parameters.length - 1].isLast = true;
                }
                for (var key in state) {
                    if (state.hasOwnProperty(key) && !newState.hasOwnProperty(key)) {
                        newState[key] = state[key];
                    }
                }
                accessors.push(newState);
            }
            if (state.getSignature) {
                for (var i = 0; i < state.getSignature.length; i++) {
                    addSignature(state.getSignature[i]);
                }
            }
            if (state.setSignature) {
                for (var i = 0; i < state.setSignature.length; i++) {
                    addSignature(state.setSignature[i]);
                }
            }
            return accessors;
        };
        AjsDocArticle.prototype._type = function (node, isFunctionReturnType) {
            if (!node.type) {
                if (isFunctionReturnType) {
                    node.type = { name: "void" };
                }
                else {
                    node.type = { name: "any" };
                }
                return node;
            }
            else {
                if (node.type.type && node.type.type === "union" && node.type.types) {
                    var name_1 = [];
                    for (var i = 0; i < node.type.types.length; i++) {
                        name_1.push(node.type.types[i].name);
                    }
                    var newNode = {};
                    newNode.type = {
                        name: name_1.join("|"),
                        type: "union"
                    };
                    for (var key in node) {
                        if (node.hasOwnProperty(key) && !newNode.hasOwnProperty(key)) {
                            newNode[key] = node[key];
                        }
                    }
                    return newNode;
                }
            }
            return node;
        };
        AjsDocArticle.prototype._expandSignatures = function (state, expand) {
            if (state.signatures && state.signatures.length > 0 && expand) {
                var states = [];
                if (state.parameters === undefined) {
                    state.parameters = [];
                }
                if (state.signatures && state.signatures.length === 0 ||
                    state.signatures && state.signatures.length > 1) {
                    states.push(state);
                }
                for (var i = 0; i < state.signatures.length; i++) {
                    var node = state.signatures[i];
                    var newState = {
                        kindString: state.kindString,
                        flags: state.flags,
                        parameters: [],
                        path: state.path,
                        comment: {
                            shortText: state.signatures[i].comment &&
                                state.signatures[i].comment.shortText ?
                                state.signatures[i].comment.shortText : null,
                            longText: null
                        }
                    };
                    // copy rest of the data from the original data (state) to the new state
                    for (var key in node) {
                        if (node.hasOwnProperty(key) && !newState.hasOwnProperty(key)) {
                            newState[key] = node[key];
                        }
                    }
                    // update comments
                    if (newState.comment && newState.comment.shortText) {
                        if (newState.comment.shortText.indexOf("\n") !== -1) {
                            newState.comment = {
                                longText: newState.comment.shortText,
                                shortText: newState.comment.shortText.substr(0, newState.comment.shortText.indexOf("\n"))
                            };
                        }
                    }
                    if (node.parameters !== undefined) {
                        newState.parameters = node.parameters;
                    }
                    states.push(newState);
                }
                return states;
            }
            return state;
        };
        return AjsDocArticle;
    }(ajs.mvvm.viewmodel.ViewComponent));
    ajsdoc.AjsDocArticle = AjsDocArticle;
    ajs.Framework.viewComponentManager.registerComponents(AjsDocArticle);
})(ajsdoc || (ajsdoc = {}));
/* *************************************************************************
The MIT License (MIT)
Copyright (c)2017 Atom Software Studios. All rights reserved.

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
var ajsdoc;
(function (ajsdoc) {
    "use strict";
    var sessionStateGuidePath = "ajsDocGuidePath";
    var sessionStateReferencePath = "ajsDocReferencePath";
    var AjsDocContextSwitcher = (function (_super) {
        __extends(AjsDocContextSwitcher, _super);
        function AjsDocContextSwitcher() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        AjsDocContextSwitcher.prototype._initialize = function () {
            var _this = this;
            this._lastGuidePath = ajs.Framework.stateManager.getSessionState(sessionStateGuidePath);
            if (this._lastGuidePath === null) {
                this._lastGuidePath = "";
            }
            this._lastReferencePath = ajs.Framework.stateManager.getSessionState(sessionStateReferencePath);
            if (this._lastReferencePath === null) {
                this._lastReferencePath = "ref";
            }
            this._navigatedListener = function (sender) {
                _this._navigated();
                return true;
            };
            this.ajs.view.navigationNotifier.subscribe(this._navigatedListener);
        };
        AjsDocContextSwitcher.prototype._defaultState = function () {
            return this._prepareState();
        };
        AjsDocContextSwitcher.prototype._finalize = function () {
            this.ajs.view.navigationNotifier.unsubscribe(this._navigatedListener);
        };
        AjsDocContextSwitcher.prototype._prepareState = function () {
            var routeInfo = ajs.Framework.router.currentRoute;
            if (routeInfo.base.substr(0, 4) === "ref/" || routeInfo.base === "ref") {
                ajs.Framework.stateManager.setSessionState(sessionStateReferencePath, routeInfo.base);
                this._lastReferencePath = routeInfo.base;
                return {
                    guides: false,
                    references: true
                };
            }
            else {
                ajs.Framework.stateManager.setSessionState(sessionStateGuidePath, routeInfo.base);
                this._lastGuidePath = routeInfo.base;
                return {
                    guides: true,
                    references: false
                };
            }
        };
        AjsDocContextSwitcher.prototype._navigated = function () {
            this.setState(this._prepareState());
        };
        AjsDocContextSwitcher.prototype.onGuidesClick = function (e) {
            if (this.references) {
                ajs.Framework.navigator.navigate(this._lastGuidePath !== "" ? "/" + this._lastGuidePath : "/");
            }
        };
        AjsDocContextSwitcher.prototype.onReferenceGuideClick = function (e) {
            if (this.guides) {
                ajs.Framework.navigator.navigate(this._lastReferencePath !== "" ? "/" + this._lastReferencePath : "/ref");
            }
        };
        return AjsDocContextSwitcher;
    }(ajs.mvvm.viewmodel.ViewComponent));
    ajsdoc.AjsDocContextSwitcher = AjsDocContextSwitcher;
    ajs.Framework.viewComponentManager.registerComponents(AjsDocContextSwitcher);
})(ajsdoc || (ajsdoc = {}));
/* *************************************************************************
The MIT License (MIT)
Copyright (c)2017 Atom Software Studios. All rights reserved.

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
var ajsdoc;
(function (ajsdoc) {
    "use strict";
    var AjsDocLayout = (function (_super) {
        __extends(AjsDocLayout, _super);
        function AjsDocLayout() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        AjsDocLayout.prototype._defaultState = function () {
            return {
                dialogVisible: window.innerWidth < 980,
                menuVisible: true
            };
        };
        AjsDocLayout.prototype.showDialogFrame = function () {
            document.body.style.overflow = "hidden";
            this.setState({ dialogVisible: true });
        };
        AjsDocLayout.prototype.hideDialogFrame = function () {
            // hiding dialog frame hides menu too
            document.body.style.overflow = "";
            this.setState({ dialogVisible: false, menuVisible: false });
            this._updateButton(false);
        };
        AjsDocLayout.prototype.showMenu = function () {
            // both states can be set at once so don't call showDialogFrame
            if (window.innerWidth < 980) {
                document.body.style.overflow = "hidden";
                this.setState({ dialogVisible: true, menuVisible: true });
                this._updateButton(true);
            }
            else {
                this.setState({ menuVisible: true });
                this._updateButton(true);
            }
        };
        AjsDocLayout.prototype.hideMenu = function () {
            this.hideDialogFrame();
            this._updateButton(false);
        };
        AjsDocLayout.prototype.toggleMenu = function () {
            if (this.menuVisible) {
                this.hideMenu();
            }
            else {
                this.showMenu();
            }
        };
        AjsDocLayout.prototype.dialogClick = function (event) {
            this.hideDialogFrame();
        };
        AjsDocLayout.prototype.touchMove = function (event) {
            if (this.menuVisible) {
                event.preventDefault();
            }
        };
        AjsDocLayout.prototype._finalize = function () {
            ;
        };
        AjsDocLayout.prototype._updateButton = function (visible) {
            var button = this.ajs.viewComponentManager.getFirstComponentInstance(ajsdoc.AjsDocLayoutMenuButton, "ajsDocLayoutMenuButton");
            button.setState({ menuVisible: visible });
        };
        return AjsDocLayout;
    }(ajs.mvvm.viewmodel.ViewComponent));
    ajsdoc.AjsDocLayout = AjsDocLayout;
    /** Register the component to ViewComponentManager */
    ajs.Framework.viewComponentManager.registerComponents(AjsDocLayout);
})(ajsdoc || (ajsdoc = {}));
/* *************************************************************************
The MIT License (MIT)
Copyright (c)2017 Atom Software Studios. All rights reserved.

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
var ajsdoc;
(function (ajsdoc) {
    "use strict";
    var AjsDocLayoutMenuButton = (function (_super) {
        __extends(AjsDocLayoutMenuButton, _super);
        function AjsDocLayoutMenuButton() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        AjsDocLayoutMenuButton.prototype.toggleMenu = function () {
            var layout = this.ajs.viewComponentManager.getFirstComponentInstance(ajsdoc.AjsDocLayout, "ajsDocLayout");
            layout.toggleMenu();
        };
        return AjsDocLayoutMenuButton;
    }(ajs.mvvm.viewmodel.ViewComponent));
    ajsdoc.AjsDocLayoutMenuButton = AjsDocLayoutMenuButton;
    /** Register the component to ViewComponentManager */
    ajs.Framework.viewComponentManager.registerComponents(AjsDocLayoutMenuButton);
})(ajsdoc || (ajsdoc = {}));
/* *************************************************************************
The MIT License (MIT)
Copyright (c)2017 Atom Software Studios. All rights reserved.

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
var ajsdoc;
(function (ajsdoc) {
    "use strict";
    var AjsDocMember = (function (_super) {
        __extends(AjsDocMember, _super);
        function AjsDocMember() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(AjsDocMember.prototype, "exported", {
            get: function () {
                // too lazy to implement the state interface so retype to any
                var _this = this;
                return _this.flags && _this.flags.isExported &&
                    _this.kindString !== "property" &&
                    _this.kindString !== "method" &&
                    _this.kindString !== "get" &&
                    _this.kindString !== "set" &&
                    _this.kindString !== "constructor";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AjsDocMember.prototype, "isPublic", {
            get: function () {
                var _this = this;
                return _this.flags && !_this.flags.isPrivate &&
                    !_this.flags.isProtected &&
                    (_this.kindString === "property" ||
                        _this.kindString === "method" ||
                        _this.kindString === "accessor" ||
                        _this.kindString === "constructor");
            },
            enumerable: true,
            configurable: true
        });
        AjsDocMember.prototype._filterState = function (state) {
            return state;
        };
        AjsDocMember.prototype._filterStateArrayItem = function (key, index, length, state) {
            if (key === "extendedTypes" || key === "implementedTypes") {
                state.isLast = index === length - 1;
                return {
                    filterApplied: true,
                    key: key,
                    state: state
                };
            }
            return {
                filterApplied: false,
                key: null,
                state: null
            };
        };
        return AjsDocMember;
    }(ajs.mvvm.viewmodel.ViewComponent));
    ajsdoc.AjsDocMember = AjsDocMember;
    ajs.Framework.viewComponentManager.registerComponents(AjsDocMember);
})(ajsdoc || (ajsdoc = {}));
/* *************************************************************************
The MIT License (MIT)
Copyright (c)2017 Atom Software Studios. All rights reserved.

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
var ajsdoc;
(function (ajsdoc) {
    "use strict";
    var TransitionType;
    (function (TransitionType) {
        TransitionType[TransitionType["NONE"] = 0] = "NONE";
        TransitionType[TransitionType["FADE"] = 1] = "FADE";
        TransitionType[TransitionType["LTR"] = 2] = "LTR";
        TransitionType[TransitionType["RTL"] = 3] = "RTL";
    })(TransitionType = ajsdoc.TransitionType || (ajsdoc.TransitionType = {}));
    var MENU_DONT_EXPAND = [
        "Interface",
        "Variable",
        "Enumeration",
        "Object literal",
        "Function",
        "Constructor",
        "Method",
        "Property",
        "Accessor"
    ];
    var AjsDocMenu = (function (_super) {
        __extends(AjsDocMenu, _super);
        function AjsDocMenu() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        AjsDocMenu.prototype._initialize = function () {
            this._contentModel = ajs.Framework.modelManager.getModelInstance(ajsdoc.ContentModel);
            this._programModel = ajs.Framework.modelManager.getModelInstance(ajsdoc.ProgramModel);
            this._previousContext = null;
            this._previousRefNode = null;
            this._previousArticle = null;
        };
        AjsDocMenu.prototype.touchMove = function (e) {
            e.cancelBubble = true;
            e.stopPropagation();
            var el = this.ajs.view.documentManager.getTargetNodeByUniqueId(this.componentViewId);
            if (el instanceof HTMLElement) {
                if (el.scrollHeight <= el.clientHeight) {
                    e.preventDefault();
                }
            }
        };
        AjsDocMenu.prototype.stateTransitionBegin = function () {
            var transitionType = this._getTransitionType();
            if (transitionType === TransitionType.NONE) {
                return null;
            }
            else {
                return {
                    oldComponent: TransitionType[transitionType],
                    newComponent: TransitionType[transitionType]
                };
            }
        };
        AjsDocMenu.prototype.stateTransitionEnd = function (e) {
            this._ajsVisualStateTransitionEnd();
        };
        AjsDocMenu.prototype._getTransitionType = function () {
            var transitionType = TransitionType.NONE;
            var path = ajs.Framework.router.currentRoute.base;
            if (path.substr(0, 3) === "ref") {
                if (this._previousContext === "") {
                    transitionType = TransitionType.FADE;
                }
                else {
                    transitionType = this._getTransitionTypeRef(path.substr(4));
                }
                this._previousContext = "ref";
            }
            else {
                if (this._previousContext === "ref") {
                    transitionType = TransitionType.FADE;
                }
                else {
                    transitionType = this._getTransitionTypeDoc(path);
                }
                this._previousContext = "";
            }
            return transitionType;
        };
        AjsDocMenu.prototype._getTransitionTypeDoc = function (path) {
            var transitionType = TransitionType.NONE;
            var currentArticle = this._contentModel.navigate(path);
            /*if (!(currentArticle.children instanceof Array) || currentArticle.children.length === 0) {
                currentArticle = currentArticle.parent;
            }*/
            if (this._previousArticle !== undefined) {
                if (this._previousArticle !== null) {
                    if (currentArticle.parent === this._previousArticle.parent) {
                        if (currentArticle.children && currentArticle.children.length > 0) {
                            transitionType = TransitionType.RTL;
                        }
                        else {
                            if (this._previousArticle.children && this._previousArticle.children.length > 0) {
                                transitionType = TransitionType.LTR;
                            }
                        }
                    }
                    if (currentArticle.parent === this._previousArticle) {
                        if (currentArticle.children && currentArticle.children.length > 0) {
                            transitionType = TransitionType.RTL;
                        }
                    }
                    if (currentArticle.parent === this._previousArticle) {
                        if (currentArticle.children && currentArticle.children.length > 0) {
                            transitionType = TransitionType.RTL;
                        }
                    }
                    if (currentArticle === this._previousArticle.parent) {
                        if (this._previousArticle.children && this._previousArticle.children.length > 0) {
                            transitionType = TransitionType.LTR;
                        }
                    }
                    if (this._previousArticle.parent && currentArticle === this._previousArticle.parent.parent) {
                        transitionType = TransitionType.LTR;
                    }
                }
                else {
                    transitionType = TransitionType.FADE;
                }
            }
            else {
                transitionType = TransitionType.NONE;
            }
            this._previousArticle = currentArticle;
            return transitionType;
        };
        AjsDocMenu.prototype._getTransitionTypeRef = function (path) {
            var transitionType = TransitionType.NONE;
            var currentNode = this._programModel.navigate(path);
            if (!(currentNode.children instanceof Array) || currentNode.children.length === 0) {
                currentNode = currentNode.parent;
            }
            if (this._previousArticle !== undefined) {
                if (this._previousRefNode !== null) {
                    if (currentNode.parent !== this._previousRefNode && currentNode.parent !== this._previousRefNode.parent) {
                        transitionType = TransitionType.FADE;
                    }
                    if (currentNode === this._previousRefNode.parent) {
                        transitionType = TransitionType.LTR;
                    }
                    if (currentNode.parent === this._previousRefNode && MENU_DONT_EXPAND.indexOf(currentNode.kindString) === -1) {
                        transitionType = TransitionType.RTL;
                    }
                }
                else {
                    transitionType = TransitionType.FADE;
                }
                if (MENU_DONT_EXPAND.indexOf(currentNode.kindString) === -1) {
                    this._previousRefNode = currentNode;
                }
                else {
                    if (this._previousRefNode === null) {
                        var node = currentNode.parent;
                        while (node.parent !== null) {
                            if (MENU_DONT_EXPAND.indexOf(node.kindString) === -1) {
                                this._previousRefNode = node;
                                break;
                            }
                            node = node.parent;
                        }
                    }
                }
            }
            else {
                transitionType = TransitionType.NONE;
            }
            return transitionType;
        };
        return AjsDocMenu;
    }(ajs.mvvm.viewmodel.ViewComponent));
    ajsdoc.AjsDocMenu = AjsDocMenu;
    /** Register the component to ViewComponentManager */
    ajs.Framework.viewComponentManager.registerComponents(AjsDocMenu);
})(ajsdoc || (ajsdoc = {}));
/* *************************************************************************
The MIT License (MIT)
Copyright (c)2017 Atom Software Studios. All rights reserved.

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
var ajsdoc;
(function (ajsdoc) {
    "use strict";
    var AjsDocMenuGroup = (function (_super) {
        __extends(AjsDocMenuGroup, _super);
        function AjsDocMenuGroup() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return AjsDocMenuGroup;
    }(ajs.mvvm.viewmodel.ViewComponent));
    ajsdoc.AjsDocMenuGroup = AjsDocMenuGroup;
    /** Register the component to ViewComponentManager */
    ajs.Framework.viewComponentManager.registerComponents(AjsDocMenuGroup);
})(ajsdoc || (ajsdoc = {}));
/* *************************************************************************
The MIT License (MIT)
Copyright (c)2017 Atom Software Studios. All rights reserved.

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
var ajsdoc;
(function (ajsdoc) {
    "use strict";
    var AjsDocMenuItem = (function (_super) {
        __extends(AjsDocMenuItem, _super);
        function AjsDocMenuItem() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return AjsDocMenuItem;
    }(ajs.mvvm.viewmodel.ViewComponent));
    ajsdoc.AjsDocMenuItem = AjsDocMenuItem;
    /** Register the component to ViewComponentManager */
    ajs.Framework.viewComponentManager.registerComponents(AjsDocMenuItem);
})(ajsdoc || (ajsdoc = {}));
/* *************************************************************************
The MIT License (MIT)
Copyright (c)2017 Atom Software Studios. All rights reserved.

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
var ajsdoc;
(function (ajsdoc) {
    "use strict";
    var AjsDocNavBar = (function (_super) {
        __extends(AjsDocNavBar, _super);
        function AjsDocNavBar() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return AjsDocNavBar;
    }(ajs.mvvm.viewmodel.ViewComponent));
    ajsdoc.AjsDocNavBar = AjsDocNavBar;
    /** Register the component to ViewComponentManager */
    ajs.Framework.viewComponentManager.registerComponents(AjsDocNavBar);
})(ajsdoc || (ajsdoc = {}));
//# sourceMappingURL=ajsdocbrowser.js.map