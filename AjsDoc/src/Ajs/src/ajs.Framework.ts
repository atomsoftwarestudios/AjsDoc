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

namespace ajs {

    "use strict";

    /**
     * Ajs framework static class provides the complete framework functionality.
     * Initialization is called automatically from the ajs boot when the
     * window.onload event is fired. The framework, based on the boot configuration
     * file, initializes the user application class inherited from the ajs.app.Application
     * and starts it.
     */
    export class Framework {

        /** Contains last error caused by the framework components
         *  TODO: Think about the global / application error handler
         */
        protected static _lastError: Error;
        /** Returns the last error caused by the framework component
         *  TODO: Think about the global / application error handler
         */
        public static get lastError(): Error { return Framework._lastError; }
        /** 
         * Should be used internally by framework components only to set the error value
         * TODO: Think about the global / application error handler
         * TODO: Error handling should be done just by triggering and catching exceptions
         */
        public static set lastError(value: Error) { Framework._lastError = value; }

        /** Stores the framework configuration loaded during the index.html load */
        protected static _config: ajs.IAjsConfig;
        /** Returns the framework configuration object */
        public static get config(): ajs.IAjsConfig { return Framework._config; }

        /** Stores the application configuration */
        protected static _appConfig: ajs.app.IApplicationConfig;
        /** Returns the application configuration */
        public static get appConfig(): ajs.app.IApplicationConfig { return Framework._appConfig; }

        /** Stores the application object automatically instantiated from the constructor passed in the configuration */
        protected static _application: ajs.app.Application;
        /** Returns the application object */
        public static get application(): ajs.app.Application { return Framework._application; }

        /** Stores the ResourceManager object instantiated automatically during the framework intitialization */
        protected static _resourceManager: ajs.resources.ResourceManager;
        /** Returns the ResourceManager object */
        public static get resourceManager(): ajs.resources.ResourceManager { return Framework._resourceManager; }

        /** Stores the StateManager object instantiated automatically during the framework intitialization */
        protected static _stateManager: ajs.state.StateManager;
        /** Returns the StateManager object */
        public static get stateManager(): ajs.state.StateManager { return Framework._stateManager; }

        /** Stores the ResourceManager object instantiated automatically during the framework intitialization */
        protected static _router: ajs.routing.Router;
        /** Returns the ResourceManager object */
        public static get router(): ajs.routing.Router { return Framework._router; }

        /** Stores the Navigator object instantiated automatically during the framework intitialization */
        protected static _navigator: ajs.navigation.Navigator;
        /** Returns the Navigator object */
        public static get navigator(): ajs.navigation.Navigator { return Framework._navigator; }

        /** Stores the ViewComponentManager object instantiated automatically during the framework intitialization */
        protected static _viewComponentManager: ajs.mvvm.viewmodel.ViewComponentManager;
        /** Returns the ViewComponentManager object */
        public static get viewComponentManager(): ajs.mvvm.viewmodel.ViewComponentManager { return Framework._viewComponentManager; };

        /** Stores the TemplateManager object instantiated automatically during the framework intitialization */
        protected static _templateManager: ajs.templating.TemplateManager;
        /** Returns the TemplateManager object */
        public static get templateManager(): ajs.templating.TemplateManager { return Framework._templateManager; }

        /** Stores the ModelManager object instantiated automatically during the framework initialization */
        protected static _modelManager: ajs.mvvm.model.ModelManager;
        /** Returns the ModuleManager object */
        public static get modelManager(): ajs.mvvm.model.ModelManager { return Framework._modelManager; }

        /** Stores the View object instantiated automatically during the framework intitialization */
        protected static _view: ajs.mvvm.view.View;
        /** Returns the View object */
        public static get view(): ajs.mvvm.view.View { return Framework._view; }


        /** Basic framework initialization is called automatically from the boot when window.onload event occurs */
        public static initialize(config: IAjsConfig): void {

            ajs.debug.log(debug.LogType.Enter, 0, "ajs", this);

            ajs.debug.log(debug.LogType.Warning, 0, "ajs", this, "IMPLEMENT: Framework.initialize - global error handler");
            window.onerror = Framework._errorHandler;

            // store config locally
            Framework._config = config;

            // basic initialization
            Framework._appConfig = null;
            Framework._application = null;

            // create framework components
            Framework._resourceManager = new ajs.resources.ResourceManager(config.resourceManager);
            Framework._stateManager = new ajs.state.StateManager(Framework._resourceManager);
            Framework._templateManager = new ajs.templating.TemplateManager(Framework._resourceManager);
            Framework._viewComponentManager = new ajs.mvvm.viewmodel.ViewComponentManager(Framework._templateManager);
            Framework._modelManager = new ajs.mvvm.model.ModelManager();
            Framework._view = new ajs.mvvm.view.View(Framework._viewComponentManager, config.view);
            Framework._router = new ajs.routing.Router(Framework._view, Framework._config.router);
            Framework._navigator = new ajs.navigation.Navigator(Framework._router, Framework._config.navigator);

            ajs.debug.log(debug.LogType.Exit, 0, "ajs", this);
        }

        /**
         * Configure the ajs application before it is instanced
         * Called automatically from boot when window.onload event occurs
         * @param config Application configuration file
         */
        public static configureApplication(config: ajs.app.IApplicationConfig): void {
            ajs.debug.log(debug.LogType.Enter, 0, "ajs", this);

            ajs.debug.log(debug.LogType.Info, 0, "ajs", this, "Configuring application");

            Framework._appConfig = config;

            ajs.debug.log(debug.LogType.Exit, 0, "ajs", this);
        }

        /**
         * Instantiate and initialize the user application and start it.
         * Called automatically from boot when window.onload event occurs
         * @throws ApplicationNotConfiguredException Thrown when the start is called before the application is configured
         * @throws AppConstructorMustBeAFunctionException Thrown when the passed application constructor is not a function
         */
        public static start(): void {

            ajs.debug.log(debug.LogType.Enter, 0, "ajs", this);

            ajs.debug.log(debug.LogType.Info, 0, "ajs", this, "Frameowrk is starting the application");

            if (Framework._appConfig === undefined || Framework._appConfig === null) {
                ajs.debug.log(debug.LogType.Error, 0, "ajs", this, "Application not configured");
                throw new ApplicationNotConfiguredException();
            }

            if (typeof (Framework._appConfig.appConstructor) === typeof (Function)) {
                Framework._application = new Framework._appConfig.appConstructor(Framework._appConfig.userConfig);
                ajs.debug.log(debug.LogType.Info, 0, "ajs", this, "Initializing the application");
                Framework._application.initialize();
            } else {
                ajs.debug.log(debug.LogType.Error, 0, "ajs", this, "Application constructor is not a function!");
                throw new AppConstructorMustBeAFunctionException();
            }

            ajs.debug.log(debug.LogType.Exit, 0, "ajs", this);
        }

        /**
         * TODO: Think about the global / application error handler
         * @param msg
         * @param url
         * @param line
         * @param col
         * @param error
         */
        protected static _errorHandler(msg: string | Error, url: string, line: number, col: number, error: Error): void {

            let text: string = "";
            let err: string = "";

            if (msg instanceof Error) {
                text = ajs.utils.getClassName(error) + ": " + msg.message;
                err = "<br />name: " + error.name +
                    "<br />message: " + error.message +
                    "<br />stacktrace:<br /> " + error.stack.replace(new RegExp("\n", "gm"), "<br />");
            } else {
                text = msg;
            }

            document.write(
                "Exception: " +
                "<br />Message: (" + text + ")<br /> At: " + url +
                "<br />line " + line + " column " + col + err
            );
        }

    }
}
