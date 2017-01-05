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

namespace ajs.utils {

    "use strict";

    export function defined(object: any): boolean {
        return object !== undefined;
    }

    export function isNull(object: any): boolean {
        return object == null;
    }

    export function definedAndNotNull(object: any): boolean {
        return object !== undefined && object != null;
    }

    export function getClassName(obj: Object): string {
        if (obj && obj.constructor && obj.constructor.toString) {
            var arr: RegExpMatchArray = obj.constructor.toString().match(/function\s*(\w+)/);
            if (arr && arr.length === 2) {
                return arr[1];
            }
        }

        return undefined;
    }

    export function minDate(): Date {
        return new Date(0);
    }

    export function maxDate(): Date {
        return new Date(8640000000000000);
    }

    export function sizeOf(object: Object): number {

        let objects: Object[] = [object];
        let size: number = 0;

        // loop over the objects
        for (let i: number = 0; i < objects.length; i++) {

            // determine the type of the object
            switch (typeof objects[i]) {

                // the object is a boolean
                case "boolean":
                    size += 4;
                    break;

                // the object is a number
                case "number":
                    size += 8;
                    break;

                // the object is a string
                case "string":
                    size += 2 * (objects[i] as string).length;
                    break;

                // the object is a generic object
                case "object":

                    // if the object is not an array, add the sizes of the keys
                    if (Object.prototype.toString.call(objects[i]) !== "[object Array]") {
                        for (var key in objects[i]) {
                            if (object[key] !== undefined) {
                                size += 2 * key.length;
                            }
                        }
                    }

                    // loop over the keys
                    for (var key in objects[i]) {
                        if (objects[i][key] !== undefined) {
                            // determine whether the value has already been processed
                            let processed: boolean = false;
                            for (let j: number = 0; j < objects.length; j++) {
                                if (objects[j] === objects[j][key]) {
                                    processed = true;
                                    break;
                                }
                            }
                            // queue the value to be processed if appropriate
                            if (!processed) {
                                objects.push(objects[i][key]);
                            }
                        }
                    }

            }

        }

        // return the calculated size
        return size;
    }



}