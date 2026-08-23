# Baseball Duck — Children's Function Learning Study (CFL2)

Browser-based experiment hosted on GitHub Pages, sibling to `CFL1/star_farm`.
Runs on iPad (touch), desktop (mouse), or any modern browser. Unlike
star_farm (portrait, seed/vine theme), this study is **landscape** and uses
a baseball theme: a duck predicts where a ball, launched from a slingshot,
will land.

Data is saved as a CSV downloaded to the device running the experiment, and
optionally also pushed to OSF via jsPsych DataPipe (see "Data Pipe / OSF
setup" below — this last part still needs to be set up manually).

## Study Flow

```
Intro (main.jpeg + background2 music, next)
  Fam_1   video CFL2_intro1 (auto-advance)
  Fam_2   Intro_1.jpeg + Audio_1 narration, auto-advance when audio ends
  Fam_3   Intro_2.jpeg, drag the free apple along the gray bar, OK
  Fam_4   video CFL2_intro2_3 — duck misses, then catches (auto-advance)
  Fam_7   Intro_3.jpeg + Audio_2 narration, auto-advance when audio ends
  Fam_8   Intro_4.jpeg, drag apple, OK
  Fam_9   video CFL2_intro4_5 — duck misses, then catches (auto-advance)
Transition_1 (Transition_bg.jpeg + Audio_3, next)
Training ×18 (3 blocks of 6, ascending sweeps — see config/functions.js):
  training_response  — ball appears on the slingshot bar at the trial's
                        input value; drag the duck along the ground line
                        to predict the landing spot; OK locks it in
  training_feedback   — ball rolls the length of the bar, then falls in a
                        half-parabola to the true landing spot; audio; next
  (checkpoint audio after trial 6: "let's do this again..."; after trial 12,
   now the last block transition: "let's do this for the last time...")
Transition_2 (Training_bg.jpeg + Audio_11, next)
Testing ×9 (shuffled order, no feedback shown — same UI as training_response
  but the trial ends the instant OK is pressed; true landing spot is never
  revealed)
End: video CFL2_end (auto-advance) → data save → "Session complete"
```

Trial numbering (`fam_4`, `fam_7`, `fam_9`, …) intentionally has gaps —
it's kept aligned with the original task-spec numbering rather than
renumbered contiguously, so `fam_5`/`fam_6`/`fam_10`/`fam_11` (retry
attempts folded into the combined miss+catch videos) are simply absent.

### Function 3 (quadratic) uses a different flow entirely

Selecting **Function 3** on the startup form switches `index.html` to a
completely separate familiarization/training/testing story — a slingshot
that **rotates** around a fixed pivot (0° = horizontal, 90° = straight down)
instead of a ball sliding along a straight bar. Intro, the closing video,
and the data-save step are shared code, unchanged, regardless of function.

```
Intro (shared)
  Fam_1   video CFL2_intro1 (auto-advance, shared)
  Fam_2   Intro_5.jpeg + Audio_1, auto-advance
  Fam_3   Intro_6.jpeg, rotate the free apple_slingshot, OK
  Fam_4   video CFL2_intro6_7 (auto-advance)
  Fam_5   Intro_7.jpeg + Audio_12, next
  Fam_6   Intro_8.jpeg + Audio_13, next
  Fam_7   Intro_9.jpeg, rotate apple_slingshot (starts ~19°), OK
  Fam_8   video CFL2_intro8_9 (auto-advance)
  Fam_9   Intro_10.jpeg + Audio_13, next
  Fam_10  Intro_11.jpeg, rotate apple_slingshot (starts ~43°), OK
  Fam_11  video CFL2_intro10_11 (auto-advance)
Transition_1 (Transition_bg_fn3.jpeg + Audio_3, next)
Training ×18 / Testing ×9 (same 3-block schedule as functions 1/2/4):
  ball + slingshot are STATIC each trial, angle = inputToAngle(input_value)
  = (input/100)*90 -- only the duck is draggable, identical mechanic/
  LINE_LEFT/RIGHT/Y constants as the original flow.
  Feedback: ball rolls inward to the pivot, then flies to true_output with
  a rise that scales with sin(angle) -- flat near 0°, high/narrow near 90°.
  Checkpoints use Audio_16 (before block 2) / Audio_17 (before block 3).
End (shared) → data save (shared)
```

All the rotation geometry (pivot points, radii, sprite anchor points, the
apple's three starting angles) was measured the same way as the
BAR_LEFT/LINE_LEFT constants below — see the "CFL2-QUADRATIC (function 3)
GEOMETRY" comment block near the top of `index.html`'s `<script>` for the
exact constants and how to re-measure them if the art changes.

## Deploying to GitHub Pages

1. Create a new GitHub repository (e.g., `baseball-duck-study`).
2. Push this folder's contents to the repo, preserving folder structure.
3. In the repo on github.com: **Settings** → **Pages** → under "Build and
   deployment", set **Source** to "Deploy from a branch", **Branch** to `main`
   and folder to `/ (root)`. Click **Save**.
4. Wait ~1 minute. Your experiment URL will be:
   `https://<your-username>.github.io/<repo-name>/`

## Running a Session

1. Open the study URL on the device, **held in landscape**. A rotate-device
   overlay covers the study if it's in portrait (see `#orientation-lock` in
   `css/styles.css`).
2. Fill in the experimenter startup form: Participant ID, Age (3–12), and
   Function (1 = positive linear, 2 = negative linear, 3 = quadratic,
   4 = exponential growth — same four formulas as star_farm, see
   `config/functions.js`).
3. Click "Start Session" → hand the device to the child.
4. At session end, a CSV downloads automatically. Filename is the random
   10-character subject ID, e.g. `aB3dE7fG2h.csv`.
5. Reload the page (or navigate back to the URL) to start the next child.

URL query params for quick testing/reruns: `?pid=1&age=6&fn=1`.

## Assets — what's already here vs. still needed

Everything referenced by `index.html` (functions 1/2/4 AND function 3) is
present in `assets/`. Function-3-only images: `Intro_5–11.jpeg`,
`Training_bg_fn3.jpeg`, `Transition_bg_fn3.jpeg`, `apple_slingshot.png`,
`slingshot.png`. Function-3-only audio: `Audio_12–18` (all `.m4a`).
Function-3-only video: `CFL2_intro6_7.mp4`, `CFL2_intro8_9.mp4`,
`CFL2_intro10_11.mp4`. Everything else is shared with (or exclusive to)
functions 1/2/4 as laid out in the two Study Flow sections above.

`index.html` no longer references `CFL2_intro2.mp4`, `CFL2_intro3.mp4`,
`CFL2_intro4.mp4`, `CFL2_intro5.mp4`, or `Audio_9.m4a` — they're superseded
by the combined `CFL2_intro2_3.mp4` / `CFL2_intro4_5.mp4` clips and the
3-block training schedule (see Study Flow above), but they're still in
`assets/` in case you want them back. There's also `assets/audio/CFL-12.m4a`
and `assets/images/Transition_bg.jpg` sitting in `assets/` unreferenced by
any trial — check whether either is meant to replace something before
deleting it.

`duck.png` carries a red dot-with-tail marker on the glove — the tip of
that marker, not the image's bounding box, is the point that lands on the
ground line (`.anchor-duck-arrow` in `css/styles.css`, measured at 32.5%,
82.7% of the 291×231 source art). Re-measure and update those two numbers
if `duck.png` is ever replaced with different art.

## Coordinate calibration

All interactive elements are positioned in **% of the `.stage` box**
(which is itself locked to the background art's 2112×1188 aspect ratio —
see `.stage` in `css/styles.css`), not pixels, so everything scales with the
viewport. The constants live at the top of the `<script>` block in
`index.html`:

```js
const BAR_LEFT     = 1;     // left end of the gray slingshot bar
const BAR_RIGHT    = 38.5;  // right end of the bar / fork cup (launch point)
const BAR_Y        = 44.7;  // vertical center of the gray bar
const LINE_LEFT    = 38.9;  // left end of the white ground line (0% of duck/output scale)
const LINE_RIGHT   = 92.9;  // right end of the white ground line (100% of duck/output scale)
const LINE_Y       = 66.3;  // vertical center of the white ground line (duck drag height)
const LINE_TOP_Y   = 64.9;  // top edge of the white ground line (ball lands resting ON TOP of it)
```

These were measured with a pixel-level scan of the actual PNG/JPEG art (scan
for the gray/white pixel bounding box), not by eye — see the commit that
introduced this recalibration for the one-off Python snippet. If the art
moves again, re-run the same kind of scan rather than eyeballing it; the
duck's drag range and the ball's landing spot are both driven directly off
these numbers, so being off by a percent or two is visible.

The ball is anchored by its own center (it's a plain circle), so its
resting/rolling height on the bar is just `BAR_Y`. But for the landing spot
at the end of training feedback, the ball should rest with its *bottom
edge* on top of the ground line, not its center buried in it — `BALL_LANDING_Y`
in `index.html` computes that offset from `BALL_WIDTH_PCT` (the ball
sprite's width, which is also set inline as `width:3%`) and the stage's
aspect ratio, so if you resize the ball sprite, update `BALL_WIDTH_PCT` to
match rather than just the inline `width:`.

## Data Pipe / OSF setup (manual step)

`index.html` has a `PIPE_EXPERIMENT_ID` constant near the end of
`runExperiment()`, currently empty — with it empty, the study **skips**
the OSF upload and only does the local CSV download. To enable OSF saving:

1. Go to https://pipe.jspsych.org/ and follow their setup — this links
   *your own* OSF account and creates a DataPipe experiment tied to an OSF
   project you own. This can't be done on your behalf; it needs your OSF
   login.
2. Create (or reuse) an OSF project for this study's data.
3. Paste the resulting experiment ID into `PIPE_EXPERIMENT_ID` in
   `index.html`.

Until then, every session still saves a CSV locally via the browser's
download — verify the file before closing the tab.

## Input Compatibility

Drag interactions (apple, duck) use the same unified pointer/touch handling
as star_farm, ported to `trials/custom_plugins.js` and actually wired up
here via `attachUnifiedInput()`:
- **Pointer events** (modern API) handle mouse, touch, and stylus in one
  code path on all current browsers including iPad Safari 13+.
- **Fallback path** for older browsers pairs `mousedown`/`touchstart`.
- **Multi-touch protection** ignores extra pointers (e.g., a resting palm).

Dragging stops wherever the pointer/touch is released and can be picked up
and moved again; the OK button only appears after the first drag, and
locks the sprite in place when pressed.

## File Structure

```
baseball_duck/
├── index.html                    # entry point: startup form + full timeline
├── config/
│   └── functions.js              # same formulas as star_farm, trimmed to 3 training sweeps
├── trials/
│   └── custom_plugins.js         # attachUnifiedInput() — mouse/touch/pen drag helper
├── css/
│   └── styles.css                # landscape (16:9) aspect-locked stage + orientation lock
├── assets/
│   ├── images/
│   ├── audio/
│   └── videos/
└── README.md
```

## Data Output Columns

One row per trial. Columns of note:

**Session-level** (same on every row): `subject_id`, `pid`, `age`,
`function_number`.

**Trial-level**: `task` (`intro`, `fam_1` through `fam_11` — with gaps, see
above, `transition_1`, `training_response`, `training_feedback`,
`before_block_2`, `before_block_3`, `transition_2`, `testing`, `end`),
`input_value` (x, 0–100), `true_output` (y, 0–100, null on trials without
one), `response_pct` (duck's predicted landing spot, 0–100), `trial_index`,
`canonical_index` (testing only — which item from `functions.js` was shown,
before shuffling), `interacted`, `first_move_rt_ms`.

Fam drag trials additionally record how the free sprite was left: functions
1/2/4 (`buildAppleDragTrial`) record `apple_final_pct` (0–100 position along
the bar); function 3 (`buildRotatingDragTrial`) records
`apple_final_angle_deg` (0–90, degrees from horizontal) instead, since the
sprite there rotates rather than slides.

Filter on `task == 'training_response'` or `task == 'testing'` for the
child's predictions; `task == 'training_feedback'` rows carry the same
`input_value`/`true_output` for reference but no response.
