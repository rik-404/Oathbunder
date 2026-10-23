Add-Type -AssemblyName System.Drawing
$im = [System.Drawing.Image]::FromFile((Join-Path $PSScriptRoot 'assets\images\enemies\skeleton.png'))
function Grid($n,$x0,$y0,$w,$h){ Write-Host "== $n"
  for($y=$y0;$y -lt $y0+$h;$y++){ $r="$y| "
    for($x=$x0;$x -lt $x0+$w;$x++){ $c=$im.GetPixel($x,$y); if($c.A -eq 0){ $r+='  .'}else{$r+=('{0:x2}{1:x2}{2:x2}' -f $c.R,$c.G,$c.B)} }
    Write-Host $r } }
Grid 'rosto' 8 8 8 8
Grid 'topo+lado cabeça' 8 0 24 8
Grid 'tronco' 16 16 16 8
Grid 'braco' 40 16 8 8
Grid 'perna' 0 16 8 8
$im.Dispose()
