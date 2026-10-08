const menu = document.querySelector<HTMLDialogElement>('#phone-menu')!;
const toggle = document.querySelector<HTMLButtonElement>('.menu-toggle')!;
const closeButton = menu.querySelector<HTMLButtonElement>('.menu-close')!;
const phone = window.matchMedia('(max-width: 699px)');
let previousOverflow = '';

toggle.addEventListener('click', () => {
  previousOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  toggle.setAttribute('aria-expanded', 'true');
  menu.showModal();
  closeButton.focus();
});
closeButton.addEventListener('click', () => menu.close());
menu.addEventListener('keydown', (event) => {
  if (event.key !== 'Tab') return;
  const controls = [...menu.querySelectorAll<HTMLElement>('a[href], button')];
  const first = controls[0];
  const last = controls[controls.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});
menu.addEventListener('close', () => {
  document.body.style.overflow = previousOverflow;
  toggle.setAttribute('aria-expanded', 'false');
});
menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => menu.close()));
phone.addEventListener('change', () => {
  if (!phone.matches && menu.open) menu.close();
});
window.addEventListener('pagehide', () => {
  if (menu.open) menu.close();
});
document.documentElement.classList.add('menu-ready');

export {};
