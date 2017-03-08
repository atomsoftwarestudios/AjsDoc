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

import fs = require("fs");
import path = require("path");

import { printf } from "../output/index";
import * as config from "../config/index";

const solutionInfoFile: string = "./buildtools/solutionInfo.json";

/**
 * Holds information about the solution and its configuration
 * Loaded from automatically generated JSON file (see AjsWebApp -> properties -> Build events) for details
 */
export interface ISolutionInfo {
    solutionName: string;
    solutionPath: string;
    solutionDir: string;
    solutionFileName: string;
    platformName: string;
    configurationName: string;
    ajsWebAppProject: string;
}

/**
 * Holds information about the Visual Studio project file
 */
export interface IProjectInfo {
    projectName: string;
    projectPath: string;
    projectDir: string;
    projectFileName: string;
    projectOutput: string;
    ajsWebAppConfig: config.IAjsWebAppConfig;
    ajsWebAppConfigDebug: config.IAjsWebAppConfig;
    ajsWebAppConfigRelease: config.IAjsWebAppConfig;
}

/**
 * Holds information about the Visual Studio solution including all projects
 */
export interface ISolution {
    solutionInfo: ISolutionInfo;
    projects: IProjectInfo[];
}

/**
 * Returns information about the Visual Studio solution including all projects
 */
export function getSolution(): ISolution {

    "use strict";

    if (fs.existsSync(path.normalize(solutionInfoFile))) {

        try {

            // prepare solution info object
            let solution: ISolution = {
                solutionInfo: null,
                projects: []
            };

            // load automatically generated solutionInfo.json file
            let si: string = fs.readFileSync(path.normalize(solutionInfoFile), "ASCII");

            // remove comments
            si = si.replace(/\"comment.*\,/g, "");
            si = si.replace(/\"comment.*\,/g, "");

            // parse solutionInfo.json
            solution.solutionInfo = JSON.parse(si);

            // load a solution file and get the solutioon projects
            solution.projects = getSolutionProjects(solution.solutionInfo);

            return solution;

        } catch (e) {

            printf("Reading the solution information failed: " + e);
            return null;

        }

    } else {

        return null;

    }

}

/**
 * return solution configuration enum (Debug/Release)
 * @param solutionData configuration enum (Debug/Release)
 */
export function getSolutionConfiguration(solutionData: ISolution): config.SolutionConfiguration {

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

/**
 * Loads the solution information including info about all projects contained
 * @param solutionInfo Automatically generated file with information about the solution and its type
 */
function getSolutionProjects(solutionInfo: ISolutionInfo): IProjectInfo[] {

    "use strict";

    // load .sln
    let ss: string = fs.readFileSync(solutionInfo.solutionPath, "ASCII");

    // get all project - endproject section
    let pa: RegExpMatchArray = ss.match(/project([\s\S]*?)endproject/igm);

    // prepare project info structure
    let projectInfo: IProjectInfo[] = [];

    // for all projects load the info and store to array
    for (let i: number = 0; i < pa.length; i++) {

        // split by = to get Project("GUID") and comma separated info.
        let p1: string[] = pa[i].split("=");

        // filter out next line (EndProject)
        let p2: string[] = p1[1].split("\n");

        // split by , to get project name, project relative path and project GUID
        let p3: string[] = p2[0].split(",");

        // get project data (p3[0] = project name, p3[1] = project relative path)
        projectInfo.push(
            getProjectInfo(
                p3[0].trim().replace(/"/g, ""),
                solutionInfo.solutionDir + p3[1].trim().replace(/"/g, "")
            )
        );

    }

    return projectInfo;
}

/**
 * Loads information about a project
 * @param name Name of the project (comes from the solution)
 * @param path Path to the project file (comes from the solution)
 */
function getProjectInfo(name: string, path: string): IProjectInfo {

    "use strict";

    // load the project file
    let pr: string = fs.readFileSync(path, "ASCII");

    // filter out just the <OutputPath>...</OutputPath>
    let pre: RegExpExecArray = /\<outputpath>([\s\S]*?)\<\/outputpath\>/gmi.exec(pr);

    // prepare values to be returned
    let projDir: string = path.substr(0, path.lastIndexOf("\\") + 1);
    let projFn: string = path.substr(path.lastIndexOf("\\") + 1);
    let projOut: string = projDir + pre[1];

    // fill the project info
    let pi: IProjectInfo = {
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
function getAjsWebAppConfig(solutionConfig: config.SolutionConfiguration, projPath: string): config.IAjsWebAppConfig {

    "use strict";

    let fileName: string = "AjsWebApp.";

    if (solutionConfig === null) {
        fileName += "json";
    } else {
        fileName += config.SolutionConfiguration[solutionConfig] + ".json";
    }


    if (fs.existsSync(projPath + fileName)) {

        try {
            let awc: string = fs.readFileSync(projPath + fileName, "ASCII");
            return JSON.parse(awc) as config.IAjsWebAppConfig;
        } catch (e) {
            printf("Failed to parse the JSON config: %1", projPath + fileName);
            throw e;
        }

    } else {
        return null;
    }

}
