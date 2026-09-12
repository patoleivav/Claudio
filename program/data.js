/* ============================================================================
   Six-month recovery program — program data
   ----------------------------------------------------------------------------
   Everything the app needs to build 182 distinct daily sessions:
     PHASES    six blocks of weeks, each with its own job and dose scaling
     VIDEOS    curated follow-along routines, keyed by session type + phase
     EX        the exercise library — cue, why, 5-level chain, dose, figure
     SESSIONS  seven weekday categories x three weekly variants
   A day's session = SESSIONS[category][variant] + phase gates, with doses
   resolved by doseFor(). Nothing about a day is hand-written twice.
   ========================================================================= */

const PROGRAM = {
  weeks: 26,
  startDow: 1, // programme weeks run Monday -> Sunday
};

/* --- Phases -------------------------------------------------------------- */

const PHASES = [
  {
    n: 1, name: 'Foundations', weeks: 4, short: 'Learn the positions',
    job: 'Find your directional preference and learn what every position should feel like. Short holds, bodyweight only, nothing near end range.',
    mins: [30, 35], holdMul: 0.8, repMul: 0.8, sets: 1, accent: 'p1',
    opens: ['Directional preference self-test in week 1', 'Neutral spine and breathing on every exercise'],
  },
  {
    n: 2, name: 'Range & control', weeks: 4, short: 'Own the range actively',
    job: 'Longer holds and active range work on every joint. Your first loaded hinge patterning with a light dumbbell.',
    mins: [35, 45], holdMul: 1.0, repMul: 1.0, sets: 2, accent: 'p2',
    opens: ['CARs (slow controlled circles) enter every session', 'Light dumbbell hinge patterning, 5-10 kg'],
  },
  {
    n: 3, name: 'Strength in range', weeks: 4, short: 'Load the new range',
    job: 'Contract-relax stretching and end-range isometrics — the part that turns a stretch you can reach into range you can use. Real dumbbell work begins.',
    mins: [45, 45], holdMul: 1.15, repMul: 1.1, sets: 2, accent: 'p3',
    opens: ['Contract-relax on the big stretches', 'Bench work: supported rows, incline press, hip thrusts'],
  },
  {
    n: 4, name: 'Integration', weeks: 4, short: 'Range under load',
    job: 'Loaded mobility — Cossack squats, deep-squat prying, eccentric hamstring work. Yoga without block assistance, Pilates stepping up.',
    mins: [45, 55], holdMul: 1.3, repMul: 1.2, sets: 2, accent: 'p4',
    opens: ['Eccentric hamstring loading', 'Deep squat work with counterweight'],
  },
  {
    n: 5, name: 'Build', weeks: 5, short: 'Two real strength days',
    job: 'Two proper dumbbell strength days fold into the week alongside the mobility days. This is where the body composition and the resilience change.',
    mins: [50, 60], holdMul: 1.4, repMul: 1.3, sets: 2, accent: 'p5',
    opens: ['Tuesday and Thursday become strength + mobility', 'Progressive load: add weight when the last rep is clean'],
  },
  {
    n: 6, name: 'Consolidate', weeks: 5, short: 'Make it permanent',
    job: 'End-range strength, full flows, final re-test against your week-1 baseline, and the maintenance plan for month seven onward.',
    mins: [50, 60], holdMul: 1.5, repMul: 1.4, sets: 3, accent: 'p6',
    opens: ['Final measurement week', 'Maintenance plan unlocks at week 26'],
  },
];

/* --- Curated follow-along videos ----------------------------------------
   Real routines from physios and instructors, keyed [category][phase band].
   These are whole sessions to follow when you would rather be led than read;
   each exercise also carries its own demo lookup. */

const VIDEOS = {
  spine: [
    { id: 'Z9C38koJNTc', t: 'Exercises for Sciatica Pain Relief — daily routine', by: 'Dr James O’Donovan & Ella Boys, physio', min: 12, band: 1 },
    { id: 'BVglU1hRJ_4', t: 'Exercises for Sciatica Pain Relief', by: 'Jessica Valant, physical therapist', min: 10, band: 1 },
    { id: 'Z08vWq0H_tE', t: 'McGill Big 3 core routine', by: 'guided 3-minute walkthrough', min: 3, band: 2 },
    { id: 'yWFM45AgJ6A', t: 'How to perform the McGill Big 3 properly', by: 'form breakdown', min: 9, band: 2 },
    { id: 'AkgxIT2z0js', t: '20 min sciatica pain relief exercises', by: 'longer follow-along', min: 20, band: 3 },
  ],
  hips: [
    { id: 'lQgy4820wiU', t: '20 min beginner hip flexibility', by: 'follow-along', min: 20, band: 1 },
    { id: 'k_N2vFeJlVM', t: '20 min hip & hamstring stretch routine', by: 'gentle release', min: 20, band: 1 },
    { id: '3Ymjw7TSzrE', t: '15 minute hamstring flexibility routine', by: 'follow-along', min: 15, band: 2 },
    { id: 'Z04ldN6WnRY', t: '20 minute hip flexor flexibility routine', by: 'follow-along', min: 20, band: 2 },
    { id: '3zqDris6lD4', t: 'Dumbbell Romanian deadlift — beginner hip hinge', by: 'technique, watch before loading', min: 8, band: 3 },
  ],
  pilates: [
    { id: 'nnt34RN74Rs', t: '30 min full body Pilates for beginners', by: 'Move With Nicole', min: 30, band: 1 },
    { id: 'gYadYE_pibg', t: '20 min gentle full body mat Pilates', by: 'beginner flow', min: 20, band: 1 },
    { id: 'jUkNpKORO7o', t: 'Morning Pilates flow — stretch and strengthen', by: 'Lottie Murphy', min: 25, band: 2 },
    { id: 'DAdjf01N310', t: '20 min morning mat Pilates (moderate)', by: 'Move With Nicole', min: 20, band: 2 },
    { id: 'LbG1ovCGp-E', t: '30 min morning Pilates, energising full body', by: 'Move With Nicole', min: 30, band: 3 },
  ],
  upper: [
    { id: 'TD6pFqTXg7w', t: '10 minute daily shoulder mobility', by: 'follow-along', min: 10, band: 1 },
    { id: '9iHko2F81cE', t: '10 min shoulder & thoracic spine mobility', by: 'no equipment', min: 10, band: 1 },
    { id: 'wHtBWSliOsw', t: '25 min upper body mobility, all levels', by: 'neck, t-spine, shoulders, wrists', min: 25, band: 2 },
    { id: 'dzbc60Wfsi0', t: '20 min beginner mobility WOD', by: 'HASfit — shoulder, hip, ankle, wrist', min: 20, band: 2 },
    { id: 'OsO8WVO0mBQ', t: '20 min chest and back with dumbbells and bench', by: 'follow-along', min: 20, band: 3 },
  ],
  yoga: [
    { id: 'v7AYKMP6rOE', t: 'Yoga for complete beginners', by: 'Yoga With Adriene', min: 20, band: 1 },
    { id: 'pWobp3phsEU', t: 'Yoga for beginners — the basics', by: 'Yoga With Adriene', min: 22, band: 1 },
    { id: 'ER6cfX-Aq0E', t: '30 min beginners yoga flow, full body foundations', by: 'follow-along', min: 30, band: 2 },
    { id: 'P1SvHXqenPs', t: 'Total body yoga — day 7 of 30 Days', by: 'Yoga With Adriene', min: 30, band: 2 },
    { id: 'P8uHMMmWMHQ', t: 'Yoga Joy — full body vinyasa flow', by: 'Yoga With Adriene', min: 40, band: 3 },
  ],
  lowerleg: [
    { id: 'AHxPyPMz7VE', t: 'Beginner squat mobility, 10 minutes', by: 'follow-along', min: 10, band: 1 },
    { id: 'PdocnI5B54I', t: '10 min ankle mobility routine', by: 'follow-along', min: 10, band: 1 },
    { id: 'LV76bHJ9GNk', t: '15 minute ankle mobility routine', by: 'follow-along', min: 15, band: 2 },
    { id: 'ZR42NtNvrh0', t: 'Unlock deep squats — full squat mobility', by: 'follow-along', min: 25, band: 3 },
  ],
  tspine: [
    { id: 'UilbuIgSkEs', t: '10 minute thoracic mobility routine', by: 'flexion, extension, rotation', min: 10, band: 1 },
    { id: '6Gi-uoA8JLQ', t: '15 min thoracic spine mobility & shoulder relief', by: 'follow-along', min: 15, band: 2 },
    { id: 'ZMns9n1a3K0', t: '20 min mobility session', by: 'ankle, shoulder, hip, t-spine', min: 20, band: 3 },
  ],
  restore: [
    { id: 'TOmsmsl7RZg', t: 'Restorative yoga for lower back pain', by: 'relaxing yin, 30 min', min: 30, band: 1 },
    { id: 'rSbEIic_ES4', t: 'Restorative yoga with a bolster', by: '20 minutes, stress-free', min: 20, band: 1 },
    { id: 'js9gNvYsQlk', t: '30 min restorative yoga with bolster & props', by: 'supported sequence', min: 30, band: 2 },
    { id: '5xv82naAV9s', t: 'Relaxing yin yoga with a bolster', by: 'Devi Daly Yoga, 35 min', min: 35, band: 3 },
  ],
  strength: [
    { id: '3zqDris6lD4', t: 'Dumbbell Romanian deadlift — the hinge', by: 'beginner technique', min: 8, band: 1 },
    { id: 'DXgWioMikfo', t: 'How to improve your hip hinge', by: 'RDLs, rows and why it matters', min: 10, band: 1 },
    { id: 'aLvUzxEq3oo', t: '30 min full body dumbbell workout with bench', by: 'follow-along', min: 30, band: 2 },
    { id: 'sTzgDjBwlHc', t: '35 min total body bench workout with dumbbells', by: 'follow-along', min: 35, band: 2 },
    { id: 'IIKepgbY0uc', t: '30 min full body dumbbell strength', by: 'follow-along', min: 30, band: 3 },
  ],
};

/* --- Exercise library ---------------------------------------------------
   n   name              tgt  what it is for        prop what you need
   p   figure pose       a    figure animation (poses to move between)
   s   sides (0 or 2)    d    dose: hold seconds / reps / breaths
   cue how to do it      why  why it is in the programme
   lv  five levels, easiest first — the app picks one and you can override
   care what would mean back off      vq  demo lookup
   ====================================================================== */

const EX = {

/* ========================= OPENING RITUAL ============================== */

breath360: {
  n: '360° breathing', tgt: 'diaphragm, rib cage', prop: [], p: 'supineKnees', s: 0,
  d: { k: 'breath', v: 6 },
  cue: 'On your back, knees bent, feet flat, hands on the sides of your lower ribs. Breathe in through the nose and feel the ribs widen sideways into your hands rather than the chest rising. Breathe out slowly through the mouth and let the ribs settle.',
  why: 'Every session starts here. It drops the guarding tone in the muscles around a painful back, and it is the reference you will use for bracing later.',
  lv: ['Hands on ribs, 6 breaths', '8 breaths, 4 seconds in and 6 out', '10 breaths with a 2-second pause at the top', 'Same in prone, with a book on the low back', 'Same standing, before every loaded set'],
  vq: '360 diaphragmatic breathing rib expansion tutorial',
},
pelvicTilt: {
  n: 'Pelvic tilts', tgt: 'lumbar spine, motor control', prop: [], p: 'supineKnees', s: 0,
  a: ['tiltPost', 'tiltAnt'], d: { k: 'reps', v: 10 },
  cue: 'On your back, knees bent. Flatten your lower back into the floor so the tailbone tucks under, then let it arch gently away from the floor. Slow, small, no force at either end. Your whole job is to feel the difference.',
  why: 'This is how you learn to find neutral — the position every hinge, lift and stretch later depends on. It is also a gentle pump for a stiff morning back.',
  lv: ['10 reps, tiny range', '12 reps, find the true middle and hold 3 seconds', '15 reps, add a breath out on the tuck', 'On hands and knees (cat-cow)', 'Standing against a wall'],
  vq: 'pelvic tilt exercise beginner tutorial neutral spine',
},
hipCar: {
  n: 'Hip circles (CARs)', tgt: 'hip joint capsule', prop: ['chair'], p: 'standing', s: 2,
  a: ['hipCarA', 'hipCarB'], d: { k: 'reps', v: 5 },
  cue: 'Hold the chair. Lift one knee to hip height, carry it out to the side as far as it goes, rotate the shin back, then take the leg behind you and return. One circle should take about ten seconds. Keep the rest of your body still — no leaning.',
  why: 'Controlled Articular Rotations ask the joint to move itself through its own range. This is the difference between range you can reach passively and range you actually own.',
  lv: ['Holding the chair, small circles', 'Holding lightly, bigger circles', 'Hands free', 'Hands free, 10 seconds per circle', 'Hands free, pausing 2 seconds at each corner'],
  care: 'Keep it out of the leg pain. If the circle catches the sciatic pain, shrink the circle rather than pushing through it.',
  vq: 'hip CARs controlled articular rotations standing tutorial',
},
shoulderCar: {
  n: 'Shoulder circles (CARs)', tgt: 'shoulder joint capsule', prop: [], p: 'standing', s: 2,
  a: ['shCarA', 'shCarB'], d: { k: 'reps', v: 5 },
  cue: 'Stand tall, one arm straight. Take it forward and up past your ear, keep reaching as it travels behind you, then down and back to the start. Ribs stay down — if you have to arch your back to get the arm up, you have found your real end range.',
  why: 'It maps and reclaims the shoulder range that five years of sitting quietly removed, and it warms the joint without loading it.',
  lv: ['Small circles, elbow may bend', 'Straight arm, medium circles', 'Full circle, ribs locked down', 'Full circle in 10 seconds each', 'Add a light 2 kg dumbbell'],
  vq: 'shoulder CARs controlled articular rotations tutorial',
},
neckCar: {
  n: 'Neck circles and nods', tgt: 'cervical spine', prop: [], p: 'seated', s: 0,
  a: ['neckA', 'neckB'], d: { k: 'reps', v: 6 },
  cue: 'Sitting tall. Nod the chin gently toward the throat, then look up — small range. Then tilt ear to shoulder each way, then turn to look over each shoulder. Nothing fast, nothing forced, no full head rolls.',
  why: 'The neck is on the list because you asked for everything, and because a stiff upper back always brings a stiff neck with it.',
  lv: ['Nods and tilts only', 'Add rotations', 'Add gentle diagonals', 'Hold 3 seconds at each end', 'Add a two-finger self-resistance at each end'],
  care: 'Dizziness or any pain into the arm means stop this one.',
  vq: 'gentle neck mobility exercises nods tilts rotations',
},
ankleCar: {
  n: 'Ankle circles', tgt: 'ankle, foot', prop: [], p: 'seated', s: 2,
  a: ['ankCarA', 'ankCarB'], d: { k: 'reps', v: 8 },
  cue: 'Seated, one leg out. Draw the biggest slow circle you can with the big toe, keeping the knee still so the movement is all ankle. Both directions.',
  why: 'Ankles that do not move send the work up to the knees and low back. Also the cheapest mobility win you have.',
  lv: ['8 circles each way', '10 circles, bigger range', 'Add toe spread at the top of each circle', 'Standing on one leg', 'Standing, eyes closed'],
  vq: 'ankle circles mobility exercise tutorial',
},

/* ===================== SPINE, NERVE & DEEP CORE ======================== */

pressUp: {
  n: 'Prone press-up', tgt: 'lumbar extension, disc', prop: [], p: 'prone', s: 0,
  a: ['prone', 'sphinxLow', 'pressUpTop'], d: { k: 'reps', v: 10 },
  cue: 'Lie face down, hands under your shoulders. Press the chest up and let the hips stay heavy on the floor, going only as high as stays comfortable. Lower all the way down and let everything go slack between reps. Breathe out at the top.',
  why: 'The core McKenzie movement. For most disc-related sciatica this is the direction that pulls leg pain back up toward the spine — the response you are watching for is called centralisation. If it does that for you, this becomes your most valuable single exercise.',
  lv: ['Prone lying on elbows, 2 minutes', 'Press-up to half height, 10 reps', 'Full press-up, arms straight, 10 reps', '15 reps with a 2-second hold at the top', '15 reps, hips pressed into the floor by a strap or belt'],
  care: 'Watch the LEG, not the back. Leg pain moving up toward your spine is good even if the back pain rises a little. Leg pain moving further down means stop and use the flexion-biased version instead.',
  vq: 'McKenzie prone press up extension exercise sciatica',
},
proneOnElbows: {
  n: 'Prone on elbows', tgt: 'lumbar extension', prop: [], p: 'sphinxLow', s: 0,
  d: { k: 'hold', v: 60 },
  cue: 'Face down, propped on your forearms, hips and legs heavy. Let your lower back sag rather than holding it stiff. If it is too much, put a pillow under your chest; if it is too little, walk the elbows further forward.',
  why: 'The gentlest sustained extension there is, and the position to start in if the press-up feels like too much on day one.',
  lv: ['On a pillow, 60 seconds', 'Flat on elbows, 60 seconds', '90 seconds, hips fully relaxed', '2 minutes', '2 minutes, then straight into press-ups'],
  vq: 'prone on elbows extension McKenzie position',
},
catCow: {
  n: 'Cat-cow', tgt: 'whole spine', prop: [], p: 'quadruped', s: 0,
  a: ['catUp', 'catDown'], d: { k: 'reps', v: 10 },
  cue: 'On hands and knees, hands under shoulders, knees under hips. Breathe out and round the back toward the ceiling, tucking the tail; breathe in and let the belly drop as the chest opens. Move one segment at a time — the goal is smoothness, not size.',
  why: 'The best general spine warm-up there is: it moves every segment through both directions with almost no load, and it teaches you to move your spine in parts instead of one stiff block.',
  lv: ['Half range, 10 reps', 'Full range, 10 reps', '12 reps, 4 seconds each direction', 'Add side-to-side hip circles at the end', 'Add a segment-by-segment wave, top down then bottom up'],
  vq: 'cat cow exercise proper form beginner tutorial',
},
sciaticSlider: {
  n: 'Sciatic nerve slider', tgt: 'sciatic nerve', prop: ['chair'], p: 'seatedSlide', s: 2,
  a: ['slideA', 'slideB'], d: { k: 'reps', v: 12 },
  cue: 'Sit on the front of a chair, slouched slightly. Straighten the left knee and point the toes down while you look UP at the ceiling. Then bend the knee, pull the toes up toward you and drop the chin to your chest. See-saw between the two, about two seconds each way. Never hold either end.',
  why: 'An irritated nerve does not want to be stretched, it wants to move. Sliding it from one end while releasing the other restores its glide without ever putting it on tension — which is exactly why it works when hamstring stretching makes things worse.',
  lv: ['6 reps, tiny range, never into symptoms', '10 reps, moderate range', '12 reps, full range, still no symptoms', '12 reps supine with the leg supported', '15 reps standing with the foot on a step'],
  care: 'This must stay pain-free and tingle-free. Shooting, burning or pins and needles means the range is too big — halve it. Symptoms that linger more than a minute afterwards means stop for the day.',
  vq: 'sciatic nerve slider flossing exercise seated tutorial',
},
deadBug: {
  n: 'Dead bug', tgt: 'deep core, anti-extension', prop: [], p: 'deadbug', s: 2,
  a: ['deadbugA', 'deadbugB'], d: { k: 'reps', v: 8 },
  cue: 'On your back, knees and arms up over you like a table. Press your lower back lightly into the floor and keep it there. Lower one arm overhead and the opposite leg toward the floor, only as far as your back stays flat, then return. If the back lifts, you went too far.',
  why: 'It trains your trunk to hold the spine still while the limbs move — the single most transferable skill for a back that hurts when you bend or lift.',
  lv: ['Arms only, legs stay up', 'One leg at a time, heel taps floor', 'Opposite arm and leg together', 'Leg straightens fully, 3 seconds out', 'Add a light dumbbell in each hand'],
  vq: 'dead bug exercise proper form lower back',
},
birdDog: {
  n: 'Bird dog', tgt: 'spinal stabilisers, glutes', prop: [], p: 'quadruped', s: 2,
  a: ['birddogA', 'birddogB'], d: { k: 'reps', v: 8 },
  cue: 'On hands and knees. Reach one arm forward and the opposite leg back until both are level with your trunk — no higher. Keep your hips square, as if balancing a glass of water on your lower back. Hold, return, swap.',
  why: 'One of McGill\'s Big 3. It builds stiffness and control through the whole back line without loading the spine, and it exposes the side-to-side asymmetry a nine-month one-sided problem always creates.',
  lv: ['Arm only, then leg only', 'Opposite arm and leg, 3-second hold', '8 reps each side, 5-second hold', 'Draw a square with the reaching hand', 'Add a band or light weight in the reaching hand'],
  vq: 'bird dog exercise McGill proper form',
},
curlUpMcGill: {
  n: 'McGill curl-up', tgt: 'abdominals, spine-sparing', prop: [], p: 'curlup', s: 2,
  d: { k: 'hold', v: 10 },
  cue: 'On your back, one knee bent with that foot flat, the other leg straight. Hands under your lower back. Lift head and shoulders barely off the floor — about a centimetre — keeping the neck in line with the chest, and hold. Your lower back must not move at all.',
  why: 'A sit-up loads the disc heavily in flexion, which is exactly what you cannot afford. This gets the abdominal work with almost none of that cost. Swap which leg is bent halfway through.',
  lv: ['Head only, 10 seconds × 3', 'Head and shoulders, 10 seconds × 4', '10 seconds × 6, descending sets', 'Elbows off the floor', '12 seconds × 6 with a slow exhale'],
  care: 'No chin-tucking, no hands behind the head pulling. If the neck does the work, you are lifting too high.',
  vq: 'McGill curl up exercise tutorial proper form',
},
sidePlank: {
  n: 'Side plank from knees', tgt: 'lateral core, quadratus lumborum', prop: [], p: 'sidePlank', s: 2,
  d: { k: 'hold', v: 15 },
  cue: 'On your side, propped on the forearm, knees bent and stacked. Lift the hips so shoulder, hip and knee make one line, and hold. Push the forearm into the floor and keep the top shoulder from rolling forward.',
  why: 'The third of the Big 3, and the one that matters most for a one-sided problem: it loads the side of the trunk that has been quietly switching off for nine months.',
  lv: ['Hips barely lifted, 15 seconds', 'Full knee side plank, 20 seconds', 'Straight legs, 20 seconds', 'Straight legs, 30 seconds', 'Straight legs with the top leg lifted'],
  care: 'Do the painful side too, and note if it is weaker — that difference closing is a real progress marker.',
  vq: 'side plank from knees proper form beginner',
},
glueBridge: {
  n: 'Glute bridge', tgt: 'glutes, hip extension', prop: [], p: 'bridge', s: 0,
  a: ['supineKnees', 'bridgeTop'], d: { k: 'reps', v: 12 },
  cue: 'On your back, knees bent, feet flat and hip-width. Push through your heels and lift the hips until your body makes a straight ramp from knees to shoulders. Squeeze the glutes at the top, and do not arch your lower back to get higher.',
  why: 'Glutes that have stopped working leave the hamstrings and lower back doing their job, which is half of why one buttock hurts. This is the most direct fix, and the foundation for the hip thrusts later in the programme.',
  lv: ['Half-height bridge, 12 reps', 'Full bridge, 12 reps, 2-second squeeze', '15 reps, feet closer together', 'Single-leg bridge, 8 per side', 'Shoulders on the bench, dumbbell across the hips'],
  vq: 'glute bridge proper form beginner tutorial',
},
figure4: {
  n: 'Supine figure-4', tgt: 'piriformis, deep glute', prop: [], p: 'figure4', s: 2,
  d: { k: 'hold', v: 30 },
  cue: 'On your back, cross the left ankle over the right thigh just above the knee, making a figure 4. Hold behind the right thigh and draw it toward your chest until you feel a stretch deep in the left buttock. Keep your head and shoulders down and breathe.',
  why: 'This targets the piriformis directly, and with a piriformis component in your picture it is one of your highest-value stretches. It is also the safe alternative to pigeon pose, which loads the same tissue in a much harder position.',
  lv: ['Foot stays on the floor, knee pushed out', 'Figure-4 with the leg on the floor', 'Full figure-4, thigh drawn in', 'Add a gentle 5-second push of the crossed knee against your hand, then relax deeper', 'Seated figure-4 in a chair with a forward lean from the hips'],
  care: 'Deep ache in the buttock is right. Sharp pain, or pain shooting down the leg, means ease the pull off.',
  vq: 'supine figure 4 piriformis stretch proper form',
},
twistSupine: {
  n: 'Supine spinal twist', tgt: 'lumbar rotation, glute', prop: [], p: 'twist', s: 2,
  d: { k: 'hold', v: 45 },
  cue: 'On your back, arms out wide. Bring the left knee up and let it fall across your body to the right, guided by your right hand, while you turn your head left. Keep both shoulders on the floor — that is what makes it a twist rather than a roll.',
  why: 'Rotation is the range a stiff back loses first and misses most. Held long and passively, this is also one of the most reliable ways to quieten a low back at the end of a session.',
  lv: ['Knee on a block or cushion', 'Knee to the floor, 45 seconds', 'Both knees stacked, 60 seconds', 'Top leg straightened toward the opposite hand', 'Add the free arm reaching overhead'],
  vq: 'supine spinal twist stretch proper form',
},
childsPose: {
  n: "Child's pose", tgt: 'lumbar, lats, hips', prop: ['mat'], p: 'childs', s: 0,
  d: { k: 'breath', v: 8 },
  cue: 'From hands and knees, sit the hips back toward the heels and let the arms stretch forward, forehead down. Take the knees wide if the belly is in the way. Breathe into the back of the rib cage.',
  why: 'A gentle flexion counterpoint and a reset between harder exercises — and if your directional preference turns out to be flexion rather than extension, this becomes a cornerstone instead of a cool-down.',
  lv: ['Knees wide, cushion under the hips', 'Standard, 8 breaths', 'Arms walked to one side for a lat stretch', 'Forearms on a block, deeper hip fold', '2 minutes, fully passive'],
  vq: 'childs pose yoga proper alignment beginner',
},
pallof: {
  n: 'Anti-rotation press', tgt: 'obliques, anti-rotation', prop: ['dumbbell'], p: 'halfKneel', s: 2,
  a: ['pallofA', 'pallofB'], d: { k: 'reps', v: 10 },
  cue: 'Half-kneeling, hold a dumbbell at your chest in both hands. Press it straight out in front of you and bring it back, keeping your trunk absolutely square — the weight out front tries to twist you and your job is to refuse.',
  why: 'Your spine needs to resist rotation as much as it needs to produce it. This buys that for free, in a position that does not load the disc.',
  lv: ['Both knees down, 3 kg', 'Half-kneeling, 5 kg', 'Half-kneeling, 8 kg, 3-second hold out front', 'Standing, split stance', 'Standing, 10 kg, slow tempo'],
  vq: 'pallof press anti rotation dumbbell half kneeling',
},
suitcase: {
  n: 'Suitcase carry', tgt: 'lateral core, grip, posture', prop: ['dumbbell'], p: 'carry', s: 2,
  d: { k: 'time', v: 30 },
  cue: 'Hold one dumbbell at your side like a heavy suitcase. Walk slowly, standing dead upright — do not let the weight tip you sideways and do not lean away to counterbalance. Shoulders level, ribs stacked over hips.',
  why: 'The most back-friendly loading there is: the spine stays neutral while everything around it works hard. It also teaches the trunk to hold position under real load, which is what protects you outside the gym.',
  lv: ['8 kg, 30 seconds per side', '12 kg, 30 seconds', '16 kg, 40 seconds', '20 kg, 40 seconds', '25 kg, 45 seconds'],
  vq: 'suitcase carry exercise form core',
},
};

/* ================= HIPS, HAMSTRINGS, ADDUCTORS ========================= */

Object.assign(EX, {

strapHam: {
  n: 'Supine hamstring stretch with strap', tgt: 'hamstrings', prop: ['strap'], p: 'strapHam', s: 2,
  d: { k: 'hold', v: 30 },
  cue: 'On your back, loop the strap around one foot. Keep the other leg bent with the foot flat. Raise the strapped leg with the knee soft, then slowly straighten it until you feel a firm pull in the back of the thigh. Keep your lower back flat on the floor throughout.',
  why: 'This is the exercise that closes your toe-touch gap. On your back the floor holds your spine neutral, so all the range comes from the hip — unlike a standing or seated forward fold, where a stiff hamstring simply makes you round your back instead.',
  lv: ['Knee bent 45°, 30 seconds', 'Knee nearly straight, 30 seconds', 'Straight leg, 45 seconds', 'Straight leg, then pull the toes toward you', 'Contract-relax: push the leg into the strap for 6 seconds, relax, take up the new slack — 3 rounds'],
  care: 'A broad pull in the muscle belly is a stretch. A thin, electric line down the back of the leg is the nerve — back off 20% and switch to sliders for the day.',
  vq: 'supine hamstring stretch with strap proper form',
},
hipFlexorLunge: {
  n: 'Half-kneeling hip flexor stretch', tgt: 'hip flexors, quads', prop: ['mat'], p: 'halfKneelStretch', s: 2,
  d: { k: 'hold', v: 30 },
  cue: 'Half-kneeling, back knee down on the mat, front foot forward. Tuck your tailbone under and squeeze the glute on the kneeling side — you should feel the front of that hip open immediately. Then, without arching your back, shift a little forward. The tuck is the stretch, not the lean.',
  why: 'Five years of sitting shortens the hip flexors, which tilts the pelvis forward and compresses the lower back all day. Almost nobody does this one right, and the tuck is the whole trick.',
  lv: ['Tuck only, no forward shift', 'Tuck plus small shift, 30 seconds', 'Add the same-side arm overhead', 'Add a side bend away from the kneeling leg', 'Back foot elevated on the bench (couch stretch), 45 seconds'],
  vq: 'half kneeling hip flexor stretch posterior pelvic tilt',
},
ninetyNinety: {
  n: '90/90 hip switches', tgt: 'hip internal and external rotation', prop: [], p: 'ninetyNinety', s: 2,
  a: ['n90A', 'n90B'], d: { k: 'reps', v: 8 },
  cue: 'Sit with both knees bent at right angles, one leg in front and one out to the side, both on the floor. Sit as tall as you can. Lift both knees and rotate through the middle to swap which leg is in front, controlling the whole way. Use your hands behind you if you need them.',
  why: 'Hip rotation is the range that seizes up first and the one almost no stretching routine addresses. Restoring it takes load off the lower back in everything you do.',
  lv: ['Hands behind, small range, 6 reps', 'Hands light, full swap, 8 reps', 'Hands free, 8 reps', 'Pause and lean forward over the front shin for 10 seconds each swap', 'Add a lift-and-hold of both knees for 5 seconds mid-swap'],
  vq: '90 90 hip switch mobility drill tutorial',
},
ninetyNinetyLean: {
  n: '90/90 forward lean', tgt: 'deep glute, external rotators', prop: [], p: 'n90Lean', s: 2,
  d: { k: 'hold', v: 40 },
  cue: 'In the 90/90 position, keep the front shin where it is and hinge forward over it from the hips with a long back. Go only as far as your back stays straight — a rounded back means you have stopped stretching the hip.',
  why: 'The most effective deep-glute stretch available to you, and directly relevant with a piriformis component in the picture.',
  lv: ['Sit tall, no lean', 'Small lean, hands on the floor', 'Forearms down, 40 seconds', 'Chest to shin, 45 seconds', 'Contract-relax: press the shin into the floor 6 seconds, then fold deeper'],
  vq: '90 90 hip stretch forward fold external rotation',
},
adductorRock: {
  n: 'Adductor rock-back', tgt: 'inner thigh, groin', prop: ['mat'], p: 'adductorRock', s: 2,
  a: ['adRockA', 'adRockB'], d: { k: 'reps', v: 10 },
  cue: 'On hands and knees, take one leg straight out to the side with the foot flat and toes forward. Keep a long back and rock your hips backward until you feel the inner thigh, then rock forward again. Slow.',
  why: 'The inner thighs are half of why a squat will not go deep, and they never get stretched by walking or sitting. Rocking rather than holding lets a tight groin let go.',
  lv: ['Small rocks, 10 reps', 'Full rocks, 10 reps', '12 reps then hold 30 seconds at the back', 'Straight-leg version with the foot turned up', 'Add a 6-second squeeze of the straight leg into the floor between rocks'],
  vq: 'adductor rock back stretch quadruped tutorial',
},
frogStretch: {
  n: 'Frog stretch', tgt: 'adductors, hip', prop: ['mat'], p: 'frog', s: 0,
  d: { k: 'hold', v: 45 },
  cue: 'On hands and knees, walk the knees wide with the shins in line with the thighs and the inner edges of the feet down. Lower onto your forearms and rock the hips back gently. Keep the lower back long, not arched.',
  why: 'The strongest adductor stretch there is. It opens the squat and the 90/90 at the same time, and it is a good honest measure of how much your hips have changed.',
  lv: ['Knees narrow, forearms down, 30 seconds', 'Knees wider, 45 seconds', 'Full width, 60 seconds', 'Gentle rocking forward and back throughout', 'Add adductor squeezes: press the knees inward for 6 seconds, relax, widen'],
  care: 'Groin stretch, yes. Pinching in the front of the hip or inside the knee, no — narrow the knees.',
  vq: 'frog stretch adductors proper form beginner',
},
lowLunge: {
  n: 'Low lunge', tgt: 'hip flexors, groin', prop: ['blocks'], p: 'lowLunge', s: 2,
  d: { k: 'breath', v: 6 },
  cue: 'From hands and knees, step one foot forward between your hands, back knee down. Hands on blocks either side of the front foot. Sink the hips forward and down, chest lifted, and breathe into the front of the back hip.',
  why: 'The yoga staple, and the position from which half the standing poses later in the programme are built.',
  lv: ['Hands on blocks, shallow', 'Hands on blocks, hips sunk', 'Hands on the floor', 'Back foot tucked under, knee lifted', 'Hands to the inside of the front foot, forearms down'],
  vq: 'low lunge anjaneyasana beginner alignment',
},
halfSplit: {
  n: 'Half splits', tgt: 'hamstrings', prop: ['blocks'], p: 'halfSplit', s: 2,
  d: { k: 'hold', v: 40 },
  cue: 'From a low lunge, shift the hips back over the kneeling knee and straighten the front leg with the toes pulled up. Hands on blocks. Keep your back flat and hinge from the hips — a rounded back means you are stretching your spine, not your hamstring.',
  why: 'A hamstring stretch you can load and control, and the one that transfers most directly to standing and picking things up off the floor.',
  lv: ['Hands on blocks, knee soft, 30 seconds', 'Straight leg, hands on blocks, 40 seconds', 'Hands to the floor, 45 seconds', 'Chest lowered toward the shin with a flat back', 'Contract-relax: press the heel down for 6 seconds, relax, fold deeper'],
  care: 'Flat back is non-negotiable here. If you cannot keep it flat, raise the blocks.',
  vq: 'half splits ardha hanumanasana hamstring alignment',
},
cossack: {
  n: 'Cossack squat', tgt: 'adductors, hip, ankle', prop: ['chair'], p: 'cossack', s: 2,
  a: ['cossackA', 'cossackB'], d: { k: 'reps', v: 6 },
  cue: 'Feet very wide, toes forward. Shift your weight onto one leg and sit down over it, letting the other leg straighten with the toes turning up. Keep your chest up and your heel down. Push back to the middle and switch.',
  why: 'The best single loaded movement for the inner thigh and lateral hip, and one of the few that trains deep hip range while you are actually holding your own weight.',
  lv: ['Holding the chair, quarter depth', 'Holding the chair, half depth', 'Hands free, half depth', 'Hands free, full depth, heel down', 'Holding a 10 kg dumbbell as a counterweight'],
  care: 'Knee pain means you have gone deeper than your ankle allows — raise the heel on a block, or reduce depth.',
  vq: 'cossack squat proper form beginner progression',
},
hamstringEcc: {
  n: 'Bench hamstring eccentric', tgt: 'hamstrings, eccentric strength', prop: ['bench'], p: 'benchHamEcc', s: 2,
  d: { k: 'reps', v: 6 },
  cue: 'Sit on the bench edge, one heel on the floor with the leg nearly straight. Press the heel down and drag it slowly toward you along the floor, resisting the whole way — five seconds per rep. Return without resistance.',
  why: 'Lengthening a hamstring under load changes its stiffness far more durably than holding a stretch does. This is the single biggest lever on your toe-touch in the second half of the programme.',
  lv: ['3 reps, light pressure, 3 seconds', '5 reps, 4 seconds', '6 reps, 5 seconds, firm pressure', '6 reps with a sock on a smooth floor for a longer slide', 'Standing single-leg RDL with a 10 kg dumbbell, 5-second lower'],
  care: 'Expect muscle soreness a day or two later, especially the first week. Nerve symptoms, no — that means back off.',
  vq: 'eccentric hamstring slider exercise tutorial',
},
pigeonAlt: {
  n: 'Supported pigeon', tgt: 'deep glute, piriformis', prop: ['blocks', 'mat'], p: 'pigeon', s: 2,
  d: { k: 'breath', v: 8 },
  cue: 'From hands and knees, bring one shin forward and across, angled — not parallel to the front of the mat. Put a block or cushion under the hip of that side so your pelvis stays level. Walk the hands forward only as far as the buttock stretch stays tolerable.',
  why: 'A strong glute and piriformis stretch, and the reason it is supported and angled here is that the classic square version torques a sensitive lower back and knee.',
  lv: ['Supine figure-4 instead', 'Pigeon with a high block under the hip, upright', 'Block under the hip, forearms down', 'Low block, chest lowered', 'No block, full fold'],
  care: 'Any pain in the front of the knee means come out and use the figure-4 instead.',
  vq: 'supported pigeon pose with block hip alignment',
},
happyBaby: {
  n: 'Happy baby', tgt: 'inner thigh, low back', prop: [], p: 'happyBaby', s: 0,
  d: { k: 'breath', v: 6 },
  cue: 'On your back, draw both knees toward your armpits and hold the outsides of your feet. Let the knees fall wide and the tailbone stay heavy. Rock gently side to side if it feels good.',
  why: 'Opens the hips and inner thighs while the spine stays supported by the floor — one of very few hip openers that asks nothing of your back.',
  lv: ['Hold behind the thighs', 'Hold the shins', 'Hold the feet, knees wide', 'Straighten the legs slightly upward', 'Add slow side-to-side rocking for 60 seconds'],
  vq: 'happy baby pose ananda balasana beginner',
},
gluteMedSide: {
  n: 'Side-lying hip abduction', tgt: 'gluteus medius', prop: ['mat'], p: 'sideLying', s: 2,
  a: ['sideLegA', 'sideLegB'], d: { k: 'reps', v: 12 },
  cue: 'On your side, bottom leg bent, top leg straight and in line with your body — not in front. Turn the top toes slightly down toward the floor, then lift the leg about 30 cm and lower slowly. Small range, no rolling back.',
  why: 'Gluteus medius is the muscle that keeps your pelvis level when you walk. When it is weak on one side — which after nine months of favouring a leg, it will be — everything above it compensates.',
  lv: ['10 reps, small range', '12 reps, toes turned down', '15 reps, 2-second hold at the top', 'Add a 2 kg dumbbell on the thigh', 'Side plank with hip abduction'],
  vq: 'side lying hip abduction glute medius proper form',
},
hipThrust: {
  n: 'Bench hip thrust', tgt: 'glutes', prop: ['bench', 'dumbbell'], p: 'hipThrust', s: 0,
  a: ['thrustA', 'thrustB'], d: { k: 'reps', v: 10 },
  cue: 'Upper back on the bench, feet flat on the floor, dumbbell held across the hips. Drive through the heels and lift the hips until your body is a flat table from knees to shoulders. Tuck the ribs down and finish with the glutes, not the lower back. Chin stays tucked.',
  why: 'The strongest glute exercise you can do without loading the spine. Strong glutes are the long-term answer to a lower back that keeps taking their work.',
  lv: ['Bodyweight, no dumbbell', '8 kg dumbbell, 10 reps', '12 kg, 10 reps, 2-second squeeze', '20 kg, 10 reps', '25 kg, 12 reps, 3-second squeeze'],
  care: 'If you feel this in your lower back rather than your glutes, you are arching at the top. Lower the range and tuck the ribs harder.',
  vq: 'dumbbell hip thrust bench proper form beginner',
},
});

/* ========================= PILATES — CORE & CONTROL ==================== */

Object.assign(EX, {

pilBreath: {
  n: 'Pilates lateral breathing', tgt: 'deep core, ribs', prop: ['mat'], p: 'supineKnees', s: 0,
  d: { k: 'breath', v: 8 },
  cue: 'On your back, knees bent. Breathe in wide through the ribs; breathe out through slightly pursed lips and feel the low belly draw gently in and up — about 30% effort, not a hard suck. The ribs should soften down toward the hips on the exhale.',
  why: 'This connection is what every Pilates exercise is built on. Without it the rest is just leg lifting.',
  lv: ['8 breaths, hands on ribs', '10 breaths, one hand on the low belly', '10 breaths holding the draw-in for 5 seconds', 'Same in four-point kneeling', 'Same in standing before a lift'],
  vq: 'pilates lateral breathing ribcage technique beginner',
},
pilImprint: {
  n: 'Imprint and release', tgt: 'pelvic control', prop: ['mat'], p: 'supineKnees', s: 0,
  a: ['tiltPost', 'supineKnees'], d: { k: 'reps', v: 8 },
  cue: 'Knees bent, feet flat. Breathe out and gently print the lower back toward the mat using the abdominals, not the glutes. Breathe in and release back to neutral. You are looking for control of the two positions, not the size of the movement.',
  why: 'Pilates asks you to choose between neutral and imprint depending on the exercise. Learning the difference protects your back in everything that follows.',
  lv: ['8 reps, small', '10 reps, hold imprint 3 seconds', '10 reps, hold 5 seconds', 'Add one leg lifting to tabletop in imprint', 'Add both legs to tabletop'],
  vq: 'pilates imprint and release neutral spine tutorial',
},
pilToeTap: {
  n: 'Toe taps', tgt: 'deep abdominals', prop: ['mat'], p: 'deadbug', s: 2,
  a: ['toeTapA', 'toeTapB'], d: { k: 'reps', v: 10 },
  cue: 'On your back, both knees bent up over your hips (tabletop). Keeping the shin angle unchanged, lower one foot to tap the mat and return, then the other. Your lower back must not move — if it lifts, tap higher.',
  why: 'The first honest test of whether the deep abdominals can hold the pelvis still against a moving leg. Almost everyone fails it at first and improves fast.',
  lv: ['Tap to a block, 8 per side', 'Tap the mat, 10 per side', '12 per side, slower', 'Both legs together', 'Legs extended longer, dead-bug style'],
  vq: 'pilates toe taps tabletop beginner form',
},
pilShoulderBridge: {
  n: 'Shoulder bridge roll', tgt: 'spinal articulation, glutes', prop: ['mat'], p: 'bridge', s: 0,
  a: ['supineKnees', 'bridgeTop'], d: { k: 'reps', v: 8 },
  cue: 'Feet flat, hip-width. Breathe out and peel the spine off the mat one segment at a time from the tailbone up, rising to a bridge. Breathe in at the top, then melt back down the same way, one vertebra at a time.',
  why: 'This is spinal articulation — moving your back in segments instead of as a rigid block. That quality is what a nine-month-guarded spine loses, and getting it back makes everyday bending feel different.',
  lv: ['Half range, smooth', 'Full bridge, 8 reps', '10 reps, slower down-phase', 'Arms overhead at the top', 'Single-leg version, 6 per side'],
  care: 'Skip the very top of the range if it pinches the lower back.',
  vq: 'pilates shoulder bridge spinal articulation tutorial',
},
pilClam: {
  n: 'Clam', tgt: 'gluteus medius, external rotators', prop: ['mat'], p: 'sideLying', s: 2,
  a: ['clamA', 'clamB'], d: { k: 'reps', v: 12 },
  cue: 'On your side, knees bent and stacked, heels in line with your spine. Keep the feet together and the pelvis still while you open the top knee. The moment your hips roll back, you have gone too far.',
  why: 'Small, unglamorous, and one of the most directly useful things you can do for a deep glute that has been either weak or angry for nine months.',
  lv: ['10 reps, small range', '12 reps, full range', '15 reps, 2-second hold', 'Add a band above the knees', 'Feet lifted off the mat throughout'],
  vq: 'pilates clam exercise glute medius form',
},
pilSwimming: {
  n: 'Swimming prep', tgt: 'back extensors, glutes', prop: ['mat'], p: 'proneSwim', s: 2,
  a: ['swimA', 'swimB'], d: { k: 'reps', v: 10 },
  cue: 'Face down, arms overhead, forehead resting. Lengthen one arm and the opposite leg away from each other and lift them a few centimetres — long, not high. Lower and swap. Keep the hips level and the neck long.',
  why: 'The back of your body needs to be able to work, not just stretch. This trains the extensors in the direction most disc-related backs prefer.',
  lv: ['Arms only, then legs only', 'Opposite arm and leg, 10 reps', '12 reps, 3-second hold', 'All four limbs lifted, 5-second holds', 'Full swimming with a breath count'],
  care: 'If lying face down or lifting the legs bothers the leg pain, do bird dog instead today.',
  vq: 'pilates swimming prep prone exercise form',
},
pilSideKick: {
  n: 'Side kick series', tgt: 'hip control, obliques', prop: ['mat'], p: 'sideLying', s: 2,
  a: ['sideKickA', 'sideKickB'], d: { k: 'reps', v: 10 },
  cue: 'On your side, body in one long line, head supported. Top leg at hip height. Swing it forward as far as your pelvis stays still, then back behind you without arching your lower back. Controlled — the pelvis is the exercise, the leg is just the load.',
  why: 'Trains the hip to move freely while the spine stays quiet: the exact separation that walking without pain requires.',
  lv: ['Small range, bent bottom leg', 'Full range, 10 reps', '12 reps with a 2-second pause behind', 'Add up-down and circles', 'Both legs lifted (side-lying lift)'],
  vq: 'pilates side kick series beginner form',
},
pilMermaid: {
  n: 'Mermaid side bend', tgt: 'lateral trunk, ribs', prop: ['mat'], p: 'mermaid', s: 2,
  d: { k: 'reps', v: 6 },
  cue: 'Sit with both knees folded to one side. Reach the far arm up and over, bending sideways over the folded legs while staying long — no collapsing, no twisting. Breathe out on the reach, in on the return.',
  why: 'The side of the trunk is the direction nobody trains and every stiff back needs. It also frees the ribs, which is why your breathing improves after a few weeks of it.',
  lv: ['Small bend, hand on the mat', 'Full reach, 6 per side', '8 per side, 3-second hold', 'Add a forearm slide out for depth', 'Standing side bend with a 5 kg dumbbell'],
  vq: 'pilates mermaid stretch side bend tutorial',
},
pilRollDownWall: {
  n: 'Wall roll-down', tgt: 'spinal articulation', prop: ['wall'], p: 'wallRoll', s: 0,
  a: ['wallRollA', 'wallRollB'], d: { k: 'reps', v: 5 },
  cue: 'Stand with your back against the wall, feet a step forward. Tuck the chin and peel down one segment at a time, only as far as comfortable, keeping the hips on the wall. Roll back up the same way, stacking one vertebra at a time.',
  why: 'Controlled, supported, unloaded flexion. It is on the list because the goal is a spine that can bend safely again, not one that avoids bending forever — and the wall keeps the load off while you relearn it.',
  lv: ['Chin and shoulders only', 'To mid-back', 'To the bottom of the ribs', 'Full roll-down within comfort', 'Free-standing roll-down, hands reaching toward the floor'],
  care: 'This is the one flexion exercise in the programme, and it earns its place only if your leg stays quiet. If flexion is what aggravates you, replace it with prone press-ups.',
  vq: 'pilates wall roll down spinal articulation beginner',
},
pilSingleLegStretch: {
  n: 'Single leg stretch', tgt: 'abdominals, coordination', prop: ['mat'], p: 'deadbug', s: 2,
  a: ['slsA', 'slsB'], d: { k: 'reps', v: 10 },
  cue: 'On your back, head down, legs in tabletop. Extend one leg long and low while you draw the other knee in with your hands, then switch — smooth, continuous, breathing out on each change.',
  why: 'Classic Pilates coordination work: the trunk holds while the legs alternate. Head stays down here rather than curled up, which keeps it spine-friendly for you.',
  lv: ['Head down, feet high', 'Head down, leg lower', 'Head down, leg long and low, 12 reps', 'Add the hand-to-ankle change', 'Head and shoulders lifted (only if your leg stays quiet)'],
  vq: 'pilates single leg stretch beginner modification',
},
pilLegPullFront: {
  n: 'Plank with leg lift', tgt: 'whole trunk, shoulders', prop: ['mat'], p: 'plank', s: 2,
  d: { k: 'hold', v: 20 },
  cue: 'Forearm or hand plank, body in one line, ribs tucked. Lift one foot a few centimetres without letting the hips twist or drop. Hold, swap.',
  why: 'The plank is only worth doing when the spine stays neutral under it, and the leg lift is what proves it does.',
  lv: ['Knees-down forearm plank, 20 seconds', 'Full forearm plank, 20 seconds', 'Full plank, alternating leg lifts', 'Hand plank with leg lifts, 30 seconds', 'Add a shoulder tap between lifts'],
  care: 'A lower back that sags or aches means come down to the knees — there is no benefit in holding a bad plank longer.',
  vq: 'plank leg lift proper form neutral spine',
},

/* ============ SHOULDERS, CHEST, LATS, ARMS, WRISTS ===================== */

wallSlide: {
  n: 'Wall slide', tgt: 'shoulder flexion, scapula', prop: ['wall'], p: 'wallSlide', s: 0,
  a: ['wallSlideA', 'wallSlideB'], d: { k: 'reps', v: 10 },
  cue: 'Stand facing away from the wall — back, head and hips touching, feet a little forward. Forearms on the wall, elbows bent. Slide the arms up overhead keeping the forearms in contact and the lower back flat against the wall. Stop where either would break.',
  why: 'The cleanest way to rebuild overhead range, because the wall tells you the instant you start cheating with your lower back — which is exactly how most people fake shoulder mobility.',
  lv: ['Elbows only, small slide', 'Half slide, 10 reps', 'Full slide, forearms in contact', 'Full slide with a 2-second hold overhead', 'Add a light band around the wrists'],
  vq: 'wall slide shoulder mobility exercise tutorial',
},
doorwayPec: {
  n: 'Doorway chest stretch', tgt: 'pectorals, front shoulder', prop: ['wall'], p: 'doorway', s: 2,
  d: { k: 'hold', v: 35 },
  cue: 'Forearm flat on a door frame, elbow at shoulder height. Step through gently with the same-side foot and turn your chest away until you feel the front of the chest and shoulder open. Ribs down, no arching.',
  why: 'The front of the chest tightens from years of sitting and pulls the shoulders forward, which locks the upper back. Opening it is the prerequisite for getting your arms overhead honestly.',
  lv: ['Elbow low (below shoulder), 30 seconds', 'Elbow at shoulder height, 35 seconds', 'Elbow high, 40 seconds', 'All three heights, 20 seconds each', 'Contract-relax: press the forearm into the frame 6 seconds, then rotate further'],
  vq: 'doorway pec stretch three heights tutorial',
},
strapDislocate: {
  n: 'Strap pass-throughs', tgt: 'shoulder rotation, chest', prop: ['strap'], p: 'strapPass', s: 0,
  a: ['passA', 'passB'], d: { k: 'reps', v: 10 },
  cue: 'Hold a strap or broom wide in both hands, arms straight. Keeping the elbows locked, lift it up over your head and as far behind you as it goes, then return. Go wider if it catches. Never force it past a pinch.',
  why: 'The single best measure and driver of shoulder rotation. Your hands will be able to come closer together over the months, and that is a real, visible progress marker.',
  lv: ['Very wide grip, half range', 'Wide grip, full pass', 'Medium grip, full pass', 'Narrower grip, 10 slow reps', 'Narrow grip with a 2-second hold behind'],
  care: 'Any pinch in the front of the shoulder means widen the grip immediately.',
  vq: 'shoulder pass through dislocates with strap tutorial',
},
latStretchBlock: {
  n: 'Lat stretch over blocks', tgt: 'lats, thoracic spine', prop: ['blocks', 'bench'], p: 'latStretch', s: 2,
  d: { k: 'hold', v: 40 },
  cue: 'Kneel in front of the bench, elbows on it about shoulder-width, thumbs up. Sit the hips back and let the chest drop between the arms. Keep the ribs from flaring — the stretch should be under the armpits and along the sides of the back.',
  why: 'Tight lats physically prevent your arms from going overhead and drag the lower back into an arch when you try. Half of "bad shoulder mobility" is actually this.',
  lv: ['Hands on the bench, small sit-back', 'Elbows on the bench, 40 seconds', 'Add a slight side-lean to one side', 'One arm at a time, rotate the palm up', 'Add 6-second presses down into the bench between rounds'],
  vq: 'lat stretch on bench kneeling thoracic extension',
},
wristSeries: {
  n: 'Wrist and forearm series', tgt: 'wrists, forearms, fingers', prop: ['mat'], p: 'wristSeq', s: 0,
  d: { k: 'time', v: 90 },
  cue: 'On hands and knees. Palms down, fingers forward — rock gently forward and back. Then palms down, fingers pointing back toward the knees. Then the backs of the hands down. Then palms down with fingers turned out. About 20 seconds in each, never to pain.',
  why: 'You asked for everything, and wrists are the joint everyone forgets until they need to hold a plank or carry a heavy dumbbell. Two weeks of this changes them noticeably.',
  lv: ['Two positions only, very light pressure', 'Three positions, light rocking', 'Four positions, 20 seconds each', 'Add finger lifts in each position', 'Add loaded rocking with more bodyweight forward'],
  care: 'Numbness or tingling in the fingers means come off it — that is a different problem worth mentioning to a physio.',
  vq: 'wrist mobility routine quadruped four positions',
},
scapPushup: {
  n: 'Scapular push-up', tgt: 'serratus, scapular control', prop: ['mat'], p: 'plank', s: 0,
  a: ['scapA', 'scapB'], d: { k: 'reps', v: 12 },
  cue: 'In a plank on your hands (or knees), elbows locked straight. Let the chest sink slightly so the shoulder blades pinch together, then push the floor away to spread them apart. Only the shoulder blades move — no elbow bend, no hip movement.',
  why: 'Shoulder blades that glide properly are what keep the shoulder joint healthy when you start pressing weight in month three.',
  lv: ['Standing against a wall, 12 reps', 'Knees down, 12 reps', 'Full plank, 12 reps', 'Full plank, 15 reps, 2-second push', 'Feet elevated on the bench'],
  vq: 'scapular push up serratus activation tutorial',
},
proneYTW: {
  n: 'Prone Y-T-W', tgt: 'upper back, rear shoulder', prop: ['bench'], p: 'proneYTW', s: 0,
  a: ['ytwA', 'ytwB'], d: { k: 'reps', v: 8 },
  cue: 'Lie chest-down on the bench set to a slight incline, arms hanging. Lift the arms into a Y overhead, lower; then straight out to a T, lower; then elbows bent into a W, lower. Thumbs up, neck long, lift with the upper back not the neck.',
  why: 'The muscles between your shoulder blades hold your posture all day and they have not been asked to do anything in five years. This wakes them without loading the spine at all.',
  lv: ['No weight, 6 of each', 'No weight, 8 of each with 2-second holds', '1 kg in each hand', '2 kg in each hand', '3 kg, 10 of each, slow'],
  vq: 'prone Y T W raises incline bench tutorial',
},
threadNeedle: {
  n: 'Thread the needle', tgt: 'thoracic rotation, rear shoulder', prop: ['mat'], p: 'threadNeedle', s: 2,
  d: { k: 'breath', v: 6 },
  cue: 'On hands and knees. Slide one arm underneath the other, palm up, and let that shoulder and the side of your head rest on the mat. Keep the hips square over the knees so the rotation comes from the upper back, not the pelvis.',
  why: 'Thoracic rotation in its most accessible form. Getting it back takes the demand for rotation off the lower back, which is where a stiff mid-back always sends it.',
  lv: ['Small reach, no head down', 'Shoulder to the mat, 6 breaths', 'Add the top arm reaching overhead', 'Add the top arm reaching behind the back', 'From a forearm plank position'],
  vq: 'thread the needle stretch thoracic rotation form',
},
puppyPose: {
  n: 'Puppy pose', tgt: 'thoracic extension, lats, shoulders', prop: ['mat', 'blocks'], p: 'puppy', s: 0,
  d: { k: 'breath', v: 8 },
  cue: 'From hands and knees, walk the hands forward and lower the chest toward the floor while keeping the hips over the knees. Forehead or chin down, arms long and active. Keep the lower back from sagging by tucking the tail slightly.',
  why: 'The best upper-back extension stretch that does not ask the lower back to do the arching — which matters a lot for you.',
  lv: ['Forearms on blocks', 'Hands on blocks, chest lowered', 'Chest and chin to the mat', 'Elbows bent, palms together overhead', '2 minutes fully passive'],
  vq: 'puppy pose uttana shishosana alignment',
},
benchRow: {
  n: 'Bench-supported single-arm row', tgt: 'upper back, lats', prop: ['bench', 'dumbbell'], p: 'benchRow', s: 2,
  d: { k: 'reps', v: 10 },
  cue: 'One hand and the same-side knee on the bench, other foot on the floor, back flat and level. Let the dumbbell hang, then pull it to your lower ribs leading with the elbow, and lower it slowly. The back does not move — only the arm.',
  why: 'A pulling exercise where the bench holds your spine neutral for you. That makes it one of the few genuinely back-safe ways to build the upper back, which you need before pressing anything overhead.',
  lv: ['8 kg, 10 reps', '12 kg, 10 reps', '16 kg, 10 reps', '20 kg, 10 reps, 2-second hold', '25 kg, 8 reps, 3-second lower'],
  care: 'If your lower back rounds or twists to move the weight, the weight is too heavy.',
  vq: 'single arm dumbbell row bench supported form',
},
inclinePress: {
  n: 'Incline dumbbell press', tgt: 'chest, shoulders, triceps', prop: ['bench', 'dumbbell'], p: 'incline', s: 0,
  d: { k: 'reps', v: 10 },
  cue: 'Bench at about 30-40°. Dumbbells at the outside of your shoulders, wrists stacked over elbows. Press up and slightly together, then lower under control until you feel a stretch across the chest. Feet planted, lower back in light contact with the bench, ribs down.',
  why: 'Your first real upper-body pressing strength, on an incline because it is kinder to the shoulder than flat and keeps your spine fully supported.',
  lv: ['5 kg each, 12 reps', '8 kg each, 10 reps', '12 kg each, 10 reps', '16 kg each, 10 reps', '20 kg each, 8 reps'],
  vq: 'incline dumbbell press proper form beginner',
},
pullover: {
  n: 'Bench pullover', tgt: 'lats, thoracic extension', prop: ['bench', 'dumbbell'], p: 'pullover', s: 0,
  d: { k: 'reps', v: 12 },
  cue: 'Lie along the flat bench, one dumbbell held in both hands over your chest. Keeping the elbows slightly bent, lower it back over your head until you feel the lats and chest stretch, then bring it back over your chest. Ribs stay down — do not let the lower back arch off the bench.',
  why: 'Strength and stretch in the same movement. It is one of the few exercises that loads the lat at long length, which is exactly what an overhead-restricted shoulder needs.',
  lv: ['5 kg, half range', '8 kg, full range', '10 kg, 12 reps', '12 kg, 12 reps, 3-second lower', '16 kg, 10 reps'],
  care: 'Lower back lifting off the bench means the range is too big for your current lat length. Shorten it.',
  vq: 'dumbbell pullover form lats bench',
},
extRotation: {
  n: 'Side-lying external rotation', tgt: 'rotator cuff', prop: ['dumbbell', 'mat'], p: 'extRot', s: 2,
  a: ['extRotA', 'extRotB'], d: { k: 'reps', v: 12 },
  cue: 'On your side, top arm elbow pinned to your ribs and bent 90°, small dumbbell in hand. Rotate the forearm up toward the ceiling, keeping the elbow glued to your side. Lower slowly.',
  why: 'Small muscles, small weights, disproportionate payoff: the rotator cuff is what keeps a shoulder healthy once you start pressing and carrying real load.',
  lv: ['No weight, 12 reps', '2 kg, 12 reps', '3 kg, 12 reps', '4 kg, 12 reps, 2-second hold', '5 kg, 15 reps slow'],
  vq: 'side lying external rotation rotator cuff form',
},
});

/* ============================== YOGA ================================== */

Object.assign(EX, {

mountain: {
  n: 'Mountain pose with breath', tgt: 'posture, breath', prop: [], p: 'standing', s: 0,
  d: { k: 'breath', v: 6 },
  cue: 'Feet hip-width, weight even across both feet. Lengthen up through the crown, let the shoulders settle back and down, ribs stacked over hips. Arms reach overhead on the in-breath and lower on the out-breath.',
  why: 'Every standing pose starts here, and after nine months of shifting your weight off one leg, evenly loading both feet is itself the exercise.',
  lv: ['Feet hip-width, hands on hips', 'Arms overhead with the breath', 'Eyes closed, 6 breaths', 'Heels together', 'Add a slow rise onto the toes at the top of each breath'],
  vq: 'tadasana mountain pose alignment beginner',
},
catCowFlow: {
  n: 'Sun salutation, block-assisted', tgt: 'full body flow', prop: ['blocks', 'mat'], p: 'sunSalute', s: 0,
  a: ['saluteA', 'saluteB'], d: { k: 'reps', v: 4 },
  cue: 'Stand tall, arms overhead on the in-breath. Out-breath: hinge from the HIPS with a flat back, hands to the blocks. Step back to a plank, lower the knees, then push back to child\'s pose. In-breath: rise through low lunge on each side, then back to standing.',
  why: 'A sun salutation without the deep forward fold. The blocks keep your spine out of the flexion that would aggravate a disc, while you still get the whole sequence.',
  lv: ['3 rounds, hands high on blocks, knees down', '4 rounds, blocks', '4 rounds, hands to the floor with a flat back', '5 rounds, adding downward dog', '6 rounds, full flow with breath timing'],
  care: 'Never round the back to reach the floor. Raise the blocks instead — the blocks are permanent equipment here, not training wheels.',
  vq: 'sun salutation modified blocks beginner flat back',
},
downDog: {
  n: 'Downward dog, knees soft', tgt: 'hamstrings, calves, shoulders', prop: ['mat', 'blocks'], p: 'downdog', s: 0,
  d: { k: 'breath', v: 6 },
  cue: 'From hands and knees, tuck the toes and lift the hips up and back into an upside-down V. Keep the knees clearly BENT and press the hips high with a long, flat back. Straightening the legs at the cost of a rounded back is the wrong trade.',
  why: 'The most useful full-body pose there is — shoulders, lats, hamstrings and calves at once. Bent knees are non-negotiable for you until the hamstrings come along.',
  lv: ['Hands on blocks, knees very bent, 4 breaths', 'Knees bent, hips high, 6 breaths', 'Alternating heel presses', 'Knees straighter with a flat back, 8 breaths', 'Three-legged dog, one leg lifted'],
  vq: 'downward dog bent knees proper alignment beginner',
},
warrior1: {
  n: 'Warrior I', tgt: 'hips, legs, shoulders', prop: ['mat'], p: 'warrior1', s: 2,
  d: { k: 'breath', v: 5 },
  cue: 'From a lunge, turn the back foot out about 45° and press the heel down. Front knee over the ankle, hips facing forward, arms reaching up. Tuck the tailbone slightly so the lower back does not arch to get the arms up.',
  why: 'Strength in a long hip-flexor position — the combination that actually changes how your hips sit rather than just how far they stretch.',
  lv: ['Back knee down, hands on hips', 'Back knee down, arms up', 'Back leg straight, hands on hips', 'Full pose, arms up, 5 breaths', 'Full pose, 8 breaths, deeper front knee'],
  vq: 'warrior 1 virabhadrasana alignment beginner',
},
warrior2: {
  n: 'Warrior II', tgt: 'hips, adductors, shoulders', prop: ['mat'], p: 'warrior2', s: 2,
  d: { k: 'breath', v: 5 },
  cue: 'Feet wide, front foot forward, back foot turned in slightly. Bend the front knee toward 90° tracking over the middle of the foot. Arms straight out at shoulder height, chest facing the long edge of the mat, gaze over the front hand.',
  why: 'Opens the hips in the frontal plane — the direction your programme otherwise only touches in the Cossack squat — and builds real leg endurance.',
  lv: ['Narrow stance, shallow knee bend', 'Wider stance, half depth', 'Full stance, knee toward 90°', '8 breaths', '10 breaths with the back heel firmly grounded'],
  vq: 'warrior 2 virabhadrasana 2 alignment beginner',
},
triangle: {
  n: 'Triangle with block', tgt: 'hamstrings, side body', prop: ['blocks', 'mat'], p: 'triangle', s: 2,
  d: { k: 'breath', v: 5 },
  cue: 'Wide stance, front foot forward. Reach forward over the front leg, then lower the front hand onto a BLOCK beside the shin, top arm reaching up. Both sides of your waist stay long — do not collapse onto the bottom hand.',
  why: 'A hamstring stretch and a side-body opener at once. The block is what keeps it out of spinal flexion, which is why it is a block-first pose for you rather than an eventually-no-block one.',
  lv: ['Hand on the thigh', 'Hand on a high block', 'Hand on a low block', 'Hand to the shin, chest open', 'Hand to the floor, 8 breaths'],
  vq: 'triangle pose trikonasana with block alignment',
},
chairPose: {
  n: 'Chair pose', tgt: 'legs, trunk', prop: [], p: 'chairPose', s: 0,
  d: { k: 'hold', v: 25 },
  cue: 'Feet hip-width. Sit the hips back and down as though reaching for a chair, weight in the heels, arms reaching forward or up. Keep the ribs down and the lower back long — no arching to lift the arms.',
  why: 'It builds the leg and trunk endurance that makes standing and walking for longer stop being a problem.',
  lv: ['Quarter depth, hands on thighs, 20 seconds', 'Half depth, arms forward, 25 seconds', 'Full depth, arms up, 30 seconds', '40 seconds', '45 seconds with the heels lifted for the last 10'],
  vq: 'chair pose utkatasana alignment beginner',
},
treePose: {
  n: 'Tree pose', tgt: 'balance, hip, ankle', prop: ['wall'], p: 'tree', s: 2,
  d: { k: 'hold', v: 25 },
  cue: 'Stand near a wall. Place one foot against the opposite ankle, calf or inner thigh — never the side of the knee. Press the standing foot down evenly, open the lifted knee out, hands at the chest or overhead.',
  why: 'Balance is the ability that quietly disappears with five years of not training, and single-leg work exposes the side-to-side difference your leg pain has created.',
  lv: ['Toes on the floor, fingertips on the wall', 'Foot to the ankle, wall nearby', 'Foot to the calf, hands free', 'Foot to the inner thigh, arms overhead', 'Eyes closed'],
  vq: 'tree pose vrksasana alignment beginner',
},
sphinx: {
  n: 'Sphinx', tgt: 'lumbar extension, chest', prop: ['mat'], p: 'sphinxLow', s: 0,
  d: { k: 'breath', v: 8 },
  cue: 'Face down, forearms on the mat, elbows under the shoulders. Press the forearms down and draw the chest forward and up. Legs heavy, glutes soft, and let the lower back arch gently rather than gripping it.',
  why: 'The yoga version of the press-up hold: a sustained extension that most disc-related sciatica likes, and a chest opener at the same time.',
  lv: ['Prone on elbows, wider', 'Sphinx, 6 breaths', 'Sphinx, 8 breaths', 'Elbows walked slightly closer', 'Cobra with straight arms if extension feels good'],
  care: 'Same rule as the press-up: watch the leg. Pain retreating up toward the spine is the response you want.',
  vq: 'sphinx pose salamba bhujangasana alignment',
},
malasana: {
  n: 'Garland squat on blocks', tgt: 'hips, adductors, ankles', prop: ['blocks'], p: 'malasana', s: 0,
  d: { k: 'breath', v: 6 },
  cue: 'Feet a little wider than hips, toes slightly out. Sit down into a deep squat with the heels on a block or two if they lift. Elbows inside the knees, palms together, chest lifted, spine long.',
  why: 'The deep squat is the position the human hip is built for and the one a sedentary decade takes away. Getting it back does more for your hips than any single stretch.',
  lv: ['Holding a door frame, heels on blocks', 'Heels on blocks, 6 breaths', 'Heels on a thin book', 'Heels flat on the floor', 'Heels flat, 10 breaths, gentle side-to-side rocking'],
  vq: 'malasana garland pose deep squat heels elevated',
},
gatePose: {
  n: 'Gate pose', tgt: 'side body, adductors', prop: ['mat'], p: 'gate', s: 2,
  d: { k: 'breath', v: 5 },
  cue: 'Kneel, extend one leg straight out to the side with the foot flat. Reach the same-side arm along that leg and the other arm up and over, bending sideways. Keep the chest rotating open toward the ceiling rather than folding forward.',
  why: 'Side bending plus inner thigh in one shape, and one of the few poses that trains the lateral line at all.',
  lv: ['Hand on the thigh, small bend', 'Hand on the shin, arm overhead', 'Full reach, 5 breaths', 'Add a deeper chest rotation', 'Bottom hand to a block on the floor beyond the foot'],
  vq: 'gate pose parighasana alignment beginner',
},
seatedTwistYoga: {
  n: 'Seated spinal twist', tgt: 'thoracic rotation, glute', prop: ['mat', 'blocks'], p: 'seatedTwist', s: 2,
  d: { k: 'breath', v: 6 },
  cue: 'Sit on a block so the pelvis can stay upright. Cross one foot over the opposite thigh, foot flat. Lengthen up on the in-breath, then rotate toward the crossed knee on the out-breath, using the arm as leverage and not as a crowbar.',
  why: 'Rotation with an upright pelvis — sitting on the block is what stops this becoming a lumbar twist under load, which a sensitive back does not want.',
  lv: ['Sit on a block, gentle twist, no leverage', 'Sit on a block, hand on the knee', 'Elbow outside the knee', 'Full twist, 6 breaths', 'Bind the arms behind if comfortable'],
  care: 'Twist from the middle and upper back. If you feel it torquing the lower back, unwind and sit higher.',
  vq: 'seated spinal twist ardha matsyendrasana modification block',
},

/* ============== LOWER LEG, FEET, KNEES, DEEP SQUAT ===================== */

kneeToWall: {
  n: 'Knee-to-wall ankle drill', tgt: 'ankle dorsiflexion', prop: ['wall'], p: 'ankleWall', s: 2,
  d: { k: 'reps', v: 12 },
  cue: 'Stand facing a wall with one foot a hand-span back from it. Keeping the heel glued down, drive the knee forward to touch the wall. If it touches easily, move the foot further back. This is also your measurement — the distance from big toe to wall.',
  why: 'This is both your ankle drill and your ankle test. Ankles that cannot bend send the shortfall to the knees and low back and make a deep squat impossible.',
  lv: ['Foot close, 12 reps', 'Foot one hand-span back, 12 reps', 'Foot further back, 15 reps', 'Add a 3-second hold at the wall', 'Add a light band pulling the shin forward'],
  vq: 'knee to wall ankle dorsiflexion test and drill',
},
calfStretchStep: {
  n: 'Calf and soleus stretch', tgt: 'gastrocnemius, soleus', prop: ['wall'], p: 'calfStretch', s: 2,
  d: { k: 'hold', v: 35 },
  cue: 'Hands on the wall, one leg back with the heel down and the knee STRAIGHT for 35 seconds — that is the calf. Then bend that knee while keeping the heel down for another 35 — that is the soleus underneath it. Both are needed.',
  why: 'The soleus is the one everybody misses, and it is the main limiter of ankle bend. Two stretches, one position.',
  lv: ['Both versions on the floor', 'Both versions, toes on a book', 'Toes on a step, 35 seconds each', '45 seconds each', 'Contract-relax: press the toes down for 6 seconds, relax, sink deeper'],
  vq: 'calf soleus stretch straight bent knee tutorial',
},
calfRaiseEcc: {
  n: 'Calf raise with slow lower', tgt: 'calves, achilles', prop: ['wall'], p: 'calfRaise', s: 2,
  a: ['calfA', 'calfB'], d: { k: 'reps', v: 12 },
  cue: 'Fingertips on the wall for balance. Rise onto the toes of both feet, then shift your weight to one leg and lower over four slow seconds. Full range at the top, heel all the way down at the bottom.',
  why: 'Strong calves are what stop a stiff ankle re-stiffening, and slow lowering is what builds tendon quality rather than just muscle.',
  lv: ['Both legs, 12 reps', 'Both up, one down, 10 per side', 'Single leg up and down, 10 reps', 'On a step for extra range', 'Holding a 10 kg dumbbell'],
  vq: 'eccentric calf raise single leg tutorial',
},
tibRaise: {
  n: 'Tibialis raise', tgt: 'front of shin', prop: ['wall'], p: 'tibRaise', s: 0,
  a: ['tibA', 'tibB'], d: { k: 'reps', v: 15 },
  cue: 'Stand with your back against a wall, feet about 30 cm forward. Keeping the heels down, pull the toes and forefeet up toward your shins as far as they go, then lower slowly.',
  why: 'The muscle on the front of the shin controls your foot when you walk and almost nobody trains it. It is also directly relevant to you: weakness there is what foot drop looks like, so knowing your normal is worth having.',
  lv: ['Feet close to the wall, 15 reps', 'Feet further out, 15 reps', '20 reps, 2-second hold at the top', 'One leg at a time', 'Holding a light dumbbell against the chest'],
  vq: 'tibialis raise wall exercise tutorial',
},
footBall: {
  n: 'Foot rolling with a ball', tgt: 'plantar fascia, foot', prop: ['ball'], p: 'footBall', s: 2,
  d: { k: 'time', v: 60 },
  cue: 'Standing or seated, roll the ball slowly under the arch of one foot, pausing on any spot that is tender for a few breaths. Then spend 15 seconds under the big toe joint specifically.',
  why: 'The foot is your base and the big toe is what you push off from. Freeing them up genuinely changes how the whole leg loads.',
  lv: ['Seated, light pressure, 60 seconds', 'Standing, 60 seconds', 'Standing, full bodyweight, 75 seconds', 'Add toe spreading against the floor', 'Add big-toe lifts and presses, 10 each'],
  vq: 'plantar fascia ball rolling foot massage technique',
},
toeYoga: {
  n: 'Toe splay and big-toe lifts', tgt: 'foot intrinsics, big toe', prop: [], p: 'seated', s: 2,
  d: { k: 'reps', v: 12 },
  cue: 'Barefoot, foot flat. Lift only the big toe while the others stay down; then reverse — big toe down, the other four up. Then spread all five toes apart without curling them. Slow and awkward is normal at first.',
  why: 'Big-toe control is the foundation of balance and push-off, and it is genuinely trainable. This is the smallest exercise in the programme and one of the most neglected.',
  lv: ['Hand-assisted, 8 each', 'Unassisted big toe lifts, 12', 'Both directions, 12 each', 'Add toe splay holds of 5 seconds', 'Standing on one leg while doing it'],
  vq: 'toe yoga big toe lift exercise foot intrinsic',
},
squatPry: {
  n: 'Deep squat prying', tgt: 'hips, ankles, adductors', prop: ['dumbbell', 'blocks'], p: 'deepSquat', s: 0,
  a: ['pryA', 'pryB'], d: { k: 'time', v: 60 },
  cue: 'Hold a dumbbell at your chest as a counterweight and sit into the deepest squat you can with the heels down — on blocks if needed. Now move around down there: shift side to side, push one knee out with your elbow, rock forward and back. Do not just hold still.',
  why: 'The counterweight is the trick — held in front, it lets you sit far deeper with an upright back than you can unloaded. Moving in the bottom position opens the hip in every direction at once.',
  lv: ['Holding a door frame, heels on blocks, 45 seconds', '5 kg counterweight, heels on blocks', '8 kg counterweight, heels on a book', '10 kg, heels flat, 60 seconds', '12 kg, heels flat, 90 seconds of active prying'],
  vq: 'goblet squat prying deep squat mobility counterweight',
},
stepUp: {
  n: 'Bench step-up', tgt: 'glutes, quads, balance', prop: ['bench'], p: 'stepUp', s: 2,
  d: { k: 'reps', v: 10 },
  cue: 'Set the bench low. Place one whole foot on it, then drive up through that leg without pushing off the back foot. Stand tall at the top, then lower slowly — three seconds down — and let the back foot just touch.',
  why: 'Single-leg strength, in the pattern you use on every staircase. It also directly rebuilds the side-to-side balance that nine months of favouring one leg has cost you.',
  lv: ['Low step, holding support, 8 reps', 'Low step, hands free, 10 reps', 'Bench height, 10 reps', 'Bench height, 3-second lower', 'Holding 2 × 10 kg dumbbells'],
  care: 'Do the painful side first and match the reps on the strong side to what the weak one can do cleanly.',
  vq: 'step up exercise proper form bench beginner',
},
splitSquat: {
  n: 'Split squat', tgt: 'quads, glutes, hip flexors', prop: ['chair', 'dumbbell'], p: 'splitSquat', s: 2,
  d: { k: 'reps', v: 8 },
  cue: 'Long stance, one foot forward and one back, torso upright. Drop the back knee straight down toward the floor and press back up. The front shin stays roughly vertical and the trunk does not lean forward.',
  why: 'The most useful lower-body strength exercise for you: it loads one leg hard while keeping the spine vertical and unloaded, unlike a squat or a deadlift.',
  lv: ['Holding a chair, half depth', 'Hands free, half depth, 8 reps', 'Full depth, back knee to a cushion', 'Holding 2 × 8 kg dumbbells', 'Rear foot on the bench (Bulgarian), 2 × 12 kg'],
  vq: 'split squat proper form beginner dumbbell',
},
});

/* =============== THORACIC SPINE, NECK & ROTATION ======================= */

Object.assign(EX, {

openBook: {
  n: 'Open book', tgt: 'thoracic rotation', prop: ['mat'], p: 'openBook', s: 2,
  a: ['obA', 'obB'], d: { k: 'reps', v: 8 },
  cue: 'Lie on your side, knees bent and stacked with a block or cushion between them, arms together out in front. Keep the knees pinned together and sweep the top arm in a big arc over and behind you, following it with your eyes. Breathe out as it opens.',
  why: 'The single best thoracic rotation drill. With the knees pinned, the rotation has to come from the mid-back rather than the lower back or the pelvis — which is exactly the separation you need.',
  lv: ['Small arc, 8 reps', 'Full arc, 8 reps', '10 reps, 3-second hold at the end', 'Hold the end range for 5 breaths on the last rep', 'Add a block under the top knee for a bigger arc'],
  vq: 'open book thoracic rotation exercise tutorial',
},
rollerExt: {
  n: 'Thoracic extension over the roller', tgt: 'mid-back extension', prop: ['roller'], p: 'rollerExt', s: 0,
  d: { k: 'reps', v: 8 },
  cue: 'Roller across your mid-back, knees bent, hands supporting your head. Breathe out and let the upper back drape backward over the roller, then come up. Move the roller a few centimetres up or down and repeat. Keep your ribs from flaring and your lower back out of it.',
  why: 'The mid-back is the part of your spine that should extend and mostly does not. Getting it back means the lower back stops being asked to do all the arching.',
  lv: ['Hands supporting the head, small range', '8 reps, three roller positions', '10 reps, deeper drape', 'Add a 3-breath hold at each position', 'Arms overhead during the extension'],
  care: 'Keep the roller above the bottom of your ribs. Do not roll it onto your lower back.',
  vq: 'foam roller thoracic extension exercise tutorial',
},
quadrupedRotation: {
  n: 'Quadruped thoracic rotation', tgt: 'thoracic rotation', prop: ['mat'], p: 'quadRot', s: 2,
  a: ['qrA', 'qrB'], d: { k: 'reps', v: 8 },
  cue: 'On hands and knees, one hand behind your head. Rotate that elbow down toward the opposite wrist, then open it up toward the ceiling, following with your eyes. Hips stay square and level throughout.',
  why: 'Rotation on all fours, where the pelvis is locked by the position. It is more demanding than the open book and it builds active control of rotation rather than just range.',
  lv: ['Small range, 8 reps', 'Full range, 8 reps', '10 reps with a 2-second hold at the top', 'From a sitting-back-on-heels position', 'Add a light 2 kg dumbbell in the rotating hand'],
  vq: 'quadruped thoracic rotation exercise form',
},
sideBendStanding: {
  n: 'Standing side bend', tgt: 'lateral trunk, lats, QL', prop: ['dumbbell'], p: 'sideBend', s: 2,
  d: { k: 'hold', v: 30 },
  cue: 'Stand tall, reach one arm overhead and bend sideways, keeping both hips level and facing forward. Reach long rather than leaning far — imagine lengthening over a barrel rather than collapsing sideways.',
  why: 'The lateral line runs from your hip to your shoulder, and after nine months of leaning off one leg, yours will be uneven. This is the most direct way at it.',
  lv: ['No weight, 30 seconds each', 'No weight, deeper reach', 'Holding 5 kg in the opposite hand', 'Holding 8 kg, 30 seconds', 'Holding 10 kg, 40 seconds'],
  vq: 'standing side bend stretch lateral trunk form',
},
chinTuck: {
  n: 'Chin tuck', tgt: 'deep neck flexors', prop: [], p: 'supineKnees', s: 0,
  d: { k: 'hold', v: 8 },
  cue: 'On your back, head on the mat. Without lifting your head, glide the chin gently back and down as if making a double chin, lengthening the back of the neck. Hold, then release.',
  why: 'The deep neck flexors are what hold your head up over your shoulders. They switch off with desk posture, and no amount of neck stretching substitutes for training them.',
  lv: ['5 seconds × 6', '8 seconds × 8', '10 seconds × 8', 'Add a small head lift of 1 cm at the end', 'Standing against a wall, 10 seconds × 8'],
  vq: 'chin tuck deep neck flexor exercise supine',
},
scalene: {
  n: 'Neck side and diagonal stretch', tgt: 'scalenes, upper trapezius', prop: ['chair'], p: 'seated', s: 2,
  d: { k: 'hold', v: 30 },
  cue: 'Sit and hold the chair seat with one hand to anchor that shoulder down. Tilt your head away, then turn it slightly to look up toward the ceiling on the opposite side. Gentle — the neck is not a hamstring.',
  why: 'These muscles pull your first ribs up all day when you breathe with your chest instead of your ribs. Releasing them is what makes the breathing work stick.',
  lv: ['Head tilt only', 'Tilt with the shoulder anchored', 'Add the diagonal look-up', '30 seconds each of three angles', 'Add a gentle exhale-and-sink at the end of each'],
  care: 'No pulling on your own head with a hand. Anchor the shoulder and let gravity do it.',
  vq: 'scalene upper trap neck stretch seated anchored',
},
ribBreathing: {
  n: 'Side-lying rib opening', tgt: 'rib cage, breathing mechanics', prop: ['roller', 'mat'], p: 'sideRib', s: 2,
  d: { k: 'breath', v: 8 },
  cue: 'Lie on your side over the roller or a rolled towel placed under your lower ribs, top arm reaching overhead. Breathe into the upper side of the rib cage and feel it expand against the stretch.',
  why: 'Ribs that cannot expand on one side keep the trunk on that side stiff no matter how much you stretch it. Breathing into a stretched position is how you change that.',
  lv: ['No roller, arm overhead', 'Rolled towel, 6 breaths', 'Roller, 8 breaths', 'Add a slight backward rotation of the chest', 'Add a reach-and-hold on each exhale'],
  vq: 'side lying rib cage breathing stretch foam roller',
},
wallAngel: {
  n: 'Wall angel', tgt: 'scapula, thoracic extension', prop: ['wall'], p: 'wallSlide', s: 0,
  a: ['angelA', 'angelB'], d: { k: 'reps', v: 10 },
  cue: 'Back against the wall, feet a step forward, knees soft. Arms in a goalpost shape with the backs of the hands, elbows and wrists touching the wall. Slide up and down while keeping every contact point — and keeping the lower back flat.',
  why: 'Harder than it looks and an excellent honest test: whatever contact point you lose first is exactly what is restricted.',
  lv: ['Elbows only, small range', 'Half slide keeping contact', 'Full slide, hands may leave the wall', 'Full slide, all contact points held', 'Add a 3-second hold overhead'],
  vq: 'wall angel exercise proper form scapular',
},

/* ======================== RESTORATIVE ================================= */

legsUpWall: {
  n: 'Legs up the wall', tgt: 'whole posterior chain, nervous system', prop: ['wall', 'mat'], p: 'legsUp', s: 0,
  d: { k: 'time', v: 180 },
  cue: 'Sit sideways next to the wall, then swing the legs up and lie back so your legs rest vertically against it, hips a hand-span or so from the wall. Arms out to the sides. Let everything be heavy and just breathe.',
  why: 'Almost zero effort, genuinely restorative, and it unloads the lower back completely. A good place to be on a day when everything hurts.',
  lv: ['Hips further from the wall, knees bent', 'Hips a hand-span away, legs straight', '3 minutes', '4 minutes', '5 minutes with a cushion under the hips'],
  vq: 'legs up the wall pose viparita karani setup',
},
supportedBridge: {
  n: 'Supported bridge over a block', tgt: 'lower back, hip flexors, chest', prop: ['blocks'], p: 'supBridge', s: 0,
  d: { k: 'time', v: 150 },
  cue: 'Lie down, lift the hips and slide a block on its lowest or middle height under your sacrum — the flat bony plate, not the lower back. Let your weight settle onto it and relax completely. Legs straight or bent, whichever is calmer.',
  why: 'Passive extension with no muscular effort at all. If extension is your preferred direction, this is one of the most useful two minutes in the whole programme.',
  lv: ['Block on the lowest height, knees bent', 'Lowest height, legs long', 'Middle height, 2 minutes', 'Middle height, 3 minutes', 'Highest height if it stays comfortable'],
  care: 'The block goes under the sacrum, never under the lumbar curve.',
  vq: 'supported bridge pose block under sacrum restorative',
},
reclinedButterfly: {
  n: 'Reclined butterfly', tgt: 'inner thighs, hips, chest', prop: ['blocks', 'mat'], p: 'butterfly', s: 0,
  d: { k: 'time', v: 180 },
  cue: 'Lie on your back, soles of the feet together, knees falling open. Put a block or cushion under each knee so the hips can let go rather than hang. Arms wide, palms up.',
  why: 'A long, fully supported adductor and hip opener. Supporting the knees is what turns it from a stretch you endure into one your nervous system actually releases into.',
  lv: ['High support under both knees', 'Medium support, 2 minutes', 'Low support, 3 minutes', 'No support, 3 minutes', '5 minutes with a bolster along the spine'],
  vq: 'reclined butterfly supta baddha konasana supported',
},
supportedChild: {
  n: 'Supported child\'s pose', tgt: 'lower back, hips, shoulders', prop: ['blocks', 'mat'], p: 'childs', s: 0,
  d: { k: 'time', v: 150 },
  cue: 'Knees wide, big cushion or folded blanket stacked under your chest and head so you are resting on it rather than holding yourself up. Arms forward or alongside. Sink and breathe into the back of the ribs.',
  why: 'The most reliably calming shape for a tired lower back, and with enough support underneath you can stay in it for minutes rather than seconds.',
  lv: ['Tall stack of cushions', 'Medium stack, 2 minutes', 'Low stack, 2.5 minutes', 'Arms reaching, 3 minutes', 'Side-reaching variation, 90 seconds each way'],
  vq: 'supported childs pose with bolster restorative setup',
},
savasana: {
  n: 'Savasana with body scan', tgt: 'nervous system', prop: ['mat'], p: 'savasana', s: 0,
  d: { k: 'time', v: 240 },
  cue: 'On your back, a cushion under the knees if the lower back prefers it, arms a little away from the sides, palms up. Then work slowly from your feet to your head, and at each part just notice it and let it get heavier.',
  why: 'The point is not relaxation for its own sake. Persistent pain keeps the nervous system on alert and turns up the volume on everything; deliberately downregulating is one of the few things that genuinely turns it back down.',
  lv: ['2 minutes, cushion under the knees', '3 minutes', '4 minutes', '5 minutes', '8 minutes with a slow breath count'],
  vq: 'savasana body scan guided relaxation setup',
},
gluteBall: {
  n: 'Glute and piriformis ball release', tgt: 'deep glute, piriformis', prop: ['ball'], p: 'gluteBall', s: 2,
  d: { k: 'time', v: 90 },
  cue: 'Sit on the ball, placing it in the meat of one buttock — not on the bony sit bone and not on the tailbone. Lean into it and rest on any tender spot for 20-30 seconds, breathing, then move on. Crossing that ankle over the other knee deepens it.',
  why: 'With a piriformis component in your picture, direct pressure work on the deep glute is worth the time. Sustained and boring beats fast and aggressive here.',
  lv: ['Soft ball, seated in a chair, 60 seconds', 'Soft ball on the floor, 90 seconds', 'Tennis ball on the floor, 90 seconds', 'Tennis ball with the ankle crossed over the knee', 'Lacrosse ball, 2 minutes'],
  care: 'Stay off the bone and stay off anything that makes the leg tingle. Dull, deep, tolerable ache only.',
  vq: 'piriformis glute release ball trigger point technique',
},
rollerQuadIT: {
  n: 'Roller: quads and side of thigh', tgt: 'quads, lateral thigh', prop: ['roller'], p: 'rollerQuad', s: 2,
  d: { k: 'time', v: 75 },
  cue: 'Face down with the roller under one thigh, forearms supporting you. Roll slowly from just above the knee to the hip, pausing where it bites. Then turn a quarter onto your side for the outside of the thigh.',
  why: 'The front and side of the thigh pull on the pelvis and knee all day. Rolling will not lengthen anything permanently, but it reliably buys you range for the session that follows.',
  lv: ['45 seconds per side, light pressure', '75 seconds per side', '90 seconds, pausing on tender spots', 'Add knee bending while paused', 'Cross the other leg over for more pressure'],
  vq: 'foam roller quads lateral thigh technique',
},
diaphragmReset: {
  n: 'Legs-on-bench breathing', tgt: 'diaphragm, lumbar decompression', prop: ['bench'], p: 'legsBench', s: 0,
  d: { k: 'breath', v: 12 },
  cue: 'Lie on your back with your calves resting on the bench so the hips and knees are both bent about 90°. Hands on the belly. Long slow breaths — in for four, out for six — and let the lower back widen into the floor.',
  why: 'Hips and knees at 90° is the most mechanically unloaded position your lumbar spine can be in. Combined with slow breathing it is the closest thing to a reset button you have.',
  lv: ['8 breaths', '12 breaths', '12 breaths, out for 8 seconds', '15 breaths', '3 minutes, breath count of your own'],
  vq: 'legs elevated 90 90 breathing lumbar decompression',
},

/* ========================= STRENGTH (phases 3-6) ====================== */

gobletSquat: {
  n: 'Goblet squat', tgt: 'quads, glutes, trunk', prop: ['dumbbell'], p: 'gobletSquat', s: 0,
  d: { k: 'reps', v: 10 },
  cue: 'Hold one dumbbell vertically against your chest, elbows tucked. Sit down between your heels, keeping the chest tall and the whole foot planted. Go as deep as you can without the lower back rounding at the bottom, then drive up through the middle of the feet.',
  why: 'The counterweight at the chest keeps you upright, which makes this by far the most back-friendly squat pattern. It is where your leg strength gets rebuilt.',
  lv: ['Bodyweight to a chair, 12 reps', '8 kg, half depth, 10 reps', '12 kg, full depth, 10 reps', '16 kg, 10 reps, 2-second pause at the bottom', '20-25 kg, 8 reps'],
  care: 'Rounding at the bottom (a "butt wink") means stop the depth just above where it starts.',
  vq: 'goblet squat proper form beginner depth',
},
dbRDL: {
  n: 'Dumbbell Romanian deadlift', tgt: 'hamstrings, glutes, back', prop: ['dumbbell'], p: 'rdl', s: 0,
  a: ['rdlA', 'rdlB'], d: { k: 'reps', v: 10 },
  cue: 'Dumbbells in front of the thighs, knees slightly bent and STAYING that way. Push your hips backward and let the weights travel down the front of your legs, keeping your back perfectly flat and the weights close. Stop when you feel the hamstrings load — usually mid-shin — then drive the hips forward to stand.',
  why: 'The most valuable strength exercise in the whole programme for you: it trains the hip hinge, which is how a back-safe human picks things up, while loading the hamstrings at length. This is also what turns your toe-touch gain into something durable.',
  lv: ['No weight, hands sliding down the thighs', '2 × 5 kg, 10 reps', '2 × 10 kg, 10 reps', '2 × 15 kg, 10 reps, 3-second lower', '2 × 20-25 kg, 8 reps'],
  care: 'The back rounding is the only real mistake here. Film yourself from the side once — everyone thinks their back is flat and about half are wrong.',
  vq: 'dumbbell romanian deadlift hip hinge form beginner',
},
dbFloorPress: {
  n: 'Floor press', tgt: 'chest, triceps, shoulders', prop: ['dumbbell', 'mat'], p: 'floorPress', s: 0,
  d: { k: 'reps', v: 10 },
  cue: 'Lie on your back on the mat, knees bent, dumbbells over your chest. Lower until the upper arms touch the floor, pause, then press back up. The floor limits the range, which protects the shoulder.',
  why: 'The most joint-friendly pressing variation, and a good first pressing exercise before the incline press. Your spine is fully supported throughout.',
  lv: ['2 × 5 kg, 12 reps', '2 × 8 kg, 10 reps', '2 × 12 kg, 10 reps', '2 × 16 kg, 10 reps', '2 × 20 kg, 8 reps'],
  vq: 'dumbbell floor press form beginner',
},
dbShoulderPress: {
  n: 'Seated shoulder press', tgt: 'shoulders, triceps', prop: ['bench', 'dumbbell'], p: 'ohp', s: 0,
  d: { k: 'reps', v: 10 },
  cue: 'Bench upright, back supported. Dumbbells at shoulder height, press up until the arms are straight without letting the ribs flare or the lower back arch off the bench. Lower under control to ear height.',
  why: 'Pressing overhead is the payoff for all the shoulder mobility work — and it only becomes safe once that range exists, which is why it appears in month five and not month one.',
  lv: ['2 × 4 kg, 12 reps', '2 × 6 kg, 10 reps', '2 × 9 kg, 10 reps', '2 × 12 kg, 10 reps', '2 × 16 kg, 8 reps'],
  care: 'If your lower back leaves the bench to complete the press, the weight is too heavy or the shoulder range is not there yet.',
  vq: 'seated dumbbell shoulder press form bench',
},
dbCurlAndExt: {
  n: 'Curl and overhead extension', tgt: 'biceps, triceps', prop: ['dumbbell'], p: 'curl', s: 0,
  a: ['curlA', 'curlB'], d: { k: 'reps', v: 12 },
  cue: 'Standing tall, ribs down. Curl both dumbbells up without swinging your body, lower slowly. Then hold one dumbbell in both hands overhead, lower it behind your head by bending the elbows, and press it back up — elbows stay close to your ears.',
  why: 'You asked for arms. These are here because they are what you will notice in the mirror, they cost almost nothing in spinal load, and strong triceps help every press.',
  lv: ['2 × 5 kg curls, 8 kg extension', '2 × 8 kg curls, 10 kg extension', '2 × 10 kg curls, 12 kg extension', '2 × 12 kg curls, 14 kg extension', '2 × 15 kg curls, 16 kg extension'],
  vq: 'dumbbell curl overhead triceps extension form',
},
farmerCarry: {
  n: 'Farmer carry', tgt: 'whole body, grip, posture', prop: ['dumbbell'], p: 'carry', s: 0,
  d: { k: 'time', v: 40 },
  cue: 'A dumbbell in each hand, stand as tall as you can and walk slowly. Shoulders down and back, ribs stacked over hips, breathing steady. Set them down before your posture breaks, not after.',
  why: 'Loaded, upright, neutral-spine walking. It builds trunk stiffness, grip and general robustness with almost no risk, and it is the single best "carryover to real life" exercise in the programme.',
  lv: ['2 × 8 kg, 30 seconds', '2 × 12 kg, 40 seconds', '2 × 16 kg, 40 seconds', '2 × 20 kg, 45 seconds', '2 × 25 kg, 60 seconds'],
  vq: 'farmer carry dumbbell form posture',
},
});

/* ====================== SESSION TEMPLATES ==============================
   Seven weekday categories. Each has an opening ritual, three weekly main
   variants (A/B/C) and a close. `id@3` means the exercise joins from phase 3.
   Deload weeks take a trimmed variant A plus extra restorative work.
   ===================================================================== */

const SESSIONS = {

spine: {
  name: 'Spine & nerve', cat: 'spine', dow: 1, vid: 'spine',
  intent: 'Quieten the leg, build spine-sparing stability, own the direction your back prefers.',
  open: ['breath360', 'pelvicTilt', 'catCow'],
  main: {
    A: ['pressUp', 'sciaticSlider', 'deadBug', 'birdDog', 'glueBridge', 'figure4', 'suitcase@3'],
    B: ['proneOnElbows', 'sciaticSlider', 'curlUpMcGill', 'sidePlank', 'birdDog', 'gluteMedSide', 'pallof@3'],
    C: ['pressUp', 'sciaticSlider', 'deadBug', 'sidePlank', 'glueBridge', 'hipThrust@3', 'suitcase@3'],
  },
  close: ['twistSupine', 'childsPose'],
},

hips: {
  name: 'Hips, hamstrings & adductors', cat: 'hips', dow: 2, vid: 'hips',
  intent: 'The toe-touch session. Hamstring length from the hips, with the spine kept neutral throughout.',
  open: ['breath360', 'hipCar', 'catCow'],
  main: {
    A: ['strapHam', 'hipFlexorLunge', 'ninetyNinety', 'adductorRock', 'halfSplit', 'gluteMedSide', 'hamstringEcc@4'],
    B: ['strapHam', 'lowLunge', 'ninetyNinetyLean', 'frogStretch', 'happyBaby', 'glueBridge', 'cossack@4'],
    C: ['strapHam', 'hipFlexorLunge', 'ninetyNinety', 'pigeonAlt', 'halfSplit', 'hipThrust@3', 'hamstringEcc@4'],
  },
  close: ['figure4', 'twistSupine'],
  strengthMain: ['dbRDL', 'gobletSquat', 'splitSquat', 'hipThrust', 'strapHam', 'hamstringEcc', 'farmerCarry'],
},

pilates: {
  name: 'Pilates — core & control', cat: 'pilates', dow: 3, vid: 'pilates',
  intent: 'Control before range. Teach the trunk to hold position while the limbs move.',
  open: ['pilBreath', 'pilImprint', 'catCow'],
  main: {
    A: ['pilToeTap', 'pilShoulderBridge', 'pilClam', 'pilSwimming', 'pilMermaid', 'pilSingleLegStretch', 'pilLegPullFront@3'],
    B: ['pilSingleLegStretch', 'pilSideKick', 'pilShoulderBridge', 'pilSwimming', 'pilRollDownWall', 'pilMermaid', 'pilLegPullFront@3'],
    C: ['pilToeTap', 'pilClam', 'pilSideKick', 'pilLegPullFront', 'pilMermaid', 'pilRollDownWall@2', 'pallof@4'],
  },
  close: ['childsPose', 'twistSupine'],
},

upper: {
  name: 'Shoulders, chest, lats & arms', cat: 'upper', dow: 4, vid: 'upper',
  intent: 'Rebuild overhead range, then load it. Wrists and rotator cuff included, because you asked for everything.',
  open: ['breath360', 'shoulderCar', 'wristSeries'],
  main: {
    A: ['wallSlide', 'doorwayPec', 'strapDislocate', 'latStretchBlock', 'scapPushup', 'proneYTW', 'benchRow@3'],
    B: ['wallAngel', 'doorwayPec', 'strapDislocate', 'puppyPose', 'threadNeedle', 'extRotation@2', 'inclinePress@3'],
    C: ['wallSlide', 'latStretchBlock', 'strapDislocate', 'scapPushup', 'proneYTW', 'pullover@3', 'benchRow@3'],
  },
  close: ['threadNeedle', 'childsPose'],
  strengthMain: ['inclinePress', 'benchRow', 'dbShoulderPress', 'pullover', 'dbCurlAndExt', 'extRotation', 'farmerCarry'],
},

yoga: {
  name: 'Yoga flow', cat: 'yoga', dow: 5, vid: 'yoga',
  intent: 'One breath-led sequence, blocks under the hands so the spine never rounds to reach the floor.',
  open: ['mountain', 'catCow', 'catCowFlow'],
  main: {
    A: ['downDog', 'lowLunge', 'warrior1', 'warrior2', 'triangle', 'treePose', 'sphinx'],
    B: ['downDog', 'chairPose', 'warrior2', 'gatePose', 'malasana', 'seatedTwistYoga', 'sphinx'],
    C: ['downDog', 'lowLunge', 'warrior1', 'triangle', 'treePose', 'malasana', 'pigeonAlt'],
  },
  close: ['twistSupine', 'savasana'],
},

lowerleg: {
  name: 'Feet, ankles & deep squat', cat: 'lowerleg', dow: 6, vid: 'lowerleg',
  intent: 'From the ground up. Ankles that bend, feet that grip, and a squat you can actually sit in.',
  open: ['ankleCar', 'footBall', 'catCow'],
  main: {
    A: ['kneeToWall', 'calfStretchStep', 'toeYoga', 'calfRaiseEcc', 'tibRaise', 'malasana', 'squatPry@3'],
    B: ['kneeToWall', 'calfStretchStep', 'calfRaiseEcc', 'tibRaise', 'cossack@2', 'stepUp@3', 'squatPry@3'],
    C: ['kneeToWall', 'toeYoga', 'calfRaiseEcc', 'malasana', 'splitSquat@3', 'stepUp@3', 'squatPry@3'],
  },
  close: ['figure4', 'legsUpWall'],
},

tspine: {
  name: 'Mid-back, neck & rotation', cat: 'tspine', dow: 6, vid: 'tspine',
  intent: 'Give the rotation back to the mid-back so the lower back stops doing its job.',
  open: ['breath360', 'neckCar', 'catCow'],
  main: {
    A: ['openBook', 'rollerExt', 'quadrupedRotation', 'chinTuck', 'scalene', 'sideBendStanding', 'suitcase@3'],
    B: ['openBook', 'rollerExt', 'threadNeedle', 'ribBreathing', 'wallAngel', 'sideBendStanding', 'pallof@3'],
    C: ['quadrupedRotation', 'rollerExt', 'openBook', 'chinTuck', 'puppyPose', 'seatedTwistYoga', 'suitcase@3'],
  },
  close: ['childsPose', 'twistSupine'],
},

restore: {
  name: 'Restorative & check-in', cat: 'restore', dow: 0, vid: 'restore',
  intent: 'Long supported holds, nothing to achieve. This is the day the week before actually turns into progress.',
  open: ['breath360', 'diaphragmReset'],
  main: {
    A: ['gluteBall', 'supportedBridge', 'reclinedButterfly', 'legsUpWall', 'supportedChild'],
    B: ['rollerQuadIT', 'gluteBall', 'supportedBridge', 'happyBaby', 'legsUpWall'],
    C: ['gluteBall', 'reclinedButterfly', 'supportedChild', 'legsUpWall', 'twistSupine'],
  },
  close: ['savasana'],
  measures: true,
},

};

/* ====================== PROGRAMME MECHANICS ============================ */

/** Which phase (1-6) and week-within-phase a programme week falls in. */
function phaseForWeek(week) {
  let w = week, i = 0;
  while (i < PHASES.length - 1 && w > PHASES[i].weeks) { w -= PHASES[i].weeks; i++; }
  return { phase: PHASES[i], weekInPhase: w, isDeload: w === PHASES[i].weeks && PHASES[i].n < 6 };
}

/** Total weeks — 26 by construction, asserted so edits to PHASES stay honest. */
function totalWeeks() { return PHASES.reduce((s, p) => s + p.weeks, 0); }

/** Weekly variant: A, B, C cycling, with the last week of each phase a deload. */
function variantFor(week) {
  const { weekInPhase, isDeload } = phaseForWeek(week);
  if (isDeload) return 'D';
  return ['A', 'B', 'C', 'B'][(weekInPhase - 1) % 4];
}

/** Which session category a given programme day is. day is 1-based. */
function categoryFor(day) {
  const week = Math.ceil(day / 7);
  const dow = (day - 1) % 7; // 0 = Monday
  if (dow === 5) return week % 2 === 1 ? 'lowerleg' : 'tspine';
  return ['spine', 'hips', 'pilates', 'upper', 'yoga', null, 'restore'][dow];
}

/** Resolve an entry like 'suitcase@3' against the current phase. */
function gateOk(entry, phaseN) {
  const at = entry.indexOf('@');
  if (at < 0) return true;
  return phaseN >= parseInt(entry.slice(at + 1), 10);
}
function gateId(entry) {
  const at = entry.indexOf('@');
  return at < 0 ? entry : entry.slice(0, at);
}

/** Dose for one exercise, given a phase and a set count. */
function doseFor(ex, phaseN, deload, setsOverride, mul) {
  const ph = PHASES[phaseN - 1];
  const m = mul || 1;
  const holdMul = ph.holdMul * (deload ? 1.15 : 1) * m;
  const repMul = ph.repMul * (deload ? 0.8 : 1) * m;
  const sets = Math.max(1, setsOverride || 1);
  const sides = ex.s === 2 ? 2 : 1;
  const d = ex.d;
  let label, work;

  if (d.k === 'hold') {
    const sec = Math.round((d.v * holdMul) / 5) * 5;
    label = sets > 1 ? sets + ' \u00d7 ' + sec + 's' : sec + 's';
    work = sec * sets * sides;
  } else if (d.k === 'time') {
    const sec = Math.round((d.v * (deload ? 1.15 : ph.holdMul) * m) / 15) * 15;
    label = sec >= 60 ? (sec % 60 ? (sec / 60).toFixed(1) : sec / 60) + ' min' : sec + 's';
    work = sec * sides;
  } else if (d.k === 'reps') {
    const reps = Math.max(4, Math.round(d.v * repMul));
    label = sets > 1 ? sets + ' \u00d7 ' + reps + ' reps' : reps + ' reps';
    work = reps * 4.5 * sets * sides;
  } else {
    const br = Math.max(4, Math.round(d.v * holdMul));
    label = (sets > 1 ? sets + ' \u00d7 ' : '') + br + ' breaths';
    work = br * 6 * sets * sides;
  }
  if (sides === 2) label += ' each side';
  return { label, work: Math.round(work), sets, sides };
}

const REST_BETWEEN = 14; // seconds of setting up and moving between sets

/* Not every day should be the same length — that undulation is deliberate.
   Restorative Sunday runs shorter than the phase headline; yoga runs to it. */
const CAT_LOAD = { restore: 0.72, yoga: 1.0, spine: 0.95, pilates: 0.95, upper: 1.0, hips: 1.0, lowerleg: 1.0, tspine: 0.95 };

/** Build the full session for a 1-based programme day.
 *  Set counts are fitted so the session actually lands inside the phase's
 *  stated time window rather than the window being decorative. */
function sessionFor(day, opts) {
  opts = opts || {};
  const week = Math.ceil(day / 7);
  const { phase, weekInPhase, isDeload } = phaseForWeek(week);
  const cat = categoryFor(day);
  const tpl = SESSIONS[cat];
  const variant = variantFor(week);
  const useStrength = phase.n >= 5 && tpl.strengthMain && (cat === 'hips' || cat === 'upper');

  let mainEntries;
  if (useStrength) {
    mainEntries = tpl.strengthMain.slice(0, isDeload ? 5 : 7);
  } else if (variant === 'D') {
    mainEntries = tpl.main.A.slice(0, 5);
  } else {
    mainEntries = tpl.main[variant].slice();
  }

  const pick = (list) => list.filter(e => gateOk(e, phase.n)).map(gateId).filter(id => EX[id]);
  let openIds = pick(tpl.open);
  let mainIds = pick(mainEntries);
  let closeIds = pick(tpl.close);
  if (isDeload && cat !== 'restore') closeIds = closeIds.concat(['legsUpWall']);

  // The short version keeps the ritual and the first movements, trims the tail.
  if (opts.short) {
    mainIds = mainIds.slice(0, Math.max(4, mainIds.length - 2));
    closeIds = closeIds.slice(0, 1);
  }

  const [lo, hi] = phase.mins;
  const load = CAT_LOAD[cat] || 1;
  const scale = opts.short ? 0.66 : 1;
  const budget = hi * 60 * load * scale;
  const floor = lo * 60 * load * scale * 0.9;

  const assemble = (mainSets, mul) => {
    const mk = (ids, block, sets) => ids.map(id => {
      const ex = EX[id];
      const s = ex.d.k === 'time' ? Math.min(2, sets) : sets;
      const dose = doseFor(ex, phase.n, isDeload, s, mul);
      return { id, ex, block, dose,
        level: Math.min(5, Math.max(1, phase.n - (isDeload ? 1 : 0))) };
    });
    const items = mk(openIds, 'open', 1)
      .concat(mk(mainIds, 'main', mainSets), mk(closeIds, 'close', 1));
    const seconds = items.reduce((s, it) =>
      s + it.dose.work + REST_BETWEEN * it.dose.sets * it.dose.sides, 0);
    return { items, seconds, mul: mul || 1 };
  };

  // Pick the set count closest to the middle of the window, then — rather than
  // piling on a fourth set of the same stretch — lengthen the holds to fill it.
  const target = (floor + budget) / 2;
  let best = null, bestSets = 1;
  for (let sets = 1; sets <= 3; sets++) {
    const cand = assemble(sets, 1);
    if (!best || Math.abs(cand.seconds - target) < Math.abs(best.seconds - target)) {
      best = cand; bestSets = sets;
    }
    if (cand.seconds > budget * 1.2) break;
  }
  if (best.seconds < floor) {
    for (const mul of [1.12, 1.22, 1.35]) {
      const cand = assemble(bestSets, mul);
      best = cand;
      if (cand.seconds >= floor) break;
    }
  }
  best.mainSets = bestSets;

  const band = phase.n <= 2 ? 1 : phase.n <= 4 ? 2 : 3;
  const pool = VIDEOS[tpl.vid] || [];
  const vids = pool.filter(v => v.band === band);

  return {
    day, week, weekInPhase, phase, isDeload, variant,
    cat, name: tpl.name, intent: tpl.intent,
    strength: !!useStrength, short: !!opts.short,
    items: best.items, minutes: Math.round(best.seconds / 60), seconds: best.seconds,
    mainSets: best.mainSets, doseMul: best.mul,
    window: [Math.round(floor / 60), Math.round(budget / 60)],
    videos: vids.length ? vids : pool.slice(0, 2),
    measures: !!tpl.measures, dpTest: day === 1,
  };
}

/* --- Measurements tracked ------------------------------------------------ */

const MEASURES = [
  { id: 'toeTouch', n: 'Toe-touch gap', unit: 'cm', hint: 'Feet together, hinge forward with knees straight and soft. Measure fingertips to floor. Above the floor is positive, past it is negative.', better: 'down', baseline: 25 },
  { id: 'slrLeft', n: 'Straight-leg raise, left', unit: '°', hint: 'On your back, lift the straight leg as high as it goes with the other leg flat. Estimate the angle from the floor. This is your sciatic side.', better: 'up', baseline: 45 },
  { id: 'slrRight', n: 'Straight-leg raise, right', unit: '°', hint: 'Same on the other side. The gap between the two sides matters as much as either number.', better: 'up', baseline: 55 },
  { id: 'shoulder', n: 'Wall shoulder flexion', unit: 'cm', hint: 'Back flat against the wall, arms straight overhead. Measure the gap from wrists to wall. Zero is full range.', better: 'down', baseline: 12 },
  { id: 'ankleL', n: 'Knee-to-wall, left', unit: 'cm', hint: 'Heel down, knee touches the wall. Measure big toe to wall at the furthest point that still works.', better: 'up', baseline: 5 },
  { id: 'ankleR', n: 'Knee-to-wall, right', unit: 'cm', hint: 'Same on the right.', better: 'up', baseline: 5 },
  { id: 'squat', n: 'Deep squat depth', unit: '/5', hint: '1 = cannot squat below halfway. 3 = thighs parallel, heels down. 5 = full deep squat, heels flat, chest up.', better: 'up', baseline: 2 },
  { id: 'strap', n: 'Strap pass-through width', unit: 'cm', hint: 'Narrowest hand spacing you can pass behind you without pain. Measure between hands.', better: 'down', baseline: 110 },
];

const RADIATION = [
  { v: 0, n: 'Nothing today' },
  { v: 1, n: 'Lower back only' },
  { v: 2, n: 'Into the glute' },
  { v: 3, n: 'Down the thigh' },
  { v: 4, n: 'Below the knee' },
];

const REDFLAGS = [
  'Numbness in the saddle area — inner thighs, groin, around the back passage',
  'Any change in bladder or bowel control',
  'Weakness that is getting worse, or a foot that catches or slaps when you walk',
  'Pain in both legs at once, newly',
  'Severe pain at night that wakes you and will not settle in any position',
  'Fever, unexplained weight loss, or a history of cancer alongside new back pain',
];
