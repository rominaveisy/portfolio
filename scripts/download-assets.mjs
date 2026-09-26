/** Copies only the approved Figma assets listed by import-design.mjs. */
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { dirname } from 'node:path';
const assets = JSON.parse(await readFile('.cache/figma/assets.json', 'utf8'));
let next = 0,
  done = 0;
async function worker() {
  while (next < assets.length) {
    const a = assets[next++];
    const dest = 'public' + a.path;
    if (
      await stat(dest)
        .then((x) => x.size > 0)
        .catch(() => false)
    ) {
      done++;
      continue;
    }
    if (!a.url.startsWith('https://www.figma.com/api/mcp/asset/'))
      throw Error('Unexpected asset origin');
    const r = await fetch(a.url, { signal: AbortSignal.timeout(60000) });
    if (!r.ok) throw Error(`${r.status}: ${a.path}`);
    const data = new Uint8Array(await r.arrayBuffer());
    if (data.length < 10) throw Error('Empty asset');
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, data);
    done++;
    console.log(`${done}/${assets.length} ${a.path}`);
  }
}
await Promise.all(Array.from({ length: 5 }, worker));
