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

namespace ajs.navigation {

    "use strict";

    import Router = ajs.routing.Router;

    /**
     * Navigator is used for navigation throughout the Ajs Application
     * <p>
     * Navigator takes care of capturing the browser navigation events when
     * Forward / Back buttons are pressed.
     * </p>
     * <p>
     * Navigator should be also used by the application to navigate over it. All a
     * href links should be changed to
     * &lt;<a href="link" onclick="return ajs.Framework.navigator.linkClicked(event);&gt;
     * Also, all button presses or another dynamic events leading to the navigaton
     * should use the same method in order to keep the browser state consistent
     * with the framework. Links in templates are replaced automatically to correct value
     * so it is not necessary to follow this rule there.
     * <p>
     * Navigator also takes care of redirections so if the path of the url being
     * navigated is found in registered redirectons table the redirection to the
     * target will occur.
     * <p>
     * <p>
     * Navigator passes the actual path to the #see {ajs.routing.Router}
     * which will take care about instancing the correct view model. During the boot,
     * prior the application is started the Navigator is disabled to prevent any
     * problems with navigating to uninitialized application.
     * </p>
     * <p>
     * Navigator redirections can be configured in the #see {IAjsConfig Ajs Framework
     * configuration}. Redirections could be also registered using the #see {
     * Navigator.registerRedirection } method.
     * </p>
     */
    export class Navigator {

        /** Last url the navigator captured during various events */
        protected _lastUrl: string;
        /** Returns last url the navigator captured during various events */
        public get lastUrl(): string { return this._lastUrl; }

        /** List of registered #see {IRedirection redirections#} */
        protected _redirections: IRedirection[];
        /** List of registered #see {IRedirection redirections#} */
        public get redirections(): IRedirection[] { return this._redirections; }

        /** Reference to the router */
        protected _router: Router;
        public get router(): Router { return this.router; }

        /** Holds information if the navigator should process navigation events */
        protected _canNavigate: boolean;
        /** Returns information if the navigator should process navigation events */
        public get canNavigate(): boolean { return this._canNavigate; }
        /** Sets information if the navigator should process navigation events */
        public set canNavigate(value: boolean) { this._canNavigate = value; }

        /**
         * Constructs the object of the Navigator class
         * @param router Router to be used to forward navigation events
         * @param redirections List of redirections to be registered (taken from #see {IAjsConfig ajs config});
         */
        public constructor(router: Router, redirections?: IRedirection[]) {

            ajs.debug.log(debug.LogType.Constructor, 0, "ajs.navigation", this,
                "Registering redirections (" + (redirections ? redirections.length : 0) + ")", redirections);

            this._canNavigate = false;
            this._router = router;
            this._lastUrl = null;
            this._redirections = redirections || [];

            ajs.debug.log(debug.LogType.DomAddListener, 0, "ajs.navigation", this, "window.popstate");
            window.addEventListener("popstate", (event: PopStateEvent) => { this._onPopState(event); });
            ajs.debug.log(debug.LogType.DomAddListener, 0, "ajs.navigation", this, "window.hashchange");
            window.addEventListener("hashchange", (event: HashChangeEvent) => { this._onHashChange(event); });

            ajs.debug.log(debug.LogType.Exit, 0, "ajs.navigation", this);

        }

        /**
         * Registers path for redirection
         * @param path Path to be redirected to a different path
         * @param target Target path
         */
        public registerRedirection(path: string, target: string): void {

            ajs.debug.log(debug.LogType.Enter, 0, "ajs.navigation", this, "Registering redirection: " + path + " : " + target);

            this._redirections.push({
                path: path,
                target: target
            });

            ajs.debug.log(debug.LogType.Exit, 0, "ajs.navigation", this);
        }

        /**
         * Called when any navigation event occurs to redirect a request or to forward the navigation information to the router
         */
        public navigated(): void {

            ajs.debug.log(debug.LogType.Enter, 0, "ajs.navigation", this);
            ajs.debug.log(debug.LogType.Info, 0, "ajs.navigation", this, "navigation event occured: " + window.location.href);

            if (window.location.href !== this._lastUrl && this._canNavigate) {
                this._lastUrl = window.location.href;
                if (!this._redirect(window.location.pathname)) {
                    this._router.route();
                }
            }

            ajs.debug.log(debug.LogType.Exit, 0, "ajs.navigation", this);
        }

        /**
         * Navigates to specified url
         * @param url Target URL
         */
        public navigate(url: string): void {

            ajs.debug.log(debug.LogType.Enter, 0, "ajs.navigation", this);
            ajs.debug.log(debug.LogType.Info, 0, "ajs.navigation", this, "Navigating to: " + url);

            if (window.location.href !== url) {
                this._lastUrl = url;
                window.history.pushState({}, "", url);

                if (!this._redirect(url)) {
                    this._router.route();
                }
            }

            ajs.debug.log(debug.LogType.Exit, 0, "ajs.navigation", this);
        }

        /**
         * Should be called every time the user click the link to navigate
         * to appropriate location or open new tab / window
         * @param event The click MouseEvent event
         */
        public linkClicked(event: MouseEvent): boolean {
            if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
                try {
                    let element: HTMLElement = event.srcElement as HTMLElement;
                    while (element !== null && !(element instanceof HTMLAnchorElement)) {
                        element = element.parentElement;
                    }
                    if (element instanceof HTMLAnchorElement) {
                        this.navigate((element as HTMLAnchorElement).href);
                    }
                } finally {
                    return false;
                }
            }
            return true;
        }

        /**
         * Window.onpopstate event listener
         * @param event Event data passed from the browser
         */
        protected _onPopState(event: PopStateEvent): void {

            ajs.debug.log(debug.LogType.Enter, 0, "ajs.navigation", this);
            ajs.debug.log(debug.LogType.Info, 0, "ajs.navigation", this, "window.popstate event occured");

            this.navigated();

            ajs.debug.log(debug.LogType.Exit, 0, "ajs.navigation", this);
        }

        /**
         * Window.onhashchange event listener
         * @param event Event data passed from the browser
         */
        protected _onHashChange(event: HashChangeEvent): void {
            ajs.debug.log(debug.LogType.Enter, 0, "ajs.navigation", this);
            ajs.debug.log(debug.LogType.Info, 0, "ajs.navigation", this, "window.hashchange event occured");

            this.navigated();

            ajs.debug.log(debug.LogType.Exit, 0, "ajs.navigation", this);
        }

        /**
         * Called internally to check if the url is registered for redirection and redirect to correct target it if so
         * @param url Current url to be checked
         * @returns true if redirection was performed or false if the ure was not found in registered paths for redirection
         */
        protected _redirect(url: string): boolean {
            ajs.debug.log(debug.LogType.Enter, 0, "ajs.navigation", this);
            ajs.debug.log(debug.LogType.Info, 0, "ajs.navigation", this, "Redirecting to " + url);

            let redirected: boolean = false;

            for (let i: number = 0; i < this._redirections.length; i++) {
                if (this._redirections[i].path === url) {
                    window.history.pushState({}, "", this._redirections[i].target);
                    redirected = true;
                    this._router.route();
                    break;
                }
            }

            ajs.debug.log(debug.LogType.Exit, 0, "ajs.navigation", this);

            return redirected;

        }

    }

}