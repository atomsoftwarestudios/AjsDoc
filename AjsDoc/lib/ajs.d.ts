/*! ************************************************************************
The MIT License (MIT)
Copyright (c)2016 Atom Software Studios. All rights reserved.

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
/**
 * The main AJS namespace
 */
declare namespace ajs {
}
declare namespace ajs {
    /** Thrown when the start is called before the application is configured */
    class ApplicationNotConfiguredException {
    }
    /** Thrown the passed application constructor is not a function */
    class AppConstructorMustBeAFunctionException {
    }
}
declare namespace ajs {
    /**
     * Ajs framework static class provides the complete framework functionality.
     * Initialization is called automatically from the ajs boot when the
     * window.onload event is fired. The framework, based on the boot configuration
     * file initializes the user application class inherited from the ajs.app.Application
     * and starts it.
     */
    class Framework {
        /** Contains last error caused by the framework components
         *  TODO: Think about the global / application error handler
         */
        protected static _lastError: Error;
        /** Returns the last error caused by the framework component
         *  TODO: Think about the global / application error handler
         */
        /**
         * Should be used internally by framework components only to set the error value
         * TODO: Think about the global / application error handler
         * TODO: Error handling should be done just by triggering and catching exceptions
         */
        static lastError: Error;
        /** Stores the framework configuration loaded during the index.html load */
        protected static _config: ajs.IAJSConfig;
        /** Returns the framework configuration object */
        static readonly config: ajs.IAJSConfig;
        /** Stores the application configuration */
        protected static _appConfig: ajs.app.IApplicationConfig;
        /** Returns the application configuration */
        static readonly appConfig: ajs.app.IApplicationConfig;
        /** Stores the application object automatically instantiated from the constructor passed in the configuration */
        protected static _application: ajs.app.Application;
        /** Returns the application object */
        static readonly application: ajs.app.Application;
        /** Stores the ResourceManager object instantiated automatically during the framework intitialization */
        protected static _resourceManager: ajs.resources.ResourceManager;
        /** Returns the ResourceManager object */
        static readonly resourceManager: ajs.resources.ResourceManager;
        /** Stores the ResourceManager object instantiated automatically during the framework intitialization */
        protected static _router: ajs.routing.Router;
        /** Returns the ResourceManager object */
        static readonly router: ajs.routing.Router;
        /** Stores the Navigator object instantiated automatically during the framework intitialization */
        protected static _navigator: ajs.navigation.Navigator;
        /** Returns the Navigator object */
        static readonly navigator: ajs.navigation.Navigator;
        /** Stores the ViewComponentManager object instantiated automatically during the framework intitialization */
        protected static _viewComponentManager: ajs.mvvm.viewmodel.ViewComponentManager;
        /** Returns the ViewComponentManager object */
        static readonly viewComponentManager: ajs.mvvm.viewmodel.ViewComponentManager;
        /** Stores the TemplateManager object instantiated automatically during the framework intitialization */
        protected static _templateManager: ajs.templating.TemplateManager;
        /** Returns the TemplateManager object */
        static readonly templateManager: ajs.templating.TemplateManager;
        /** Stores the View object instantiated automatically during the framework intitialization */
        protected static _view: ajs.mvvm.View;
        /** Returns the View object */
        static readonly view: ajs.mvvm.View;
        /** Basic framework initialization is called automatically from the boot when window.onload event occurs */
        static initialize(config: IAJSConfig): void;
        /**
         * Configure the ajs application before it is instanced
         * Called automatically from boot when window.onload event occurs
         * @param config Application configuration file
         */
        static configureApplication(config: ajs.app.IApplicationConfig): void;
        /**
         * Instantiate and initialize the user application and start it.
         * Called automatically from boot when window.onload event occurs
         * @throws ApplicationNotConfiguredException Thrown when the start is called before the application is configured
         * @throws AppConstructorMustBeAFunctionException Thrown when the passed application constructor is not a function
         */
        static start(): void;
        /**
         * TODO: Think about the global / application error handler
         * @param msg
         * @param url
         * @param line
         * @param col
         * @param error
         */
        protected static _errorHandler(msg: string | Error, url: string, line: number, col: number, error: Error): void;
    }
}
declare namespace ajs {
    /** Represents the AJS configuration object
     *  TODO: Review necessary options
     */
    interface IAJSConfig {
        /** TODO: Remove? : Specifies if the debugging of the framework is switched on */
        debug?: boolean;
        /** TODO: Remove? : Specifies if errors occured should be logged to the console */
        logErrors?: boolean;
        /** TODO: Remove? : Specifies if errors occured should be shown in the ajs error page to end users */
        showErrors?: boolean;
        /** Configuration of resource pools */
        resourceManagerConfig?: ajs.resources.IResourceManagerConfig;
    }
}
/**
 * Contains base classes for the AJS Application, application configuration and exceptions.
 * <p>The Application class has to be derived by the user code to initialize the
 * application, load necessary resources and setup routes.</p>
 * <p>The derived application class is construced and initialized during the
 * framework boot process. The boot manager calls the framework to instantiate,
 * configure and initialize the application.</p>
 * <p>As the application initialization can be an asynchronous process (resources
 * could be loading and additional user tasks can be done during the initialization)
 * so it is necessary to call the _initDone method once the initialization is completed.</p>
 * <h5>Application Initialization Example</h5>
 * #example app_init
 *
 */
declare namespace ajs.app {
    /**
     * this is signature 1
     * @param test
     */
    function test(test: string): string;
    /**
     * this is signature 2
     * @param test
     */
    function test(test: number): number;
    /**
     * this is signature 3
     * @param test
     */
    function test(test: number): Date;
    /**
     * this is test1 signature
     * @param x rrr
     */
    function test1(x?: string | number | Object): any;
}
declare namespace ajs.app {
    /**
     * The application class should be derived by the user application class in order
     * to perform basic application tasks such as application initialization, application
     * resource loading, routes setup, application state loading and so on
     */
    class Application {
        /** Stores the configuration passed to the application from the boot config */
        protected _applicationConfig: IApplicationConfig;
        /** Returns the application configuration */
        readonly applicationConfig: IApplicationConfig;
        /** Indicates if the application was succesfully initialized.
         *  _initDone should be called when the user application initialization routines finishes
         */
        protected _initialized: boolean;
        /** Returns the application initialization status */
        readonly initialized: boolean;
        /**
         * Constructs the application object, stores the configuration to it and add event listener
         * for beforeunload window event. The _finalize method is called when the navigation is
         * going out of the page
         * @param config Application configuration. TODO: Not in use now. It can be used by the user application
         */
        constructor(config: IApplicationConfig);
        /**
         * MUST BE OVERRIDEN IN THE INHERITED APPLICATION CLASS
         * Called from the framework during as a last step of the initialization procedure
         * Must be overriden by the children class to initialize the user application. The
         * overriden method (or async methods called in the chain) must make sure the
         * this._initDone() method is called in order to run the application
         */
        initialize(): void;
        /**
         * Must be called by inherited class super.initDone(); at the end of initialization
         * of the user application in order the application will get started
         */
        protected _initDone(): void;
        /**
         * Starts the application by navigating to the page specified in the url adress bar of the browser
         * @throws NotInitializedException Thrown when _run is called but the application was not
         *                                 initialized by calling the _initDone method
         */
        protected _run(): void;
        /**
         * MUST BE OVERRIDEN IN THE INHERITED APPLICATION CLASS
         * Called on window.beforeunload event in order to store the application state before
         * user leaves the page or to cleanup procedures (such as clearing timers and so on). This
         * method should not be used for displaying the dialog and asking user if he is sure to leave
         * the page. This should be done directly in the user application by adding additional
         * beforeunload event handler (will be usualy done in some root ViewComponent)
         */
        protected _finalize(): void;
    }
}
declare namespace ajs.app {
    /**
     * Thrown when the application recognizes it was not initialized before calling the _run method
     * @
     */
    class NotInitializedException extends Error {
    }
    /**
     * Thrown when the inherited application does not implement required functionality
     * @
     */
    class NotImplementedException extends Error {
    }
}
declare namespace ajs.app {
    /**
     * TODO: This is not defined yet. At least name of the error
     * view component should be defined here
     */
    interface IApplicationConfig {
        /** Constructor of the user application class derived from the ajs.app.Application class */
        appConstructor: typeof ajs.app.Application;
        /** User configuration of the application */
        userConfig?: any;
    }
}
/**
 * Boot namespace, the _boot function is automatically called when
 * window.onload event is fired
 */
declare namespace ajs.boot {
}
declare namespace ajs.boot {
    /**
     * Function returning the Ajs Framework configuration.
     * This function must be declared in the ajs.boot.config file (usually separate
     * VS project) and loaded during the index.html loading
     */
    let getAjsConfig: IGetAjsConfig;
    /**
     * Function returning the list of application resources to be loaded
     * This function must be declared in the ajs.boot.config file (usually separate
     * VS project) and loaded during the index.html loading
     */
    let getResourceLists: IGetResourceLists;
    /**
     * Function returning the application configuratopn
     * This function must be declared in the ajs.boot.config file (usually separate
     * VS project) and loaded during the index.html loading
     */
    let getApplicationConfig: IGetAjsApplicationConfig;
}
declare namespace ajs.boot {
    /**
     *  Fired if the ajs.boot.getAjsConfig function is not defined
     */
    class GetAjsConfigFunctionNotDefinedException extends Error {
    }
    /**
     *  Fired if the ajs.boot.getAjsConfig function is not defined
     */
    class GetApplicationConfigFunctionNotDefinedException extends Error {
    }
    /**
     *  Fired if the ajs.boot.getResourceList function is not defined
     */
    class GetResourceListFunctionNotDefinedException extends Error {
    }
    /**
     * Fired when loading resources specified in the configuration file fails
     */
    class ResourcesLoadingFailedException extends Error {
    }
}
declare namespace ajs.boot {
    /** Defines the function returning the ajs application configuration
     *  This function must be implemented in the cofiguration file (namepace ajs.boot)
     *  and loaded by html page. It is expcected to be defined in the ajs.boot namespace.
     */
    interface IGetAjsApplicationConfig {
        (): ajs.app.IApplicationConfig;
    }
}
declare namespace ajs.boot {
    /** Defines the function returning the ajs framework configuration
     *  This function must be implemented in the cofiguration file (namepace ajs.boot)
     *  and loaded by html page. It is expcected to be defined in the ajs.boot namespace.
     */
    interface IGetAjsConfig {
        (): IAJSConfig;
    }
}
declare namespace ajs.boot {
    /** Defines the function returning the resources required to be loaded during the boot time
     *  This function must be implemented in the cofiguration file (namepace ajs.boot) and loaded
     *  by html page. It is expcected the function will be declred in the ajs.boot namespace.
     */
    interface IGetResourceLists {
        (): IResourceLists;
    }
}
declare namespace ajs.boot {
    /** Output of the ajs.boot.getResourceLists function contains all resources to be loaded */
    interface IResourceLists {
        /** loads resources to the local store with the permanent caching policy */
        localPermanent?: string[];
        /** loads resources to the local store with the last recently used caching policy */
        localLastRecentlyUsed?: string[];
        /** loads resources to the session store with the permanent caching policy */
        sessionPermanent?: string[];
        /** loads resources to the session store with the last recently used caching policy */
        sessionLastRecentlyUsed?: string[];
        /** loads resources to the memory store with the permanent caching policy */
        memoryPermanent?: string[];
        /** loads resources to the memory store with the last recently used caching policy */
        memoryLastRecentlyUsed?: string[];
        /** direct load without using of the store */
        direct?: string[];
    }
}
/**
 * Model View View Component Model namespace
 * asd
 */
declare namespace ajs.mvvm {
}
declare namespace ajs.mvvm {
    class ViewComponentIsNotRegisteredException extends Error {
        constructor(componentName: string);
    }
    class VisualComponentNotRegisteredException extends Error {
        constructor(componentName: string);
    }
}
declare namespace ajs.mvvm {
    import TemplateManager = ajs.templating.TemplateManager;
    import ViewComponentManager = ajs.mvvm.viewmodel.ViewComponentManager;
    /**
     * View class represents a view composed from the view components. Automatically builds the view component tree
     * based on the passed rootViewComponentName. It automatically instantiates the root component which takes care
     * of instantiating children view components. The initial state of the root component must be set in this
     * component, it is not possible to pass the state from the View.
     *
     * View also catches state changes occured in the children view components and performs rendering at the end of
     * the state change. Rendering occurs only if the state was really changed (this is evaluated in the view component).
     * Rendering starts from the component which was root for the state change and renders also all children if necessary.
     *
     * View additionally provides a unique component ID generator so each component in the view tree will obtain unique
     * identification number when created. This ID can is not currently used internally.
     */
    class View {
        /** Reference to the template manager */
        protected _templateManager: TemplateManager;
        /** Returns reference to the template manager used during the view construction */
        readonly templateManager: TemplateManager;
        /** Reference to the view component manager */
        protected _viewComponentManager: ViewComponentManager;
        /** Returns reference to the view manager used during the view construction */
        readonly viewComponentManager: ViewComponentManager;
        /** Stores name of the view component used as the root for the view */
        protected _rootViewComponentName: string;
        /** Returns currently set name of the root view component */
        /** Sets the name of the root view component and internally instantiates it and its tree.
         *  Additionally, it destroys the previously assigned root component and its tree
         */
        rootViewComponentName: string;
        /** Root view component currently in use */
        protected _rootViewComponent: viewmodel.ViewComponent;
        /** Returns root view component currently in use */
        readonly rootViewComponent: viewmodel.ViewComponent;
        /** Specifies the root component for the current state change.
         *  This component is then rendered (including its children) if neccessary
         */
        protected _changeRootComponent: viewmodel.ViewComponent;
        /** Returns the current change root component. Valid when the stage change is in progress only */
        readonly changeRootComponent: viewmodel.ViewComponent;
        /** Used for shadow rendering of the view component after the state change and it for comparing changes against the target DOM */
        protected _shadowDom: Document;
        /** Unique component ID generator -> increments by 1 every time it is asked for the new value */
        protected _lastComponentId: number;
        /** Returns unique ID number each time it is asked for it. Currently, the view component
         *  is using this generator to assign view component unique identification, but this identification is not in use now
         */
        readonly getComponentId: number;
        /** Holds style sheets (template names) applied to the current view */
        protected _appliedStyleSheets: string[];
        /** Returns style sheets (template names) applied to the current view */
        readonly appliedStyleSheets: string[];
        protected _navigationNotifier: viewmodel.ComponentEventNotifier;
        readonly navigationNotifier: viewmodel.ComponentEventNotifier;
        protected _renderDoneNotifier: viewmodel.ComponentEventNotifier;
        readonly renderDoneNotifier: viewmodel.ComponentEventNotifier;
        /**
         * Constructs a view. This constructor is called from the ajs.Framework during initialization
         * View is supposed to be just one in the application. All the "view" functionality should be
         * in view components itself.
         * @param templateManager template manager must be instantiated before the view
         * @param viewComponentManager view component manager must be instantiated before the view
         */
        constructor(templateManager: TemplateManager, viewComponentManager: ViewComponentManager);
        protected _rootUpdated(rootComponentName: string): void;
        protected _createViewComponent(name: string): viewmodel.ViewComponent;
        protected _cleanUpDocument(): void;
        applyStylesheetFromTemplate(template: ajs.templating.Template): void;
        onNavigate(): void;
        _stateChangeBegin(viewComponent: viewmodel.ViewComponent): void;
        _stateChangeEnd(viewComponent: viewmodel.ViewComponent): void;
        notifyParentsChildrenStateChange(viewComponent: viewmodel.ViewComponent): void;
        render(viewComponent: viewmodel.ViewComponent): void;
        protected _isComponent(node: Node): boolean;
        protected _getComponentId(node: Node): number;
        protected _updateDom(source: Node, target: Node): void;
        protected _updateNode(source: Node, target: Node): boolean;
    }
}
declare namespace ajs.mvvm.viewmodel {
}
declare namespace ajs.mvvm.viewmodel {
    class ComponentEventNotifier {
        protected _listeners: IComponentEventNotifyListener[];
        constructor(...listeners: IComponentEventNotifyListener[]);
        subscribe(listener: IComponentEventNotifyListener): void;
        unsubscribe(listener: IComponentEventNotifyListener): void;
        notify(sender: ViewComponent): void;
    }
}
declare namespace ajs.mvvm.viewmodel {
    interface IAttributeProcessor {
        (toRemove: string[], attr: Attr): boolean;
    }
}
declare namespace ajs.mvvm.viewmodel {
    interface IAttributeProcessorsCollection {
        [key: string]: IAttributeProcessor;
        __default: IAttributeProcessor;
    }
}
declare namespace ajs.mvvm.viewmodel {
    interface IEventNotifierCollection {
        [name: string]: ajs.mvvm.viewmodel.IComponentEventNotifyListener;
    }
}
declare namespace ajs.mvvm.viewmodel {
    interface IComponentEventNotifyListener {
        (sender: ViewComponent): boolean;
    }
}
declare namespace ajs.mvvm.viewmodel {
    interface IInstancedViewComponentsCollection {
        [index: number]: ViewComponent;
    }
}
declare namespace ajs.mvvm.viewmodel {
    interface IRegisteredViewComponentsCollection {
        [name: string]: typeof ViewComponent;
    }
}
declare namespace ajs.mvvm.viewmodel {
    interface IViewState {
        [key: string]: any;
    }
}
declare namespace ajs.mvvm.viewmodel {
    class ViewComponent {
        protected _componentId: number;
        readonly componentId: number;
        protected _view: View;
        readonly view: View;
        protected _parentComponent: ViewComponent;
        readonly parentComponent: ViewComponent;
        protected _visualComponent: ajs.templating.IVisualComponent;
        readonly visualComponent: ajs.templating.IVisualComponent;
        protected _stateKeys: string[];
        readonly stateKeys: string[];
        protected _stateChanged: boolean;
        readonly stateChanged: boolean;
        resetStateChanged(): void;
        setStateChanged(): void;
        protected _element: HTMLElement;
        element: HTMLElement;
        protected _attributeProcessors: IAttributeProcessorsCollection;
        constructor(view: View, parentComponent: ViewComponent, visualComponent: ajs.templating.IVisualComponent, state?: IViewState);
        protected _initialize(): void;
        protected _destroy(): void;
        protected _finalize(): void;
        protected _defaultState(): IViewState;
        setState(state: IViewState): void;
        protected _applyState(state: IViewState): void;
        protected _createViewComponent(viewComponentInfo: ajs.templating.IVisualComponentChildInfo, state: IViewState): ViewComponent;
        /**
         * render the ViewComponent to the target element (appenChild is used to add the element)
         * @param parentElement element to be used as a parent for the component
         * @param usingShadowDom information if the render is performed to the main DOM or shadow DOM
         */
        render(parentElement: HTMLElement, usingShadowDom: boolean, clearStateChangeOnly: boolean): HTMLElement;
        protected _renderTree(sourceNode: Node, targetNode: Node, usingShadowDom: boolean, clearStateChangeOnly: boolean): Node;
        /**
         * clone/adopt/process the node from the template and add it to the document
         * @param sourceNode node in the VisualComponent template
         * @param targetNode node in the targer document
         */
        protected _renderNode(sourceNode: Node, targetNode: Node): Node;
        /**
         * process the node - see _processText and _processElement methods bellow for detail
         * @param node The node in the template to be processed
         */
        protected _processNode(node: Node): Node;
        /**
         * replace all template {} tags with the state value from the ViewComponent appropriate property
         * @param node
         */
        protected _processText(node: Node): Node;
        /**
         * process the template tag
         * @param element Template element to be processed
         */
        protected _processElement(element: HTMLElement): HTMLElement;
        /**
         * process the template tag attributes
         * if the attribute processor returns false the element will be removed from further rendering
         * @param element
         */
        protected _processAttributes(element: HTMLElement): HTMLElement;
        protected _attrComponent(toRemove: string[], attr: Attr): boolean;
        protected _attrIf(toRemove: string[], attr: Attr): boolean;
        protected _attrDefault(toRemove: string[], attr: Attr): boolean;
        protected _attrEventHandler(toRemove: string[], attr: Attr): boolean;
        insertChildComponent(viewComponentName: string, id: string, state: IViewState, placeholder: string, index?: number): void;
        removeChildComponent(placeholder: string, id: string): void;
        protected _visualComponentInsertChild(placeholder: string, componentName: string, id: string, index?: number): void;
        protected _visualComponentRemoveChild(placeholder: string, id: string): void;
    }
}
declare namespace ajs.mvvm.viewmodel {
    class ViewComponentManager {
        protected _components: IRegisteredViewComponentsCollection;
        readonly components: IRegisteredViewComponentsCollection;
        protected _componentInstances: IInstancedViewComponentsCollection;
        constructor();
        registerComponents(...componentConstructor: typeof ViewComponent[]): void;
        protected _registerComponent(componentConstructor: typeof ViewComponent): void;
        getComponentConstructorByName(name: string): typeof ViewComponent;
        isComponentConstructorRegistered(componentConstructor: typeof ViewComponent): boolean;
        registerComponentInstance(component: ViewComponent): void;
        removeComponentInstance(component: ViewComponent): void;
        getComponentInstance(componentId: number): ViewComponent;
    }
}
declare namespace ajs.navigation {
    import Router = ajs.routing.Router;
    class Navigator {
        protected _lastUrl: string;
        protected _router: Router;
        readonly router: Router;
        constructor(router: Router);
        navigated(): void;
        navigate(url: string): void;
        protected _onPopState(event: PopStateEvent): void;
        protected _onHashChange(event: HashChangeEvent): void;
    }
}
declare namespace ajs.resources {
    class AjsStorage {
        /** Resources stored in the storage */
        protected _resources: ICachedResource[];
        /** Indicates if the storage type (local, session) is supported by the browser */
        protected _supported: boolean;
        /** Returns if the storage type (local, session) is supported by the browser */
        readonly supported: boolean;
        /** Stores approximate total size of all resources stored in the storage in bytes */
        protected _usedSpace: number;
        /** Returns approximate total size of all resources stored in the storage in bytes */
        readonly usedSpace: number;
        /**
         * Completely clears the storage
         * MUST BE OVERRIDEN IN INHERITED CLASS
         */
        clear(): void;
        /**
         * Adds a new resource to the storage
         * MUST BE OVERRIDEN IN INHERITED CLASS
         * @param resource Resource to be stored
         */
        addResource(resource: ICachedResource): void;
        /**
         * Returns the resource according the URL passed
         * MUST BE OVERRIDEN IN INHERITED CLASS
         * @param url URL of the resource to be returned
         */
        getResource(url: string): ICachedResource;
        /**
         * Updates cached resource
         * MUST BE OVERRIDEN IN INHERITED CLASS
         * @param resource Resource to be updated
         */
        updateResource(resource: ICachedResource): void;
        /**
         * Remove the resource from the storage
         * MUST BE OVERRIDEN IN INHERITED CLASS
         * @param url Url of the resource to be removed
         */
        removeResource(url: string): void;
    }
}
declare namespace ajs.resources {
    /** Function is not implemented (probably must be implemented in derived class */
    class NotImplementedException extends Error {
    }
    /** The required storage type is not supported by the browser */
    class StorageTypeNotSupportedException extends Error {
    }
    /** If the storage is chosen the caching policy must be set */
    class CachePolicyMustBeSetException extends Error {
    }
    /** Resource was not found in the storage */
    class ResourceNotFoundException extends Error {
    }
    /** Storage is out of space or the resource can't fit the storage */
    class NotEnoughSpaceInStorageException extends Error {
    }
}
declare namespace ajs.resources {
    /** Represents the resource stored in one of storages */
    interface ICachedResource {
        /** Unique resource locator */
        url: string;
        /** Resource data */
        data: any;
        /** Caching policy */
        cachePolicy: CACHE_POLICY;
        /** timestamp of the creation of the resource in the cache */
        lastModified: Date;
        /** last timestamp of access of the resource in the cahce */
        lastUsedTimestamp?: Date;
        /** size of the resource ocuppying the cache */
        size?: number;
    }
}
declare namespace ajs.resources {
    /** Represents managed resource */
    interface IResource {
        /** Unique resource locator */
        url: string;
        /** Type of the resource */
        type: RESOURCE_TYPE;
        /** Resource data */
        data: any;
        /** Indicates if the resource is cached in one of stores */
        cached: boolean;
        /** Storage used to store the resource */
        storage: AjsStorage;
        /** Cache policy */
        cachePolicy: CACHE_POLICY;
        /** Last resource modification time (in the storage, not on the server) */
        lastModified: Date;
    }
}
declare namespace ajs.resources {
    /** Called when the resource finished loading even when the server request failed */
    interface IResourceLoadEndCallback {
        (loaded: boolean, url: string, resource: IResource, userData?: any): void;
    }
}
declare namespace ajs.resources {
    interface IResourceLoadEndHandler {
        (response: IResourceResponseData): void;
    }
}
declare namespace ajs.resources {
    /** Information about currently loading resource passed from load method to IResourceLoadEnd method */
    interface IResourceLoadingInfo {
        /** Current resource info */
        resource: IResource;
        /** User data passed to the callback when loading of the resource finishes */
        userData: any;
        /** Information if the sucessfully loaded script resources should be evaluated automatically */
        execScript: boolean;
        /** Callback to be called when the resource loading finishes */
        callback: IResourceLoadEndCallback;
    }
}
declare namespace ajs.resources {
    /** Resource manager configuration */
    interface IResourceManagerConfig {
        /** Maximum amount of the memory to be used by the resources in the StoreMemory */
        memoryCacheSize: number;
        /** If resources are updated (i.e.) by new release the cache can be invalidated
         *  by setting this value to the same date as the resource release date
         */
        removeResourcesOlderThan?: Date;
    }
}
declare namespace ajs.resources {
    interface IResourceRequest extends XMLHttpRequest {
        resourceRequestData: IResourceRequestData;
    }
}
declare namespace ajs.resources {
    interface IResourceRequestData {
        url: string;
        userData: any;
        lastModified: Date;
        startTime: Date;
        loadEndHandler: IResourceLoadEndHandler;
    }
}
declare namespace ajs.resources {
    interface IResourceResponseData {
        type: string;
        data: any;
        userData: any;
        httpStatus: number;
        startTime: Date;
        endTime: Date;
    }
}
declare namespace ajs.resources {
    /** Called when all resources finished loading even if errors occured */
    interface IResourcesLoadEndCallback {
        (allLoaded: boolean, resources: IResource[], userData?: any): void;
    }
}
declare namespace ajs.resources {
    /** Information about currently loading resources */
    interface IResourcesLoadingInfo {
        /** Array of information about particular resources */
        loadingData: {
            /** Unique resource locator */
            url: string;
            /** Flag if the resource loading is over */
            loadingFinished: boolean;
            /** Flag if the resource was loaded (from server or cache) sucessfully */
            loaded: boolean;
            /** Resource currently loading */
            resource: IResource;
        }[];
        /** User data to be passed to the callback when loading finished */
        userData: any;
        /** Callback to be called when all resources finished loading */
        loadEndCallback: IResourcesLoadEndCallback;
    }
}
declare namespace ajs.resources {
    /** Information about resource types and its extensions. Defined in the ResourceManager */
    interface IResourceTypes {
        /** Script resource type extensions (.js) */
        script: string[];
        /** Style resource type extensions (.css) */
        style: string[];
        /** Text resource type extensions (.txt, .htm, .html, .xml and so on) */
        text: string[];
        /** Script resource type extensions (.png, .jpg. .jpeg and so on) */
        binary: string[];
    }
}
declare namespace ajs.resources {
    class ResourceLoader {
        loadResource(loadEndHandler: IResourceLoadEndHandler, url: string, userData?: any, lastModified?: Date): void;
        protected _loadResource(requestData: IResourceRequestData): void;
        protected _loadEnd(e: Event): void;
    }
}
declare namespace ajs.resources {
    /** Storage cachedResourcesInfo key */
    const STORAGE_INFO_KEY: string;
    /** Storage resource data item key prefix */
    const STORAGE_RESOURCE_KEY_PREFIX: string;
    /** Storage key for testing if the resource fits the remaining free space */
    const STORAGE_ADDTEST_KEY: string;
    /** List of possible resource types */
    enum RESOURCE_TYPE {
        SCRIPT = 0,
        STYLE = 1,
        TEXT = 2,
        BINARY = 3,
        UNKNOWN = 4,
    }
    /** Type of the storage - passed to the loadResource or loadResources methods */
    enum STORAGE_TYPE {
        NONE = 0,
        LOCAL = 1,
        SESSION = 2,
        MEMORY = 3,
    }
    /** Cache policy
     * NONE - Not used when the resource is cached
     * PERMANENT - Resource is cached permanently and is never automatically removed from the cache
     * LASTRECENTLYUSED - Resource is removed from the cache when there is no enough space and it is last recently used resource
     */
    enum CACHE_POLICY {
        NONE = 0,
        PERMANENT = 1,
        LASTRECENTLYUSED = 2,
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
    class ResourceManager {
        /** Stores referrence to the ResourceLoader object */
        protected _resourceLoader: ResourceLoader;
        /** Returns referrence to the ResourceLoader object used by the Resource Manager */
        readonly resourceLoader: ResourceLoader;
        /** Stores reference to the StorageLocal object */
        protected _storageLocal: StorageLocal;
        /** Returns referrence to the StorageLocal object used by the Resource Manager */
        readonly storageLocal: StorageLocal;
        /** Stores reference to the StorageSession object */
        protected _storageSession: StorageSession;
        /** Returns referrence to the StorageSession object used by the Resource Manager */
        readonly storageSession: StorageSession;
        /** Stores reference to the StorageMemory object */
        protected _storageMemory: StorageMemory;
        /** Returns referrence to the StorageMemory object used by the Resource Manager */
        readonly storageMemory: StorageMemory;
        /**
         * Constructs the ResourceManager
         */
        constructor(config?: IResourceManagerConfig);
        /**
         * Returnd the default ResourceManager configuration
         */
        protected _defaultConfig(): IResourceManagerConfig;
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
        load(loadEndCallback: IResourceLoadEndCallback, url: string, userData?: any, storageType?: STORAGE_TYPE, cachePolicy?: CACHE_POLICY, executeScript?: boolean): void;
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
        loadMultiple(loadEndCallback: IResourcesLoadEndCallback, urls: string[], userData?: any, storageType?: STORAGE_TYPE, cachePolicy?: CACHE_POLICY, executeScripts?: boolean): void;
        /**
         * Returns cached resource
         * @param url Url of the cached resource
         * @param storageType type of the storage to be used for lookup
         */
        getCachedResource(url: string, storageType: STORAGE_TYPE): IResource;
        /**
         * Called internally when loading of single resource finishes
         * @param response Information about the resource loaded passed from the resource loader
         */
        protected _loadEnd(response: IResourceResponseData): void;
        /**
         * Called internally when multiple resources are about to be loaded andone of them finished
         * @param loaded Information if resource was loaded from the server or cache (true) or if error occured (false)
         * @param url Url of the resource
         * @param resource Loaded resource or null if error
         * @param userData Information about the callback and resources loading progress
         */
        protected _nextLoaded(loaded: boolean, url: string, resource: IResource, userData: IResourcesLoadingInfo): void;
        /**
         * Returns the storage instance from the storage type
         * @param storageType
         */
        protected _getStorageFromType(storageType: STORAGE_TYPE): AjsStorage;
        /**
         * Returns the resource type from the resource file extension
         * @param url
         */
        protected _getResourceTypeFromURL(url: string): RESOURCE_TYPE;
        /**
         * Evaluates the script resource - should be used only during debugging as IE / Visual Studio does not
         * work with source maps in the dynamically added <script> tag when debugging
         * @param resource Script resource to be evaluated
         */
        protected _evalScript(resource: IResource): void;
        /**
         * Creates the script tag and adds the resource data to it (script is then executed automatically)
         * @param resource Script resource to be evaluated
         */
        protected _addScriptTag(resource: IResource): void;
    }
}
declare namespace ajs.resources {
    /**
     * Represents the browser local storage (persistent until explicitly cleared)
     * The total amount of the data storable to the local storage is about 5MB
     *
     * updateResource method should be called after each resource data change
     *
     * Items are stored under two keys in the storage:
     * AJSRESOURCESINFO   - JSONed ICachedResource[] where data at all items is set to null
     * AJSRESOURCES.%URL% - JSONed resource data where %URL% is URL of the data
     * AJSADDTEST         - string of spaces for testing if it is possible to add / update resource
     */
    class StorageBrowser extends AjsStorage {
        protected _storageProvider: Storage;
        /**
         * Completely cleans all resources from the storage
         */
        clear(): void;
        /**
         * Adds a new resource to the storage
         * @param resource Resource to be stored
         * @throws NotEnoughSpaceInStorageException Thrown when there is not enough space in the storage to store the resource
         */
        addResource(resource: ICachedResource): void;
        /**
         * Returns the resource according the URL passed
         * @param url URL of the resource to be returned
         */
        getResource(url: string): ICachedResource;
        /**
         * Updates cached resource
         * @param resource Resource to be updated
         * @throws NotEnoughSpaceInStorageException Thrown when there is not enough space
         *                                          in the storate to update the resource
         */
        updateResource(resource: ICachedResource): void;
        /**
         * Remove the resource from the storage
         * @param url Url of the resource to be removed
         */
        removeResource(url: string): void;
        /**
         * Loads information about resources in the storage
         */
        protected _getResourcesInfoFromLocalStorage(): ICachedResource[];
        /**
         * Cleans the storage.
         * @param requiredSpace If defined the method tries to remove old
         *                      resources until there is enough space in the storage,
         *                      otherwise it removes all non-PERMANENT resources
         * @throws NotEnoughSpaceInStorageException If there is not required space in the store
         */
        protected _cleanCache(requiredSpace?: number): void;
        /**
         * Converts JSON string to Date
         * Used for resource info data loaded from storage and parsed from JSON to object
         * @param key
         * @param value
         */
        protected _resourceInfoJSONReviver(key: string, value: any): any;
        /**
         * Returns resource index from the URL
         * If the resource is not found it returns -1
         * @param url
         */
        protected _getResourceIndex(url: string): number;
    }
}
declare namespace ajs.resources {
    /**
     * Represents the browser local storage (persistent until explicitly cleared)
     * The total amount of the data storable to the local storage is about 5MB
     *
     * updateResource method should be called after each resource data change
     *
     * Implementation is in the StorageBrowser, the storage provider is set here
     *
     * Items are stored under two keys in the storage:
     * AJSRESOURCESINFO   - JSONed ICachedResource[] where data at all items is set to null
     * AJSRESOURCES.%URL% - JSONed resource data where %URL% is URL of the data
     * AJSADDTEST         - string of spaces for testing if it is possible to add / update resource
     */
    class StorageLocal extends StorageBrowser {
        /**
         * Construct the StorageLocal object
         */
        constructor();
    }
}
declare namespace ajs.resources {
    /**
     * Represents larger but slow memory storage mainly for resources
     * which does not need to be stored in the session or local storages.
     * Typical use would be caching of static pages/templates loaded from
     * the server.
     *
     * Resources should not be updated heavily because the size of the resource
     * is recalculated everythime the resource is created or updated and the
     * storage mechanisms are executed in order to cleanup storage
     *
     * updateResource method should be called after each resource data change
     * If the same referece to resource data is used to modify the data the
     * storage internally does not know the data was changed so the size of the
     * data is out of sync the caching mechanism so the storage can quickly grow
     * above the limit set.
     *
     * Resources with both types of the storage policy counts into the resultant
     * size of the storage
     */
    class StorageMemory extends AjsStorage {
        /** Stores the maximum size of the storage in bytes */
        protected _maxSize: number;
        /** Returns the maximum size of the storage in bytes */
        readonly maxSize: number;
        /**
         * Construct the StorageMemory object
         * @param size The maximum size of the memory storage
         */
        constructor(size: number);
        /**
         * Completely cleans all resources from the storage
         */
        clear(): void;
        /**
         * Adds a new resource to the storage
         * @param resource Resource to be stored
         * @throws CachePolicyMustBeSetException when the caching policy was not set or was NONE
         */
        addResource(resource: ICachedResource): void;
        /**
         * Returns the resource according the URL passed
         * @param url URL of the resource to be returned
         */
        getResource(url: string): ICachedResource;
        /**
         * Updates cached resource
         * @param resource Resource to be updated
         */
        updateResource(resource: ICachedResource): void;
        /**
         * Remove the resource from the storage
         * @param url Url of the resource to be removed
         */
        removeResource(url: string): void;
        /**
         * Cleans the storage.
         * @param requiredSpace If defined the method tries to remove old
         *                      resources until there is enough space in the storage,
         *                      otherwise it removes all non-PERMANENT resources
         * @throws NotEnoughSpaceInStorageException If there is not required space in the store
         */
        protected _cleanCache(requiredSpace?: number): void;
    }
}
declare namespace ajs.resources {
    /**
     * Represents the browser session storage (persistent until explicitly cleared)
     * The total amount of the data storable to the session storage is about 5MB
     *
     * updateResource method should be called after each resource data change
     *
     * Implementation is in the StorageBrowser, the storage provider is set here
     *
     * Items are stored under two keys in the storage:
     * AJSRESOURCESINFO   - JSONed ICachedResource[] where data at all items is set to null
     * AJSRESOURCES.%URL% - JSONed resource data where %URL% is URL of the data
     * AJSADDTEST         - string of spaces for testing if it is possible to add / update resource
     */
    class StorageSession extends StorageBrowser {
        /**
         * Construct the StorageSession object
         */
        constructor();
    }
}
declare namespace ajs.routing {
    interface IRoute {
        base: string;
        params: string;
    }
}
declare namespace ajs.routing {
    interface IRouteInfo {
        base: string;
        path: string;
        search: string;
        hash: string;
    }
}
declare namespace ajs.routing {
    interface IRoutes {
        paths: IRoute[];
        viewComponentName: string;
    }
}
declare namespace ajs.routing {
    class Router {
        protected _view: ajs.mvvm.View;
        protected _lastURL: string;
        protected _lastViewComponentName: string;
        protected _lastViewComponentInstance: ajs.mvvm.viewmodel.ViewComponent;
        protected _routes: IRoutes[];
        readonly routes: IRoutes[];
        protected _defaultViewComponentName: string;
        defaultViewComponentName: string;
        protected _exceptionViewComponentName: string;
        exceptionViewComponentName: string;
        protected _currentRoute: IRouteInfo;
        readonly currentRoute: IRouteInfo;
        constructor(view: ajs.mvvm.View, defaultViewComponentName?: string, exceptionViewComponentName?: string);
        registerRoute(paths: IRoute[], viewComponentName: string): void;
        route(): void;
        protected _getRouteViewComponent(): string;
    }
}
declare namespace ajs.routing {
    class NoRoutesConfigured extends Error {
    }
}
declare namespace ajs.templating {
}
declare namespace ajs.templating {
    class PlaceholdersCantHaveChildrenNodesException extends Error {
    }
    class MissingVisualComponentNameException extends Error {
    }
}
declare namespace ajs.templating {
    interface ITemplatesCollection {
        [name: string]: Template;
    }
}
declare namespace ajs.templating {
    /** Defines the handler which is called when requested templates are loaded from the server */
    interface ITemplatesLoadEndHandler {
        (successfull: boolean): void;
    }
}
declare namespace ajs.templating {
    interface IVisualComponent {
        component: HTMLElement;
        templateName: string;
        template: Template;
        children: IVisualComponentChildren;
        placeholders: IVisualComponentPlaceholderCollection;
    }
}
declare namespace ajs.templating {
    interface IVisualComponentChildInfo {
        tagName: string;
        nameAttribute: string;
    }
}
declare namespace ajs.templating {
    interface IVisualComponentChildren {
        [id: string]: IVisualComponentChildInfo;
    }
}
declare namespace ajs.templating {
    interface IVisualComponentCollection {
        [name: string]: IVisualComponent;
    }
}
declare namespace ajs.templating {
    interface IVisualComponentPlaceholder {
        placeholder: HTMLElement;
    }
}
declare namespace ajs.templating {
    interface IVisualComponentPlaceholderCollection {
        [name: string]: IVisualComponentPlaceholder;
    }
}
declare namespace ajs.templating {
    class Template {
        protected _name: string;
        readonly name: string;
        protected _template: Document;
        readonly template: Document;
        protected _visualComponents: IVisualComponentCollection;
        readonly visualComponents: IVisualComponentCollection;
        constructor(name: string, html: string);
        protected _getVisualComponents(): IVisualComponentCollection;
        protected _walkHTMLTree(root: HTMLElement, elementCallback: Function): void;
        protected _getChildrenComponents(element: HTMLElement, childrenComponents?: IVisualComponentChildren): IVisualComponentChildren;
        protected _isChildrenComponent(): void;
        protected _getChildrenPlaceholders(element: HTMLElement, placeholders?: IVisualComponentPlaceholderCollection): IVisualComponentPlaceholderCollection;
    }
}
declare namespace ajs.templating {
    class TemplateManager {
        protected _templates: ITemplatesCollection;
        readonly templates: ITemplatesCollection;
        protected _visualComponents: IVisualComponentCollection;
        readonly VisualComponents: IVisualComponentCollection;
        constructor();
        loadTemplateFiles(templatesCreatedCallback: ITemplatesLoadEndHandler, paths: string[], storageType?: ajs.resources.STORAGE_TYPE, cachePolicy?: ajs.resources.CACHE_POLICY): void;
        loadTemplatesFromResource(resource: ajs.resources.IResource): void;
        protected _templateFilesLoaded(allLoaded: boolean, resources: ajs.resources.IResource[], templatesCreatedCallback: ITemplatesLoadEndHandler): void;
        protected _parseTemplatesFile(html: string): void;
        protected _parseTemplate(templateTag: HTMLElement): void;
        getTemplate(name: string): Template;
        getVisualComponent(name: string): IVisualComponent;
        getVisualComponentTemplate(name: string): Template;
    }
}
declare namespace ajs.utils {
    class Base64 {
        protected static _lookup: any[];
        protected static _revLookup: any[];
        protected static _arr: any;
        static init(): void;
        static toByteArray(b64: string): any;
        protected static _tripletToBase64(num: any): any;
        protected static _encodeChunk(uint8: any, start: any, end: any): string;
        static fromByteArray(uint8: any): string;
    }
}
declare namespace ajs.utils {
    class DeepMerge {
        protected static isMergeableObject(val: any): boolean;
        protected static emptyTarget(val: any): Array<any> | Object;
        protected static cloneIfNecessary(value: any, optionsArgument: any): any;
        protected static defaultArrayMerge(target: Array<any>, source: Array<any>, optionsArgument: any): any;
        protected static mergeObject(target: any, source: any, optionsArgument: any): {};
        static merge(target: any, source: any, optionsArgument?: any): any;
    }
}
declare namespace ajs.utils {
    var HTMLTags: string[];
}
declare namespace ajs.utils {
}
declare namespace ajs.utils {
    class Obj {
        static assign(target: any, varArgs: any): any;
    }
}
declare namespace ajs.utils {
    function defined(object: any): boolean;
    function isNull(object: any): boolean;
    function definedAndNotNull(object: any): boolean;
    function getClassName(obj: Object): string;
    function minDate(): Date;
    function maxDate(): Date;
    function sizeOf(object: Object): number;
}
