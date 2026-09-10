# Session #1 one-pager — assets and build

Client-facing leave-behind for **AI Training Session #1**, delivered by Atomic
to supply chain leaders.

**Start with [`BUILD-BRIEF.md`](BUILD-BRIEF.md)** — it is the complete spec:
structure, copy, brand tokens with computed contrast, workflow, red flags and
the QA checklist.

This repository holds the step-4 video, already built, plus the pipeline that
produced it.

## What's here

```
BUILD-BRIEF.md            The spec. Read this first.
src/components.css        Shared mock product UI — the page imports this too,
                          so the visuals on the page and in the video are the
                          same CSS and cannot drift apart.
src/animation.html        The 15s Morning Briefing timeline.
build/frames.mjs          Headless Chromium → 375 PNG frames at 2x.
build/encode.sh           Frames → MP4 + WebM + poster.
build/inline.mjs          Assets → base64 data URIs → step4-video.html.
build/verify.mjs          Asserts the inlined video decodes, plays and seeks.
assets/briefing.mp4       127 KB · H.264 · first source (Safari needs it)
assets/briefing.webm      327 KB · VP8 · second source
assets/poster.min.png      58 KB · final frame, palettised
assets/step4-video.html   684 KB · the above inlined, ready to paste into step 4
```

`assets/frames/` is gitignored — ~66 MB, regenerable.

## Using the video

Paste `assets/step4-video.html` into step 4 of the page. It is already set up
correctly: `muted`, `playsinline`, `loop`, `controls`, a poster, MP4 before
WebM, a text equivalent wired with `aria-describedby`, and deliberately **no
autoplay** — it plays on the reader's press, which sidesteps autoplay policy
and reduced-motion in one move.

## Rebuilding

```bash
npm install
npm run build     # frames → encode → inline → verify
```

The timeline is deterministic — every visual is a pure function of `t` via
`window.seek(t)`, with no `requestAnimationFrame`, CSS animation or
`Date.now()` — so re-running produces identical frames. To change copy or
timing, edit the `TASKS`, `BRIEF` and `BRIEF_START` constants at the top of the
script in `src/animation.html`.

## Two things to know

**Everything is fictional.** Nordwind Components, Baltic Freight, Kestrel
Polymers, Auralite Packaging, the PO numbers and SKU-2214 are invented. Reuse
the same set across the page so the story stays coherent — and keep real
supplier data out of a deliverable that goes to every client.

**Nothing is borrowed.** The video is composed from Atomic's own components and
the product UI is recreated in CSS, so no third-party footage, screenshots or
logos are redistributed. §10.1 of the brief explains what would reintroduce a
rights question if you later change that.
