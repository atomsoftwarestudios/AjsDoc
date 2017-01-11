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

    class AjsDocMenu extends ajs.mvvm.viewmodel.ViewComponent {

        protected _fadeoutTimer: number;
        protected _fadeoutState: number;
        protected _newWidth: number;

        protected _initialize() {
            this._fadeoutTimer = -1;
            this._ajsVisualStateTransition = true;
        }

        public ajsVisualStateTransitionBegin(newElement: HTMLElement): void {

            super.ajsVisualStateTransitionBegin(newElement);

            if (this._ajsTransitionOldElement instanceof HTMLElement) {
                this._ajsTransitionNewElement.style.position = "absolute";
                this._ajsTransitionOldElement.style.position = "absolute";
                this._ajsTransitionOldElement.style.filter = "brightness(85%)";
                this._ajsTransitionNewElement.parentNode.insertBefore(this._ajsTransitionOldElement, this._ajsTransitionNewElement);
                let rectOld: ClientRect = this._ajsTransitionOldElement.getBoundingClientRect();
                this._ajsTransitionOldElement.style.top = rectOld.top + "px";
                let rectNew: ClientRect = this._ajsTransitionNewElement.getBoundingClientRect();
                this._newWidth = rectNew.width;
                this._ajsTransitionNewElement.style.width = 0 + "px";

                this._ajsTransitionOldElement.style.height = rectNew.height + "px";

                this._fadeoutState = rectOld.width;

                this._fadeoutTimer = setInterval(
                    () => {
                        this._fadeoutState -= 20;
                        if (this._fadeoutState <= 0) {
                            clearInterval(this._fadeoutTimer);
                            this._fadeoutTimer = -1;
                            this._ajsTransitionOldElement.style.width = "0";
                            this._ajsTransitionNewElement.style.left = "0";
                            this._ajsTransitionNewElement.style.width = this._newWidth + "px";
                            this._visualStateTransitionEnd();
                        } else {
                            this._ajsTransitionOldElement.style.width = this._fadeoutState + "px";
                            this._ajsTransitionNewElement.style.left = this._fadeoutState + "px";
                            this._ajsTransitionNewElement.style.width = this._newWidth - this._fadeoutState + "px";
                        }
                    }
                    , 25);
            }
        }

        protected _ajsVisualStateTransitionCancel(): void {
            if (this._fadeoutTimer !== -1) {
                clearInterval(this._fadeoutTimer);
                this._fadeoutTimer = -1;
                this._ajsTransitionOldElement.style.width = "0";
                this._ajsTransitionNewElement.style.left = "0";
                this._ajsTransitionNewElement.style.width = this._newWidth + "px";
                this._visualStateTransitionEnd();
            }
        }

    }

    /** Register the component to ViewComponentManager */
    ajs.Framework.viewComponentManager.registerComponents(AjsDocMenu);

}