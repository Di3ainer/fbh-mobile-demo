/* Remember where the visitor was on each page, so going back (also with the app's back button) returns to the same spot */
const scrollKey = 'fbh-scroll:' + (location.pathname.replace(/\.html$/, '').replace(/\/index$/, '/') || '/');
let restoringScroll = false;
function saveScroll() { if (restoringScroll) return; try { sessionStorage.setItem(scrollKey, String(Math.round(window.scrollY))); } catch (e) {} }
let scrollSaveTimer;
window.addEventListener('scroll', () => { clearTimeout(scrollSaveTimer); scrollSaveTimer = setTimeout(saveScroll, 150); }, { passive: true });
window.addEventListener('pagehide', saveScroll);
try { history.scrollRestoration = 'manual'; } catch (e) {}
(() => {
  let cameByLink = false, saved = null;
  try { cameByLink = sessionStorage.getItem('fbh-link-nav') === '1'; sessionStorage.removeItem('fbh-link-nav'); saved = sessionStorage.getItem(scrollKey); } catch (e) {}
  const navType = (performance.getEntriesByType && performance.getEntriesByType('navigation')[0] || {}).type;
  const reveal = () => document.documentElement.classList.remove('fbh-restoring');
  if (saved === null || location.hash || (cameByLink && navType !== 'back_forward')) return reveal();
  const y = parseInt(saved, 10);
  if (!(y > 0)) return reveal();
  /* The app's browser may move the page back to the top after loading, so keep putting it back
     for a short while, until the visitor touches the screen themselves */
  restoringScroll = true;
  let userMoved = false;
  const stop = () => { userMoved = true; restoringScroll = false; };
  ['touchstart', 'wheel', 'keydown'].forEach(type => window.addEventListener(type, stop, { once: true, passive: true }));
  const restore = () => { if (!userMoved && Math.abs(window.scrollY - y) > 5) window.scrollTo(0, y); };
  restore();
  reveal();
  window.addEventListener('load', restore, { once: true });
  [50, 150, 300, 600, 1000].forEach(ms => setTimeout(restore, ms));
  setTimeout(() => { restoringScroll = false; }, 1100);
  window.addEventListener('pageshow', event => { if (event.persisted) restore(); });
})();

/* Loading feedback stays inside the selected navigation control. */
let navigationResetTimer;
const clearNavigationLoading = () => {
  clearTimeout(navigationResetTimer);
  document.querySelectorAll('.is-opening').forEach(element => {
    element.classList.remove('is-opening');
    element.removeAttribute('aria-busy');
  });
};
const navigateWithFeedback = (control, url) => {
  if (control.classList.contains('is-opening')) return;
  clearNavigationLoading();
  control.classList.add('is-opening');
  control.setAttribute('aria-busy', 'true');
  navigationResetTimer = setTimeout(clearNavigationLoading, 8000);
  saveScroll();
  try { sessionStorage.setItem('fbh-link-nav', '1'); } catch (e) {}
  requestAnimationFrame(() => requestAnimationFrame(() => location.assign(url)));
};
const prepareNavigation = (control, isCard = false) => {
  control.classList.add('loading-control');
  if (isCard) control.classList.add('loading-card');
  const spinner = document.createElement('span');
  spinner.className = 'navigation-spinner';
  spinner.setAttribute('aria-hidden', 'true');
  control.appendChild(spinner);
};
document.querySelectorAll('[data-element-link]').forEach(element => {
  const url = element.getAttribute('data-element-link');
  if (!url || !/^https?:$/.test(new URL(url, location.href).protocol)) return;
  /* A banner picture with its own button below shows the spinner inside that button */
  const bannerButton = element.tagName === 'IMG' && element.parentElement.nextElementSibling?.querySelector('a.elButton');
  const control = bannerButton && bannerButton.href === new URL(url, location.href).href ? bannerButton
    : element.tagName === 'IMG' ? element.parentElement : element;
  if (control !== bannerButton) prepareNavigation(control, element.tagName === 'IMG');
  element.style.cursor = 'pointer';
  element.tabIndex = 0;
  element.setAttribute('role', 'link');
  element.setAttribute('aria-label', 'Vaata lähemalt');
  element.addEventListener('click', event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    navigateWithFeedback(control, url);
  });
  element.addEventListener('keydown', event => {
    if (event.key === 'Enter') { event.preventDefault(); navigateWithFeedback(control, url); }
  });
});
document.querySelectorAll('a[href]').forEach(link => {
  const url = new URL(link.href, location.href);
  if (!/^https?:$/.test(url.protocol) || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
  if (url.origin === location.origin && url.pathname === location.pathname && url.search === location.search && url.hash) return;
  prepareNavigation(link);
  link.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigateWithFeedback(link, link.href);
  });
});
window.addEventListener('pageshow', clearNavigationLoading);
document.querySelectorAll('[data-page-element="AccordionItem"]').forEach(item=>{const header=item.querySelector('.elAccordionItemHeader');if(!header)return;header.tabIndex=0;header.setAttribute('role','button');header.setAttribute('aria-expanded','false');const toggle=()=>{const open=item.dataset.expanded!=='true';item.dataset.expanded=String(open);header.setAttribute('aria-expanded',String(open));};header.addEventListener('click',toggle);header.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();}});});document.querySelectorAll('a:not([href])').forEach(a=>{if(a.textContent.includes('555 00 495'))a.href='tel:+37255500495'});

/* Mark package cards as tappable (they are pictures, so the arrow sits on top) */
document.querySelectorAll('img[data-element-link^="ilupakett-"]').forEach(img=>img.parentElement.classList.add('card-link'));


/* Give pictures their final shape before they load, so cards do not show as thin lines with stacked arrows */
document.querySelectorAll('img.elImage[width][height]:not([src="assets/0.png"])').forEach(img=>{img.style.aspectRatio=img.getAttribute('width')+' / '+img.getAttribute('height')});
