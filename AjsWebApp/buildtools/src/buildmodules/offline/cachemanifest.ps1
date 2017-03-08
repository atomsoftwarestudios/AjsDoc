# cache.manifest generator
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
    [string]$rootPath = ""
)

if ($rootPath[$rootPath.Length - 1] -eq """") {
    $rootPath = $rootPath.Substring(0, $rootPath.Length - 1) 
}

Write-Host ""
Write-Host "cache.manifest generator"
Write-Host "Copyright(c)2017 Atom Software Studios, All rights Reserved"
Write-Host "Released under the MIT License"
Write-Host ""

if ($rootPath -eq "") {
    Write-Host "Usage:"
    Write-Host "   cachemanifest.ps1 <path-to-web-root>"
    Write-Host ""
    Write-Host "Visual Studio Post-Build Action:"
    Write-Host "   !change paths as required!"
    Write-Host "   powershell.exe -ExecutionPolicy Bypass -File `"..\..\Tools\cachemanifest.ps1`" `"`$(ProjectDir)`""
    Exit 1
}

$md5 = new-object -TypeName System.Security.Cryptography.MD5CryptoServiceProvider
$utf8 = new-object -TypeName System.Text.UTF8Encoding

$fileList = `
    "\index.html", `
    "\js\ajs.js", `
    "\js\ajs.lib.js", `
    "\js\ajs.boot.config.js", `
    "\favicon.ico", `
    "\favicon-16x16.png", `
    "\favicon-32x32.png", `
    "\android-chrome-192x192.png", `
    "\apple-touch-icon.png", `
    "\mstile-150x150.png", `
    "\safari-pinned-tab.svg", `
    "\manifest.json", `
    "\browserconfig.xml"

$manifestFileName = "\cache.manifest"

$manifestPath = $rootPath + $manifestFileName

$manifest = "CACHE MANIFEST`r`n";

$hash = "";
$newestDate = Get-Date -Year 1900

for ($i = 0; $i -lt $fileList.Length; $i++) {
    $filename = $fileList[$i] + "`r`n"
    $manifest += $filename.replace("\", "/");
    $path = $rootPath + $fileList[$i]
    if (Test-Path $path -ErrorAction SilentlyContinue) {
        $fileDate = [IO.file]::GetLastWriteTime($path)
        if ($fileDate -gt $newestDate) {
            $newestDate = $fileDate
        }
        $fileHash = Get-FileHash $path -Algorithm MD5
        $newHash = $hash + $fileHash.Hash
        $hash = [String]::Join("", ($md5.ComputeHash($utf8.GetBytes($newHash)) | % { "{0:X2}" -f $_}))
    }
}

$manifest += "`r`n"
$manifest += "NETWORK:`r`n"
$manifest += "*`r`n`r`n"
$manifest += "FALLBACK:`r`n"
$manifest += "/ /`r`n`r`n"
$manifest += "# HASH: " + $hash + "`r`n"
$manifest += "# LASTCHANGE: " + $newestDate + "`r`n"


if (Test-Path $manifestPath -ErrorAction SilentlyContinue) {
    $oldManifest = [IO.file]::ReadAllText($rootPath + "\cache.manifest")
} else {
    $oldManifest = ""
}

if ($oldManifest -ne $manifest) {
    [IO.file]::WriteAllText($rootPath + "\cache.manifest", $manifest, [System.Text.Encoding]::ASCII)
}
