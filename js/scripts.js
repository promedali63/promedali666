document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".header");
  const headerOffset = () => (header ? header.offsetHeight : 0);

  // ===== REVEAL ANIMATION (совместимо с разными классами) =====
  const revealItems = Array.from(document.querySelectorAll(".reveal"));

  // проставляем задержки из data-delay
  revealItems.forEach((el) => {
    const d = el.getAttribute("data-delay");
    if (d) {
      const ms = parseInt(d, 10);
      if (!Number.isNaN(ms)) el.style.transitionDelay = `${ms}ms`;
    }
  });

  const makeVisible = (el) => {
    el.classList.add("is-visible", "active", "visible");
  };

  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (revealItems.length) {
    if (prefersReducedMotion) {
      revealItems.forEach(makeVisible);
    } else if (!("IntersectionObserver" in window)) {
      // Фолбэк для старых браузеров
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
        {
          threshold: 0.12,
          rootMargin: "0px 0px -12% 0px",
        }
      );

      revealItems.forEach((el) => io.observe(el));
    }
  }

  // ===== SMOOTH SCROLL FOR ANCHORS =====
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

  // ===== NAV ACTIVE LINK (optional) =====
  const sections = Array.from(document.querySelectorAll("section[id]"));
  const navLinks = Array.from(document.querySelectorAll(".nav a[href^='#']"));

  const setActiveNav = () => {
    if (!sections.length || !navLinks.length) return;

    const y = window.pageYOffset + headerOffset() + 40;
    let currentId = sections[0].id;

    for (const sec of sections) {
      if (sec.offsetTop <= y) currentId = sec.id;
    }

    navLinks.forEach((a) => {
      a.classList.toggle("is-active", a.getAttribute("href") === `#${currentId}`);
    });
  };

  const throttle = (fn, wait = 120) => {
    let last = 0;
    let timer = null;
    return (...args) => {
      const now = Date.now();
      const remaining = wait - (now - last);
      if (remaining <= 0) {
        last = now;
        fn(...args);
      } else {
        clearTimeout(timer);
        timer = setTimeout(() => {
          last = Date.now();
          fn(...args);
        }, remaining);
      }
    };
  };

  window.addEventListener("scroll", throttle(setActiveNav, 120), { passive: true });
  setActiveNav();
});
