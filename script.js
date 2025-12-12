/* script.js - main interactions */

/* helpers */
const qs = s => document.querySelector(s);
const qsa = s => document.querySelectorAll(s);

/* LOADER (Netflix-style) */
window.addEventListener('load', () => {
  const loader = qs('#netflixLoader');
  if (!loader) return;
  setTimeout(() => loader.remove(), 2300);
});

/* PROMO MODAL (show once per day) */
(function promoModal(){
  const key = 'shandoz_promo_seen_v2';
  const modal = qs('#promoModal');
  const promoCard = qs('.promo-card');
  const closeBtn = qs('.promo-close');
  if(!modal) return;
  function openModal(){
    modal.setAttribute('aria-hidden','false');
    modal.classList.add('show');
    spawnSparkles(promoCard, 8);
  }
  function closeModal(){
    modal.setAttribute('aria-hidden','true');
    modal.classList.remove('show');
    try{ localStorage.setItem(key, Date.now()); } catch(e){}
  }
  closeBtn?.addEventListener('click', closeModal);
  setTimeout(openModal, 1400);
})();

/* Promo countdown */
(function promoCountdown(){
  const el = qs('#promoCountdown');
  if(!el) return;
  const year = new Date().getFullYear();
  const end = new Date(year, 11, 31, 23, 59, 59);
  function upd(){
    const diff = end - Date.now();
    if(diff<=0){ el.textContent = 'Promo telah berakhir'; return; }
    const d = Math.floor(diff/(1000*60*60*24));
    const h = Math.floor((diff/ (1000*60*60)) % 24);
    const m = Math.floor((diff/ (1000*60)) % 60);
    const s = Math.floor((diff/1000) % 60);
    el.textContent = `${String(d).padStart(2,'0')}d ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }
  upd();
  setInterval(upd,1000);
})();

/* Download coupon */
(function couponDownload(){
  const btn = qs('#downloadCoupon');
  if(!btn) return;
  btn.addEventListener('click', ()=>{
    const w=900,h=500;
    const c=document.createElement('canvas'); c.width=w;c.height=h;
    const ctx=c.getContext('2d');
    ctx.fillStyle='#2a221e'; ctx.fillRect(0,0,w,h);
    ctx.fillStyle='#fff'; ctx.globalAlpha=0.06;
    for(let i=0;i<80;i++){ ctx.beginPath(); ctx.arc(Math.random()*w, Math.random()*h, Math.random()*40,0,Math.PI*2); ctx.fill(); }
    ctx.globalAlpha=1;
    ctx.fillStyle='#fff'; ctx.font='bold 34px sans-serif'; ctx.fillText("SHANDO'Z HOLIDAY COUPON",40,100);
    ctx.font='700 28px sans-serif'; ctx.fillStyle='#f5d48b';
    const code='SHANDOZ2025';
    ctx.fillText("Kode: " + code, 40, 170);
    ctx.font='18px sans-serif'; ctx.fillStyle='#fff';
    ctx.fillText("Tunjukkan kode ini untuk klaim promo di Shando'z Café.",40,220);
    ctx.font='16px sans-serif'; ctx.fillStyle='#dcdcdc';
    ctx.fillText('Berlaku sampai: 31 Dec ' + (new Date().getFullYear()), 40, 280);
    const url=c.toDataURL('image/png'); const a=document.createElement('a'); a.href=url; a.download='shandoz_coupon.png'; a.click();
  });
})();

/* spawnSparkles helper (used by promo modal) */
function spawnSparkles(parent, count=6){
  if(!parent) return;
  for(let i=0;i<count;i++){
    const s=document.createElement('div'); s.className='sparkle'; s.textContent='✨';
    s.style.left = (10 + Math.random()*80) + '%';
    s.style.top  = (10 + Math.random()*70) + '%';
    s.style.animationDelay = (Math.random()*1.2)+'s';
    parent.appendChild(s);
    setTimeout(()=> s.remove(), 1600 + Math.random()*800);
  }
}

/* Santa fly-in is handled in snow.js (optional image). */

/* Lightbox */
(function lightbox(){
  const lb = qs('#lightbox'), img = qs('#lightbox-img'), close = qs('#lightbox-close');
  qsa('.lightbox-trigger').forEach(el=>{
    el.addEventListener('click', ()=>{
      img.src = el.dataset.full || el.src;
      lb.classList.add('open');
    });
  });
  close?.addEventListener('click', ()=> { lb.classList.remove('open'); img.src=''; });
})();

/* ---------------------------
   Music + Coupon Trigger (Guaranteed + Close Popup Trigger)
   --------------------------- */
(function musicInit(){
  const bgm = qs('#bgm');
  const toggle = qs('#music-toggle');
  const coupon = qs('#promoModal');
  const closePopup = qs('.promo-close');  // tombol X popup
  const exploreBtn = qs('#exploreMenuBtn');

  if(!bgm || !toggle) return;

  let playing = false;
  let tapCount = 0;
  let tapTimer = null;

  // Function to play music (guaranteed)
  function startMusic(){
    bgm.muted = false;
    bgm.play().then(()=>{
      playing = true;
      toggle.textContent = "🔊";
    }).catch(e=>console.log("Audio blocked:", e));
  }

  /* ---------------------------
      SINGLE / TRIPLE TAP
     --------------------------- */
  toggle.addEventListener("click", () => {
    tapCount++;
    if(tapTimer) clearTimeout(tapTimer);

    tapTimer = setTimeout(() => {
      if(tapCount >= 3){
        // Open coupon modal
        coupon.setAttribute("aria-hidden","false");
        coupon.classList.add("show");
      } else {
        // normal toggle
        if(!playing){ startMusic(); }
        else { bgm.pause(); playing = false; toggle.textContent = "🔇"; }
      }
      tapCount = 0;
    }, 250);
  });

  /* ---------------------------
      HOLD 1 DETIK → buka kupon
     --------------------------- */
  let holdTimer = null;
  toggle.addEventListener("pointerdown", () => {
    holdTimer = setTimeout(()=>{
      coupon.setAttribute("aria-hidden","false");
      coupon.classList.add("show");
    }, 900);
  });
  toggle.addEventListener("pointerup", ()=> clearTimeout(holdTimer));
  toggle.addEventListener("pointerleave", ()=> clearTimeout(holdTimer));

  /* ---------------------------
      NEW: PLAY on popup CLOSE
     --------------------------- */
  closePopup?.addEventListener("click", () => {
    startMusic(); // musik ON saat popup ditutup
  });

  /* ---------------------------
      Play on explore button 
     --------------------------- */
  exploreBtn?.addEventListener("click", () => {
    startMusic();
  });

})();
/* Share button */
(function share(){
  const btn = qs('#shareBtn'); if(!btn) return;
  if(navigator.share){
    btn.addEventListener('click', async ()=> {
      try{ await navigator.share({ title:"Shando'z Café & Coffee Bar", text:"Coffee · Comfort · Community", url:location.href }); } catch(e){}
    });
  } else {
    btn.addEventListener('click', ()=> { prompt('Salin link ini untuk dibagikan:', location.href); });
  }
})();

/* Carousel (7 slides) */
(function carousel(){
  const track = qs('.carousel-track'); const slides = [...qsa('.carousel-slide')];
  const prev = qs('.carousel-btn.prev'); const next = qs('.carousel-btn.next'); const dotsWrap = qs('#carouselDots');
  if(!track || slides.length===0) return;
  // build dots
  dotsWrap.innerHTML = slides.map((_,i)=> `<button class="dot" data-i="${i}" aria-label="Slide ${i+1}"></button>`).join('');
  const dots = [...qsa('.dot')];
  let current = 0;
  function update(){
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d,i)=> d.classList.toggle('active', i===current));
  }
  prev?.addEventListener('click', ()=> { current = (current-1+slides.length)%slides.length; update(); });
  next?.addEventListener('click', ()=> { current = (current+1)%slides.length; update(); });
  dots.forEach(d=> d.addEventListener('click', ()=> { current = Number(d.dataset.i); update(); }));
  // swipe
  let startX=0; const carouselEl = qs('.menu-carousel');
  carouselEl?.addEventListener('touchstart', e=> startX = e.touches[0].clientX);
  carouselEl?.addEventListener('touchend', e=>{
    const dx = e.changedTouches[0].clientX - startX;
    if(Math.abs(dx) > 40){
      current = dx < 0 ? (current+1)%slides.length : (current-1+slides.length)%slides.length; update();
    }
  });
  // keyboard
  window.addEventListener('keydown', e=> { if(e.key==='ArrowRight') next?.click(); if(e.key==='ArrowLeft') prev?.click(); });
  update();
})();

/* -------------------------
   CHRISTMAS DECOR BEHAVIOR
--------------------------- */

(function christmasDecor(){
  const gift = document.getElementById("gift-bottom");
  let lastY = window.scrollY;

  window.addEventListener("scroll", () => {
    const y = window.scrollY;

    if (y > lastY) {
      // scroll down → sembunyikan kado
      gift.classList.add("hide");
    } else {
      // scroll up → tampil
      gift.classList.remove("hide");
    }

    lastY = y;
  });
})();

const hamburgerBtn = document.getElementById("hamburgerBtn");
const mobileMenu = document.getElementById("mobileMenu");

hamburgerBtn?.addEventListener("click", () => {
  mobileMenu.classList.toggle("show");
});
