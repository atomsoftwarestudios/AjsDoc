/* *************************************************************************
The MIT License (MIT)
Copyright (c)2016-2017 Atom Software Studios. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to
deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

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

    /** Default memory cache size is 20MB */
    const MEMORY_CACHE_SIZE: number = 20 * 1024 * 1024;

    /** Indicates if loaded scripts should executed using the eval function or by adding the <script> tag */
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

            if (config === undefined) {
                config = this._defaultConfig();
            }

            this._resourceLoader = new ResourceLoader();
            this._storageLocal = new StorageLocal();
            this._storageSession = new StorageSession();
            this._storageMemory = new StorageMemory(config.memoryCacheSize);

            if (config.removeResourcesOlderThan !== undefined) {
                console.warn("IMPLEMENT: ResourceManager.constructor - removeResourcesOlderThan functionality");
                // throw new NotImplementedException();
            }
        }

        /**
         * Returnd the default ResourceManager configuration
         */
        protected _defaultConfig(): IResourceManagerConfig {
            return {
                memoryCacheSize: MEMORY_CACHE_SIZE
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

            let resource: IResource = null;
            let storage: AjsStorage = this._getStorageFromType(storageType);

            // basic checks and parameters update
            if (storage !== null) {
                if (!storage.supported) {
                    throw new StorageTypeNotSupportedException();
                }
                if (cachePolicy === undefined || cachePolicy === CACHE_POLICY.NONE) {
                    throw new CachePolicyMustBeSetException();
                }
            } else {
                cachePolicy = CACHE_POLICY.NONE;
            }

            if (executeScript === undefined) {
                executeScript = true;
            }

            // if resource is expected to be cached, try to load it from cache first
            resource = this.getResource(url, storageType);

            // setup resource info anyway, even if the resource was not in cache or is not a cached resource
            if (resource === null) {
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

            var resourcesLoadingInfo: IResourcesLoadingInfo = {
                loadingData: [],
                userData: userData,
                loadEndCallback: loadEndCallback
            };

            for (let i: number = 0; i < urls.length; i++) {
                resourcesLoadingInfo.loadingData[i] = {
                    url: urls[i],
                    loadingFinished: false,
                    loaded: false,
                    resource: null
                };
            }

            for (let i: number = 0; i < urls.length; i++) {
                // start loading of the resource
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
        }

        /**
         * Returns a cached resource as IResource type
         * @param url Url of the cached resource
         * @param storageType type of the storage to be used for lookup
         */
        public getResource(url: string, storageType: STORAGE_TYPE): IResource {
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
                    return resource;
                }
                return null;
            }
            throw new InvalidStorageTypeException();
        }

        /**
         * Returns a cached resource
         * @param url
         * @param storageType
         */
        public getCachedResource(url: string, storageType: STORAGE_TYPE): ICachedResource {
            let storage: AjsStorage = this._getStorageFromType(storageType);
            if (storage !== null) {
                return storage.getResource(url);
            } else {
                throw new InvalidStorageTypeException();
            }
        }

        /**
         * Creates or updates existing cached resource
         * @param url
         * @param data
         * @param storageType
         * @param cachePolicy
         */
        public setCachedResource(url: string, data: any, storageType: STORAGE_TYPE, cachePolicy: CACHE_POLICY): void {
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
                throw new InvalidStorageTypeException();
            }
        }

        /**
         * Rmoves existing cached resource
         * @param resource Resource to be created or updated
         * @param storageType Type of the storage to be used
         */
        public removeCachedResource(url: string, storageType: STORAGE_TYPE): void {
            let storage: AjsStorage = this._getStorageFromType(storageType);
            if (storage !== null) {
                storage.removeResource(url);
            } else {
                throw new InvalidStorageTypeException();
            }
        }

        /**
         * Called internally when loading of single resource finishes
         * @param response Information about the resource loaded passed from the resource loader
         */
        protected _loadEnd(response: IResourceResponseData): void {

            let loaded: boolean;
            let loadingInfo: IResourceLoadingInfo = response.userData as IResourceLoadingInfo;

            let url: string = loadingInfo.resource.url;

            // loaded successfully, update resource and also cache if necessary
            if (response.httpStatus === 200) {

                switch (loadingInfo.resource.type) {
                    case RESOURCE_TYPE.BINARY:
                        loadingInfo.resource.data = new Uint8Array(response.data);
                        break;
                    default:
                        loadingInfo.resource.data = response.data;
                }

                if (loadingInfo.resource.storage !== null) {
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
                    loaded = true;
                } else {
                    // http failed but if resource was cached previously we are good
                    loaded = loadingInfo.resource.cached;

                    // if the resource was not cached neither loaded, don't return
                    // the value previously set to the loading info
                    if (!loaded) {
                        loadingInfo.resource = null;
                    }
                }
            }

            // if the resource is script and should be executed, do it
            if (loaded && loadingInfo.resource.type === RESOURCE_TYPE.SCRIPT && loadingInfo.execScript) {
                if (USE_EVAL) {
                    this._evalScript(loadingInfo.resource);
                } else {
                    this._addScriptTag(loadingInfo.resource);
                }
            }

            // update initial progress bar
            if (ajs.ui.InitialProgressBar) {
                ajs.ui.InitialProgressBar.resourceLoaded(url);
            }

            // call the defined callback
            loadingInfo.callback(loaded, url, loadingInfo.resource, loadingInfo.userData);
        }

        /**
         * Called internally when multiple resources are about to be loaded andone of them finished
         * @param loaded Information if resource was loaded from the server or cache (true) or if error occured (false)
         * @param url Url of the resource
         * @param resource Loaded resource or null if error
         * @param userData Information about the callback and resources loading progress
         */
        protected _nextLoaded(loaded: boolean, url: string, resource: IResource, userData: IResourcesLoadingInfo): void {

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
            for (let i: number = 0; i < loadingInfo.loadingData.length; i++) {
                allFinished = allFinished && loadingInfo.loadingData[i].loadingFinished;
                allLoaded = allLoaded && loadingInfo.loadingData[i].loaded;
            }

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