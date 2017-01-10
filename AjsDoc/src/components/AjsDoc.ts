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

namespace ajsdoc {

    "use strict";

    /**
     * Specifies where resources used by AjsDoc will be cached - MOVE TO APPLICATION CONFIG
     */
    export const RESOURCE_STORAGE_TYPE: ajs.resources.STORAGE_TYPE = ajs.resources.STORAGE_TYPE.SESSION;
    export const RESOURCE_STORAGE_POLICY: ajs.resources.CACHE_POLICY = ajs.resources.CACHE_POLICY.LASTRECENTLYUSED;

    /**
     * Static resources to be loaded - MOVE TO APPLICATION CONFIG
     */
    const staticResources: string[] = [
        "/static/examples/app_init.ts",
    ];

    export class AjsDoc extends ajs.mvvm.viewmodel.ViewComponent {

        protected _initialized: boolean;

        /** Layout view component state */
        public ajsDocLayout: IAjsDocLayoutState;

        /** Program tree parsed from the JSON file generated with the TypeDoc */
        protected _progModel: ProgramModel;

        /** Content model */
        protected _contentModel: ContentModel;

        /** Listener to the browser navigation event */
        protected _navigatedListener: ajs.events.IListener;

        /** Program data ready listener */
        protected _programDataReady: ajs.events.IListener;

        /** Content data ready listener */
        protected _contentDataReady: ajs.events.IListener;

        /**
         * Synchronous initialization of the view component
         * Subscribes to the navigation notifier, inititalizes the view component and
         * initiates loading of resources. Once resources are loaded the _initAsync
         * method is called to finish the initialization and perform initial state
         * set call
         */
        protected _initialize(): void {

            this._initialized = false;

            // create models
            this._progModel = ajs.Framework.modelManager.getModelInstance(ProgramModel) as ProgramModel;
            this._contentModel = ajs.Framework.modelManager.getModelInstance(ContentModel) as ContentModel;

            // subscribe to _navigated event
            this._navigatedListener = (sender: ajs.mvvm.viewmodel.ViewComponent) => {
                if (this._initialized) {
                    this._navigated();
                }
                return true;
            };
            this._ajsView.navigationNotifier.subscribe(this._navigatedListener);

            // subscribe to program model data ready notifier
            this._programDataReady = (sender: ProgramModel, data: IProgramDataReadyData) => {
                if (this._initialized) {
                    this._processProgramData(data);
                }
                return true;
            };
            this._progModel.dataReadyNotifier.subscribe(this._programDataReady);

            // subscribe to content model data ready notifier
            this._contentDataReady = (sender: ContentModel, data: IContentDataReadyData) => {
                if (this._initialized) {
                    this._processContentData(data);
                }
                return true;
            };
            this._contentModel.dataReadyNotifier.subscribe(this._contentDataReady);

            // load necessary templates and continue with initAsync when the template is ready
            ajs.Framework.templateManager.loadTemplateFiles(
                (successfull: boolean) => {
                    if (successfull) {
                        this._initAsync();
                    }
                },
                staticResources,
                RESOURCE_STORAGE_TYPE,
                RESOURCE_STORAGE_POLICY
            );
        }

        /**
         * Called when templates are loaded to finish initialization of the view component
         * Loads the highlighting style
         * TODO: Move loading of the JSON resource to the DocModel to follow layer separation
         */
        protected _initAsync(): void {

            // !!!!!!!!!!!!!!!!!!!!!!!! MOVE THIS TO STYLESHEET MANAGER !!!!!!!!!!!!!!!!!!!!!!!!!!!!
            let resource: ajs.resources.IResource = ajs.Framework.resourceManager.getCachedResource(
                "/res/css/hljsvs.css", RESOURCE_STORAGE_TYPE
            );

            if (resource === undefined || resource === null) {
                throw new Error("Code style sheet not loaded");
            }

            // register the style to the web page (ajsStyle manager is not implemented yet)
            let style: HTMLStyleElement = document.createElement("style");
            style.setAttribute("type", "text/css");
            style.innerHTML = resource.data;
            document.head.appendChild(style);
            // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

            // default state of the layout component
            this.setState({
                ajsDocLayout: {
                    ajsDocHeader: {},
                    ajsDocMenu: {},
                    ajsDocArticle: {},
                    ajsDocNavBar: {},
                    ajsDocFooter: {}
                }
            });

            // initialization finished
            this._initialized = true;

            // initiate loading of the data for the current path
            this._navigated();
        }

        /**
         * Unsubscribe event listeners and frees models
         */
        protected _finalize(): void {
            this._ajsView.navigationNotifier.unsubscribe(this._navigatedListener);
            this._progModel.dataReadyNotifier.unsubscribe(this._programDataReady);
            this._contentModel.dataReadyNotifier.unsubscribe(this._contentDataReady);
            ajs.Framework.modelManager.freeModelInstance(ProgramModel);
            ajs.Framework.modelManager.freeModelInstance(ContentModel);
        }

        /**
         * Executed when the browser navigation occurs
         * This method is called from the notifier registered in the _initialize method
         */
        protected _navigated(): void {
            this._updateView(false);
        }

        /**
         * Called when the ProgramModel asynchronously prepares the state to be set
         * @param data State to be set. Can be a menuState, navBarState or a contentState
         */
        protected _processProgramData(data: IProgramDataReadyData): void {

            if (data.menuState) {
                this.ajsDocLayout.ajsDocMenu.setState(data.menuState);
            }

            if (data.navBarState) {
                let navBarState: any = {
                    items: data.navBarState
                };
                this.ajsDocLayout.ajsDocNavBar.setState(navBarState);
            }

            if (data.articleState) {
                let articleState: IAjsDocArticleStateSet = this._prepareArticleState(data.articleState as INode);
                this.ajsDocLayout.ajsDocArticle.clearState(false);
                this.ajsDocLayout.ajsDocArticle.setState(articleState);
            }


        }

        /**
         * Called when the ContentModel asynchronously prepares the state to be set
         * @param data State to be set. Can be a menuState or a contentState
         */
        protected _processContentData(data: IContentDataReadyData): void {

            if (data.menuState) {
                this.ajsDocLayout.ajsDocMenu.setState(data.menuState);
            }

            if (data.articleState) {
                /*let articleState: IAjsDocArticleStateSet = this._prepareArticleState(data.articleState);
                this.ajsDocLayout.ajsDocArticle.clearState(false);
                this.ajsDocLayout.ajsDocArticle.setState(articleState);*/
            }

        }


        /**
         * updates the view based on the navigation path
         * @param updateLayout Specifies if the full layout render should be performed at once or if separate components should be rendered
         */
        protected _updateView(updateLayout: boolean): void {

            let routeInfo: ajs.routing.IRouteInfo = ajs.Framework.router.currentRoute;

            this._progModel.getMenu(routeInfo.path);
            this._progModel.getNavBar(routeInfo.path);
            this._progModel.getContent(routeInfo.path);

            this._contentModel.getMenu(routeInfo.path);
            this._contentModel.getContent(routeInfo.path);

        }

        /**
         * Prepares the article state based on the current navigation path and data types to be displayed
         * @param node Node from the data has to be collected
         */
        protected _prepareArticleState(node: INode): IAjsDocArticleStateSet {

            let hierarchyNode: IHierarchyNode = this._buildHierarchy(node);

            let retVal: IAjsDocArticleStateSet = {};

            if (node.id !== 0) {
                retVal.caption = node.kindString + " " + node.name;
                retVal.description = this._setupHTMLContent(this._getComment(node));
                if (hierarchyNode) {
                    retVal.hierarchy = hierarchyNode;
                }
                retVal.members = node.children;
            }

            return retVal;
        }

        /**
         * Builds the hierarchy (for classes and interfaces) to be displayed under the article
         * @param node
         */
        protected _buildHierarchy(node: INode): IHierarchyNode {
            let hierarchyNode: IHierarchyNode;

            if (node.kindString === "Class" || node.kindString === "Interface") {
                if (node.extendedTypes) {

                    hierarchyNode = {
                        path: node.path,
                        name: node.name
                    };

                    if (node.extendedTypes && node.extendedTypes.length > 0) {
                        let id: number = node.extendedTypes[0].id;

                        if (id) {

                            let h: IHierarchyNode = hierarchyNode;

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
                                    } else {
                                        id = 0;
                                    }
                                } else {
                                    id = 0;
                                }
                            }
                        } else {

                            hierarchyNode.extends = {
                                name: node.extendedTypes[0].name
                            };

                        }
                    }
                }
            }
            return hierarchyNode;
        }

        /**
         * Reads the documentation comment from particular documentation node
         * @param node The node the commend has to be get from
         * @param firstLineOnly Specifies if the full comment is returned or its first line only
         */
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

        /**
         * Sets the #ASHTML to let the AjsFw know the text shoule be rendered as HTML
         * Also processes additional AjsDoc comment tags and includes external resources
         * to the string
         * @param text The text to be converted and updated
         */
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
                                RESOURCE_STORAGE_TYPE
                            );
                            if (resource === null) {
                                throw new Error("Example resource '" + staticResources[j] + "' not loaded");
                            }
                            text = text.replace(new RegExp("#example " + example + ".*", "g"),
                                "<pre class=\"ajsDocExample\"><code class=\"typescript\">" + resource.data + "</pre></code>");
                        }
                    }
                }
            }

            return text;

        }

    }

    /** Register the component to ViewComponentManager */
    ajs.Framework.viewComponentManager.registerComponents(AjsDoc);

}

