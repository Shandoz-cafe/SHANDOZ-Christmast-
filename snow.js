/* snow.js - PNG snowfall using salju.png */
(function heavySnow(){
  const container = document.getElementById('snow-container');
  if(!container) return;

  const FLAKE_SRC = "salju.png";   // ← file PNG kamu
  const COUNT_BURST = 80;          // initial burst
  const INTERVAL_MS = 850;         // continuous flake creation

  function createFlake(){
    const el = document.createElement('img');
    el.src = FLAKE_SRC;
    el.className = 'snow';

    // random size (small to medium-big)
    const size = 6 + Math.random() * 32;
    el.style.width = size + "px";
    el.style.height = size + "px";

    // start position
    el.style.left = Math.random() * 100 + "vw";
    el.style.top = "-40px";

    // slight transparency variation
    el.style.opacity = 0.35 + Math.random() * 0.55;

    // fall duration
    const dur = 4 + Math.random() * 6;
    el.style.transition = `transform ${dur}s linear`;

    // horizontal drift
    const drift = (Math.random() * 280 - 140);

    requestAnimationFrame(() => {
      el.style.transform = `translateY(${window.innerHeight + 160}px) translateX(${drift}px)`;
    });

    container.appendChild(el);

    // clean after animation
    setTimeout(() => el.remove(), (dur + 0.8) * 1000);
  }

  // initial burst
  for(let i = 0; i < COUNT_BURST; i++){
    setTimeout(createFlake, Math.random() * 1200);
  }

  // continuous snowfall
  setInterval(createFlake, INTERVAL_MS);

})();
