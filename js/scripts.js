document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  // apply delays from data-delay
  items.forEach((el) => {
    const d = el.getAttribute("data-delay");
    if (d) {
      const ms = parseInt(d, 10);
      if (!Number.isNaN(ms)) el.style.transitionDelay = `${ms}ms`;
    }
  });

  const makeVisible = (el) => {
    el.classList.add("is-visible", "active", "visible");
  };

  // Respect reduced motion
  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    items.forEach(makeVisible);
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          makeVisible(entry.target);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
  );

  items.forEach((el) => io.observe(el));
});
