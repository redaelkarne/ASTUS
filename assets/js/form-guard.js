/* Anti-spam / anti-phishing guard for the EmailJS contact forms.
 *
 * Runs before the page's own submit handlers (capture phase on document) and
 * silently drops submissions that look automated or malicious:
 *   1. Honeypot  - a hidden field humans never see; bots fill it in.
 *   2. Timing    - humans need several seconds to fill a form; bots submit instantly.
 *   3. Links     - phishing / SEO spam is almost always about links.
 *   4. Content   - HTML/script tags and known spam keywords.
 *   5. Cooldown  - one message per browser every 60 seconds.
 *
 * NOTE: this only stops bots that use the form. Bots that call the EmailJS API
 * directly must be stopped in the EmailJS dashboard (allowed domains + rate limit).
 */
(function () {
  'use strict';

  var MIN_FILL_MS = 4000;      // faster than this = bot
  var COOLDOWN_MS = 60000;     // one send per minute per browser
  var MAX_LINKS = 1;           // more links than this = spam
  var COOLDOWN_KEY = 'astus-last-form-send';
  var LIMITS = { name: 80, email: 120, phone: 25, company: 120, subject: 150, message: 3000 };

  var SPAM_WORDS = [
    'viagra', 'cialis', 'casino', 'crypto', 'bitcoin', 'forex', 'loan offer',
    'seo service', 'backlink', 'rank your website', 'first page of google',
    'web design service', 'increase your traffic', 'telegram', 'whatsapp me',
    'wallet', 'verify your account', 'gift card',
    'carte cadeau', 'invoice attached', 'facture jointe', 'click here', 'cliquez ici'
  ];

  var forms = document.querySelectorAll('form.emailjs-form');
  if (!forms.length) return;

  forms.forEach(function (form) {
    form.setAttribute('data-guard-start', String(Date.now()));

    // 1. Honeypot field, hidden from humans and screen readers
    var hp = document.createElement('div');
    hp.setAttribute('aria-hidden', 'true');
    hp.style.cssText = 'position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden;';
    hp.innerHTML = '<label>Ne pas remplir<input type="text" name="website_url" tabindex="-1" autocomplete="off"></label>';
    form.appendChild(hp);

    // Length limits on every known field
    Object.keys(LIMITS).forEach(function (n) {
      var f = form.querySelector('[name="' + n + '"]');
      if (f) f.setAttribute('maxlength', String(LIMITS[n]));
    });

    // Reset the timer when the form is reopened (quote modal)
    form.addEventListener('focusin', function () {
      if (!form.getAttribute('data-guard-touched')) {
        form.setAttribute('data-guard-touched', '1');
        if (Date.now() - Number(form.getAttribute('data-guard-start')) > 600000) {
          form.setAttribute('data-guard-start', String(Date.now()));
        }
      }
    });
  });

  function val(form, name) {
    var f = form.querySelector('[name="' + name + '"]');
    return f ? String(f.value || '') : '';
  }

  function showMessage(form, text, isError) {
    var box = form.querySelector('.form-guard-msg');
    if (!box) {
      box = document.createElement('div');
      box.className = 'form-guard-msg';
      box.style.cssText = 'margin-top:12px;padding:10px 14px;border-radius:6px;font-size:14px;';
      form.appendChild(box);
    }
    box.textContent = text;
    box.style.background = isError ? '#fdecea' : '#e8f5e9';
    box.style.color = isError ? '#b71c1c' : '#1b5e20';
    box.style.display = 'block';
  }

  function block(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    event.stopPropagation();
  }

  document.addEventListener('submit', function (event) {
    var form = event.target;
    if (!form || !form.classList || !form.classList.contains('emailjs-form')) return;

    var oldMsg = form.querySelector('.form-guard-msg');
    if (oldMsg) oldMsg.style.display = 'none';

    // 1. Honeypot: pretend success so the bot doesn't adapt
    if (val(form, 'website_url') !== '') {
      block(event);
      showMessage(form, 'Votre message a été envoyé avec succès !', false);
      form.reset();
      return;
    }

    // 2. Too fast
    var start = Number(form.getAttribute('data-guard-start')) || 0;
    if (Date.now() - start < MIN_FILL_MS) {
      block(event);
      showMessage(form, 'Merci de prendre quelques secondes pour remplir le formulaire, puis réessayez.', true);
      return;
    }

    // 5. Cooldown
    var last = 0;
    try { last = Number(localStorage.getItem(COOLDOWN_KEY)) || 0; } catch (e) {}
    if (Date.now() - last < COOLDOWN_MS) {
      block(event);
      showMessage(form, 'Un message vient déjà d\'être envoyé. Merci de patienter une minute avant de réessayer.', true);
      return;
    }

    var all = ['name', 'email', 'phone', 'company', 'subject', 'message']
      .map(function (n) { return val(form, n); }).join(' \n ');
    var lower = all.toLowerCase();

    // 4. HTML / script injection
    if (/<\s*\/?\s*(script|iframe|a|img|form|style|object|embed|svg)\b/i.test(all) || /javascript:/i.test(all)) {
      block(event);
      showMessage(form, 'Le message contient du code HTML non autorisé. Merci d\'écrire en texte simple.', true);
      return;
    }

    // 3. Links: none allowed in name/subject/company, max 1 in message
    var linkRe = /(https?:\/\/|www\.|\b[a-z0-9-]+\.(ru|cn|xyz|top|click|link|online|site|info|biz|io|ly)\b)/gi;
    var shortFields = val(form, 'name') + ' ' + val(form, 'subject') + ' ' + val(form, 'company');
    var msgLinks = (val(form, 'message').match(linkRe) || []).length;
    if (linkRe.test(shortFields) || msgLinks > MAX_LINKS) {
      block(event);
      showMessage(form, 'Les liens ne sont pas autorisés dans ce formulaire (un seul lien maximum dans le message).', true);
      return;
    }

    // Spam / phishing keywords
    for (var i = 0; i < SPAM_WORDS.length; i++) {
      if (lower.indexOf(SPAM_WORDS[i]) !== -1) {
        block(event);
        showMessage(form, 'Votre message n\'a pas pu être envoyé. Merci de nous contacter par téléphone.', true);
        return;
      }
    }

    // Name must look like a name (letters, spaces, hyphens, apostrophes)
    var name = val(form, 'name').trim();
    if (name && !/^[\p{L}][\p{L}\s'.-]{0,79}$/u.test(name)) {
      block(event);
      showMessage(form, 'Merci d\'indiquer un nom valide (lettres uniquement).', true);
      return;
    }

    // Passed: let the page's EmailJS handler run, and start the cooldown
    try { localStorage.setItem(COOLDOWN_KEY, String(Date.now())); } catch (e) {}
    form.setAttribute('data-guard-start', String(Date.now()));
  }, true);
})();
