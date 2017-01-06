namespace ajsdoc {

    "use strict";

    export class AjsDocBrowser extends ajs.app.Application {

        public initialize(): void {
            ajs.Framework.templateManager.loadTemplateFiles(
                (successfull: boolean) => {
                    this._templatesLoaded(successfull);
                },
                [
                    "/static/ajsdoc.html",
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
                    "/static/ajs.json"
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

            ajs.Framework.router.registerRoute([{ base: "^\/doc", params: anyPath + allParamsAndHashes }], "AjsDoc");
            ajs.Framework.router.registerRoute([{ base: "^\/.*", params: "" }], "AjsDoc");

            this._initDone();

        }

        protected _finalize(): void {
            console.warn("IMPLEMENT: AjsDocBrowser.application.finalize");
        }

    }

}