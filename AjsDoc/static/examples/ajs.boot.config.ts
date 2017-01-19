namespace ajs.boot {

    "use strict";

    getResourceLists = function(): IResourceLists {

        return {
            ...
        };

    };

    getAjsConfig = function(): IAjsConfig {

        return {
            debug: true,
            logErrors: true,
            showErrors: true,

            resourceManager: {
                memoryCacheSize: 20 * 1024 * 1024,
                removeResourcesOlderThan: ajs.utils.maxDate()
            },

            navigator: [
                { path: "", target: "/01-Introduction" },
                { path: "/", target: "/01-Introduction" },
                { path: "/ref", target: "/ref/ajs" },
                { path: "/ref/", target: "/ref/ajs" }
            ],

            router: [
                {
                    paths: [{ base: ".*", params: "" }],
                    viewComponentName: "AjsDoc"
                }
            ]

        };

    };


    getApplicationConfig = function(): ajs.app.IApplicationConfig {

        return {
            ...
        };

    };

}
