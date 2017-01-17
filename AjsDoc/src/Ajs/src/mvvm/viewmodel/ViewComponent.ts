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

namespace ajs.mvvm.viewmodel {

    "use strict";

    import IVisualComponent = ajs.templating.IVisualComponent;

    export interface IDomEventListenerInfo {
        /** Indicates if the listener was added to the element */
        registered: boolean;
        /** Element in the main document or in the shadow DOM - if in shadow DOM its overwritten by View to document element */
        element: Element;
        /** Event type to be registered or registered already */
        eventType: string;
        /** Event listener */
        listener: EventListener;
    }

    export interface IComponentElement extends Element {
        ajsComponent?: ViewComponent;
        ajsOwnerComponent?: ViewComponent;
        ajsSkipUpdate?: boolean;
        ajsEventListeners?: IDomEventListenerInfo[];
    }

    export class ViewComponent {

        protected _ajsid: string;
        public get ajsid(): string { return this._ajsid; }

        protected _ajsComponentId: number;
        public get ajsComponentId(): number { return this._ajsComponentId; }

        protected _ajsView: view.View;
        public get ajsView(): view.View { return this._ajsView; }

        protected _ajsViewComponentManager: ViewComponentManager;
        public get ajsViewComponentManager(): ViewComponentManager { return this._ajsViewComponentManager; }

        protected _ajsParentComponent: ViewComponent;
        public get ajsParentComponent(): ViewComponent { return this._ajsParentComponent; }

        protected _ajsVisualComponent: ajs.templating.IVisualComponent;
        public get ajsVisualComponent(): ajs.templating.IVisualComponent { return this._ajsVisualComponent; }

        protected _ajsStateKeys: string[];
        public get ajsStateKeys(): string[] { return this._ajsStateKeys; }

        protected _domEventListeners: IDomEventListenerInfo[];
        public get domEventListeners(): IDomEventListenerInfo[] { return this._domEventListeners; }

        protected _ajsStateChanged: boolean;
        public get ajsStateChanged(): boolean { return this._ajsStateChanged; }
        public ajsResetStateChanged(): void { this._ajsStateChanged = false; }
        public ajsSetStateChanged(): void { this._ajsStateChanged = true; }

        protected _ajsElement: HTMLElement;
        public get ajsElement(): HTMLElement { return this._ajsElement; }
        public set ajsElement(element: HTMLElement) { this._ajsElement = element; };

        protected _ajsVisualStateTransition: boolean;
        protected _ajsVisualStateTransitionRunning: boolean;
        protected _ajsTransitionOldElement: HTMLElement;
        protected _ajsTransitionNewElement: HTMLElement;
        public get ajsVisualStateTransition(): boolean { return this._ajsVisualStateTransition; }

        protected _ajsAttributeProcessors: IAttributeProcessorsCollection;

        /** Prepared for arrayed components but never initialized so hasOwnProperty must be used to check */
        public key: string;

        public constructor(
            view: view.View,
            viewComponentManager: ViewComponentManager,
            id: string,
            parentComponent: ViewComponent,
            visualComponent: ajs.templating.IVisualComponent,
            state?: IViewStateSet) {

            /*console.warn("IMPLEMENT: ajs.mvvm.viewmodel.ViewComponent - Navigation event notification processig");
            console.warn("IMPLEMENT: ajs.mvvm.viewmodel.ViewComponent - Event registration and handling");*/

            // throw exception if the visual component was not assigned
            if (visualComponent === null) {
                throw new ajs.mvvm.view.VisualComponentNotRegisteredException(null);
            }

            // initialize properties
            this._ajsid = id;
            this._ajsComponentId = view.getComponentId;
            this._ajsView = view;
            this._ajsViewComponentManager = viewComponentManager;
            this._ajsParentComponent = parentComponent;
            this._ajsVisualComponent = visualComponent;
            this._ajsElement = null;
            this._ajsStateKeys = [];
            this._domEventListeners = [];

            this._ajsVisualStateTransition = false;
            this._ajsVisualStateTransitionRunning = false;

            // register instance to the ViewComponentManager for simple lookups
            ajs.Framework.viewComponentManager.registerComponentInstance(this);

            // setup tag attribute processors for the_processAttributes method
            this._ajsAttributeProcessors = {
                "__default": <IAttributeProcessor>this._attrDefault,
                "component": <IAttributeProcessor>this._attrComponent,
                "if": <IAttributeProcessor>this._attrIf,
                "onclick": <IAttributeProcessor>this._attrEventHandler,
                "onmousedown": <IAttributeProcessor>this._attrEventHandler,
                "onmouseup": <IAttributeProcessor>this._attrEventHandler,
                "onkeydown": <IAttributeProcessor>this._attrEventHandler,
                "onkeyup": <IAttributeProcessor>this._attrEventHandler,
                "onchange": <IAttributeProcessor>this._attrEventHandler,
                "oninput": <IAttributeProcessor>this._attrEventHandler
            };

            // apply passed or default state
            if (state && state !== null) {
                let newState: IViewStateSet = ajs.utils.DeepMerge.merge(this._defaultState(), state);
                ajs.utils.Obj.assign(state, newState);
                this._applyState(state);
            } else {
                this._applyState(this._defaultState());
            }

            // indicate the state was changed
            this._ajsStateChanged = true;

            // ???????????????????????????????????????????????????????????????
            this._ajsView.notifyParentsChildrenStateChange(this._ajsParentComponent);
            // ???????????????????????????????????????????????????????????????

            this._initialize();
        }


        protected _initialize(): void {
            return;
        }

        protected _destroy(): void {
            // unregister all event listeners
            for (let i: number = 0; i < this._domEventListeners.length; i++) {
                if (this._domEventListeners[i].registered) {
                    this._domEventListeners[i].element.removeEventListener(
                        this._domEventListeners[i].eventType,
                        this._domEventListeners[i].listener
                    );
                }
            }

            // remove all children components
            this.clearState(false);

            // finalize the component
            this._finalize();

            // if the component was rendered, remove it from the DOM tree
            if (this.ajsElement !== undefined && this.ajsElement !== null) {
                this.ajsElement.parentElement.removeChild(this.ajsElement);
            }

            // unregister component instance from ViewComponent manager
            ajs.Framework.viewComponentManager.removeComponentInstance(this);

        };

        protected _finalize(): void {
            return;
        }

        protected _defaultState(): IViewStateSet {
            return {};
        }

        public setState(state: IViewStateSet): void {

            if (this._ajsVisualStateTransition) {
                if (this._ajsElement instanceof HTMLElement &&
                    this._childElementExists(this._ajsElement.parentElement, this._ajsElement)) {

                    if (this._ajsVisualStateTransitionRunning) {
                        this._ajsVisualStateTransitionCancel();
                    }

                    this._ajsTransitionOldElement = this._ajsElement.cloneNode(true) as HTMLElement;
                } else {
                    this._ajsTransitionOldElement = null;
                }
            }

            this._ajsView._stateChangeBegin(this);
            this._applyState(state);
            this._ajsView._stateChangeEnd(this);
        }

        /**
         * Removes all state properties and destroys children component tree
         * @param render
         */
        public clearState(render: boolean): void {
            if (render) {
                this._ajsView._stateChangeBegin(this);
            }

            while (this._ajsStateKeys.length > 0) {
                if (this[this._ajsStateKeys[0]] instanceof ViewComponent) {
                    this[this._ajsStateKeys[0]]._destroy();
                }
                if (this[this._ajsStateKeys[0]] instanceof Array) {
                    for (let i: number = 0; i < this[this._ajsStateKeys[0]].length; i++) {
                        if (this[this._ajsStateKeys[0]][i] instanceof ViewComponent) {
                            this[this._ajsStateKeys[0]][i]._destroy();
                        }
                    }
                }
                delete (this[this._ajsStateKeys[0]]);
                this._ajsStateKeys.splice(0, 1);
            }

            if (render) {
                this._ajsStateChanged = true;
                this._ajsView._stateChangeEnd(this);
            }
        }

        public getDomEventListeners(element: Element): IDomEventListenerInfo[] {
            let listeners: IDomEventListenerInfo[] = [];
            for (let i: number = 0; i < this._domEventListeners.length; i++) {
                if (this._domEventListeners[i].element === element) {
                    listeners.push(this._domEventListeners[i]);
                }
            }
            return listeners;
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
                                    this._ajsVisualComponent.children.hasOwnProperty(key) &&
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
                                            (this[key][i] as ViewComponent)._destroy();
                                            this._ajsView.notifyParentsChildrenStateChange((this[key][i] as ViewComponent)._ajsParentComponent);
                                            this[key].splice(i, 1);
                                            if (this[key].length === 0) {
                                                this._ajsStateKeys.splice(this._ajsStateKeys.indexOf(key), 1);
                                            }
                                        } else {
                                            i++;
                                        }
                                    }

                                    // update and insert new components
                                    if (this.ajsStateKeys.indexOf(key) === -1) {
                                        this._ajsStateKeys.push(key);
                                    }

                                    for (i = 0; i < state[key].length; i++) {
                                        // update component state
                                        if (this[key].length > i && this[key][i].key === state[key][i].key) {
                                            (this[key][i] as ViewComponent).setState(state[key][i]);
                                        } else {
                                            // create new component
                                            let newViewComponent: ViewComponent =
                                                this._createViewComponent(key, this._ajsVisualComponent.children[key], state[key][i]);
                                            this[key].splice(i, 0, newViewComponent);
                                        }
                                    }
                                    // set or update current component property
                                } else {
                                    if (this._ajsStateKeys.indexOf(key) === -1) {
                                        this._ajsStateKeys.push(key);
                                    }
                                    if (this[key] !== state[key]) {
                                        this[key] = state[key];
                                        this._ajsStateChanged = true;
                                        this._ajsView.notifyParentsChildrenStateChange(this._ajsParentComponent);
                                    }
                                }
                            }


                        // if the property does not exist, create it
                        } else {

                            // if the state is setting state of children component
                            if (this._ajsVisualComponent.children.hasOwnProperty(key)) {

                                // create array of components
                                if (state[key] instanceof Array) {

                                    this[key] = [];
                                    this.ajsStateKeys.push(key);

                                    for (let i: number = 0; i < state[key].length; i++) {

                                        let filteredState: IFilteredState = this._filterStateArrayItem(key, i, state[key].length, state[key][i]);

                                        let newViewComponent: ViewComponent;
                                        newViewComponent = this._createViewComponent(key, this._ajsVisualComponent.children[key], filteredState.filterApplied && filteredState.key === key ? filteredState.state : state[key][i]);

                                        this[key][i] = newViewComponent;

                                    }

                                // create a component and apply a state to it
                                } else {
                                    this[key] = this._createViewComponent(key, this._ajsVisualComponent.children[key], state[key]);
                                    this.ajsStateKeys.push(key);

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
                                    this._ajsStateKeys.push(key);
                                    this._ajsStateChanged = true;
                                    this._ajsView.notifyParentsChildrenStateChange(this._ajsParentComponent);

                                }

                            }
                        }

                    }
                }
            }

        }

        protected _createViewComponent(id: string, viewComponentInfo: ajs.templating.IVisualComponentChildInfo, state: IViewStateSet): ViewComponent {

            let name: string = viewComponentInfo.tagName;
            if (name === "COMPONENT" && viewComponentInfo.nameAttribute) {
                name = viewComponentInfo.nameAttribute;
            }

            let viewComponentConstructor: typeof ViewComponent;
            viewComponentConstructor = this._ajsView.viewComponentManager.getComponentConstructorByName(name);

            if (viewComponentConstructor === null) {
                viewComponentConstructor = ViewComponent;
            }

            let visualComponent: IVisualComponent;
            visualComponent = this._ajsView.templateManager.getVisualComponent(name);

            if (visualComponent === null) {
                throw new ajs.mvvm.view.VisualComponentNotRegisteredException(name);
            }

            return new viewComponentConstructor(this._ajsView, this._ajsViewComponentManager, id, this, visualComponent, state);
        }

        /**
         * render the ViewComponent to the target element (appenChild is used to add the element)
         * @param parentElement element to be used as a parent for the component
         * @param usingShadowDom information if the render is performed to the main DOM or shadow DOM
         * @param clearStateChangeOnly informs renderer that rendering should not be done, just state changed flag should be cleared
         */
        public render(parentElement: HTMLElement, usingShadowDom: boolean, clearStateChangeOnly: boolean): HTMLElement {

            let node: Node;

            // render the tree of the visual component related to the current view component
            node = this._renderTree(this._ajsVisualComponent.component, parentElement, usingShadowDom, clearStateChangeOnly);

            // reset the dirty state after change
            this._ajsStateChanged = false;

            // if the render was not just because of reseting the state change flag
            // set view component data and return the view component
            if (!clearStateChangeOnly) {
                if (node instanceof HTMLElement) {

                    let componentElement: IComponentElement = node as Element;
                    componentElement.ajsComponent = this;
                    componentElement.ajsOwnerComponent = this;

                    if (!usingShadowDom) {
                        this._ajsElement = node as HTMLElement;

                        for (let i: number = 0; i < this._domEventListeners.length; i++) {
                            this._domEventListeners[i].element.addEventListener(
                                this._domEventListeners[i].eventType,
                                this._domEventListeners[i].listener
                            );
                            this._domEventListeners[i].registered = true;
                        }
                    }

                    return node;

                } else {

                    return null;

                }
            } else {
                return null;
            }

        }

        protected _renderTree(sourceNode: Node, targetNode: Node, usingShadowDom: boolean, clearStateChangeOnly: boolean): Node {

            let id: string = null;
            if (sourceNode.nodeType === Node.ELEMENT_NODE) {
                id = (sourceNode as HTMLElement).getAttribute("id");
            }

            // if the tag has attribute id, check if it is component or array of components
            if (id !== null && this[id] !== undefined && (this[id] instanceof ViewComponent || this[id] instanceof Array)) {

                // if it is a view component, render it
                if (this[id] instanceof ViewComponent) {
                    (this[id] as ViewComponent).render(targetNode as HTMLElement, usingShadowDom, clearStateChangeOnly);
                } else {
                    // if it is an array
                    if (this[id] instanceof Array) {
                        // go through it and render all view components existing in the array
                        for (let i: number = 0; i < this[id].length; i++) {
                            if (this[id][i] instanceof ViewComponent) {
                                (this[id][i] as ViewComponent).render(targetNode as HTMLElement, usingShadowDom, clearStateChangeOnly);
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

                let skip: boolean = sourceNode === this._ajsVisualComponent.component && !this._ajsStateChanged;

                if (addedNode !== null && skip) {
                    (addedNode as IComponentElement).ajsSkipUpdate = true;
                }

                // if the node was added, go through all its children
                if (addedNode !== null && !skip) {
                    for (let i: number = 0; i < sourceNode.childNodes.length; i++) {
                        this._renderTree(sourceNode.childNodes.item(i), addedNode, usingShadowDom, false);
                    }
                // otherwise, no children compnents in this children branch will be rendered but it is necessary to
                // clear the _stateChange property on them
                } else {
                    for (let i: number = 0; i < sourceNode.childNodes.length; i++) {
                        this._renderTree(sourceNode.childNodes.item(i), null, usingShadowDom, true);
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
                    (processedNode as IComponentElement).ajsOwnerComponent = this;
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
                        href = "javascript:ajs.Framework.navigator.navigate('" + href + "')";
                        element.setAttribute("href", href);
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
                if (this._ajsAttributeProcessors[element.attributes[i].nodeName] !== undefined) {
                    if (!this._ajsAttributeProcessors[element.attributes[i].nodeName].call(this, toRemove, element.attributes[i])) {
                        return null;
                    }
                } else {
                    if (!this._ajsAttributeProcessors.__default.call(this, toRemove, element.attributes[i])) {
                        return null;
                    }
                }
            }

            for (let i: number = 0; i < toRemove.length; i++) {
                element.removeAttribute(toRemove[i]);
            }
            return element;
        }

        protected _attrComponent(toRemove: string[], attr: Attr): boolean {
            toRemove.push(attr.nodeName);
            return true;
        }

        protected _attrIf(toRemove: string[], attr: Attr): boolean {

            let condition: string = attr.nodeValue;
            if (!eval(condition)) {
                return false;
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
                let eventHandlerName: string = attr.nodeValue;

                let domEventListenerInfo: IDomEventListenerInfo = {
                    registered: false,
                    element: attr.ownerElement,
                    eventType: eventType,
                    listener: (e: Event): void => {
                        this[eventHandlerName](e);
                    }
                };

                this._domEventListeners.push(domEventListenerInfo);

                let componentElement: IComponentElement = attr.ownerElement as IComponentElement;
                if (!(componentElement.ajsEventListeners instanceof Array)) {
                    componentElement.ajsEventListeners = [];
                }
                componentElement.ajsEventListeners.push(domEventListenerInfo);
            }
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
            visualComponent = this._ajsView.templateManager.getVisualComponent(viewComponentName);

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
                let i: number = this._ajsStateKeys.indexOf(id);
                if (i !== -1) {
                    this._ajsStateKeys.splice(i, 1);
                }
            }
        }

        protected _visualComponentInsertChild(placeholder: string, componentName: string, id: string, index?: number): void {
            if (this._ajsVisualComponent.placeholders.hasOwnProperty(placeholder)) {

                let ph: HTMLElement = this._ajsVisualComponent.placeholders[placeholder].placeholder;

                let vc: HTMLElement = ph.ownerDocument.createElement(componentName);
                vc.setAttribute("id", id);

                if (index !== undefined) {
                    // !!!!!!
                } else {
                    ph.appendChild(vc);
                }

                this._ajsVisualComponent.children[id] = {
                    tagName: componentName,
                    nameAttribute: null
                };
            }
        }

        protected _visualComponentRemoveChild(placeholder: string, id: string): void {
            if (this._ajsVisualComponent.placeholders.hasOwnProperty(placeholder)) {

                let ph: HTMLElement = this._ajsVisualComponent.placeholders[placeholder].placeholder;
                let vc: HTMLElement = null;

                for (let i: number = 0; i < ph.childElementCount; i++) {
                    if (ph.children.item(i).hasAttribute("id") && ph.children.item(i).getAttribute("id") === id) {
                        vc = ph.children.item(i) as HTMLElement;
                        break;
                    }
                }

                if (vc !== null) {
                    ph.removeChild(vc);
                    delete this._ajsVisualComponent.children[id];
                }

            }
        }

        public ajsVisualStateTransitionBegin(newElement: HTMLElement): void {

            this._ajsVisualStateTransitionRunning = true;

            this._ajsTransitionNewElement = newElement;

        }

        protected _ajsVisualStateTransitionCancel(): void {
            throw new NotImplementedException();
        }

        protected _visualStateTransitionEnd(): void {
            if (this._ajsTransitionOldElement instanceof HTMLElement &&
                this._childElementExists(this._ajsTransitionOldElement.parentElement, this._ajsTransitionOldElement)) {

                this._ajsTransitionOldElement.parentNode.removeChild(this._ajsTransitionOldElement);
            }
            this._ajsVisualStateTransitionRunning = false;
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