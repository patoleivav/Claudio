import { readFileSync, writeFileSync } from 'node:fs';

const b64 = f => readFileSync(f).toString('base64');
const mp4    = `data:video/mp4;base64,${b64('assets/briefing.mp4')}`;
const webm   = `data:video/webm;base64,${b64('assets/briefing.webm')}`;
const poster = `data:image/png;base64,${b64('assets/poster.min.png')}`;

/* Ready-to-paste snippet for step 4 of the one-pager.
   MP4 first (Safari), WebM second. Plays on press — no autoplay,
   which sidesteps browser autoplay policy and reduced-motion at once. */
const snippet = `<figure class="step4-video">
  <video
    id="briefing"
    width="1280" height="690"
    muted playsinline loop controls preload="metadata"
    poster="${poster}"
    aria-describedby="briefing-alt">
    <source src="${mp4}" type="video/mp4">
    <source src="${webm}" type="video/webm">
  </video>
  <figcaption id="briefing-alt">
    Making the skill. You run the check by hand once, then ask Claude to save it as a
    weekday 7am routine. Claude captures the four steps you just used, notes where each
    one reads from, and saves it. Illustration; suppliers and orders are fictional.
  </figcaption>
</figure>`;

writeFileSync('assets/step4-video.html', snippet);

const kb = n => (n / 1024).toFixed(1) + ' KB';
console.log('mp4    ', kb(mp4.length), '(base64)');
console.log('webm   ', kb(webm.length), '(base64)');
console.log('poster ', kb(poster.length), '(base64)');
console.log('snippet', kb(snippet.length), 'total');
