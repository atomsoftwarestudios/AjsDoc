namespace ajsdoc {

    "use strict";

    export interface INavBarItemsState extends Array<INavBarItemState> {
        [index: number]: INavBarItemState;
    }

}