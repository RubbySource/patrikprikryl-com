# Fallback OG image generator using .NET System.Drawing.
# The canonical generator is scripts/generate-og-image.js (sharp).
# Use this only when Node.js is not available.

param(
  [string]$OutPath = (Join-Path $PSScriptRoot '..\public\og-image.png')
)

Add-Type -AssemblyName System.Drawing

$WIDTH  = 1200
$HEIGHT = 630
# Build via codepoints so the script is robust to source file encoding
# (Windows PowerShell 5.1 may read this file as ANSI rather than UTF-8).
$TITLE    = 'Patrik P' + [char]0x0159 + 'ikryl'                                # Patrik Přikryl
$SUBTITLE = 'AI Project Manager ' + [char]0x00B7 + ' ' + [char]0x0160 + 'koda Auto'  # AI Project Manager · Škoda Auto
$URL      = 'PATRIKPRIKRYL.COM'
$MARK     = 'PP'

$bmp = New-Object System.Drawing.Bitmap $WIDTH, $HEIGHT
$g   = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode    = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

# Background gradient: #0f172a -> #1e293b
$rect = New-Object System.Drawing.Rectangle 0, 0, $WIDTH, $HEIGHT
$bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
  $rect,
  [System.Drawing.Color]::FromArgb(255, 0x0f, 0x17, 0x2a),
  [System.Drawing.Color]::FromArgb(255, 0x1e, 0x29, 0x3b),
  [System.Drawing.Drawing2D.LinearGradientMode]::ForwardDiagonal
)
$g.FillRectangle($bgBrush, $rect)

# Soft cyan glow in upper-right (radial via PathGradient)
$glowPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$glowPath.AddEllipse(700, -200, 900, 900) | Out-Null
$glowBrush = New-Object System.Drawing.Drawing2D.PathGradientBrush($glowPath)
$glowBrush.CenterColor = [System.Drawing.Color]::FromArgb(60, 0x38, 0xbd, 0xf8)
$glowBrush.SurroundColors = @([System.Drawing.Color]::FromArgb(0, 0x0f, 0x17, 0x2a))
$g.FillPath($glowBrush, $glowPath)

# Brand mark "PP" with cyan underline
$markFont   = New-Object System.Drawing.Font('Segoe UI', 18, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Point)
$markBrush  = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 0x38, 0xbd, 0xf8))
$g.DrawString($MARK, $markFont, $markBrush, 80, 70)
$accentPen  = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 0x38, 0xbd, 0xf8), 3)
$g.DrawLine($accentPen, 80, 120, 160, 120)

# Title
$titleFont  = New-Object System.Drawing.Font('Segoe UI', 64, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Point)
$titleBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 0xf8, 0xfa, 0xfc))
$g.DrawString($TITLE, $titleFont, $titleBrush, 70, 230)

# Subtitle
$subFont    = New-Object System.Drawing.Font('Segoe UI', 24, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Point)
$subBrush   = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 0x94, 0xa3, 0xb8))
$g.DrawString($SUBTITLE, $subFont, $subBrush, 80, 380)

# Footer divider + url
$dividerPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 0x1e, 0x29, 0x3b), 1)
$g.DrawLine($dividerPen, 80, 540, 1120, 540)
$urlFont    = New-Object System.Drawing.Font('Segoe UI', 14, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Point)
$urlBrush   = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 0x64, 0x74, 0x8b))
$g.DrawString($URL, $urlFont, $urlBrush, 80, 565)

$resolved = [System.IO.Path]::GetFullPath($OutPath)
$dir = [System.IO.Path]::GetDirectoryName($resolved)
if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }

# Save to a memory stream first, then write bytes to disk.
# Avoids GDI+ "generic error" when the destination path is briefly locked.
$ms = New-Object System.IO.MemoryStream
$bmp.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
[System.IO.File]::WriteAllBytes($resolved, $ms.ToArray())
$ms.Dispose()

$g.Dispose()
$bmp.Dispose()

Write-Output ("Wrote {0} ({1}x{2})" -f $resolved, $WIDTH, $HEIGHT)
