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

    export class TemplateManager {

        protected _resourceManager: ajs.resources.ResourceManager;
        public get resourceManager(): ajs.resources.ResourceManager { return this._resourceManager; }

        protected _templates: ITemplatesCollection;
        public get templates(): ITemplatesCollection { return this._templates; }

        protected _visualComponents: IVisualComponentCollection;
        public get VisualComponents(): IVisualComponentCollection { return this._visualComponents; }

        public constructor(resourceManager: ajs.resources.ResourceManager) {
            this._resourceManager = resourceManager;
            this._templates = {};
            this._visualComponents = {};
        }

        public loadTemplateFiles(
            templatesCreatedCallback: ITemplatesLoadEndHandler,
            paths: string[],
            storageType?: ajs.resources.STORAGE_TYPE,
        ): void {

            this._resourceManager.loadMultiple(
                (allLoaded: boolean, resources: ajs.resources.IResource[]) => {
                    this._templateFilesLoaded(allLoaded, resources, templatesCreatedCallback);
                },
                paths,
                null,
                storageType,
                resources.CACHE_POLICY.PERMANENT
            );
        }

        public loadTemplatesFromResource(
            resource: ajs.resources.IResource,
            templatesCreatedCallback: ITemplatesLoadEndHandler
        ): void {

            let template: Template = this._parseTemplate(resource.data, resource.storage.type);
            this._loadTemplatesStyleSheets(
                template.styleSheets,
                resource.storage.type,
                templatesCreatedCallback
            );

        }

        public getTemplateStyleSheetsData(template: Template): string[] {
            let styleSheets: string[] = [];

            for (let i: number = 0; i < template.styleSheets.length; i++) {
                let styleSheet: string = this._resourceManager.getResource(
                    template.styleSheets[i],
                    template.storageType
                ).data;
                styleSheets.push(styleSheet);
            }

            return styleSheets;
        }

        protected _templateFilesLoaded (
            allLoaded: boolean,
            resources: ajs.resources.IResource[],
            templatesCreatedCallback: ITemplatesLoadEndHandler): void {

            if (allLoaded) {
                let styleSheets: string[] = [];
                for (let i: number = 0; i < resources.length; i++) {
                    styleSheets = styleSheets.concat(
                        this._parseTemplatesFile(resources[i].data, resources[i].storage.type)
                    );
                }
                if (styleSheets.length > 0) {
                    this._loadTemplatesStyleSheets(
                        styleSheets,
                        resources[0].storage.type,
                        templatesCreatedCallback
                    );
                }
            } else {
                throw new FailedToLoadTemplatesException();
            }
        }

        protected _loadTemplatesStyleSheets(
            styleSheets: string[],
            storageType: ajs.resources.STORAGE_TYPE,
            templatesCreatedCallback: ITemplatesLoadEndHandler
        ): void {

            this._resourceManager.loadMultiple(
                (allLoaded: boolean) => {
                    if (allLoaded) {
                        templatesCreatedCallback(allLoaded);
                    } else {
                        throw new FailedToLoadTemplateStyleSheetsException();
                    }
                },
                styleSheets,
                null,
                storageType,
                ajs.resources.CACHE_POLICY.PERMANENT
            );

        }

        protected _parseTemplatesFile(html: string, storageType: resources.STORAGE_TYPE): string[] {
            let doc: Document = document.implementation.createHTMLDocument("templates");
            doc.body.innerHTML = html;

            let styleSheets: string[] = [];
            let templateTags: NodeListOf<HTMLElement> = doc.getElementsByTagName("template");
            for (let i: number = 0; i < templateTags.length; i++) {
                let template: Template = this._parseTemplate(templateTags.item(i), storageType);
                styleSheets = styleSheets.concat(template.styleSheets);
            }

            return styleSheets;
        }

        protected _parseTemplate(templateTag: HTMLElement, storageType: resources.STORAGE_TYPE): Template {
            let templateName: string = "";
            let stylesheets: string[] = [];

            if (templateTag.hasAttribute("name")) {
                templateName = templateTag.getAttribute("name");
            }

            if (templateTag.hasAttribute("stylesheets")) {
                stylesheets = templateTag.getAttribute("stylesheets").split(";");
                for (let i: number = 0; i < stylesheets.length; i++) {
                    stylesheets[i] = stylesheets[i].trim();
                }
            }

            let template: Template = new Template(templateName, templateTag.innerHTML, stylesheets, storageType);
            this._templates[templateName] = template;

            for (var visualComponentName in template.visualComponents) {
                if (template.visualComponents.hasOwnProperty(visualComponentName)) {
                    this._visualComponents[visualComponentName] = template.visualComponents[visualComponentName];
                }
            }

            return template;
        }

        public getTemplate(name: string): Template {
            if (this._templates.hasOwnProperty(name)) {
                return this._templates[name];
            }
            return null;
        }

        public getVisualComponent(name: string): IVisualComponent {
            if (this._visualComponents.hasOwnProperty(name.toUpperCase())) {
                return this._visualComponents[name.toUpperCase()];
            }
            return null;
        }

        public getVisualComponentTemplate(name: string): Template {
            if (this._visualComponents.hasOwnProperty(name)) {
                let templateName: string = this._visualComponents[name].templateName;
                let template: Template = this.getTemplate(templateName);
                return template;
            }
            return null;
        }

    }

}
