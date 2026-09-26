/** One-time, lossless import of the reviewed Figma reference into native Astro/CSS.
 * Input files live in ignored .cache/figma. This is not needed to build the site.
 * Deliberately interprets only literal JSX: it never executes Figma-provided code.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { parse } from '@babel/parser';

const pages = ['home', 'about', 'cyclointel', 'samenstad', 'positioning', 'contact', 'cv'];
const assets = [],
  unknown = new Set(),
  rules = new Map();
const skip = new Set([
  '214:512',
  '214:513',
  '444:413',
  '444:424',
  '444:435',
  '444:446',
  '491:365',
  '491:367',
  'I214:503;387:337',
  'I214:503;387:339',
  'I214:503;387:341',
]);
const headingIds = new Set(['214:481', '450:367', '275:74', '351:167', '419:338']);
const voids = new Set(['img', 'br', 'hr', 'input', 'source', 'wbr']);
const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\{/g, '&#123;')
    .replace(/\}/g, '&#125;');
const kebab = (s) =>
  s
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
const hash = (s) => createHash('sha256').update(s).digest('hex').slice(0, 9);
const fixed = {
  absolute: { position: 'absolute' },
  relative: { position: 'relative' },
  block: { display: 'block' },
  flex: { display: 'flex' },
  contents: { display: 'contents' },
  'flex-col': { 'flex-direction': 'column' },
  'flex-none': { flex: 'none' },
  'shrink-0': { 'flex-shrink': '0' },
  'content-stretch': { 'align-content': 'stretch' },
  'items-start': { 'align-items': 'flex-start' },
  'items-center': { 'align-items': 'center' },
  'justify-center': { 'justify-content': 'center' },
  'justify-between': { 'justify-content': 'space-between' },
  'overflow-clip': { overflow: 'clip' },
  'pointer-events-none': { 'pointer-events': 'none' },
  'cursor-pointer': { cursor: 'pointer' },
  'bg-black': { 'background-color': '#000' },
  'bg-white': { 'background-color': '#fff' },
  'text-black': { color: '#000' },
  'text-white': { color: '#fff' },
  'font-black': { 'font-weight': '900' },
  'font-extrabold': { 'font-weight': '800' },
  'font-bold': { 'font-weight': '700' },
  'font-semibold': { 'font-weight': '600' },
  'font-medium': { 'font-weight': '500' },
  'font-normal': { 'font-weight': '400' },
  italic: { 'font-style': 'italic' },
  'not-italic': { 'font-style': 'normal' },
  'leading-none': { 'line-height': '1' },
  'text-right': { 'text-align': 'right' },
  'whitespace-nowrap': { 'white-space': 'nowrap' },
  'whitespace-pre-wrap': { 'white-space': 'pre-wrap' },
  underline: { 'text-decoration-line': 'underline' },
  'decoration-solid': { 'text-decoration-style': 'solid' },
  'decoration-from-font': { 'text-decoration-thickness': 'from-font' },
  'size-full': { width: '100%', height: '100%' },
  'w-full': { width: '100%' },
  'h-px': { height: '1px' },
  'max-w-none': { 'max-width': 'none' },
  'top-0': { top: '0' },
  'left-0': { left: '0' },
  'inset-0': { inset: '0' },
  'mb-0': { 'margin-bottom': '0' },
  border: { 'border-width': '1px' },
  'border-solid': { 'border-style': 'solid' },
  'border-l-3': { 'border-left-width': '3px' },
  'object-cover': { 'object-fit': 'cover' },
  'object-contain': { 'object-fit': 'contain' },
  '-translate-y-1/2': { translate: '0 -50%' },
  'rotate-90': { rotate: '90deg' },
  'rotate-180': { rotate: '180deg' },
};
function token(t) {
  if (fixed[t]) return fixed[t];
  if (/^opacity-\d+$/.test(t)) return { opacity: String(Number(t.split('-')[1]) / 100) };
  const m = t.match(/^(.*?)\[(.*)\]$/);
  if (!m) {
    unknown.add(t);
    return {};
  }
  let [, p, v] = m;
  v = v.replace(/_/g, ' ');
  if (!p) {
    const k = v.indexOf(':');
    return { [v.slice(0, k)]: v.slice(k + 1) };
  }
  if (p === 'font-') {
    const family = v.replace(/^'|'$/g, '').split(':')[0];
    return {
      'font-family': `'${family === 'IBM Plex Mono' ? family : family + ' Variable'}', ${family.includes('Serif') || family === 'Newsreader' ? 'serif' : 'sans-serif'}`,
    };
  }
  if (p === 'text-')
    return v.startsWith('color:')
      ? { color: v.slice(6) }
      : /^(#|rgba?\(|var\()/.test(v)
        ? { color: v }
        : { 'font-size': v };
  if (p === 'border-')
    return v.startsWith('length:')
      ? { 'border-width': v.slice(7) }
      : /^[\d.]+px$/.test(v)
        ? { 'border-width': v }
        : { 'border-color': v };
  const map = {
    'bg-': ['background-color'],
    'border-b-': ['border-bottom-width'],
    'border-t-': ['border-top-width'],
    'border-l-': ['border-left-width'],
    'gap-': ['gap'],
    'h-': ['height'],
    'w-': ['width'],
    'size-': ['width', 'height'],
    'inset-': ['inset'],
    'leading-': ['line-height'],
    'left-': ['left'],
    'right-': ['right'],
    'top-': ['top'],
    'mb-': ['margin-bottom'],
    'p-': ['padding'],
    'px-': ['padding-left', 'padding-right'],
    'py-': ['padding-top', 'padding-bottom'],
    'pl-': ['padding-left'],
    'pr-': ['padding-right'],
    'pt-': ['padding-top'],
    'pb-': ['padding-bottom'],
    'rotate-': ['rotate'],
    'rounded-': ['border-radius'],
    'tracking-': ['letter-spacing'],
    'shadow-': ['box-shadow'],
  };
  if (!map[p]) {
    unknown.add(t);
    return {};
  }
  return Object.fromEntries(map[p].map((k) => [k, v.replace(/^length:/, '')]));
}
function styles(className, inline = {}) {
  const d = {};
  for (const t of (className || '').split(/\s+/).filter(Boolean)) Object.assign(d, token(t));
  for (const [k, v] of Object.entries(inline))
    d[k.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase())] = v;
  return d;
}
function cssClass(d) {
  const css = Object.entries(d)
    .map(([k, v]) => `${k}: ${v};`)
    .join(' ');
  const c = 'd-' + hash(css);
  rules.set(c, css);
  return c;
}
function val(n, env) {
  if (!n) return undefined;
  if (['StringLiteral', 'NumericLiteral', 'BooleanLiteral'].includes(n.type)) return n.value;
  if (n.type === 'Identifier') return env[n.name];
  if (n.type === 'JSXExpressionContainer') return val(n.expression, env);
  if (n.type === 'TemplateLiteral' && !n.expressions.length)
    return n.quasis.map((q) => q.value.cooked).join('');
  if (n.type === 'LogicalExpression' && n.operator === '||')
    return val(n.left, env) || val(n.right, env);
  if (n.type === 'ObjectExpression')
    return Object.fromEntries(
      n.properties.map((p) => [p.key.name || p.key.value, val(p.value, env)]),
    );
  if (n.type === 'JSXEmptyExpression') return '';
  throw Error('Unsupported expression: ' + n.type);
}
function returnNode(f) {
  return f.body.body.find((n) => n.type === 'ReturnStatement').argument;
}
function textContent(n) {
  return typeof n === 'string' ? n : (n.children || []).map(textContent).join('');
}
function materialize(n, env, functions) {
  if (n.type === 'JSXText') {
    const s = n.value
      .split(/\r?\n/)
      .map((l, i, a) => {
        let t = l.replace(/\t/g, ' ');
        if (i) t = t.trimStart();
        if (i < a.length - 1) t = t.trimEnd();
        return t;
      })
      .filter(Boolean)
      .join(' ');
    return s || null;
  }
  if (n.type === 'JSXExpressionContainer') return val(n, env) ?? null;
  if (n.type !== 'JSXElement') throw Error(n.type);
  const o = n.openingElement;
  const tag = o.name.type === 'JSXMemberExpression' ? o.name.property.name : o.name.name;
  const attrs = Object.fromEntries(
    o.attributes
      .filter((a) => a.type === 'JSXAttribute')
      .map((a) => [a.name.name, a.value ? val(a.value, env) : true]),
  );
  if (functions[tag]) {
    const fn = functions[tag],
      props = { ...env };
    for (const p of fn.params[0].properties) {
      const name = p.key.name;
      props[name] =
        attrs[name] ?? (p.value.type === 'AssignmentPattern' ? val(p.value.right, env) : undefined);
    }
    return materialize(returnNode(fn), props, functions);
  }
  return {
    tag,
    attrs,
    children: n.children.map((x) => materialize(x, env, functions)).filter((x) => x !== null),
  };
}
const ctas = {
  'I214:503;387:336': ['/work/cyclointel/', 'cyclointel'],
  'I214:503;387:338': ['/work/samenstad/', 'samenstad'],
  'I214:503;387:340': ['/work/positioning/', 'positioning'],
};
function linkFor(t) {
  if (/Back to work|^Work$/.test(t)) return '/#work';
  if (/Let.s (talk|connect)|^Contact$/.test(t)) return '/contact/';
  if (/DOWNLOAD CV|DOWNLOAD PDF/.test(t))
    return '/documents/romina-ve isy-cv.pdf'.replace('ve isy', 'veisy');
  if (/Get CV/.test(t)) return '/cv/';
  if (/^About$/.test(t)) return '/about/';
  return null;
}
for (const page of pages) {
  const source = await readFile(`.cache/figma/${page}.jsx`, 'utf8');
  const ast = parse(source, { sourceType: 'module', plugins: ['jsx', 'typescript'] });
  const env = {},
    functions = {};
  let main;
  for (const s of ast.program.body) {
    if (s.type === 'VariableDeclaration')
      for (const d of s.declarations) {
        const value = val(d.init, env);
        if (typeof value === 'string' && value.startsWith('https://www.figma.com/api/mcp/asset/')) {
          const name = kebab(d.id.name.replace(/^img/, '')),
            ext = new URL(value).pathname.split('.').pop();
          const path = `/images/${page}/${name.slice(0, 90)}-${hash(value).slice(0, 5)}.${ext}`;
          env[d.id.name] = path;
          assets.push({ url: value, path, label: name, page });
        } else env[d.id.name] = value;
      }
    if (s.type === 'FunctionDeclaration') functions[s.id.name] = s;
    if (s.type === 'ExportDefaultDeclaration') main = s.declaration;
  }
  const tree = materialize(returnNode(main), env, functions);
  const pageAssets = assets.filter((a) => a.page === page);
  function render(n, ctx = { depth: 0, parentName: '', heading: false, cta: null }) {
    if (typeof n === 'string' || typeof n === 'number') return esc(n);
    let { tag, attrs: a, children } = n;
    a = { ...a };
    const id = a['data-node-id'],
      name = a['data-name'] || ctx.parentName;
    if (skip.has(id)) return '';
    if (id === '329:146') return '<ContactForm />';
    const d = styles(a.className, a.style);
    delete a.className;
    delete a.style;
    for (const key of Object.keys(a)) if (key.startsWith('data-motion')) delete a[key];
    if (id) {
      a['data-figma-id'] = id;
      delete a['data-node-id'];
    }
    delete a['data-name'];
    if (id === '249:73') {
      d.position = 'relative';
      delete d.left;
      delete d.top;
    }
    if (ctx.depth === 0) {
      delete d.height;
      d.width = '100%';
      a['data-design-page'] = page;
    }
    if (page === 'positioning' && ctx.depth === 0) d.height = '3100px';
    if (page === 'cv' && ctx.depth === 0) d.height = '2220px';
    const isHeading = headingIds.has(id);
    if (isHeading) tag = 'h1';
    else if (ctx.heading && tag === 'p') {
      tag = 'span';
      d.display = 'block';
    } else if (tag === 'p' && parseFloat(d['font-size']) >= 25 && ctx.depth > 1 && page !== 'home')
      tag = 'h2';
    if (page === 'about' && id === '450:616') tag = 'footer';
    if (
      (page === 'cyclointel' || page === 'samenstad') &&
      ctx.depth === 1 &&
      d['flex-direction'] === 'column'
    )
      tag = 'section';
    if (id === '330:156') {
      tag = 'h1';
    }
    const t = textContent(n).trim();
    const link = linkFor(t);
    if (tag === 'a' && !a.href && !ctas[id] && !ctx.cta) {
      if (!link) throw Error('Unmapped link ' + id + ' ' + t);
      a.href = link;
    }
    if (['450:618', '450:620', '438:368'].includes(id)) {
      tag = 'a';
      a.href = link;
      d.display = 'block';
    }
    if (a.href?.endsWith('.pdf')) a.download = 'Romina-Veisy-CV.pdf';
    if (a.target === '_blank') a.rel = 'noopener noreferrer';
    if (a.href?.startsWith('mailto:')) delete a.target;
    const cta = ctas[id] || ctx.cta;
    if (cta && (tag === 'a' || (!children.length && tag === 'div' && d['background-color']))) {
      tag = 'a';
      a.href = cta[0];
      a['data-project-link'] = cta[1];
      a['aria-label'] = 'Explore ' + cta[1] + ' — case study';
      children = ['Explore this work'];
      Object.assign(d, {
        display: 'flex',
        'align-items': 'center',
        'justify-content': 'center',
        'font-family': "'Inter Variable',sans-serif",
        'font-weight': '700',
        'font-size': '17px',
        'line-height': '26px',
        color: '#0d0d24',
      });
    }
    // Figma exports rotation wrappers; the scroll driver owns their rotation instead.
    if (page === 'home' && ctx.parentId === '214:503') d.rotate = '0deg';
    if (page === 'home' && ctx.parentId === '214:504') d.rotate = '0deg';
    if (page === 'home' && ['214:506', '214:508'].includes(ctx.grandparentId)) delete d.opacity;
    if (id === '214:483') {
      Object.assign(d, {
        display: 'block',
        position: 'absolute',
        left: '84px',
        top: '722px',
        width: '104px',
        height: '105px',
      });
      a['aria-hidden'] = 'true';
    }
    if (ctx.parentId === '214:483') {
      if (d.left) d.left = parseFloat(d.left) - 84 + 'px';
      if (d.top) d.top = parseFloat(d.top) - 722 + 'px';
    }
    if (id === '214:503') a['data-project-wheel'] = '';
    if (tag === 'button' && /Gallery/.test(name)) {
      a.type = 'button';
      a['data-lightbox'] = '';
      a['aria-label'] =
        'Enlarge ' +
        name
          .replace('Gallery v2 image — ', '')
          .replace('pho_', 'photograph ')
          .replace('pai_', 'painting ')
          .replace('mod_', 'model ');
    }
    if (tag === 'img') {
      const asset = pageAssets.find((x) => x.path === a.src);
      let alt = '';
      if (!a.src.endsWith('.svg'))
        alt = name
          .replace(/^Gallery v2 image — /, '')
          .replace('pho_', 'Photography by Romina Veisy — image ')
          .replace('pai_', 'Watercolour by Romina Veisy — image ')
          .replace('mod_', 'Architectural model by Romina Veisy — image ')
          .replace(/\.png$/, '')
          .replace(/ — original.*$/i, '');
      if (page === 'cyclointel') alt = asset.label.replace(/-/g, ' ').replace(/png /, '— ');
      if (page === 'cv')
        alt =
          'Romina Veisy — CV, September 2026. Download the accessible PDF using the button above.';
      a.alt = alt;
      a.loading = page === 'home' || /portrait/i.test(name) ? 'eager' : 'lazy';
      a.decoding = 'async';
    }
    a.class = cssClass(d);
    const attrs = Object.entries(a)
      .filter(([, v]) => v !== undefined && v !== false)
      .map(([k, v]) => (v === true ? ` ${k}` : ` ${k}="${esc(v)}"`))
      .join('');
    if (voids.has(tag)) return `<${tag}${attrs} />`;
    const ch = children
      .map((c) =>
        render(c, {
          depth: ctx.depth + 1,
          parentName: name,
          parentId: id,
          grandparentId: ctx.parentId,
          heading: ctx.heading || isHeading || id === '330:156',
          cta,
        }),
      )
      .join('');
    return `<${tag}${attrs}>${ch}</${tag}>`;
  }
  await mkdir('src/components/design', { recursive: true });
  const html = render(tree);
  await writeFile(
    `src/components/design/${page}.astro`,
    (page === 'contact' ? `---\nimport ContactForm from '../ContactForm.astro';\n---\n` : '') +
      `<!-- Native markup transcribed from the approved ${page} Figma frame. -->\n` +
      html +
      '\n',
  );
}
if (unknown.size) throw Error('Unmapped styles: ' + [...unknown].join(', '));
await mkdir('src/styles', { recursive: true });
await writeFile(
  'src/styles/design.css',
  '/* Shared visual primitives transcribed from Figma. Application overrides live in global.css. */\n' +
    [...rules].map(([c, v]) => `.${c} { ${v} }`).join('\n') +
    '\n',
);
await writeFile('.cache/figma/assets.json', JSON.stringify(assets, null, 2));
console.log(
  `Imported ${pages.length} screens; ${assets.length} assets; ${rules.size} native CSS rules.`,
);
