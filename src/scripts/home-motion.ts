import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import motion from '../data/home-motion.json';

gsap.registerPlugin(ScrollTrigger);
const root = document.documentElement;
const stage = document.querySelector<HTMLElement>('.home-stage')!;
const area = document.querySelector<HTMLElement>('.home-scroll')!;
const projectLinks = [...document.querySelectorAll<HTMLAnchorElement>('[data-project-link]')];
const preference = window.matchMedia(
  '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
);
const scenes = ['intro', 'cyclointel', 'samenstad', 'positioning'];
// Keep Figma's geometry/easing, but remove its opening wait and stop on complete covers.
const coverStops = [0.31382, 0.5073, 0.58096, 0.63747];
// The label wheel finishes earlier than the cover wheel in the source timeline.
// Synchronize resting poses so labels don't drift toward the following project.
const labelStops = [0.31382, 0.5057, 0.56499, 0.63083];
let trigger: ScrollTrigger | undefined;
let transition: gsap.core.Tween | undefined;
let animations: { animation: Animation; labels: boolean }[] = [];
let showingStatic = false;
let settleTimer = 0;
let wheelTimer = 0;
let wheelConsumed = false;
let wheelDistance = 0;
let lastWheelDelta = 0;
let lastWheelDirection = 0;
let settledAt = 0;
let currentProgress = 0;
let heroInset = 0;
let touchStart: number | undefined;
let touchConsumed = false;
let targetScene = 0;

function sequencePosition(progress: number, stops: number[]) {
  const position = Math.min(3, Math.max(0, progress * 3));
  const index = Math.min(2, Math.floor(position));
  return stops[index] + (stops[index + 1] - stops[index]) * (position - index);
}

function makeAnimations() {
  for (const node of motion.nodes) {
    const element =
      node.nodeId === '214:513'
        ? document.querySelector('.brand')
        : document.querySelector('[data-figma-id="' + node.nodeId + '"]');
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
      // CSS continuously rotates this decoration; only its exit translation is scrubbed.
      if (node.nodeId === '214:483' && 'rotate' in frames[0]) continue;
      const animation = element.animate(frames, { duration: 1000, fill: 'both' });
      animation.pause();
      animations.push({
        animation,
        labels: Number(node.nodeId.split(':')[1]) >= 504 && node.nodeId !== '214:513',
      });
    }
  }
}

function update(progress: number) {
  currentProgress = progress;
  updateIntroSpacing(progress);
  for (const { animation, labels } of animations) {
    animation.currentTime = sequencePosition(progress, labels ? labelStops : coverStops) * 1000;
  }
  const nearest = Math.round(progress * 3);
  const settled = !transition && Math.abs(progress * 3 - nearest) < 0.002;
  const active = settled ? scenes[nearest] : '';
  for (const link of projectLinks) {
    const enabled = link.dataset.projectLink === active;
    link.tabIndex = enabled ? 0 : -1;
    link.style.pointerEvents = enabled ? 'auto' : 'none';
    link.setAttribute('aria-hidden', String(!enabled));
  }
  stage.dataset.progress = progress.toFixed(5);
  stage.dataset.scene = settled ? active : 'transition';
  stage.dataset.moving = String(!settled);
  // Fade the curved label in with the first cover and out on the return to the intro.
  stage.style.setProperty('--work-label-opacity', String(Math.min(1, Math.max(0, progress * 3))));
}

function sceneScroll(index: number) {
  return trigger!.start + ((trigger!.end - trigger!.start) * index) / 3;
}

function goToScene(index: number) {
  if (!trigger) return;
  clearTimeout(settleTimer);
  transition?.kill();
  targetScene = Math.max(0, Math.min(3, index));
  const top = sceneScroll(targetScene);
  const from = window.scrollY;
  if (Math.abs(from - top) < 1) {
    transition = undefined;
    update(trigger.progress);
    return;
  }
  const cursor = { top: from };
  const crossesIntro = Math.min(trigger.progress * 3, targetScene) < 1;
  transition = gsap.to(cursor, {
    top,
    duration: crossesIntro ? 1.65 : 1.15,
    ease: 'power1.inOut',
    onUpdate: () => {
      window.scrollTo({ top: cursor.top, behavior: 'instant' });
      ScrollTrigger.update();
    },
    onComplete: () => {
      transition = undefined;
      settledAt = performance.now();
      window.scrollTo({ top, behavior: 'instant' });
      ScrollTrigger.update();
      if (trigger) update(trigger.progress);
    },
  });
  update(trigger.progress);
}

function inScene() {
  return trigger && window.scrollY >= trigger.start - 1 && window.scrollY <= trigger.end + 1;
}

function step(direction: number) {
  if (!inScene()) return false;
  // Momentum must not skip another cover or escape into the footer mid-transition.
  if (transition) return true;
  const current = Math.round(trigger!.progress * 3);
  const next = current + direction;
  if (next < 0 || next > 3) return false; // Ordinary scrolling at either end.
  goToScene(next);
  return true;
}

function onWheel(event: WheelEvent) {
  if (!inScene() || event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
  const delta =
    event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
  if (!delta) return;
  const amount = Math.abs(delta);
  const direction = Math.sign(delta);
  // A new wheel notch, renewed trackpad push, or reversal is intentional input,
  // even if the preceding gesture's quiet timer has not elapsed yet.
  const renewedInput =
    !transition &&
    (direction !== lastWheelDirection ||
      (amount >= 8 && amount > lastWheelDelta * 1.6) ||
      (amount >= 40 &&
        Math.abs(amount - lastWheelDelta) < 0.1 &&
        performance.now() - settledAt > 160));
  lastWheelDelta = amount;
  lastWheelDirection = direction;
  if (renewedInput) {
    wheelConsumed = false;
    wheelDistance = 0;
  }
  clearTimeout(wheelTimer);
  // A quiet interval separates intentional gestures from trailing trackpad inertia.
  wheelTimer = window.setTimeout(() => {
    wheelConsumed = false;
    wheelDistance = 0;
  }, 180);
  if (wheelConsumed || transition) {
    wheelConsumed = true;
    event.preventDefault();
    return;
  }
  if (Math.sign(delta) !== Math.sign(wheelDistance)) wheelDistance = 0;
  wheelDistance += delta;
  const atBoundary =
    (trigger!.progress < 0.001 && direction < 0) || (trigger!.progress > 0.999 && direction > 0);
  if (atBoundary) return;
  event.preventDefault();
  if (Math.abs(wheelDistance) >= 8) wheelConsumed = step(direction);
}

function onKey(event: KeyboardEvent) {
  if (!inScene() || event.altKey || event.ctrlKey || event.metaKey) return;
  if (
    (event.target as HTMLElement).closest('input, textarea, select, button, a, [contenteditable]')
  )
    return;
  const direction = ['ArrowDown', 'PageDown', ' '].includes(event.key)
    ? event.key === ' ' && event.shiftKey
      ? -1
      : 1
    : ['ArrowUp', 'PageUp'].includes(event.key)
      ? -1
      : 0;
  if (event.key === 'Home' || event.key === 'End') {
    event.preventDefault();
    goToScene(event.key === 'Home' ? 0 : 3);
  } else if (direction && (event.repeat || step(direction))) event.preventDefault();
}

function onTouchStart(event: TouchEvent) {
  touchStart = event.touches.length === 1 ? event.touches[0].clientY : undefined;
  touchConsumed = false;
}
function onTouchMove(event: TouchEvent) {
  if (!inScene() || touchStart === undefined || event.touches.length !== 1) return;
  const distance = touchStart - event.touches[0].clientY;
  if (touchConsumed || transition) {
    touchConsumed = true;
    event.preventDefault();
    return;
  }
  if (Math.abs(distance) > 24 && step(Math.sign(distance))) {
    touchConsumed = true;
    event.preventDefault();
  }
}

function updateIntroSpacing(progress: number) {
  // The responsive intro offset returns to zero along the circle's original travel.
  // Project-cover positions and rotation origins therefore stay unchanged.
  const travel = Math.min(
    1,
    Math.max(
      0,
      (sequencePosition(progress, coverStops) - coverStops[0]) / (0.47413 - coverStops[0]),
    ),
  );
  stage.style.setProperty('--hero-shift', `${heroInset * (1 - travel)}px`);
}

function resize() {
  const width = document.documentElement.clientWidth;
  const scale = Math.min(width / 1707, window.innerHeight / 1030);
  const extra = Math.max(0, width / scale - 1707);
  // Split surplus width between the outer margins (one quarter each) and the gap.
  // Moving the two columns independently avoids pushing the entire scene sideways.
  heroInset = extra * 0.75;
  stage.style.setProperty('--stage-scale', String(scale));
  stage.style.setProperty('--stage-width', `${width / scale}px`);
  stage.style.setProperty('--intro-shift', `${extra * 0.25}px`);
  updateIntroSpacing(currentProgress);
}

function teardown() {
  transition?.kill();
  transition = undefined;
  clearTimeout(settleTimer);
  clearTimeout(wheelTimer);
  wheelConsumed = false;
  wheelDistance = 0;
  lastWheelDelta = 0;
  lastWheelDirection = 0;
  trigger?.kill();
  trigger = undefined;
  animations.forEach(({ animation }) => animation.cancel());
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
    onUpdate: (self) => {
      update(self.progress);
      clearTimeout(settleTimer);
      // Scrollbar/native scrolling still works, then settles to a complete cover.
      if (!transition && self.progress > 0 && self.progress < 1) {
        settleTimer = window.setTimeout(() => goToScene(Math.round(self.progress * 3)), 180);
      }
    },
    invalidateOnRefresh: true,
    onRefresh: (self) => {
      resize();
      if (transition) goToScene(targetScene);
      else {
        update(self.progress);
        if (self.progress > 0 && self.progress < 1) {
          clearTimeout(settleTimer);
          settleTimer = window.setTimeout(() => goToScene(Math.round(self.progress * 3)), 180);
        }
      }
    },
  });
  update(trigger.progress);
}

function plainClick(event: MouseEvent) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}
document.querySelectorAll<HTMLAnchorElement>('a[href="/#work"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    if (!plainClick(event)) return;
    event.preventDefault();
    if (trigger) goToScene(1);
    else document.getElementById('work')?.scrollIntoView({ behavior: 'instant' });
  });
});
document.querySelector<HTMLAnchorElement>('.brand')?.addEventListener('click', (event) => {
  if (!plainClick(event) || !trigger) return;
  event.preventDefault();
  goToScene(0);
});
document.querySelector('[data-skip-motion]')?.addEventListener('click', (event) => {
  event.preventDefault();
  showingStatic = true;
  teardown();
  root.classList.add('static-work');
  const work = document.getElementById('work')!;
  work.scrollIntoView({ behavior: 'instant' });
  work.focus({ preventScroll: true });
});
// Capture page-wide before text, artwork or navigation descendants can consume input.
window.addEventListener('wheel', onWheel, { passive: false, capture: true });
window.addEventListener('keydown', onKey);
window.addEventListener('touchstart', onTouchStart, { passive: true });
window.addEventListener('touchmove', onTouchMove, { passive: false });
preference.addEventListener('change', setup);
window.addEventListener('resize', resize, { passive: true });
window.addEventListener('pagehide', teardown);
window.addEventListener('pageshow', (event) => {
  if (event.persisted) setup();
});
setup();
if (location.hash === '#work') requestAnimationFrame(() => goToScene(1));
