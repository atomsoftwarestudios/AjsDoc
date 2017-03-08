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

export enum SolutionConfiguration {
    Debug,
    Release
}

export enum TargetWebServer {
    IIS
}

export enum GulpUglifyPreserveComments {
    all,
    license,
    function
}

export interface IGulpUglifyOutputOptions {
}

export interface IGulpUglifyCompressOptions {
}

/* tslint:disable */
export interface IGulpUglifyOptions {
    mangle: boolean;
    output: IGulpUglifyOutputOptions;
    compress: false | IGulpUglifyCompressOptions;
    preserveComments: GulpUglifyPreserveComments;
}
/* tslint:enable */

export interface IAjsWebAppConfig {

    // *******************************************************
    // basic options
    // *******************************************************

    /** 
     * Projects ignored from processing
     * config files: Main AjsWebAppConfig
     * default: [];
     */
    ignoredProjects?: string[];

    /**
     * removes the complete Visual Studio project from the processing (ignored for AjsWebApp)
     * config files: Main AjsWebAppConfig, Project AjsWebAppConfig
     * default: false
     */
    projectIgnore?: boolean;

    // *******************************************************
    // source folders and files options
    // *******************************************************

    /**
     * specifies source folders for javascript files (usually TypeScript compiled output)
     * config files: Main AjsWebAppConfig, Project AjsWebAppConfig
     * default: ["/bin"]
     */
    jsSourceFolder?: string;

    /**
     * specifies the wwwroot folder of the project
     * config files: Main AjsWebAppConfig, Project AjsWebAppConfig
     * default: "/wwwroot"
     */
    wwwRootSourceFolder?: string;

    // *******************************************************
    // web server & source mapping files options
    // *******************************************************

    /**
     * target web server (the web.config / .htaccess files are updated automatically)
     * config files: Main AjsWebAppConfig
     * default: TargetWebServer.IIS
     * ! only IIS is supported now !
     */
    targetWebServer?: TargetWebServer;

    /**
     * path where sources virtual directories will be created
     * config files: Main AjsWebAppConfig
     * default /src
     */
    sourcesPath?: string;

    /**
     * specifies if generation / transferring of source maps is allowed
     * config files: Main AjsWebAppConfig, Project AjsWebAppConfig
     * default: true
     */
    enableSourceMaps?: boolean;

    // *******************************************************
    // target folders options
    // *******************************************************

    /**
     * target folder for JavaScript files
     * config files: Main AjsWebAppConfig
     * default: "/js"
     */
    jsTargetFolder?: string;

    /**
     * specifies if the project folder will be created in the target js folder
     * config files: Main AjsWebAppConfig, Project AjsWebAppConfig
     * default: false
     */
    jsCreateProjectFolder?: boolean;

    // *******************************************************
    // offline application support options
    // *******************************************************

    /**
     * specifies if the cache.manifest file will be generated
     * config files: Main AjsWebAppConfig, Project AjsWebAppConfig
     * default: false
     */
    offlineSupport?: boolean;

    /**
     * specifies file url's to be cached in the application cache
     * config files: Main AjsWebAppConfig, Project AjsWebAppConfig
     * default: []
     */
    offlineFiles?: string[];

    // *******************************************************
    // css Processing options
    // *******************************************************

    /**
     * enables/disables processing of .less & .html/.htm files
     * config files: Main AjsWebAppConfig, Project AjsWebAppConfig
     * default: true
     */
    processLESS?: boolean;

    /**
     * command line options for the less processor
     * config files: Main AjsWebAppConfig, Project AjsWebAppConfig
     * default: {}
     */
    lessOptions?: any;

    /**
     * enables/disables processing of .sass & .html/.htm files
     * config files: Main AjsWebAppConfig, Project AjsWebAppConfig
     * default: true
     */
    processSASS?: boolean;

    /**
     * command line options for the sass processor
     * config files: Main AjsWebAppConfig, Project AjsWebAppConfig
     * default: {}
     */
    sassOptions?: any;

    // *******************************************************
    // minification options
    // *******************************************************

    /**
     * specifies if CSS resources will be minified
     * config files: Main AjsWebAppConfig, Project AjsWebAppConfig
     * default: false
     */
    jsMinify?: boolean;

    /**
     * gulp-uglify options
     * config files: Main AjsWebAppConfig, Project AjsWebAppConfig
     * default: {}
     */
    jsMinifyOptions?: any;

    /**
     * specifies if CSS resources will be minified
     * config files: Main AjsWebAppConfig, Project AjsWebAppConfig
     * default: false
     */
    cssMinify?: boolean;

    /**
     * gulp-clean-css options
     * config files: Main AjsWebAppConfig, Project AjsWebAppConfig
     * default: {}
     */
    cssMinifyOptions?: any;

    /**
     * specifies if HTML resources will be minified
     * config files: Main AjsWebAppConfig, Project AjsWebAppConfig
     * default: false
     */
    htmlMinify?: boolean;

    /**
     * gulp-html-min options
     * config files: Main AjsWebAppConfig, Project AjsWebAppConfig
     * default: {}
     */
    htmlMinifyOption?: any;

    // *******************************************************
    // packaging options
    // *******************************************************

    // not implemented yet as there no support in Ajs Framework yet
    // it is planned to support uncompressed / compressed archive pacakges (such as zip / 7zip / tar.gz / tar.bz)
    // by the Ajs Resource Manager so it will be possible to pack all resources to the single, fucking big ( .fbp )
    // package, and load it by Ajs to appropriate storage resource by resource

}

export function defaultConfig(solutionConfiguration: SolutionConfiguration): IAjsWebAppConfig {

    "use strict";

    let baseConfig: IAjsWebAppConfig = {
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
    } else {
        if (solutionConfiguration === SolutionConfiguration.Debug) {
            return defaultConfigDebug(baseConfig);
        } else {
            return defaultConfigRelease(baseConfig);
        }
    }

}

function defaultConfigDebug(baseConfig: IAjsWebAppConfig): IAjsWebAppConfig {

    "use strict";
    return baseConfig;

}

function defaultConfigRelease(baseConfig: IAjsWebAppConfig): IAjsWebAppConfig {

    "use strict";

    baseConfig.enableSourceMaps = false;
    baseConfig.jsMinify = true;
    baseConfig.cssMinify = true;
    baseConfig.htmlMinify = true;

    return baseConfig;

}

export function merge(solutionConfig: SolutionConfiguration, cfg1: IAjsWebAppConfig, cfg2: IAjsWebAppConfig): IAjsWebAppConfig {

    "use strict";

    let cfg: IAjsWebAppConfig = defaultConfig(solutionConfig);

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
