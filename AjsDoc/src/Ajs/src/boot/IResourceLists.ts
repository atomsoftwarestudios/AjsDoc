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

namespace ajs.boot {

    "use strict";

    /** Output of the ajs.boot.getResourceLists function contains all resources to be loaded */
    export interface IResourceLists {
        /** loads resources to the local store with the permanent caching policy */
        localPermanent?: string[];
        /** loads resources to the local store with the last recently used caching policy */
        localLastRecentlyUsed?: string[];
        /** loads resources to the session store with the permanent caching policy */
        sessionPermanent?: string[];
        /** loads resources to the session store with the last recently used caching policy */
        sessionLastRecentlyUsed?: string[];
        /** loads resources to the memory store with the permanent caching policy */
        memoryPermanent?: string[];
        /** loads resources to the memory store with the last recently used caching policy */
        memoryLastRecentlyUsed?: string[];
        /** direct load without using of the store */
        direct?: string[];
    }

}
