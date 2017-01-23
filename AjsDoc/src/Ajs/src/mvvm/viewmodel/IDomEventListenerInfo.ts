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

namespace ajs.mvvm.viewmodel {

    "use strict";

    /** Interface for the information about the DOM event listener added to root or children elements of the view component */
    export interface IDomEventListenerInfo {
        /**
         * Indicates if the listener was added to the element in the final render tartget.
         * <p>
         * This information is set by the View Component renderer or by the View DOM updater when the element id added to the final render
         * target and the addEventListener method is used to register listener with the particular element.
         * </p>
         */
        registered: boolean;

        /** Element to which the event listener should be added
         * <p>
         * If the element is being rendered to the shadow DOM the listerner is not assigned by the ViewComponent renderer using the
         * addEventListener but information is stored within the rendered element and view DOM updater takes care of assignign the listener
         * to the element.
         * </p>
         * <p>
         * If the element is in the final render target the listener is added directly by the view component renderer
         * </p>
         */
        element: Element;

        /**
         * Event type to be registered or was registered already
         * <p>
         * The information stays stored within the rendered element until it is
         * </p>
         */
        eventType: string;

        /** Event listener function to be registered or registered already */
        listener: EventListener;
    }

}
