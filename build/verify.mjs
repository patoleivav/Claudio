import { chromium } from 'playwright-core';
import { readFileSync } from 'node:fs';

const webm = `data:video/webm;base64,${readFileSync('assets/briefing.webm').toString('base64')}`;
const b = await chromium.launch({
  executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
const p = await b.newPage({viewport:{width:1360,height:960}});
await p.setContent(`<body style="margin:0;background:#fff">
  <video id=v width=1280 height=880 muted playsinline loop src="${webm}"></video>`);

const r = await p.evaluate(async () => {
  const v = document.getElementById('v');
  await new Promise(r => v.readyState>=1 ? r() : v.addEventListener('loadedmetadata', r, {once:true}));
  await v.play();
  const t0 = v.currentTime;
  await new Promise(r => setTimeout(r, 1500));
  return { duration:+v.duration.toFixed(2), w:v.videoWidth, h:v.videoHeight,
           advanced:+(v.currentTime-t0).toFixed(2), paused:v.paused };
});
console.log(r);

await p.evaluate(() => new Promise(r => {
  const v = document.getElementById('v');
  v.pause(); v.addEventListener('seeked', r, {once:true}); v.currentTime = 12.0;
}));
await p.locator('#v').screenshot({ path:'assets/_playback.png' });
await b.close();
console.log(r.advanced > 0.5 && r.w === 1280
  ? 'PASS — inlined data-URI video decodes, plays and seeks'
  : 'FAIL');
