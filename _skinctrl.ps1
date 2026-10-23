Add-Type -AssemblyName System.Drawing
$p = Join-Path $PSScriptRoot 'assets\images\characters\demon.png'
$im = [System.Drawing.Image]::FromFile($p)
Write-Host "dim $($im.Width)x$($im.Height) fmt $($im.PixelFormat)"
$m = @{}
for ($y = 0; $y -lt $im.Height; $y++) {
  for ($x = 0; $x -lt $im.Width; $x++) {
    $c = $im.GetPixel($x, $y)
    if ($c.A -eq 0) { continue }
    $k = '{0:x2}{1:x2}{2:x2}' -f $c.R, $c.G, $c.B
    if ($m.ContainsKey($k)) { $m[$k]++ } else { $m[$k] = 1 }
  }
}
$im.Dispose()
$m.GetEnumerator() | Sort-Object Value -Descending | Select-Object -First 40 | ForEach-Object { "{0} {1}" -f $_.Key, $_.Value }
