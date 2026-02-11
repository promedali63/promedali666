// Reveal animations (IntersectionObserver)
const revealEls = document.querySelectorAll('.reveal');

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    const el = entry.target;
    const delay = parseInt(el.dataset.delay || '0', 10);

    // Apply delay only once (nice stagger)
    if (delay) el.style.transitionDelay = `${delay}ms`;

    el.classList.add('is-visible');
    io.unobserve(el);
  });
}, { threshold: 0.18 });

revealEls.forEach((el) => io.observe(el));