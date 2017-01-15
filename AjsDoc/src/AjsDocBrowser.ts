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

        /**
         * Starts application intitalization by loading template list file defined in the config
         */
        public initialize(): void {

            config = this._config as IAjsDocBrowserConfig;

            ajs.Framework.resourceManager.load(
                (successfull: boolean) => {
                    this._templateListLoaded(successfull);
                },
                config.templateList,
                null,
                config.storageType,
                ajs.resources.CACHE_POLICY.PERMANENT
            );
        }

        protected _templateListLoaded(successfull: boolean): void {
            if (successfull) {
                this._loadTemplates();
            } else {
                throw new Error("Failed to load template list.");
            }
        }

        /**
         * Initiate loading of templates defined in the template list
         */
        protected _loadTemplates(): void {

            // get list of templates to be loaded
            let res: ajs.resources.IResource = ajs.Framework.resourceManager.getResource(
                config.templateList,
                config.storageType
            );

            let templates: string[] = JSON.parse(res.data);

            ajs.Framework.templateManager.loadTemplateFiles(
                (successfull: boolean) => {
                    this._templatesLoaded(successfull);
                },
                templates,
                config.storageType
            );
        }

        /**
         * Checks if loading of templates was successful and continues by loading of
         * the resource list file
         * @param successfull Information from template manager if templates were loaded successfully
         */
        protected _templatesLoaded(successfull: boolean): void {
            if (successfull) {
                this._loadResourceList();
            } else {
                throw new Error("Failed to load templates.");
            }
        }

        /**
         * Initiates loading of the resources list file
         */
        protected _loadResourceList(): void {

            ajs.Framework.resourceManager.load(
                (successfull: boolean) => {
                    this._resourcesConfigLoaded(successfull);
                },
                config.resourceList,
                null,
                config.storageType,
                ajs.resources.CACHE_POLICY.PERMANENT
            );

        }

        /**
         * Checks if loading of the resources file was successfull
         * @param successfull Information from resource manager if resources list was loaded successfully
         */
        protected _resourcesConfigLoaded(successfull: boolean): void {
            if (successfull) {
                this._loadResources();
            } else {
                throw new Error("Failed to load resources configuration");
            }
        }

        /**
         * Initiates loading of libraries (config file) and resources specified in the resources list file
         */
        protected _loadResources(): void {

            // get list of resources to be loaded
            let res: ajs.resources.IResource = ajs.Framework.resourceManager.getResource(
                config.resourceList,
                config.storageType
            );

            resources = config.libraries.concat(JSON.parse(res.data));
            resources.push(config.dataSources.program);
            resources.push(config.dataSources.toc);

            // load resources
            ajs.Framework.resourceManager.loadMultiple(
                (successfull: boolean) => {
                    this._resourcesLoaded(successfull);
                },
                resources,
                null,
                config.storageType,
                ajs.resources.CACHE_POLICY.PERMANENT
            );

        }

        /**
         * Check if loading of all resources was sucessfull and finishes initialization of the application if so
         * @param successfull
         */
        protected _resourcesLoaded(successfull: Boolean): void {
            if (successfull) {
                this._initDone();
            } else {
                throw new Error("Failed to load resources.");
            }
        }

        /**
         * Finalizes the application when the browser tab is about to be closed
         */
        protected _finalize(): void {
            console.warn("IMPLEMENT: AjsDocBrowser.application.finalize");
        }

    }

}