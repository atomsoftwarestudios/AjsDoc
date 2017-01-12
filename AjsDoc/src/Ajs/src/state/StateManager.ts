/*! ************************************************************************
The MIT License (MIT)
Copyright (c)2016 Atom Software Studios. All rights reserved.

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

namespace ajs.state {

    "use strict";

    const APP_STATE_PREFIX: string = "APPSTATE.";
    const SESS_STATE_PREFIX: string = "SESSTATE.";

    export class StateManager {

        protected _resourceManager: ajs.resources.ResourceManager;

        public constructor(resourceManager: ajs.resources.ResourceManager) {
            this._resourceManager = resourceManager;
        }

        public setAppState(key: string, value: any): void {
            this._resourceManager.setCachedResource(
                APP_STATE_PREFIX + key,
                value,
                ajs.resources.STORAGE_TYPE.LOCAL,
                ajs.resources.CACHE_POLICY.PERMANENT);
        }

        public getAppState(key: string): any {
            let resource: ajs.resources.ICachedResource = this._resourceManager.getResource(
                APP_STATE_PREFIX + key,
                ajs.resources.STORAGE_TYPE.LOCAL
            );
            if (resource !== null) {
                return resource.data;
            }
            return null;
        }

        public removeAppState(key: string): void {
            this._resourceManager.removeCachedResource(key, ajs.resources.STORAGE_TYPE.LOCAL);
        }

        public setSessionState(key: string, value: any): void {
            this._resourceManager.setCachedResource(
                SESS_STATE_PREFIX + key,
                value,
                ajs.resources.STORAGE_TYPE.SESSION,
                ajs.resources.CACHE_POLICY.PERMANENT);
        }

        public getSessionState(key: string): any {
            let resource: ajs.resources.ICachedResource = this._resourceManager.getResource(
                SESS_STATE_PREFIX + key,
                ajs.resources.STORAGE_TYPE.SESSION
            );
            if (resource !== null) {
                return resource.data;
            }
            return null;
        }

        public removeSessionState(key: string): void {
            this._resourceManager.removeCachedResource(key, ajs.resources.STORAGE_TYPE.SESSION);
        }

    }

}