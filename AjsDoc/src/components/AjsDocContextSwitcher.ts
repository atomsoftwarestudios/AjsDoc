/* *************************************************************************
The MIT License (MIT)
Copyright (c)2017 Atom Software Studios. All rights reserved.

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

namespace ajsdoc {

    "use strict";

    const sessionStateGuidePath: string = "ajsDocGuidePath";
    const sessionStateReferencePath: string = "ajsDocReferencePath";

    export class AjsDocContextSwitcher extends ajs.mvvm.viewmodel.ViewComponent {

        protected _lastGuidePath: string;
        protected _lastReferencePath: string;

        public guides: boolean;
        public references: boolean;

        protected _navigatedListener: ajs.events.IListener;

        protected _initialize(): boolean {

            this._lastGuidePath = ajs.Framework.stateManager.getSessionState(sessionStateGuidePath);
            if (this._lastGuidePath === null) {
                this._lastGuidePath = "";
            }

            this._lastReferencePath = ajs.Framework.stateManager.getSessionState(sessionStateReferencePath);
            if (this._lastReferencePath === null) {
                this._lastReferencePath = "ref";
            }

            this._navigatedListener = (sender: ajs.mvvm.viewmodel.ViewComponent) => {
                this._navigated();
                return true;
            };

            this._ajsView.navigationNotifier.subscribe(this._navigatedListener);

            this._navigated();

            return true;
        }

        protected _finalize(): void {
            this._ajsView.navigationNotifier.unsubscribe(this._navigatedListener);
        }

        protected _navigated(): void {
            let routeInfo: ajs.routing.IRouteInfo = ajs.Framework.router.currentRoute;

            if (routeInfo.base.substr(0, 4) === "ref/" || routeInfo.base === "ref") {
                ajs.Framework.stateManager.setSessionState(sessionStateReferencePath, routeInfo.base);
                this.setState({
                    guides: false,
                    references: true
                });
                this._lastReferencePath = routeInfo.base;
            } else {
                ajs.Framework.stateManager.setSessionState(sessionStateGuidePath, routeInfo.base);
                this.setState({
                    guides: true,
                    references: false
                });
                this._lastGuidePath = routeInfo.base;
            }
        }

        public onGuidesClick(e: Event): void {
            if (this.references) {
                ajs.Framework.navigator.navigate(this._lastGuidePath !== "" ? "/" + this._lastGuidePath : "/");
            }
        }

        public onReferenceGuideClick(e: Event): void {
            if (this.guides) {
                ajs.Framework.navigator.navigate(this._lastReferencePath !== "" ? "/" + this._lastReferencePath : "/ref");
            }
        }

    }

    ajs.Framework.viewComponentManager.registerComponents(AjsDocContextSwitcher);

}