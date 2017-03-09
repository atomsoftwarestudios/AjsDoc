# AjsDoc
#### TypeScript documentation browser

Copyright &copy;2016-2017 Atom Software Studios<br>
Released under the MIT License

---

Currently, there are two examples running publicly:

http://ajsfw.azurewebsites.net - logging off

http://ajsdoc.azurewebsites.net - logging on (console will popup 15s after refresh, its quiet expensive but logging to memory only)

both versions are not optimized from the size perspective (no uglify or other tools used yet) and are cappable of running offline in browser or as a web app for mobiles (icon on homescreens).

---

### Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Visual Studio prerequisites & setup](#visual-studio-prerequisites--setup)
- [Build](#build)
- [Usage](#usage)
- [Known bugs](#known-bugs)
- [License](#license)
- [Contribution](#contribution)

---

### Introduction

AjsDoc is an example application using the Ajs Framework. Currently, the Ajs Visual Studio Project is included in the AjsDoc Visual Studio Solution and the last recent version of the Ajs Framework is sotred in this repository as both projects are currently developed and debugged together.

The JSON documentation data for AjsDoc are required to be generated with the TypeDoc (https://github.com/TypeStrong/typedoc).

---

### Features

- Guide & Examples
      - HTML based reference guide
      
- Reference guide
      - Generated from TypeScript code using TypeDoc
      - HTML Code documentation supported
      
- HTML Code (both, static & code documentation)
   - Supported tags (this will be highly probably changed to standard JSDoc):
      - #example url
         - Includes the example to the HTML code (make sure the code is HTML escaped so < > & and others  are properly replaced)
         - Must be on the separate line
      - #chart url
         - Includes svg chart to the HTML code
	 - Must be on the separate line

- Ajs Feature Examples (directly in the code)
   - Complete offline application support
   - Boot process and configuration
   - Resource loading including the InitialProgressBar
   - Application resource loading and management
   - Templating
   - Visual State management
   - Visual State transition
   - View Component state management
   - View Component state filtering
   - Session state management
   - Models for the static JSON data
   - Debugging tools

- Tools
   - tocgen.ps1 (powershell) -> generator of the toc.json file from the folder structure of the static html documents

---

### Visual Studio prerequisites & setup

- The Visual Studio should be in version 2015 (Enterprise, Professional, Community) - curently tested with Enterprise version only.

- The TypeScript 2.1.5 extension must be installed (https://www.typescriptlang.org/#download-links)

- GitHub extension for Visual Studio is highly recommended (https://visualstudio.github.com/)

---

### Build

The project is the Visual Studio solution 2015 and should not be a problem to clone:

```
https://github.com/atomsoftwarestudios/AjsDoc.git
```

compile it and run/debug in both, debug and release vesrions under the local IIS Express.

Please, report all issues with the compilation and running here on GitHub.

---

### Usage

```
Please note the implementation of template(s) for all types is not currently complete. Feel free to contibute.
```

The JSON data grabbed from the TypeDoc must be provided. The JSDoc code documentation can contain HTML tags to format the output as desired.

Following statements already are or will available (as TypeDoc filters the original JSoc):

```
#example <root_relative_path>            Inserts the example file to the target document
#chart <root_relative_path>              Inserts the svg chart to the target document
```

TBD

---

### Known bugs

Documentation for the latest version of the Ajs and AjsDoc can't be generated using the TypeDoc as it does not support some required features 
(see [issue #399](https://github.com/TypeStrong/typedoc/issues/399) for details)

---

### License

For details see the [License]{./LICENSE} file

---

### Contribution

Contibution is more than welcome.
