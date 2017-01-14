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

    export class AjsDocBrowser extends ajs.app.Application {

        public initialize(): void {
            ajs.Framework.templateManager.loadTemplateFiles(
                (successfull: boolean) => {
                    this._templatesLoaded(successfull);
                },
                [
                    "/static/templates/ajsdoc.html",
                ],
                ajs.resources.STORAGE_TYPE.LOCAL,
                ajs.resources.CACHE_POLICY.PERMANENT
            );
        }

        protected _templatesLoaded(successfull: boolean): void {
            if (successfull) {
                this._loadResources();
            } else {
                throw new Error("Failed to load templates.");
            }
        }

        protected _loadResources(): void {
            ajs.Framework.resourceManager.loadMultiple(
                (successfull: boolean) => {
                    this._resourcesLoaded(successfull);
                },
                [
                    "/res/css/hljsvs.css",
                    "/res/css/content.css",
                    "/static/program.json"
                ],
                null,
                ajs.resources.STORAGE_TYPE.SESSION,
                ajs.resources.CACHE_POLICY.PERMANENT
            );
        }

        protected _resourcesLoaded(succesfull: Boolean): void {
            if (succesfull) {
                this._setupRoutes();
            } else {
                throw new Error("Failed to load resources.");
            }
        }

        protected _setupRoutes(): void {

            const allParamsAndHashes: string = "($|\\/$|\\/\\?.*|\\/\\#.*|\\?.*|\\#.*)";
            const anyPath: string = "(\\/.*|.*)";

            // ajs.Framework.router.registerRoute([{ base: "^\/doc", params: anyPath + allParamsAndHashes }], "AjsDoc");
            ajs.Framework.router.registerRoute([{ base: ".*", params: "" }], "AjsDoc");

            this._initDone();

        }

        protected _finalize(): void {
            console.warn("IMPLEMENT: AjsDocBrowser.application.finalize");
        }

    }

}