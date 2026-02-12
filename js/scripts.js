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

  // ===== Apple scrolly (FULL experience: dynamic scale/opacity/blur) =====
  const scrolly = document.querySelector(".apple-scrolly");
  const list = document.getElementById("appleOfferList");
  const cards = list ? Array.from(list.querySelectorAll(".apple-card")) : [];
  const currentEl = document.getElementById("appleOfferCurrent");
  const progressEl = document.getElementById("appleOfferProgress");

  if (!scrolly || !cards.length) return;

  const total = cards.length;

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  // Настройки эффекта (можно менять)
  const SETTINGS = {
    focusY: 0.45,      // где “центр внимания” по высоте экрана
    maxBlur: 6,        // максимум blur для дальних
    minScale: 0.965,   // минимальный scale
    maxScale: 1.00,    // scale в фокусе
    minOpacity: 0.45,  // минимальная opacity
    maxOpacity: 1.00   // opacity в фокусе
  };

  const updateApple = () => {
    const focusYpx = window.innerHeight * SETTINGS.focusY;

    // Находим активную по минимальной дистанции
    let bestIdx = 0;
    let bestDist = Infinity;

    const rects = cards.map((card) => {
      const r = card.getBoundingClientRect();
      const center = r.top + r.height / 2;
      const dist = Math.abs(center - focusYpx);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = rects.length; // текущий индекс
        bestDist = dist;
      }
      return { r, center, dist };
    });

    // Нормализация расстояния (0..1), где 0 = в фокусе
    // Берём “радиус влияния” примерно 55% высоты экрана
    const radius = window.innerHeight * 0.55;

    cards.forEach((card, i) => {
      const { dist } = rects[i];
      const t = clamp(dist / radius, 0, 1);  // 0..1

      // плавные кривые (Apple feel)
      // ближе к фокусу — сильнее эффект
      const ease = 1 - Math.pow(t, 1.6);

      const scale = lerp(SETTINGS.minScale, SETTINGS.maxScale, ease);
      const opacity = lerp(SETTINGS.minOpacity, SETTINGS.maxOpacity, ease);
      const blur = lerp(SETTINGS.maxBlur, 0, ease);

      // небольшая “глубина” по Y
      const lift = lerp(18, 0, ease);

      card.style.transform = `translateY(${lift}px) scale(${scale})`;
      card.style.opacity = `${opacity}`;
      card.style.filter = `blur(${blur}px)`;

      card.classList.toggle("is-active", i === bestIdx);
      card.classList.toggle("is-next", i === bestIdx + 1);
    });

    // счетчик
    const step = bestIdx + 1;
    if (currentEl) {
      const a = String(step).padStart(2, "0");
      const b = String(total).padStart(2, "0");
      currentEl.textContent = `${a} / ${b}`;
    }

    // прогресс
    const p = ((step - 1) / (total - 1 || 1)) * 100;
    if (progressEl) progressEl.style.width = `${clamp(p, 0, 100)}%`;
  };

  // RAF throttle
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateApple();
      ticking = false;
    });
  };

  if (!prefersReducedMotion) {
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    updateApple();
  } else {
    // без анимаций — просто активируем первую
    cards.forEach((c, i) => {
      c.style.transform = "none";
      c.style.opacity = "1";
      c.style.filter = "none";
      c.classList.toggle("is-active", i === 0);
    });
    if (currentEl) currentEl.textContent = `01 / ${String(total).padStart(2, "0")}`;
    if (progressEl) progressEl.style.width = "0%";
  }
});

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  updateActive();
});
