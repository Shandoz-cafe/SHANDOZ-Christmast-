<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <!-- FIXED VIEWPORT (prevents mobile auto-zoom) -->
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

  <title>Shando'z Café & Coffee Bar — Christmas & New Year</title>

  <!-- CRITICAL INLINE CSS (prevent horizontal overflow & make hero/gallery responsive immediately) -->
  <style>
    /* Critical layout fixes - minimal and safe */
    html,body{
      width:100%;
      max-width:100%;
      margin:0;
      padding:0;
      overflow-x:hidden !important;
      -webkit-text-size-adjust:100%;
      -ms-text-size-adjust:100%;
    }

    /* Ensure hero container never overflows */
    .hero { position:relative; width:100%; max-width:100%; overflow:hidden; box-sizing:border-box; }
    .hero-video {
      position:absolute;
      top:0; left:50%;
      transform:translateX(-50%);
      width:100vw;   /* limit to viewport width */
      height:100%;
      max-height:85vh;
      object-fit:cover;
      display:block;
    }

    /* Make images and grid responsive by default */
    img{max-width:100%;height:auto;display:block}
    .container{width:100%;max-width:1100px;margin:0 auto;padding:0 16px;box-sizing:border-box}
    .promo-grid, .gallery-grid { width:100%; box-sizing:border-box; display:grid; grid-template-columns: repeat(2, 1fr); gap:12px; }
    /* smaller screens: 1 column */
    @media (max-width:640px){
      .promo-grid, .gallery-grid { grid-template-columns: 1fr; }
      .hero-video { max-height:65vh; }
    }
    /* medium screens: 2 columns */
    @media (min-width:641px) and (max-width:980px){
      .promo-grid, .gallery-grid { grid-template-columns: repeat(2,1fr); }
    }
    /* desktop: 3 or 4 columns for gallery only (styles.css can override) */
    @media (min-width:981px){
      .gallery-grid { grid-template-columns: repeat(4,1fr); }
      .promo-grid { grid-template-columns: repeat(3,1fr); }
    }

    /* Promo modal safe sizing */
    #promoModal { width:100%; height:100%; }
    .promo-card { max-width:94vw; box-sizing:border-box; margin:0 12px; }

    /* Lightbox safe */
    .lightbox { max-width:100vw; overflow:hidden; box-sizing:border-box; }

    /* Ensure floating UI doesn't force width */
    .wa-floating, .share-button, #music-toggle { max-width:100%; box-sizing:border-box; }

  </style>

  <!-- link to main stylesheet (will override lightweight inline rules) -->
  <link rel="stylesheet" href="styles.css" />
</head>
<body>

  <!-- NETFLIX-STYLE LOADER (no skip) -->
  <div id="netflixLoader" class="netflix-loader" aria-hidden="true">
    <div class="loader-inner" role="status" aria-live="polite">
      <div class="loader-text">SHANDO'Z</div>
      <div class="loader-sub">Coffee · Comfort · Community</div>
    </div>
  </div>

  <!-- SNOW container -->
  <div id="snow-container" aria-hidden="true"></div>

  <!-- SANTA image (optional - replace with real file) -->
  <img id="santa" src="santa.png" alt="Santa" aria-hidden="true" style="display:none" />

  <!-- PROMO POPUP (Christmas + New Year) -->
  <div id="promoModal" class="promo-modal" role="dialog" aria-modal="true" aria-hidden="true">
    <div class="promo-card">
      <button class="promo-close" aria-label="Tutup popup">✕</button>

      <div class="promo-hero">
        <img src="christmaspromo.jpg" alt="Promo" class="promo-img" />
        <div class="promo-label">🎄 Happy Merry Christmas & Happy New Year 🎉</div>
      </div>

      <div class="promo-body">
        <h3>Special Holiday Promo</h3>
        <p>Dapatkan diskon spesial & free dessert untuk pembelian tertentu. Berlaku sampai akhir masa promo.</p>

        <div class="promo-timer">
          <div class="timer-label">Berakhir dalam</div>
          <div id="promoCountdown" class="timer-count">00d 00:00:00</div>
        </div>

        <div class="promo-actions">
          <button id="downloadCoupon" class="btn">Unduh Kupon</button>
          <a href="#promo" class="btn ghost">Lihat Detail Promo</a>
        </div>

        <p class="promo-small">Tampil sekali per hari untuk pengunjung yang sama.</p>
      </div>

    </div>
  </div>

  <!-- Header / Nav -->
  <header class="navbar">
    <div class="container" style="display:flex;align-items:center;justify-content:space-between;">
      <div class="logo" id="logo">Shando'z Café & Coffee Bar</div>
      <nav class="nav-links" aria-label="Main navigation">
        <a href="#home">Home</a>
        <a href="#promo">Promo</a>
        <a href="#menu">Menu</a>
        <a href="#gallery">Gallery</a>
        <a href="contact.html">Contact</a>
      </nav>
    </div>
  </header>

  <!-- HERO -->
  <main>
    <section id="home" class="hero">
      <video class="hero-video" autoplay muted loop playsinline>
        <source src="qponpromo.mp4" type="video/mp4">
        <!-- fallback poster -->
      </video>
      <div class="hero-overlay" aria-hidden="true"></div>
      <div class="hero-inner">
        <h1 class="hero-title">Shando'z Café & Coffee Bar</h1>
        <p class="hero-sub">Coffee · Comfort · Community</p>
        <a class="btn-cta" href="#menu" id="exploreMenuBtn">Explore Menu</a>
      </div>
    </section>

    <!-- Promo / Menu / Gallery sections -->
    <section id="promo" class="promo-section">
      <div class="container">
        <h2 class="section-title">Promo Spesial</h2>
        <div class="promo-grid">
          <div class="promo-card"><img src="promo1.jpg" alt=""></div>
          <div class="promo-card"><img src="promo2.jpg" alt=""></div>
          <div class="promo-card"><img src="promo3.jpg" alt=""></div>
        </div>
      </div>
    </section>

    <section id="menu" class="menu-section">
      <div class="container">
        <h2 class="section-title">Our Menu</h2>
        <div class="menu-carousel">
          <button class="carousel-btn prev" aria-label="Previous">‹</button>
          <div class="carousel-track">
            <div class="carousel-slide"><img src="menu1.jpg" alt=""></div>
            <div class="carousel-slide"><img src="menu2.jpg" alt=""></div>
            <div class="carousel-slide"><img src="menu3.jpg" alt=""></div>
          </div>
          <button class="carousel-btn next" aria-label="Next">›</button>
        </div>
        <div class="carousel-dots"></div>
      </div>
    </section>

    <section id="gallery" class="gallery-section">
      <div class="container">
        <h2 class="section-title">Gallery</h2>
        <div class="gallery-grid">
          <img class="lightbox-trigger" src="gal1.jpg" data-full="gal1.jpg" alt="">
          <img class="lightbox-trigger" src="gal2.jpg" data-full="gal2.jpg" alt="">
          <img class="lightbox-trigger" src="gal3.jpg" data-full="gal3.jpg" alt="">
          <img class="lightbox-trigger" src="gal4.jpg" data-full="gal4.jpg" alt="">
        </div>
      </div>
    </section>
  </main>

  <!-- Lightbox -->
  <div id="lightbox" class="lightbox" aria-hidden="true">
    <button id="lightbox-close" class="lightbox-close" aria-label="Close">✕</button>
    <img id="lightbox-img" src="" alt="">
  </div>

  <!-- Floating UI -->
  <audio id="bgm" src="Valir Phoenix.mp3" loop preload="auto"></audio>
  <button id="music-toggle" class="wa-btn" aria-label="Toggle music">🔇</button>
  <a href="https://wa.me/6285706370841" class="wa-floating" target="_blank" aria-label="WhatsApp">💬</a>
  <button id="shareBtn" class="share-button" aria-label="Share">🔗</button>

  <!-- main script -->
  <script src="script.js"></script>
</body>
</html>
