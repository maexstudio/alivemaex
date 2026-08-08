/* ALIVEMAEX · Einwilligung + Meta-Pixel
   Selbsttragend: bringt eigenes CSS mit, laeuft auf jeder Seite per
   <script src="consent.js" defer></script>. Der Pixel wird erst nach
   ausdruecklichem Ja geladen - vorher keine Verbindung zu Meta.
   Schluessel bleibt amx_consent, damit alte Entscheidungen weiter gelten. */
(function () {
  var PIXEL_ID = '1829980527965213';
  var KEY = 'amx_consent';

  /* ---------- Pixel ---------- */
  function loadPixel() {
    if (window.fbq) return;
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
      };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s)
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', PIXEL_ID);
    fbq('track', 'PageView');
  }

  /* Ereignis-ID, damit Browser-Pixel und spaeteres Server-CAPI
     dasselbe Ereignis nicht doppelt zaehlen. */
  function eventId() {
    try { return crypto.randomUUID(); }
    catch (e) { return String(Date.now()) + '-' + Math.random().toString(36).slice(2); }
  }
  window.amxTrack = function (name, params) {
    if (!window.fbq) return null;
    var id = eventId();
    fbq('track', name, params || {}, { eventID: id });
    return id;
  };

  /* ---------- CSS ---------- */
  function styles() {
    if (document.getElementById('amx-consent-css')) return;
    var s = document.createElement('style');
    s.id = 'amx-consent-css';
    s.textContent = [
      '.amx-cc{position:fixed;z-index:85;left:16px;right:16px;bottom:16px;max-width:660px;margin:0 auto;',
      'background:rgba(8,8,10,.94);border:1px solid rgba(237,230,216,.22);border-radius:16px;',
      'padding:20px 22px;display:flex;flex-wrap:wrap;gap:18px 22px;align-items:flex-end;',
      'color:#ede6d8;backdrop-filter:blur(6px);',
      'transform:translateY(140%);transition:transform .7s cubic-bezier(.22,.61,.36,1)}',
      '.amx-cc.in{transform:none}',
      '.amx-cc .t{flex:1 1 300px;min-width:0}',
      '.amx-cc strong{display:block;font-size:.58rem;letter-spacing:.2em;text-transform:uppercase;',
      'margin-bottom:9px;opacity:.9}',
      '.amx-cc p{margin:0;font-size:.78rem;line-height:1.62;opacity:.76;max-width:54ch}',
      '.amx-cc a{color:#ede6d8;text-decoration:underline;text-underline-offset:3px}',
      '.amx-cc .b{display:flex;gap:10px;flex:0 0 auto}',
      '.amx-cc button{font:inherit;font-size:.54rem;letter-spacing:.19em;text-transform:uppercase;',
      'cursor:pointer;padding:13px 22px;border-radius:999px;border:1px solid rgba(237,230,216,.55);',
      'background:transparent;color:#ede6d8;transition:background .35s,color .35s,border-color .35s}',
      '.amx-cc button:hover{background:#ede6d8;color:#0a0a0b;border-color:#ede6d8}',
      '.amx-cc .yes{border-color:#ede6d8}',
      '@media(max-width:560px){.amx-cc{padding:18px}.amx-cc .b{width:100%}.amx-cc button{flex:1}}'
    ].join('');
    document.head.appendChild(s);
  }

  /* ---------- Banner ---------- */
  function banner() {
    if (document.querySelector('.amx-cc')) return;
    styles();
    var c = document.createElement('div');
    c.className = 'amx-cc';
    c.setAttribute('role', 'dialog');
    c.setAttribute('aria-label', 'Reichweitenmessung');
    c.innerHTML =
      '<div class="t"><strong>reichweitenmessung</strong>' +
      '<p>Mit deiner Einwilligung nutze ich den Meta-Pixel, um zu sehen, wie Menschen zu meiner Musik ' +
      'finden. Ohne Zustimmung wird er nicht geladen. Details in der ' +
      '<a href="/datenschutz">Datenschutzerkl&auml;rung</a>.</p></div>' +
      '<div class="b">' +
      '<button type="button" class="no">ablehnen</button>' +
      '<button type="button" class="yes">einverstanden</button>' +
      '</div>';
    document.body.appendChild(c);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { c.classList.add('in'); });
    });

    function close() {
      c.classList.remove('in');
      setTimeout(function () { if (c.parentNode) c.parentNode.removeChild(c); }, 750);
    }
    c.querySelector('.yes').addEventListener('click', function () {
      try { localStorage.setItem(KEY, 'yes'); } catch (e) { }
      close(); loadPixel();
    });
    c.querySelector('.no').addEventListener('click', function () {
      try { localStorage.setItem(KEY, 'no'); } catch (e) { }
      close();
    });
  }

  /* Widerruf - von der Datenschutzseite aus aufrufbar */
  window.amxConsentReset = function () {
    try { localStorage.removeItem(KEY); } catch (e) { }
    banner();
  };

  /* ---------- Ablauf ----------
     Der Intro-Vorhang liegt ueber allem. Das Banner darf erst kommen,
     wenn der Vorhang offen ist, sonst redet es gegen eine schwarze Wand. */
  function afterGate(fn) {
    var gate = document.getElementById('gate');
    if (!gate || !document.body.classList.contains('gated')) { setTimeout(fn, 1400); return; }
    var obs = new MutationObserver(function () {
      if (!document.body.classList.contains('gated')) { obs.disconnect(); setTimeout(fn, 1200); }
    });
    obs.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }

  var choice = null;
  try { choice = localStorage.getItem(KEY); } catch (e) { }
  if (choice === 'yes') loadPixel();
  else if (choice !== 'no') afterGate(banner);
})();
