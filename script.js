// Main JS — robust, includes lightbox, offcanvas, autoplay-on-link-click, holiday modal with countdown,
// confetti + snow triggers, and defensive checks to avoid leaving page blank on errors.

document.addEventListener('DOMContentLoaded', () => {
  try {

    /* Offcanvas (hamburger) */
    const hamburger = document.getElementById('hamburger');
    const offcanvas = document.getElementById('offcanvas');
    const overlay = document.getElementById('overlay');
    const offClose = document.getElementById('off-close');

    function openOffcanvas(){
      if (!offcanvas || !hamburger || !overlay) return;
      offcanvas.setAttribute('aria-hidden','false');
      hamburger.setAttribute('aria-expanded','true');
      overlay.removeAttribute('hidden');
    }
    function closeOffcanvas(){
      if (!offcanvas || !hamburger || !overlay) return;
      offcanvas.setAttribute('aria-hidden','true');
      hamburger.setAttribute('aria-expanded','false');
      overlay.setAttribute('hidden','');
    }
    if (hamburger) hamburger.addEventListener('click', () => {
      const expanded = hamburger.getAttribute('aria-expanded') === 'true';
      if (expanded) closeOffcanvas(); else openOffcanvas();
    });
    if (offClose) offClose.addEventListener('click', closeOffcanvas);
    if (overlay) overlay.addEventListener('click', closeOffcanvas);
    document.querySelectorAll('.off-nav a').forEach(a => a.addEventListener('click', closeOffcanvas));

    /* Reveal on scroll */
    const revealEls = document.querySelectorAll('[data-reveal]');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.18 });
      revealEls.forEach(el => observer.observe(el));
    } else {
      revealEls.forEach(el => el.classList.add('in-view'));
    }

    /* Smooth anchors (fragments) */
    document.querySelectorAll('a.nav-link, a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (!href) return;
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

    /* Parallax small */
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
          const translate = (1 - visibleRatio) * 12;
          heroTitle.style.setProperty('--parallax', `${translate}px`);
          heroTitle.classList.add('parallax');
          ticking = false;
        });
      }, {passive:true});
    }

    /* Lightbox */
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lb-img');
    const lbClose = document.getElementById('lb-close');
    const lbCaption = document.getElementById('lb-caption');

    function openLightbox(src, alt) {
      if (!lightbox || !lbImg) return;
      lbImg.src = src;
      if (lbCaption) {
        lbCaption.textContent = alt || '';
        lbCaption.setAttribute('aria-hidden', alt ? 'false' : 'true');
      }
      lightbox.setAttribute('aria-hidden','false');
      document.body.classList.add('lb-open');
      if (lbClose) lbClose.focus();
    }
    function closeLightbox() {
      if (!lightbox || !lbImg) return;
      lightbox.setAttribute('aria-hidden','true');
      document.body.classList.remove('lb-open');
      setTimeout(()=> { lbImg.src=''; if (lbCaption) { lbCaption.textContent=''; lbCaption.setAttribute('aria-hidden','true'); } }, 120);
    }
    document.querySelectorAll('.lightbox-trigger').forEach(img => {
      img.addEventListener('click', () => {
        const src = img.getAttribute('src') || img.dataset.src;
        const alt = img.getAttribute('alt') || '';
        if (!src) return;
        openLightbox(src, alt);
      });
    });
    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    if (lightbox) lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && lightbox && lightbox.getAttribute('aria-hidden') === 'false') closeLightbox(); });

    /* Audio control + autoplay on any link click */
    const audio = document.getElementById('bg-audio');
    const audioToggle = document.getElementById('audio-toggle');
    if (audio) audio.volume = 0.28;
    if (audio && audioToggle) {
      audioToggle.addEventListener('click', () => {
        const playing = audioToggle.getAttribute('aria-pressed') === 'true';
        if (playing) { audio.pause(); audioToggle.setAttribute('aria-pressed','false'); audioToggle.textContent='▶︎'; }
        else { audio.play().catch(()=>{}); audioToggle.setAttribute('aria-pressed','true'); audioToggle.textContent='⏸'; }
      });
    }
    function tryPlayAudio() {
      if (!audio) return;
      audio.play().then(()=> { if (audioToggle) { audioToggle.setAttribute('aria-pressed','true'); audioToggle.textContent='⏸'; } }).catch(()=>{/* ignored */});
    }
    document.addEventListener('click', function (ev) {
      const a = ev.target.closest && ev.target.closest('a');
      if (!a) return;
      tryPlayAudio();
    }, {passive:true});

    /* small DOM confetti + canvas burst */
    function smallDomConfetti(count, centerPercent=50) {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      for (let i=0;i<count;i++){
        const el = document.createElement('div');
        el.className = 'confetti-piece';
        el.style.left = (centerPercent + (Math.random()-0.5)*40) + '%';
        el.style.top = (35 + Math.random()*30) + '%';
        const size = 6 + Math.random()*10;
        el.style.width = el.style.height = size + 'px';
        el.style.background = ['#d4af37','#f2d16b','#ffffff','#ffdca3'][Math.floor(Math.random()*4)];
        el.style.opacity = '0.95';
        el.style.borderRadius = '2px';
        el.style.zIndex = 420;
        document.body.appendChild(el);
        const vy = 40 + Math.random()*160;
        el.animate([
          { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
          { transform: `translateY(${vy}px) rotate(${Math.random()*720}deg)`, opacity: 0 }
        ], { duration: 700 + Math.random()*900, easing:'cubic-bezier(.2,.7,.2,1)' });
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
        conf.push({ x: rand(W*0.2,W*0.8), y: rand(H*0.2,H*0.8), r: rand(4,10), vx: rand(-3,3), vy: rand(1,5), rot: rand(0,360), color: colors[Math.floor(rand(0,colors.length))], life: rand(60,140) });
      }
      let frame=0;
      function draw(){
        ctx.clearRect(0,0,W,H);
        conf.forEach((p,idx) => {
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
        for (let i = conf.length -1; i >=0; i--) if (conf[i].life <= 0 || conf[i].y > H + 20) conf.splice(i,1);
        if (conf.length > 0) requestAnimationFrame(draw);
        else ctx.clearRect(0,0,W,H);
      }
      draw();
    }

    const usePromo = document.getElementById('use-promo');
    if (usePromo) usePromo.addEventListener('click', () => smallDomConfetti(24));

    /* Holiday modal + countdown + interactions */
    (function holidaySpecial(){
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

      let prev = {days:'', hours:'', mins:'', secs:''};
      function updateCountdown(){
        const target = getTarget();
        const now = new Date();
        let diff = Math.max(0, target - now);
        const secs = String(Math.floor((diff/1000) % 60)).padStart(2,'0');
        const mins = String(Math.floor((diff/1000/60) % 60)).padStart(2,'0');
        const hrs = String(Math.floor((diff/1000/3600) % 24)).padStart(2,'0');
        const days = String(Math.floor(diff/1000/3600/24)).padStart(2,'0');

        if (daysEl && prev.days !== days) { daysEl.textContent = days; pulse('days'); prev.days = days; }
        if (hoursEl && prev.hours !== hrs) { hoursEl.textContent = hrs; pulse('hours'); prev.hours = hrs; }
        if (minsEl && prev.mins !== mins) { minsEl.textContent = mins; pulse('mins'); prev.mins = mins; }
        if (secsEl && prev.secs !== secs) { secsEl.textContent = secs; pulse('secs'); prev.secs = secs; }

        if (diff <= 0) clearInterval(timer);
      }
      function pulse(key){
        try {
          const el = document.querySelector(`.hs-count-item[data-key="${key}"]`);
          if (!el) return;
          el.classList.add('pulse');
          setTimeout(()=> el.classList.remove('pulse'), 420);
        } catch(e){}
      }
      updateCountdown();
      const timer = setInterval(updateCountdown, 1000);

      function isDismissedForToday(){
        const until = localStorage.getItem(STORAGE_KEY);
        if (!until) return false;
        return new Date() < new Date(until);
      }
      function dismissForToday(){
        const t = new Date();
        t.setHours(23,59,59,999);
        localStorage.setItem(STORAGE_KEY, t.toISOString());
      }

      function showModal(){
        modal.setAttribute('aria-hidden','false');
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
          burstConfettiCanvas(confettiCanvas, 80);
          smallDomConfetti(24, 50);
        }
      }
      function hideModal(){ modal.setAttribute('aria-hidden','true'); }

      if (useWA) {
        const text = encodeURIComponent(`Halo ${businessName}, saya mau menggunakan promo ${promoCode}. Mohon bantuannya untuk pemesanan.`);
        useWA.href = `https://wa.me/${businessWA}?text=${text}`;
        useWA.addEventListener('click', () => { if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) smallDomConfetti(18,50); });
      }

      if (cardBtn) cardBtn.addEventListener('click', () => {
        const w = window.open('', '_blank', 'width=800,height=600');
        const html = `<html><head><title>Kartu Ucapan</title><link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet"><style>body{margin:0;font-family:Playfair Display, serif;background:linear-gradient(180deg,#061f19,#021010);color:#fff;display:flex;align-items:center;justify-content:center;height:100vh}.card{width:720px;padding:40px;border-radius:18px;background:rgba(255,255,255,0.02);text-align:center;border:1px solid rgba(255,255,255,0.04)}h1{color:#f2d16b;margin:0 0 10px;font-size:3rem}</style></head><body><div class="card"><h1>Merry Christmas</h1><p>Warm wishes from SHANDO'Z CAFE & COFFEE BAR</p><p style="margin-top:16px;color:#fff">Kode Promo: <strong style="color:#d4af37">${promoCode}</strong></p></div><script>window.print()</script></body></html>`;
        w.document.write(html); w.document.close();
      });

      if (closeBtn) closeBtn.addEventListener('click', () => { if (hideCheckbox && hideCheckbox.checked) dismissForToday(); hideModal(); });
      modal.addEventListener('click', (e) => { if (e.target === modal) { if (hideCheckbox && hideCheckbox.checked) dismissForToday(); hideModal(); } });

      if (!isDismissedForToday()) setTimeout(showModal, 700);

      // small decorative snow fallback if snow.js absent
      try {
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          if (snowLayer && !snowLayer.querySelector('canvas')) {
            const H = snowLayer.clientHeight || 240;
            for (let i=0;i<12;i++){
              const s = document.createElement('div');
              s.className = 'hs-snowflake';
              s.textContent = '✦';
              s.style.position = 'absolute';
              s.style.left = `${Math.floor(Math.random()*100)}%`;
              s.style.top = `${-10 - Math.random()*40}px`;
              s.style.fontSize = `${8 + Math.random()*20}px`;
              s.style.opacity = `${(0.2 + Math.random()*0.9).toFixed(2)}`;
              s.style.color = '#f2d16b';
              snowLayer.appendChild(s);
              (function(el){ const dur = 8000 + Math.random()*10000; el.animate([{transform:'translateY(0)', opacity: el.style.opacity},{transform:`translateY(${H+40}px)`, opacity:0.06}], {duration: dur, easing:'linear'}); setTimeout(()=> el.remove(), dur+200); })(s);
            }
          }
        }
      } catch(e){/* ignore */}
    })();

    /* Resize handler for canvases */
    window.addEventListener('resize', () => {
      document.querySelectorAll('.hs-confetti').forEach(c => { if (c && c.getContext) { c.width = c.clientWidth; c.height = c.clientHeight; } });
    });

  } catch (err) {
    console.error('Runtime error:', err);
    try { document.querySelectorAll('.reveal').forEach(el => el.classList.add('in-view')); } catch(e){}
  }
});
