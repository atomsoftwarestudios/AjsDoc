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

import nodepath = require("path");
import fs = require("fs");

export function dir(path: string): string[] {

    "use strict";

    let dirFiles: string[] = readDirsRecursive(path);
    return dirFiles;

}

function readDirsRecursive(path: string, dirFiles?: string[]): string[] {

    "use strict";

    let ps: string = (process.platform === "win32" ? "\\" : "/");

    if (!(dirFiles instanceof Array)) {
        dirFiles = [];
    }

    let files: string[] = fs.readdirSync(path);

    for (let i: number = 0; i < files.length; i++) {
        dirFiles.push(nodepath.normalize(path + ps + files[i]));

        let stats: fs.Stats = fs.statSync(nodepath.normalize(path + ps + files[i]));
        if (stats.isDirectory()) {
            readDirsRecursive(nodepath.normalize(path + ps + files[i]), dirFiles);
        }
    }

    return dirFiles;

}

export function rmdir(path: string): void {

    "use strict";

    var stat: fs.Stats = fs.statSync(path);

    if (stat.isDirectory()) {

        var files: string[] = fs.readdirSync(path);
        for (let i: number = 0; i < files.length; i++) {

            var file: string = nodepath.normalize(path + "/" + files[i]);
            var stat: fs.Stats = fs.statSync(file);


            if (stat.isDirectory()) {
                console.log("removing dir " + file);
                rmdir(file);
            } else {
                fs.unlinkSync(file);
            }
        }

        fs.rmdirSync(path);
    }

}
