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

    /**
     * This prefix shall be added to all managed resources which are not loaded from the server
     * <p>
     * All Ajs and application features using managed resources and creating them locally, not
     * by loading them form server (i.e.to session/ app state manager) shall use this prefix in the
     * resource URL in order to be possible to quilcky recognize the resource can't be loaded from
     * the server. If the prefix will not be used the delay in serving the resource can occur as try
     * to load / update it form server will be performed. Definitelly, request to the server will be
     * send what is unwanted behaviour at local resources.
     * </p>
     */
    export const LOCAL_ONLY_PREFIX: string = "LOCAL.";

    /** Default cache sizes 20 / 4 / 4 MB */
    const MEMORY_CACHE_SIZE: number = 20 * 1024 * 1024;
    const SESSION_CACHE_SIZE: number = 4 * 1024 * 1024;
    const LOCAL_CACHE_SIZE: number = 4 * 1024 * 1024;

    const WAIT: number = 1;

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
        binary: [".png", ".jpg", ".jpeg", "gif"]
    };

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

    /**
     * Resource cache policy
     * <p>
     * RCP is used to determine if the resource shouls be accessible permanently (mainly in offline mode) or
     * if it can be removed from the cache if there is not enough space for another resource requested by the application
     * </p>
     */
    export enum CACHE_POLICY {
        /** Not used when the resource is cached, the resource is loaded directly from the server */
        NONE,
        /** Resource is cached permanently, it can't be removed during the cache clean process */
        PERMANENT,
        /** Last recently used resources will be removed from the cache if there is no space for a new resource requested */
        LASTRECENTLYUSED
    }

    /**
     * Loading preference     
     */
    export enum LOADING_PREFERENCE {
        SERVER,
        CACHE
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

        protected _config: IResourceManagerConfig;
        public get config(): IResourceManagerConfig { return this._config; }

        protected _managedResources: IManagedResource[];
        public get managedResources(): IManagedResource[] { return this._managedResources; }

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
         * <p>
         * Initializes resource loader and resource storages and gets info about managed resources.
         * Basically, all resources remaining in storages after refresh / browser restart and
         * created during any previous session using the resource manager are automatically managed
         * in the new browser session. Ofcouse only those alived the user action (session data will
         * not be avalilable after browser restart)
         * <p>
         */
        public constructor(config?: IResourceManagerConfig) {

            ajs.dbg.log(dbg.LogType.Constructor, 0, "ajs.resources", this, "", config);

            // store config locally
            if (config === undefined) {
                this._config = this._defaultConfig();
            } else {
                this._config = config;
            }

            this._resourceLoader = new ResourceLoader();
            this._storageLocal = new StorageLocal(this._config.localCacheSize);
            this._storageSession = new StorageSession(this._config.sessionCacheSize);
            this._storageMemory = new StorageMemory(this._config.memoryCacheSize);

            this._managedResources = this._getManagedResources();

            // do some logging
            ajs.dbg.log(dbg.LogType.Info, 0, "ajs.resources", this,
                "Local storage used space: " + this._storageLocal.usedSpace + "/" + this._storageLocal.cacheSize);
            ajs.dbg.log(dbg.LogType.Info, 0, "ajs.resources", this,
                "Local storage managed resources count: " + this._storageLocal.resources.length);

            ajs.dbg.log(dbg.LogType.Info, 0, "ajs.resources", this,
                "Session storage used space: " + this._storageSession.usedSpace + "/" + this._storageSession.cacheSize);
            ajs.dbg.log(dbg.LogType.Info, 0, "ajs.resources", this,
                "Session storage managed resources count: " + this._storageSession.resources.length);

            // this will be always 0/max/0, just for sure everything works fine
            ajs.dbg.log(dbg.LogType.Info, 0, "ajs.resources", this,
                "Memory storage used space: " + this._storageMemory.usedSpace + "/" + this._storageMemory.cacheSize);
            ajs.dbg.log(dbg.LogType.Info, 0, "ajs.resources", this,
                "Memory storage managed resources count: " + this._storageMemory.resources.length);

            if (this._config.removeResourcesOlderThan !== undefined) {
                ajs.dbg.log(dbg.LogType.Warning, 0, "ajs.resources", this,
                    "IMPLEMENT: ResourceManager.constructor - removeResourcesOlderThan functionality");
            }

            ajs.dbg.log(dbg.LogType.Exit, 0, "ajs.resources", this);
        }

        /**
         * Returns the default ResourceManager configuration
         */
        protected _defaultConfig(): IResourceManagerConfig {

            ajs.dbg.log(dbg.LogType.Enter, 0, "ajs.resources", this);

            ajs.dbg.log(dbg.LogType.Info, 0, "ajs.resources", this,
                "ResourceManager configuration not provided, fallback to default");

            ajs.dbg.log(dbg.LogType.Exit, 0, "ajs.resources", this);

            return {
                memoryCacheSize: MEMORY_CACHE_SIZE,
                sessionCacheSize: SESSION_CACHE_SIZE,
                localCacheSize: LOCAL_CACHE_SIZE
            };
        }

        /**
         * Gets resources managed last time (before browser reload/refresh/open/reopen)
         * <p>
         * Called from constructor to get list of cached resources in local and session storages
         */
        protected _getManagedResources(): IManagedResource[] {

            ajs.dbg.log(dbg.LogType.Enter, 0, "ajs.resources", this);

            ajs.dbg.log(dbg.LogType.Info, 0, "ajs.resources", this,
                "Getting list of previously managed resources");

            let managedResources: IManagedResource[] = [];

            // get managed resources for the local storage
            let tmp: ICachedResource[] = this._storageLocal.resources;
            for (let i: number = 0; i < tmp.length; i++) {
                managedResources.push({
                    url: tmp[i].url,
                    storageType: STORAGE_TYPE.LOCAL,
                    cachePolicy: tmp[i].cachePolicy
                });
            }

            ajs.dbg.log(dbg.LogType.Info, 0, "ajs.resources", this,
                "Number of previously managed resources [local storage]: " + tmp.length);

            // get managed resources for the session storage
            tmp = this._storageSession.resources;
            for (let i: number = 0; i < tmp.length; i++) {
                managedResources.push({
                    url: tmp[i].url,
                    storageType: STORAGE_TYPE.SESSION,
                    cachePolicy: tmp[i].cachePolicy
                });
            }

            ajs.dbg.log(dbg.LogType.Info, 0, "ajs.resources", this,
                "Number of previously managed resources [session storage]: " + tmp.length);


            // there are no managed resources stored in memory storage for sure as open/reload occured

            ajs.dbg.log(dbg.LogType.Info, 0, "ajs.resources", this,
                "Number of previously managed resources [memory storage]: 0");

            ajs.dbg.log(dbg.LogType.Exit, 0, "ajs.resources", this);

            return managedResources;
        }

        /**
         * Registers managed resources without preloading them (resources will be loaded/cached with first getResource)
         * <p>
         * Managed resource is uniquely identified by the URL, storage type and the caching policy. This means it can happen
         * the same resource (with the same url) will be placed in three different storage (memory, session, local). It up
         * to application developer to make sure the resource is available just in storages where it should be and don't
         * consumes the other storages if not necessary.
         * </p>
         * <p>
         * registerManagedResource should be used instead of getMultipleResources for all resources with the LRU policy.
         * This is because during the loadMultiple the "clean cache" mechanism can be executed when LRU resources will
         * not fit the maximum cache size so earlier resources loaded will be flushed and replaced with latest loaded. If
         * the resource is just registered it will be loaded (if it is not cached) at the time when getResource is called
         * so in the worst case the "clean cache" will be executed just to make a space for the resource required.
         * </p>
         * <p>
         * On other hand, if resources are required to be accessible offline developer have to make sure resources
         * will fit the cache. In this case resources shall be loaded instead of registered and also shall be using the
         * PERMANENT cache policy.
         * </p>
         */
        public registerManagedResources(managedResources: IManagedResource[]): void {

            ajs.dbg.log(dbg.LogType.Enter, 0, "ajs.resources", this);

            ajs.dbg.log(dbg.LogType.Info, 0, "ajs.resources", this,
                "Restering managed resources (" + managedResources.length + ")", managedResources);

            // go through all managed resources to be registered
            for (let i: number = 0; i < managedResources.length; i++) {

                // check if it is registered
                let managedResource: IManagedResource =
                    this._getManagedResourceInfo(managedResources[i].url, managedResources[i].storageType);

                // regisret it if not
                if (managedResource === null) {

                    ajs.dbg.log(dbg.LogType.Info, 0, "ajs.resources", this,
                        "Registering a managed resource: " +
                        managedResources[i].url +
                        " [" + STORAGE_TYPE[managedResources[i].storageType] +
                        ":" + CACHE_POLICY[managedResources[i].cachePolicy] +
                        "]");

                    this.managedResources.push({
                        url: managedResources[i].url,
                        storageType: managedResources[i].storageType,
                        cachePolicy: managedResources[i].cachePolicy
                    });

                } else {
                    ajs.dbg.log(dbg.LogType.Info, 0, "ajs.resources", this,
                        "Resource is managed already: " + managedResource.url +
                        " [" + STORAGE_TYPE[managedResource.storageType] +
                        ":" + CACHE_POLICY[managedResource.cachePolicy] +
                        "]");
                }

            }

            ajs.dbg.log(dbg.LogType.Exit, 0, "ajs.resources", this);
        }

        /**
         * Returns a cached resource if the resource is available in specified storage
         * @param url Url of the cached resource
         * @param storageType type of the storage to be used for lookup
         */
        public getCachedResource(url: string, storageType: STORAGE_TYPE): ICachedResource {

            ajs.dbg.log(dbg.LogType.Enter, 0, "ajs.resources", this);

            ajs.dbg.log(dbg.LogType.Info, 0, "ajs.resources", this,
                "Getting cached resource '" + url + "', Storage: " + STORAGE_TYPE[storageType]);

            let storage: AjsStorage = this._getStorageFromType(storageType);

            if (storage !== null) {
                ajs.dbg.log(dbg.LogType.Exit, 0, "ajs.resources", this);
                return storage.getResource(url);
            } else {
                ajs.dbg.log(dbg.LogType.Error, 0, "ajs.resources", this, "Invalid storage type");
                throw new InvalidStorageTypeException();
            }
        }

        /**
         * Creates or updates existing cached resource
         * Automatically creates a managed resource if the managed resource does not not exist
         * @param url Url of the cached resource
         * @param data Data to be stored or updated
         * @param storageType type of the storage to be used
         * @param cachePolicy cache policy to be used for new resources
         */
        public setCachedResource(url: string, data: any, storageType: STORAGE_TYPE, cachePolicy: CACHE_POLICY): void {

            ajs.dbg.log(dbg.LogType.Enter, 0, "ajs.resources", this);

            ajs.dbg.log(dbg.LogType.Info, 0, "ajs.resources", this,
                "Setting / Updating the cached resource " + url + " " + STORAGE_TYPE[storageType] + " " + CACHE_POLICY[cachePolicy]);

            let storage: AjsStorage = this._getStorageFromType(storageType);
            if (storage !== null) {

                // register managed resource
                this.registerManagedResources([{
                    url: url,
                    storageType: storageType,
                    cachePolicy: cachePolicy
                }]);

                // store / update cached resource
                let resource: ICachedResource = {
                    url: url,
                    data: data,
                    cachePolicy: cachePolicy,
                    lastModified: new Date()
                };

                storage.updateResource(resource);

            } else {
                ajs.dbg.log(dbg.LogType.Error, 0, "ajs.resources", this, "Invalid storage type");
                throw new InvalidStorageTypeException();
            }

            ajs.dbg.log(dbg.LogType.Exit, 0, "ajs.resources", this);

        }

        /**
         * Removes existing cached resource
         * @param resource Resource to be created or updated
         * @param storageType Type of the storage to be used
         */
        public removeCachedResource(url: string, storageType: STORAGE_TYPE): void {

            ajs.dbg.log(dbg.LogType.Enter, 0, "ajs.resources", this);

            ajs.dbg.log(dbg.LogType.Info, 0, "ajs.resources", this,
                "Removing the cached resource " + url + " " + STORAGE_TYPE[storageType]);

            let storage: AjsStorage = this._getStorageFromType(storageType);
            if (storage !== null) {

                // remove the managed resource
                for (let i: number = 0; i < this._managedResources.length; i++) {
                    if (this._managedResources[i].url === url && this._managedResources[i].storageType === storageType) {
                        this.managedResources.splice(i, 1);
                        break;
                    }
                }

                // remove the resource from the storage
                storage.removeResource(url);

            } else {
                ajs.dbg.log(dbg.LogType.Error, 0, "ajs.resources", this, "Invalid storage type");
                throw new InvalidStorageTypeException();
            }

            ajs.dbg.log(dbg.LogType.Exit, 0, "ajs.resources", this);
        }

        /**
         * Removes all cached resources
         */
        public cleanCaches(): void {
            this._storageLocal.clear();
            this._storageSession.clear();
            this._storageMemory.clear();
            this._managedResources = [];
        }

        /**
         * Returns a resource from cache or from the server and updates the cache
         * <p>
         * If preference is set to CACHE and the resource is cached the promise is resolved immediately.
         * If the resource is not supposed to be local only (its URL prefix is #see {LOCAL_ONLY_PREFIX}) it
         * is checked if resource was updated on the server then the cache is synchronized. There are no
         * further notifications to the application the resource and the cache was updated so it is possible
         * the resource currently in use is one request older than the resource on the server and in the cache.
         * </p>
         * <p>
         * If the preference is server the standard load procedure is done.
         * </p>
         * @param url Url of the resource to be returned
         * @param storageType Resource storage type (if not specified the resource will be loaded from the server without caching)
         * @param cachePolicy Resource cache policy (if not specified the resource will be loaded from the server without caching)
         * @param loadingPreference Resource loading preference
         * @param runScript Specifies if the script resource should be started
         */
        public getResource(
            url: string,
            storageType: STORAGE_TYPE,
            cachePolicy?: CACHE_POLICY,
            loadingPreference?: LOADING_PREFERENCE,
            runScript?: boolean): Promise<IResource> {

            ajs.dbg.log(dbg.LogType.Enter, 0, "ajs.resources", this);

            // set default preference if not set by caller
            if (loadingPreference === undefined) {
                loadingPreference = LOADING_PREFERENCE.CACHE;
            }

            ajs.dbg.log(dbg.LogType.Info, 0, "ajs.resources", this,
                "Getting a resource '" + url + "', Loading preference: " + LOADING_PREFERENCE[loadingPreference]);

            // determine if the resource is local only or from the server
            let localResource: boolean = url.substring(0, LOCAL_ONLY_PREFIX.length) === LOCAL_ONLY_PREFIX;

            // try to get the managed resource descriptor from the URL
            let managedResource: IManagedResource;

            if (storageType !== undefined) {
                managedResource = this._getManagedResourceInfo(url, storageType);
            } else {
                managedResource = null;
            }

            // prepare resource promise
            let resourcePromise: Promise<IResource> = new Promise<IResource>(

                (resolve: (resource: IResource) => void) => {

                    // update initial progress bar
                    if (ajs.ui.progressBar) {
                        ajs.dbg.log(dbg.LogType.Info, 0, "ajs.resources", this,
                            "Updating initial progress bar with resource to be loaded: '" + url + "'");
                        ajs.ui.progressBar.resourceLoading(url);
                    }

                    // let browser do its stuff like a UI updates
                    setTimeout(
                        async () => {

                        // get cached resource if the resource is local or the preference is cache
                        // (and resource was previously added to managed resources). If it will not be found in the cache, try to
                        // load it from the server
                        if (managedResource !== null && (loadingPreference === LOADING_PREFERENCE.CACHE || localResource)) {

                            // get storage instance from the storage type
                            let storage: AjsStorage = this._getStorageFromType(managedResource.storageType);

                            // this should never fail as it is managed resource, but just to be sure
                            if (storage !== null) {
                                // get cached resource
                                let cachedResource: ICachedResource = storage.getResource(url);

                                // and if it was found, return it to caller
                                if (cachedResource !== null) {

                                    ajs.dbg.log(dbg.LogType.Info, 0, "ajs.resources", this,
                                        "Cached resource found: " + cachedResource.url);

                                    // update initial progress bar
                                    ajs.dbg.log(dbg.LogType.Info, 0, "ajs.resources", this,
                                        "Updating initial progress bar with resource finished loading '" + url + "'");

                                    if (ajs.ui.progressBar) {
                                        ajs.ui.progressBar.resourceLoaded(url);
                                    }

                                    let resource: IResource = {
                                        url: url,
                                        type: this._getResourceTypeFromURL(url),
                                        data: cachedResource.data,
                                        cached: true,
                                        storage: storage,
                                        cachePolicy: cachedResource.cachePolicy,
                                        lastModified: cachedResource.lastModified
                                    };

                                    // again, let browser do its stuff (like ui update)
                                    setTimeout(() => {

                                        resolve(resource);

                                    }, WAIT);

                                    ajs.dbg.log(dbg.LogType.Info, 0, "ajs.resources", this,
                                        "Updating cached resource '" + url + "'");

                                    // try to update the resource from the server -> promise can be thrown out
                                    this._load(url, managedResource.storageType, managedResource.cachePolicy, runScript, false);

                                    ajs.dbg.log(dbg.LogType.Exit, 0, "ajs.resources", this);
                                } else {
                                    // if its a local resource, ready with null as it was not found in cache
                                    if (localResource) {

                                        ajs.dbg.log(dbg.LogType.Warning, 0, "ajs.resources", this,
                                            "Local resource requested but not exists in cache");

                                        resourcePromise = new Promise<IResource>(
                                            (resolve: (resource: IResource) => void, reject: (reason?: any) => void) => {
                                                reject(new LocalResourceRequestedDoesNotExistException(url));
                                            }
                                        );

                                    } else {

                                        // otherwise try to load it from the server
                                        ajs.dbg.log(dbg.LogType.Info, 0, "ajs.resources", this,
                                            "Resource not cached, trying to load it from server");

                                        resourcePromise = this._load(url, storageType, cachePolicy, runScript, true);
                                    }
                                }

                                // this should never occur on managed resources
                            } else {
                                ajs.dbg.log(dbg.LogType.Error, 0, "ajs.resources", this,
                                    "Invalid storage type");

                                resourcePromise = new Promise<IResource>(
                                    (resolve: (resource: IResource) => void, reject: (reason?: any) => void) => {
                                        reject(new InvalidStorageTypeException(url));
                                    }
                                );
                            }

                        } else {
                            if (localResource) {

                                ajs.dbg.log(dbg.LogType.Warning, 0, "ajs.resources", this,
                                    "Local resource requested but not exists in cache");

                                resourcePromise = new Promise<IResource>(
                                    (resolve: (resource: IResource) => void, reject: (reason?: any) => void) => {
                                        reject(new LocalResourceRequestedDoesNotExistException(url));
                                    }
                                );

                            }

                            // otherwise try to load it from the server
                            ajs.dbg.log(dbg.LogType.Info, 0, "ajs.resources", this,
                                "Resource not managed, trying to load it from server");

                            // if storage type or caching policy was not added don't create managed resource
                            // just load it from server if possible
                            if (storageType === undefined || cachePolicy === undefined) {
                                storageType = STORAGE_TYPE.NONE;
                                cachePolicy = CACHE_POLICY.NONE;
                            }

                            let rp: Promise<IResource> = this._load(url, storageType, cachePolicy, runScript, true);

                            // previously, the load promise was returned immediately but now we wait for browser to do its stuff
                            try {
                                let resource: IResource = await rp;
                                resolve(resource);
                            } catch (e) {
                                throw new Error(e);
                            }

                        }

                    }, WAIT);

            });


            ajs.dbg.log(dbg.LogType.Exit, 0, "ajs.resources", this);

            return resourcePromise;
        }

        /**
         * Returns multiple resources from a cache or from the server and updates the cache
         * <p>
         * Waits until all resources are available before resolving the promise.
         * If the resource is not supposed to be local only (its URL prefix is #see {LOCAL_ONLY_PREFIX}) it
         * is checked if resource was updated on the server then the cache is synchronized. There are no
         * further notifications to the application the resource and the cache was updated so it is possible
         * the resource currently in use is one request older than the resource on the server and in the cache.
         * </p>
         * <p>
         * If the preference is server the standard load procedure is done.
         * </p>
         * @param urls Urls of the resources to be returned
         * @param storageType Resource storage type (if not specified resources will be loaded from the server without caching)
         * @param cachePolicy Resource cache policy (if not specified resources will be loaded from the server without caching)
         * @param loadingPreference Resources loading preference
         * @param runScript Specifies if the script resources should be evaluated
         */
        public getMultipleResources(
            urls: string[],
            storageType: STORAGE_TYPE,
            cachePolicy?: CACHE_POLICY,
            loadingPreference?: LOADING_PREFERENCE,
            runScripts?: boolean): Promise<IResource[]> {

            ajs.dbg.log(dbg.LogType.Enter, 0, "ajs.resources", this);

            // don't process anything else than array of urls
            if (!(urls instanceof Array)) {
                urls = [];
            }

            // by default is loading preference CACHE
            if (loadingPreference === undefined) {
                loadingPreference = LOADING_PREFERENCE.CACHE;
            }

            // by default run loaded scripts
            if (runScripts === undefined) {
                runScripts = true;
            }

            ajs.dbg.log(dbg.LogType.Info, 0, "ajs.resources", this,
                "Getting multiple resources (" + urls.length + "), Storage: " + STORAGE_TYPE[storageType] +
                ", Cache Policy: " + CACHE_POLICY[cachePolicy], urls);

            let resourcesPromise: Promise<IResource[]> = new Promise(

                // get resources
                async (resolve: (resources: IResource[]) => void, reject: (reason?: any) => void) => {

                    let gettedResources: IResource[];
                    let resources: Promise<IResource>[] = [];

                    // push "load" promises to the resources array
                    for (let i: number = 0; i < urls.length; i++) {
                        resources.push(this.getResource(urls[i], storageType, cachePolicy, loadingPreference, false));
                    }

                    try {
                        // hopefully getted resources are in the same order they were passed in
                        gettedResources = await Promise.all(resources);

                        // run scripts
                        if (runScripts) {
                            for (let i: number = 0; i < gettedResources.length; i++) {

                                if (gettedResources[i].type === RESOURCE_TYPE.SCRIPT) {
                                    ajs.dbg.log(dbg.LogType.Info, 0, "ajs.resources", this,
                                        "Executing the getted script (load multiple): " + gettedResources[i].url);

                                    // use eval or insert the script tag to the code
                                    if (USE_EVAL) {
                                        this._evalScript(gettedResources[i]);
                                    } else {
                                        this._addScriptTag(gettedResources[i]);
                                    }
                                }
                            }
                        }

                    } catch (e) {
                        reject(e);
                    }

                    setTimeout(() => {
                        resolve(gettedResources);
                    }, WAIT);

                }
            );

            ajs.dbg.log(dbg.LogType.Exit, 0, "ajs.resources", this);

            return resourcesPromise;

        }

        /**
         * Load resource from server or cache
         * <p>
         *  If the "mode" is offline or resource was not modified since the last download the cached resource is returned
         * </p>
         * <p>
         * <ul>
         *    If caching of the resource is required the resource is created or updated in the cache of given type
         *    <li>GET method is used to load resources</li>
         *    <li>If the resource is type of SCRIPT it is (by default) evaulated automatically and immediately on load.
         *       <ul>
         *          <li>Scripts can be evaluated using the eval method or by adding the script tag to the main document</li>
         *          <li>This is drivent by the USE_EVAL constant and should not be changed in runtime</li>
         *          <li>EVAL should be used only for debugging purposes as the visual studio and IE can't handle source maps
         *              when the &lt;script&gt; tag is added</li>
         *       </ul>
         *    </li>
         *    <li>If the resource is type of STYLE it is automatically registered to the style manager</li>
         *    <li>Other types of resources are not evaluated automatically and are just returned / cached</li>
         * </ul>
         * </p>
         * @param url Url of the resource to be loaded
         * @param storageType Type of storage to be used to cache the resource.
         *                    If the storage is not specified the direct download will be used
         * @param cachePolicy If the storage is specified the cache policy will set the cache behavior
         * @param runScript Specifies if the script resource should be evaluated automatically
         * @param updateProgressBar Specified if UI progressbar should be updated
         */
        protected _load(
            url: string,
            storageType: STORAGE_TYPE,
            cachePolicy: CACHE_POLICY,
            runScript?: boolean,
            updateProgressBar?: boolean
        ): Promise<IResource> {

            ajs.dbg.log(dbg.LogType.Enter, 0, "ajs.resources", this);

            if (runScript === undefined) {
                runScript = true;
            }

            let resourcePromise: Promise<IResource> = new Promise<IResource>(

                // promise code
                async (resolve: (resource: IResource) => void, reject: (reason: any) => void) => {

                    ajs.dbg.log(dbg.LogType.Info, 0, "ajs.resources", this,
                        "Loading resource: '" + url +
                        "', Storage: " + STORAGE_TYPE[storageType] +
                        ", Cache Policy: " + CACHE_POLICY[cachePolicy]);

                    // get the storage
                    let storage: AjsStorage = this._getStorageFromType(storageType);

                    // basic checks and parameters update
                    if (storage !== null) {
                        if (!storage.supported) {
                            ajs.dbg.log(dbg.LogType.Error, 0, "ajs.resources", this, "Storage type not supported");
                            reject(new StorageTypeNotSupportedException());
                        }

                        if (cachePolicy === undefined || cachePolicy === CACHE_POLICY.NONE) {
                            ajs.dbg.log(dbg.LogType.Error, 0, "ajs.resources", this, "Cache policy not set");
                            reject(new CachePolicyMustBeSetException());
                        }
                    } else {
                        ajs.dbg.log(dbg.LogType.Info, 0, "ajs.resources", this, "Fallback to CACHE_POLICY.NONE");
                        cachePolicy = CACHE_POLICY.NONE;
                    }

                    // if resource is managed, try to load it from cache first - this info is need to send info about
                    // when it was cached to the server
                    let resource: IResource = null;

                    let managedResource: IManagedResource = this._getManagedResourceInfo(url, storageType);

                    if (managedResource !== null) {

                        let cachedResource: ICachedResource = this.getCachedResource(url, managedResource.storageType);

                        if (cachedResource !== null) {
                            resource = {
                                url: url,
                                type: this._getResourceTypeFromURL(url),
                                data: cachedResource.data,
                                cached: true,
                                storage: this._getStorageFromType(managedResource.storageType),
                                cachePolicy: managedResource.cachePolicy,
                                lastModified: cachedResource.lastModified
                            };
                        }

                    // otherwise add resource to list of managed resources
                    } else {

                        if (storage !== null && cachePolicy !== CACHE_POLICY.NONE) {
                            this._managedResources.push({
                                url: url,
                                storageType: storageType,
                                cachePolicy: cachePolicy
                            });
                        }

                    }

                    // setup resource info anyway, even if the resource was not in cache or its not a managed resource
                    if (resource === null) {

                        ajs.dbg.log(dbg.LogType.Info, 0, "ajs.resources", this, "Resource not cached");

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

                    // load and process the resource
                    try {

                        let response: IResourceResponseData = await this._resourceLoader.loadResource(
                            url,
                            resource.type === RESOURCE_TYPE.BINARY,
                            resource.lastModified);

                        resource = this._processResourceResponse(resource, response, runScript);

                    // resource was not loaded neither cached so exception with httpStatus was thrown
                    } catch (e) {
                        reject(e);
                    }

                    if (updateProgressBar) {
                        // update initial progress bar
                        ajs.dbg.log(dbg.LogType.Info, 0, "ajs.resources", this,
                            "Updating initial progress bar with resource finished loading '" + resource.url + "'");

                        if (ajs.ui.progressBar) {
                            ajs.ui.progressBar.resourceLoaded(resource.url);
                        }
                    }

                    setTimeout(() => {
                        resolve(resource);
                    }, WAIT);

                }
            );

            ajs.dbg.log(dbg.LogType.Exit, 0, "ajs.resources", this);

            return resourcePromise;

        }

        /**
         * DEPRECATED! Loads multiple resources from the server or the same storage type using the same caching policy
         * <p>
         * If resource is loaded from the server the cache is updated with this updated resource
         * </p?
         * @param url Array of resource URL's to be loaded
         * @param storageType Type of storage to be used to cache resources.
         *                    If the storage is not specified the direct download will be used
         * @param cachePolicy If the storage is specified the cache policy will set the cache behavior for all resources loading
         * @param runScripts Should be script resources evaluated on download? Default = true
         */
        protected _loadMultiple_DEPRECATED(
            urls: string[],
            storageType: STORAGE_TYPE,
            cachePolicy: CACHE_POLICY,
            runScripts?: boolean): Promise<IResource[]> {

            ajs.dbg.log(dbg.LogType.Enter, 0, "ajs.resources", this);

            // don't process anything else than array of urls
            if (!(urls instanceof Array)) {
                urls = [];
            }

            // by default run loaded scripts
            if (runScripts === undefined) {
                runScripts = true;
            }

            ajs.dbg.log(dbg.LogType.Info, 0, "ajs.resources", this,
                "Loading resources (" + urls.length + "), Storage: " + STORAGE_TYPE[storageType] +
                ", Cache Policy: " + CACHE_POLICY[cachePolicy], urls);

            let resourcesPromise: Promise<IResource[]> = new Promise(

                // load resources
                async (resolve: (resources: IResource[]) => void, reject: (reason?: any) => void) => {

                    let loadedResources: IResource[];
                    let resources: Promise<IResource>[] = [];

                    // push "load" promises to the resources array
                    for (let i: number = 0; i < urls.length; i++) {
                        resources.push(this._load(urls[i], storageType, cachePolicy, false));
                    }

                    try {
                        // hopefully loaded resources are in the same order they were passed in
                        loadedResources = await Promise.all(resources);

                        // run scripts
                        if (runScripts) {
                            for (let i: number = 0; i < loadedResources.length; i++) {

                                if (loadedResources[i].type === RESOURCE_TYPE.SCRIPT) {
                                    ajs.dbg.log(dbg.LogType.Info, 0, "ajs.resources", this,
                                        "Executing the loaded script (load multiple): " + loadedResources[i].url);

                                    // use eval or insert the script tag to the code
                                    if (USE_EVAL) {
                                        this._evalScript(loadedResources[i]);
                                    } else {
                                        this._addScriptTag(loadedResources[i]);
                                    }
                                }
                            }
                        }

                    } catch (e) {
                        reject(e);
                    }

                    resolve(loadedResources);

                }
            );

            ajs.dbg.log(dbg.LogType.Exit, 0, "ajs.resources", this);
            return resourcesPromise;

        }

        /**
         * Called internally when loading of single resource ends and resource need to be processed
         * <p>If not explicitly specified, SCRIPT resources are automatically evaluated</p>
         * @param resource Cached or empty resource prepared in the load method
         * @param response Information about the resource loaded passed from the resource loader
         */
        protected _processResourceResponse(resource: IResource, response: IResourceResponseData, runScript?: boolean): IResource {

            ajs.dbg.log(dbg.LogType.Enter, 0, "ajs.resources", this);

            ajs.dbg.log(dbg.LogType.Info, 0, "ajs.resources", this, "Processing loaded resource '" + resource.url + "'");

            let loaded: boolean;

            if (runScript === undefined) {
                runScript = true;
            }

            // loaded successfully, update resource and also cache if necessary
            if (response.httpStatus === 200) {

                // based on the resource type, get the data
                switch (resource.type) {
                    case RESOURCE_TYPE.BINARY:
                        ajs.dbg.log(dbg.LogType.Info, 0, "ajs.resources", this, "Binary file loaded");
                        resource.data = new Uint8Array(response.data);
                        break;
                    default:
                        ajs.dbg.log(dbg.LogType.Info, 0, "ajs.resources", this, "Text file loaded");
                        resource.data = response.data;
                }

                // update cached resource
                if (resource.storage !== null) {

                    ajs.dbg.log(dbg.LogType.Info, 0, "ajs.resources", this,
                        "Loaded resource is requested to be cached. Caching/Updating." + resource.url);

                    let cachedResource: ICachedResource = {
                        url: resource.url,
                        data: resource.data,
                        cachePolicy: resource.cachePolicy,
                        lastModified: new Date()
                    };

                    resource.storage.updateResource(cachedResource);
                    resource.cached = true;

                }

                loaded = true;

            } else {
                // not modified / failed (the resource loaded from cache is already set in the resource parameter)
                if (resource.cached) {
                    ajs.dbg.log(dbg.LogType.Info, 0, "ajs.resources", this, "Not modified, using cached resource" + resource.url);
                    loaded = true;
                } else {
                    ajs.dbg.log(dbg.LogType.Warning, 0, "ajs.resources", this,
                        "Resource failed to load and is not cached " + resource.url);
                    loaded = false;
                }
            }

            // if the resource was not loaded neither cached, exception
            if (!loaded) {
                throw new ResourceFailedToLoadException(response.httpStatus.toString());
            }

            // if the resource is script and should be executed, do it
            if (resource.type === RESOURCE_TYPE.SCRIPT && runScript) {

                ajs.dbg.log(dbg.LogType.Info, 0, "ajs.resources", this, "Executing the loaded script");

                // use eval or insert the script tag to the code
                if (USE_EVAL) {
                    this._evalScript(resource);
                } else {
                    this._addScriptTag(resource);
                }
            }

            ajs.dbg.log(dbg.LogType.Exit, 0, "ajs.resources", this);

            return resource;
        }

        /**
         * Returns managed resource info if the resource is managed by the resource manager
         * <p>
         * As managed resource is uniquely identified by URL, storage and cache policy, all three parameters must match
         * in order to be possible to locate the managed resource.
         * </p>
         * @param url Url of the resource to be checked and #see {ajs.resources.IManagedResource} info to be returned for
         * @param storageType Storage type of the resource to be checked and #see {ajs.resources.IManagedResource} info to be returned for
         */
        protected _getManagedResourceInfo(url: string, storageType: STORAGE_TYPE): IManagedResource {

            ajs.dbg.log(dbg.LogType.Enter, 0, "ajs.resources", this);

            ajs.dbg.log(dbg.LogType.Enter, 0, "ajs.resources", this,
                "Looking for managed resource '" + url + "'");

            for (let i: number = 0; i < this._managedResources.length; i++) {

                if (this._managedResources[i].url === url &&
                    this._managedResources[i].storageType === storageType) {

                    ajs.dbg.log(dbg.LogType.Exit, 0, "ajs.resources", this);

                    return this._managedResources[i];
                }

            }

            ajs.dbg.log(dbg.LogType.Exit, 0, "ajs.resources", this);

            return null;
        }

        /**
         * Returns the storage instance from the storage type
         * @param storageType
         */
        protected _getStorageFromType(storageType: STORAGE_TYPE): AjsStorage {

            ajs.dbg.log(dbg.LogType.Enter, 0, "ajs.resources", this);

            switch (storageType) {
                case STORAGE_TYPE.LOCAL:
                    ajs.dbg.log(dbg.LogType.Exit, 0, "ajs.resources", this);
                    return this._storageLocal;

                case STORAGE_TYPE.SESSION:
                    ajs.dbg.log(dbg.LogType.Exit, 0, "ajs.resources", this);
                    return this._storageSession;

                case STORAGE_TYPE.MEMORY:
                    ajs.dbg.log(dbg.LogType.Exit, 0, "ajs.resources", this);
                    return this._storageMemory;

                default:
                    ajs.dbg.log(dbg.LogType.Exit, 0, "ajs.resources", this);
                    return null;

            }
        }

        /**
         * Returns the resource type from the resource file extension
         * @param url
         */
        protected _getResourceTypeFromURL(url: string): RESOURCE_TYPE {

            ajs.dbg.log(dbg.LogType.Enter, 0, "ajs.resources", this);

            let ext: string = url.substring(url.lastIndexOf("."));
            if (RESOURCE_TYPES.script.indexOf(ext) >= 0) { return RESOURCE_TYPE.SCRIPT; }
            if (RESOURCE_TYPES.style.indexOf(ext) >= 0) { return RESOURCE_TYPE.STYLE; }
            if (RESOURCE_TYPES.text.indexOf(ext) >= 0) { return RESOURCE_TYPE.TEXT; }
            if (RESOURCE_TYPES.binary.indexOf(ext) >= 0) { return RESOURCE_TYPE.BINARY; }

            ajs.dbg.log(dbg.LogType.Exit, 0, "ajs.resources", this);

            return RESOURCE_TYPE.UNKNOWN;
        }

        /**
         * Evaluates the script resource - should be used only during debugging as IE / Visual Studio does not
         * work with source maps in the dynamically added <script> tag when debugging
         * @param resource Script resource to be evaluated
         */
        protected _evalScript(resource: IResource): void {

            ajs.dbg.log(dbg.LogType.Enter, 0, "ajs.resources", this);

            ajs.dbg.log(dbg.LogType.Info, 0, "ajs.resources", this,
                "Evaluating sript resource", resource);

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

            ajs.dbg.log(dbg.LogType.Exit, 0, "ajs.resources", this);

        }

        /**
         * Creates the script tag and adds the resource data to it (script is then executed automatically)
         * @param resource Script resource to be evaluated
         */
        protected _addScriptTag(resource: IResource): void {

            ajs.dbg.log(dbg.LogType.Enter, 0, "ajs.resources", this);

            ajs.dbg.log(dbg.LogType.Info, 0, "ajs.resources", this,
                "Adding a script resource to the HEAD as a tag", resource);

            // first check if the script was not added already
            let nodeList: NodeList = document.head.getElementsByTagName("script");
            for (let i: number = 0; i < nodeList.length; i++) {
                if ((nodeList.item(i) as HTMLScriptElement).id === resource.url) {
                    ajs.dbg.log(dbg.LogType.Exit, 0, "ajs.resources", this);
                    return;
                }
            }

            // add script and its content
            let script: HTMLScriptElement = document.createElement("script");
            script.id = resource.url;
            script.type = "text/javascript";
            script.innerText = resource.data;
            document.head.appendChild(script);

            ajs.dbg.log(dbg.LogType.Exit, 0, "ajs.resources", this);
        }

    }


}