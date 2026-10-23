Add-Type -AssemblyName System.Drawing
$im = [System.Drawing.Image]::FromFile((Join-Path $PSScriptRoot 'assets\images\enemies\zombie.png'))
# mapa de opacidade: '#' pixel cheio, '.' transparente — 64 colunas
for($y=0;$y -lt 32;$y++){ $r=("{0,2}" -f $y)+"|"
  for($x=0;$x -lt 64;$x++){ $c=$im.GetPixel($x,$y); if($c.A -eq 0){$r+='.'}else{$r+='#'} }
  Write-Host $r }
Write-Host '--- cores dominantes por regiao do mapa (mostra x,y do primeiro encontro de cada cor nova) ---'
$seen=@{}
for($y=0;$y -lt 32;$y++){
  for($x=0;$x -lt 64;$x++){ $c=$im.GetPixel($x,$y); if($c.A -eq 0){continue}
    $k='{0:x2}{1:x2}{2:x2}' -f $c.R,$c.G,$c.B
    if(-not $seen.ContainsKey($k)){ $seen[$k]=1; Write-Host ('{0} @ {1},{2}' -f $k,$x,$y) } }
}
