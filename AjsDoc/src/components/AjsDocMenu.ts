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

    enum TransitionType {
        NONE,
        FADE,
        LTR,
        RTL
    }

    const MENU_DONT_EXPAND: string[] = [
        "Interface",
        "Variable",
        "Enumeration",
        "Object literal",
        "Function",
        "Constructor",
        "Method",
        "Property",
        "Accessor"
    ];

    class AjsDocMenu extends ajs.mvvm.viewmodel.ViewComponent {

        protected _programModel: ProgramModel;

        protected _previousContext: string;
        protected _previousRefNode: INode;

        protected _initialize(): void {
            this._programModel = ajs.Framework.modelManager.getModelInstance(ProgramModel) as ProgramModel;
            this._previousContext = null;
            this._previousRefNode = null;
            this._ajsVisualStateTransition = true;
        }

        public ajsVisualStateTransitionBegin(newElement: HTMLElement): void {

            super.ajsVisualStateTransitionBegin(newElement);

            let animationEndListener: EventListener = (e: Event) => {
                this._ajsTransitionOldElement.style.animationDuration = "";
                this._ajsTransitionNewElement.style.animationDuration = "";
                this._ajsTransitionOldElement.classList.remove("ajsDocMenuLtrOld");
                this._ajsTransitionOldElement.classList.remove("ajsDocMenuRtlOld");
                this._ajsTransitionOldElement.classList.remove("ajsDocMenuFadeOld");
                this._ajsTransitionNewElement.classList.remove("ajsDocMenuLtrNew");
                this._ajsTransitionNewElement.classList.remove("ajsDocMenuRtlNew");
                this._ajsTransitionNewElement.classList.remove("ajsDocMenuFadeNew");
                this._visualStateTransitionEnd();            
            }

            let transitionType: TransitionType = this._getTransitionType();

            switch (transitionType) {
                case TransitionType.LTR:
                    this._ajsTransitionNewElement.addEventListener("animationend", animationEndListener);
                    this._ajsTransitionNewElement.classList.add("ajsDocMenuLtrNew");
                    this._ajsTransitionOldElement.classList.add("ajsDocMenuLtrOld");
                    this._ajsTransitionNewElement.parentElement.insertBefore(
                        this._ajsTransitionOldElement,
                        this._ajsTransitionNewElement
                    );
                    break;
                case TransitionType.RTL:
                    this._ajsTransitionNewElement.addEventListener("animationend", animationEndListener);
                    this._ajsTransitionNewElement.classList.add("ajsDocMenuRtlNew");
                    this._ajsTransitionOldElement.classList.add("ajsDocMenuRtlOld");
                    this._ajsTransitionNewElement.parentElement.insertBefore(
                        this._ajsTransitionOldElement,
                        this._ajsTransitionNewElement
                    );
                    break;
                case TransitionType.FADE:
                    this._ajsTransitionNewElement.parentElement.insertBefore(
                        this._ajsTransitionOldElement,
                        this._ajsTransitionNewElement.nextSibling
                    );
                    this._ajsTransitionNewElement.addEventListener("animationend", animationEndListener);
                    this._ajsTransitionNewElement.classList.add("ajsDocMenuFadeNew");
                    this._ajsTransitionOldElement.classList.add("ajsDocMenuFadeOld");
                    break;
                default:
                    this._visualStateTransitionEnd();
                    return;
            }

        }

        protected _ajsVisualStateTransitionCancel(): void {
            this._ajsTransitionOldElement.style.animationDuration = "1ms";
            this._ajsTransitionNewElement.style.animationDuration = "1ms";
        }

        protected _getTransitionType(): TransitionType {

            let transitionType: TransitionType = TransitionType.NONE;

            let path = ajs.Framework.router.currentRoute.base;

            if (path.substr(0, 3) === "ref") {

                if (this._previousContext === "") {
                    transitionType = TransitionType.FADE;
                } else {
                    transitionType = this._getTransitionTypeRef(path.substr(4))
                }

                this._previousContext = "ref";

            } else {

                if (this._previousContext === "ref") {
                    transitionType = TransitionType.FADE;
                } else {
                    transitionType = this._getTransitionTypeDoc(path)
                }

                this._previousContext = "";

            }

            return transitionType;
        }

        protected _getTransitionTypeDoc(path: string): TransitionType {
            return TransitionType.FADE;
        }

        protected _getTransitionTypeRef(path: string): TransitionType {

            let transitionType: TransitionType = TransitionType.NONE;

            let currentNode = this._programModel.navigate(path);
            if (!(currentNode.children instanceof Array) || currentNode.children.length === 0) {
                currentNode = currentNode.parent;
            }

            if (this._previousRefNode !== null) {

                if (currentNode.parent !== this._previousRefNode) {
                    transitionType = TransitionType.FADE;
                }

                if (currentNode === this._previousRefNode.parent) {
                    transitionType = TransitionType.LTR;
                }

                if (currentNode.parent === this._previousRefNode && MENU_DONT_EXPAND.indexOf(currentNode.kindString) === -1) {
                    transitionType = TransitionType.RTL;
                }

            } else {
                transitionType = TransitionType.FADE;
            }

            if (MENU_DONT_EXPAND.indexOf(currentNode.kindString) === -1) {
                this._previousRefNode = currentNode;
            } else {
                if (this._previousRefNode === null) {
                    let node: INode = currentNode.parent;
                    while (node.parent !== null) {
                        if (MENU_DONT_EXPAND.indexOf(node.kindString) === -1) {
                            this._previousRefNode = node;
                            break;
                        }
                        node = node.parent;
                    }
                }
            }

            return transitionType;
        }

    }

    /** Register the component to ViewComponentManager */
    ajs.Framework.viewComponentManager.registerComponents(AjsDocMenu);

}