/* snow.js - optimized snow injected into #snow-container */
(function heavySnow(){
  const container = document.getElementById('snow-container');
  if(!container) return;
  const COUNT_BURST = 80; // initial burst
  const INTERVAL_MS = 850; // new flakes
  function createFlake(){
    const el = document.createElement('div');
    el.className = 'snow';
    const size = 6 + Math.random()*26;
    el.style.width = el.style.height = size + 'px';
    el.style.left = Math.random()*100 + 'vw';
    el.style.top = '-30px';
    el.style.opacity = 0.25 + Math.random()*0.75;
    const dur = 4 + Math.random()*6;
    el.style.transition = `transform ${dur}s linear`;
    // small horizontal drift
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
})();
