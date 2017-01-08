namespace ajsdoc {

    "use strict";

    export interface INode {
        parent: INode;
        id: number;
        name: string;
        kind: number;
        kindString?: string;
        comment?: IComment;
        flags?: IFlags;
        children?: INode[];
        type?: IType;
        signatures?: INode[];
        parameters?: INode[];
        extendedTypes?: INode[];
        implementedTypes?: INode[];
        getSignature?: INode[];
        setSignature?: INode[];
        isLast?: boolean;
        path: string;
    }

}