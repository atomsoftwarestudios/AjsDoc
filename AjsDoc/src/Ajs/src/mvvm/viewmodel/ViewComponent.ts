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

    export class ViewComponent {

        protected _componentId: number;
        public get componentId(): number { return this._componentId; }

        protected _view: View;
        public get view(): View { return this.view; }

        protected _parentComponent: ViewComponent;
        public get parentComponent(): ViewComponent { return this._parentComponent; }

        protected _visualComponent: ajs.templating.IVisualComponent;
        public get visualComponent(): ajs.templating.IVisualComponent { return this._visualComponent; }

        protected _stateKeys: string[];
        public get stateKeys(): string[] { return this._stateKeys; }

        protected _stateChanged: boolean;
        public get stateChanged(): boolean { return this._stateChanged; }
        public resetStateChanged(): void { this._stateChanged = false; }
        public setStateChanged(): void { this._stateChanged = true; }

        protected _element: HTMLElement;
        public get element(): HTMLElement { return this._element; }
        public set element(element: HTMLElement) { this._element = element; };

        protected _attributeProcessors: IAttributeProcessorsCollection;

        public constructor(
            view: View,
            parentComponent: ViewComponent,
            visualComponent: ajs.templating.IVisualComponent,
            state?: IViewState) {

            /*console.warn("IMPLEMENT: ajs.mvvm.viewmodel.ViewComponent - Navigation event notification processig");
            console.warn("IMPLEMENT: ajs.mvvm.viewmodel.ViewComponent - Event registration and handling");*/

            // throw exception if the visual component was not assigned
            if (visualComponent === null) {
                throw new VisualComponentNotRegisteredException(null);
            }

            // initialize properties
            this._componentId = view.getComponentId;
            this._view = view;
            this._parentComponent = parentComponent;
            this._visualComponent = visualComponent;
            this._element = null;
            this._stateKeys = [];

            // register instance to the ViewComponentManager for simple lookups
            ajs.Framework.viewComponentManager.registerComponentInstance(this);

            // setup tag attribute processors for the_processAttributes method
            this._attributeProcessors = {
                "__default": <IAttributeProcessor>this._attrDefault,
                "component": <IAttributeProcessor>this._attrComponent,
                "if": <IAttributeProcessor>this._attrIf,
                "onclick": <IAttributeProcessor>this._attrEventHandler,
                "onkeydown": <IAttributeProcessor>this._attrEventHandler,
                "onkeyup": <IAttributeProcessor>this._attrEventHandler,
                "onchange": <IAttributeProcessor>this._attrEventHandler,
                "oninput": <IAttributeProcessor>this._attrEventHandler
            };

            // apply passed or default state
            if (state && state !== null) {
                let newState: IViewState = ajs.utils.DeepMerge.merge(this._defaultState(), state);
                ajs.utils.Obj.assign(state, newState);
                this._applyState(state);
            } else {
                this._applyState(this._defaultState());
            }

            // indicate the state was changed
            this._stateChanged = true;

            // ???????????????????????????????????????????????????????????????
            this._view.notifyParentsChildrenStateChange(this._parentComponent);
            // ???????????????????????????????????????????????????????????????

            this._initialize();
        }


        protected _initialize(): void {
            return;
        }

        protected _destroy(): void {
            // finalize the component
            this._finalize();

            // if the component was rendered, remove it from the DOM tree
            if (this.element !== undefined && this.element !== null) {
                this.element.parentElement.removeChild(this.element);
            }

            // unregister component instance from ViewComponent manager
            ajs.Framework.viewComponentManager.removeComponentInstance(this);

        };

        protected _finalize(): void {
            return;
        }

        protected _defaultState(): IViewState {
            return {};
        }

        public setState(state: IViewState): void {
            this._view._stateChangeBegin(this);
            this._applyState(state);
            this._view._stateChangeEnd(this);
        }


        protected _applyState(state: IViewState): void {
            if (state && state !== null) {
                for (var key in state) {
                    // if the property exists, update it
                    if (this.hasOwnProperty(key)) {
                        // update children component state
                        if (this[key] instanceof ViewComponent) {
                            (this[key] as ViewComponent).setState(state[key]);
                        } else {
                            // set or update array of children components
                            if (state[key] instanceof Array &&
                                this._visualComponent.children.hasOwnProperty(key) &&
                                this[key] instanceof Array) {

                                // update and insert new components
                                if (this.stateKeys.indexOf(key) === -1) {
                                    this._stateKeys.push(key);
                                }

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
                                        this._stateKeys.splice(this._stateKeys.indexOf(key), 1);
                                        (this[key][i] as ViewComponent)._destroy();
                                        this._view.notifyParentsChildrenStateChange((this[key][i] as ViewComponent)._parentComponent);
                                        this[key].splice(i, 1);
                                    } else {
                                        i++;
                                    }
                                }

                                for (i = 0; i < state[key].length; i++) {
                                    // update component state
                                    if (this[key].length > i && this[key][i].key === state[key][i].key) {
                                        (this[key][i] as ViewComponent).setState(state[key][i]);
                                        // create new component
                                    } else {
                                        let newViewComponent: ViewComponent =
                                            this._createViewComponent(this._visualComponent.children[key], state[key][i]);
                                        this[key].splice(i, 0, newViewComponent);
                                    }
                                }
                                // set or update current component property
                            } else {
                                if (this._stateKeys.indexOf(key) === -1) {
                                    this._stateKeys.push(key);
                                }
                                if (this[key] !== state[key]) {
                                    this[key] = state[key];
                                    this._stateChanged = true;
                                    this._view.notifyParentsChildrenStateChange(this._parentComponent);
                                }
                            }
                        }


                    // if the property does not exist, create it
                    } else {

                        // if the state is setting state of children component
                        if (this._visualComponent.children.hasOwnProperty(key)) {

                            // create array of components
                            if (state[key] instanceof Array) {

                                this[key] = [];
                                this.stateKeys.push(key);

                                for (let i: number = 0; i < state[key].length; i++) {

                                    let newViewComponent: ViewComponent;
                                    newViewComponent = this._createViewComponent(this._visualComponent.children[key], state[key][i]);

                                    this[key][i] = newViewComponent;

                                }

                            // create a component and apply a state to it
                            } else {
                                this[key] = this._createViewComponent(this._visualComponent.children[key], state[key]);
                                this.stateKeys.push(key);

                            }

                        } else {
                            this[key] = state[key];
                            this._stateKeys.push(key);
                            this._stateChanged = true;
                            this._view.notifyParentsChildrenStateChange(this._parentComponent);
                        }
                    }

                }
            }

        }

        protected _createViewComponent(viewComponentInfo: ajs.templating.IVisualComponentChildInfo, state: IViewState): ViewComponent {

            let name: string = viewComponentInfo.tagName;
            if (name === "COMPONENT" && viewComponentInfo.nameAttribute) {
                name = viewComponentInfo.nameAttribute;
            }

            let viewComponentConstructor: typeof ViewComponent;
            viewComponentConstructor = this._view.viewComponentManager.getComponentConstructorByName(name);

            if (viewComponentConstructor === null) {
                viewComponentConstructor = ViewComponent;
            }

            let visualComponent: IVisualComponent;
            visualComponent = this._view.templateManager.getVisualComponent(name);

            if (visualComponent === null) {
                throw new VisualComponentNotRegisteredException(name);
            }

            return new viewComponentConstructor(this._view, this, visualComponent, state);
        }

        /**
         * render the ViewComponent to the target element (appenChild is used to add the element)
         * @param parentElement element to be used as a parent for the component
         * @param usingShadowDom information if the render is performed to the main DOM or shadow DOM
         */
        public render(parentElement: HTMLElement, usingShadowDom: boolean, clearStateChangeOnly: boolean): HTMLElement {

            let node: Node;

            // render the tree of the visual component related to the current view component
            node = this._renderTree(this._visualComponent.component, parentElement, usingShadowDom, clearStateChangeOnly);

            // reset the dirty state after change
            this._stateChanged = false;

            // if the render was not just because of reseting the state change flag
            // set view component attributes and return the view component
            if (!clearStateChangeOnly) {
                if (node instanceof HTMLElement) {

                    let componentName: string = this._visualComponent.component.getAttribute("name");

                    (node as HTMLElement).setAttribute("ajscid", this._componentId.toString());
                    (node as HTMLElement).setAttribute("ajscname", componentName);

                    if (!usingShadowDom) {
                        this._element = node as HTMLElement;
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
                // children components didn't change, just render it with skip attribute and don't render
                // children tags

                let skip: boolean = sourceNode === this._visualComponent.component && !this._stateChanged;

                if (addedNode !== null && skip) {
                    (addedNode as HTMLElement).setAttribute("ajsskip", "true");
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
                    (processedNode as HTMLElement).setAttribute("ajscid", this._componentId.toString());
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
            if (node.nodeValue.substr(0, 8) == "#ASHTML:") {
                let asHtml = document.createElement("ashtml");
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
                if (this._attributeProcessors[element.attributes[i].nodeName] !== undefined) {
                    if (!this._attributeProcessors[element.attributes[i].nodeName].call(this, toRemove, element.attributes[i])) {
                        return null;
                    }
                } else {
                    if (!this._attributeProcessors.__default.call(this, toRemove, element.attributes[i])) {
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
                attr.ownerElement.addEventListener(eventType, (e: Event) => {
                    this[eventHandlerName](e);
                });
            }
            return true;
        }

        public insertChildComponent(
            viewComponentName: string,
            id: string,
            state: IViewState,
            placeholder: string,
            index?: number): void {

            if (state === null) {
                state = {};
            }

            let visualComponent: IVisualComponent;
            visualComponent = this._view.templateManager.getVisualComponent(viewComponentName);

            if (visualComponent === null) {
                throw new VisualComponentNotRegisteredException(viewComponentName);
            }

            this._visualComponentInsertChild(placeholder, viewComponentName, id, index);

            var thisState: IViewState = {};
            thisState[id] = state;

            this.setState(thisState);
        }

        public removeChildComponent(placeholder: string, id: string): void {
            if (this.hasOwnProperty(id) && this[id] instanceof ViewComponent) {

                this._visualComponentRemoveChild(placeholder, id);

                this[id]._destroy();
                delete this[id];
                let i: number = this._stateKeys.indexOf(id);
                if (i !== -1) {
                    this._stateKeys.splice(i, 1);
                }
            }
        }

        protected _visualComponentInsertChild(placeholder: string, componentName: string, id: string, index?: number): void {
            if (this._visualComponent.placeholders.hasOwnProperty(placeholder)) {

                let ph: HTMLElement = this._visualComponent.placeholders[placeholder].placeholder;

                let vc: HTMLElement = ph.ownerDocument.createElement(componentName);
                vc.setAttribute("id", id);

                if (index !== undefined) {
                    // !!!!!!
                } else {
                    ph.appendChild(vc);
                }

                this._visualComponent.children[id] = {
                    tagName: componentName,
                    nameAttribute: null
                };
            }
        }

        protected _visualComponentRemoveChild(placeholder: string, id: string): void {
            if (this._visualComponent.placeholders.hasOwnProperty(placeholder)) {

                let ph: HTMLElement = this._visualComponent.placeholders[placeholder].placeholder;
                let vc: HTMLElement = null;

                for (let i: number = 0; i < ph.childElementCount; i++) {
                    if (ph.children.item(i).hasAttribute("id") && ph.children.item(i).getAttribute("id") === id) {
                        vc = ph.children.item(i) as HTMLElement;
                        break;
                    }
                }

                if (vc !== null) {
                    ph.removeChild(vc);
                    delete this._visualComponent.children[id];
                }

            }
        }

    }

}