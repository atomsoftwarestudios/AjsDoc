namespace ajsdoc {

    "use strict";

    export interface IType {
        name: string;
        type?: string;
        types?: IType[];
    }

}