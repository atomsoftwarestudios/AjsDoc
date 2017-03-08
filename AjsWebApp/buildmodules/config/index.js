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
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SolutionConfiguration;
(function (SolutionConfiguration) {
    SolutionConfiguration[SolutionConfiguration["Debug"] = 0] = "Debug";
    SolutionConfiguration[SolutionConfiguration["Release"] = 1] = "Release";
})(SolutionConfiguration = exports.SolutionConfiguration || (exports.SolutionConfiguration = {}));
var TargetWebServer;
(function (TargetWebServer) {
    TargetWebServer[TargetWebServer["IIS"] = 0] = "IIS";
})(TargetWebServer = exports.TargetWebServer || (exports.TargetWebServer = {}));
var GulpUglifyPreserveComments;
(function (GulpUglifyPreserveComments) {
    GulpUglifyPreserveComments[GulpUglifyPreserveComments["all"] = 0] = "all";
    GulpUglifyPreserveComments[GulpUglifyPreserveComments["license"] = 1] = "license";
    GulpUglifyPreserveComments[GulpUglifyPreserveComments["function"] = 2] = "function";
})(GulpUglifyPreserveComments = exports.GulpUglifyPreserveComments || (exports.GulpUglifyPreserveComments = {}));
function defaultConfig(solutionConfiguration) {
    "use strict";
    var baseConfig = {
        ignoredProjects: [],
        projectIgnore: false,
        jsSourceFolder: "/bin",
        wwwRootSourceFolder: "/wwwroot",
        targetWebServer: TargetWebServer.IIS,
        sourcesPath: "/src",
        enableSourceMaps: true,
        jsTargetFolder: "/js",
        jsCreateProjectFolder: false,
        offlineSupport: false,
        offlineFiles: [],
        processLESS: true,
        lessOptions: {},
        processSASS: true,
        sassOptions: {},
        jsMinify: false,
        jsMinifyOptions: {},
        cssMinify: false,
        cssMinifyOptions: {},
        htmlMinify: false,
        htmlMinifyOption: {}
    };
    if (solutionConfiguration === null) {
        return baseConfig;
    }
    else {
        if (solutionConfiguration === SolutionConfiguration.Debug) {
            return defaultConfigDebug(baseConfig);
        }
        else {
            return defaultConfigRelease(baseConfig);
        }
    }
}
exports.defaultConfig = defaultConfig;
function defaultConfigDebug(baseConfig) {
    "use strict";
    return baseConfig;
}
function defaultConfigRelease(baseConfig) {
    "use strict";
    baseConfig.enableSourceMaps = false;
    baseConfig.jsMinify = true;
    baseConfig.cssMinify = true;
    baseConfig.htmlMinify = true;
    return baseConfig;
}
function merge(solutionConfig, cfg1, cfg2) {
    "use strict";
    var cfg = defaultConfig(solutionConfig);
    cfg1 = cfg1 || defaultConfig(solutionConfig);
    cfg2 = cfg2 || defaultConfig(solutionConfig);
    for (var key in cfg1) {
        if (cfg1.hasOwnProperty(key)) {
            cfg[key] = cfg1[key];
        }
    }
    for (var key in cfg2) {
        if (cfg2.hasOwnProperty(key)) {
            cfg[key] = cfg2[key];
        }
    }
    return cfg;
}
exports.merge = merge;
