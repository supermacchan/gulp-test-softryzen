const refs = {
  body: document.querySelector('body'),
  modal: document.querySelector('[data-modal]'),
  openModalBtn: document.querySelectorAll('[data-modal-open]'),
  closeModalBtn: document.querySelector('[data-modal-close]'),
};

document.addEventListener('keydown', handleKey);
refs.modal.addEventListener('mousedown', handleClose);
refs.closeModalBtn.addEventListener('click', toggleModal);
refs.openModalBtn.forEach(function (btn) {
  btn.addEventListener('click', e => {
    e.preventDefault();
    toggleModal();
  });
});

function handleKey(e) {
  if (!refs.modal.classList.contains('is-hidden')) {
    if (e.key === 'Escape') {
      toggleModal();
    }
  }
  return;
}

function handleClose(e) {
  if (e.target === e.currentTarget) {
    toggleModal();
  }
  return;
}

function toggleModal() {
  refs.body.classList.toggle('scroll-hidden');
  refs.modal.classList.toggle('is-hidden');
}
