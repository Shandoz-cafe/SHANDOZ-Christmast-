<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Shando'z Café & Coffee Bar</title>

  <!-- ICON -->
  <link rel="icon" type="image/png" href="logo.png">

  <!-- CSS -->
  <link rel="stylesheet" href="styles.css">

  <!-- Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">

</head>
<body>

<!-- =========================================================
     ⏳ LOADING SCREEN
========================================================= -->
<div id="loader">
  <div class="loader-box">
    <div class="loader-spin"></div>
    <p>Loading Shando'z Café…</p>
    <button id="forceCloseLoader">Skip</button>
  </div>
</div>

<!-- =========================================================
     🔼 MUSIC BUTTON
========================================================= -->
<button id="music-toggle">🔇</button>
<audio id="bgm" loop muted>
  <source src="bgm.mp3" type="audio/mp3">
</audio>

<!-- =========================================================
     🎄 CHRISTMAS POPUP (auto muncul)
========================================================= -->
<div id="xmas-popup">
  <div class="xmas-box">
    <button class="xmas-close">✕</button>

    <!-- FOTO PROMO -->
    <img src="christmaspromo.jpg" class="xmas-img">

    <h2>🎄 Christmas Special Promo 🎁</h2>
    <p>Nikmati suasana Natal dengan diskon spesial & menu edisi holiday!</p>

    <a href="#promo" class="xmas-btn">Lihat Promo</a>
  </div>
</div>

<!-- =========================================================
     🎅 SANTA SLIDE-IN
========================================================= -->
<div id="santa">
  <img src="santa.png" alt="Santa">
</div>

<!-- =========================================================
     ✨ SPARKLES
========================================================= -->
<div class="sparkle-container"></div>

<!-- =========================================================
     🎁 GIFT POP
========================================================= -->
<div id="gift-pop">
  <img src="gift.png" alt="gift">
</div>

<!-- =========================================================
     HEADER
========================================================= -->
<header class="hero">
  <img src="logo.png" id="logo" class="logo" alt="logo">
  <h1>Shando'z Café & Coffee Bar</h1>
  <p>Coffee · Comfort · Community</p>

  <button id="exploreMenuBtn" class="cta-btn">Explore Menu</button>
</header>

<!-- =========================================================
     CAROUSEL
========================================================= -->
<section class="menu-section">
  <h2 class="section-title">Our Menu</h2>

  <div class="menu-carousel">
    <button class="carousel-btn prev">←</button>

    <div class="carousel-track">
      <div class="carousel-slide">
        <img src="menu1.jpg" class="lightbox-trigger" data-full="menu1.jpg">
      </div>
      <div class="carousel-slide">
        <img src="menu2.jpg" class="lightbox-trigger" data-full="menu2.jpg">
      </div>
      <div class="carousel-slide">
        <img src="menu3.jpg" class="lightbox-trigger" data-full="menu3.jpg">
      </div>
    </div>

    <button class="carousel-btn next">→</button>
  </div>

  <div class="carousel-dots"></div>
</section>

<!-- =========================================================
     LIGHTBOX
========================================================= -->
<div id="lightbox">
  <span id="lightbox-close">✕</span>
  <img id="lightbox-img">
</div>

<!-- =========================================================
     SHARE BUTTON
========================================================= -->
<button id="shareBtn" class="share-btn">Share Website</button>

<!-- =========================================================
     FOOTER
========================================================= -->
<footer>
  <p>© 2025 Shando'z Café & Coffee Bar</p>
</footer>

<!-- =========================================================
     JS
========================================================= -->
<script src="script.js"></script>

</body>
</html>
