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

namespace ajsdoc {

    "use strict";

    export class AjsDoc extends ajs.mvvm.viewmodel.ViewComponent {

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

        protected _defaultState(): ajs.mvvm.viewmodel.IViewStateSet {
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
        }

        /**
         * Synchronous initialization of the view component
         * Subscribes to the navigation notifier, inititalizes the view component and
         * initiates loading of resources. Once resources are loaded the _initAsync
         * method is called to finish the initialization and perform initial state
         * set call
         */
        protected _initialize(): void {

            // create models
            this._progModel = ajs.Framework.modelManager.getModelInstance(ProgramModel) as ProgramModel;
            this._contentModel = ajs.Framework.modelManager.getModelInstance(ContentModel) as ContentModel;

            // subscribe to _navigated event
            this._navigatedListener = (sender: ajs.mvvm.viewmodel.ViewComponent) => {
                this._navigated();
                return true;
            };
            this.ajs.view.navigationNotifier.subscribe(this._navigatedListener);

            // subscribe to program model data ready notifier
            this._programDataReady = (sender: ProgramModel, data: IProgramDataReadyData) => {
                this._processProgramData(data);
                return true;
            };
            this._progModel.dataReadyNotifier.subscribe(this._programDataReady);

            // subscribe to content model data ready notifier
            this._contentDataReady = (sender: ContentModel, data: IContentDataReadyData) => {
                this._processContentData(data);
                return true;
            };
            this._contentModel.dataReadyNotifier.subscribe(this._contentDataReady);
        }


        /**
         * Unsubscribe event listeners and frees models
         */
        protected _finalize(): void {
            this.ajs.view.navigationNotifier.unsubscribe(this._navigatedListener);
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
            this._updateView();
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
                let articleState: Promise<IAjsDocArticleStateSet> = this._prepareArticleState(data.articleState as INode);
                articleState.then(
                    (state: IAjsDocArticleStateSet) => {
                        this.ajsDocLayout.ajsDocArticle.clearState(false);
                        this.ajsDocLayout.ajsDocArticle.setState(state);
                    }
                );
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

            if (data.navBarState) {
                let navBarState: any = {
                    items: data.navBarState
                };
                this.ajsDocLayout.ajsDocNavBar.setState(navBarState);
            }

            if (data.articleState) {

                let descPromise: Promise<string> =
                    this._setupHTMLContent("<div class=\"ajsDocArticleContent\">" + (data.articleState as string) + "</div>");

                descPromise.then((desc: string) => {

                    let articleState: IAjsDocArticleStateSet = {
                        caption: "",
                        description: desc
                    };

                    this.ajsDocLayout.ajsDocArticle.clearState(false);
                    this.ajsDocLayout.ajsDocArticle.setState(articleState);

                });

            }

        }


        /**
         * updates the view based on the navigation path
         * @param updateLayout Specifies if the full layout render should be performed at once or if separate components should be rendered
         */
        protected _updateView(): void {

            let path: string;
            let routeInfo: ajs.routing.IRouteInfo = ajs.Framework.router.currentRoute;

            if (routeInfo.base.substr(0, 3) === "ref") {

                if (routeInfo.base.substr(3, 1) === "/") {
                    path = routeInfo.base.substr(4);
                } else {
                    path = routeInfo.base.substr(3);
                }

                this._progModel.getMenu(path);
                this._progModel.getNavBar(path);
                this._progModel.getContent(path);
            } else {
                this._contentModel.getMenu(routeInfo.base);
                this._contentModel.getNavBar(routeInfo.base);
                this._contentModel.getContent(routeInfo.base);
            }

        }

        /**
         * Prepares the article state based on the current navigation path and data types to be displayed
         * @param node Node from the data has to be collected
         */
        protected _prepareArticleState(node: INode): Promise<IAjsDocArticleStateSet> {

            return new Promise<IAjsDocArticleStateSet>(
                (resolve: (state: IAjsDocArticleStateSet) => void, reject: (reason?: any) => void) => {

                    let hierarchyNode: IHierarchyNodeState = this._buildHierarchy(node);

                    let retVal: IAjsDocArticleStateSet = {};

                    retVal.caption = node.kindString + " " + node.name;

                    let syntaxes: INode[] = [];

                    // if (node.kindString === "Function" || node.kindString === "Interface" || node.kindString === "Method") {

                        let desc: string = this._getComment(node);
                        syntaxes.push(node);
                        if (node.signatures && node.signatures.length > 0) {
                            for (let i: number = 0; i < node.signatures.length; i++) {
                                syntaxes.push(node.signatures[i]);
                                if (desc === "DOCUMENTATION IS MISSING!") {
                                    desc = "";
                                }
                                desc += "<p>" + this._getComment(node.signatures[i]) + "</p>";
                            }
                        }

                        this._setupHTMLContent(desc)

                            .then((desc: string) => {

                                retVal.description = desc;

                                if (hierarchyNode) {
                                    retVal.hierarchy = hierarchyNode;
                                }

                                if (syntaxes.length > 0) {
                                    retVal.syntaxes = syntaxes;
                                }

                                if (node.implementedTypes) {
                                    retVal.implements = [];
                                    for (let i: number = 0; i < node.implementedTypes.length; i++) {
                                        retVal.implements.push({
                                            key: node.implementedTypes[i].id.toString(),
                                            name: node.implementedTypes[i].name,
                                            path: this._progModel.getItemById(node.implementedTypes[i].id).path
                                        });
                                    }
                                }
                                retVal.members = node.children;

                                resolve(retVal);
                            })
                            .catch((reason?: any) => {
                                reject(reason);
                            });

                    /*} else {
                        retVal.description = this._setupHTMLContent(this._getComment(node));
                    }*/

                }
            );
        }

        /**
         * Builds the hierarchy (for classes and interfaces) to be displayed under the article
         * @param node
         */
        protected _buildHierarchy(node: INode): IHierarchyNodeState {
            let hierarchyNode: IHierarchyNodeState;

            if (node.kindString === "Class" || node.kindString === "Interface") {
                if (node.extendedTypes) {

                    hierarchyNode = {
                        path: node.path,
                        name: node.name
                    };

                    if (node.extendedTypes && node.extendedTypes.length > 0) {
                        let id: number = node.extendedTypes[0].id;

                        if (id) {

                            let h: IHierarchyNodeState = hierarchyNode;

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
        protected _setupHTMLContent(text: string): Promise<string> {

            return new Promise<string>(
                async (resolve: (text: string) => void, reject: (reason?: any) => void) => {

                    try {
                        text = "#ASHTML:" + text;
                        text = await this._includeExamples(text);
                        text = await this._includeCharts(text);
                    } catch (e) {
                        reject(e);
                    }

                    resolve(text);

                }
            );
        }

        protected _includeExamples(text: string): Promise<string> {

            let examples: RegExpMatchArray = text.match(/#example.*/g);
            let resourcePromises: Promise<ajs.resources.IResource>[] = [];

            if (examples && examples !== null) {

                for (let i: number = 0; i < examples.length; i++) {
                    let example: string = examples[i].substring(9, examples[i].length);
                    resourcePromises.push(
                        ajs.Framework.resourceManager.getResource(
                            example,
                            config.storageType,
                            ajs.resources.CACHE_POLICY.PERMANENT,
                            ajs.resources.LOADING_PREFERENCE.CACHE
                        )
                    );
                }

                return new Promise<string>(
                    async (resolve: (text: string) => void, reject: (reason?: any) => void) => {

                        try {
                            let resources: ajs.resources.IResource[] = await Promise.all(resourcePromises);

                            for (let i: number = 0; i < resources.length; i++) {
                                text = text.replace(new RegExp("#example " + resources[i].url + ".*", "g"),
                                    "<pre class=\"ajsDocExample\"><code class=\"typescript\">" + resources[i].data + "</pre></code>");
                            }

                        } catch (e) {
                            reject(e);
                        }

                        resolve(text);
                    }
                );

            } else {

                return new Promise<string>((resolve: (text: string) => void) => {
                    resolve(text);
                });

            }
        }

        protected _includeCharts(text: string): Promise<string> {

            let charts: RegExpMatchArray = text.match(/#chart.*/g);
            let resourcePromises: Promise<ajs.resources.IResource>[] = [];

            if (charts && charts !== null) {

                for (let i: number = 0; i < charts.length; i++) {
                    let chart: string = charts[i].substring(7, charts[i].length);

                    resourcePromises.push(
                        ajs.Framework.resourceManager.getResource(
                            chart,
                            config.storageType,
                            ajs.resources.CACHE_POLICY.PERMANENT,
                            ajs.resources.LOADING_PREFERENCE.CACHE
                        )
                    );
                }

                return new Promise<string>(
                    async (resolve: (text: string) => void, reject: (reason?: any) => void) => {

                        try {

                            let resources: ajs.resources.IResource[] = await Promise.all(resourcePromises);

                            for (let i: number = 0; i < resources.length; i++) {
                                text = text.replace(new RegExp("#chart " + resources[i].url + ".*", "g"),
                                    "<div class=\"ajsDocChart\">" + resources[i].data + "</div>");
                            }

                        } catch (e) {
                            reject(e);
                        }

                        resolve(text);

                    }
                );

            } else {

                return new Promise<string>((resolve: (text: string) => void) => {
                    resolve(text);
                });

            }

        }

    }

    /** Register the component to ViewComponentManager */
    ajs.Framework.viewComponentManager.registerComponents(AjsDoc);

}

