/* ============================================
   VITANERAL LANDING PAGE — MAIN JS
   GSAP Animations & Interactions
   ============================================ */

// Preloader
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('done');
    }, 800);
  }
  // Recalcular posiciones de ScrollTrigger después del load completo
  // (las imágenes lazy-loaded cambian la altura del documento)
  if (window.ScrollTrigger) {
    requestAnimationFrame(() => ScrollTrigger.refresh());
    setTimeout(() => ScrollTrigger.refresh(), 1200);
  }
});

// Fallback de seguridad: si un .reveal queda invisible tras 2.5s, mostrarlo igual
window.addEventListener('load', () => {
  setTimeout(() => {
    document.querySelectorAll('.reveal').forEach((el) => {
      const style = window.getComputedStyle(el);
      if (parseFloat(style.opacity) < 0.1) {
        el.style.opacity = '1';
        el.style.transform = 'none';
      }
    });
  }, 2500);
});

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  // ScrollTrigger defaults: evitar recálculos intensos durante scroll
  ScrollTrigger.config({ ignoreMobileResize: true });
  ScrollTrigger.defaults({ fastScrollEnd: true });

  // Lenis smooth scroll — desactivado en touch para evitar titileo en mobile
  const isTouch = matchMedia('(pointer: coarse)').matches;
  const lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false,
    touchMultiplier: 1.5,
    syncTouch: false,
  });

  // Connect Lenis to GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  initNavbar();
  initRevealAnimations();
  initHeroAnimations();
  initFAQ();
  initParallax();
  initFlavorHover();
  initFloatingCta();
  initNutriTabs();
  initScrollProgress();
  initCardTilt();
  initCountUp();
  initComparePop();
  initScienceCards();
  initCarouselHints();
  initResponsiveVideos();
  initSolutionEntrance();
});

/* ============================================
   SOLUCIÓN: entrance stagger para estuches y feature cards
   ============================================ */
function initSolutionEntrance() {
  const products = document.querySelectorAll('.solution__product');
  if (products.length) {
    ScrollTrigger.create({
      trigger: '.solution__products',
      start: 'top 82%',
      once: true,
      onEnter: () => {
        products.forEach((p, i) => {
          setTimeout(() => p.classList.add('is-visible'), i * 140);
        });
      },
    });
  }

  const features = document.querySelectorAll('.solution__feature-card');
  if (features.length) {
    ScrollTrigger.create({
      trigger: '.solution__features',
      start: 'top 85%',
      once: true,
      onEnter: () => {
        features.forEach((f, i) => {
          setTimeout(() => f.classList.add('is-visible'), i * 80);
        });
      },
    });
  }
}

/* ============================================
   VIDEOS RESPONSIVOS: swap src según viewport
   ============================================ */
function initResponsiveVideos() {
  const videos = document.querySelectorAll('video[data-src-mobile]');
  videos.forEach((video) => {
    const w = window.innerWidth;
    const src =
      w < 768 ? video.dataset.srcMobile :
      w < 1280 ? video.dataset.srcTablet :
      video.dataset.srcDesktop;
    if (src && video.getAttribute('src') !== src) {
      video.setAttribute('src', src);
      video.load();
    }
  });
}

/* ============================================
   SWIPE HINT: micro-bounce del primer card en carruseles mobile
   ============================================ */
function initCarouselHints() {
  if (!matchMedia('(max-width: 900px)').matches) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const carousels = [
    document.querySelector('.compare-visual'),
    document.querySelector('.testimonials__grid'),
  ].filter(Boolean);

  carousels.forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 70%',
      once: true,
      onEnter: () => {
        // pequeño delay para que el hint se vea después del reveal
        setTimeout(() => el.classList.add('is-hinted'), 450);
      },
    });
  });
}

/* ============================================
   CIENCIA Y CERTIFICACIONES: stagger entry + icon pop
   ============================================ */
function initScienceCards() {
  const cards = document.querySelectorAll('.science__card');
  if (!cards.length) return;
  ScrollTrigger.create({
    trigger: '.science__grid',
    start: 'top 85%',
    once: true,
    onEnter: () => {
      cards.forEach((card, i) => {
        setTimeout(() => card.classList.add('is-visible'), i * 75);
      });
    },
  });
}

/* ============================================
   COUNT-UP (números que cuentan de 0 al valor final)
   ============================================ */
function initCountUp() {
  const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Targets: .count-up y .nutri__highlight-value
  const targets = document.querySelectorAll('.count-up, .nutri__highlight-value');

  targets.forEach((el) => {
    const original = el.textContent.trim();
    const match = original.match(/^(-?\d+(?:[.,]\d+)?)/);
    if (!match) return;

    const finalStr = match[1];
    const sep = finalStr.includes(',') ? ',' : '.';
    const finalNumber = parseFloat(finalStr.replace(',', '.'));
    const decimals = finalStr.includes('.') || finalStr.includes(',')
      ? finalStr.split(/[.,]/)[1].length
      : 0;

    if (prefersReduced) return; // respeta preferencia

    // Formatea y muestra 0 inicial
    el.textContent = formatNumber(0, decimals, sep);

    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        const state = { val: 0 };
        gsap.to(state, {
          val: finalNumber,
          duration: 1.4,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = formatNumber(state.val, decimals, sep);
          },
          onComplete: () => {
            // asegura el valor exacto final (evita 2.559999)
            el.textContent = formatNumber(finalNumber, decimals, sep);
          },
        });
      },
    });
  });

  function formatNumber(val, decimals, sep) {
    const fixed = val.toFixed(decimals);
    return decimals > 0 ? fixed.replace('.', sep) : Math.floor(val).toString();
  }
}

/* ============================================
   COMPARATIVA: pop-in de ✓/✗ al entrar la card al viewport
   ============================================ */
function initComparePop() {
  const cards = document.querySelectorAll('.compare-visual__card');
  cards.forEach((card) => {
    ScrollTrigger.create({
      trigger: card,
      start: 'top 82%',
      once: true,
      onEnter: () => {
        const spans = card.querySelectorAll('li span');
        spans.forEach((span, i) => {
          setTimeout(() => span.classList.add('pop-in'), i * 70);
        });
      },
    });
  });
}

/* ============================================
   NAVBAR
   ============================================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  // Scroll behavior
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Hamburger toggle
  if (hamburger && mobileMenu) {
    const closeMenu = () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.classList.remove('menu-open');
    };
    const openMenu = () => {
      hamburger.classList.add('active');
      mobileMenu.classList.add('active');
      document.body.classList.add('menu-open');
    };

    hamburger.addEventListener('click', () => {
      mobileMenu.classList.contains('active') ? closeMenu() : openMenu();
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close tapping outside the links (on background/overlay)
    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) closeMenu();
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) closeMenu();
    });

    // Close when clicking the navbar logo while menu is open
    const logo = document.querySelector('.navbar__logo');
    if (logo) {
      logo.addEventListener('click', () => {
        if (mobileMenu.classList.contains('active')) closeMenu();
      });
    }
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Active section indicator
  const navLinks = document.querySelectorAll('.navbar__links a[href^="#"]');
  const sections = [];
  navLinks.forEach(link => {
    const section = document.querySelector(link.getAttribute('href'));
    if (section) sections.push({ link, section });
  });

  if (sections.length) {
    sections.forEach(({ link, section }) => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 40%',
        end: 'bottom 40%',
        onEnter: () => setActiveLink(link),
        onEnterBack: () => setActiveLink(link),
        onLeave: () => link.classList.remove('active'),
        onLeaveBack: () => link.classList.remove('active'),
      });
    });
  }

  function setActiveLink(activeLink) {
    navLinks.forEach(l => l.classList.remove('active'));
    activeLink.classList.add('active');
  }
}

/* ============================================
   HERO ANIMATIONS
   ============================================ */
function initHeroAnimations() {
  const tl = gsap.timeline({ delay: 0.3 });

  tl.from('.hero__title', {
    opacity: 0,
    y: 40,
    duration: 0.8,
    ease: 'power3.out',
  })
  .from('.hero__desc', {
    opacity: 0,
    y: 20,
    duration: 0.5,
    ease: 'power3.out',
  }, '-=0.3')
  .from('.hero__cta', {
    opacity: 0,
    scale: 0.9,
    duration: 0.5,
    ease: 'back.out(1.7)',
  }, '-=0.2')
  .from('.hero__badge-item', {
    opacity: 0,
    y: 20,
    duration: 0.4,
    stagger: 0.1,
    ease: 'power3.out',
  }, '-=0.2')
  .from('.hero__scroll-indicator', {
    opacity: 0,
    y: 20,
    duration: 0.5,
    ease: 'power3.out',
  }, '-=0.1');
}

/* ============================================
   SCROLL REVEAL ANIMATIONS
   ============================================ */
function initRevealAnimations() {
  // Generic reveals — batched (1 trigger en vez de N para evitar recálculos en cada scroll)
  ScrollTrigger.batch('.reveal', {
    start: 'top 85%',
    once: true,
    onEnter: (batch) => {
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power3.out',
        overwrite: 'auto',
        onComplete: function () {
          batch.forEach((el) => {
            el.style.willChange = 'auto';
          });
        },
      });
    },
  });

  // Problem cards stagger — toggle CSS class so border-radius stays intact on composited layers
  const problemCards = gsap.utils.toArray('.problem__card');
  ScrollTrigger.create({
    trigger: '.problem__cards',
    start: 'top 80%',
    once: true,
    onEnter: () => {
      problemCards.forEach((card, i) => {
        setTimeout(() => card.classList.add('is-visible'), i * 150);
      });
    },
  });

  // HMB image: reveal cinematográfico (clip-path + zoom-out)
  const hmbImage = document.querySelector('.hmb-hero__image');
  if (hmbImage) {
    ScrollTrigger.create({
      trigger: hmbImage,
      start: 'top 75%',
      once: true,
      onEnter: () => hmbImage.classList.add('is-visible'),
    });
  }


  // Helper: stagger .is-visible en grupos de cards
  staggerCards('.benefits__grid', '.benefit__card', 90);
  staggerCards('.testimonials__grid', '.testimonial__card', 100);
  staggerCards('.faq__list', '.faq__item', 70);
  staggerCards('.vamos-gallery__grid', '.vamos-gallery__item', 160);
}

function staggerCards(triggerSel, itemSel, delay) {
  const items = document.querySelectorAll(itemSel);
  if (!items.length) return;
  ScrollTrigger.create({
    trigger: triggerSel,
    start: 'top 82%',
    once: true,
    onEnter: () => {
      items.forEach((el, i) => {
        setTimeout(() => el.classList.add('is-visible'), i * delay);
      });
    },
  });
}

/* ============================================
   FAQ ACCORDION
   ============================================ */
function initFAQ() {
  const items = document.querySelectorAll('.faq__item');

  items.forEach(item => {
    const question = item.querySelector('.faq__question');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all
      items.forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
      });

      // Open clicked (if wasn't active)
      if (!isActive) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ============================================
   PARALLAX EFFECTS
   ============================================ */
function initParallax() {
  // Hero content fade out on scroll
  gsap.to('.hero__content', {
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: '60% top',
      scrub: 1,
    },
    y: -60,
    opacity: 0,
  });

  // CTA final: sin animación de entrada — es sección crítica, siempre visible
  // (antes causaba intermitencia cuando ScrollTrigger fallaba)

}

/* ============================================
   FLAVOR CARDS HOVER
   ============================================ */
function initFlavorHover() {
  const tabs = document.querySelectorAll('.flavor-tab');
  if (!tabs.length) return;

  const bgVainilla = document.querySelector('.flavor-hero__bg--vainilla');
  const bgChocolate = document.querySelector('.flavor-hero__bg--chocolate');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.flavor;
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      if (bgVainilla && bgChocolate) {
        bgVainilla.classList.toggle('active', target === 'vainilla');
        bgChocolate.classList.toggle('active', target === 'chocolate');
      }
    });
  });
}


/* ============================================
   FLOATING CTA MOBILE
   ============================================ */
function initFloatingCta() {
  if (window.innerWidth >= 768) return;

  const btn = document.getElementById('floatingCta');
  if (!btn) return;

  ScrollTrigger.create({
    trigger: '#problema',
    start: 'top 80%',
    onEnter: () => btn.classList.add('visible'),
    onLeaveBack: () => btn.classList.remove('visible'),
  });

  // Hide near footer to avoid overlap
  ScrollTrigger.create({
    trigger: '#footer',
    start: 'top bottom',
    onEnter: () => btn.classList.remove('visible'),
    onLeaveBack: () => btn.classList.add('visible'),
  });
}

/* ============================================
   NUTRITIONAL TABS
   ============================================ */
function initNutriTabs() {
  const tabs = document.querySelectorAll('.nutri__tab');
  const panels = document.querySelectorAll('.nutri__panel');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      document.getElementById('panel-' + target).classList.add('active');

      // Switch background image
      const bgVainilla = document.querySelector('.nutri-section__bg--vainilla');
      const bgChocolate = document.querySelector('.nutri-section__bg--chocolate');
      if (bgVainilla && bgChocolate) {
        bgVainilla.classList.toggle('active', target === 'vainilla');
        bgChocolate.classList.toggle('active', target === 'chocolate');
      }

      // Close any open table when switching tabs
      document.querySelectorAll('.nutri__collapsible').forEach(c => c.classList.remove('open'));
    });
  });

  // Table toggle
  document.querySelectorAll('.nutri__toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const collapsible = btn.closest('.nutri__collapsible');
      const isOpen = collapsible.classList.toggle('open');
      btn.querySelector('span').textContent = isOpen ? 'Ocultar tabla nutricional' : 'Ver tabla nutricional completa';
    });
  });
}

/* ============================================
   SCROLL PROGRESS BAR
   ============================================ */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    bar.style.width = progress + '%';

    // Back to top visibility
    if (backToTop) {
      if (scrollTop > 600) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
  });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* ============================================
   CARD TILT EFFECT
   ============================================ */
function initCardTilt() {
  if (window.innerWidth < 768) return;

  const cards = document.querySelectorAll('.problem__card, .benefit__card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -6;
      const rotateY = (x - centerX) / centerX * 6;

      card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}
