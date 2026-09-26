/** Read-only checks against a running local Wrangler static-assets preview. */
import assert from 'node:assert/strict';
import { chromium, request } from '@playwright/test';
const base='http://127.0.0.1:8787';
const api=await request.newContext({baseURL:base});
const browser=await chromium.launch({channel:'chrome'});
try {
  const page=await browser.newPage({viewport:{width:1440,height:900}});
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('console',message=>{if(message.type()==='error')errors.push(message.text())});
  for(const path of ['/','/about/','/contact/','/cv/','/work/cyclointel/','/work/samenstad/','/work/positioning/']){
    const response=await page.goto(base+path);
    assert.equal(response.status(),200,path);
    assert.match(response.headers()['x-robots-tag'],/noindex/);
    assert.match(response.headers()['content-security-policy'],/script-src 'self' 'sha256-/);
    assert.equal(response.headers()['x-content-type-options'],'nosniff');
    if(path==='/')await page.waitForFunction(()=>document.documentElement.classList.contains('motion-ready'));
    if(path==='/contact/')assert.equal(await page.locator('button[type="submit"]').isEnabled(),true);
  }
  const missing=await api.get('/not-a-real-page/');assert.equal(missing.status(),404);
  const redirect=await api.get('/about?from=check',{maxRedirects:0});
  assert.equal(redirect.status(),307);assert.match(redirect.headers().location,/\/about\/\?from=check$/);
  assert.deepEqual(errors,[]);
  console.log('Local Worker: seven routes, CSP, security/search headers, scripts, 404, and path/query redirect passed. No cloud deployment performed.');
} finally {await browser.close();await api.dispose()}
