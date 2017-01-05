echo Cleaning the Ajs.Boot.Config sources and binary
rd /s /q "%~1\AjsDoc\src\Ajs.Boot.Config"
del "%~1AjsDoc\js\ajs.boot.config.js"
del "%~1AjsDoc\js\ajs.boot.config.js.map"
exit 0