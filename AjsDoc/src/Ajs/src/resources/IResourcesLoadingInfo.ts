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

namespace ajs.resources {

    "use strict";

    /** Information about currently loading resources */
    export interface IResourcesLoadingInfo {
        /** Array of information about particular resources */
        loadingData: {
            /** Unique resource locator */
            url: string;
            /** Flag if the resource loading is over */
            loadingFinished: boolean;
            /** Flag if the resource was loaded (from server or cache) sucessfully */
            loaded: boolean;
            /** Resource currently loading */
            resource: IResource;
        }[];
        /** User data to be passed to the callback when loading finished */
        userData: any;
        /** Callback to be called when all resources finished loading */
        loadEndCallback: IResourcesLoadEndCallback;
    }

}