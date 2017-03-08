Buildtools folder is used as a:

- Source folder for buildtools (gulpfile.ts and required modules, except NPM modules)
- Temp folder for automatically generated files / watcher control:
  - solutionInfo.json (solution information such as name, path, configuration)
  - clean.json (files copied to wwwroot folder during afterBuild - used to track files to be cleaned during the clean process)
  - watcher.pid (process id of the watcher node process - used to track if watcher is running)
  - watcher.pause (directs watcher to be paused if created or resumed if deleted)
  - watcher.waiting (used to check if watcher is in paused state)

When the project is about to be built:

- pre-build msbuild event
  - generates /buildtools/solutionInfo.json file containing the "macro" variables from the solution
  - calls Gulpfile.js -> beforeBuild task (which takes care of pausing the FSWatcher to avoid collisions)

- post-build msbuild event
  - copies the compiled Gulpfile.ts to the $(ProjectDir) folder (and overwrites existing)
  - copies compiled buildtools modules to $(ProjectDir)modules folder while necessary folders are created and existing modules are rewritten
  - calls Gulpfile.js -> afterBuild task (which processes the solution as configured and resumes the watcher)
