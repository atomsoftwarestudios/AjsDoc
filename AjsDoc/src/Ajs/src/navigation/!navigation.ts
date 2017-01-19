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
 * Navigation namespace hold the Navigator object and IRedirection interface
 * <p>
 * Navigator takes care of capturing the browser navigation events when
 * Forward / Back buttons are pressed.
 * </p>
 * <p>
 * Navigator should be also used by the application to navigate over the page
 * (all a href links should be changed to
 * javascript:ajs.Framework.navigator.navigate("url").
 * Also, all button presses or another dynamic events leading to the navigaton
 * should use the same method in order to keep the browser state consistent
 * with the framework.
 * <p>
 * Navigator also takes care of redirections so if the path of the url being
 * navigated is found in registered redirectons table the redirection to the
 * target will occur. 
 * <p>
 * <p>
 * Navigator passes the actual path to the #see {Router}
 * which will take care about instancing the correct view model. During the boot,
 * prior the application is started the Navigator is disabled to prevent any
 * problems with navigating to uninitialized application.
 * </p>
 * <p>
 * Navigator redirections can be configured in the #see {IAjsConfig AJS Framework
 * configuration}. Redirections could be also registered using the #see {
 * Navigator.registerRedirection } method.
 * </p>
 */
namespace ajs.navigation {

    "use strict";

}