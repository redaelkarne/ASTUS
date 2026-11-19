/* ASTUS - animations (progress bar, hero zoom, counters, section reveals).
   Independent from main.js so an error elsewhere can't block it. */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll progress bar
  var bar = document.createElement('div');
  bar.id = 'scroll-progress';
  document.body.appendChild(bar);
  var ticking = false;
  function updateBar() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, window.scrollY / h) : 0) + ')';
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(updateBar); }
  }, { passive: true });
  updateBar();

  // Hero: move each slide's background into its own layer so it can zoom
  document.querySelectorAll('.hero-slide').forEach(function (slide) {
    var bg = slide.style.backgroundImage;
    if (!bg || slide.querySelector('.hero-bg')) return;
    var layer = document.createElement('div');
    layer.className = 'hero-bg';
    layer.style.backgroundImage = bg;
    slide.insertBefore(layer, slide.firstChild);
    slide.style.backgroundImage = 'none';
  });

  // Safety net: if the slider never starts, still show the first slide's text
  setTimeout(function () {
    var slides = document.querySelectorAll('.hero-slide');
    if (slides.length && !document.querySelector('.hero-slide.swiper-slide-active')) {
      slides[0].classList.add('swiper-slide-active');
    }
  }, 1500);

  // Section headers: draw the accent line when they scroll into view
  // Counters: count up when visible
  function countUp(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    if (isNaN(target)) return;
    if (reduce) { el.textContent = target + suffix; return; }
    var start = null, dur = 1600;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Years of experience, always up to date (ASTUS founded in 1993)
  document.querySelectorAll('[data-count-since]').forEach(function (el) {
    el.setAttribute('data-count', String(new Date().getFullYear() - parseInt(el.getAttribute('data-count-since'), 10)));
  });

  var targets = document.querySelectorAll('.section-header, [data-count]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        if (e.target.hasAttribute('data-count')) countUp(e.target);
        else e.target.classList.add('is-visible');
        io.unobserve(e.target);
      });
    }, { threshold: 0.4 });
    targets.forEach(function (t) { io.observe(t); });
  } else {
    targets.forEach(function (t) {
      if (t.hasAttribute('data-count')) countUp(t); else t.classList.add('is-visible');
    });
  }
})();

/* Floating call button on phones */
(function () {
  if (document.getElementById('call-fab')) return;
  var a = document.createElement('a');
  a.id = 'call-fab';
  a.href = 'tel:+33811742424';
  a.setAttribute('aria-label', 'Appeler ASTUS au 0811 74 24 24');
  a.innerHTML = '<i class="bi bi-telephone-fill" aria-hidden="true"></i>';
  document.body.appendChild(a);
})();
