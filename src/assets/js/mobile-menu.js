// const refs = {
//   body: document.querySelector('body'),
//   openMenuBtn: document.querySelector('[data-open-menu-btn]'),
//   menu: document.querySelector('[data-menu]'),
//   menuLink: document.querySelectorAll('[data-menu-link]'),
// };

// refs.openMenuBtn.addEventListener('click', () => {
//   toggleMenu();
// });

// refs.menuLink.forEach(function (link) {
//   link.addEventListener('click', () => {
//     toggleMenu();
//   });
// });

// function toggleMenu() {
//   if (window.innerWidth < 1280) {
//     const expanded = refs.openMenuBtn.getAttribute('aria-expanded') === 'true' || false;

//     refs.openMenuBtn.classList.toggle('is-active');
//     refs.openMenuBtn.setAttribute('aria-expanded', !expanded);
//     refs.body.classList.toggle('scroll-hidden');
//     refs.menu.classList.toggle('is-open');
//   }
// }
