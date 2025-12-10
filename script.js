/* Helpers */
const qs = sel => document.querySelector(sel);
const qsa = sel => document.querySelectorAll(sel);

/* Smooth scroll */
qsa('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const tgt = qs(a.getAttribute('href'));
    if(tgt){
      e.preventDefault();
      tgt.scrollIntoView({behavior:'smooth'});
    }
  });
});

/* Logo click → home */
qs('#logo')?.addEventListener('click', ()=> location.href="index.html");

/* Music */
const bgm = qs('#bgm');
const toggle = qs('#music-toggle');
let isPlaying = false;

function playMusic(){
  if(!bgm) return;
  bgm.muted = false;
  bgm.play().then(()=>{
    isPlaying = true;
    toggle.textContent = "🔊";
  }).catch(()=>{});
}

window.addEventListener('pointerdown', playMusic, {once:true});

const exploreBtn = qs('#exploreMenuBtn');
if(exploreBtn){
  exploreBtn.addEventListener('click', ()=> playMusic());
}

toggle.addEventListener('click', ()=>{
  if(!isPlaying){
    playMusic();
  } else {
    bgm.pause();
    isPlaying = false;
    toggle.textContent = "🔇";
  }
});

/* Lightbox */
const lb = qs('#lightbox');
const lbImg = qs('#lightbox-img');
qs('#lightbox-close').addEventListener('click', ()=> closeLB());

function openLB(src){
  lb.classList.add('open');
  lbImg.src = src;
}
function closeLB(){
  lb.classList.remove('open');
  lbImg.src = "";
}

qsa('.lightbox-trigger').forEach(img=>{
  img.addEventListener('click', ()=> openLB(img.dataset.full));
});

/* Carousel */
const track = qs('.carousel-track');
const slides = [...qsa('.carousel-slide')];
const dotsWrap = qs('.carousel-dots');
let current = 0;

dotsWrap.innerHTML = slides.map((_,i)=>
  `<span class="carousel-dot ${i==0?'active':''}" data-i="${i}"></span>`
).join('');

function update(){
  track.style.transform = `translateX(-${current * 100}%)`;
  qsa('.carousel-dot').forEach((d,i)=>
    d.classList.toggle('active', i===current)
  );
}

qs('.carousel-btn.next').addEventListener('click', ()=>{
  current = (current+1) % slides.length;
  update();
});
qs('.carousel-btn.prev').addEventListener('click', ()=>{
  current = (current-1+slides.length) % slides.length;
  update();
});

qsa('.carousel-dot').forEach(dot=>{
  dot.addEventListener('click', ()=>{
    current = Number(dot.dataset.i);
    update();
  });
});

/* Swipe */
let startX=0;
qs('.menu-carousel').addEventListener('touchstart', e=> startX=e.touches[0].clientX);
qs('.menu-carousel').addEventListener('touchend', e=>{
  const dx = e.changedTouches[0].clientX - startX;
  if(Math.abs(dx)>40){
    current = dx<0 ? (current+1)%slides.length : (current-1+slides.length)%slides.length;
    update();
  }
});

/* SHARE BUTTON */
const shareBtn = qs("#shareBtn");

if (navigator.share) {
  shareBtn.addEventListener("click", async () => {
    try {
      await navigator.share({
        title: "Shando'z Café & Coffee Bar",
        text: "Coffee · Comfort · Community",
        url: "https://shandozcafe.site"
      });
    } catch (err) {
      console.log("Share canceled", err);
    }
  });
} else {
  shareBtn.addEventListener("click", () => {
    alert("Fitur share tidak didukung di perangkat ini.");
  });
}

/* =========================================================
   🎄 POPUP PROMO CHRISTMAS
   ========================================================= */

const popup = qs("#xmasPopup");
const popupClose = qs("#xmasClose");

setTimeout(()=> popup.classList.add("show"), 1200);

popupClose.addEventListener("click", ()=>{
  popup.classList.remove("show");
});

/* Jaga-jaga tombol close backup */
qs("#popupForceClose")?.addEventListener("click", ()=>{
  popup.classList.remove("show");
});

/* =========================================================
   ❄️ SALJU TEBAL
   ========================================================= */
function createSnow(){
  const snow = document.createElement("div");
  snow.className = "snowflake";
  snow.style.left = Math.random()*100 + "%";
  snow.style.animationDuration = (3 + Math.random()*4) + "s";
  snow.style.opacity = Math.random();
  document.body.appendChild(snow);
  setTimeout(()=> snow.remove(), 7000);
}
setInterval(createSnow, 120);

/* =========================================================
   ✨ SPARKLES
   ========================================================= */
function sparkles(){
  const s = document.createElement("div");
  s.className = "spark";
  s.style.left = Math.random()*100 + "%";
  s.style.top = Math.random()*100 + "%";
  document.body.appendChild(s);
  setTimeout(()=> s.remove(), 1200);
}
setInterval(sparkles, 350);

/* =========================================================
   🎅 SANTA SLIDE IN
   ========================================================= */
const santa = qs("#santa");
setTimeout(()=> santa.classList.add("show"), 2000);

/* =========================================================
   🎁 GIFT POP ANIMATION
   ========================================================= */
const gift = qs("#giftBox");
gift.addEventListener("click", ()=>{
  gift.classList.add("open");
  setTimeout(()=> gift.classList.remove("open"), 1300);
});
