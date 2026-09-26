import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

// Preview-safe by default. Only an explicit production build enables indexing.
const production = process.argv.includes('--production');
const env = {
  ...process.env,
  ASTRO_TELEMETRY_DISABLED: '1',
  PUBLIC_SITE_ENV: production ? 'production' : 'preview',
};
const result = spawnSync(process.execPath, ['node_modules/astro/bin/astro.mjs', 'build'], {
  stdio: 'inherit',
  env,
});
if (result.status !== 0) process.exit(result.status || 1);

async function htmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((entry) =>
        entry.isDirectory()
          ? htmlFiles(join(dir, entry.name))
          : entry.name.endsWith('.html')
            ? [join(dir, entry.name)]
            : [],
      ),
    )
  ).flat();
}
const hashes = new Set();
for (const file of await htmlFiles('dist')) {
  const source = await readFile(file, 'utf8');
  for (const match of source.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (!/\bsrc=/.test(match[1]) && match[2])
      hashes.add(`'sha256-${createHash('sha256').update(match[2]).digest('base64')}'`);
  }
}
const csp = `default-src 'self'; script-src 'self' ${[...hashes].join(' ')}; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'none'`;
await writeFile(
  'dist/_headers',
  `/*\n  X-Content-Type-Options: nosniff\n  X-Frame-Options: DENY\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n  Content-Security-Policy: ${csp}\n${production ? '' : '  X-Robots-Tag: noindex, nofollow\n'}\n/_astro/*\n  Cache-Control: public, max-age=31536000, immutable\n\nhttps://:version.:subdomain.workers.dev/*\n  X-Robots-Tag: noindex, nofollow\n`,
);
console.log(
  `Built ${production ? 'PRODUCTION (indexing enabled)' : 'PREVIEW (search indexing disabled)'}. No deployment was performed.`,
);
