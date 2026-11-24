/* BRIKETA — viewer desain mesin: hotspot, teardown, putar 360°, gambar teknik */
(() => {
'use strict';
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
if (!$('#desain')) return;

/* nomor = sama dengan balon & daftar part di gambar BRK-GA-001 */
const PARTS = [
  { no: '1', key: 'hopper', icon: 'i_kitchen',
    id: ['Hopper input + chute', 'Plat stainless/galvanis 1,2 mm', 'Corong lebar tempat sisa nasi, sayur, dan lauk dapur MBG dimasukkan, lalu dialirkan ke pisau pencacah.'],
    en: ['Input hopper + chute', '1.2 mm stainless/galvanized sheet', 'Wide funnel where leftover rice, vegetables and side dishes from the MBG kitchen are loaded and fed to the shredder.'] },
  { no: '2', key: 'shredder', icon: 'i_shred',
    id: ['Shredder double-shaft', 'Motor DC high torque 12/24 V + gearbox', 'Dua poros pisau baja memperkecil ukuran limbah agar cepat kering dan matang merata saat karbonisasi.'],
    en: ['Double-shaft shredder', 'High-torque 12/24 V DC motor + gearbox', 'Two steel blade shafts reduce particle size so the waste dries quickly and carbonizes evenly.'] },
  { no: '3', key: 'dryer', icon: 'i_dry',
    id: ['Unit pengering awal', 'Elemen PTC/tubular 500 W + blower', 'Menurunkan kadar air bahan sebelum karbonisasi. Suhu dan kelembapan ruang dipantau sensor DHT22.'],
    en: ['Pre-dryer unit', '500 W PTC/tubular element + blower', 'Lowers moisture before carbonization. Chamber temperature and humidity are tracked by a DHT22 sensor.'] },
  { no: '4', key: 'drum', icon: 'i_carbon',
    id: ['Tabung karbonisasi', 'Plat besi 3 mm + selimut ceramic fiber', 'Ruang pirolisis yang dijaga pada 300–450 °C agar arang berdaya bakar tinggi dan minim asap.'],
    en: ['Carbonization drum', '3 mm steel + ceramic-fibre jacket', 'Pyrolysis chamber held at 300–450 °C for high-heat, low-smoke char.'] },
  { no: 'S', key: 'thermo', icon: 'i_thermo',
    id: ['Sensor suhu tinggi', 'Termokopel tipe K + modul MAX6675', 'Membaca suhu ruang pirolisis secara real-time dan mengirimkannya ke ESP32 untuk peringatan dini.'],
    en: ['High-temperature sensor', 'Type-K thermocouple + MAX6675 module', 'Reads the pyrolysis chamber temperature in real time and sends it to the ESP32 for early warnings.'] },
  { no: '5', key: 'chimney', icon: 'i_leaf',
    id: ['Cerobong + tutup', 'Pipa besi dengan topi hujan', 'Menyalurkan gas hasil pirolisis keluar dari tabung; katup udara di bawah tabung mengatur suplai oksigen.'],
    en: ['Chimney + cap', 'Steel pipe with rain cap', 'Vents pyrolysis gas out of the drum; an air valve below the drum controls the oxygen supply.'] },
  { no: '6', key: 'press', icon: 'i_press',
    id: ['Dongkrak hidrolik', 'Bottle jack 2–5 ton manual', 'Mendorong cetakan ke plunger atas sehingga adonan arang + tapioka terpadatkan menjadi briket.'],
    en: ['Hydraulic jack', '2–5 ton manual bottle jack', 'Pushes the mould against the top plunger, compacting the char + tapioca dough into a briquette.'] },
  { no: '7', key: 'mould', icon: 'i_briquette',
    id: ['Cetakan briket', 'Pipa SCH 40 + base', 'Cetakan silinder tebal yang menahan tekanan pengepresan dan menentukan bentuk briket.'],
    en: ['Briquette mould', 'SCH 40 pipe + base', 'Thick cylinder mould that withstands pressing force and sets the briquette shape.'] },
  { no: '8', key: 'panel', icon: 'i_chip',
    id: ['Panel kontrol IoT', 'ESP32, relay 4 kanal, HMI Nextion, e-stop', 'Otak mesin: membaca sensor, mengendalikan motor, pemanas, blower, dan katup, serta mengirim data ke aplikasi.'],
    en: ['IoT control panel', 'ESP32, 4-ch relay, Nextion HMI, e-stop', 'The brain: reads sensors, drives motor, heater, blower and valve, and streams data to the app.'] },
  { no: '9', key: 'frame', icon: 'i_bolt',
    id: ['Rangka utama', 'Besi hollow 40×40×2 mm + roda caster 2 in berrem', 'Rangka meja dua tingkat yang mudah dipindah di area dapur dan dirakit dengan pengelasan.'],
    en: ['Main frame', '40×40×2 mm hollow steel + 2 in braked casters', 'Two-tier welded table frame that can be rolled around the kitchen.'] },
  { no: '10', key: 'tray', icon: 'i_briquette',
    id: ['Rak briket & catu daya', 'PSU switching 12 V 10 A', 'Rak bawah untuk briket jadi, baskom limbah, dan catu daya sistem kendali.'],
    en: ['Briquette shelf & power', '12 V 10 A switching PSU', 'Lower shelf holding finished briquettes, the waste basin and the control power supply.'] },
];
let lang = document.documentElement.lang === 'en' ? 'en' : 'id';
let active = 'drum';
const HS = {};

function renderParts() {
  $('#parts').innerHTML = PARTS.map(p => `<button class="part ${p.key === active ? 'on' : ''}" data-k="${p.key}"><span class="no">${p.no}</span><span><b>${p[lang][0]}</b><small>${p[lang][1]}</small></span></button>`).join('');
  const p = PARTS.find(x => x.key === active);
  $('#partInfo').innerHTML = `<img src="assets/icons/${p.icon}.webp" alt=""><span class="pnum">${lang === 'id' ? 'Komponen' : 'Part'} ${p.no}</span><h3>${p[lang][0]}</h3><span class="spec-chip">${p[lang][1]}</span><p>${p[lang][2]}</p>`;
  $$('.hot').forEach(h => h.classList.toggle('on', h.dataset.k === active));
}
function renderHot(set) {
  const box = document.querySelector(`.hs[data-set="${set}"]`);
  if (!box || !HS[set]) return;
  box.innerHTML = Object.entries(HS[set]).map(([k, [x, y]]) => {
    const p = PARTS.find(q => q.key === k); if (!p) return '';
    return `<button class="hot ${k === active ? 'on' : ''}" data-k="${k}" style="left:${x * 100}%;top:${y * 100}%" aria-label="${p[lang][0]}">${p.no}<span class="lbl">${p[lang][0]}</span></button>`;
  }).join('');
}
function select(k) { active = k; renderParts(); }
document.addEventListener('click', e => {
  const b = e.target.closest('.hot,.part'); if (!b) return;
  select(b.dataset.k);
  if (b.classList.contains('part')) {
    const cur = $('.view.on').dataset.v;
    if (cur !== 'assembly' && cur !== 'exploded') show('assembly');
  }
});

['hero', 'exploded'].forEach(set => fetch(`assets/machine/machine_${set}.json`).then(r => r.json()).then(j => { HS[set] = j; renderHot(set); }).catch(() => {}));

/* tab */
function show(v) {
  $$('#vtabs button').forEach(b => b.classList.toggle('on', b.dataset.v === v));
  $$('.view').forEach(el => el.classList.toggle('on', el.dataset.v === v));
  const view = document.querySelector(`.view[data-v="${v}"]`);
  view.querySelectorAll('img[data-src]').forEach(img => { img.src = img.dataset.src; img.removeAttribute('data-src'); });
  if (v === 'spin') initSpin();
}
$('#vtabs').addEventListener('click', e => { const b = e.target.closest('button'); if (b) show(b.dataset.v); });

/* putar 360°: sprite 36 frame (6x6) */
const N = 36, COLS = 6;
let spinReady = false, frame = 0, auto = null;
function initSpin() {
  if (spinReady) return; spinReady = true;
  const el = $('#spin');
  el.style.backgroundImage = 'url(assets/machine/turn_sprite.webp)';
  el.style.backgroundSize = `${COLS * 100}% ${Math.ceil(N / COLS) * 100}%`;
  const draw = () => {
    const c = frame % COLS, r = Math.floor(frame / COLS);
    el.style.backgroundPosition = `${c / (COLS - 1) * 100}% ${r / (Math.ceil(N / COLS) - 1) * 100}%`;
  };
  draw();
  const play = () => { clearInterval(auto); auto = setInterval(() => { frame = (frame + 1) % N; draw(); }, 110); };
  play();
  let x0 = null, f0 = 0;
  el.addEventListener('pointerdown', e => { x0 = e.clientX; f0 = frame; clearInterval(auto); el.setPointerCapture(e.pointerId); $('.spin-hint').style.opacity = 0; });
  el.addEventListener('pointermove', e => { if (x0 == null) return; frame = ((f0 - Math.round((e.clientX - x0) / 12)) % N + N) % N; draw(); });
  const up = () => { if (x0 == null) return; x0 = null; setTimeout(play, 2500); };
  el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
}

/* gambar teknik: zoom + geser */
const dwg = $('#dwg');
let z = 1, tx = 0, ty = 0;
const img = () => dwg.querySelector('img');
const apply = () => { img().style.transform = `translate(${tx}px,${ty}px) scale(${z})`; };
function zoomAt(f, cx, cy) {
  const nz = Math.min(6, Math.max(1, z * f));
  tx = cx - (cx - tx) * nz / z; ty = cy - (cy - ty) * nz / z; z = nz;
  if (z === 1) { tx = 0; ty = 0; }
  apply();
}
dwg.addEventListener('wheel', e => { e.preventDefault(); const r = dwg.getBoundingClientRect(); zoomAt(e.deltaY < 0 ? 1.2 : 1 / 1.2, e.clientX - r.left, e.clientY - r.top); }, { passive: false });
let px = null, py = null;
dwg.addEventListener('pointerdown', e => { px = e.clientX; py = e.clientY; dwg.setPointerCapture(e.pointerId); });
dwg.addEventListener('pointermove', e => { if (px == null || z === 1) return; tx += e.clientX - px; ty += e.clientY - py; px = e.clientX; py = e.clientY; apply(); });
dwg.addEventListener('pointerup', () => { px = null; });
document.querySelector('.zoom').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  const r = dwg.getBoundingClientRect();
  if (b.dataset.z === '0') { z = 1; tx = ty = 0; apply(); } else zoomAt(b.dataset.z === '1' ? 1.4 : 1 / 1.4, r.width / 2, r.height / 2);
});

document.addEventListener('lang', e => { lang = e.detail; renderParts(); renderHot('hero'); renderHot('exploded'); });
renderParts();
})();
