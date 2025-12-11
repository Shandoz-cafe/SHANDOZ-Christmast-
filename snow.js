// ❄ SNOW EFFECT NATURAL (mix besar + kecil)

const flakes = [];

function createFlake() {
  const flake = document.createElement("img");
  flake.src = "salju.png"; // Sesuai nama file kamu
  flake.className = "flake";

  // posisi horizontal
  flake.style.left = Math.random() * window.innerWidth + "px";

  // ukuran random
  flake.style.width = (16 + Math.random() * 26) + "px";
  flake.style.opacity = (0.4 + Math.random() * 0.6).toFixed(2);

  flake.style.top = "-60px";

  document.body.appendChild(flake);

  flakes.push({
    flake,
    speed: 1 + Math.random() * 1.5,
    drift: (Math.random() - 0.5) * 1.2
  });
}

function updateFlakes() {
  for (let f of flakes) {
    let t = (parseFloat(f.flake.style.top) || -60) + f.speed;
    let l = (parseFloat(f.flake.style.left)) + f.drift;

    f.flake.style.top = t + "px";
    f.flake.style.left = l + "px";

    // hapus ketika sudah lewat bawah layar
    if (t > window.innerHeight + 80) {
      f.flake.remove();
    }
  }
}

setInterval(createFlake, 300);
setInterval(updateFlakes, 20);
