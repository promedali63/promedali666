document.addEventListener("DOMContentLoaded", () => {
  // Не даём браузеру “восстанавливать” скролл и прыгать
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  // ===== Reveal (совместимо с is-visible/active/visible) =====
  const revealItems = Array.from(document.querySelectorAll(".reveal"));

  revealItems.forEach((el) => {
    const d = el.getAttribute("data-delay");
    if (d) {
      const ms = parseInt(d, 10);
      if (!Number.isNaN(ms)) el.style.transitionDelay = ${ms}ms;
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

  // ===== Full Apple scrolly =====
  const scrolly = document.querySelector(".apple-scrolly");
  const left = scrolly ? scrolly.querySelector(".apple-scrolly__left") : null;
  const list = document.getElementById("appleOfferList");
  const cards = list ? Array.from(list.querySelectorAll(".apple-card")) : [];
  const currentEl = document.getElementById("appleOfferCurrent");
  const progressEl = document.getElementById("appleOfferProgress");

  // Если блока нет — просто выходим (остальное работает)
  if (!scrolly || !cards.length) return;

  const total = cards.length;
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  const SETTINGS = {
    focusY: 0.45, // фокус чуть выше центра
    radius: 0.58, // радиус влияния (высота экрана)
    maxBlur: 6,
    minScale: 0.965,
    maxScale: 1.0,
    minOpacity: 0.42,
    maxOpacity: 1.0,
  };

  const getRects = (focusYpx) =>
    cards.map((card) => {
      const r = card.getBoundingClientRect();
      const center = r.top + r.height / 2;
      const dist = Math.abs(center - focusYpx);
      return { card, r, center, dist };
    });

  const updateApple = () => {
    const focusYpx = window.innerHeight * SETTINGS.focusY;
    const radiusPx = window.innerHeight * SETTINGS.radius;

    const rects = getRects(focusYpx);

    // активная = ближе всего к focus
    let bestIdx = 0;
    let bestDist = Infinity;
    rects.forEach((x, i) => {
      if (x.dist < bestDist) {
        bestDist = x.dist;
        bestIdx = i;
      }
    });

    rects.forEach((x, i) => {
      const t = clamp(x.dist / radiusPx, 0, 1); // 0..1
      const ease = 1 - Math.pow(t, 1.6); // Apple-like curve

      const scale = lerp(SETTINGS.minScale, SETTINGS.maxScale, ease);
      const opacity = lerp(SETTINGS.minOpacity, SETTINGS.maxOpacity, ease);
      const blur = lerp(SETTINGS.maxBlur, 0, ease);
      const lift = lerp(18, 0, ease);

      x.card.style.transform = translateY(${lift}px) scale(${scale});
      x.card.style.opacity = ${opacity};
      x.card.
style.filter = blur(${blur}px);

      x.card.classList.toggle("is-active", i === bestIdx);
      x.card.classList.toggle("is-next", i === bestIdx + 1);
    });

    // счетчик + прогресс
    const step = bestIdx + 1;
    if (currentEl) {
      currentEl.textContent = ${String(step).padStart(2, "0")} / ${String(total).padStart(2, "0")};
    }
    const p = ((step - 1) / (total - 1 || 1)) * 100;
    if (progressEl) progressEl.style.width = ${clamp(p, 0, 100)}%;

    // анимация левого sticky блока (0..1)
    if (left) {
      const sr = scrolly.getBoundingClientRect();
      const scrollSpan = sr.height - window.innerHeight;
      const progressed = clamp((-sr.top) / (scrollSpan || 1), 0, 1);
      left.style.setProperty("--t", progressed.toFixed(4));
    }

    return bestIdx;
  };

  // ===== Snap к ближайшей карточке (включается только после первого действия пользователя) =====
  let userStartedScrolling = false;

  const enableSnapOnFirstUserScroll = () => {
    userStartedScrolling = true;
    window.removeEventListener("wheel", enableSnapOnFirstUserScroll);
    window.removeEventListener("touchstart", enableSnapOnFirstUserScroll);
    window.removeEventListener("keydown", enableSnapOnFirstUserScroll);
  };

  window.addEventListener("wheel", enableSnapOnFirstUserScroll, { passive: true });
  window.addEventListener("touchstart", enableSnapOnFirstUserScroll, { passive: true });
  window.addEventListener("keydown", enableSnapOnFirstUserScroll);

  let snapTimer = null;

  const snapToCard = (idx) => {
    const card = cards[idx];
    if (!card) return;

    const top =
      card.getBoundingClientRect().top +
      window.pageYOffset -
      window.innerHeight * SETTINGS.focusY +
      card.getBoundingClientRect().height / 2;

    window.scrollTo({ top, behavior: "smooth" });
  };

  const scheduleSnap = (activeIdx) => {
    clearTimeout(snapTimer);
    snapTimer = setTimeout(() => snapToCard(activeIdx), 170);
  };

  // ===== RAF throttle =====
  let ticking = false;

  const onScroll = () => {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const idx = updateApple();

      // Snap только если пользователь начал скроллить
      if (!prefersReducedMotion && userStartedScrolling) {
        scheduleSnap(idx);
      }

      ticking = false;
    });
  };

  if (!prefersReducedMotion) {
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    updateApple();
  } else {
    // без анимаций
    cards.forEach((c, i) => {
      c.style.transform = "none";
      c.style.opacity = "1";
      c.style.filter = "none";
      c.classList.toggle("is-active", i === 0);
    });
    if (currentEl) currentEl.textContent = 01 / ${String(total).padStart(2, "0")};
    if (progressEl) progressEl.style.width = "0%";
  }
});
