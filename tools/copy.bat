echo Copying Ajs.Boot.Config sources to target directory
mkdir "%~1AjsDoc\src\Ajs.Boot.Config"
xcopy /D "%~1Ajs.Boot.Config\js\*" "%~1AjsDoc\js"
xcopy /s /e /D "%~1Ajs.Boot.Config\src\*" "%~1\AjsDoc\src\Ajs.Boot.Config"
echo "%~1Ajs\src\*"
