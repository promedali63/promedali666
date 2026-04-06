document.addEventListener("DOMContentLoaded", () => {
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

  const header = document.querySelector(".header");
  const headerOffset = () => (header ? header.offsetHeight : 0);

  const burger = document.querySelector(".burger");
  const nav = document.querySelector(".nav");

  if (burger && nav) {
    burger.addEventListener("click", () => {
      nav.classList.toggle("open");
      const isOpen = nav.classList.contains("open");
      burger.setAttribute("aria-expanded", isOpen ? "true" : "false");
      document.body.classList.toggle("menu-open", isOpen);
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");
      });
    });
  }

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
      window.scrollTo({ top, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  });

  const stepsWrap = document.getElementById("processSteps");
  const fill = document.getElementById("processFill");

  if (stepsWrap) {
    const steps = Array.from(stepsWrap.querySelectorAll(".pstep"));
    const dots = stepsWrap.querySelectorAll(".pstep-dot");

    dots.forEach((btn, idx) => {
      btn.addEventListener("click", () => {
        const card = steps[idx];
        if (!card) return;
        const top =
          card.getBoundingClientRect().top +
          window.pageYOffset -
          headerOffset() -
          28;
        window.scrollTo({ top, behavior: prefersReducedMotion ? "auto" : "smooth" });
      });
    });

    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

    const setActive = () => {
      const isDesktop = window.matchMedia("(min-width: 981px)").matches;

      const focusY = window.innerHeight * 0.45;
      let bestIdx = 0;
      let bestDist = Infinity;

      steps.forEach((s, i) => {
        const r = s.getBoundingClientRect();
        const center = r.top + r.height * 0.35;
        const dist = Math.abs(center - focusY);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = i;
        }
      });

      steps.forEach((s, i) => s.classList.toggle("is-active", i === bestIdx));

      if (fill && isDesktop && steps.length > 1) {
        const p = (bestIdx / (steps.length - 1)) * 100;
        fill.style.width = `${clamp(p, 0, 100)}%`;
      } else if (fill) {
        fill.style.width = "0%";
      }
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(


) => {
        setActive();
        ticking = false;
      });
    };

    if (!prefersReducedMotion) {
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
    }
    setActive();
  }
});(



c

