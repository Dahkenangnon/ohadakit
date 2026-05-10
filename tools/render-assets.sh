#!/usr/bin/env bash
#
# Regenerate brand-asset PNGs from SVG sources in assets/.
#
# Outputs in assets/ (for README, releases):
#   assets/banner.png
#   assets/banner-square.png
#   assets/og-image.png
#   assets/logo-512.png
#
# Outputs in demo/public/ (for deployed demo metadata):
#   demo/public/banner.png
#   demo/public/banner-square.png
#   demo/public/og-image.png
#   demo/public/favicon-32.png
#   demo/public/favicon-192.png
#   demo/public/apple-touch-icon.png
#   demo/public/favicon.svg
#
# Requires: rsvg-convert (librsvg)

set -euo pipefail

cd "$(dirname "$0")/.."

if ! command -v rsvg-convert >/dev/null; then
  echo "error: rsvg-convert not found - install librsvg2-bin (Linux) or librsvg (macOS)" >&2
  exit 1
fi

mkdir -p assets demo/public

# Canonical rendered assets.
rsvg-convert -w 1200          assets/banner.svg        -o assets/banner.png
rsvg-convert -w 1200 -h 1200  assets/banner-square.svg -o assets/banner-square.png
rsvg-convert -w 1280 -h  640  assets/og-image.svg      -o assets/og-image.png
rsvg-convert -w  512          assets/logo.svg          -o assets/logo-512.png

# Demo deploy assets.
rsvg-convert -w 1200          assets/banner.svg        -o demo/public/banner.png
rsvg-convert -w 1200 -h 1200  assets/banner-square.svg -o demo/public/banner-square.png
rsvg-convert -w 1280 -h  640  assets/og-image.svg      -o demo/public/og-image.png
rsvg-convert -w   32          assets/favicon.svg       -o demo/public/favicon-32.png
rsvg-convert -w  192          assets/favicon.svg       -o demo/public/favicon-192.png
rsvg-convert -w  512          assets/logo.svg          -o demo/public/apple-touch-icon.png
cp assets/favicon.svg demo/public/favicon.svg

printf 'ohadakit.claviscore.com\n' > demo/public/CNAME

echo "✓ assets rendered"
ls -la assets/*.png demo/public/*.png demo/public/*.svg demo/public/CNAME 2>&1
