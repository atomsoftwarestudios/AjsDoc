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

namespace ajs.templating {

    "use strict";

    export class TemplateManager {

        protected _templates: ITemplatesCollection;
        public get templates(): ITemplatesCollection { return this._templates; }

        protected _visualComponents: IVisualComponentCollection;
        public get VisualComponents(): IVisualComponentCollection { return this._visualComponents; }

        public constructor() {
            this._templates = {};
            this._visualComponents = {};
        }

        public loadTemplateFiles(
            templatesCreatedCallback: ITemplatesLoadEndHandler,
            paths: string[],
            storageType?: ajs.resources.STORAGE_TYPE,
            cachePolicy?: ajs.resources.CACHE_POLICY
        ): void {
            ajs.Framework.resourceManager.loadMultiple(
                (allLoaded: boolean, resources: ajs.resources.IResource[]) => {
                    this._templateFilesLoaded(allLoaded, resources, templatesCreatedCallback);
                },
                paths,
                null,
                storageType,
                cachePolicy
            );
        }

        public loadTemplatesFromResource(resource: ajs.resources.IResource): void {
            this._parseTemplate(resource.data);
        }

        protected _templateFilesLoaded (
            allLoaded: boolean,
            resources: ajs.resources.IResource[],
            templatesCreatedCallback: ITemplatesLoadEndHandler): void {

            if (allLoaded) {
                for (let i: number = 0; i < resources.length; i++) {
                    let data: string = resources[i].data;
                    this._parseTemplatesFile(data);
                }
                templatesCreatedCallback(allLoaded);
            }
        }

        protected _parseTemplatesFile(html: string): void {
            let doc: Document = document.implementation.createHTMLDocument("templates");
            doc.body.innerHTML = html;

            let templateTags: NodeListOf<HTMLElement> = doc.getElementsByTagName("template");
            for (let i: number = 0; i < templateTags.length; i++) {
                this._parseTemplate(templateTags.item(i));
            }
        }

        protected _parseTemplate(templateTag: HTMLElement): void {
            let templateName: string = "";
            if (templateTag.hasAttribute("name")) {
                templateName = templateTag.attributes.getNamedItem("name").value;
            }

            let template: Template = new Template(templateName, templateTag.innerHTML);
            this._templates[templateName] = template;

            for (var visualComponentName in template.visualComponents) {
                if (template.visualComponents.hasOwnProperty(visualComponentName)) {
                    this._visualComponents[visualComponentName] = template.visualComponents[visualComponentName];
                }
            }
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
