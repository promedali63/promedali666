document.addEventListener("DOMContentLoaded", () => {
  // Reveal прячем только если JS реально включился
  document.documentElement.classList.add("js");

  // ===== Reveal (совместимо с is-visible/active/visible) =====
  const revealItems = Array.from(document.querySelectorAll(".reveal"));

  revealItems.forEach((el) => {
    const d = el.getAttribute("data-delay");
    if (d) {
      const ms = parseInt(d, 10);
      if (!Number.isNaN(ms)) el.style.transitionDelay = `${ms}ms`;
    }
  
  // ===== Process hover/click helper (для телефонов) =====
  const processSteps = Array.from(document.querySelectorAll(".process-step"));
  if (processSteps.length) {
    const clearActive = () => processSteps.forEach(s => s.classList.remove("is-active"));

    processSteps.forEach((step) => {
      step.addEventListener("click", () => {
        const isOn = step.classList.contains("is-active");
        clearActive();
        if (!isOn) step.classList.add("is-active");
      });

      step.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          step.click();
        }
      });
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".process-step")) clearActive();
    });
  }

});

  const makeVisible = (el) => el.classList.add("is-visible", "active", "visible");

  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (revealItems.length) {
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealItems.forEach(makeVisible);
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              makeVisible(entry.target);
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -12% 0px" }
      );
      revealItems.forEach((el) => io.observe(el));
    }
  }

  // ===== Smooth scroll for anchors (без прыжков) =====
  const header = document.querySelector(".header");
  const headerOffset = () => (header ? header.offsetHeight : 0);

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;

      const id = href.slice(1);
      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();

      const top =
        target.getBoundingClientRect().top +
        window.pageYOffset -
        headerOffset() +
        1;

      history.pushState(null, "", href);
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
});
