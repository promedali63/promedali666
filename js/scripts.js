// Reveal animations (появление при скролле)
const revealEls = document.querySelectorAll(".reveal");

const obs = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      const delay = e.target.getAttribute("data-delay");
      if (delay) e.target.style.transitionDelay = `${delay}ms`;
      e.target.classList.add("is-visible");
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.14 });

revealEls.forEach(el => obs.observe(el));
