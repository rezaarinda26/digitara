# Screenshots the running dev server into tmp/ for visual verification.
# Usage: powershell -ExecutionPolicy Bypass -File scripts\shot.ps1 <url> <outfile> [width] [height] [waitMs]

param(
  [Parameter(Mandatory = $true)][string]$Url,
  [Parameter(Mandatory = $true)][string]$Out,
  [int]$Width = 1440,
  [int]$Height = 900,
  [int]$WaitMs = 3500
)

$chrome = @(
  'C:\Program Files\Google\Chrome\Application\chrome.exe',
  'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe',
  'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
  'C:\Program Files\Microsoft\Edge\Application\msedge.exe'
) | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1

if (-not $chrome) { throw 'Chrome/Edge not found.' }

$profileDir = Join-Path $env:TEMP 'opencode-shot-chrome'
$outFull = [System.IO.Path]::GetFullPath($Out)
$outDir = Split-Path -Parent $outFull
if (-not (Test-Path -LiteralPath $outDir)) { New-Item -ItemType Directory -Path $outDir -Force | Out-Null }
if (Test-Path -LiteralPath $outFull) { Remove-Item -LiteralPath $outFull -Force }

$args = @(
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--force-device-scale-factor=1',
  "--user-data-dir=$profileDir",
  "--window-size=$Width,$Height",
  "--virtual-time-budget=$WaitMs",
  "--screenshot=$outFull",
  $Url
)

& $chrome @args 2>$null | Out-Null

if (Test-Path -LiteralPath $outFull) { Write-Output "OK: $outFull" } else { throw "Screenshot failed: $outFull" }
