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

    export class AjsDocMember extends ajs.mvvm.viewmodel.ViewComponent {

        public get exported(): boolean {
            // too lazy to implement the state interface so retype to any
            let _this: any = this;

            return _this.flags && _this.flags.isExported &&
                _this.kindString !== "property" &&
                _this.kindString !== "method" &&
                _this.kindString !== "get" &&
                _this.kindString !== "set" &&
                _this.kindString !== "constructor";
        }

        public get isPublic(): boolean {
            let _this: any = this;

            return _this.flags && !_this.flags.isPrivate &&
                !_this.flags.isProtected &&
                (_this.kindString === "property" ||
                    _this.kindString === "method" ||
                    _this.kindString === "accessor" ||
                    _this.kindString === "constructor");
        }

        protected _filterState(state: INodeState): INodeState {
            return state;
        }

        protected _filterStateArrayItem(key: string, index: number, length: number, state: INodeState): ajs.mvvm.viewmodel.IFilteredState {
            if (key === "extendedTypes" || key === "implementedTypes") {
                state.isLast = index === length - 1;
                return {
                    filterApplied: true,
                    key: key,
                    state: state
                };
            }

            return {
                filterApplied: false,
                key: null,
                state: null
            };
        }

    }
    ajs.Framework.viewComponentManager.registerComponents(AjsDocMember);

}
