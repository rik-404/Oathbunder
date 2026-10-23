Add-Type -AssemblyName System.Drawing
$im = [System.Drawing.Image]::FromFile((Join-Path $PSScriptRoot 'assets\images\enemies\zombie.png'))
for($y=0;$y -lt 32;$y++){ $r=("{0,2}" -f $y)+"|"
  for($x=0;$x -lt 32;$x++){ $c=$im.GetPixel($x,$y); if($c.A -eq 0){ $r+='    ' } else { $r+=('{0:x2}{1:x2}{2:x2} ' -f $c.R,$c.G,$c.B) } }
  Write-Host $r }
$im.Dispose()
