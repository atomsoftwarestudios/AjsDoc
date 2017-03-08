/* *************************************************************************
The MIT License (MIT)
Copyright (c)2016-2017 Atom Software Studios. All rights reserved.

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

namespace ajs.utils {

    "use strict";

    /**
     * Helper to determine if variable is defined
     * @param object Object to be checked
     */
    export function defined(object: any): boolean {
        return object !== undefined;
    }

    /**
     * Helper to determine if the variable is null
     * @param object Object to be checked
     */
    export function isNull(object: any): boolean {
        return object === null;
    }

    /**
     * Helper to determine if the variable defined and not null
     * @param object Object to be checked
     */
    export function definedAndNotNull(object: any): boolean {
        return object !== undefined && object !== null;
    }

    /**
     * Returns name of the constructor of the object
     * @param obj Object to be checked
     */
    export function getClassName(obj: Object): string {
        if (obj && obj.constructor && obj.constructor.toString) {
            var arr: RegExpMatchArray = obj.constructor.toString().match(/function\s*(\w+)/);
            if (arr && arr.length === 2) {
                return arr[1];
            }
        }

        return undefined;
    }

    /**
     * Returns name of the function
     * @param fn Function which name has to be returned
     */
    export function getFunctionName(fn: Function): string {
        if (fn instanceof Function) {
            let name: RegExpExecArray = /^function\s+([\w\$]+)\s*\(/.exec(fn.toString());
            if (name && name.length === 2) {
                return name[1];
            }
        }
        return undefined;
    }

    /**
     * Returns the minimum usefull date (Thu Jan 01 1970 01:00:00 GMT+0100)
     */
    export function minDate(): Date {
        return new Date(0);
    }

    /**
     * Returns the maximum date (Sat Sep 13 275760 02:00:00 GMT+0200)
     */
    export function maxDate(): Date {
        return new Date(8640000000000000);
    }


    export function ie10UTCDate(date: Date): string {
        let utc: string = date.toUTCString().replace("UTC", "GMT");
        let parts: string[] = utc.split(" ");
        if (parts[1].length === 1) {
            parts[1] = "0" + parts[1];
        }
        return parts.join(" ");
    };


    /**
     * Measures the deep size of object. Levels to be measured could be limited
     * @param object Object to be measured
     * @param levels Number of children objects to measure
     * @param level Current level used internally by the function
     */
    export function sizeOf(object: any, levels?: number, level?: number): number {

        let size: number = 0;
        levels = levels || -1;
        level = level || 0;

        if (levels !== -1 && level > levels) {
            return 0;
        }

        // determine the type of the object
        switch (typeof (object)) {

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
                size += 2 * (object as string).length;
                break;

            case "object":

                // type Int8Array
                if (object instanceof Int8Array) {
                    size += object.byteLength;
                } else {

                // type Int16Array
                if (object instanceof Int16Array) {
                    size += object.byteLength;
                } else {

                // type Int32Array
                if (object instanceof Int32Array) {
                    size += object.byteLength;
                } else {

                // type common Array
                if (object instanceof Array) {
                    for (let i: number = 0; i < object.length; i++) {
                        size += sizeOf(object[i], levels, level + 1);
                    }
                } else {

                // type Date
                if (object instanceof Array) {
                    size += 8;
                } else {

                    // type common Object but not function
                    if (!(object instanceof Function)) {
                        for (var key in object) {
                            if (object.hasOwnProperty(key)) {
                                size += sizeOf(object[key], levels, level);
                            }
                        }
                    }
                }

                }}}}

        }

        return size;

    }

    /**
     * Escapes string to be usable in the regullar expression
     * @param str String to be escaped
     */
    export function escapeRegExp(str: string): string {
        return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    }

    /**
     * Replaces all occurences of the searchValue by replaceValue in str
     * @param str String to be searched for occurences of searchValue and replaced with replaceValue
     * @param searchValue Value to be replaced
     * @param replaceValue Value to be used as replacement
     */
    export function replaceAll(str: string, searchValue: string, replaceValue: string): string {
        return str.replace(new RegExp(escapeRegExp(searchValue), "g"), replaceValue);
    }

}