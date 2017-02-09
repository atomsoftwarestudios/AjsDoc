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

///<reference path="../viewmodel/ViewComponentManager.ts" />

namespace ajs.mvvm.view {

    "use strict";

    import ViewComponentManager = ajs.mvvm.viewmodel.ViewComponentManager;
    import DocumentManager = ajs.doc.DocumentManager;

    /**
     * View class represents a view composed from the view components. It manages the tree of instanced view components to be displayed.
     * <p>
     * It is recommended to keep just one view for one render target (and basically, only one view for the whole HTML document) as
     * it the code is not designed to exchange the data between multiple views and also interferrences can occur during the style sheet
     * management if multiple views are trying to add / remove style sheets.
     * </p>
     * <p>
     * Automatically builds the view component tree based on the passed rootViewComponentName. It automatically instantiates the root
     * component which takes care of instantiating children view components. The initial state of the root component must be set in this
     * component as it is not possible to pass the default state from the View.
     * </p>
     * <p>
     * View also catches state changes occured in the children view components and initiates the ViewComponent tree rendering
     * to the shadow DOM it manages and performs the final DOM update (using the DocumentManager) at the end of the state change.
     * Rendering and the DOM update occurs only if the state of the "state change" root component or its children was really changed.
     * This is evaluated in the particular view component. If only one of children view components of the root state change components
     * was changed the whole state chane root view component will get rendered to the shadow DOM but only changed nodes are transferred
     * to the render target so the target DOM manipulation is minimized as much as possible.
     * </p>
     */
    export class View {

        protected _config: IViewConfig;
        public get config(): IViewConfig { return this._config; }

        /** Reference to the view component manager */
        protected _viewComponentManager: ViewComponentManager;
        /** Returns reference to the view manager used during the view construction */
        public get viewComponentManager(): ViewComponentManager { return this._viewComponentManager; }

        /** Reference to the document manager */
        protected _documentManager: DocumentManager;
        /** Returns reference to the document manager */
        public get documentManager(): DocumentManager { return this._documentManager; }

        /** Reference to the element serving as a render target for the root view component */
        protected _renderTarget: Element;
        /** Returns reference to the element serving as a render target for the root view component */
        public get renderTarget(): Element { return this._renderTarget; };

        /** Stores name of the view component used as the root for the view */
        protected _rootViewComponentName: string;
        /** Returns currently set name of the root view component */
        public get rootViewComponentName(): string { return this._rootViewComponentName; }

        /**
         * Sets the name of the root view component and internally instantiates it and its tree.
         * Additionally, it destroys the previously assigned root component and its tree and performs necessary cleanup
         */
        public set rootViewComponentName(value: string) { this._rootUpdated(value); }

        /** Root view component currently in use */
        protected _rootViewComponent: ajs.mvvm.viewmodel.ViewComponent;
        /** Returns root view component currently in use */
        public get rootViewComponent(): ajs.mvvm.viewmodel.ViewComponent { return this._rootViewComponent; }

        /** Specifies the root component for the current state change. Component is then rendered (including its children) if neccessary. */
        protected _stateChangeRootComponent: ajs.mvvm.viewmodel.ViewComponent;
        /** Returns the current change root component. Valid when the stage change is in progress only */
        public get stateChangeRootComponent(): ajs.mvvm.viewmodel.ViewComponent { return this._stateChangeRootComponent; }

        /** Used for rendering of view components after the state change and applying the changes to the render target */
        protected _shadowDom: Document;

        /** Notifies subscribers (usually view components) the Navigation event occured */
        protected _navigationNotifier: ajs.events.Notifier;
        public get navigationNotifier(): ajs.events.Notifier { return this._navigationNotifier; }

        /** Notifies subcribers (usually view components) the rendering of the component is finished */
        protected _renderDoneNotifier: ajs.events.Notifier;
        public get renderDoneNotifier(): ajs.events.Notifier { return this._renderDoneNotifier; }

        /** Unique component ID generator -> increments by 1 every time it is asked for the new value */
        protected _lastComponentId: number;
        /** Returns unique ID number each time it is asked for it. Currently, the view component
         *  is using this generator to assign view component unique identification, but this identification is not in use now
         */
        public getNewComponentId(): number { this._lastComponentId++; return this._lastComponentId; }

        /**
         * Constructs a view. This constructor is called from the ajs.Framework during initialization
         * <p>
         * View is supposed to be just one in the application. All the "view" functionality should be
         * in view components itself.
         * </p>
         * @param templateManager template manager must be instantiated before the view
         * @param viewComponentManager view component manager must be instantiated before the view
         */
        public constructor(viewComponentManager: ViewComponentManager, config?: IViewConfig) {

            ajs.debug.log(debug.LogType.Constructor, 0, "ajs.mvvm.view", this, "", ViewComponentManager, config);

            // store the configuration
            if (config) {
                this._config = config;
            } else {
                this._config = this._defaultConfig();
            }

            // instantiate notifiers
            this._navigationNotifier = new ajs.events.Notifier();
            this._renderDoneNotifier = new ajs.events.Notifier();

            // store references to the template and view component managers
            this._viewComponentManager = viewComponentManager;

            // store the render target for the root view component and instantiate the document manager
            this._renderTarget = this._config.renderTarget;
            this._documentManager = new DocumentManager(this._renderTarget);

            // basic initialization of the view
            this._rootViewComponentName = null;
            this._rootViewComponent = null;
            this._stateChangeRootComponent = null;

            // prepare shadow DOM as a ViewComponent render target
            this._shadowDom = document.implementation.createHTMLDocument("shadowDom");
            this._shadowDom.body.innerHTML = "";

            this._lastComponentId = 0;

            ajs.debug.log(debug.LogType.Exit, 0, "ajs.mvvm.view", this);
        }

        /**
         * Default view configuration
         */
        protected _defaultConfig(): IViewConfig {
            return {
                renderTarget: window.document.body
            };
        }

        /**
         * Called from router when navigation occurs but root component remains the same
         */
        public onNavigate(): void {
            this._navigationNotifier.notify(this);
        }

        /**
         * Called from the view component when it is requested to set the new state
         * <p>
         * This information must be passed in order to be possible to recognize the
         * state change root in order to be possible to update just the correct DOM
         * tree.
         * </p>
         * @param viewComponent
         */
        public stateChangeBegin(viewComponent: ajs.mvvm.viewmodel.ViewComponent): void {

            ajs.debug.log(debug.LogType.Enter, 0, "ajs.mvvm.view", this);

            ajs.debug.log(debug.LogType.Info, 0, "ajs.mvvm.view", this,
                "State change begun (" + ajs.utils.getClassName(viewComponent) + "), " +
                "id: " + viewComponent.ajs.id + ", viewId: " + viewComponent.componentViewId,
                viewComponent);

            // if there is no root assigned to the change, the passed component is the root of the change
            if (this._stateChangeRootComponent === null) {

                ajs.debug.log(debug.LogType.Info, 0, "ajs.mvvm.view", this,
                    "The " + ajs.utils.getClassName(viewComponent) + ":" + viewComponent.ajs.id + " is root of the state change");

                this._stateChangeRootComponent = viewComponent;

            }

            ajs.debug.log(debug.LogType.Exit, 0, "ajs.mvvm.view", this);
        }

        /**
         * Called from the view component when it finishes the state change
         * @param viewComponent
         */
        public stateChangeEnd(viewComponent: ajs.mvvm.viewmodel.ViewComponent): void {

            ajs.debug.log(debug.LogType.Enter, 0, "ajs.mvvm.view", this);

            ajs.debug.log(debug.LogType.Info, 0, "ajs.mvvm.view", this,
                "State change end (" + ajs.utils.getClassName(viewComponent) + "), " +
                "id: " + viewComponent.ajs.id + ", viewId: " + viewComponent.componentViewId +
                ", state changed: " + viewComponent.ajs.stateChanged,
                viewComponent);

            if (this._stateChangeRootComponent === viewComponent) {

                // render only if the root view component was rendered already
                // initial rendering of the root component is ensured from the _rootUpdated method
                if (this._rootViewComponent !== null) {

                    // render the root change view component
                    let targetNewNode: Element = this.render(viewComponent);

                    // notify registered subscribers the rendering is over
                    this._renderDoneNotifier.notify(this);

                    // begin the visual transition
                    if (viewComponent.ajs.hasVisualStateTransition) {
                        viewComponent.ajsVisualStateTransitionBegin(targetNewNode);
                    }

                }

                // finish the state change by clearing of the root component
                this._stateChangeRootComponent = null;

            }

            ajs.debug.log(debug.LogType.Exit, 0, "ajs.mvvm.view", this);
        }

        /**
         * Called from the view component to inform all parents in the tree (up to state change root) the state of it has changed
         * <p>
         * This is necessary to inform the state change root component it has to render the tree of components the changed component
         * relates to. Basically, it will render all children but those trees roots which state was not changed will be marked with the
         * skip flag (and children not rendered at all) to inform DOM updater is is not necessary to update these nodes
         * </p>
         * @param viewComponent
         */
        public notifyParentsChildrenStateChange(viewComponent: ajs.mvvm.viewmodel.ViewComponent): void {

            ajs.debug.log(debug.LogType.Enter, 0, "ajs.mvvm.view", this);

            if (viewComponent !== null && this._stateChangeRootComponent !== null) {

                ajs.debug.log(debug.LogType.Info, 0, "ajs.mvvm.view", this,
                    "Notifying parents about the component change: " + viewComponent.ajs.id + " " + viewComponent.componentViewId);

                while (viewComponent !== this._stateChangeRootComponent.ajs.parentComponent && viewComponent !== null) {
                    viewComponent.ajs.stateChanged = true;;
                    viewComponent = viewComponent.ajs.parentComponent;
                }
            }

            ajs.debug.log(debug.LogType.Exit, 0, "ajs.mvvm.view", this);
        }

        /**
         * 
         * @param viewComponent
         */
        public render(viewComponent: ajs.mvvm.viewmodel.ViewComponent): Element {

            ajs.debug.log(debug.LogType.Enter, 0, "ajs.mvvm.view", this);

            ajs.debug.log(debug.LogType.Info, 0, "ajs.mvvm.view", this,
                "Rendering component, id: " + viewComponent.ajs.id + ", viewId: " + viewComponent.componentViewId,
                viewComponent);

            // try to locate the target root - if null is returned this is complete new render
            let targetUpdateRoot: Node = this._documentManager.getTargetNodeByUniqueId(viewComponent.componentViewId);

            // try to locate the template element in the target DOM
            // if it is there we are updating a DOM, otherwise render parent first
            if (targetUpdateRoot === null) {
                if (viewComponent.ajs.parentComponent === null) {
                    targetUpdateRoot = this._renderTarget;
                } else {
                    this.render(viewComponent.ajs.parentComponent);
                    return;
                }
            }

            // render the view component to shadow DOM
            let componentElement: HTMLElement = viewComponent.render(this._shadowDom.body, false);

            // if the component was rendered to shadow DOM, update the target DOM
            if (componentElement !== null) {


                try {

                    // update target DOM from shadow DOM
                    this._documentManager.updateDom(componentElement, targetUpdateRoot);

                } catch (e) {
                    this._shadowDom.body.innerHTML = "";

                    ajs.debug.log(debug.LogType.Error, 0, "ajs.mvvm.view", this,
                        "Error while updating the DOM!", e);

                    throw new Error(e);

                } finally {

                    // clean up the shadow DOM
                    this._shadowDom.body.innerHTML = "";
                }

                // target root should be always element
                if (targetUpdateRoot instanceof Element) {

                    // we need to return root node of the component, not render target
                    if (targetUpdateRoot === this._renderTarget) {
                        targetUpdateRoot = this._documentManager.getTargetNodeByUniqueId(viewComponent.componentViewId);
                    }

                    if (targetUpdateRoot !== null) {

                        ajs.debug.log(debug.LogType.Exit, 0, "ajs.mvvm.view", this);

                        return targetUpdateRoot as Element;

                    } else {

                        ajs.debug.log(debug.LogType.Error, 0, "ajs.mvvm.view", this,
                            "Something went wrong during the DOM update as the root element of the view component can't be located!");

                        throw new Error("Unrecoverable internal error. \
                            Something went wrong during the DOM update as the root element of the view component can't be located!");
                    }

                } else {

                    ajs.debug.log(debug.LogType.Error, 0, "ajs.mvvm.view", this,
                        "Root of the component must be always element!");

                    throw new Error("Unrecoverable internal error. Root of the component must be always element!");
                }

            } else {
                // here is some bullshit, who knows what is used to be for. If null is returned no change was made at all or error occured
                // lets test first

                // if it was not rendered it should be removed from the target
                /*if (targetUpdateRoot !== null) {
                    this._documentManager.removeNode(targetUpdateRoot);
                }*/
            }

            ajs.debug.log(debug.LogType.Exit, 0, "ajs.mvvm.view", this);

        }

        /**
         * Called internally when the view root component is updated (usually initiated by the router)
         * <p>
         * Performs the target document clean up and initiates a state change and initial rendering of the rootview component
         * including its children
         * </p>
         * @param rootComponentName
         */
        protected _rootUpdated(rootComponentName: string): void {

            ajs.debug.log(debug.LogType.Enter, 0, "ajs.mvvm.view", this);

            ajs.debug.log(debug.LogType.Info, 0, "ajs.mvvm.view", this,
                "Root component updated: " + rootComponentName);

            // clean the target document including the render target
            this._documentManager.clean(this.renderTarget);

            // destroy the previous root component (including all its children)
            if (this._rootViewComponent !== null) {
                this.rootViewComponent.destroy();
            }

            // setup the new root view component
            this._rootViewComponentName = rootComponentName;

            // create the view component including its component tree with the default state
            this._rootViewComponent = this._viewComponentManager.createViewComponent(rootComponentName, "rootViewComponent", this, null);

            // hopefully the root component sunscribed navigated event
            this._navigationNotifier.notify(this);

            ajs.debug.log(debug.LogType.Exit, 0, "ajs.mvvm.view", this);
        }

    }

}