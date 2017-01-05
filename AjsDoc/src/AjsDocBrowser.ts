namespace ajsdoc {

    "use strict";

    export class AjsDocBrowser extends ajs.app.Application {

        public initialize(): void {
            ajs.Framework.templateManager.loadTemplateFiles(
                (successfull: boolean) => {
                    this._templatesLoaded(successfull);
                },
                [
                    "/res/css/hljsvs.css",
                    "/static/ajsdoc.html",
                    "/static/ajs.json"
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
            this._resourcesLoaded();
        }

        protected _resourcesLoaded(): void {
            this._setupRoutes();
        }

        protected _setupRoutes(): void {

            const allParamsAndHashes: string = "($|\\/$|\\/\\?.*|\\/\\#.*|\\?.*|\\#.*)";
            const anyPath: string = "(\\/.*|.*)";

            ajs.Framework.router.registerRoute([{ base: "^\/doc", params: anyPath + allParamsAndHashes }], "AjsDoc");

            ajs.Framework.router.registerRoute([{ base: "^\/event\\/users", params: allParamsAndHashes }], "EventUsersTest");
            ajs.Framework.router.registerRoute([{ base: "^\/.*", params: "" }], "Index");

            this._initDone();

        }

        protected _finalize(): void {
            console.warn("IMPLEMENT: AjsDocBrowser.application.finalize");
        }

    }

}