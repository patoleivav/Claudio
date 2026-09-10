import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

writeFileSync('assets/_shot.html',
  readFileSync('index.html','utf8')
    .replace('<style>', '<style>\n' + readFileSync('src/fonts-inline.css','utf8') + '\n'));

const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--no-sandbox']});
for (const [name,w,dark] of [['desktop',1280,false],['mobile',400,false],['dark',1280,true]]){
  const p = await b.newPage({viewport:{width:w,height:1000}, colorScheme: dark?'dark':'light'});
  await p.goto(pathToFileURL(resolve('assets/_shot.html')).href,{waitUntil:'load'});
  await p.waitForTimeout(600);
  const o = await p.evaluate(()=>({sw:document.documentElement.scrollWidth,
    cw:document.documentElement.clientWidth, h:document.documentElement.scrollHeight}));
  console.log(name, w, JSON.stringify(o), o.sw>o.cw+1?'OVERFLOW':'ok');
  await p.screenshot({path:`assets/_s-${name}.png`, fullPage:true});
  await p.close();
}
await b.close();
