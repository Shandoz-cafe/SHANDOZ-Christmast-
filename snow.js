(function heavySnow(){
  const container = document.getElementById('snow-container');
  if(!container) return;

  const COUNT_BURST = 80;
  const INTERVAL_MS = 850;

  function createFlake(){
    const el = document.createElement('div');
    el.className = 'snow';

    const size = 12 + Math.random()*38;
    el.style.width = el.style.height = size + 'px';

    el.style.left = Math.random()*100 + 'vw';
    el.style.top = '-40px';
    el.style.opacity = 0.9;

    const dur = 5 + Math.random()*6;
    el.style.transition = `transform ${dur}s linear`;

    const drift = (Math.random()*240 - 120);

    requestAnimationFrame(()=>{
      el.style.transform =
        `translateY(${window.innerHeight + 150}px) translateX(${drift}px)`;
    });

    container.appendChild(el);
    setTimeout(()=> el.remove(), (dur+1)*1000);
  }

  // initial
  for(let i=0;i<COUNT_BURST;i++)
    setTimeout(createFlake, Math.random()*1200);

  setInterval(createFlake, INTERVAL_MS);
})();
