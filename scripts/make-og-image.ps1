# Renders public/og-image.png from scripts/og-template.html using headless Chrome.
# Usage: powershell -ExecutionPolicy Bypass -File scripts\make-og-image.ps1

$root = Split-Path -Parent $PSScriptRoot
$html = Join-Path $PSScriptRoot 'og-template.html'
$outDir = Join-Path $root 'public'
$out = Join-Path $outDir 'og-image.png'

$chrome = @(
  'C:\Program Files\Google\Chrome\Application\chrome.exe',
  'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe',
  'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
  'C:\Program Files\Microsoft\Edge\Application\msedge.exe'
) | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1

if (-not $chrome) {
  throw 'Chrome/Edge not found. Cannot render OG image.'
}

$profileDir = Join-Path $env:TEMP 'opencode-og-chrome'

$args = @(
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--force-device-scale-factor=1',
  '--default-background-color=00000000',
  "--user-data-dir=$profileDir",
  "--window-size=1200,630",
  "--screenshot=$out",
  "file:///$($html -replace '\\','/')"
)

& $chrome @args | Out-Null

if (Test-Path -LiteralPath $out) {
  Write-Output "OG image written: $out"
} else {
  throw "OG image render failed: $out not found"
}
