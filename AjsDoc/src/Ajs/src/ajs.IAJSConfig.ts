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
namespace ajs {

    "use strict";

    /** Represents the AJS configuration object
     *  TODO: Review necessary options
     */
    export interface IAJSConfig {
        /** TODO: Remove? : Specifies if the debugging of the framework is switched on */
        debug?: boolean;
        /** TODO: Remove? : Specifies if errors occured should be logged to the console */
        logErrors?: boolean;
        /** TODO: Remove? : Specifies if errors occured should be shown in the ajs error page to end users */
        showErrors?: boolean;


        /** Configuration of resource pools */
        resourceManagerConfig?: ajs.resources.IResourceManagerConfig;
    }

}