/* Landing BRIKETA — ikon, bahasa ID/EN, animasi reveal */
(() => {
'use strict';
const P = {
  brick:'<rect x="3" y="7" width="18" height="11" rx="3"/><path d="M3 12h18M9 7v5M15 12v6"/>',
  thermo:'<path d="M14 14.5V5a2 2 0 1 0-4 0v9.5a4 4 0 1 0 4 0z"/><path d="M12 17v-6"/>',
  drop:'<path d="M12 3s6 6.4 6 11a6 6 0 0 1-12 0c0-4.6 6-11 6-11z"/>',
  mix:'<path d="M5 10h14l-1.5 9a2 2 0 0 1-2 1.7h-7a2 2 0 0 1-2-1.7z"/><path d="M9 10V4M15 10l3-6"/>',
  chip:'<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
  home:'<path d="M4 11l8-7 8 7v8a1.5 1.5 0 0 1-1.5 1.5H15v-6H9v6H5.5A1.5 1.5 0 0 1 4 19z"/>',
  flow:'<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="12" r="2.5"/><circle cx="6" cy="18" r="2.5"/><path d="M8.5 6H13a3 3 0 0 1 3 3v.5M15.5 13.5V15a3 3 0 0 1-3 3H8.5"/>',
  chart:'<path d="M4 19h16"/><path d="M5 15l4-5 4 3 6-7"/>',
  box:'<path d="M3 7.5L12 3l9 4.5v9L12 21l-9-4.5z"/><path d="M3 7.5l9 4.5 9-4.5M12 12v9"/>',
  bell:'<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
  blade:'<circle cx="12" cy="12" r="2.2"/><path d="M12 9.8C11 6 13 3.5 16 3c-.3 3-1.5 5.3-4 6.8zM14.2 12c3.8-1 6.3 1 6.8 4-3-.3-5.3-1.5-6.8-4zM12 14.2c1 3.8-1 6.3-4 6.8.3-3 1.5-5.3 4-6.8zM9.8 12C6 13 3.5 11 3 8c3 .3 5.3 1.5 6.8 4z"/>',
  flame:'<path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2.5 1.5-3.6 2.5-5 .3 1.8 1 2.6 2 3-.5-3 .2-5.6.5-8z"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.4 1.4M17.6 17.6L19 19M5 19l1.4-1.4M17.6 6.4L19 5"/>',
  press:'<path d="M6 3h12M12 3v7"/><rect x="8" y="10" width="8" height="4" rx="1"/><rect x="5" y="16" width="14" height="5" rx="2"/>',
  trash:'<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/><path d="M10 11v5M14 11v5"/>',
  leaf:'<path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15"/><path d="M5 19c3-4 6-6 10-8"/>',
  phone:'<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
  power:'<rect x="4" y="7" width="16" height="10" rx="2.5"/><path d="M8 7V4M16 7V4M8 12h2M14 12h2"/>',
  screen:'<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M9 20h6M12 16v4"/>',
  gauge:'<path d="M4 16a8 8 0 1 1 16 0"/><path d="M12 16l4-5"/><circle cx="12" cy="16" r="1.4"/>',
  arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
  store:'<path d="M4 9l1.5-5h13L20 9"/><path d="M4 9h16v2a2.7 2.7 0 0 1-5.3 0 2.7 2.7 0 0 1-5.4 0A2.7 2.7 0 0 1 4 11z"/><path d="M5 13v7h14v-7"/>',
  play:'<path d="M8 5l11 7-11 7z"/>'
};
const ico = (n, s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${P[n] || ''}</svg>`;

const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
function store(k, v) { try { if (v === undefined) return localStorage.getItem('brk_' + k); localStorage.setItem('brk_' + k, v); } catch (e) { return null; } }

/* data dari proposal */
const SPEC = {
  id: [['Kapasitas input', '3–5 kg limbah organik/hari'], ['Pencacahan', 'Manual/semi-motorik (shredder kecil)'], ['Karbonisasi', '300–450 °C, disesuaikan hasil uji fungsi'], ['Perekat', 'Tepung tapioka/kanji, 10–20%'], ['Pencetakan', 'Press manual/dongkrak hidrolik kecil'], ['Monitoring', 'Suhu & kelembapan (sensor suhu tinggi, DHT22)'], ['Kendali', 'Mikrokontroler ESP32 + aplikasi digital'], ['Daya', '220 V AC, 5 V DC untuk sensor/ESP32'], ['Acuan mutu', 'SNI 01-6235-2000']],
  en: [['Input capacity', '3–5 kg organic waste/day'], ['Shredding', 'Manual/semi-motorized (small shredder)'], ['Carbonization', '300–450 °C, tuned by function tests'], ['Binder', 'Tapioca starch, 10–20%'], ['Moulding', 'Manual press/small hydraulic jack'], ['Monitoring', 'Temperature & humidity (high-temp sensor, DHT22)'], ['Control', 'ESP32 microcontroller + digital app'], ['Power', '220 V AC, 5 V DC for sensors/ESP32'], ['Quality reference', 'SNI 01-6235-2000']]
};
const ROAD = {
  id: ['Persiapan, kemitraan & perancangan detail', 'Fabrikasi unit pencacah, pengering, karbonisasi & pencetak', 'Pengumpulan & pra-pengolahan bahan baku', 'Uji fungsi karbonisasi & pencetakan', 'Uji kualitas briket di laboratorium (SNI)', 'Evaluasi kinerja, laporan & diseminasi'],
  en: ['Preparation, partnership & detailed design', 'Fabrication of shredder, dryer, carbonizer & moulder', 'Feedstock collection & pre-processing', 'Carbonization & moulding function tests', 'Briquette quality lab tests (SNI)', 'Performance evaluation, reporting & dissemination']
};
const MONTH = { id: ['Bulan 1–2', 'Bulan 2–3', 'Bulan 3–4', 'Bulan 4–5', 'Bulan 5–6', 'Bulan 6'], en: ['Month 1–2', 'Month 2–3', 'Month 3–4', 'Month 4–5', 'Month 5–6', 'Month 6'] };
const TEAM = [['Rahma Nur Citantya', 'I0324108', 1], ['Nihayatul Watsiqoh', 'I0324095'], ['Rinka Amelia Gifanti', 'I0324099'], ['Safira Budi Ramadhani', 'I0324100'], ['Fami Wulan Devitasari', 'I0324115']];

const initials = n => n.split(' ').slice(0, 2).map(w => w[0]).join('');
function render(lang) {
  $('#specLp').innerHTML = SPEC[lang].map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join('');
  $('#road').innerHTML = ROAD[lang].map((t, i) => `<div class="rm rv in"><small>${MONTH[lang][i]}</small><p>${t}</p><div class="bar"><i style="width:${Math.round((i + 1) / 6 * 100)}%"></i></div></div>`).join('');
  $('#teamLp').innerHTML = TEAM.map(([n, nim, lead]) => `<div class="card mem rv in ${lead ? 'lead' : ''}"><div class="av">${initials(n)}</div><b>${n}</b><small>${nim}</small>${lead ? `<div><span class="status idle">${lang === 'id' ? 'Ketua' : 'Lead'}</span></div>` : ''}</div>`).join('');
}

/* bahasa: teks ID asli disimpan, teks EN dari atribut data-en */
$$('[data-en]').forEach(el => { el.dataset.id = el.textContent; });
function setLang(lang) {
  document.documentElement.lang = lang;
  $$('[data-en]').forEach(el => { el.textContent = lang === 'en' ? el.dataset.en : el.dataset.id; });
  $$('#lang button').forEach(b => b.classList.toggle('on', b.dataset.l === lang));
  render(lang); store('lang', JSON.stringify(lang));
  document.dispatchEvent(new CustomEvent('lang', { detail: lang }));
}
$('#lang').addEventListener('click', e => { const b = e.target.closest('button'); if (b) setLang(b.dataset.l); });

$$('i[data-ic]').forEach(el => { const big = el.closest('.ic-lg,.fstep .n'); el.outerHTML = ico(el.dataset.ic, big ? 24 : 18); });

let saved = 'id'; try { saved = JSON.parse(store('lang')) || 'id'; } catch (e) {}
setLang(saved === 'en' ? 'en' : 'id');

/* reveal saat scroll */
const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 }) : null;
$$('.rv').forEach((el, i) => { el.style.transitionDelay = (i % 5) * 70 + 'ms'; io ? io.observe(el) : el.classList.add('in'); });

const nav = $('#lpNav');
const onScroll = () => nav.classList.toggle('scrolled', scrollY > 10);
addEventListener('scroll', onScroll, { passive: true }); onScroll();
})();
