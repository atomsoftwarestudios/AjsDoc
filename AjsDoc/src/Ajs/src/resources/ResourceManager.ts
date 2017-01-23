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

namespace ajs.resources {

    "use strict";

    /** Default cache sizes 20 / 4 / 4 MB */
    const MEMORY_CACHE_SIZE: number = 20 * 1024 * 1024;
    const SESSION_CACHE_SIZE: number = 4 * 1024 * 1024;
    const LOCAL_CACHE_SIZE: number = 4 * 1024 * 1024;

    /** Indicates if loaded scripts should executed using the eval function or by adding the &lt;script&gt; tag */
    const USE_EVAL: boolean = true;

    /** Resource types and their file name extensions */
    const RESOURCE_TYPES: IResourceTypes = {
        /** JavaScript resource */
        script: [".js"],
        /** Cascading stylesheet resource */
        style: [".css"],
        /** Text resource, such as HTML, XML, JSON, TXT */
        text: [".htm", ".html", ".xml", ".json", ".txt"],
        /** Binary resource, such as PNG, JPG, GIF */
        binary: [".png", ".jpg", ".jpeg"]
    };

    /** Storage cachedResourcesInfo key */
    export const STORAGE_INFO_KEY: string = "AJSRESOURCEINFO";

    /** Storage resource data item key prefix */
    export const STORAGE_RESOURCE_KEY_PREFIX: string = "AJSRESOURCE.";

    /** Storage key for testing if the resource fits the remaining free space */
    export const STORAGE_ADDTEST_KEY: string = "AJSADDTEST";

    /** List of possible resource types */
    export enum RESOURCE_TYPE {
        SCRIPT,
        STYLE,
        TEXT,
        BINARY,
        UNKNOWN
    }

    /** Type of the storage - passed to the loadResource or loadResources methods */
    export enum STORAGE_TYPE {
        NONE,
        LOCAL,
        SESSION,
        MEMORY
    }

    /** Cache policy
     * NONE - Not used when the resource is cached
     * PERMANENT - Resource is cached permanently and is never automatically removed from the cache
     * LASTRECENTLYUSED - Resource is removed from the cache when there is no enough space and it is last recently used resource
     */
    export enum CACHE_POLICY {
        NONE,
        PERMANENT,
        LASTRECENTLYUSED
    }

    /**
     * Resource manager takes care of loading of resources from the server and caching them in the appropriate cache
     * <ul>
     *    <li>GET method is used to load resources</li>
     *    <li>If the resource is type of SCRIPT it is evaulated automatically and immediately on load.</li>
     *    <ul>
     *       <li>Scripts can be evaluated using the eval method or by adding the script tag to the main document</li>
     *       <li>This is drivent by the USE_EVAL constant and should not be changed in runtime</li>
     *       <li>EVAL should be used only for debugging purposes as the visual studio and IE can't handle source maps
     *           when the &lt;script&gt; tag is added</li>
     *       <li>If multiple resources are about to be loaded the evaluation of scripts occcurs when all are loaded successfully
     *           as the order of scripts to be loaded is important, because some can require others to be evaluated earlier</li>
     *    </ul>
     *    <li>If the resource is type of STYLE it is automatically registered to the style manager</li>
     *    <li>Other types of resources are not evaluated automatically and are just returned / cached</li>
     * </ul>
     */
    export class ResourceManager {

        /** Stores referrence to the ResourceLoader object */
        protected _resourceLoader: ResourceLoader;
        /** Returns referrence to the ResourceLoader object used by the Resource Manager */
        public get resourceLoader(): ResourceLoader { return this.resourceLoader; }

        /** Stores reference to the StorageLocal object */
        protected _storageLocal: StorageLocal;
        /** Returns referrence to the StorageLocal object used by the Resource Manager */
        public get storageLocal(): StorageLocal { return this._storageLocal; }

        /** Stores reference to the StorageSession object */
        protected _storageSession: StorageSession;
        /** Returns referrence to the StorageSession object used by the Resource Manager */
        public get storageSession(): StorageSession { return this._storageSession; }

        /** Stores reference to the StorageMemory object */
        protected _storageMemory: StorageMemory;
        /** Returns referrence to the StorageMemory object used by the Resource Manager */
        public get storageMemory(): StorageMemory { return this._storageMemory; }

        /**
         * Constructs the ResourceManager
         */
        public constructor(config?: IResourceManagerConfig) {

            ajs.debug.log(debug.LogType.Constructor, 0, "ajs.resources", this, "", config);

            if (config === undefined) {
                config = this._defaultConfig();
            }

            this._resourceLoader = new ResourceLoader();
            this._storageLocal = new StorageLocal();
            this._storageSession = new StorageSession();
            this._storageMemory = new StorageMemory();

            if (config.removeResourcesOlderThan !== undefined) {
                ajs.debug.log(debug.LogType.Warning, 0, "ajs.resources", this,
                    "IMPLEMENT: ResourceManager.constructor - removeResourcesOlderThan functionality");
                // throw new NotImplementedException();
            }

            ajs.debug.log(debug.LogType.Exit, 0, "ajs.resources", this);
        }

        /**
         * Returnd the default ResourceManager configuration
         */
        protected _defaultConfig(): IResourceManagerConfig {

            ajs.debug.log(debug.LogType.Enter, 0, "ajs.resources", this);

            ajs.debug.log(debug.LogType.Enter, 0, "ajs.resources", this,
                "ResourceManager configuration not provided, fallback to default");

            ajs.debug.log(debug.LogType.Exit, 0, "ajs.resources", this);

            return {
                memoryCacheSize: MEMORY_CACHE_SIZE,
                sessionCacheSize: SESSION_CACHE_SIZE,
                localCacheSize: LOCAL_CACHE_SIZE
            };
        }

        /**
         * Load resource from server or from cache if it was not modified since last download and the cache was in use
         * If caching of the resource is required the resource is created or updated in the cache of given type
         * - GET method is used to load resources
         * - If the resource is type of SCRIPT it is evaulated automatically and immediately on load.
         *    - Scripts can be evaluated using the eval method or by adding the script tag to the main document
         *       - This is drivent by the USE_EVAL constant and should not be changed in runtime
         *       - EVAL should be used only for debugging purposes as the visual studio and IE can't handle source maps
         *         when the <script> tag is added
         *    - If multiple resources are about to be loaded the evaluation of scripts occcurs when all are loaded successfully
         *      as the order of scripts to be loaded is important, because some can require others to be evaluated earlier
         * - If the resource is type of STYLE it is automatically registered to the style manager
         * - Other types of resources are not evaluated automatically and are just returned / cached
         * @param loadEndCallback Function to be called when asynchronous request finishes
         * @param url Url of the resource to be loaded
         * @param userData Any user data to be passed back to the callback.
         *                 Set to null if data is not in use but other parameters have to be passed
         * @param storageType Type of storage to be used to cache the resource.
         *                    If the storage is not specified the direct download will be used
         * @param cachePolicy If the storage is specified the cache policy will set the cache behavior
         * @param executeScript Flag if the script should be executed automatically if loaded, default behaviour is true
         * @throws StorageTypeNotSupportedException Thrown when the storage is not supported by the browser
         * @throws CachePolicyMustBeSetException Thrown when the storage is set but the policy does not or is NONE;
         */
        public load(
            loadEndCallback: IResourceLoadEndCallback,
            url: string,
            userData?: any,
            storageType?: STORAGE_TYPE,
            cachePolicy?: CACHE_POLICY,
            executeScript?: boolean
        ): void {

            ajs.debug.log(debug.LogType.Enter, 0, "ajs.resources", this);

            ajs.debug.log(debug.LogType.Info, 0, "ajs.resources", this,
                "Loading resource: '" + url + "', Storage: " + STORAGE_TYPE[storageType] + ", Cache Policy: " + CACHE_POLICY[cachePolicy] );

            let resource: IResource = null;
            // get the storage
            let storage: AjsStorage = this._getStorageFromType(storageType);

            // basic checks and parameters update
            if (storage !== null) {
                if (!storage.supported) {
                    ajs.debug.log(debug.LogType.Error, 0, "ajs.resources", this, "Storage type not supported");
                    throw new StorageTypeNotSupportedException();
                }

                if (cachePolicy === undefined || cachePolicy === CACHE_POLICY.NONE) {
                    ajs.debug.log(debug.LogType.Error, 0, "ajs.resources", this, "Cache policy not set");
                    throw new CachePolicyMustBeSetException();
                }
            } else {
                ajs.debug.log(debug.LogType.Info, 0, "ajs.resources", this, "Fallback to CACHE_POLICY.NONE");
                cachePolicy = CACHE_POLICY.NONE;
            }

            if (executeScript === undefined) {
                executeScript = true;
                ajs.debug.log(debug.LogType.Info, 0, "ajs.resources", this, "Script resource will be executed by default");
            }

            // if resource is expected to be cached, try to load it from cache first
            resource = this.getResource(url, storageType);

            // setup resource info anyway, even if the resource was not in cache or is not a cached resource
            if (resource === null) {

                ajs.debug.log(debug.LogType.Info, 0, "ajs.resources", this, "Resource not cached");

                resource = {
                    url: url,
                    type: this._getResourceTypeFromURL(url),
                    data: null,
                    cached: false,
                    storage: storage,
                    cachePolicy: cachePolicy,
                    lastModified: null
                };
            }

            // prepare loading info structure
            let resourceLoadingInfo: IResourceLoadingInfo = {
                resource: resource,
                userData: userData,
                execScript: executeScript,
                callback: loadEndCallback
            };

            // update initial progress bar
            if (ajs.ui.InitialProgressBar) {
                ajs.debug.log(debug.LogType.Info, 0, "ajs.resources", this,
                    "Updating initial progress bar with resource to be loaded: '" + url + "'");
                ajs.ui.InitialProgressBar.resourceLoading(url);
            }

            // load the resource with the loadEndCallback
            this._resourceLoader.loadResource(
                (response: IResourceResponseData) => { this._loadEnd(response); },
                url,
                resource.type === RESOURCE_TYPE.BINARY,
                resourceLoadingInfo,
                resource.lastModified
            );

            ajs.debug.log(debug.LogType.Exit, 0, "ajs.resources", this);
        }

        /**
         * Loads multiple resources from the server or the same cache type and the same caching policy
         * @param loadEndCallback Function to be called when all asynchronous requests finishes
         * @param url Array of resource URL's to be loaded
         * @param userData Any user data to be passed back to the callback.
         *                 Set to null if data is not in use but other parameters have to be passed
         * @param storageType Type of storage to be used to cache resources.
         *                    If the storage is not specified the direct download will be used
         * @param cachePolicy If the storage is specified the cache policy will set the cache behavior for all resources loading
         */
        public loadMultiple(
            loadEndCallback: IResourcesLoadEndCallback,
            urls: string[],
            userData?: any,
            storageType?: STORAGE_TYPE,
            cachePolicy?: CACHE_POLICY,
            executeScripts?: boolean
        ): void {

            ajs.debug.log(debug.LogType.Enter, 0, "ajs.resources", this);

            ajs.debug.log(debug.LogType.Info, 0, "ajs.resources", this,
                "Loading resources (" + urls.length + "), Storage: " + STORAGE_TYPE[storageType] +
                 ", Cache Policy: " + CACHE_POLICY[cachePolicy], urls);

            // prepare loading info structure
            let resourcesLoadingInfo: IResourcesLoadingInfo = {
                loadingData: [],
                userData: userData,
                loadEndCallback: loadEndCallback
            };

            // add record for each resource to be loaded
            for (let i: number = 0; i < urls.length; i++) {
                resourcesLoadingInfo.loadingData[i] = {
                    url: urls[i],
                    loadingFinished: false,
                    loaded: false,
                    resource: null
                };
            }

            // start loading of all resources simultaneously
            for (let i: number = 0; i < urls.length; i++) {
                this.load(
                    (loaded: boolean, url: string, resource: IResource, userData: IResourcesLoadingInfo) => {
                        this._nextLoaded(loaded, url, resource, userData);
                    },
                    urls[i],
                    resourcesLoadingInfo,
                    storageType,
                    cachePolicy,
                    executeScripts
                );
            }

            ajs.debug.log(debug.LogType.Exit, 0, "ajs.resources", this);

        }

        /**
         * Returns a cached resource as IResource type
         * @param url Url of the cached resource
         * @param storageType type of the storage to be used for lookup
         */
        public getResource(url: string, storageType: STORAGE_TYPE): IResource {

            ajs.debug.log(debug.LogType.Enter, 0, "ajs.resources", this);
            ajs.debug.log(debug.LogType.Info, 0, "ajs.resources", this,
                "Getting cached resource '" + url + "', Storage: " + STORAGE_TYPE[storageType]);

            let storage: AjsStorage = this._getStorageFromType(storageType);
            if (storage !== null) {
                let cachedResource: ICachedResource = storage.getResource(url);
                if (cachedResource !== null) {
                    let resource: IResource = {
                        url: url,
                        type: this._getResourceTypeFromURL(url),
                        data: cachedResource.data,
                        cached: true,
                        storage: storage,
                        cachePolicy: cachedResource.cachePolicy,
                        lastModified: cachedResource.lastModified
                    };
                    ajs.debug.log(debug.LogType.Exit, 0, "ajs.resources", this);
                    return resource;
                }
                ajs.debug.log(debug.LogType.Info, 0, "ajs.resources", this, "Resource not found in specified storage");
                ajs.debug.log(debug.LogType.Exit, 0, "ajs.resources", this);
                return null;
            }

            ajs.debug.log(debug.LogType.Error, 0, "ajs.resources", this, "Invalid storage type");
            throw new InvalidStorageTypeException();
        }

        /**
         * Returns a cached resource
         * @param url Url of the cached resource
         * @param storageType type of the storage to be used for lookup
         */
        public getCachedResource(url: string, storageType: STORAGE_TYPE): ICachedResource {

            ajs.debug.log(debug.LogType.Enter, 0, "ajs.resources", this);
            ajs.debug.log(debug.LogType.Info, 0, "ajs.resources", this,
                "Getting cached resource '" + url + "', Storage: " + STORAGE_TYPE[storageType]);

            let storage: AjsStorage = this._getStorageFromType(storageType);
            if (storage !== null) {
                ajs.debug.log(debug.LogType.Exit, 0, "ajs.resources", this);
                return storage.getResource(url);
            } else {
                ajs.debug.log(debug.LogType.Error, 0, "ajs.resources", this, "Invalid storage type");
                throw new InvalidStorageTypeException();
            }
        }

        /**
         * Creates or updates existing cached resource
         * @param url Url of the cached resource
         * @param data Data to be stored or updated
         * @param storageType type of the storage to be used
         * @param cachePolicy cache policy to be used for new resources
         */
        public setCachedResource(url: string, data: any, storageType: STORAGE_TYPE, cachePolicy: CACHE_POLICY): void {

            ajs.debug.log(debug.LogType.Enter, 0, "ajs.resources", this);

            let storage: AjsStorage = this._getStorageFromType(storageType);
            if (storage !== null) {
                let resource: ICachedResource = {
                    url: url,
                    data: data,
                    cachePolicy: cachePolicy,
                    lastModified: new Date()
                };
                storage.updateResource(resource);
            } else {
                ajs.debug.log(debug.LogType.Error, 0, "ajs.resources", this, "Invalid storage type");
                throw new InvalidStorageTypeException();
            }

            ajs.debug.log(debug.LogType.Exit, 0, "ajs.resources", this);

        }

        /**
         * Rmoves existing cached resource
         * @param resource Resource to be created or updated
         * @param storageType Type of the storage to be used
         */
        public removeCachedResource(url: string, storageType: STORAGE_TYPE): void {

            ajs.debug.log(debug.LogType.Enter, 0, "ajs.resources", this);

             let storage: AjsStorage = this._getStorageFromType(storageType);
            if (storage !== null) {
                storage.removeResource(url);
            } else {
                ajs.debug.log(debug.LogType.Error, 0, "ajs.resources", this, "Invalid storage type");
                throw new InvalidStorageTypeException();
            }

            ajs.debug.log(debug.LogType.Exit, 0, "ajs.resources", this);
        }

        /**
         * Called internally when loading of single resource ends
         * @param response Information about the resource loaded passed from the resource loader
         */
        protected _loadEnd(response: IResourceResponseData): void {

            ajs.debug.log(debug.LogType.Enter, 0, "ajs.resources", this);

            let loaded: boolean;
            let loadingInfo: IResourceLoadingInfo = response.userData as IResourceLoadingInfo;

            let url: string = loadingInfo.resource.url;

            ajs.debug.log(debug.LogType.Info, 0, "ajs.resources", this, "Processing loaded resource '" + url + "'");

            // loaded successfully, update resource and also cache if necessary
            if (response.httpStatus === 200) {

                // based on the resource type, get the data
                switch (loadingInfo.resource.type) {
                    case RESOURCE_TYPE.BINARY:
                        ajs.debug.log(debug.LogType.Info, 0, "ajs.resources", this, "Binary file loaded");
                        loadingInfo.resource.data = new Uint8Array(response.data);
                        break;
                    default:
                        ajs.debug.log(debug.LogType.Info, 0, "ajs.resources", this, "Text file loaded");
                        loadingInfo.resource.data = response.data;
                }

                // update cached resource
                if (loadingInfo.resource.storage !== null) {

                    ajs.debug.log(debug.LogType.Info, 0, "ajs.resources", this, "Loaded resource is cached. Updating.");

                    let cachedResource: ICachedResource = {
                        url: loadingInfo.resource.url,
                        data: loadingInfo.resource.data,
                        cachePolicy: loadingInfo.resource.cachePolicy,
                        lastModified: new Date()
                    };

                    loadingInfo.resource.storage.updateResource(cachedResource);
                    loadingInfo.resource.cached = true;
                }

                loaded = true;

            } else {
                // not modified, loaded successfully
                // the resource loaded from cache is already set in the loading info
                if (response.httpStatus === 304) {
                    ajs.debug.log(debug.LogType.Info, 0, "ajs.resources", this, "Not modified, using cached resource");
                    loaded = true;
                } else {
                    // http failed but if resource was cached previously we are good
                    loaded = loadingInfo.resource.cached;

                    // if the resource was not cached neither loaded, don't return
                    // the value previously set to the loading info
                    if (!loaded) {
                        ajs.debug.log(debug.LogType.Warning, 0, "ajs.resources", this, "Resource failed to load and is not cached");
                        loadingInfo.resource = null;
                    }
                }
            }

            // if the resource is script and should be executed, do it
            if (loaded && loadingInfo.resource.type === RESOURCE_TYPE.SCRIPT && loadingInfo.execScript) {

                ajs.debug.log(debug.LogType.Info, 0, "ajs.resources", this, "Executing the loaded script");

                // use eval or insert the script tag to the code
                if (USE_EVAL) {
                    this._evalScript(loadingInfo.resource);
                } else {
                    this._addScriptTag(loadingInfo.resource);
                }
            }

            // update initial progress bar
            ajs.debug.log(debug.LogType.Info, 0, "ajs.resources", this,
                "Updating initial progress bar with resource finished loading '" + url + "'");

            if (ajs.ui.InitialProgressBar) {
                ajs.ui.InitialProgressBar.resourceLoaded(url);
            }

            // call the defined callback
            ajs.debug.log(debug.LogType.Info, 0, "ajs.resources", this, "Calling the defined callback");
            loadingInfo.callback(loaded, url, loadingInfo.resource, loadingInfo.userData);

            ajs.debug.log(debug.LogType.Exit, 0, "ajs.resources", this);
        }

        /**
         * Called internally when multiple resources are about to be loaded andone of them finished
         * @param loaded Information if resource was loaded from the server or cache (true) or if error occured (false)
         * @param url Url of the resource
         * @param resource Loaded resource or null if error
         * @param userData Information about the callback and resources loading progress
         */
        protected _nextLoaded(loaded: boolean, url: string, resource: IResource, userData: IResourcesLoadingInfo): void {

            ajs.debug.log(debug.LogType.Enter, 0, "ajs.resources", this);

            let allFinished: boolean = true;
            let allLoaded: boolean = true;
            let loadingInfo: IResourcesLoadingInfo = userData;

            // update loading info (need to wait all required resourcess passess processing
            for (let i: number = 0; i < loadingInfo.loadingData.length; i++) {
                if (url === loadingInfo.loadingData[i].url) {
                    loadingInfo.loadingData[i].resource = resource;
                    loadingInfo.loadingData[i].loaded = loaded;
                    loadingInfo.loadingData[i].loadingFinished = true;
                    break;
                }
            }

            // for all resources check the finished and loaded status
            let loadedCount: number = 0;
            for (let i: number = 0; i < loadingInfo.loadingData.length; i++) {
                if (loadingInfo.loadingData[i].loadingFinished) {
                    loadedCount++;
                }
                allFinished = allFinished && loadingInfo.loadingData[i].loadingFinished;
                allLoaded = allLoaded && loadingInfo.loadingData[i].loaded;
            }

            ajs.debug.log(debug.LogType.Info, 0, "ajs.resources", this,
                "Next resource loading finished (" + loadedCount + " out of " + loadingInfo.loadingData.length +
                "), result: " + (loaded ? "success" : "fail"));

            // if all resources finished loading, prepare callback params and call it
            if (allFinished) {

                // if all succesfully loaded, execute all script resources in the order they were requested to be loaded
                if (allLoaded) {
                    /*for (let i: number = 0; i < loadingInfo.loadingData.length; i++) {
                        if (loadingInfo.loadingData[i].resource.type === RESOURCE_TYPE.SCRIPT) {
                            if (USE_EVAL) {
                                this._evalScript(loadingInfo.loadingData[i].resource);
                            } else {
                                this._addScriptTag(loadingInfo.loadingData[i].resource);
                            }
                        }
                    }*/
                }

                // prepare array of loaded resources to be passed to the callback
                let resources: IResource[] = [];
                for (let i: number = 0; i < loadingInfo.loadingData.length; i++) {
                    resources.push(loadingInfo.loadingData[i].resource);
                }

                // call the defined callback
                loadingInfo.loadEndCallback(allLoaded, resources, loadingInfo.userData);
            }

            ajs.debug.log(debug.LogType.Exit, 0, "ajs.resources", this);

        }

        /**
         * Returns the storage instance from the storage type
         * @param storageType
         */
        protected _getStorageFromType(storageType: STORAGE_TYPE): AjsStorage {
            switch (storageType) {
                case STORAGE_TYPE.LOCAL:
                    return this._storageLocal;
                case STORAGE_TYPE.SESSION:
                    return this._storageSession;
                case STORAGE_TYPE.MEMORY:
                    return this._storageMemory;
                default:
                    return null;
            }
        }

        /**
         * Returns the resource type from the resource file extension
         * @param url
         */
        protected _getResourceTypeFromURL(url: string): RESOURCE_TYPE {
            let ext: string = url.substring(url.lastIndexOf("."));
            if (RESOURCE_TYPES.script.indexOf(ext) >= 0) { return RESOURCE_TYPE.SCRIPT; }
            if (RESOURCE_TYPES.style.indexOf(ext) >= 0) { return RESOURCE_TYPE.STYLE; }
            if (RESOURCE_TYPES.text.indexOf(ext) >= 0) { return RESOURCE_TYPE.TEXT; }
            if (RESOURCE_TYPES.binary.indexOf(ext) >= 0) { return RESOURCE_TYPE.BINARY; }
            return RESOURCE_TYPE.UNKNOWN;
        }

        /**
         * Evaluates the script resource - should be used only during debugging as IE / Visual Studio does not
         * work with source maps in the dynamically added <script> tag when debugging
         * @param resource Script resource to be evaluated
         */
        protected _evalScript(resource: IResource): void {
            if (resource !== null && resource.data != null) {
                let content: string = resource.data;
                if (content.indexOf("//# sourceMappingURL") !== -1) {
                    content =
                        content.substring(0, content.lastIndexOf("\n")) +
                        "\n//# sourceMappingURL=" + resource.url + ".map" +
                        "\n//# sourceURL=" + resource.url;
                }
                eval.call(null, content);
            }
        }

        /**
         * Creates the script tag and adds the resource data to it (script is then executed automatically)
         * @param resource Script resource to be evaluated
         */
        protected _addScriptTag(resource: IResource): void {

            // first check if the script was not added already
            let nodeList: NodeList = document.head.getElementsByTagName("script");
            for (let i: number = 0; i < nodeList.length; i++) {
                if ((nodeList.item(i) as HTMLScriptElement).id === resource.url) {
                    return;
                }
            }

            // add script and its content
            let script: HTMLScriptElement = document.createElement("script");
            script.id = resource.url;
            script.type = "text/javascript";
            script.innerText = resource.data;
            document.head.appendChild(script);
        }

    }


}