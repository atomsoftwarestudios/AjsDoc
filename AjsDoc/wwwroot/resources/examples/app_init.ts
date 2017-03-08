class UserApplication extends ajs.app.Application {

    // override the initialize method
    // perform necessary tasks here. for example, template file can be loaded. always use 
    // lambda function for async calls to keep "this" pointing to the correct (this) object
    // and keep it as small as possible
    public initialize(): void {
        ajs.Framework.templateManager.loadTemplateFiles(
            (success: boolean) => { this._templateLoaded(success); }, 
            ["/template.html"],
            ajs.resources.STORAGE_TYPE.MEMORY,
            ajs.resources.CACHE_POLICY.LASTRECENTLYUSED
        );
    }

    // process the template loaded event - it is possible to initiate
    // some additional async tasks here but we are done with resources for
    // this example so we will continue by setting up routes
    // so we call the _initDone() method of the super class
    protected _templateLoaded(success: boolean) {
        if (success) {
            this._setupRoutes();
        } else {
            throw new Error("Template loading failed");
        }
    }

    // setup the application routes
    // route points to the ViewComponent object constructor name and consists of two
    // parts: base and params. Base part can be later used to determine the path to
    // the view component while path (contains the path plus search string and hash)
    // can be used to internal ViewComponent routing
    // finally, it is necessary to call the _initDone() in order to let the framework
    // know the application was initialized and can be run.
    protected _setupRoutes(): void {
        ajs.Framework.router.registerRoute([{ base: "^\/.*", params: "" }], "Index");
        ajs.Framework.router.registerRoute([{ base: "^\/.*", params: "" }], "Index");
    }
}
