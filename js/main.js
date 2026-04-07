/* ============================================================
   AGRINHO 2026 — main.js
   Navegação, animações e interatividade
   ============================================================ */

(function () {
  'use strict';

  /* ── Navigation ──────────────────────────────────── */
  const nav = document.querySelector('.nav');
  const burger = document.querySelector('.nav-burger');
  const mobileMenu = document.querySelector('.nav-mobile');

  function handleNavScroll() {
    if (!nav) return;
    if (window.scrollY > 60) {
      nav.classList.remove('transparent');
      nav.classList.add('solid');
    } else {
      nav.classList.add('transparent');
      nav.classList.remove('solid');
    }
  }

  if (nav) {
    // Pages without full hero start solid
    if (nav.dataset.alwaysSolid === 'true') {
      nav.classList.add('solid');
    } else {
      nav.classList.add('transparent');
      window.addEventListener('scroll', handleNavScroll, { passive: true });
      handleNavScroll();
    }
  }

  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      const spans = burger.querySelectorAll('span');
      mobileMenu.classList.contains('open')
        ? (spans[0].style.transform = 'rotate(45deg) translate(5px,5px)',
           spans[1].style.opacity = '0',
           spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)')
        : (spans[0].style.transform = '',
           spans[1].style.opacity = '',
           spans[2].style.transform = '');
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        burger.querySelectorAll('span').forEach(s => {
          s.style.transform = '';
          s.style.opacity = '';
        });
      });
    });
  }

  // Highlight active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Intersection Observer (scroll reveals) ──────── */
  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    revealObserver.observe(el);
  });

  /* ── Animated Data Bars ──────────────────────────── */
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const target = fill.dataset.width || '0';
        setTimeout(() => { fill.style.width = target + '%'; }, 150);
        barObserver.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.data-bar-fill').forEach(bar => {
    barObserver.observe(bar);
  });

  /* ── Animated Counters ───────────────────────────── */
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = eased * target;
      el.textContent = current.toFixed(decimals).replace('.', ',') + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-target]').forEach(el => {
    counterObserver.observe(el);
  });

  /* ── Smooth anchor scroll ────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── Hero parallax (subtle) ──────────────────────── */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      heroBg.style.transform = `translateY(${y * 0.25}px)`;
    }, { passive: true });
  }

  /* ── Gallery lightbox hint ───────────────────────── */
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.setAttribute('tabindex', '0');
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') item.click();
    });
  });

})();
