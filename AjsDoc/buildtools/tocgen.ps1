# AjsDoc TOC generator
# --------------------------------
# 
# The MIT License (MIT)
# Copyright (c)2016-2017 Atom Software Studios. All rights reserved.
# 
# Permission is hereby granted, free of charge, to any person obtaining a copy of
# this software and associated documentation files (the "Software"), to deal in
# the Software without restriction, including without limitation the rights to
# use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
# of the Software, and to permit persons to whom the Software is furnished to do
# so, subject to the following conditions:
# 
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
# 
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
# INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
# PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
# HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
# OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
# SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

param (
    [string]$path = "",
    [string]$baseUrl = "",
    [string]$output = ""
)

Write-Host ""
Write-Host "AjsDoc TOC generator"
Write-Host "Copyright(c)2017 Atom Software Studios, All rights reserved"
Write-Host "Released under the MIT License"
Write-Host ""

if ($path -eq "" -or $baseUrl -eq "" -or $output -eq "") {
    Write-Host "Usage:"
    Write-Host "   tocgen.ps1 <path-to-content> <base-url> <ouput-file>"
    Write-Host
    Write-Host "Visual Studio Post-Build Action:"
    Write-Host "   !change the paths as required!"
    Write-Host "   powershell.exe -ExecutionPolicy Bypass -File `"..\..\Tools\tocgen.ps1`" `"`$(ProjectDir)wwwroot\resources\content`" `"/resources/content/`" `"`$(ProjectDir)wwwroot\resources\toc.json`""
    Exit 1
}

$defaultUrl = ""

function ProcessDir($dir, $url, $indent = "") {


    $files = Get-ChildItem $dir

    $items = $indent +"`"children`": [`n";
    $idt = $indent + "  "

    for ($i = 0; $i -lt $files.Length; $i++) {
        
        if ($files[$i].Attributes -ne [System.IO.FileAttributes]::Directory) {

            if ($global:defaultUrl -eq "") {
                $global:defaultUrl = $url + $files[$i].Name
            }


            $dirName = $files[$i].Name.Substring(0, 2)

            if ([System.IO.Directory]::Exists($dir + "\" + $dirName)) {
                $idt1 = $idt + "  "
                $item = $idt + "{`n";
                $item += $idt1 + "`"path`": `"" + $url + $files[$i].Name + "`",`n"
                $d = $dir + "\" + $dirName
                $u = $url + $dirName + "/" 
                $item += ProcessDir $d $u $idt1
                $item += "`n" + $idt + "}"
            } else {
                $item = $idt + "{ `"path`": `"" + $url + $files[$i].Name + "`""
                $item += "}"
            }

            if ($i -lt $files.Length - 1) {
                $item += ", "
            }

            $items += $item + "`n"

        }
    }

    $items += $indent + "]"

    return $items

}

$content = ProcessDir $path $baseUrl "    "

#$toc = "// toc is generated automatically during the build process from the content of the /resources/content folder`n"
#$toc += "// See project properties > Build events > Post-build and tocgen.ps1 for details`n`n"
$toc = "{`n"
$toc += "  `"defaultPath`": `"" + $defaultUrl + "`",`n"
$toc += "  `"toc`": {`n"
$toc += $content + "`n"
$toc += "  }`n" 
$toc += "}`n"

[IO.file]::WriteAllText($output, $toc, [System.Text.Encoding]::ASCII)
