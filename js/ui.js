// Меню: без JavaScript ссылки остаются видимыми.
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.getElementById('primary-nav');
const mobileMenu = window.matchMedia('(max-width: 767px)');

if (menuButton && navigation) {
  function setMenu(open, returnFocus = false) {
    menuButton.setAttribute('aria-expanded', String(open));
    // Короткая видимая подпись не сталкивается с логотипом даже на 320px.
    menuButton.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    navigation.hidden = mobileMenu.matches && !open;
    if (returnFocus) menuButton.focus();
  }

  function syncMenu() {
    // При сужении окна не оставляем фокус в скрытой навигации.
    const wasInside = navigation.contains(document.activeElement);
    const wasOnButton = document.activeElement === menuButton;
    menuButton.hidden = !mobileMenu.matches;
    setMenu(false, mobileMenu.matches && wasInside);
    if (!mobileMenu.matches && wasOnButton) navigation.querySelector('a').focus();
  }

  menuButton.addEventListener('click', () => {
    setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mobileMenu.matches && menuButton.getAttribute('aria-expanded') === 'true') {
      setMenu(false, true);
    }
  });
  navigation.addEventListener('click', (event) => {
    if (mobileMenu.matches && event.target.closest('a')) setMenu(false, true);
  });
  mobileMenu.addEventListener('change', syncMenu);
  syncMenu();
}

// Независимая карусель в каждой карточке. Автопрокрутки нет.
document.querySelectorAll('.product-gallery').forEach((gallery) => {
  const slides = Array.from(gallery.querySelectorAll('.product-gallery__slide'));
  const controls = gallery.querySelector('.product-gallery__controls');
  const status = gallery.querySelector('.product-gallery__status');
  const previous = gallery.querySelector('[data-gallery-direction="-1"]');
  const next = gallery.querySelector('[data-gallery-direction="1"]');
  let current = 0;

  function showSlide(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, position) => { slide.hidden = position !== current; });
    status.textContent = `Фото ${current + 1} из ${slides.length}`;
  }

  previous.addEventListener('click', () => showSlide(current - 1));
  next.addEventListener('click', () => showSlide(current + 1));
  gallery.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showSlide(current + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });

  // Pointer Events работают и для касания, и для пера.
  let touchStart;
  const viewport = gallery.querySelector('.product-gallery__viewport');
  viewport.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'mouse') touchStart = { x: event.clientX, y: event.clientY };
  });
  viewport.addEventListener('pointerup', (event) => {
    if (!touchStart) return;
    const dx = event.clientX - touchStart.x;
    const dy = event.clientY - touchStart.y;
    touchStart = undefined;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) showSlide(current + (dx < 0 ? 1 : -1));
  });
  viewport.addEventListener('pointercancel', () => { touchStart = undefined; });

  controls.hidden = false;
  showSlide(0);
});
