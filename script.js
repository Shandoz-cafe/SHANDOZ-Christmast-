/* helpers */
const qs = s => document.querySelector(s);
const qsa = s => document.querySelectorAll(s);

/* ---------------------------
   LOADER (Netflix style) - no skip
   --------------------------- */
window.addEventListener('load', () => {
  const loader = qs('#netflixLoader');
  if (!loader) return;
  // remove after animation duration (2.2s in CSS)
  setTimeout(() => {
    loader.remove();
  }, 2300);
});

/* ---------------------------
   PROMO MODAL (show once per day)
   --------------------------- */
(function promoModal(){
  const key = 'shandoz_promo_seen_v1';
  const modal = qs('#promoModal');
  const promoCard = qs('.promo-card');
  const closeBtn = qs('.promo-close');

  function openModal(){
    if(!modal) return;
    modal.setAttribute('aria-hidden','false');
    modal.classList.add('show');
    spawnSparkles(promoCard, 8);
  }
  function closeModal(){
    if(!modal) return;
    modal.setAttribute('aria-hidden','true');
    modal.classList.remove('show');
    try{ localStorage.setItem(key, Date.now()); } catch(e){}
  }

  closeBtn?.addEventListener('click', closeModal);

  try{
    const seen = localStorage.getItem(key);
    if(!seen || (Date.now() - Number(seen)) > 24*3600*1000){
      setTimeout(openModal, 1400);
    }
  } catch(e){
    setTimeout(openModal, 1400);
  }
})();

/* ---------------------------
   Promo countdown (Dec 31)
   --------------------------- */
(function promoCountdown(){
  const countdownEl = qs('#promoCountdown');
  if(!countdownEl) return;
  const now = new Date();
  const year = now.getFullYear();
  const promoEnd = new Date(year, 11, 31, 23, 59, 59);
  function update(){
    const diff = promoEnd - Date.now();
    if(diff <= 0){ countdownEl.textContent = 'Promo telah berakhir'; return; }
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
   Download coupon (canvas PNG)
   --------------------------- */
(function couponDownload(){
  const btn = qs('#downloadCoupon');
  if(!btn) return;
  btn.addEventListener('click', () => {
    const w = 900, h = 500;
    const c = document.createElement('canvas'); c.width=w; c.height=h;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#2a221e'; ctx.fillRect(0,0,w,h);
    ctx.fillStyle = '#fff'; ctx.globalAlpha = 0.06;
    for(let i=0;i<80;i++){ ctx.beginPath(); ctx.arc(Math.random()*w, Math.random()*h, Math.random()*40, 0, Math.PI*2); ctx.fill(); }
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#fff'; ctx.font = 'bold 34px sans-serif'; ctx.fillText("SHANDO'Z HOLIDAY COUPON", 40, 100);
    ctx.font = '700 28px sans-serif'; ctx.fillStyle = '#f5d48b'; const code = 'SHANDOZ2025'; ctx.fillText("Kode: " + code, 40, 170);
    ctx.font = '18px sans-serif'; ctx.fillStyle = '#fff'; ctx.fillText("Tunjukkan kode ini untuk klaim promo di Shando'z Café.", 40, 220);
    ctx.font = '16px sans-serif'; ctx.fillStyle = '#dcdcdc'; ctx.fillText('Berlaku sampai: 31 Dec ' + (new Date().getFullYear()), 40, 280);
    const dataUrl = c.toDataURL('image/png'); const a = document.createElement('a'); a.href = dataUrl; a.download = 'shandoz_coupon.png'; a.click();
  });
})();

/* ---------------------------
   Snow heavy (optimized) - injects into #snow-container
   --------------------------- */
(function heavySnow(){
  const container = qs('#snow-container'); if(!container) return;
  const COUNT = 110;
  function createFlake(){
    const el = document.createElement('div'); el.className = 'snow';
    const size = 6 + Math.random()*22; el.style.width = el.style.height = size + 'px';
    el.style.left = Math.random()*100 + 'vw'; el.style.top = '-20px';
    el.style.opacity = 0.35 + Math.random()*0.6;
    const dur = 5 + Math.random()*6; el.style.animationDuration = dur + 's';
    el.style.setProperty('--drift', (Math.random()*160 - 80) + 'px');
    // animate using transform via requestAnimationFrame fallback to CSS
    el.style.transition = `transform ${dur}s linear`;
    container.appendChild(el);
    // simulate fall with CSS transform to keep perf good
    requestAnimationFrame(()=> {
      el.style.transform = `translateY(${window.innerHeight + 100}px) translateX(${ (Math.random()*160 - 80)}px)`;
    });
    setTimeout(()=> { el.remove(); }, (dur+0.5)*1000);
  }
  // burst initial
  for(let i=0;i<COUNT;i++) setTimeout(createFlake, Math.random()*1200);
  setInterval(createFlake, 900);
})();

/* ---------------------------
   Sparkles spawn near promo
   --------------------------- */
function spawnSparkles(parent, count = 6){
  if(!parent) return;
  for(let i=0;i<count;i++){
    const s = document.createElement('div'); s.className = 'sparkle'; s.textContent = '✨';
    s.style.left = (10 + Math.random()*80) + '%'; s.style.top = (10 + Math.random()*70) + '%';
    s.style.animationDelay = (Math.random()*1.2) + 's'; parent.appendChild(s);
    setTimeout(()=> s.remove(), 1600 + Math.random()*800);
  }
}

/* ---------------------------
   Santa slide-in
   --------------------------- */
(function santaFlyby(){
  const s = qs('#santa'); if(!s) return;
  s.style.display = 'block'; s.style.position = 'fixed'; s.style.left = '-360px'; s.style.bottom = '10vh';
  s.style.zIndex = 13000; s.style.transition = 'left 1.1s ease-out';
  setTimeout(()=> { s.style.left = '12px'; }, 1200);
  setTimeout(()=> { s.style.left = '-360px'; setTimeout(()=> s.style.display = 'none', 900); }, 7000);
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
   Music autoplay after first tap (and Explore button triggers)
   --------------------------- */
(function musicInit(){
  const bgm = qs('#bgm'), toggle = qs('#music-toggle');
  if(!bgm || !toggle) return;
  let playing = false;
  function play(){
    // many browsers require user gesture; this plays after first pointerdown anywhere
    bgm.muted = false;
    bgm.play().then(()=> {
      playing = true; toggle.textContent = '🔊';
    }).catch(()=>{});
  }
  // play after first user tap anywhere (one-shot)
  window.addEventListener('pointerdown', play, { once: true });
  // also play when user clicks Explore Menu
  qs('#exploreMenuBtn')?.addEventListener('click', play);
  // toggle button
  toggle.addEventListener('click', ()=> {
    if(!playing){ play(); } else { bgm.pause(); playing = false; toggle.textContent = '🔇'; }
  });
})();

/* ---------------------------
   Share button (Web Share API)
   --------------------------- */
(function shareBtn(){
  const btn = qs('#shareBtn'); if(!btn) return;
  if(navigator.share){
    btn.addEventListener('click', async ()=> {
      try{ await navigator.share({ title: "Shando'z Café & Coffee Bar", text: "Coffee · Comfort · Community", url: location.href }); }
      catch(e){}
    });
  } else { btn.addEventListener('click', ()=> { prompt('Salin link ini untuk dibagikan:', location.href); }); }
})();

/* ---------------------------
   Carousel logic (7 slides, swipe, dots)
   --------------------------- */
(function carousel(){
  const track = qs('.carousel-track');
  const slides = [...qsa('.carousel-slide')];
  const prevBtn = qs('.carousel-btn.prev');
  const nextBtn = qs('.carousel-btn.next');
  const dotsWrap = qs('#carouselDots');
  let current = 0;
  if(!track || slides.length===0) return;

  // build dots
  dotsWrap.innerHTML = slides.map((_,i)=> `<button class="dot" data-i="${i}" aria-label="Go to slide ${i+1}"></button>`).join('');
  const dots = [...qsa('.dot')];
  function update(){
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d,i)=> d.classList.toggle('active', i===current));
  }
  prevBtn?.addEventListener('click', ()=> {
    current = (current-1+slides.length) % slides.length; update();
  });
  nextBtn?.addEventListener('click', ()=> {
    current = (current+1) % slides.length; update();
  });
  dots.forEach(dot => dot.addEventListener('click', ()=> {
    current = Number(dot.dataset.i); update();
  }));

  // swipe support
  let startX = 0;
  const carouselElem = qs('.menu-carousel');
  carouselElem?.addEventListener('touchstart', e => startX = e.touches[0].clientX);
  carouselElem?.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    if(Math.abs(dx) > 40){
      current = dx < 0 ? (current+1) % slides.length : (current-1+slides.length) % slides.length;
      update();
    }
  });

  // keyboard
  window.addEventListener('keydown', (e)=> {
    if(e.key === 'ArrowRight') nextBtn?.click();
    if(e.key === 'ArrowLeft') prevBtn?.click();
  });

  // initial render
  update();
})();
