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

    /** Interface for the Ajs Framework configuration object
     * <p>
     * The configuration is collected by the boot loader from the ajs.boot.config script
     * where the #see {ajs.boot.IGetAjsConfig ajs.boot.getAjsConfig} function must be
     * implemented and return the AJS framework configuration.
     * </p>
     * <p>
     * Using the ajs configuration file it is possible to configure various components
     * of the Ajs framework to work as required. Ajs configuration is usually stored in the
     * ajs.boot.config together with the resources list to be loaded during the boot process
     * and application config. For additional details see #see {ajs.boot} namespace or the
     * development guide.
     * </p>
     * <p>
     * The following example shows how to configure all components of the Ajs Framework:
     * </p>
     * #example /static/examples/ajs.boot.config-ajs.ts
     * <p>
     * TODO: Review necessary options
     * </p>
     */
    export interface IAjsConfig {

        /** TODO: Remove? : Specifies if errors occured should be logged to the console */
        logErrors?: boolean;
        /** TODO: Remove? : Specifies if errors occured should be shown in the ajs error page to end users */
        showErrors?: boolean;


        /**
         * Configuration of the debugging console and its modules
         * If ommited, no debugging will be performed
         */
        debugging?: ajs.dbg.IConsoleConfig;

        boot?: ajs.boot.IBootConfig;

        /** 
         * Configuration of the resource manager
         * For additional details #see {ajs.resources.IResourceManagerConfig}
         */
        resourceManager?: ajs.resources.IResourceManagerConfig;

        /** 
         * Redirections configuration
         * For additional details #see {ajs.navigation.IRedirection}
         */
        navigator?: ajs.navigation.IRedirection[];

        /**
         * Routes configuration
         * For additional details #see {ajs.routing.IRoutes}
         */
        router?: ajs.routing.IRoutes[];

        /**
         * View configuration
         * For additional details #see {ajs.mvvm.view.IViewConfig}
         */
        view?: ajs.mvvm.view.IViewConfig;
    }

}