Add-Type -AssemblyName System.Drawing
$im = [System.Drawing.Image]::FromFile((Join-Path $PSScriptRoot 'assets\images\enemies\zombie.png'))
function Grid($n,$x0,$y0,$w,$h){ Write-Host "== $n ($w x $h @ $x0,$y0)"
  for($y=$y0;$y -lt $y0+$h;$y++){ $r="$y| "
    for($x=$x0;$x -lt $x0+$w;$x++){ $c=$im.GetPixel($x,$y); if($c.A -eq 0){ $r+='.. '}else{$r+=('{0:x2}{1:x2}{2:x2} ' -f $c.R,$c.G,$c.B)} }
    Write-Host $r } }
Grid 'perna dir' 16 0 8 12
Grid 'perna esq' 32 0 8 12
Grid 'braco dir' 0 16 8 12
Grid 'tronco' 16 16 8 12
Grid 'braco esq' 40 16 8 12
$im.Dispose()
