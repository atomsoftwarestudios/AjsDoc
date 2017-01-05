declare namespace ajsdoc {
    class AjsDocBrowser extends ajs.app.Application {
        initialize(): void;
        protected _templatesLoaded(successfull: boolean): void;
        protected _loadResources(): void;
        protected _resourcesLoaded(): void;
        protected _setupRoutes(): void;
        protected _finalize(): void;
    }
}
declare namespace ajsdoc {
    interface IAjsDocLayout extends ajs.mvvm.viewmodel.ViewComponent {
        ajsDocHeader: ajs.mvvm.viewmodel.ViewComponent;
        ajsDocMenu: ajs.mvvm.viewmodel.ViewComponent;
        ajsDocNavBar: ajs.mvvm.viewmodel.ViewComponent;
    }
    class AjsDoc extends ajs.mvvm.viewmodel.ViewComponent {
        ajsDocLayout: IAjsDocLayout;
        protected _lastContent: string;
        protected _docModel: DocModel;
        protected _navigatedListener: ajs.mvvm.viewmodel.IComponentEventNotifyListener;
        protected _renderedListener: ajs.mvvm.viewmodel.IComponentEventNotifyListener;
        protected _initialize(): void;
        protected _initAsync(): void;
        protected _finalize(): void;
        protected _navigated(): void;
        protected _rendered(): void;
        protected _updateView(updateLayout: boolean): void;
        protected _setupContentViewComponent(componentName: string): void;
        protected _prepareModuleState(content: INodeInfo): any;
        protected _prepareClassState(content: INodeInfo): any;
        protected _addDefinition(state: any, path: string, node: INode): void;
        protected _getParams(node: INode): any[];
        protected _getExtendedTypes(node: INode): any[];
        protected _getImplementedTypes(node: INode): any[];
        protected _getComment(node: INode, firstLineOnly?: boolean): string;
        protected _setupHTMLContent(text: string): string;
    }
}
declare namespace ajsdoc {
    interface IComment {
        shortText?: string;
    }
    interface IFlags {
        isExported?: boolean;
        isOptional?: boolean;
    }
    interface IType {
        name: string;
    }
    interface INode {
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
        extendedTypes: INode[];
        implementedTypes: INode[];
    }
    interface INodeInfo {
        path: string;
        parent: INodeInfo;
        node: INode;
    }
    interface IMenuItem {
        key: string;
        path: string;
        label: string;
        selected: boolean;
    }
    interface IMenuItemGroup {
        key: string;
        label: string;
        items: IMenuItem[];
    }
    interface IMenu {
        parentLabel: string;
        parentPath: string;
        label: string;
        groups: IMenuItemGroup[];
    }
    interface INavBarItem {
        key: string;
        firstItem: boolean;
        itemPath: string;
        itemType: string;
        itemLabel: string;
    }
    interface INavBarItems extends Array<INavBarItem> {
        [index: number]: INavBarItem;
    }
    class DocModel {
        protected _data: any;
        constructor(data: string);
        getMenu(navPath: string): IMenu;
        getNavBarItems(path: string): INavBarItems;
        getContent(path: string): INodeInfo;
        protected _getGroupIndex(menu: IMenu, key: string): number;
        protected _includeInMenu(nodeKind: string): boolean;
        protected _navigate(path: string, dontExpandAll?: boolean): INodeInfo;
        protected _searchId(nodeInfo: INodeInfo, id: string): INodeInfo;
    }
}
declare namespace hljs {
    function initHighlightingOnLoad(): void;
    function highlightBlock(block: HTMLElement): void;
}
declare class UserApplication extends ajs.app.Application {
    initialize(): void;
    protected _templateLoaded(success: boolean): void;
    protected _setupRoutes(): void;
}
