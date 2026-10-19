document.querySelectorAll("[data-element-link]").forEach(el=>{el.style.cursor="pointer";el.tabIndex=0;el.setAttribute("role","link");el.setAttribute("aria-label","Vaata lähemalt");const go=()=>location.assign(el.getAttribute("data-element-link"));el.addEventListener("click",go);el.addEventListener("keydown",e=>{if(e.key==="Enter")go()})});document.querySelectorAll('[data-page-element="AccordionItem"]').forEach(item=>{const header=item.querySelector('.elAccordionItemHeader');if(!header)return;header.tabIndex=0;header.setAttribute('role','button');header.setAttribute('aria-expanded','false');const toggle=()=>{const open=item.dataset.expanded!=='true';item.dataset.expanded=String(open);header.setAttribute('aria-expanded',String(open));};header.addEventListener('click',toggle);header.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();}});});document.querySelectorAll('a:not([href])').forEach(a=>{if(a.textContent.includes('555 00 495'))a.href='tel:+37255500495'});

/* Mark package cards as tappable (they are pictures, so the arrow sits on top) */
document.querySelectorAll('img[data-element-link^="ilupakett-"]').forEach(img=>img.parentElement.classList.add('card-link'));

/* Immediate feedback on the homepage's two internal offer buttons. */
const offerButtons = document.querySelectorAll('a.elButton[href="fbh-offer-1.html"], a.elButton[href="fbh-ilupaketid.html"]');
const clearOfferLoading = () => offerButtons.forEach(button => {
  button.classList.remove('is-opening');
  button.removeAttribute('aria-busy');
});
offerButtons.forEach(button => {
  const spinner = document.createElement('span');
  spinner.className = 'button-spinner';
  spinner.setAttribute('aria-hidden', 'true');
  button.appendChild(spinner);
  button.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (button.classList.contains('is-opening')) return;
    button.classList.add('is-opening');
    button.setAttribute('aria-busy', 'true');
    // Give the loading state a paint before starting same-tab navigation.
    requestAnimationFrame(() => requestAnimationFrame(() => location.assign(button.href)));
    setTimeout(clearOfferLoading, 12000);
  });
});
window.addEventListener('pageshow', clearOfferLoading);
