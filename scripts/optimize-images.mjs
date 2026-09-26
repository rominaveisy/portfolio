/** Lossless encoding only: preserves pixels and keeps source PNGs in .cache/originals.
 * One-time preparation; normal site builds use the checked-in public/images assets.
 */
import { readFile, writeFile, readdir, mkdir, rename } from 'node:fs/promises';
import { resolve, relative, dirname, join } from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const root = resolve('public/images');
async function files(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((e) => (e.isDirectory() ? files(join(dir, e.name)) : [join(dir, e.name)])),
    )
  ).flat();
}
const mappings = [],
  inventory = [];
// Recover completed conversions if an earlier run was interrupted.
for (const archived of await files(resolve('.cache/originals')).catch(() => [])) {
  const rel = relative(resolve('.cache/originals'), archived).replaceAll('\\', '/');
  const webp = join(root, rel.replace(/\.png$/, '.webp'));
  if (
    await readFile(webp)
      .then(() => true)
      .catch(() => false)
  )
    mappings.push(['/images/' + rel, '/images/' + rel.replace(/\.png$/, '.webp')]);
}
let before = 0,
  after = 0;
for (const file of await files(root)) {
  const original = await readFile(file);
  before += original.length;
  let dest = file,
    bytes = original;
  const originalMeta = await sharp(original).metadata();
  if (file.endsWith('.png') && originalMeta.format === 'jpeg') {
    dest = file.replace(/\.png$/, '.jpg');
    await rename(file, dest);
    mappings.push([
      '/images/' + relative(root, file).replaceAll('\\', '/'),
      '/images/' + relative(root, dest).replaceAll('\\', '/'),
    ]);
  } else if (file.endsWith('.png') && originalMeta.format === 'png') {
    const encoded = await sharp(original).webp({ lossless: true, effort: 5 }).toBuffer();
    if (encoded.length < original.length) {
      const digest = async (b) =>
        createHash('sha256')
          .update(await sharp(b).ensureAlpha().raw().toBuffer())
          .digest('hex');
      if ((await digest(original)) !== (await digest(encoded))) {
        console.log('Keeping original pixel data: ' + relative(root, file));
        after += original.length;
        inventory.push({
          path: '/images/' + relative(root, file).replaceAll('\\', '/'),
          width: originalMeta.width,
          height: originalMeta.height,
          bytes: original.length,
        });
        continue;
      }
      dest = file.replace(/\.png$/, '.webp');
      await writeFile(dest, encoded);
      bytes = encoded;
      const rel = relative(root, file);
      if (rel.startsWith('..')) throw Error('Asset outside expected directory');
      const archive = resolve('.cache/originals', rel);
      await mkdir(dirname(archive), { recursive: true });
      await rename(file, archive);
      mappings.push([
        '/images/' + rel.replaceAll('\\', '/'),
        '/images/' + relative(root, dest).replaceAll('\\', '/'),
      ]);
    }
  }
  const meta = await sharp(bytes).metadata();
  after += bytes.length;
  inventory.push({
    path: '/images/' + relative(root, dest).replaceAll('\\', '/'),
    width: meta.width,
    height: meta.height,
    bytes: bytes.length,
  });
}
for (const file of await files(resolve('src'))) {
  if (!/\.(astro|ts|css)$/.test(file)) continue;
  let source = await readFile(file, 'utf8');
  for (const [from, to] of mappings) source = source.replaceAll(from, to);
  await writeFile(file, source);
}
await writeFile('src/data/assets.json', JSON.stringify(inventory, null, 2) + '\n');
console.log(
  `${mappings.length} images losslessly encoded. ${(before / 1e6).toFixed(2)} MB → ${(after / 1e6).toFixed(2)} MB. Original PNGs retained in .cache/originals.`,
);
