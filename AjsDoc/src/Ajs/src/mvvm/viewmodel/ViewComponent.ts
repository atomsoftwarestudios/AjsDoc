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

namespace ajs.mvvm.viewmodel {

    "use strict";

    import IVisualComponent = ajs.templating.IVisualComponent;

    export interface IViewComponentProperties {

        // --- dependancies

        view: mvvm.view.View;
        viewComponentManager: ViewComponentManager;

        // --- identification properties

        /** Stores the id of the component defined in the template */
        id: string;

        // initialization related properties

        stylesheetsApplied: boolean;
        initialized: boolean;

        // --- parent component and visual component instances

        parentComponent: ViewComponent;
        visualComponent: ajs.templating.IVisualComponent;
        templateElement: HTMLElement;

        // --- state related properties

        stateChangePrevented: boolean;
        stateKeys: string[];
        stateQueue: IViewStateSet[];
        processingStateQueue: boolean;
        stateChanged: boolean;

        // --- state transition properties

        hasVisualStateTransition: boolean;
        visualStateTransitionRunning: boolean;
        transitionOldElement: Element;
        transitionNewElement: Element;
        visualStateTransitionBeginHandler: ITransitionBeginHandler;

        // --- attribute processors
        attributeProcessors: IAttributeProcessorsCollection;

        /** Prepared for arrayed components but never initialized so hasOwnProperty must be used to check */
        key: string;
    }

    export class ViewComponent implements ajs.doc.IComponent {

        /** Stores the unique instance ID of the component assigned by the view when the component is instantiated */
        componentViewId: number;

        // properties are defined like this to minimize displayed items by the intellisense in user view components
        public ajs: IViewComponentProperties;

        public constructor(
            view: view.View,
            viewComponentManager: ViewComponentManager,
            id: string,
            componentViewId: number,
            parentComponent: ViewComponent,
            visualComponent: ajs.templating.IVisualComponent,
            state?: IViewStateSet) {

            // throw exception if the visual component was not assigned
            if (visualComponent === null) {
                throw new ajs.mvvm.view.VisualComponentNotRegisteredException(null);
            }

            ajs.debug.log(ajs.debug.LogType.Constructor, 0, "ajs.mvvm.viewmodel", this);

            // initialize properties
            this.componentViewId = componentViewId;

            this.ajs = {
                stylesheetsApplied: false,
                initialized: false,

                id: id,

                view: view,
                viewComponentManager: viewComponentManager,

                parentComponent: parentComponent,

                visualComponent: visualComponent,
                templateElement: visualComponent.component,

                key: null,
                stateChanged: false,
                stateKeys: [],
                stateChangePrevented: false,
                stateQueue: [],
                processingStateQueue: false,

                hasVisualStateTransition: false,
                visualStateTransitionRunning: false,
                visualStateTransitionBeginHandler: null,
                transitionNewElement: null,
                transitionOldElement: null,

                // setup tag attribute processors for the_processAttributes method
                attributeProcessors: {
                    "__default": <IAttributeProcessor>this._attrDefault,
                    "component": <IAttributeProcessor>this._attrComponent,
                    "if": <IAttributeProcessor>this._attrIf,
                    "onclick": <IAttributeProcessor>this._attrEventHandler,
                    "onmousedown": <IAttributeProcessor>this._attrEventHandler,
                    "onmouseup": <IAttributeProcessor>this._attrEventHandler,
                    "onkeydown": <IAttributeProcessor>this._attrEventHandler,
                    "onkeyup": <IAttributeProcessor>this._attrEventHandler,
                    "onchange": <IAttributeProcessor>this._attrEventHandler,
                    "oninput": <IAttributeProcessor>this._attrEventHandler,
                    "ontouchmove_ajs": <IAttributeProcessor>this._attrEventHandler,

                    // non-standard tag events
                    "onanimationend": <IAttributeProcessor>this._attrEventHandler,

                    // ajs specific events
                    "onstatetransitionbegin": <IAttributeProcessor>this._attrTransitionBeginHanler
                }
            };

            // initialize the component -> it can do some async operations so it have to
            // set initialized to true once it is done            
            this._initialize();

            this._applyTemplateStylesheets();

            // apply passed or default state
            if (state && state !== null) {
                let newState: IViewStateSet = ajs.utils.DeepMerge.merge(this._defaultState(), state);
                ajs.utils.Obj.assign(state, newState);
                this._applyState(state);
            } else {
                this._applyState(this._defaultState());
            }

            // indicate the state was changed
            this.ajs.stateChanged = true;

            // ???????????????????????????????????????????????????????????????
            // this.ajsProperties.view.notifyParentsChildrenStateChange(this._ajsParentComponent);
            // ???????????????????????????????????????????????????????????????

            ajs.debug.log(ajs.debug.LogType.Exit, 0, "ajs.mvvm.viewmodel", this);

        }

        protected _applyTemplateStylesheets(): void {

            ajs.debug.log(ajs.debug.LogType.Enter, 0, "ajs.mvvm.viewmodel", this);

            // asynchronously apply style sheets from the view component template to the target document
            this.ajs.view.documentManager.applyStyleSheetsFromTemplate(this.ajs.visualComponent.template).then(

                // once style sheets are applied render the root view component
                () => {
                    this.ajs.stylesheetsApplied = true;
                },
                // if adding of stylesheets failed, log it and re-throw the exception
                (reason: Error) => {

                    ajs.debug.log(ajs.debug.LogType.Error, 0, "ajs.mvvm.view", this,
                        "Adding of template stylesheets failed: " +
                        ", Template: " + this.ajs.visualComponent.template.name,
                        reason, this);

                    throw reason;
                }

            );

            ajs.debug.log(ajs.debug.LogType.Exit, 0, "ajs.mvvm.viewmodel", this);
        }

        protected _initialize(): void {
            return;
        }

        public destroy(): void {

            // remove all children components
            this.clearState(false);

            // finalize the component
            this._finalize();

            // if the component was rendered, remove it from the DOM tree
            this.ajs.view.documentManager.removeNodeByUniqueId(this.componentViewId);

            // unregister component instance from ViewComponent manager
            ajs.Framework.viewComponentManager.removeComponentInstance(this);

        };

        protected _finalize(): void {

            ajs.debug.log(ajs.debug.LogType.Enter, 0, "ajs.mvvm.viewmodel", this);

            ajs.debug.log(ajs.debug.LogType.Info, 0, "ajs.mvvm.viewmodel", this,
                "_finalize not overriden. Nothing to do.");

            ajs.debug.log(ajs.debug.LogType.Exit, 0, "ajs.mvvm.viewmodel", this);

            return;
        }

        protected _defaultState(): IViewStateSet {

            ajs.debug.log(ajs.debug.LogType.Enter, 0, "ajs.mvvm.viewmodel", this);

            ajs.debug.log(ajs.debug.LogType.Info, 0, "ajs.mvvm.viewmodel", this,
                "_defaultState not overriden. Setting {}");

            ajs.debug.log(ajs.debug.LogType.Exit, 0, "ajs.mvvm.viewmodel", this);

            return {};
        }

        public setState(state: IViewStateSet): void {

            ajs.debug.log(ajs.debug.LogType.Enter, 0, "ajs.mvvm.viewmodel", this);

            ajs.debug.log(ajs.debug.LogType.Info, 0, "ajs.mvvm.viewmodel", this,
                "Setting component state: " + ajs.utils.getClassName(this) + ", id: " + this.ajs.id, ", viewId: " + this.componentViewId,
                state
            );

            if (this.ajs.visualStateTransitionRunning) {
                this._ajsVisualStateTransitionCancel();
            }

            this.ajs.stateQueue.push(state);
            this._processStateQueue();

            ajs.debug.log(ajs.debug.LogType.Exit, 0, "ajs.mvvm.viewmodel", this);
        }

        protected _setPreventStateChange(value: boolean): void {

            ajs.debug.log(ajs.debug.LogType.Enter, 0, "ajs.mvvm.viewmodel", this);

            ajs.debug.log(ajs.debug.LogType.Info, 0, "ajs.mvvm.viewmodel", this,
                "Setting prevent state change to " + value + " (" + ajs.utils.getClassName(this) + ", id: " + this.ajs.id, ", viewId: " + this.componentViewId + ")"
            );

            this.ajs.stateChangePrevented = value;
            let children: ViewComponent[] = this.ajs.viewComponentManager.getChildrenComponentInstances(this);
            for (let i: number = 0; i < children.length; i++) {
                children[i]._setPreventStateChange(value);
            }

            if (!value) {
                this._processStateQueue();
            }

            ajs.debug.log(ajs.debug.LogType.Exit, 0, "ajs.mvvm.viewmodel", this);
        }

        protected _processStateQueue(): void {

            ajs.debug.log(ajs.debug.LogType.Enter, 0, "ajs.mvvm.viewmodel", this);

            if (this.ajs.stateQueue.length === 0) {
                ajs.debug.log(ajs.debug.LogType.Exit, 0, "ajs.mvvm.viewmodel", this);
                return;
            }

            if (this.ajs.processingStateQueue) {
                ajs.debug.log(ajs.debug.LogType.Warning, 0, "ajs.mvvm.viewmodel", this,
                    "Processing state already running!");
                ajs.debug.log(ajs.debug.LogType.Exit, 0, "ajs.mvvm.viewmodel", this);
                return;
            }

            if (this.ajs.stateChangePrevented) {
                ajs.debug.log(ajs.debug.LogType.Warning, 0, "ajs.mvvm.viewmodel", this,
                    "State change is prevented: " + ajs.utils.getClassName(this) + ", id: " + this.ajs.id, ", viewId: " + this.componentViewId);
                ajs.debug.log(ajs.debug.LogType.Exit, 0, "ajs.mvvm.viewmodel", this);
                return;
            }

            this.ajs.processingStateQueue = true;

            ajs.debug.log(ajs.debug.LogType.Info, 0, "ajs.mvvm.viewmodel", this,
                "Processing state queue: " + ajs.utils.getClassName(this) + ", id: " + this.ajs.id, ", viewId: " + this.componentViewId + ", " + 
                this.ajs.stateQueue.length + " state changes queued",
                state
            );

            while (this.ajs.stateQueue.length > 0) {

                if (this.ajs.stateChangePrevented) {
                    ajs.debug.log(ajs.debug.LogType.Warning, 0, "ajs.mvvm.viewmodel", this,
                        "State change is prevented: " + ajs.utils.getClassName(this) + ", id: " + this.ajs.id, ", viewId: " + this.componentViewId);
                    ajs.debug.log(ajs.debug.LogType.Exit, 0, "ajs.mvvm.viewmodel", this);
                    return;
                }

                let state: IViewStateSet = this.ajs.stateQueue.shift();

                ajs.debug.log(ajs.debug.LogType.Info, 0, "ajs.mvvm.viewmodel", this,
                    "Setting component state: " + ajs.utils.getClassName(this) + ", id: " + this.ajs.id, ", viewId: " + this.componentViewId + ", " +
                    this.ajs.stateQueue.length + " state changes queued",
                    state
                );

                if (this.ajs.hasVisualStateTransition) {

                    let node: doc.INode = this.ajs.view.documentManager.getTargetNodeByUniqueId(this.componentViewId);
                    this.ajs.transitionOldElement = node.cloneNode(true) as HTMLElement;
                }

                this.ajs.view.stateChangeBegin(this);
                this._applyState(state);
                this.ajs.view.stateChangeEnd(this);

            }

            this.ajs.processingStateQueue = false;

            ajs.debug.log(ajs.debug.LogType.Exit, 0, "ajs.mvvm.viewmodel", this);
        }

        /**
         * Removes all state properties and destroys children component tree
         * @param render
         */
        public clearState(render: boolean): void {
            if (render) {
                this.ajs.view.stateChangeBegin(this);
            }

            while (this.ajs.stateKeys.length > 0) {
                if (this[this.ajs.stateKeys[0]] instanceof ViewComponent) {
                    (this[this.ajs.stateKeys[0]] as ViewComponent).destroy();
                }
                if (this[this.ajs.stateKeys[0]] instanceof Array) {
                    for (let i: number = 0; i < this[this.ajs.stateKeys[0]].length; i++) {
                        if (this[this.ajs.stateKeys[0]][i] instanceof ViewComponent) {
                            (this[this.ajs.stateKeys[0]][i] as ViewComponent).destroy();
                        }
                    }
                }
                delete (this[this.ajs.stateKeys[0]]);
                this.ajs.stateKeys.splice(0, 1);
            }

            if (render) {
                this.ajs.stateChanged = true;
                this.ajs.view.stateChangeEnd(this);
            }
        }

        /**
         * This method can be overriden to filter the full state before it is applied
         * @param state
         */
        protected _filterState(state: IViewStateSet): IViewStateGet {
            return state;
        }

        /**
         * This method can be overriden to remap the state key or modify the state value
         * @param key name of the key
         * @param state state
         */
        protected _filterStateKey(key: string, state: IViewStateSet): IFilteredState {
            return {
                filterApplied: false,
                key: null,
                state: null
            };
        }

        /**
         * This method can be overriden to remap the array state key or modify the state value
         * @param state
         */
        protected _filterStateArrayItem(key: string, index: number, length: number, state: IViewStateSet): IFilteredState {
            return {
                filterApplied: false,
                key: null,
                state: null
            };
        }

        protected _applyState(state: IViewStateSet): void {
            // perform the state filtering
            state = this._filterState(state);

            // apply the state
            if (state && state !== null) {
                for (var key in state) {
                    if (state.hasOwnProperty(key)) {

                        // perform the state key/value filtering
                        let filteredState: IFilteredState = this._filterStateKey(key, state[key]);
                        if (filteredState.filterApplied) {
                            delete state[key];
                            key = filteredState.key;
                            state[key] = filteredState.state;
                        }

                        // if the state property exists in this ViewComponent, update it
                        if (this.hasOwnProperty(key)) {
                            // update children component state
                            if (this[key] instanceof ViewComponent) {
                                (this[key] as ViewComponent).setState(state[key]);
                            } else {
                                // set or update array of children components
                                if (state[key] instanceof Array &&
                                    this.ajs.visualComponent.children.hasOwnProperty(key) &&
                                    this[key] instanceof Array) {

                                    // delete all components which does not exist in the array anymore
                                    let i: number = 0;
                                    while (i < this[key].length) {
                                        let del: boolean = true;

                                        // check if component still should exist
                                        for (let j: number = 0; j < state[key].length; j++) {
                                            if (this[key][i].key === state[key][j].key) {
                                                del = false;
                                                break;
                                            }
                                        }

                                        // delete component
                                        if (del) {
                                            (this[key][i] as ViewComponent).destroy();
                                            this.ajs.view.notifyParentsChildrenStateChange((this[key][i] as ViewComponent).ajs.parentComponent);
                                            this[key].splice(i, 1);
                                            if (this[key].length === 0) {
                                                this.ajs.stateKeys.splice(this.ajs.stateKeys.indexOf(key), 1);
                                            }
                                        } else {
                                            i++;
                                        }
                                    }

                                    // update and insert new components
                                    if (this.ajs.stateKeys.indexOf(key) === -1) {
                                        this.ajs.stateKeys.push(key);
                                    }

                                    for (i = 0; i < state[key].length; i++) {
                                        // update component state
                                        if (this[key].length > i && this[key][i].key === state[key][i].key) {
                                            (this[key][i] as ViewComponent).setState(state[key][i]);
                                        } else {
                                            // create new component
                                            let newViewComponent: ViewComponent =
                                                this._createViewComponent(key, this.ajs.visualComponent.children[key], state[key][i]);
                                            this[key].splice(i, 0, newViewComponent);
                                        }
                                    }
                                    // set or update current component property
                                } else {
                                    if (this.ajs.stateKeys.indexOf(key) === -1) {
                                        this.ajs.stateKeys.push(key);
                                    }
                                    if (this[key] !== state[key]) {
                                        this[key] = state[key];
                                        this.ajs.stateChanged = true;
                                        this.ajs.view.notifyParentsChildrenStateChange(this.ajs.parentComponent);
                                    }
                                }
                            }


                        // if the property does not exist, create it
                        } else {

                            // if the state is setting state of children component
                            if (this.ajs.visualComponent.children.hasOwnProperty(key)) {

                                // create array of components
                                if (state[key] instanceof Array) {

                                    this[key] = [];
                                    this.ajs.stateKeys.push(key);

                                    for (let i: number = 0; i < state[key].length; i++) {

                                        let filteredState: IFilteredState = this._filterStateArrayItem(key, i, state[key].length, state[key][i]);

                                        if (filteredState.filterApplied && filteredState.state instanceof Array) {

                                            let j: number = 0;
                                            while (j < filteredState.state.length) {
                                                let newViewComponent: ViewComponent;
                                                newViewComponent = this._createViewComponent(key, this.ajs.visualComponent.children[key], filteredState.state[j]);
                                                if (j === 0) {
                                                    this[key][i] = newViewComponent;
                                                } else {
                                                    if (i < state[key].length - 1) {
                                                        this[key].splice(i + 1, 0, newViewComponent);
                                                    } else {
                                                        this[key].push(newViewComponent);
                                                    }
                                                    i++;
                                                }
                                                j++;
                                            }

                                        } else {
                                            let newViewComponent: ViewComponent;
                                            newViewComponent = this._createViewComponent(key, this.ajs.visualComponent.children[key], filteredState.filterApplied && filteredState.key === key ? filteredState.state : state[key][i]);
                                            this[key][i] = newViewComponent;
                                        }


                                    }

                                // create a component and apply a state to it
                                } else {
                                    this[key] = this._createViewComponent(key, this.ajs.visualComponent.children[key], state[key]);
                                    this.ajs.stateKeys.push(key);

                                }

                            } else {

                                // if the state is array, try to filter the array and check if the state is applicable after array filtering
                                let filteredStates: IFilteredState[] = [];
                                if (state[key] instanceof Array) {
                                    for (let i: number = 0; i < state[key].length; i++) {
                                        let filteredState: IFilteredState = this._filterStateArrayItem(key, i, state[key].length, state[key][i]);
                                        if (filteredState.filterApplied) {
                                            if (filteredState.key !== key) {
                                                filteredStates.push(filteredState);
                                            }
                                        }
                                    }
                                }

                                // build a new filtered state
                                if (filteredStates.length > 0) {

                                    let filteredState: IViewStateSet = {};
                                    for (let i: number = 0; i < filteredStates.length; i++) {
                                        if (filteredState[filteredStates[i].key] === undefined) {
                                            filteredState[filteredStates[i].key] = [];
                                        }
                                        if (filteredStates[i].state instanceof Array) {
                                            for (let j: number = 0; j < (filteredStates[i].state as IViewStateSet[]).length; j++) {
                                                filteredState[filteredStates[i].key].push(filteredStates[i].state[j]);
                                            }
                                        } else {
                                           filteredState[filteredStates[i].key].push(filteredStates[i].state);
                                        }
                                    }

                                    // try to reapply the filtered state
                                    this._applyState(filteredState);



                                } else {

                                    this[key] = state[key];
                                    this.ajs.stateKeys.push(key);
                                    this.ajs.stateChanged = true;
                                    this.ajs.view.notifyParentsChildrenStateChange(this.ajs.parentComponent);

                                }

                            }
                        }

                    }
                }
            }

        }

        /*protected _createViewComponent(
            id: string,
            viewComponentInfo: ajs.templating.IVisualComponentChildInfo,
            state: IViewStateSet): Promise<ViewComponent> {

            let name: string = viewComponentInfo.tagName;
            if (name === "COMPONENT" && viewComponentInfo.nameAttribute) {
                name = viewComponentInfo.nameAttribute;
            }

            return this.ajsProperties.viewComponentManager.createViewComponent(name, id, this.ajsProperties.view, this, state);
        }*/

        protected _createViewComponent(id: string, viewComponentInfo: ajs.templating.IVisualComponentChildInfo, state: IViewStateSet): ViewComponent {

            let name: string = viewComponentInfo.tagName;
            if (name === "COMPONENT" && viewComponentInfo.nameAttribute) {
                name = viewComponentInfo.nameAttribute;
            }

            return this.ajs.viewComponentManager.createViewComponent(name, id, this.ajs.view, this, state);
        }


        /**
         * render the ViewComponent to the target element (appenChild is used to add the element)
         * @param parentElement element to be used as a parent for the component
         * @param usingShadowDom information if the render is performed to the main DOM or shadow DOM
         * @param clearStateChangeOnly informs renderer that rendering should not be done, just state changed flag should be cleared
         */
        public render(parentElement: HTMLElement, clearStateChangeOnly: boolean): HTMLElement {

            let node: Node;

            // render the tree of the visual component related to the current view component
            node = this._renderTree(this.ajs.visualComponent.component, parentElement, clearStateChangeOnly);

            // reset the dirty state after change
            this.ajs.stateChanged = false;

            // if the render was not called just because of reseting the state change flag
            // set view component data and return the view component
            if (!clearStateChangeOnly) {
                if (node instanceof HTMLElement) {

                    let componentNode: doc.INode = (node as Node) as doc.INode;
                    componentNode.ajsData = componentNode.ajsData || {} as any;
                    componentNode.ajsData.component = this;
                    componentNode.ajsData.ownerComponent = this;

                    return node;

                } else {

                    return null;

                }
            } else {
                return null;
            }

        }

        protected _renderTree(sourceNode: Node, targetNode: Node, clearStateChangeOnly: boolean): Node {

            let id: string = null;
            if (sourceNode.nodeType === Node.ELEMENT_NODE) {
                id = (sourceNode as HTMLElement).getAttribute("id");
            }

            // if the tag has attribute id, check if it is component or array of components
            if (id !== null && this[id] !== undefined && (this[id] instanceof ViewComponent || this[id] instanceof Array)) {

                // if it is a view component, render it
                if (this[id] instanceof ViewComponent) {
                    (this[id] as ViewComponent).render(targetNode as HTMLElement, clearStateChangeOnly);
                } else {
                    // if it is an array
                    if (this[id] instanceof Array) {
                        // go through it and render all view components existing in the array
                        for (let i: number = 0; i < this[id].length; i++) {
                            if (this[id][i] instanceof ViewComponent) {
                                (this[id][i] as ViewComponent).render(targetNode as HTMLElement, clearStateChangeOnly);
                            }
                        }
                    }
                }

            } else {
                // add node to target document (according to rules in the template)
                let addedNode: Node;

                if (clearStateChangeOnly) {
                    addedNode = null;
                } else {
                    addedNode = this._renderNode(sourceNode, targetNode);
                }

                // check if the node is root node of the view component and if the component and its
                // children components didn't change, just render it with skip flag and don't render
                // children tags

                let skip: boolean = sourceNode === this.ajs.visualComponent.component && !this.ajs.stateChanged;

                if (addedNode !== null && skip) {
                    (addedNode as doc.INode).ajsData = (addedNode as doc.INode).ajsData || {} as any;
                    (addedNode as doc.INode).ajsData.skipUpdate = true;
                }

                // if the node was added, go through all its children
                if (addedNode !== null && !skip) {
                    for (let i: number = 0; i < sourceNode.childNodes.length; i++) {
                        this._renderTree(sourceNode.childNodes.item(i), addedNode, false);
                    }
                // otherwise, no children compnents in this children branch will be rendered but it is necessary to
                // clear the _stateChange property on them
                } else {
                    for (let i: number = 0; i < sourceNode.childNodes.length; i++) {
                        this._renderTree(sourceNode.childNodes.item(i), null, true);
                    }
                }

                // return the added node - for the top level call it will be a root node of the view component
                return addedNode;
            }
        }


        /**
         * clone/adopt/process the node from the template and add it to the document
         * @param sourceNode node in the VisualComponent template
         * @param targetNode node in the targer document
         */
        protected _renderNode(sourceNode: Node, targetNode: Node): Node {
            let clonedNode: Node = sourceNode.cloneNode(false);
            let adoptedNode: Node = targetNode.ownerDocument.adoptNode(clonedNode);
            let processedNode: Node = this._processNode(adoptedNode);
            if (processedNode && processedNode !== null) {
                if (processedNode instanceof HTMLElement) {
                    ((processedNode as Node) as doc.INode).ajsData = ((processedNode as Node) as doc.INode).ajsData || {} as any;
                    ((processedNode as Node) as doc.INode).ajsData.ownerComponent = this;
                }
                targetNode.appendChild(processedNode);
            }
            return processedNode;
        }

        /**
         * process the node - see _processText and _processElement methods bellow for detail
         * @param node The node in the template to be processed
         */
        protected _processNode(node: Node): Node {
            switch (node.nodeType) {
                case Node.ELEMENT_NODE:
                    return this._processElement(node as HTMLElement);
                case Node.TEXT_NODE:
                    return this._processText(node);
            }
        }

        /**
         * replace all template {} tags with the state value from the ViewComponent appropriate property
         * @param node
         */
        protected _processText(node: Node): Node {
            // extract all state property names from the template tag
            let props: string[] = node.nodeValue.match(/{(.*?)}/g);
            // and if any, locate them in state and replace the template text to state data
            if (props !== null) {
                // for all discovered state property names
                for (let i: number = 0; i < props.length; i++) {
                    // use only the name without {} characters
                    let propName: string = props[i].substring(1, props[i].length - 1);
                    // locate the property name in the view component and set the correct value to the text node
                    if (this[propName] !== undefined && this[propName] !== null) {
                        node.nodeValue = node.nodeValue.replace(props[i], this[propName]);
                    } else {
                        node.nodeValue = node.nodeValue.replace(props[i], "");
                    }
                }
            }
            // if there is HTML in the node, replace the node by the HTML
            if (node.nodeValue.substr(0, 8) === "#ASHTML:") {
                let asHtml: HTMLElement = document.createElement("ashtml");
                asHtml.innerHTML = node.nodeValue.substr(8);
                node = asHtml;
            }

            return node;
        }

        protected _linkMouseDown(e: MouseEvent): void {
            e.returnValue = ajs.Framework.navigator.linkClicked(e);
            if (!e.returnValue) {
                e.cancelBubble = true;
                e.preventDefault();
                e.stopPropagation();
            }
        }

        /**
         * process the template tag
         * @param element Template element to be processed
         */
        protected _processElement(element: HTMLElement): HTMLElement {
            element = this._processAttributes(element);

            if (element instanceof HTMLAnchorElement) {

                if (element.hasAttribute("href")) {

                    let href: string = element.getAttribute("href");
                    if (href.substr(0, 4) !== "http") {

                        let domEventListenerInfo: doc.INodeEventListenerInfo = {
                            source: (this.ajs.templateElement as Node) as doc.INode,
                            eventType: "mousedown",
                            eventListener: (e: MouseEvent) => { this._linkMouseDown(e) }
                        };

                        let node: doc.INode = (element as Node) as doc.INode;
                        node.ajsData = node.ajsData || {} as any;

                        if (!(node.ajsData.eventListeners instanceof Array)) {
                            node.ajsData.eventListeners = [];
                        }

                        node.ajsData.eventListeners.push(domEventListenerInfo);

                        domEventListenerInfo = {
                            source: (this.ajs.templateElement as Node) as doc.INode,
                            eventType: "click",
                            eventListener: (e: MouseEvent) => {
                                e.returnValue = false;
                                e.cancelBubble = true;
                                e.preventDefault();
                                e.stopPropagation();
                            }
                        };

                        node.ajsData.eventListeners.push(domEventListenerInfo);
                    }
                }
            }

            return element;
        }

        /**
         * process the template tag attributes
         * if the attribute processor returns false the element will be removed from further rendering
         * @param element
         */
        protected _processAttributes(element: HTMLElement): HTMLElement {
            let toRemove: string[] = [];
            for (let i: number = 0; i < element.attributes.length; i++) {
                if (this.ajs.attributeProcessors[element.attributes[i].nodeName] !== undefined) {
                    if (!this.ajs.attributeProcessors[element.attributes[i].nodeName].call(this, toRemove, element.attributes[i])) {
                        return null;
                    }
                } else {
                    if (!this.ajs.attributeProcessors.__default.call(this, toRemove, element.attributes[i])) {
                        return null;
                    }
                }
            }

            for (let i: number = 0; i < toRemove.length; i++) {
                element.removeAttribute(toRemove[i]);
                if (element.hasOwnProperty(toRemove[i])) {
                    element[toRemove[i]] = null;
                }
            }
            return element;
        }

        protected _attrComponent(toRemove: string[], attr: Attr): boolean {
            toRemove.push(attr.nodeName);
            return true;
        }

        protected _attrIf(toRemove: string[], attr: Attr): boolean {

            let condition: string = attr.nodeValue;
            try {
                /* tslint:disable */
                if (!eval(condition)) {
                /* tslint:enable */
                    return false;
                }
            } catch (e) {
                throw new InvalidAttributeIfValueException(e);
            }
            toRemove.push(attr.nodeName);
            return true;
        }

        protected _attrDefault(toRemove: string[], attr: Attr): boolean {
            let props: string[] = attr.nodeValue.match(/{(.*?)}/);
            if (props !== null) {
                let propName: string = props[1];
                if (this[propName] !== undefined && this[propName] !== null) {
                    attr.nodeValue = attr.nodeValue.replace(props[0], this[propName]);
                } else {
                    toRemove.push(attr.nodeName);
                }
            }
            return true;
        }

        protected _attrEventHandler(toRemove: string[], attr: Attr): boolean {
            toRemove.push(attr.nodeName);
            if (this[attr.nodeValue] !== undefined && typeof this[attr.nodeValue] === "function") {

                let eventType: string = attr.nodeName.substring(2);

                if (eventType.indexOf("_ajs") !== -1) {
                    eventType = eventType.substr(0, eventType.indexOf("_ajs"));
                }

                let eventHandlerName: string = attr.nodeValue;
                let listener: EventListener = (e: Event): void => {
                    this[eventHandlerName](e);
                };

                let domEventListenerInfo: doc.INodeEventListenerInfo = {
                    source: (this.ajs.templateElement as Node) as doc.INode,
                    eventType: eventType,
                    eventListener: listener
                };

                let node: doc.INode = (attr.ownerElement as Node) as doc.INode;
                node.ajsData = node.ajsData || {} as any;

                if (!(node.ajsData.eventListeners instanceof Array)) {

                    node.ajsData.eventListeners = [];
                }

                node.ajsData.eventListeners.push(domEventListenerInfo);
            }
            return true;
        }

        protected _attrTransitionBeginHanler(toRemove: string[], attr: Attr): boolean {
            if (this[attr.nodeValue] !== undefined && typeof this[attr.nodeValue] === "function") {
                this.ajs.hasVisualStateTransition = true;
                this.ajs.visualStateTransitionBeginHandler = this[attr.nodeValue];
            }
            toRemove.push(attr.nodeName);
            return true;
        }

        public insertChildComponent(
            viewComponentName: string,
            id: string,
            state: IViewStateSet,
            placeholder: string,
            index?: number): void {

            if (state === null) {
                state = {};
            }

            let visualComponent: IVisualComponent;
            visualComponent = this.ajs.viewComponentManager.templateManager.getVisualComponent(viewComponentName);

            if (visualComponent === null) {
                throw new ajs.mvvm.view.VisualComponentNotRegisteredException(viewComponentName);
            }

            this._visualComponentInsertChild(placeholder, viewComponentName, id, index);

            var thisState: IViewStateSet = {};
            thisState[id] = state;

            this.setState(thisState);
        }

        public removeChildComponent(placeholder: string, id: string): void {

            if (this.hasOwnProperty(id) && this[id] instanceof ViewComponent) {

                this._visualComponentRemoveChild(placeholder, id);

                this[id]._destroy();
                delete this[id];
                let i: number = this.ajs.stateKeys.indexOf(id);
                if (i !== -1) {
                    this.ajs.stateKeys.splice(i, 1);
                }
            }
        }

        protected _visualComponentInsertChild(placeholder: string, componentName: string, id: string, index?: number): void {

            if (this.ajs.visualComponent.placeholders.hasOwnProperty(placeholder)) {

                let ph: HTMLElement = this.ajs.visualComponent.placeholders[placeholder].placeholder;

                let vc: HTMLElement = ph.ownerDocument.createElement(componentName);
                vc.setAttribute("id", id);

                if (index !== undefined) {
                    // !!!!!!
                } else {
                    ph.appendChild(vc);
                }

                this.ajs.visualComponent.children[id] = {
                    tagName: componentName,
                    nameAttribute: null
                };
            }
        }

        protected _visualComponentRemoveChild(placeholder: string, id: string): void {

            if (this.ajs.visualComponent.placeholders.hasOwnProperty(placeholder)) {

                let ph: HTMLElement = this.ajs.visualComponent.placeholders[placeholder].placeholder;
                let vc: HTMLElement = null;

                for (let i: number = 0; i < ph.childElementCount; i++) {
                    if (ph.children.item(i).hasAttribute("id") && ph.children.item(i).getAttribute("id") === id) {
                        vc = ph.children.item(i) as HTMLElement;
                        break;
                    }
                }

                if (vc !== null) {
                    ph.removeChild(vc);
                    delete this.ajs.visualComponent.children[id];
                }

            }
        }

        public ajsVisualStateTransitionBegin(newElement: Element): void {

            if (this.ajs.visualStateTransitionRunning) {
                this._ajsVisualStateTransitionCancel();
            }

            this.ajs.visualStateTransitionRunning = true;
            // this.ajsProperties.view.preventStateChange.push(this);

            this.ajs.transitionNewElement = newElement;

            if (typeof this.ajs.visualStateTransitionBeginHandler === "function") {
                let transitionType: ITransitionType = this.ajs.visualStateTransitionBeginHandler.call(this);
                if (transitionType !== null) {
                    this._ajsVisualStateTransitionStart(transitionType);
                } else {
                    this._ajsVisualStateTransitionEnd();
                }
            } else {
                this._ajsVisualStateTransitionEnd();
            }

        }

        protected _ajsVisualStateTransitionStart(transitionType: ITransitionType): void {

            if (this.ajs.transitionOldElement instanceof HTMLElement &&
                this.ajs.transitionNewElement instanceof HTMLElement) {

                this.ajs.transitionNewElement.parentElement.insertBefore(
                    this.ajs.transitionOldElement,
                    this.ajs.transitionNewElement
                );

                this.ajs.transitionOldElement.setAttribute("statetransitiontypeold", transitionType.oldComponent);
                this.ajs.transitionNewElement.setAttribute("statetransitiontypenew", transitionType.newComponent);

            }
        }

        protected _ajsVisualStateTransitionCancel(): void {

            if (this.ajs.transitionNewElement) {
                this._ajsVisualStateTransitionEnd();
            }

        }

        protected _ajsVisualStateTransitionEnd(): void {

            if (this.ajs.visualStateTransitionRunning &&
                this.ajs.transitionOldElement instanceof HTMLElement &&
                this._childElementExists(this.ajs.transitionOldElement.parentElement, this.ajs.transitionOldElement)) {

                this.ajs.transitionOldElement.removeAttribute("statetransitiontypeold");
                this.ajs.transitionNewElement.removeAttribute("statetransitiontypenew");
            }

            this.ajs.view.documentManager.removeNode(this.ajs.transitionOldElement);

            this.ajs.transitionOldElement = null;
            this.ajs.transitionNewElement = null;

            /*if (this.ajsProperties.view.preventStateChange.indexOf(this) !== -1) {
                this.ajsProperties.view.preventStateChange.splice(
                    this.ajsProperties.view.preventStateChange.indexOf(this),
                    1
                );
            }*/

            this.ajs.visualStateTransitionRunning = false;

        }

        protected _childElementExists(parent: HTMLElement, child: HTMLElement): boolean {
            if (parent instanceof HTMLElement) {
                for (let i: number = 0; i < parent.childNodes.length; i++) {
                    if (parent.childNodes.item(i) === child) {
                        return true;
                    }
                }
            }
            return false;
        }

    }

}