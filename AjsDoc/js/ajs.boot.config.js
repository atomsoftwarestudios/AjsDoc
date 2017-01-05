var ajs;
(function (ajs) {
    var boot;
    (function (boot) {
        "use strict";
        boot.getResourceLists = function () {
            return {
                localPermanent: [
                    "/js/ajsdocbrowser.js",
                    "/js/highlight.pack.js"
                ]
            };
        };
        boot.getAjsConfig = function () {
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
        boot.getApplicationConfig = function () {
            return {
                appConstructor: ajsdoc.AjsDocBrowser,
                userConfig: null
            };
        };
    })(boot = ajs.boot || (ajs.boot = {}));
})(ajs || (ajs = {}));
