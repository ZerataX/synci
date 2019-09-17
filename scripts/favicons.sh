
#!/bin/bash
parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )

outdir="images/favicon"
indir="images"
function svg2png {
  input=$1
  name=$2
  resolution=$3

  mkdir -p $outdir
  inkscape -z -e $outdir/$name-${resolution}x${resolution}.png -w $resolution -h $resolution $indir/$input
}

svg2png "logo.svg" "favicon" 32
svg2png "logo.svg" "favicon" 16
svg2png "icon.svg" "mstile" 70
svg2png "icon.svg" "mstile" 144
svg2png "icon.svg" "mstile" 150
svg2png "icon.svg" "mstile" 310
svg2png "icon.svg" "android-chrome" 192
svg2png "icon.svg" "android-chrome" 512
svg2png "logo.svg" "apple-touch-icon" 180
mv $outdir/apple-touch-icon-180x180.png $outdir/apple-touch-icon.png
convert -background none $indir/logo.svg -define icon:auto-resize $outdir/favicon.ico