# AjsDoc
TypeScript documentation browser

Currently, the Ajs Visual Studio Project is included here and the last recent version of the Ajs is in this repository because of debugging purposes.

This repository is under construction and both projects are still in early development phase.

This application can be used as an example for the AjsFramework (https://github.com/atomsoftwarestudios/ajs)

The JSON data are required to be generated with the TypeDoc (https://github.com/TypeStrong/typedoc)

# Compilation

The project is the Visual Studio solution and should not be a problem to clone:

```
https://github.com/atomsoftwarestudios/AjsDoc.git
```

compile it and run/debug in both, debug and release vesrions under the local IIS Express. Please note the full version of VS (Enterprise, Standard, Community or Express for Web) with the latest TypeScipt tools must be used. Please, report all issues with the compilation and running.

# Usage

```
Please note the implementation of all data types is not currently complete and probably will never be as the primary purpose is to document the Ajs and currently only the statements used there are in development and testing.
```

The JSON data grabbed from the TypeDoc must be provided. The JSDoc code documentation can contain HTML tags to format the output as desired.

Following statements already are or will available (as TypeDoc filters the original JSoc):

```
   #example <relative_path>            Inserts the example file to the target document
```

# Contribution

Contribution is wellcome, but its provbably too early.
