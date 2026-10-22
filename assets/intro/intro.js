/* Intro animada (pixel art) — se muestra solo en la primera visita.
   window.playIntro(onReveal): arma un overlay a pantalla completa, reproduce
   la historia y al terminar (o con "Saltar video") se disuelve y llama onReveal. */
(function(){
const CSS = `
#introOv{position:fixed;inset:0;z-index:2000;background:#0B1026;overflow:hidden;opacity:1;transition:opacity .9s ease}
#introOv.out{opacity:0;pointer-events:none}
#introOv canvas{position:absolute;inset:0;width:100%;height:100%;image-rendering:pixelated;image-rendering:crisp-edges}
#introOv .i-cap{position:absolute;left:4vw;bottom:6vh;display:flex;align-items:center;gap:14px;max-width:88vw;
  background:rgba(20,26,10,.78);color:#f4f3ef;padding:14px 22px 14px 14px;border-radius:14px;
  border:2px solid rgba(190,253,102,.22);box-shadow:0 10px 30px rgba(0,0,0,.35);
  transform:translateY(20px);opacity:0;transition:opacity .45s,transform .45s;font-family:var(--font-body,system-ui,sans-serif)}
#introOv .i-cap.on{opacity:1;transform:none}
#introOv .i-n{font:800 14px/1 var(--font-pixel,system-ui);background:#befd66;color:#2c3614;border-radius:8px;padding:8px 9px;letter-spacing:.04em}
#introOv .i-t{font:700 clamp(15px,1.6vw,22px)/1.2 var(--font-pixel,system-ui)}
#introOv .i-skip{position:absolute;top:max(3vh,16px);right:max(3vw,16px);z-index:2;cursor:pointer;
  background:rgba(20,26,10,.6);color:#befd66;border:1.5px solid rgba(190,253,102,.55);border-radius:999px;
  padding:10px 20px;font:600 14px/1 var(--font-pixel,system-ui);letter-spacing:.02em;transition:background .2s,color .2s}
#introOv .i-skip:hover{background:#befd66;color:#2c3614}
@media (max-width:600px){#introOv .i-cap{left:4vw;right:4vw;bottom:5vh;padding:11px 16px 11px 11px}}
`;
window.playIntro = function(onReveal){
const EN = (typeof getLang === 'function' ? getLang() : document.documentElement.lang) === 'en';
const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
const root = document.createElement('div'); root.id = 'introOv'; root.setAttribute('role','dialog'); root.setAttribute('aria-label', EN ? 'Intro video' : 'Video de introducción');
root.innerHTML = '<canvas data-i="c"></canvas>'
  + '<div class="i-cap" data-i="cap"><span class="i-n" data-i="capn">01</span><div class="i-t" data-i="capt"></div></div>'
  + '<button class="i-skip" type="button" data-i="skip">' + (EN ? 'Skip video' : 'Saltar video') + ' ›</button>';
document.body.appendChild(root);
const Q = k => root.querySelector('[data-i="' + k + '"]');
let raf = 0, gone = false;

// ─────────────────────────────────────────────────────────────────────────────
// Intro en pixel art "de bloques": la historia de una diseñadora.
// Mundo en baja resolución (LW×LH) escalado sin suavizado. Todo se dibuja
// con rectángulos y texturas de 8×8 generadas con un PRNG con semilla.
// ─────────────────────────────────────────────────────────────────────────────
const LW = 320, LH = 180, G = 142;            // resolución lógica y línea del suelo
const cv = Q('c'), ctx = cv.getContext('2d');
const buf = document.createElement('canvas'); buf.width = LW; buf.height = LH;
const b = buf.getContext('2d');
const HM = location.hash.match(/introt=([\d.]+)/); const START = HM ? parseFloat(HM[1]) : 0;
const FREEZE = /introfreeze/.test(location.hash);

function resize(){ const d = devicePixelRatio || 1; cv.width = innerWidth * d; cv.height = innerHeight * d; }
addEventListener('resize', resize); resize();

// ── PRNG y texturas ──────────────────────────────────────────────────────────
function rng(s){ return () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const pick = (r, a) => a[Math.floor(r() * a.length)];
function tile(seed, fn){ const c = document.createElement('canvas'); c.width = c.height = 8; const x = c.getContext('2d'); const r = rng(seed);
  for (let j = 0; j < 8; j++) for (let i = 0; i < 8; i++){ x.fillStyle = fn(i, j, r); x.fillRect(i, j, 1, 1); } return c; }
const T = {
  grass:  tile(1, (i,j,r) => j < 2 ? pick(r,['#6BB043','#5DA03A','#7CC24E']) : (j < 3 && r() < .5) ? '#5DA03A' : pick(r,['#7A5232','#6B4729','#866039'])),
  dirt:   tile(2, (i,j,r) => pick(r,['#7A5232','#6B4729','#866039','#704C2D'])),
  stone:  tile(3, (i,j,r) => r() < .08 ? '#5E636B' : pick(r,['#8A8F98','#7D828B','#969BA3'])),
  brick:  tile(4, (i,j,r) => (j % 4 === 3 || i === ((j >> 2) % 2 ? 0 : 4)) ? '#C9C2B2' : pick(r,['#9C4A2E','#A9573A','#8E4229'])),
  planks: tile(5, (i,j,r) => j % 4 === 3 ? '#8A6236' : pick(r,['#C69C6D','#B98E60','#D1A877'])),
  dplanks:tile(6, (i,j,r) => j % 4 === 3 ? '#3E2716' : pick(r,['#6B4A2B','#5C3F24','#77543A'])),
  glass:  tile(7, (i,j) => (i === 0 || j === 0) ? '#D8EEF7' : (i === j || i === j + 1) ? '#EAF7FD' : '#9FD3E8'),
  leaves: tile(8, (i,j,r) => pick(r,['#3E7A2E','#356B27','#4A8A36','#2E5E21'])),
  log:    tile(9, (i,j,r) => i % 3 === 0 ? '#4E3520' : pick(r,['#6B4A2B','#5C3F24'])),
  white:  tile(10,(i,j,r) => pick(r,['#EDEDED','#E2E2E2','#F5F5F5'])),
  quartz: tile(11,(i,j,r) => pick(r,['#E9E4DA','#DDD6C8','#F1ECE3'])),
  green:  tile(12,(i,j,r) => (Math.floor(i / 2) + Math.floor(j / 4)) % 2 ? pick(r,['#5DB548','#62BC4C']) : pick(r,['#6CC856','#71CE5B'])),
  sand:   tile(13,(i,j,r) => pick(r,['#E3CF8F','#D9C27E','#EBD9A0'])),
  asphalt:tile(14,(i,j,r) => pick(r,['#4A4D55','#45484F','#52555C'])),
  wool:   tile(15,(i,j,r) => pick(r,['#C0392B','#B03A2E','#CC4535'])),
  carpet: tile(16,(i,j,r) => pick(r,['#3E7CB1','#3672A5','#4886BD'])),
};

// ── Primitivas de dibujo (coordenadas de mundo; la cámara resta camX) ────────
let camX = 0, camY = 0;
const R = (x, y, w, h, col) => { b.fillStyle = col; b.fillRect(Math.round(x - camX), Math.round(y - camY), w, h); };
const blk = (tex, x, y) => b.drawImage(T[tex], Math.round(x - camX), Math.round(y - camY));
function fillBlocks(tex, x0, y0, wB, hB){ for (let j = 0; j < hB; j++) for (let i = 0; i < wB; i++) blk(tex, x0 + i * 8, y0 + j * 8); }

// ── Personajes ───────────────────────────────────────────────────────────────
// Diseñadora: 7 px de ancho × 16 de alto. Pelo castaño oscuro con colita.
const SKIN = '#E8B98A', HAIR = '#4A2E1A';
function person(x, y, o){            // o: {shirt, pants, pose:'walk'|'sit'|'stand'|'swing', t, arm, cap}
  const s = o.shirt, p = o.pants || '#2E3A59', t = o.t || 0;
  const X = Math.round(x), Y = Math.round(y);   // (X,Y) = pies
  if (o.pose === 'sit'){
    // piernas hacia adelante
    R(X - 1, Y - 6, 8, 3, p); R(X + 5, Y - 6, 2, 6, p); R(X + 5, Y - 1, 3, 1, '#222');
    R(X - 2, Y - 12, 7, 6, s);
  } else {
    const ph = o.pose === 'walk' ? Math.sin(t * 14) : 0;
    const a = ph > 0 ? 1 : 0;
    R(X - 2 + (o.pose === 'walk' ? a : 0), Y - 5, 3, 5, p); R(X + 2 - (o.pose === 'walk' ? a : 0), Y - 5, 3, 5, p);
    R(X - 2 + (o.pose === 'walk' ? a : 0), Y - 1, 3, 1, '#222'); R(X + 2 - (o.pose === 'walk' ? a : 0), Y - 1, 3, 1, '#222');
    R(X - 2, Y - 11, 7, 6, s);
  }
  const by = o.pose === 'sit' ? Y - 6 : Y;
  // cabeza
  R(X - 2, by - 18, 7, 7, SKIN);
  R(X - 2, by - 19, 7, 2, HAIR); R(X - 3, by - 18, 2, 6, HAIR); R(X - 4, by - 16, 2, 4, HAIR);   // pelo + colita
  R(X + 2, by - 15, 1, 1, '#1C1C1E'); R(X + 4, by - 15, 1, 1, '#1C1C1E');                       // ojos
  R(X + 3, by - 13, 1, 1, '#C4776A');
  if (o.cap){ R(X - 3, by - 20, 8, 2, o.cap); R(X + 3, by - 18, 4, 1, o.cap); }
  // brazo
  if (o.pose === 'swing'){
    const ang = o.arm;                         // ángulo del palo
    const hx = X + 2, hy = by - 9;
    R(hx - 1, hy - 1, 3, 3, SKIN);
    for (let k = 0; k < 12; k++){ R(hx + Math.cos(ang) * k, hy + Math.sin(ang) * k, 1, 1, '#B7BCC4'); }
    R(hx + Math.cos(ang) * 12 - 1, hy + Math.sin(ang) * 12 - 1, 3, 2, '#5E636B');
  } else if (o.arm != null){                   // brazo trabajando (dibuja/tipea)
    R(X + 3, by - 10 + Math.round(Math.sin(t * 18)), 5, 2, s); R(X + 8, by - 10 + Math.round(Math.sin(t * 18)), 1, 2, SKIN);
  } else {
    R(X + 1, by - 11, 2, 5, s); R(X + 1, by - 6, 2, 1, SKIN);
  }
}
function npc(x, y, shirt, hair, sit, t){ // compañeros de cursada / de oficina
  const X = Math.round(x), Y = Math.round(y);
  if (sit){ R(X - 1, Y - 6, 8, 3, '#3B3B4F'); R(X + 5, Y - 6, 2, 6, '#3B3B4F'); R(X - 2, Y - 12, 7, 6, shirt); }
  else { R(X - 2, Y - 5, 3, 5, '#3B3B4F'); R(X + 2, Y - 5, 3, 5, '#3B3B4F'); R(X - 2, Y - 11, 7, 6, shirt); }
  const by = sit ? Y - 6 : Y;
  R(X - 2, by - 18, 7, 7, '#D9A066'); R(X - 2, by - 19, 7, 2, hair); R(X - 3, by - 18, 1, 4, hair);
  R(X + 2, by - 15, 1, 1, '#1C1C1E'); R(X + 4, by - 15, 1, 1, '#1C1C1E');
  R(X + 3, by - 10 + (sit ? Math.round(Math.sin((t || 0) * 12 + x)) : 0), 4, 2, shirt);
}
function robot(x, y, o){
  const X = Math.round(x), Y = Math.round(y), t = o.t || 0;
  if (o.pose === 'sit'){ R(X - 1, Y - 6, 8, 3, '#6E7580'); R(X + 5, Y - 6, 2, 6, '#6E7580'); R(X - 2, Y - 13, 8, 7, '#AEB4BD'); R(X, Y - 11, 4, 3, '#3DD9FF'); }
  else { const a = o.pose === 'walk' && Math.sin(t * 14) > 0 ? 1 : 0;
    R(X - 2 + a, Y - 5, 3, 5, '#6E7580'); R(X + 3 - a, Y - 5, 3, 5, '#6E7580'); R(X - 2, Y - 12, 8, 7, '#AEB4BD'); R(X, Y - 10, 4, 3, '#3DD9FF'); }
  const by = o.pose === 'sit' ? Y - 7 : Y - 1;
  R(X - 2, by - 18, 8, 7, '#C9CED6'); R(X - 1, by - 17, 6, 5, '#2B2F38');
  const blink = (Math.floor(t * 2) % 7) === 0;
  R(X + 1, by - 15, 1, blink ? 0 : 2, '#3DFFB0'); R(X + 3, by - 15, 1, blink ? 0 : 2, '#3DFFB0');
  R(X + 1, by - 21, 1, 3, '#8A8F98'); R(X, by - 22, 3, 1, (Math.floor(t * 3) % 2) ? '#ff4040' : '#FFB3B3');
  if (o.pose === 'sit'){ R(X + 6, by - 10 + Math.round(Math.sin(t * 30)), 5, 2, '#AEB4BD'); } else { R(X + 2, by - 11, 2, 5, '#8A8F98'); }
}

// ── Elementos del decorado ───────────────────────────────────────────────────
function tree(x, h){ for (let k = 0; k < h; k++) blk('log', x, G - 8 - k * 8); fillBlocks('leaves', x - 8, G - 8 * h - 16, 3, 2); blk('leaves', x, G - 8 * h - 24); }
function cloud(x, y, w){ R(x, y, w, 6, '#FFFFFF'); R(x + 4, y - 4, w - 10, 4, '#FFFFFF'); R(x, y + 6, w, 2, '#E3ECF7'); }
function desk(x, y, w){ R(x, y, w, 2, '#8A6236'); R(x + 1, y + 2, 2, G - y - 2, '#6B4A2B'); R(x + w - 3, y + 2, 2, G - y - 2, '#6B4A2B'); }
function chair(x){ R(x, G - 7, 7, 2, '#3A3F4A'); R(x - 1, G - 15, 2, 9, '#3A3F4A'); R(x + 3, G - 5, 1, 5, '#22262E'); R(x, G - 1, 7, 1, '#22262E'); }
function plant(x){ R(x, G - 6, 5, 6, '#B44C33'); R(x - 1, G - 12, 3, 6, '#3E7A2E'); R(x + 2, G - 14, 3, 8, '#4A8A36'); R(x + 4, G - 11, 2, 5, '#356B27'); }

// ── Escenas (rango de mundo en px) ───────────────────────────────────────────
// A Universidad 0–330 · B Oficina 340–640 · C Aeropuerto + vuelo 660–1140 · D Casa 1150–1450 · E Golf 1460–1820
const WORLD = 1840;

function sky(t){
  const g = b.createLinearGradient(0, 0, 0, LH);
  g.addColorStop(0, '#5B8ED6'); g.addColorStop(.7, '#A8C9F0'); g.addColorStop(1, '#CFE3F8');
  b.fillStyle = g; b.fillRect(0, 0, LW, LH);
  // nubes con paralaje
  const px = camX * .4;
  for (const [x, y, w] of [[30,26,30],[150,18,40],[290,34,26],[420,22,34],[560,30,30],[700,16,44],[860,28,30],[1000,20,36],[1160,32,28],[1300,18,40],[1460,26,32],[1620,22,36],[1780,30,28]]){
    const sx = x - px + Math.sin(t * .2 + x) * 2; if (sx > -60 && sx < LW + 10) { b.fillStyle = '#FFFFFF'; cloudScreen(sx, y, w); }
  }
  // sol
  const sx = 250 - px * .1; b.fillStyle = '#FFE9A8'; b.fillRect(sx, 14, 16, 16); b.fillStyle = '#FFF5CF'; b.fillRect(sx + 3, 17, 10, 10);
}
function cloudScreen(x, y, w){ b.fillStyle = '#FFFFFF'; b.fillRect(x, y, w, 6); b.fillRect(x + 4, y - 4, w - 10, 4); b.fillStyle = '#E3ECF7'; b.fillRect(x, y + 6, w, 2); }

function ground(x0, x1, tex = 'grass'){ for (let x = x0; x < x1; x += 8){ blk(tex, x, G); for (let k = 1; k < 6; k++) blk('dirt', x, G + k * 8); } }

function sceneUni(t, drawP){
  ground(-16, 340);
  tree(-4, 4); tree(300, 5);
  // edificio de piedra con fachada recortada (vemos el interior)
  fillBlocks('stone', 24, G - 88, 1, 11); fillBlocks('stone', 240, G - 88, 1, 11);
  fillBlocks('stone', 24, G - 96, 28, 1); fillBlocks('brick', 32, G - 104, 26, 1);
  R(32, G - 88, 208, 88, '#E9E4DA');                       // pared interior
  for (let x = 32; x < 240; x += 8) R(x, G - 88, 1, 88, '#DDD6C8');
  R(32, G - 4, 208, 4, '#B98E60');                        // piso
  // cartel
  R(96, G - 118, 80, 14, '#1C1C1E'); pixText('DISENO', 110, G - 114, '#FFD54F'); R(146, G - 117, 6, 1, '#FFD54F');
  // pizarrón y láminas
  R(48, G - 72, 56, 30, '#2E5C3A'); R(46, G - 74, 60, 2, '#8A6236'); R(46, G - 42, 60, 2, '#8A6236');
  R(54, G - 66, 18, 1, '#E8E2D0'); R(54, G - 60, 30, 1, '#E8E2D0'); R(78, G - 68, 14, 14, 'transparent');
  b.strokeStyle = '#E8E2D0'; circleS(88, G - 58, 6); rectS(56, G - 54, 12, 8);
  R(120, G - 70, 18, 24, '#FFFFFF'); R(122, G - 68, 14, 10, '#ff4040'); R(122, G - 56, 10, 2, '#1C1C1E'); R(122, G - 52, 12, 2, '#9A9AA0');
  R(144, G - 70, 18, 24, '#FFFFFF'); R(146, G - 68, 6, 6, '#3E7CB1'); R(152, G - 62, 6, 6, '#E3B23C'); R(146, G - 54, 14, 2, '#1C1C1E');
  // tableros de dibujo
  drawingTable(150); drawingTable(200); drawingTable(96);
  npc(210, G, '#3E8E5A', '#2A1E14', true, t); chair(206);
  npc(106, G, '#E3B23C', '#8A5A2B', true, t); chair(102);
  chair(156);
  if (drawP) drawP();
}
function drawingTable(x){ R(x + 6, G - 20, 22, 2, '#C69C6D'); R(x + 8, G - 22, 18, 2, '#FFFFFF'); R(x + 15, G - 18, 2, 18, '#6B4A2B'); R(x + 10, G - 1, 12, 1, '#6B4A2B'); }

function sceneOffice(t, drawP){
  ground(330, 660);
  // edificio vidriado
  fillBlocks('quartz', 352, G - 104, 34, 1);
  fillBlocks('quartz', 352, G - 96, 1, 12); fillBlocks('quartz', 616, G - 96, 1, 12);
  R(360, G - 96, 256, 96, '#E7E9EE');
  R(360, G - 4, 256, 4, '#9AA0AA');
  for (let x = 376; x < 600; x += 48) fillBlocks('glass', x, G - 84, 3, 3);     // ventanas
  // reloj y póster
  R(560, G - 92, 10, 10, '#FFFFFF'); R(564, G - 90, 1, 4, '#1C1C1E'); R(564, G - 87, 3, 1, '#1C1C1E');
  // escritorios
  desk(400, G - 18, 40); desk(470, G - 18, 40); desk(540, G - 18, 40);
  monitor(414, t, true); monitor(484, t, false); monitor(554, t, false);
  R(406, G - 21, 4, 3, '#FFFFFF');                      // taza
  plant(452); plant(596);
  R(370, G - 26, 18, 26, '#B7BCC4'); R(372, G - 24, 14, 4, '#6E7580'); R(374, G - 16, 10, 1, '#FFFFFF'); // impresora
  npc(482, G, '#B03A2E', '#1C1C1E', true, t); chair(477);
  npc(552, G, '#5D4A7A', '#6B4A2B', true, t); chair(547);
  chair(409);
  if (drawP) drawP();
}
function monitor(x, t, hers){
  R(x, G - 34, 20, 14, '#22262E'); R(x + 1, G - 33, 18, 12, '#0B1026'); R(x + 8, G - 20, 4, 2, '#3A3F4A');
  if (hers && tl.officeArt > 0){
    const k = tl.officeArt;                               // 0..1: el afiche aparece de a poco
    R(x + 2, G - 32, 16, 10, '#F4F1E8');
    if (k > .2) R(x + 3, G - 31, 6, 6, '#ff4040');
    if (k > .45) R(x + 10, G - 31, 7, 2, '#1C1C1E');
    if (k > .6) R(x + 10, G - 28, 5, 1, '#6B6B70');
    if (k > .75) R(x + 3, G - 24, 14, 1, '#3E7CB1');
  } else { R(x + 2, G - 32, 14, 1, '#3DD9FF'); R(x + 2, G - 29, 10, 1, '#6B6B70'); R(x + 2, G - 26, 12, 1, '#6B6B70'); }
}

function sceneAirport(t){
  ground(640, 1160);
  for (let x = 660; x < 1150; x += 8){ if (x >= 808 && x < 1000) continue; blk('asphalt', x, G); }   // pistas de despegue y aterrizaje
  for (let x = 664; x < 1150; x += 24){ if (x >= 800 && x < 1000) continue; R(x, G + 3, 10, 2, '#FFD54F'); }
  // mar abierto entre los dos aeropuertos
  R(808, G, 192, 48, '#2E6DA4'); R(808, G + 8, 192, 40, '#1E4F80');
  for (let x = 812; x < 996; x += 14) R(x + Math.round(Math.sin(t * 2 + x) * 2), G + 2 + (x % 3), 5, 1, '#9FD3E8');
  // barquito y skyline lejano
  const bx = 880 + Math.sin(t * .5) * 6; R(bx, G - 4, 14, 4, '#B44C33'); R(bx + 2, G - 7, 8, 3, '#F4F1E8'); R(bx + 5, G - 12, 1, 5, '#8A8F98'); R(bx + 6, G - 12, 4, 4, '#FFFFFF');
  for (const [x, h] of [[1004,26],[1012,38],[1022,30],[1030,46],[1040,22],[1048,34]]) { R(x, G - h, 8, h, '#8EA4C4'); for (let y = G - h + 3; y < G - 3; y += 6) R(x + 2, y, 2, 2, '#D8E4F2'); }
  // terminal y torre
  fillBlocks('quartz', 660, G - 48, 6, 6); fillBlocks('glass', 668, G - 40, 4, 2);
  fillBlocks('quartz', 1120, G - 72, 2, 9); fillBlocks('glass', 1112, G - 80, 4, 2); R(1112, G - 84, 32, 4, '#3A3F4A');
  // conos
  for (const x of [760, 1060]) { R(x, G - 5, 4, 5, '#E67E22'); R(x, G - 3, 4, 1, '#FFFFFF'); }
}
function plane(x, y, ang, t){
  b.save(); b.translate(Math.round(x - camX), Math.round(y - camY)); b.rotate(ang);
  const P = (px, py, w, h, c) => { b.fillStyle = c; b.fillRect(px, py, w, h); };
  P(-34, -6, 62, 12, '#F4F4F6'); P(28, -4, 8, 8, '#F4F4F6'); P(36, -2, 4, 4, '#E2E2E2');   // fuselaje y nariz
  P(-34, -16, 10, 10, '#ff4040'); P(-30, -18, 6, 2, '#ff4040');                           // cola
  P(-34, 2, 62, 2, '#ff4040');                                                             // franja
  for (let k = -26; k < 24; k += 6) P(k, -3, 3, 3, '#2B3A55');                             // ventanillas
  P(30, -3, 4, 3, '#2B3A55');
  P(-6, 2, 20, 4, '#D5D7DC'); P(-2, 6, 14, 3, '#B7BCC4');                                  // ala
  P(-1, 9, 8, 3, '#8A8F98');                                                               // turbina
  if (y > G - 20){ P(-20, 6, 2, 4, '#3A3F4A'); P(14, 6, 2, 4, '#3A3F4A'); P(-21, 9, 4, 3, '#22262E'); P(13, 9, 4, 3, '#22262E'); }
  b.restore();
}

function sceneHome(t, drawP){
  ground(1140, 1460);
  tree(1150, 4);
  // casa de madera recortada
  fillBlocks('log', 1176, G - 80, 1, 10); fillBlocks('log', 1416, G - 80, 1, 10);
  for (let i = 0; i < 32; i++){ const hgt = Math.min(i, 31 - i) * 3; for (let y = G - 88 - hgt; y < G - 88; y += 8) blk('wool', 1168 + i * 8, y); }  // techo
  fillBlocks('wool', 1168, G - 88, 32, 1);
  R(1184, G - 80, 232, 80, '#E9D9BD'); for (let x = 1184; x < 1416; x += 8) R(x, G - 80, 1, 80, '#DCC9A8');
  fillBlocks('planks', 1184, G - 8, 29, 1);
  fillBlocks('glass', 1200, G - 64, 3, 3);                                       // ventana
  R(1230, G - 20, 40, 12, '#3E7CB1'); R(1232, G - 19, 36, 10, '#4886BD');        // alfombra
  // gato
  const cx = 1240 + Math.sin(t * .7) * 3;
  R(cx, G - 14, 9, 5, '#E67E22'); R(cx + 8, G - 17, 5, 5, '#E67E22'); R(cx + 8, G - 18, 1, 1, '#E67E22'); R(cx + 12, G - 18, 1, 1, '#E67E22');
  R(cx + 10, G - 15, 1, 1, '#1C1C1E'); R(cx - 3, G - 15 + Math.round(Math.sin(t * 4)), 3, 1, '#E67E22');
  // escritorio con laptop y dashboard fintech
  desk(1290, G - 26, 50); plant(1346); chair(1296); R(1294, G - 29, 4, 3, '#FFFFFF');
  laptop(1310, t);
  // cuadro y estantería
  R(1360, G - 70, 40, 2, '#6B4A2B'); R(1362, G - 78, 4, 8, '#ff4040'); R(1368, G - 76, 4, 6, '#3E7CB1'); R(1374, G - 79, 4, 9, '#E3B23C'); R(1384, G - 75, 10, 5, '#3E8E5A');
  R(1250, G - 66, 22, 16, '#FFFFFF'); R(1252, G - 64, 18, 12, '#5B8ED6'); R(1255, G - 58, 6, 6, '#6BB043');
  // puerta
  fillBlocks('dplanks', 1408, G - 32, 1, 3); R(1410, G - 18, 1, 2, '#E3B23C');
  if (drawP) drawP();
}
function laptop(x, t){
  R(x, G - 46, 34, 20, '#2B2F38'); R(x + 1, G - 45, 32, 18, '#F4F6FB');
  // dashboard: tarjeta + gráfico de línea + barras
  R(x + 2, G - 44, 9, 6, '#4F46E5'); R(x + 3, G - 42, 5, 1, '#FFFFFF');
  const k = (t * 1.5) % 1;
  const pts = [10, 7, 8, 4, 6, 3, 2];
  for (let i = 0; i < pts.length - 1; i++){ R(x + 13 + i * 3, G - 44 + pts[i], 3, 1, '#16A34A'); }
  for (let i = 0; i < 6; i++){ const h = 2 + ((i * 3 + Math.floor(t * 2)) % 5); R(x + 3 + i * 3, G - 29 - h, 2, h, i === 5 ? '#ff4040' : '#9AA0AA'); }
  R(x + 22, G - 34, 9, 6, '#E8F5E9'); R(x + 23, G - 32, 6, 1, '#16A34A');
  // videollamada
  R(x + 22, G - 41, 4, 4, '#E3B23C'); R(x + 27, G - 41, 4, 4, '#5D4A7A');
  R(x - 2, G - 26, 38, 2, '#3A3F4A');
}

function sceneGolf(t){
  for (let x = 1450; x < WORLD + 16; x += 8){ blk('green', x, G); for (let k = 1; k < 6; k++) blk('dirt', x, G + k * 8); }
  tree(1640, 5); tree(1700, 6); tree(1790, 4);
  fillBlocks('sand', 1536, G, 3, 1);
  // banderín y hoyo
  R(HOLE, G - 1, 5, 2, '#1C1C1E'); R(HOLE + 2, G - 30, 1, 29, '#F4F4F6');
  const wv = Math.round(Math.sin(t * 6));
  R(HOLE + 3, G - 30, 10, 6 + wv, '#ff4040');
  // carrito
  R(1612, G - 12, 18, 8, '#F4F4F6'); R(1612, G - 18, 18, 2, '#3E8E5A'); R(1614, G - 16, 1, 4, '#8A8F98'); R(1628, G - 16, 1, 4, '#8A8F98');
  R(1614, G - 4, 4, 4, '#22262E'); R(1624, G - 4, 4, 4, '#22262E');
}
const HOLE = 1592;

// texto en pixel (solo mayúsculas que usamos)
const F = { D:['110','101','101','101','110'], I:['111','010','010','010','111'], S:['011','100','010','001','110'], E:['111','100','110','100','111'], N:['101','111','111','111','101'], O:['010','101','101','101','010'] };
function pixText(s, x, y, col){ let cx = x; for (const ch of s){ const g = F[ch]; if (g) g.forEach((row, j) => [...row].forEach((v, i) => { if (v === '1') R(cx + i * 2, y + j * 2, 2, 2, col); })); cx += 9; } }
function circleS(x, y, r){ b.beginPath(); b.arc(Math.round(x - camX) + .5, Math.round(y - camY) + .5, r, 0, Math.PI * 2); b.stroke(); }
function rectS(x, y, w, h){ b.strokeRect(Math.round(x - camX) + .5, Math.round(y - camY) + .5, w, h); }

// ── Guion (segundos) ─────────────────────────────────────────────────────────
const CAPS_ES = [
  [0.4, 5.2,  '01', 'Estudia diseño', 'Bocetos, tipografía y muchas láminas.'],
  [5.6, 11.2, '02', 'Diseñadora gráfica en una oficina', 'Afiches, marcas y café de máquina.'],
  [11.6, 19.6,'03', 'Toma un avión', 'Nuevos destinos, nuevos proyectos.'],
  [20.0, 24.6,'04', 'Líder UX/UI en una fintech', 'Desde casa, 100% remoto.'],
  [25.0, 31.6,'05', 'Hoy un robot hace su trabajo y ella juega al golf', '…y ella juega al golf.'],
];
const CAPS_EN = [
  [0.4, 5.2,  '01', 'Studies design', 'Sketches, typography and lots of boards.'],
  [5.6, 11.2, '02', 'Graphic designer at an office', 'Posters, brands and vending-machine coffee.'],
  [11.6, 19.6,'03', 'Catches a plane', 'New places, new projects.'],
  [20.0, 24.6,'04', 'UX/UI Lead at a fintech', 'From home, 100% remote.'],
  [25.0, 31.6,'05', 'Today a robot does her job and she plays golf', '…and she plays golf.'],
];
const CAPS = EN ? CAPS_EN : CAPS_ES;
const DUR = 33.5;
const ease = p => p < 0 ? 0 : p > 1 ? 1 : p * p * (3 - 2 * p);
const lerp = (a, b2, p) => a + (b2 - a) * p;
function seg(t, t0, t1){ return ease((t - t0) / (t1 - t0)); }

const tl = { officeArt: 0 };
function state(t){
  // devuelve posición/pose de la diseñadora, del robot, del avión y del objetivo de cámara
  const S = { her: null, robot: null, plane: null, ball: null, focus: 0, shirt: '#7C4DBD' };
  tl.officeArt = t < 8 ? 0 : Math.min(1, (t - 8) / 3);
  if (t < 2)        S.her = { x: lerp(20, 150, seg(t, 0, 2)), pose: 'walk', shirt: '#7C4DBD' };
  else if (t < 5)   S.her = { x: 150, pose: 'sit', arm: 1, shirt: '#7C4DBD' };
  else if (t < 8)   S.her = { x: lerp(150, 412, seg(t, 5, 8)), pose: 'walk', shirt: '#3E7CB1' };
  else if (t < 11)  S.her = { x: 412, pose: 'sit', arm: 1, shirt: '#3E7CB1' };
  else if (t < 13.5)S.her = { x: lerp(412, 700, seg(t, 11, 13.5)), pose: 'walk', shirt: '#C0392B' };
  else if (t < 19.2)S.her = null;                               // va en el avión
  else if (t < 20.4)S.her = { x: lerp(1120, 1300, seg(t, 19.2, 20.4)), pose: 'walk', shirt: '#2E7D32' };
  else if (t < 24.2)S.her = { x: 1300, pose: 'sit', arm: 1, shirt: '#2E7D32' };
  else if (t < 27.2)S.her = { x: lerp(1300, 1476, seg(t, 24.6, 27.2)), pose: t < 24.6 ? 'stand' : 'walk', shirt: '#F4F4F6', cap: '#ff4040' };
  else              S.her = { x: 1476, pose: 'swing', shirt: '#F4F4F6', cap: '#ff4040' };

  // avión: espera en 690, carretea, despega, vuela, aterriza
  if (t < 13.6)       S.plane = { x: 700, y: G - 12, a: 0 };
  else if (t < 14.6)  S.plane = { x: lerp(700, 760, seg(t, 13.6, 14.6)), y: G - 12, a: 0 };
  else if (t < 17.8){ const p = (t - 14.6) / 3.2; S.plane = { x: lerp(760, 1060, p), y: G - 12 - Math.sin(p * Math.PI) * 78, a: -Math.cos(p * Math.PI) * .18 }; }
  else if (t < 19.0)  S.plane = { x: lerp(1060, 1110, seg(t, 17.8, 19.0)), y: G - 12, a: 0 };
  else                S.plane = { x: 1110, y: G - 12, a: 0 };

  // robot
  if (t >= 24.2 && t < 25.6) S.robot = { x: lerp(1190, 1300, seg(t, 24.2, 25.6)), pose: 'walk' };
  else if (t >= 25.6) S.robot = { x: 1300, pose: 'sit' };

  // golpe de golf
  if (S.her && S.her.pose === 'swing'){
    const ts = t - 27.2;                                  // 0: preparación · 1.0: impacto
    S.her.arm = ts < 0.9 ? lerp(Math.PI * .55, -Math.PI * 1.1, ease(ts / .9)) : ts < 1.05 ? lerp(-Math.PI * 1.1, Math.PI * .35, (ts - .9) / .15) : Math.PI * .35 - Math.min(.8, (ts - 1.05) * 2);
    if (ts >= 1.05){ const p = Math.min(1, (ts - 1.05) / 2.0); S.ball = { x: lerp(1488, HOLE + 2, p), y: G - 2 - Math.sin(p * Math.PI) * 50, p }; }
    else S.ball = { x: 1488, y: G - 2, p: 0 };
  }

  // cámara
  let fx;
  if (t < 13.5) fx = S.her.x;
  else if (t < 19.2) fx = S.plane.x;
  else if (t < 24.6) fx = S.her ? S.her.x : 1300;
  else if (t < 27.2) fx = lerp(1300, 1440, seg(t, 24.6, 27.2));
  else fx = lerp(1440, 1452, seg(t, 28.2, 30));
  S.focus = fx;
  S.camY = (t > 14.6 && t < 17.8) ? -Math.sin(((t - 14.6) / 3.2) * Math.PI) * 30 : 0;
  return S;
}

// ── Bucle ────────────────────────────────────────────────────────────────────
let t0 = performance.now() - START * 1000, ended = false, lastCap = -1;
const capEl = Q('cap');
function render(now){
  const t = FREEZE ? START : (now - t0) / 1000;
  const S = state(Math.min(t, DUR));
  camX = Math.max(0, Math.min(WORLD - LW, Math.round(S.focus - LW / 2)));
  camY = Math.round(S.camY);
  b.imageSmoothingEnabled = false;
  sky(t);
  // escenas visibles
  const drawHer = () => { if (S.her) person(S.her.x, G - (S.her.pose === 'sit' ? 0 : 0), { ...S.her, t }); };
  const vis = (a, z) => camX + LW > a && camX < z;
  if (vis(-20, 340)) sceneUni(t, S.her && S.her.x < 330 ? drawHer : null);
  if (vis(330, 660)) sceneOffice(t, S.her && S.her.x >= 330 && S.her.x < 650 ? drawHer : null);
  if (vis(640, 1160)) sceneAirport(t);
  if (S.her && S.her.x >= 650 && S.her.x < 1150) drawHer();
  if (vis(1140, 1460)) sceneHome(t, () => { if (S.robot) robot(S.robot.x, G, { ...S.robot, t }); if (S.her && S.her.x >= 1150 && S.her.x < 1460) drawHer(); });
  if (vis(1450, WORLD + 20)) sceneGolf(t);
  if (S.her && S.her.x >= 1460) drawHer();
  if (t > 14.6 && t < 18.6){ for (let k = 1; k < 40; k++){ const tt = Math.max(14.6, t - k * .045); const P2 = state(tt).plane; if (P2.y < G - 16){ b.globalAlpha = Math.max(0, .55 - k * .013); R(P2.x - 36, P2.y - 2, 2, 2, '#FFFFFF'); b.globalAlpha = 1; } } }
  if (S.plane && vis(S.plane.x - 60, S.plane.x + 60)) plane(S.plane.x, S.plane.y, S.plane.a, t);
  if (S.ball){ R(S.ball.x, S.ball.y, 2, 2, '#FFFFFF'); if (S.ball.p >= 1){ const k = (t - 30.25); for (let i = 0; i < 8; i++){ const a2 = i / 8 * Math.PI * 2; const d = 4 + k * 22; if (k < 1) R(HOLE + 2 + Math.cos(a2) * d, G - 4 + Math.sin(a2) * d, 2, 2, ['#FFD54F','#ff4040','#3DD9FF','#6BB043'][i % 4]); } } }
  // dibujar el buffer a pantalla (cover)
  const sw = cv.width, sh = cv.height, portrait = sw / sh < 1.25;
  const sc = portrait ? sw / LW : Math.max(sw / LW, sh / LH);
  const oy = portrait ? Math.round(sh * .46 - (LH * sc) * .5) : (sh - LH * sc) / 2;
  ctx.imageSmoothingEnabled = false;
  if (portrait){ ctx.fillStyle = '#5B8ED6'; ctx.fillRect(0, 0, sw, oy + 2); ctx.fillStyle = '#6B4729'; ctx.fillRect(0, oy + LH * sc - 2, sw, sh); }
  ctx.drawImage(buf, (sw - LW * sc) / 2, oy, LW * sc, LH * sc);
  // subtítulos
  const ci = CAPS.findIndex(c => t >= c[0] && t < c[1]);
  if (ci !== lastCap){ lastCap = ci; if (ci >= 0){ const c = CAPS[ci]; Q('capn').textContent = c[2]; Q('capt').textContent = c[3]; capEl.classList.add('on'); } else capEl.classList.remove('on'); }
  if (!FREEZE && t >= DUR - 0.9 && !ended) finish();
  if (!gone) raf = requestAnimationFrame(render);
}
raf = requestAnimationFrame(render);


function finish(){
  if (ended) return; ended = true;
  root.classList.add('out');
  removeEventListener('keydown', onKey);
  if (typeof onReveal === 'function') onReveal();
  setTimeout(() => { gone = true; cancelAnimationFrame(raf); removeEventListener('resize', resize); root.remove(); st.remove(); }, 950);
}
function onKey(e){ if (e.key === 'Escape') finish(); }
addEventListener('keydown', onKey);
Q('skip').addEventListener('click', finish);
};
})();
