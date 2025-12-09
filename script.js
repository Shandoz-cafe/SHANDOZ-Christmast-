// Full interactions: offcanvas, reveal, lightbox (prev/next/download), audio control,
// holiday modal (countdown + confetti), snow fallback, and repaint hack.
// Use this file as the canonical script.js in your repo.

document.addEventListener('DOMContentLoaded', () => {
  try {
    /* -----------------------
       Offcanvas (hamburger)
    ----------------------- */
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

    /* -----------------------
       Reveal on scroll
    ----------------------- */
    const revealEls = document.querySelectorAll('[data-reveal]');
    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.18 });
      revealEls.forEach(el => revealObserver.observe(el));
    } else {
      revealEls.forEach(el => el.classList.add('in-view'));
    }

    /* -----------------------
       Audio control + autoplay on any link click
    ----------------------- */
    const audio = document.getElementById('bg-audio');
    const audioToggle = document.getElementById('audio-toggle');
    if (audio) audio.volume = 0.28;
    if (audio && audioToggle) {
      audioToggle.addEventListener('click', () => {
        const playing = audioToggle.getAttribute('aria-pressed') === 'true';
        if (playing) { audio.pause(); audioToggle.setAttribute('aria-pressed','false'); audioToggle.textContent = '▶︎'; }
        else { audio.play().catch(()=>{}); audioToggle.setAttribute('aria-pressed','true'); audioToggle.textContent = '⏸'; }
      });
    }
    function tryPlayAudio() {
      if (!audio) return;
      audio.play().then(()=> {
        if (audioToggle) { audioToggle.setAttribute('aria-pressed','true'); audioToggle.textContent = '⏸'; }
      }).catch(()=>{ /* ignore autoplay blocked */ });
    }
    document.addEventListener('click', function (ev) {
      const a = ev.target.closest && ev.target.closest('a');
      if (!a) return;
      tryPlayAudio();
    }, {passive:true});

    /* -----------------------
       Lightbox with prev/next and download
    ----------------------- */
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lb-img');
    const lbCaption = document.getElementById('lb-caption');
    const lbClose = document.getElementById('lb-close');
    const lbPrev = document.getElementById('lb-prev');
    const lbNext = document.getElementById('lb-next');
    const lbDownload = document.getElementById('lb-download');

    // Gather triggers dynamically so pages that add items later still work
    function getTriggers() {
      return Array.from(document.querySelectorAll('.lightbox-trigger')).filter(el => el.tagName.toLowerCase() === 'img' || el instanceof HTMLImageElement);
    }

    let currentIndex = -1;
    function showLightbox(index) {
      const triggers = getTriggers();
      if (!triggers.length) return;
      currentIndex = ((index % triggers.length) + triggers.length) % triggers.length;
      const img = triggers[currentIndex];
      const src = img.getAttribute('src') || img.dataset.src;
      const caption = img.dataset.caption || img.getAttribute('alt') || '';
      if (!src) return;
      if (lbImg) lbImg.src = src;
      if (lbCaption) { lbCaption.textContent = caption; lbCaption.setAttribute('aria-hidden', caption ? 'false' : 'true'); }
      if (lbDownload) { lbDownload.href = src; lbDownload.setAttribute('aria-hidden', 'false'); }
      if (lightbox) lightbox.setAttribute('aria-hidden','false');
      document.body.classList.add('lb-open');
      if (lbClose) lbClose.focus();
    }
    function hideLightbox() {
      if (!lightbox) return;
      lightbox.setAttribute('aria-hidden','true');
      document.body.classList.remove('lb-open');
      setTimeout(()=> {
        if (lbImg) lbImg.src = '';
        if (lbCaption) { lbCaption.textContent=''; lbCaption.setAttribute('aria-hidden','true'); }
        if (lbDownload) lbDownload.setAttribute('aria-hidden','true');
      }, 120);
    }
    function showPrev() { showLightbox(currentIndex - 1); }
    function showNext() { showLightbox(currentIndex + 1); }

    // Attach click handlers to current triggers
    function initLightboxTriggers() {
      const triggers = getTriggers();
      triggers.forEach((img, idx) => {
        // avoid adding multiple listeners
        if (!img.dataset.lbAttached) {
          img.addEventListener('click', (e) => {
            e.preventDefault();
            // recompute triggers and show correct index
            const all = getTriggers();
            const newIndex = all.indexOf(img);
            showLightbox(newIndex >= 0 ? newIndex : idx);
          });
          img.dataset.lbAttached = '1';
        }
      });
    }
    initLightboxTriggers();

    if (lbClose) lbClose.addEventListener('click', hideLightbox);
    if (lbPrev) lbPrev.addEventListener('click', showPrev);
    if (lbNext) lbNext.addEventListener('click', showNext);
    if (lightbox) lightbox.addEventListener('click', (e) => { if (e.target === lightbox) hideLightbox(); });
    document.addEventListener('keydown', (e) => {
      if (!lightbox || lightbox.getAttribute('aria-hidden') === 'true') return;
      if (e.key === 'Escape') hideLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    });

    /* -----------------------
       Confetti & small DOM confetti utility
    ----------------------- */
    function smallDomConfetti(count, centerPercent = 50) {
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
        el.style.position = 'fixed';
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

      let prev = {days:'', hours:'', mins:'', secs:''};
      function updateCountdown() {
        const target = getTarget();
        const now = new Date();
        let diff = Math.max(0, target - now);
        const secs = String(Math.floor((diff/1000) % 60)).padStart(2,'0');
        const mins = String(Math.floor((diff/1000/60) % 60)).padStart(2,'0');
        const hrs = String(Math.floor((diff/1000/3600) % 24)).padStart(2,'0');
        const days = String(Math.floor(diff/1000/3600/24)).padStart(2,'0');

        if (daysEl && prev.days !== days) { daysEl.textContent = days; pulseCount('days'); prev.days = days; }
        if (hoursEl && prev.hours !== hrs) { hoursEl.textContent = hrs; pulseCount('hours'); prev.hours = hrs; }
        if (minsEl && prev.mins !== mins) { minsEl.textContent = mins; pulseCount('mins'); prev.mins = mins; }
        if (secsEl && prev.secs !== secs) { secsEl.textContent = secs; pulseCount('secs'); prev.secs = secs; }

        if (diff <= 0) clearInterval(timer);
      }
      function pulseCount(key) {
        try {
          const el = document.querySelector(`.hs-count-item[data-key="${key}"]`);
          if (!el) return;
          el.classList.add('pulse');
          setTimeout(()=> el.classList.remove('pulse'), 420);
        } catch(e){}
      }
      updateCountdown();
      const timer = setInterval(updateCountdown, 1000);

      function isDismissedForToday() {
        const until = localStorage.getItem(STORAGE_KEY);
        if (!until) return false;
        const dt = new Date(until);
        return new Date() < dt;
      }
      function dismissForToday() {
        const tomorrow = new Date();
        tomorrow.setHours(23,59,59,999);
        localStorage.setItem(STORAGE_KEY, tomorrow.toISOString());
      }

      function showModal() {
        modal.setAttribute('aria-hidden','false');
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          burstConfettiCanvas(confettiCanvas, 80);
          smallDomConfetti(24, 50);
        }
      }
      function hideModal() { modal.setAttribute('aria-hidden','true'); }

      if (useWA) {
        const text = encodeURIComponent(`Halo ${businessName}, saya mau menggunakan promo ${promoCode}. Mohon bantuannya untuk pemesanan.`);
        useWA.href = `https://wa.me/${businessWA}?text=${text}`;
        useWA.addEventListener('click', () => { if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) smallDomConfetti(18,50); });
      }

      if (cardBtn) {
        cardBtn.addEventListener('click', () => {
          const w = window.open('', '_blank', 'width=800,height=600');
          const html = `
            <html><head><title>Kartu Ucapan SHANDO'Z</title>
            <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet">
            <style>body{margin:0;font-family:Playfair Display, serif;background:linear-gradient(180deg,#061f19,#021010);color:#fff;display:flex;align-items:center;justify-content:center;height:100vh}.card{width:720px;padding:40px;border-radius:18px;background:rgba(255,255,255,0.02);text-align:center;border:1px solid rgba(255,255,255,0.04)}h1{color:#f2d16b;margin:0 0 10px;font-size:3rem}</style></head><body>
              <div class="card"><h1>Merry Christmas</h1><p>Warm wishes from SHANDO'Z CAFE & COFFEE BAR</p><p style="margin-top:16px;color:#fff">Kode Promo: <strong style="color:#d4af37">${promoCode}</strong></p></div>
              <script>window.print()</script></body></html>`;
          w.document.write(html); w.document.close();
        });
      }

      if (closeBtn) closeBtn.addEventListener('click', () => {
        if (hideCheckbox && hideCheckbox.checked) dismissForToday();
        hideModal();
      });
      modal.addEventListener('click', (e) => { if (e.target === modal) { if (hideCheckbox && hideCheckbox.checked) dismissForToday(); hideModal(); } });

      if (!isDismissedForToday()) setTimeout(showModal, 700);

      // decorative snow fallback
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
      } catch(e){}
    })();

    /* -----------------------
       Resize fallback for canvases
    ----------------------- */
    window.addEventListener('resize', () => {
      document.querySelectorAll('.hs-confetti').forEach(c => { if (c && c.getContext) { c.width = c.clientWidth; c.height = c.clientHeight; } });
    });

    /* -----------------------
       Repaint hack to reduce tiled seams on some mobile GPUs
    ----------------------- */
    window.addEventListener('load', () => {
      try {
        document.documentElement.style.transform = 'translateZ(0)';
        requestAnimationFrame(() => {
          setTimeout(() => { document.documentElement.style.transform = ''; }, 60);
        });
      } catch(e){}
    });

    // Re-initialize lightbox triggers if DOM is updated later (useful if you lazy-load gallery)
    const mo = new MutationObserver(() => initLightboxTriggers());
    mo.observe(document.body, { childList: true, subtree: true });

  } catch (err) {
    console.error('Runtime error in main script:', err);
    try { document.querySelectorAll('.reveal').forEach(el => el.classList.add('in-view')); } catch(e){}
  }
}); // DOMContentLoaded end
