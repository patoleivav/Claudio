# Twenty-Six Weeks

A six-month daily flexibility, mobility and strength programme, published as a
private Claude Artifact. Personal project, unrelated to the Atomic one-pager at
the repository root.

Built for one specific picture: a nine-month sciatic distribution (lumbar spine →
left glute → left posterior thigh) with **both** a disc/nerve-root and a
piriformis component, five years detrained, training at home with a mat, wall,
chair, blocks, roller, ball, dumbbells to 25 kg and an adjustable bench.

## Files

```
index.html   Page structure, design tokens, both themes
data.js      101 exercises with one embedded video each, 7 session templates,
             6 phases, dose fitting
app.js       Calendar, session player, tracking, charts, monthly verdict
```

No build step and no dependencies. Publish with the Artifact tool:
`index.html` as the page, the two scripts as supporting files, and
`capabilities: {db: {}}` so the log survives across devices.

## Videos

Every exercise embeds its own explanation video, sourced from YouTube and listed
in `EX_VIDEO` in `data.js` as `[id, title]`. Each session also carries one or
two full follow-along routines in `VIDEOS`, keyed by category and phase band.
Embeds use `youtube-nocookie.com/embed/<id>`, are lazy-loaded so a twelve-exercise
day does not open twelve players at once, and each carries an open-on-YouTube
link beneath it.

To swap a video, change its id in `EX_VIDEO`. To check coverage after an edit,
confirm every key in `EX` has an entry.

## How a day is generated

Nothing about a day is written twice. `sessionFor(day)` composes it:

- **Phase** — `phaseForWeek()` maps week 1–26 onto six phases of 4/4/4/4/5/5
  weeks. The phase carries its hold and rep multipliers and its time window.
- **Category** — `categoryFor(day)` maps weekday to one of seven session types.
  Saturday alternates feet-and-squat with mid-back-and-rotation by odd/even week.
- **Variant** — `variantFor(week)` cycles A/B/C through the phase and makes the
  last week of every phase a deload.
- **Gates** — an entry written `suitcase@3` joins the session from phase 3.
  In phases 5–6 the Tuesday and Thursday templates switch to `strengthMain`.
- **Dose fitting** — set counts are searched 1–3 and holds extended up to 1.35×
  so the session lands inside the phase's stated minutes. 181 of 182 days land
  in their own window; the one that does not is a deload day, correctly shorter.

That yields 182 distinct daily prescriptions from 21 category-variant blocks.

## Changing things

**An exercise** — edit its entry in `EX` in `data.js`. Required fields: `n`,
`tgt`, `prop`, `s` (0 or 2 sides), `d` (`{k, v}` where `k` is
`hold`/`reps`/`breath`/`time`), `cue`, `why` and `lv` (five levels, easiest
first). `care` is an optional warning. Its video comes from `EX_VIDEO`.

**A session** — edit `SESSIONS[category]`: `open`, `main.A/B/C`, `close`,
optionally `strengthMain`.

**Phase length or dosing** — `PHASES` in `data.js`. `totalWeeks()` should stay
at 26.

## Checks worth re-running after an edit

```bash
node --check program/data.js && node --check program/app.js
```

Then confirm every exercise still has a video, and that each of the 182 days
still lands in its time window — both are a few lines against `sessionFor()`
and `EX`.

## What is deliberate

- **No loaded or end-range lumbar flexion anywhere.** No Jefferson curls, no
  weighted toe-touches, no sit-ups, no rounded-back seated hamstring stretch.
  The one flexion exercise, the wall roll-down, is supported and flagged.
- **Nerve sliders, never nerve stretches.** Oscillatory, never held.
- **Colour never carries category identity.** Eight categories cannot clear the
  colourblind-separation floors as eight hues, so the calendar encodes category
  as a two-letter code and uses colour for completion state only.
- **Every exercise is taught by a real video, not a drawing.** Each embed has an
  open-on-YouTube link beneath it, because a published artifact's content policy
  may refuse to frame third-party video.
