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

    export class AjsDocLayout extends ajs.mvvm.viewmodel.ViewComponent {

        public dialogVisible: boolean;
        public menuVisible: boolean;

        protected _defaultState(): ajs.mvvm.viewmodel.IViewStateSet {
            return {
                dialogVisible: window.innerWidth < 980,
                menuVisible: true
            };
        }

        public showDialogFrame(): void {
            document.body.style.overflow = "hidden";
            this.setState({ dialogVisible: true });
        }

        public hideDialogFrame(): void {
            // hiding dialog frame hides menu too
            document.body.style.overflow = "";
            this.setState({ dialogVisible: false, menuVisible: false });
            this._updateButton(false);
        }

        public showMenu(): void {
            // both states can be set at once so don't call showDialogFrame
            if (window.innerWidth < 980) {
                document.body.style.overflow = "hidden";
                this.setState({ dialogVisible: true, menuVisible: true });
                this._updateButton(true);
            } else {
                this.setState({ menuVisible: true });
                this._updateButton(true);
            }
        }

        public hideMenu(): void {
            this.hideDialogFrame();
            this._updateButton(false);
        }

        public toggleMenu(): void {
            if (this.menuVisible) {
                this.hideMenu();
            } else {
                this.showMenu();
            }
        }

        public dialogClick(event: Event): void {
            this.hideDialogFrame();
        }

        public touchMove(event: Event): void {
                if (this.menuVisible) {
                event.preventDefault();
            }
        }

        protected _finalize(): void {
            ;
        }

        protected _updateButton(visible: boolean): void {
            let button: AjsDocLayoutMenuButton = this.ajs.viewComponentManager.getFirstComponentInstance<AjsDocLayoutMenuButton>(AjsDocLayoutMenuButton, "ajsDocLayoutMenuButton");
            button.setState({ menuVisible: visible });
        }

    }

    /** Register the component to ViewComponentManager */
    ajs.Framework.viewComponentManager.registerComponents(AjsDocLayout);

}
