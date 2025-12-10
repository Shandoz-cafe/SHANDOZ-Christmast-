/* snow.js - optimized snow that injects flakes into #snow-container */
(function heavySnow(){
  const container = document.getElementById('snow-container');
  if(!container) return;
  const COUNT = 90; // balanced heavy
  function createFlake(){
    const el = document.createElement('div');
    el.className = 'snow';
    const size = 4 + Math.random()*28;
    el.style.width = el.style.height = size + 'px';
    el.style.left = Math.random()*100 + 'vw';
    el.style.top = '-24px';
    el.style.opacity = 0.25 + Math.random()*0.75;
    const dur = 5 + Math.random()*6;
    el.style.transition = `transform ${dur}s linear`;
    el.style.setProperty('--drift', (Math.random()*160 - 80) + 'px');
    container.appendChild(el);
    // requestAnimationFrame to trigger transform (performant)
    requestAnimationFrame(()=> {
      el.style.transform = `translateY(${window.innerHeight + 200}px) translateX(${ (Math.random()*160 - 80)}px) rotate(${Math.random()*360}deg)`;
    });
    // cleanup
    setTimeout(()=> { el.remove(); }, (dur+0.6)*1000);
  }
  // initial burst
  for(let i=0;i<COUNT;i++){
    setTimeout(createFlake, Math.random()*1200);
  }
  // steady stream
  setInterval(createFlake, 750);
})();
