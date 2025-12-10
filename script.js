/* Helpers */
const qs = s => document.querySelector(s);
const qsa = s => document.querySelectorAll(s);

/* ---------------------------
   NETFLIX LOADER (no skip) — remove after animation
   --------------------------- */
window.addEventListener('load', () => {
  const loader = qs('#netflixLoader');
  if (!loader) return;
  // keep visible for animation effect, then remove
  setTimeout(() => loader.remove(), 2300);
});

/* ---------------------------
   PROMO MODAL (show once per day)
   --------------------------- */
(function promoModal(){
  const key = 'shandoz_promo_seen_v2';
  const modal = qs('#promoModal');
  const promoCard = qs('.promo-card');
  const closeBtn = qs('.promo-close');

  function openModal(){
    if(!modal) return;
    modal.classList.add('show');
    modal.setAttribute('aria-hidden','false');
    spawnSparkles(promoCard, 10);
  }
  function closeModal(){
    if(!modal) return;
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden','true');
    try{ localStorage.setItem(key, Date.now()); } catch(e){}
  }

  closeBtn?.addEventListener('click', closeModal);

  try {
    const seen = Number(localStorage.getItem(key));
    if(!seen || (Date.now() - seen) > 24*3600*1000){
      // show after loader finishes
      setTimeout(openModal, 1600);
    }
  } catch(e){
    setTimeout(openModal, 1600);
  }
})();

/* ---------------------------
   Promo countdown (Dec 31)
   --------------------------- */
(function promoCountdown(){
  const el = qs('#promoCountdown');
  if(!el) return;
  const now = new Date();
  const year = now.getFullYear();
  const promoEnd = new Date(year, 11, 31, 23, 59, 59);
  function update(){
    const diff = promoEnd - Date.now();
    if(diff <= 0){ el.textContent = 'Promo telah berakhir'; return; }
    const days = Math.floor(diff / (1000*60*60*24));
    const hours = Math.floor((diff / (1000*60*60)) % 24);
    const minutes = Math.floor((diff / (1000*60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    el.textContent = `${String(days).padStart(2,'0')}d ${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
  }
  update(); setInterval(update, 1000);
})();

/* ---------------------------
   Download coupon (canvas)
   --------------------------- */
(function couponDownload(){
  const btn = qs('#downloadCoupon');
  if(!btn) return;
  btn.addEventListener('click', () => {
    const w=1000,h=540;
    const c=document.createElement('canvas'); c.width=w; c.height=h;
    const ctx=c.getContext('2d');
    ctx.fillStyle='#241815'; ctx.fillRect(0,0,w,h);
    ctx.globalAlpha=0.06; ctx.fillStyle='#fff';
    for(let i=0;i<120;i++){ ctx.beginPath(); ctx.arc(Math.random()*w, Math.random()*h, Math.random()*40,0,Math.PI*2); ctx.fill(); }
    ctx.globalAlpha=1; ctx.fillStyle='#fff';
    ctx.font='bold 38px sans-serif'; ctx.fillText("SHANDO'Z HOLIDAY COUPON",40,110);
    ctx.font='700 28px sans-serif'; ctx.fillStyle='#ffdf9a';
    const code = 'SHANDOZ2025';
    ctx.fillText("Kode: " + code,40,180);
    ctx.font='16px sans-serif'; ctx.fillStyle='#ddd';
    ctx.fillText('Tunjukkan kode untuk klaim promo di Shandoz Café',40,240);
    ctx.fillText('Berlaku sampai: 31 Dec ' + (new Date().getFullYear()),40,300);
    const a=document.createElement('a'); a.href=c.toDataURL('image/png'); a.download='shandoz_coupon.png'; a.click();
  });
})();

/* ---------------------------
   HEAVY SNOW (inject flakes into #snow-container)
   --------------------------- */
(function heavySnow(){
  const container = qs('#snow-container'); if(!container) return;
  const COUNT = 110;
  function createFlake(){
    const el = document.createElement('div');
    el.className = 'snow';
    const size = 6 + Math.random()*26;
    el.style.width = el.style.height = size + 'px';
    el.style.left = Math.random()*100 + 'vw';
    el.style.top = '-30px';
    el.style.opacity = 0.25 + Math.random()*0.75;
    const dur = 5 + Math.random()*7;
    el.style.transition = `transform ${dur}s linear`;
    // small horizontal drift for variety
    const drift = (Math.random()*220 - 110);
    container.appendChild(el);
    requestAnimationFrame(()=> {
      el.style.transform = `translateY(${window.innerHeight + 200}px) translateX(${drift}px)`;
    });
    setTimeout(()=> { el.remove(); }, (dur+0.6)*1000);
  }
  // initial burst
  for(let i=0;i<COUNT;i++) setTimeout(createFlake, Math.random()*1200);
  setInterval(createFlake, 780);
})();

/* ---------------------------
   Sparkles utility
   --------------------------- */
function spawnSparkles(parent, count=6){
  if(!parent) return;
  for(let i=0;i<count;i++){
    const s = document.createElement('div');
    s.className = 'sparkle';
    s.textContent = '✨';
    s.style.position = 'absolute';
    s.style.left = (6 + Math.random()*84) + '%';
    s.style.top = (6 + Math.random()*78) + '%';
    s.style.fontSize = (12 + Math.random()*18) + 'px';
    s.style.opacity = 0;
    parent.appendChild(s);
    setTimeout(()=> s.remove(), 1600 + Math.random()*800);
  }
}

/* ---------------------------
   SANTA FLYBY (single) 
   --------------------------- */
(function santaFlyby(){
  const s = qs('#santa'); if(!s) return;
  // if file missing, silently ignore
  s.style.display = 'block';
  s.style.left = '-520px';
  s.style.bottom = '8vh';
  s.style.transition = 'left 1.2s ease-out';
  setTimeout(()=> { s.style.left = '14px'; }, 1400);
  setTimeout(()=> { s.style.left = '-520px'; setTimeout(()=> s.style.display = 'none', 900); }, 7600);
})();

/* ---------------------------
   LIGHTBOX
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
   MUSIC (autoplay after first gesture + explore button)
   --------------------------- */
(function musicInit(){
  const bgm = qs('#bgm'), toggle = qs('#music-toggle');
  if(!bgm || !toggle) return;
  let playing = false;
  function play(){
    bgm.muted = false;
    bgm.play().then(()=> {
      playing = true; toggle.textContent = '🔊';
    }).catch(()=>{ /* autoplay blocked */ });
  }
  // play after first pointerdown anywhere (mobile friendly)
  window.addEventListener('pointerdown', play, { once: true });
  // also when clicking Explore Menu
  qs('#exploreMenuBtn')?.addEventListener('click', play);
  // toggle
  toggle.addEventListener('click', ()=> {
    if(!playing){ play(); } else { bgm.pause(); playing=false; toggle.textContent='🔇'; }
  });
})();

/* ---------------------------
   SHARE button
   --------------------------- */
(function shareBtn(){
  const btn = qs('#shareBtn'); if(!btn) return;
  if(navigator.share){
    btn.addEventListener('click', async ()=> {
      try{ await navigator.share({ title: "Shando'z Café & Coffee Bar", text: "Coffee · Comfort · Community", url: location.href }); }catch(e){}
    });
  } else {
    btn.addEventListener('click', ()=> { prompt('Salin link ini untuk dibagikan:', location.href); });
  }
})();

/* ---------------------------
   CAROUSEL (7 slides) - swipe, dots, keyboard
   --------------------------- */
(function carousel(){
  const track = qs('.carousel-track');
  const slides = [...qsa('.carousel-slide')];
  const prevBtn = qs('.carousel-btn.prev');
  const nextBtn = qs('.carousel-btn.next');
  const dotsWrap = qs('#carouselDots');
  if(!track || slides.length === 0) return;
  let current = 0;

  // build dots
  dotsWrap.innerHTML = slides.map((_,i)=> `<button class="dot" data-i="${i}" aria-label="Slide ${i+1}"></button>`).join('');
  const dots = [...qsa('.dot')];

  function update(){
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d,i)=> d.classList.toggle('active', i===current));
  }

  prevBtn?.addEventListener('click', ()=> { current = (current - 1 + slides.length) % slides.length; update(); });
  nextBtn?.addEventListener('click', ()=> { current = (current + 1) % slides.length; update(); });
  dots.forEach(dot => dot.addEventListener('click', ()=> { current = Number(dot.dataset.i); update(); }));

  // swipe
  let startX = 0;
  const carouselElem = qs('.menu-carousel');
  carouselElem?.addEventListener('touchstart', e => startX = e.touches[0].clientX);
  carouselElem?.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    if(Math.abs(dx) > 50){
      current = dx < 0 ? (current+1) % slides.length : (current-1 + slides.length) % slides.length;
      update();
    }
  });

  // keyboard
  window.addEventListener('keydown', e => {
    if(e.key === 'ArrowRight') nextBtn?.click();
    if(e.key === 'ArrowLeft') prevBtn?.click();
  });

  // initial
  update();
})();
