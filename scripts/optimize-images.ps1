# Re-compresses the source images in src/assets/images to a web-friendly size.
# Originals are tracked in git, so this is fully reversible.
# Usage: powershell -ExecutionPolicy Bypass -File scripts\optimize-images.ps1

Add-Type -AssemblyName System.Drawing

$dir = Join-Path (Split-Path -Parent $PSScriptRoot) 'src\assets\images'
$maxWidth = 1920
$quality = 80

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$enc = New-Object System.Drawing.Imaging.EncoderParameters(1)
$enc.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $quality)

Get-ChildItem -Path $dir -Filter *.jpg | ForEach-Object {
  $file = $_
  $before = $file.Length

  $img = [System.Drawing.Image]::FromFile($file.FullName)
  $w = $img.Width
  $h = $img.Height

  $newW = $w
  $newH = $h
  if ($w -gt $maxWidth) {
    $newW = $maxWidth
    $newH = [int]($h * ($maxWidth / $w))
  }

  $bmp = New-Object System.Drawing.Bitmap($newW, $newH)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.DrawImage($img, 0, 0, $newW, $newH)
  $g.Dispose()
  $img.Dispose()

  $tmp = "$($file.FullName).tmp.jpg"
  $bmp.Save($tmp, $codec, $enc)
  $bmp.Dispose()

  Move-Item -LiteralPath $tmp -Destination $file.FullName -Force
  $after = (Get-Item $file.FullName).Length

  Write-Output ("OK    {0}  {1:N0} KB -> {2:N0} KB  ({3}x{4} -> {5}x{6})" -f `
    $file.Name, ($before / 1KB), ($after / 1KB), $w, $h, $newW, $newH)
}
