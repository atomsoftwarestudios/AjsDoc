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

/**
 * Contains base classes for the Ajs Application, application configuration and exceptions.
 * <p>The Application class has to be derived by the user code to initialize the
 * application, load necessary resources and setup routes.</p>
 * <p>The derived application class is construced and initialized during the
 * framework boot process. The boot manager calls the framework to instantiate,
 * configure and initialize the application.</p>
 * <p>As the application initialization can be an asynchronous process (resources
 * could be loading and additional user tasks can be done during the initialization)
 * so it is necessary to call the _initDone method once the initialization is completed.</p>
 * <h5>Application Initialization Example</h5>
 * #example app_init
 *
 */
namespace ajs.app {

    "use strict";

    /**
     * The application class should be derived by the user application class in order
     * to perform basic application tasks such as application initialization, application
     * resource loading, routes setup, application state loading and so on
     */
    export class Application {

        /** Stores the configuration passed to the application from the boot config */
        protected _config: IApplicationUserConfig;
        /** Returns the application configuration */
        public get config(): IApplicationUserConfig { return this._config; }

        /** Indicates if the application was succesfully initialized.
         *  _initDone should be called when the user application initialization routines finishes
         */
        protected _initialized: boolean;
        /** Returns the application initialization status */
        public get initialized(): boolean { return this._initialized; }

        /**
         * Constructs the application object, stores the configuration to it and add event listener
         * for beforeunload window event. The _finalize method is called when the navigation is
         * going out of the page
         * @param config Application configuration. TODO: Not in use now. It can be used by the user application
         */
        public constructor(config: IApplicationUserConfig) {
            this._config = config;
            window.addEventListener("beforeunload", (e: Event) => {
                this._finalize();
            });
        }

        /**
         * MUST BE OVERRIDEN IN THE INHERITED APPLICATION CLASS
         * Called from the framework during as a last step of the initialization procedure
         * Must be overriden by the children class to initialize the user application. The
         * overriden method (or async methods called in the chain) must make sure the
         * this._initDone() method is called in order to run the application
         */
        public initialize(): void {
            throw new NotImplementedException;
        }

        /**
         * Must be called by inherited class super.initDone(); at the end of initialization
         * of the user application in order the application will get started
         */
        protected _initDone(): void {
            this._initialized = true;
            this._run();
        }

        /**
         * Starts the application by navigating to the page specified in the url adress bar of the browser
         * @throws NotInitializedException Thrown when _run is called but the application was not
         *                                 initialized by calling the _initDone method
         */
        protected _run(): void {
            if (!this._initialized) { throw new NotInitializedException(); }
            ajs.Framework.navigator.canNavigate = true;
            ajs.Framework.navigator.navigated();
        }

        /**
         * MUST BE OVERRIDEN IN THE INHERITED APPLICATION CLASS
         * Called on window.beforeunload event in order to store the application state before
         * user leaves the page or to cleanup procedures (such as clearing timers and so on). This
         * method should not be used for displaying the dialog and asking user if he is sure to leave
         * the page. This should be done directly in the user application by adding additional
         * beforeunload event handler (will be usualy done in some root ViewComponent)
         */
        protected _finalize(): void {
            throw new NotImplementedException;
        }

    }

}