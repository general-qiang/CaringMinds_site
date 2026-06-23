/**
 * 此心 CaringMinds — Site JavaScript
 * Covers: scroll reveal, nav behaviour, mobile menu,
 * counter animation, active-link tracking, progress bar.
 */

(() => {
  'use strict';

  /* ─── Helpers ─────────────────────────────────────────── */
  const qs  = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];

  /* ─── 1. Scroll-reveal (IntersectionObserver) ─────────── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target); // fire once
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -72px 0px' }
  );
  qsa('.reveal').forEach((el) => revealObserver.observe(el));

  /* ─── 2. Navbar: shadow + compact mode on scroll ──────── */
  const nav = qs('nav');
  let lastScroll = 0;

  function onNavScroll() {
    const y = window.scrollY;

    // compact after 60 px
    nav.classList.toggle('nav--scrolled', y > 60);

    // hide on scroll-down, show on scroll-up (only past hero)
    if (y > 300) {
      nav.classList.toggle('nav--hidden', y > lastScroll + 4);
    } else {
      nav.classList.remove('nav--hidden');
    }
    lastScroll = Math.max(0, y);
  }

  window.addEventListener('scroll', onNavScroll, { passive: true });

  // Inject the nav behaviour styles once
  const navStyle = document.createElement('style');
  navStyle.textContent = `
    nav { transition: transform 0.35s ease, box-shadow 0.3s ease, padding 0.3s ease; }
    nav.nav--scrolled { box-shadow: 0 4px 24px -8px rgba(31,31,44,0.12); }
    nav.nav--scrolled .nav-inner { padding-top: 12px; padding-bottom: 12px; }
    nav.nav--hidden  { transform: translateY(-100%); }
  `;
  document.head.appendChild(navStyle);

  /* ─── 3. Mobile hamburger menu ────────────────────────── */
  const navInner = qs('.nav-inner');
  const navLinks = qs('.nav-links');

  // Build burger button
  const burger = document.createElement('button');
  burger.className = 'nav-burger';
  burger.setAttribute('aria-label', '展开菜单');
  burger.setAttribute('aria-expanded', 'false');
  burger.innerHTML = `
    <span></span><span></span><span></span>
  `;
  navInner.appendChild(burger);

  // Build overlay
  const overlay = document.createElement('div');
  overlay.className = 'mobile-overlay';
  document.body.appendChild(overlay);

  // Inject mobile styles
  const mobileStyle = document.createElement('style');
  mobileStyle.textContent = `
    .nav-burger {
      display: none;
      flex-direction: column;
      gap: 5px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      z-index: 200;
    }
    .nav-burger span {
      display: block;
      width: 24px;
      height: 2px;
      background: var(--ink);
      border-radius: 2px;
      transition: transform 0.3s ease, opacity 0.3s ease;
    }
    .nav-burger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    .nav-burger.open span:nth-child(2) { opacity: 0; }
    .nav-burger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

    .mobile-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(31,31,44,0.4);
      z-index: 90;
      opacity: 0;
      transition: opacity 0.3s;
    }
    .mobile-overlay.visible { opacity: 1; }

    @media (max-width: 768px) {
      .nav-burger { display: flex; }
      .mobile-overlay { display: block; pointer-events: none; }
      .mobile-overlay.visible { pointer-events: auto; }

      .nav-links {
        position: fixed;
        top: 0; right: 0;
        height: 100dvh;
        width: min(320px, 85vw);
        background: var(--cream);
        flex-direction: column;
        gap: 0;
        padding: 96px 32px 40px;
        z-index: 150;
        transform: translateX(110%);
        transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: -8px 0 32px rgba(31,31,44,0.12);
      }
      .nav-links.open { transform: translateX(0); }
      .nav-links li { border-bottom: 1px solid var(--line); }
      .nav-links a {
        display: block;
        padding: 18px 0;
        font-size: 17px;
        color: var(--ink);
      }
      .nav-cta {
        display: block;
        margin-top: 24px;
        text-align: center;
        padding: 14px 24px;
      }
    }
  `;
  document.head.appendChild(mobileStyle);

  function toggleMenu(open) {
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    navLinks.classList.toggle('open', open);
    overlay.classList.toggle('visible', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  burger.addEventListener('click', () => {
    const isOpen = burger.classList.contains('open');
    toggleMenu(!isOpen);
  });
  overlay.addEventListener('click', () => toggleMenu(false));
  qsa('a', navLinks).forEach((a) =>
    a.addEventListener('click', () => toggleMenu(false))
  );

  /* ─── 4. Smooth anchor scrolling ─────────────────────── */
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    const target = qs(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = nav.offsetHeight + 12;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });

  /* ─── 5. Active nav-link highlighting ─────────────────── */
  const sections = qsa('section[id], header[id]');
  const navAnchors = qsa('.nav-links a[href^="#"]');

  // Inject active style
  const activeStyle = document.createElement('style');
  activeStyle.textContent = `
    .nav-links a.active { color: var(--orange) !important; }
    .nav-links a.active::after {
      content: '';
      position: absolute;
      bottom: -2px; left: 0; right: 0;
      height: 2px;
      background: var(--orange);
      border-radius: 1px;
    }
  `;
  document.head.appendChild(activeStyle);

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navAnchors.forEach((a) =>
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`)
        );
      });
    },
    { rootMargin: '-30% 0px -60% 0px' }
  );
  sections.forEach((s) => sectionObserver.observe(s));

  /* ─── 6. Counter animation for impact numbers ─────────── */
  function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

  function animateCounter(el, target, suffix, duration = 1800) {
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const value = Math.round(easeOutQuart(progress) * target);
      el.textContent = value.toLocaleString('zh-CN') + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Parse e.g. "200+" → { value: 200, suffix: '+' }
  function parseCounter(text) {
    const match = text.match(/^([\d,]+)([^\d]*)$/);
    if (!match) return null;
    return {
      value: parseInt(match[1].replace(/,/g, ''), 10),
      suffix: match[2] || '',
    };
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const parsed = parseCounter(el.dataset.target || el.textContent.trim());
        if (parsed) animateCounter(el, parsed.value, parsed.suffix);
        counterObserver.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  qsa('.impact-number').forEach((el) => {
    // Store original text as data attribute for re-use
    el.dataset.target = el.textContent.trim();
    el.textContent = '0';
    counterObserver.observe(el);
  });

  /* ─── 7. Scroll progress bar ─────────────────────────── */
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.appendChild(bar);

  const barStyle = document.createElement('style');
  barStyle.textContent = `
    .scroll-progress {
      position: fixed;
      top: 0; left: 0;
      height: 3px;
      width: 0%;
      background: linear-gradient(90deg, var(--orange), var(--gold));
      z-index: 9999;
      transition: width 0.1s linear;
      pointer-events: none;
    }
  `;
  document.head.appendChild(barStyle);

  function updateProgress() {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width  = `${pct}%`;
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* ─── 8. Pillar / card hover ripple (subtle) ──────────── */
  qsa('.pillar, .impact-card, .join-card, .initiative').forEach((card) => {
    card.addEventListener('mouseenter', function (e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--rx', `${x}px`);
      card.style.setProperty('--ry', `${y}px`);
    });
  });

  /* ─── 9. Keyboard accessibility: skip-to-content ─────── */
  const skip = document.createElement('a');
  skip.href = '#about';
  skip.textContent = '跳至主要内容';
  skip.className = 'skip-link';
  document.body.prepend(skip);

  const skipStyle = document.createElement('style');
  skipStyle.textContent = `
    .skip-link {
      position: fixed;
      top: -100%;
      left: 16px;
      background: var(--orange);
      color: #fff;
      padding: 10px 18px;
      border-radius: 0 0 8px 8px;
      font-size: 14px;
      font-weight: 600;
      z-index: 9999;
      text-decoration: none;
      transition: top 0.2s;
    }
    .skip-link:focus { top: 0; }
  `;
  document.head.appendChild(skipStyle);

  /* ─── 10. Hero quote-card: rotate quotes ─────────────── */
  const quotes = [
    { text: '那次对话让我感觉被真正看见了。', attr: '— 一位来访青年' },
    { text: '不需要完美，只需要有人陪在身边。', attr: '— 一位朋辈咨询师' },
    { text: '此心让我知道，我的感受是值得被倾听的。', attr: '— 在校大学生' },
  ];
  let qIdx = 0;
  const qCard = qs('.quote-card');

  if (qCard) {
    const qText  = qCard.firstChild
      ? [...qCard.childNodes].find((n) => n.nodeType === 3 || n.tagName === 'P')
      : null;
    const qAttr  = qs('.quote-attribution', qCard);

    const quoteBody = document.createElement('p');
    quoteBody.style.cssText = 'margin:0; font-size:14px; line-height:1.7;';
    quoteBody.textContent   = quotes[0].text;
    if (qAttr) qAttr.textContent = quotes[0].attr;

    // Replace text node with <p>
    qCard.innerHTML = '';
    qCard.appendChild(quoteBody);
    const newAttr = document.createElement('p');
    newAttr.className   = 'quote-attribution';
    newAttr.textContent = quotes[0].attr;
    qCard.appendChild(newAttr);

    const rotateStyle = document.createElement('style');
    rotateStyle.textContent = `
      .quote-card { cursor: default; transition: opacity 0.4s ease; }
    `;
    document.head.appendChild(rotateStyle);

    setInterval(() => {
      qIdx = (qIdx + 1) % quotes.length;
      qCard.style.opacity = '0';
      setTimeout(() => {
        qCard.querySelector('p').textContent        = quotes[qIdx].text;
        qCard.querySelector('.quote-attribution').textContent = quotes[qIdx].attr;
        qCard.style.opacity = '1';
      }, 400);
    }, 5000);
  }

  console.info('此心 CaringMinds — JS loaded ✓');
})();