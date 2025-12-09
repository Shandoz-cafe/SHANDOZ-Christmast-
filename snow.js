// Lightweight canvas-based snow effect for #hs-snow (respects prefers-reduced-motion)
(function () {
  const container = document.getElementById('hs-snow');
  if (!container) return;

  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden','true');
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let flakes = [];
  let width = 0;
  let height = 0;
  let lastTime = 0;

  function setup() {
    const dpr = window.devicePixelRatio || 1;
    width = container.clientWidth || window.innerWidth;
    height = container.clientHeight || 280;
    canvas.width = Math.max(1, Math.floor(width * dpr));
    canvas.height = Math.max(1, Math.floor(height * dpr));
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);

    const area = width * height;
    const base = Math.min(Math.max(Math.round(area / 15000), 12), 80);
    flakes = [];
    for (let i=0;i<base;i++) flakes.push(createFlake(true));
  }

  function createFlake(randomInit=false){
    const x = Math.random() * width;
    const y = randomInit ? Math.random() * height : -10;
    const size = 1.5 + Math.random() * 4.5;
    const speed = 20 + Math.random() * 60;
    const drift = (-0.5 + Math.random()) * 40;
    const opacity = 0.4 + Math.random() * 0.6;
    const sway = Math.random() * Math.PI * 2;
    const swaySpeed = 0.5 + Math.random() * 1.5;
    return { x, y, size, speed, drift, opacity, sway, swaySpeed };
  }

  function update(dt){
    for (let f of flakes){
      f.y += f.speed * dt;
      f.x += f.drift * dt * 0.2 + Math.sin(f.sway) * (f.size * 0.12);
      f.sway += f.swaySpeed * dt;
      if (f.y - f.size > height || f.x < -50 || f.x > width + 50) {
        const idx = flakes.indexOf(f);
        flakes[idx] = createFlake(false);
      }
    }
  }

  function draw(){
    ctx.clearRect(0,0,width,height);
    for (let f of flakes){
      const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.size);
      grad.addColorStop(0, `rgba(255,255,255,${f.opacity})`);
      grad.addColorStop(1, `rgba(255,255,255,${Math.max(0, f.opacity - 0.6)})`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.size, 0, Math.PI*2);
      ctx.fill();
    }
  }

  function tick(t){
    if (!lastTime) lastTime = t;
    const dt = Math.min(0.06, (t - lastTime) / 1000);
    lastTime = t;
    update(dt);
    draw();
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', () => setTimeout(setup, 120));
  setup();
  requestAnimationFrame(tick);
})();
