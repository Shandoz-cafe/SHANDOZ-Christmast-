// Main JS — combined interactions: offcanvas, reveal-on-scroll, lightbox, audio control,
// confetti utilities, hero parallax, and holiday-special modal + countdown.

document.addEventListener('DOMContentLoaded', () => {

  /* -----------------------
     Offcanvas (hamburger)
     ----------------------- */
  const hamburger = document.getElementById('hamburger');
  const offcanvas = document.getElementById('offcanvas');
  const overlay = document.getElementById('overlay');
  const offClose = document.getElementById('off-close');

  function openOffcanvas(){
    offcanvas.setAttribute('aria-hidden','false');
    hamburger.setAttribute('aria-expanded','true');
    overlay.removeAttribute('hidden');
  }
  function closeOffcanvas(){
    offcanvas.setAttribute('aria-hidden','true');
    hamburger.setAttribute('aria-expanded','false');
    overlay.setAttribute('hidden','');
  }

  hamburger.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    if (expanded) closeOffcanvas(); else openOffcanvas();
  });
  if (offClose) offClose.addEventListener('click', closeOffcanvas);
  if (overlay) overlay.addEventListener('click', closeOffcanvas);

  // close when an offcanvas link clicked
  document.querySelectorAll('.off-nav a').forEach(a => a.addEventListener('click', closeOffcanvas));

  /* -----------------------
     Reveal on scroll (text naik)
     ----------------------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18 });
    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    // fallback: show all
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* -----------------------
     Smooth anchors + focus
     ----------------------- */
  document.querySelectorAll('a.nav-link, a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('https') || href.startsWith('mailto:')) return;
      // If link points to a fragment on same page, smooth-scroll (skip external page links)
      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({behavior:'smooth', block:'start'});
          target.setAttribute('tabindex','-1');
          target.focus({preventScroll:true});
          setTimeout(()=> target.removeAttribute('tabindex'), 1200);
        }
      }
    });
  });

  /* -----------------------
     Hero tiny parallax
     ----------------------- */
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = heroTitle.getBoundingClientRect();
        const winH = window.innerHeight;
        const visibleRatio = Math.max(0, Math.min(1, (winH - rect.top) / (winH + rect.height)));
        const translate = (1 - visibleRatio) * 12; // up to 12px
        heroTitle.style.setProperty('--parallax', `${translate}px`);
        heroTitle.classList.add('parallax');
        ticking = false;
      });
    }, {passive:true});
  }

  /* -----------------------
     Lightbox (images) — improved
     ----------------------- */
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbClose = document.getElementById('lb-close');
  const lbCaption = document.getElementById('lb-caption');

  function openLightbox(src, altText) {
    if (!lightbox || !lbImg) return;
    lbImg.src = src;
    if (lbCaption) {
      if (altText) {
        lbCaption.textContent = altText;
        lbCaption.setAttribute('aria-hidden','false');
      } else {
        lbCaption.textContent = '';
        lbCaption.setAttribute('aria-hidden','true');
      }
    }
    lightbox.setAttribute('aria-hidden','false');
    // prevent background scroll
    document.body.classList.add('lb-open');
    // focus close button for accessibility
    if (lbClose) lbClose.focus();
  }

  function closeLightbox() {
    if (!lightbox || !lbImg) return;
    lightbox.setAttribute('aria-hidden','true');
    document.body.classList.remove('lb-open');
    // clear image after a small timeout to avoid flicker on very slow devices
    setTimeout(() => { lbImg.src = ''; if (lbCaption) { lbCaption.textContent = ''; lbCaption.setAttribute('aria-hidden','true'); } }, 150);
  }

  document.querySelectorAll('.lightbox-trigger').forEach(img => {
    img.addEventListener('click', (e) => {
      const src = img.getAttribute('src');
      const alt = img.getAttribute('alt') || '';
      if (!src) return;
      openLightbox(src, alt);
    });
  });

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      // close when clicking backdrop (not the image)
      if (e.target === lightbox) closeLightbox();
    });
  }
  // ESC to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && lightbox.getAttribute('aria-hidden') === 'false') {
      closeLightbox();
    }
  });

  /* -----------------------
     Background audio control + autoplay-on-link-click
     ----------------------- */
  const audio = document.getElementById('bg-audio');
  const audioToggle = document.getElementById('audio-toggle');
  if (audio) {
    // set initial volume
    audio.volume = 0.28;
  }
  if (audio && audioToggle) {
    audioToggle.addEventListener('click', () => {
      const playing = audioToggle.getAttribute('aria-pressed') === 'true';
      if (playing) {
        audio.pause();
        audioToggle.setAttribute('aria-pressed','false');
        audioToggle.textContent = '▶︎';
      } else {
        audio.play().catch(()=> {});
        audioToggle.setAttribute('aria-pressed','true');
        audioToggle.textContent = '⏸';
      }
    });
  }

  // Play background audio when user clicks any link (<a>), to satisfy "automatic nyala music backgroundnya saat klik apa saja pada halaman link"
  function tryPlayAudio() {
    if (!audio) return;
    // attempt to play (may be blocked by browser until user gesture)
    audio.play().catch(()=>{ /* ignore */ });
    // update toggle state UI
    if (audioToggle) {
      audioToggle.setAttribute('aria-pressed','true');
      audioToggle.textContent = '⏸';
    }
  }
  document.addEventListener('click', function (ev) {
    const a = ev.target.closest && ev.target.closest('a');
    if (!a) return;
    // any anchor click triggers attempt to play background audio
    tryPlayAudio();
  }, {passive:true});

  /* -----------------------
     Confetti utilities (canvas + DOM)
     ----------------------- */
  function smallDomConfetti(count, centerPercent = 50) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    for (let i=0;i<count;i++){
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      el.style.left = (centerPercent + (Math.random()-0.5)*40) + '%';
      el.style.top = (35 + Math.random()*30) + '%';
      el.style.width = el.style.height = (6 + Math.random()*10) + 'px';
      el.style.background = ['#d4af37','#f2d16b','#ffffff','#ffdca3'][Math.floor(Math.random()*4)];
      el.style.opacity = '0.95';
      el.style.borderRadius = '2px';
      el.style.zIndex = 400;
      document.body.appendChild(el);
      const vy = 40 + Math.random()*160;
      el.animate([
        { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
        { transform: `translateY(${vy}px) rotate(${Math.random()*720}deg)`, opacity: 0 }
      ], {
        duration: 700 + Math.random()*900,
        easing: 'cubic-bezier(.2,.7,.2,1)'
      });
      setTimeout(()=> el.remove(), 1800);
    }
  }

  function burstConfettiCanvas(canvas, pieces) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    const W = canvas.width, H = canvas.height;
    const conf = [];
    function rand(a,b){return Math.random()*(b-a)+a;}
    const colors = ['#d4af37','#f2d16b','#ffffff','#ffdca3'];
    for (let i=0;i<pieces;i++){
      conf.push({
        x: rand(W*0.2,W*0.8),
        y: rand(H*0.2,H*0.8),
        r: rand(4,10),
        vx: rand(-3,3),
        vy: rand(1,5),
        rot: rand(0,360),
        color: colors[Math.floor(rand(0,colors.length))],
        life: rand(60,140)
      });
    }
    let frame=0;
    function draw(){
      ctx.clearRect(0,0,W,H);
      conf.forEach((p, idx) => {
        ctx.save();
        ctx.translate(p.x,p.y);
        ctx.rotate((p.rot + Math.sin(frame/10+idx)/10) * Math.PI / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.r/2, -p.r/2, p.r, p.r*1.6);
        ctx.restore();
        p.x += p.vx;
        p.y += p.vy + Math.sin(frame/10+idx)/6;
        p.life--;
      });
      frame++;
      for (let i = conf.length -1; i >=0; i--){
        if (conf[i].life <= 0 || conf[i].y > H + 20) conf.splice(i,1);
      }
      if (conf.length > 0) requestAnimationFrame(draw);
      else ctx.clearRect(0,0,W,H);
    }
    draw();
  }

  /* -----------------------
     Promo button delight
     ----------------------- */
  const usePromo = document.getElementById('use-promo');
  if (usePromo) {
    usePromo.addEventListener('click', (e) => {
      smallDomConfetti(24);
      // allow default anchor behavior (scroll)
    });
  }

  /* -----------------------
     Holiday special modal + countdown + interactions
     ----------------------- */
  (function holidaySpecial() {
    const MODAL_ID = 'holiday-special';
    const STORAGE_KEY = 'hs_dismiss_until';
    const promoCode = 'HOLIDAY25';
    const businessWA = '6285706370841';
    const businessName = "SHANDO'Z CAFE & COFFEE BAR";

    const modal = document.getElementById(MODAL_ID);
    if (!modal) return;

    const closeBtn = document.getElementById('hs-close');
    const daysEl = document.getElementById('hs-days');
    const hoursEl = document.getElementById('hs-hours');
    const minsEl = document.getElementById('hs-mins');
    const secsEl = document.getElementById('hs-secs');
    const promoEl = document.getElementById('hs-promo-code');
    const useWA = document.getElementById('hs-use-wa');
    const cardBtn = document.getElementById('hs-card');
    const hideCheckbox = document.getElementById('hs-hide-checkbox');
    const confettiCanvas = document.getElementById('hs-confetti');
    const snowLayer = document.getElementById('hs-snow');

    if (promoEl) promoEl.textContent = promoCode;

    function getTarget() {
      const now = new Date();
      const year = now.getFullYear();
      const dec25 = new Date(year, 11, 25, 0, 0, 0);
      if (now < dec25) return dec25;
      return new Date(year + 1, 0, 1, 0, 0, 0);
    }

    function updateCountdown() {
      const target = getTarget();
      const now = new Date();
      let diff = Math.max(0, target - now);
      const secs = Math.floor((diff/1000) % 60);
      const mins = Math.floor((diff/1000/60) % 60);
      const hrs = Math.floor((diff/1000/3600) % 24);
      const days = Math.floor(diff/1000/3600/24);
      if (daysEl) daysEl.textContent = String(days).padStart(2,'0');
      if (hoursEl) hoursEl.textContent = String(hrs).padStart(2,'0');
      if (minsEl) minsEl.textContent = String(mins).padStart(2,'0');
      if (secsEl) secsEl.textContent = String(secs).padStart(2,'0');
      if (diff <= 0) clearInterval(timer);
    }
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    function isDismissedForToday() {
      const until = localStorage.getItem(STORAGE_KEY);
      if (!until) return false;
      const dt = new Date(until);
      const now = new Date();
      return now < dt;
    }
    function dismissForToday() {
      const tomorrow = new Date();
      tomorrow.setHours(23,59,59,999);
      localStorage.setItem(STORAGE_KEY, tomorrow.toISOString());
    }

    function showModal() {
      modal.setAttribute('aria-hidden','false');
      // confetti and snow only if not reduced-motion
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        burstConfettiCanvas(confettiCanvas, 80);
        smallDomConfetti(24, 50);
      }
    }
    function hideModal() { modal.setAttribute('aria-hidden','true'); }

    if (useWA) {
      const text = encodeURIComponent(`Halo ${businessName}, saya mau menggunakan promo ${promoCode}. Mohon bantuannya untuk pemesanan.`);
      useWA.href = `https://wa.me/${businessWA}?text=${text}`;
      useWA.addEventListener('click', () => {
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) smallDomConfetti(18, 50);
      });
    }

    if (cardBtn) {
      cardBtn.addEventListener('click', () => {
        const w = window.open('', '_blank', 'width=800,height=600');
        const html = `
          <html><head><title>Kartu Ucapan SHANDO'Z</title>
          <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet">
          <style>
            body{margin:0;font-family:Playfair Display, serif;background:linear-gradient(180deg,#061f19,#021010);color:#fff;display:flex;align-items:center;justify-content:center;height:100vh}
            .card{width:720px;padding:40px;border-radius:18px;background:rgba(255,255,255,0.02);text-align:center;border:1px solid rgba(255,255,255,0.04)}
            h1{color:#f2d16b;margin:0 0 10px;font-size:3rem}
            p{color:rgba(255,255,255,0.9);margin:0}
            .footer{margin-top:18px;color:#d4af37}
          </style></head><body>
            <div class="card">
              <h1>Merry Christmas</h1>
              <p>Warm wishes from SHANDO'Z CAFE & COFFEE BAR</p>
              <p class="footer">Alamat: Banceuy Permai C3 No. 88, Sumur Bandung • WhatsApp: 085706370841</p>
              <p style="margin-top:16px;color:#fff">Kode Promo: <strong style="color:#d4af37">${promoCode}</strong></p>
            </div>
            <script>window.print()</script>
          </body></html>`;
        w.document.write(html);
        w.document.close();
      });
    }

    // close handlers
    if (closeBtn) closeBtn.addEventListener('click', () => {
      if (hideCheckbox && hideCheckbox.checked) dismissForToday();
      hideModal();
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        if (hideCheckbox && hideCheckbox.checked) dismissForToday();
        hideModal();
      }
    });

    if (!isDismissedForToday()) {
      setTimeout(showModal, 700);
    }

    // snow effect (decorative)
    function initSnow() {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const container = snowLayer;
      if (!container) return;
      const H = container.clientHeight || window.innerHeight;
      const count = 18;
      for (let i=0;i<count;i++){
        const s = document.createElement('div');
        s.className = 'hs-snowflake';
        s.textContent = '✦';
        s.style.position = 'absolute';
        s.style.left = Math.floor(Math.random()*100) + '%';
        s.style.top = (-10 - Math.random()*40) + 'px';
        s.style.fontSize = (8 + Math.random()*20) + 'px';
        s.style.opacity = (0.2 + Math.random()*0.9).toFixed(2);
        s.style.color = '#f2d16b';
        s.style.filter = 'drop-shadow(0 2px 6px rgba(0,0,0,0.6))';
        container.appendChild(s);
        (function(el){
          const duration = 8000 + Math.random()*10000;
          el.animate([
            { transform: `translateY(0)`, opacity: el.style.opacity },
            { transform: `translateY(${H + 40}px)`, opacity: 0.06 }
          ], { duration, easing:'linear' });
          setTimeout(()=> el.remove(), duration + 200);
        })(s);
      }
    }
    initSnow();

  })(); // end holidaySpecial

  /* -----------------------
     Performance fallback (resize)
     ----------------------- */
  window.addEventListener('resize', () => {
    // canvas sizing may need update if used later
    const canv = document.querySelectorAll('.hs-confetti');
    canv.forEach(c => {
      if (c && c.getContext) {
        c.width = c.clientWidth;
        c.height = c.clientHeight;
      }
    });
  });

}); // DOMContentLoaded end

// Lightweight canvas-based snow effect (kept as-is).
(function () {
  const container = document.getElementById('hs-snow');
  if (!container) return;

  // Respect user's motion preference
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let flakes = [];
  let width = 0;
  let height = 0;
  let lastTime = 0;

  function setup() {
    const dpr = window.devicePixelRatio || 1;
    width = container.clientWidth;
    height = container.clientHeight;
    canvas.width = Math.max(1, Math.floor(width * dpr));
    canvas.height = Math.max(1, Math.floor(height * dpr));
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const area = width * height;
    // number of flakes scaled to area; clamp to reasonable range
    const base = Math.min(Math.max(Math.round(area / 15000), 12), 120);
    flakes = [];
    for (let i = 0; i < base; i++) {
      flakes.push(createFlake(true));
    }
  }

  function createFlake(randomInit = false) {
    const x = Math.random() * width;
    const y = randomInit ? Math.random() * height : -10;
    const size = 1.5 + Math.random() * 4.5; // radius
    const speed = 20 + Math.random() * 60; // px per second
    const drift = (-0.5 + Math.random()) * 40; // horizontal drift per second
    const opacity = 0.4 + Math.random() * 0.6;
    const sway = Math.random() * 2 * Math.PI;
    const swaySpeed = 0.5 + Math.random() * 1.5;
    return { x, y, size, speed, drift, opacity, sway, swaySpeed };
  }

  function update(dt) {
    for (let f of flakes) {
      f.y += f.speed * dt;
      f.x += f.drift * dt * 0.2 + Math.sin(f.sway) * (f.size * 0.12);
      f.sway += f.swaySpeed * dt;

      // recycle
      if (f.y - f.size > height || f.x < -50 || f.x > width + 50) {
        const idx = flakes.indexOf(f);
        flakes[idx] = createFlake(false);
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    for (let f of flakes) {
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${f.opacity})`;
      // draw soft circle
      const gradient = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.size);
      gradient.addColorStop(0, `rgba(255,255,255,${f.opacity})`);
      gradient.addColorStop(1, `rgba(255,255,255,${Math.max(0, f.opacity - 0.6)})`);
      ctx.fillStyle = gradient;
      ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function tick(t) {
    if (!lastTime) lastTime = t;
    const dt = Math.min(0.06, (t - lastTime) / 1000); // clamp dt to avoid big jumps
    lastTime = t;
    update(dt);
    draw();
    requestAnimationFrame(tick);
  }

  // Resize observer to adapt to layout changes
  let resizeTimer;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      setup();
    }, 120);
  }

  window.addEventListener('resize', onResize);
  // If the container becomes visible later (modal open), re-setup so flakes populate correctly.
  const obs = new MutationObserver(() => {
    // if container has size > 0, ensure canvas matches
    if (container.clientWidth > 0 && container.clientHeight > 0) {
      setup();
    }
  });
  obs.observe(container, { attributes: true, childList: true, subtree: false });

  // Initialize and start
  setup();
  requestAnimationFrame(tick);
})();
```

```html name=contact.html url=https://github.com/Shandoz-cafe/SHANDOZ-Christmast-/blob/main/contact.html
<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Kontak & Lokasi — SHANDO'Z CAFE & COFFEE BAR</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <header class="site-header">
    <div class="container header-inner">
      <a class="brand" href="index.html" aria-label="SHANDO'Z Home">
        <div class="brand-mark" aria-hidden="true">S'</div>
        <span class="brand-text">SHANDO'Z CAFE & COFFEE BAR</span>
      </a>
      <nav class="main-nav" aria-label="Main navigation">
        <ul>
          <li><a href="index.html#menu" class="nav-link">Menu</a></li>
          <li><a href="index.html#promo" class="nav-link">Promo</a></li>
          <li><a href="index.html#gallery" class="nav-link">Gallery</a></li>
          <li><a href="contact.html" class="nav-link">Kontak & Lokasi</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <main>
    <section class="section contact">
      <div class="container">
        <header class="section-header">
          <h2>Kontak & Lokasi</h2>
          <p>Hubungi kami atau lihat lokasi di peta.</p>
        </header>

        <div class="contact-grid">
          <div>
            <h3>Alamat</h3>
            <p>Banceuy Permai C3 No. 88, Sumur Bandung, Indonesia</p>
            <h3>Telepon / WhatsApp</h3>
            <p><a class="btn btn-gold" href="https://wa.me/6285706370841" target="_blank" rel="noopener">Chat WhatsApp</a></p>
            <h3>Jam Operasional</h3>
            <p>Senin–Minggu: 08:00 — 22:00 (waktu setempat)</p>
          </div>

          <div>
            <h3>Peta Lokasi</h3>
            <div class="map-card" style="height:360px;border-radius:12px;overflow:hidden;">
              <iframe
                src="https://maps.app.goo.gl/79vUGCkKjksmPMjC8?g_st=ac"
                width="100%" height="100%" style="border:0;" loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
          </div>
        </div>

        <p style="margin-top:20px;">Kembali ke <a href="index.html">halaman utama</a>.</p>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container footer-inner">
      <div class="footer-bottom">
        <small>© SHANDO'Z CAFE &amp; COFFEE BAR</small>
      </div>
    </div>
  </footer>

  <audio id="bg-audio" loop preload="auto">
    <source src="Valir%20Phoenix.mp3" type="audio/mpeg">
    Your browser does not support the audio element.
  </audio>
  <script src="script.js" defer></script>
</body>
</html>
```

Ringkasan perubahan & langkah selanjutnya:
- Saya memperbaiki lightbox agar gambar menu/promo tidak nge-zoom berlebihan dengan batas max-width/max-height pada #lb-img, membuat tombol close lebih besar/kontras, dan menambahkan penanganan keyboard (ESC) dan klik backdrop untuk menutup. Saat lightbox terbuka, background tidak akan menggulir (body.lb-open).
- Saya memisahkan Kontak & Lokasi ke halaman terpisah contact.html dan memperbarui tautan navigasi di index.html/offcanvas agar mengarah ke contact.html (tidak lagi menampilkan bagian kontak pada halaman utama).
- Saya menambahkan auto-play attempt untuk background music saat pengguna mengklik link apapun (<a>) di halaman — script akan mencoba memutar audio pada klik link dan juga memperbarui tombol toggle.
- Saya mengupdate styles.css dan script.js sesuai perbaikan di atas.

Catatan penting:
- Browser modern dapat memblokir autoplay sebelum ada gesture pengguna. Saya menambahkan mekanisme untuk mencoba memutar saat klik link; namun jika browser tetap memblokir, pengguna harus menekan tombol audio (▶︎) atau klik link lagi untuk memberikan gesture.
- Jika mau, saya bisa membuat PR di repo dengan file-file ini atau hanya kirim patch/commit. Mau saya commit langsung ke repo (butuh akses/konfirmasi branch) atau kamu yang copy-paste file hasil edit ini?
