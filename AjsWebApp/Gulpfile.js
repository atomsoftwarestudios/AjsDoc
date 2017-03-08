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
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ************************ initialization & configuration *************************
/** Configurable name of the Ajs Web Application project configuration file */
// const ajsAppCfgName: string = "AjsWebApp.json";
// node modules
var path = require("path");
var fs = require("fs-extra");
var ps = require("ps-sync");
var xml2js = require("xml2js");
var crypto = require("crypto");
// node - gulp modules
var gulp = require("gulp");
var uglify = require("gulp-uglify");
// build tools modules (not in npm)
var index_1 = require("./buildmodules/output/index");
var index_2 = require("./buildmodules/filesystem/index");
var index_3 = require("./buildmodules/filesystem/index");
var cfg = require("./buildmodules/config/index");
var vs = require("./buildmodules/visualstudio/index");
// ********************************* basic output **********************************
/** Prints the copyright to the stdout */
function copyright() {
    "use strict";
    index_1.printf();
    index_1.printf("Ajs Application Packager for Visual Studio & Gulp");
    index_1.printf("Copyright (c)2017 Atom Software Studios, All rights reserved");
    index_1.printf("Released under the MIT license");
    index_1.printf();
}
/** Prints usage - called only from gulp.default task */
function usage() {
    "use strict";
    /* tslint:disable */
    index_1.printf("This gulp build file is suposed to be used from the Visual Studio (from Task Runner Explorer) with build events it generates");
    /* tslint:enable */
}
/**
 * Prints information about the solution
 */
function printSolutionInfo(solution) {
    "use strict";
    index_1.printf("Solution info:");
    index_1.printf("--------------");
    index_1.printf("Solution name:          %1", solution.solutionInfo.solutionName);
    index_1.printf("Solution path:          %1", solution.solutionInfo.solutionPath);
    index_1.printf("Solution dir:           %1", solution.solutionInfo.solutionDir);
    index_1.printf("Solution file name:     %1", solution.solutionInfo.solutionFileName);
    index_1.printf("Platform name:          %1", solution.solutionInfo.platformName);
    index_1.printf("Configuration name:     %1", solution.solutionInfo.configurationName);
    index_1.printf("AjsWebApp project name: %1", solution.solutionInfo.ajsWebAppProject);
    index_1.printf();
}
// ********************************* Helpers ****************************************
/**
 * copies file if newer
 * @param src path to source file
 * @param dst path to destination file
 */
function copyIfNewer(src, dst) {
    "use strict";
    var statSrc;
    var statDst;
    // copy only if source file exists
    if (fs.existsSync(src)) {
        statSrc = fs.statSync(src);
    }
    else {
        return;
    }
    // check if dst file exists and copy always if not
    if (fs.existsSync(dst)) {
        statDst = fs.statSync(dst);
    }
    else {
        index_1.printf("copying %1 %2", src, dst);
        fs.copySync(src, dst);
        fs.utimesSync(dst, statSrc.atime, statSrc.mtime);
        return;
    }
    // get modification date of both files
    var dmsrc = Math.floor(statSrc.mtime.getTime() / 1000);
    var dmdst = Math.floor(statDst.mtime.getTime() / 1000);
    // copy if newer
    if (dmsrc > dmdst) {
        index_1.printf("copying %1 %2", src, dst);
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
function getProject(projectName, solutionData) {
    "use strict";
    // find the poject with the given name
    var project = null;
    for (var i = 0; i < solutionData.projects.length; i++) {
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
function getProjectConfig(projectName, ajsWebAppConfig, solutionData) {
    "use strict";
    // find the poject with the given name
    var project = getProject(projectName, solutionData);
    // throw exception if project not found
    if (project === null) {
        throw new Error("Invalid project name '" + projectName + "'. Project not fount in the current solution!");
    }
    // get config for project (merge AjsWebApp config with project config)
    index_1.printf("Getting config for: %1 (%2)", projectName, solutionData.solutionInfo.configurationName);
    var pcfg = null;
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
        index_1.printf("Project has no config defined, using the AjsWebApp config");
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
function collectSrcJsFiles(srcPath) {
    "use strict";
    var js = [];
    // collect all files in srcPath
    var files = index_2.dir(srcPath);
    // add js files to array
    for (var i = 0; i < files.length; i++) {
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
function uglifyFile(src, dest, enableSourceMaps, options) {
    "use strict";
    index_1.printf("Minifying %1 => %2", src, dest);
    // start gulp with given file
    var gulpsrc = gulp.src(src);
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
    gulpsrc.pipe(uglify(options));
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
function processJSFile(jsFile, project, projectConfig, ajsWebAppProject, ajsWebAppProjectConfig) {
    "use strict";
    // target path - this should be reworked and merged AjsWebAppProject config should be used
    var jsTargetPath = path.normalize(ajsWebAppProject.projectDir + ajsWebAppProjectConfig.jsTargetFolder);
    // src map file
    var srcMapFile = null;
    // get the mapfile path if exists and it is allowed
    if (projectConfig.enableSourceMaps) {
        var mapFileTmp = path.normalize(jsFile + ".map");
        if (fs.existsSync(mapFileTmp)) {
            srcMapFile = mapFileTmp;
        }
    }
    index_1.printf("Processing js '%1' > '%2', map: '%3'", jsFile, jsTargetPath, srcMapFile);
    // check if minify or copy
    if (projectConfig.jsMinify) {
        // uglify
        // get project related uglify options
        var uglifyOptions = projectConfig.jsMinifyOptions;
        // get number of props defined by project config
        var props = 0;
        for (var key in uglifyOptions) {
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
    }
    else {
        // copy
        // target js file
        var jsTargetFile = path.normalize(jsTargetPath + "/" + path.basename(jsFile));
        copyIfNewer(jsFile, jsTargetFile);
        // copy map file
        if (srcMapFile !== null) {
            var mapTargetFile = path.normalize(jsTargetPath + "/" + path.basename(jsFile) + ".map");
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
function processJSFiles(project, projectConfig, ajsWebAppProject, ajsWebAppProjectConfig) {
    "use strict";
    index_1.printf("Processing .js and .js.map files");
    // collect js files
    var jsFiles = collectSrcJsFiles(path.normalize(project.projectDir + projectConfig.jsSourceFolder));
    for (var i = 0; i < jsFiles.length; i++) {
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
function lessFileProcessor(src, dst, clean, project, projectConfig, ajsWebAppProject, ajsWebAppProjectConfig) {
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
function sassFileProcessor(src, dst, clean, project, projectConfig, ajsWebAppProject, ajsWebAppProjectConfig) {
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
function cssFileProcessor(src, dst, clean, project, projectConfig, ajsWebAppProject, ajsWebAppProjectConfig) {
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
function htmlFileProcessor(src, dst, clean, project, projectConfig, ajsWebAppProject, ajsWebAppProjectConfig) {
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
function defaultFileProcessor(src, dst, clean, project, projectConfig, ajsWebAppProject, ajsWebAppProjectConfig) {
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
function processWWWRootFile(src, dst, clean, project, projectConfig, ajsWebAppProject, ajsWebAppProjectConfig) {
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
function processWWWRoot(project, projectConfig, ajsWebAppProject, ajsWebAppProjectConfig) {
    "use strict";
    var toClean = [];
    var wwwrootPath = path.normalize(project.projectDir + projectConfig.wwwRootSourceFolder);
    var targetRoot = ajsWebAppProject.projectDir;
    var i;
    if (!fs.existsSync(wwwrootPath)) {
        return;
    }
    index_1.printf("Processing wwwroot folder %1 => %2", wwwrootPath, targetRoot);
    var files = index_2.dir(wwwrootPath);
    for (i = 0; i < files.length; i++) {
        var relpath = files[i].substr(wwwrootPath.length);
        var stat = fs.statSync(files[i]);
        if (stat.isDirectory()) {
            try {
                fs.mkdirSync(path.normalize(targetRoot + relpath));
                toClean.push(path.normalize(targetRoot + relpath));
            }
            catch (e) {
                if (e.code !== "EEXIST") {
                    throw e;
                }
            }
        }
        else {
            processWWWRootFile(files[i], path.normalize(targetRoot + relpath), toClean, project, projectConfig, ajsWebAppProject, ajsWebAppProjectConfig);
        }
    }
    fs.writeFileSync(path.normalize(targetRoot + "/buildtools/clean.json"), JSON.stringify(toClean, null, 2), "utf8");
}
/**
 * generate cache.manifest for offline support
 * @param project VS project info
 * @param projectConfig project configuration (merged from AjsWebAbb config, project common config and project(solutionConfiguration) config
 * @param ajsWebAppProject AjsWebApp project info
 * @param ajsWebAppProjectConfig AjsWebApp project configuration (merged)
 * @param solutionData solution data readed from .sln
 */
function generateCacheManifest(project, projectConfig, ajsWebAppProject, ajsWebAppProjectConfig, solutionData) {
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
function setupSrcVirutalDirs(project, projectConfig, ajsWebAppProject, ajsWebAppProjectConfig, solutionData) {
    "use strict";
    // if (solutionData.solutionInfo.configurationName === "Debug") {
    var appHostFileName = solutionData.solutionInfo.solutionDir + ".vs\\config\\applicationhost.config";
    index_1.printf("Updating applicationhost.config %1...", appHostFileName);
    var appHost = fs.readFileSync(appHostFileName, "utf8");
    xml2js.parseString(appHost, function (err, result) {
        /* tslint:disable */
        var sites = result["configuration"]["system.applicationHost"][0]["sites"][0]["site"];
        /* tslint:enable */
        for (var i = 0; i < sites.length; i++) {
            /* tslint:disable */
            if (sites[i]["$"]["name"] === solutionData.solutionInfo.ajsWebAppProject) {
                /* tslint:enable */
                index_1.printf("Adding virtual directory: %1 => %2", projectConfig.sourcesPath + "/" + project.projectName, project.projectDir);
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
        var builder = new xml2js.Builder({
            renderOpts: {
                pretty: true,
                newline: "\r\n"
            }
        });
        var xml = builder.buildObject(result);
        // waits while the file is ready to write
        function writeAppHost() {
            try {
                index_1.printf("Updating applicationhost.config. file...");
                fs.writeFileSync(appHostFileName, xml, "utf8");
                index_1.printf("Applicationhost.config updated succesfully.");
            }
            catch (e) {
                if (e.code !== "EBUSY") {
                    throw e;
                }
                else {
                    index_1.printf("Waiting for applicationhost.config to be ready for writing...");
                    writeAppHost();
                }
            }
        }
        writeAppHost();
    });
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
function processProject(project, projectConfig, ajsWebAppProject, ajsWebAppProjectConfig, solutionData) {
    "use strict";
    index_1.printf("Processing project %1...", project.projectName);
    if (projectConfig.projectIgnore) {
        index_1.printf("Project has ignore flag set. Skipping.");
        return;
    }
    // process javascript and map files
    processJSFiles(project, projectConfig, ajsWebAppProject, ajsWebAppProjectConfig);
    // process wwwroot folder (process LESS/SASS, minify CSS and HTML files, copy the rest of resources
    processWWWRoot(project, projectConfig, ajsWebAppProject, ajsWebAppProjectConfig);
    // setup sources virtual directories to %solutiondir%/.vs/config/applicationhost.config if solution configuration = Debug
    setupSrcVirutalDirs(project, projectConfig, ajsWebAppProject, ajsWebAppProjectConfig, solutionData);
    index_1.printf("Processing project done.");
}
/**
 * process the solution
 * @param solutionData .sln data including projects and their congigurations
 */
function processSolution(solutionData) {
    "use strict";
    // print solution info
    printSolutionInfo(solutionData);
    index_1.printf("Loading main AjsWebApp config");
    // get WebAppProject
    var ajsWebAppProject = getProject(solutionData.solutionInfo.ajsWebAppProject, solutionData);
    if (ajsWebAppProject === null) {
        throw new Error("AjsWebApp project '" + solutionData.solutionInfo.ajsWebAppProject + "' could not be found.");
    }
    // get AjsWebApp project configuration (merge the main with Debug or Release)
    var ajsWebAppCfg = getProjectConfig(solutionData.solutionInfo.ajsWebAppProject, cfg.defaultConfig(vs.getSolutionConfiguration(solutionData)), solutionData);
    index_1.printf();
    // cleanup the src virtual directories in applicationhost.config (if exists)    
    cleanApplicationHost(solutionData);
    index_1.printf();
    // process projects
    index_1.printf("Processing projects...");
    index_1.printf();
    // go for all projects in the solution
    for (var i = 0; i < solutionData.projects.length; i++) {
        index_1.printf("Processing project %1", solutionData.projects[i].projectName);
        // process only projects not in ignoredProjects
        if (ajsWebAppCfg.ignoredProjects.indexOf(solutionData.projects[i].projectName) === -1) {
            // get project config and process project (projectIgnore option is evaluated in processProject)
            var pcfg = getProjectConfig(solutionData.projects[i].projectName, ajsWebAppCfg, solutionData);
            processProject(solutionData.projects[i], pcfg, ajsWebAppProject, ajsWebAppCfg, solutionData);
        }
        else {
            index_1.printf("Project '%1' is in the list of ignored projects. Skipping", solutionData.projects[i].projectName);
        }
        index_1.printf();
    }
    index_1.printf("Processing projects finished");
    index_1.printf();
    // generate the cache.manifest if offline support is required in the main web app config file
    // todo: generate cache.manifest
}
/**
 * cleans the applicationhost.config from the virtual directories created during previous build
 * @param solutionData .sln data including projects and their congigurations
 */
function cleanApplicationHost(solutionData) {
    "use strict";
    var project = getProject(solutionData.solutionInfo.ajsWebAppProject, solutionData);
    var appHostFileName = solutionData.solutionInfo.solutionDir + ".vs\\config\\applicationhost.config";
    var appHost = fs.readFileSync(appHostFileName, "utf8");
    index_1.printf("Cleaning the application.host config file (%1)", appHostFileName);
    xml2js.parseString(appHost, function (err, result) {
        /* tslint:disable */
        var sites = result["configuration"]["system.applicationHost"][0]["sites"][0]["site"];
        /* tslint:enable */
        // find propper site
        for (var i = 0; i < sites.length; i++) {
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
        var builder = new xml2js.Builder({
            renderOpts: {
                pretty: true,
                indent: "  ",
                newline: "\r\n"
            }
        });
        var xml = builder.buildObject(result);
        // waits while the file is ready to write
        function writeAppHost() {
            try {
                index_1.printf("Updating applicationhost.config: %1...", project.projectName);
                fs.writeFileSync(appHostFileName, xml, "utf8");
                index_1.printf("Applicationhost.config updated succesfully...");
            }
            catch (e) {
                if (e.code !== "EBUSY") {
                    throw e;
                }
                else {
                    index_1.printf("Waiting for applicationhost.config to be ready for writing...");
                    writeAppHost();
                }
            }
        }
        writeAppHost();
    });
}
/**
 * cleans the js target folders
 * @param solutionData .sln data including projects and their congigurations
 */
function cleanJSTargetFolders(solutionData) {
    "use strict";
    // get WebAppProject
    var ajsWebAppProject = getProject(solutionData.solutionInfo.ajsWebAppProject, solutionData);
    if (ajsWebAppProject === null) {
        throw new Error("AjsWebApp project '" + solutionData.solutionInfo.ajsWebAppProject + "' could not be found.");
    }
    // get AjsWebApp project configuration (merge the main with Debug or Release)
    var ajsWebAppCfg = getProjectConfig(solutionData.solutionInfo.ajsWebAppProject, cfg.defaultConfig(vs.getSolutionConfiguration(solutionData)), solutionData);
    for (var i = 0; i < solutionData.projects.length; i++) {
        var pcfg = getProjectConfig(solutionData.projects[i].projectName, ajsWebAppCfg, solutionData);
        if (!pcfg.projectIgnore &&
            ajsWebAppCfg.ignoredProjects.indexOf(solutionData.projects[i].projectName) === -1) {
            var dir_1 = path.normalize(ajsWebAppProject.projectDir + pcfg.jsTargetFolder);
            var files = fs.readdirSync(dir_1);
            for (var j = 0; j < files.length; j++) {
                var file = path.normalize(dir_1 + "/" + files[j]);
                var stat = fs.statSync(file);
                if (stat.isDirectory()) {
                    index_3.rmdir(file);
                }
                else {
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
function cleanWWWRoot(solutionData) {
    "use strict";
    // load the clean.json
    var cleanFileName = path.normalize("./buildtools/clean.json");
    if (fs.existsSync(cleanFileName)) {
        index_1.printf("Cleaning WWWRoot");
        // load clean file
        var cleanFile = fs.readFileSync(cleanFileName, "utf8");
        var clean = JSON.parse(cleanFile);
        // prepare lets
        var i = void 0;
        var dirs = [];
        // for all records in the clean file
        for (i = 0; i < clean.length; i++) {
            var file = path.normalize(clean[i]);
            if (fs.existsSync(file)) {
                var stat = fs.statSync(file);
                if (stat.isDirectory()) {
                    // prepare dir for deletion
                    dirs.push(file);
                }
                else {
                    // delete file
                    index_1.printf("Removing file %1", file);
                    fs.unlinkSync(file);
                }
            }
        }
        // for all dirs found in clean file
        for (i = dirs.length - 1; i >= 0; i--) {
            // remove dir
            index_1.printf("Removing dir %1", dirs[i]);
            try {
                fs.rmdirSync(dirs[i]);
            }
            catch (e) {
                index_1.printf("Dir %1 can't be removed: %2", dirs[i], e);
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
function isTaskRunning(taskName) {
    "use strict";
    var pidFileName = path.normalize("./buildtools/" + taskName + ".pid");
    if (fs.existsSync(pidFileName)) {
        var pid = fs.readFileSync(pidFileName, "ASCII");
        var results = ps.query({ pid: pid });
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
function startTask(taskName) {
    "use strict";
    // check if the task is not running already
    if (isTaskRunning(taskName)) {
        index_1.printf();
        index_1.printf("Gulp task '%1' is running already!", taskName);
        index_1.printf("Exiting running task: %1...", taskName);
        index_1.printf();
        return false;
    }
    // write the PID file
    var pidFileName = path.normalize("./buildtools/" + taskName + ".pid");
    fs.writeFileSync(pidFileName, process.pid);
    // prepare process.on-exit handler
    process.on("exit", function (code) {
        index_1.printf("Exiting running task: %1...", taskName);
        if (fs.existsSync(pidFileName)) {
            fs.unlinkSync(pidFileName);
        }
    });
    // prepare process.on-uncaughtException handler
    process.on("uncaughtException", function (code) {
        index_1.printf("Exitting process of task %1 on exception %2", taskName, code);
        if (fs.existsSync(pidFileName)) {
            fs.unlinkSync(pidFileName);
        }
    });
    return true;
}
var awatcherInstance = null;
/**
 * Cleans the wwwroot and js folders after the VS AjsWebApp clean action
 * @return Cleaner promise or process exit code if something fails
 */
function cleaner() {
    "use strict";
    var solutionData = vs.getSolution();
    if (solutionData !== null) {
        return new Promise(function (resolve, reject) {
            // pause awatcher and wait until it gets paused
            pauseWatcher(
            // awatcher-paused-callback
            function () {
                // do the clean work
                cleanApplicationHost(solutionData);
                cleanJSTargetFolders(solutionData);
                cleanWWWRoot(solutionData);
                // resume the awatcher and wait until it gets resumed
                resumeWatcher(
                // awatcher-resumed-callback
                function () {
                    resolve();
                });
            });
        });
    }
    else {
        index_1.printf("Failed to obtain solution information!");
        index_1.printf();
        return process.exit(1);
    }
}
/**
 * Wrapper for FS.watch/FSWatcher allowing pause/resume
 * @return promise of the awathcer resolved in case the Gulpfile.js is changed, otherwise its infinite loop
 */
function awatcher() {
    "use strict";
    return new Promise(function (resolve, reject) {
        awatcherInstance = {};
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
        function fileChangeCallback(event, file) {
            file = path.normalize(awatcherInstance.path + "/" + file);
            var awFile;
            if (awatcherInstance.files.hasOwnProperty(file)) {
                awFile = awatcherInstance.files[file];
            }
            else {
                awFile = null;
            }
            if (event === "rename") {
                if (awFile !== null) {
                    event = "unlink";
                    delete (awatcherInstance.files[file]);
                }
                else {
                    event = "change";
                }
            }
            if (event === "change") {
                if (awFile === null) {
                    event = "add";
                    var f = {};
                    awatcherInstance.files[file] = f;
                }
            }
            if (awatcherInstance.callback) {
                awatcherInstance.callback({ event: event, path: file });
            }
        }
        awatcherInstance._doStart = function () {
            index_1.printf("Starting FS watcher...");
            awatcherInstance.params.persistent = true;
            awatcherInstance.params.recursive = true;
            awatcherInstance.files = {};
            // get initial state of the watched directory
            var files = index_2.dir(awatcherInstance.path);
            for (var i = 0; i < files.length; i++) {
                var f = {};
                if (fs.existsSync(files[i])) {
                    f.stat = fs.statSync(files[i]);
                    awatcherInstance.files[files[i]] = f;
                }
                else {
                    delete (awatcherInstance.files[files[i]]);
                }
            }
            // create FSWatcher instance
            awatcherInstance.watcher = fs.watch(awatcherInstance.path, awatcherInstance.params, fileChangeCallback);
            index_1.printf("FS Warcher started");
        };
        // start watching
        awatcherInstance.start = function (path, params, callback) {
            process.nextTick(function () {
                awatcherInstance.path = path;
                awatcherInstance.callback = callback;
                awatcherInstance.params = params;
                awatcherInstance._doStart();
            });
        };
        // pause watching
        awatcherInstance.pause = function () {
            process.nextTick(function () {
                index_1.printf("Closing FS watcher...");
                awatcherInstance.watcher.close();
                awatcherInstance.watcher = null;
                index_1.printf("FS watcher closed.");
            });
        };
        // resume watching
        awatcherInstance.resume = function () {
            process.nextTick(function () {
                awatcherInstance._doStart();
            });
        };
        // stop watching
        awatcherInstance.stop = function () {
            process.nextTick(function () {
                if (awatcherInstance.watcher !== null) {
                    index_1.printf("Closing FS watcher...");
                    awatcherInstance.watcher.close();
                    awatcherInstance.watcher = null;
                    index_1.printf("FS watcher closed.");
                }
                // printf(process._getActiveHandles());
                // printf(process._getActiveRequests());
                resolve();
            });
        };
    });
}
/**
 * Watches the solution directory for file changes
 * @returns If the watcher is running already the undefined will be returned. Otherwise gulp.watch object will be returned.
 */
function watcher() {
    "use strict";
    var errorFlag = false;
    var paused = false;
    var solutionData;
    var ajsWebAppCfg;
    var ajsWebAppProj;
    var projectDirs;
    var watchPath;
    var gulpfilestats = fs.statSync(__filename);
    var gf = fs.readFileSync(__filename, "utf8");
    var gulpfilesha = crypto.createHash("sha1").update(gf).digest("hex");
    /**
     * load solution during init, reload if solutionInfo file changes (usually on solution rebuild only)
     */
    function reloadSolution() {
        // load solution info
        index_1.printf("Loading solution info...");
        solutionData = vs.getSolution();
        // warning if solutionInfo.json not parsed correctly
        if (solutionData === null) {
            if (!errorFlag) {
                errorFlag = true;
                index_1.printf();
                index_1.printf("Unable to monitor file changes for un-built solution (./buildtools/solutionInfo.json is missing)!");
                index_1.printf("Build the solution first in order to be possible to collect the solution and projects information!");
                index_1.printf();
            }
        }
        else {
            errorFlag = false;
            // get AjsWebApp project
            ajsWebAppProj = getProject(solutionData.solutionInfo.ajsWebAppProject, solutionData);
            // get AjsWebApp project configuration (merge the main with Debug or Release)
            ajsWebAppCfg = getProjectConfig(solutionData.solutionInfo.ajsWebAppProject, cfg.defaultConfig(vs.getSolutionConfiguration(solutionData)), solutionData);
            // prepare project directories object
            /** @type { Object.<string, { jsSrc: string, wwwSrc: string }> } */
            projectDirs = {};
            // load directories of all projects
            for (var i = 0; i < solutionData.projects.length; i++) {
                var p = solutionData.projects[i];
                var pname = solutionData.projects[i].projectName;
                var pcfg = getProjectConfig(pname, ajsWebAppCfg, solutionData);
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
    function checkPausedAndResume() {
        if (!fs.existsSync(path.normalize(__dirname + "/buildtools/watcher.pause"))) {
            index_1.printf();
            index_1.printf("Resuming the watcher.");
            var gfs = fs.statSync(__filename);
            if (gfs.mtime !== gulpfilestats.mtime) {
                var gf_1 = fs.readFileSync(__filename, "utf8");
                var sha = crypto.createHash("sha1").update(gf_1).digest("hex");
                index_1.printf(sha, gulpfilesha);
                if (sha !== gulpfilesha) {
                    index_1.printf();
                    index_1.printf("Gulpfile has changed. Exiting.");
                    /* tslint:disable */
                    index_1.printf("To apply changes to the Gulpfile.js restart the watcher by closing and openning the solution or by doubleclicking Task Runner Explorer -> Gulpfile.js -> Tasks -> projectOpen");
                    /* tslint:enable */
                    index_1.printf();
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
            index_1.printf("Watcher is resumed.");
            index_1.printf();
        }
        else {
            setTimeout(checkPausedAndResume, 250);
        }
    }
    /**
     * watched file change callback
     * @param file added / changed / removed file
     */
    function fileChanged(file) {
        // gulpfile / build tool modified -> exit watcher (changes needs to be applied by restarting watcher)
        if (file.path === __filename) {
            index_1.printf();
            index_1.printf("Gulpfile has changed. Exiting.");
            /* tslint:disable */
            index_1.printf("To apply changes to the Gulpfile.js restart the watcher by closing and openning the solution or by doubleclicking Task Runner Explorer -> Gulpfile.js -> Tasks -> projectOpen");
            /* tslint:enable */
            index_1.printf();
            awatcherInstance.stop();
            return;
        }
        // solutionInfo.json modified -> reload solution info
        if (file.path.lastIndexOf("solutionInfo.json") !== -1 && !paused) {
            index_1.printf("Solution configuration has changed.");
            reloadSolution();
            index_1.printf();
            index_1.printf("Watching '%1' for changes...", watchPath);
            index_1.printf();
            return;
        }
        // watcher.reload file exists -> force watcher to reload solution info
        if (file.path.lastIndexOf("watcher.reload") !== -1 && !paused) {
            index_1.printf("Solution configuration has changed.");
            reloadSolution();
            fs.unlinkSync(file.path);
            index_1.printf();
            index_1.printf("Watching '%1' for changes...", watchPath);
            index_1.printf();
            return;
        }
        // watcher pause added / changed -> pause
        if (file.path.lastIndexOf("watcher.pause") !== -1 && (file.event === "add" || file.event === "change") && !paused) {
            index_1.printf();
            index_1.printf("Pausing the watcher.");
            awatcherInstance.pause();
            paused = true;
            fs.writeFileSync(path.normalize(__dirname + "/buildtools/watcher.waiting"), ".");
            index_1.printf("Watcher is paused.");
            index_1.printf();
            checkPausedAndResume();
            return;
        }
        // project related resource resoruce added/modified (i.e. compiled)
        if (!paused && solutionData !== null) {
            for (var key in projectDirs) {
                if (projectDirs.hasOwnProperty(key)) {
                    var exists = false;
                    var isDir = false;
                    var isVsTMP = false;
                    if (fs.existsSync(file.path)) {
                        try {
                            var stat = fs.statSync(file.path);
                            exists = true;
                            isDir = stat.isDirectory();
                        }
                        catch (e) {
                            exists = false;
                            isDir = false;
                        }
                    }
                    if (isDir) {
                        if (file.path.substr(0, projectDirs[key].project.projectDir.length) === projectDirs[key].project.projectDir) {
                            // printf("Monitored project '%1' (folder change) '%2': %3", key, file.event, file.path);
                        }
                    }
                    else {
                        if (file.path[file.path.length - 1] === "~" || path.extname(file.path).toLowerCase() === ".tmp") {
                            isVsTMP = true;
                        }
                        if (file.event === "change" || file.event === "add") {
                            // process project js file
                            if (file.path.substr(0, projectDirs[key].jsSrc.length) === projectDirs[key].jsSrc) {
                                if (path.extname(file.path) === ".js") {
                                    // printf("Monitored project '%1' (/bin/**/*.js change) '%2': %3", key, file.event, file.path);
                                    processJSFile(file.path, projectDirs[key].project, projectDirs[key].projectConfig, ajsWebAppProj, ajsWebAppCfg);
                                }
                            }
                            // process project wwwroot file
                            if (file.path.substr(0, projectDirs[key].wwwSrc.length) === projectDirs[key].wwwSrc && !isVsTMP) {
                                // printf("Monitored project '%1' (/wwwroot/**.* change) '%2': %3", key, file.event, file.path);
                                // get relative path to file
                                var relpath = file.path.substr(projectDirs[key].wwwSrc.length);
                                // compute absolute path to target
                                var srcabspath = path.normalize(projectDirs[key].project.projectDir + "/" + projectDirs[key].projectConfig.wwwRootSourceFolder + "/" + relpath);
                                // compute target path
                                var tgtabspath = path.normalize(ajsWebAppProj.projectDir + "/" + relpath);
                                // load the clean file
                                var clean = JSON.parse(fs.readFileSync(path.normalize(ajsWebAppProj.projectDir + "/buildtools/clean.json"), "utf8"));
                                // create folder structure
                                if (!fs.existsSync(path.dirname(tgtabspath))) {
                                    // check if dir segments are in the clean file
                                    var tgtprojpath = path.normalize(ajsWebAppProj.projectDir);
                                    var tmp = path.dirname(relpath).split(path.sep);
                                    var dir_2 = tgtprojpath;
                                    for (var i = 0; i < tmp.length; i++) {
                                        if (tmp[i] !== "") {
                                            dir_2 = path.normalize(dir_2 + "/" + tmp[i]);
                                            if (!fs.existsSync(dir_2)) {
                                                fs.mkdirSync(dir_2);
                                                clean.push(dir_2);
                                            }
                                        }
                                    }
                                    // create dir if not exist
                                    fs.mkdirsSync(path.dirname(srcabspath));
                                }
                                processWWWRootFile(srcabspath, tgtabspath, clean, projectDirs[key].project, projectDirs[key].projectConfig, ajsWebAppProj, ajsWebAppCfg);
                                fs.writeFileSync(path.normalize(ajsWebAppProj.projectDir + "/buildtools/clean.json"), JSON.stringify(clean), "utf8");
                                index_1.printf();
                                /*    for (i = 0; i < files.length; i++) {
                                
                                        let relpath: string = files[i].substr(wwwrootPath.length);
                                
                                        let stat: fs.Stats = fs.statSync(files[i]);
                                
                                        if (stat.isDirectory()) {
                                
                                            try {
                                                fs.mkdirSync(path.normalize(targetRoot + relpath));
                                                toClean.push(targetRoot + relpath);
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
                                
                                    fs.writeFileSync(path.normalize(targetRoot + "/buildtools/clean.json"), JSON.stringify(toClean, null, 2), "utf8");
                                                                */
                                index_1.printf("");
                            }
                        }
                        else {
                            // delete js file
                            if (file.path.substr(0, projectDirs[key].jsSrc.length) === projectDirs[key].jsSrc) {
                                if (path.extname(file.path) === ".js") {
                                    index_1.printf("Monitored project '%1' (/bin/**/*.js change) '%2': %3", key, file.event, file.path);
                                }
                            }
                            // delete wwwroot file
                            if (file.path.substr(0, projectDirs[key].wwwSrc.length) === projectDirs[key].wwwSrc && !isVsTMP) {
                                // remove from clean.js
                                index_1.printf("Monitored project '%1' (/wwwroot/**.* change) '%2': %3", key, file.event, file.path);
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
    index_1.printf();
    // start gulp watcher and return its promise
    watchPath = solutionData.solutionInfo.solutionDir;
    index_1.printf("Watching '%1' for changes...", watchPath);
    index_1.printf();
    var awatch = awatcher();
    awatcherInstance.start(watchPath, {}, fileChanged);
    return awatch;
}
/**
 * Issues command to pause watcher by creating the watcher.pause and calls callback once the watcher gets paused
 * @param pausedCallback Callback to be called when wather gets paused
 */
function pauseWatcher(pausedCallback) {
    "use strict";
    function waitPaused() {
        if (isTaskRunning("watcher") && !fs.existsSync(path.normalize(__dirname + "/buildtools/watcher.waiting"))) {
            setTimeout(waitPaused, 100);
        }
        else {
            index_1.printf("Watcher is paused.");
            pausedCallback();
        }
    }
    if (isTaskRunning("watcher")) {
        index_1.printf(path.normalize(__dirname + "/buildtools/watcher.pause"));
        fs.writeFileSync(path.normalize(__dirname + "/buildtools/watcher.pause"), ".");
        index_1.printf("Waiting for watcher to be paused...");
        waitPaused();
    }
    else {
        pausedCallback();
    }
}
/**
 * Issues command to resume watcher by deleting the watcher.pause and calls callback once the watcher gets resumed
 * @param { function() } resumedCallback Callback to be called when the watcher gets resumed
 */
function resumeWatcher(resumedCallback) {
    "use strict";
    function waitResumed() {
        if (isTaskRunning("watcher") && fs.existsSync(path.normalize(__dirname + "/buildtools/watcher.waiting"))) {
            setTimeout(waitResumed, 100);
        }
        else {
            index_1.printf("Watcher is resumed.");
            resumedCallback();
        }
    }
    if (isTaskRunning("watcher")) {
        if (fs.existsSync(path.normalize(__dirname + "/buildtools/watcher.pause"))) {
            fs.unlinkSync(path.normalize(__dirname + "/buildtools/watcher.pause"));
        }
        index_1.printf("Waiting for watcher to be resumed...");
        waitResumed();
    }
    else {
        resumedCallback();
    }
}
/**
 * Forces watcher to reload solution info by creating the watcher.reload file
 */
function watcherReloadSolution() {
    "use strict";
    if (isTaskRunning("watcher")) {
        fs.writeFileSync(path.normalize(__dirname + "/buildtools/watcher.reload"), ".", "utf8");
    }
}
// ********************** Visual Studio events -> Gulp tasks ************************
/**
 * Start monitoring of file changes
 */
gulp.task("projectOpen", function () {
    copyright();
    return watcher();
});
/**
 * Complete cleanup of wwwroot and js dirs (except project files and readme.md)\
 */
gulp.task("clean", function () {
    copyright();
    return cleaner();
});
/** No action is taken on beforebuild event */
gulp.task("beforeBuild", function () {
    copyright();
    return new Promise(function (resolve, reject) {
        if (isTaskRunning("watcher")) {
            pauseWatcher(function () {
                resolve();
            });
        }
        else {
            resolve();
        }
    });
});
/** Based on the solution configuration (Debug/Release perform appropriate actions) */
gulp.task("afterBuild", function () {
    copyright();
    return new Promise(function (resolve, reject) {
        var solutionData = vs.getSolution();
        if (solutionData !== null) {
            processSolution(solutionData);
        }
        if (isTaskRunning("watcher")) {
            resumeWatcher(function () {
                resolve();
            });
        }
        else {
            resolve();
        }
    });
});
/** There is no default action now. Everything must be done in VS */
gulp.task("default", function () {
    copyright();
    usage();
    index_1.printf();
});
