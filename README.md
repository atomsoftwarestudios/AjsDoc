# AjsDoc
TypeScript documentation browser

This repository is under construction and both projects are still under development.

AjsDoc is an example application using the Ajs Framework. Currently, the Ajs Visual Studio Project is included in the AjsDoc Visual Studio Solution and the last recent version of the Ajs Framework is sotred in this repository as both projects are currently developed and debugged together.

The JSON documentation data for AjsDoc are required to be generated with the TypeDoc (https://github.com/TypeStrong/typedoc).

Documentation for the latest version of the Ajs and AjsDoc can't be generated using the TypeDoc as it does not support some required features (see https://github.com/TypeStrong/typedoc/issues/399 for details)

# Visual Studio prerequisites & setup

- The Visual Studio should be in version 2015 (Enterprise, Professional, Community) - curently tested with Enterprise version only.

- The TypeScript 2.1.5 extension must be installed (https://www.typescriptlang.org/#download-links)

- GitHub extension for Visual Studio is highly recommended (https://visualstudio.github.com/)

# Compilation

The project is the Visual Studio solution 2015 and should not be a problem to clone:

```
https://github.com/atomsoftwarestudios/AjsDoc.git
```

compile it and run/debug in both, debug and release vesrions under the local IIS Express.

Please, report all issues with the compilation and running here on GitHub.

# Usage

```
Please note the implementation of templates for all data types is not currently complete
and probably  will never be as the primary purpose is to document the Ajs and currently
only the statements used there are in development and testing. Feel free to contibute.
```

The JSON data grabbed from the TypeDoc must be provided. The JSDoc code documentation can contain HTML tags to format the output as desired.

Following statements already are or will available (as TypeDoc filters the original JSoc):

```
#example <root_relative_path>            Inserts the example file to the target document
#chart <root_relative_path>              Inserts the svg chart to the target document
```

# Contribution

Contribution is wellcome, but its provbably too early.
