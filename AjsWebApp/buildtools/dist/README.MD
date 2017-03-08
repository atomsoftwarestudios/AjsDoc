Dist is TypeScript compilation target for build tools. Its populated automatically and its output
is copied to the /buildmodules and Gulpfile.js in the root od the AjsWebApp project.

This behavior is neccessary otherwise Gulpfile.js and its dependencies written in TypeScript would not
be available during build process when clean or rebuild commands will be issued to VisualStudio.