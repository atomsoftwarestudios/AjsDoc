/* *************************************************************************
The MIT License (MIT)
Copyright (c)2017 Atom Software Studios. All rights reserved.

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

namespace ajsdoc {

    "use strict";

    /**
     * The AjsDocBrowser application
     */
    export class AjsDocBrowser extends ajs.app.Application {

        protected _config: IAjsDocBrowserConfig;

        /**
         * Starts application intitalization by loading template list file defined in the config
         */
        public initialize(): void {

            ajsdoc.config = this._config;
            this._loadTemplatesList();

        }

        /**
         * Loads a list of templates to be loaded and continues with loadTemplates
         */
        protected _loadTemplatesList(): void {

            // load template list (JSON file)
            let templateList: Promise<ajs.resources.IResource> = ajs.Framework.resourceManager.getResource(
                this._config.templateList,
                this._config.storageType,
                ajs.resources.CACHE_POLICY.PERMANENT,
                this._config.templateLoadingPreference
            );

            templateList.
                // on success parse the templates list and load templates
                then((resource: ajs.resources.IResource) => {
                    this._loadTemplates(JSON.parse(resource.data));
                }).
                // otherwise crash
                catch((reason?: any) => {
                    throw new Error("Failed to load template list." + reason);
                });
        }

        /**
         * Initiate loading of templates defined in the template list
         */
        protected _loadTemplates(templateUrls: string[]): void {

            let templatePromise: Promise<ajs.templating.Template[]> = ajs.Framework.templateManager.loadTemplates(
                templateUrls,
                config.storageType,
                ajs.resources.CACHE_POLICY.PERMANENT,
                this._config.templateLoadingPreference
            );

            templatePromise.then(
                (templates: ajs.templating.Template[]) => {
                    this._loadResourcesList();
                }
            ).catch(
                (reason: any) => {
                    throw new Error("Failed to load templates");
                }
            );

        }

        /**
         * Initiates loading of the resources list file
         */
        protected _loadResourcesList(): void {

            // load template list (JSON file)
            let resourceList: Promise<ajs.resources.IResource> = ajs.Framework.resourceManager.getResource(
                this._config.resourceList,
                this._config.storageType,
                ajs.resources.CACHE_POLICY.PERMANENT,
                this._config.resourceLoadingPreference
            );

            resourceList.
                // on success parse the templates list and load templates
                then((resource: ajs.resources.IResource) => {
                    this._loadResources(JSON.parse(resource.data));
                }).
                // otherwise crash
                catch((reason?: any) => {
                    throw new Error("Failed to load resources configuration");
                });

        }


        /**
         * Initiates loading of resources specified in the resources list file + data
         */
        protected _loadResources(resourceUrls: string[]): void {

            resourceUrls.push(config.dataSources.program);
            resourceUrls.push(config.dataSources.toc);

            let resourcesPromise: Promise<ajs.resources.IResource[]> = ajs.Framework.resourceManager.getMultipleResources(
                resourceUrls,
                (this._config as IAjsDocBrowserConfig).storageType,
                ajs.resources.CACHE_POLICY.PERMANENT,
                this._config.resourceLoadingPreference);

            // void promise, don't store/return, just resolve
            /* tslint:disable */
            new Promise<void>(
                async (resolve: () => void, reject: (reason?: any) => void) => {

                    try {

                        await resourcesPromise;
                        this._initDone();

                    } catch (e) {
                        throw new Error("Failed to load templates");
                    }

                }
            );
            /* tslint:enable */

        }

        /**
         * Finalizes the application when the browser tab is about to be closed
         */
        protected _finalize(): void {
            console.warn("IMPLEMENT: AjsDocBrowser.application.finalize");
        }

    }

}