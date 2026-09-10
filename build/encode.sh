#!/usr/bin/env bash
# Encode rendered frames into the two delivery sources plus a poster.
# Run after build/frames.mjs. Uses the ffmpeg bundled by ffmpeg-static,
# so there is no system ffmpeg dependency.
set -euo pipefail

F="./node_modules/ffmpeg-static/ffmpeg"
IN="assets/frames/%04d.png"
LAST=$(ls assets/frames | tail -1)

# 1.5s hold on the final frame so the payoff lands before the loop restarts
VF="scale=1280:880:flags=lanczos,tpad=stop_mode=clone:stop_duration=1.5"

# H.264 — listed first in the page; the only source Safari will play.
# -pix_fmt yuv420p is required for Safari/QuickTime when encoding from PNG.
"$F" -y -loglevel error -framerate 25 -i "$IN" -vf "$VF" -r 25 \
     -c:v libx264 -profile:v main -crf 30 -preset slow -pix_fmt yuv420p \
     -movflags +faststart -an assets/briefing.mp4

# VP8 — secondary source
"$F" -y -loglevel error -framerate 25 -i "$IN" -vf "$VF" -r 25 \
     -c:v libvpx -crf 33 -b:v 0 -auto-alt-ref 0 -an assets/briefing.webm

# Poster: final frame, palettised. Flat UI colour compresses hard —
# 180KB truecolour becomes ~58KB at 128 colours with no visible loss.
"$F" -y -loglevel error -i "assets/frames/$LAST" \
     -vf "scale=1280:880:flags=lanczos,palettegen=max_colors=128:stats_mode=full" \
     assets/_pal.png
"$F" -y -loglevel error -i "assets/frames/$LAST" -i assets/_pal.png \
     -lavfi "scale=1280:880:flags=lanczos[x];[x][1:v]paletteuse=dither=none" \
     assets/poster.min.png
rm -f assets/_pal.png

ls -la assets/briefing.mp4 assets/briefing.webm assets/poster.min.png \
  | awk '{printf "%-28s %7.1f KB\n", $9, $5/1024}'
