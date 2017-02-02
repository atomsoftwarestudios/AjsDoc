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

namespace ajs.state {

    "use strict";

    /**
     * Prefix for the key used to store the Application state value
     */
    const APP_STATE_PREFIX: string = resources.LOCAL_ONLY_PREFIX + "APPSTATE.";

    /**
     * Prefix for the key used to store the Session state value
     */
    const SESS_STATE_PREFIX: string = resources.LOCAL_ONLY_PREFIX + "SESSTATE.";


    /**
     * State manager is used for the application and session state persistance
     * State manager currently supports only string values so if it is required to store
     * arbitrary object it is necessary to JSONize it first.
     */
    export class StateManager {

        /** Resource manager to be used to access the local and session storages */
        protected _resourceManager: ajs.resources.ResourceManager;

        /**
         * Constructs the state manager object
         * @param resourceManager Resource manager to be used to access the local and session storages
         */
        public constructor(resourceManager: ajs.resources.ResourceManager) {

            ajs.debug.log(ajs.debug.LogType.Constructor, 0, "ajs.state", this);

            this._resourceManager = resourceManager;

            ajs.debug.log(ajs.debug.LogType.Exit, 0, "ajs.state", this);
        }

        /**
         * Sets the application state value
         * @param key Key to be used for the application state value
         * @param value The value to be stored in the local storage under specified key
         */
        public setAppState(key: string, value: string): void {

            ajs.debug.log(ajs.debug.LogType.Enter, 0, "ajs.state", this);

            ajs.debug.log(ajs.debug.LogType.Info, 0, "ajs.state", this,
                "Setting the application state: " + key + " : " + value);

            this._resourceManager.setCachedResource(
                APP_STATE_PREFIX + key,
                value,
                ajs.resources.STORAGE_TYPE.LOCAL,
                ajs.resources.CACHE_POLICY.PERMANENT);

            ajs.debug.log(ajs.debug.LogType.Exit, 0, "ajs.state", this);
        }

        /**
         * Retrieves the application state value idetified by the given key
         * @param key Key for which the application state value should be returned.
         */
        public getAppState(key: string): string {

            ajs.debug.log(ajs.debug.LogType.Enter, 0, "ajs.state", this);

            ajs.debug.log(ajs.debug.LogType.Info, 0, "ajs.state", this,
                "Retrieving the application state " + key);

            let resource: ajs.resources.ICachedResource = this._resourceManager.getCachedResource(
                APP_STATE_PREFIX + key,
                ajs.resources.STORAGE_TYPE.LOCAL
            );
            if (resource !== null) {
                ajs.debug.log(ajs.debug.LogType.Exit, 0, "ajs.state", this);
                return resource.data;
            }

            ajs.debug.log(ajs.debug.LogType.Exit, 0, "ajs.state", this);
            return null;
        }

        /**
         * Removes the application state key / value pair from the local storage
         * @param key Key to be removed
         */
        public removeAppState(key: string): void {

            ajs.debug.log(ajs.debug.LogType.Enter, 0, "ajs.state", this);

            ajs.debug.log(ajs.debug.LogType.Info, 0, "ajs.state", this,
                "Removing the application state " + key);

            this._resourceManager.removeCachedResource(key, ajs.resources.STORAGE_TYPE.LOCAL);

            ajs.debug.log(ajs.debug.LogType.Exit, 0, "ajs.state", this);
        }

        /**
         * Sets the session state value
         * @param key Key to be used for the session state value
         * @param value The value to be stored in the session storage under specified key
         */
        public setSessionState(key: string, value: string): void {

            ajs.debug.log(ajs.debug.LogType.Enter, 0, "ajs.state", this);

            ajs.debug.log(ajs.debug.LogType.Info, 0, "ajs.state", this,
                "Setting the session state " + key + " : " + value);

            this._resourceManager.setCachedResource(
                SESS_STATE_PREFIX + key,
                value,
                ajs.resources.STORAGE_TYPE.SESSION,
                ajs.resources.CACHE_POLICY.PERMANENT);

            ajs.debug.log(ajs.debug.LogType.Exit, 0, "ajs.state", this);
        }

        /**
         * Retrieves the session state value idetified by the given key
         * @param key Key for which the session state value should be returned.
         */
        public getSessionState(key: string): string {

            ajs.debug.log(ajs.debug.LogType.Enter, 0, "ajs.state", this);

            ajs.debug.log(ajs.debug.LogType.Info, 0, "ajs.state", this,
                "Retireving the session state " + key);

            let resource: ajs.resources.ICachedResource = this._resourceManager.getCachedResource(
                SESS_STATE_PREFIX + key,
                ajs.resources.STORAGE_TYPE.SESSION
            );

            if (resource !== null) {
                ajs.debug.log(ajs.debug.LogType.Exit, 0, "ajs.state", this);
                return resource.data;
            }

            ajs.debug.log(ajs.debug.LogType.Exit, 0, "ajs.state", this);
            return null;
        }

        /**
         * Removes the session state key / value pair from the session storage
         * @param key Key to be removed
         */
        public removeSessionState(key: string): void {
            ajs.debug.log(ajs.debug.LogType.Enter, 0, "ajs.state", this);

            ajs.debug.log(ajs.debug.LogType.Info, 0, "ajs.state", this,
                "Removing the session state " + key);

            this._resourceManager.removeCachedResource(key, ajs.resources.STORAGE_TYPE.SESSION);

            ajs.debug.log(ajs.debug.LogType.Exit, 0, "ajs.state", this);
        }

    }

}