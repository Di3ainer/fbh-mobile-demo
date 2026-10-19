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
  const control = element.tagName === 'IMG' ? element.parentElement : element;
  prepareNavigation(control, element.tagName === 'IMG');
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

