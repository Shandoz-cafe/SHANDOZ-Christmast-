// Main JS — combined interactions: offcanvas, reveal-on-scroll, lightbox, audio control,
// confetti utilities, hero parallax, and holiday-special modal + countdown.
// Put this file at end of <body> (already done in index.html).

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
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({behavior:'smooth', block:'start'});
        target.setAttribute('tabindex','-1');
        target.focus({preventScroll:true});
        setTimeout(()=> target.removeAttribute('tabindex'), 1200);
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
     Lightbox (images)
     ----------------------- */
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbClose = document.getElementById('lb-close');

  document.querySelectorAll('.lightbox-trigger').forEach(img => {
    img.addEventListener('click', (e) => {
      const src = img.getAttribute('src');
      if (!src) return;
      if (lbImg) lbImg.src = src;
      if (lightbox) lightbox.setAttribute('aria-hidden','false');
    });
  });
  if (lbClose) lbClose.addEventListener('click', () => {
    if (lightbox) lightbox.setAttribute('aria-hidden','true');
    if (lbImg) lbImg.src = '';
  });
  if (lightbox) lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.setAttribute('aria-hidden','true');
      if (lbImg) lbImg.src = '';
    }
  });

  /* -----------------------
     Background audio control
     ----------------------- */
  const audio = document.getElementById('bg-audio');
  const audioToggle = document.getElementById('audio-toggle');
  if (audio && audioToggle) {
    audio.volume = 0.28;
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
