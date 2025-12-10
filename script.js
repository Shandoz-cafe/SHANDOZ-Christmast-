/* script.js - carousel, promo modal, loader, music, lightbox, coupon, share */
/* helpers */
const qs = s => document.querySelector(s);
const qsa = s => document.querySelectorAll(s);

/* LOADER (remove after CSS animation length) */
window.addEventListener('load', () => {
  const loader = qs('#netflixLoader');
  if (!loader) return;
  setTimeout(()=> loader.remove(), 2300);
});

/* PROMO modal (show every load) */
(function promoModal(){
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
  }

  closeBtn?.addEventListener('click', closeModal);
  setTimeout(openModal, 1400);
})();

/* Promo countdown (Dec 31) */
(function promoCountdown(){
  const el = qs('#promoCountdown');
  if(!el) return;
  const year = new Date().getFullYear();
  const end = new Date(year,11,31,23,59,59);
  function update(){
    const diff = end - Date.now();
    if(diff <= 0){ el.textContent = 'Promo telah berakhir'; return; }
    const d = Math.floor(diff/(1000*60*60*24));
    const h = Math.floor((diff/(1000*60*60)) % 24);
    const m = Math.floor((diff/(1000*60)) % 60);
    const s = Math.floor((diff/1000) % 60);
    el.textContent = `${String(d).padStart(2,'0')}d ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }
  update(); setInterval(update,1000);
})();

/* coupon download (canvas) */
(function couponDownload(){
  const btn = qs('#downloadCoupon');
  if(!btn) return;
  btn.addEventListener('click', ()=>{
    const w=1000,h=540;
    const c=document.createElement('canvas'); c.width=w;c.height=h;
    const ctx=c.getContext('2d');
    ctx.fillStyle='#2a221e'; ctx.fillRect(0,0,w,h);
    ctx.globalAlpha=0.06;
    for(let i=0;i<120;i++){ ctx.beginPath(); ctx.arc(Math.random()*w, Math.random()*h, Math.random()*50,0,Math.PI*2); ctx.fill(); }
    ctx.globalAlpha=1;
    ctx.fillStyle='#fff'; ctx.font='bold 40px sans-serif'; ctx.fillText("SHANDO'Z HOLIDAY COUPON",40,120);
    ctx.font='700 32px sans-serif'; ctx.fillStyle='#f5d48b'; const code='SHANDOZ2025';
    ctx.fillText("Kode: "+code,40,200);
    ctx.font='18px sans-serif'; ctx.fillStyle='#fff'; ctx.fillText("Tunjukkan kode ini untuk klaim promo di Shando'z Café.",40,260);
    ctx.font='16px sans-serif'; ctx.fillStyle='#dcdcdc'; ctx.fillText('Berlaku sampai: 31 Dec ' + (new Date().getFullYear()),40,320);
    const a=document.createElement('a'); a.href=c.toDataURL('image/png'); a.download='shandoz_coupon.png'; a.click();
  });
})();

/* spawn sparkles */
function spawnSparkles(parent, count=6){
  if(!parent) return;
  for(let i=0;i<count;i++){
    const s=document.createElement('div'); s.className='sparkle'; s.textContent='✨';
    s.style.left=(10+Math.random()*80)+'%'; s.style.top=(10+Math.random()*70)+'%';
    s.style.animationDelay=(Math.random()*1.2)+'s';
    parent.appendChild(s);
    setTimeout(()=> s.remove(), 1600 + Math.random()*800);
  }
}

/* Santa flyby */
(function santaFlyby(){
  const s = qs('#santa');
  if(!s) return;
  s.style.display='block'; s.style.position='fixed'; s.style.left='-360px'; s.style.bottom='10vh'; s.style.zIndex=13000;
  s.style.transition='left 1.1s ease-out';
  setTimeout(()=> s.style.left='12px', 1200);
  setTimeout(()=> { s.style.left='-360px'; setTimeout(()=> s.style.display='none',900); }, 7000);
})();

/* LIGHTBOX */
(function lightbox(){
  const lb = qs('#lightbox'), img = qs('#lightbox-img'), close = qs('#lightbox-close');
  qsa('.lightbox-trigger').forEach(el=>{
    el.addEventListener('click', ()=>{
      img.src = el.dataset.full || el.getAttribute('src'); lb.classList.add('open');
    });
  });
  close?.addEventListener('click', ()=> { lb.classList.remove('open'); img.src=''; });
})();

/* MUSIC: play after first gesture & Explore Menu click triggers */
(function musicInit(){
  const bgm = qs('#bgm'), toggle = qs('#music-toggle');
  if(!bgm || !toggle) return;
  let playing=false;
  function play(){
    bgm.muted=false;
    bgm.play().then(()=>{ playing=true; toggle.textContent='🔊'; }).catch(()=>{});
  }
  window.addEventListener('pointerdown', play, { once:true });
  qs('#exploreMenuBtn')?.addEventListener('click', play);
  toggle.addEventListener('click', ()=> {
    if(!playing){ play(); } else { bgm.pause(); playing=false; toggle.textContent='🔇'; }
  });
})();

/* SHARE button */
(function shareBtn(){
  const btn = qs('#shareBtn'); if(!btn) return;
  if(navigator.share){
    btn.addEventListener('click', async ()=> { try{ await navigator.share({ title: "Shando'z Café & Coffee Bar", text: "Coffee · Comfort · Community", url: location.href }); }catch(e){} });
  } else { btn.addEventListener('click', ()=> { prompt('Salin link ini untuk dibagikan:', location.href); }); }
})();

/* CAROUSEL - 7 slides, swipe & dots */
(function carousel(){
  const track = qs('.carousel-track');
  const slides = [...qsa('.carousel-slide')];
  const prevBtn = qs('.carousel-btn.prev');
  const nextBtn = qs('.carousel-btn.next');
  const dotsWrap = qs('#carouselDots');
  let current = 0;
  if(!track || slides.length===0) return;

  // build dots
  dotsWrap.innerHTML = slides.map((_,i)=> `<button class="dot" data-i="${i}" aria-label="Slide ${i+1}"></button>`).join('');
  const dots = [...qsa('.dot')];

  function update(){
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d,i)=> d.classList.toggle('active', i===current));
  }

  prevBtn?.addEventListener('click', ()=> { current = (current-1+slides.length)%slides.length; update(); });
  nextBtn?.addEventListener('click', ()=> { current = (current+1)%slides.length; update(); });

  dots.forEach(dot => dot.addEventListener('click', ()=> { current = Number(dot.dataset.i); update(); }));

  // swipe
  let startX=0;
  const carouselElem = qs('.menu-carousel');
  carouselElem?.addEventListener('touchstart', e => startX = e.touches[0].clientX);
  carouselElem?.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    if(Math.abs(dx) > 40){ current = dx < 0 ? (current+1)%slides.length : (current-1+slides.length)%slides.length; update(); }
  });

  // keyboard
  window.addEventListener('keydown', e=> {
    if(e.key==='ArrowRight') nextBtn?.click();
    if(e.key==='ArrowLeft') prevBtn?.click();
  });

  update();
})();
