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

    export interface IHierarchyNodeState {
        path?: string;
        name: string;
        extends?: IHierarchyNodeState;
    }

    export interface IImplementedTypeState {
        key: string;
        path?: string;
        name: string;
    }

    export interface INodeState extends ajs.mvvm.viewmodel.IViewStateSet, INode {
        key: string;
        isLast: boolean;
        path: string;
    }

    export interface IAjsDocArticleStateSet extends ajs.mvvm.viewmodel.IViewStateSet {
        caption?: string;
        description?: string;
        members?: INode[];
        syntaxes?: INode[] | AjsDocMember[];
        hierarchy?: IHierarchyNodeState;
        implements?: IImplementedTypeState[];
    }

    export interface IAjsDocArticleStateGet extends ajs.mvvm.viewmodel.IViewStateGet {
        caption: string;
        description: string;
        modules: AjsDocMember[];
        readonly hasSyntaxes: boolean;
        syntaxes: AjsDocMember[] | INode[];
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

        protected _renderedListener: ajs.events.IListener;

        public caption: string;
        public description: string;
        public syntax: ajs.mvvm.viewmodel.ViewComponent;

        public syntaxes: AjsDocMember[] | INode[];
        public get hasSyntaxes(): boolean { return this.syntaxes instanceof Array && this.syntaxes.length > 0; }

        public hierarchy: IHierarchyNodeState;
        public get hasHierarchy(): boolean { return this.hierarchy !== undefined && this.hierarchy !== null; }

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

        public constructors: AjsDocMember[];
        public get hasConstructors(): boolean { return this.constructors instanceof Array && this.constructors.length > 0; }

        public setState(state: IAjsDocArticleStateSet): void {
            super.setState(state);
        }

        protected _initialize() {
            this._renderedListener = (sender: ajs.mvvm.viewmodel.ViewComponent) => {
                this._rendered();
                return true;
            };

            this._ajsView.renderDoneNotifier.subscribe(this._renderedListener);
        }

        protected _finalize() {
            this._ajsView.renderDoneNotifier.unsubscribe(this._renderedListener);
        }

        protected _rendered(): void {
            let pre: NodeListOf<HTMLPreElement> = document.getElementsByTagName("pre");
            for (let i: number = 0; i < pre.length; i++) {
                hljs.highlightBlock(pre[i]);
            }
        }

        protected _filterState(state: INodeState): INodeState {
            return state;
        }

        protected _filterStateKey(key: string, state: INodeState): ajs.mvvm.viewmodel.IFilteredState {
            return {
                filterApplied: false,
                key: null,
                state: null
            };
        }

        protected _filterStateArrayItem(key: string, index: number, length: number, state: INodeState): ajs.mvvm.viewmodel.IFilteredState {

            if (key === "members" || key === "syntaxes") {

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
                for (var k in state) {
                    if (state.hasOwnProperty(k) && !newState.hasOwnProperty(k)) {
                        newState[k] = state[k];
                    }
                }

                // Get path from INode tree
                let path: string = "";
                if (key === "members") {
                    let pathBrowser: INode = state;
                    while (pathBrowser !== null && pathBrowser.parent !== null) {
                        if (pathBrowser.name) {
                            if (pathBrowser.parent !== null) {
                                path = "/" + path;
                            }
                            path = pathBrowser.name + path;
                        }
                        pathBrowser = pathBrowser.parent;
                    }

                    if (path !== "" && path[path.length - 1] === "/") {
                        path = path.substr(0, path.length - 1);
                    }
                } else {
                    path = null;
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
                    case "constructor":
                        return { filterApplied: true, key: key !== "members" ? key : "constructors", state: this._function(newState, key === "members") }
                    case "module":
                        return { filterApplied: true, key: key !== "members" ? key : "modules", state: newState }
                    case "call signature":
                        return { filterApplied: true, key: key !== "members" ? key : "functions", state: this._function(newState, key === "members") }
                    case "function":
                        return { filterApplied: true, key: key !== "members" ? key : "functions", state: this._function(newState, key === "members") }
                    case "class":
                        return { filterApplied: true, key: key !== "members" ? key : "classes", state: newState }
                    case "interface":
                        return { filterApplied: true, key: key !== "members" ? key : "interfaces", state: newState }
                    case "variable":
                        return { filterApplied: true, key: key !== "members" ? key : "variables", state: this._variable(newState) }
                    case "enumeration":
                        return { filterApplied: true, key: key !== "members" ? key : "enumerations", state: newState }
                    case "object literal":
                        return { filterApplied: true, key: key !== "members" ? key : "objectLiterals", state: newState }
                    case "property":
                        return { filterApplied: true, key: key !== "members" ? key : "properties", state: newState }
                    case "method":
                        return { filterApplied: true, key: key !== "members" ? key : "methods", state: this._function(newState, key === "members") }
                    case "accessor":
                        return { filterApplied: true, key: key !== "members" ? key : "accessors", state: this._accessor(newState) }
                    case "enumeration member":
                        return { filterApplied: true, key: key !== "members" ? key : "enumMembers", state: newState }
                }
            }

            return {
                filterApplied: false,
                key: null,
                state: null
            };
        }

        protected _variable(state: ajs.mvvm.viewmodel.IViewStateSet): ajs.mvvm.viewmodel.IViewStateSet {
            let newState: any;
            if ((state as INode).name.toUpperCase() === (state as INode).name) {
                newState = { kindString: "const" };
            } else {
                newState = { kindString: "var" };
            }
            for (var key in state) {
                if (state.hasOwnProperty(key) && !newState.hasOwnProperty(key)) {
                    newState[key] = state[key];
                }
            }

            return newState;
        }

        protected _function(state: ajs.mvvm.viewmodel.IViewStateSet, expand: boolean): ajs.mvvm.viewmodel.IViewStateSet {
            let expandedState: any = this._expandSignatures(state, expand);

            if (expandedState instanceof Array) {
                let nodes: INode[] = expandedState;
                for (let i: number = 0; i < nodes.length; i++) {
                    if (nodes[i].parameters) {
                        for (let j: number = 0; j < nodes[i].parameters.length; j++) {
                            if (j === nodes[i].parameters.length - 1) {
                                nodes[i].parameters[j].isLast = true;
                            }
                            nodes[i].parameters[j] = this._type(nodes[i].parameters[j], false);
                        }
                    }
                    nodes[i] = this._type(nodes[i], true);
                }
                return nodes;
            } else {
                let node: INode = this._type(expandedState, true);
                node.parameters = node.parameters || [];
                if (node.parameters.length > 0) {
                    node.parameters[node.parameters.length - 1].isLast = true;
                }
                return node;
            }
        }

        protected _accessor(state: ajs.mvvm.viewmodel.IViewStateSet): ajs.mvvm.viewmodel.IViewStateSet {

            let accessors: INode[] = [];

            function addSignature(signature: INode) {

                let newState: any = {
                    kindString: signature.name.substr(2),
                    name: (state as INode).name,
                    type: signature.type,
                    parameters: signature.parameters || []
                }

                if (newState.parameters instanceof Array && newState.parameters.length > 0) {
                    newState.parameters[newState.parameters.length - 1].isLast = true;
                }

                for (var key in state) {
                    if (state.hasOwnProperty(key) && !newState.hasOwnProperty(key)) {
                        newState[key] = state[key];
                    }
                }
                accessors.push(newState);
            }

            if ((state as INode).getSignature) {
                for (let i: number = 0; i < (state as INode).getSignature.length; i++) {
                    addSignature((state as INode).getSignature[i]);
                }
            }

            if ((state as INode).setSignature) {
                for (let i: number = 0; i < (state as INode).setSignature.length; i++) {
                    addSignature((state as INode).setSignature[i]);
                }
            }

            return accessors;
        }

        protected _type(node: INode, isFunctionReturnType: boolean): INode {
            if (!node.type) {
                if (isFunctionReturnType) {
                    node.type = { name: "void" };
                } else {
                    node.type = { name: "any" };
                }

                return node;
            } else {
                if (node.type.type && node.type.type === "union" && node.type.types) {

                    let name: string[] = []
                    for (let i: number = 0; i < node.type.types.length; i++) {
                        name.push(node.type.types[i].name);
                    }

                    let newNode: any = {};
                    newNode.type = {
                        name: name.join("|"),
                        type: "union"
                    }

                    for (var key in node) {
                        if (node.hasOwnProperty(key) && !newNode.hasOwnProperty(key)) {
                            newNode[key] = node[key];
                        }
                    }

                    return newNode;
                }
            }

            return node;
        }

        protected _expandSignatures(state: ajs.mvvm.viewmodel.IViewStateSet, expand: boolean): ajs.mvvm.viewmodel.IViewStateSet | ajs.mvvm.viewmodel.IViewStateSet[] {
            if ((state as INode).signatures && (state as INode).signatures.length > 0 && expand) {
                let states: ajs.mvvm.viewmodel.IViewStateSet[] = [];

                if ((state as INode).parameters === undefined) {
                    (state as INode).parameters = [];
                }

                if ((state as INode).signatures && (state as INode).signatures.length === 0 || 
                    (state as INode).signatures && (state as INode).signatures.length > 1) {
                    states.push(state);
                }

                for (let i: number = 0; i < (state as INode).signatures.length; i++) {
                    let node: INode = (state as INode).signatures[i];

                    let newState: any = {
                        kindString: (state as INode).kindString,
                        flags: (state as INode).flags,
                        parameters: [],
                        path: (state as INode).path,
                        comment: {
                            shortText: (state as INode).signatures[i].comment &&
                                (state as INode).signatures[i].comment.shortText ?
                                (state as INode).signatures[i].comment.shortText : null,
                            longText: null
                        }
                    }
                
                    // copy rest of the data from the original data (state) to the new state
                    for (var key in node) {
                        if (node.hasOwnProperty(key) && !newState.hasOwnProperty(key)) {
                            newState[key] = node[key];
                        }
                    }

                    // update comments
                    if (newState.comment && newState.comment.shortText) {
                        if (newState.comment.shortText.indexOf("\n") !== -1) {
                            newState.comment = {
                                longText: newState.comment.shortText,
                                shortText: newState.comment.shortText.substr(0, newState.comment.shortText.indexOf("\n"))
                            }
                        }
                    }

                    if (node.parameters !== undefined) {
                        newState.parameters = node.parameters;
                    }

                    states.push(newState);
                }

                return states;
            }
            return state;

        }
    }
    ajs.Framework.viewComponentManager.registerComponents(AjsDocArticle);

}