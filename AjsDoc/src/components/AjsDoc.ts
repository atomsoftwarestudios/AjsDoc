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

    const RESOURCE_STORAGE_TYPE: ajs.resources.STORAGE_TYPE = ajs.resources.STORAGE_TYPE.SESSION;

    const staticResources: string[] = [
        "/static/examples/app_init.ts",
    ];

    export class AjsDoc extends ajs.mvvm.viewmodel.ViewComponent {


        public ajsDocLayout: IAjsDocLayoutState;

        protected _lastContent: string;
        protected _docModel: DocModel;

        protected _navigatedListener: ajs.mvvm.viewmodel.IComponentEventNotifyListener;

        protected _initialize(): void {

            this._navigatedListener = (sender: ajs.mvvm.viewmodel.ViewComponent) => {
                this._navigated();
                return true;
            };

            this._ajsView.navigationNotifier.subscribe(this._navigatedListener);

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
        }

        protected _navigated(): void {
            this._updateView(false);
        }

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

            let articleState: IAjsDocArticleStateSet = this._prepareArticle(content);

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

        protected _prepareArticle(node: INode): IAjsDocArticleStateSet {

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

        protected _setupContentViewComponent(componentName: string): void {

            if (componentName !== this._lastContent) {

                if (this._lastContent !== "") {
                    this.ajsDocLayout.removeChildComponent("content", this._lastContent);
                }

                this.ajsDocLayout.insertChildComponent(componentName, componentName, null, "content");
                this._lastContent = componentName;
            }

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

