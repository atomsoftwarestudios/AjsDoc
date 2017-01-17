param (
    [string]$rootPath = ""
)

Write-Host ""
Write-Host "cache.manifest generator"
Write-Host "Copyright(c)2017 Atom Software Studios, All rights Reserved"
Write-Host "Released under the MIT License"
Write-Host ""

if ($rootPath[$rootPath.Length - 1] -eq """") {
    $rootPath = $rootPath.Substring(0, $rootPath.Length - 1) 
}

if ($rootPath -eq "") {
    Write-Host "Path to the web root expected"
    exit 1
}

$md5 = new-object -TypeName System.Security.Cryptography.MD5CryptoServiceProvider
$utf8 = new-object -TypeName System.Text.UTF8Encoding

$fileList = `
    "\index.html", `
    "\js\ajs.js", `
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
    $manifest += $fileList[$i] + "`r`n"
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
