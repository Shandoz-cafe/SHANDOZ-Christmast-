/* helpers */
const qs = s => document.querySelector(s);
const qsa = s => document.querySelectorAll(s);

/* ---------------------------
   LOADER (Netflix style) - no skip
   --------------------------- */
window.addEventListener('load', () => {
  // Ensure loader shows at least a short time for effect
  const loader = qs('#netflixLoader');
  if (!loader) return;
  // remove after animation duration
  setTimeout(() => {
    loader.remove();
  }, 2300); // keep in sync with CSS animation (2.2s)
});

/* ---------------------------
   PROMO MODAL (show once per day)
   --------------------------- */
(function promoModal(){
  const modal = qs('#promoModal') || qs('#promoModal') /* support both ids */;
  const promo = qs('#promoModal') || qs('#promoModal') || qs('#promoModal') /* fallback */;
  const promoCard = qs('.promo-card');
  const closeBtn = qs('.promo-close');
  const key = 'shandoz_promo_seen_v1';

  function openModal(){
    const m = qs('#promoModal') || qs('#promoModal');
    if(!m) return;
    m.setAttribute('aria-hidden','false');
    // spawn sparkles inside card
    spawnSparkles(promoCard, 8);
  }
  function closeModal(){
    const m = qs('#promoModal') || qs('#promoModal');
    if(!m) return;
    m.setAttribute('aria-hidden','true');
    try{ localStorage.setItem(key, Date.now()); }catch(e){}
  }

  // close handler
  closeBtn?.addEventListener('click', closeModal);

  try {
    const seen = localStorage.getItem(key);
    if(!seen || (Date.now() - Number(seen)) > 24*3600*1000){
      // show after small delay (after loader)
      setTimeout(openModal, 1400);
    }
  } catch(e){
    setTimeout(openModal, 1400);
  }
})();

/* ---------------------------
   Promo countdown (example: promo end date)
   --------------------------- */
(function promoCountdown(){
  const countdownEl = qs('#promoCountdown');
  if(!countdownEl) return;
  // set promo end date (adjust as needed)
  // I'll set it to Dec 31, current year 23:59:59
  const now = new Date();
  const year = now.getFullYear();
  const promoEnd = new Date(year, 11, 31, 23, 59, 59); // Dec 31
  function update(){
    const diff = promoEnd - Date.now();
    if(diff <= 0){
      countdownEl.textContent = 'Promo telah berakhir';
      return;
    }
    const days = Math.floor(diff / (1000*60*60*24));
    const hours = Math.floor((diff / (1000*60*60)) % 24);
    const minutes = Math.floor((diff / (1000*60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    countdownEl.textContent = `${String(days).padStart(2,'0')}d ${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
  }
  update();
  setInterval(update, 1000);
})();

/* ---------------------------
   Download coupon (generate PNG via canvas)
   --------------------------- */
(function couponDownload(){
  const btn = qs('#downloadCoupon') || qs('#downloadCoupon');
  if(!btn) return;
  btn.addEventListener('click', async () => {
    // create canvas
    const w = 900, h = 500;
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const ctx = c.getContext('2d');

    // background
    ctx.fillStyle = '#2a221e';
    ctx.fillRect(0,0,w,h);

    // decorative
    ctx.fillStyle = '#fff';
    ctx.globalAlpha = 0.06;
    for(let i=0;i<80;i++){
      ctx.beginPath();
      ctx.arc(Math.random()*w, Math.random()*h, Math.random()*40,0,Math.PI*2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // text
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 44px sans-serif';
    ctx.fillText("SHANDO'Z HOLIDAY COUPON", 50, 120);

    ctx.font = '700 36px sans-serif';
    ctx.fillStyle = '#f5d48b';
    const code = 'SHANDOZ2025';
    ctx.fillText("Kode: " + code, 50, 200);

    ctx.font = '20px sans-serif';
    ctx.fillStyle = '#fff';
    ctx.fillText("Tunjukkan kode ini untuk klaim promo di Shando'z Café.", 50, 260);

    // footer
    ctx.font = '18px sans-serif';
    ctx.fillStyle = '#dcdcdc';
    ctx.fillText('Berlaku sampai: 31 Dec ' + (new Date().getFullYear()), 50, 320);

    // create link
    const dataUrl = c.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'shandoz_coupon.png';
    a.click();
  });
})();

/* ---------------------------
   Snow heavy (optimized)
   --------------------------- */
(function heavySnow(){
  const container = qs('#snow-container');
  if(!container) return;
  const COUNT = 110;
  function createFlake(){
    const el = document.createElement('div');
    el.className = 'snow';
    const size = 6 + Math.random()*22;
    el.style.width = el.style.height = size + 'px';
    el.style.left = Math.random()*100 + 'vw';
    el.style.top = '-20px';
    el.style.opacity = 0.4 + Math.random()*0.6;
    const dur = 5 + Math.random()*6;
    el.style.animationDuration = dur + 's';
    el.style.setProperty('--drift', (Math.random()*160 - 80) + 'px');
    container.appendChild(el);
    setTimeout(()=> { el.remove(); }, (dur+0.4)*1000);
  }
  for(let i=0;i<COUNT;i++){
    setTimeout(createFlake, Math.random()*1200);
  }
  setInterval(createFlake, 900);
})();

/* ---------------------------
   Sparkles spawn near promo when shown
   --------------------------- */
function spawnSparkles(parent, count = 6){
  if(!parent) return;
  for(let i=0;i<count;i++){
    const s = document.createElement('div');
    s.className = 'sparkle';
    s.textContent = '✨';
    s.style.left = (10 + Math.random()*80) + '%';
    s.style.top = (10 + Math.random()*70) + '%';
    s.style.animationDelay = (Math.random()*1.2) + 's';
    parent.appendChild(s);
    setTimeout(()=> s.remove(), 1600 + Math.random()*800);
  }
}

/* ---------------------------
   Santa slide-in (one early flyby)
   --------------------------- */
(function santaFlyby(){
  const s = qs('#santa');
  if(!s) return;
  s.style.display = 'block';
  s.style.position = 'fixed';
  s.style.left = '-360px';
  s.style.bottom = '10vh';
  s.style.zIndex = 13000;
  s.style.transition = 'transform 1.1s ease-out, left 1.1s ease-out';
  // slide in
  setTimeout(()=> {
    s.style.left = '12px';
    s.style.transform = 'translateX(0)';
  }, 1200);
  // slide out
  setTimeout(()=> {
    s.style.left = '-360px';
    setTimeout(()=> s.style.display = 'none', 900);
  }, 7000);
})();

/* ---------------------------
   Lightbox (basic)
   --------------------------- */
(function lightbox(){
  const lb = qs('#lightbox'), img = qs('#lightbox-img'), close = qs('#lightbox-close');
  qsa('.lightbox-trigger').forEach(el => {
    el.addEventListener('click', () => {
      img.src = el.dataset.full || el.getAttribute('src');
      lb.classList.add('open');
    });
  });
  close?.addEventListener('click', ()=> { lb.classList.remove('open'); img.src = ''; });
})();

/* ---------------------------
   Music autoplay after first tap
   --------------------------- */
(function musicInit(){
  const bgm = qs('#bgm'), toggle = qs('#music-toggle');
  if(!bgm || !toggle) return;
  let playing = false;
  function play(){
    bgm.muted = false;
    bgm.play().then(()=> {
      playing = true; toggle.textContent = '🔊';
    }).catch(()=>{});
  }
  window.addEventListener('pointerdown', play, { once: true });
  toggle.addEventListener('click', ()=> {
    if(!playing){ play(); } else { bgm.pause(); playing = false; toggle.textContent = '🔇'; }
  });
})();

/* ---------------------------
   Share button (Web Share API)
   --------------------------- */
(function shareBtn(){
  const btn = qs('#shareBtn');
  if(!btn) return;
  if(navigator.share){
    btn.addEventListener('click', async ()=> {
      try{ await navigator.share({ title: "Shando'z Café & Coffee Bar", text: "Coffee · Comfort · Community", url: location.href }); }
      catch(e){}
    });
  } else {
    btn.addEventListener('click', ()=> { prompt('Salin link ini untuk dibagikan:', location.href); });
  }
})();
