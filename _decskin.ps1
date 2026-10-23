param([string]$png)
Add-Type -AssemblyName System.Drawing
$img=[System.Drawing.Image]::FromFile((Resolve-Path $png).Path)
$bmp=New-Object System.Drawing.Bitmap($img)
$img.Dispose()
$r=[System.Drawing.Rectangle]::new(0,0,$bmp.Width,$bmp.Height)
$fmt=[System.Drawing.Imaging.PixelFormat]::Format32bppArgb
$d=$bmp.LockBits($r,[System.Drawing.Imaging.ImageLockMode]::ReadOnly,$fmt)
$l=$bmp.Width*$bmp.Height*4
$y=New-Object byte[] $l
[System.Runtime.InteropServices.Marshal]::Copy($d.Scan0,$y,0,$l)
$bmp.UnlockBits($d)
[IO.File]::WriteAllBytes('_skin.raw',$y)
Write-Host ("ok {0}x{1} {2} bytes" -f $bmp.Width,$bmp.Height,$l)
