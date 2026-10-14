# Hero video assets

Drop the AI-generated cinematic loop here. Until a video exists, the hero
shows a still photo (`/products/living-room.jpg`). Once the files are in
place, turn the video on in `src/app/(site)/page.tsx`:

```tsx
<HeroCinematic
  videoSrcWebm="/videos/hero-loop.webm"
  videoSrcMp4="/videos/hero-loop.mp4"
  posterSrc="/videos/hero-poster.jpg"
/>
```

Expected files:

| File | Purpose |
| --- | --- |
| `hero-loop.webm` | Primary source (smaller, served first) |
| `hero-loop.mp4` | Fallback source for browsers without VP9/AV1 support |
| `hero-poster.jpg` | First-frame still, shown while the video loads and if playback fails |

## Spec

- **Aspect ratio:** 16:9, source at least 1920×1080 (3840×2160 if you want headroom for ultra-wide crops).
- **Length:** 8–15s, designed to loop seamlessly (match first/last frame composition and motion).
- **Content:** slow camera drift through a furnished interior/facility — keep motion gentle, the UI overlays on top of it.

## Compression (ffmpeg)

From a raw export (`hero-raw.mov`):

```bash
# WebM / VP9 — primary, best compression
ffmpeg -i hero-raw.mov -vf "scale=1920:-2" -c:v libvpx-vp9 -b:v 0 -crf 32 \
  -an -row-mt 1 hero-loop.webm

# MP4 / H.264 — fallback for Safari & older browsers
ffmpeg -i hero-raw.mov -vf "scale=1920:-2" -c:v libx264 -crf 20 -preset slow \
  -pix_fmt yuv420p -movflags +faststart -an hero-loop.mp4

# Poster frame (grab frame at 0s)
ffmpeg -i hero-raw.mov -ss 00:00:00 -frames:v 1 -q:v 2 hero-poster.jpg
```

Target final file sizes under ~4MB (webm) / ~8MB (mp4) for a good LCP on mobile.
The component already strips audio (`muted` + `-an`) and falls back to the
poster image on load/decode error or `prefers-reduced-motion`.
