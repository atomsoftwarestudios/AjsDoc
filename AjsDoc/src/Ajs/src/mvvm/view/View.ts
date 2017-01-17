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

namespace ajs.mvvm.view {

    "use strict";

    import TemplateManager = ajs.templating.TemplateManager;
    import ViewComponentManager = ajs.mvvm.viewmodel.ViewComponentManager;
    import IVisualComponent = ajs.templating.IVisualComponent;

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
    export class View {

        /** Reference to the template manager */
        protected _templateManager: TemplateManager;
        /** Returns reference to the template manager used during the view construction */
        public get templateManager(): TemplateManager { return this._templateManager; }

        /** Reference to the view component manager */
        protected _viewComponentManager: ViewComponentManager;
        /** Returns reference to the view manager used during the view construction */
        public get viewComponentManager(): ViewComponentManager { return this._viewComponentManager; }

        /** Stores name of the view component used as the root for the view */
        protected _rootViewComponentName: string;
        /** Returns currently set name of the root view component */
        public get rootViewComponentName(): string { return this._rootViewComponentName; }
        /** Sets the name of the root view component and internally instantiates it and its tree. 
         *  Additionally, it destroys the previously assigned root component and its tree
         */
        public set rootViewComponentName(value: string) { this._rootUpdated(value); }

        /** Root view component currently in use */
        protected _rootViewComponent: ajs.mvvm.viewmodel.ViewComponent;
        /** Returns root view component currently in use */
        public get rootViewComponent(): ajs.mvvm.viewmodel.ViewComponent { return this._rootViewComponent; }

        /** Specifies the root component for the current state change. 
         *  This component is then rendered (including its children) if neccessary
         */
        protected _changeRootComponent: ajs.mvvm.viewmodel.ViewComponent;
        /** Returns the current change root component. Valid when the stage change is in progress only */
        public get changeRootComponent(): ajs.mvvm.viewmodel.ViewComponent { return this._changeRootComponent; }

        /** Used for shadow rendering of the view component after the state change and it for comparing changes against the target DOM */
        protected _shadowDom: Document;

        /** Unique component ID generator -> increments by 1 every time it is asked for the new value */
        protected _lastComponentId: number;
        /** Returns unique ID number each time it is asked for it. Currently, the view component
         *  is using this generator to assign view component unique identification, but this identification is not in use now
         */
        public get getComponentId(): number { this._lastComponentId++; return this._lastComponentId; }

        /** Holds style sheets (template names / StyleSheet URIs) applied to the current view */
        protected _appliedStyleSheets: string[];
        /** Returns style sheets (template names) applied to the current view */
        public get appliedStyleSheets(): string[] { return this._appliedStyleSheets; }


        protected _navigationNotifier: ajs.events.Notifier;
        public get navigationNotifier(): ajs.events.Notifier { return this._navigationNotifier; }

        protected _renderDoneNotifier: ajs.events.Notifier;
        public get renderDoneNotifier(): ajs.events.Notifier { return this._renderDoneNotifier; }

        /**
         * Constructs a view. This constructor is called from the ajs.Framework during initialization
         * View is supposed to be just one in the application. All the "view" functionality should be
         * in view components itself.
         * @param templateManager template manager must be instantiated before the view
         * @param viewComponentManager view component manager must be instantiated before the view
         */
        public constructor(templateManager: TemplateManager, viewComponentManager: ViewComponentManager) {

            this._navigationNotifier = new ajs.events.Notifier();
            this._renderDoneNotifier = new ajs.events.Notifier();

            this._templateManager = templateManager;
            this._viewComponentManager = viewComponentManager;

            this._rootViewComponentName = null;
            this._rootViewComponent = null;

            this._changeRootComponent = null;

            this._shadowDom = document.implementation.createHTMLDocument("shadowDom");

            this._appliedStyleSheets = [];

            this._lastComponentId = 0;
        }

        protected _rootUpdated(rootComponentName: string): void {

            console.warn("IMPLEMENT: ajs.mvvm.View._rootUpdated - Finalization of previously created component tree");
            console.warn("IMPLEMENT: ajs.mvvm.View._rootUpdated - Navigation event notification");

            this._cleanUpDocument();

            this._rootViewComponentName = rootComponentName;
            this._rootViewComponent = this._createViewComponent(rootComponentName, "rootViewComponent");

            this.render(this._rootViewComponent);
        }

        protected _createViewComponent(name: string, id: string): ajs.mvvm.viewmodel.ViewComponent {

            let viewComponentConstructor: typeof ajs.mvvm.viewmodel.ViewComponent;
            viewComponentConstructor = this._viewComponentManager.getComponentConstructorByName(name);

            if (viewComponentConstructor === null) {
                // throw new ViewComponentIsNotRegisteredException(rootComponentName);
                viewComponentConstructor = ajs.mvvm.viewmodel.ViewComponent;
            }

            let visualComponent: IVisualComponent;
            visualComponent = this._templateManager.getVisualComponent(name);
            if (visualComponent === null) {
                throw new VisualComponentNotRegisteredException(name);
            }

            this.applyStyleSheetsFromTemplate(visualComponent.template);

            return new viewComponentConstructor(this, this._viewComponentManager, id, null, visualComponent);

        }

        protected _cleanUpDocument(): void {
            document.body.innerHTML = "";
            let styleSheets: NodeListOf<HTMLStyleElement> = document.head.getElementsByTagName("style");
            for (let i: number = 0; i < styleSheets.length; i++) {
                if (styleSheets.item(i).hasAttribute("id") &&
                    this._appliedStyleSheets.indexOf(styleSheets.item(i).getAttribute("id")) !== -1) {
                    document.head.removeChild(styleSheets.item(i));
                }
            }
            this._appliedStyleSheets = [];
        }

        public applyStyleSheetsFromTemplate(template: ajs.templating.Template): void {
            // styleSheets defined in the stylesheets attribute of the template
            let styleSheets: string[] = this.templateManager.getTemplateStyleSheetsData(template);
            for (let i: number = 0; i < template.styleSheets.length; i++) {
                this.appliedStyleSheets.push(template.styleSheets[i]);
                let style: HTMLElement = document.createElement("style");
                style.setAttribute("type", "text/css");
                style.textContent = this._processStyleSheet(styleSheets[i]);
                document.head.appendChild(style);
            }

            // styleSheets defied as tags in the template
            if (this._appliedStyleSheets.indexOf(template.name) === -1) {
                let styleSheets: NodeListOf<HTMLStyleElement> = template.template.getElementsByTagName("style");
                for (let i: number = 0; i < styleSheets.length; i++) {
                    let styleSheet: HTMLStyleElement = styleSheets.item(i);
                    if (styleSheet.hasAttribute("type") && styleSheet.getAttribute("type") === "text/css") {
                        this._appliedStyleSheets.push(template.name);
                        let styleSheetData: string = styleSheet.innerText;
                        let style: HTMLElement = document.createElement("style");
                        style.setAttribute("type", "text/css");
                        style.textContent = this._processStyleSheet(styleSheetData);
                        document.head.appendChild(style);
                    }
                }

            }
        }

        public onNavigate(): void {
            this._navigationNotifier.notify(null);
        }

        public _stateChangeBegin(viewComponent: ajs.mvvm.viewmodel.ViewComponent): void {
            if (this._changeRootComponent === null) {
                this._changeRootComponent = viewComponent;
            }
        }

        public _stateChangeEnd(viewComponent: ajs.mvvm.viewmodel.ViewComponent): void {
            if (this._changeRootComponent === viewComponent) {
                // render only if the root view component was rendered already
                // initial rendering of the root component is ensured from the _rootUpdated method
                if (this._rootViewComponent !== null) {
                    this.render(viewComponent);
                    this._renderDoneNotifier.notify(null);
                }
                this._changeRootComponent = null;
            }
        }

        public notifyParentsChildrenStateChange(viewComponent: ajs.mvvm.viewmodel.ViewComponent): void {
            if (viewComponent !== null && this._changeRootComponent !== null) {
                while (viewComponent !== this._changeRootComponent.ajsParentComponent && viewComponent !== null) {
                    viewComponent.ajsSetStateChanged();
                    viewComponent = viewComponent.ajsParentComponent;
                }
            }
        }

        public render(viewComponent: ajs.mvvm.viewmodel.ViewComponent): void {

            if (viewComponent.ajsElement !== null) {

                // update the render of the component
                this._shadowDom.body.innerHTML = "";
                let componentElement: HTMLElement = viewComponent.render(this._shadowDom.body, true, false);
                // if the component was rendered to shadow DOM, update the main DOM
                if (componentElement !== null) {

                    this._updateDom(componentElement, viewComponent.ajsElement);

                    if (viewComponent.ajsVisualStateTransition) {
                        viewComponent.ajsVisualStateTransitionBegin(viewComponent.ajsElement);
                    }

                // otherwise remove the component root element from the DOM
                } else {
                    viewComponent.ajsElement.parentElement.removeChild(viewComponent.ajsElement);
                    viewComponent.ajsElement = null;
                }
            } else {
                // initial render of the view component (and all of its children)
                if (viewComponent === this._rootViewComponent) {
                    document.body.innerHTML = "";
                    viewComponent.render(document.body, false, false);
                }
            }

        }

        protected _isComponent(node: Node): boolean {
            if (node !== undefined && node !== null && node instanceof Element) {
                let componentElement: ajs.mvvm.viewmodel.IComponentElement = (node as ajs.mvvm.viewmodel.IComponentElement);
                return componentElement.hasOwnProperty("ajsComponent") &&
                    componentElement.ajsComponent instanceof ajs.mvvm.viewmodel.ViewComponent;
            }
            return false;
        }

        protected _getComponentId(node: Node): number {
            if (this._isComponent(node)) {
                return Number((node as ajs.mvvm.viewmodel.IComponentElement).ajsComponent.ajsComponentId);
            }
            return -1;
        }

        protected _updateDom(source: Node, target: Node): void {

            // if the source node is view component and the target is different than the source
            if (this._isComponent(source) &&
                (!this._isComponent(target) || this._getComponentId(source) !== this._getComponentId(target))) {
                // search for the component in the target parent and update it if found
                if (target.parentNode !== undefined && target.parentNode !== null) {

                    let componentFound: boolean = false;
                    for (let i: number = 0; i < target.parentNode.childNodes.length; i++) {

                        let sourceElement: HTMLElement = source as HTMLElement;
                        let targetElement: HTMLElement = null;

                        if (target.parentNode.childNodes.item(i) instanceof HTMLElement) {
                            targetElement = target.parentNode.childNodes.item(i) as HTMLElement;
                        }

                        if (this._isComponent(targetElement) &&
                            this._getComponentId(targetElement) === this._getComponentId(sourceElement)) {
                            componentFound = true;
                            this._updateDom(source, target.parentElement.children.item(i));
                        }
                    }

                    // if not found, insert the component before target element
                    if (!componentFound) {
                        let clonedNode: Node = source.cloneNode(false);
                        let adoptedNode: Node = target.ownerDocument.adoptNode(clonedNode);
                        this._copyComponentElementProperties(source, adoptedNode);
                        target.parentNode.insertBefore(adoptedNode, target);
                        // if the node is component update the component element
                        if (this._isComponent(source)) {
                            let id: number = this._getComponentId(source);
                            let component: ajs.mvvm.viewmodel.ViewComponent = this._viewComponentManager.getComponentInstanceByComponentId(id);
                            component.ajsElement = adoptedNode as HTMLElement;

                        }
                        // if any register defined event listeners
                        if ((source as ajs.mvvm.viewmodel.IComponentElement).ajsEventListeners instanceof Array) {
                            for (let i: number = 0; i < (source as ajs.mvvm.viewmodel.IComponentElement).ajsEventListeners.length; i++) {
                                adoptedNode.addEventListener(
                                    (source as ajs.mvvm.viewmodel.IComponentElement).ajsEventListeners[i].eventType,
                                    (source as ajs.mvvm.viewmodel.IComponentElement).ajsEventListeners[i].listener);
                            }
                        }
                        this._updateDom(source, adoptedNode);
                    }
                }

            } else {
                if (source.nodeName === target.nodeName) {
                    // update the node attributes
                    if (this._updateNode(source, target)) {

                        // update children nodes
                        for (let i: number = 0; i < source.childNodes.length; i++) {
                            // it there is enough nodes to be compared in the target document
                            if (i < target.childNodes.length) {
                                // update node tree
                                this._updateDom(source.childNodes.item(i), target.childNodes.item(i));
                            } else {
                                // add node and continue with its tree
                                let clonedNode: Node = source.childNodes.item(i).cloneNode(false);
                                let adoptedNode: Node = target.ownerDocument.adoptNode(clonedNode);
                                this._copyComponentElementProperties(source, adoptedNode);
                                target.appendChild(adoptedNode);
                                // if the node is component, update the component element and register defined event listeners
                                if (this._isComponent(source.childNodes.item(i))) {
                                    let id: number = this._getComponentId(source.childNodes.item(i));
                                    let component: ajs.mvvm.viewmodel.ViewComponent = ajs.Framework.viewComponentManager.getComponentInstanceByComponentId(id);
                                    component.ajsElement = adoptedNode as HTMLElement;
                                }
                                // if any register defined event listeners
                                if ((source.childNodes.item(i) as ajs.mvvm.viewmodel.IComponentElement).ajsEventListeners instanceof Array) {
                                    for (let i: number = 0; i < (source.childNodes.item(i) as ajs.mvvm.viewmodel.IComponentElement).ajsEventListeners.length; i++) {
                                        adoptedNode.addEventListener(
                                            (source.childNodes.item(i) as ajs.mvvm.viewmodel.IComponentElement).ajsEventListeners[i].eventType,
                                            (source.childNodes.item(i) as ajs.mvvm.viewmodel.IComponentElement).ajsEventListeners[i].listener);
                                    }
                                }

                                this._updateDom(source.childNodes.item(i), adoptedNode);
                            }
                        }

                        // remove any remaining nodes
                        while (source.childNodes.length < target.childNodes.length) {
                            target.removeChild(target.childNodes.item(source.childNodes.length));
                        }
                    }

                } else {
                    // remove target element and replace it by a new tree
                    let clonedNode: Node = source.cloneNode(false);
                    let adoptedNode: Node = target.ownerDocument.adoptNode(clonedNode);
                    target.parentNode.replaceChild(adoptedNode, target);
                    this._updateDom(source, adoptedNode);
                }
            }

        }

        protected _copyComponentElementProperties(source: Node, target: Node): void {
            if (source instanceof Element && target instanceof Element) {
                (target as ajs.mvvm.viewmodel.IComponentElement).ajsComponent =
                    (source as ajs.mvvm.viewmodel.IComponentElement).ajsComponent;

                (target as ajs.mvvm.viewmodel.IComponentElement).ajsOwnerComponent =
                    (source as ajs.mvvm.viewmodel.IComponentElement).ajsOwnerComponent;

                (target as ajs.mvvm.viewmodel.IComponentElement).ajsEventListeners =
                    (source as ajs.mvvm.viewmodel.IComponentElement).ajsEventListeners;
            }
        }

        protected _updateNode(source: Node, target: Node): boolean {

            if (source.nodeType === Node.ELEMENT_NODE) {

                // check if the node is view component, is the same as the target and should be skipped
                if (this._isComponent(source) && (source as viewmodel.IComponentElement).ajsSkipUpdate === true &&
                    this._isComponent(target) && this._getComponentId(source) === this._getComponentId(target)) {
                    return false;
                }

                // remove atributes
                let i: number = 0;
                while (i < target.attributes.length) {
                    if (!(source as HTMLElement).hasAttribute(target.attributes.item(i).nodeName)) {
                        target.attributes.removeNamedItem(target.attributes.item(i).nodeName);
                    } else {
                        i++;
                    }
                }

                // add missing attributes and update differences
                for (i = 0; i < source.attributes.length; i++) {
                    let tattr: Attr = target.attributes.getNamedItem(source.attributes.item(i).nodeName);
                    if (tattr === null) {
                        tattr = target.ownerDocument.createAttribute(source.attributes.item(i).nodeName);
                        tattr.value = source.attributes.item(i).nodeValue;
                        target.attributes.setNamedItem(tattr);
                    } else {
                        if (tattr.nodeValue !== source.attributes.item(i).nodeValue) {
                            tattr.nodeValue = source.attributes.item(i).nodeValue;
                        }
                    }
                }

            } else {
                if (source.nodeType === Node.TEXT_NODE) {
                    if (source.nodeValue !== target.nodeValue) {
                        target.nodeValue = source.nodeValue;
                    }
                }
            }

            return true;
        }

        protected _processStyleSheet(styleSheet: string): string {

            styleSheet = styleSheet.replace(/resource\(.*\)/gm, (str: string): string => {
                let tmp: RegExpExecArray = (/'(.*)'/g).exec(str);
                if (tmp.length > 1) {
                    let resource: ajs.resources.IResource = this._templateManager.resourceManager.getResource(tmp[1], resources.STORAGE_TYPE.LOCAL);
                    if (resource !== null) {
                        return "url(data:image;base64," + resource.data + ")";
                    } else {
                        throw new CSSRequiredResourceNotLoadedException();
                    }

                } else {
                    throw new CSSInvalidResourceSpecificationException();
                }
            });

            return styleSheet;
        }

    }

}