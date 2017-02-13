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

namespace ajs.resources {

    "use strict";

    /**
     * ResourceLoader is used internally by the #see (ajs.resources.ResourceManager} to load a resource
     * <p>
     * It performs standard HTTP request to the server and obtains the resource from it. It
     * is using the standard XMLHttpRequest feature of the browser and resources are loaded isng the GET
     * method. It is supposed to be used for static resources only.
     * </p>
     */
    export class ResourceLoader {

        public constructor() {
            ajs.dbg.log(dbg.LogType.Constructor, 0, "ajs.resources", this);
            ajs.dbg.log(dbg.LogType.Exit, 0, "ajs.resources", this);
        }

        /**
         * Initiates loading of the resource
         * @param loadEndHandler Handler to be called when the resource loading finishes
         * @param url Resource locator
         * @param isBinary Identifies if binary data should be loaded
         * @param userData User data object to be passed to the handler
         * @param lastModified Information about resource last modification date/time
         */
        public loadResource(url: string, isBinary: boolean, lastModified?: Date): Promise<IResourceResponseData> {

            ajs.dbg.log(dbg.LogType.Enter, 0, "ajs.resources", this);

            let response: Promise<IResourceResponseData> = new Promise<IResourceResponseData>(
                (resolve: (data: IResourceResponseData) => void, reject: (reason?: any) => void) => {

                    ajs.dbg.log(dbg.LogType.Info, 0, "ajs.resources", this,
                        "Requesting [GET] resource '" + url + "'", isBinary, lastModified);

                    // prepare data for the loader
                    lastModified = lastModified || ajs.utils.minDate();

                    let requestData: IResourceRequestData = {
                        url: url,
                        isBinary: isBinary,
                        lastModified: lastModified,
                        startTime: new Date(),
                        loadEndHandler: (responseData: IResourceResponseData): void => {
                            resolve(responseData);
                        }
                    };

                    this._loadResource(requestData);

                }
            );

            ajs.dbg.log(dbg.LogType.Exit, 0, "ajs.resources", this);

            return response;
        }

        /**
         * Contructs the XHR, registers readystatechange listener and sends GET request it to the server
         * @param requestData Request data
         */
        protected _loadResource(requestData: IResourceRequestData): void {

            ajs.dbg.log(dbg.LogType.Enter, 0, "ajs.resources", this);

            ajs.dbg.log(dbg.LogType.Info, 0, "ajs.resources", this,
                "Initializing the XHR");

            // setup the xhr
            let xhr: IResourceRequest = new XMLHttpRequest() as IResourceRequest;

            xhr.open("GET", encodeURI(requestData.url));
            xhr.resourceRequestData = requestData;

            if (requestData.isBinary) {
                xhr.responseType = "arraybuffer";
            }

            // ie9 does not support loadend event
            xhr.addEventListener("readystatechange", (event: Event) => {
                this._xhrStatusChanged(event);
            });

            if (requestData.lastModified !== null) {
                xhr.setRequestHeader("If-Modified-Since", ajs.utils.ie10UTCDate(requestData.lastModified));
            }

            // send request to the server
            xhr.send();

            ajs.dbg.log(dbg.LogType.Exit, 0, "ajs.resources", this);

        }

        /**
         * Called when XHR changes the loading status
         * @param e XHR State change event data
         */
        protected _xhrStatusChanged(e: Event): void {

            ajs.dbg.log(dbg.LogType.Enter, 0, "ajs.resources", this);

            let xhr: IResourceRequest = e.target as IResourceRequest;
            let requestData: IResourceRequestData = xhr.resourceRequestData;

            ajs.dbg.log(dbg.LogType.Info, 3, "ajs.resources", this,
                "Url: " + xhr.resourceRequestData.url + ", XHR readyState: " + xhr.readyState);

            // if completed
            if (xhr.readyState === xhr.DONE) {
                // setup the result loading object
                let responseData: IResourceResponseData = {
                    type: xhr.responseType,
                    data: requestData.isBinary ? xhr.response : xhr.responseText,
                    httpStatus: xhr.status,
                    startTime: requestData.startTime,
                    endTime: new Date()
                };

                ajs.dbg.log(dbg.LogType.Info, 0, "ajs.resources", this,
                    "XHR for '" + requestData.url + "' ready in " + (responseData.endTime.getTime() - responseData.startTime.getTime()) +
                    "ms with " + xhr.status + " " + xhr.statusText);

                // for text data
                // index.html should never pass the resource manager so if it passes
                // it means it was provided by the app cache and we are offline now
                if (responseData.httpStatus === 200 && typeof (responseData.data) === "string") {
                    let tmp: string = responseData.data.substr(0, 50);
                    if (tmp.indexOf("<!--offline-->") !== -1) {
                        responseData.httpStatus = 304;
                        ajs.dbg.log(dbg.LogType.Info, 0, "ajs.resources", this, "Offline mode detected, index.html served");
                    }
                }

                // for binary data
                // index.html should never pass the resource manager so if it passes
                // it means it was provided by the app cache and we are offline now
                if (responseData.httpStatus === 200 &&
                    responseData.data instanceof ArrayBuffer) {
                    let buffer: Int8Array = new Int8Array(responseData.data);
                    let count: number = buffer.byteLength < 50 ? buffer.byteLength : 50;
                    let str: string = "";
                    for (let i: number = 0; i < count; i++) {
                        str += String.fromCharCode(buffer[i]);
                    }
                    if (str.indexOf("<!--offline-->") !== -1) {
                        responseData.httpStatus = 304;
                        ajs.dbg.log(dbg.LogType.Info, 0, "ajs.resources", this, "Offline mode detected, index.html served");
                    }
                }

                // call the handler
                if (requestData.loadEndHandler instanceof Function) {

                    requestData.loadEndHandler(responseData);

                } else {

                    ajs.dbg.log(dbg.LogType.Error, 0, "Load end handler is not function", this);
                    throw new LoadEndHandlerIsNotFunctionException();

                }
            }

            ajs.dbg.log(dbg.LogType.Exit, 0, "ajs.resources", this);

        }

    }
}