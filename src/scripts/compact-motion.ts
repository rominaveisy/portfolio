// Recompose the existing Figma elements; all copy, artwork and destinations stay shared.
const stage = document.querySelector<HTMLElement>('.home-stage')!;
const outer = stage.querySelector<HTMLElement>('[data-figma-id="214:477"]')!;
const inner = stage.querySelector<HTMLElement>('[data-figma-id="214:478"]')!;
const labels = stage.querySelector<HTMLElement>('.compact-labels')!;
const intro = ['476', '479', '480', '481', '482', '483'].map((id) =>
  stage.querySelector<HTMLElement>(`[data-figma-id="214:${id}"]`)!,
);
const names = ['cyclointel', 'samenstad', 'positioning'];
const parts = names.map((name) => [
  ...stage.querySelectorAll<HTMLElement>(
    `[data-cover-copy="${name}"], [data-cover-art="${name}"], [data-project-link="${name}"]`,
  ),
]);
let size = { width: 390, height: 844, innerX: 120, innerY: 370, innerSize: 80 };
const mix = (a: number, b: number, progress: number) => a + (b - a) * progress;

export function measureCompact() {
  const line = stage.querySelector<HTMLElement>('[data-figma-id="214:479"]')!;
  const inside = line.querySelector<HTMLElement>('.d-fb1e97144')!;
  const translation = line.style.translate;
  line.style.translate = '0 0';
  const word = inside.getBoundingClientRect();
  const frame = stage.getBoundingClientRect();
  line.style.translate = translation;
  const diameter = Math.max(64, word.width * 1.15);
  size = {
    width: stage.clientWidth,
    height: stage.clientHeight,
    innerX: word.x - frame.x + (word.width - diameter) / 2,
    innerY: word.y - frame.y + (word.height - diameter) / 2,
    innerSize: diameter,
  };
}

export function updateCompact(progress: number) {
  const { width, height } = size;
  const entry = Math.min(1, progress * 3);
  const orbit = progress * 3 - 1;
  const landscape = width > height;
  const diameter = mix(Math.max(330, width * 0.95), Math.max(width * 2.4, height * 1.55), entry);
  outer.style.width = outer.style.height = `${diameter}px`;
  outer.style.left = `${mix(width * 0.48, width * 0.9 - diameter, entry)}px`;
  outer.style.top = `${mix(height * 0.26, (height - diameter) / 2, entry)}px`;
  const wheel = landscape ? Math.min(height * 0.53, 220) : Math.min(width * 0.54, 260);
  const wheelX = -wheel * 0.52;
  const wheelY = landscape ? height * 0.29 : 88;
  const innerSize = mix(size.innerSize, wheel, entry);
  inner.style.width = inner.style.height = `${innerSize}px`;
  inner.style.left = `${mix(size.innerX, wheelX, entry)}px`;
  inner.style.top = `${mix(size.innerY, wheelY, entry)}px`;
  labels.style.width = labels.style.height = `${wheel}px`;
  labels.style.setProperty('--wheel-size', `${wheel}px`);
  labels.style.left = `${wheelX}px`;
  labels.style.top = `${wheelY}px`;
  labels.style.opacity = String(Math.max(0, (entry - 0.5) * 2));
  labels.style.rotate = `${-orbit * 65}deg`;
  for (const element of intro) {
    element.style.translate = `0 ${-entry * height * 1.2}px`;
    element.style.opacity = String(Math.max(0, 1 - entry * 1.7));
    element.inert = entry > 0.5;
  }
  parts.forEach((elements, index) => {
    const offset = index - orbit;
    for (const element of elements) {
      element.style.rotate = `${offset * 90}deg`;
      element.style.opacity = String(Math.max(0, 1 - Math.abs(offset) * 1.25));
      element.style.visibility = Math.abs(offset) < 1 ? 'visible' : 'hidden';
    }
  });
}

export function clearCompact() {
  for (const element of [outer, inner, labels, ...intro, ...parts.flat()]) {
    for (const property of [
      'width',
      'height',
      'left',
      'top',
      'translate',
      'rotate',
      'opacity',
      'visibility',
    ])
      element.style.removeProperty(property);
    element.inert = false;
  }
}
