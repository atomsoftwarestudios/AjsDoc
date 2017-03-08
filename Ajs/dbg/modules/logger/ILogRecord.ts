    /*! ************************************************************************
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

namespace ajs.dbg.modules.logger {

    "use strict";

    /** Single log record data */
    export interface ILogRecord {
        /** Identifier of the same type log records computed as type + level + module + object + function */
        sameTypeId: string;
        /** Time/date of the log record creation */
        time: Date;
        /** Number of occurence of the same type of the log records from the log beginning */
        occurence: number;
        /** Type of the log record #see {ajs.debug.LogType} */
        type: dbg.LogType;
        /** Level (importance) of the log record */
        level: number;
        /** Module creating the log record */
        module: string;
        /** Object (class) creating the log record */
        object: any;
        /** Function creating the log record */
        function: string;
        /** Caller of the function creating the log lecord */
        caller: string;
        /** Message to be displayed */
        message: string;
        /** Number of the data passed to logger function and eventually logged to the console */
        data: number;
        /** Internally indicates if the log record is marked as breakpoint */
        breakpoint: boolean;
    }

}