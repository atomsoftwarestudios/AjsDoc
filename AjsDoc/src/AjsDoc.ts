namespace ajsdoc {

    "use strict";

    const RESOURCE_STORAGE_TYPE: ajs.resources.STORAGE_TYPE = ajs.resources.STORAGE_TYPE.SESSION;



    export interface IAjsDocLayout extends ajs.mvvm.viewmodel.ViewComponent {
        ajsDocHeader: ajs.mvvm.viewmodel.ViewComponent;
        ajsDocMenu: ajs.mvvm.viewmodel.ViewComponent;
        ajsDocNavBar: ajs.mvvm.viewmodel.ViewComponent;
        ajsDocArticle: AjsDocArticle;
    }

    const staticResources: string[] = [
        "/static/examples/app_init.ts",
    ];

    export class AjsDoc extends ajs.mvvm.viewmodel.ViewComponent {


        public ajsDocLayout: IAjsDocLayout;

        protected _lastContent: string;
        protected _docModel: DocModel;

        protected _navigatedListener: ajs.mvvm.viewmodel.IComponentEventNotifyListener;
        protected _renderedListener: ajs.mvvm.viewmodel.IComponentEventNotifyListener;

        protected _initialize(): void {

            this._navigatedListener = (sender: ajs.mvvm.viewmodel.ViewComponent) => {
                this._navigated();
                return true;
            };

            this._renderedListener = (sender: ajs.mvvm.viewmodel.ViewComponent) => {
                this._rendered();
                return true;
            };

            this._ajsView.navigationNotifier.subscribe(this._navigatedListener);
            this._ajsView.renderDoneNotifier.subscribe(this._renderedListener);


            this._lastContent = "";

            ajs.Framework.templateManager.loadTemplateFiles(
                (successfull: boolean) => {
                    if (successfull) {
                        this._initAsync();
                    }
                },
                staticResources,
                ajs.resources.STORAGE_TYPE.LOCAL,
                ajs.resources.CACHE_POLICY.LASTRECENTLYUSED
            );
        }

        protected _initAsync(): void {

            this.setState({
                ajsDocLayout: {
                    ajsDocHeader: {},
                    ajsDocMenu: {},
                    ajsDocNavBar: {},
                    ajsDocFooter: {}
                }
            });

            let resource: ajs.resources.IResource;
            resource = ajs.Framework.resourceManager.getCachedResource(
                "/static/program.json", RESOURCE_STORAGE_TYPE
            );

            if (resource === undefined || resource === null) {
                throw new Error("Documentation definition not loaded");
            }

            this._docModel = new DocModel(resource.data);



            resource = ajs.Framework.resourceManager.getCachedResource(
                "/res/css/hljsvs.css", RESOURCE_STORAGE_TYPE
            );

            if (resource === undefined || resource === null) {
                throw new Error("Code style sheet not loaded");
            }

            let style: HTMLStyleElement = document.createElement("style");
            style.setAttribute("type", "text/css");
            style.innerHTML = resource.data;
            document.head.appendChild(style);


            this._updateView(true);
        }



        protected _finalize(): void {
            this._ajsView.navigationNotifier.unsubscribe(this._navigatedListener);
            this._ajsView.renderDoneNotifier.unsubscribe(this._renderedListener);
        }

        protected _navigated(): void {
            this._updateView(false);
        }

        protected _rendered(): void {
            let pre: NodeListOf<HTMLPreElement> = document.getElementsByTagName("pre");
            for (let i: number = 0; i < pre.length; i++) {
                hljs.highlightBlock(pre[i]);
            }

            let statements: HTMLCollectionOf<Element> = document.getElementsByClassName("ajsDocStatement");
            for (let i: number = 0; i < statements.length; i++) {
                hljs.highlightBlock(statements.item(i) as HTMLElement);
            }
        }

        protected _updateView(updateLayout: boolean): void {

            let routeInfo: ajs.routing.IRouteInfo = ajs.Framework.router.currentRoute;

            // get menu from model and update the menu view component state
            let menu: IMenu = this._docModel.getMenu(routeInfo.path);

            let menuState: any = {
                parentLabel: menu.parentLabel,
                parentPath: menu.parentPath,
                label: menu.label,
                groups: menu.groups
            };

            // get navbar from model and update the navbar view component state
            let navbarItems: INavBarItems = this._docModel.getNavBarItems(routeInfo.path);

            let navBarState: any = {
                items: navbarItems
            };

            // get content from the model and update the article state
            let content: INodeInfo = this._docModel.getContent(routeInfo.path);

            let articleState: IAjsDocArticleStateSet = {
                caption: content.node.kindString + " " + content.node.name,
                description: this._setupHTMLContent(this._getComment(content.node))
            };

            if (content.node.kindString !== undefined) {
                articleState.members = content.node.children;
            } else {
                articleState = {};
            }

            // update state
            if (updateLayout) {
                this.ajsDocLayout.setState({ ajsDocMenu: menuState, ajsDocNavBar: navBarState, ajsDocArticle: articleState });
            } else {
                this.ajsDocLayout.ajsDocMenu.setState(menuState);
                this.ajsDocLayout.ajsDocNavBar.setState(navBarState);

                this.ajsDocLayout.ajsDocArticle.clearState(false);
                this.ajsDocLayout.ajsDocArticle.setState(articleState);
            }


            /*
            let viewComponentName: string;
            if (content !== null && content.node.kind !== 0) {
                viewComponentName = "ajsDoc" + content.node.kindString.replace(" ", "");
            } else {
                viewComponentName = "";
            }

            this._setupContentViewComponent(viewComponentName);

            if (viewComponentName !== "") {
                // prepare the data for the template
                let contentState: any = {};
                switch (viewComponentName) {
                    case "ajsDocModule":
                        contentState = this._prepareModuleState(content);
                        break;
                    case "ajsDocClass":
                        contentState = this._prepareClassState(content);
                        break;
                }

                // set the module state
                this.ajsDocLayout[viewComponentName].setState(contentState);
            }
            */
        }

        protected _setupContentViewComponent(componentName: string): void {

            if (componentName !== this._lastContent) {

                if (this._lastContent !== "") {
                    this.ajsDocLayout.removeChildComponent("content", this._lastContent);
                }

                this.ajsDocLayout.insertChildComponent(componentName, componentName, null, "content");
                this._lastContent = componentName;
            }

        }

        /*protected _prepareArticleState(): IArticleState {

        }*/


        protected _prepareModuleState(content: INodeInfo): any {

            let text: string = this._getComment(content.node);

            let state: any = {
                articleCaption: content.node.name,
                description: this._setupHTMLContent(text),
                hasModules: false,
                modules: { members: [] },
                hasFunctions: false,
                functions: { members: [] },
                hasClasses: false,
                classes: { members: [] },
                hasInterfaces: false,
                interfaces: { members: [] },
                hasVariables: false,
                variables: { members: [] },
                hasEnumerations: false,
                enumerations: { members: [] },
                hasObjectLiterals: false,
                objectLiterals: { members: [] }
            };

            if (content.node && content.node.children) {
                for (let i: number = 0; i < content.node.children.length; i++) {

                    if (content.node.children[i].kindString !== "Interface" && content.node.children[i].signatures) {
                        for (let j: number = 0; j < content.node.children[i].signatures.length; j++) {
                            let node: INode = ajs.utils.DeepMerge.merge({}, content.node.children[i].signatures[j]) as INode;
                            node.kindString = content.node.children[i].kindString;
                            node.flags = content.node.children[i].flags;
                            this._addDefinition(state, content.path, node);
                        }

                        if (content.node.children[i].signatures.length > 1) {
                            this._addDefinition(state, content.path, content.node.children[i]);
                        }

                    } else {
                        this._addDefinition(state, content.path, content.node.children[i]);
                    }
                }
            };

            return state;

        }

        protected _prepareClassState(content: INodeInfo): any {

            let text: string = this._getComment(content.node);
            text = this._setupHTMLContent(text);

            return {
                articleCaption: content.node.name,
                description: text
            };
        }



        protected _addDefinition(state: any, path: string, node: INode): void {
            let key: string = node.id.toString();
            let name: string = node.name;
            let type: string = node.kindString.toLowerCase();
            let description: string = this._getComment(node, true);
            let exported: boolean = node.flags && node.flags.isExported;
            let dataType: string = node.type && node.type.name ? node.type.name : null;
            let params: any[] = this._getParams(node);
            let extendedTypes: any[] = this._getExtendedTypes(node);
            let implementedTypes: any[] = this._getImplementedTypes(node);

            let data: any = {
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
                    state.modules.members.push(data);
                    state.hasModules = true;
                    break;
                case "Class":
                    data.body = "{ ... }";
                    state.classes.members.push(data);
                    state.hasClasses = true;
                    break;
                case "Interface":
                    data.body = "{ ... }";
                    state.interfaces.members.push(data);
                    state.hasInterfaces = true;
                    break;
                case "Function":
                    data.body = "{ ... }";
                    data.hasDataType = true;
                    data.dataType = data.dataType && data.dataType !== null ? data.dataType : "any";
                    data.hasParams = true;
                    state.functions.members.push(data);
                    state.hasFunctions = true;
                    break;
                case "Variable":
                    data.body = "...";
                    data.hasDataType = true;
                    data.dataType = data.dataType && data.dataType !== null ? data.dataType : "any";
                    data.statement = (data.name === data.name.toUpperCase()) ? "const" : "let";
                    state.variables.members.push(data);
                    state.hasVariables = true;
                    break;
                case "Enumeration":
                    data.body = "{ ... }";
                    data.statement = "enum";
                    state.enumerations.members.push(data);
                    state.hasEnumerations = true;
                    break;
                case "Object literal":
                    data.body = "{ ... }";
                    data.hasDataType = true;
                    data.dataType = data.dataType && data.dataType !== null ? data.dataType : "any";
                    data.statement = "let";
                    state.objectLiterals.members.push(data);
                    state.hasObjectLiterals = true;
                    break;
            }
        }

        protected _getParams(node: INode): any[] {

            if (node.parameters && node.parameters.length > 0) {
                let params: any[] = [];
                for (var i: number = 0; i < node.parameters.length; i++) {
                    let param: any = {
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
        }

        protected _getExtendedTypes(node: INode): any[] {
            if (node.extendedTypes && node.extendedTypes.length > 0) {
                let exts: any[] = [];
                for (let i: number = 0; i < node.extendedTypes.length; i++) {
                    let ext: any = {
                        key: node.extendedTypes[i].id,
                        name: node.extendedTypes[i].name,
                        isLast: i === node.extendedTypes.length - 1
                    };
                    exts.push(ext);
                }
                return exts;
            }
            return null;
        }

        protected _getImplementedTypes(node: INode): any[] {
            if (node.implementedTypes && node.implementedTypes.length > 0) {
                let impls: any[] = [];
                for (let i: number = 0; i < node.implementedTypes.length; i++) {
                    let impl: any = {
                        key: node.implementedTypes[i].id,
                        name: node.implementedTypes[i].name,
                        isLast: i === node.implementedTypes.length - 1
                    };
                    impls.push(impl);
                }
                return impls;
            }
            return null;
        }

        protected _getComment(node: INode, firstLineOnly?: boolean): string {
            if (node && node.comment && node.comment.shortText &&
                node.comment.shortText !== null && node.comment.shortText.trim() !== "") {
                if (firstLineOnly && node.comment.shortText.indexOf("\n") !== -1) {
                    return node.comment.shortText.substring(0, node.comment.shortText.indexOf("\n"));
                } else {
                    return node.comment.shortText;
                }
            } else {
                return "DOCUMENTATION IS MISSING!";
            }

        }

        protected _setupHTMLContent(text: string): string {

            text = "#ASHTML:" + text;

            let examples: RegExpMatchArray = text.match(/#example.*/g);
            if (examples && examples !== null) {
                for (let i: number = 0; i < examples.length; i++) {
                    let example: string = examples[i].substring(9, examples[i].length);

                    for (let j: number = 0; j < staticResources.length; j++) {
                        if (staticResources[j].indexOf(example) !== -1) {
                            let resource: ajs.resources.IResource;
                            resource = ajs.Framework.resourceManager.getCachedResource(
                                staticResources[j],
                                ajs.resources.STORAGE_TYPE.LOCAL
                            );
                            text = text.replace(new RegExp("#example " + example + ".*", "g"),
                                "<pre><code class=\"typescript\">" + resource.data + "</pre></code>");
                        }
                    }
                }
            }

            return text;

        }

    }

    ajs.Framework.viewComponentManager.registerComponents(AjsDoc);

}

