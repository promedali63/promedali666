document.addEventListener("DOMContentLoaded", () => {
  // ===== Reveal (совместимо с is-visible/active/visible) =====
  const revealItems = Array.from(document.querySelectorAll(".reveal"));

  revealItems.forEach((el) => {
    const d = el.getAttribute("data-delay");
    if (d) {
      const ms = parseInt(d, 10);
      if (!Number.isNaN(ms)) el.style.transitionDelay = `${ms}ms`;
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

  // ===== Smooth scroll for anchors =====
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

  // ===== Apple scrolly logic =====
  const scrolly = document.querySelector(".apple-scrolly");
  const list = document.getElementById("appleOfferList");
  const cards = list ? Array.from(list.querySelectorAll(".apple-card")) : [];
  const currentEl = document.getElementById("appleOfferCurrent");
  const progressEl = document.getElementById("appleOfferProgress");

  if (!scrolly || !cards.length) return;

  const total = cards.length;

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  const updateActive = () => {
    // точка фокуса — центр экрана (чуть выше центра)
    const focusY = window.innerHeight * 0.45;

    // найдём карточку, чей центр ближе всего к focusY
    let bestIdx = 0;
    let bestDist = Infinity;

    cards.forEach((card, idx) => {
      const r = card.getBoundingClientRect();
      const center = r.top + r.height / 2;
      const dist = Math.abs(center - focusY);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = idx;
      }
    });

    // классы состояния
    cards.forEach((c, i) => {
      c.classList.toggle("is-active", i === bestIdx);
      c.classList.toggle("is-next", i === bestIdx + 1);
    });

    // счетчик 01/05
    const step = bestIdx + 1;
    if (currentEl) {
      const a = String(step).padStart(2, "0");
      const b = String(total).padStart(2, "0");
      currentEl.textContent = `${a} / ${b}`;
    }

    // прогресс (0..100)
    const p = ((step - 1) / (total - 1 || 1)) * 100;
    if (progressEl) progressEl.style.width = `${clamp(p, 0, 100)}%`;
  };

  // мягкое обновление по скроллу
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateActive();
      ticking = false;
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  updateActive();
});
