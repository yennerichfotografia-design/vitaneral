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
});

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  // Lenis smooth scroll
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
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
  initCustomCursor();
  initCardTilt();
  initMagneticButtons();
  initTextSplit();
  initCurtainEffect();
});

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
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
      });
    });
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
  // Generic reveals
  const reveals = document.querySelectorAll('.reveal');
  reveals.forEach((el) => {
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
    });
  });

  // Problem cards stagger
  gsap.to('.problem__card', {
    scrollTrigger: {
      trigger: '.problem__cards',
      start: 'top 80%',
    },
    opacity: 1,
    y: 0,
    duration: 0.6,
    stagger: 0.15,
    ease: 'power3.out',
  });

  // Benefits cards stagger
  gsap.to('.benefit__card', {
    scrollTrigger: {
      trigger: '.benefits__grid',
      start: 'top 80%',
    },
    opacity: 1,
    y: 0,
    duration: 0.6,
    stagger: 0.12,
    ease: 'power3.out',
  });

  // Testimonial cards stagger
  gsap.to('.testimonial__card', {
    scrollTrigger: {
      trigger: '.testimonials__grid',
      start: 'top 80%',
    },
    opacity: 1,
    y: 0,
    duration: 0.6,
    stagger: 0.15,
    ease: 'power3.out',
  });

  // FAQ items stagger
  gsap.to('.faq__item', {
    scrollTrigger: {
      trigger: '.faq__list',
      start: 'top 80%',
    },
    opacity: 1,
    y: 0,
    duration: 0.5,
    stagger: 0.1,
    ease: 'power3.out',
  });

  // Compare table
  gsap.to('.compare__table-wrapper', {
    scrollTrigger: {
      trigger: '.compare__table-wrapper',
      start: 'top 80%',
    },
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
  });

  // Table rows animate
  gsap.to('.compare__table tbody tr', {
    scrollTrigger: {
      trigger: '.compare__table',
      start: 'top 75%',
    },
    opacity: 1,
    x: 0,
    duration: 0.5,
    stagger: 0.08,
    ease: 'power3.out',
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

  // CTA section entrance
  gsap.from('.cta-final__inner', {
    scrollTrigger: {
      trigger: '.section--cta',
      start: 'top 80%',
    },
    opacity: 0,
    scale: 0.95,
    duration: 0.8,
    ease: 'power3.out',
  });

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
   CUSTOM CURSOR
   ============================================ */
function initCustomCursor() {
  if (window.innerWidth < 768) return;

  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  // Smooth follower
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover states
  const hoverElements = document.querySelectorAll('a, button, .btn, .flavor__card, .problem__card, .benefit__card, .testimonial__card, .faq__question');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
      follower.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
      follower.classList.remove('hover');
    });
  });
}

/* ============================================
   CARD TILT EFFECT
   ============================================ */
function initCardTilt() {
  if (window.innerWidth < 768) return;

  const cards = document.querySelectorAll('.problem__card, .benefit__card, .solution__card');

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

/* ============================================
   MAGNETIC BUTTONS
   ============================================ */
function initMagneticButtons() {
  if (window.innerWidth < 768) return;

  const buttons = document.querySelectorAll('.btn');

  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.4,
        ease: 'elastic.out(1, 0.5)',
        clearProps: 'transform',
      });
    });
  });
}

/* ============================================
   TEXT SPLIT / WORD REVEAL ANIMATIONS
   ============================================ */
function initTextSplit() {
  // Animate section titles word by word
  const titles = document.querySelectorAll('.section__title');

  titles.forEach(title => {
    const text = title.textContent;
    const words = text.split(' ');
    title.innerHTML = words.map(word => `<span class="word-wrap"><span class="word">${word}</span></span>`).join(' ');

    gsap.from(title.querySelectorAll('.word'), {
      scrollTrigger: {
        trigger: title,
        start: 'top 85%',
      },
      y: 40,
      opacity: 0,
      duration: 0.6,
      stagger: 0.06,
      ease: 'power3.out',
    });
  });
}

/* ============================================
   CURTAIN EFFECT
   ============================================ */
function initCurtainEffect() {
  if (window.innerWidth < 768) return;

  const hero = document.getElementById('hero');
  if (hero) {
    ScrollTrigger.create({
      trigger: hero,
      start: 'bottom bottom',
      end: () => '+=' + window.innerHeight * 0.3,
      pin: true,
      pinSpacing: false,
    });
  }

  const lifestyle = document.getElementById('lifestyleImg');
  if (lifestyle) {
    ScrollTrigger.create({
      trigger: lifestyle,
      start: 'bottom bottom',
      end: () => '+=' + window.innerHeight * 0.3,
      pin: true,
      pinSpacing: false,
    });
  }
}
