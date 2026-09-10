import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
writeFileSync('assets/_shot.html',
  readFileSync('index.html','utf8')
    .replace('<style>','<style>\n'+readFileSync('src/fonts-inline.css','utf8')+'\n'));
const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--no-sandbox']});
for (const [n,w,dark] of [['wide',1750,false],['desktop',1280,false],['mobile',400,false],['dark',1440,true]]){
  const p = await b.newPage({viewport:{width:w,height:1000}, colorScheme:dark?'dark':'light'});
  await p.goto(pathToFileURL(resolve('assets/_shot.html')).href,{waitUntil:'load'});
  await p.waitForTimeout(600);
  const o=await p.evaluate(()=>({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,h:document.documentElement.scrollHeight}));
  console.log(n,w,o.sw>o.cw+1?'OVERFLOW':'ok','h='+o.h);
  await p.screenshot({path:`assets/_s-${n}.png`, fullPage:true});
  await p.close();
}
await b.close();
