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
    const RESOURCE_STORAGE_TYPE: ajs.resources.STORAGE_TYPE = ajs.resources.STORAGE_TYPE.SESSION;

    /**
     * Static resources to be loaded - MOVE TO APPLICATION CONFIG
     */
    const staticResources: string[] = [
        "/static/examples/app_init.ts",
    ];

    export class AjsDoc extends ajs.mvvm.viewmodel.ViewComponent {

        /** Layout view component state **/
        public ajsDocLayout: IAjsDocLayoutState;

        /** Last view component shown in the content placeholder **/
        protected _lastContent: string;

        /** Program tree parsed from the JSON file generated with the TypeDoc */
        protected _docModel: DocModel;

        /** Listener to the browser navigation event **/
        protected _navigatedListener: ajs.mvvm.viewmodel.IComponentEventNotifyListener;

        /**
         * Synchronous initialization of the view component
         * Subscribes to the navigation notifier, inititalizes the view component and
         * initiates loading of resources. Once resources are loaded the _initAsync
         * method is called to finish the initialization and perform initial state
         * set call
         */
        protected _initialize(): void {

            // subscribe to _navigated event
            this._navigatedListener = (sender: ajs.mvvm.viewmodel.ViewComponent) => {
                this._navigated();
                return true;
            };

            this._ajsView.navigationNotifier.subscribe(this._navigatedListener);

            // setup last content -> used previously for multiple component exchange in the content placeholder
            this._lastContent = "";

            // load necessary template
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

        /**
         * Called when templates are loaded to finish initialization of the view component
         * Loads the highlighting style
         * TODO: Move loading of the JSON resource to the DocModel to follow layer separation
         */
        protected _initAsync(): void {

            // default state of the component
            this.setState({
                ajsDocLayout: {
                    ajsDocHeader: {},
                    ajsDocMenu: {},
                    ajsDocNavBar: {},
                    ajsDocFooter: {}
                }
            });

            // load the data
            // TODO: move this to DocModel
            let resource: ajs.resources.IResource;
            resource = ajs.Framework.resourceManager.getCachedResource(
                "/static/program.json", RESOURCE_STORAGE_TYPE
            );

            if (resource === undefined || resource === null) {
                throw new Error("Documentation definition not loaded");
            }

            // Construct the DocModel object
            this._docModel = new DocModel(resource.data);

            // load the highlighting CSS file
            resource = ajs.Framework.resourceManager.getCachedResource(
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

            // perform initial state update (so set state through layout, not separate compoents)
            this._updateView(true);
        }

        /**
         * Unregisters the component from notifiers
         */
        protected _finalize(): void {
            this._ajsView.navigationNotifier.unsubscribe(this._navigatedListener);
        }

        /**
         * Executed when the browser navigation occurs
         * This method is called from the notifier registered in the _initialize method
         */
        protected _navigated(): void {
            this._updateView(false);
        }

        /**
         * Updates the view based on the navigation path
         * @param updateLayout Specifies if the full layout render should be performed at once or if separate components should be rendered
         */
        protected _updateView(updateLayout: boolean): void {

            let routeInfo: ajs.routing.IRouteInfo = ajs.Framework.router.currentRoute;

            // get menu from model and update the menu view component state
            let menu: IMenuState = this._docModel.getMenu(routeInfo.path);

            let menuState: any = {
                parentLabel: menu.parentLabel,
                parentPath: menu.parentPath,
                label: menu.label,
                groups: menu.groups
            };

            // get navbar from model and update the navbar view component state
            let navbarItems: INavBarItemsState = this._docModel.getNavBarItems(routeInfo.path);

            let navBarState: any = {
                items: navbarItems
            };

            // get content from the model and update the article state
            let content: INode = this._docModel.getContent(routeInfo.path);

            let articleState: IAjsDocArticleStateSet = this._prepareArticleState(content);

            if (content.kindString !== undefined) {
                articleState.members = content.children;
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

        }

        /**
         * Prepares the article state based on the current navigation path
         * @param node Node from the data has to be collected
         */
        protected _prepareArticleState(node: INode): IAjsDocArticleStateSet {

            let hierarchy: any;

            if (node.kindString === "Class") {
                if (node.extendedTypes) {
                    let id: number = node.extendedTypes[0].id;
                    let h: any = { name: node.extendedTypes[0].name, children: null };
                    /*while (id) {
                        let node: INode = this._docModel.getItemById(id);
                    }*/
                }
            }

            return {
                caption: node.kindString + " " + node.name,
                description: this._setupHTMLContent(this._getComment(node)),
                hierarchy: hierarchy
            };
        }

        /**
         * Prepares the content view component
         * This was used recently when multiple components were exchanged in the content
         * placeholder
         * @param componentName Name of the ViewCOmponent to be set to the content placeholder
         */
        protected _setupContentViewComponent(componentName: string): void {

            if (componentName !== this._lastContent) {

                if (this._lastContent !== "") {
                    this.ajsDocLayout.removeChildComponent("content", this._lastContent);
                }

                this.ajsDocLayout.insertChildComponent(componentName, componentName, null, "content");
                this._lastContent = componentName;
            }

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

    /** Register the component to ViewComponentManager */
    ajs.Framework.viewComponentManager.registerComponents(AjsDoc);

}

