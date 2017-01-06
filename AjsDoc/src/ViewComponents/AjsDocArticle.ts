﻿namespace ajsdoc {

    "use strict";

    export interface INodeState extends ajs.mvvm.viewmodel.IViewStateSet, INode {
        key: string;
        isLast: boolean;
        path: string;
    }

    export interface IAjsDocArticleStateSet extends ajs.mvvm.viewmodel.IViewStateSet {
        caption?: string;
        description?: string;
        members?: INode[];
    }

    export interface IAjsDocArticleStateGet extends ajs.mvvm.viewmodel.IViewStateGet {
        caption: string;
        description: string;
        modules: AjsDocMember[];
        readonly hasModules: boolean;
        functions: AjsDocMember[];
        readonly hasFunctions: boolean;
        classes: AjsDocMember[];
        readonly hasClasses: boolean;
        interfaces: AjsDocMember[];
        readonly hasInterfaces: boolean;
        variables: AjsDocMember[];
        readonly hasVariables: boolean;
        enumerations: AjsDocMember[];
        readonly hasEnumerations: boolean;
        objectLiterals: AjsDocMember[];
        readonly hasObjectLiterals: boolean;
    }

    export class AjsDocArticle extends ajs.mvvm.viewmodel.ViewComponent implements IAjsDocArticleStateSet, IAjsDocArticleStateGet {

        public caption: string;
        public description: string;

        public modules: AjsDocMember[];
        public get hasModules(): boolean { return this.modules instanceof Array && this.modules.length > 0; }

        public functions: AjsDocMember[];
        public get hasFunctions(): boolean { return this.functions instanceof Array && this.functions.length > 0; }

        public classes: AjsDocMember[];
        public get hasClasses(): boolean { return this.classes instanceof Array && this.classes.length > 0; }

        public interfaces: AjsDocMember[];
        public get hasInterfaces(): boolean { return this.interfaces instanceof Array && this.interfaces.length > 0; }

        public variables: AjsDocMember[];
        public get hasVariables(): boolean { return this.variables instanceof Array && this.variables.length > 0; }

        public enumerations: AjsDocMember[];
        public get hasEnumerations(): boolean { return this.enumerations instanceof Array && this.enumerations.length > 0; }

        public objectLiterals: AjsDocMember[];
        public get hasObjectLiterals(): boolean { return this.objectLiterals instanceof Array && this.objectLiterals.length > 0; }

        public properties: AjsDocMember[];
        public get hasProperties(): boolean { return this.properties instanceof Array && this.properties.length > 0; }

        public methods: AjsDocMember[];
        public get hasMethods(): boolean { return this.methods instanceof Array && this.methods.length > 0; }

        public accessors: AjsDocMember[];
        public get hasAccessors(): boolean { return this.accessors instanceof Array && this.accessors.length > 0; }

        public enumMembers: AjsDocMember[];
        public get hasEnumMembers(): boolean { return this.enumMembers instanceof Array && this.enumMembers.length > 0; }

        public setState(state: IAjsDocArticleStateSet): void {
            super.setState(state);
        }

        protected _filterStateArrayItem(key: string, index: number, length: number, state: INodeState): ajs.mvvm.viewmodel.IFilteredState {

            if (key === "members") {

                // Prepare new state values (Keep the original data untouched)
                let newState: any = {
                    key: state.id.toString(),
                    comment: {
                        shortText: state.comment && state.comment.shortText ? state.comment.shortText: null,
                        longText: null
                    },
                    kindString: state.kindString,
                    isLast: index === length - 1
                };

                // Copy rest of the data from the original data (state) to the new state
                for (var key in state) {
                    if (state.hasOwnProperty(key) && !newState.hasOwnProperty(key)) {
                        newState[key] = state[key];
                    }
                }

                // Get path from INode tree
                let path: string = "";
                let pathBrowser: INode = state;
                while (pathBrowser !== null) {
                    if (pathBrowser.name) {
                        if (pathBrowser.parent !== null) {
                            path = "/" + path;
                        }
                        path = pathBrowser.name + path;
                    }
                    pathBrowser = pathBrowser.parent;
                }

                newState.path = path;

                // Update comments
                if (newState.comment && newState.comment.shortText) {
                    if (newState.comment.shortText.indexOf("\n") !== -1) {
                        newState.comment = {};
                        newState.comment.longText = state.comment.shortText;
                        newState.comment.shortText = state.comment.shortText.substr(0, state.comment.shortText.indexOf("\n"));
                    }
                }

                // We want lower case keywords
                newState.kindString = newState.kindString.toLowerCase();

                // Based on the type set the state of appropriate member
                switch ((newState as INode).kindString) {
                    case "module":
                        return { filterApplied: true, key: "modules", state: newState }
                    case "function":
                        return { filterApplied: true, key: "functions", state: this._expandSignatures(newState) }
                    case "class":
                        return { filterApplied: true, key: "classes", state: newState }
                    case "interface":
                        return { filterApplied: true, key: "interfaces", state: newState }
                    case "variable":
                        return { filterApplied: true, key: "variables", state: newState }
                    case "enumeration":
                        return { filterApplied: true, key: "enumerations", state: newState }
                    case "object literal":
                        return { filterApplied: true, key: "objectLiterals", state: newState }
                    case "property":
                        return { filterApplied: true, key: "properties", state: newState }
                    case "method":
                        return { filterApplied: true, key: "methods", state: this._expandSignatures(newState) }
                    case "accessor":
                        return { filterApplied: true, key: "accessors", state: this._expandSignatures(newState) }
                    case "enumeration member":
                        return { filterApplied: true, key: "enumMembers", state: newState }
                }
            }

            return {
                filterApplied: false,
                key: null,
                state: null
            };
        }

        protected _expandSignatures(state: ajs.mvvm.viewmodel.IViewStateSet): ajs.mvvm.viewmodel.IViewStateSet | ajs.mvvm.viewmodel.IViewStateSet[] {
            if ((state as INode).signatures && (state as INode).signatures.length > 0) {
                let states: ajs.mvvm.viewmodel.IViewStateSet[] = [];

                if ((state as INode).parameters === undefined) {
                    (state as INode).parameters = [];
                }

                states.push(state);

                for (let i: number = 0; i < (state as INode).signatures.length; i++) {
                    let node: INode = (state as INode).signatures[i];

                    if (node.parameters === undefined) {
                        node.parameters = [];
                    }

                    states.push(node);
                }

                return states;
            }
            return state;

        }
    }
    ajs.Framework.viewComponentManager.registerComponents(AjsDocArticle);

    export class AjsDocMember extends ajs.mvvm.viewmodel.ViewComponent {
    }
    ajs.Framework.viewComponentManager.registerComponents(AjsDocMember);


}