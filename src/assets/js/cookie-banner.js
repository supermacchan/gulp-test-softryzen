import service from './service.js';

const userIP = await service.geoIpLookup();
const isUkrainian = userIP === 'ua' && document.documentElement.lang === 'uk';

if (!isUkrainian) {
  showCookieBanner();
}

function showCookieBanner() {
  const refs = {
    cookieBanner: document.querySelector('[data-cookie-banner]'),
    acceptCookieBtn: document.querySelector('[data-accept-cookie-btn]'),
  };

  refs.acceptCookieBtn.addEventListener('click', () =>
    refs.cookieBanner.classList.add('cookie-banner-is-hidden')
  );

  setTimeout(() => {
    refs.cookieBanner.classList.remove('cookie-banner-is-hidden');
  }, 1500);
}
