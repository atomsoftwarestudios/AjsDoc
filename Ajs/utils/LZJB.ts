/* *************************************************************************
$Id: Iuppiter.js 3026 2010-06-23 10:03:13Z Bear $

Copyright (c) 2010 Nuwa Information Co., Ltd, and individual contributors.
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

  1. Redistributions of source code must retain the above copyright notice,
     this list of conditions and the following disclaimer.

  2. Redistributions in binary form must reproduce the above copyright
     notice, this list of conditions and the following disclaimer in the
     documentation and/or other materials provided with the distribution.

  3. Neither the name of Nuwa Information nor the names of its contributors
     may be used to endorse or promote products derived from this software
     without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

$Author: Bear $
$Date: 2010-06-23 18:03:13 +0800 (星期三, 23 六月 2010) $
$Revision: 3026 $

Source: https://github.com/vitorio/jslzjb/blob/master/Iuppiter.js
**************************************************************************** */


namespace ajs.utils {

    "use strict";

    class LZJB {

        protected static NBBY = 8;
        protected static MATCH_BITS = 6;
        protected static MATCH_MIN = 3;
        protected static MATCH_MAX = 0;
        protected static OFFSET_MASK = 0;
        protected static LEMPEL_SIZE = 256;

        protected static init() {
            this.MATCH_MAX = ((1 << this.MATCH_BITS) + (this.MATCH_MIN - 1));
            this.OFFSET_MASK = ((1 << (16 - this.MATCH_BITS)) - 1);
        }

        /**
         * Convert string value to a byte array.
         *
         * @param {String} input The input string value.
         * @return {Array} A byte array from string value.
         */
        public static toByteArray(input: string) {
            var b = [], i, unicode;
            for (i = 0; i < input.length; i++) {
                unicode = input.charCodeAt(i);
                // 0x00000000 - 0x0000007f -> 0xxxxxxx
                if (unicode <= 0x7f) {
                    b.push(unicode);
                    // 0x00000080 - 0x000007ff -> 110xxxxx 10xxxxxx
                } else if (unicode <= 0x7ff) {
                    b.push((unicode >> 6) | 0xc0);
                    b.push((unicode & 0x3F) | 0x80);
                    // 0x00000800 - 0x0000ffff -> 1110xxxx 10xxxxxx 10xxxxxx
                } else if (unicode <= 0xffff) {
                    b.push((unicode >> 12) | 0xe0);
                    b.push(((unicode >> 6) & 0x3f) | 0x80);
                    b.push((unicode & 0x3f) | 0x80);
                    // 0x00010000 - 0x001fffff -> 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
                } else {
                    b.push((unicode >> 18) | 0xf0);
                    b.push(((unicode >> 12) & 0x3f) | 0x80);
                    b.push(((unicode >> 6) & 0x3f) | 0x80);
                    b.push((unicode & 0x3f) | 0x80);
                }
            }

            return b;
        }

        /**
         * Compress string or byte array using fast and efficient algorithm.
         *
         * Because of weak of javascript's natural, many compression algorithm
         * become useless in javascript implementation. The main problem is
         * performance, even the simple Huffman, LZ77/78 algorithm will take many
         * many time to operate. We use LZJB algorithm to do that, it suprisingly
         * fulfills our requirement to compress string fastly and efficiently.
         *
         * Our implementation is based on
         * http://src.opensolaris.org/source/raw/onnv/onnv-gate/
         * usr/src/uts/common/os/compress.c
         * It is licensed under CDDL.
         *
         * Please note it depends on toByteArray utility function.
         *
         * @param {String|Array} input The string or byte array that you want to
         *                             compress.
         * @return {Array} Compressed byte array.
         */
        public static compress(input) {
            var sstart, dstart = [], slen,
                src = 0, dst = 0,
                cpy, copymap,
                copymask = 1 << (this.NBBY - 1),
                mlen, offset,
                hp,
                lempel = new Array(this.LEMPEL_SIZE),
                i, bytes;

            this.init();

            // initialize lempel array.
            for (i = 0; i < this.LEMPEL_SIZE; i++)
                lempel[i] = 3435973836;

            // using byte array or not.
            if (input.constructor === Array) {
                sstart = input;
                bytes = true;
            } else {
                sstart = this.toByteArray(input);
                bytes = false;
            }

            slen = sstart.length;

            while (src < slen) {
                if ((copymask <<= 1) === (1 << this.NBBY)) {
                    if (dst >= slen - 1 - 2 * this.NBBY) {
                        mlen = slen;
                        for (src = 0, dst = 0; mlen; mlen--)
                            dstart[dst++] = sstart[src++];
                        return dstart;
                    }
                    copymask = 1;
                    copymap = dst;
                    dstart[dst++] = 0;
                }
                if (src > slen - this.MATCH_MAX) {
                    dstart[dst++] = sstart[src++];
                    continue;
                }
                hp = ((sstart[src] + 13) ^
                    (sstart[src + 1] - 13) ^
                    sstart[src + 2]) &
                    (this.LEMPEL_SIZE - 1);
                offset = (src - lempel[hp]) & this.OFFSET_MASK;
                lempel[hp] = src;
                cpy = src - offset;
                if (cpy >= 0 && cpy !== src &&
                    sstart[src] === sstart[cpy] &&
                    sstart[src + 1] === sstart[cpy + 1] &&
                    sstart[src + 2] === sstart[cpy + 2]) {
                    dstart[copymap] |= copymask;
                    for (mlen = this.MATCH_MIN; mlen < this.MATCH_MAX; mlen++)
                        if (sstart[src + mlen] !== sstart[cpy + mlen]) {
                            break;
                        }
                    dstart[dst++] = ((mlen - this.MATCH_MIN) << (this.NBBY - this.MATCH_BITS)) |
                        (offset >> this.NBBY);
                    dstart[dst++] = offset;
                    src += mlen;
                } else {
                    dstart[dst++] = sstart[src++];
                }
            }

            return dstart;
        };

        /**
         * Decompress string or byte array using fast and efficient algorithm.
         *
         * Our implementation is based on
         * http://src.opensolaris.org/source/raw/onnv/onnv-gate/
         * usr/src/uts/common/os/compress.c
         * It is licensed under CDDL.
         *
         * Please note it depends on toByteArray utility function.
         *
         * @param {String|Array} input The string or byte array that you want to
         *                             compress.
         * @param {Boolean} _bytes Returns byte array if true otherwise string.
         * @return {String|Array} Decompressed string or byte array.
         */
        public static decompress = function (input, _bytes) {
            var sstart, dstart = [], slen,
                src = 0, dst = 0,
                cpy, copymap,
                copymask = 1 << (this.NBBY - 1),
                mlen, offset,
                i, bytes, get;

            this.init();

            // using byte array or not.
            if (input.constructor === Array) {
                sstart = input;
                bytes = true;
            } else {
                sstart = this.toByteArray(input);
                bytes = false;
            }

            // default output string result.
            if (typeof (_bytes) === undefined) {
                bytes = false;
            } else {
                bytes = _bytes;
            }

            slen = sstart.length;

            get = function(): any {
                if (bytes) {
                    return dstart;
                } else {
                    // decompressed string.
                    for (i = 0; i < dst; i++)
                        dstart[i] = String.fromCharCode(dstart[i]);

                    return dstart.join("")
                }
            };

            while (src < slen) {
                if ((copymask <<= 1) === (1 << this.NBBY)) {
                    copymask = 1;
                    copymap = sstart[src++];
                }
                if (copymap & copymask) {
                    mlen = (sstart[src] >> (this.NBBY - this.MATCH_BITS)) + this.MATCH_MIN;
                    offset = ((sstart[src] << this.NBBY) | sstart[src + 1]) & this.OFFSET_MASK;
                    src += 2;
                    if ((cpy = dst - offset) >= 0) {
                        while (--mlen >= 0) {
                            dstart[dst++] = dstart[cpy++];
                        }
                    } else {
                        /*
                         * offset before start of destination buffer
                         * indicates corrupt source data
                         */
                        return get();
                    }
                } else {
                    dstart[dst++] = sstart[src++];
                }
            }

            return get();
    }

}


};