#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
out="$root/public/product-films"
font="/System/Library/Fonts/Supplemental/Arial Bold.ttf"
mkdir -p "$out"

render() {
  local id="$1" title="$2" one="$3" two="$4" exploded="$5" three="$6"
  /opt/homebrew/bin/ffmpeg -y -loop 1 -t 2 -i "$root/public/$one" -loop 1 -t 2 -i "$root/public/$two" -loop 1 -t 2 -i "$root/public/$exploded" -loop 1 -t 2 -i "$root/public/$three" \
    -filter_complex "
      [0:v]scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2:black,fade=t=in:st=0:d=1,setsar=1[v0];
      [1:v]scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2:black,zoompan=z='min(zoom+0.0007,1.1)':d=60:s=1280x720:fps=30,setsar=1[v1];
      [2:v]scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2:#071015,zoompan=z='min(zoom+0.0005,1.06)':d=60:s=1280x720:fps=30,setsar=1[v2];
      [3:v]scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2:black,setsar=1[v3];
      color=c=#05080b:s=1280x720:d=2,setsar=1[v4];
      [v0][v1][v2][v3][v4]concat=n=5:v=1:a=0" \
    -t 10 -r 30 -c:v libx264 -pix_fmt yuv420p -movflags +faststart "$out/$id.mp4"
}

render thin-client "THIN CLIENT" "legacy/thin-clients/1.jpg" "legacy/thin-clients/2.jpg" "exploded/thin-client.png" "legacy/thin-clients/3.jpg"
render mini-pc "MINI PC" "legacy/mini-pc/1.jpg" "legacy/mini-pc/2.jpg" "exploded/mini-pc-core.png" "legacy/mini-pc/3.jpg"
render compute-stick "COMPUTE STICK" "exploded/monitor-stick.png" "showcase/complete-system.png" "exploded/monitor-stick.png" "legacy/all-in-one/1.jpg"
render tower-desktop "TOWER DESKTOP" "legacy/tower-desktop/1.jpg" "legacy/tower-desktop/2.jpg" "exploded/device-core.png" "legacy/tower-desktop/4.jpg"
render all-in-one "ALL-IN-ONE SYSTEM" "legacy/all-in-one/1.jpg" "legacy/all-in-one/2.jpg" "exploded/monitor-stick.png" "legacy/all-in-one/3.jpg"
render kiosk "INTERACTIVE KIOSK" "showcase/interactive-kiosk.png" "legacy/kiosks-display/1.jpg" "exploded/interactive-kiosk.png" "legacy/kiosks-display/2.jpg"
render mobile-cart "MOBILE MEDICAL CART" "exploded/mobile-stand.png" "exploded/av-stand.png" "exploded/mobile-stand.png" "exploded/av-stand.png"
