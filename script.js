```javascript
/* HELPERS */
const qs = s=>document.querySelector(s);
const qsa = s=>document.querySelectorAll(s);

/* SMOOTH SCROLL */
qsa('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const t = qs(a.getAttribute('href'));
    if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth'});}
  });
});

/* LOGO CLICK */
qs('#logo')?.addEventListener('click',()=> location.href="index.html");

/* LOADING SCREEN */
window.addEventListener('load',()=>{
  setTimeout(()=>{
    qs('#loader').style.opacity="0";
    setTimeout(()=> qs('#loader').style.display="none",300);
  },800);
});

/* MUSIC */
const bgm = qs('#bgm');
const toggle = qs('#music-toggle');
let isPlaying = false;
function playMusic(){ if(!bgm) return;
  bgm.muted=false;
  bgm.play().then(()=>{isPlaying=true;toggle.textContent="🔊";}).catch(()=>{});
}
window.addEventListener('pointerdown',playMusic,{once:true});
qs('#exploreMenuBtn')?.addEventListener('click',()=>playMusic());

toggle.addEventListener('click',()=>{
  if(!isPlaying){ playMusic(); }
  else { bgm.pause(); isPlaying=false; toggle.textContent="🔇"; }
});

/* LIGHTBOX */
const lb = qs('#lightbox');
const lbImg = qs('#lightbox-img');
qs('#lightbox-close').addEventListener('click',()=> closeLB());
function openLB(src){ lb.classList.add('open'); lbImg.src=src; }
function closeLB(){ lb.classList.remove('open'); lbImg.src=""; }
qsa('.lightbox-trigger').forEach(img=> img.addEventListener('click',()=> openLB(img.dataset.full)));

/* CAROUSEL */
const track = qs('.carousel-track');
const slides = [...qsa('.carousel-slide')];
const dotsWrap = qs('.carousel-dots');
let current=0;
dotsWrap.innerHTML = slides.map((_,i)=> `<span class="carousel-dot ${i==0?'active':''}" data-i="${i}"></span>`).join('');
function update(){
  track.style.transform=`translateX(-${current*100}%)`;
  qsa('.carousel-dot').forEach((d,i)=> d.classList.toggle('active',i===current));
}
qs('.carousel-btn.next').addEventListener('click',()=>{ current=(current+1)%slides.length; update(); });
qs('.carousel-btn.prev').addEventListener('click',()=>{ current=(current-1+slides.length)%slides.length; update(); });
qsa('.carousel-dot').forEach(dot=> dot.addEventListener('click',()=>{ current=Number(dot.dataset.i); update(); }));

/* SWIPE */
let startX=0;
qs('.menu-carousel').addEventListener('touchstart',e=> startX=e.touches[0].clientX);
qs('.menu-carousel').addEventListener('touchend',e=>{
  const dx=e.changedTouches[0].clientX - startX;
  if(Math.abs(dx)>40){ current = dx<0 ? (current+1)%slides.length : (current-1+slides.length)%slides.length; update(); }
});

/* SHARE */
const shareBtn = qs('#shareBtn');
if(navigator.share){ shareBtn.addEventListener('click',async()=>{
  try{
    await navigator.share({title:"Shando'z Café",text:"Christmas Vibes at Shando'z!",url:"https://shandozcafe.site"});
  }catch(e){ console.log(e); }
});
}else{
  shareBtn.addEventListener('click',()=> alert('Share tidak didukung.'));
}

/* SNOW */
const canvas = qs('#snow-canvas');
const ctx = canvas.getContext('2d');
let W,H; function resize(){ W=canvas.width=innerWidth; H=canvas.height=innerHeight; }
resize(); window.addEventListener('resize',resize);

let snow = Array.from({length:120}).map(()=>({
  x:Math.random()*W,
  y:Math.random()*H,
  r:Math.random()*3+1,
  s:Math.random()*1+0.5
}));

function snowDraw(){
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='white';
  snow.forEach(f=>{
    ctx.beginPath(); ctx.arc(f.x,f.y,f.r,0,Math.PI*2); ctx.fill();
    f.y+=f.s; f.x+=Math.sin(f.y*0.01)*0.6;
    if(f.y>H){f.y=-5;f.x=Math.random()*W;}
  });
  requestAnimationFrame(snowDraw);
}
snowDraw();
```
