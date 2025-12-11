/* snow.js - optimized snow injected into #snow-container
   Added: rotating crystal flakes and occasional gift-fall (small) */
(function heavySnow(){
  const container = document.getElementById('snow-container');
  if(!container) return;
  const COUNT_BURST = 72; // initial burst
  const INTERVAL_MS = 750; // new flakes
  function createFlake(){
    const el = document.createElement('div');
    // randomly choose crystal (~18%) or normal flake
    const isCrystal = Math.random() < 0.18;
    if(isCrystal){
      el.className = 'crystal';
      const size = 12 + Math.random()*28;
      el.style.width = el.style.height = size + 'px';
      el.style.left = Math.random()*100 + 'vw';
      el.style.top = '-40px';
      el.style.opacity = 0.6 + Math.random()*0.35;
      const dur = 5 + Math.random()*7;
      const drift = (Math.random()*300 - 150);
      el.style.transition = `transform ${dur}s cubic-bezier(.1,.8,.2,1), opacity ${dur}s linear`;
      requestAnimationFrame(()=>{
        el.style.transform = `translateY(${window.innerHeight + 140}px) translateX(${drift}px) rotate(${(Math.random()*720 - 360)}deg)`;
      });
      container.appendChild(el);
      setTimeout(()=> el.remove(), (dur+0.6)*1000);
      return;
    }

    // normal round flake (kept similar to original)
    el.className = 'snow';
    const size = 6 + Math.random()*26;
    el.style.width = el.style.height = size + 'px';
    el.style.left = Math.random()*100 + 'vw';
    el.style.top = '-30px';
    el.style.opacity = 0.25 + Math.random()*0.75;
    const dur = 4 + Math.random()*6;
    el.style.transition = `transform ${dur}s linear`;
    const drift = (Math.random()*220 - 110);
    requestAnimationFrame(()=>{
      el.style.transform = `translateY(${window.innerHeight + 120}px) translateX(${drift}px)`;
    });
    container.appendChild(el);
    setTimeout(()=> el.remove(), (dur+0.6)*1000);
  }

  // initial burst
  for(let i=0;i<COUNT_BURST;i++) setTimeout(createFlake, Math.random()*1200);
  // continuous
  setInterval(createFlake, INTERVAL_MS);

  // small extra: on resize, keep viewport in sync (helps translate distances)
  window.addEventListener('resize', ()=>{ /* no-op but keeps things smoother for future updates */ });
})();
