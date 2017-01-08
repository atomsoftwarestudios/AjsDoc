namespace ajsdoc {

    "use strict";

    interface IKindMap {
        [key: string]: string;
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

    export interface IItemsById {
        [index: number]: INode;
    }

    export class DocModel {

        protected _jsonData: string;
        protected _data: INode;
        protected _itemsById: IItemsById;

        constructor(data: string) {
            this._itemsById = {};
            this._jsonData = data;
            this._data = JSON.parse(data);
            this._prepareData(this._data, null);
        }

        // anotate the data with additional information
        protected _prepareData(node: INode, parent: INode): void {
            node.parent = parent;
            if (node.id !== undefined) {
                this._itemsById[node.id] = node;
            }

            if (parent && parent !== null) {
                if (node.parent && node.parent.path) {
                    node.path = parent.path;
                }
                node.path = node.path && node.name ? node.path += "/" + node.name : node.path = "/" + node.name;

            } else {
                if (node.name) {
                    node.path = "/" + node.name;
                } else {
                    node.path = ""
                }
            }

            if (node.children) {
                for (let i: number = 0; i < node.children.length; i++) {
                    this._prepareData(node.children[i], node);
                }
            }
        }

        public getMenu(navPath: string): IMenuState {

            let node: INode = this._navigate(navPath, true);

            let parentLabel: string = node.parent !== null && node.parent.kind !== 0 ?
                node.parent.kindString + " " + node.parent.name : null;

            let parentPath: string = node.parent !== null ? node.parent.path : "";

            let label: string = node.kind !== 0 ? node.kindString + " " + node.name : null;

            let menu: IMenuState = {
                parentLabel: parentLabel,
                parentPath: parentPath,
                label: label,
                groups: []
            };

            if (node.children) {

                for (let i: number = 0; i < node.children.length; i++) {

                    let kindMapped: string = "Unknown [" + node.children[i].kindString + "]";
                    if (kindMap.hasOwnProperty(node.children[i].kindString.replace(" ", "_"))) {
                        kindMapped = kindMap[node.children[i].kindString.replace(" ", "_")];
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

                    if (this._includeInMenu(node.children[i].kindString)) {
                        menu.groups[itemGroupIndex].items.push({
                            key: node.children[i].id.toString(),
                            path: node.children[i].path,
                            label: node.children[i].name,
                            selected: node.children[i].path === navPath
                        });
                    }
                }

            }

            return menu;
        }

        public getNavBarItems(path: string): INavBarItemsState {
            let items: INavBarItemsState = [];

            let node: INode = this._navigate(path);

            let key: number = 0;
            while (node !== null) {
                let navBarItem: INavBarItemState = {
                    key: key.toString(),
                    firstItem: false,
                    itemPath: node.path,
                    itemType: node.kindString,
                    itemLabel: node.name
                };
                if (node.kind !== 0) {
                    items.unshift(navBarItem);
                    key++;
                }
                node = node.parent;
            }

            if (items.length > 0) {
                items[0].firstItem = true;
            }

            return items;
        }

        public getContent(path: string): INode {
            return this._navigate(path);
        }

        protected _getGroupIndex(menu: IMenuState, key: string): number {
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

        protected _navigate(path: string, dontExpandAll?: boolean): INode {

            let node: INode = this._data;

            if (path === "") {
                return node;
            }

            let names: string[] = path.split("/");

            path = "";

            for (let i: number = 0; i < names.length; i++) {
                if (path.length === 0) {
                    path = names[i];
                } else {
                    path = path + "/" + names[i];
                }

                node = this._searchId(node, names[i]);

                if(node === null) {
                    throw new InvalidPathException();
                }
            }

            if (dontExpandAll && menuDontExpand.indexOf(node.kindString) !== -1) {
                return node.parent;
            }

            return node;
        }

        // searches for the id under given node children
        protected _searchId(node: INode, name: string): INode {

            for (let i: number = 0; i < node.children.length; i++) {
                if (node.children[i].name === name) {
                    return node.children[i];
                }
            }

            return null;

        }

        // searches for the item with the given id in the whole tree
        public getItemById(id: number): INode {
            if (this._itemsById.hasOwnProperty(id.toString())) {
                return this._itemsById[id];
            }
            return null;
        }

    }

}
