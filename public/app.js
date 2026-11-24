/* BRIKETA Monitor — HTML/CSS/JS native. Live via Firebase RTDB, fallback ke mode demo. */
(() => {
'use strict';

const FB_CONFIG = {
  apiKey: "AIzaSyDQ7zb8ALDBtbr_c37-nxqW1Tkv0jQGV3g",
  authDomain: "briketa-official.firebaseapp.com",
  databaseURL: "https://briketa-official-default-rtdb.firebaseio.com",
  projectId: "briketa-official",
  storageBucket: "briketa-official.firebasestorage.app",
  messagingSenderId: "507868167932",
  appId: "1:507868167932:web:d18e35f1fbdd41c66f6179"
};
const DEVICE = 'BRK-01';
const ROOT = 'briketa';
const G_MAX = 600;              // skala gauge °C
const ARC = 386.4;              // 270° dari keliling r=82
const SNI = { air: 8, abu: 8, vm: 15, kalor: 5000 };   // acuan SNI 01-6235-2000 (≤, ≤, ≤, ≥)
const DEFAULT_THR = { tMin: 300, tMax: 450, rhMax: 70, mMax: 45 };

/* ---------- ikon ---------- */
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
  plus:'<path d="M12 5v14M5 12h14"/>',
  check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  blade:'<circle cx="12" cy="12" r="2.2"/><path d="M12 9.8C11 6 13 3.5 16 3c-.3 3-1.5 5.3-4 6.8zM14.2 12c3.8-1 6.3 1 6.8 4-3-.3-5.3-1.5-6.8-4zM12 14.2c1 3.8-1 6.3-4 6.8.3-3 1.5-5.3 4-6.8zM9.8 12C6 13 3.5 11 3 8c3 .3 5.3 1.5 6.8 4z"/>',
  heat:'<path d="M7 4c-1.5 2 1.5 3.5 0 5.5M12 4c-1.5 2 1.5 3.5 0 5.5M17 4c-1.5 2 1.5 3.5 0 5.5"/><rect x="3" y="13" width="18" height="7" rx="2.5"/>',
  fan:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="1.6"/><path d="M12 10.4c0-3 1.5-4.6 3.5-4.4M13.6 12c3 0 4.6 1.5 4.4 3.5M12 13.6c0 3-1.5 4.6-3.5 4.4M10.4 12c-3 0-4.6-1.5-4.4-3.5"/>',
  valve:'<path d="M3 9v6M21 9v6M3 12h4M17 12h4"/><path d="M7 8l10 8V8L7 16z"/><path d="M12 12V5M9 5h6"/>',
  warn:'<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17v.5"/>',
  flame:'<path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2.5 1.5-3.6 2.5-5 .3 1.8 1 2.6 2 3-.5-3 .2-5.6.5-8z"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.4 1.4M17.6 17.6L19 19M5 19l1.4-1.4M17.6 6.4L19 5"/>',
  press:'<path d="M6 3h12M12 3v7"/><rect x="8" y="10" width="8" height="4" rx="1"/><rect x="5" y="16" width="14" height="5" rx="2"/>'
};
const ico = (n, s = 20) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${P[n] || ''}</svg>`;
const paintIcons = (root = document) => root.querySelectorAll('i[data-ic]').forEach(el => { el.outerHTML = ico(el.dataset.ic, el.closest('.nav') ? 22 : 20); });

/* ---------- teks ID/EN ---------- */
const EN = {
  tagline:'Smart IoT Briquetting', c1:'01 · Dashboard', h1a:'MBG kitchen waste', h1b:'into clean energy',
  l1:'Monitor carbonization, dryer and briquette dough in real time from the ESP32.', karbon:'Carbonization temp',
  sensors:'Sensors', tDry:'Dryer temperature', rhDry:'Dryer humidity', mAd:'Dough moisture', capSrc:'Capacitive sensor',
  today:'Today', cap:'Capacity 3–5 kg/day', c2:'02 · Process', h2a:'Five stages', h2b:'waste → briquette',
  l2:'The active stage is read from the machine. Actuators can be controlled remotely via the 4-channel relay.',
  actuator:'Actuators', actNote:'Commands are sent to the ESP32 through Firebase. Physical panel buttons keep priority.',
  calc:'Binder calculator', calcSub:'Tapioca 10–20%', arang:'Char mass (kg)', kadar:'Binder ratio', need:'Tapioca needed', water:'Mixing water (± 1:4)',
  c3:'03 · Analytics', h3a:'Temperature', h3b:'& humidity trends', l3:'Live charts keep carbonization in the optimal range and drying complete.',
  sKarbon:'Carbonization', sDryer:'Dryer', sAdonan:'Dough', avg:'Average', inband:'Time in optimal range',
  c4:'04 · Production', h4a:'Batch log', h4b:'& SNI quality', l4:'Record waste input, binder and lab results against SNI 01-6235-2000.',
  add:'Log new batch', history:'History', c5:'05 · Alerts & Info', h5a:'Early warning', h5b:'& about the device',
  l5:'Notifications appear when parameters leave the thresholds you set.', noAlert:'No alerts yet.', thr:'Thresholds', save:'Save',
  tmin:'Carbonization min (°C)', tmax:'Carbonization max (°C)', rhmax:'Dryer RH max (%)', mrange:'Dough max (%)',
  spec:'Prototype specification', teamH:'Team', advisor:'Advisor', partner:'Partner', sdg7:'Clean energy', sdg12:'Responsible production', sdg17:'Partnerships',
  lang:'Language & mode', nHome:'Home', nProc:'Process', nChart:'Charts', nBatch:'Batch', nInfo:'Info',
  newBatch:'New batch', hintLab:'Lab fields may be left empty and completed once lab results are out.', fIn:'Waste in (kg)', fOut:'Briquettes out (kg)',
  fT:'Carbonization temp (°C)', fDur:'Carbonization time (min)', fGlue:'Tapioca binder (%)', fSrc:'Waste source', labH:'Lab results',
  lAir:'Moisture (%)', lAbu:'Ash (%)', lVm:'Volatile matter (%)', lKal:'Calorific value (cal/g)', saveBatch:'Save batch'
};
const ID = {};
document.querySelectorAll('[data-t]').forEach(el => { ID[el.dataset.t] = el.textContent; });
let lang = store('lang') || 'id';
const L = {
  id:{ live:'LIVE', demo:'DEMO', off:'OFFLINE', wait:'Menghubungkan', opt:'Optimal', low:'Di bawah rentang', high:'Melebihi batas', idle:'Mesin standby',
       waste:'kg limbah diolah', briq:'kg briket', batch:'batch', ago:'lalu', sec:'dtk', min:'mnt', now:'Barusan', active:'Berjalan', done:'Selesai', todo:'Menunggu',
       on:'Menyala', off2:'Mati', saved:'Tersimpan', batchSaved:'Batch tersimpan', demoNote:'Mode demo — data simulasi', liveNote:'Terhubung ke Firebase',
       aHigh:'Suhu karbonisasi terlalu tinggi', aLow:'Suhu karbonisasi turun di bawah rentang', aRh:'Bahan masih lembap, perpanjang pengeringan', aM:'Adonan terlalu basah',
       aOff:'ESP32 tidak mengirim data', aOk:'Karbonisasi kembali optimal', noBatch:'Belum ada batch. Catat batch pertama Anda.', pend:'Belum diuji', inrange:'dari total pembacaan',
       steps:[['Pencacahan','Shredder double-shaft memperkecil ukuran limbah'],['Pengeringan awal','Elemen PTC 500 W + blower menurunkan kadar air'],['Karbonisasi','Tabung pirolisis 300–450 °C, dipantau sensor suhu tinggi'],['Pencampuran perekat','Arang + tapioka 10–20%, kelembapan adonan dipantau'],['Pencetakan','Press dongkrak hidrolik 2–5 ton ke cetakan silinder']],
       acts:[['shredder','Motor pencacah','DC high torque + gearbox','blade'],['heater','Elemen pemanas','PTC/Tubular 500 W','heat'],['blower','Blower','Sirkulasi udara pengering','fan'],['valve','Katup udara','Suplai udara karbonisasi','valve']],
       spec:[['Kapasitas input','3–5 kg limbah organik/hari'],['Pencacahan','Manual/semi-motorik (shredder kecil)'],['Karbonisasi','300–450 °C, disesuaikan hasil uji fungsi'],['Perekat','Tepung tapioka/kanji, 10–20%'],['Pencetakan','Press manual/dongkrak hidrolik kecil'],['Sensor','DS18B20 / Thermocouple K + MAX6675, DHT22, kelembapan kapasitif'],['Kendali','ESP32 + relay 4 kanal, HMI lokal'],['Daya','220 V AC, 5 V DC untuk sensor/ESP32'],['Acuan mutu','SNI 01-6235-2000']] },
  en:{ live:'LIVE', demo:'DEMO', off:'OFFLINE', wait:'Connecting', opt:'Optimal', low:'Below range', high:'Over limit', idle:'Machine standby',
       waste:'kg of waste processed', briq:'kg briquettes', batch:'batches', ago:'ago', sec:'s', min:'min', now:'Just now', active:'Running', done:'Done', todo:'Waiting',
       on:'On', off2:'Off', saved:'Saved', batchSaved:'Batch saved', demoNote:'Demo mode — simulated data', liveNote:'Connected to Firebase',
       aHigh:'Carbonization temperature too high', aLow:'Carbonization temperature below range', aRh:'Material still damp, extend drying', aM:'Dough too wet',
       aOff:'ESP32 is not sending data', aOk:'Carbonization back to optimal', noBatch:'No batches yet. Log your first batch.', pend:'Not tested', inrange:'of all readings',
       steps:[['Shredding','Double-shaft shredder reduces waste size'],['Pre-drying','500 W PTC element + blower lowers moisture'],['Carbonization','Pyrolysis drum at 300–450 °C, high-temp sensor'],['Binder mixing','Char + 10–20% tapioca, dough moisture monitored'],['Moulding','2–5 ton hydraulic jack press into cylinder moulds']],
       acts:[['shredder','Shredder motor','High-torque DC + gearbox','blade'],['heater','Heating element','PTC/Tubular 500 W','heat'],['blower','Blower','Dryer air circulation','fan'],['valve','Air valve','Carbonization air supply','valve']],
       spec:[['Input capacity','3–5 kg organic waste/day'],['Shredding','Manual/semi-motorized (small shredder)'],['Carbonization','300–450 °C, tuned by function tests'],['Binder','Tapioca starch, 10–20%'],['Moulding','Manual press/small hydraulic jack'],['Sensors','DS18B20 / K thermocouple + MAX6675, DHT22, capacitive moisture'],['Control','ESP32 + 4-ch relay, local HMI'],['Power','220 V AC, 5 V DC for sensors/ESP32'],['Quality ref.','SNI 01-6235-2000']] }
};
const T = k => L[lang][k];
const TEAM = [['Rahma Nur Citantya','I0324108',1],['Nihayatul Watsiqoh','I0324095'],['Rinka Amelia Gifanti','I0324099'],['Safira Budi Ramadhani','I0324100'],['Fami Wulan Devitasari','I0324115']];

/* ---------- util ---------- */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
function store(k, v) {
  try { if (v === undefined) { const r = localStorage.getItem('brk_' + k); return r ? JSON.parse(r) : null; } localStorage.setItem('brk_' + k, JSON.stringify(v)); } catch (e) { return null; }
}
const num = v => (typeof v === 'number' && isFinite(v)) ? v : null;
const fmt = (v, d = 0) => v == null ? '—' : v.toLocaleString(lang === 'id' ? 'id-ID' : 'en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
let toastT;
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 2200); }

/* ---------- state ---------- */
const S = {
  mode: 'wait', live: {}, relay: { shredder: false, heater: false, blower: false, valve: false },
  thr: Object.assign({}, DEFAULT_THR, store('thr') || {}), hist: [], batches: [], alerts: [], screen: 'home', range: 'karbon'
};
let db = null;
const lastAlert = {};

/* ---------- render ---------- */
function applyLang() {
  document.documentElement.lang = lang;
  $$('[data-t]').forEach(el => { const k = el.dataset.t; const v = lang === 'en' ? EN[k] : ID[k]; if (v != null) el.textContent = v; });
  $$('#langSeg button').forEach(b => b.classList.toggle('on', b.dataset.l === lang));
  $('#spec').innerHTML = T('spec').map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join('');
  renderActs(); renderSteps(); renderBatches(); renderAlerts(); renderLive(); renderChart(); renderConn();
}

function renderConn() {
  const c = $('#conn'); c.className = 'conn ' + (S.mode === 'live' ? 'live' : S.mode === 'demo' ? 'demo' : '');
  $('#connTxt').textContent = S.mode === 'live' ? T('live') : S.mode === 'demo' ? T('demo') : S.mode === 'off' ? T('off') : T('wait');
  $('#demoBtn').textContent = S.mode === 'demo' && db ? 'Live' : 'Demo';
}

function setGaugeBand() {
  const a = clamp(S.thr.tMin / G_MAX, 0, 1) * ARC, b = clamp((S.thr.tMax - S.thr.tMin) / G_MAX, 0, 1) * ARC;
  $('#gBand').setAttribute('stroke-dasharray', `0 ${a.toFixed(1)} ${b.toFixed(1)} 1000`);
  $('#bandPill').textContent = `${T('opt')} ${S.thr.tMin}–${S.thr.tMax} °C`;
}

function karbonState(t, stage) {
  if (t == null) return ['idle', '—'];
  if (stage !== 3 && t < S.thr.tMin) return ['idle', T('idle')];
  if (t > S.thr.tMax) return ['bad', T('high')];
  if (t < S.thr.tMin) return ['warn', T('low')];
  return ['', T('opt')];
}

function renderLive() {
  const d = S.live, t = num(d.tKarbon), stage = d.stage | 0;
  $('#tKarbon').innerHTML = (t == null ? '—' : Math.round(t)) + '<sup>°C</sup>';
  $('#gArc').style.strokeDashoffset = (ARC * (1 - clamp((t || 0) / G_MAX, 0, 1))).toFixed(1);
  const [cls, txt] = karbonState(t, stage);
  const st = $('#karbonStatus'); st.className = 'status ' + cls; st.textContent = txt;
  const td = num(d.tDryer), rh = num(d.rhDryer), m = num(d.mAdonan), rssi = num(d.rssi);
  $('#tDryer').innerHTML = fmt(td, 1) + '<small>°C</small>'; $('#bTDryer').style.width = clamp((td || 0) / 100 * 100, 0, 100) + '%';
  $('#rhDryer').innerHTML = fmt(rh, 0) + '<small>%RH</small>'; $('#bRh').style.width = clamp(rh || 0, 0, 100) + '%';
  $('#mAdonan').innerHTML = fmt(m, 0) + '<small>%</small>'; $('#bM').style.width = clamp(m || 0, 0, 100) + '%';
  $('#rssi').innerHTML = fmt(rssi, 0) + '<small>dBm</small>'; $('#bRssi').style.width = clamp(((rssi || -100) + 100) / 60 * 100, 0, 100) + '%';
  $('#devId').textContent = DEVICE + (d.fw ? ' · fw ' + d.fw : '');
  $('#lastTs').textContent = d.ts ? ago(d.ts) : '—';
  if (d.relay) { Object.assign(S.relay, d.relay); renderActs(); }
  renderSteps(); renderToday();
}

function ago(ts) {
  const s = Math.max(0, Math.round((Date.now() - ts) / 1000));
  if (s < 5) return T('now');
  return s < 60 ? `${s} ${T('sec')} ${T('ago')}` : `${Math.round(s / 60)} ${T('min')} ${T('ago')}`;
}

function renderSteps() {
  const stage = S.live.stage | 0;
  $('#steps').innerHTML = T('steps').map((s, i) => {
    const n = i + 1, k = n < stage ? 'done' : n === stage ? 'active' : 'todo';
    const badge = k === 'active' ? `<span class="status">${T('active')}</span>` : k === 'done' ? `<span class="status idle">${T('done')}</span>` : '';
    return `<div class="step ${k}"><div class="n">${k === 'done' ? ico('check', 18) : n}</div><div class="body"><b>${s[0]}</b><p>${s[1]}</p>${badge}</div></div>`;
  }).join('');
}

function renderActs() {
  $('#acts').innerHTML = T('acts').map(([k, name, sub, ic]) =>
    `<div class="act ${S.relay[k] ? 'on' : ''}" data-k="${k}"><div class="ic">${ico(ic)}</div><div class="t"><b>${name}</b><small>${sub} · ${S.relay[k] ? T('on') : T('off2')}</small></div><button class="tg" aria-label="${name}"></button></div>`).join('');
}

function renderToday() {
  const today = new Date().toDateString();
  const list = S.batches.filter(b => new Date(b.ts).toDateString() === today);
  const kg = list.reduce((a, b) => a + (+b.inputKg || 0), 0), out = list.reduce((a, b) => a + (+b.outputKg || 0), 0);
  const pct = clamp(kg / 5, 0, 1);
  $('#todayArc').style.strokeDashoffset = (201 * (1 - pct)).toFixed(1);
  $('#todayPct').textContent = Math.round(pct * 100) + '%';
  $('#todayKg').textContent = `${fmt(kg, 1)} ${T('waste')}`;
  $('#todayOut').textContent = `${fmt(out, 2)} ${T('briq')} · ${list.length} ${T('batch')}`;
}

/* chart */
const SERIES = {
  karbon: [{ k: 'tKarbon', c: '#2F7BFF', n: () => lang === 'id' ? 'Suhu karbonisasi °C' : 'Carbonization °C' }],
  dryer: [{ k: 'tDryer', c: '#1646D6', n: () => lang === 'id' ? 'Suhu °C' : 'Temp °C' }, { k: 'rhDryer', c: '#2A9FCB', n: () => 'RH %', dash: 1 }],
  adonan: [{ k: 'mAdonan', c: '#2A9FCB', n: () => lang === 'id' ? 'Kelembapan adonan %' : 'Dough moisture %' }]
};
function renderChart() {
  const svg = $('#chart'); if (!svg) return;
  const W = 340, H = 210, pl = 34, pr = 8, pt = 10, pb = 22;
  const ser = SERIES[S.range], data = S.hist.slice(-180);
  let vals = []; ser.forEach(s => data.forEach(p => { const v = num(p[s.k]); if (v != null) vals.push(v); }));
  let lo = 0, hi = S.range === 'karbon' ? Math.max(500, ...vals, S.thr.tMax + 50) : 100;
  const x = i => pl + (data.length < 2 ? 0 : i / (data.length - 1)) * (W - pl - pr);
  const y = v => pt + (1 - (v - lo) / (hi - lo)) * (H - pt - pb);
  let g = '<defs><linearGradient id="fillA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2F7BFF" stop-opacity=".28"/><stop offset="1" stop-color="#2F7BFF" stop-opacity="0"/></linearGradient></defs>';
  for (let i = 0; i <= 4; i++) { const v = lo + (hi - lo) * i / 4; g += `<line x1="${pl}" x2="${W - pr}" y1="${y(v)}" y2="${y(v)}" stroke="#D3DDEB" stroke-width="1"/><text x="${pl - 6}" y="${y(v) + 3.5}" text-anchor="end" font-size="9.5" font-weight="700" fill="#8392AE">${Math.round(v)}</text>`; }
  if (S.range === 'karbon') g += `<rect x="${pl}" width="${W - pl - pr}" y="${y(S.thr.tMax)}" height="${y(S.thr.tMin) - y(S.thr.tMax)}" fill="rgba(25,185,122,.10)"/>`;
  if (S.range === 'dryer') g += `<line x1="${pl}" x2="${W - pr}" y1="${y(S.thr.rhMax)}" y2="${y(S.thr.rhMax)}" stroke="#F5A524" stroke-dasharray="4 4"/>`;
  if (S.range === 'adonan') g += `<line x1="${pl}" x2="${W - pr}" y1="${y(S.thr.mMax)}" y2="${y(S.thr.mMax)}" stroke="#F5A524" stroke-dasharray="4 4"/>`;
  ser.forEach((s, si) => {
    const pts = data.map((p, i) => [x(i), num(p[s.k])]).filter(p => p[1] != null).map(p => [p[0], y(p[1])]);
    if (pts.length < 2) return;
    const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('');
    if (si === 0) g += `<path d="${d}L${pts[pts.length - 1][0]} ${H - pb}L${pts[0][0]} ${H - pb}Z" fill="url(#fillA)"/>`;
    g += `<path d="${d}" fill="none" stroke="${s.c}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round" ${s.dash ? 'stroke-dasharray="5 4"' : ''}/>`;
    const lp = pts[pts.length - 1]; g += `<circle cx="${lp[0]}" cy="${lp[1]}" r="4.5" fill="#fff" stroke="${s.c}" stroke-width="2.5"/>`;
  });
  if (data.length) { const t0 = new Date(data[0].ts), t1 = new Date(data[data.length - 1].ts), f = d => d.toTimeString().slice(0, 5);
    g += `<text x="${pl}" y="${H - 6}" font-size="9.5" font-weight="700" fill="#8392AE">${f(t0)}</text><text x="${W - pr}" y="${H - 6}" text-anchor="end" font-size="9.5" font-weight="700" fill="#8392AE">${f(t1)}</text>`; }
  svg.innerHTML = g;
  $('#legend').innerHTML = ser.map(s => `<span><i style="background:${s.c}"></i>${s.n()}</span>`).join('');
  const main = data.map(p => num(p[ser[0].k])).filter(v => v != null);
  const u = S.range === 'karbon' || S.range === 'dryer' ? '°' : '%';
  $('#stMin').textContent = main.length ? fmt(Math.min(...main)) + u : '—';
  $('#stMax').textContent = main.length ? fmt(Math.max(...main)) + u : '—';
  $('#stAvg').textContent = main.length ? fmt(main.reduce((a, b) => a + b, 0) / main.length) + u : '—';
  const carb = S.hist.filter(p => (p.stage | 0) === 3 && num(p.tKarbon) != null);
  const inb = carb.filter(p => p.tKarbon >= S.thr.tMin && p.tKarbon <= S.thr.tMax).length;
  const r = carb.length ? inb / carb.length : 0;
  $('#inbandBar').style.width = Math.round(r * 100) + '%';
  $('#inbandTxt').textContent = carb.length ? `${Math.round(r * 100)}% ${T('inrange')}` : '—';
}

/* batches */
function sniTag(k, v) {
  if (v == null || v === '') return `<span class="u">${k.toUpperCase()} · ${T('pend')}</span>`;
  const ok = k === 'kalor' ? v >= SNI.kalor : v <= SNI[k];
  const lbl = { air: lang === 'id' ? 'Air' : 'Moist.', abu: lang === 'id' ? 'Abu' : 'Ash', vm: 'VM', kalor: lang === 'id' ? 'Kalor' : 'Cal.' }[k];
  return `<span class="${ok ? 'y' : 'n'}">${ok ? '✓' : '✕'} ${lbl} ${fmt(+v, k === 'kalor' ? 0 : 1)}${k === 'kalor' ? '' : '%'}</span>`;
}
function renderBatches() {
  const list = S.batches.slice().sort((a, b) => b.ts - a.ts);
  $('#batchCount').textContent = `${list.length} ${T('batch')}`;
  if (!list.length) { $('#batches').innerHTML = `<div class="card empty">${T('noBatch')}</div>`; renderToday(); return; }
  $('#batches').innerHTML = list.map((b, i) => {
    const yieldPct = b.inputKg && b.outputKg ? Math.round(b.outputKg / b.inputKg * 100) + '%' : '—';
    const dt = new Date(b.ts).toLocaleString(lang === 'id' ? 'id-ID' : 'en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    return `<div class="card batch"><div class="row1"><b>Batch #${list.length - i} · ${b.src || '—'}</b><small>${dt}</small></div>
      <div class="kv"><div><small>${lang === 'id' ? 'Masuk' : 'In'}</small><b>${fmt(+b.inputKg, 1)} kg</b></div><div><small>${lang === 'id' ? 'Briket' : 'Out'}</small><b>${b.outputKg ? fmt(+b.outputKg, 2) + ' kg' : '—'}</b></div>
      <div><small>Rendemen</small><b>${yieldPct}</b></div><div><small>${lang === 'id' ? 'Perekat' : 'Binder'}</small><b>${b.perekat != null ? b.perekat + '%' : '—'}</b></div></div>
      <div class="kv"><div style="grid-column:span 2"><small>${lang === 'id' ? 'Karbonisasi' : 'Carbonization'}</small><b>${b.tKarbon ? b.tKarbon + ' °C' : '—'}${b.durMin ? ' · ' + b.durMin + ' ' + T('min') : ''}</b></div><div style="grid-column:span 2"><small>${lang === 'id' ? 'Sumber' : 'Mode'}</small><b>${b.demo ? 'Demo' : 'Live'}</b></div></div>
      <div class="sni">${['air', 'abu', 'vm', 'kalor'].map(k => sniTag(k, b[k])).join('')}</div></div>`;
  }).join('');
  renderToday();
}

/* alerts */
function pushAlert(key, cls, msg) {
  const now = Date.now();
  if (lastAlert[key] && now - lastAlert[key] < 60000) return;
  lastAlert[key] = now;
  S.alerts.unshift({ key, cls, msg, ts: now }); S.alerts = S.alerts.slice(0, 20);
  renderAlerts();
  if (cls !== 'ok') { toast('⚠ ' + msg); if (navigator.vibrate) try { navigator.vibrate(120); } catch (e) {} }
}
function renderAlerts() {
  const n = S.alerts.filter(a => a.cls !== 'ok' && Date.now() - a.ts < 600000).length;
  const bd = $('#alertBadge'); bd.textContent = n; bd.classList.toggle('show', n > 0 && S.screen !== 'info');
  $('#alerts').innerHTML = S.alerts.length ? S.alerts.map(a => `<div class="alert ${a.cls}"><div class="ic">${ico(a.cls === 'ok' ? 'check' : 'warn', 18)}</div><div><b>${T(a.msg) || a.msg}</b><small>${new Date(a.ts).toTimeString().slice(0, 8)} · ${DEVICE}</small></div></div>`).join('')
    : `<div class="empty">${lang === 'en' ? EN.noAlert : ID.noAlert}</div>`;
}
let wasHigh = false;
function checkAlerts(d) {
  const t = num(d.tKarbon), st = d.stage | 0;
  if (t != null && t > S.thr.tMax) { pushAlert('high', 'bad', 'aHigh'); wasHigh = true; }
  else if (t != null && st === 3 && t < S.thr.tMin - 15 && S.hist.some(p => p.tKarbon >= S.thr.tMin)) pushAlert('low', '', 'aLow');
  else if (wasHigh && t != null && t <= S.thr.tMax) { wasHigh = false; pushAlert('ok', 'ok', 'aOk'); }
  if (st === 2 && num(d.rhDryer) > S.thr.rhMax && S.hist.filter(p => p.stage === 2).length > 20) pushAlert('rh', '', 'aRh');
  if (st === 4 && num(d.mAdonan) > S.thr.mMax) pushAlert('m', '', 'aM');
}

/* ---------- data in ---------- */
function onLive(d) {
  if (!d) return;
  S.live = d;
  const last = S.hist[S.hist.length - 1];
  if (!last || d.ts - last.ts >= 1000) { S.hist.push({ ts: d.ts || Date.now(), stage: d.stage | 0, tKarbon: num(d.tKarbon), tDryer: num(d.tDryer), rhDryer: num(d.rhDryer), mAdonan: num(d.mAdonan) }); if (S.hist.length > 600) S.hist.shift(); }
  checkAlerts(d); renderLive();
  if (S.screen === 'chart') renderChart();
}

/* ---------- mode demo ---------- */
let simT = null;
const sim = { stage: 1, tick: 0, tK: 32, tD: 31, rh: 82, m: 0 };
const STAGE_LEN = [0, 14, 40, 70, 22, 16];   // detik per tahap (dipercepat)
function startDemo() {
  stopLive(); S.mode = 'demo'; renderConn();
  S.hist = []; S.live = {};
  if (!store('demoBatches')) store('demoBatches', seedBatches());
  S.batches = store('demoBatches') || seedBatches(); renderBatches();
  // isi riwayat awal agar grafik langsung terisi
  for (let i = 0; i < 90; i++) stepSim(Date.now() - (90 - i) * 1000, true);
  clearInterval(simT); simT = setInterval(() => stepSim(Date.now()), 1000);
  toast(T('demoNote'));
}
function stepSim(ts, silent) {
  sim.tick++;
  if (sim.tick > STAGE_LEN[sim.stage]) { sim.tick = 0; sim.stage = sim.stage % 5 + 1; }
  const s = sim.stage, n = () => (Math.random() - .5);
  const spike = s === 3 && sim.tick > 44 && sim.tick < 52;
  const tgtK = s === 3 ? (spike ? 468 : 385 + 30 * Math.sin(sim.tick / 6)) : s >= 4 ? 70 : 34;
  sim.tK += (tgtK - sim.tK) * (s === 3 ? .16 : .08) + n() * 4;
  sim.tD += ((s === 2 ? 68 : 33) - sim.tD) * .12 + n() * .6;
  sim.rh = s === 1 ? 82 + n() * 2 : s === 2 ? Math.max(32, sim.rh - 1.25 + n()) : clamp(sim.rh + (58 - sim.rh) * .05 + n(), 20, 95);
  sim.m = s === 4 ? clamp((sim.tick < 4 ? 52 : 48 - sim.tick * .5) + n() * 2, 30, 60) : s === 5 ? 36 + n() : 0;
  const relay = { shredder: s === 1, heater: s === 2 || s === 3, blower: s === 2, valve: s === 3 && !spike };
  const d = { ts, stage: s, tKarbon: +sim.tK.toFixed(1), tDryer: +sim.tD.toFixed(1), rhDryer: +sim.rh.toFixed(1), mAdonan: s >= 4 ? +sim.m.toFixed(1) : null, rssi: -58 + Math.round(n() * 6), fw: 'demo', relay };
  if (silent) { S.live = d; S.hist.push({ ts, stage: s, tKarbon: d.tKarbon, tDryer: d.tDryer, rhDryer: d.rhDryer, mAdonan: d.mAdonan }); return; }
  onLive(d);
}
function seedBatches() {
  const day = 864e5, now = Date.now();
  return [
    { ts: now - 2 * day, src: 'Nasi', inputKg: 4.2, outputKg: 0.95, perekat: 15, tKarbon: 400, durMin: 90, air: 6.1, abu: 7.2, vm: 14.1, kalor: 5210, demo: true },
    { ts: now - day, src: 'Sayur', inputKg: 3.6, outputKg: 0.71, perekat: 20, tKarbon: 350, durMin: 75, air: 9.4, abu: 9.8, vm: 17.5, kalor: 4620, demo: true },
    { ts: now - 3 * 36e5, src: 'Campuran', inputKg: 2.4, outputKg: 0.58, perekat: 12, tKarbon: 420, durMin: 100, demo: true }
  ];
}

/* ---------- mode live (Firebase RTDB) ---------- */
let liveRefs = [], staleT = null;
function stopLive() { liveRefs.forEach(r => r.off()); liveRefs = []; clearInterval(staleT); }
function startLive() {
  clearInterval(simT); S.mode = 'wait'; renderConn(); S.hist = []; S.live = {};
  const base = db.ref(`${ROOT}/devices/${DEVICE}`);
  const live = base.child('live'), hist = base.child('history').limitToLast(180), bat = db.ref(`${ROOT}/batches`), set = db.ref(`${ROOT}/settings`);
  liveRefs = [live, hist, bat, set];
  let gotAny = false;
  const fail = () => { if (S.mode !== 'demo') startDemo(); };
  hist.once('value', s => { const v = s.val() || {}; S.hist = Object.values(v).filter(p => p && p.ts).sort((a, b) => a.ts - b.ts); renderChart(); }, () => {});
  live.on('value', s => {
    const d = s.val();
    if (!d) { if (!gotAny) setTimeout(() => { if (!gotAny && S.mode === 'wait') fail(); }, 4000); return; }
    gotAny = true; S.mode = Date.now() - (d.ts || 0) < 120000 ? 'live' : 'off'; renderConn(); onLive(d);
  }, fail);
  bat.on('value', s => { const v = s.val() || {}; S.batches = Object.entries(v).map(([id, b]) => Object.assign({ id }, b)); renderBatches(); }, () => {});
  set.on('value', s => { const v = s.val(); if (v) { Object.assign(S.thr, v); fillThr(); setGaugeBand(); } }, () => {});
  staleT = setInterval(() => {
    if (!S.live.ts) return;
    const stale = Date.now() - S.live.ts > 120000;
    if (stale && S.mode === 'live') { S.mode = 'off'; renderConn(); pushAlert('off', 'bad', 'aOff'); }
    $('#lastTs').textContent = ago(S.live.ts);
  }, 5000);
  setTimeout(() => { if (!gotAny && S.mode === 'wait') fail(); }, 8000);
}

/* ---------- interaksi ---------- */
function go(name) {
  if (!$('#s-' + name)) return;
  S.screen = name;
  $$('.screen').forEach(s => s.classList.toggle('on', s.id === 's-' + name));
  $$('#nav button').forEach(b => b.classList.toggle('on', b.dataset.s === name));
  if (name === 'chart') renderChart();
  renderAlerts();
  window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
}
$('#nav').addEventListener('click', e => { const b = e.target.closest('button'); if (b) go(b.dataset.s); });

$('#acts').addEventListener('click', e => {
  const row = e.target.closest('.act'); if (!row) return;
  const k = row.dataset.k, v = !S.relay[k];
  S.relay[k] = v; renderActs();
  if (S.mode !== 'demo' && db) db.ref(`${ROOT}/devices/${DEVICE}/cmd/${k}`).set(v).catch(() => toast('Gagal mengirim perintah'));
  else { S.live.relay = Object.assign({}, S.relay); }
});

$('#seg').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; S.range = b.dataset.r; $$('#seg button').forEach(x => x.classList.toggle('on', x === b)); renderChart(); });

function calc() {
  const a = Math.max(0, +$('#cArang').value || 0), p = +$('#cPct').value;
  $('#cPctTxt').textContent = p + '%';
  const g = a * 1000 * p / 100;
  $('#cOut').textContent = fmt(g) + ' g'; $('#cWater').textContent = fmt(g * 4) + ' ml';
}
$('#cArang').addEventListener('input', calc); $('#cPct').addEventListener('input', calc);

function fillThr() { $('#thTMin').value = S.thr.tMin; $('#thTMax').value = S.thr.tMax; $('#thRh').value = S.thr.rhMax; $('#thM').value = S.thr.mMax; }
$('#saveThr').addEventListener('click', () => {
  const v = { tMin: +$('#thTMin').value || DEFAULT_THR.tMin, tMax: +$('#thTMax').value || DEFAULT_THR.tMax, rhMax: +$('#thRh').value || DEFAULT_THR.rhMax, mMax: +$('#thM').value || DEFAULT_THR.mMax };
  if (v.tMin >= v.tMax) { toast('Min < Max'); return; }
  Object.assign(S.thr, v); store('thr', v); setGaugeBand(); renderLive(); renderChart();
  if (S.mode !== 'demo' && db) db.ref(`${ROOT}/settings`).set(v).catch(() => {});
  toast(T('saved'));
});

const sheet = $('#sheet'), scrim = $('#scrim');
const openSheet = () => { sheet.classList.add('on'); scrim.classList.add('on'); const t = num(S.live.tKarbon); if (t && t > 250) sheet.tKarbon.value = Math.round(t); };
const closeSheet = () => { sheet.classList.remove('on'); scrim.classList.remove('on'); };
$('#addBatch').addEventListener('click', openSheet); scrim.addEventListener('click', closeSheet);
sheet.addEventListener('submit', e => {
  e.preventDefault();
  const f = new FormData(sheet), b = { ts: Date.now() };
  for (const [k, v] of f.entries()) { if (v === '') continue; b[k] = k === 'src' ? v : +v; }
  if (S.mode !== 'demo' && db) db.ref(`${ROOT}/batches`).push(b).then(() => toast(T('batchSaved'))).catch(() => toast('Gagal menyimpan'));
  else { b.demo = true; S.batches.push(b); store('demoBatches', S.batches); renderBatches(); toast(T('batchSaved')); }
  sheet.reset(); sheet.perekat.value = 15; closeSheet();
});

$('#langSeg').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; lang = b.dataset.l; store('lang', lang); applyLang(); setGaugeBand(); });
$('#demoBtn').addEventListener('click', () => { if (S.mode === 'demo' && db) startLive(); else startDemo(); });

/* ---------- boot ---------- */
paintIcons();
fillThr(); setGaugeBand(); calc(); applyLang();
const q = new URLSearchParams(location.search);
if (q.has('embed')) document.body.classList.add('embed');
const wantDemo = q.has('demo') || location.protocol === 'file:';
function boot() {
  if (!wantDemo && window.firebase) {
    try { firebase.initializeApp(FB_CONFIG); db = firebase.database(); startLive(); return; } catch (e) { console.warn('[BRIKETA] firebase', e); }
  }
  startDemo();
}
if (document.readyState === 'complete') boot(); else window.addEventListener('load', boot);

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});

window.APP = { go, set: d => onLive(Object.assign({}, S.live, d, { ts: Date.now() })), demo: startDemo, state: S };
})();
