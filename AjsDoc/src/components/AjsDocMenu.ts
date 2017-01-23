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

    export enum TransitionType {
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

    export class AjsDocMenu extends ajs.mvvm.viewmodel.ViewComponent {

        protected _programModel: ProgramModel;
        protected _contentModel: ContentModel;

        protected _previousContext: string;
        protected _previousRefNode: INode;
        protected _previousArticle: IArticleData;

        protected _initialize(): void {
            this._contentModel = ajs.Framework.modelManager.getModelInstance(ContentModel) as ContentModel;
            this._programModel = ajs.Framework.modelManager.getModelInstance(ProgramModel) as ProgramModel;
            this._previousContext = null;
            this._previousRefNode = null;
            this._previousArticle = null;
        }

        public touchMove(e: Event): void {
            e.cancelBubble = true;
            e.stopPropagation();
            if (this.ajsElement.scrollHeight <= this.ajsElement.clientHeight) {
                e.preventDefault();
            }
        }

        public stateTransitionBegin(): ajs.mvvm.viewmodel.ITransitionType {

            let transitionType: TransitionType = this._getTransitionType();

            if (transitionType === TransitionType.NONE) {
                return null;
            } else {
                return {
                    oldComponent: TransitionType[transitionType],
                    newComponent: TransitionType[transitionType]
                };
            }

        }

        public stateTransitionEnd(e: Event): void {
            this._ajsVisualStateTransitionEnd();
        }
        protected _getTransitionType(): TransitionType {

            let transitionType: TransitionType = TransitionType.NONE;

            let path: string = ajs.Framework.router.currentRoute.base;

            if (path.substr(0, 3) === "ref") {

                if (this._previousContext === "") {
                    transitionType = TransitionType.FADE;
                } else {
                    transitionType = this._getTransitionTypeRef(path.substr(4));
                }

                this._previousContext = "ref";

            } else {

                if (this._previousContext === "ref") {
                    transitionType = TransitionType.FADE;
                } else {
                    transitionType = this._getTransitionTypeDoc(path);
                }

                this._previousContext = "";

            }

            return transitionType;
        }

        protected _getTransitionTypeDoc(path: string): TransitionType {
            let transitionType: TransitionType = TransitionType.NONE;

            let currentArticle: IArticleData = this._contentModel.navigate(path);
            /*if (!(currentArticle.children instanceof Array) || currentArticle.children.length === 0) {
                currentArticle = currentArticle.parent;
            }*/

            if (this._previousArticle !== null) {

                if (currentArticle.parent === this._previousArticle.parent) {
                    if (currentArticle.children && currentArticle.children.length > 0) {
                        transitionType = TransitionType.RTL;
                    } else {
                        if (this._previousArticle.children && this._previousArticle.children.length > 0) {
                            transitionType = TransitionType.LTR;
                        }
                    }
                }

                if (currentArticle.parent === this._previousArticle) {
                    if (currentArticle.children && currentArticle.children.length > 0) {
                        transitionType = TransitionType.RTL;
                    }
                }

                if (currentArticle.parent === this._previousArticle) {
                    if (currentArticle.children && currentArticle.children.length > 0) {
                        transitionType = TransitionType.RTL;
                    }
                }

                if (currentArticle === this._previousArticle.parent) {
                    if (this._previousArticle.children && this._previousArticle.children.length > 0) {
                        transitionType = TransitionType.LTR;
                    }
                }

                if (this._previousArticle.parent && currentArticle === this._previousArticle.parent.parent) {
                    transitionType = TransitionType.LTR;
                }

            } else {
                transitionType = TransitionType.FADE;
            }

            this._previousArticle = currentArticle;

            return transitionType;
        }

        protected _getTransitionTypeRef(path: string): TransitionType {

            let transitionType: TransitionType = TransitionType.NONE;

            let currentNode: INode = this._programModel.navigate(path);
            if (!(currentNode.children instanceof Array) || currentNode.children.length === 0) {
                currentNode = currentNode.parent;
            }

            if (this._previousRefNode !== null) {

                if (currentNode.parent !== this._previousRefNode && currentNode.parent !== this._previousRefNode.parent) {
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