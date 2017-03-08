/* *************************************************************************
The MIT License (MIT)

Copyright (c) 2012 Nicholas Fisher

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

Source: https://github.com/KyleAMathews/deepmerge
**************************************************************************** */

namespace ajs.utils {

    "use strict";

    export interface IDeepMergeOptions {
        arrayMerge?: Function;
        clone?: boolean;
    }

    export class DeepMerge {

        protected static isMergeableObject(val): boolean {
            var nonNullObject: boolean = val && typeof val === "object";

            return nonNullObject
                && Object.prototype.toString.call(val) !== "[object RegExp]"
                && Object.prototype.toString.call(val) !== "[object Date]";
        }

        protected static emptyTarget(val): Array<any> | Object {
            return Array.isArray(val) ? [] : {};
        }

        protected static cloneIfNecessary(value: any, optionsArgument: IDeepMergeOptions): any {
            var clone: boolean = optionsArgument && optionsArgument.clone === true;
            return (clone && DeepMerge.isMergeableObject(value)) ?
                DeepMerge.merge(DeepMerge.emptyTarget(value), value, optionsArgument) : value;
        }

        protected static defaultArrayMerge(target: Array<any>, source: Array<any>, optionsArgument: any): any {
            var destination: Array<any> = target.slice();
            source.forEach(function (e, i) {
                if (typeof destination[i] === "undefined") {
                    destination[i] = DeepMerge.cloneIfNecessary(e, optionsArgument);
                } else if (DeepMerge.isMergeableObject(e)) {
                    destination[i] = DeepMerge.merge(target[i], e, optionsArgument);
                } else if (target.indexOf(e) === -1) {
                    destination.push(DeepMerge.cloneIfNecessary(e, optionsArgument));
                }
            });
            return destination;
        }

        protected static mergeObject(target, source, optionsArgument) {
            var destination = {};
            if (DeepMerge.isMergeableObject(target)) {
                Object.keys(target).forEach(function (key) {
                    destination[key] = DeepMerge.cloneIfNecessary(target[key], optionsArgument);
                });
            }
            Object.keys(source).forEach(function (key) {
                if (!DeepMerge.isMergeableObject(source[key]) || !target[key]) {
                    destination[key] = DeepMerge.cloneIfNecessary(source[key], optionsArgument);
                } else {
                    destination[key] = DeepMerge.merge(target[key], source[key], optionsArgument);
                }
            });
            return destination;
        }

        public static merge(target: any, source: any, optionsArgument?: IDeepMergeOptions): any {
            var array: boolean = Array.isArray(source);
            var options: any = optionsArgument || { arrayMerge: DeepMerge.defaultArrayMerge };
            var arrayMerge: any = options.arrayMerge || DeepMerge.defaultArrayMerge;

            if (array) {
                return Array.isArray(target) ?
                    arrayMerge(target, source, optionsArgument) : DeepMerge.cloneIfNecessary(source, optionsArgument);
            } else {
                return DeepMerge.mergeObject(target, source, optionsArgument);
            }
        }

    }

}