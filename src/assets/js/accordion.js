// document
//   .querySelectorAll('.accordion-item')
//   .forEach(item => item.addEventListener('click', toggleAccordion));

// function toggleAccordion(e) {
//   const currentTarget = e.currentTarget;
//   const target = e.target;

//   if (currentTarget !== target) {
//     return;
//   }

//   const ariaExpanded = target.getAttribute('aria-expanded');
//   const accordionAnswer = currentTarget.querySelector('.accordion-answer');

//   if (ariaExpanded === 'false') {
//     target.setAttribute('aria-expanded', 'true');
//     accordionAnswer.style.maxHeight = accordionAnswer.scrollHeight + 'px';
//   } else {
//     target.setAttribute('aria-expanded', 'false');
//     accordionAnswer.style.maxHeight = 0;
//   }
// }
