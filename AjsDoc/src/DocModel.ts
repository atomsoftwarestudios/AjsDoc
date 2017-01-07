namespace ajsdoc {

    "use strict";

    class InvalidPathException { }

    export interface IComment {
        shortText?: string;
        longText?: string;
    }

    export interface IFlags {
        isExported?: boolean;
        isOptional?: boolean;
    }

    export interface IType {
        name: string;
        type?: string;
        types?: IType[];
    }

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

    export interface INodeInfo {
        path: string;
        parent: INodeInfo;
        node: INode;
    }

    export interface IMenuItem {
        key: string;
        path: string;
        label: string;
        selected: boolean;
    }

    export interface IMenuItemGroup {
        key: string;
        label: string;
        items: IMenuItem[];
    }

    export interface IMenu {
        parentLabel: string;
        parentPath: string;
        label: string;
        groups: IMenuItemGroup[];
    }

    interface IKindMap {
        [key: string]: string;
    }

    export interface INavBarItem {
        key: string;
        firstItem: boolean;
        itemPath: string;
        itemType: string;
        itemLabel: string;
    };

    export interface INavBarItems extends Array<INavBarItem> {
        [index: number]: INavBarItem;
    }

    const kindMap: IKindMap = {
        Module: "Modules",
        Class: "Classes",
        Interface: "Interfaces",
        Function: "Functions",
        Property: "Properties",
        Method: "Methods",
        Accessor: "Accessors",
        Variable: "Variables",
        Enumeration: "Enumerations",
        Object_literal: "Object literals",
        Constructor: "Constructor"
    };

    const menuDontExpand: string[] = [
        "Class",
        "Interface",
        "Variable",
        "Enumeration",
        "Object literal",
        "Function"
    ];

    export class DocModel {

        protected _jsonData: string;
        protected _data: INode;

        constructor(data: string) {
            this._jsonData = data;
            this._data = JSON.parse(data);
            this._setParent(this._data, null);
        }

        protected _setParent(node: INode, parent: INode) {
            node.parent = parent;
            if (node.children) {
                for (let i: number = 0; i < node.children.length; i++) {
                    this._setParent(node.children[i], node);
                }
            }
        }

        public getMenu(navPath: string): IMenu {

            let nodeInfo: INodeInfo = this._navigate(navPath, true);

            let parentLabel: string = nodeInfo.parent !== null && nodeInfo.parent.node.kind !== 0 ?
                nodeInfo.parent.node.kindString + " " + nodeInfo.parent.node.name : null;

            let parentPath: string = nodeInfo.parent !== null ? nodeInfo.parent.path : "";

            let label: string = nodeInfo.node.kind !== 0 ? nodeInfo.node.kindString + " " + nodeInfo.node.name : null;

            let menu: IMenu = {
                parentLabel: parentLabel,
                parentPath: parentPath,
                label: label,
                groups: []
            };

            if (nodeInfo.node.children) {

                for (let i: number = 0; i < nodeInfo.node.children.length; i++) {

                    let path: string = nodeInfo.path;

                    if (path === "") {
                        path = nodeInfo.node.children[i].name;
                    } else {
                        path = path + "/" + nodeInfo.node.children[i].name;
                    }


                    let kindMapped: string = "Unknown [" + nodeInfo.node.children[i].kindString + "]";
                    if (kindMap.hasOwnProperty(nodeInfo.node.children[i].kindString.replace(" ", "_"))) {
                        kindMapped = kindMap[nodeInfo.node.children[i].kindString.replace(" ", "_")];
                    }

                    let itemGroupIndex: number = this._getGroupIndex(menu, kindMapped);
                    if (itemGroupIndex === -1) {

                        menu.groups.push({
                            key: kindMapped,
                            label: kindMapped,
                            items: []
                        });
                        itemGroupIndex = menu.groups.length - 1;
                    }

                    if (this._includeInMenu(nodeInfo.node.children[i].kindString)) {
                        menu.groups[itemGroupIndex].items.push({
                            key: path,
                            path: path,
                            label: nodeInfo.node.children[i].name,
                            selected: path === navPath
                        });
                    }
                }

            }

            return menu;
        }

        public getNavBarItems(path: string): INavBarItems {
            let items: INavBarItems = [];

            let nodeInfo: INodeInfo = this._navigate(path);

            let key: number = 0;
            while (nodeInfo !== null) {
                let navBarItem: INavBarItem = {
                    key: key.toString(),
                    firstItem: false,
                    itemPath: nodeInfo.path,
                    itemType: nodeInfo.node.kindString,
                    itemLabel: nodeInfo.node.name
                };
                if (nodeInfo.node.kind !== 0) {
                    items.unshift(navBarItem);
                    key++;
                }
                nodeInfo = nodeInfo.parent;
            }

            if (items.length > 0) {
                items[0].firstItem = true;
            }

            return items;
        }

        public getContent(path: string): INodeInfo {
            return this._navigate(path);
        }

        protected _getGroupIndex(menu: IMenu, key: string): number {
            for (let i: number = 0; i < menu.groups.length; i++) {
                if (menu.groups[i].key === key) {
                    return i;
                }
            }
            return -1;
        }

        protected _includeInMenu(nodeKind: string): boolean {
            return true;
        }

        protected _navigate(path: string, dontExpandAll?: boolean): INodeInfo {

            let ids: string[] = path.split("/");

            let nodeInfo: INodeInfo = {
                path: "",
                parent: null,
                node: this._data
            };

            if (path === "") {
                return nodeInfo;
            }

            path = "";

            for (let i: number = 0; i < ids.length; i++) {
                if (path.length === 0) {
                    path = ids[i];
                } else {
                    path = path + "/" + ids[i];
                }

                nodeInfo = this._searchId(nodeInfo, ids[i]);
                if (nodeInfo === null) {
                    break;
                } else {
                    nodeInfo.path = path;
                }
            }

            if (dontExpandAll && menuDontExpand.indexOf(nodeInfo.node.kindString) !== -1) {
                return nodeInfo.parent;
            }

            if (nodeInfo === null) {
                throw new InvalidPathException();
            }

            return nodeInfo;
        }

        protected _searchId(nodeInfo: INodeInfo, id: string): INodeInfo {

            for (let i: number = 0; i < nodeInfo.node.children.length; i++) {
                if (nodeInfo.node.children[i].name === id) {
                    return {
                        path: "",
                        node: nodeInfo.node.children[i],
                        parent: nodeInfo
                    };
                }
            }

            return null;

        }

    }

}
