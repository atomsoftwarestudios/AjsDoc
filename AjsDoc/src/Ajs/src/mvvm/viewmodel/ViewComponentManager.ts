/* *************************************************************************
The MIT License (MIT)
Copyright (c)2016-2017 Atom Software Studios. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to
deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.
**************************************************************************** */

namespace ajs.mvvm.viewmodel {

    "use strict";

    export class ViewComponentManager {

        protected _components: IRegisteredViewComponentsCollection;
        public get components(): IRegisteredViewComponentsCollection { return this._components; }

        protected _componentInstances: IInstancedViewComponentsCollection;

        public constructor() {
            this._components = {};
            this._componentInstances = {};
        }

        public registerComponents(...componentConstructor: typeof ViewComponent[]): void {
            for (let i: number = 0; i < componentConstructor.length; i++) {
                if (componentConstructor[i] instanceof Function) {
                    this._registerComponent(componentConstructor[i]);
                }
            }
        }

        protected _registerComponent(componentConstructor: typeof ViewComponent): void {
            if (componentConstructor instanceof Function) {
                let componentName: string = "";
                let parseName: string[] = /^function\s+([\w\$]+)\s*\(/.exec(componentConstructor.toString());
                componentName = parseName ? parseName[1] : "";
                componentName = componentName.toUpperCase();

                if (this._components[componentName] === undefined) {
                    this._components[componentName] = componentConstructor;
                }
            }
        }

        public getComponentConstructorByName(name: string): typeof ViewComponent {
            if (this._components.hasOwnProperty(name.toUpperCase())) {
                return this._components[name.toUpperCase()];
            }
            return null;
        }

        public isComponentConstructorRegistered(componentConstructor: typeof ViewComponent): boolean {
            for (var key in this._components) {
                if (this._components[key] === componentConstructor) {
                    return true;
                }
            }

            return false;
        }

        public registerComponentInstance(component: ViewComponent): void {
            this._componentInstances[component.ajsComponentId] = component;
        }

        public removeComponentInstance(component: ViewComponent): void {
            delete (this._componentInstances[component.ajsComponentId]);
        }

        public getComponentInstanceByComponentId(componentId: number): ViewComponent {
            if (this._componentInstances.hasOwnProperty(componentId.toString())) {
                return this._componentInstances[componentId];
            }
            return null;
        }

        public getComponentInstances(component: typeof ViewComponent, id?: string, userKey?: string): ViewComponent[] {

            let viewComponentInstances: ViewComponent[] = [];

            let componentConstructorName: string = ajs.utils.getFunctionName(component);

            for (var key in this._componentInstances) {
                if (this._componentInstances.hasOwnProperty(key)) {
                    let constructorName: string = ajs.utils.getClassName(this._componentInstances[key]);
                    if (constructorName === componentConstructorName) {
                        if (id) {
                            if (this._componentInstances[key].ajsid === id) {
                                if (userKey) {
                                    if (this._componentInstances[key].hasOwnProperty("key")) {
                                        if (this._componentInstances[key].key === userKey) {
                                            viewComponentInstances.push(this._componentInstances[key]);
                                        }
                                    }
                                } else {
                                    viewComponentInstances.push(this._componentInstances[key]);
                                }
                            }
                        } else {
                            viewComponentInstances.push(this._componentInstances[key]);
                        }
                    }
                }
            }

            return viewComponentInstances;
        }

        public getFirstComponentInstance<T extends ViewComponent>(component: typeof ViewComponent, id?: string, userKey?: string): T {

            let componentConstructorName: string = ajs.utils.getFunctionName(component);

            for (var key in this._componentInstances) {
                if (this._componentInstances.hasOwnProperty(key)) {
                    let constructorName: string = ajs.utils.getClassName(this._componentInstances[key]);
                    if (constructorName === componentConstructorName) {
                        if (id) {
                            if (this._componentInstances[key].ajsid === id) {
                                if (userKey) {
                                    if (this._componentInstances[key].hasOwnProperty("key")) {
                                        if (this._componentInstances[key].key === userKey) {
                                            return <T>this._componentInstances[key];
                                        }
                                    }
                                } else {
                                    return <T>this._componentInstances[key];
                                }
                            }
                        } else {
                            return <T>this._componentInstances[key];
                        }
                    }
                }
            }

            return null;
        }


    }

}