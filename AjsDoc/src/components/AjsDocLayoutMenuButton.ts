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

    export class AjsDocLayoutMenuButton extends ajs.mvvm.viewmodel.ViewComponent {


        public openMenu(): void {
            let e1: HTMLCollectionOf<Element> = document.getElementsByClassName("ajsDocLayoutMenuContainer");
            let e2: HTMLCollectionOf<Element> = document.getElementsByClassName("ajsDocLayoutContentContainer");
            if (window.getComputedStyle(e1[0]).display === "none") {
                if (window.innerWidth < 350) {
                    (e1[0] as HTMLElement).style.width = "100%";
                } else {
                    (e1[0] as HTMLElement).style.width = "350px";
                }
                (e1[0] as HTMLElement).style.display = "block";
                //(e2[0] as HTMLElement).style.left = "350px";
            } else {
                (e1[0] as HTMLElement).style.display = "none";
                //(e2[0] as HTMLElement).style.left = "0";
            }

        }

    }

    /** Register the component to ViewComponentManager */
    ajs.Framework.viewComponentManager.registerComponents(AjsDocLayoutMenuButton);

}

