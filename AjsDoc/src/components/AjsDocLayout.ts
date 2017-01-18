/* *************************************************************************
The MIT License (MIT)
Copyright (c)2017 Atom Software Studios. All rights reserved.

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

namespace ajsdoc {

    "use strict";

    export class AjsDocLayout extends ajs.mvvm.viewmodel.ViewComponent {

        public dialogVisible: boolean;
        public menuVisible: boolean;

        public showDialogFrame() {
            document.body.style.overflow = "hidden";
            this.setState({ dialogVisible: true });
        }

        public hideDialogFrame() {
            document.body.style.overflow = "";
            this.setState({ dialogVisible: false, menuVisible: false });
            this._updateButton();
        }

        public showMenu() {
            document.body.style.overflow = "hidden";
            this.setState({ dialogVisible: true, menuVisible: true });
            this._updateButton();
        }

        public hideMenu() {
            this.hideDialogFrame();
            this._updateButton();
        }

        public toggleMenu() {
            if (this.menuVisible) {
                this.hideMenu();
            } else {
                this.showMenu();
            }
        }

        public dialogClick(event: Event): void {
            this.hideDialogFrame();
        }

        protected _initialize() {
            this.showMenu();
        }

        protected _updateButton() {
            let button: AjsDocLayoutMenuButton = this._ajsViewComponentManager.getFirstComponentInstance<AjsDocLayoutMenuButton>(AjsDocLayoutMenuButton, "ajsDocLayoutMenuButton");
            button.setState({ menuVisible: this.menuVisible });
        }

    }

    /** Register the component to ViewComponentManager */
    ajs.Framework.viewComponentManager.registerComponents(AjsDocLayout);

}
