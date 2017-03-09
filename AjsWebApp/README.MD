# AjsWebApp
#### The Ajs Framework Application project with post-build tasks

Copyright &copy;2017 Atom Software Studios<br>
Released under the MIT License

---

AjsWebApp for Visual Studio (furhtermore VS) is a startup application project including a build toolset allowing easier development,
debugging & bundling of the Web Applications using the HTML Application With TypeScript project templates. It fully automates the
post-build tasks such as IIS Express configuration for debugging, resources copying or resources minification based on the configuration.

The tool set is focused on applications developed using the TypeScript and based on Ajs Framework. Build tools are developed in
the TypeScript language and are included in the project. Additionaly, standard Node and Gulp modules are used.

---

### Table of Contents

- [Features](#features)
- [Planned Features](#planned-features)
- [Usage](#usage)
  - [Prerequisites](#prerequisites)
  - [AjsWebApp Visual Studio project](#ajswebapp-visual-studio-project)
  - [Application, library and content projects](#application-library-and-content-projects)
  - [Using pre-created solution & project templates](#using-pre-created-solution--project-templates)
  - [AjsWebApp post-build configuration files](#ajswebapp-post-build-configuration-files)
  - [WebPublish & .pubxml](#webpublish--pubxml)
  - [.gitignore](#gitignore)
- [Known issues](#known-issues)
- [License](#license)
- [Contribution](#contribution)

---

### Features

Please note these feauters requires specific setup for each project in the VS solution to work as expected (see [Usage] section for details).

- Configurable behavior for all projects in the solution

- Full support for MSBuild so the solution can be built incrementally on the build server
  - Build/Rebild/Clean support

- Multiple HTML Web Application with TypeScript projects in the solution while the logical and physical representation of files on the disk
  is... normal. Currently, it is possible to maintain the solution in the same way as C# application solutions while the followig capabilities
  are still possible

- Dependencies of one project on others (the build project build order) support
  - standard VS way of defining project dependencies using the References branch in the project 

- Debugging of TypeScript code
  - for all projects in the solution
  - directly in the VS (and IE11) or externally in the Browser (such as Chrome or Edge)
  - with TypeScript sources using map files
  - automatic update of the applictionhost.config file to allow mapping of sources to wwwroot using the IIS virtual directories


- Debug/Release configurations of the solution
  - different, configurable, packaging behavior for both configuration types

- Watching for file changes so it is not necessary to rebuild the solution all the time when a small change is made
  (based on node.js fs.watch / chokidar / gulp-watcher modules)
 
- Configurable of processing LESS/SASS files

- Configurable JS/HTML/CSS minification using standard, configurable gulp-* modules

- Support for offline applications
  - generates / updates cache.manifest based on VS solution changes

- Support for Web Application Publishing (WebDeploy)

---

### Planned features

- Ajs framework / Ajs apps TypeScript generated JS files optimizations, especially for release configurations
  - TypeScript post-processor supporting // #define, // #ifdef/#endif comments
  - Optimalizations to make the code shorter:
    - TypeScript namespace joiner
    - Optimizer for object property accessors

- Ajs framework resources bundling (not supported by Ajs Framework yet)

- Automated unit testing

---

### Usage

---

#### Prerequisites

- Visual Studio (tested with 2015 update 3 only), should be working with any edition (Ent, Pro, Community)
- Node.js with NPM package manager (tested with 7.3.0 32bit and 7.6.0 64bit)
  - Node.js must be registered in the PATH environment variable
  - [Project web](https://nodejs.org/en/)
  - [GitHub](https://github.com/nodejs)
  - Downloads: [LTS](https://nodejs.org/en/download/) or [All verisons](https://nodejs.org/dist/)
- Task Runner Explorer Visual Studio Extension (should be included in VS directly)
  - see [Task Runners in Visual Studio](https://blogs.msdn.microsoft.com/webdev/2016/01/06/task-runners-in-visual-studio-2015/) for details
- TypeScript 2.2 Visual Studio Extension
  - [Project page](https://www.typescriptlang.org/)
  - [GitHub](https://github.com/Microsoft/TypeScript)
  - [VS 2015 update 3 Extension download](http://download.microsoft.com/download/6/D/8/6D8381B0-03C1-4BD2-AE65-30FF0A4C62DA/TS-2.2-dev14update3-20170221.2/TypeScript_Dev14Full.exe)

---

#### AjsWebApp Visual Studio project

> It is not recommended to use the AjsWebApp project for development of the applications backends although it is possible.
 Backends should be developed separately from the frontend projects.

The project is created using the HTML Application with TypeScript project template (as all projects in the solution should be created
from this template to support Web and TypeScript tooling). The AjsWebApp project must be a Startup project of the solution and dependencies
to other projects / other projects on other projects should be set correctly by developer to make sure the AjsWebApp project will be built
as last during the solution build / rebuild. All resources supposed to be published to the web server are copied or processed and copied 
to the AjsWebApp project on solution / project build event or by the file watcher on a file change (watcher is active only in case the
solution was built and at least one resource was copied to the AjsWebApp project). Watcher is activated automatically when the solution
or project is oppened in Visual Studio. In case of crash or developer needs it is possible to start/stop watcher using the Task Runner
Explorer extension. To stop the watcher it is necessary to close the projectOpen console. To start it manually it is necessary to double
click the projectOpen Gulp task in the Task Runner Explorer Gulpfile.js tree. Watcher is stopped automatically when the Gulpfile.js is
modified. In this case it is necessary to run it manually again.

To support tasks related to the build process the Gulp tasks, Gulp modules and Node.js modules are used. 3rd party modules are managed by
the NPM package manager for Node.js. NPM modules are not included in the Git repository but are installed automatically by Visual Studio
one the AjsWebApp project containing the package.json file is oppened.

Internal modules are developed in TypeScript and compiles to index-ts.js under ./buildtools/<module_name> folder. MS build postbuild task
copies compiled index-ts.js to index.js file. This is neccessary because the tooling must alive the solution / AjsWebApp project Clean action
and standard behavior is the TypeScript compiler removes compiled files from the folder. So thats the reason why TS files are not directly
named index.ts and does not compile directly to index.js.

Internal modules as well as Gulpfile.js are included in the AjsWebApp project so it is possible to modify the code and use it immediately
after the AjsWebApp project rebuild. If the Gulpfile.js file is modified the project rebuild is not required as the file is watched by the
Task Runner Explorer and reloaded automatically in case of any change.

When AjsWebApp project build action is executed the solution / project information is loaded as well as the AjsWebApp.json configuration files
for each project. According to the solution / AjsWebApp configuration, files to be presented by the web server are processed / copied to the
AjsWebApp project and clean file is updated to keep track of changes made in order to be possible perform the clean action effectively. No
manual changes should be made on files supposed to be published in the AjsWebApp project. Changes should be allways made only in appropriate
source project.

Tooling is based on the Node.js / NPM / Gulp / Gulp-tools / Task Runner Explorer and additional internal JS modules (not placed in
NPM. Once the project is included in the Visual Studio solution the VS takes care of installing neccessary NPM modules automatically
and Task Runner Explorer (futhermore TRE) binds projectOpen event and build events to the Gulp tasks defined in the Gulp file.

The following Task Runned Explorer tasks are defined / bound to VS events:

Gulp task   | Event binding | Description
----------- | ------------- | ----------------------------------------------------------------
default     | none          | this is not bound to any event and just prints usage information
projectOpen | projectOpen   | runs the file watcher and performs configured actions on modified configured files / folders on the fly
clean       | clean         | pauses the watcher, cleans up the AjsWebApp from all files copied / processed to it and resumes the watcher
beforeBuild | beforeBuild   | pauses the watcher
afterBuild  | afterBuild    | copies / processes solution projects files according the configuration and resumes the watcher

Once one of events occurs on the AjsWebApp project the appropriate gulp task is executed by the Task Runner Explorer.

AjsWebApp gulp tasks loads Solution / Project / AsjConfig from:

File                                                | Description
--------------------------------------------------- | -------------------------------------------------------------
buildtools/solutionInfo.json**                      | The solutionInfo.json is created automatically by batch script placed in the project pre-build task. It contains information about the solution paths, configuration (Debug/Release configurations are currently supported only) and target platform (currently not used).
../<solution_name>.sln                              | Standard Visual Studio solution file (tested with version 14 only). This file is used to load information about the projects it contains.
../<project_dir>/AjsWebApp[.Debug\|.Release].json** | AjsWebApp packager configuration for the particullar VS project.

Once the configuration is loaded the appropriate action is executed internally inside the Gulpfile.js.

Additional files are automatically created to make clean action possible and to allow management of watcher from the separate node process / gulp task.

File                         | Description
---------------------------- | --------------------------------------------------------------------------------------------------
./buildtools/clean.json      | Contain list of files and folders created in the AjsWebApp project during build task or by watcher
./buildtools/watcher.pid     | Node process identifier for the gulp.projectOpen (watcher) task
./buildtools/watcher.pause   | If exists the watcher gets paused as soon as possible and creates wtcher.waiting file to inform it is paused
./buildtools/watcher.waiting | Used to inform other node processes the watcher is in paused state

---

#### Application, library and content projects

> Its highly recommended to split application and libraries to separate projects. Static web resources, such as HTML files, HTML templates, images or
stylesheets related to each library or application can be placed in the same project in the required directory structure. It is also possible to
separate static web resources to respective projects.

All projects used as sources for the final web application should be created using the HTML Application with TypeScript project template.
This is recommended because of VS extensions for web development need not be available in different project templates.

When application / library / content project is added to the solution everything inside of it can be deleted. All information related to
the debugging, web application server settings (web.config) and deployment information should be contained only in the AjsWebApp project
which can be downloaded separately and added to the solution using the Add -> Existing Project option in the Solution Explorer context
menu.

**TypeScript projects - recommended setup**

For all TypeScript project it is recommended to 

- organize them in the same way as C# projects are organized:
  - namespaces should have its own directory with .ts files declaring interfaces
  - classes and interfaces should be kept in separate files (one file for one class or interface) in the appropriate namespace folder
  - other types, such as consts or enums can be kept within the related class file

- compile all TypeScript files to single .js file

TypeScript projects should contain the tsconfig.json TypeScript configuration file. It is not recommended to use the TypeScript compiler
options in the Project Properties as it is very limited. Template for the TypeScipt project (see bellow) has support for different config
files for Debug/Release solution configurations. To allow this, the following pre-build script is used in the project:

      rem *** Prepare tsconfig.json based on the solution configuration (Debug/Release)
      echo // This file is generated automatically based on the Visual Studio Solution configuration. > "$(ProjectDir)tsconfig.json"
      echo // To configure TypeScript transpiller for given solution configuration use the tsconfig.common.json, tsconfig.Debug.json and tsconfig.Release.json >> "$(ProjectDir)tsconfig.json"
      echo { "compileOnSave": true, "extends" : "./tsconfig.$(ConfigurationName).json" } >> "$(ProjectDir)tsconfig.json"

Prepared templates contains the following TypeScript configuration files:

- *tsconfig.json* is a file generated automatically during the pre-build using the above mentioned script it. It should not be manipulated
  manually. It extends tsconfig.<Solution_Configuration>.json configuration file which is supposed to be modified to configure the TypeScript
  compilation process. The tsconfig.json contain compileOnSave option set to true by default. If this behavior is not required the pre-build
  script must be modified.

  tsconfig.json should look like this one:

      // This file is generated automatically based on the Visual Studio Solution configuration. 
      // To configure TypeScript transpiller for given solution configuration use the tsconfig.common.json, tsconfig.Debug.json and tsconfig.Release.json 
      { "compileOnSave": true, "extends" : "./tsconfig.Debug.json" } 


- *tsconfig.common.json* is default TypeScript compiler configuration file extended by both, .Debug and .Release configurations and should
  contain common options

  example tsconfig.common.json (used by Ajs framework):

      {
          // TypeScript 2.1 compiler configuration
          // COMMON CONFIGURATION (DEBUG/RELEASE)

          "compilerOptions": {
            // watch ts files for changes
            "allowJs": false,
            // generate .d.ts declaration file
            "declaration": true,
            // output file (single js file will be generated)
            "outFile": "./bin/ajs.js",
            // target ECMA version
            "target": "es5",
            // libs to be used during compilation
            "lib": [ "dom", "es2015.promise", "es5" ],
            // moule system to be used (none, AMD, CommonJS, UMD, System, ES2015)
            "module": "none",
            // don't emit any output when compilation fails
            "noEmitOnError": true,
            // don't emit BOM
            "emitBOM": false,
            // preserve const enums (don't delete from generated code)
            "preserveConstEnums": true,
            // implicit any
            "noImplicitAny": false,
            // TSX/JSX compilation support
            "jsx": "react",
            // ajs.debug.tsx is the React.js replacement but for Ajs debugging purposes only
            "reactNamespace": "AjsDebugTsxFactory"
          },
          "include": [
            "./**/*"
          ],
          "exclude": [
            "./bin/**/*"
          ]
      }

- *tsconfig.Debug.json* and *tsconfig.Release.json* files are extendinf the .common configuration files and are supposed to be used for
  the given solution build configuration.

  example tsconfig.Debug.json (used by Ajs framework)

      {
         // TypeScript 2.1 compiler configuration
         // DEBUG CONFIGURATION

         "extends": "./tsconfig.common.json",

         "compilerOptions": {
           // generate source maps
           "sourceMap": true,
           // map root
           "sourceRoot": "/src/Ajs",
           // remove comments
           "removeComments": false
         }
      }

  example tsconfig.Release.json (used by Ajs framework)


      {
         // TypeScript 2.1 compiler configuration
         // RELEASE CONFIGURATION

         "extends": "./tsconfig.common.json",

         "compilerOptions": {
            // generate source maps
            "sourceMap": false,
            // remove comments
            "removeComments": true
         }
      }

For Ajs Web Application and libraries projects it is recommended to compile all TypeScript files to single JavaScript file. Output
should be the /bin folder of the project as default AjsWebApp bundler config is set the bundler will look for .js files there.

Other web resources should be placed in wwwroot folder and its subfolders. This is different to default HTML App With TypeScript
project template - the wwwroot folder is root folder of the project there but to allow better TS code / Web resources / Config files
separation this way was chosen.

The project root is not used at all by the bundler itself (if not configured in a different way) so it can be empty or contain just 
.ts / .d.ts files to be compiled and the AjsWebApp post-build configuration files. For more information about the post-build project
sources processing configuration reffer to [AjsWebApp configuration files] section.

**Library projects**

- libraries should be kept in separate projects within the solution
- library compilation outpus should be a single .js file
- for TypeScript libraries it must be ensured the compiler ```declaration``` option is set to true
- reference to the compiled library .d.ts file must be added manually to the concrete project tsconfig file, i.e.
         ...

         "include": [
            "./**/*",
            "../MyLibrary/**/*.d.ts
          ],

         ...

- if 3rd party JavaScript libraries are bundled to a project
  - TypeScript compilator option allowJS must be set to true
  - Unminified versions should be used to avoid problems which can occur during the complete library minification
  - currently, there is no automatic mechanism for 3rd party dependency resolving so the order in which
    libraries are placed to the target .js and the order in which libraries are initialized must be done
    manually.
    - Unminified 3rd party JS files should be placed to the /lib/<order_number>-<library_name>/*.js folders
      - This will direct the TypeScript compiler to copy .js files to the ouptut .js file in required order
    - .d.ts files must have CopyToOutput property set to true in order to be possible to use them
      in dependant project
  - Initialization of external (3rd party) libraries in correct order should be done by the libinit script, such as:

      namespace ajs.libinit {

         "use strict";

         export let libinitdone: boolean;

         function initLib(): void {
            if (!libinitdone) {

              // 01 - es6-promise.js
              if (!(window as any).Promise) {
                 (window as any).Promise = (window as any).ES6Promise;
              }

              // 02 - someasynclibdependantones6promises.js
              someasynclibdependentones6promises.init();

              libinitdone = true;
            }
         }

         window.addEventListener("load", initLib);
      }


---

#### Using pre-created solution & project templates

TBD

---

#### AjsWebApp post-build configuration files

The configuration of the AjsWebApp bundler/packager can be different for each project in the solution and is stored
in the project root folder as AjsWebApp[.configuration].json file. Various configuration files can exist for appropriate VS
solution configuration so i.e. AjsWebApp.Debug.Config will be merged to default AjsWebApp.config before use in case the solution
configuration is set to Debug.

If there is no configuration file found for the project the default configuration will be used. By default is ment the config stored
within the AjsWebApp project. In this case the projectIgnore option is set to false for given project even if the AjsWebApp project
is configured to be ignored.

It is not necessary to setup all options as the configuration is always merged with default configuration. Options for minifiers
are not merged but replaced with the project configured options (if any)

Configuration file/s MUST be defined at least for the AjsWebApp project itself with projectIgnore option set to true. This will avoid
processing of the AjsWebApp project during the build and avoid watching file changes by the watcher.

The AjsWebAppSchema.json JSON shcema file is stored under the ./buildtools folder of the AjsWebApp project to make the
configuration easier.
See [Intellisense for JSON Schema in the JSON Editor](https://blogs.msdn.microsoft.com/webdev/2014/04/10/intellisense-for-json-schema-in-the-json-editor/)
article on MSDN blogs for details.

The following configuration options are available:

Options valid just for AjsWebApp project:

Option                | Type     | Default value | Description
--------------------- | -------- | ------------- | -----------
ignoredProjects       | string[] | []            | Specifies projects to be ignored from processing
targetWebServer       | string   | IIS           | target web server (the web.config / .htaccess files are updated automatically with virtual directories containing source files)
enableSourceMaps      | boolean  | true          | specifies if generation / transferring of source maps is allowed.
jsTargetFolder        | string   | /js           | target folder for JavaScript files
offlineSupport        | boolean  | false         | specifies if the cache.manifest file will be generated

Options valid for any project in the solution:

Option                | Type     | Default value | Description
--------------------- | -------- | ------------- | -----------
projectIgnore         | boolean  | false         | Removes the complete Visual Studio project from the processing
jsSourceFolder        | string   | /bin          | Specifies source folder for javascript files (usually TypeScript compiled output
wwwRootSourceFolder   | string   | /wwwroot      | specifies the wwwroot folder of the project to be processed (the folder with all sources except compiled js files)
sourcesPath           | string   | /src          | path where virtual directories for project sources will be created (the map file must reflect this).
jsCreateProjectFolder | boolean  | false         | specifies if the folder with the project name will be created in the target javascript folder
offlineFiles          | string[] | []            | specifies file url's to be cached in the application cache
processLess           | boolean  | true          | enables/disables processing of .less files
lessOptions           | object   | {}            | gulp-less options
processSass           | boolean  | true          | enables/disables processing of .sass files
sassOptions           | object   | {}            | gulp-sass options
jsMinify              | boolean  | false         | enables/disables minification of .js files
jsMinifyOptions       | object   | {}            | gulp-uglify options
cssMinify             | boolean  | false         | enables/disables minification of .css files
cssMinifyOptions      | object   | {}            | gulp-clean-css options
htmlMinify            | boolean  | false         | enables/disables minification of .html files
htmlMinifyOptions     | object   | {}            | gulp-html-min options

Planned options:

Option                | Type     | Default value  | Description
--------------------- | -------- | -------------- | -----------
postrocessTS          | boolean  | false          | Postprocessed the TypeScript output
postrocessTSOptions   | object   | {}             | TypeScript postprocessor options
lessExclude           | string[] | ["*.lib.less"] | less files to be excluded from processing (as it is supposed it is a library included by less)
sassExclude           | string[] | ["*.lib.less"] | sass files to be excluded from processing (as it is supposed it is a library included by sass)
cssExclude            | string[] | ["*.lib.css"]  | css files to be excluded from processing (as it is supposed it is a library included by less/sass)

---

#### WebPublish & .pubxml

TBD

---

#### .gitignore

TBD

---

### Known issues

- TypeScript map files are not correctly transpilled when gulp-uglify is used
  - This was valid mainly for AJS
  - Are map files really needed in production with minified .js files?

- While debuggign the TS code in VS and IE11 it the "data tips" feature of VS works in strange behavior
  - The .dynamic TypeScript source file is lodaded from IE but data tips does not work here
  - By switching to original source file it is possible to see variable content but step into/over always switches back to the .dynamic file
  - Watches and evaluations works normally

---

### License

For details see the [License]{./LICENSE} file

The project is using various Node.js modules and their dependencies. For the license files related to these modules reffer to 
node_modules folder which is created and populated automatically when the project is oppened in the Visual Studio.

---

### Contribution

Contibution is more than welcome.
