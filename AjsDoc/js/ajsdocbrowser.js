var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ajsdoc;
(function (ajsdoc) {
    "use strict";
    var AjsDocBrowser = (function (_super) {
        __extends(AjsDocBrowser, _super);
        function AjsDocBrowser() {
            _super.apply(this, arguments);
        }
        AjsDocBrowser.prototype.initialize = function () {
            var _this = this;
            ajs.Framework.templateManager.loadTemplateFiles(function (successfull) {
                _this._templatesLoaded(successfull);
            }, [
                "/res/css/hljsvs.css",
                "/static/ajsdoc.html",
                "/static/ajs.json"
            ], ajs.resources.STORAGE_TYPE.LOCAL, ajs.resources.CACHE_POLICY.PERMANENT);
        };
        AjsDocBrowser.prototype._templatesLoaded = function (successfull) {
            if (successfull) {
                this._loadResources();
            }
            else {
                throw new Error("Failed to load templates.");
            }
        };
        AjsDocBrowser.prototype._loadResources = function () {
            this._resourcesLoaded();
        };
        AjsDocBrowser.prototype._resourcesLoaded = function () {
            this._setupRoutes();
        };
        AjsDocBrowser.prototype._setupRoutes = function () {
            var allParamsAndHashes = "($|\\/$|\\/\\?.*|\\/\\#.*|\\?.*|\\#.*)";
            var anyPath = "(\\/.*|.*)";
            ajs.Framework.router.registerRoute([{ base: "^\/doc", params: anyPath + allParamsAndHashes }], "AjsDoc");
            ajs.Framework.router.registerRoute([{ base: "^\/event\\/users", params: allParamsAndHashes }], "EventUsersTest");
            ajs.Framework.router.registerRoute([{ base: "^\/.*", params: "" }], "Index");
            this._initDone();
        };
        AjsDocBrowser.prototype._finalize = function () {
            console.warn("IMPLEMENT: AjsDocBrowser.application.finalize");
        };
        return AjsDocBrowser;
    }(ajs.app.Application));
    ajsdoc.AjsDocBrowser = AjsDocBrowser;
})(ajsdoc || (ajsdoc = {}));
var ajsdoc;
(function (ajsdoc) {
    "use strict";
    var staticResources = [
        "/static/examples/app_init.ts",
    ];
    var AjsDoc = (function (_super) {
        __extends(AjsDoc, _super);
        function AjsDoc() {
            _super.apply(this, arguments);
        }
        AjsDoc.prototype._initialize = function () {
            var _this = this;
            this._navigatedListener = function (sender) {
                _this._navigated();
                return true;
            };
            this._renderedListener = function (sender) {
                _this._rendered();
                return true;
            };
            this._view.navigationNotifier.subscribe(this._navigatedListener);
            this._view.renderDoneNotifier.subscribe(this._renderedListener);
            this._lastContent = "";
            ajs.Framework.templateManager.loadTemplateFiles(function (successfull) {
                if (successfull) {
                    _this._initAsync();
                }
            }, staticResources, ajs.resources.STORAGE_TYPE.LOCAL, ajs.resources.CACHE_POLICY.LASTRECENTLYUSED);
        };
        AjsDoc.prototype._initAsync = function () {
            this.setState({
                ajsDocLayout: {
                    ajsDocHeader: {},
                    ajsDocMenu: {},
                    ajsDocNavBar: {},
                    ajsDocFooter: {}
                }
            });
            var resource;
            resource = ajs.Framework.resourceManager.getCachedResource("/static/ajs.json", ajs.resources.STORAGE_TYPE.LOCAL);
            if (resource === undefined || resource === null) {
                throw new Error("Documentation definition not loaded");
            }
            this._docModel = new ajsdoc.DocModel(resource.data);
            resource = ajs.Framework.resourceManager.getCachedResource("/res/css/hljsvs.css", ajs.resources.STORAGE_TYPE.LOCAL);
            if (resource === undefined || resource === null) {
                throw new Error("Code style sheet not loaded");
            }
            var style = document.createElement("style");
            style.setAttribute("type", "text/css");
            style.innerHTML = resource.data;
            document.head.appendChild(style);
            this._updateView(true);
        };
        AjsDoc.prototype._finalize = function () {
            this._view.navigationNotifier.unsubscribe(this._navigatedListener);
            this._view.renderDoneNotifier.unsubscribe(this._renderedListener);
        };
        AjsDoc.prototype._navigated = function () {
            this._updateView(false);
        };
        AjsDoc.prototype._rendered = function () {
            var pre = document.getElementsByTagName("pre");
            for (var i = 0; i < pre.length; i++) {
                hljs.highlightBlock(pre[i]);
            }
            var statements = document.getElementsByClassName("ajsDocStatement");
            for (var i = 0; i < statements.length; i++) {
                hljs.highlightBlock(statements.item(i));
            }
        };
        AjsDoc.prototype._updateView = function (updateLayout) {
            var routeInfo = ajs.Framework.router.currentRoute;
            var menu = this._docModel.getMenu(routeInfo.path);
            var menuState = {
                parentLabel: menu.parentLabel,
                parentPath: menu.parentPath,
                label: menu.label,
                groups: menu.groups
            };
            var navbarItems = this._docModel.getNavBarItems(routeInfo.path);
            var navBarState = {
                items: navbarItems
            };
            if (updateLayout) {
                this.ajsDocLayout.setState({ ajsDocMenu: menuState, ajsDocNavBar: navBarState });
            }
            else {
                this.ajsDocLayout.ajsDocMenu.setState(menuState);
                this.ajsDocLayout.ajsDocNavBar.setState(navBarState);
            }
            var content = this._docModel.getContent(routeInfo.path);
            var viewComponentName;
            if (content !== null && content.node.kind !== 0) {
                viewComponentName = "ajsDoc" + content.node.kindString.replace(" ", "");
            }
            else {
                viewComponentName = "";
            }
            this._setupContentViewComponent(viewComponentName);
            if (viewComponentName !== "") {
                var contentState = {};
                switch (viewComponentName) {
                    case "ajsDocModule":
                        contentState = this._prepareModuleState(content);
                        break;
                    case "ajsDocClass":
                        contentState = this._prepareClassState(content);
                        break;
                }
                this.ajsDocLayout[viewComponentName].setState(contentState);
            }
            return;
        };
        AjsDoc.prototype._setupContentViewComponent = function (componentName) {
            if (componentName !== this._lastContent) {
                if (this._lastContent !== "") {
                    this.ajsDocLayout.removeChildComponent("content", this._lastContent);
                }
                this.ajsDocLayout.insertChildComponent(componentName, componentName, null, "content");
                this._lastContent = componentName;
            }
        };
        AjsDoc.prototype._prepareModuleState = function (content) {
            var text = this._getComment(content.node);
            var state = {
                articleCaption: content.node.name,
                description: this._setupHTMLContent(text),
                hasModules: false,
                modules: { items: [] },
                hasFunctions: false,
                functions: { items: [] },
                hasClasses: false,
                classes: { items: [] },
                hasInterfaces: false,
                interfaces: { items: [] },
                hasVariables: false,
                variables: { items: [] },
                hasEnumerations: false,
                enumerations: { items: [] },
                hasObjectLiterals: false,
                objectLiterals: { items: [] }
            };
            if (content.node && content.node.children) {
                for (var i = 0; i < content.node.children.length; i++) {
                    if (content.node.children[i].kindString !== "Interface" && content.node.children[i].signatures) {
                        for (var j = 0; j < content.node.children[i].signatures.length; j++) {
                            var node = ajs.utils.DeepMerge.merge({}, content.node.children[i].signatures[j]);
                            node.kindString = content.node.children[i].kindString;
                            node.flags = content.node.children[i].flags;
                            this._addDefinition(state, content.path, node);
                        }
                        if (content.node.children[i].signatures.length > 1) {
                            this._addDefinition(state, content.path, content.node.children[i]);
                        }
                    }
                    else {
                        this._addDefinition(state, content.path, content.node.children[i]);
                    }
                }
            }
            ;
            return state;
        };
        AjsDoc.prototype._prepareClassState = function (content) {
            var text = this._getComment(content.node);
            text = this._setupHTMLContent(text);
            return {
                articleCaption: content.node.name,
                description: text
            };
        };
        AjsDoc.prototype._addDefinition = function (state, path, node) {
            var key = node.id.toString();
            var name = node.name;
            var type = node.kindString.toLowerCase();
            var description = this._getComment(node, true);
            var exported = node.flags && node.flags.isExported;
            var dataType = node.type && node.type.name ? node.type.name : null;
            var params = this._getParams(node);
            var extendedTypes = this._getExtendedTypes(node);
            var implementedTypes = this._getImplementedTypes(node);
            var data = {
                key: key,
                hasPath: path && path !== null && path !== "",
                path: path && path !== null && path !== "" ? path + "/" + name : null,
                exported: exported,
                statement: type,
                name: name,
                hasParams: params !== null,
                params: params,
                body: null,
                hasDataType: dataType !== null,
                dataType: dataType,
                description: description,
                extends: extendedTypes !== null,
                extendedTypes: extendedTypes,
                implements: implementedTypes !== null,
                implementedTypes: implementedTypes
            };
            switch (node.kindString) {
                case "Module":
                    data.statement = "namespace";
                    data.body = "{ ... }";
                    state.modules.items.push(data);
                    state.hasModules = true;
                    break;
                case "Class":
                    data.body = "{ ... }";
                    state.classes.items.push(data);
                    state.hasClasses = true;
                    break;
                case "Interface":
                    data.body = "{ ... }";
                    state.interfaces.items.push(data);
                    state.hasInterfaces = true;
                    break;
                case "Function":
                    data.body = "{ ... }";
                    data.hasDataType = true;
                    data.dataType = data.dataType && data.dataType !== null ? data.dataType : "any";
                    data.hasParams = true;
                    state.functions.items.push(data);
                    state.hasFunctions = true;
                    break;
                case "Variable":
                    data.body = "...";
                    data.hasDataType = true;
                    data.dataType = data.dataType && data.dataType !== null ? data.dataType : "any";
                    data.statement = (data.name === data.name.toUpperCase()) ? "const" : "let";
                    state.variables.items.push(data);
                    state.hasVariables = true;
                    break;
                case "Enumeration":
                    data.body = "{ ... }";
                    data.statement = "enum";
                    state.enumerations.items.push(data);
                    state.hasEnumerations = true;
                    break;
                case "Object literal":
                    data.body = "{ ... }";
                    data.hasDataType = true;
                    data.dataType = data.dataType && data.dataType !== null ? data.dataType : "any";
                    data.statement = "let";
                    state.objectLiterals.items.push(data);
                    state.hasObjectLiterals = true;
                    break;
            }
        };
        AjsDoc.prototype._getParams = function (node) {
            if (node.parameters && node.parameters.length > 0) {
                var params = [];
                for (var i = 0; i < node.parameters.length; i++) {
                    var param = {
                        key: node.parameters[i].id,
                        isOptional: node.parameters[i].flags && node.parameters[i].flags.isOptional !== undefined ? node.parameters[i].flags.isOptional : false,
                        name: node.parameters[i].name ? node.parameters[i].name : null,
                        type: node.parameters[i].type && node.parameters[i].type.name ? node.parameters[i].type.name : "any",
                        isLast: i === node.parameters.length - 1
                    };
                    params.push(param);
                }
                return params;
            }
            return null;
        };
        AjsDoc.prototype._getExtendedTypes = function (node) {
            if (node.extendedTypes && node.extendedTypes.length > 0) {
                var exts = [];
                for (var i = 0; i < node.extendedTypes.length; i++) {
                    var ext = {
                        key: node.extendedTypes[i].id,
                        name: node.extendedTypes[i].name,
                        isLast: i === node.extendedTypes.length - 1
                    };
                    exts.push(ext);
                }
                return exts;
            }
            return null;
        };
        AjsDoc.prototype._getImplementedTypes = function (node) {
            if (node.implementedTypes && node.implementedTypes.length > 0) {
                var impls = [];
                for (var i = 0; i < node.implementedTypes.length; i++) {
                    var impl = {
                        key: node.implementedTypes[i].id,
                        name: node.implementedTypes[i].name,
                        isLast: i === node.implementedTypes.length - 1
                    };
                    impls.push(impl);
                }
                return impls;
            }
            return null;
        };
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
        AjsDoc.prototype._setupHTMLContent = function (text) {
            text = "#ASHTML:" + text;
            var examples = text.match(/#example.*/g);
            if (examples && examples !== null) {
                for (var i = 0; i < examples.length; i++) {
                    var example = examples[i].substring(9, examples[i].length);
                    for (var j = 0; j < staticResources.length; j++) {
                        if (staticResources[j].indexOf(example) !== -1) {
                            var resource = void 0;
                            resource = ajs.Framework.resourceManager.getCachedResource(staticResources[j], ajs.resources.STORAGE_TYPE.LOCAL);
                            text = text.replace(new RegExp("#example " + example + ".*", "g"), "<pre><code class=\"typescript\">" + resource.data + "</pre></code>");
                        }
                    }
                }
            }
            return text;
        };
        return AjsDoc;
    }(ajs.mvvm.viewmodel.ViewComponent));
    ajsdoc.AjsDoc = AjsDoc;
    ajs.Framework.viewComponentManager.registerComponents(AjsDoc);
})(ajsdoc || (ajsdoc = {}));
var ajsdoc;
(function (ajsdoc) {
    "use strict";
    var InvalidPathException = (function () {
        function InvalidPathException() {
        }
        return InvalidPathException;
    }());
    ;
    var kindMap = {
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
    var menuDontExpand = [
        "Class",
        "Interface",
        "Variable",
        "Enumeration",
        "Object literal",
        "Function"
    ];
    var DocModel = (function () {
        function DocModel(data) {
            this._data = JSON.parse(data);
        }
        DocModel.prototype.getMenu = function (navPath) {
            var nodeInfo = this._navigate(navPath, true);
            var parentLabel = nodeInfo.parent !== null && nodeInfo.parent.node.kind !== 0 ?
                nodeInfo.parent.node.kindString + " " + nodeInfo.parent.node.name : null;
            var parentPath = nodeInfo.parent !== null ? nodeInfo.parent.path : "";
            var label = nodeInfo.node.kind !== 0 ? nodeInfo.node.kindString + " " + nodeInfo.node.name : null;
            var menu = {
                parentLabel: parentLabel,
                parentPath: parentPath,
                label: label,
                groups: []
            };
            if (nodeInfo.node.children) {
                for (var i = 0; i < nodeInfo.node.children.length; i++) {
                    var path = nodeInfo.path;
                    if (path === "") {
                        path = nodeInfo.node.children[i].name;
                    }
                    else {
                        path = path + "/" + nodeInfo.node.children[i].name;
                    }
                    var kindMapped = "Unknown [" + nodeInfo.node.children[i].kindString + "]";
                    if (kindMap.hasOwnProperty(nodeInfo.node.children[i].kindString.replace(" ", "_"))) {
                        kindMapped = kindMap[nodeInfo.node.children[i].kindString.replace(" ", "_")];
                    }
                    var itemGroupIndex = this._getGroupIndex(menu, kindMapped);
                    if (itemGroupIndex === -1) {
                        menu.groups.push({
                            key: kindMapped,
                            label: kindMapped,
                            items: []
                        });
                        itemGroupIndex = menu.groups.length - 1;
                    }
                    if (this._includeInMenu(nodeInfo.node.children[i].kindString)) {
                        menu.groups[itemGroupIndex].items.push({
                            key: path,
                            path: path,
                            label: nodeInfo.node.children[i].name,
                            selected: path === navPath
                        });
                    }
                }
            }
            return menu;
        };
        DocModel.prototype.getNavBarItems = function (path) {
            var items = [];
            var nodeInfo = this._navigate(path);
            var key = 0;
            while (nodeInfo !== null) {
                var navBarItem = {
                    key: key.toString(),
                    firstItem: false,
                    itemPath: nodeInfo.path,
                    itemType: nodeInfo.node.kindString,
                    itemLabel: nodeInfo.node.name
                };
                if (nodeInfo.node.kind !== 0) {
                    items.unshift(navBarItem);
                    key++;
                }
                nodeInfo = nodeInfo.parent;
            }
            if (items.length > 0) {
                items[0].firstItem = true;
            }
            return items;
        };
        DocModel.prototype.getContent = function (path) {
            return this._navigate(path);
        };
        DocModel.prototype._getGroupIndex = function (menu, key) {
            for (var i = 0; i < menu.groups.length; i++) {
                if (menu.groups[i].key === key) {
                    return i;
                }
            }
            return -1;
        };
        DocModel.prototype._includeInMenu = function (nodeKind) {
            return true;
        };
        DocModel.prototype._navigate = function (path, dontExpandAll) {
            var ids = path.split("/");
            var nodeInfo = {
                path: "",
                parent: null,
                node: this._data
            };
            if (path === "") {
                return nodeInfo;
            }
            path = "";
            for (var i = 0; i < ids.length; i++) {
                if (path.length === 0) {
                    path = ids[i];
                }
                else {
                    path = path + "/" + ids[i];
                }
                nodeInfo = this._searchId(nodeInfo, ids[i]);
                if (nodeInfo === null) {
                    break;
                }
                else {
                    nodeInfo.path = path;
                }
            }
            if (dontExpandAll && menuDontExpand.indexOf(nodeInfo.node.kindString) !== -1) {
                return nodeInfo.parent;
            }
            if (nodeInfo === null) {
                throw new InvalidPathException();
            }
            return nodeInfo;
        };
        DocModel.prototype._searchId = function (nodeInfo, id) {
            for (var i = 0; i < nodeInfo.node.children.length; i++) {
                if (nodeInfo.node.children[i].name === id) {
                    return {
                        path: "",
                        node: nodeInfo.node.children[i],
                        parent: nodeInfo
                    };
                }
            }
            return null;
        };
        return DocModel;
    }());
    ajsdoc.DocModel = DocModel;
})(ajsdoc || (ajsdoc = {}));
var UserApplication = (function (_super) {
    __extends(UserApplication, _super);
    function UserApplication() {
        _super.apply(this, arguments);
    }
    UserApplication.prototype.initialize = function () {
        var _this = this;
        ajs.Framework.templateManager.loadTemplateFiles(function (success) { _this._templateLoaded(success); }, ["/template.html"], ajs.resources.STORAGE_TYPE.MEMORY, ajs.resources.CACHE_POLICY.LASTRECENTLYUSED);
    };
    UserApplication.prototype._templateLoaded = function (success) {
        if (success) {
            this._setupRoutes();
        }
        else {
            throw new Error("Template loading failed");
        }
    };
    UserApplication.prototype._setupRoutes = function () {
        ajs.Framework.router.registerRoute([{ base: "^\/.*", params: "" }], "Index");
        ajs.Framework.router.registerRoute([{ base: "^\/.*", params: "" }], "Index");
    };
    return UserApplication;
}(ajs.app.Application));
