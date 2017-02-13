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

        protected _resourceManager: resources.ResourceManager;
        public get resourceManager(): resources.ResourceManager { return this._resourceManager; }

        protected _templates: ITemplatesCollection;
        public get templates(): ITemplatesCollection { return this._templates; }

        protected _visualComponents: IVisualComponentCollection;
        public get VisualComponents(): IVisualComponentCollection { return this._visualComponents; }

        public constructor(resourceManager: resources.ResourceManager) {
            this._resourceManager = resourceManager;
            this._templates = {};
            this._visualComponents = {};
        }

        public loadTemplates(
            paths: string[],
            storageType: resources.STORAGE_TYPE,
            cachePolicy: resources.CACHE_POLICY,
            loadingPreference?: resources.LOADING_PREFERENCE
        ): Promise<Template[]> {

            ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.templating", this);

            ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.templating", this);

            return new Promise<Template[]>(

                async (resolve: (templates: Template[]) => void, reject: (reason?: any) => void) => {

                    let templates: Template[] = [];

                    try {
                        // load all template resources
                        let resourcePromises: Promise<resources.IResource>[] = [];
                        for (let i: number = 0; i < paths.length; i++) {
                            resourcePromises.push(this._resourceManager.getResource(paths[i], storageType, cachePolicy, loadingPreference));
                        }

                        // wait for all resources to be loaded
                        let resources: resources.IResource[] = await Promise.all(resourcePromises);

                        // create templates from loaded resources
                        let styleSheetLoaders: Promise<void>[] = [];

                        for (let i: number = 0; i < resources.length; i++) {
                            let template: Template = new Template(this, resources[i], storageType, cachePolicy);
                            templates.push(template);
                            styleSheetLoaders.push(template.loadStyleSheets());
                        }

                        // wait for all styleSheets to be loaded
                        await Promise.all(styleSheetLoaders);

                    } catch (e) {
                        throw new FailedToLoadTemplatesException(e);
                    }

                    // finish
                    resolve(templates);

                }
            );
        }

        public getTemplate(name: string): Template {
            if (this._templates.hasOwnProperty(name)) {
                return this._templates[name];
            }
            return null;
        }

        public registerVisualComponent(name: string, visualComponent: IVisualComponent): void {
            if (visualComponent && visualComponent !== null) {
                this._visualComponents[name] = visualComponent;
            }
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
