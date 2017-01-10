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

    const CONTENT_DATA = "/static/toc.json";

    export interface IArticleData {
        article: string;
        children: IArticleData[];
    }

    export interface IContentData {
        default: string;
        toc: IArticleData[];
    }

    export interface IContentDataReadyData {
        menuState?: IMenuState;
        articleState?: IContentState;
    }

    export class ContentModel extends ajs.mvvm.model.Model {

        protected _jsonData: string;
        protected _data: IContentData;

        public getMenu(path: string): void {
            this._checkInitialized(
                new Error("Documentation contents loading timeout"),
                () => { this._getMenu(path); }
            );
        }

        public getContent(path: string): void {
            this._checkInitialized(
                new Error("Documentation contents loading timeout"),
                () => { this._getContent(path); }
            );
        }

        protected _initialize() {
            // load the toc.json
            ajs.Framework.resourceManager.load(
                (successfull: boolean, url: string, resource: ajs.resources.IResource) => {
                    this._jsonLoaded(successfull, url, resource);
                },
                CONTENT_DATA,
                null,
                RESOURCE_STORAGE_TYPE,
                RESOURCE_STORAGE_POLICY
            );
        }

        protected _jsonLoaded(successfull: boolean, url: string, resource: ajs.resources.IResource): void {
            if (!successfull) {
                throw "Failed to load the TOC";
            }

            // parse loaded data
            this._jsonData = resource.data;
            this._data = JSON.parse(this._jsonData);

            // get all links from the data
            let contents: string[] = [];
            contents.push(this._data.default);
            this._getResourcesFromData(this._data.toc, contents);

            // load all content resources
            ajs.Framework.resourceManager.loadMultiple(
                (allLoaded: boolean, resources: ajs.resources.IResource[]) => {
                    this._contentsLoaded(allLoaded, resources);
                },
                contents,
                null,
                RESOURCE_STORAGE_TYPE,
                RESOURCE_STORAGE_POLICY
            );;
        }

        protected _getResourcesFromData(data: IArticleData[], contents: string[]): void {
            for (let i: number = 0; i < data.length; i++) {
                if (contents.indexOf(data[i].article) === -1) {
                    contents.push(data[i].article);
                    if (data[i].children) {
                        this._getResourcesFromData(data[i].children, contents);
                    }
                }
            }
        }

        protected _contentsLoaded(allLoaded: boolean, resources: ajs.resources.IResource[]): void {
            if (!allLoaded) {
                throw "Failed to load documentation contents";
            }
            this._initialized = true;
        }

        protected _getMenu(path: string): void {
        }

        protected _getContent(path: string): void {
        }


    }

}