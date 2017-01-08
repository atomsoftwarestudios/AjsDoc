namespace ajsdoc {

    "use strict";

    export class AjsDocMember extends ajs.mvvm.viewmodel.ViewComponent {

        public get exported(): boolean {
            let _this: any = this;

            return _this.flags.isExported &&
                _this.kindString !== "property" &&
                _this.kindString !== "method" &&
                _this.kindString !== "get" &&
                _this.kindString !== "set" &&
                _this.kindString !== "constructor";
        }

        protected _filterStateArrayItem(key: string, index: number, length: number, state: INodeState): ajs.mvvm.viewmodel.IFilteredState {
            if (key === "extendedTypes" || key === "implementedTypes") {
                state.isLast = index == length - 1;
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
