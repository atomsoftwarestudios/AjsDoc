/* *************************************************************************
The MIT License (MIT)
Copyright (c)2017 Atom Software Studios. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to
deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.
**************************************************************************** */

namespace ajs.boot {

    "use strict";

    getResourceLists = function(): IResourceLists {

        return {
            localPermanent: [
                "/js/ajsdocbrowser.js",
            ]
        };

    };

    getAjsConfig = function(): IAjsConfig {

        // const allParamsAndHashes: string = "($|\\/$|\\/\\?.*|\\/\\#.*|\\?.*|\\#.*)";
        // const anyPath: string = "(\\/.*|.*)";

        return {
            logErrors: true,
            showErrors: true,

            debugging: {
                // styleSheet render target
                styleRenderTarget: document.head,
                // body render target
                bodyRenderTarget: document.body,
                // show the debug console on boot after x miliseconds (0 = don't show)
                // to manually control the console use the browser console 
                // ajs.debug.console.show()
                // ajs.debug.console.hide()
                showOnBootDelay: 5000,
                loggerConfig: {
                    // logging enabled
                    enabled: true,
                    // logger configuration
                    logDataToConsole: false,
                    // type of records to be logged
                    logTypes: [
                        ajs.debug.LogType.Enter,
                        ajs.debug.LogType.Exit,
                        ajs.debug.LogType.Constructor,
                        ajs.debug.LogType.Info,
                        ajs.debug.LogType.Warning,
                        ajs.debug.LogType.Error,
                        ajs.debug.LogType.DomAddListener,
                        ajs.debug.LogType.DomRemoveListener,
                        ajs.debug.LogType.DomAppendChild,
                        ajs.debug.LogType.DomRemoveChild
                    ],
                    // max logging level
                    maxLevel: 9
                }
            },

            resourceManager: {
                memoryCacheSize: 20 * 1024 * 1024,
                sessionCacheSize: 4 * 1024 * 1024,
                localCacheSize: 4 * 1024 * 1024,
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

        let userConfig: ajsdoc.IAjsDocBrowserConfig = {
            storageType: ajs.resources.STORAGE_TYPE.SESSION,
            articlesStoragePolicy: ajs.resources.CACHE_POLICY.LASTRECENTLYUSED,
            libraries: ["/js/lib/highlight.pack.js"],
            templateList: "/static/templates.json",
            resourceList: "/static/appresources.json",
            dataSources: {
                toc: "/static/toc.json",
                program: "/static/program.json"
            }
        };

        return {
            appConstructor: ajsdoc.AjsDocBrowser,
            userConfig: userConfig
        };

    };

}
