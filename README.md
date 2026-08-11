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
  Fam_4   video CFL2_intro2 — duck misses the apple (auto-advance)
  Fam_5   Intro_2.jpeg, drag apple again, OK
  Fam_6   video CFL2_intro3 — duck catches the apple (auto-advance)
  Fam_7   Intro_3.jpeg + Audio_2 narration, auto-advance when audio ends
  Fam_8   Intro_4.jpeg, drag apple, OK
  Fam_9   video CFL2_intro4 — duck misses (auto-advance)
  Fam_10  Intro_4.jpeg, drag apple, OK
  Fam_11  video CFL2_intro5 — duck catches (auto-advance)
Transition_1 (Transition_bg.jpeg + Audio_3, next)
Training ×24 (4 blocks of 6, ascending sweeps — see config/functions.js):
  training_response  — ball appears on the slingshot bar at the trial's
                        input value; drag the duck along the ground line
                        to predict the landing spot; OK locks it in
  training_feedback   — ball rolls the length of the bar, then falls in a
                        half-parabola to the true landing spot; audio; next
  (checkpoint audio after trial 6 / 12 / 18: "let's do this again...")
Transition_2 (Training_bg.jpeg + Audio_11, next)
Testing ×9 (shuffled order, no feedback shown — same UI as training_response
  but the trial ends the instant OK is pressed; true landing spot is never
  revealed)
End: video CFL2_end (auto-advance) → data save → "Session complete"
```

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

**Present** (`assets/`): `main.jpeg`, `Intro_1–4.jpeg`, `Training_bg.jpeg`,
`Transition_bg.jpeg`, `next_button.png`, `ok_button.png`, `apple.png`,
`ball.png`, `duck.png`, `CFL2_intro1–5.mp4`, `Audio_1–7.mp3/m4a`,
`Audio_11.mp3`, `background2.mp3`, `button_click.mp3`, `ok_button_click.mp3`.

**Still needed** — `index.html` references these exact filenames already
(preload uses `continue_after_error: true` so the study still runs without
them, just with silent audio / an abruptly-ending video until they're added):

- `assets/audio/Audio_8.mp3`, `Audio_9.mp3`, `Audio_10.mp3` — "before block
  2/3/4" narration ("Let's do this again!...", etc. — see task spec).
  Extension assumed `.mp3` to match the majority of existing `Audio_N` files;
  if you add them as `.m4a` instead, update the `preload`/trial-builder
  filenames in `index.html` to match.
- `assets/videos/CFL2_end.mp4` — closing video.

There's also `assets/audio/CFL-12.m4a` and `assets/images/slingshot.png`
already in the folder that aren't referenced anywhere in `index.html` (the
gray bar is baked into the background art, not a separate sprite) — check
whether either is meant to replace something above before deleting it.

`duck.png` carries a red dashed arrow pointing down at the glove — that
arrow tip, not the image's bounding box, is the point that lands on the bar
/ ground line (`.anchor-duck-arrow` in `css/styles.css`, measured at 30.2%,
87% of the 274×262 source art). Re-measure and update those two numbers if
`duck.png` is ever replaced with different art.

## Coordinate calibration

All interactive elements are positioned in **% of the `.stage` box**
(which is itself locked to the background art's 2112×1188 aspect ratio —
see `.stage` in `css/styles.css`), not pixels, so everything scales with the
viewport. The constants live at the top of the `<script>` block in
`index.html`:

```js
const BAR_LEFT   = 1;   // left end of the gray slingshot bar
const BAR_RIGHT  = 38;  // right end of the bar / fork cup (launch point)
const BAR_Y      = 45;  // vertical center of the gray bar
const LINE_LEFT  = 43;  // left end of the white ground line
const LINE_RIGHT = 97;  // right end of the white ground line
const LINE_Y     = 67;  // vertical position of the white ground line
```

These were measured by eye against `Intro_1/2.jpeg` and `Training_bg.jpeg`.
If the art changes, or the apple/ball/duck sprites need finer alignment once
they're dropped in, open the study, and nudge these numbers until the sprite
centers (apple/ball) or feet (duck) line up with the bar/line in the
background image.

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
│   └── functions.js              # function formulas + training/testing grid (from star_farm)
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

**Trial-level**: `task` (`intro`, `fam_1`…`fam_11`, `transition_1`,
`training_response`, `training_feedback`, `before_block_2/3/4`,
`transition_2`, `testing`, `end`), `input_value` (x, 0–100),
`true_output` (y, 0–100, null on trials without one), `response_pct`
(duck's predicted landing spot, 0–100), `apple_final_pct` (Fam trials only),
`trial_index`, `canonical_index` (testing only — which item from
`functions.js` was shown, before shuffling), `interacted`,
`first_move_rt_ms`.

Filter on `task == 'training_response'` or `task == 'testing'` for the
child's predictions; `task == 'training_feedback'` rows carry the same
`input_value`/`true_output` for reference but no response.
