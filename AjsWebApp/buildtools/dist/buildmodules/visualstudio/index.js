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
var fs = require("fs");
var path = require("path");
var index_1 = require("../output/index");
var config = require("../config/index");
var solutionInfoFile = "./buildtools/solutionInfo.json";
/**
 * Returns information about the Visual Studio solution including all projects
 */
function getSolution() {
    "use strict";
    if (fs.existsSync(path.normalize(solutionInfoFile))) {
        try {
            // prepare solution info object
            var solution = {
                solutionInfo: null,
                projects: []
            };
            // load automatically generated solutionInfo.json file
            var si = fs.readFileSync(path.normalize(solutionInfoFile), "ASCII");
            // remove comments
            si = si.replace(/\"comment.*\,/g, "");
            si = si.replace(/\"comment.*\,/g, "");
            // parse solutionInfo.json
            solution.solutionInfo = JSON.parse(si);
            // load a solution file and get the solutioon projects
            solution.projects = getSolutionProjects(solution.solutionInfo);
            return solution;
        }
        catch (e) {
            index_1.printf("Reading the solution information failed: " + e);
            return null;
        }
    }
    else {
        return null;
    }
}
exports.getSolution = getSolution;
/**
 * return solution configuration enum (Debug/Release)
 * @param solutionData configuration enum (Debug/Release)
 */
function getSolutionConfiguration(solutionData) {
    "use strict";
    switch (solutionData.solutionInfo.configurationName) {
        case "Debug":
            return config.SolutionConfiguration.Debug;
        case "Release":
            return config.SolutionConfiguration.Release;
        default:
            throw new Error("Invalid configuration name '" + solutionData.solutionInfo.configurationName + "'");
    }
}
exports.getSolutionConfiguration = getSolutionConfiguration;
/**
 * Loads the solution information including info about all projects contained
 * @param solutionInfo Automatically generated file with information about the solution and its type
 */
function getSolutionProjects(solutionInfo) {
    "use strict";
    // load .sln
    var ss = fs.readFileSync(solutionInfo.solutionPath, "ASCII");
    // get all project - endproject section
    var pa = ss.match(/project([\s\S]*?)endproject/igm);
    // prepare project info structure
    var projectInfo = [];
    // for all projects load the info and store to array
    for (var i = 0; i < pa.length; i++) {
        // split by = to get Project("GUID") and comma separated info.
        var p1 = pa[i].split("=");
        // filter out next line (EndProject)
        var p2 = p1[1].split("\n");
        // split by , to get project name, project relative path and project GUID
        var p3 = p2[0].split(",");
        // get project data (p3[0] = project name, p3[1] = project relative path)
        projectInfo.push(getProjectInfo(p3[0].trim().replace(/"/g, ""), solutionInfo.solutionDir + p3[1].trim().replace(/"/g, "")));
    }
    return projectInfo;
}
/**
 * Loads information about a project
 * @param name Name of the project (comes from the solution)
 * @param path Path to the project file (comes from the solution)
 */
function getProjectInfo(name, path) {
    "use strict";
    // load the project file
    var pr = fs.readFileSync(path, "ASCII");
    // filter out just the <OutputPath>...</OutputPath>
    var pre = /\<outputpath>([\s\S]*?)\<\/outputpath\>/gmi.exec(pr);
    // prepare values to be returned
    var projDir = path.substr(0, path.lastIndexOf("\\") + 1);
    var projFn = path.substr(path.lastIndexOf("\\") + 1);
    var projOut = projDir + pre[1];
    // fill the project info
    var pi = {
        projectName: name,
        projectPath: path,
        projectDir: projDir,
        projectFileName: projFn,
        projectOutput: projOut,
        ajsWebAppConfig: getAjsWebAppConfig(null, projDir),
        ajsWebAppConfigDebug: getAjsWebAppConfig(config.SolutionConfiguration.Debug, projDir),
        ajsWebAppConfigRelease: getAjsWebAppConfig(config.SolutionConfiguration.Release, projDir)
    };
    return pi;
}
/**
 * Gets AjsWebApp configuration for the particular project (if exists) or return default
 */
function getAjsWebAppConfig(solutionConfig, projPath) {
    "use strict";
    var fileName = "AjsWebApp.";
    if (solutionConfig === null) {
        fileName += "json";
    }
    else {
        fileName += config.SolutionConfiguration[solutionConfig] + ".json";
    }
    if (fs.existsSync(projPath + fileName)) {
        try {
            var awc = fs.readFileSync(projPath + fileName, "ASCII");
            return JSON.parse(awc);
        }
        catch (e) {
            index_1.printf("Failed to parse the JSON config: %1", projPath + fileName);
            throw e;
        }
    }
    else {
        return null;
    }
}
