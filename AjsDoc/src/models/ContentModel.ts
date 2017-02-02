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

    export interface IArticleData {
        parent: IArticleData;
        key: string;
        label: string;
        path: string;
        navPath: string;
        children: IArticleData[];
    }

    export interface IContentData {
        defaultLabel: string;
        defaultPath: string;
        toc: IArticleData;
    }

    export interface IContentDataReadyData {
        menuState?: IMenuState;
        navBarState: INavBarItemsState;
        articleState?: INode | string;
    }

    export class ContentModel extends ajs.mvvm.model.Model {

        protected _data: IContentData;

        public getMenu(path: string): void {
            this._checkInitialized(
                new Error("Documentation contents loading timeout"),
                () => { this._getMenu(path); }
            );
        }

        public getNavBar(path: string): void {
            this._checkInitialized(
                new Error("Program data loading timeout"),
                () => { this._getNavBar(path); }
            );
        }

        public getContent(path: string): void {
            this._checkInitialized(
                new Error("Documentation contents loading timeout"),
                () => { this._getContent(path); }
            );
        }

        protected _initialize(): void {

            let resPromise: Promise<ajs.resources.IResource> = ajs.Framework.resourceManager.getResource(
                config.dataSources.toc,
                config.storageType,
                ajs.resources.CACHE_POLICY.PERMANENT,
                ajs.resources.LOADING_PREFERENCE.CACHE
            );

            resPromise.then(
                async (resource: ajs.resources.IResource) => {

                    try {
                        this._data = JSON.parse(resource.data);

                        // get all links from the data and load them
                        let contents: Promise<ajs.resources.IResource>[] = [];
                        contents.push(
                            ajs.Framework.resourceManager.getResource(
                                this._data.defaultPath,
                                config.storageType,
                                ajs.resources.CACHE_POLICY.PERMANENT,
                                ajs.resources.LOADING_PREFERENCE.CACHE
                            )
                        );

                        this._getResourcesFromData(this._data.toc, contents);

                        await Promise.all(contents);

                    } catch (e) {
                        throw new Error("Failed to load documentation contents");
                    }

                    this._prepareData();
                    this._initialized = true;

                }
            ).catch((e: any) => {
                throw new Error("Failed to load table of contents");
            });

        }

        protected _getResourcesFromData(article: IArticleData, contents: Promise<ajs.resources.IResource>[]): void {
            if (article.path) {
                contents.push(
                    ajs.Framework.resourceManager.getResource(
                        article.path,
                        config.storageType,
                        ajs.resources.CACHE_POLICY.PERMANENT,
                        ajs.resources.LOADING_PREFERENCE.CACHE
                    )
                );
            }
            if (article.children) {
                for (let i: number = 0; i < article.children.length; i++) {
                    this._getResourcesFromData(article.children[i], contents);
                }
            }
        }

        protected _prepareData(article?: IArticleData, parent?: IArticleData, key?: string): void {

            if (article === undefined) {
                this._prepareData(this._data.toc, null, "0");
            } else {
                article.parent = parent;
                article.key = key;
                article.label = this._getLabel(article);
                article.navPath = parent && parent !== null ? parent.navPath + "/" : "";
                article.navPath += article.label.replace(/ /g, "-");
                article.label = article.label.substr(article.label.indexOf(" ") + 1);

                if (article.children instanceof Array) {
                    for (let i: number = 0; i < article.children.length; i++) {
                        this._prepareData(article.children[i], article, key + "." + i);
                    }
                }
            }

        }

        protected _getLabel(article: IArticleData): string {

            let path: string;
            let label: string;

            if (article.hasOwnProperty("path")) {
                path = (article as IArticleData).path;
            } else {
                return "";
            }

            label = path.substr(path.lastIndexOf("/") + 1);
            label = label.substr(0, label.lastIndexOf("."));

            return label;
        }

        protected _getMenu(navPath: string): void {

            let article: IArticleData = this.navigate(navPath);

            if (article.children === undefined || article.children.length === 0) {
                article = article.parent;
            }

            let menu: IMenuState = {
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

            for (let i: number = 0; i < article.children.length; i++) {
                let item: IMenuItemState = {
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

        }

        protected _getContent(path: string): void {

            let article: IArticleData = this.navigate(path);

            if (article.path) {

                let resource: Promise<ajs.resources.IResource> = ajs.Framework.resourceManager.getResource(
                    article.path,
                    config.storageType,
                    ajs.resources.CACHE_POLICY.PERMANENT,
                    ajs.resources.LOADING_PREFERENCE.CACHE);

                resource.then(
                    (resource: ajs.resources.IResource) => {
                        this._dataReadyNotifier.notify(this, { articleState: resource.data });
                    }
                ).catch(
                    (reason: any) => {
                        throw "Resource " + article.path + " was not loaded";
                    }
                );

            } else {

                this._dataReadyNotifier.notify(this, { articleState: "" });

            }

        }

        protected _getNavBar(path: string): void {
            let items: INavBarItemsState = [];

            let adata: IArticleData = this.navigate(path);

            let key: number = 0;
            while (adata !== null) {
                let navBarItem: INavBarItemState = {
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
        }

        public navigate(path: string): IArticleData {

            let article: IArticleData = this._data.toc;

            if (path === "") {
                return article;
            } else {
                path = "/" + path;
            }

            let found: boolean = false;
            while (article !== null && !found) {
                if (article.navPath === path) {
                    found = true;
                    break;
                } else {
                    let newArticle: IArticleData = null;
                    if (article.children) {
                        for (let i: number = 0; i < article.children.length; i++) {
                            let artPath: string = article.children[i].navPath;
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
                throw new InvalidPathException();
            }


            return article;
        }

    }

}