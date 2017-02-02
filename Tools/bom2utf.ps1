Function Write-Utf8([string] $path, [string] $filter='*.*')
{
    [IO.SearchOption] $option = [IO.SearchOption]::AllDirectories;
    [String[]] $files = [IO.Directory]::GetFiles((Get-Item $path).FullName, $filter, $option);
    foreach($file in $files)
    {
        if ($file.EndsWith(".js") -or 
            $file.EndsWith(".ts") -or 
            $file.EndsWith(".html") -or 
            $file.EndsWith(".txt") -or 
            $file.EndsWith(".json") -or 
            $file.EndsWith(".config") -or
            $file.EndsWith(".manifest"))
        {
            "Writing $file...";
            [String]$s = [IO.File]::ReadAllText($file);
            $Utf8NoBomEncoding = New-Object System.Text.UTF8Encoding($False)
            [IO.File]::WriteAllText($file, $s, $Utf8NoBomEncoding);
        }
    }
}

Write-Utf8 '<replace by path to the solution folder>'
