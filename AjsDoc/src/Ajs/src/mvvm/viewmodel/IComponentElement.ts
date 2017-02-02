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

    /**
     * Interface of the information about View Component stored with rendered view componen root DOM element and its children
     * <p>
     * This information is fully or partially stored within the each DOM node belonging to particular view component. It is
     * assigned during the rendering process by the renderer (it does not depend if the render target is shadow dom or final
     * render target). If the informatin is in the shadow dom it is later copied by the View dom updater to the final
     * render target so it is possible internally or by aplication to identify if the tag is the view component (and
     * which instance it belongs to) or what view component instance the children tag belongs to. Also, it is used for passing
     * information about event listeners to be assigned to DOM nodes rendered in the final DOM document. This is done by the View
     * DOM updater too.
     * <p>
     * ajsEventListeners and ajsSkipUpdate are used internally only to inform the DOM updater what to do and are never copied
     * to the final DOM node injected to the render target.
     * </p>
     * <p>
     * ajsComponent information is present with the node only in case the node (element) is the root element of the view component.
     * </p>
     */
    export interface IComponentElement extends Element {
        /** Indicates the tag is a view component and stores its reference */
        ajsComponent?: ViewComponent;
        /** Holds information to which veiew component */
        ajsOwnerComponent?: ViewComponent;
        ajsSkipUpdate?: boolean;
        ajsEventListeners?: IDomEventListenerInfo[];
    }


}
