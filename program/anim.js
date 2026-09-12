/* ============================================================================
   Figure engine
   ----------------------------------------------------------------------------
   One skeleton, drawn from absolute segment angles, so a movement demo costs a
   line of data instead of a hand-drawn frame. Angles are degrees on the maths
   circle with screen-y flipped: 90 is up, 0 is to the right, -90 is down.

   POSES   named angle sets
   figure  renders a pose (or loops through several) into an <svg>
   Props come from the exercise's own prop list — no pose has to declare them.
   ========================================================================= */

const SEG = { spineLow: 30, spineUp: 16, neck: 13, head: 7, armU: 21, armF: 20, thigh: 27, shin: 25, foot: 11 };

const BASE = {
  sl: 90, su: 90, nk: 90,          // pelvis->chest, chest->neck, neck->head
  au: [-80, -80], af: [-85, -85],  // upper arm, forearm  [near side, far side]
  th: [-83, -97], sh: [-91, -86], ft: [8, 2], // thigh, shin, foot
  flip: false,                      // mirror horizontally
};
const p = (o) => Object.assign({}, BASE, o);
const from = (b, o) => Object.assign({}, b, o);

/* --- lying on the back: spine points right, legs point left --------------- */
const SUPINE_LONG = p({ sl: 0, su: 0, nk: 0, au: [148, 152], af: [208, 212], th: [180, 180], sh: [178, 182], ft: [200, 204] });
const SUPINE_KNEES = from(SUPINE_LONG, { th: [150, 152], sh: [225, 223], ft: [180, 180] });

/* --- face down ------------------------------------------------------------ */
const PRONE_LONG = p({ sl: 0, su: 0, nk: 10, au: [196, 200], af: [166, 170], th: [180, 180], sh: [180, 180], ft: [170, 170] });

/* --- hands and knees ----------------------------------------------------- */
const QUAD = p({ sl: 5, su: 5, nk: -5, au: [-88, -84], af: [-90, -90], th: [-175, -175], sh: [-95, -95], ft: [175, 175] });

/* --- upright ------------------------------------------------------------- */
const STAND = p({});
const SIT = p({ sl: 88, su: 88, nk: 88, au: [-60, -64], af: [-30, -34], th: [2, 4], sh: [0, 2], ft: [50, 50] });
const SIDE = p({ sl: 4, su: 4, nk: 4, au: [-40, 8], af: [-4, 10], th: [188, 176], sh: [188, 176], ft: [208, 196] });
const KNEEL = p({ th: [-90, -90], sh: [-178, -178], ft: [150, 150] });
const PLANK = p({ sl: 6, su: 6, nk: 0, au: [-92, -88], af: [-92, -90], th: [184, 184], sh: [182, 182], ft: [150, 150] });

const POSES = {

/* ---- opening ritual ---------------------------------------------------- */
supineKnees: SUPINE_KNEES,
supine: SUPINE_LONG,
tiltPost: from(SUPINE_KNEES, { sl: -6, su: 2 }),
tiltAnt: from(SUPINE_KNEES, { sl: 8, su: -2 }),
standing: STAND,
seated: SIT,
hipCarA: from(STAND, { th: [-40, -90], sh: [-70, -90], ft: [10, 0], au: [-40, -80], af: [-20, -85] }),
hipCarB: from(STAND, { th: [-118, -90], sh: [-108, -90], ft: [-20, 0], au: [-40, -80], af: [-20, -85] }),
shCarA: from(STAND, { au: [30, -82], af: [50, -86] }),
shCarB: from(STAND, { au: [140, -82], af: [150, -86] }),
neckA: from(SIT, { nk: 74, su: 86 }),
neckB: from(SIT, { nk: 106, su: 90 }),
ankCarA: from(SIT, { ft: [80, 50] }),
ankCarB: from(SIT, { ft: [10, 50] }),

/* ---- spine, nerve, deep core ------------------------------------------ */
prone: PRONE_LONG,
sphinxLow: from(PRONE_LONG, { sl: 12, su: 34, nk: 30, au: [-78, -74], af: [12, 16] }),
pressUpTop: from(PRONE_LONG, { sl: 20, su: 54, nk: 46, au: [-86, -82], af: [-88, -86] }),
quadruped: QUAD,
catUp: from(QUAD, { sl: 24, su: 30, nk: -34, th: [-168, -168] }),
catDown: from(QUAD, { sl: -12, su: -14, nk: 26, th: [-182, -182] }),
seatedSlide: from(SIT, { sl: 80, su: 76, nk: 70, th: [-10, 2], sh: [-70, 0], ft: [40, 50] }),
slideA: from(SIT, { sl: 78, su: 72, nk: 108, th: [-6, 2], sh: [-6, -64], ft: [-30, 40] }),
slideB: from(SIT, { sl: 80, su: 74, nk: 44, th: [-8, 2], sh: [-72, -60], ft: [70, 40] }),
deadbug: from(SUPINE_LONG, { th: [96, 92], sh: [176, 172], au: [8, 4], af: [6, 2] }),
deadbugA: from(SUPINE_LONG, { th: [96, 150], sh: [176, 200], au: [8, 168], af: [6, 172] }),
deadbugB: from(SUPINE_LONG, { th: [150, 92], sh: [200, 172], au: [168, 4], af: [172, 2] }),
toeTapA: from(SUPINE_LONG, { th: [96, 120], sh: [176, 215], au: [170, 174], af: [174, 176] }),
toeTapB: from(SUPINE_LONG, { th: [120, 96], sh: [215, 176], au: [170, 174], af: [174, 176] }),
slsA: from(SUPINE_LONG, { th: [112, 168], sh: [190, 176], au: [120, 130], af: [150, 158] }),
slsB: from(SUPINE_LONG, { th: [168, 112], sh: [176, 190], au: [130, 120], af: [158, 150] }),
birddogA: from(QUAD, { au: [8, -84], af: [6, -90], th: [-175, -100], sh: [-95, -96], ft: [175, 160] }),
birddogB: from(QUAD, { au: [-84, 8], af: [-90, 6], th: [-100, -175], sh: [-96, -95], ft: [160, 175] }),
curlup: from(SUPINE_KNEES, { su: 16, nk: 22, au: [150, 154], af: [124, 128], th: [150, 178], sh: [226, 180], ft: [180, 198] }),
sidePlank: p({ sl: 6, su: 6, nk: 4, au: [-88, 86], af: [-90, 88], th: [186, 182], sh: [190, 186], ft: [210, 206] }),
bridge: SUPINE_KNEES,
bridgeTop: from(SUPINE_KNEES, { sl: 26, su: 20, nk: 6, th: [130, 132], sh: [235, 233] }),
figure4: from(SUPINE_LONG, { th: [116, 150], sh: [186, 232], ft: [200, 180], au: [140, 146], af: [128, 134] }),
twist: from(SUPINE_LONG, { sl: 4, su: -6, nk: 8, th: [148, 176], sh: [212, 180], au: [150, 20], af: [140, 8] }),
childs: p({ sl: 2, su: 6, nk: -2, au: [14, 18], af: [-6, -2], th: [-172, -180], sh: [-108, -114], ft: [164, 168] }),
halfKneel: p({ th: [-90, -168], sh: [-176, -96], ft: [140, 172], au: [-70, -74], af: [-40, -44] }),
pallofA: from(p({ th: [-90, -168], sh: [-176, -96], ft: [140, 172] }), { au: [-40, -44], af: [10, 6] }),
pallofB: from(p({ th: [-90, -168], sh: [-176, -96], ft: [140, 172] }), { au: [-20, -24], af: [-2, -6] }),
carry: from(STAND, { au: [-86, -86], af: [-90, -90] }),

/* ---- hips, hamstrings, adductors --------------------------------------- */
strapHam: from(SUPINE_LONG, { th: [70, 178], sh: [78, 178], ft: [110, 196], au: [64, 170], af: [66, 174] }),
halfKneelStretch: p({ sl: 96, su: 96, nk: 94, th: [-72, -164], sh: [-144, -100], ft: [176, 168], au: [-74, 96], af: [-50, 100] }),
ninetyNinety: p({ sl: 86, su: 86, nk: 86, th: [8, 172], sh: [-60, -108], ft: [30, 150], au: [-58, -62], af: [-40, -44] }),
n90A: from(p({ sl: 86, su: 86, nk: 86 }), { th: [40, 140], sh: [-30, -140], ft: [30, 150], au: [-58, -62], af: [-30, -34] }),
n90B: from(p({ sl: 86, su: 86, nk: 86 }), { th: [172, 8], sh: [-108, -60], ft: [150, 30], au: [-58, -62], af: [-30, -34] }),
n90Lean: p({ sl: 40, su: 30, nk: 20, th: [8, 172], sh: [-60, -108], ft: [30, 150], au: [-20, -24], af: [-10, -14] }),
adductorRock: from(QUAD, { th: [-175, -140], sh: [-95, -140], ft: [175, 160] }),
adRockA: from(QUAD, { sl: 8, th: [-172, -138], sh: [-92, -140], ft: [175, 160] }),
adRockB: from(QUAD, { sl: -4, su: 0, th: [-186, -146], sh: [-108, -146], ft: [172, 158] }),
frog: from(QUAD, { sl: 2, su: 4, nk: -4, au: [8, 12], af: [-6, -2], th: [-140, -164], sh: [-162, -136], ft: [176, 180] }),
lowLunge: p({ sl: 84, su: 84, nk: 82, th: [-34, -170], sh: [-104, -96], ft: [8, 166], au: [-80, -84], af: [-86, -90] }),
halfSplit: p({ sl: 44, su: 40, nk: 34, th: [-14, -170], sh: [-14, -96], ft: [50, 166], au: [-70, -74], af: [-84, -88] }),
cossack: p({ sl: 80, su: 80, nk: 78, th: [-46, -6], sh: [-120, -4], ft: [10, 44], au: [-30, -34], af: [-14, -18] }),
cossackA: from(p({ sl: 84, su: 84 }), { th: [-70, -110], sh: [-96, -84], ft: [0, 0], au: [-40, -44], af: [-20, -24] }),
cossackB: p({ sl: 78, su: 78, nk: 76, th: [-44, -4], sh: [-124, -2], ft: [12, 46], au: [-26, -30], af: [-10, -14] }),
benchHamEcc: p({ sl: 90, su: 90, nk: 88, th: [-16, -30], sh: [-52, -84], ft: [30, 10], au: [-66, -70], af: [-30, -34] }),
pigeon: p({ sl: 26, su: 22, nk: 14, th: [-12, -176], sh: [-64, -172], ft: [40, 160], au: [-16, -20], af: [-6, -10] }),
happyBaby: from(SUPINE_LONG, { th: [104, 128], sh: [154, 178], ft: [130, 150], au: [120, 132], af: [140, 152] }),
sideLying: SIDE,
sideLegA: from(SIDE, { th: [186, 178], sh: [186, 178] }),
sideLegB: from(SIDE, { th: [186, 152], sh: [186, 152] }),
clamA: from(SIDE, { th: [200, 196], sh: [250, 246] }),
clamB: from(SIDE, { th: [200, 168], sh: [250, 232] }),
sideKickA: from(SIDE, { th: [186, 150], sh: [186, 150] }),
sideKickB: from(SIDE, { th: [186, 208], sh: [186, 208] }),
hipThrust: p({ sl: 18, su: 16, nk: 6, au: [-60, -56], af: [-20, -16], th: [144, 146], sh: [238, 236], ft: [186, 186] }),
thrustA: p({ sl: -4, su: 6, nk: 2, au: [-60, -56], af: [-20, -16], th: [156, 158], sh: [244, 242], ft: [186, 186] }),
thrustB: p({ sl: 22, su: 18, nk: 6, au: [-60, -56], af: [-20, -16], th: [140, 142], sh: [236, 234], ft: [186, 186] }),

/* ---- Pilates ----------------------------------------------------------- */
proneSwim: from(PRONE_LONG, { au: [14, 10], af: [12, 8], th: [180, 180] }),
swimA: from(PRONE_LONG, { au: [18, 4], af: [16, 2], th: [186, 172], sh: [184, 172], nk: 6 }),
swimB: from(PRONE_LONG, { au: [4, 18], af: [2, 16], th: [172, 186], sh: [172, 184], nk: 6 }),
mermaid: p({ sl: 70, su: 62, nk: 56, th: [-6, 14], sh: [-66, -58], ft: [40, 60], au: [30, -80], af: [46, -60] }),
plank: PLANK,
scapA: from(PLANK, { sl: 8, su: 10, nk: -4 }),
scapB: from(PLANK, { sl: 2, su: 0, nk: 4 }),
wallRoll: from(STAND, { sl: 88, su: 88, nk: 88, au: [-84, -86], af: [-88, -90] }),
wallRollA: from(STAND, { sl: 88, su: 80, nk: 60, au: [-86, -88], af: [-88, -90] }),
wallRollB: from(STAND, { sl: 70, su: 40, nk: 10, au: [-86, -88], af: [-88, -90] }),

/* ---- shoulders, chest, lats, arms -------------------------------------- */
wallSlide: from(STAND, { au: [-10, -6], af: [60, 64] }),
wallSlideA: from(STAND, { au: [-14, -10], af: [56, 60] }),
wallSlideB: from(STAND, { au: [76, 80], af: [84, 88] }),
angelA: from(STAND, { au: [10, 14], af: [70, 74] }),
angelB: from(STAND, { au: [66, 70], af: [88, 92] }),
doorway: from(STAND, { su: 84, nk: 80, au: [10, -80], af: [66, -84] }),
strapPass: from(STAND, { au: [-30, -34], af: [-34, -38] }),
passA: from(STAND, { au: [-30, -34], af: [-34, -38] }),
passB: from(STAND, { au: [130, 134], af: [136, 140] }),
latStretch: p({ sl: 20, su: 24, nk: 10, au: [8, 12], af: [4, 8], th: [-176, -176], sh: [-104, -104], ft: [168, 168] }),
wristSeq: from(QUAD, { sl: 6, su: 6, au: [-96, -92], af: [-96, -94] }),
proneYTW: from(PRONE_LONG, { sl: 6, su: 10, nk: 8, au: [-20, -16], af: [-40, -36] }),
ytwA: from(PRONE_LONG, { sl: 6, su: 10, nk: 8, au: [24, 20], af: [22, 18] }),
ytwB: from(PRONE_LONG, { sl: 6, su: 10, nk: 8, au: [-50, -46], af: [-70, -66] }),
threadNeedle: from(QUAD, { sl: 6, su: 0, nk: -20, au: [-150, -70], af: [-170, -80] }),
puppy: p({ sl: 6, su: 14, nk: 0, au: [10, 14], af: [6, 10], th: [-172, -172], sh: [-94, -94], ft: [172, 172] }),
benchRow: p({ sl: 8, su: 10, nk: 4, au: [-88, -70], af: [-90, -40], th: [-160, -110], sh: [-100, -90], ft: [168, 0] }),
incline: p({ sl: 40, su: 40, nk: 38, au: [-40, -44], af: [30, 26], th: [-20, -18], sh: [-84, -82], ft: [10, 12] }),
pullover: from(SUPINE_LONG, { th: [150, 152], sh: [225, 223], ft: [180, 180], au: [40, 44], af: [30, 34] }),
extRot: from(SIDE, { au: [-84, -80], af: [-10, 40] }),
extRotA: from(SIDE, { au: [-84, -78], af: [-6, -4] }),
extRotB: from(SIDE, { au: [-84, -78], af: [-6, 80] }),
floorPress: from(SUPINE_KNEES, { au: [20, 24], af: [80, 84] }),
ohp: p({ sl: 88, su: 88, nk: 88, au: [40, 44], af: [80, 84], th: [-4, -2], sh: [-86, -84], ft: [6, 8] }),
curl: from(STAND, { au: [-84, -80], af: [-84, -80] }),
curlA: from(STAND, { au: [-84, -80], af: [-86, -82] }),
curlB: from(STAND, { au: [-80, -76], af: [10, 14] }),

/* ---- yoga -------------------------------------------------------------- */
sunSalute: from(STAND, { au: [86, 90], af: [88, 92] }),
saluteA: from(STAND, { au: [86, 90], af: [88, 92] }),
saluteB: p({ sl: 30, su: 26, nk: 14, au: [-70, -74], af: [-86, -88], th: [-96, -96], sh: [-92, -92], ft: [4, 4] }),
downdog: p({ sl: -30, su: -26, nk: -30, au: [-142, -138], af: [-140, -136], th: [-46, -46], sh: [-76, -76], ft: [-10, -8] }),
warrior1: p({ sl: 92, su: 92, nk: 92, th: [-46, -150], sh: [-104, -158], ft: [6, 148], au: [80, 84], af: [86, 90] }),
warrior2: p({ sl: 90, su: 90, nk: 78, th: [-42, -140], sh: [-108, -146], ft: [8, 160], au: [2, 178], af: [0, 180] }),
triangle: p({ sl: 30, su: 28, nk: 40, th: [-36, -146], sh: [-40, -150], ft: [30, 170], au: [-56, 120], af: [-60, 124] }),
chairPose: p({ sl: 70, su: 72, nk: 70, th: [-24, -22], sh: [-96, -94], ft: [16, 18], au: [30, 34], af: [46, 50] }),
tree: from(STAND, { th: [-90, -30], sh: [-90, -150], ft: [0, 120], au: [70, 74], af: [82, 86] }),
malasana: p({ sl: 74, su: 76, nk: 74, th: [-16, -14], sh: [-128, -126], ft: [26, 28], au: [-30, -34], af: [30, 26] }),
gate: p({ sl: 62, su: 54, nk: 46, th: [-88, 2], sh: [-174, 0], ft: [146, 50], au: [26, -76], af: [40, -50] }),
seatedTwist: p({ sl: 86, su: 80, nk: 66, th: [6, 158], sh: [-74, -110], ft: [40, 140], au: [-4, 150], af: [-30, 140] }),

/* ---- lower leg, feet, squat -------------------------------------------- */
ankleWall: p({ sl: 84, su: 84, nk: 82, th: [-52, -120], sh: [-106, -92], ft: [10, 4], au: [-16, -20], af: [-4, -8] }),
calfStretch: p({ sl: 80, su: 80, nk: 78, th: [-84, -122], sh: [-88, -126], ft: [4, -16], au: [-8, -12], af: [4, 0] }),
calfRaise: from(STAND, { ft: [40, 40], au: [-16, -20], af: [-4, -8] }),
calfA: from(STAND, { ft: [4, 4], au: [-16, -20], af: [-4, -8] }),
calfB: from(STAND, { ft: [46, 46], au: [-16, -20], af: [-4, -8], th: [-88, -88] }),
tibRaise: from(STAND, { ft: [-30, -30], au: [-86, -88], af: [-88, -90] }),
tibA: from(STAND, { ft: [2, 2], au: [-86, -88], af: [-88, -90] }),
tibB: from(STAND, { ft: [-34, -34], au: [-86, -88], af: [-88, -90] }),
footBall: from(STAND, { th: [-90, -84], sh: [-90, -96], ft: [20, -6], au: [-70, -74], af: [-50, -54] }),
deepSquat: p({ sl: 76, su: 78, nk: 76, th: [-14, -12], sh: [-130, -128], ft: [24, 26], au: [-44, -48], af: [10, 6] }),
pryA: p({ sl: 78, su: 80, nk: 78, th: [-16, -10], sh: [-126, -132], ft: [22, 28], au: [-44, -48], af: [10, 6] }),
pryB: p({ sl: 70, su: 74, nk: 72, th: [-4, -24], sh: [-140, -120], ft: [34, 18], au: [-44, -48], af: [10, 6] }),
stepUp: p({ sl: 88, su: 88, nk: 86, th: [-40, -110], sh: [-100, -92], ft: [6, 0], au: [-84, -86], af: [-88, -90] }),
splitSquat: p({ sl: 90, su: 90, nk: 88, th: [-56, -128], sh: [-118, -88], ft: [4, 40], au: [-86, -88], af: [-90, -92] }),
gobletSquat: p({ sl: 80, su: 82, nk: 80, th: [-26, -24], sh: [-114, -112], ft: [14, 16], au: [-58, -62], af: [16, 12] }),
rdl: p({ sl: 34, su: 32, nk: 26, th: [-98, -96], sh: [-86, -84], ft: [2, 4], au: [-88, -90], af: [-90, -92] }),
rdlA: from(STAND, { au: [-86, -88], af: [-90, -92] }),
rdlB: p({ sl: 22, su: 20, nk: 14, th: [-100, -98], sh: [-84, -82], ft: [2, 4], au: [-88, -90], af: [-90, -92] }),

/* ---- mid-back, neck, rotation ----------------------------------------- */
openBook: from(SIDE, { au: [-6, -4], af: [-2, 0] }),
obA: from(SIDE, { au: [-6, -4], af: [-2, 0] }),
obB: from(SIDE, { su: 12, nk: 30, au: [-6, 170], af: [-2, 174] }),
rollerExt: p({ sl: 6, su: -14, nk: -30, au: [140, 144], af: [110, 114], th: [150, 152], sh: [225, 223], ft: [180, 180] }),
quadRot: from(QUAD, { su: 20, nk: 40, au: [-88, 150], af: [-90, 120] }),
qrA: from(QUAD, { su: -10, nk: -30, au: [-88, -130], af: [-90, -160] }),
qrB: from(QUAD, { su: 24, nk: 50, au: [-88, 140], af: [-90, 110] }),
sideBend: from(STAND, { sl: 74, su: 66, nk: 60, au: [46, -84], af: [60, -88] }),
sideRib: from(SIDE, { su: -6, au: [-30, 4], af: [-40, 2] }),

/* ---- restorative ------------------------------------------------------ */
legsUp: from(SUPINE_LONG, { th: [98, 92], sh: [94, 88], ft: [132, 126], au: [160, 164], af: [186, 190] }),
supBridge: from(SUPINE_LONG, { sl: 10, su: 6, nk: 0, th: [172, 174], sh: [178, 180], ft: [200, 200], au: [158, 162], af: [164, 168] }),
butterfly: from(SUPINE_LONG, { th: [146, 152], sh: [212, 206], ft: [180, 180], au: [158, 162], af: [166, 170] }),
savasana: from(SUPINE_LONG, { au: [162, 166], af: [168, 172], ft: [204, 204] }),
gluteBall: from(SIT, { sl: 84, su: 80, nk: 76, th: [10, 150], sh: [-56, -116], ft: [36, 146], au: [-30, -34], af: [-14, -18] }),
rollerQuad: from(PRONE_LONG, { sl: 4, su: 12, nk: 14, au: [-70, -66], af: [10, 14] }),
legsBench: from(SUPINE_LONG, { th: [138, 144], sh: [184, 188], ft: [208, 212], au: [158, 162], af: [188, 192] }),
};

/* --- forward kinematics --------------------------------------------------- */

function jointsFor(pose) {
  const rad = (a) => (a * Math.PI) / 180;
  const step = (pt, ang, len) => ({ x: pt.x + Math.cos(rad(ang)) * len, y: pt.y - Math.sin(rad(ang)) * len });
  const hip = { x: 0, y: 0 };
  const chest = step(hip, pose.sl, SEG.spineLow);
  const neck = step(chest, pose.su, SEG.spineUp);
  const head = step(neck, pose.nk, SEG.neck);
  const arms = [0, 1].map(i => {
    const sh = step(chest, pose.su, SEG.spineUp * 0.25);
    const el = step(sh, pose.au[i], SEG.armU);
    return { sh, el, hand: step(el, pose.af[i], SEG.armF) };
  });
  const legs = [0, 1].map(i => {
    const kn = step(hip, pose.th[i], SEG.thigh);
    const an = step(kn, pose.sh[i], SEG.shin);
    return { kn, an, toe: step(an, pose.ft[i], SEG.foot) };
  });
  return { hip, chest, neck, head, arms, legs };
}

function lerpPose(a, b, t) {
  const out = {};
  for (const k of ['sl', 'su', 'nk']) out[k] = a[k] + (b[k] - a[k]) * t;
  for (const k of ['au', 'af', 'th', 'sh', 'ft']) {
    out[k] = [0, 1].map(i => a[k][i] + (b[k][i] - a[k][i]) * t);
  }
  out.flip = a.flip;
  return out;
}

/* --- drawing ------------------------------------------------------------- */

const NS = 'http://www.w3.org/2000/svg';
const el = (n, at) => { const e = document.createElementNS(NS, n); for (const k in at) e.setAttribute(k, at[k]); return e; };

/** Render one figure into an svg element. props is the exercise's prop list. */
function drawFigure(svg, pose, props) {
  const j = jointsFor(pose);
  const all = [j.hip, j.chest, j.neck, j.head, ...j.arms.flatMap(a => [a.sh, a.el, a.hand]), ...j.legs.flatMap(l => [l.kn, l.an, l.toe])];
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const pt of all) { minX = Math.min(minX, pt.x); maxX = Math.max(maxX, pt.x); minY = Math.min(minY, pt.y); maxY = Math.max(maxY, pt.y); }
  minY -= SEG.head; maxY += 2; minX -= SEG.head; maxX += SEG.head;

  const W = 200, H = 132, PAD = 18;
  const s = Math.min((W - PAD * 2) / (maxX - minX), (H - PAD * 2 - 10) / (maxY - minY));
  const ox = PAD + ((W - PAD * 2) - (maxX - minX) * s) / 2 - minX * s;
  const oy = PAD + ((H - PAD * 2 - 10) - (maxY - minY) * s) / 2 - minY * s;
  /* Far-side limbs are nudged sideways so a side-on figure reads as a body
     with depth rather than a flat line with both legs exactly on top. */
  const T = (pt, far) => {
    const x = ox + pt.x * s + (far ? 3.5 : 0), y = oy + pt.y * s - (far ? 1.5 : 0);
    return pose.flip ? { x: W - x, y } : { x, y };
  };
  const floorY = oy + maxY * s + 3;

  while (svg.firstChild) svg.removeChild(svg.firstChild);
  svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
  const g = el('g', {});
  svg.appendChild(g);
  const has = (k) => props && props.indexOf(k) >= 0;

  /* ground and equipment, behind the figure */
  g.appendChild(el('line', { x1: 8, y1: floorY, x2: W - 8, y2: floorY, class: 'fig-floor' }));
  if (has('wall')) {
    const wx = pose.flip ? W - 10 : 10;
    g.appendChild(el('line', { x1: wx, y1: 12, x2: wx, y2: floorY, class: 'fig-prop' }));
  }
  if (has('bench')) {
    const lo = T(j.legs[0].an), hi = T(j.chest);
    const x1 = Math.min(lo.x, hi.x) - 6, x2 = Math.max(lo.x, hi.x) + 6;
    const y = Math.min(lo.y, hi.y, floorY - 8);
    g.appendChild(el('rect', { x: x1, y: y, width: Math.max(30, x2 - x1), height: 5, rx: 2, class: 'fig-prop-fill' }));
  }
  if (has('blocks')) {
    for (const h of j.arms.map(a => T(a.hand))) {
      if (h.y > floorY - 26) g.appendChild(el('rect', { x: h.x - 7, y: h.y + 1, width: 14, height: Math.max(4, floorY - h.y - 1), rx: 1.5, class: 'fig-prop-fill' }));
    }
  }
  if (has('roller')) {
    const c = T(j.chest);
    g.appendChild(el('circle', { cx: c.x, cy: floorY - 7, r: 7, class: 'fig-prop' }));
  }
  if (has('ball')) {
    const c = T(j.legs[0].toe);
    g.appendChild(el('circle', { cx: c.x, cy: floorY - 4, r: 4, class: 'fig-prop-fill' }));
  }
  if (has('chair')) {
    g.appendChild(el('rect', { x: pose.flip ? W - 48 : 14, y: floorY - 26, width: 34, height: 4, rx: 1.5, class: 'fig-prop-fill' }));
  }
  if (has('strap')) {
    /* Held in both hands overhead (pass-throughs) or looped hand-to-foot
       (supine hamstring) — the pose itself says which. */
    const bothUp = j.arms[0].hand.y < j.hip.y - 4 && j.arms[1].hand.y < j.hip.y - 4;
    const A = T(j.arms[0].hand);
    const B = bothUp ? T(j.arms[1].hand, true) : T(j.legs[0].toe);
    g.appendChild(el('line', { x1: A.x, y1: A.y, x2: B.x, y2: B.y, class: 'fig-prop' }));
  }

  /* far-side limbs, then torso, then near-side limbs */
  /* Stroke weight tracks the drawing scale so a wide lying figure and a tall
     standing one read as the same body rather than two different line weights. */
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const wLimb = clamp(4.4 * (s / 1.5), 3, 5.6).toFixed(2);
  const wTorso = clamp(7.4 * (s / 1.5), 5, 9.4).toFixed(2);
  const limb = (a, b, c, cls) => {
    const far = cls.indexOf('fig-far') >= 0;
    const A = T(a, far), B = T(b, far), C = T(c, far);
    g.appendChild(el('path', { d: `M${A.x} ${A.y}L${B.x} ${B.y}L${C.x} ${C.y}`, class: cls, 'stroke-width': wLimb }));
  };
  limb(j.arms[1].sh, j.arms[1].el, j.arms[1].hand, 'fig-limb fig-far');
  limb(j.hip, j.legs[1].kn, j.legs[1].an, 'fig-limb fig-far');
  const f1 = T(j.legs[1].an, true), t1 = T(j.legs[1].toe, true);
  g.appendChild(el('line', { x1: f1.x, y1: f1.y, x2: t1.x, y2: t1.y, class: 'fig-foot fig-far', 'stroke-width': wLimb }));

  const H1 = T(j.hip), C1 = T(j.chest), N1 = T(j.neck);
  g.appendChild(el('path', { d: `M${H1.x} ${H1.y}L${C1.x} ${C1.y}L${N1.x} ${N1.y}`, class: 'fig-torso', 'stroke-width': wTorso }));
  const hd = T(j.head);
  g.appendChild(el('circle', { cx: hd.x, cy: hd.y, r: clamp(SEG.head * s, 6, 10.5).toFixed(2), class: 'fig-head' }));

  limb(j.hip, j.legs[0].kn, j.legs[0].an, 'fig-limb');
  const f0 = T(j.legs[0].an), t0 = T(j.legs[0].toe);
  g.appendChild(el('line', { x1: f0.x, y1: f0.y, x2: t0.x, y2: t0.y, class: 'fig-foot', 'stroke-width': wLimb }));
  limb(j.arms[0].sh, j.arms[0].el, j.arms[0].hand, 'fig-limb');

  if (has('dumbbell')) {
    for (const a of j.arms) {
      const h = T(a.hand);
      g.appendChild(el('rect', { x: h.x - 5, y: h.y - 2.5, width: 10, height: 5, rx: 2, class: 'fig-weight' }));
    }
  }
}

/** Animate an svg through a list of pose keys, ping-pong, ~3.4s a cycle.
 *  Returns a stop function. Honours prefers-reduced-motion by holding still. */
function animateFigure(svg, poseKeys, props, opts) {
  opts = opts || {};
  const keys = (poseKeys || []).filter(k => POSES[k]);
  /* Held still (reduced motion), show the middle of the movement — it reads
     more like the exercise than either endpoint does. */
  const still = () => drawFigure(svg, POSES[keys[Math.floor(keys.length / 2)]] || POSES[keys[0]] || POSES.standing, props);
  if (keys.length < 2) { still(); return () => {}; }
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced && !opts.force) { still(); return () => {}; }

  const seq = keys.length === 2 ? [keys[0], keys[1]] : keys;
  const period = opts.period || 3400;
  let raf = 0, t0 = 0, live = true;
  const ease = (t) => 0.5 - 0.5 * Math.cos(Math.PI * t);
  const frame = (now) => {
    if (!live) return;
    if (!t0) t0 = now;
    const cycle = ((now - t0) % (period * 2)) / period;      // 0..2
    const tri = cycle <= 1 ? cycle : 2 - cycle;               // ping-pong
    const span = seq.length - 1;
    const at = tri * span;
    const i = Math.min(span - 1, Math.floor(at));
    drawFigure(svg, lerpPose(POSES[seq[i]], POSES[seq[i + 1]], ease(at - i)), props);
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
  return () => { live = false; cancelAnimationFrame(raf); };
}
