/* *************************************************************************
The MIT License (MIT)
Copyright (c)2016-2017 Atom Software Studios. All rights reserved.

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

///<reference path="../utils/Utils.ts" />
///<reference path="../dbg/Console.ts" />
///<reference path="../dbg/log.ts" />

/**
 * Boot namespace contains the boot loader and associated interfaces
 * <p>
 * _boot function is called automatically when window.onload event occur. It
 * loads resources configured in the ajs.boot.config and intializes and
 * starts the framework.
 * </p>
 * Boot expect the ajs.boot namespace contain following functions implementation:
 * <ul>
 *    <li>getResourceLists = function(): IResourceLists {
 *        let resourceLists: IResourceLists = { ... }; return resourceLists; }</li>
 *    <li>getAjsConfig(): IAajsConfig {
 *        let ajsConfig: IAjsConfig = { ... }; return ajsConfig; }</li>
 *    <li>getApplicationConfig = function(): ajs.app.IApplicationConfig {
 *        let applicationConfig = { ... }; return applicationConfig }</li>
 * </ul>
 */
namespace ajs.boot {

    "use strict";

    /**
     * Function returning the Ajs Framework configuration.
     * This function must be declared in the ajs.boot.config file (usually separate
     * VS project) and loaded during the index.html loading
     */
    export let getAjsConfig: IGetAjsConfig;

    /**
     * Function returning the list of application resources to be loaded
     * This function must be declared in the ajs.boot.config file (usually separate
     * VS project) and loaded during the index.html loading
     */
    export let getResourceLists: IGetResourceLists;

    /**
     * Function returning the application configuratopn
     * This function must be declared in the ajs.boot.config file (usually separate
     * VS project) and loaded during the index.html loading
     */
    export let getApplicationConfig: IGetAjsApplicationConfig;

    /**
     * Holds collected ajs config
     */
    let config: IAjsConfig;

    let bootStarted: boolean = false;

    /**
     * Return default boot config
     */
    function _defaultConfig(): IBootConfig {
        return {
            bootResourcesLoadingPreference: resources.LOADING_PREFERENCE.CACHE
        };
    }

    /**
     * Main entry point (executed on application cache events cahced/noupdate/error or window.onload event)
     * Initializes the framework and initiate loading of configured resources)
     */
    function _boot(): void {

        // get Ajs config
        if (!(getAjsConfig instanceof Function)) {
            throw new GetAjsConfigFunctionNotDefinedException();
        }

        config = getAjsConfig();

        // if debugging is configured, start it up
        if (config.debugging) {
            ajs.dbg.init(config.debugging);
        }

        if (config.boot === undefined) {
            config.boot = _defaultConfig();
        }

        // do some basic logging
        ajs.dbg.log(dbg.LogType.Info, 0, "ajs.boot", null, "Ajs Framework, (c)2016-2017 Atom Software Studios, s.r.o");

        ajs.dbg.log(dbg.LogType.Enter, 0, "ajs.boot", this);

        ajs.dbg.log(dbg.LogType.Info, 0, "ajs.boot", null, "Booting up Ajs Framework");

        // initialize config
        ajs.Framework.initialize(config);

        // continue by loading resources and application configuration
        _loadResources();

        ajs.dbg.log(dbg.LogType.Exit, 0, "ajs.boot", this);

    }

    /** 
     * Loads resources and continues to the _config function
     */
    function _loadResources(): void {

        ajs.dbg.log(dbg.LogType.Enter, 0, "ajs.boot", this);

        if (!(getResourceLists instanceof Function)) {
            throw new GetResourceListFunctionNotDefinedException();
        }

        let res: IResourceLists = getResourceLists();

        // prepare information about resources to be loaded - always prefer to update resources prior using them from cache
        // review if it is possible to use cached resources rather than server ones
        let _resourcesLoadingInfo: any[] = [
            Framework.resourceManager.getMultipleResources(
                res.localPermanent, resources.STORAGE_TYPE.LOCAL, resources.CACHE_POLICY.PERMANENT,
                config.boot.bootResourcesLoadingPreference),
            Framework.resourceManager.getMultipleResources(
                res.localLastRecentlyUsed, resources.STORAGE_TYPE.LOCAL, resources.CACHE_POLICY.LASTRECENTLYUSED,
                config.boot.bootResourcesLoadingPreference),
            Framework.resourceManager.getMultipleResources(
                res.sessionPermanent, resources.STORAGE_TYPE.SESSION, resources.CACHE_POLICY.PERMANENT,
                config.boot.bootResourcesLoadingPreference),
            Framework.resourceManager.getMultipleResources(
                res.sessionLastRecentlyUsed, resources.STORAGE_TYPE.SESSION, resources.CACHE_POLICY.LASTRECENTLYUSED,
                config.boot.bootResourcesLoadingPreference),
            Framework.resourceManager.getMultipleResources(
                res.memoryPermanent, resources.STORAGE_TYPE.MEMORY, resources.CACHE_POLICY.PERMANENT,
                config.boot.bootResourcesLoadingPreference),
            Framework.resourceManager.getMultipleResources(
                res.memoryLastRecentlyUsed, resources.STORAGE_TYPE.MEMORY, resources.CACHE_POLICY.LASTRECENTLYUSED,
                config.boot.bootResourcesLoadingPreference),
            Framework.resourceManager.getMultipleResources(
                res.direct, undefined, undefined)
        ];

        // wait till resources are loaded and
        Promise.all(_resourcesLoadingInfo).
            // continue by configuring application
            then(
                () => {
                    _configureApplication();
                }
            ).
            // catch the problem
            catch((e: Error) => {
                ajs.dbg.log(dbg.LogType.Error, 0, "ajs.boot", this,
                    "Something went wrong during resource loading " + e, e);
                throw new ResourcesLoadingFailedException();
            });

        ajs.dbg.log(dbg.LogType.Exit, 0, "ajs.boot", this);
    }

    /**
     * Configures the application before it is started
     */
    function _configureApplication(): void {

        ajs.dbg.log(dbg.LogType.Enter, 0, "ajs.boot", this);

        ajs.dbg.log(dbg.LogType.Info, 0, "ajs.boot", this, "Getting the Application config");

        if (!(getApplicationConfig instanceof Function)) {
            ajs.dbg.log(dbg.LogType.Error, 0, this, "GetApplicationConfigFunctionNotDefinedException");
            throw new GetApplicationConfigFunctionNotDefinedException();
        }

        let appConfig: ajs.app.IApplicationConfig = getApplicationConfig();
        ajs.Framework.configureApplication(appConfig);

        _start();

        ajs.dbg.log(dbg.LogType.Exit, 0, "ajs.boot", this);
    }

    /**
     *  Start the framework / application
     */
    function _start(): void {

        ajs.dbg.log(dbg.LogType.Enter, 0, "ajs.boot", this);

        ajs.dbg.log(dbg.LogType.Info, 0, "ajs.boot", this, "Starting the framework");

        ajs.Framework.start();

        ajs.dbg.log(dbg.LogType.Exit, 0, "ajs.boot", this);
    }

    /**
     * Performs update of cached files (cleans all caches and forces window to reload)
     * <p>
     * It is called when the application cache recognizes there are updated files on the server.
     * It is simplest possible solution to load updated application resources.
     * </p>
     * <p>
     * the update of cached files is ready. at this time it is not possile to configure what will happen next
     * its hardcoded the complete resource cache managed by the resource manager will be cleaned up and reload is perofrmed
     * to ensure the latest boot/ajs versions are in use and also latest versions of the application code and application
     * resources will be used
     * </p>
     */
    function _update(): void {

        // does not make sense to log, reload performed

        let resMan: ajs.resources.ResourceManager = new ajs.resources.ResourceManager();
        resMan.cleanCaches();
        window.location.reload();
    }

    /**
     * Setup listeners related to Application cache feature used to start the booting process
     * <p>
     * During tests it was confirmed the application cache feature, especially notifications
     * processed bellow is not stable (this statement is valid for all tested browsers) and it
     * is necessary to perform, at least, fallback by timer, otherwise it can happen the framework
     * neither the application will get started.
     * </p>
     */
    function _setupEventListeners(): void {

        // cant use logger as it is possible it is not loaded at this time

        if (window.applicationCache) {

            // process cached event (no change in cached files, boot directly)
            window.applicationCache.addEventListener("cached", () => {
                if (!bootStarted) {
                    bootStarted = true;
                    _boot();
                }
            });

            // process noupdate - means that cached files (mainly the cache.manifest) were not updated
            window.applicationCache.addEventListener("noupdate", () => {
                if (!bootStarted) {
                    bootStarted = true;
                    _boot();
                }
            });

            // the error occured during the accesing files on the server or another problem during its loading (i.e. offline)
            window.applicationCache.addEventListener("error", (e: Event) => {
                if (!bootStarted) {
                    bootStarted = true;
                    _boot();
                }
            });

            // the update of cached files is ready. at this time it is not possile to configure what will happen next
            // its hardcoded the complete resource cache managed by the resource manager will be cleaned up and reload is perofrmed
            // to ensure the latest boot/ajs versions are in use and also latest versions of the application code and application
            // resources will be used
            window.applicationCache.addEventListener("updateready", () => {
                applicationCache.swapCache();
                if (!bootStarted) {
                    bootStarted = true;
                    _update();
                }
            });

            // if appcache is not supported make sure the framework will boot
        }

        // this is fallback if no event is called
        window.addEventListener("load", () => {
            setTimeout(() => {
                if (!bootStarted) {
                    bootStarted = true;
                    _boot();
                }
            }, 500);
        });


    }

    // ********************************************************************************
    // this code is executed immediately when the ajs.js script is loaded and evaluated
    // takes care of the debug console initialization and starts the ajs boot process
    // ********************************************************************************

    _setupEventListeners();

}
