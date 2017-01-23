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

namespace ajs.routing {

    "use strict";

    export class Router {

        protected _view: ajs.mvvm.view.View;

        protected _lastURL: string;
        protected _lastViewComponentName: string;
        protected _lastViewComponentInstance: ajs.mvvm.viewmodel.ViewComponent;

        protected _routes: IRoutes[];
        public get routes(): IRoutes[] { return this._routes; }

        protected _currentRoute: IRouteInfo;
        public get currentRoute(): IRouteInfo { return this._currentRoute; }

        public constructor(view: ajs.mvvm.view.View, routes?: IRoutes[]) {

            ajs.debug.log(debug.LogType.Constructor, 0, "ajs.routing", this);
            ajs.debug.log(debug.LogType.Info, 0, "ajs.routing", this,
                "Registering routes (" + (routes ? routes.length : 0) + ")", routes);

            this._view = view;

            this._routes = routes || [];

            this._lastURL = "";
            this._lastViewComponentName = null;
            this._lastViewComponentInstance = null;

            this._currentRoute = { base: "", path: "", search: "", hash: "" };

            ajs.debug.log(debug.LogType.Exit, 0, "ajs.routing", this);
        }

        public registerRoute(paths: IRoute[], viewComponentName: string): void {

            ajs.debug.log(debug.LogType.Enter, 0, "ajs.routing", this);
            ajs.debug.log(debug.LogType.Info, 0, "ajs.routing", this, "Registering route", paths);

            this._routes.push({
                paths: paths,
                viewComponentName: viewComponentName
            });

            ajs.debug.log(debug.LogType.Exit, 0, "ajs.routing", this);

        }

        public route(): void {

            ajs.debug.log(debug.LogType.Enter, 0, "ajs.routing", this);

            if (this._lastURL !== window.location.href) {
                ajs.debug.log(debug.LogType.Info, 0, "ajs.routing", this, "Maping route for '" + window.location.href + "'");

                this._lastURL = window.location.href;

                let viewComponentName: string = this._getRouteViewComponent();
                ajs.debug.log(debug.LogType.Info, 0, "ajs.routing", this, "Routing to " + viewComponentName);

                if (viewComponentName !== null) {

                    if (this._lastViewComponentName !== viewComponentName) {
                        ajs.debug.log(debug.LogType.Info, 0, "ajs.routing", this, "Routing to a different than previous component");

                        this._lastViewComponentName = viewComponentName;
                        this._view.rootViewComponentName = viewComponentName;

                    } else {
                        ajs.debug.log(debug.LogType.Info, 0, "ajs.routing", this, "Notyfying component the navigation occured");
                        this._view.onNavigate();
                    }

                } else {
                    ajs.debug.log(debug.LogType.Error, 0, "ajs.routing", this, "ViewComponent not found for the path specified");
                    throw new RouteNotFoundException();
                }

            }

            ajs.debug.log(debug.LogType.Exit, 0, "ajs.routing", this);
        }

        protected _getRouteViewComponent(): string {

            ajs.debug.log(debug.LogType.Enter, 0, "ajs.routing", this);

            for (let i: number = 0; i < this._routes.length; i++) {

                for (let j: number = 0; j < this._routes[i].paths.length; j++) {

                    let rx: RegExp = new RegExp(this._routes[i].paths[j].base + this._routes[i].paths[j].params, "g");

                    if (rx.test(window.location.pathname)) {

                        let routeURI: string = window.location.pathname + window.location.search + window.location.hash;

                        let base: string = routeURI.match(this._routes[i].paths[j].base)[0];
                        let path: string = routeURI.substr(base.length);

                        if (base[0] === "/") {
                            base = base.substr(1);
                        }

                        if (path.indexOf("#") !== -1) {
                            path = path.substr(0, path.indexOf("#"));
                        }
                        if (path.indexOf("?") !== -1) {
                            path = path.substr(0, path.indexOf("?"));
                        }
                        if (path[0] === "/") {
                            path = path.substr(1);
                        }
                        if (path[path.length - 1] === "/") {
                            path = path.substr(0, path.length - 1);
                        }

                        this._currentRoute = {
                            base: base,
                            path: path,
                            search: window.location.search.substr(1),
                            hash: window.location.hash.substr(1)
                        };

                        return this._routes[i].viewComponentName;

                    }

                }

            }

            ajs.debug.log(debug.LogType.Warning, 0, "ajs.routing", this, "Route not found");
            ajs.debug.log(debug.LogType.Exit, 0, "ajs.routing", this);

            return null;
        }


    }

}