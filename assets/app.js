/* ALIVEMAEX — shared app.js
   Läuft auf jeder Seite. Injiziert die globalen Ebenen (Korn, Dichte,
   Lichtbrechungs-Filter, Sound) und startet nur, was die Seite braucht. */

/* ---------- RELEASES: Datenfile (RAUMRISS speist hier ein / hier editieren)
   latest = neu (archived:false) · archive = Back-Katalog (archived:true)
   Cover der alten Releases kommen direkt von Spotify. ---------- */
const RELEASES = [
  { title:"Boys Never Bleed", date:"2026", url:"https://open.spotify.com/artist/0aiBlkcHQ2Nqta7K7JBS3d", cover:"assets/web/cover-bnb.jpg", archived:false },
  { title:"never the same", date:"2025", url:"https://open.spotify.com/album/5qL9vhStf41vYH2zvFYCzu", cover:"https://i.scdn.co/image/ab67616d0000b273854402ba7938f3e7b088d719", archived:true },
  { title:"herz rast", date:"2025", url:"https://open.spotify.com/album/5KpB5d7gyNJkHqXS8Ey9h1", cover:"https://i.scdn.co/image/ab67616d0000b2738cd408b6678ff1278b75d24b", archived:true },
  { title:"Betonwüstengrau", date:"2025", url:"https://open.spotify.com/album/6lFcxZ2FgCguVVCg1ShYwg", cover:"https://i.scdn.co/image/ab67616d0000b2737180861b2f03cb3af73fc18f", archived:true },
  { title:"Jemals", date:"2025", url:"https://open.spotify.com/album/0Dj3D5Lyq865JfzHwhNWIV", cover:"https://i.scdn.co/image/ab67616d0000b2730adc4391fb79e0b2fbad0c33", archived:true },
  { title:"I Hate Myself", date:"2025", url:"https://open.spotify.com/album/6tti53zmDBJ3eZbSvaAGoC", cover:"https://i.scdn.co/image/ab67616d0000b273738b31b28e687392d03bc302", archived:true },
  { title:"Kleine Dinge", date:"2024", url:"https://open.spotify.com/album/4eVZKoCeqqqZzgWlvLjESs", cover:"https://i.scdn.co/image/ab67616d0000b273dac592acb2201020a766858b", archived:true },
  { title:"Mehr Blau als Sonnenlicht", date:"2024", url:"https://open.spotify.com/album/75NZLMXHMgBq0fCuAAjPCK", cover:"https://i.scdn.co/image/ab67616d0000b2730f6a0592fee2dea82e825d09", archived:true },
  { title:"Demons", date:"2024", url:"https://open.spotify.com/album/21h2xggsTXqgpZo7lZMO6n", cover:"https://i.scdn.co/image/ab67616d0000b27385c83fbd996bfb748cb0e270", archived:true },
  { title:"Electronic Catwalk", date:"2020", url:"https://open.spotify.com/album/28mVvpQzvpqicj95ue8Qop", cover:"https://i.scdn.co/image/ab67616d0000b2737b7e94eade9f66ebc2850b4b", archived:true },
];

/* ---------- Geräte-Erkennung: Touch = Mobile-Pfad (leichte Effekte, kleine Medien) ---------- */
const TOUCH = !!(window.matchMedia && matchMedia('(hover:none)').matches);

/* ---------- globale Ebenen injizieren ---------- */
(function inject(){
  // Filmkorn
  if(!document.querySelector('.grain')){
    const g=document.createElement('div'); g.className='grain'; document.body.appendChild(g);
  }
  // SVG-Filter (Kaustik + Lichtbrechung) — auf Touch nicht injizieren (CSS nutzt sie dort nicht)
  if(TOUCH){
    // vorhandene SMIL-Animationen (inline auf index) stoppen — laufen sonst unsichtbar weiter und kosten CPU
    document.querySelectorAll('filter animate').forEach(a=>a.remove());
  }
  if(!TOUCH && !document.getElementById('caustic')){
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('width','0'); svg.setAttribute('height','0'); svg.setAttribute('aria-hidden','true');
    svg.style.position='absolute';
    svg.innerHTML=`
      <filter id="caustic">
        <feTurbulence type="fractalNoise" baseFrequency="0.010 0.016" numOctaves="2" seed="7" result="n">
          <animate attributeName="baseFrequency" dur="52s" values="0.010 0.016;0.016 0.024;0.010 0.016" repeatCount="indefinite"/>
        </feTurbulence>
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.78  0 0 0 0 0.94  0 0 0 0 0.9  0 0 0 0.9 0"/>
      </filter>
      <filter id="refract">
        <feTurbulence type="fractalNoise" baseFrequency="0.006 0.011" numOctaves="2" seed="4" result="w">
          <animate attributeName="baseFrequency" dur="34s" values="0.006 0.011;0.010 0.017;0.006 0.011" repeatCount="indefinite"/>
        </feTurbulence>
        <feDisplacementMap in="SourceGraphic" in2="w" scale="20" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
      <filter id="refract-soft">
        <feTurbulence type="fractalNoise" baseFrequency="0.008 0.014" numOctaves="2" seed="9" result="w">
          <animate attributeName="baseFrequency" dur="28s" values="0.008 0.014;0.013 0.02;0.008 0.014" repeatCount="indefinite"/>
        </feTurbulence>
        <feDisplacementMap in="SourceGraphic" in2="w" scale="9" xChannelSelector="R" yChannelSelector="G"/>
      </filter>`;
    document.body.appendChild(svg);
  }
  // Dichte-Ebene
  if(!document.querySelector('.density')){
    const d=document.createElement('div'); d.className='density';
    d.innerHTML='<div class="tint"></div><div class="milk"></div><div class="press"></div>';
    document.body.appendChild(d);
  }
  // CRT / Röhren-TV
  if(!document.querySelector('.crt')){
    const c=document.createElement('div'); c.className='crt';
    c.innerHTML='<div class="lines"></div><div class="roll"></div><div class="glow"></div>';
    document.body.appendChild(c);
  }
  // Sound-Toggle + Audio — NUR auf der Startseite (Hero vorhanden)
  if(document.querySelector('.hero') && !document.getElementById('soundtoggle')){
    const btn=document.createElement('button'); btn.id='soundtoggle'; btn.className='soundtoggle'; btn.setAttribute('aria-label','Sound stummschalten');
    btn.innerHTML='<svg class="hp" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20" aria-hidden="true"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5a9 9 0 0 1 18 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"></path><line class="slash" x1="3" y1="3" x2="21" y2="21"></line></svg>';
    document.body.appendChild(btn);
    const au=document.createElement('audio'); au.id='track'; au.src='assets/web/website-sound.mp3'; au.loop=true; au.preload=TOUCH?'none':'auto'; // Mobile: 1,7 MB erst laden, wenn der Sound wirklich startet
    document.body.appendChild(au);
  }
})();

/* ---------- RELEASES rendern (nur wenn #releases existiert) ---------- */
(function renderReleases(){
  const relBox=document.getElementById('releases'); if(!relBox) return;
  relBox.innerHTML = RELEASES.map(r => {
    const cov = r.cover
      ? `<img src="${r.cover}" alt="${r.title}" loading="lazy" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover" />`
      : '';
    return `
    <a class="release reveal" data-cat="${r.archived ? 'archiv' : 'aktuell'}" ${r.archived ? 'style="display:none;background:'+r.accent+'"' : 'style="background:'+r.accent+'"'} href="${r.url}" target="_blank" rel="noopener">
      <div class="cov">${cov}</div>
      <div class="rinfo">
        <span class="ri-t">${r.title}</span>
        <span class="ri-meta lower"><span>${r.date}</span><span class="ri-play">listen on spotify ↗</span></span>
      </div>
    </a>`; }).join('');

  // Reiter nur bei vorhandenem Archiv
  const hasArchive = RELEASES.some(r=>r.archived);
  const tabsEl = document.querySelector('.tabs');
  if(!hasArchive){ if(tabsEl) tabsEl.style.display='none'; }
  else {
    const tabBtns=document.querySelectorAll('.tab');
    tabBtns.forEach(btn=>btn.addEventListener('click',()=>{ tabBtns.forEach(b=>b.classList.remove('active')); btn.classList.add('active'); const c=btn.dataset.tab; document.querySelectorAll('.release').forEach(r=>{ r.style.display=(r.dataset.cat===c)?'':'none'; }); }));
  }
})();

/* ---------- Visuals rendern (nur wenn #fragTiles existiert) ---------- */
(function renderVisuals(){
  const box=document.getElementById('fragTiles'); if(!box) return;
  const PHOTOS = ["assets/web/ph-239.jpg","assets/web/ph-574.jpg","assets/web/ph-497.jpg"];
  box.innerHTML = PHOTOS.map(src=>`
    <div class="tile">
      <img class="bg" src="${src}" alt="" loading="lazy" />
      <div class="grade" style="background:radial-gradient(60% 50% at 50% 30%, rgba(201,154,58,.5), transparent 70%)"></div>
    </div>`).join('');
})();

/* ---------- Instagram-Feed (neueste Posts, auto-update über Feed-JSON) ----------
   Für echte Auto-Aktualisierung: kostenlosen Feed bei behold.so anlegen (IG verbinden)
   und die JSON-URL unten in INSTA_FEED eintragen. Ohne Feed erscheint der stilvolle
   Fallback (verlinkt auf das Profil). ---------- */
const INSTA_FEED = 'https://feeds.behold.so/tfyT8O5SjAcHSeTaE7zT';
(function instagram(){
  const box=document.getElementById('instafeed'); if(!box) return;
  const N=6;
  const fallback=()=>{
    box.innerHTML = Array.from({length:N}).map(()=>`
      <a class="ig-tile ig-empty" href="https://www.instagram.com/alivemaex" target="_blank" rel="noopener" aria-label="alivemaex auf instagram">
        <span class="ig-mark"></span>
      </a>`).join('');
  };
  if(!INSTA_FEED){ fallback(); return; }
  fetch(INSTA_FEED).then(r=>r.json()).then(data=>{
    const posts=(Array.isArray(data)?data:(data.posts||[])).slice(0,N);
    if(!posts.length){ fallback(); return; }
    box.innerHTML = posts.map(p=>{
      const sz=p.sizes||{};
      const szUrl=(sz.medium&&sz.medium.mediaUrl)||(sz.small&&sz.small.mediaUrl)||(sz.large&&sz.large.mediaUrl)||'';
      const isVid=(p.mediaType||'').toString().toUpperCase()==='VIDEO';
      const img=isVid ? (p.thumbnailUrl||szUrl||p.mediaUrl) : (szUrl||p.mediaUrl||p.thumbnailUrl||'');
      const link=p.permalink||p.url||'https://www.instagram.com/alivemaex';
      const cap=(p.prunedCaption||p.caption||'').toString().slice(0,80).replace(/"/g,'&quot;');
      if(!img) return '';
      return `<a class="ig-tile" href="${link}" target="_blank" rel="noopener" aria-label="${cap||'instagram post'}"><img src="${img}" alt="" loading="lazy"><span class="ig-hover">view ↗</span></a>`;
    }).join('');
  }).catch(fallback);
})();

/* ---------- Social-Icons (offizielle Logos) rendern ---------- */
(function social(){
  const SOCIAL=[
    {n:'instagram', u:'https://www.instagram.com/alivemaex', s:'instagram'},
    {n:'tiktok', u:'https://www.tiktok.com/@alivemaex', s:'tiktok'},
    {n:'spotify', u:'https://open.spotify.com/artist/0aiBlkcHQ2Nqta7K7JBS3d', s:'spotify'},
    {n:'youtube', u:'https://www.youtube.com/@ALIVEMAEX', s:'youtube'},
    {n:'soundcloud', u:'https://soundcloud.com/alivemaex', s:'soundcloud'},
  ];
  document.querySelectorAll('#social').forEach(box=>{
    box.innerHTML = SOCIAL.map(x=>`<a href="${x.u}" target="_blank" rel="noopener" aria-label="${x.n}"><img src="https://cdn.simpleicons.org/${x.s}/F4ECDA" width="22" height="22" alt="${x.n}" loading="lazy"></a>`).join('');
  });
})();

/* ---------- Marken-Badge (dein Stern) + Favicon ---------- */
(function badge(){
  const fav=document.createElement('link'); fav.rel='icon'; fav.type='image/png'; fav.href='assets/web/favicon.png'; document.head.appendChild(fav);
  document.querySelectorAll('.brand').forEach(b=>{
    if(b.querySelector('.brandmark')) return;
    const img=document.createElement('img'); img.className='brandmark'; img.src='assets/web/badge.png'; img.alt=''; img.setAttribute('aria-hidden','true');
    b.prepend(img);
  });
})();

/* ---------- YouTube-Facade: Thumbnail sichtbar, Klick spielt inline ---------- */
(function ytfacade(){
  document.querySelectorAll('.ytfacade').forEach(el=>{
    el.style.cursor='pointer';
    const load=()=>{
      const id=el.dataset.yt; if(!id || el.dataset.loaded) return; el.dataset.loaded='1';
      const ifr=document.createElement('iframe');
      ifr.src='https://www.youtube.com/embed/'+id+'?autoplay=1&rel=0&playsinline=1';
      ifr.title='ALIVEMAEX — Betonwüstengrau';
      ifr.setAttribute('allow','accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
      ifr.setAttribute('allowfullscreen','');
      const img=el.querySelector('img'); const pb=el.querySelector('.playbtn');
      if(img) img.remove(); if(pb) pb.remove();
      el.prepend(ifr);
    };
    el.addEventListener('click',load);
    el.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); load(); } });
  });
})();

/* ---------- Haupt-Reiter music / video ---------- */
(function maintabs(){
  const tabs=document.querySelectorAll('.maintab'); if(!tabs.length) return;
  tabs.forEach(t=>t.addEventListener('click',()=>{
    tabs.forEach(x=>x.classList.remove('active')); t.classList.add('active');
    const id=t.dataset.panel;
    document.querySelectorAll('.panel').forEach(p=>{ p.hidden = (p.id!==id); });
    document.querySelectorAll('.panel:not([hidden]) .reveal').forEach(el=>el.classList.add('in'));
  }));
})();

/* ---------- Reveal ---------- */
const io=new IntersectionObserver((es)=>{ es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} }); },{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

/* ---------- Hero-Parallax (nur Startseite) ---------- */
(function parallax(){
  if(TOUCH) return; // Mobile: Scroll-Parallax spart Jank beim Scrollen
  const hc=document.querySelector('.hero-center'); if(!hc) return;
  addEventListener('scroll',()=>{ const y=scrollY; if(y<innerHeight){ hc.style.transform=`translateY(${y*0.16}px)`; hc.style.opacity=String(Math.max(0,1-y/760)); } },{passive:true});
})();

/* ---------- Dichte: Ferne wird milchig mit der Tiefe ---------- */
(function density(){
  const milk=document.querySelector('.density .milk'); if(!milk) return;
  let ticking=false;
  addEventListener('scroll',()=>{
    if(ticking) return; ticking=true;
    requestAnimationFrame(()=>{
      const max=document.body.scrollHeight-innerHeight;
      const p=max>0?Math.min(1,scrollY/max):0;
      milk.style.opacity=(p*0.9).toFixed(3);
      ticking=false;
    });
  },{passive:true});
})();

/* ---------- Cursor-Taucherlicht (nur mit echter Maus) ---------- */
(function diver(){
  if(window.matchMedia && matchMedia('(hover:none)').matches) return;
  const dl=document.createElement('div'); dl.className='diverlight'; document.body.appendChild(dl);
  let tx=innerWidth/2, ty=innerHeight/2, x=tx, y=ty, on=false;
  addEventListener('mousemove',e=>{ tx=e.clientX; ty=e.clientY; if(!on){on=true; dl.style.opacity='1';} },{passive:true});
  (function loop(){ x+=(tx-x)*0.08; y+=(ty-y)*0.08; dl.style.transform=`translate(${x}px,${y}px)`; requestAnimationFrame(loop); })();
})();

/* ---------- Interaktion: Wasser-Ripple beim Klick/Tap ---------- */
(function ripple(){
  addEventListener('pointerdown', e=>{
    const r=document.createElement('div'); r.className='ripple';
    r.style.left=e.clientX+'px'; r.style.top=e.clientY+'px';
    document.body.appendChild(r);
    setTimeout(()=>{ if(r.parentNode) r.parentNode.removeChild(r); }, 1500);
  }, {passive:true});
})();

/* ---------- Navigations-Soundeffekt: sofort wechseln, Effekt auf der Unterseite spielen ---------- */
const SFX_NAV = 'assets/web/sfx-nav.mp3';
const SFX_TARGETS = ['releases.html','shop.html','about.html','boys-never-bleed.html'];
(function navSfx(){
  // 1) Klick auf eine Unterseite: Flag setzen, dann ganz normal (sofort) navigieren
  document.querySelectorAll('a[href]').forEach(a=>{
    const href=a.getAttribute('href')||'';
    if(!SFX_TARGETS.some(k=>href.endsWith(k))) return;
    a.addEventListener('click',()=>{ try{ sessionStorage.setItem('amx_playsfx','1'); }catch(e){} });
  });
  // 2) Auf der Unterseite angekommen (kein Hero): Effekt-Sound abspielen
  if(!document.querySelector('.hero')){
    let should=false; try{ should=sessionStorage.getItem('amx_playsfx')==='1'; sessionStorage.removeItem('amx_playsfx'); }catch(e){}
    if(should){
      const au=new Audio(SFX_NAV); au.volume=0.8;
      let done=false;
      const tryit=()=>{ if(done) return; const p=au.play(); if(p&&p.then){ p.then(()=>{ done=true; }).catch(()=>{}); } else done=true; };
      // erst spielen, wenn die Seite fertig geladen ist (Mobile: nicht mit dem Rendern konkurrieren)
      const arm=()=>{ tryit(); addEventListener('pointerdown', tryit, {once:true, passive:true}); }; // Fallback nur, wenn der erste Versuch geblockt wurde (done-Guard verhindert Doppel-Play)
      if(document.readyState==='complete') arm();
      else addEventListener('load', ()=>setTimeout(arm, TOUCH?200:0), {once:true});
    }
  }
})();

/* ---------- Sound: durchgehender Loop, Autostart, Kopfhörer-Mute (nur Startseite) ---------- */
(function sound(){
  const track=document.getElementById('track'), btn=document.getElementById('soundtoggle');
  if(!track||!btn) return;
  let muted=false; try{ muted = localStorage.getItem('amx_muted')==='1'; }catch(e){}
  let fadeTimer=null, started=false;
  // Ton über Seitenwechsel fortführen (Multipage): Position merken & fortsetzen
  let savedTime=0, timeApplied=false;
  try{ savedTime=parseFloat(sessionStorage.getItem('amx_sound_time'))||0; }catch(e){}
  if(TOUCH) savedTime=0; // Mobile: MP3-Seek beim Zurückkommen stockt (Range-Request + Decode) → lieber sauber von vorn starten
  function applyTime(){ if(timeApplied) return; if(savedTime>0 && isFinite(savedTime) && track.duration && savedTime<track.duration-0.2){ try{ track.currentTime=savedTime; }catch(e){} } timeApplied=true; }
  if(track.readyState>=1) applyTime(); else track.addEventListener('loadedmetadata', applyTime, {once:true});
  addEventListener('pagehide',()=>{ try{ sessionStorage.setItem('amx_sound_time', String(track.currentTime||0)); }catch(e){} }, {passive:true});
  function setMuted(m){ muted=m; btn.classList.toggle('muted', m); btn.setAttribute('aria-label', m?'Sound einschalten':'Sound stummschalten'); try{ localStorage.setItem('amx_muted', m?'1':'0'); }catch(e){} }
  function fadeTo(target){
    clearInterval(fadeTimer);
    if(TOUCH){ // iOS ignoriert programmatische volume-Änderungen → Fade läuft ins Leere und pause() käme NIE. Hart schalten:
      try{ track.volume=Math.max(0,Math.min(1,target)); }catch(e){}
      if(target===0) track.pause();
      return;
    }
    fadeTimer=setInterval(()=>{
      const step=0.05, d=target-track.volume;
      if(Math.abs(d)<=step){ track.volume=Math.max(0,Math.min(1,target)); clearInterval(fadeTimer); if(target===0) track.pause(); }
      else track.volume=Math.max(0,Math.min(1,track.volume+Math.sign(d)*step));
    },50);
  }
  function playOn(){ applyTime(); track.volume=0; const p=track.play(); if(p&&p.catch) p.catch(()=>{}); fadeTo(0.55); btn.classList.add('playing'); }
  function silence(){ fadeTo(0); btn.classList.remove('playing'); }
  btn.classList.toggle('muted', muted);
  // sofort versuchen; verweigert der Browser, dann beim allerersten Kontakt
  function tryStart(){ if(started||muted) return; applyTime(); track.volume=0; const p=track.play(); if(p&&p.then){ p.then(()=>{ started=true; fadeTo(0.55); btn.classList.add('playing'); }).catch(()=>{}); } }
  tryStart();
  const kick=(e)=>{ if(started||muted) return; if(e&&e.target&&e.target.closest&&e.target.closest('#soundtoggle')) return; started=true; playOn(); };
  ['pointerdown','keydown','touchstart'].forEach(ev=>addEventListener(ev,kick,{passive:true}));
  addEventListener('scroll',kick,{once:true,passive:true});
  btn.addEventListener('click',()=>{ started=true; if(muted){ setMuted(false); playOn(); } else { setMuted(true); silence(); } });
})();

/* ---------- Videos: passende Größe je Gerät laden (data-src / data-src-mobile) ----------
   Hero lädt sofort; Canvas-Clips (preload="none") erst kurz bevor sie ins Bild kommen. */
function pickSrc(v){
  if(v.src) return;
  const src = (TOUCH && v.dataset.srcMobile) ? v.dataset.srcMobile : v.dataset.src;
  if(src) v.src = src;
}
(function heroVideo(){
  const v=document.querySelector('.hero-media'); if(!v) return;
  pickSrc(v);
  v.muted = true; v.defaultMuted = true; v.setAttribute('muted','');
  const rate=()=>{ try{ v.playbackRate=0.6; }catch(e){} };
  const play=()=>{ const p=v.play(); if(p&&p.catch) p.catch(()=>{}); rate(); };
  v.addEventListener('loadedmetadata', play);
  v.addEventListener('canplay', play);
  play();
  // Fallback für Handys (z. B. iOS Energiesparmodus): spätestens bei erster Interaktion starten
  ['touchstart','pointerdown','scroll','click'].forEach(ev=>addEventListener(ev, play, {once:true, passive:true}));
})();

/* ---------- Lazy-Videos: erst laden & starten, wenn sie fast sichtbar sind ---------- */
(function lazyVideos(){
  const vids=[...document.querySelectorAll('video[data-src]:not(.hero-media)')]; if(!vids.length) return;
  const start=v=>{ pickSrc(v); v.muted=true; const p=v.play(); if(p&&p.catch) p.catch(()=>{}); };
  if(!('IntersectionObserver' in window)){ vids.forEach(start); return; }
  const vio=new IntersectionObserver((es)=>{ es.forEach(e=>{ if(e.isIntersecting){ start(e.target); vio.unobserve(e.target); } }); },{rootMargin:'300px'});
  vids.forEach(v=>vio.observe(v));
})();

/* ---------- Alle bereits geladenen Videos bei erster Interaktion anstoßen (Handy-Fallback) ---------- */
(function playVideos(){
  const go=()=>document.querySelectorAll('video[src]').forEach(v=>{ try{ v.muted=true; const p=v.play(); if(p&&p.catch) p.catch(()=>{}); }catch(e){} });
  ['touchstart','pointerdown','scroll'].forEach(ev=>addEventListener(ev, go, {once:true, passive:true}));
})();

/* ---------- Intro: der Röhren-TV schaltet sich ein (erster Besuch) ---------- */
(function intro(){
  try{ if(sessionStorage.getItem('amx_dived')) return; sessionStorage.setItem('amx_dived','1'); }catch(e){}
  const touch = !!(window.matchMedia && matchMedia('(hover:none)').matches);
  const NW = touch?140:220, NH = touch?84:130;   // Rausch-Auflösung: mobil kleiner
  const o=document.createElement('div'); o.className='tvi';
  o.innerHTML =
    '<div class="tvi-stage">'
    +'<canvas width="'+NW+'" height="'+NH+'"></canvas>'
    +'<div class="tvi-scan"></div><div class="tvi-roll"></div>'
    +'<img class="tvi-star" src="assets/web/badge.png" alt="ALIVEMAEX">'
    +'<div class="tvi-curve"></div>'
    +'</div><div class="tvi-line"></div><div class="tvi-flash"></div>';
  document.body.appendChild(o); document.body.style.overflow='hidden';

  // Bildrauschen (kleines Canvas, hochskaliert = billig)
  const cv=o.querySelector('canvas'), ctx=cv.getContext('2d');
  const im=ctx.createImageData(NW,NH);
  let raf=null, last=0;
  (function noise(ts){
    if(ts-last>33){ const d=im.data;
      for(let i=0;i<d.length;i+=4){ const v=Math.random()*255; d[i]=v; d[i+1]=v; d[i+2]=v; d[i+3]=255; }
      ctx.putImageData(im,0,0); last=ts; }
    raf=requestAnimationFrame(noise);
  })(0);

  // Einschalt-Sound (Browser blocken Autoplay ggf. bis zur ersten Interaktion)
  const isfx=new Audio('assets/web/sfx-intro.mp3'); isfx.volume=0.85;
  const playIsfx=()=>{ const p=isfx.play(); if(p&&p.catch) p.catch(()=>{}); };
  playIsfx();
  addEventListener('pointerdown', playIsfx, {once:true, passive:true});

  const done=()=>{
    if(!o.parentNode) return;
    cancelAnimationFrame(raf); document.body.style.overflow='';
    try{ let v=isfx.volume; const f=setInterval(()=>{ v-=0.2; if(v<=0){ try{ isfx.pause(); }catch(_){ } clearInterval(f); } else isfx.volume=Math.max(0,v); },40); }catch(e){}
    o.remove();
  };
  const t=setTimeout(done,1950);
  o.addEventListener('click',()=>{ clearTimeout(t); done(); });
})();

/* ---------- Consent + Meta Pixel ---------- */
(function consent(){
  const PIXEL_ID='1829980527965213', KEY='amx_consent';
  function loadPixel(){
    if(window.fbq) return;
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init',PIXEL_ID); fbq('track','PageView');
  }
  function banner(){
    if(document.querySelector('.cookie')) return;
    const c=document.createElement('div'); c.className='cookie';
    c.innerHTML='<div class="c-txt">'
      +'<strong>Reichweitenmessung</strong>'
      +'<p>Mit deiner Einwilligung nutze ich den Meta-Pixel, um zu sehen, wie Menschen zu meiner Musik finden. Ohne Zustimmung wird er nicht geladen. Details in der <a href="datenschutz.html">Datenschutzerklärung</a>.</p>'
      +'</div>'
      +'<div class="c-btns">'
      +'<button type="button" class="c-no">Ablehnen</button>'
      +'<button type="button" class="c-yes">Einverstanden</button>'
      +'</div>';
    document.body.appendChild(c);
    requestAnimationFrame(()=>requestAnimationFrame(()=>c.classList.add('in')));
    const close=()=>{ c.classList.remove('in'); setTimeout(()=>{ if(c.parentNode) c.parentNode.removeChild(c); },600); };
    c.querySelector('.c-yes').addEventListener('click',()=>{ try{ localStorage.setItem(KEY,'yes'); }catch(e){} close(); loadPixel(); });
    c.querySelector('.c-no').addEventListener('click',()=>{ try{ localStorage.setItem(KEY,'no'); }catch(e){} close(); });
  }
  let c=null; try{ c=localStorage.getItem(KEY); }catch(e){}
  if(c==='yes') loadPixel();
  else if(c!=='no') setTimeout(banner, 2400); /* nach dem Intro */
  window.amxConsentReset=function(){ try{ localStorage.removeItem(KEY); }catch(e){} banner(); };
})();

/* ---------- Release-Countdown (Hero) ---------- */
(function countdown(){
  const wrap=document.getElementById('heroRelease'); if(!wrap) return;
  const T=new Date(wrap.dataset.release||'2026-08-14T00:00:00').getTime();
  const el={ d:wrap.querySelector('[data-cd=d]'), h:wrap.querySelector('[data-cd=h]'), m:wrap.querySelector('[data-cd=m]'), s:wrap.querySelector('[data-cd=s]') };
  const btn=document.getElementById('presaveBtn');
  const p=n=>String(n).padStart(2,'0');
  let iv=null;
  function tick(){
    let x=T-Date.now();
    if(x<=0){ /* Release-Tag: Countdown weg, Button auf „stream now" */
      wrap.classList.add('released');
      if(btn){ btn.textContent='stream now'; }
      if(iv) clearInterval(iv);
      return;
    }
    if(el.d) el.d.textContent=p(Math.floor(x/864e5));
    if(el.h) el.h.textContent=p(Math.floor(x%864e5/36e5));
    if(el.m) el.m.textContent=p(Math.floor(x%36e5/6e4));
    if(el.s) el.s.textContent=p(Math.floor(x%6e4/1e3));
  }
  tick(); iv=setInterval(tick,1000);
})();

/* ---------- Jahr im Footer ---------- */
document.querySelectorAll('#yr').forEach(el=>el.textContent=new Date().getFullYear());
