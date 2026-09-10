import { chromium } from 'playwright-core';
import { mkdirSync, rmSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const FPS = 25, W = 1280, H = 880;
const OUT = 'assets/frames';
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--no-sandbox', '--force-color-profile=srgb', '--font-render-hinting=none']
});
const page = await browser.newPage({
  viewport: { width: W, height: H },
  deviceScaleFactor: 2,          // render at 2x, downscale later — keeps text crisp
  colorScheme: 'light'
});
await page.goto(pathToFileURL(resolve('src/animation.html')).href, { waitUntil: 'load' });
await page.waitForFunction(() => typeof window.seek === 'function');

const duration = await page.evaluate(() => window.DURATION);
const total = Math.round(duration * FPS);
process.stdout.write(`rendering ${total} frames @ ${FPS}fps (${duration}s) at ${W*2}x${H*2}\n`);

for (let i = 0; i < total; i++) {
  await page.evaluate(t => window.seek(t), i / FPS);
  await page.screenshot({
    path: `${OUT}/${String(i).padStart(4, '0')}.png`,
    animations: 'disabled'
  });
  if (i % 50 === 0) process.stdout.write(`  ${i}/${total}\n`);
}
await browser.close();
process.stdout.write(`done: ${total} frames\n`);
