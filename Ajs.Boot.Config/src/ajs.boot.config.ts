namespace ajs.boot {

    "use strict";

    getResourceLists = function(): IResourceLists {
        return {
            localPermanent: [
                "/js/ajsdocbrowser.js",
                "/js/highlight.pack.js"
            ]
        };
    };

    getAjsConfig = function(): IAJSConfig {

        return {
            debug: true,
            logErrors: true,
            showErrors: true,

            resourceManagerConfig: {
                memoryCacheSize: 20 * 1024 * 1024,
                removeResourcesOlderThan: ajs.utils.maxDate()
            },
        };

    };

    getApplicationConfig = function (): ajs.app.IApplicationConfig {
        return {
            appConstructor: ajsdoc.AjsDocBrowser,
            userConfig: null
        };
    };

}
