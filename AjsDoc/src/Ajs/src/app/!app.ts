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

namespace ajs.app {

    "use strict";
    
    /**
     * this is signature 1
     * @param test
     */
    export function test(test: string): string;

    /**
     * this is signature 2
     * @param test
     */
    export function test(test: number): number;

    /**
     * this is signature 3
     * @param test
     */
    export function test(test: number): Date;

    /**
     * this is signature 4
     * @param test
     */
    export function test(test: any): any {
        return null;
    }

    /**
     * this is test1 signature
     * @param x rrr
     */
    export function test1(x?: string | number | Object): any {
        return null;
    }

    /**
     * this is test2 function
     */
    function test2(): number {
        return 0;
    }

    /**
     * this is test3 function
     */
    function test3(test: string): string {
        return "";
    }

    interface Interface1 {
    }

    interface Interface2 {
    }

    interface Interface3 extends Interface1, Interface2 {
    }

    class Class1 {
    }

    class Class2 extends Class1 {
    }

    class Class3 extends Class2 implements Interface1, Interface2 {
    }

    class Class4 implements Interface3 {
    }

}
