/* ============================================================
   AGRINHO 2026 — script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Navbar scroll ── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  /* ── Menu mobile ── */
  const toggle = document.querySelector('.nav-toggle');
  const menu   = document.querySelector('.nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('aberto');
      const spans = toggle.querySelectorAll('span');
      spans[0].style.transform = menu.classList.contains('aberto') ? 'rotate(45deg) translate(5px,5px)' : '';
      spans[1].style.opacity   = menu.classList.contains('aberto') ? '0' : '1';
      spans[2].style.transform = menu.classList.contains('aberto') ? 'rotate(-45deg) translate(5px,-5px)' : '';
    });
    // Fechar ao clicar num link
    menu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('aberto');
        toggle.querySelectorAll('span').forEach(s => { s.style.transform=''; s.style.opacity=''; });
      });
    });
  }

  /* ── Marcar link ativo ── */
  const paginaAtual = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === paginaAtual || (paginaAtual === '' && href === 'index.html')) {
      link.classList.add('ativo');
    }
  });

  /* ── Intersection Observer: animações de entrada ── */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visivel');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.anima, .anima-esq, .anima-dir, .timeline-item').forEach(el => {
    observer.observe(el);
  });

  /* ── Contador animado ── */
  function animarContador(el) {
    const alvo   = parseFloat(el.dataset.alvo);
    const sufixo = el.dataset.sufixo || '';
    const prefixo= el.dataset.prefixo || '';
    const dec    = el.dataset.dec ? parseInt(el.dataset.dec) : 0;
    const dur    = 2000;
    let inicio   = null;

    function step(ts) {
      if (!inicio) inicio = ts;
      const prog = Math.min((ts - inicio) / dur, 1);
      const ease = 1 - Math.pow(1 - prog, 3); // cubic ease out
      const atual = alvo * ease;
      el.textContent = prefixo + atual.toFixed(dec) + sufixo;
      if (prog < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const obsContador = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animarContador(entry.target);
        obsContador.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-numero[data-alvo]').forEach(el => obsContador.observe(el));

  /* ── Barra de cultivos animada ── */
  const obsBarras = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.cultivo-barra').forEach(barra => {
          const w = barra.dataset.largura || '0';
          barra.style.width = w;
        });
        obsBarras.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.lista-cultivos').forEach(el => obsBarras.observe(el));

  /* ── Smooth scroll para âncoras ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const alvo = document.querySelector(anchor.getAttribute('href'));
      if (alvo) {
        e.preventDefault();
        alvo.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── Lightbox simples para galeria ── */
  const itensGaleria = document.querySelectorAll('.galeria-item');
  if (itensGaleria.length > 0) {
    // Criar lightbox
    const lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.style.cssText = `
      display:none; position:fixed; inset:0; z-index:9999;
      background:rgba(5,15,8,0.94); align-items:center; justify-content:center;
      cursor:zoom-out; backdrop-filter:blur(8px);
    `;
    lb.innerHTML = `
      <div style="max-width:90vw;max-height:90vh;position:relative;text-align:center">
        <img id="lb-img" src="" alt="" style="max-width:100%;max-height:85vh;border-radius:8px;display:block"/>
        <p id="lb-legenda" style="font-family:'Oswald',sans-serif;font-size:0.75rem;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.5);margin-top:1rem;"></p>
        <button id="lb-fecha" style="position:absolute;top:-2.5rem;right:0;background:none;border:none;color:rgba(255,255,255,0.6);font-size:1.5rem;cursor:pointer">✕</button>
      </div>
    `;
    document.body.appendChild(lb);

    function abrirLb(src, legenda) {
      const img = document.getElementById('lb-img');
      const leg = document.getElementById('lb-legenda');
      img.src = src;
      leg.textContent = legenda || '';
      lb.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }

    function fecharLb() {
      lb.style.display = 'none';
      document.body.style.overflow = '';
    }

    itensGaleria.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const legenda = item.querySelector('.galeria-overlay span')?.textContent || '';
        if (img) abrirLb(img.src, legenda);
      });
    });

    lb.addEventListener('click', (e) => { if (e.target === lb || e.target.id === 'lb-fecha') fecharLb(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') fecharLb(); });
  }

  /* ── Parallax suave no hero ── */
  const hero = document.querySelector('.hero');
  if (hero && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      hero.style.backgroundPositionY = `calc(50% + ${y * 0.3}px)`;
    }, { passive: true });
  }

  /* ── Tooltip em links de referência ── */
  document.querySelectorAll('.ref-link').forEach(link => {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  });

  /* ── Ano dinâmico no rodapé ── */
  const anoEl = document.getElementById('ano-rodape');
  if (anoEl) anoEl.textContent = new Date().getFullYear();

});
