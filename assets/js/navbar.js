/**
 * ASTUS - Navbar (one script for every page)
 *  - mobile drawer: open/close, overlay, Esc key, click outside, scroll lock
 *  - header shrinks + gets a shadow on scroll
 *  - highlights the current page / section (scrollspy on the home page)
 *  - icons on the "Accès client" / "Demander un devis" buttons
 *  - "Demander un devis" opens the quote modal on every page
 *
 * Uses the same classes as before (navbar-mobile, mobile-menu-active,
 * bi-list / bi-x) so the inline scripts already in the pages keep working.
 */
(function () {
  'use strict';

  function init() {
    var header = document.getElementById('header');
    var navbar = document.getElementById('navbar');
    var toggle = document.querySelector('.mobile-nav-toggle');
    if (!header || !navbar) return;

    /* ---------- Mobile drawer ---------- */
    function isOpen() { return navbar.classList.contains('navbar-mobile'); }

    function setOpen(open) {
      navbar.classList.toggle('navbar-mobile', open);
      header.classList.toggle('mobile-menu-active', open);
      document.documentElement.classList.toggle('nav-locked', open);
      if (toggle) {
        toggle.classList.toggle('bi-list', !open);
        toggle.classList.toggle('bi-x', open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
      }
    }

    if (toggle) {
      toggle.setAttribute('role', 'button');
      toggle.setAttribute('tabindex', '0');
      toggle.setAttribute('aria-controls', 'navbar');
      setOpen(false);

      // Capture phase on document: runs before any older handler bound to the
      // toggle itself, and stops it, so the menu can't open and close at once.
      document.addEventListener('click', function (e) {
        if (e.target === toggle || toggle.contains(e.target)) {
          e.preventDefault();
          e.stopImmediatePropagation();
          e.stopPropagation();
          setOpen(!isOpen());
          return;
        }
        // click outside the open drawer closes it
        if (isOpen() && !navbar.contains(e.target)) setOpen(false);
      }, true);

      toggle.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(!isOpen()); }
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen()) { setOpen(false); if (toggle) toggle.focus(); }
    });

    navbar.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { if (isOpen()) setOpen(false); });
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 991 && isOpen()) setOpen(false);
    });

    /* ---------- Header state on scroll ---------- */
    var ticking = false;
    function onScroll() {
      header.classList.toggle('header-scrolled', window.scrollY > 40);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
    }, { passive: true });
    onScroll();

    /* ---------- Button icons ---------- */
    function addIcon(sel, icon) {
      var el = navbar.querySelector(sel);
      if (el && !el.querySelector('i')) {
        var i = document.createElement('i');
        i.className = 'bi ' + icon;
        i.setAttribute('aria-hidden', 'true');
        el.insertBefore(i, el.firstChild);
      }
    }
    addIcon('.btn-client', 'bi-person-circle');
    addIcon('.btn-quote', 'bi-send');

    /* ---------- Active link ---------- */
    var links = Array.prototype.slice.call(navbar.querySelectorAll('.nav-link'));
    var page = decodeURIComponent(window.location.pathname.split('/').pop() || 'index.html');
    var servicePages = ['Permanences-Téléphonique.html', 'Telealarme.html', 'Intervention.html', 'Intervention_tech.html', 'services.html'];

    function setActive(link) {
      links.forEach(function (l) { l.classList.toggle('active', l === link); });
    }

    if (page !== 'index.html') {
      var match = null;
      links.forEach(function (l) {
        var href = decodeURIComponent((l.getAttribute('href') || '').split('#')[0]);
        if (href === page) match = l;
        if (!match && servicePages.indexOf(page) !== -1 && /services/i.test(l.getAttribute('href') || '')) match = l;
      });
      if (match) setActive(match);
    } else if ('IntersectionObserver' in window) {
      // Home page: follow the section on screen
      var map = [];
      links.forEach(function (l) {
        var h = l.getAttribute('href') || '';
        var id = h.indexOf('#') !== -1 ? h.split('#')[1] : '';
        var sec = id && document.getElementById(id);
        if (sec) map.push({ link: l, sec: sec });
      });
      var home = links.filter(function (l) { var h = l.getAttribute('href'); return h === '#' || h === 'index.html' || h === '#hero'; })[0];
      if (map.length) {
        var visible = {};
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) { visible[e.target.id] = e.isIntersecting; });
          var current = null;
          map.forEach(function (m) { if (visible[m.sec.id]) current = m.link; });
          setActive(current || home || null);
        }, { rootMargin: '-45% 0px -50% 0px' });
        map.forEach(function (m) { io.observe(m.sec); });
      }
    }

    /* ---------- Quote modal ---------- */
    var modal = document.getElementById('myModal');
    if (modal) {
      var openers = document.querySelectorAll('#openFormButton, #openFormButton2');
      openers.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          modal.style.display = 'block';
        });
      });
      var closeBtn = modal.querySelector('.close');
      if (closeBtn) closeBtn.addEventListener('click', function () { modal.style.display = 'none'; });
      modal.addEventListener('click', function (e) { if (e.target === modal) modal.style.display = 'none'; });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
