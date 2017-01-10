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

namespace ajs.mvvm.model {

    "use strict";

    export class ModelManager {

        protected _modelInstances: IInstancedModelsCollection;

        public constructor() {
            this._modelInstances = {};
        }

        protected _getModelName(modelConstructor: typeof Model): string {
            if (modelConstructor instanceof Function) {
                let modelName: string = "";
                let parseName: string[] = /^function\s+([\w\$]+)\s*\(/.exec(modelConstructor.toString());
                modelName = parseName ? parseName[1] : "";
                return modelName;
            } else {
                throw new ModelConstructorIsNotFunctionException();
            }
        }

        public getModelInstance(modelConstructor: typeof Model): Model {
            if (modelConstructor instanceof Function) {
                let modelName: string = this._getModelName(modelConstructor);
                if (this._modelInstances.hasOwnProperty(modelName)) {
                    this._modelInstances[modelName].referenceCount++;
                    return this._modelInstances[modelName].model;
                } else {
                    let model: Model = new modelConstructor(this);
                    this._modelInstances[modelName] = {
                        referenceCount: 1,
                        model: model
                    };
                    return model;
                }
            } else {
                throw new ModelConstructorIsNotFunctionException();
            }
        }

        public freeModelInstance(modelConstructor: typeof Model): void {
            if (modelConstructor instanceof Function) {
                let modelName: string = this._getModelName(modelConstructor);
                if (this._modelInstances.hasOwnProperty(modelName)) {
                    this._modelInstances[modelName].referenceCount--;
                    if (this._modelInstances[modelName].referenceCount === 0) {
                        delete this._modelInstances[modelName];
                    }
                }
            } else {
                throw new ModelConstructorIsNotFunctionException();
            }
        }

    }

}