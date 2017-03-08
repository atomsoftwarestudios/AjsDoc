/// <binding Clean='clean' ProjectOpened='projectOpen' />
/*
The MIT License (MIT)
Copyright (c)2017 Atom Software Studios. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

------------------------------------------------------------------------------------

Build tasks should be configured using the AjsWebApp.json instead of changing the
gulpfile. See README.MD for details.

Based on the build action, solution configuration and the AjsWebApp.json configuration
the gulp script copies/processes/updates/cleans the target application files and
prepares the application for debugging or publishing.

Currently supported actions are:

- applicationhost.config modification to support sources & debugging
- Copying / processing of all js files (including map files) in solution output folder
- Copying / processing of all web resources placed in the wwwroot folder in any project

Processing includes:
- HTML minification
- LESS compilation
- CSS minification
- Offline application support (cache manifest generation)

------------------------------------------------------------------------------------
*/

// ************************ initialization & configuration *************************

/** Configurable name of the Ajs Web Application project configuration file */
// const ajsAppCfgName: string = "AjsWebApp.json";

// node modules

import path = require("path");
import fs = require("fs-extra");
import ps = require("ps-sync");
import xml2js = require("xml2js");
import crypto = require("crypto");

// node - gulp modules

import gulp = require("gulp");
import uglify = require("gulp-uglify");

// build tools modules (not in npm)

import { printf } from "./buildmodules/output/index";
import { dir } from "./buildmodules/filesystem/index";
import { rmdir } from "./buildmodules/filesystem/index";
import cfg = require("./buildmodules/config/index");
import vs = require("./buildmodules/visualstudio/index");

// ********************************* basic output **********************************

/** Prints the copyright to the stdout */
function copyright(): void {

    "use strict";

    printf();
    printf("Ajs Application Packager for Visual Studio & Gulp");
    printf("Copyright (c)2017 Atom Software Studios, All rights reserved");
    printf("Released under the MIT license");
    printf();
}

/** Prints usage - called only from gulp.default task */
function usage(): void {

    "use strict";

    /* tslint:disable */
    printf("This gulp build file is suposed to be used from the Visual Studio (from Task Runner Explorer) with build events it generates");
    /* tslint:enable */
}

/**
 * Prints information about the solution
 */
function printSolutionInfo(solution: vs.ISolution): void {

    "use strict";

    printf("Solution info:");
    printf("--------------");
    printf("Solution name:          %1", solution.solutionInfo.solutionName);
    printf("Solution path:          %1", solution.solutionInfo.solutionPath);
    printf("Solution dir:           %1", solution.solutionInfo.solutionDir);
    printf("Solution file name:     %1", solution.solutionInfo.solutionFileName);
    printf("Platform name:          %1", solution.solutionInfo.platformName);
    printf("Configuration name:     %1", solution.solutionInfo.configurationName);
    printf("AjsWebApp project name: %1", solution.solutionInfo.ajsWebAppProject);
    printf();
}

// ********************************* Helpers ****************************************

/**
 * copies file if newer
 * @param src path to source file
 * @param dst path to destination file
 */
function copyIfNewer(src: string, dst: string): void {

    "use strict";

    let statSrc: fs.Stats;
    let statDst: fs.Stats;

    // copy only if source file exists
    if (fs.existsSync(src)) {
        statSrc = fs.statSync(src);
    } else {
        return;
    }

    // check if dst file exists and copy always if not
    if (fs.existsSync(dst)) {
        statDst = fs.statSync(dst);
    } else {
        printf("copying %1 %2", src, dst);
        fs.copySync(src, dst);
        fs.utimesSync(dst, statSrc.atime, statSrc.mtime);
        return;
    }

    // get modification date of both files
    let dmsrc: number = Math.floor(statSrc.mtime.getTime() / 1000);
    let dmdst: number = Math.floor(statDst.mtime.getTime() / 1000);

    // copy if newer
    if (dmsrc > dmdst) {
        printf("copying %1 %2", src, dst);
        fs.copySync(src, dst);
        fs.utimesSync(dst, statSrc.atime, statSrc.mtime);
    }
}

/**
 * returns the project data from the solution
 * @param projectName name of the project to be returned
 * @param solutionData solution data readed from .sln
 * @return information about the project including all configurations available
 */
function getProject(projectName: string, solutionData: vs.ISolution): vs.IProjectInfo {

    "use strict";

    // find the poject with the given name
    let project: vs.IProjectInfo = null;
    for (let i: number = 0; i < solutionData.projects.length; i++) {
        if (solutionData.projects[i].projectName === projectName) {
            project = solutionData.projects[i];
            break;
        }
    }

    return project;
}

/**
 * get configuration for project with given name and given solution configuration (Debug/Release)
 * @param projectName project name
 * @param ajsWebAppConfig default configuration taken from the AjsWebApp project
 * @param solutionData solution data readed from .sln
 * @return merged configuration (ajsWebAppConfig + project default config + project(solutionConfiguration) config)
 */
function getProjectConfig(projectName: string, ajsWebAppConfig: cfg.IAjsWebAppConfig, solutionData: vs.ISolution): cfg.IAjsWebAppConfig {

    "use strict";

    // find the poject with the given name
    let project: vs.IProjectInfo = getProject(projectName, solutionData);

    // throw exception if project not found
    if (project === null) {
        throw new Error("Invalid project name '" + projectName + "'. Project not fount in the current solution!");
    }

    // get config for project (merge AjsWebApp config with project config)
    printf("Getting config for: %1 (%2)", projectName, solutionData.solutionInfo.configurationName);

    let pcfg: cfg.IAjsWebAppConfig = null;

    if (project.ajsWebAppConfig) {
        pcfg = cfg.merge(vs.getSolutionConfiguration(solutionData), ajsWebAppConfig, project.ajsWebAppConfig);
    }

    if (project.ajsWebAppConfigDebug && solutionData.solutionInfo.configurationName === "Debug") {
        pcfg = cfg.merge(vs.getSolutionConfiguration(solutionData), pcfg, project.ajsWebAppConfigDebug);
    }

    if (project.ajsWebAppConfigRelease && solutionData.solutionInfo.configurationName === "Release") {
        pcfg = cfg.merge(vs.getSolutionConfiguration(solutionData), pcfg, project.ajsWebAppConfigRelease);
    }

    if (pcfg === null) {
        printf("Project has no config defined, using the AjsWebApp config");
        pcfg = cfg.merge(vs.getSolutionConfiguration(solutionData), {}, ajsWebAppConfig);
        pcfg.projectIgnore = false;
    }

    return pcfg;
}

/**
 * collect .js files to be processed
 * @param srcPath path to folder to be searched for .js and .js.map files
 * @return .js files
 */
function collectSrcJsFiles(srcPath: string): string[] {

    "use strict";

    let js: string[] = [];

    // collect all files in srcPath
    let files: string[] = dir(srcPath);

    // add js files to array
    for (let i: number = 0; i < files.length; i++) {
        if (path.extname(files[i]) === ".js") {
            js.push(files[i]);
        }
    }

    return js;

}

/**
 * Uglifies JS file using Gulp-uglify
 * @param src path to src file
 * @param dest path to destination folder
 * @param enableSourceMaps specifies if source maps will be loaded and processed by Uglify
 * @param options gulp-uglify options
 * todo: Uglyfiyng source maps generated by TS does not work correctly. Check it!
 */
function uglifyFile(src: string, dest: string, enableSourceMaps: boolean, options: any): void {

    "use strict";

    printf("Minifying %1 => %2", src, dest);

    // start gulp with given file
    let gulpsrc: NodeJS.ReadWriteStream = gulp.src(src);

    if (enableSourceMaps) {
        // todo: THIS DOES NOT WORK! Review gupl-sourcemaps
        /*
        gulpsrc.pipe(
            sourceMaps.init({
                loadMaps: true,
                largeFile: true
            })
        )
        */
    }

    gulpsrc.pipe(
        uglify(options)
    );

    if (enableSourceMaps) {
        // todo: THIS DOES NOT WORK! Review gupl-sourcemaps
        /*
        gulpsrc.pipe(
            sourceMaps.write(jsTarget, { 
                sourceMappingURL:
                    function (file) {
                        return projectConfig.jsTargetFolder + "/" + file.relative + ".map";
                    }
            }
            )
        );
        */
    }

    gulpsrc.pipe(gulp.dest(dest));

}

/**
 * processes single JS and related .map file
 * @param jsFile .js file to be processed
 * @param project VS project info
 * @param projectConfig project configuration (merged from AjsWebAbb config, project common config and project(solutionConfiguration) config
 * @param ajsWebAppProject AjsWebApp project info
 * @param ajsWebAppProjectConfig AjsWebApp project configuration (merged)
 * todo: Add project options for Uglify
 * todo: Check why map files generated by TS does not work in Uglify
 */
function processJSFile(
    jsFile: string,
    project: vs.IProjectInfo,
    projectConfig: cfg.IAjsWebAppConfig,
    ajsWebAppProject: vs.IProjectInfo,
    ajsWebAppProjectConfig: cfg.IAjsWebAppConfig
): void {

    "use strict";

    // target path - this should be reworked and merged AjsWebAppProject config should be used
    let jsTargetPath: string = path.normalize(ajsWebAppProject.projectDir + ajsWebAppProjectConfig.jsTargetFolder);

    // src map file
    let srcMapFile: string = null;

    // get the mapfile path if exists and it is allowed
    if (projectConfig.enableSourceMaps) {

        let mapFileTmp: string = path.normalize(jsFile + ".map");
        if (fs.existsSync(mapFileTmp)) {
            srcMapFile = mapFileTmp;
        }

    }

    printf("Processing js '%1' > '%2', map: '%3'", jsFile, jsTargetPath, srcMapFile);

    // check if minify or copy

    if (projectConfig.jsMinify) {

        // uglify

        // get project related uglify options
        let uglifyOptions: any = projectConfig.jsMinifyOptions;

        // get number of props defined by project config
        let props: number = 0;
        for (let key in uglifyOptions) {
            if (uglifyOptions.hasOwnProperty(key)) {
                props++;
            }
        }

        // use safe uglify settings when project options are not defined
        if (props === 0) {
            uglifyOptions = {
                mangle: false
            };
        }

        // uglify file
        uglifyFile(jsFile, jsTargetPath, projectConfig.enableSourceMaps, projectConfig.jsMinifyOptions);

    } else {

        // copy

        // target js file
        let jsTargetFile: string = path.normalize(jsTargetPath + "/" + path.basename(jsFile));
        copyIfNewer(jsFile, jsTargetFile);

        // copy map file
        if (srcMapFile !== null) {
            let mapTargetFile: string = path.normalize(jsTargetPath + "/" + path.basename(jsFile) + ".map");
            copyIfNewer(srcMapFile, mapTargetFile);
        }
    }
}

/**
 * process .js and .map files
 * @param project information about visual studio project
 * @param projectConfig VS project AjsWebApp specific configuration
 * @param ajsWebAppProject AjsWebApp project (Startup project of the VS solution)
 * @param ajsWebAppProjectConfig AjsWebApp project configuration
 */
function processJSFiles(
    project: vs.IProjectInfo,
    projectConfig: cfg.IAjsWebAppConfig,
    ajsWebAppProject: vs.IProjectInfo,
    ajsWebAppProjectConfig: cfg.IAjsWebAppConfig
): void {

    "use strict";

    printf("Processing .js and .js.map files");

    // collect js files
    let jsFiles: string[] = collectSrcJsFiles(path.normalize(project.projectDir + projectConfig.jsSourceFolder));

    for (let i: number = 0; i < jsFiles.length; i++) {
        processJSFile(jsFiles[i], project, projectConfig, ajsWebAppProject, ajsWebAppProjectConfig);
    }

}

/**
 * process less file based on project configuration
 * @param src path to file to be processed
 * @param dst path where to place processed file
 * @param clean list of files to be cleaned during the clean action
 * @param project VS project info
 * @param projectConfig project configuration (merged from AjsWebAbb config, project common config and project(solutionConfiguration) config
 * @param ajsWebAppProject AjsWebApp project info
 * @param ajsWebAppProjectConfig AjsWebApp project configuration (merged)
 */
function lessFileProcessor(
    src: string,
    dst: string,
    clean: string[],
    project: vs.IProjectInfo,
    projectConfig: cfg.IAjsWebAppConfig,
    ajsWebAppProject: vs.IProjectInfo,
    ajsWebAppProjectConfig: cfg.IAjsWebAppConfig
): void {

    "use strict";

    copyIfNewer(src, dst);
    clean.push(dst);
}

/**
 * process sass file based on project configuration
 * @param src path to file to be processed
 * @param dst path where to place processed file
 * @param clean list of files to be cleaned during the clean action
 * @param project VS project info
 * @param projectConfig project configuration (merged from AjsWebAbb config, project common config and project(solutionConfiguration) config
 * @param ajsWebAppProject AjsWebApp project info
 * @param ajsWebAppProjectConfig AjsWebApp project configuration (merged)
 */
function sassFileProcessor(
    src: string,
    dst: string,
    clean: string[],
    project: vs.IProjectInfo,
    projectConfig: cfg.IAjsWebAppConfig,
    ajsWebAppProject: vs.IProjectInfo,
    ajsWebAppProjectConfig: cfg.IAjsWebAppConfig
): void {

    "use strict";

    copyIfNewer(src, dst);
    clean.push(dst);
}

/**
 * process css file based on project configuration
 * @param src path to file to be processed
 * @param dst path where to place processed file
 * @param clean list of files to be cleaned during the clean action
 * @param project VS project info
 * @param projectConfig project configuration (merged from AjsWebAbb config, project common config and project(solutionConfiguration) config
 * @param ajsWebAppProject AjsWebApp project info
 * @param ajsWebAppProjectConfig AjsWebApp project configuration (merged)
 */
function cssFileProcessor(
    src: string,
    dst: string,
    clean: string[],
    project: vs.IProjectInfo,
    projectConfig: cfg.IAjsWebAppConfig,
    ajsWebAppProject: vs.IProjectInfo,
    ajsWebAppProjectConfig: cfg.IAjsWebAppConfig
): void {

    "use strict";

    copyIfNewer(src, dst);
    clean.push(dst);
}

/**
 * process html based on project configuration
 * @param src path to file to be processed
 * @param dst path where to place processed file
 * @param clean list of files to be cleaned during the clean action
 * @param project VS project info
 * @param projectConfig project configuration (merged from AjsWebAbb config, project common config and project(solutionConfiguration) config
 * @param ajsWebAppProject AjsWebApp project info
 * @param ajsWebAppProjectConfig AjsWebApp project configuration (merged)
 */
function htmlFileProcessor(
    src: string,
    dst: string,
    clean: string[],
    project: vs.IProjectInfo,
    projectConfig: cfg.IAjsWebAppConfig,
    ajsWebAppProject: vs.IProjectInfo,
    ajsWebAppProjectConfig: cfg.IAjsWebAppConfig
): void {

    "use strict";

    copyIfNewer(src, dst);
    clean.push(dst);
}

/**
 * process less based on project configuration
 * @param src path to file to be processed
 * @param dst path where to place processed file
 * @param clean list of files to be cleaned during the clean action
 * @param project VS project info
 * @param projectConfig project configuration (merged from AjsWebAbb config, project common config and project(solutionConfiguration) config
 * @param ajsWebAppProject AjsWebApp project info
 * @param ajsWebAppProjectConfig AjsWebApp project configuration (merged)
 */
function defaultFileProcessor(
    src: string,
    dst: string,
    clean: string[],
    project: vs.IProjectInfo,
    projectConfig: cfg.IAjsWebAppConfig,
    ajsWebAppProject: vs.IProjectInfo,
    ajsWebAppProjectConfig: cfg.IAjsWebAppConfig
): void {

    "use strict";

    copyIfNewer(src, dst);
    clean.push(dst);
}

/**
 * process less based on project configuration
 * @param src path to file to be processed
 * @param dst path where to place processed file
 * @param clean list of files to be cleaned during the clean action
 * @param project VS project info
 * @param projectConfig project configuration (merged from AjsWebAbb config, project common config and project(solutionConfiguration) config
 * @param ajsWebAppProject AjsWebApp project info
 * @param ajsWebAppProjectConfig AjsWebApp project configuration (merged)
 */
function processWWWRootFile(
    src: string,
    dst: string,
    clean: string[],
    project: vs.IProjectInfo,
    projectConfig: cfg.IAjsWebAppConfig,
    ajsWebAppProject: vs.IProjectInfo,
    ajsWebAppProjectConfig: cfg.IAjsWebAppConfig
): void {

    "use strict";

    switch (path.extname(src)) {
        case ".less":
            lessFileProcessor(src, dst, clean, project, projectConfig, ajsWebAppProject, ajsWebAppProjectConfig);
            break;
        case ".sass":
            sassFileProcessor(src, dst, clean, project, projectConfig, ajsWebAppProject, ajsWebAppProjectConfig);
            break;
        case ".css":
            cssFileProcessor(src, dst, clean, project, projectConfig, ajsWebAppProject, ajsWebAppProjectConfig);
            break;
        case ".htm":
        case ".html":
            htmlFileProcessor(src, dst, clean, project, projectConfig, ajsWebAppProject, ajsWebAppProjectConfig);
            break;
        default:
            defaultFileProcessor(src, dst, clean, project, projectConfig, ajsWebAppProject, ajsWebAppProjectConfig);
    }
}

/**
 * process the wwwroot folder
 * @param project VS project info
 * @param projectConfig project configuration (merged from AjsWebAbb config, project common config and project(solutionConfiguration) config
 * @param ajsWebAppProject AjsWebApp project info
 * @param ajsWebAppProjectConfig AjsWebApp project configuration (merged)
 */
function processWWWRoot(
    project: vs.IProjectInfo,
    projectConfig: cfg.IAjsWebAppConfig,
    ajsWebAppProject: vs.IProjectInfo,
    ajsWebAppProjectConfig: cfg.IAjsWebAppConfig
): void {

    "use strict";

    let toClean: string[] = [];

    let wwwrootPath: string = path.normalize(project.projectDir + projectConfig.wwwRootSourceFolder);
    let targetRoot: string = ajsWebAppProject.projectDir;

    let i: number;

    if (!fs.existsSync(wwwrootPath)) {
        return;
    }

    printf("Processing wwwroot folder %1 => %2", wwwrootPath, targetRoot);

    let files: string[] = dir(wwwrootPath);

    for (i = 0; i < files.length; i++) {

        let relpath: string = files[i].substr(wwwrootPath.length);

        let stat: fs.Stats = fs.statSync(files[i]);

        if (stat.isDirectory()) {

            try {
                fs.mkdirSync(path.normalize(targetRoot + relpath));
                toClean.push(path.normalize(targetRoot + relpath));
            } catch (e) {
                if (e.code !== "EEXIST") {
                    throw e;
                }
            }

        } else {
            processWWWRootFile(
                files[i],
                path.normalize(targetRoot + relpath),
                toClean,
                project,
                projectConfig,
                ajsWebAppProject,
                ajsWebAppProjectConfig
            );
        }

    }

    fs.writeFileSync(
        path.normalize(targetRoot + "/buildtools/clean.json"),
        JSON.stringify(toClean, null, 2),
        "utf8");
}

/**
 * generate cache.manifest for offline support
 * @param project VS project info
 * @param projectConfig project configuration (merged from AjsWebAbb config, project common config and project(solutionConfiguration) config
 * @param ajsWebAppProject AjsWebApp project info
 * @param ajsWebAppProjectConfig AjsWebApp project configuration (merged)
 * @param solutionData solution data readed from .sln
 */
function generateCacheManifest(
    project: vs.IProjectInfo,
    projectConfig: cfg.IAjsWebAppConfig,
    ajsWebAppProject: vs.IProjectInfo,
    ajsWebAppProjectConfig: cfg.IAjsWebAppConfig,
    solutionData: vs.ISolution
): void {

    "use strict";

}

/**
 * setup sources virtual folders to applicationhost.config
 * @param project VS project info
 * @param projectConfig project configuration (merged from AjsWebAbb config, project common config and project(solutionConfiguration) config
 * @param ajsWebAppProject AjsWebApp project info
 * @param ajsWebAppProjectConfig AjsWebApp project configuration (merged)
 * @param solutionData solution data readed from .sln
 */
function setupSrcVirutalDirs(
    project: vs.IProjectInfo,
    projectConfig: cfg.IAjsWebAppConfig,
    ajsWebAppProject: vs.IProjectInfo,
    ajsWebAppProjectConfig: cfg.IAjsWebAppConfig,
    solutionData: vs.ISolution
): void {

    "use strict";

    // if (solutionData.solutionInfo.configurationName === "Debug") {

        let appHostFileName: string = solutionData.solutionInfo.solutionDir + ".vs\\config\\applicationhost.config";
        printf("Updating applicationhost.config %1...", appHostFileName);

        let appHost: string = fs.readFileSync(appHostFileName, "utf8");

        xml2js.parseString(appHost,

            function (err: any, result: any): void {

                /* tslint:disable */
                let sites: string[] = result["configuration"]["system.applicationHost"][0]["sites"][0]["site"];
                /* tslint:enable */

                for (let i: number = 0; i < sites.length; i++) {

                    /* tslint:disable */
                    if (sites[i]["$"]["name"] === solutionData.solutionInfo.ajsWebAppProject) {
                    /* tslint:enable */

                        printf("Adding virtual directory: %1 => %2",
                            projectConfig.sourcesPath + "/" + project.projectName,
                            project.projectDir);

                        /* tslint:disable */
                        sites[i]["application"][0]["virtualDirectory"].push({
                        /* tslint:enable */
                            "$": {
                                path: projectConfig.sourcesPath + "/" + project.projectName,
                                physicalPath: project.projectDir
                            }
                        });

                        break;
                    }
                }

                let builder: xml2js.Builder = new xml2js.Builder({
                    renderOpts: {
                        pretty: true,
                        newline: "\r\n"
                    }
                });

                let xml: string = builder.buildObject(result);

                // waits while the file is ready to write
                function writeAppHost(): void {

                    try {
                        printf("Updating applicationhost.config. file...");
                        fs.writeFileSync(appHostFileName, xml, "utf8");
                        printf("Applicationhost.config updated succesfully.");
                    } catch (e) {
                        if (e.code !== "EBUSY") {
                            throw e;
                        } else {
                            printf("Waiting for applicationhost.config to be ready for writing...");
                            writeAppHost();
                        }
                    }

                }

                writeAppHost();
            }

        );

    // }
}

/**
 * process the VS solution project
 * @param project VS project info
 * @param projectConfig project configuration (merged from AjsWebAbb config, project common config and project(solutionConfiguration) config
 * @param ajsWebAppProject AjsWebApp project info
 * @param ajsWebAppProjectConfig AjsWebApp project configuration (merged)
 * @param solutionData solution data readed from .sln
 */
function processProject(
    project: vs.IProjectInfo,
    projectConfig: cfg.IAjsWebAppConfig,
    ajsWebAppProject: vs.IProjectInfo,
    ajsWebAppProjectConfig: cfg.IAjsWebAppConfig,
    solutionData: vs.ISolution
): void {

    "use strict";

    printf("Processing project %1...", project.projectName);

    if (projectConfig.projectIgnore) {
        printf("Project has ignore flag set. Skipping.");
        return;
    }

    // process javascript and map files
    processJSFiles(project, projectConfig, ajsWebAppProject, ajsWebAppProjectConfig);

    // process wwwroot folder (process LESS/SASS, minify CSS and HTML files, copy the rest of resources
    processWWWRoot(project, projectConfig, ajsWebAppProject, ajsWebAppProjectConfig);

    // setup sources virtual directories to %solutiondir%/.vs/config/applicationhost.config if solution configuration = Debug
    setupSrcVirutalDirs(project, projectConfig, ajsWebAppProject, ajsWebAppProjectConfig, solutionData);

    printf("Processing project done.");
}

/**
 * process the solution 
 * @param solutionData .sln data including projects and their congigurations
 */
function processSolution(solutionData: vs.ISolution): void {

    "use strict";

    // print solution info
    printSolutionInfo(solutionData);

    printf("Loading main AjsWebApp config");

    // get WebAppProject
    let ajsWebAppProject: vs.IProjectInfo = getProject(solutionData.solutionInfo.ajsWebAppProject, solutionData);
    if (ajsWebAppProject === null) {
        throw new Error("AjsWebApp project '" + solutionData.solutionInfo.ajsWebAppProject + "' could not be found.");
    }

    // get AjsWebApp project configuration (merge the main with Debug or Release)
    let ajsWebAppCfg: cfg.IAjsWebAppConfig = getProjectConfig(
        solutionData.solutionInfo.ajsWebAppProject,
        cfg.defaultConfig(vs.getSolutionConfiguration(solutionData)),
        solutionData);

    printf();

    // cleanup the src virtual directories in applicationhost.config (if exists)    
    cleanApplicationHost(solutionData);
    printf();

    // process projects
    printf("Processing projects...");
    printf();

    // go for all projects in the solution
    for (let i: number = 0; i < solutionData.projects.length; i++) {

        printf("Processing project %1", solutionData.projects[i].projectName);

        // process only projects not in ignoredProjects
        if (ajsWebAppCfg.ignoredProjects.indexOf(solutionData.projects[i].projectName) === -1) {

            // get project config and process project (projectIgnore option is evaluated in processProject)
            let pcfg: cfg.IAjsWebAppConfig = getProjectConfig(solutionData.projects[i].projectName, ajsWebAppCfg, solutionData);
            processProject(solutionData.projects[i], pcfg, ajsWebAppProject, ajsWebAppCfg, solutionData);

        } else {

            printf("Project '%1' is in the list of ignored projects. Skipping", solutionData.projects[i].projectName);

        }

        printf();
    }

    printf("Processing projects finished");
    printf();

    // generate the cache.manifest if offline support is required in the main web app config file
    // todo: generate cache.manifest
}

/**
 * cleans the applicationhost.config from the virtual directories created during previous build
 * @param solutionData .sln data including projects and their congigurations
 */
function cleanApplicationHost(solutionData: vs.ISolution): void {

    "use strict";

    let project: vs.IProjectInfo = getProject(solutionData.solutionInfo.ajsWebAppProject, solutionData);
    let appHostFileName: string = solutionData.solutionInfo.solutionDir + ".vs\\config\\applicationhost.config";
    let appHost: string = fs.readFileSync(appHostFileName, "utf8");

    printf("Cleaning the application.host config file (%1)", appHostFileName);

    xml2js.parseString(appHost,

        function (err: any, result: any): void {

            /* tslint:disable */
            let sites: any = result["configuration"]["system.applicationHost"][0]["sites"][0]["site"];
            /* tslint:enable */

            // find propper site
            for (let i: number = 0; i < sites.length; i++) {

                /* tslint:disable */
                if (sites[i]["$"]["name"] === solutionData.solutionInfo.ajsWebAppProject) {
                /* tslint:enable */

                    // set only root project virtual directory
                    /* tslint:disable */
                    sites[i]["application"][0]["virtualDirectory"] = [{
                    /* tslint:enable */
                        "$": {
                            path: "/",
                            physicalPath: project.projectDir
                        }
                    }];

                    break;
                }

            }

            let builder: xml2js.Builder = new xml2js.Builder({
                renderOpts: {
                    pretty: true,
                    indent: "  ",
                    newline: "\r\n"
                }
            });
            let xml: string = builder.buildObject(result);

            // waits while the file is ready to write
            function writeAppHost(): void {

                try {
                    printf("Updating applicationhost.config: %1...", project.projectName);
                    fs.writeFileSync(appHostFileName, xml, "utf8");
                    printf("Applicationhost.config updated succesfully...");
                } catch (e) {
                    if (e.code !== "EBUSY") {
                        throw e;
                    } else {
                        printf("Waiting for applicationhost.config to be ready for writing...");
                        writeAppHost();
                    }
                }

            }

            writeAppHost();
        }

    );

}

/**
 * cleans the js target folders
 * @param solutionData .sln data including projects and their congigurations
 */
function cleanJSTargetFolders(solutionData: vs.ISolution): void {

    "use strict";

    // get WebAppProject
    let ajsWebAppProject: vs.IProjectInfo = getProject(solutionData.solutionInfo.ajsWebAppProject, solutionData);
    if (ajsWebAppProject === null) {
        throw new Error("AjsWebApp project '" + solutionData.solutionInfo.ajsWebAppProject + "' could not be found.");
    }

    // get AjsWebApp project configuration (merge the main with Debug or Release)
    let ajsWebAppCfg: cfg.IAjsWebAppConfig = getProjectConfig(
        solutionData.solutionInfo.ajsWebAppProject,
        cfg.defaultConfig(vs.getSolutionConfiguration(solutionData)),
        solutionData);

    for (let i: number = 0; i < solutionData.projects.length; i++) {

        let pcfg: cfg.IAjsWebAppConfig = getProjectConfig(solutionData.projects[i].projectName, ajsWebAppCfg, solutionData);

        if (!pcfg.projectIgnore &&
            ajsWebAppCfg.ignoredProjects.indexOf(solutionData.projects[i].projectName) === -1) {

            let dir: string = path.normalize(ajsWebAppProject.projectDir + pcfg.jsTargetFolder);
            let files: string[] = fs.readdirSync(dir);

            for (let j: number = 0; j < files.length; j++) {

                let file: string = path.normalize(dir + "/" + files[j]);
                let stat: fs.Stats = fs.statSync(file);

                if (stat.isDirectory()) {
                    rmdir(file);
                } else {
                    if (files[j].toLocaleLowerCase() !== "readme.md") {
                        fs.unlinkSync(file);
                    }
                }
            }

        }
    }

}

/**
 * cleans the www root
 * @param solutionData .sln data including projects and their congigurations
 */
function cleanWWWRoot(solutionData: vs.ISolution): void {

    "use strict";

    // load the clean.json
    let cleanFileName: string = path.normalize("./buildtools/clean.json");

    if (fs.existsSync(cleanFileName)) {

        printf("Cleaning WWWRoot");

        // load clean file
        let cleanFile: string = fs.readFileSync(cleanFileName, "utf8");
        let clean: string[] = JSON.parse(cleanFile);

        // prepare lets
        let i: number;
        let dirs: string[] = [];

        // for all records in the clean file
        for (i = 0; i < clean.length; i++) {

            let file: string = path.normalize(clean[i]);

            if (fs.existsSync(file)) {

                let stat: fs.Stats = fs.statSync(file);

                if (stat.isDirectory()) {
                    // prepare dir for deletion
                    dirs.push(file);
                } else {
                    // delete file
                    printf("Removing file %1", file);
                    fs.unlinkSync(file);
                }

            }
        }

        // for all dirs found in clean file
        for (i = dirs.length - 1; i >= 0; i--) {

            // remove dir
            printf("Removing dir %1", dirs[i]);

            try {
                fs.rmdirSync(dirs[i]);
            } catch (e) {
                printf("Dir %1 can't be removed: %2", dirs[i], e);
            }

        }

        // write empty clean file
        fs.writeFileSync(cleanFileName, "[]", "utf8");
    }
}

// *** process helpers ***

/**
 * Checks if the gulp task is running (checks for PID file and if the process with the particular ID exists)
 * @param taskName name of the task to be checked
 * @return true if the taks is running
 */
function isTaskRunning(taskName: string): boolean {

    "use strict";

    let pidFileName: string = path.normalize("./buildtools/" + taskName + ".pid");

    if (fs.existsSync(pidFileName)) {

        let pid: string = fs.readFileSync(pidFileName, "ASCII");
        let results: any = ps.query({ pid: pid });

        if (results.hasOwnProperty(pid) && results[pid].hasOwnProperty("args")) {
            return results[pid].args.indexOf(__filename) !== -1;
        }

    }

    return false;
}

/**
 * Creates appropriate pid file for given gulp task if the task is not running already
 * @param taskName gulp task name for which the pid file should be created
 * @return False if the task was running already or true if not
 */
function startTask(taskName: string): boolean {

    "use strict";

    // check if the task is not running already
    if (isTaskRunning(taskName)) {
        printf();
        printf("Gulp task '%1' is running already!", taskName);
        printf("Exiting running task: %1...", taskName);
        printf();
        return false;
    }

    // write the PID file
    let pidFileName: string = path.normalize("./buildtools/" + taskName + ".pid");
    fs.writeFileSync(pidFileName, process.pid);

    // prepare process.on-exit handler
    process.on("exit", function (code: string): void {
        printf("Exiting running task: %1...", taskName);
        if (fs.existsSync(pidFileName)) {
            fs.unlinkSync(pidFileName);
        }
    });

    // prepare process.on-uncaughtException handler
    process.on("uncaughtException", function (code: string): void {
        printf("Exitting process of task %1 on exception %2", taskName, code);
        if (fs.existsSync(pidFileName)) {
            fs.unlinkSync(pidFileName);
        }
    });

    return true;
}

// ****************************** Watcher & Cleaner *********************************

/**
 * Holds wrapper of gulp-watch
 */
interface IWatchedFileInfo {
    stat?: fs.Stats;
}

interface IFSWatcherParams {
    persistent ?: boolean;
    recursive ?: boolean;
    encoding ?: string;
}

let awatcherInstance: {
    /** Holds FSWatcher object instance */
    watcher: fs.FSWatcher;
    /** Holds path to the solution direcory to be monitored */
    path: string;
    /** Holds FSWatcher configuration */
    params: IFSWatcherParams,
    /** Holds FSWatcher callback */
    callback: (fileInfo: {
        /** Event fired for the given file */
        event: string,
        /** Path to file/dir affected */
        path: string
    }) => void,
    /** Holds list of files in the watched directory for comparation */
    files: {
        [path: string]: IWatchedFileInfo;
    },
    /** Used internally to start FSWatcher */
    _doStart: () => void,
    /** Starts the watching procedure */
    start: (
        path: string,
        params: IFSWatcherParams,
        callback: (fileInfo: {
            /** Event fired for the given file */
            event: string,
            /** Path to file/dir affected */
            path: string
        }) => void,
    ) => void,
    /** Pauses the watchin procedure (by stopping FSWatcher) */
    pause: () => void,
    /** Resumes the watching procedure (by starting FSWatcher) */
    resume: () => void,
    /** Stops the watching procedure completely */
    stop: () => void

} = null;

/**
 * Cleans the wwwroot and js folders after the VS AjsWebApp clean action
 * @return Cleaner promise or process exit code if something fails
 */
function cleaner(): Promise<void>|void {

    "use strict";

    let solutionData: vs.ISolution = vs.getSolution();

    if (solutionData !== null) {

        return new Promise<void>(

            function (resolve: () => void, reject: (reason: any) => void): void {

                // pause awatcher and wait until it gets paused
                pauseWatcher(

                    // awatcher-paused-callback
                    function (): void {

                        // do the clean work
                        cleanApplicationHost(solutionData);
                        cleanJSTargetFolders(solutionData);
                        cleanWWWRoot(solutionData);

                        // resume the awatcher and wait until it gets resumed
                        resumeWatcher(

                            // awatcher-resumed-callback
                            function (): void {
                                resolve();
                        });
                    }
                );
            }
        );

    } else {

        printf("Failed to obtain solution information!");
        printf();
        return process.exit(1);

    }

}

/**
 * Wrapper for FS.watch/FSWatcher allowing pause/resume
 * @return promise of the awathcer resolved in case the Gulpfile.js is changed, otherwise its infinite loop
 */
function awatcher(): Promise<void> {

    "use strict";

    return new Promise<void>(

        function (resolve: () => void, reject: (reason: any) => void): void {

            awatcherInstance = {} as any;

            awatcherInstance.watcher = null;
            awatcherInstance.path = "";
            awatcherInstance.params = {};
            awatcherInstance.callback = null;
            awatcherInstance.files = {};

            /**
             * Called when something in the monitored folder gets changed
             * @param event FSWatcher event type (rename, change is processed here)
             * @param file path to the file/directory affected
             */
            function fileChangeCallback(event: string, file: string): void {

                file = path.normalize(awatcherInstance.path + "/" + file);

                let awFile: IWatchedFileInfo;

                if (awatcherInstance.files.hasOwnProperty(file)) {
                    awFile = awatcherInstance.files[file];
                } else {
                    awFile = null;
                }

                if (event === "rename") {
                    if (awFile !== null) {
                        event = "unlink";
                        delete (awatcherInstance.files[file]);
                    } else {
                        event = "change";
                    }
                }

                if (event === "change") {
                    if (awFile === null) {
                        event = "add";
                        let f: IWatchedFileInfo = {};
                        awatcherInstance.files[file] = f;
                    }
                }

                if (awatcherInstance.callback) {
                    awatcherInstance.callback({ event: event, path: file });
                }
            }

            awatcherInstance._doStart = function (): void {

                printf("Starting FS watcher...");

                awatcherInstance.params.persistent = true;
                awatcherInstance.params.recursive = true;
                awatcherInstance.files = {};

                // get initial state of the watched directory

                let files: string[] = dir(awatcherInstance.path);
                for (let i: number = 0; i < files.length; i++) {

                    let f: IWatchedFileInfo = {};

                    if (fs.existsSync(files[i])) {
                        f.stat = fs.statSync(files[i]);
                        awatcherInstance.files[files[i]] = f;
                    } else {
                        delete (awatcherInstance.files[files[i]]);
                    }

                }

                // create FSWatcher instance

                awatcherInstance.watcher = fs.watch(
                    awatcherInstance.path,
                    awatcherInstance.params,
                    fileChangeCallback
                );

                printf("FS Warcher started");

            };

            // start watching

            awatcherInstance.start = function (
                path: string,
                params: IFSWatcherParams,
                callback: (fileInfo: {
                    /** Event fired for the given file */
                    event: string,
                    /** Path to file/dir affected */
                    path: string
                }) => void): void {

                process.nextTick(function (): void {
                    awatcherInstance.path = path;
                    awatcherInstance.callback = callback;
                    awatcherInstance.params = params;
                    awatcherInstance._doStart();
                });

            };

            // pause watching

            awatcherInstance.pause = function (): void {

                process.nextTick(function (): void {
                    printf("Closing FS watcher...");
                    awatcherInstance.watcher.close();
                    awatcherInstance.watcher = null;
                    printf("FS watcher closed.");
                });

            };

            // resume watching

            awatcherInstance.resume = function (): void {

                process.nextTick(function (): void {
                    awatcherInstance._doStart();
                });

            };

            // stop watching

            awatcherInstance.stop = function (): void {

                process.nextTick(function (): void {
                    if (awatcherInstance.watcher !== null) {
                        printf("Closing FS watcher...");
                        awatcherInstance.watcher.close();
                        awatcherInstance.watcher = null;
                        printf("FS watcher closed.");
                    }
                    // printf(process._getActiveHandles());
                    // printf(process._getActiveRequests());
                    resolve();
                });

            };

        }
    );
}

/**
 * Watches the solution directory for file changes
 * @returns If the watcher is running already the undefined will be returned. Otherwise gulp.watch object will be returned.
 */
function watcher(): Promise<void> | undefined {

    "use strict";

    interface IProjectDirInfo {
        [index: string]: {
            project?: vs.IProjectInfo,
            projectConfig?: cfg.IAjsWebAppConfig,
            jsSrc?: string,
            wwwSrc?: string
        };
    }

    let errorFlag: boolean = false;
    let paused: boolean = false;
    let solutionData: vs.ISolution;
    let ajsWebAppCfg: cfg.IAjsWebAppConfig;
    let ajsWebAppProj: vs.IProjectInfo;
    let projectDirs: IProjectDirInfo;
    let watchPath: string;

    let gulpfilestats: fs.Stats = fs.statSync(__filename);
    let gf: string = fs.readFileSync(__filename, "utf8");
    let gulpfilesha: string = crypto.createHash("sha1").update(gf).digest("hex");

    /**
     * load solution during init, reload if solutionInfo file changes (usually on solution rebuild only)
     */
    function reloadSolution(): void {

        // load solution info

        printf("Loading solution info...");

        solutionData = vs.getSolution();

        // warning if solutionInfo.json not parsed correctly

        if (solutionData === null) {

            if (!errorFlag) {
                errorFlag = true;
                printf();
                printf("Unable to monitor file changes for un-built solution (./buildtools/solutionInfo.json is missing)!");
                printf("Build the solution first in order to be possible to collect the solution and projects information!");
                printf();
            }

        } else {

            errorFlag = false;

            // get AjsWebApp project
            ajsWebAppProj = getProject(
                solutionData.solutionInfo.ajsWebAppProject,
                solutionData
            );

            // get AjsWebApp project configuration (merge the main with Debug or Release)
            ajsWebAppCfg = getProjectConfig(
                solutionData.solutionInfo.ajsWebAppProject,
                cfg.defaultConfig(vs.getSolutionConfiguration(solutionData)),
                solutionData);

            // prepare project directories object

            /** @type { Object.<string, { jsSrc: string, wwwSrc: string }> } */
            projectDirs = {};

            // load directories of all projects

            for (let i: number = 0; i < solutionData.projects.length; i++) {

                let p: vs.IProjectInfo = solutionData.projects[i];
                let pname: string = solutionData.projects[i].projectName;
                let pcfg: cfg.IAjsWebAppConfig = getProjectConfig(pname, ajsWebAppCfg, solutionData);

                // if project is not ignored
                if (!pcfg.projectIgnore && ajsWebAppCfg.ignoredProjects.indexOf(solutionData.projects[i].projectName) === -1) {
                    // get project / dirs info
                    projectDirs[pname] = {};
                    projectDirs[pname].project = p;
                    projectDirs[pname].projectConfig = pcfg;
                    projectDirs[pname].jsSrc = path.normalize(p.projectDir + pcfg.jsSourceFolder);
                    projectDirs[pname].wwwSrc = path.normalize(p.projectDir + pcfg.wwwRootSourceFolder);
                }

            }
        }

    }

    /** checks if the watcher should be paused (by existence of the watcher.pause file) and resume if not */
    function checkPausedAndResume(): void {

        if (!fs.existsSync(path.normalize(__dirname + "/buildtools/watcher.pause"))) {

            printf();
            printf("Resuming the watcher.");

            let gfs: fs.Stats = fs.statSync(__filename);
            if (gfs.mtime !== gulpfilestats.mtime) {

                let gf: string = fs.readFileSync(__filename, "utf8");
                let sha: string = crypto.createHash("sha1").update(gf).digest("hex");

                printf(sha, gulpfilesha);

                if (sha !== gulpfilesha) {
                    printf();
                    printf("Gulpfile has changed. Exiting.");
                    /* tslint:disable */
                    printf("To apply changes to the Gulpfile.js restart the watcher by closing and openning the solution or by doubleclicking Task Runner Explorer -> Gulpfile.js -> Tasks -> projectOpen");
                    /* tslint:enable */
                    printf();
                    awatcherInstance.stop();
                    return;
                }
            }

            reloadSolution();
            awatcherInstance.resume();

            if (fs.existsSync(path.normalize(__dirname + "/buildtools/watcher.waiting"))) {
                fs.unlinkSync(path.normalize(__dirname + "/buildtools/watcher.waiting"));
            }

            paused = false;

            printf("Watcher is resumed.");
            printf();

        } else {
            setTimeout(checkPausedAndResume, 250);
        }
    }

    /**
     * watched file change callback
     * @param file added / changed / removed file
     */
    function fileChanged(file: { event: string, path: string }): void {

        // gulpfile / build tool modified -> exit watcher (changes needs to be applied by restarting watcher)

        if (file.path === __filename) {
            printf();
            printf("Gulpfile has changed. Exiting.");
            /* tslint:disable */
            printf("To apply changes to the Gulpfile.js restart the watcher by closing and openning the solution or by doubleclicking Task Runner Explorer -> Gulpfile.js -> Tasks -> projectOpen");
            /* tslint:enable */
            printf();
            awatcherInstance.stop();
            return;
        }

        // solutionInfo.json modified -> reload solution info

        if (file.path.lastIndexOf("solutionInfo.json") !== -1 && !paused) {
            printf("Solution configuration has changed.");
            reloadSolution();
            printf();
            printf("Watching '%1' for changes...", watchPath);
            printf();
            return;
        }

        // watcher.reload file exists -> force watcher to reload solution info

        if (file.path.lastIndexOf("watcher.reload") !== -1 && !paused) {
            printf("Solution configuration has changed.");
            reloadSolution();
            fs.unlinkSync(file.path);
            printf();
            printf("Watching '%1' for changes...", watchPath);
            printf();
            return;
        }

        // watcher pause added / changed -> pause

        if (file.path.lastIndexOf("watcher.pause") !== -1 && (file.event === "add" || file.event === "change") && !paused) {
            printf();
            printf("Pausing the watcher.");
            awatcherInstance.pause();
            paused = true;
            fs.writeFileSync(path.normalize(__dirname + "/buildtools/watcher.waiting"), ".");
            printf("Watcher is paused.");
            printf();
            checkPausedAndResume();
            return;
        }

        // project related resource resoruce added/modified (i.e. compiled)

        if (!paused && solutionData !== null) {

            for (var key in projectDirs) {

                if (projectDirs.hasOwnProperty(key)) {

                    let exists: boolean = false;
                    let isDir: boolean = false;
                    let isVsTMP: boolean = false;

                    if (fs.existsSync(file.path)) {
                        try {
                            let stat: fs.Stats = fs.statSync(file.path);
                            exists = true;
                            isDir = stat.isDirectory();
                        } catch(e) {
                            exists = false;
                            isDir = false;
                        }
                    }

                    if (isDir) {
                        if (file.path.substr(0, projectDirs[key].project.projectDir.length) === projectDirs[key].project.projectDir) {
                            // printf("Monitored project '%1' (folder change) '%2': %3", key, file.event, file.path);
                        }

                    } else {

                        if (file.path[file.path.length - 1] === "~" || path.extname(file.path).toLowerCase() === ".tmp") {
                            isVsTMP = true;
                        }

                        if (file.event === "change" || file.event === "add") {

                            // process project js file

                            if (file.path.substr(0, projectDirs[key].jsSrc.length) === projectDirs[key].jsSrc) {
                                if (path.extname(file.path) === ".js") {
                                    // printf("Monitored project '%1' (/bin/**/*.js change) '%2': %3", key, file.event, file.path);
                                    processJSFile(
                                        file.path,
                                        projectDirs[key].project,
                                        projectDirs[key].projectConfig,
                                        ajsWebAppProj,
                                        ajsWebAppCfg
                                    );
                                }
                            }

                            // process project wwwroot file

                            if (file.path.substr(0, projectDirs[key].wwwSrc.length) === projectDirs[key].wwwSrc && !isVsTMP) {

                                // printf("Monitored project '%1' (/wwwroot/**.* change) '%2': %3", key, file.event, file.path);

                                // get relative path to file
                                let relpath: string = file.path.substr(projectDirs[key].wwwSrc.length);
                                // compute absolute path to target
                                let srcabspath: string = path.normalize(projectDirs[key].project.projectDir + "/" + projectDirs[key].projectConfig.wwwRootSourceFolder + "/" + relpath);
                                // compute target path
                                let tgtabspath: string = path.normalize(ajsWebAppProj.projectDir + "/" + relpath);

                                // load the clean file
                                let clean: string[] = JSON.parse(
                                    fs.readFileSync(
                                        path.normalize(ajsWebAppProj.projectDir + "/buildtools/clean.json"), "utf8"
                                    )
                                );

                                // create folder structure
                                if (!fs.existsSync(path.dirname(tgtabspath))) {
                                    // check if dir segments are in the clean file
                                    var tgtprojpath: string = path.normalize(ajsWebAppProj.projectDir);
                                    var tmp: string[] = path.dirname(relpath).split(path.sep);
                                    let dir: string = tgtprojpath;
                                    for (let i: number = 0; i < tmp.length; i++) {
                                        if (tmp[i] !== "") {
                                            dir = path.normalize(dir + "/" + tmp[i]);
                                            if (!fs.existsSync(dir)) {
                                                fs.mkdirSync(dir);
                                                clean.push(dir);
                                            }
                                        }
                                    }
                                    // create dir if not exist
                                    fs.mkdirsSync(path.dirname(srcabspath));
                                }

                                processWWWRootFile(
                                    srcabspath, tgtabspath, clean,
                                    projectDirs[key].project, projectDirs[key].projectConfig,
                                    ajsWebAppProj, ajsWebAppCfg
                                );

                                fs.writeFileSync(
                                    path.normalize(ajsWebAppProj.projectDir + "/buildtools/clean.json"),
                                    JSON.stringify(clean),
                                    "utf8"
                                );
                            }


                        } else {
                            // delete js file

                            if (file.path.substr(0, projectDirs[key].jsSrc.length) === projectDirs[key].jsSrc) {
                                if (path.extname(file.path) === ".js") {
                                    printf("Monitored project '%1' (/bin/**/*.js change) '%2': %3", key, file.event, file.path);
                                }
                            }

                            // delete wwwroot file

                            if (file.path.substr(0, projectDirs[key].wwwSrc.length) === projectDirs[key].wwwSrc && !isVsTMP) {

                                // remove from clean.js
                                printf("Monitored project '%1' (/wwwroot/**.* change) '%2': %3", key, file.event, file.path);
                            }
                        }

                    }

                }

            }
        }

    }

    // check if wathcher is running and create pid file if not

    if (!startTask("watcher")) {
        return;
    }

    // remove status files eventually existing from previous watcher start

    if (fs.existsSync(path.normalize(__dirname + "/buildtools/watcher.pause"))) {
        fs.unlinkSync(path.normalize(__dirname + "/buildtools/watcher.pause"));
    }

    if (fs.existsSync(path.normalize(__dirname + "/buildtools/watcher.waiting"))) {
        fs.unlinkSync(path.normalize(__dirname + "/buildtools/watcher.waiting"));
    }

    if (fs.existsSync(path.normalize(__dirname + "/buildtools/watcher.reload"))) {
        fs.unlinkSync(path.normalize(__dirname + "/buildtools/watcher.reload"));
    }

    // init watcher by reloading the solution info

    reloadSolution();
    printf();

    // start gulp watcher and return its promise

    watchPath = solutionData.solutionInfo.solutionDir;

    printf("Watching '%1' for changes...", watchPath);
    printf();

    let awatch: Promise<void> = awatcher();
    awatcherInstance.start(watchPath, {}, fileChanged);
    return awatch;

}

/**
 * Issues command to pause watcher by creating the watcher.pause and calls callback once the watcher gets paused
 * @param pausedCallback Callback to be called when wather gets paused
 */
function pauseWatcher(pausedCallback: () =>  void): void {

    "use strict";

    function waitPaused(): void {

        if (isTaskRunning("watcher") && !fs.existsSync(path.normalize(__dirname + "/buildtools/watcher.waiting"))) {
            setTimeout(waitPaused, 100);
        } else {
            printf("Watcher is paused.");
            pausedCallback();
        }

    }

    if (isTaskRunning("watcher")) {

        printf(path.normalize(__dirname + "/buildtools/watcher.pause"));
        fs.writeFileSync(path.normalize(__dirname + "/buildtools/watcher.pause"), ".");

        printf("Waiting for watcher to be paused...");

        waitPaused();

    } else {
        pausedCallback();
    }
}

/**
 * Issues command to resume watcher by deleting the watcher.pause and calls callback once the watcher gets resumed
 * @param { function() } resumedCallback Callback to be called when the watcher gets resumed
 */
function resumeWatcher(resumedCallback: () => void): void {

    "use strict";

    function waitResumed(): void {

        if (isTaskRunning("watcher") && fs.existsSync(path.normalize(__dirname + "/buildtools/watcher.waiting"))) {
            setTimeout(waitResumed, 100);
        } else {
            printf("Watcher is resumed.");
            resumedCallback();
        }

    }

    if (isTaskRunning("watcher")) {

        if (fs.existsSync(path.normalize(__dirname + "/buildtools/watcher.pause"))) {
            fs.unlinkSync(path.normalize(__dirname + "/buildtools/watcher.pause"));
        }

        printf("Waiting for watcher to be resumed...");

        waitResumed();

    } else {

        resumedCallback();

    }

}

/**
 * Forces watcher to reload solution info by creating the watcher.reload file
 */
function watcherReloadSolution(): void {

    "use strict";

    if (isTaskRunning("watcher")) {
        fs.writeFileSync(path.normalize(__dirname + "/buildtools/watcher.reload"), ".", "utf8");
    }

}

// ********************** Visual Studio events -> Gulp tasks ************************

/** 
 * Start monitoring of file changes
 */
gulp.task("projectOpen",

    function (): void | Promise<void> {

        copyright();
        return watcher();

    }

);

/**
 * Complete cleanup of wwwroot and js dirs (except project files and readme.md)\
 */
gulp.task("clean",

    function (): void | Promise<void> {

        copyright();
        return cleaner();

    }

);


/** No action is taken on beforebuild event */
gulp.task("beforeBuild",

    function (): Promise<void> {

        copyright();

        return new Promise<void>(

            function (resolve: () => void, reject: (reason: any) => void): void {
                if (isTaskRunning("watcher")) {

                    pauseWatcher(
                        function (): void {
                            resolve();
                        }
                    );

                } else {
                    resolve();
                }
            }

        );

    }

);


/** Based on the solution configuration (Debug/Release perform appropriate actions) */
gulp.task("afterBuild",

    function (): Promise<void> {

        copyright();

        return new Promise<void>(

            function (resolve: () => void, reject: (reason: any) => void): void {

                let solutionData: vs.ISolution = vs.getSolution();

                if (solutionData !== null) {
                    processSolution(solutionData);
                }

                if (isTaskRunning("watcher")) {

                    resumeWatcher(
                        function (): void {
                            resolve();
                        }
                    );

                } else {
                    resolve();
                }

            }
        );

    }
);


/** There is no default action now. Everything must be done in VS */
gulp.task("default",

    function (): void {

        copyright();
        usage();
        printf();

    }

);

