/* Cookie consent banner for Google Maps (RGPD/CNIL): no request to Google before "Accepter" */
(function () {
  var KEY = 'astus-cookie-consent'; // 'yes' | 'no'
  var boxes = document.querySelectorAll('.map-consent');
  if (!boxes.length) return;

  function getChoice() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function setChoice(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function loadMap(box) {
    var iframe = document.createElement('iframe');
    iframe.src = box.getAttribute('data-src');
    iframe.style.cssText = 'border:0;width:100%;height:' + box.style.height + ';display:block;';
    iframe.setAttribute('allowfullscreen', '');
    iframe.title = 'Localisation ASTUS - 289 rue Garibaldi, 69007 Lyon';
    box.replaceWith(iframe);
  }
  function loadAll() { document.querySelectorAll('.map-consent').forEach(loadMap); }

  function showBanner() {
    if (document.getElementById('cookie-banner')) return;
    var b = document.createElement('div');
    b.id = 'cookie-banner';
    b.setAttribute('role', 'dialog');
    b.setAttribute('aria-label', 'Gestion des cookies');
    b.innerHTML =
      '<p>Ce site affiche une carte Google Maps. Google peut déposer des cookies et collecter des données de navigation. ' +
      '<a href="https://policies.google.com/privacy" target="_blank" rel="noopener">En savoir plus</a></p>' +
      '<div class="cookie-banner-actions">' +
      '<button type="button" data-choice="no">Refuser</button>' +
      '<button type="button" data-choice="yes">Accepter</button>' +
      '</div>';
    b.addEventListener('click', function (e) {
      var c = e.target.getAttribute && e.target.getAttribute('data-choice');
      if (!c) return;
      setChoice(c);
      b.remove();
      if (c === 'yes') loadAll();
    });
    document.body.appendChild(b);
  }

  // Placeholder button (shown only if refused / not yet chosen) also counts as consent
  boxes.forEach(function (box) {
    var btn = box.querySelector('.map-consent-btn');
    if (btn) btn.addEventListener('click', function () {
      setChoice('yes');
      var b = document.getElementById('cookie-banner');
      if (b) b.remove();
      loadAll();
    });
  });

  var choice = getChoice();
  if (choice === 'yes') loadAll();
  else if (choice === null) showBanner();

  // "Gérer les cookies" link so visitors can change their choice at any time
  var manage = document.createElement('button');
  manage.type = 'button';
  manage.id = 'cookie-manage';
  manage.textContent = 'Cookies';
  manage.title = 'Gérer les cookies';
  manage.addEventListener('click', function () {
    try { localStorage.removeItem(KEY); } catch (e) {}
    location.reload();
  });
  document.body.appendChild(manage);
})();
