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
     * Represents single set of resources loading
     */
    interface IResourceLoadingInfo {
        resources: string[];
        storageType: ajs.resources.STORAGE_TYPE;
        cachePolicy: ajs.resources.CACHE_POLICY;
        loadingEnd: boolean;
        loaded: boolean;
    }

    /**
     * Stores information about resources being loaded
     */
    let _resourcesLoadingInfo: IResourceLoadingInfo[];

    /**
     * Main entry point (executed when browser fires the window.onload event)
     * <li>if ajsloader configured, loads and starts it</li>
     * <li>initializes framework</li>
     * <li>loads ajs resources configured in the ajs.boot.config file</li>
     * @throws GetAjsConfigFunctionNotDefinedException Thrown when the ajs.boot namespace has no
     *                                                 getAjsConfig function defined
     */
    function _boot(): void {

        ajs.debug.log(debug.LogType.Enter, 0, "ajs.boot", this);

        if (!(getAjsConfig instanceof Function)) {
            alert("error");
            throw new GetAjsConfigFunctionNotDefinedException();
        }

        // get config
        let config: IAjsConfig = getAjsConfig();

        // if debugging is configured, start it up
        if (config.debugging) {
            ajs.debug.init(config.debugging);
        }

        // initialize config
        ajs.Framework.initialize(config);
        _loadResources();

        ajs.debug.log(debug.LogType.Exit, 0, "ajs.boot", this);

    }

    /** Loads resources and continues to the _config function
     *  @throws GetResourceListFunctionNotDefinedException Thrown when the ajs.boot namespace has no
     *                                                     getResourceList function defined
     */
    function _loadResources(): void {

        ajs.debug.log(debug.LogType.Enter, 0, "ajs.boot", this);

        if (!(getResourceLists instanceof Function)) {
            throw new GetResourceListFunctionNotDefinedException();
        }

        let res: IResourceLists = getResourceLists();

        // prepare information about resources to be loaded
        _resourcesLoadingInfo = [
            {
                resources: res.localPermanent, storageType: ajs.resources.STORAGE_TYPE.LOCAL,
                cachePolicy: ajs.resources.CACHE_POLICY.PERMANENT, loadingEnd: false, loaded: false
            },
            {
                resources: res.localLastRecentlyUsed, storageType: ajs.resources.STORAGE_TYPE.LOCAL,
                cachePolicy: ajs.resources.CACHE_POLICY.LASTRECENTLYUSED, loadingEnd: false, loaded: false
            },
            {
                resources: res.sessionPermanent, storageType: ajs.resources.STORAGE_TYPE.SESSION,
                cachePolicy: ajs.resources.CACHE_POLICY.PERMANENT, loadingEnd: false, loaded: false
            },
            {
                resources: res.sessionLastRecentlyUsed, storageType: ajs.resources.STORAGE_TYPE.SESSION,
                cachePolicy: ajs.resources.CACHE_POLICY.LASTRECENTLYUSED, loadingEnd: false, loaded: false
            },
            {
                resources: res.memoryPermanent, storageType: ajs.resources.STORAGE_TYPE.MEMORY,
                cachePolicy: ajs.resources.CACHE_POLICY.PERMANENT, loadingEnd: false, loaded: false
            },
            {
                resources: res.memoryLastRecentlyUsed, storageType: ajs.resources.STORAGE_TYPE.MEMORY,
                cachePolicy: ajs.resources.CACHE_POLICY.LASTRECENTLYUSED, loadingEnd: false, loaded: false
            },
            {
                resources: res.direct, storageType: undefined,
                cachePolicy: undefined, loadingEnd: false, loaded: false
            }
        ];

        // load resources configured in the boot config 
        for (let i: number = 0; i < _resourcesLoadingInfo.length; i++) {
            if (_resourcesLoadingInfo[i].resources !== undefined) {
                ajs.Framework.resourceManager.loadMultiple(
                    (allLoaded: boolean, resources: ajs.resources.IResource[], userData: IResourceLoadingInfo) => {
                        _resourcesLoadingFinished(allLoaded, resources, userData);
                    },
                    _resourcesLoadingInfo[i].resources,
                    _resourcesLoadingInfo[i],
                    _resourcesLoadingInfo[i].storageType,
                    _resourcesLoadingInfo[i].cachePolicy,
                    true
                );
            }
        }

        ajs.debug.log(debug.LogType.Exit, 0, "ajs.boot", this);

    }

    /**
     * Called when the ResourceManager finishes loading of resources with whatever result.
     * If all resources are successfully loaded, _config function is called.
     * @param allLoaded Indicates if all resources were loaded
     * @param resources List of resource loading information / caching information / resources
     * @throws ResourcesLoadingFailedException Thrown when loading of some of specified resource fails
     */
    function _resourcesLoadingFinished(allLoaded: boolean, resources: ajs.resources.IResource[], userData: IResourceLoadingInfo): void {

        ajs.debug.log(debug.LogType.Enter, 0, "ajs.boot", this);

        userData.loaded = allLoaded;
        userData.loadingEnd = true;

        // check if all loaded and if loaded sucesfuly
        let allDone: boolean = true;
        let allSuccess: boolean = true;
        for (let i: number = 0; i < _resourcesLoadingInfo.length; i++) {
            if (_resourcesLoadingInfo[i].resources !== undefined) {
                allDone = allDone && _resourcesLoadingInfo[i].loadingEnd;
                allSuccess = allSuccess && _resourcesLoadingInfo[i].loaded;
            }
        }

        ajs.debug.log(debug.LogType.Info, 0, "ajs.boot", this, "allDone=" + allDone + ", allSuccess=" + allSuccess);

        // throw an exception if loading is done but not all resources loaded succesfully
        if (allDone) {
            if (allLoaded) {
                _configureApplication();
            } else {
                ajs.debug.log(debug.LogType.Error, 0, this, "ResourcesLoadingFailedException");
                throw new ResourcesLoadingFailedException();
            }
        }

        ajs.debug.log(debug.LogType.Exit, 0, "ajs.boot", this);

    }

    /**
     * Configures the application before it is started
     * @throws GetApplicationConfigFunctionNotDefinedException Thrown when the ajs.boot namespace has no
     *                                                         getApplicationConfig function defined
     */
    function _configureApplication(): void {

        ajs.debug.log(debug.LogType.Enter, 0, "ajs.boot", this);

        if (!(getApplicationConfig instanceof Function)) {
            ajs.debug.log(debug.LogType.Error, 0, this, "GetApplicationConfigFunctionNotDefinedException");
            throw new GetApplicationConfigFunctionNotDefinedException();
        }

        let appConfig: ajs.app.IApplicationConfig = getApplicationConfig();
        ajs.Framework.configureApplication(appConfig);

        _start();

        ajs.debug.log(debug.LogType.Exit, 0, "ajs.boot", this);
    }

    /**
     *  Start the framework / application
     */
    function _start(): void {

        ajs.debug.log(debug.LogType.Enter, 0, "ajs.boot", this);

        ajs.Framework.start();

        ajs.debug.log(debug.LogType.Exit, 0, "ajs.boot", this);
    }

    // call _boot function when the HTML document finishes loading
    window.onload = _boot;
}
