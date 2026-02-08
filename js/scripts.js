/*!
* Start Bootstrap - Grayscale v7.0.6
*/

window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink
    const navbarShrink = () => {
        const navbar = document.querySelector('#mainNav');
        if (!navbar) return;
        navbar.classList.toggle('navbar-shrink', window.scrollY !== 0);
    };
    navbarShrink();
    document.addEventListener('scroll', navbarShrink);

    // ScrollSpy
    const mainNav = document.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    }

    // Collapse menu on click
    const navbarToggler = document.querySelector('.navbar-toggler');
    document.querySelectorAll('#navbarResponsive .nav-link')
        .forEach(link => {
            link.addEventListener('click', () => {
                if (window.getComputedStyle(navbarToggler).display !== 'none') {
                    navbarToggler.click();
                }
            });
        });

// Scroll reveal animation
const revealElements = document.querySelectorAll(
    '.reveal-left, .reveal-right'
);

const revealOnScroll = () => {
    revealElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 120) {
            el.classList.add('active');
        }
    });
};

revealOnScroll();
window.addEventListener('scroll', revealOnScroll);
});
