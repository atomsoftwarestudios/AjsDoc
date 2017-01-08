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

    export class ResourceLoader {

        public loadResource(loadEndHandler: IResourceLoadEndHandler, url: string, userData?: any, lastModified?: Date): void {
            lastModified = lastModified || ajs.utils.minDate();
            let requestData: IResourceRequestData = {
                url: url,
                userData: userData,
                lastModified: lastModified,
                startTime: new Date(),
                loadEndHandler: loadEndHandler
            };
            this._loadResource(requestData);
        }

        protected _loadResource(requestData: IResourceRequestData): void {

            let xhr: IResourceRequest = new XMLHttpRequest() as IResourceRequest;

            xhr.open("GET", requestData.url);
            xhr.resourceRequestData = requestData;

            // ie9 does not support loadend event
            xhr.addEventListener("readystatechange", (event: Event) => {
                this._loadEnd(event);
            });

            if (requestData.lastModified !== null) {
                xhr.setRequestHeader("If-Modified-Since", requestData.lastModified.toUTCString());
            }

            xhr.send();
        }

        protected _loadEnd(e: Event): void {
            let xhr: IResourceRequest = e.target as IResourceRequest;
            let requestData: IResourceRequestData = xhr.resourceRequestData;

            if (xhr.readyState === 4) {
                let responseData: IResourceResponseData = {
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

        }

    }
}