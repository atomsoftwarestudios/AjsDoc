/*! ************************************************************************
The MIT License (MIT)
Copyright (c)2016 Atom Software Studios. All rights reserved.

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
/**
 * The main AJS namespace
 */
var ajs;
(function (ajs) {
    "use strict";
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    "use strict";
    /** Thrown when the start is called before the application is configured */
    var ApplicationNotConfiguredException = (function () {
        function ApplicationNotConfiguredException() {
        }
        return ApplicationNotConfiguredException;
    }());
    ajs.ApplicationNotConfiguredException = ApplicationNotConfiguredException;
    /** Thrown the passed application constructor is not a function */
    var AppConstructorMustBeAFunctionException = (function () {
        function AppConstructorMustBeAFunctionException() {
        }
        return AppConstructorMustBeAFunctionException;
    }());
    ajs.AppConstructorMustBeAFunctionException = AppConstructorMustBeAFunctionException;
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    "use strict";
    /**
     * Ajs framework static class provides the complete framework functionality.
     * Initialization is called automatically from the ajs boot when the
     * window.onload event is fired. The framework, based on the boot configuration
     * file initializes the user application class inherited from the ajs.app.Application
     * and starts it.
     */
    var Framework = (function () {
        function Framework() {
        }
        Object.defineProperty(Framework, "lastError", {
            /** Returns the last error caused by the framework component
             *  TODO: Think about the global / application error handler
             */
            get: function () { return Framework._lastError; },
            /**
             * Should be used internally by framework components only to set the error value
             * TODO: Think about the global / application error handler
             * TODO: Error handling should be done just by triggering and catching exceptions
             */
            set: function (value) { Framework._lastError = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Framework, "config", {
            /** Returns the framework configuration object */
            get: function () { return Framework._config; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Framework, "appConfig", {
            /** Returns the application configuration */
            get: function () { return Framework._appConfig; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Framework, "application", {
            /** Returns the application object */
            get: function () { return Framework._application; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Framework, "resourceManager", {
            /** Returns the ResourceManager object */
            get: function () { return Framework._resourceManager; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Framework, "router", {
            /** Returns the ResourceManager object */
            get: function () { return Framework._router; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Framework, "navigator", {
            /** Returns the Navigator object */
            get: function () { return Framework._navigator; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Framework, "viewComponentManager", {
            /** Returns the ViewComponentManager object */
            get: function () { return Framework._viewComponentManager; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(Framework, "templateManager", {
            /** Returns the TemplateManager object */
            get: function () { return Framework._templateManager; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Framework, "view", {
            /** Returns the View object */
            get: function () { return Framework._view; },
            enumerable: true,
            configurable: true
        });
        /** Basic framework initialization is called automatically from the boot when window.onload event occurs */
        Framework.initialize = function (config) {
            console.warn("IMPLEMENT: Framework.initialize - global error handler");
            window.onerror = Framework._errorHandler;
            Framework._config = config;
            Framework._appConfig = null;
            Framework._application = null;
            Framework._resourceManager = new ajs.resources.ResourceManager(config.resourceManagerConfig);
            Framework._templateManager = new ajs.templating.TemplateManager();
            Framework._viewComponentManager = new ajs.mvvm.viewmodel.ViewComponentManager();
            Framework._view = new ajs.mvvm.View(Framework._templateManager, Framework._viewComponentManager);
            Framework._router = new ajs.routing.Router(Framework._view, null, null);
            Framework._navigator = new ajs.navigation.Navigator(Framework._router);
        };
        /**
         * Configure the ajs application before it is instanced
         * Called automatically from boot when window.onload event occurs
         * @param config Application configuration file
         */
        Framework.configureApplication = function (config) {
            Framework._appConfig = config;
        };
        /**
         * Instantiate and initialize the user application and start it.
         * Called automatically from boot when window.onload event occurs
         * @throws ApplicationNotConfiguredException Thrown when the start is called before the application is configured
         * @throws AppConstructorMustBeAFunctionException Thrown when the passed application constructor is not a function
         */
        Framework.start = function () {
            if (Framework._appConfig === null) {
                throw new ajs.ApplicationNotConfiguredException();
            }
            if (typeof (Framework._appConfig.appConstructor) === typeof (Function)) {
                Framework._application = new Framework._appConfig.appConstructor(Framework._appConfig);
                Framework._application.initialize();
            }
            else {
                throw new ajs.AppConstructorMustBeAFunctionException();
            }
        };
        /**
         * TODO: Think about the global / application error handler
         * @param msg
         * @param url
         * @param line
         * @param col
         * @param error
         */
        Framework._errorHandler = function (msg, url, line, col, error) {
            var text = "";
            if (msg instanceof Error) {
                text = ajs.utils.getClassName(error) + ": " + msg.message;
            }
            else {
                text = msg;
            }
            document.write("Exception: " +
                "<br />Message: (" + text + ")<br /> At: " + url +
                "<br />line " + line + " column " + col +
                "<br />name: " + error.name +
                "<br />message: " + error.message +
                "<br />stacktrace:<br /> " + error.stack.replace(new RegExp("\n", "gm"), "<br />") //.replace(new RegExp(" ?=[^\/]", "gm"), "&nbsp;&nbsp;&nbsp;")
            );
        };
        return Framework;
    }());
    ajs.Framework = Framework;
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    "use strict";
})(ajs || (ajs = {}));
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
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Contains base classes for the AJS Application, application configuration and exceptions.
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
var ajs;
(function (ajs) {
    var app;
    (function (app) {
        "use strict";
        /**
         * this is signature 4
         * @param test
         */
        function test(test) {
            return null;
        }
        app.test = test;
        /**
         * this is test1 signature
         * @param x rrr
         */
        function test1(x) {
            return null;
        }
        app.test1 = test1;
        /**
         * this is test2 function
         */
        function test2() {
            return 0;
        }
        /**
         * this is test3 function
         */
        function test3(test) {
            return "";
        }
        var Class1 = (function () {
            function Class1() {
            }
            return Class1;
        }());
        var Class2 = (function (_super) {
            __extends(Class2, _super);
            function Class2() {
                _super.apply(this, arguments);
            }
            return Class2;
        }(Class1));
        var Class3 = (function (_super) {
            __extends(Class3, _super);
            function Class3() {
                _super.apply(this, arguments);
            }
            return Class3;
        }(Class2));
        var Class4 = (function () {
            function Class4() {
            }
            return Class4;
        }());
    })(app = ajs.app || (ajs.app = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var app;
    (function (app) {
        "use strict";
        /**
         * The application class should be derived by the user application class in order
         * to perform basic application tasks such as application initialization, application
         * resource loading, routes setup, application state loading and so on
         */
        var Application = (function () {
            /**
             * Constructs the application object, stores the configuration to it and add event listener
             * for beforeunload window event. The _finalize method is called when the navigation is
             * going out of the page
             * @param config Application configuration. TODO: Not in use now. It can be used by the user application
             */
            function Application(config) {
                var _this = this;
                this._applicationConfig = config;
                window.addEventListener("beforeunload", function (e) {
                    _this._finalize();
                });
            }
            Object.defineProperty(Application.prototype, "applicationConfig", {
                /** Returns the application configuration */
                get: function () { return this._applicationConfig; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Application.prototype, "initialized", {
                /** Returns the application initialization status */
                get: function () { return this._initialized; },
                enumerable: true,
                configurable: true
            });
            /**
             * MUST BE OVERRIDEN IN THE INHERITED APPLICATION CLASS
             * Called from the framework during as a last step of the initialization procedure
             * Must be overriden by the children class to initialize the user application. The
             * overriden method (or async methods called in the chain) must make sure the
             * this._initDone() method is called in order to run the application
             */
            Application.prototype.initialize = function () {
                throw new app.NotImplementedException;
            };
            /**
             * Must be called by inherited class super.initDone(); at the end of initialization
             * of the user application in order the application will get started
             */
            Application.prototype._initDone = function () {
                this._initialized = true;
                this._run();
            };
            /**
             * Starts the application by navigating to the page specified in the url adress bar of the browser
             * @throws NotInitializedException Thrown when _run is called but the application was not
             *                                 initialized by calling the _initDone method
             */
            Application.prototype._run = function () {
                if (!this._initialized) {
                    throw new app.NotInitializedException();
                }
                ajs.Framework.navigator.navigated();
            };
            /**
             * MUST BE OVERRIDEN IN THE INHERITED APPLICATION CLASS
             * Called on window.beforeunload event in order to store the application state before
             * user leaves the page or to cleanup procedures (such as clearing timers and so on). This
             * method should not be used for displaying the dialog and asking user if he is sure to leave
             * the page. This should be done directly in the user application by adding additional
             * beforeunload event handler (will be usualy done in some root ViewComponent)
             */
            Application.prototype._finalize = function () {
                throw new app.NotImplementedException;
            };
            return Application;
        }());
        app.Application = Application;
    })(app = ajs.app || (ajs.app = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var app;
    (function (app) {
        "use strict";
        /**
         * Thrown when the application recognizes it was not initialized before calling the _run method
         * @
         */
        var NotInitializedException = (function (_super) {
            __extends(NotInitializedException, _super);
            function NotInitializedException() {
                _super.apply(this, arguments);
            }
            return NotInitializedException;
        }(Error));
        app.NotInitializedException = NotInitializedException;
        /**
         * Thrown when the inherited application does not implement required functionality
         * @
         */
        var NotImplementedException = (function (_super) {
            __extends(NotImplementedException, _super);
            function NotImplementedException() {
                _super.apply(this, arguments);
            }
            return NotImplementedException;
        }(Error));
        app.NotImplementedException = NotImplementedException;
    })(app = ajs.app || (ajs.app = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var app;
    (function (app) {
        "use strict";
    })(app = ajs.app || (ajs.app = {}));
})(ajs || (ajs = {}));
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
/**
 * Boot namespace, the _boot function is automatically called when
 * window.onload event is fired
 */
var ajs;
(function (ajs) {
    var boot;
    (function (boot) {
        "use strict";
    })(boot = ajs.boot || (ajs.boot = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var boot;
    (function (boot) {
        "use strict";
        /**
         * Stores information about resources being loaded
         */
        var _resourcesLoadingInfo;
        /**
         * Main entry point (executed when browser fires the window.onload event)
         * - initializes framework
         * - loads ajs resources configured in the ajs.boot.config file
         * @throws GetAjsConfigFunctionNotDefinedException Thrown when the ajs.boot namespace has no
         *                                                 getAjsConfig function defined
         */
        function _boot() {
            if (!(boot.getAjsConfig instanceof Function)) {
                throw new boot.GetAjsConfigFunctionNotDefinedException();
            }
            var config = boot.getAjsConfig();
            ajs.Framework.initialize(config);
            _loadResources();
        }
        /** Loads resources and continues to the _config function
         *  @throws GetResourceListFunctionNotDefinedException Thrown when the ajs.boot namespace has no
         *                                                     getResourceList function defined
         */
        function _loadResources() {
            if (!(boot.getResourceLists instanceof Function)) {
                throw new boot.GetResourceListFunctionNotDefinedException();
            }
            var res = boot.getResourceLists();
            // prepare information about resources to be loaded
            _resourcesLoadingInfo = [
                {
                    resources: res.localPermanent, storageType: ajs.resources.STORAGE_TYPE.LOCAL,
                    cachePolicy: ajs.resources.CACHE_POLICY.PERMANENT, loadingEnd: false, loaded: false
                },
                {
                    resources: res.localLastRecentlyUsed, storageType: ajs.resources.STORAGE_TYPE.LOCAL,
                    cachePolicy: ajs.resources.CACHE_POLICY.LASTRECENTLYUSED, loadingEnd: false, loaded: false
                },
                {
                    resources: res.sessionPermanent, storageType: ajs.resources.STORAGE_TYPE.SESSION,
                    cachePolicy: ajs.resources.CACHE_POLICY.PERMANENT, loadingEnd: false, loaded: false
                },
                {
                    resources: res.sessionLastRecentlyUsed, storageType: ajs.resources.STORAGE_TYPE.SESSION,
                    cachePolicy: ajs.resources.CACHE_POLICY.LASTRECENTLYUSED, loadingEnd: false, loaded: false
                },
                {
                    resources: res.memoryPermanent, storageType: ajs.resources.STORAGE_TYPE.MEMORY,
                    cachePolicy: ajs.resources.CACHE_POLICY.PERMANENT, loadingEnd: false, loaded: false
                },
                {
                    resources: res.memoryLastRecentlyUsed, storageType: ajs.resources.STORAGE_TYPE.MEMORY,
                    cachePolicy: ajs.resources.CACHE_POLICY.LASTRECENTLYUSED, loadingEnd: false, loaded: false
                },
                {
                    resources: res.direct, storageType: undefined,
                    cachePolicy: undefined, loadingEnd: false, loaded: false
                }
            ];
            // load resources configured in the boot config 
            for (var i = 0; i < _resourcesLoadingInfo.length; i++) {
                if (_resourcesLoadingInfo[i].resources !== undefined) {
                    ajs.Framework.resourceManager.loadMultiple(function (allLoaded, resources, userData) {
                        _resourcesLoadingFinished(allLoaded, resources, userData);
                    }, _resourcesLoadingInfo[i].resources, _resourcesLoadingInfo[i], _resourcesLoadingInfo[i].storageType, _resourcesLoadingInfo[i].cachePolicy, true);
                }
            }
        }
        /**
         * Called when the ResourceManager finishes loading of resources with whatever result.
         * If all resources are successfully loaded, _config function is called.
         * @param allLoaded Indicates if all resources were loaded
         * @param resources List of resource loading information / caching information / resources
         * @throws ResourcesLoadingFailedException Thrown when loading of some of specified resource fails
         */
        function _resourcesLoadingFinished(allLoaded, resources, userData) {
            userData.loaded = allLoaded;
            userData.loadingEnd = true;
            // check if all loaded and if loaded sucesfuly
            var allDone = true;
            var allSuccess = true;
            for (var i = 0; i < _resourcesLoadingInfo.length; i++) {
                if (_resourcesLoadingInfo[i].resources !== undefined) {
                    allDone = allDone && _resourcesLoadingInfo[i].loadingEnd;
                    allSuccess = allSuccess && _resourcesLoadingInfo[i].loaded;
                }
            }
            // throw an exception if loading is done but not all resources loaded succesfully
            if (allDone) {
                if (allLoaded) {
                    _configureApplication();
                }
                else {
                    throw new boot.ResourcesLoadingFailedException;
                }
            }
        }
        /**
         * Configures the application before it is started
         * @throws GetApplicationConfigFunctionNotDefinedException Thrown when the ajs.boot namespace has no
         *                                                         getApplicationConfig function defined
         */
        function _configureApplication() {
            if (!(boot.getApplicationConfig instanceof Function)) {
                throw new boot.GetApplicationConfigFunctionNotDefinedException();
            }
            var appConfig = boot.getApplicationConfig();
            ajs.Framework.configureApplication(appConfig);
            _start();
        }
        /**
         *  Start the framework / application
         */
        function _start() {
            ajs.Framework.start();
        }
        // call _boot function when the HTML document finishes loading
        window.onload = _boot;
    })(boot = ajs.boot || (ajs.boot = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var boot;
    (function (boot) {
        "use strict";
        /**
         *  Fired if the ajs.boot.getAjsConfig function is not defined
         */
        var GetAjsConfigFunctionNotDefinedException = (function (_super) {
            __extends(GetAjsConfigFunctionNotDefinedException, _super);
            function GetAjsConfigFunctionNotDefinedException() {
                _super.apply(this, arguments);
            }
            return GetAjsConfigFunctionNotDefinedException;
        }(Error));
        boot.GetAjsConfigFunctionNotDefinedException = GetAjsConfigFunctionNotDefinedException;
        /**
         *  Fired if the ajs.boot.getAjsConfig function is not defined
         */
        var GetApplicationConfigFunctionNotDefinedException = (function (_super) {
            __extends(GetApplicationConfigFunctionNotDefinedException, _super);
            function GetApplicationConfigFunctionNotDefinedException() {
                _super.apply(this, arguments);
            }
            return GetApplicationConfigFunctionNotDefinedException;
        }(Error));
        boot.GetApplicationConfigFunctionNotDefinedException = GetApplicationConfigFunctionNotDefinedException;
        /**
         *  Fired if the ajs.boot.getResourceList function is not defined
         */
        var GetResourceListFunctionNotDefinedException = (function (_super) {
            __extends(GetResourceListFunctionNotDefinedException, _super);
            function GetResourceListFunctionNotDefinedException() {
                _super.apply(this, arguments);
            }
            return GetResourceListFunctionNotDefinedException;
        }(Error));
        boot.GetResourceListFunctionNotDefinedException = GetResourceListFunctionNotDefinedException;
        /**
         * Fired when loading resources specified in the configuration file fails
         */
        var ResourcesLoadingFailedException = (function (_super) {
            __extends(ResourcesLoadingFailedException, _super);
            function ResourcesLoadingFailedException() {
                _super.apply(this, arguments);
            }
            return ResourcesLoadingFailedException;
        }(Error));
        boot.ResourcesLoadingFailedException = ResourcesLoadingFailedException;
    })(boot = ajs.boot || (ajs.boot = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var boot;
    (function (boot) {
        "use strict";
    })(boot = ajs.boot || (ajs.boot = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var boot;
    (function (boot) {
        "use strict";
    })(boot = ajs.boot || (ajs.boot = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var boot;
    (function (boot) {
        "use strict";
    })(boot = ajs.boot || (ajs.boot = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var boot;
    (function (boot) {
        "use strict";
    })(boot = ajs.boot || (ajs.boot = {}));
})(ajs || (ajs = {}));
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
/**
 * Model View View Component Model namespace
 * asd
 */
var ajs;
(function (ajs) {
    var mvvm;
    (function (mvvm) {
        "use strict";
    })(mvvm = ajs.mvvm || (ajs.mvvm = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var mvvm;
    (function (mvvm) {
        "use strict";
        var ViewComponentIsNotRegisteredException = (function (_super) {
            __extends(ViewComponentIsNotRegisteredException, _super);
            function ViewComponentIsNotRegisteredException(componentName) {
                _super.call(this);
                this.message = componentName;
            }
            return ViewComponentIsNotRegisteredException;
        }(Error));
        mvvm.ViewComponentIsNotRegisteredException = ViewComponentIsNotRegisteredException;
        var VisualComponentNotRegisteredException = (function (_super) {
            __extends(VisualComponentNotRegisteredException, _super);
            function VisualComponentNotRegisteredException(componentName) {
                _super.call(this);
                this.message = componentName;
            }
            return VisualComponentNotRegisteredException;
        }(Error));
        mvvm.VisualComponentNotRegisteredException = VisualComponentNotRegisteredException;
    })(mvvm = ajs.mvvm || (ajs.mvvm = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var mvvm;
    (function (mvvm) {
        "use strict";
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
        var View = (function () {
            /**
             * Constructs a view. This constructor is called from the ajs.Framework during initialization
             * View is supposed to be just one in the application. All the "view" functionality should be
             * in view components itself.
             * @param templateManager template manager must be instantiated before the view
             * @param viewComponentManager view component manager must be instantiated before the view
             */
            function View(templateManager, viewComponentManager) {
                this._navigationNotifier = new mvvm.viewmodel.ComponentEventNotifier();
                this._renderDoneNotifier = new mvvm.viewmodel.ComponentEventNotifier();
                this._templateManager = templateManager;
                this._viewComponentManager = viewComponentManager;
                this._rootViewComponentName = null;
                this._rootViewComponent = null;
                this._changeRootComponent = null;
                this._shadowDom = document.implementation.createHTMLDocument("shadowDom");
                this._appliedStyleSheets = [];
                this._lastComponentId = 0;
            }
            Object.defineProperty(View.prototype, "templateManager", {
                /** Returns reference to the template manager used during the view construction */
                get: function () { return this._templateManager; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(View.prototype, "viewComponentManager", {
                /** Returns reference to the view manager used during the view construction */
                get: function () { return this._viewComponentManager; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(View.prototype, "rootViewComponentName", {
                /** Returns currently set name of the root view component */
                get: function () { return this._rootViewComponentName; },
                /** Sets the name of the root view component and internally instantiates it and its tree.
                 *  Additionally, it destroys the previously assigned root component and its tree
                 */
                set: function (value) { this._rootUpdated(value); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(View.prototype, "rootViewComponent", {
                /** Returns root view component currently in use */
                get: function () { return this._rootViewComponent; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(View.prototype, "changeRootComponent", {
                /** Returns the current change root component. Valid when the stage change is in progress only */
                get: function () { return this._changeRootComponent; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(View.prototype, "getComponentId", {
                /** Returns unique ID number each time it is asked for it. Currently, the view component
                 *  is using this generator to assign view component unique identification, but this identification is not in use now
                 */
                get: function () { this._lastComponentId++; return this._lastComponentId; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(View.prototype, "appliedStyleSheets", {
                /** Returns style sheets (template names) applied to the current view */
                get: function () { return this._appliedStyleSheets; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(View.prototype, "navigationNotifier", {
                get: function () { return this._navigationNotifier; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(View.prototype, "renderDoneNotifier", {
                get: function () { return this._renderDoneNotifier; },
                enumerable: true,
                configurable: true
            });
            View.prototype._rootUpdated = function (rootComponentName) {
                console.warn("IMPLEMENT: ajs.mvvm.View._rootUpdated - Finalization of previously created component tree");
                console.warn("IMPLEMENT: ajs.mvvm.View._rootUpdated - Navigation event notification");
                this._cleanUpDocument();
                this._rootViewComponentName = rootComponentName;
                this._rootViewComponent = this._createViewComponent(rootComponentName);
                this.render(this._rootViewComponent);
            };
            View.prototype._createViewComponent = function (name) {
                var viewComponentConstructor;
                viewComponentConstructor = this._viewComponentManager.getComponentConstructorByName(name);
                if (viewComponentConstructor === null) {
                    // throw new ViewComponentIsNotRegisteredException(rootComponentName);
                    viewComponentConstructor = ajs.mvvm.viewmodel.ViewComponent;
                }
                var visualComponent;
                visualComponent = this._templateManager.getVisualComponent(name);
                if (visualComponent === null) {
                    throw new mvvm.VisualComponentNotRegisteredException(name);
                }
                this.applyStylesheetFromTemplate(visualComponent.template);
                return new viewComponentConstructor(this, null, visualComponent);
            };
            View.prototype._cleanUpDocument = function () {
                document.body.innerHTML = "";
                var styleSheets = document.head.getElementsByTagName("style");
                for (var i = 0; i < styleSheets.length; i++) {
                    if (styleSheets.item(i).hasAttribute("id") &&
                        this._appliedStyleSheets.indexOf(styleSheets.item(i).getAttribute("id")) !== -1)
                        document.head.removeChild(styleSheets.item(i));
                }
                this._appliedStyleSheets = [];
            };
            View.prototype.applyStylesheetFromTemplate = function (template) {
                if (this._appliedStyleSheets.indexOf(template.name) === -1) {
                    var styleSheets = template.template.getElementsByTagName("style");
                    for (var i = 0; i < styleSheets.length; i++) {
                        var styleSheet = styleSheets.item(i);
                        if (styleSheet.hasAttribute("type") && styleSheet.getAttribute("type") === "text/css") {
                            this._appliedStyleSheets.push(template.name);
                            var clonedStyleSheet = (styleSheet.cloneNode(true));
                            var adoptedStyleSheet = document.adoptNode(clonedStyleSheet);
                            adoptedStyleSheet.setAttribute("id", template.name);
                            document.head.appendChild(adoptedStyleSheet);
                        }
                    }
                }
            };
            View.prototype.onNavigate = function () {
                this._navigationNotifier.notify(null);
            };
            View.prototype._stateChangeBegin = function (viewComponent) {
                if (this._changeRootComponent === null) {
                    this._changeRootComponent = viewComponent;
                }
            };
            View.prototype._stateChangeEnd = function (viewComponent) {
                if (this._changeRootComponent === viewComponent) {
                    // render only if the root view component was rendered already
                    // initial rendering of the root component is ensured from the _rootUpdated method
                    if (this._rootViewComponent !== null) {
                        this.render(viewComponent);
                        this._renderDoneNotifier.notify(null);
                    }
                    this._changeRootComponent = null;
                }
            };
            View.prototype.notifyParentsChildrenStateChange = function (viewComponent) {
                if (viewComponent !== null && this._changeRootComponent !== null) {
                    while (viewComponent !== this._changeRootComponent.parentComponent && viewComponent !== null) {
                        viewComponent.setStateChanged();
                        viewComponent = viewComponent.parentComponent;
                    }
                }
            };
            View.prototype.render = function (viewComponent) {
                if (viewComponent.element !== null) {
                    // update the render of the component
                    this._shadowDom.body.innerHTML = "";
                    var componentElement = viewComponent.render(this._shadowDom.body, true, false);
                    // if the component was rendered to shadow DOM, update the main DOM
                    if (componentElement !== null) {
                        this._updateDom(componentElement, viewComponent.element);
                    }
                    else {
                        viewComponent.element.parentElement.removeChild(viewComponent.element);
                        viewComponent.element = null;
                    }
                }
                else {
                    // initial render of the view component (and all of its children)
                    if (viewComponent === this._rootViewComponent) {
                        document.body.innerHTML = "";
                        viewComponent.render(document.body, false, false);
                    }
                }
            };
            View.prototype._isComponent = function (node) {
                if (node !== undefined && node !== null) {
                    return node instanceof HTMLElement && node.hasAttribute("ajscname");
                }
                return false;
            };
            View.prototype._getComponentId = function (node) {
                if (this._isComponent(node)) {
                    return Number(node.getAttribute("ajscid"));
                }
                return -1;
            };
            View.prototype._updateDom = function (source, target) {
                // if the source node is view component and the target is different than the source
                if (this._isComponent(source) &&
                    (!this._isComponent(target) || this._getComponentId(source) !== this._getComponentId(target))) {
                    // search for the component in the target parent and update it if found
                    if (target.parentNode !== undefined && target.parentNode !== null) {
                        var componentFound = false;
                        for (var i = 0; i < target.parentNode.childNodes.length; i++) {
                            var sourceElement = source;
                            var targetElement = null;
                            if (target.parentNode.childNodes.item(i) instanceof HTMLElement) {
                                targetElement = target.parentNode.childNodes.item(i);
                            }
                            if (this._isComponent(targetElement) &&
                                this._getComponentId(targetElement) === this._getComponentId(sourceElement)) {
                                componentFound = true;
                                this._updateDom(source, target.parentElement.children.item(i));
                            }
                        }
                        // if not found, insert the component before target element
                        if (!componentFound) {
                            var clonedNode = source.cloneNode(false);
                            var adoptedNode = target.ownerDocument.adoptNode(clonedNode);
                            target.parentNode.insertBefore(adoptedNode, target);
                            // if the node is component, update the component element
                            if (this._isComponent(source)) {
                                var id = this._getComponentId(source);
                                var component = this._viewComponentManager.getComponentInstance(id);
                                component.element = adoptedNode;
                            }
                            this._updateDom(source, adoptedNode);
                        }
                    }
                }
                else {
                    if (source.nodeName === target.nodeName) {
                        // update the node attributes
                        if (this._updateNode(source, target)) {
                            // update children nodes
                            for (var i = 0; i < source.childNodes.length; i++) {
                                // it there is enough nodes to be compared in the target document
                                if (i < target.childNodes.length) {
                                    // update node tree
                                    this._updateDom(source.childNodes.item(i), target.childNodes.item(i));
                                }
                                else {
                                    // add node and continue with its tree
                                    var clonedNode = source.childNodes.item(i).cloneNode(false);
                                    var adoptedNode = target.ownerDocument.adoptNode(clonedNode);
                                    target.appendChild(adoptedNode);
                                    // if the node is component, update the component element
                                    if (this._isComponent(source.childNodes.item(i))) {
                                        var id = this._getComponentId(source.childNodes.item(i));
                                        var component = ajs.Framework.viewComponentManager.getComponentInstance(id);
                                        component.element = adoptedNode;
                                    }
                                    this._updateDom(source.childNodes.item(i), adoptedNode);
                                }
                            }
                            // remove any remaining nodes
                            while (source.childNodes.length < target.childNodes.length) {
                                target.removeChild(target.childNodes.item(source.childNodes.length));
                            }
                        }
                    }
                    else {
                        // remove target element and replace it by a new tree
                        var clonedNode = source.cloneNode(false);
                        var adoptedNode = target.ownerDocument.adoptNode(clonedNode);
                        target.parentNode.replaceChild(adoptedNode, target);
                        this._updateDom(source, adoptedNode);
                    }
                }
            };
            View.prototype._updateNode = function (source, target) {
                if (source.nodeType === Node.ELEMENT_NODE) {
                    // check if the node is view component, is the same as the target and should be skipped
                    if (this._isComponent(source) && source.hasAttribute("ajsSkip")
                        && this._isComponent(target) && this._getComponentId(source) === this._getComponentId(target)) {
                        return false;
                    }
                    // remove atributes
                    var i = 0;
                    while (i < target.attributes.length) {
                        if (!source.hasAttribute(target.attributes.item(i).nodeName)) {
                            target.attributes.removeNamedItem(target.attributes.item(i).nodeName);
                        }
                        else {
                            i++;
                        }
                    }
                    // add missing attributes and update differences
                    for (i = 0; i < source.attributes.length; i++) {
                        var tattr = target.attributes.getNamedItem(source.attributes.item(i).nodeName);
                        if (tattr === null) {
                            tattr = target.ownerDocument.createAttribute(source.attributes.item(i).nodeName);
                            tattr.value = source.attributes.item(i).nodeValue;
                            target.attributes.setNamedItem(tattr);
                        }
                        else {
                            if (tattr.nodeValue !== source.attributes.item(i).nodeValue) {
                                tattr.nodeValue = source.attributes.item(i).nodeValue;
                            }
                        }
                    }
                }
                else {
                    if (source.nodeType === Node.TEXT_NODE) {
                        if (source.nodeValue !== target.nodeValue) {
                            target.nodeValue = source.nodeValue;
                        }
                    }
                }
                return true;
            };
            return View;
        }());
        mvvm.View = View;
    })(mvvm = ajs.mvvm || (ajs.mvvm = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var mvvm;
    (function (mvvm) {
        var viewmodel;
        (function (viewmodel) {
            "use strict";
        })(viewmodel = mvvm.viewmodel || (mvvm.viewmodel = {}));
    })(mvvm = ajs.mvvm || (ajs.mvvm = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var mvvm;
    (function (mvvm) {
        var viewmodel;
        (function (viewmodel) {
            "use strict";
            var ComponentEventNotifier = (function () {
                function ComponentEventNotifier() {
                    var listeners = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        listeners[_i - 0] = arguments[_i];
                    }
                    this._listeners = [];
                    for (var i = 0; i < listeners.length; i++) {
                        this._listeners.push(listeners[i]);
                    }
                }
                ComponentEventNotifier.prototype.subscribe = function (listener) {
                    if (this._listeners.indexOf(listener) === -1) {
                        this._listeners.push(listener);
                    }
                };
                ComponentEventNotifier.prototype.unsubscribe = function (listener) {
                    if (this._listeners.indexOf(listener) !== -1) {
                        this._listeners.splice(this._listeners.indexOf(listener));
                    }
                };
                ComponentEventNotifier.prototype.notify = function (sender) {
                    for (var i = 0; i < this._listeners.length; i++) {
                        var result = this._listeners[i](sender);
                        if (!result) {
                            return;
                        }
                    }
                };
                return ComponentEventNotifier;
            }());
            viewmodel.ComponentEventNotifier = ComponentEventNotifier;
        })(viewmodel = mvvm.viewmodel || (mvvm.viewmodel = {}));
    })(mvvm = ajs.mvvm || (ajs.mvvm = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var mvvm;
    (function (mvvm) {
        var viewmodel;
        (function (viewmodel) {
            "use strict";
        })(viewmodel = mvvm.viewmodel || (mvvm.viewmodel = {}));
    })(mvvm = ajs.mvvm || (ajs.mvvm = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var mvvm;
    (function (mvvm) {
        var viewmodel;
        (function (viewmodel) {
            "use strict";
        })(viewmodel = mvvm.viewmodel || (mvvm.viewmodel = {}));
    })(mvvm = ajs.mvvm || (ajs.mvvm = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var mvvm;
    (function (mvvm) {
        var viewmodel;
        (function (viewmodel) {
            "use strict";
        })(viewmodel = mvvm.viewmodel || (mvvm.viewmodel = {}));
    })(mvvm = ajs.mvvm || (ajs.mvvm = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var mvvm;
    (function (mvvm) {
        var viewmodel;
        (function (viewmodel) {
            "use strict";
        })(viewmodel = mvvm.viewmodel || (mvvm.viewmodel = {}));
    })(mvvm = ajs.mvvm || (ajs.mvvm = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var mvvm;
    (function (mvvm) {
        var viewmodel;
        (function (viewmodel) {
            "use strict";
        })(viewmodel = mvvm.viewmodel || (mvvm.viewmodel = {}));
    })(mvvm = ajs.mvvm || (ajs.mvvm = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var mvvm;
    (function (mvvm) {
        var viewmodel;
        (function (viewmodel) {
            "use strict";
        })(viewmodel = mvvm.viewmodel || (mvvm.viewmodel = {}));
    })(mvvm = ajs.mvvm || (ajs.mvvm = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var mvvm;
    (function (mvvm) {
        var viewmodel;
        (function (viewmodel) {
            "use strict";
        })(viewmodel = mvvm.viewmodel || (mvvm.viewmodel = {}));
    })(mvvm = ajs.mvvm || (ajs.mvvm = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var mvvm;
    (function (mvvm) {
        var viewmodel;
        (function (viewmodel) {
            "use strict";
            var ViewComponent = (function () {
                function ViewComponent(view, parentComponent, visualComponent, state) {
                    /*console.warn("IMPLEMENT: ajs.mvvm.viewmodel.ViewComponent - Navigation event notification processig");
                    console.warn("IMPLEMENT: ajs.mvvm.viewmodel.ViewComponent - Event registration and handling");*/
                    // throw exception if the visual component was not assigned
                    if (visualComponent === null) {
                        throw new mvvm.VisualComponentNotRegisteredException(null);
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
                        "__default": this._attrDefault,
                        "component": this._attrComponent,
                        "if": this._attrIf,
                        "onclick": this._attrEventHandler,
                        "onkeydown": this._attrEventHandler,
                        "onkeyup": this._attrEventHandler,
                        "onchange": this._attrEventHandler,
                        "oninput": this._attrEventHandler
                    };
                    // apply passed or default state
                    if (state && state !== null) {
                        var newState = ajs.utils.DeepMerge.merge(this._defaultState(), state);
                        ajs.utils.Obj.assign(state, newState);
                        this._applyState(state);
                    }
                    else {
                        this._applyState(this._defaultState());
                    }
                    // indicate the state was changed
                    this._stateChanged = true;
                    // ???????????????????????????????????????????????????????????????
                    this._view.notifyParentsChildrenStateChange(this._parentComponent);
                    // ???????????????????????????????????????????????????????????????
                    this._initialize();
                }
                Object.defineProperty(ViewComponent.prototype, "componentId", {
                    get: function () { return this._componentId; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ViewComponent.prototype, "view", {
                    get: function () { return this.view; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ViewComponent.prototype, "parentComponent", {
                    get: function () { return this._parentComponent; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ViewComponent.prototype, "visualComponent", {
                    get: function () { return this._visualComponent; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ViewComponent.prototype, "stateKeys", {
                    get: function () { return this._stateKeys; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ViewComponent.prototype, "stateChanged", {
                    get: function () { return this._stateChanged; },
                    enumerable: true,
                    configurable: true
                });
                ViewComponent.prototype.resetStateChanged = function () { this._stateChanged = false; };
                ViewComponent.prototype.setStateChanged = function () { this._stateChanged = true; };
                Object.defineProperty(ViewComponent.prototype, "element", {
                    get: function () { return this._element; },
                    set: function (element) { this._element = element; },
                    enumerable: true,
                    configurable: true
                });
                ;
                ViewComponent.prototype._initialize = function () {
                    return;
                };
                ViewComponent.prototype._destroy = function () {
                    // finalize the component
                    this._finalize();
                    // if the component was rendered, remove it from the DOM tree
                    if (this.element !== undefined && this.element !== null) {
                        this.element.parentElement.removeChild(this.element);
                    }
                    // unregister component instance from ViewComponent manager
                    ajs.Framework.viewComponentManager.removeComponentInstance(this);
                };
                ;
                ViewComponent.prototype._finalize = function () {
                    return;
                };
                ViewComponent.prototype._defaultState = function () {
                    return {};
                };
                ViewComponent.prototype.setState = function (state) {
                    this._view._stateChangeBegin(this);
                    this._applyState(state);
                    this._view._stateChangeEnd(this);
                };
                ViewComponent.prototype._applyState = function (state) {
                    if (state && state !== null) {
                        for (var key in state) {
                            // if the property exists, update it
                            if (this.hasOwnProperty(key)) {
                                // update children component state
                                if (this[key] instanceof ViewComponent) {
                                    this[key].setState(state[key]);
                                }
                                else {
                                    // set or update array of children components
                                    if (state[key] instanceof Array &&
                                        this._visualComponent.children.hasOwnProperty(key) &&
                                        this[key] instanceof Array) {
                                        // update and insert new components
                                        if (this.stateKeys.indexOf(key) === -1) {
                                            this._stateKeys.push(key);
                                        }
                                        // delete all components which does not exist in the array anymore
                                        var i = 0;
                                        while (i < this[key].length) {
                                            var del = true;
                                            // check if component still should exist
                                            for (var j = 0; j < state[key].length; j++) {
                                                if (this[key][i].key === state[key][j].key) {
                                                    del = false;
                                                    break;
                                                }
                                            }
                                            // delete component
                                            if (del) {
                                                this._stateKeys.splice(this._stateKeys.indexOf(key), 1);
                                                this[key][i]._destroy();
                                                this._view.notifyParentsChildrenStateChange(this[key][i]._parentComponent);
                                                this[key].splice(i, 1);
                                            }
                                            else {
                                                i++;
                                            }
                                        }
                                        for (i = 0; i < state[key].length; i++) {
                                            // update component state
                                            if (this[key].length > i && this[key][i].key === state[key][i].key) {
                                                this[key][i].setState(state[key][i]);
                                            }
                                            else {
                                                var newViewComponent = this._createViewComponent(this._visualComponent.children[key], state[key][i]);
                                                this[key].splice(i, 0, newViewComponent);
                                            }
                                        }
                                    }
                                    else {
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
                            }
                            else {
                                // if the state is setting state of children component
                                if (this._visualComponent.children.hasOwnProperty(key)) {
                                    // create array of components
                                    if (state[key] instanceof Array) {
                                        this[key] = [];
                                        this.stateKeys.push(key);
                                        for (var i = 0; i < state[key].length; i++) {
                                            var newViewComponent = void 0;
                                            newViewComponent = this._createViewComponent(this._visualComponent.children[key], state[key][i]);
                                            this[key][i] = newViewComponent;
                                        }
                                    }
                                    else {
                                        this[key] = this._createViewComponent(this._visualComponent.children[key], state[key]);
                                        this.stateKeys.push(key);
                                    }
                                }
                                else {
                                    this[key] = state[key];
                                    this._stateKeys.push(key);
                                    this._stateChanged = true;
                                    this._view.notifyParentsChildrenStateChange(this._parentComponent);
                                }
                            }
                        }
                    }
                };
                ViewComponent.prototype._createViewComponent = function (viewComponentInfo, state) {
                    var name = viewComponentInfo.tagName;
                    if (name === "COMPONENT" && viewComponentInfo.nameAttribute) {
                        name = viewComponentInfo.nameAttribute;
                    }
                    var viewComponentConstructor;
                    viewComponentConstructor = this._view.viewComponentManager.getComponentConstructorByName(name);
                    if (viewComponentConstructor === null) {
                        viewComponentConstructor = ViewComponent;
                    }
                    var visualComponent;
                    visualComponent = this._view.templateManager.getVisualComponent(name);
                    if (visualComponent === null) {
                        throw new mvvm.VisualComponentNotRegisteredException(name);
                    }
                    return new viewComponentConstructor(this._view, this, visualComponent, state);
                };
                /**
                 * render the ViewComponent to the target element (appenChild is used to add the element)
                 * @param parentElement element to be used as a parent for the component
                 * @param usingShadowDom information if the render is performed to the main DOM or shadow DOM
                 */
                ViewComponent.prototype.render = function (parentElement, usingShadowDom, clearStateChangeOnly) {
                    var node;
                    // render the tree of the visual component related to the current view component
                    node = this._renderTree(this._visualComponent.component, parentElement, usingShadowDom, clearStateChangeOnly);
                    // reset the dirty state after change
                    this._stateChanged = false;
                    // if the render was not just because of reseting the state change flag
                    // set view component attributes and return the view component
                    if (!clearStateChangeOnly) {
                        if (node instanceof HTMLElement) {
                            var componentName = this._visualComponent.component.getAttribute("name");
                            node.setAttribute("ajscid", this._componentId.toString());
                            node.setAttribute("ajscname", componentName);
                            if (!usingShadowDom) {
                                this._element = node;
                            }
                            return node;
                        }
                        else {
                            return null;
                        }
                    }
                    else {
                        return null;
                    }
                };
                ViewComponent.prototype._renderTree = function (sourceNode, targetNode, usingShadowDom, clearStateChangeOnly) {
                    var id = null;
                    if (sourceNode.nodeType === Node.ELEMENT_NODE) {
                        id = sourceNode.getAttribute("id");
                    }
                    // if the tag has attribute id, check if it is component or array of components
                    if (id !== null && this[id] !== undefined && (this[id] instanceof ViewComponent || this[id] instanceof Array)) {
                        // if it is a view component, render it
                        if (this[id] instanceof ViewComponent) {
                            this[id].render(targetNode, usingShadowDom, clearStateChangeOnly);
                        }
                        else {
                            // if it is an array
                            if (this[id] instanceof Array) {
                                // go through it and render all view components existing in the array
                                for (var i = 0; i < this[id].length; i++) {
                                    if (this[id][i] instanceof ViewComponent) {
                                        this[id][i].render(targetNode, usingShadowDom, clearStateChangeOnly);
                                    }
                                }
                            }
                        }
                    }
                    else {
                        // add node to target document (according to rules in the template)
                        var addedNode = void 0;
                        if (clearStateChangeOnly) {
                            addedNode = null;
                        }
                        else {
                            addedNode = this._renderNode(sourceNode, targetNode);
                        }
                        // check if the node is root node of the view component and if the component and its
                        // children components didn't change, just render it with skip attribute and don't render
                        // children tags
                        var skip = sourceNode === this._visualComponent.component && !this._stateChanged;
                        if (addedNode !== null && skip) {
                            addedNode.setAttribute("ajsskip", "true");
                        }
                        // if the node was added, go through all its children
                        if (addedNode !== null && !skip) {
                            for (var i = 0; i < sourceNode.childNodes.length; i++) {
                                this._renderTree(sourceNode.childNodes.item(i), addedNode, usingShadowDom, false);
                            }
                        }
                        else {
                            for (var i = 0; i < sourceNode.childNodes.length; i++) {
                                this._renderTree(sourceNode.childNodes.item(i), null, usingShadowDom, true);
                            }
                        }
                        // return the added node - for the top level call it will be a root node of the view component
                        return addedNode;
                    }
                };
                /**
                 * clone/adopt/process the node from the template and add it to the document
                 * @param sourceNode node in the VisualComponent template
                 * @param targetNode node in the targer document
                 */
                ViewComponent.prototype._renderNode = function (sourceNode, targetNode) {
                    var clonedNode = sourceNode.cloneNode(false);
                    var adoptedNode = targetNode.ownerDocument.adoptNode(clonedNode);
                    var processedNode = this._processNode(adoptedNode);
                    if (processedNode && processedNode !== null) {
                        if (processedNode instanceof HTMLElement) {
                            processedNode.setAttribute("ajscid", this._componentId.toString());
                        }
                        targetNode.appendChild(processedNode);
                    }
                    return processedNode;
                };
                /**
                 * process the node - see _processText and _processElement methods bellow for detail
                 * @param node The node in the template to be processed
                 */
                ViewComponent.prototype._processNode = function (node) {
                    switch (node.nodeType) {
                        case Node.ELEMENT_NODE:
                            return this._processElement(node);
                        case Node.TEXT_NODE:
                            return this._processText(node);
                    }
                };
                /**
                 * replace all template {} tags with the state value from the ViewComponent appropriate property
                 * @param node
                 */
                ViewComponent.prototype._processText = function (node) {
                    // extract all state property names from the template tag
                    var props = node.nodeValue.match(/{(.*?)}/g);
                    // and if any, locate them in state and replace the template text to state data
                    if (props !== null) {
                        // for all discovered state property names
                        for (var i = 0; i < props.length; i++) {
                            // use only the name without {} characters
                            var propName = props[i].substring(1, props[i].length - 1);
                            // locate the property name in the view component and set the correct value to the text node
                            if (this[propName] !== undefined && this[propName] !== null) {
                                node.nodeValue = node.nodeValue.replace(props[i], this[propName]);
                            }
                            else {
                                node.nodeValue = node.nodeValue.replace(props[i], "");
                            }
                        }
                    }
                    // if there is HTML in the node, replace the node by the HTML
                    if (node.nodeValue.substr(0, 8) == "#ASHTML:") {
                        var asHtml = document.createElement("ashtml");
                        asHtml.innerHTML = node.nodeValue.substr(8);
                        node = asHtml;
                    }
                    return node;
                };
                /**
                 * process the template tag
                 * @param element Template element to be processed
                 */
                ViewComponent.prototype._processElement = function (element) {
                    element = this._processAttributes(element);
                    if (element instanceof HTMLAnchorElement) {
                        if (element.hasAttribute("href")) {
                            var href = element.getAttribute("href");
                            if (href.substr(0, 4) !== "http") {
                                href = "javascript:ajs.Framework.navigator.navigate('" + href + "')";
                                element.setAttribute("href", href);
                            }
                        }
                    }
                    return element;
                };
                /**
                 * process the template tag attributes
                 * if the attribute processor returns false the element will be removed from further rendering
                 * @param element
                 */
                ViewComponent.prototype._processAttributes = function (element) {
                    var toRemove = [];
                    for (var i = 0; i < element.attributes.length; i++) {
                        if (this._attributeProcessors[element.attributes[i].nodeName] !== undefined) {
                            if (!this._attributeProcessors[element.attributes[i].nodeName].call(this, toRemove, element.attributes[i])) {
                                return null;
                            }
                        }
                        else {
                            if (!this._attributeProcessors.__default.call(this, toRemove, element.attributes[i])) {
                                return null;
                            }
                        }
                    }
                    for (var i = 0; i < toRemove.length; i++) {
                        element.removeAttribute(toRemove[i]);
                    }
                    return element;
                };
                ViewComponent.prototype._attrComponent = function (toRemove, attr) {
                    toRemove.push(attr.nodeName);
                    return true;
                };
                ViewComponent.prototype._attrIf = function (toRemove, attr) {
                    var condition = attr.nodeValue;
                    if (!eval(condition)) {
                        return false;
                    }
                    toRemove.push(attr.nodeName);
                    return true;
                };
                ViewComponent.prototype._attrDefault = function (toRemove, attr) {
                    var props = attr.nodeValue.match(/{(.*?)}/);
                    if (props !== null) {
                        var propName = props[1];
                        if (this[propName] !== undefined && this[propName] !== null) {
                            attr.nodeValue = attr.nodeValue.replace(props[0], this[propName]);
                        }
                        else {
                            toRemove.push(attr.nodeName);
                        }
                    }
                    return true;
                };
                ViewComponent.prototype._attrEventHandler = function (toRemove, attr) {
                    var _this = this;
                    toRemove.push(attr.nodeName);
                    if (this[attr.nodeValue] !== undefined && typeof this[attr.nodeValue] === "function") {
                        var eventType = attr.nodeName.substring(2);
                        var eventHandlerName_1 = attr.nodeValue;
                        attr.ownerElement.addEventListener(eventType, function (e) {
                            _this[eventHandlerName_1](e);
                        });
                    }
                    return true;
                };
                ViewComponent.prototype.insertChildComponent = function (viewComponentName, id, state, placeholder, index) {
                    if (state === null) {
                        state = {};
                    }
                    var visualComponent;
                    visualComponent = this._view.templateManager.getVisualComponent(viewComponentName);
                    if (visualComponent === null) {
                        throw new mvvm.VisualComponentNotRegisteredException(viewComponentName);
                    }
                    this._visualComponentInsertChild(placeholder, viewComponentName, id, index);
                    var thisState = {};
                    thisState[id] = state;
                    this.setState(thisState);
                };
                ViewComponent.prototype.removeChildComponent = function (placeholder, id) {
                    if (this.hasOwnProperty(id) && this[id] instanceof ViewComponent) {
                        this._visualComponentRemoveChild(placeholder, id);
                        this[id]._destroy();
                        delete this[id];
                        var i = this._stateKeys.indexOf(id);
                        if (i !== -1) {
                            this._stateKeys.splice(i, 1);
                        }
                    }
                };
                ViewComponent.prototype._visualComponentInsertChild = function (placeholder, componentName, id, index) {
                    if (this._visualComponent.placeholders.hasOwnProperty(placeholder)) {
                        var ph = this._visualComponent.placeholders[placeholder].placeholder;
                        var vc = ph.ownerDocument.createElement(componentName);
                        vc.setAttribute("id", id);
                        if (index !== undefined) {
                        }
                        else {
                            ph.appendChild(vc);
                        }
                        this._visualComponent.children[id] = {
                            tagName: componentName,
                            nameAttribute: null
                        };
                    }
                };
                ViewComponent.prototype._visualComponentRemoveChild = function (placeholder, id) {
                    if (this._visualComponent.placeholders.hasOwnProperty(placeholder)) {
                        var ph = this._visualComponent.placeholders[placeholder].placeholder;
                        var vc = null;
                        for (var i = 0; i < ph.childElementCount; i++) {
                            if (ph.children.item(i).hasAttribute("id") && ph.children.item(i).getAttribute("id") === id) {
                                vc = ph.children.item(i);
                                break;
                            }
                        }
                        if (vc !== null) {
                            ph.removeChild(vc);
                            delete this._visualComponent.children[id];
                        }
                    }
                };
                return ViewComponent;
            }());
            viewmodel.ViewComponent = ViewComponent;
        })(viewmodel = mvvm.viewmodel || (mvvm.viewmodel = {}));
    })(mvvm = ajs.mvvm || (ajs.mvvm = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var mvvm;
    (function (mvvm) {
        var viewmodel;
        (function (viewmodel) {
            "use strict";
            var ViewComponentManager = (function () {
                function ViewComponentManager() {
                    this._components = {};
                    this._componentInstances = {};
                }
                Object.defineProperty(ViewComponentManager.prototype, "components", {
                    get: function () { return this._components; },
                    enumerable: true,
                    configurable: true
                });
                ViewComponentManager.prototype.registerComponents = function () {
                    var componentConstructor = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        componentConstructor[_i - 0] = arguments[_i];
                    }
                    for (var i = 0; i < componentConstructor.length; i++) {
                        if (componentConstructor[i] instanceof Function) {
                            this._registerComponent(componentConstructor[i]);
                        }
                    }
                };
                ViewComponentManager.prototype._registerComponent = function (componentConstructor) {
                    if (componentConstructor instanceof Function) {
                        var componentName = "";
                        var parseName = /^function\s+([\w\$]+)\s*\(/.exec(componentConstructor.toString());
                        componentName = parseName ? parseName[1] : "";
                        componentName = componentName.toUpperCase();
                        if (this._components[componentName] === undefined) {
                            this._components[componentName] = componentConstructor;
                        }
                    }
                };
                ViewComponentManager.prototype.getComponentConstructorByName = function (name) {
                    if (this._components.hasOwnProperty(name.toUpperCase())) {
                        return this._components[name.toUpperCase()];
                    }
                    return null;
                };
                ViewComponentManager.prototype.isComponentConstructorRegistered = function (componentConstructor) {
                    for (var key in this._components) {
                        if (this._components[key] === componentConstructor) {
                            return true;
                        }
                    }
                    return false;
                };
                ViewComponentManager.prototype.registerComponentInstance = function (component) {
                    this._componentInstances[component.componentId] = component;
                };
                ViewComponentManager.prototype.removeComponentInstance = function (component) {
                    delete (this._componentInstances[component.componentId]);
                };
                ViewComponentManager.prototype.getComponentInstance = function (componentId) {
                    if (this._componentInstances.hasOwnProperty(componentId.toString())) {
                        return this._componentInstances[componentId];
                    }
                    return null;
                };
                return ViewComponentManager;
            }());
            viewmodel.ViewComponentManager = ViewComponentManager;
        })(viewmodel = mvvm.viewmodel || (mvvm.viewmodel = {}));
    })(mvvm = ajs.mvvm || (ajs.mvvm = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var navigation;
    (function (navigation) {
        "use strict";
        var Navigator = (function () {
            function Navigator(router) {
                var _this = this;
                this._router = router;
                this._lastUrl = "";
                window.addEventListener("popstate", function (event) { _this._onPopState(event); });
                window.addEventListener("hashchange", function (event) { _this._onHashChange(event); });
            }
            Object.defineProperty(Navigator.prototype, "router", {
                get: function () { return this.router; },
                enumerable: true,
                configurable: true
            });
            Navigator.prototype.navigated = function () {
                if (window.location.href !== this._lastUrl) {
                    this._lastUrl = window.location.href;
                    this._router.route();
                }
            };
            Navigator.prototype.navigate = function (url) {
                if (url !== this._lastUrl) {
                    this._lastUrl = url;
                    window.history.pushState({}, "", url);
                    this._router.route();
                }
            };
            Navigator.prototype._onPopState = function (event) {
                this.navigated();
            };
            Navigator.prototype._onHashChange = function (event) {
                this.navigated();
            };
            return Navigator;
        }());
        navigation.Navigator = Navigator;
    })(navigation = ajs.navigation || (ajs.navigation = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var resources;
    (function (resources) {
        "use strict";
        var AjsStorage = (function () {
            function AjsStorage() {
            }
            Object.defineProperty(AjsStorage.prototype, "supported", {
                /** Returns if the storage type (local, session) is supported by the browser */
                get: function () { return this._supported; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AjsStorage.prototype, "usedSpace", {
                /** Returns approximate total size of all resources stored in the storage in bytes */
                get: function () { return this._usedSpace; },
                enumerable: true,
                configurable: true
            });
            /**
             * Completely clears the storage
             * MUST BE OVERRIDEN IN INHERITED CLASS
             */
            AjsStorage.prototype.clear = function () {
                throw new resources.NotImplementedException();
            };
            /**
             * Adds a new resource to the storage
             * MUST BE OVERRIDEN IN INHERITED CLASS
             * @param resource Resource to be stored
             */
            AjsStorage.prototype.addResource = function (resource) {
                throw new resources.NotImplementedException;
            };
            /**
             * Returns the resource according the URL passed
             * MUST BE OVERRIDEN IN INHERITED CLASS
             * @param url URL of the resource to be returned
             */
            AjsStorage.prototype.getResource = function (url) {
                throw new resources.NotImplementedException();
            };
            /**
             * Updates cached resource
             * MUST BE OVERRIDEN IN INHERITED CLASS
             * @param resource Resource to be updated
             */
            AjsStorage.prototype.updateResource = function (resource) {
                throw new resources.NotImplementedException();
            };
            /**
             * Remove the resource from the storage
             * MUST BE OVERRIDEN IN INHERITED CLASS
             * @param url Url of the resource to be removed
             */
            AjsStorage.prototype.removeResource = function (url) {
                throw new resources.NotImplementedException;
            };
            return AjsStorage;
        }());
        resources.AjsStorage = AjsStorage;
    })(resources = ajs.resources || (ajs.resources = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var resources;
    (function (resources) {
        "use strict";
        /** Function is not implemented (probably must be implemented in derived class */
        var NotImplementedException = (function (_super) {
            __extends(NotImplementedException, _super);
            function NotImplementedException() {
                _super.apply(this, arguments);
            }
            return NotImplementedException;
        }(Error));
        resources.NotImplementedException = NotImplementedException;
        /** The required storage type is not supported by the browser */
        var StorageTypeNotSupportedException = (function (_super) {
            __extends(StorageTypeNotSupportedException, _super);
            function StorageTypeNotSupportedException() {
                _super.apply(this, arguments);
            }
            return StorageTypeNotSupportedException;
        }(Error));
        resources.StorageTypeNotSupportedException = StorageTypeNotSupportedException;
        /** If the storage is chosen the caching policy must be set */
        var CachePolicyMustBeSetException = (function (_super) {
            __extends(CachePolicyMustBeSetException, _super);
            function CachePolicyMustBeSetException() {
                _super.apply(this, arguments);
            }
            return CachePolicyMustBeSetException;
        }(Error));
        resources.CachePolicyMustBeSetException = CachePolicyMustBeSetException;
        /** Resource was not found in the storage */
        var ResourceNotFoundException = (function (_super) {
            __extends(ResourceNotFoundException, _super);
            function ResourceNotFoundException() {
                _super.apply(this, arguments);
            }
            return ResourceNotFoundException;
        }(Error));
        resources.ResourceNotFoundException = ResourceNotFoundException;
        /** Storage is out of space or the resource can't fit the storage */
        var NotEnoughSpaceInStorageException = (function (_super) {
            __extends(NotEnoughSpaceInStorageException, _super);
            function NotEnoughSpaceInStorageException() {
                _super.apply(this, arguments);
            }
            return NotEnoughSpaceInStorageException;
        }(Error));
        resources.NotEnoughSpaceInStorageException = NotEnoughSpaceInStorageException;
    })(resources = ajs.resources || (ajs.resources = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var resources;
    (function (resources) {
        "use strict";
    })(resources = ajs.resources || (ajs.resources = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var resources;
    (function (resources) {
        "use strict";
    })(resources = ajs.resources || (ajs.resources = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var resources;
    (function (resources) {
        "use strict";
    })(resources = ajs.resources || (ajs.resources = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var resources;
    (function (resources) {
        "use strict";
    })(resources = ajs.resources || (ajs.resources = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var resources;
    (function (resources) {
        "use strict";
    })(resources = ajs.resources || (ajs.resources = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var resources;
    (function (resources) {
        "use strict";
    })(resources = ajs.resources || (ajs.resources = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var resources;
    (function (resources) {
        "use strict";
    })(resources = ajs.resources || (ajs.resources = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var resources;
    (function (resources) {
        "use strict";
    })(resources = ajs.resources || (ajs.resources = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var resources;
    (function (resources) {
        "use strict";
    })(resources = ajs.resources || (ajs.resources = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var resources;
    (function (resources_1) {
        "use strict";
    })(resources = ajs.resources || (ajs.resources = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var resources;
    (function (resources) {
        "use strict";
    })(resources = ajs.resources || (ajs.resources = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var resources;
    (function (resources) {
        "use strict";
    })(resources = ajs.resources || (ajs.resources = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var resources;
    (function (resources) {
        "use strict";
        var ResourceLoader = (function () {
            function ResourceLoader() {
            }
            ResourceLoader.prototype.loadResource = function (loadEndHandler, url, userData, lastModified) {
                lastModified = lastModified || ajs.utils.minDate();
                var requestData = {
                    url: url,
                    userData: userData,
                    lastModified: lastModified,
                    startTime: new Date(),
                    loadEndHandler: loadEndHandler
                };
                this._loadResource(requestData);
            };
            ResourceLoader.prototype._loadResource = function (requestData) {
                var _this = this;
                var xhr = new XMLHttpRequest();
                xhr.open("GET", requestData.url);
                xhr.resourceRequestData = requestData;
                // ie9 does not support loadend event
                xhr.addEventListener("readystatechange", function (event) {
                    _this._loadEnd(event);
                });
                if (requestData.lastModified !== null) {
                    xhr.setRequestHeader("If-Modified-Since", requestData.lastModified.toUTCString());
                }
                xhr.send();
            };
            ResourceLoader.prototype._loadEnd = function (e) {
                var xhr = e.target;
                var requestData = xhr.resourceRequestData;
                if (xhr.readyState === 4) {
                    var responseData = {
                        type: xhr.responseType,
                        data: xhr.responseText,
                        userData: requestData.userData,
                        httpStatus: xhr.status,
                        startTime: requestData.startTime,
                        endTime: new Date()
                    };
                    if (requestData.loadEndHandler instanceof Function) {
                        requestData.loadEndHandler(responseData);
                    }
                }
            };
            return ResourceLoader;
        }());
        resources.ResourceLoader = ResourceLoader;
    })(resources = ajs.resources || (ajs.resources = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var resources;
    (function (resources_2) {
        "use strict";
        /** Default memory cache size is 20MB */
        var MEMORY_CACHE_SIZE = 20 * 1024 * 1024;
        /** Indicates if loaded scripts should executed using the eval function or by adding the <script> tag */
        var USE_EVAL = true;
        /** Resource types and their file name extensions */
        var RESOURCE_TYPES = {
            /** JavaScript resource */
            script: [".js"],
            /** Cascading stylesheet resource */
            style: [".css"],
            /** Text resource, such as HTML, XML, JSON, TXT */
            text: [".htm", ".html", ".xml", ".json", ".txt"],
            /** Binary resource, such as PNG, JPG, GIF */
            binary: [".png", ".jpg", ".jpeg"]
        };
        /** Storage cachedResourcesInfo key */
        resources_2.STORAGE_INFO_KEY = "AJSRESOURCEINFO";
        /** Storage resource data item key prefix */
        resources_2.STORAGE_RESOURCE_KEY_PREFIX = "AJSRESOURCE.";
        /** Storage key for testing if the resource fits the remaining free space */
        resources_2.STORAGE_ADDTEST_KEY = "AJSADDTEST";
        /** List of possible resource types */
        (function (RESOURCE_TYPE) {
            RESOURCE_TYPE[RESOURCE_TYPE["SCRIPT"] = 0] = "SCRIPT";
            RESOURCE_TYPE[RESOURCE_TYPE["STYLE"] = 1] = "STYLE";
            RESOURCE_TYPE[RESOURCE_TYPE["TEXT"] = 2] = "TEXT";
            RESOURCE_TYPE[RESOURCE_TYPE["BINARY"] = 3] = "BINARY";
            RESOURCE_TYPE[RESOURCE_TYPE["UNKNOWN"] = 4] = "UNKNOWN";
        })(resources_2.RESOURCE_TYPE || (resources_2.RESOURCE_TYPE = {}));
        var RESOURCE_TYPE = resources_2.RESOURCE_TYPE;
        /** Type of the storage - passed to the loadResource or loadResources methods */
        (function (STORAGE_TYPE) {
            STORAGE_TYPE[STORAGE_TYPE["NONE"] = 0] = "NONE";
            STORAGE_TYPE[STORAGE_TYPE["LOCAL"] = 1] = "LOCAL";
            STORAGE_TYPE[STORAGE_TYPE["SESSION"] = 2] = "SESSION";
            STORAGE_TYPE[STORAGE_TYPE["MEMORY"] = 3] = "MEMORY";
        })(resources_2.STORAGE_TYPE || (resources_2.STORAGE_TYPE = {}));
        var STORAGE_TYPE = resources_2.STORAGE_TYPE;
        /** Cache policy
         * NONE - Not used when the resource is cached
         * PERMANENT - Resource is cached permanently and is never automatically removed from the cache
         * LASTRECENTLYUSED - Resource is removed from the cache when there is no enough space and it is last recently used resource
         */
        (function (CACHE_POLICY) {
            CACHE_POLICY[CACHE_POLICY["NONE"] = 0] = "NONE";
            CACHE_POLICY[CACHE_POLICY["PERMANENT"] = 1] = "PERMANENT";
            CACHE_POLICY[CACHE_POLICY["LASTRECENTLYUSED"] = 2] = "LASTRECENTLYUSED";
        })(resources_2.CACHE_POLICY || (resources_2.CACHE_POLICY = {}));
        var CACHE_POLICY = resources_2.CACHE_POLICY;
        /**
         * Resource manager takes care of loading of resources from the server and caching them in the appropriate cache
         * <ul>
         *    <li>GET method is used to load resources</li>
         *    <li>If the resource is type of SCRIPT it is evaulated automatically and immediately on load.</li>
         *    <ul>
         *       <li>Scripts can be evaluated using the eval method or by adding the script tag to the main document</li>
         *       <li>This is drivent by the USE_EVAL constant and should not be changed in runtime</li>
         *       <li>EVAL should be used only for debugging purposes as the visual studio and IE can't handle source maps
         *           when the &lt;script&gt; tag is added</li>
         *       <li>If multiple resources are about to be loaded the evaluation of scripts occcurs when all are loaded successfully
         *           as the order of scripts to be loaded is important, because some can require others to be evaluated earlier</li>
         *    </ul>
         *    <li>If the resource is type of STYLE it is automatically registered to the style manager</li>
         *    <li>Other types of resources are not evaluated automatically and are just returned / cached</li>
         * </ul>
         */
        var ResourceManager = (function () {
            /**
             * Constructs the ResourceManager
             */
            function ResourceManager(config) {
                if (config === undefined) {
                    config = this._defaultConfig();
                }
                this._resourceLoader = new resources_2.ResourceLoader();
                this._storageLocal = new resources_2.StorageLocal();
                this._storageSession = new resources_2.StorageSession();
                this._storageMemory = new resources_2.StorageMemory(config.memoryCacheSize);
                if (config.removeResourcesOlderThan !== undefined) {
                    console.warn("IMPLEMENT: ResourceManager.constructor - removeResourcesOlderThan functionality");
                }
            }
            Object.defineProperty(ResourceManager.prototype, "resourceLoader", {
                /** Returns referrence to the ResourceLoader object used by the Resource Manager */
                get: function () { return this.resourceLoader; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ResourceManager.prototype, "storageLocal", {
                /** Returns referrence to the StorageLocal object used by the Resource Manager */
                get: function () { return this._storageLocal; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ResourceManager.prototype, "storageSession", {
                /** Returns referrence to the StorageSession object used by the Resource Manager */
                get: function () { return this._storageSession; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ResourceManager.prototype, "storageMemory", {
                /** Returns referrence to the StorageMemory object used by the Resource Manager */
                get: function () { return this._storageMemory; },
                enumerable: true,
                configurable: true
            });
            /**
             * Returnd the default ResourceManager configuration
             */
            ResourceManager.prototype._defaultConfig = function () {
                return {
                    memoryCacheSize: MEMORY_CACHE_SIZE
                };
            };
            /**
             * Load resource from server or from cache if it was not modified since last download and the cache was in use
             * If caching of the resource is required the resource is created or updated in the cache of given type
             * - GET method is used to load resources
             * - If the resource is type of SCRIPT it is evaulated automatically and immediately on load.
             *    - Scripts can be evaluated using the eval method or by adding the script tag to the main document
             *       - This is drivent by the USE_EVAL constant and should not be changed in runtime
             *       - EVAL should be used only for debugging purposes as the visual studio and IE can't handle source maps
             *         when the <script> tag is added
             *    - If multiple resources are about to be loaded the evaluation of scripts occcurs when all are loaded successfully
             *      as the order of scripts to be loaded is important, because some can require others to be evaluated earlier
             * - If the resource is type of STYLE it is automatically registered to the style manager
             * - Other types of resources are not evaluated automatically and are just returned / cached
             * @param loadEndCallback Function to be called when asynchronous request finishes
             * @param url Url of the resource to be loaded
             * @param userData Any user data to be passed back to the callback.
             *                 Set to null if data is not in use but other parameters have to be passed
             * @param storageType Type of storage to be used to cache the resource.
             *                    If the storage is not specified the direct download will be used
             * @param cachePolicy If the storage is specified the cache policy will set the cache behavior
             * @param executeScript Flag if the script should be executed automatically if loaded, default behaviour is true
             * @throws StorageTypeNotSupportedException Thrown when the storage is not supported by the browser
             * @throws CachePolicyMustBeSetException Thrown when the storage is set but the policy does not or is NONE;
             */
            ResourceManager.prototype.load = function (loadEndCallback, url, userData, storageType, cachePolicy, executeScript) {
                var _this = this;
                var resource = null;
                var storage = this._getStorageFromType(storageType);
                // basic checks and parameters update
                if (storage !== null) {
                    if (!storage.supported) {
                        throw new resources_2.StorageTypeNotSupportedException();
                    }
                    if (cachePolicy === undefined || cachePolicy === CACHE_POLICY.NONE) {
                        throw new resources_2.CachePolicyMustBeSetException();
                    }
                }
                else {
                    cachePolicy = CACHE_POLICY.NONE;
                }
                if (executeScript === undefined) {
                    executeScript = true;
                }
                // if resource is expected to be cached, try to load it from cache first
                resource = this.getCachedResource(url, storageType);
                // setup resource info anyway, even if the resource was not in cache or is not a cached resource
                if (resource === null) {
                    resource = {
                        url: url,
                        type: this._getResourceTypeFromURL(url),
                        data: null,
                        cached: false,
                        storage: storage,
                        cachePolicy: cachePolicy,
                        lastModified: null
                    };
                }
                // prepare loading info structure
                var resourceLoadingInfo = {
                    resource: resource,
                    userData: userData,
                    execScript: executeScript,
                    callback: loadEndCallback
                };
                // load the resource with the loadEndCallback
                this._resourceLoader.loadResource(function (response) { _this._loadEnd(response); }, url, resourceLoadingInfo, resource.lastModified);
            };
            /**
             * Loads multiple resources from the server or the same cache type and the same caching policy
             * @param loadEndCallback Function to be called when all asynchronous requests finishes
             * @param url Array of resource URL's to be loaded
             * @param userData Any user data to be passed back to the callback.
             *                 Set to null if data is not in use but other parameters have to be passed
             * @param storageType Type of storage to be used to cache resources.
             *                    If the storage is not specified the direct download will be used
             * @param cachePolicy If the storage is specified the cache policy will set the cache behavior for all resources loading
             */
            ResourceManager.prototype.loadMultiple = function (loadEndCallback, urls, userData, storageType, cachePolicy, executeScripts) {
                var _this = this;
                var resourcesLoadingInfo = {
                    loadingData: [],
                    userData: userData,
                    loadEndCallback: loadEndCallback
                };
                for (var i = 0; i < urls.length; i++) {
                    resourcesLoadingInfo.loadingData[i] = {
                        url: urls[i],
                        loadingFinished: false,
                        loaded: false,
                        resource: null
                    };
                }
                for (var i = 0; i < urls.length; i++) {
                    this.load(function (loaded, url, resource, userData) {
                        _this._nextLoaded(loaded, url, resource, userData);
                    }, urls[i], resourcesLoadingInfo, storageType, cachePolicy, executeScripts);
                }
            };
            /**
             * Returns cached resource
             * @param url Url of the cached resource
             * @param storageType type of the storage to be used for lookup
             */
            ResourceManager.prototype.getCachedResource = function (url, storageType) {
                var storage = this._getStorageFromType(storageType);
                if (storage !== null) {
                    var cachedResource = storage.getResource(url);
                    if (cachedResource !== null) {
                        var resource = {
                            url: url,
                            type: this._getResourceTypeFromURL(url),
                            data: cachedResource.data,
                            cached: true,
                            storage: storage,
                            cachePolicy: cachedResource.cachePolicy,
                            lastModified: cachedResource.lastModified
                        };
                        return resource;
                    }
                }
                return null;
            };
            /**
             * Called internally when loading of single resource finishes
             * @param response Information about the resource loaded passed from the resource loader
             */
            ResourceManager.prototype._loadEnd = function (response) {
                var loaded;
                var loadingInfo = response.userData;
                var url = loadingInfo.resource.url;
                // loaded successfully, update resource and also cache if necessary
                if (response.httpStatus === 200) {
                    loadingInfo.resource.data = response.data;
                    if (loadingInfo.resource.storage !== null) {
                        var cachedResource = {
                            url: loadingInfo.resource.url,
                            data: response.data,
                            cachePolicy: loadingInfo.resource.cachePolicy,
                            lastModified: new Date()
                        };
                        loadingInfo.resource.storage.updateResource(cachedResource);
                        loadingInfo.resource.cached = true;
                    }
                    loaded = true;
                }
                else {
                    // not modified, loaded successfully
                    // the resource loaded from cache is already set in the loading info
                    if (response.httpStatus === 304) {
                        loaded = true;
                    }
                    else {
                        // http failed but if resource was cached previously we are good
                        loaded = loadingInfo.resource.cached;
                        // if the resource was not cached neither loaded, don't return
                        // the value previously set to the loading info
                        if (!loaded) {
                            loadingInfo.resource = null;
                        }
                    }
                }
                // if the resource is script and should be executed, do it
                if (loaded && loadingInfo.resource.type === RESOURCE_TYPE.SCRIPT && loadingInfo.execScript) {
                    if (USE_EVAL) {
                        this._evalScript(loadingInfo.resource);
                    }
                    else {
                        this._addScriptTag(loadingInfo.resource);
                    }
                }
                // call the defined callback
                loadingInfo.callback(loaded, url, loadingInfo.resource, loadingInfo.userData);
            };
            /**
             * Called internally when multiple resources are about to be loaded andone of them finished
             * @param loaded Information if resource was loaded from the server or cache (true) or if error occured (false)
             * @param url Url of the resource
             * @param resource Loaded resource or null if error
             * @param userData Information about the callback and resources loading progress
             */
            ResourceManager.prototype._nextLoaded = function (loaded, url, resource, userData) {
                var allFinished = true;
                var allLoaded = true;
                var loadingInfo = userData;
                // update loading info (need to wait all required resourcess passess processing
                for (var i = 0; i < loadingInfo.loadingData.length; i++) {
                    if (url === loadingInfo.loadingData[i].url) {
                        loadingInfo.loadingData[i].resource = resource;
                        loadingInfo.loadingData[i].loaded = loaded;
                        loadingInfo.loadingData[i].loadingFinished = true;
                        break;
                    }
                }
                // for all resources check the finished and loaded status
                for (var i = 0; i < loadingInfo.loadingData.length; i++) {
                    allFinished = allFinished && loadingInfo.loadingData[i].loadingFinished;
                    allLoaded = allLoaded && loadingInfo.loadingData[i].loaded;
                }
                // if all resources finished loading, prepare callback params and call it
                if (allFinished) {
                    // if all succesfully loaded, execute all script resources in the order they were requested to be loaded
                    if (allLoaded) {
                        for (var i = 0; i < loadingInfo.loadingData.length; i++) {
                            if (loadingInfo.loadingData[i].resource.type === RESOURCE_TYPE.SCRIPT) {
                                if (USE_EVAL) {
                                    this._evalScript(loadingInfo.loadingData[i].resource);
                                }
                                else {
                                    this._addScriptTag(loadingInfo.loadingData[i].resource);
                                }
                            }
                        }
                    }
                    // prepare array of loaded resources to be passed to the callback
                    var resources_3 = [];
                    for (var i = 0; i < loadingInfo.loadingData.length; i++) {
                        resources_3.push(loadingInfo.loadingData[i].resource);
                    }
                    // call the defined callback
                    loadingInfo.loadEndCallback(allLoaded, resources_3, loadingInfo.userData);
                }
            };
            /**
             * Returns the storage instance from the storage type
             * @param storageType
             */
            ResourceManager.prototype._getStorageFromType = function (storageType) {
                switch (storageType) {
                    case STORAGE_TYPE.LOCAL:
                        return this._storageLocal;
                    case STORAGE_TYPE.SESSION:
                        return this._storageSession;
                    case STORAGE_TYPE.MEMORY:
                        return this._storageMemory;
                    default:
                        return null;
                }
            };
            /**
             * Returns the resource type from the resource file extension
             * @param url
             */
            ResourceManager.prototype._getResourceTypeFromURL = function (url) {
                var ext = url.substring(url.lastIndexOf("."));
                if (RESOURCE_TYPES.script.indexOf(ext) >= 0) {
                    return RESOURCE_TYPE.SCRIPT;
                }
                if (RESOURCE_TYPES.style.indexOf(ext) >= 0) {
                    return RESOURCE_TYPE.STYLE;
                }
                if (RESOURCE_TYPES.text.indexOf(ext) >= 0) {
                    return RESOURCE_TYPE.TEXT;
                }
                if (RESOURCE_TYPES.binary.indexOf(ext) >= 0) {
                    return RESOURCE_TYPE.BINARY;
                }
                return RESOURCE_TYPE.UNKNOWN;
            };
            /**
             * Evaluates the script resource - should be used only during debugging as IE / Visual Studio does not
             * work with source maps in the dynamically added <script> tag when debugging
             * @param resource Script resource to be evaluated
             */
            ResourceManager.prototype._evalScript = function (resource) {
                if (resource !== null && resource.data != null) {
                    var content = resource.data;
                    if (content.indexOf("//# sourceMappingURL") !== -1) {
                        content =
                            content.substring(0, content.lastIndexOf("\n")) +
                                "\n//# sourceMappingURL=" + resource.url + ".map" +
                                "\n//# sourceURL=" + resource.url;
                    }
                    eval.call(null, content);
                }
            };
            /**
             * Creates the script tag and adds the resource data to it (script is then executed automatically)
             * @param resource Script resource to be evaluated
             */
            ResourceManager.prototype._addScriptTag = function (resource) {
                // first check if the script was not added already
                var nodeList = document.head.getElementsByTagName("script");
                for (var i = 0; i < nodeList.length; i++) {
                    if (nodeList.item(i).id === resource.url) {
                        return;
                    }
                }
                // add script and its content
                var script = document.createElement("script");
                script.id = resource.url;
                script.type = "text/javascript";
                script.innerText = resource.data;
                document.head.appendChild(script);
            };
            return ResourceManager;
        }());
        resources_2.ResourceManager = ResourceManager;
    })(resources = ajs.resources || (ajs.resources = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var resources;
    (function (resources_4) {
        "use strict";
        /**
         * Represents the browser local storage (persistent until explicitly cleared)
         * The total amount of the data storable to the local storage is about 5MB
         *
         * updateResource method should be called after each resource data change
         *
         * Items are stored under two keys in the storage:
         * AJSRESOURCESINFO   - JSONed ICachedResource[] where data at all items is set to null
         * AJSRESOURCES.%URL% - JSONed resource data where %URL% is URL of the data
         * AJSADDTEST         - string of spaces for testing if it is possible to add / update resource
         */
        var StorageBrowser = (function (_super) {
            __extends(StorageBrowser, _super);
            function StorageBrowser() {
                _super.apply(this, arguments);
            }
            /**
             * Completely cleans all resources from the storage
             */
            StorageBrowser.prototype.clear = function () {
                // remove all data items
                for (var i = 0; i < this._resources.length; i++) {
                    this._storageProvider.removeItem(resources_4.STORAGE_RESOURCE_KEY_PREFIX + this._resources[i].url);
                }
                // remove stored resources information
                this._usedSpace = 0;
                this._resources = [];
                this._storageProvider.setItem(resources_4.STORAGE_INFO_KEY, JSON.stringify(this._resources));
            };
            /**
             * Adds a new resource to the storage
             * @param resource Resource to be stored
             * @throws NotEnoughSpaceInStorageException Thrown when there is not enough space in the storage to store the resource
             */
            StorageBrowser.prototype.addResource = function (resource) {
                // if the resource exists, update it
                if (this.getResource(resource.url) !== null) {
                    this.updateResource(resource);
                    return;
                }
                // prepare necessary variables
                var data = JSON.stringify(resource.data);
                var oldInfoSize = this._storageProvider.getItem(resources_4.STORAGE_INFO_KEY).length;
                var dataSize = data.length;
                // try to add the resource data to the storage
                try {
                    this._storageProvider.setItem(resources_4.STORAGE_RESOURCE_KEY_PREFIX + resource.url, data);
                }
                catch (e) {
                    // if there is no space, clean the cache and try it once more - don't catch the exception, let it pass further
                    this._cleanCache(dataSize);
                    // another try to add the resource
                    try {
                        this._storageProvider.setItem(resources_4.STORAGE_RESOURCE_KEY_PREFIX + resource.url, data);
                    }
                    catch (e) {
                        throw new resources_4.NotEnoughSpaceInStorageException();
                    }
                }
                // prepare the resource info to be added to this._resources
                var resourceInfo = {
                    url: resource.url,
                    data: null,
                    cachePolicy: resource.cachePolicy,
                    lastModified: resource.lastModified,
                    lastUsedTimestamp: new Date()
                };
                // add info about the resource to the list of stored resources
                this._resources.push(resourceInfo);
                // stringify the resources info
                var resourcesInfoStr = JSON.stringify(this._resources);
                var newInfoSize = resourcesInfoStr.length;
                // try to update info in the store
                try {
                    this._storageProvider.setItem(resources_4.STORAGE_INFO_KEY, resourcesInfoStr);
                }
                catch (e) {
                    this._storageProvider.removeItem(resources_4.STORAGE_RESOURCE_KEY_PREFIX + resource.url);
                    throw new resources_4.NotEnoughSpaceInStorageException();
                }
                // compute new size of the occupied space
                this._usedSpace += (newInfoSize - oldInfoSize) + dataSize;
            };
            /**
             * Returns the resource according the URL passed
             * @param url URL of the resource to be returned
             */
            StorageBrowser.prototype.getResource = function (url) {
                for (var i = 0; i < this._resources.length; i++) {
                    if (this._resources[i].url === url) {
                        // update last used timestamp
                        this._resources[i].lastUsedTimestamp = new Date();
                        var info = JSON.stringify(this._resources);
                        this._storageProvider.setItem(resources_4.STORAGE_INFO_KEY, info);
                        // prepare data
                        var dataStr = this._storageProvider.getItem(resources_4.STORAGE_RESOURCE_KEY_PREFIX + url);
                        var data = JSON.parse(dataStr);
                        // compose the ICachedResource
                        var resource = {
                            url: this._resources[i].url,
                            data: data,
                            cachePolicy: this._resources[i].cachePolicy,
                            lastModified: this._resources[i].lastModified,
                            lastUsedTimestamp: this._resources[i].lastUsedTimestamp,
                            size: dataStr.length
                        };
                        return resource;
                    }
                }
                return null;
            };
            /**
             * Updates cached resource
             * @param resource Resource to be updated
             * @throws NotEnoughSpaceInStorageException Thrown when there is not enough space
             *                                          in the storate to update the resource
             */
            StorageBrowser.prototype.updateResource = function (resource) {
                // if the resource not exist, create it
                if (this.getResource(resource.url) === null) {
                    this.addResource(resource);
                    return;
                }
                // prepare necessary variables
                var data = JSON.stringify(resource.data);
                var dataSize = data.length;
                var oldInfoSize = this._storageProvider.getItem(resources_4.STORAGE_INFO_KEY).length;
                var resourceKey = resources_4.STORAGE_RESOURCE_KEY_PREFIX + resource.url;
                var oldDataSize = this._storageProvider.getItem(resourceKey).length;
                // try to update the resource data in the storage
                try {
                    this._storageProvider.setItem(resources_4.STORAGE_RESOURCE_KEY_PREFIX + resource.url, data);
                }
                catch (e) {
                    // if there is no space, clean the cache and try it once more
                    // don't catch the exception, let it pass further
                    this._cleanCache(Math.abs(dataSize - oldDataSize));
                    // another try to update the resource
                    try {
                        this._storageProvider.setItem(resources_4.STORAGE_RESOURCE_KEY_PREFIX + resource.url, data);
                    }
                    catch (e) {
                        throw new resources_4.NotEnoughSpaceInStorageException();
                    }
                }
                // prepare the resource info to be added to this._resources
                var resourceInfo = {
                    url: resource.url,
                    data: null,
                    cachePolicy: resource.cachePolicy,
                    lastModified: resource.lastModified,
                    lastUsedTimestamp: new Date()
                };
                // update info about the resource to the list of stored resources
                this._resources[this._getResourceIndex(resource.url)] = resourceInfo;
                // stringify the resources info
                var resourcesInfoStr = JSON.stringify(this._resources);
                var newInfoSize = resourcesInfoStr.length;
                // try to update info in the store
                try {
                    this._storageProvider.setItem(resources_4.STORAGE_INFO_KEY, resourcesInfoStr);
                }
                catch (e) {
                    throw new resources_4.NotEnoughSpaceInStorageException();
                }
                // compute new size of the occupied space
                this._usedSpace += (newInfoSize - oldInfoSize) + (dataSize - oldDataSize);
            };
            /**
             * Remove the resource from the storage
             * @param url Url of the resource to be removed
             */
            StorageBrowser.prototype.removeResource = function (url) {
                // get reource from store and return if not exists
                var resource = this.getResource(url);
                if (resource === null) {
                    return;
                }
                // remove data
                this._storageProvider.removeItem(resources_4.STORAGE_RESOURCE_KEY_PREFIX + url);
                this._usedSpace -= resource.size;
                // remove info
                var oldInfoSize = this._storageProvider.getItem(resources_4.STORAGE_INFO_KEY).length;
                this._resources.splice(this._resources.indexOf(resource), 1);
                var info = JSON.stringify(this._resources);
                var newInfoSize = info.length;
                this._storageProvider.setItem(resources_4.STORAGE_INFO_KEY, info);
                // update used space
                this._usedSpace -= oldInfoSize - newInfoSize;
            };
            /**
             * Loads information about resources in the storage
             */
            StorageBrowser.prototype._getResourcesInfoFromLocalStorage = function () {
                var resources = [];
                var cachedResourcesInfoStr = this._storageProvider.getItem(resources_4.STORAGE_INFO_KEY);
                if (cachedResourcesInfoStr !== null) {
                    // get space occupied by the resources info
                    this._usedSpace = cachedResourcesInfoStr.length;
                    // set array of all ICachedResource in given storage
                    resources = JSON.parse(cachedResourcesInfoStr, this._resourceInfoJSONReviver);
                    // compute storage used space from the data of all resources
                    for (var i = void 0; i < resources.length; i++) {
                        var resourceKey = resources_4.STORAGE_RESOURCE_KEY_PREFIX + resources[i].url;
                        var item = this._storageProvider.getItem(resourceKey);
                        if (item !== null) {
                            this._usedSpace += item.length;
                        }
                    }
                }
                else {
                    this._storageProvider.setItem(resources_4.STORAGE_INFO_KEY, JSON.stringify([]));
                }
                return resources;
            };
            /**
             * Cleans the storage.
             * @param requiredSpace If defined the method tries to remove old
             *                      resources until there is enough space in the storage,
             *                      otherwise it removes all non-PERMANENT resources
             * @throws NotEnoughSpaceInStorageException If there is not required space in the store
             */
            StorageBrowser.prototype._cleanCache = function (requiredSpace) {
                // delete lru resource until there is enough space required
                if (requiredSpace !== undefined) {
                    // create string of required size
                    var testString = "";
                    for (var i_1 = 0; i_1 < requiredSpace; i_1++) {
                        testString += " ";
                    }
                    // sort the storage by last recently used resource
                    var orderedResources = this._resources.slice(0).sort(function (a, b) {
                        return a.lastUsedTimestamp < b.lastUsedTimestamp ?
                            -1 : a.lastUsedTimestamp > b.lastUsedTimestamp ?
                            1 : 0;
                    });
                    // remove oldest resources from the storage until the required space is created
                    var enoughSpace = void 0;
                    var i = 0;
                    // try to remove LRU resources from the storage until there is enough
                    // space in the storage
                    while (i < orderedResources.length && !enoughSpace) {
                        if (orderedResources[i].cachePolicy === resources_4.CACHE_POLICY.LASTRECENTLYUSED) {
                            this.removeResource(orderedResources[i].url);
                            // using a naive method check if there is enough space in the storage
                            try {
                                enoughSpace = true;
                                this._storageProvider.setItem(resources_4.STORAGE_ADDTEST_KEY, testString);
                            }
                            catch (e) {
                                enoughSpace = false;
                            }
                            if (enoughSpace) {
                                this._storageProvider.removeItem(resources_4.STORAGE_ADDTEST_KEY);
                            }
                        }
                        else {
                            i++;
                        }
                    }
                    // trow exception if there is not enough space for resource in the storage
                    if (!enoughSpace) {
                        throw new resources_4.NotEnoughSpaceInStorageException();
                    }
                }
                else {
                    var i = 0;
                    // remove all LRU resources
                    while (i < this._resources.length) {
                        if (this._resources[i].cachePolicy === resources_4.CACHE_POLICY.LASTRECENTLYUSED) {
                            this.removeResource(this._resources[i].url);
                        }
                        else {
                            i++;
                        }
                    }
                }
            };
            /**
             * Converts JSON string to Date
             * Used for resource info data loaded from storage and parsed from JSON to object
             * @param key
             * @param value
             */
            StorageBrowser.prototype._resourceInfoJSONReviver = function (key, value) {
                if (key === "lastModified" || key === "lastUsedTimestamp") {
                    return new Date(value);
                }
                return value;
            };
            /**
             * Returns resource index from the URL
             * If the resource is not found it returns -1
             * @param url
             */
            StorageBrowser.prototype._getResourceIndex = function (url) {
                for (var i = 0; i < this._resources.length; i++) {
                    if (this._resources[i].url === url) {
                        return i;
                    }
                }
                return -1;
            };
            return StorageBrowser;
        }(resources_4.AjsStorage));
        resources_4.StorageBrowser = StorageBrowser;
    })(resources = ajs.resources || (ajs.resources = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var resources;
    (function (resources) {
        "use strict";
        /**
         * Represents the browser local storage (persistent until explicitly cleared)
         * The total amount of the data storable to the local storage is about 5MB
         *
         * updateResource method should be called after each resource data change
         *
         * Implementation is in the StorageBrowser, the storage provider is set here
         *
         * Items are stored under two keys in the storage:
         * AJSRESOURCESINFO   - JSONed ICachedResource[] where data at all items is set to null
         * AJSRESOURCES.%URL% - JSONed resource data where %URL% is URL of the data
         * AJSADDTEST         - string of spaces for testing if it is possible to add / update resource
         */
        var StorageLocal = (function (_super) {
            __extends(StorageLocal, _super);
            /**
             * Construct the StorageLocal object
             */
            function StorageLocal() {
                _super.call(this);
                this._supported = window.localStorage !== undefined;
                if (this._supported) {
                    this._storageProvider = window.localStorage;
                    this._usedSpace = 0;
                    this._resources = this._getResourcesInfoFromLocalStorage();
                }
            }
            return StorageLocal;
        }(resources.StorageBrowser));
        resources.StorageLocal = StorageLocal;
    })(resources = ajs.resources || (ajs.resources = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var resources;
    (function (resources) {
        "use strict";
        /**
         * Represents larger but slow memory storage mainly for resources
         * which does not need to be stored in the session or local storages.
         * Typical use would be caching of static pages/templates loaded from
         * the server.
         *
         * Resources should not be updated heavily because the size of the resource
         * is recalculated everythime the resource is created or updated and the
         * storage mechanisms are executed in order to cleanup storage
         *
         * updateResource method should be called after each resource data change
         * If the same referece to resource data is used to modify the data the
         * storage internally does not know the data was changed so the size of the
         * data is out of sync the caching mechanism so the storage can quickly grow
         * above the limit set.
         *
         * Resources with both types of the storage policy counts into the resultant
         * size of the storage
         */
        var StorageMemory = (function (_super) {
            __extends(StorageMemory, _super);
            /**
             * Construct the StorageMemory object
             * @param size The maximum size of the memory storage
             */
            function StorageMemory(size) {
                _super.call(this);
                this._supported = true;
                this._maxSize = size;
                this._usedSpace = 0;
                this._resources = [];
            }
            Object.defineProperty(StorageMemory.prototype, "maxSize", {
                /** Returns the maximum size of the storage in bytes */
                get: function () { return this._maxSize; },
                enumerable: true,
                configurable: true
            });
            /**
             * Completely cleans all resources from the storage
             */
            StorageMemory.prototype.clear = function () {
                this._usedSpace = 0;
                this._resources = [];
            };
            /**
             * Adds a new resource to the storage
             * @param resource Resource to be stored
             * @throws CachePolicyMustBeSetException when the caching policy was not set or was NONE
             */
            StorageMemory.prototype.addResource = function (resource) {
                if (this.getResource(resource.url) !== null) {
                    this.updateResource(resource);
                    return;
                }
                if (resource.cachePolicy === resources.CACHE_POLICY.NONE) {
                    throw new resources.CachePolicyMustBeSetException();
                }
                var size = ajs.utils.sizeOf(resource);
                if (this._usedSpace + size > this._maxSize) {
                    this._cleanCache(this._maxSize - (size));
                }
                this._usedSpace += size;
                resource.size = size;
                resource.lastUsedTimestamp = new Date();
                this._resources.push(resource);
            };
            /**
             * Returns the resource according the URL passed
             * @param url URL of the resource to be returned
             */
            StorageMemory.prototype.getResource = function (url) {
                for (var i = 0; i < this._resources.length; i++) {
                    if (this._resources[i].url === url) {
                        this._resources[i].lastUsedTimestamp = new Date();
                        return this._resources[i];
                    }
                }
                return null;
            };
            /**
             * Updates cached resource
             * @param resource Resource to be updated
             */
            StorageMemory.prototype.updateResource = function (resource) {
                var cachedResource = this.getResource(resource.url);
                if (cachedResource === null) {
                    this.addResource(resource);
                    return;
                }
                var oldSize = cachedResource.size;
                var newSize = ajs.utils.sizeOf(cachedResource);
                if (newSize > oldSize && this._usedSpace + (newSize - oldSize) > this._maxSize) {
                    this._cleanCache(newSize - oldSize);
                }
                this._usedSpace += newSize - oldSize;
                resource.size = newSize;
                resource.lastUsedTimestamp = new Date();
            };
            /**
             * Remove the resource from the storage
             * @param url Url of the resource to be removed
             */
            StorageMemory.prototype.removeResource = function (url) {
                for (var i = 0; i < this._resources.length; i++) {
                    if (this._resources[i].url === url) {
                        this._usedSpace -= this._resources[i].size;
                        this._resources.splice(i, 1);
                        break;
                    }
                }
            };
            /**
             * Cleans the storage.
             * @param requiredSpace If defined the method tries to remove old
             *                      resources until there is enough space in the storage,
             *                      otherwise it removes all non-PERMANENT resources
             * @throws NotEnoughSpaceInStorageException If there is not required space in the store
             */
            StorageMemory.prototype._cleanCache = function (requiredSpace) {
                // delete lru resource until there is enough space required
                if (requiredSpace !== undefined) {
                    // sort the storage by last recently used resource
                    var orderedResources = this._resources.slice(0).sort(function (a, b) {
                        return a.lastUsedTimestamp < b.lastUsedTimestamp ? -1 : a.lastUsedTimestamp > b.lastUsedTimestamp ? 1 : 0;
                    });
                    // remove oldest resources from the storage
                    var i = 0;
                    while (i < orderedResources.length || this._usedSpace + requiredSpace > this._maxSize) {
                        if (orderedResources[i].cachePolicy === resources.CACHE_POLICY.LASTRECENTLYUSED) {
                            this.removeResource(orderedResources[i].url);
                        }
                        else {
                            i++;
                        }
                    }
                    // trow exception if there is not enough space for resource in the storage
                    if (this._usedSpace + requiredSpace > this._maxSize) {
                        throw new resources.NotEnoughSpaceInStorageException();
                    }
                }
                else {
                    var i = 0;
                    while (i < this._resources.length) {
                        if (this._resources[i].cachePolicy === resources.CACHE_POLICY.LASTRECENTLYUSED) {
                            this._usedSpace -= this._resources[i].size;
                            this._resources.splice(i, 1);
                        }
                        else {
                            i++;
                        }
                    }
                }
            };
            return StorageMemory;
        }(resources.AjsStorage));
        resources.StorageMemory = StorageMemory;
    })(resources = ajs.resources || (ajs.resources = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var resources;
    (function (resources) {
        "use strict";
        /**
         * Represents the browser session storage (persistent until explicitly cleared)
         * The total amount of the data storable to the session storage is about 5MB
         *
         * updateResource method should be called after each resource data change
         *
         * Implementation is in the StorageBrowser, the storage provider is set here
         *
         * Items are stored under two keys in the storage:
         * AJSRESOURCESINFO   - JSONed ICachedResource[] where data at all items is set to null
         * AJSRESOURCES.%URL% - JSONed resource data where %URL% is URL of the data
         * AJSADDTEST         - string of spaces for testing if it is possible to add / update resource
         */
        var StorageSession = (function (_super) {
            __extends(StorageSession, _super);
            /**
             * Construct the StorageSession object
             */
            function StorageSession() {
                _super.call(this);
                this._supported = window.localStorage !== undefined;
                if (this._supported) {
                    this._storageProvider = window.sessionStorage;
                    this._usedSpace = 0;
                    this._resources = this._getResourcesInfoFromLocalStorage();
                }
            }
            return StorageSession;
        }(resources.StorageBrowser));
        resources.StorageSession = StorageSession;
    })(resources = ajs.resources || (ajs.resources = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var routing;
    (function (routing) {
        "use strict";
    })(routing = ajs.routing || (ajs.routing = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var routing;
    (function (routing) {
        "use strict";
    })(routing = ajs.routing || (ajs.routing = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var routing;
    (function (routing) {
        "use strict";
    })(routing = ajs.routing || (ajs.routing = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var routing;
    (function (routing) {
        "use strict";
        var Router = (function () {
            function Router(view, defaultViewComponentName, exceptionViewComponentName) {
                this._view = view;
                this._routes = [];
                this._lastURL = "";
                this._lastViewComponentName = null;
                this._lastViewComponentInstance = null;
                this._currentRoute = { base: "", path: "", search: "", hash: "" };
                if (defaultViewComponentName !== undefined) {
                    this._defaultViewComponentName = defaultViewComponentName;
                }
                else {
                    this._defaultViewComponentName = null;
                }
                if (exceptionViewComponentName !== undefined) {
                    this._exceptionViewComponentName = exceptionViewComponentName;
                }
                else {
                    this._exceptionViewComponentName = null;
                }
            }
            Object.defineProperty(Router.prototype, "routes", {
                get: function () { return this._routes; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Router.prototype, "defaultViewComponentName", {
                get: function () { return this._defaultViewComponentName; },
                set: function (value) { this._defaultViewComponentName = value; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Router.prototype, "exceptionViewComponentName", {
                get: function () { return this._exceptionViewComponentName; },
                set: function (value) { this._exceptionViewComponentName = value; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Router.prototype, "currentRoute", {
                get: function () { return this._currentRoute; },
                enumerable: true,
                configurable: true
            });
            Router.prototype.registerRoute = function (paths, viewComponentName) {
                this._routes.push({
                    paths: paths,
                    viewComponentName: viewComponentName
                });
            };
            Router.prototype.route = function () {
                if (this._lastURL !== window.location.href) {
                    this._lastURL = window.location.href;
                    var viewComponentName = this._getRouteViewComponent();
                    if (viewComponentName !== null) {
                        if (this._lastViewComponentName !== viewComponentName) {
                            this._lastViewComponentName = viewComponentName;
                            this._view.rootViewComponentName = viewComponentName;
                        }
                        else {
                            this._view.onNavigate();
                        }
                    }
                }
            };
            Router.prototype._getRouteViewComponent = function () {
                for (var i = 0; i < this._routes.length; i++) {
                    for (var j = 0; j < this._routes[i].paths.length; j++) {
                        var rx = new RegExp(this._routes[i].paths[j].base + this._routes[i].paths[j].params, "g");
                        if (rx.test(window.location.pathname)) {
                            var routeURI = window.location.pathname + window.location.search + window.location.hash;
                            var base = routeURI.match(this._routes[i].paths[j].base)[0];
                            var path = routeURI.substr(base.length);
                            if (base[0] === "/") {
                                base = base.substr(1);
                            }
                            if (path.indexOf("#") !== -1) {
                                path = path.substr(0, path.indexOf("#"));
                            }
                            if (path.indexOf("?") !== -1) {
                                path = path.substr(0, path.indexOf("?"));
                            }
                            if (path[0] === "/") {
                                path = path.substr(1);
                            }
                            if (path[path.length - 1] === "/") {
                                path = path.substr(0, path.length - 1);
                            }
                            this._currentRoute = {
                                base: base,
                                path: path,
                                search: window.location.search.substr(1),
                                hash: window.location.hash.substr(1)
                            };
                            return this._routes[i].viewComponentName;
                        }
                    }
                }
                return this._defaultViewComponentName;
            };
            return Router;
        }());
        routing.Router = Router;
    })(routing = ajs.routing || (ajs.routing = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var routing;
    (function (routing) {
        "use strict";
        var NoRoutesConfigured = (function (_super) {
            __extends(NoRoutesConfigured, _super);
            function NoRoutesConfigured() {
                _super.apply(this, arguments);
            }
            return NoRoutesConfigured;
        }(Error));
        routing.NoRoutesConfigured = NoRoutesConfigured;
    })(routing = ajs.routing || (ajs.routing = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var templating;
    (function (templating) {
        "use strict";
    })(templating = ajs.templating || (ajs.templating = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var templating;
    (function (templating) {
        "use strict";
        var PlaceholdersCantHaveChildrenNodesException = (function (_super) {
            __extends(PlaceholdersCantHaveChildrenNodesException, _super);
            function PlaceholdersCantHaveChildrenNodesException() {
                _super.apply(this, arguments);
            }
            return PlaceholdersCantHaveChildrenNodesException;
        }(Error));
        templating.PlaceholdersCantHaveChildrenNodesException = PlaceholdersCantHaveChildrenNodesException;
        var MissingVisualComponentNameException = (function (_super) {
            __extends(MissingVisualComponentNameException, _super);
            function MissingVisualComponentNameException() {
                _super.apply(this, arguments);
            }
            return MissingVisualComponentNameException;
        }(Error));
        templating.MissingVisualComponentNameException = MissingVisualComponentNameException;
    })(templating = ajs.templating || (ajs.templating = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var templating;
    (function (templating) {
        "use strict";
    })(templating = ajs.templating || (ajs.templating = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var templating;
    (function (templating) {
        "use strict";
    })(templating = ajs.templating || (ajs.templating = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var templating;
    (function (templating) {
        "use strict";
    })(templating = ajs.templating || (ajs.templating = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var templating;
    (function (templating) {
        "use strict";
    })(templating = ajs.templating || (ajs.templating = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var templating;
    (function (templating) {
        "use strict";
    })(templating = ajs.templating || (ajs.templating = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var templating;
    (function (templating) {
        "use strict";
    })(templating = ajs.templating || (ajs.templating = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var templating;
    (function (templating) {
        "use strict";
    })(templating = ajs.templating || (ajs.templating = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var templating;
    (function (templating) {
        "use strict";
    })(templating = ajs.templating || (ajs.templating = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var templating;
    (function (templating) {
        "use strict";
        var Template = (function () {
            function Template(name, html) {
                this._name = name;
                this._template = document.implementation.createHTMLDocument(name);
                this._template.body.innerHTML = html;
                this._visualComponents = this._getVisualComponents();
            }
            Object.defineProperty(Template.prototype, "name", {
                get: function () { return this._name; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Template.prototype, "template", {
                get: function () { return this._template; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Template.prototype, "visualComponents", {
                get: function () { return this._visualComponents; },
                enumerable: true,
                configurable: true
            });
            Template.prototype._getVisualComponents = function () {
                var _this = this;
                var components = {};
                this._walkHTMLTree(this._template.body, function (element) {
                    if (element.nodeName === "COMPONENT" || element.hasAttribute("component")) {
                        var name_1;
                        if (element.nodeName === "COMPONENT" && element.hasAttribute("name")) {
                            name_1 = element.getAttribute("name").toUpperCase();
                        }
                        else {
                            if (element.hasAttribute("component")) {
                                name_1 = element.getAttribute("component").toUpperCase();
                            }
                            else {
                                throw new templating.MissingVisualComponentNameException();
                            }
                        }
                        components[name_1] = {
                            component: element,
                            template: _this,
                            templateName: _this._name,
                            children: _this._getChildrenComponents(element),
                            placeholders: _this._getChildrenPlaceholders(element)
                        };
                    }
                });
                return components;
            };
            Template.prototype._walkHTMLTree = function (root, elementCallback) {
                if (root instanceof HTMLElement) {
                    for (var i = 0; i < root.children.length; i++) {
                        if (root.children.item(i).nodeType === Node.ELEMENT_NODE) {
                            elementCallback(root.children.item(i));
                            this._walkHTMLTree(root.children.item(i), elementCallback);
                        }
                    }
                }
            };
            Template.prototype._getChildrenComponents = function (element, childrenComponents) {
                childrenComponents = childrenComponents || {};
                for (var i = 0; i < element.childNodes.length; i++) {
                    var node = element.childNodes.item(i);
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (ajs.utils.HTMLTags.indexOf(node.nodeName.toUpperCase()) === -1) {
                            var nameAttribute = null;
                            if (node.nodeName === "COMPONENT" && node.hasAttribute("name")) {
                                nameAttribute = node.getAttribute("name");
                            }
                            var id = null;
                            if (node.hasAttribute("id")) {
                                id = node.attributes.getNamedItem("id").nodeValue;
                            }
                            if (id !== null) {
                                childrenComponents[id] = {
                                    tagName: node.nodeName.toUpperCase(),
                                    nameAttribute: nameAttribute
                                };
                            }
                        }
                        else if (node.hasAttribute("component") && node.hasAttribute("id")) {
                            var id = node.getAttribute("id");
                            var cn = node.getAttribute("component");
                            childrenComponents[id] = {
                                tagName: cn,
                                nameAttribute: null
                            };
                        }
                        else {
                            this._getChildrenComponents(node, childrenComponents);
                        }
                    }
                }
                return childrenComponents;
            };
            Template.prototype._isChildrenComponent = function () {
            };
            Template.prototype._getChildrenPlaceholders = function (element, placeholders) {
                placeholders = placeholders || {};
                for (var i = 0; i < element.childNodes.length; i++) {
                    var node = element.childNodes.item(i);
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.hasAttribute("placeholder")) {
                            var id = node.attributes.getNamedItem("placeholder").nodeValue;
                            placeholders[id] = {
                                placeholder: node
                            };
                            if (node.hasChildNodes()) {
                                throw new templating.PlaceholdersCantHaveChildrenNodesException();
                            }
                        }
                        else {
                            this._getChildrenPlaceholders(node, placeholders);
                        }
                    }
                }
                return placeholders;
            };
            return Template;
        }());
        templating.Template = Template;
    })(templating = ajs.templating || (ajs.templating = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var templating;
    (function (templating) {
        "use strict";
        var TemplateManager = (function () {
            function TemplateManager() {
                this._templates = {};
                this._visualComponents = {};
            }
            Object.defineProperty(TemplateManager.prototype, "templates", {
                get: function () { return this._templates; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TemplateManager.prototype, "VisualComponents", {
                get: function () { return this._visualComponents; },
                enumerable: true,
                configurable: true
            });
            TemplateManager.prototype.loadTemplateFiles = function (templatesCreatedCallback, paths, storageType, cachePolicy) {
                var _this = this;
                ajs.Framework.resourceManager.loadMultiple(function (allLoaded, resources) {
                    _this._templateFilesLoaded(allLoaded, resources, templatesCreatedCallback);
                }, paths, null, storageType, cachePolicy);
            };
            TemplateManager.prototype.loadTemplatesFromResource = function (resource) {
                this._parseTemplate(resource.data);
            };
            TemplateManager.prototype._templateFilesLoaded = function (allLoaded, resources, templatesCreatedCallback) {
                if (allLoaded) {
                    for (var i = 0; i < resources.length; i++) {
                        var data = resources[i].data;
                        this._parseTemplatesFile(data);
                    }
                    templatesCreatedCallback(allLoaded);
                }
            };
            TemplateManager.prototype._parseTemplatesFile = function (html) {
                var doc = document.implementation.createHTMLDocument("templates");
                doc.body.innerHTML = html;
                var templateTags = doc.getElementsByTagName("template");
                for (var i = 0; i < templateTags.length; i++) {
                    this._parseTemplate(templateTags.item(i));
                }
            };
            TemplateManager.prototype._parseTemplate = function (templateTag) {
                var templateName = "";
                if (templateTag.hasAttribute("name")) {
                    templateName = templateTag.attributes.getNamedItem("name").value;
                }
                var template = new templating.Template(templateName, templateTag.innerHTML);
                this._templates[templateName] = template;
                for (var visualComponentName in template.visualComponents) {
                    if (template.visualComponents.hasOwnProperty(visualComponentName)) {
                        this._visualComponents[visualComponentName] = template.visualComponents[visualComponentName];
                    }
                }
            };
            TemplateManager.prototype.getTemplate = function (name) {
                if (this._templates.hasOwnProperty(name)) {
                    return this._templates[name];
                }
                return null;
            };
            TemplateManager.prototype.getVisualComponent = function (name) {
                if (this._visualComponents.hasOwnProperty(name.toUpperCase())) {
                    return this._visualComponents[name.toUpperCase()];
                }
                return null;
            };
            TemplateManager.prototype.getVisualComponentTemplate = function (name) {
                if (this._visualComponents.hasOwnProperty(name)) {
                    var templateName = this._visualComponents[name].templateName;
                    var template = this.getTemplate(templateName);
                    return template;
                }
                return null;
            };
            return TemplateManager;
        }());
        templating.TemplateManager = TemplateManager;
    })(templating = ajs.templating || (ajs.templating = {}));
})(ajs || (ajs = {}));
/* *************************************************************************
The MIT License (MIT)

Copyright(c) 2014

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and / or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

Source: https://github.com/beatgammit/base64-js
**************************************************************************** */
var ajs;
(function (ajs) {
    var utils;
    (function (utils) {
        "use strict";
        var Base64 = (function () {
            function Base64() {
            }
            Base64.init = function () {
                var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
                for (var i = 0, len = code.length; i < len; ++i) {
                    Base64._lookup[i] = code[i];
                    Base64._revLookup[code.charCodeAt(i)] = i;
                }
                Base64._revLookup["-".charCodeAt(0)] = 62;
                Base64._revLookup["_".charCodeAt(0)] = 63;
            };
            Base64.toByteArray = function (b64) {
                var i, j, l, tmp, placeHolders, arr;
                var len = b64.length;
                if (len % 4 > 0) {
                    throw new Error("Invalid string. Length must be a multiple of 4");
                }
                placeHolders = b64[len - 2] === "=" ? 2 : b64[len - 1] === "=" ? 1 : 0;
                arr = new Base64._arr(len * 3 / 4 - placeHolders);
                l = placeHolders > 0 ? len - 4 : len;
                var L = 0;
                for (i = 0, j = 0; i < l; i += 4, j += 3) {
                    tmp = (Base64._revLookup[b64.charCodeAt(i)] << 18) | (Base64._revLookup[b64.charCodeAt(i + 1)] << 12) | (Base64._revLookup[b64.charCodeAt(i + 2)] << 6) | Base64._revLookup[b64.charCodeAt(i + 3)];
                    arr[L++] = (tmp >> 16) & 0xFF;
                    arr[L++] = (tmp >> 8) & 0xFF;
                    arr[L++] = tmp & 0xFF;
                }
                if (placeHolders === 2) {
                    tmp = (Base64._revLookup[b64.charCodeAt(i)] << 2) | (Base64._revLookup[b64.charCodeAt(i + 1)] >> 4);
                    arr[L++] = tmp & 0xFF;
                }
                else if (placeHolders === 1) {
                    tmp = (Base64._revLookup[b64.charCodeAt(i)] << 10) | (Base64._revLookup[b64.charCodeAt(i + 1)] << 4) | (Base64._revLookup[b64.charCodeAt(i + 2)] >> 2);
                    arr[L++] = (tmp >> 8) & 0xFF;
                    arr[L++] = tmp & 0xFF;
                }
                return arr;
            };
            Base64._tripletToBase64 = function (num) {
                return Base64._lookup[num >> 18 & 0x3F] + Base64._lookup[num >> 12 & 0x3F] + Base64._lookup[num >> 6 & 0x3F] + Base64._lookup[num & 0x3F];
            };
            Base64._encodeChunk = function (uint8, start, end) {
                var tmp;
                var output = [];
                for (var i = start; i < end; i += 3) {
                    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
                    output.push(Base64._tripletToBase64(tmp));
                }
                return output.join("");
            };
            Base64.fromByteArray = function (uint8) {
                var tmp;
                var len = uint8.length;
                var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
                var output = "";
                var parts = [];
                var maxChunkLength = 16383; // must be multiple of 3
                // go through the array every three bytes, we'll deal with trailing stuff later
                for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
                    parts.push(Base64._encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)));
                }
                // pad the end with zeros, but make sure to not forget the extra bytes
                if (extraBytes === 1) {
                    tmp = uint8[len - 1];
                    output += Base64._lookup[tmp >> 2];
                    output += Base64._lookup[(tmp << 4) & 0x3F];
                    output += "==";
                }
                else if (extraBytes === 2) {
                    tmp = (uint8[len - 2] << 8) + (uint8[len - 1]);
                    output += Base64._lookup[tmp >> 10];
                    output += Base64._lookup[(tmp >> 4) & 0x3F];
                    output += Base64._lookup[(tmp << 2) & 0x3F];
                    output += "=";
                }
                parts.push(output);
                return parts.join("");
            };
            Base64._lookup = [];
            Base64._revLookup = [];
            Base64._arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
            return Base64;
        }());
        utils.Base64 = Base64;
        Base64.init();
    })(utils = ajs.utils || (ajs.utils = {}));
})(ajs || (ajs = {}));
/* *************************************************************************
The MIT License (MIT)

Copyright (c) 2012 Nicholas Fisher

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

Source: https://github.com/KyleAMathews/deepmerge
**************************************************************************** */
var ajs;
(function (ajs) {
    var utils;
    (function (utils) {
        "use strict";
        var DeepMerge = (function () {
            function DeepMerge() {
            }
            DeepMerge.isMergeableObject = function (val) {
                var nonNullObject = val && typeof val === "object";
                return nonNullObject
                    && Object.prototype.toString.call(val) !== "[object RegExp]"
                    && Object.prototype.toString.call(val) !== "[object Date]";
            };
            DeepMerge.emptyTarget = function (val) {
                return Array.isArray(val) ? [] : {};
            };
            DeepMerge.cloneIfNecessary = function (value, optionsArgument) {
                var clone = optionsArgument && optionsArgument.clone === true;
                return (clone && DeepMerge.isMergeableObject(value)) ?
                    DeepMerge.merge(DeepMerge.emptyTarget(value), value, optionsArgument) : value;
            };
            DeepMerge.defaultArrayMerge = function (target, source, optionsArgument) {
                var destination = target.slice();
                source.forEach(function (e, i) {
                    if (typeof destination[i] === "undefined") {
                        destination[i] = DeepMerge.cloneIfNecessary(e, optionsArgument);
                    }
                    else if (DeepMerge.isMergeableObject(e)) {
                        destination[i] = DeepMerge.merge(target[i], e, optionsArgument);
                    }
                    else if (target.indexOf(e) === -1) {
                        destination.push(DeepMerge.cloneIfNecessary(e, optionsArgument));
                    }
                });
                return destination;
            };
            DeepMerge.mergeObject = function (target, source, optionsArgument) {
                var destination = {};
                if (DeepMerge.isMergeableObject(target)) {
                    Object.keys(target).forEach(function (key) {
                        destination[key] = DeepMerge.cloneIfNecessary(target[key], optionsArgument);
                    });
                }
                Object.keys(source).forEach(function (key) {
                    if (!DeepMerge.isMergeableObject(source[key]) || !target[key]) {
                        destination[key] = DeepMerge.cloneIfNecessary(source[key], optionsArgument);
                    }
                    else {
                        destination[key] = DeepMerge.merge(target[key], source[key], optionsArgument);
                    }
                });
                return destination;
            };
            DeepMerge.merge = function (target, source, optionsArgument) {
                var array = Array.isArray(source);
                var options = optionsArgument || { arrayMerge: DeepMerge.defaultArrayMerge };
                var arrayMerge = options.arrayMerge || DeepMerge.defaultArrayMerge;
                if (array) {
                    return Array.isArray(target) ?
                        arrayMerge(target, source, optionsArgument) : DeepMerge.cloneIfNecessary(source, optionsArgument);
                }
                else {
                    return DeepMerge.mergeObject(target, source, optionsArgument);
                }
            };
            return DeepMerge;
        }());
        utils.DeepMerge = DeepMerge;
    })(utils = ajs.utils || (ajs.utils = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var utils;
    (function (utils) {
        "use strict";
        utils.HTMLTags = [
            "A",
            "ABBR",
            "ACRONYM",
            "ADDRESS",
            "APPLET",
            "AREA",
            "ARTICLE",
            "ASIDE",
            "AUDIO",
            "B",
            "BASE",
            "BASEFONT",
            "BDI",
            "BDO",
            "BIG",
            "BLOCKQUOTE",
            "BODY",
            "BR",
            "BUTTON",
            "CANVAS",
            "CAPTION",
            "CENTER",
            "CITE",
            "CODE",
            "COL",
            "COLGROUP",
            "DATALIST",
            "DD",
            "DEL",
            "DETAILS",
            "DFN",
            "DIALOG",
            "DIR",
            "DIV",
            "DL",
            "DT",
            "EM",
            "EMBED",
            "FIELDSET",
            "FIGCAPTION",
            "FIGURE",
            "FONT",
            "FOOTER",
            "FORM",
            "FRAME",
            "FRAMESET",
            "H1",
            "H2",
            "H3",
            "H4",
            "H5",
            "H6",
            "HEAD",
            "HEADER",
            "HR",
            "HTML",
            "I",
            "IFRAME",
            "IMG",
            "INPUT",
            "INS",
            "KBD",
            "KEYGEN",
            "LABEL",
            "LEGEND",
            "LI",
            "LINK",
            "MAIN",
            "MAP",
            "MARK",
            "MENU",
            "MENUITEM",
            "META",
            "METER",
            "NAV",
            "NOFRAMES",
            "NOSCRIPT",
            "OBJECT",
            "OL",
            "OPTGROUP",
            "OPTION",
            "OUTPUT",
            "P",
            "PARAM",
            "PRE",
            "PROGRESS",
            "Q",
            "RP",
            "RT",
            "RUBY",
            "S",
            "SAMP",
            "SCRIPT",
            "SECTION",
            "SELECT",
            "SMALL",
            "SOURCE",
            "SPAN",
            "STRIKE",
            "STRONG",
            "STYLE",
            "SUB",
            "SUMMARY",
            "SUP",
            "TABLE",
            "TBODY",
            "TD",
            "TEXTAREA",
            "TFOOT",
            "TH",
            "THEAD",
            "TIME",
            "TITLE",
            "TR",
            "TRACK",
            "TT",
            "U",
            "UL",
            "VAR",
            "VIDEO",
            "WBR"
        ];
    })(utils = ajs.utils || (ajs.utils = {}));
})(ajs || (ajs = {}));
/* *************************************************************************
$Id: Iuppiter.js 3026 2010-06-23 10:03:13Z Bear $

Copyright (c) 2010 Nuwa Information Co., Ltd, and individual contributors.
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

  1. Redistributions of source code must retain the above copyright notice,
     this list of conditions and the following disclaimer.

  2. Redistributions in binary form must reproduce the above copyright
     notice, this list of conditions and the following disclaimer in the
     documentation and/or other materials provided with the distribution.

  3. Neither the name of Nuwa Information nor the names of its contributors
     may be used to endorse or promote products derived from this software
     without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

$Author: Bear $
$Date: 2010-06-23 18:03:13 +0800 (星期三, 23 六月 2010) $
$Revision: 3026 $

Source: https://github.com/vitorio/jslzjb/blob/master/Iuppiter.js
**************************************************************************** */
var ajs;
(function (ajs) {
    var utils;
    (function (utils) {
        "use strict";
        var LZJB = (function () {
            function LZJB() {
            }
            LZJB.init = function () {
                this.MATCH_MAX = ((1 << this.MATCH_BITS) + (this.MATCH_MIN - 1));
                this.OFFSET_MASK = ((1 << (16 - this.MATCH_BITS)) - 1);
            };
            /**
             * Convert string value to a byte array.
             *
             * @param {String} input The input string value.
             * @return {Array} A byte array from string value.
             */
            LZJB.toByteArray = function (input) {
                var b = [], i, unicode;
                for (i = 0; i < input.length; i++) {
                    unicode = input.charCodeAt(i);
                    // 0x00000000 - 0x0000007f -> 0xxxxxxx
                    if (unicode <= 0x7f) {
                        b.push(unicode);
                    }
                    else if (unicode <= 0x7ff) {
                        b.push((unicode >> 6) | 0xc0);
                        b.push((unicode & 0x3F) | 0x80);
                    }
                    else if (unicode <= 0xffff) {
                        b.push((unicode >> 12) | 0xe0);
                        b.push(((unicode >> 6) & 0x3f) | 0x80);
                        b.push((unicode & 0x3f) | 0x80);
                    }
                    else {
                        b.push((unicode >> 18) | 0xf0);
                        b.push(((unicode >> 12) & 0x3f) | 0x80);
                        b.push(((unicode >> 6) & 0x3f) | 0x80);
                        b.push((unicode & 0x3f) | 0x80);
                    }
                }
                return b;
            };
            /**
             * Compress string or byte array using fast and efficient algorithm.
             *
             * Because of weak of javascript's natural, many compression algorithm
             * become useless in javascript implementation. The main problem is
             * performance, even the simple Huffman, LZ77/78 algorithm will take many
             * many time to operate. We use LZJB algorithm to do that, it suprisingly
             * fulfills our requirement to compress string fastly and efficiently.
             *
             * Our implementation is based on
             * http://src.opensolaris.org/source/raw/onnv/onnv-gate/
             * usr/src/uts/common/os/compress.c
             * It is licensed under CDDL.
             *
             * Please note it depends on toByteArray utility function.
             *
             * @param {String|Array} input The string or byte array that you want to
             *                             compress.
             * @return {Array} Compressed byte array.
             */
            LZJB.compress = function (input) {
                var sstart, dstart = [], slen, src = 0, dst = 0, cpy, copymap, copymask = 1 << (this.NBBY - 1), mlen, offset, hp, lempel = new Array(this.LEMPEL_SIZE), i, bytes;
                this.init();
                // initialize lempel array.
                for (i = 0; i < this.LEMPEL_SIZE; i++)
                    lempel[i] = 3435973836;
                // using byte array or not.
                if (input.constructor === Array) {
                    sstart = input;
                    bytes = true;
                }
                else {
                    sstart = this.toByteArray(input);
                    bytes = false;
                }
                slen = sstart.length;
                while (src < slen) {
                    if ((copymask <<= 1) === (1 << this.NBBY)) {
                        if (dst >= slen - 1 - 2 * this.NBBY) {
                            mlen = slen;
                            for (src = 0, dst = 0; mlen; mlen--)
                                dstart[dst++] = sstart[src++];
                            return dstart;
                        }
                        copymask = 1;
                        copymap = dst;
                        dstart[dst++] = 0;
                    }
                    if (src > slen - this.MATCH_MAX) {
                        dstart[dst++] = sstart[src++];
                        continue;
                    }
                    hp = ((sstart[src] + 13) ^
                        (sstart[src + 1] - 13) ^
                        sstart[src + 2]) &
                        (this.LEMPEL_SIZE - 1);
                    offset = (src - lempel[hp]) & this.OFFSET_MASK;
                    lempel[hp] = src;
                    cpy = src - offset;
                    if (cpy >= 0 && cpy !== src &&
                        sstart[src] === sstart[cpy] &&
                        sstart[src + 1] === sstart[cpy + 1] &&
                        sstart[src + 2] === sstart[cpy + 2]) {
                        dstart[copymap] |= copymask;
                        for (mlen = this.MATCH_MIN; mlen < this.MATCH_MAX; mlen++)
                            if (sstart[src + mlen] !== sstart[cpy + mlen]) {
                                break;
                            }
                        dstart[dst++] = ((mlen - this.MATCH_MIN) << (this.NBBY - this.MATCH_BITS)) |
                            (offset >> this.NBBY);
                        dstart[dst++] = offset;
                        src += mlen;
                    }
                    else {
                        dstart[dst++] = sstart[src++];
                    }
                }
                return dstart;
            };
            ;
            LZJB.NBBY = 8;
            LZJB.MATCH_BITS = 6;
            LZJB.MATCH_MIN = 3;
            LZJB.MATCH_MAX = 0;
            LZJB.OFFSET_MASK = 0;
            LZJB.LEMPEL_SIZE = 256;
            /**
             * Decompress string or byte array using fast and efficient algorithm.
             *
             * Our implementation is based on
             * http://src.opensolaris.org/source/raw/onnv/onnv-gate/
             * usr/src/uts/common/os/compress.c
             * It is licensed under CDDL.
             *
             * Please note it depends on toByteArray utility function.
             *
             * @param {String|Array} input The string or byte array that you want to
             *                             compress.
             * @param {Boolean} _bytes Returns byte array if true otherwise string.
             * @return {String|Array} Decompressed string or byte array.
             */
            LZJB.decompress = function (input, _bytes) {
                var sstart, dstart = [], slen, src = 0, dst = 0, cpy, copymap, copymask = 1 << (this.NBBY - 1), mlen, offset, i, bytes, get;
                this.init();
                // using byte array or not.
                if (input.constructor === Array) {
                    sstart = input;
                    bytes = true;
                }
                else {
                    sstart = this.toByteArray(input);
                    bytes = false;
                }
                // default output string result.
                if (typeof (_bytes) === undefined) {
                    bytes = false;
                }
                else {
                    bytes = _bytes;
                }
                slen = sstart.length;
                get = function () {
                    if (bytes) {
                        return dstart;
                    }
                    else {
                        // decompressed string.
                        for (i = 0; i < dst; i++)
                            dstart[i] = String.fromCharCode(dstart[i]);
                        return dstart.join("");
                    }
                };
                while (src < slen) {
                    if ((copymask <<= 1) === (1 << this.NBBY)) {
                        copymask = 1;
                        copymap = sstart[src++];
                    }
                    if (copymap & copymask) {
                        mlen = (sstart[src] >> (this.NBBY - this.MATCH_BITS)) + this.MATCH_MIN;
                        offset = ((sstart[src] << this.NBBY) | sstart[src + 1]) & this.OFFSET_MASK;
                        src += 2;
                        if ((cpy = dst - offset) >= 0) {
                            while (--mlen >= 0) {
                                dstart[dst++] = dstart[cpy++];
                            }
                        }
                        else {
                            /*
                             * offset before start of destination buffer
                             * indicates corrupt source data
                             */
                            return get();
                        }
                    }
                    else {
                        dstart[dst++] = sstart[src++];
                    }
                }
                return get();
            };
            return LZJB;
        }());
    })(utils = ajs.utils || (ajs.utils = {}));
})(ajs || (ajs = {}));
;
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

Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
**************************************************************************** */
var ajs;
(function (ajs) {
    var utils;
    (function (utils) {
        "use strict";
        var Obj = (function () {
            function Obj() {
            }
            Obj.assign = function (target, varArgs) {
                if (target == null) {
                    throw new TypeError();
                }
                var to = Object(target);
                for (var i = 1; i < arguments.length; i++) {
                    var nextSource = arguments[i];
                    if (nextSource != null) {
                        for (var nextKey in nextSource) {
                            // avoid bugs when hasOwnProperty is shadowed
                            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                                to[nextKey] = nextSource[nextKey];
                            }
                        }
                    }
                }
                return to;
            };
            return Obj;
        }());
        utils.Obj = Obj;
    })(utils = ajs.utils || (ajs.utils = {}));
})(ajs || (ajs = {}));
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
var ajs;
(function (ajs) {
    var utils;
    (function (utils) {
        "use strict";
        function defined(object) {
            return object !== undefined;
        }
        utils.defined = defined;
        function isNull(object) {
            return object == null;
        }
        utils.isNull = isNull;
        function definedAndNotNull(object) {
            return object !== undefined && object != null;
        }
        utils.definedAndNotNull = definedAndNotNull;
        function getClassName(obj) {
            if (obj && obj.constructor && obj.constructor.toString) {
                var arr = obj.constructor.toString().match(/function\s*(\w+)/);
                if (arr && arr.length === 2) {
                    return arr[1];
                }
            }
            return undefined;
        }
        utils.getClassName = getClassName;
        function minDate() {
            return new Date(0);
        }
        utils.minDate = minDate;
        function maxDate() {
            return new Date(8640000000000000);
        }
        utils.maxDate = maxDate;
        function sizeOf(object) {
            var objects = [object];
            var size = 0;
            // loop over the objects
            for (var i = 0; i < objects.length; i++) {
                // determine the type of the object
                switch (typeof objects[i]) {
                    // the object is a boolean
                    case "boolean":
                        size += 4;
                        break;
                    // the object is a number
                    case "number":
                        size += 8;
                        break;
                    // the object is a string
                    case "string":
                        size += 2 * objects[i].length;
                        break;
                    // the object is a generic object
                    case "object":
                        // if the object is not an array, add the sizes of the keys
                        if (Object.prototype.toString.call(objects[i]) !== "[object Array]") {
                            for (var key in objects[i]) {
                                if (object[key] !== undefined) {
                                    size += 2 * key.length;
                                }
                            }
                        }
                        // loop over the keys
                        for (var key in objects[i]) {
                            if (objects[i][key] !== undefined) {
                                // determine whether the value has already been processed
                                var processed = false;
                                for (var j = 0; j < objects.length; j++) {
                                    if (objects[j] === objects[j][key]) {
                                        processed = true;
                                        break;
                                    }
                                }
                                // queue the value to be processed if appropriate
                                if (!processed) {
                                    objects.push(objects[i][key]);
                                }
                            }
                        }
                }
            }
            // return the calculated size
            return size;
        }
        utils.sizeOf = sizeOf;
    })(utils = ajs.utils || (ajs.utils = {}));
})(ajs || (ajs = {}));
//# sourceMappingURL=/js/ajs.js.map