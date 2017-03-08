/*! ************************************************************************
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
 * ajs.tsx "hacks" the TypeScript compiler and its need for inclusion of the React library.
 * <p>
 * TSX is very very very limited reactive renderer without updating support (so elements must be
 * removed and re-rendered completely. It does not support custom components as it is not neccessary
 * for debugging interface. Its purpose is just to make development of the debug module views easier
 * and better maintanable.
 * </p>
 * <p>
 * <strong>
 * The tsx is not supposed to be used in Applications. It is for internal puproses of the ajs.debug
 * namespace only!
 * </strong>
 * </p>
 * <p>
 * It makes possible usingof the TSX compiler within the Ajs. tsx is needed just for the debug namespace
 * to render components and because storing of the HTML in string is not nice and not well mainanable the
 * decision to use the TSX was made. It is not possible to use the Ajs internally as it would interferre
 * together.
 * </p>
 * <p>
 * If the build solution configuration is "Release" the tsx as well as all debugging functions will be
 * removed from the resulting Ajs and Application JavaScript code using the post-processor.
 * </p>
 */
namespace ajs.dbg.tsx {

    "use strict";

}
