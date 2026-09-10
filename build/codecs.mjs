import { chromium } from 'playwright-core';
const b = await chromium.launch({
  executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox']});
const p = await b.newPage();
console.log(await p.evaluate(() => {
  const v = document.createElement('video');
  return {
    h264: v.canPlayType('video/mp4; codecs="avc1.4D401E"') || '(none)',
    vp8:  v.canPlayType('video/webm; codecs="vp8"')        || '(none)',
    vp9:  v.canPlayType('video/webm; codecs="vp9"')        || '(none)'
  };
}));
await b.close();
