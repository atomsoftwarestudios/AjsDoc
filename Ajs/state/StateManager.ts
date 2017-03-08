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

///<reference path="../resources/ResourceManager.ts" />

/**
 * State namespace contains the StateManager class usefull to persist the application and the session states
 * <p>
 * The state persistance management is important for the Application to keep the track of the state after the
 * browser window is closed or the web page is refreshed or the link is entered manually to the browser address
 * bar. In these cases the memory of the JavaSript (including all variables and objects) is freed and all
 * information is lost as the new request (even to the same url) behaves in the way the new page is loaded and
 * new JavaScript object instances are created.
 * </p>
 * <p>
 * It was written many times what the application and the session state is, so just to remember in short: On the web
 * the state information is availabe just during one HTTP request/response pair. If it is neccessary to keep the track
 * of some information and have it availabe during multiple requests it is necessary to use one of methods developed
 * for this puprose. Overall name for this process is state persistence management. For the JavaScript frontend applications
 * there are some additional considerations to be made compared to traditional client/server development as there are
 * additional tools and possibilities for the state persistence management. However, the basic principles are the same.
 * </p>
 * <p>
 * The application state is overall state of the application (except the session state) and can contain information
 * about i.e. last logged-in user and additional information to log in the user in when the application is restarted.
 * It can also persist users profiles to be available immediately after logging in to the application without need
 * of loading this information from the server or the database. Additionally, it can store differences to default
 * configuration of the application made by users. The application state in the Web Browser is available until user
 * explicitly (and manually) requests clearing of the local storage.
 * </p>
 * <p>
 * The session state is the state availabe trhough multiple request but just for one browser session. Basically, it
 * is available until the browser is closed. Session state storage usually presists the UI interface state - the view
 * state - i.e. what tab of the tab control was selected before the page was reloaded.
 * </p>
 * <p>
 * It is hard to recommend what data should be stored in what storage as it always depends on business needs and
 * architecture of the application and requirements. For example, business or security request to store of some type of
 * the data only on the server side (except the time when user works with them) may exist.
 * </p>
 * <p>
 * In general, states can be persisted on both, client and server sides in many ways. At least, the following options
 * for the the application / session state persistance between HTTP requests exists:
 * </p>
 * <ul>
 * <li>GET/POST data to server and back with each HTTP request/response (includes HTTP header manipulation techniques,
 *     posting hidden form fields or url parameters manipulation</li>
 * <li>Storing the data to be persistent in HTTP Cookies</li>
 * <li>Store the state data on the server and using any other method (i.e. WebSockets or JSON API)</li>
 * <li>Store the state data on the client side in storages desinged for it (localStorage, sessionStorage)</li>
 * <li>Store the data on the client side in the storage which was not designed for it (i.e. indexedDB)</li>
 * </ul>
 * </p>
 * <p>
 * Concrete implementation always depends on the overall application architecture. We will focus just on the client-side
 * as we are talking about the client side front end framework.
 * </p>
 * <p>
 * Ajs framework is using LocalStorage and SessionStorage features of the W3C HTML5 specification to handle the state
 * management. Bot storages, according the specification, are Key/Value storages and Ajs just wraps these storages to
 * the StateManager class which is using Resource Manager to access local and session storages. This is because storages
 * are used for multiple purposes and track of all of them must be kept in order to be possible to successfuly manage
 * all resources and caches. It is highly recommended not to use the local/session storage functionality provided by
 * browser directly from the application as it can lead to inconsistences and/or interferences between the Ajs and the
 * application data persitence. Only the Resource, Data and State managers should be used to manipulate the data in these
 * storages.
 * </p>
 * <p>
 * It is usually necessary to follow some security recommendations regarding the state management (and the application
 * development in general). The main security principles are: don't store sensitive data like passwords in any type of
 * storage and minimize storing of any information usefull for potential attackers to attack the application or the system.
 * For security recomendations related to web application design and development reffer to the <a href="www.owasp.org">OWASP</a>
 * web site. There is a very nice guide regarding secure application design and development.
 * </p>
 */
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

            ajs.dbg.log(ajs.dbg.LogType.Constructor, 0, "ajs.state", this);

            this._resourceManager = resourceManager;

            ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.state", this);
        }

        /**
         * Sets the application state value
         * @param key Key to be used for the application state value
         * @param value The value to be stored in the local storage under specified key
         */
        public setAppState(key: string, value: string): void {

            ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.state", this);

            ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.state", this,
                "Setting the application state: " + key + " : " + value);

            this._resourceManager.setCachedResource(
                APP_STATE_PREFIX + key,
                value,
                ajs.resources.STORAGE_TYPE.LOCAL,
                ajs.resources.CACHE_POLICY.PERMANENT);

            ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.state", this);
        }

        /**
         * Retrieves the application state value idetified by the given key
         * @param key Key for which the application state value should be returned.
         */
        public getAppState(key: string): string {

            ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.state", this);

            ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.state", this,
                "Retrieving the application state " + key);

            let resource: ajs.resources.ICachedResource = this._resourceManager.getCachedResource(
                APP_STATE_PREFIX + key,
                ajs.resources.STORAGE_TYPE.LOCAL
            );
            if (resource !== null) {
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.state", this);
                return resource.data;
            }

            ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.state", this);
            return null;
        }

        /**
         * Removes the application state key / value pair from the local storage
         * @param key Key to be removed
         */
        public removeAppState(key: string): void {

            ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.state", this);

            ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.state", this,
                "Removing the application state " + key);

            this._resourceManager.removeCachedResource(key, ajs.resources.STORAGE_TYPE.LOCAL);

            ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.state", this);
        }

        /**
         * Sets the session state value
         * @param key Key to be used for the session state value
         * @param value The value to be stored in the session storage under specified key
         */
        public setSessionState(key: string, value: string): void {

            ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.state", this);

            ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.state", this,
                "Setting the session state " + key + " : " + value);

            this._resourceManager.setCachedResource(
                SESS_STATE_PREFIX + key,
                value,
                ajs.resources.STORAGE_TYPE.SESSION,
                ajs.resources.CACHE_POLICY.PERMANENT);

            ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.state", this);
        }

        /**
         * Retrieves the session state value idetified by the given key
         * @param key Key for which the session state value should be returned.
         */
        public getSessionState(key: string): string {

            ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.state", this);

            ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.state", this,
                "Retireving the session state " + key);

            let resource: ajs.resources.ICachedResource = this._resourceManager.getCachedResource(
                SESS_STATE_PREFIX + key,
                ajs.resources.STORAGE_TYPE.SESSION
            );

            if (resource !== null) {
                ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.state", this);
                return resource.data;
            }

            ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.state", this);
            return null;
        }

        /**
         * Removes the session state key / value pair from the session storage
         * @param key Key to be removed
         */
        public removeSessionState(key: string): void {
            ajs.dbg.log(ajs.dbg.LogType.Enter, 0, "ajs.state", this);

            ajs.dbg.log(ajs.dbg.LogType.Info, 0, "ajs.state", this,
                "Removing the session state " + key);

            this._resourceManager.removeCachedResource(key, ajs.resources.STORAGE_TYPE.SESSION);

            ajs.dbg.log(ajs.dbg.LogType.Exit, 0, "ajs.state", this);
        }

    }

}