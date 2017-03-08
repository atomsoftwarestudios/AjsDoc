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

namespace ajs.templating {

    "use strict";

    /**
     * Represents a HTML template containing a visual component tree
     * <p>
     * Instanced by the #see {ajs.templating.TemplateManager} when the template is requested to be loaded.
     * </p>
     * <p>
     * Automatically parses the template data and register all defined visual components to the template manager.
     * </p>
     * <p>
     * Stylesheets defined as the style tag directly in the template are stored in the stylesheets
     * </p>
     * <p>
     * Stylesheets defined as the URL (template attribute stylesheets) must be explicitly asked to be loaded by
     * the #see {ajs.templating.TemplateManager} once the constructor returns the Template object.
     * </p>
     */
    export class Template {

        protected _templateManager: TemplateManager;
        public get templateManager(): TemplateManager { return this._templateManager; }

        protected _name: string;
        public get name(): string { return this._name; }

        protected _storageType: resources.STORAGE_TYPE;
        public get storageType(): resources.STORAGE_TYPE { return this._storageType; }

        protected _cachePolicy: resources.CACHE_POLICY;
        public get cachePolicy(): resources.CACHE_POLICY { return this._cachePolicy; }

        protected _styleSheetsUrls: string[];
        public get styleSheetsUrls(): string[] { return this._styleSheetsUrls; }

        protected _styleSheetsLoaded: boolean;

        protected _styleSheets: string[];
        public get styleSheets(): string[] { return this._styleSheets; }

        protected _template: Document;
        public get template(): Document { return this._template; }

        protected _visualComponents: IVisualComponentCollection;
        public get visualComponents(): IVisualComponentCollection { return this._visualComponents; }

        /**
         * Constructs the template object and loads the data from the template
         * @param templateManager
         * @param templateResource
         * @param storageType
         */
        public constructor(
            templateManager: TemplateManager,
            templateResource: resources.IResource,
            storageType: resources.STORAGE_TYPE,
            cachePolicy: resources.CACHE_POLICY
        ) {
            this._templateManager = templateManager;
            this._name = "";
            this._storageType = storageType;
            this._cachePolicy = cachePolicy;
            this._template = document.implementation.createHTMLDocument("ajstemplate");

            // safari hack
            let data: string = templateResource.data;
            data = data.replace(/touchstart/g, "touchstart_ajs");
            data = data.replace(/touchmove/g, "touchmove_ajs");
            data = data.replace(/touchend/g, "touchend_ajs");

            this._template.body.innerHTML = data;
            this._styleSheetsLoaded = false;
            this._styleSheetsUrls = [];
            this._styleSheets = [];
            this._visualComponents = {};
            this._getTemplateData();
        }

        /**
         * Must be called from the template manager to load templates
         */
        public loadStyleSheets(): Promise<void> {

            return new Promise<void>(
                async (resolve: () => void, reject: (reason ?: any) => void) => {

                // return immediately if stylesheets were loaded already or there are no stylesheets to be loaded
                if (this._styleSheetsLoaded || this._styleSheetsUrls.length === 0) {
                    resolve();
                }

                // prepare resources to be obtained from resource manager (cache/server)
                let resourcePromises: Promise<resources.IResource>[] = [];
                for (let i: number = 0; i < this._styleSheetsUrls.length; i++) {
                    resourcePromises.push(
                        this._templateManager.resourceManager.getResource(
                            this._styleSheetsUrls[i],
                            this._storageType,
                            this._cachePolicy,
                            resources.LOADING_PREFERENCE.CACHE
                        )
                    );
                }

                try {
                    // wait till all resources are loaded
                    let styleSheets: resources.IResource[] = await Promise.all(resourcePromises);

                    // store stylesheets
                    for (let i: number = 0; i < styleSheets.length; i++) {
                        this._styleSheets.push(styleSheets[i].data);
                    }

                    // done
                    this._styleSheetsLoaded = true;

                } catch (e) {
                    reject(new FailedToLoadTemplateStylesheetsException(e));
                }

                resolve();

            });
        }

        /**
         * Helper to walk the DOM of the loaded template
         * @param element HTMLElement where to start
         * @param parentComponent Parent visual component (if discovered already)
         * @param elementProcessor Function to process the template elmenets 
         */
        protected _walkHTMLTree(
            element: HTMLElement,
            parentComponent: IVisualComponent,
            elementProcessor: (element: HTMLElement, parentComponent: IVisualComponent) => IVisualComponent): void {

            if (element instanceof HTMLElement) {
                for (let i: number = 0; i < element.children.length; i++) {
                    if (element.children.item(i).nodeType === Node.ELEMENT_NODE) {
                        let pc: IVisualComponent = elementProcessor(element.children.item(i) as HTMLElement, parentComponent);
                        this._walkHTMLTree(element.children.item(i) as HTMLElement, pc, elementProcessor);
                    }
                }
            }

        }

        /**
         * Parses the template and gets the template info and visual components it contains
         */
        protected _getTemplateData(): void {

            this._walkHTMLTree(this._template.body, null,

                (element: HTMLElement, parentComponent: IVisualComponent): IVisualComponent => {

                    // parse the TEMPLATE tag information
                    if (element.nodeName === "AJSTEMPLATE") {

                        if (element.hasAttribute("name")) {
                            this._name = element.getAttribute("name");
                        } else {
                            throw new MissingTemplateNameException();
                        }

                        if (element.hasAttribute("stylesheets")) {
                            // get stylesheet from the stylesheets attribute (separated by ;)
                            let styleSheetsToLoad: string[] = element.getAttribute("stylesheets").split(";");

                            // trim urls
                            for (let i: number = 0; i < styleSheetsToLoad.length; i++) {
                                styleSheetsToLoad[i] = styleSheetsToLoad[i].trim();
                            }

                            // update stylesheets urls to be loaded - sheet load is done by template manager
                            this._styleSheetsUrls = this._styleSheetsUrls.concat(styleSheetsToLoad);
                        }
                    }

                    // is this tag a placeholder for dynamically added components? do we have parent visual component?
                    if (parentComponent !== null && element.hasAttribute("placeholder")) {
                        let id: string = element.getAttribute("placeholder");
                        parentComponent.placeholders[id] = {
                            placeholder: element
                        };
                    }

                    // store style if defined
                    if (parentComponent !== null && element.nodeName === "STYLE") {
                        this._styleSheets.push(element.textContent);
                    }

                    // if the element has ID attribute it is instance of the view component
                    if (parentComponent !== null && element.hasAttribute("id")) {

                        let id: string = element.getAttribute("id");
                        let name: string = element.getAttribute("name");
                        let cname: string = element.getAttribute("component");

                        if (cname !== null) {
                            parentComponent.children[id] = {
                                tagName: cname,
                                nameAttribute: null
                            };
                        } else {
                            parentComponent.children[id] = {
                                tagName: element.nodeName.toUpperCase(),
                                nameAttribute: name
                            };
                        }


                    }

                    // is the tag COMPONENT? (its name is component or it has attribute named component)
                    if (element.nodeName === "COMPONENT" || element.hasAttribute("component")) {

                        let name: string;
                        if (element.nodeName === "COMPONENT" && element.hasAttribute("name")) {
                            name = element.getAttribute("name").toUpperCase();
                        } else {
                            if (element.hasAttribute("component")) {
                                name = element.getAttribute("component").toUpperCase();
                            } else {
                                throw new MissingVisualComponentNameException();
                            }
                        }

                        // prepare visual component info
                        let visualComponent: IVisualComponent = {
                            component: element,
                            template: this,
                            templateName: this._name,
                            children: {},
                            placeholders: {}
                        };

                        // store visual component to the template
                        this._visualComponents[name] = visualComponent;

                        // register visual component to template manager (holds of all visual components)
                        this._templateManager.registerVisualComponent(name, visualComponent);

                        return this._visualComponents[name];
                    }

                    return parentComponent;

            });

        }

    }

}