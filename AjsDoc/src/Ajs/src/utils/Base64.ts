/* *************************************************************************
The MIT License (MIT)

Copyright(c) 2014

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and / or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

Source: https://github.com/beatgammit/base64-js
**************************************************************************** */

namespace ajs.utils {

    "use strict";

    export class Base64 {

        protected static _lookup = [];
        protected static _revLookup = [];
        protected static _arr: any = typeof Uint8Array !== "undefined" ? Uint8Array : Array;

        public static init(): void {
            var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
            for (var i = 0, len = code.length; i < len; ++i) {
                Base64._lookup[i] = code[i]
                Base64._revLookup[code.charCodeAt(i)] = i
            }

            Base64._revLookup["-".charCodeAt(0)] = 62
            Base64._revLookup["_".charCodeAt(0)] = 63
        }

        public static toByteArray(b64: string) {
            var i, j, l, tmp, placeHolders, arr
            var len = b64.length

            if (len % 4 > 0) {
                throw new Error("Invalid string. Length must be a multiple of 4")
            }

            placeHolders = b64[len - 2] === "=" ? 2 : b64[len - 1] === "=" ? 1 : 0

            arr = new Base64._arr(len * 3 / 4 - placeHolders)

            l = placeHolders > 0 ? len - 4 : len

            var L = 0

            for (i = 0, j = 0; i < l; i += 4, j += 3) {
                tmp = (Base64._revLookup[b64.charCodeAt(i)] << 18) | (Base64._revLookup[b64.charCodeAt(i + 1)] << 12) | (Base64._revLookup[b64.charCodeAt(i + 2)] << 6) | Base64._revLookup[b64.charCodeAt(i + 3)]
                arr[L++] = (tmp >> 16) & 0xFF
                arr[L++] = (tmp >> 8) & 0xFF
                arr[L++] = tmp & 0xFF
            }

            if (placeHolders === 2) {
                tmp = (Base64._revLookup[b64.charCodeAt(i)] << 2) | (Base64._revLookup[b64.charCodeAt(i + 1)] >> 4)
                arr[L++] = tmp & 0xFF
            } else if (placeHolders === 1) {
                tmp = (Base64._revLookup[b64.charCodeAt(i)] << 10) | (Base64._revLookup[b64.charCodeAt(i + 1)] << 4) | (Base64._revLookup[b64.charCodeAt(i + 2)] >> 2)
                arr[L++] = (tmp >> 8) & 0xFF
                arr[L++] = tmp & 0xFF
            }

            return arr
        }

        protected static _tripletToBase64(num) {
            return Base64._lookup[num >> 18 & 0x3F] + Base64._lookup[num >> 12 & 0x3F] + Base64._lookup[num >> 6 & 0x3F] + Base64._lookup[num & 0x3F]
        }

        protected static _encodeChunk(uint8, start, end) {
            var tmp
            var output = []
            for (var i = start; i < end; i += 3) {
                tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
                output.push(Base64._tripletToBase64(tmp))
            }
            return output.join("")
        }

        public static fromByteArray(uint8) {
            var tmp
            var len = uint8.length
            var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
            var output = ""
            var parts = []
            var maxChunkLength = 16383 // must be multiple of 3

            // go through the array every three bytes, we'll deal with trailing stuff later
            for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
                parts.push(Base64._encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
            }

            // pad the end with zeros, but make sure to not forget the extra bytes
            if (extraBytes === 1) {
                tmp = uint8[len - 1]
                output += Base64._lookup[tmp >> 2]
                output += Base64._lookup[(tmp << 4) & 0x3F]
                output += "=="
            } else if (extraBytes === 2) {
                tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
                output += Base64._lookup[tmp >> 10]
                output += Base64._lookup[(tmp >> 4) & 0x3F]
                output += Base64._lookup[(tmp << 2) & 0x3F]
                output += "="
            }

            parts.push(output)

            return parts.join("")
        }
    }

    Base64.init();
}