window.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('#mainNav');

  function navbarShrink() {
    if (window.scrollY === 0) {
      navbar.classList.remove('navbar-shrink');
    } else {
      navbar.classList.add('navbar-shrink');
    }
  }

  navbarShrink();
  document.addEventListener('scroll', navbarShrink);
});
