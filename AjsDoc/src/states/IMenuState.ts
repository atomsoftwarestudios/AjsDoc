namespace ajsdoc {

    "use strict";

    export interface IMenuState {
        parentLabel: string;
        parentPath: string;
        label: string;
        groups: IMenuItemGroupState[];
    }

}