# Build Brief — "Working With Claude" one-pager
### AI Training Session #1 · Atomic · client-facing leave-behind

**Status:** ready to build locally
**Owner:** Atomic
**Format:** single self-contained HTML page, published as a private Claude Artifact
**Read time target:** 3 minutes

---

## 0. How to use this document

This brief is self-contained. Everything needed to build the page is here —
copy, structure, interaction mechanics, colour tokens with verified contrast
figures, production steps, red flags, and QA.

Work top to bottom. **Section 8 (Build workflow) is the running order.** The
first task in it is a five-minute smoke test that decides whether the video
approach survives; do not build the video before that test passes.

---

## 1. Purpose and audience

**Who Atomic is here.** Atomic is a supply chain planning platform. In this
engagement Atomic is the one *delivering AI enablement training* to supply
chain leaders at client companies. Atomic is the vendor and the host, not the
subject. The page carries Atomic's brand and sits in front of every client.

**Who reads this page.** A supply chain leader at a client company — VP Supply
Chain, Head of Planning, S&OP lead, COO at a mid-market consumer brand. Assume:
smart, time-poor, commercially fluent, *not* technical. Assume they have used a
chatbot a few times and quietly suspect they are behind. Assume they have been
pitched AI four times this year and are tired of it.

**What the page is actually for.** Not to sell the demo. To hand a leader a
**durable mental model for working with Claude**. It is the foundation that
later branches into per-individual and per-team material. If a reader
remembers exactly one thing a month later, it should be the shape of the
maturity curve — not a feature.

**The promise, stated on the page:** *Twenty minutes from now you'll have
Claude reading your own files. Three minutes from now you'll know why that
matters.*

---

## 2. Structure — two distinct parts

The training flow is explicit: **start with the maturity curve, not with a
demo. Then demo.** The page mirrors that. Two separate movements with a
deliberate, visible seam between them.

```
┌─────────────────────────────────────────┐
│  HEADER                                 │  Atomic mark, title, the promise
├─────────────────────────────────────────┤
│  PART 1 — The maturity curve            │  Standalone. Full attention.
│  Chat → Context → Connect →             │  No product names. No features.
│  Delegate → Compound                    │  Works if the reader stops here.
├─────────────────────────────────────────┤
│  ── seam: handoff line ──               │  Visible transition
├─────────────────────────────────────────┤
│  PART 2 — The six-step demo             │  Larger, richer, more colour.
│  1 App  2 Files  3 Connector            │  Six different interactions.
│  4 Skill(▶video)  5 Artifact  6 Team    │  Each tagged back to a stage.
├─────────────────────────────────────────┤
│  CLOSE — after week one, + the bridge   │
└─────────────────────────────────────────┘
```

**Part 2 is the larger half** — more space, more interaction, more colour.
That is what "demo leads" means. Part 1 leads in *sequence*; Part 2 leads in
*weight*.

**The seam matters.** Part 1 and Part 2 must not blur into one continuous
scroll of similar-looking blocks. Change the background tone, change the
container width, or put a full-bleed rule between them — something that makes
a reader feel they have crossed from *idea* into *demonstration*.

---

## 3. Brand and colour tokens

### 3.1 Confirm against the live site first

Before building, open **atomic.supply** and confirm/capture:

- [ ] Exact hex values (the ones below are working values, verify them)
- [ ] The logo — grab the SVG from the page source if available, otherwise a
      2x PNG on transparent background
- [ ] The typeface — check `font-family` in devtools computed styles. If it is
      a licensed webfont Atomic cannot redistribute, use the closest Google
      Font and record the substitution
- [ ] Any existing motion/interaction language worth echoing

### 3.2 Working palette

| Role | Hex | Notes |
|---|---|---|
| Primary accent (Atomic blue) | `#0052FF` | Pantone Reflex Blue C / 2728 C |
| Primary dark / charcoal | `#0A0A0A` | Pantone Black 6 C |
| Secondary dark | `#111111` | |
| Background | `#FFFFFF` | |

### 3.3 The Atomic blue ramp

The contrast problem is solved **inside the palette**, not by importing an
off-brand colour. Every blue below is `#0052FF` mixed with either `#0A0A0A`
(shades) or `#FFFFFF` (tints), so the whole page reads as one brand blue at
different weights.

| Token | Hex | On `#FFFFFF` | On `#0A0A0A` |
|---|---|---|---|
| `--blue-900` | `#062A78` | **13.04:1** | 1.52:1 |
| `--blue-800` | `#04359D` | **10.49:1** | 1.89:1 |
| `--blue-700` | `#0240C2` | **8.35:1** | 2.37:1 |
| `--blue-600` | `#0149E2` | **6.88:1** | 2.88:1 |
| `--blue-500` | `#0052FF` | **5.75:1** | 3.44:1 |
| `--blue-400` | `#3878FF` | 3.96:1 | **5.00:1** |
| `--blue-300` | `#6194FF` | 2.92:1 | **6.78:1** |
| `--blue-200` | `#8CB1FF` | 2.13:1 | **9.28:1** |
| `--blue-100` | `#C7D9FF` | 1.42:1 | **13.95:1** |
| `--blue-50`  | `#EDF3FF` | 1.11:1 | **17.79:1** |

Bold = passes WCAG AA for body text (4.5:1). All figures are computed
relative-luminance values, not estimates.

**How the ramp resolves the problem.** `#0052FF` (blue-500) is the brand blue
and works as text on white at 5.75:1. It fails on dark at 3.44:1 — so on dark
grounds the page steps up the same ramp to **`--blue-300` (`#6194FF`) at
6.78:1**. Still Atomic blue, just the tint that survives a dark background.

**Role assignment:**

| Role | Light theme | Dark theme |
|---|---|---|
| Accent text (body size) | `--blue-500` `#0052FF` | `--blue-300` `#6194FF` |
| Accent text (small / dense) | `--blue-700` `#0240C2` | `--blue-200` `#8CB1FF` |
| Accent fill (buttons, bars, curve stroke) | `--blue-500` | `--blue-500` |
| Label on an accent fill | `#FFFFFF` | `#FFFFFF` |
| Tinted surface / hover ground | `--blue-50` | `--blue-900` |
| Quiet border | `--blue-100` | `--blue-800` |

`--blue-400` `#3878FF` passes on dark at 5.00:1 and sits closer to the brand
blue than blue-300. Use it if you want the dark theme to read more saturated;
blue-300 is the safer default because 6.78:1 leaves headroom for antialiasing
on thin type.

### 3.4 Neutrals and status

Neutrals are the charcoal and white already in the palette, plus the two greys
needed to make muted text legal on each ground:

| Token | Hex | On its ground |
|---|---|---|
| `--text` light | `#0A0A0A` | 19.80:1 on white |
| `--text-muted` light | `#595959` | 7.00:1 on white |
| `--text` dark | `#E8E8E8` | 16.16:1 on `#0A0A0A` |
| `--text-muted` dark | `#B4B4B4` | 9.55:1 on `#0A0A0A` |

Status colours are the one necessary extension beyond blue — a supply chain
dashboard cannot signal risk in blue. Keep them desaturated so they sit beside
the brand rather than competing with it, and use them **only** in step 5's
dashboard and step 6's chips.

| Role | Light | Ratio | Dark | Ratio |
|---|---|---|---|---|
| `--ok` | `#0F7A4C` | 5.37:1 | `#4ADE9B` | 11.51:1 |
| `--warn` | `#8A5A00` | 5.93:1 | `#F0B429` | 10.62:1 |
| `--risk` | `#A31515` | 7.85:1 | `#FF6B6B` | 7.13:1 |

### 3.5 Token block

Put this at the top of the `<style>`. Re-skinning for another client should be
an edit to this block and nothing else.

```css
:root{
  /* Brand ramp — all derived from #0052FF */
  --blue-900: #062A78;  --blue-800: #04359D;  --blue-700: #0240C2;
  --blue-600: #0149E2;  --blue-500: #0052FF;  --blue-400: #3878FF;
  --blue-300: #6194FF;  --blue-200: #8CB1FF;  --blue-100: #C7D9FF;
  --blue-50:  #EDF3FF;

  /* Roles — light theme */
  --bg:            #FFFFFF;
  --surface:       var(--blue-50);
  --surface-2:     #F2F5FA;
  --border:        var(--blue-100);
  --text:          #0A0A0A;   /* 19.80:1 */
  --text-muted:    #595959;   /*  7.00:1 */
  --accent:        var(--blue-500);  /* 5.75:1 */
  --accent-strong: var(--blue-700);  /* 8.35:1 — small/dense accent text */
  --accent-fill:   var(--blue-500);
  --accent-ink:    #FFFFFF;   /* label colour on an accent fill */
  --ok:            #0F7A4C;
  --warn:          #8A5A00;
  --risk:          #A31515;
}

/* System default (no data-theme attribute) */
@media (prefers-color-scheme: dark){
  :root:not([data-theme="light"]){
    --bg:            #0A0A0A;
    --surface:       #141414;
    --surface-2:     #1C1C1C;
    --border:        var(--blue-800);
    --text:          #E8E8E8;          /* 16.16:1 */
    --text-muted:    #B4B4B4;          /*  9.55:1 */
    --accent:        var(--blue-300);  /*  6.78:1 — NOT blue-500 */
    --accent-strong: var(--blue-200);  /*  9.28:1 */
    --accent-fill:   var(--blue-500);  /* fill only, never text */
    --accent-ink:    #FFFFFF;
    --ok:            #4ADE9B;
    --warn:          #F0B429;
    --risk:          #FF6B6B;
  }
}

/* Explicit dark choice — repeat the same overrides so the toggle wins
   in both directions. Do not rely on the media query alone. */
:root[data-theme="dark"]{ /* …identical overrides… */ }

body{ background: var(--bg); color: var(--text); }
```

> Every value above is contrast-checked against its own ground. If you change
> any of them after confirming the real hexes from atomic.supply, regenerate
> the ramp the same way — mix the brand blue toward `#0A0A0A` for shades and
> toward `#FFFFFF` for tints — and re-run the check in §11.3.

---

## 4. Part 1 — The maturity curve

### 4.1 Intent

A standalone frame. Not a strip, not a rail, not scaffolding for the demo. It
gets roughly a full screen. **A leader who reads only this section and closes
the tab has still received the thing worth receiving.**

No product names. No feature names. No "Claude can…". This section describes
what changes *for the reader*, stage by stage. The demo names the products.

### 4.2 The five stages and their copy

Each stage: a short label, one sentence. That is all.

| Stage | Sentence |
|---|---|
| **1 · Chat** | You ask, it answers. Genuinely useful — but it starts from nothing every time, and it has never seen your business. |
| **2 · Context** | It can see what you actually work with. The answers stop being generic. |
| **3 · Connect** | It reaches into where your work already lives, with your permission. Now it knows what happened yesterday. |
| **4 · Delegate** | You stop asking and start assigning. The same work happens the same way, without you starting it. |
| **5 · Compound** | What one person worked out becomes how the team works. This is where the returns stop being linear. |

### 4.3 The individual → team handoff

Mark it visually between **Delegate** and **Compound** — a dashed vertical
divider with two small labels, `You` on the left, `Your team` on the right.
This is the hinge of the whole model and is worth one extra beat of design.

### 4.4 Geometry and motion

- An actual rising curve (SVG path), not five boxes in a row. The shape
  carries the argument: gentle through stages 1–2, steepening at 4–5.
- Five nodes on the path, each with label and sentence.
- **Entrance:** on scroll into view, the path draws left-to-right using
  `stroke-dasharray` / `stroke-dashoffset`, ~900ms, `ease-out`. Nodes fade and
  rise in on a 120ms stagger behind the drawing head.
- **Hover/tap a node:** it enlarges slightly and its sentence gains emphasis.
  Touch devices must get this on tap, and nothing may be hover-only.
- Under `prefers-reduced-motion: reduce`, the path renders complete and the
  nodes appear with no transform — everything visible, nothing moving.
- **Below 700px** the curve rotates to vertical: nodes stack, the path becomes
  a descending spine on the left. Do not shrink the horizontal curve into
  illegibility.

### 4.5 The self-locating question

Directly beneath the curve, one line in muted text:

> *Most leaders we meet are at stage one and assume that's the whole thing.*

This lets the reader place themselves without being told they are behind. Keep
it gentle. It must not read as a diagnosis.

### 4.6 The seam / handoff line

Closes Part 1 and opens Part 2:

> **So here's what stages two through five actually look like. It takes about
> twenty minutes.**

Set larger than body copy. Give it real vertical space. This is the visible
transition from idea to demonstration.

---

## 5. Part 2 — The six-step demo

### 5.1 Intent

The larger, richer half. Each step gets **the interaction that matches what
that step actually feels like** — six identical cards would be a list, and a
list teaches nothing.

Every step carries a small **stage tag** (`Context`, `Connect`, `Delegate`…)
pointing back to the curve. That is reinforcement of a model already taught —
it is not a merger of the two parts, and the tags stay small and quiet.

Every step also carries a realistic **time cost** ("2 min", "4 min"). Leaders
buy in when the ask is bounded.

### 5.2 Overview

| # | Step | Felt meaning | Interaction | Stage tag | Time |
|---|---|---|---|---|---|
| 1 | Get the desktop app | Claude moves in | Before/after toggle | Chat → Context | 2 min |
| 2 | Cowork and your files | Claude gets a desk | Clickable folder tree | Context | 4 min |
| 3 | First connector | Claude gets reach | Two switches that change the answer | Connect | 3 min |
| 4 | First skill | Claude gets a habit | Run button → **embedded video** | Delegate | 6 min |
| 5 | Build an artifact | It becomes a thing you keep | Live mini dashboard | Delegate | 4 min |
| 6 | Your team *(optional)* | It compounds | Skill replicating outward | Compound | — |

---

### Step 1 — Get the desktop app · *Chat → Context* · 2 min

**Headline:** Claude moves in.

**Body:** Right now Claude probably lives in a browser tab. It's helpful, but
it's a stranger — it can't see anything you actually work with. The desktop app
changes the address.

**Supply-chain hook:** Your demand plan is a spreadsheet sitting on your
laptop. A browser tab can't open it. The app can.

**Interaction — before/after toggle.** One switch, two states, rendered as a
small window mock:

- **Browser** — a chat window. The user has pasted a fragment of a forecast.
  The reply is competent and completely generic.
- **Desktop app** — the same question, no pasting. The reply names the file
  and the actual numbers in it.

Transition between states: 300ms cross-fade plus a 4px vertical shift. The
switch is a real `<button>` with `aria-pressed`, operable by keyboard, with a
visible focus ring.

**Gloss:** *Same Claude. Different address. That's the whole step.*

---

### Step 2 — Cowork and your files · *Context* · 4 min

> **This is the conceptual unlock of the entire session.** Give it the richest
> interaction on the page. If a reader only understands one mechanic, make it
> this one.

**Headline:** Claude gets a desk.

**Body:** Cowork is where Claude does work that touches your files. You point
it at folders. That's the whole idea — and it's the most important thing to
understand today.

**Gloss, on the same line as the jargon:** Folders, not uploads. You're not
sending anything anywhere — Claude reads the files where they already sit,
only while the app is open, and only in the folders you point it at.

**Interaction — clickable folder tree.** Four folders. Clicking one expands it
and reveals what becomes possible. The panel beside it updates.

| Folder | Reveal |
|---|---|
| `/S&OP/` | Read last month's deck and draft this month's first pass. |
| `/Suppliers/` | Pull lead times out of forty contracts without you opening one. |
| `/Demand Plan/` | Compare this week's forecast to last week's and say what moved. |
| `/Purchase Orders/` | Find every PO that slipped past its promise date. |

Mechanics: real `<button>`s in a `role="tablist"`-style pattern with arrow-key
navigation; the reveal panel is the associated panel with `aria-live="polite"`.
One folder is open by default so the pattern is legible before any click.
Reveal animation: 200ms height + fade.

**Closing line:** *Nothing was uploaded. Nothing left your laptop. Claude just
knows where things are now.*

---

### Step 3 — First connector · *Connect* · 3 min

**Headline:** Claude gets reach.

**Body:** A connector is just permission — it lets Claude look at your inbox or
your calendar the way a new analyst would, with your say-so and nothing more.

**Interaction — two switches that visibly change the answer.** This is the
strongest teaching moment on the page, because nothing explains a connector
better than watching the answer get better.

Fixed question, shown above the switches: **"What should I worry about this
week?"**

- **Both off:** *I don't have visibility into your inbox or calendar, so I can
  only talk in general terms. Typically you'd want to look at supplier
  confirmations, any POs past their promise date, and whatever's on the S&OP
  agenda.*
- **Both on:** *Three things. Nordwind Components emailed Sunday night — the
  moulded housings slip two weeks, which lands on the Q3 build. Your S&OP
  review is Thursday at 10 and the demand file hasn't been touched since the
  4th. And four POs crossed their promise date over the weekend.*

Intermediate states (email only / calendar only) should each give a partial
answer. Four states total — it is worth building all four, because the
gradient *is* the lesson.

The response text re-types on change (a short character-reveal, ~600ms total,
not a slow typewriter) so the improvement is felt rather than read. Under
`prefers-reduced-motion`, swap instantly.

**Gloss:** *You can switch a connector off as easily as you switched it on.
Nothing is permanent, and Claude only ever sees what your own login can see.*

**All names fictional.** "Nordwind Components" and every other supplier name on
this page is invented. See §10.

---

### Step 4 — First skill · *Delegate* · 6 min — **video lives here**

**Headline:** Claude gets a habit.

**Body:** You just did something useful. A skill is you telling Claude *do
that again, the same way, every morning, without me asking.*

**Gloss:** You don't write code for this. You do the thing once, then ask
Claude to remember how you did it.

**The skill card:**

```
  Supply Chain Morning Briefing
  Runs weekdays, 7:00am

  1. Scan overnight supplier mail
  2. Cross-reference open POs
  3. Check today's calendar
  4. Write it up in six lines

                              [ ▶ Run ]
```

**Interaction — Run button reveals the video.** Pressing **Run** plays the
embedded video *inline, inside the mock window*. The video is the payoff of
this step. It is not a media section, it does not get its own heading, and it
does not appear anywhere else on the page.

Requirements on the `<video>` element:

- `muted`, `playsinline`, `loop`, `controls`, and a `poster`
- **not** `autoplay` — it plays on the user's press, which sidesteps every
  browser autoplay policy and every reduced-motion concern at once
- Two sources: **H.264 MP4 first, VP8 WebM second** (Safari < 16 will not play
  VP8)
- A visible text summary beside or beneath it carrying the same information,
  because the video is silent and carries meaning

**What the video shows** (~15s, silent):
the briefing assembling itself — mail scanned, POs matched, calendar checked,
six lines written. See §6 for production.

**Closing line:** *That's the shift. You stopped asking and started assigning.*

---

### Step 5 — Build an artifact · *Delegate* · 4 min

**Headline:** It becomes a thing you keep.

**Body:** The briefing is words. Sometimes you want a surface instead —
something you and your team open, that's current every time you look at it.

**Interaction — a live, actually-rendered mini dashboard.** Not a picture of a
dashboard. Build it in HTML/CSS/SVG so it renders crisply and animates in.

| Tile | Value | Treatment |
|---|---|---|
| On-time in full | 94.2% | 8-week sparkline, trending gently up |
| Inventory cover | 38 days | Horizontal bar against a target band |
| Open PO exceptions | 12 | Count, with 4 flagged |
| Supplier risk | 3 amber · 1 red | Small status chips |

Numbers count up from zero over ~700ms on scroll-in; bars grow from the left.
All static under reduced motion.

**The line that lands — use it:**

> *The page you're reading right now is one of these.*

That recursion is the most memorable moment available on this page. Do not cut
it.

---

### Step 6 — Your team · *Compound* · optional

**Badge it clearly:** `OPTIONAL — usually Session 2`. It must read as a
horizon, not as a sixth obligation for someone already feeling behind.

**Headline:** It compounds.

**Body:** Everything so far was you. The step after is your team — the briefing
you built becomes theirs, pointed at their own patch.

**Interaction — replication.** The step-4 skill card visibly copies outward to
four teammate avatars on scroll-in (staggered 150ms), while a shared skill
shelf fills in beneath: *Morning Briefing · Supplier Chaser · S&OP Prep ·
Exception Digest.*

**Honest caution — include it:** This is where it stops being a personal
productivity trick and starts being how the team works. It's also where you'll
want a little structure around who owns what. That's the conversation for
Session 2.

---

### 5.3 Close

**"After week one" — three concrete outcomes:**

1. You don't start the day triaging your inbox any more.
2. One recurring report writes its own first draft.
3. You've stopped asking *what can it do* and started asking *what should I
   hand it.*

**The bridge, one line:** *This is the foundation. From here it splits two
ways — deeper for you, and outward to your team.*

**Footer:** Atomic mark · "AI Training Session #1" · the date the page was last
verified (see §10, product claims age).

---

## 6. Video — built from the page's own components

**This is already built.** The video for step 4 exists in this repository, made
by composing the same mock components the page itself uses and exporting the
result. Nothing was recorded, no third-party footage is used, and no rights
question arises — which is exactly why this route was chosen over borrowing
Anthropic's demo footage (see §10.1).

### 6.1 What ships

| File | Size | Role |
|---|---|---|
| `assets/briefing.mp4` | 127 KB | H.264 — first source, the only one Safari plays |
| `assets/briefing.webm` | 327 KB | VP8 — second source |
| `assets/poster.min.png` | 58 KB | Final frame, palettised to 128 colours |
| `assets/step4-video.html` | 684 KB | The three above inlined as data URIs, ready to paste |

1280×880, 16.5s (15s of animation plus a 1.5s hold on the final frame so the
payoff lands before the loop restarts). Total inlined weight ~684 KB against a
2 MB budget and a 16 MB page cap.

### 6.2 What it shows

The Morning Briefing skill running end to end: overnight supplier mail scanned
(Nordwind's moulded housings slip two weeks, Kestrel's lead time moves 21 → 28
days), four purchase orders matched against their promise dates, today's
calendar checked, then a six-line briefing typing itself out.

Every supplier, SKU and order number is fictional — Nordwind Components,
Baltic Freight, Kestrel Polymers, Auralite Packaging, PO-4471/4488/4502/4519,
SKU-2214. **Reuse this same set everywhere on the page** so the story stays
coherent across the video, the folder tree in step 2 and the connector answer
in step 3.

### 6.3 Source layout

```
src/components.css   Shared mock UI — window chrome, skill card, activity
                     feed, briefing panel. The page imports this too, so the
                     product UI in the video and on the page cannot drift.
src/animation.html   The 15s timeline staged in those components.
build/frames.mjs     Headless Chromium → 375 PNG frames at 2x.
build/encode.sh      Frames → MP4 + WebM + poster.
build/inline.mjs     Assets → base64 data URIs → assets/step4-video.html.
build/verify.mjs     Loads the inlined video and asserts it decodes and plays.
```

### 6.4 Regenerating it

```bash
npm install
npm run build      # frames → encode → inline → verify
```

The timeline is **deterministic**: every visual is a pure function of `t` in
seconds via `window.seek(t)`, with no `requestAnimationFrame`, no CSS animation
and no `Date.now()`. The frame grabber seeks to exact times, so re-running
produces identical output. If you change copy or timings, edit the `TASKS`,
`BRIEF` and `BRIEF_START` constants at the top of the script in
`src/animation.html` and re-run.

### 6.5 Using it in the page

Paste the contents of `assets/step4-video.html` into step 4. It is already
configured correctly:

- `muted`, `playsinline`, `loop`, `controls`, `preload="metadata"`, and a poster
- **no `autoplay`** — it plays on the reader's press, which sidesteps browser
  autoplay policy and reduced-motion concerns in one move
- MP4 before WebM, so Safari picks a source it can decode
- a `<figcaption>` carrying the same information in text, since the video is
  silent, wired up with `aria-describedby`

### 6.6 Verification status

`npm run verify` confirms the inlined data URI decodes, plays and seeks —
**PASS**, 16.52s, 1280×880.

One honest caveat: that check runs in Playwright's Chromium, which is the
open-source build and **has no H.264 decoder** (`canPlayType` returns empty for
`avc1`, `probably` for VP8/VP9). So the MP4 path is verified as a *file*, not
as *playback*, in this environment. Real Chrome, Safari, Edge and Firefox all
decode H.264 — the MP4-first ordering stays correct — but confirm it on a real
browser during Phase 0.

### 6.7 If inlined video will not play at all

Phase 0 Gate A tells you before anything is at stake. If the artifact CSP
blocks `data:` in `media-src`, fall back to running `src/animation.html`
directly in the page — the timeline is already a self-contained HTML animation,
so the fallback is to drive `seek()` from a press instead of playing a video
file. Same components, same beats, no `<video>` element.

Then **say so plainly in the handoff.** Do not ship a CSS animation while
describing it as an embedded video.

## 7. Product UI on the page

### 7.1 One source, no borrowed assets

Every piece of product UI on this page is **recreated in CSS/SVG** from
`src/components.css` — the same components the video is composed from. There
are no captured screenshots and no third-party image assets anywhere in the
build. That is a deliberate choice, and it buys three things at once:

1. **No rights question.** Nothing belonging to anyone else is redistributed.
   See §10.1.
2. **No data-leakage risk.** There is no real account, inbox or supplier list
   anywhere near the page.
3. **No drift.** The window chrome in step 1, the skill card in step 4 and the
   frames of the video are literally the same CSS. Change a token, everything
   updates together.

They also stay crisp at any zoom, weigh a few KB rather than a few hundred, and
sit natively in Atomic's palette.

### 7.2 Caption them honestly

These are illustrations, not screenshots, and must never be presented as
captures. One quiet line under the demo section covers it:

> *Product interfaces shown are illustrations. Suppliers, orders and figures
> are fictional.*

That single sentence discharges both the accuracy obligation and the
fictional-data disclosure.

### 7.3 If you later want real screenshots

Give every visual a stable hook — `data-swap-slot="step-3-connector"` — and fix
its container's aspect ratio, so a real capture can drop in later without
reflowing the layout.

Understand what that would reintroduce, though: the rights question in §10.1,
and a redaction obligation on every image. The recreated components avoid both.
If real screenshots do go in, use a dedicated demo account with fabricated
data — never a live one edited afterwards.

## 8. Build workflow

Run in this order.

**Phase 0 — One gate, cheap, first**

*Will an embedded video actually play? (~15 min)*

The finished page is a single HTML file published as a Claude Artifact.
Artifacts run under a content security policy that blocks the page from
loading anything off the internet — no image URLs, no video URLs, no CDN. So
every picture and the video have to be **baked into the file itself**, encoded
as text (a `data:` URI). That normally works. But the policy might also block
baked-in video specifically, and there is no way to know except to try.

So try it first, with a throwaway:

1. Take any tiny video, ~50 KB. Encode it as a `data:` URI. Drop it in a bare
   HTML file with a `<video>` tag.
2. Publish that as a throwaway artifact and open the published URL.
3. **It plays** → the video approach works; carry on.
   **It doesn't** → switch to the §6.7 fallback now.

Fifteen minutes here, or a day of video work discovered to be useless at the
very end. Do it first.

**Phase 1 — Brand**
3. Pull the real hexes, logo and typeface from atomic.supply (§3.1).
4. Regenerate the blue ramp from the confirmed brand blue and re-run the
   contrast tables in §3.3 and §3.4. Fix any failing pair before writing a
   line of layout.

**Phase 2 — Content**
5. Write all copy first, as plain text, and read it aloud. If a sentence makes
   you sound like a vendor, cut it. Tone check in §9.
6. Fabricate the demo dataset — supplier names, SKUs, dates, quantities. Keep
   one list and use it consistently across the video, the screenshots and the
   in-page mocks, so the story stays coherent.

**Phase 3 — Page**
7. Build Part 1: the curve, its motion, its responsive vertical fallback.
8. Build Part 2 step by step. Build the shared mock-window components once and
   reuse them across steps 1–4. If the video ends up being built rather than
   sourced (§6.2, third choice), these same components are what it is composed
   from — one source of truth for how "Claude" looks on this page.
9. Build the close and footer.

**Phase 4 — Media**
10. Paste `assets/step4-video.html` into step 4 (§6.5). The video is already
    built; only regenerate it (`npm run build`) if you change its copy or
    timings.
11. Nothing to gather for screenshots — the product UI is the recreated
    components from §7.

**Phase 5 — QA**
12. Work §11 end to end. Record actual measured numbers, not ticks.
13. Fix, re-measure, repeat.

**Phase 6 — Ship**
14. Publish the artifact. Re-open the **published URL** — not the local file —
    and re-verify theme handling, 400px width, and video playback there.
15. Hand over the URL together with the QA results, including anything that
    failed.

---

## 9. Tone

**Rules:**

- Second person. Short sentences. Contractions.
- Every piece of jargon glossed on the same line it first appears —
  "connector" gets "(it's just permission for Claude to read your inbox)".
- Concrete supply-chain nouns over abstractions. "Four POs crossed their
  promise date", not "operational exceptions were identified".
- Bounded time costs on every step. Leaders commit to bounded things.
- No exclamation marks. No "revolutionary", "unlock", "supercharge",
  "game-changing", "10x".
- No statistics about how many companies are falling behind. The reader is
  already worried; that is not the lever.
- Never imply the reader should already know this.

**The test:** read the page aloud to someone who does not work in tech. If they
flinch, tense up, or ask what a word means — rewrite that line.

---

## 10. Red flags

### 10.1 Rights — avoided by design, easy to reintroduce

This page is commercial material shown to paying clients, and Anthropic's
published terms are narrower than most people assume: their product
repositories are **"© Anthropic PBC. All rights reserved."** (public visibility
is not a licence), and their Trademark Guidelines require use to be
**specifically permitted and in materials approved beforehand**, prohibit
altering the marks, and prohibit anything implying sponsorship, endorsement or
affiliation.

**The current build sidesteps all of it.** The video is composed from Atomic's
own components (§6) and the product UI is recreated in CSS (§7), so nothing
belonging to anyone else is redistributed. Referring to Claude by name to
describe the product being taught is ordinary referential use.

**What would reintroduce it:** dropping in Anthropic's demo footage, using real
product screenshots as marketing imagery, putting their logo in a lockup with
Atomic's, or any "partner" / "authorised" / "in partnership with" wording. If
you decide you want any of those, get written clearance first —
**marketing@anthropic.com** — and ask once, covering the whole training
programme rather than this page alone.

### 10.1a Fictional data — keep it that way

Nothing on the page comes from a live account, and it should stay that way.
Every supplier, SKU, order and figure is invented (§6.2). The exposure this
avoids is real: a deliverable shown to *every* client, some of whom compete
with each other, is the last place real supplier names, volumes or pricing
should appear.

If anyone later swaps in a real capture, it goes through a full scrub —
supplier names, volumes, inbox contents, colleagues' names, notification
toasts, tab titles, autocomplete dropdowns — reviewed frame by frame, by a
second person, as a pass separate from general QA.

### 10.2 Everything else

| Risk | Handling |
|---|---|
| Inlined video blocked by CSP | Phase 0 gate; §6.7 fallback |
| `#0052FF` as text on dark | Fails AA at 3.44:1 — step up the ramp to `--blue-300` `#6194FF` (6.78:1) |
| Part 1 reading as a preamble | If the curve feels like throat-clearing, the page has failed at its actual job. It must stand alone |
| Implying Anthropic endorsement | Atomic delivers training. No "partner"/"authorised" language, no Anthropic logo lockup, no altered marks — see §10.1 |
| Illustration mistaken for a capture | One caption line covers the whole demo section — §7.2 |
| Product claims ageing | Date the page. Keep a short note of where each claim was verified. Re-check before each new client |
| Step 6 reading as obligation | Badge it optional, place it after the close of the main sequence |
| Safari and VP8 | MP4 listed first, WebM second; H.264 playback confirmed on a real browser in Phase 0 — see §6.6 |
| Autoplay blocked | Play on press; `muted` + `playsinline` regardless |
| Motion sickness / vestibular | Every animation behind `prefers-reduced-motion` |
| Hover-only interactions | Nothing may be hover-only — all four interactive steps must work on tap and on keyboard |
| File size | Budget under 2 MB video, well under the 16 MB cap. Base64 adds ~33% |
| One-pager gets printed anyway | Ship a light print stylesheet — §11 |

---

## 11. QA checklist

Record **measured values**, not ticks. "Contrast 5.75:1" beats "checked".

### 11.1 How to find issues

- **Contrast** — WebAIM Contrast Checker, or compute relative luminance
  directly. Do not judge by eye.
- **Accessibility** — axe DevTools or Lighthouse for the automated sweep, then
  a manual pass against the A11Y Project checklist. Automation catches roughly
  a third of real issues; the keyboard pass catches most of the rest.
- **Keyboard** — unplug the mouse. Tab through the entire page. If you cannot
  reach and operate all four interactive steps and the video controls, it
  fails.
- **Reduced motion** — macOS: System Settings → Accessibility → Display →
  Reduce Motion. Windows: Settings → Accessibility → Visual effects →
  Animation effects. Chrome devtools can also emulate it.
- **Themes** — devtools Rendering panel emulates `prefers-color-scheme`. Check
  all three states: forced light, forced dark, and system.
- **Widths** — devtools responsive mode at 400 / 768 / 1280 / 1920.
- **Screen reader** — VoiceOver (⌘F5) or NVDA. Read the page top to bottom
  with the screen off.

### 11.2 Rendering
- [ ] Publishes without error; the URL loads
- [ ] Correct in forced light, forced dark, and system themes
- [ ] `body` has an explicit token background in every theme
- [ ] No horizontal scroll at 400 / 768 / 1280 / 1920
- [ ] Side gutter ≥16px holds at every width
- [ ] Curve rotates to vertical below 700px and stays legible
- [ ] No layout shift when the video or any image loads
- [ ] No `<!doctype>`, `<html>`, `<head>` or `<body>` tags in the file
- [ ] `<title>` and `<style>` at the top of the file

### 11.3 Contrast — record the number
- [ ] Body text on light ≥4.5:1 — measured: ______
- [ ] Body text on dark ≥4.5:1 — measured: ______
- [ ] Accent text on light ≥4.5:1 — measured: ______
- [ ] Accent text on dark ≥4.5:1 — measured: ______ (blue-500 will fail here; blue-300 should pass)
- [ ] Labels on accent fills ≥4.5:1 — measured: ______
- [ ] Status colours (ok / warn / risk) on both grounds — measured: ______
- [ ] Non-text UI — borders, curve stroke, chart bars, switch tracks ≥3:1
- [ ] Focus indicator ≥3:1 against its adjacent colour

### 11.4 Motion and media
- [ ] `prefers-reduced-motion: reduce` stops every animation
- [ ] Curve renders complete and legible under reduced motion
- [ ] Counters show final values under reduced motion
- [ ] Video does not autoplay; plays on press
- [ ] Video is `muted`, `playsinline`, `loop`, has visible `controls`
- [ ] `poster` displays before play and carries meaning on its own
- [ ] MP4 listed before WebM
- [ ] Text equivalent conveys everything the silent video shows
- [ ] Video plays on the **published** artifact, not just locally
- [ ] Video pair size — measured: ______ (target <2 MB)
- [ ] Rendered page total — measured: ______ (cap 16 MB)

### 11.5 Accessibility
- [ ] Heading levels sequential, no skips
- [ ] Steps marked up as a list
- [ ] Every image and SVG has an accessible name, or is `aria-hidden`
- [ ] Visible focus ring on every interactive element
- [ ] Keyboard-only pass reaches and operates all four interactions
- [ ] Keyboard-only pass reaches and operates the video controls
- [ ] Folder tree supports arrow-key navigation
- [ ] Switches are real controls with correct state (`aria-pressed` / checkbox)
- [ ] Dynamic reveals announce via `aria-live="polite"`
- [ ] Nothing is hover-only
- [ ] Screen-reader pass: the page makes sense with the screen off
- [ ] axe / Lighthouse: zero critical or serious violations
- [ ] Text reflows at 200% zoom without loss

### 11.6 Content
- [ ] Curve section stands alone — a reader stopping there still gets the model
- [ ] The seam between Part 1 and Part 2 is visible
- [ ] Part 2 is visibly the larger, richer half
- [ ] Stage tags present on all six steps and matching the curve
- [ ] Time cost on every step
- [ ] Supply-chain examples in all six steps — no generic office filler
- [ ] Every supplier, SKU and person name is fabricated
- [ ] Recreated UI captioned as illustration
- [ ] Step 6 unmistakably optional
- [ ] Every product claim traced to a source, with the check date recorded
- [ ] No Anthropic partnership or endorsement implied
- [ ] Brand hexes match the confirmed values exactly
- [ ] Tone pass: no unglossed jargon, no hype words, nothing condescending
- [ ] Read aloud to a non-technical listener with no flinches
- [ ] Spelling and grammar pass

### 11.7 Rights
- [ ] No third-party footage, screenshots or logos anywhere in the page
- [ ] No Anthropic logo lockup; no "partner" / "authorised" / "endorsed" wording
- [ ] Product UI captioned as illustration (§7.2)
- [ ] If any of the above changed, written clearance obtained — date: ______

### 11.8 Fictional data
- [ ] Every supplier, SKU, order and figure is invented
- [ ] The same fictional set used in the video, step 2 and step 3 — coherent
- [ ] No real capture anywhere; if one was added, scrubbed and second-reviewed
      — reviewer: ______

### 11.9 Print
- [ ] Prints legibly
- [ ] Motion stripped; video replaced by its poster
- [ ] No card or curve node split across a page break
- [ ] Interactive states print in their most informative position

---

## 12. Definition of done

1. Published as a private artifact; the URL loads and has been re-verified on
   the published page, not only locally.
2. Every box in §11 either ticked with a measured value, or explicitly listed
   as failed in the handoff.
3. All data on the page fictional and internally consistent.
4. Video embedded as a real `<video>` element — or, if the Phase 0 gate
   failed, the fallback shipped and **described accurately** in the handoff.
5. No third-party assets in the page; product UI captioned as illustration.
6. Part 1 stands alone; the seam is visible; Part 2 is the larger half.
7. Someone non-technical has read it aloud without flinching.
8. Brand tokens confined to one `:root` block, so the next client is a
   colour-swap rather than a rebuild.

---

## 13. What this was benchmarked against

The structure and standards above are not invented. They track current practice
in two areas — AI maturity models, and accessible interactive web content.

### 13.1 Maturity model shape

The five-stage **Chat → Context → Connect → Delegate → Compound** curve is a
plain-language compression of the patterns these frameworks share: an
individual-experimentation stage, a team-pilot stage, and a scaled stage where
humans and agents work side by side. Sources consulted:

- SEI / Accenture, *AI Adoption Maturity Model* — the current structured
  reference for assessing and advancing AI capability
- Microsoft Learn, *Agentic AI adoption maturity model* — particularly its
  "Organization and culture" dimension, which is where the individual→team
  hinge in Part 1 comes from
- EPAM, *Where Are You on the AI Adoption Curve?* — the three-stage
  exploring / experimenting / transforming progression
- Heinz Marketing, *AI Maturity in 2026: Value, Visibility & Velocity*

**What the research says, and why the page is shaped this way:** roughly
three-quarters of organisations have AI deployed somewhere, but only a small
fraction are scaling it, and the strongest single predictor of bottom-line
impact is whether the organisation *tracks* what it is getting. Leaders at high
maturity visibly model the behaviour themselves.

That is the entire justification for starting with the leader and the mental
model rather than with a tool demo — and it is why the page's close is about
what changes in *their* week, not about features.

**Deliberately excluded:** the "95% of companies see no return" and "you are
falling behind" statistics. They are real findings, and they are the wrong
lever for this audience. See §9.

### 13.2 Accessible interactive content

- **WCAG 2.1 Level AA** — the baseline the checklist enforces: 4.5:1 for body
  text, 3:1 for large text and non-text UI
- **The A11Y Project checklist** — the manual pass in §11
- **WebAIM Contrast Checker** — the method behind every ratio in §3.3
- Guidance on `prefers-reduced-motion` and accessible animation, which is why
  every animation on this page is gated and why the video plays on press rather
  than autoplaying

### 13.3 Product accuracy

Any claim about how the desktop app, Cowork, connectors, skills or artifacts
behave should be checked against Anthropic's own current documentation and help
centre before each new client engagement. Note the date checked in the footer.
This is the fastest-moving part of the page.

### 13.4 Rights and trademark

The constraints in §6.1 and §10.1 come from Anthropic's own published terms:

- **Anthropic Trademark Guidelines** — anthropic.com/legal/trademark-guidelines.
  Marks may be used only as specifically permitted and in materials approved
  beforehand; no alteration; nothing implying sponsorship, endorsement or
  affiliation. Contact for an existing business relationship:
  marketing@anthropic.com.
- **Anthropic Commercial Terms of Service** —
  anthropic.com/legal/commercial-terms, referenced by the licence file in their
  public product repositories, which are marked "© Anthropic PBC. All rights
  reserved."
- **Claude Code legal and compliance docs** — docs.anthropic.com, which state
  plainly that the Claude Code and Anthropic names and logos may not be used in
  a way suggesting Anthropic built, endorses or is partnered with your product.

Re-check these before each engagement. They are terms, not norms, and they
change.
