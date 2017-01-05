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

namespace ajs.routing {

    "use strict";

    export class Router {

        protected _view: ajs.mvvm.View;

        protected _lastURL: string;
        protected _lastViewComponentName: string;
        protected _lastViewComponentInstance: ajs.mvvm.viewmodel.ViewComponent;

        protected _routes: IRoutes[];
        public get routes(): IRoutes[] { return this._routes; }

        protected _defaultViewComponentName: string;
        public get defaultViewComponentName(): string { return this._defaultViewComponentName; }
        public set defaultViewComponentName(value: string) { this._defaultViewComponentName = value; }

        protected _exceptionViewComponentName: string;
        public get exceptionViewComponentName(): string { return this._exceptionViewComponentName; }
        public set exceptionViewComponentName(value: string) { this._exceptionViewComponentName = value; }

        protected _currentRoute: IRouteInfo;
        public get currentRoute(): IRouteInfo { return this._currentRoute; }

        public constructor(view: ajs.mvvm.View, defaultViewComponentName?: string, exceptionViewComponentName?: string) {

            this._view = view;

            this._routes = [];

            this._lastURL = "";
            this._lastViewComponentName = null;
            this._lastViewComponentInstance = null;

            this._currentRoute = { base: "", path: "", search: "", hash: "" };

            if (defaultViewComponentName !== undefined) {
                this._defaultViewComponentName = defaultViewComponentName;
            } else {
                this._defaultViewComponentName = null;
            }

            if (exceptionViewComponentName !== undefined) {
                this._exceptionViewComponentName = exceptionViewComponentName;
            } else {
                this._exceptionViewComponentName = null;
            }
        }

        public registerRoute(paths: IRoute[], viewComponentName: string): void {
            this._routes.push({
                paths: paths,
                viewComponentName: viewComponentName
            });
        }

        public route(): void {

            if (this._lastURL !== window.location.href) {

                this._lastURL = window.location.href;

                let viewComponentName: string = this._getRouteViewComponent();

                if (viewComponentName !== null) {

                    if (this._lastViewComponentName !== viewComponentName) {

                        this._lastViewComponentName = viewComponentName;
                        this._view.rootViewComponentName = viewComponentName;

                    } else {
                        this._view.onNavigate();
                    }

                }
            }
        }

        protected _getRouteViewComponent(): string {

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

            return this._defaultViewComponentName;
        }


    }

}