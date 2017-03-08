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
                "/js/ajsdoc.lib.js",
                "/js/ajsdocbrowser.js",
            ]
        };

    };

    getAjsConfig = function(): IAjsConfig {

        let doc: Document = window.document.implementation.createHTMLDocument("test");

        // const allParamsAndHashes: string = "($|\\/$|\\/\\?.*|\\/\\#.*|\\?.*|\\#.*)";
        // const anyPath: string = "(\\/.*|.*)";

        return {
            logErrors: true,
            showErrors: true,

            boot: {
                //bootResourcesLoadingPreference: ajs.resources.LOADING_PREFERENCE.SERVER
                bootResourcesLoadingPreference: ajs.resources.LOADING_PREFERENCE.CACHE
            },

            debugging: {
                // styleSheet render target
                styleRenderTarget: document.head,
                // body render target
                bodyRenderTarget: document.body,
                // show the debug console on boot after x miliseconds (0 = don't show)
                // to manually control the console use the browser console 
                // ajs.dbg.console.show()
                // ajs.dbg.console.hide()
                showOnBootDelay: 0,
                loggerConfig: {
                    // logging enabled
                    enabled: false,
                    // logging of the log records to the browser console
                    logDataToConsole: false,
                    // type of records to be logged
                    logTypes: [
                         /*ajs.dbg.LogType.Enter,
                         ajs.dbg.LogType.Exit,*/
                         ajs.dbg.LogType.Constructor,
                         ajs.dbg.LogType.Info,
                         ajs.dbg.LogType.Warning,
                         ajs.dbg.LogType.Error,
                         ajs.dbg.LogType.DomAddListener,
                         ajs.dbg.LogType.DomRemoveListener,
                         ajs.dbg.LogType.DomAppendChild,
                         ajs.dbg.LogType.DomRemoveChild,
                         ajs.dbg.LogType.DomReplaceChild
                    ],
                    sourceModules: [
                         "ajs.app",
                         "ajs.boot",
                         "ajs.doc",
                         "ajs.events",
                         "ajs.mvvm.model",
                         "ajs.mvvm.view",
                         "ajs.mvvm.viewmodel",
                         "ajs.navigation",
                         "ajs.resources",
                         "ajs.routing",
                         "ajs.state",
                         "ajs.templating",
                         "ajs.ui",
                         "ajs.utils"
                    ],
                    // max logging level
                    maxLevel: 9
                }
            },

            resourceManager: {
                memoryCacheSize: 20 * 1024 * 1024,
                sessionCacheSize: 2 * 1024 * 1024,
                localCacheSize: 2 * 1024 * 1024,
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
            ],

            view: {
                renderTarget: document.getElementById("ajsRenderTarget")
            }

        };

    };

    getApplicationConfig = function(): ajs.app.IApplicationConfig {

        // const APP_RESOURCES_LOADING_PREFERENCE: ajs.resources.LOADING_PREFERENCE = ajs.resources.LOADING_PREFERENCE.SERVER;
        const APP_RESOURCES_LOADING_PREFERENCE: ajs.resources.LOADING_PREFERENCE = ajs.resources.LOADING_PREFERENCE.CACHE;

        let userConfig: ajsdoc.IAjsDocBrowserConfig = {
            storageType: ajs.resources.STORAGE_TYPE.LOCAL,
            storagePolicy: ajs.resources.CACHE_POLICY.LASTRECENTLYUSED,
            templateList: "/resources/templates.json",
            templateLoadingPreference: APP_RESOURCES_LOADING_PREFERENCE,
            resourceList: "/resources/appresources.json",
            resourceLoadingPreference: APP_RESOURCES_LOADING_PREFERENCE,
            dataSources: {
                toc: "/resources/toc.json",
                program: "/resources/program.json"
            },
            dataLoadingPreference: APP_RESOURCES_LOADING_PREFERENCE,
        };

        return {
            appConstructor: ajsdoc.AjsDocBrowser,
            userConfig: userConfig
        };

    };

}
