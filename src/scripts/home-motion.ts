import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import motion from '../data/home-motion.json';

gsap.registerPlugin(ScrollTrigger);
const root = document.documentElement;
const stage = document.querySelector<HTMLElement>('.home-stage')!;
const area = document.querySelector<HTMLElement>('.home-scroll')!;
const preference = window.matchMedia(
  '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
);
let trigger: ScrollTrigger | undefined;
let animations: Animation[] = [];
let showingStatic = false;

// These are positions in the Figma sequence, NOT elapsed seconds.
// Short holds let each case study be read before the next scroll transition.
const stops = [
  [0, 0],
  [0.12, 0.31382],
  [0.36, 0.48278],
  [0.48, 0.5073],
  [0.57, 0.50763],
  [0.7, 0.58096],
  [0.8, 0.58097],
  [0.94, 0.63747],
  [1, 0.63747],
];
function sequencePosition(progress: number) {
  for (let i = 1; i < stops.length; i++) {
    const [end, value] = stops[i];
    if (progress <= end) {
      const [start, previous] = stops[i - 1];
      return previous + (value - previous) * ((progress - start) / (end - start));
    }
  }
  return stops[stops.length - 1][1];
}

function makeAnimations() {
  for (const node of motion.nodes) {
    const element =
      node.nodeId === '214:513'
        ? document.querySelector('.brand')
        : document.querySelector(`[data-figma-id="${node.nodeId}"]`);
    if (!element) continue;
    for (const track of node.codeSnippets.css.matchAll(
      /@keyframes\s+[^\s{]+\s*\{([\s\S]*?)(?=@keyframes|$)/g,
    )) {
      const frames: Keyframe[] = [];
      for (const frame of track[1].matchAll(/([\d.]+)%\s*\{([^}]+)\}/g)) {
        const item: Keyframe = { offset: Number(frame[1]) / 100 };
        for (const declaration of frame[2].split(';').filter((x) => x.trim())) {
          const colon = declaration.indexOf(':');
          const property = declaration.slice(0, colon).trim();
          const value = declaration.slice(colon + 1).trim();
          item[
            property === '--rotate-transform'
              ? 'rotate'
              : property === 'animation-timing-function'
                ? 'easing'
                : property
          ] = value;
        }
        frames.push(item);
      }
      if (!frames.length) continue;
      const animation = element.animate(frames, { duration: 1000, fill: 'both' });
      animation.pause();
      animation.currentTime = 0;
      animations.push(animation);
    }
  }
}
function update(progress: number) {
  const position = sequencePosition(progress);
  for (const animation of animations) animation.currentTime = position * 1000;
  const active =
    position >= 0.62429
      ? 'positioning'
      : position >= 0.55845
        ? 'samenstad'
        : position >= 0.499
          ? 'cyclointel'
          : '';
  document.querySelectorAll<HTMLAnchorElement>('[data-project-link]').forEach((link) => {
    const enabled = link.dataset.projectLink === active;
    link.tabIndex = enabled ? 0 : -1;
    link.style.pointerEvents = enabled ? 'auto' : 'none';
    link.setAttribute('aria-hidden', String(!enabled));
  });
  stage.dataset.progress = progress.toFixed(5);
}
function resize() {
  stage.style.setProperty(
    '--stage-scale',
    String(Math.min(window.innerWidth / 1707, window.innerHeight / 1030)),
  );
}
function teardown() {
  trigger?.kill();
  trigger = undefined;
  animations.forEach((animation) => animation.cancel());
  animations = [];
  root.classList.remove('motion-ready');
}
function setup() {
  teardown();
  resize();
  if (!preference.matches || showingStatic) return;
  root.classList.add('motion-ready');
  makeAnimations();
  trigger = ScrollTrigger.create({
    trigger: area,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => update(self.progress),
    invalidateOnRefresh: true,
    onRefresh: (self) => update(self.progress),
  });
  update(trigger.progress);
}
function goToWork(event?: Event) {
  if (event) event.preventDefault();
  if (trigger) {
    window.scrollTo({
      top: trigger.start + (trigger.end - trigger.start) * 0.52,
      behavior: 'instant',
    });
    ScrollTrigger.update();
  } else document.getElementById('work')?.scrollIntoView({ behavior: 'instant' });
}
document
  .querySelectorAll<HTMLAnchorElement>('a[href="/#work"]')
  .forEach((link) => link.addEventListener('click', goToWork));
document.querySelector('[data-skip-motion]')?.addEventListener('click', (event) => {
  event.preventDefault();
  showingStatic = true;
  teardown();
  root.classList.add('static-work');
  const work = document.getElementById('work')!;
  work.scrollIntoView({ behavior: 'instant' });
  work.focus({ preventScroll: true });
});
preference.addEventListener('change', setup);
window.addEventListener('resize', resize, { passive: true });
window.addEventListener('pagehide', teardown);
window.addEventListener('pageshow', (event) => {
  if (event.persisted) setup();
});
setup();
if (location.hash === '#work') requestAnimationFrame(() => goToWork());
