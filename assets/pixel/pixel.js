/* ============================================================
   Detalles pixel art del portfolio (mismo mundo que la intro).
   Todo se dibuja en canvas chicos escalados sin suavizado.
   Se activa solo donde encuentra el markup correspondiente:
   1. Experiencia: la diseñadora camina por su trayectoria
   2. Hablemos: escena de golf con el robot (hoyo en uno al tocar "Escribime")
   3. Cómo trabajo: una escena por paso
   4. Cursor: ícono pixel en el chip del cursor
   5. Franja de pasto antes del footer (con el gato)
   6. Íconos pixel en el marquee
   7. Avatar pixel junto a la foto
   8. Escena de la página 404
   9. Barras de experiencia (XP) bajo las métricas
   ============================================================ */
(function(){
'use strict';

const RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
const EN = () => { try { return localStorage.getItem('lang') === 'en'; } catch (e) { return false; } };

// ── Paleta (colores del sitio + piel/pelo del personaje de la intro) ───────
const C = {
  olive: '#5b6e2b', oliveD: '#44531f', oliveDD: '#323d16', lime: '#befd66', limeD: '#9fd64a',
  white: '#ffffff', off: '#f4f3ef', black: '#1c1c1c', ink: '#2a2a2a',
  skin: '#E8B98A', hair: '#4A2E1A', blush: '#C4776A', eye: '#1C1C1E',
  rob: '#C9CED6', robD: '#AEB4BD', robDD: '#6E7580', screen: '#2B2F38', robEye: '#befd66',
  wood: '#8A6236', woodD: '#6B4A2B', grey: '#9AA0AA', cat: '#E67E22', red: '#ff5a4a'
};

// ── Motor mínimo ────────────────────────────────────────────────────────────
const widgets = [];
function px(){ return innerWidth < 700 ? 2.5 : 3; }

/* Crea un canvas lógico (lw×lh) dentro de host. fit:'width' → el ancho lógico
   sale del ancho del host; si no, tamaño fijo con escala s. */
function makeCanvas(host, lh, opts){
  opts = opts || {};
  const cv = document.createElement('canvas');
  cv.className = 'px-cv';
  cv.setAttribute('aria-hidden', 'true');
  host.appendChild(cv);
  const ctx = cv.getContext('2d');
  const w = { host, cv, ctx, lw: opts.lw || 0, lh, s: opts.s || px(), fit: opts.fit, vis: false, t: 0, draw: opts.draw, tick: opts.tick };
  w.size = () => {
    w.s = opts.s || px();
    if (w.fit === 'width') w.lw = Math.max(40, Math.ceil(host.clientWidth / w.s));
    cv.width = w.lw; cv.height = w.lh;
    cv.style.width = (w.lw * w.s) + 'px'; cv.style.height = (w.lh * w.s) + 'px';
    if (opts.onSize) opts.onSize(w);
  };
  w.size();
  if ('IntersectionObserver' in window){
    new IntersectionObserver(es => es.forEach(e => { w.vis = e.isIntersecting; }), { rootMargin: '100px' }).observe(host);
  } else w.vis = true;
  widgets.push(w);
  return w;
}

function painter(ctx){
  const R = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), w, h); };
  return { R };
}

/* La diseñadora (mismo dibujo que en la intro). (X,Y) = pies.
   o: {shirt, pants, pose:'walk'|'stand'|'work'|'wave'|'swing'|'map', t, flip, cap, arm} */
function person(R, x, y, o){
  const X = Math.round(x), Y = Math.round(y), t = o.t || 0;
  const M = o.flip ? (a, w) => 2 * X + 3 - a - w : (a) => a;
  const P = (a, b, w, h, c) => R(M(a, w), b, w, h, c);
  const s = o.shirt || C.lime, p = o.pants || C.black;
  const walk = o.pose === 'walk', a = walk && Math.sin(t * 14) > 0 ? 1 : 0;
  P(X - 2 + a, Y - 5, 3, 5, p); P(X + 2 - a, Y - 5, 3, 5, p);
  P(X - 2 + a, Y - 1, 3, 1, C.eye); P(X + 2 - a, Y - 1, 3, 1, C.eye);
  P(X - 2, Y - 11, 7, 6, s);
  const by = Y - (walk ? Math.round(Math.abs(Math.sin(t * 14)) * .6) : 0);
  P(X - 2, by - 18, 7, 7, C.skin);
  P(X - 2, by - 19, 7, 2, C.hair); P(X - 3, by - 18, 2, 6, C.hair); P(X - 4, by - 16, 2, 4, C.hair);
  const blink = (Math.floor(t * 1.3 + X) % 9) === 0 && (t * 1.3 % 1) < .18;
  P(X + 2, by - 15, 1, blink ? 0 : 1, C.eye); P(X + 4, by - 15, 1, blink ? 0 : 1, C.eye);
  P(X + 3, by - 13, 1, 1, C.blush);
  if (o.cap){ P(X - 3, by - 20, 8, 2, o.cap); P(X + 3, by - 18, 4, 1, o.cap); }
  if (o.pose === 'swing'){
    const ang = o.arm, hx = X + 2, hy = by - 9;
    P(hx - 1, hy - 1, 3, 3, C.skin);
    for (let k = 0; k < 12; k++) P(hx + Math.cos(ang) * k, hy + Math.sin(ang) * k, 1, 1, '#B7BCC4');
    P(hx + Math.cos(ang) * 12 - 1, hy + Math.sin(ang) * 12 - 1, 3, 2, '#5E636B');
  } else if (o.pose === 'work'){
    const k = Math.round(Math.sin(t * 16));
    P(X + 3, by - 10 + k, 5, 2, s); P(X + 8, by - 10 + k, 1, 2, C.skin);
  } else if (o.pose === 'wave'){
    const k = Math.sin(t * 10) > 0 ? 1 : 0;
    P(X + 4, by - 13 - k, 2, 4, s); P(X + 5 + k, by - 17 - k, 2, 3, C.skin);
  } else if (o.pose === 'map'){
    P(X + 3, by - 11, 3, 2, s);
    P(X + 5, by - 14, 8, 7, '#EDE3C8'); P(X + 6, by - 13, 2, 2, C.olive); P(X + 9, by - 11, 3, 1, C.red); P(X + 7, by - 9, 4, 1, C.limeD);
  } else {
    P(X + 1, by - 11, 2, 5, s); P(X + 1, by - 6, 2, 1, C.skin);
  }
}

function robot(R, x, y, o){
  const X = Math.round(x), Y = Math.round(y), t = o.t || 0;
  const M = o.flip ? (a, w) => 2 * X + 3 - a - w : (a) => a;
  const P = (a, b, w, h, c) => R(M(a, w), b, w, h, c);
  if (o.pose === 'sit'){ P(X - 1, Y - 6, 8, 3, C.robDD); P(X + 5, Y - 6, 2, 6, C.robDD); P(X - 2, Y - 13, 8, 7, C.robD); P(X, Y - 11, 4, 3, C.lime); }
  else { const a = o.pose === 'walk' && Math.sin(t * 14) > 0 ? 1 : 0;
    P(X - 2 + a, Y - 5, 3, 5, C.robDD); P(X + 3 - a, Y - 5, 3, 5, C.robDD); P(X - 2, Y - 12, 8, 7, C.robD); P(X, Y - 10, 4, 3, C.lime); }
  const by = o.pose === 'sit' ? Y - 7 : Y - 1;
  P(X - 2, by - 18, 8, 7, C.rob); P(X - 1, by - 17, 6, 5, C.screen);
  const blink = (Math.floor(t * 2) % 7) === 0;
  P(X + 1, by - 15, 1, blink ? 0 : 2, C.robEye); P(X + 3, by - 15, 1, blink ? 0 : 2, C.robEye);
  P(X + 1, by - 21, 1, 3, C.grey); P(X, by - 22, 3, 1, (Math.floor(t * 3) % 2) ? C.lime : C.limeD);
  if (o.pose === 'sit' || o.pose === 'type'){ P(X + 6, by - 10 + Math.round(Math.sin(t * 30)), 5, 2, C.robD); }
  else if (o.pose === 'cheer'){ const k = Math.sin(t * 12) > 0 ? 1 : 0; P(X - 4, by - 16 - k, 2, 5, C.robD); P(X + 6, by - 16 - k, 2, 5, C.robD); }
  else if (o.pose === 'lens'){ // brazo con lupa
    P(X + 6, by - 11, 4, 2, C.robD); P(X + 9, by - 15, 5, 5, C.lime); P(X + 10, by - 14, 3, 3, C.screen); P(X + 10, by - 10, 1, 2, C.grey);
  } else if (o.pose === 'carry'){ P(X + 6, by - 12, 3, 2, C.robD); }
  else { P(X + 2, by - 11, 2, 5, C.grey); }
}

function cat(R, x, y, t, walking){
  const X = Math.round(x), Y = Math.round(y), k = walking ? (Math.sin(t * 12) > 0 ? 1 : 0) : 0;
  R(X, Y - 5, 9, 4, C.cat); R(X + 8, Y - 8, 5, 5, C.cat); R(X + 8, Y - 9, 1, 1, C.cat); R(X + 12, Y - 9, 1, 1, C.cat);
  R(X + 10, Y - 6, 1, 1, C.eye); R(X - 3, Y - 6 + Math.round(Math.sin(t * 4)), 3, 1, C.cat);
  R(X + 1 + k, Y - 1, 1, 1, C.cat); R(X + 7 - k, Y - 1, 1, 1, C.cat);
}

/* Suelo de bloques: pasto (lima/oliva) + tierra (oliva oscuro). */
function ground(R, w, gy, rows, seed, x0){
  for (let x = x0 || 0; x < (x0 || 0) + w; x++){
    const h = (x * 73 + (seed || 0)) % 7;
    R(x, gy, 1, 1, h < 2 ? C.limeD : C.lime);
    R(x, gy + 1, 1, 1, h === 3 ? C.lime : C.limeD);
    R(x, gy + 2, 1, 1, h < 3 ? C.olive : C.limeD);
    for (let j = 3; j < rows; j++){ const q = (x * 31 + j * 17 + (seed || 0)) % 9; R(x, gy + j, 1, 1, q < 2 ? C.oliveDD : q < 5 ? C.oliveD : C.olive); }
  }
}

function desk(R, x, gy, w){ R(x, gy - 10, w, 2, C.wood); R(x + 1, gy - 8, 2, 8, C.woodD); R(x + w - 3, gy - 8, 2, 8, C.woodD); }

// ── Objetos de cada trabajo (x = centro, gy = suelo) ───────────────────────
const STATION = {
  pencil(R, x, gy, t){ // diseño gráfico: lápiz gigante clavado
    R(x - 2, gy - 22, 5, 16, '#E3B23C'); R(x - 2, gy - 22, 1, 16, '#F2C94C'); R(x - 2, gy - 25, 5, 3, '#E9A0A0'); R(x - 2, gy - 23, 5, 1, C.grey);
    R(x - 1, gy - 6, 3, 3, C.skin); R(x, gy - 3, 1, 3, C.ink);
  },
  building(R, x, gy, t){ // ministerio
    R(x - 11, gy - 18, 22, 18, '#E9E4DA'); R(x - 13, gy - 21, 26, 3, '#CFC8B8');
    for (let i = 0; i < 4; i++) R(x - 9 + i * 5, gy - 16, 2, 14, '#D2CBBB');
    R(x - 2, gy - 7, 4, 7, C.woodD);
    R(x, gy - 32, 1, 11, C.grey); R(x + 1, gy - 32, 7, 2, '#74ACDF'); R(x + 1, gy - 30, 7, 1, C.white); R(x + 1, gy - 29, 7, 2, '#74ACDF');
  },
  easel(R, x, gy, t){ // NeuralSoft: gráfica / afiches
    R(x - 6, gy - 20, 1, 20, C.woodD); R(x + 5, gy - 20, 1, 20, C.woodD); R(x - 1, gy - 22, 1, 22, C.woodD);
    R(x - 8, gy - 22, 17, 14, C.white); R(x - 7, gy - 21, 15, 12, '#F7F5EE');
    R(x - 5, gy - 19, 6, 6, C.red); R(x + 1, gy - 16, 5, 5, C.lime); R(x - 5, gy - 12, 10, 1, C.ink);
  },
  studio(R, x, gy, t){ // ZRNI Studio: escritorio con lámpara y moodboard
    desk(R, x - 12, gy, 24);
    R(x - 9, gy - 13, 6, 3, C.white); R(x - 8, gy - 12, 4, 1, C.olive);
    R(x + 6, gy - 20, 1, 10, C.ink); R(x + 3, gy - 21, 6, 2, C.ink); R(x + 3, gy - 19, 4, 1, '#FFE89A');
    R(x - 10, gy - 30, 18, 12, C.ink); R(x - 9, gy - 29, 7, 5, C.lime); R(x - 1, gy - 29, 7, 5, C.red); R(x - 9, gy - 23, 15, 4, C.off);
    R(x - 7, gy - 22, 3, 2, C.black); R(x - 3, gy - 22, 3, 2, C.black);
  },
  monitor(R, x, gy, t){ // Mangoo: monitor con código
    desk(R, x - 12, gy, 24);
    R(x - 8, gy - 26, 16, 12, C.screen); R(x - 7, gy - 25, 14, 10, '#1d2430');
    const k = Math.floor(t * 3) % 4;
    for (let i = 0; i < 4; i++) R(x - 6 + (i % 2) * 2, gy - 24 + i * 2, [8, 5, 9, 6][(i + k) % 4], 1, i % 2 ? C.lime : '#7FB2FF');
    R(x - 1, gy - 14, 2, 4, C.screen);
  },
  umbrella(R, x, gy, t){ // Cooperación Seguros: paraguas (seguros)
    R(x - 12, gy - 24, 25, 2, C.olive); R(x - 10, gy - 26, 21, 2, C.olive); R(x - 6, gy - 28, 13, 2, C.olive);
    R(x - 12, gy - 24, 4, 2, C.lime); R(x - 2, gy - 26, 4, 2, C.lime); R(x + 8, gy - 24, 4, 2, C.lime);
    R(x, gy - 30, 1, 2, C.ink); R(x, gy - 22, 1, 18, C.ink); R(x - 2, gy - 4, 3, 1, C.ink); R(x - 2, gy - 5, 1, 1, C.ink);
    const d = (t * 30) % 20; R(x - 15, gy - 30 + d, 1, 2, '#7FB2FF'); R(x + 16, gy - 34 + ((d + 9) % 20), 1, 2, '#7FB2FF');
  },
  laptop(R, x, gy, t){ // Goiar: fintech, laptop con dashboard
    desk(R, x - 14, gy, 28);
    R(x - 10, gy - 24, 20, 13, C.screen); R(x - 9, gy - 23, 18, 11, C.off);
    R(x - 8, gy - 22, 6, 4, C.olive); R(x - 7, gy - 20, 3, 1, C.white);
    const pts = [6, 4, 5, 2, 3, 1]; for (let i = 0; i < pts.length - 1; i++) R(x - 1 + i * 2, gy - 22 + pts[i], 2, 1, '#16A34A');
    for (let i = 0; i < 5; i++){ const h = 1 + ((i * 3 + Math.floor(t * 2)) % 4); R(x - 8 + i * 2, gy - 13 - h, 1, h, i === 4 ? C.lime : C.grey); }
    R(x - 12, gy - 11, 24, 1, C.ink);
  }
};

// ── 1. Experiencia ──────────────────────────────────────────────────────────
/* host: contenedor de la franja; rows: filas de la lista (de más nueva a más vieja);
   kinds: objeto por fila, mismo orden; mode: 'progress' | 'center'. */
function initExp(host, rows, kinds, mode){
  const n = rows.length, LH = 44, GY = 34;
  let her = { x: 0, flip: false, moving: false }, target = 0, first = true, active = -1;
  // mundo: si no entran todas las estaciones, la franja se vuelve una cámara que sigue a la diseñadora
  const worldW = lw => Math.max(lw, 52 + (n - 1) * 48);
  const stX = (i, lw) => { const W = worldW(lw), m = Math.max(26, Math.min(44, W * .08)); return Math.round(m + (W - 2 * m) * (n === 1 ? .5 : i / (n - 1))); };
  let cam = 0;
  const w = makeCanvas(host, LH, { fit: 'width' });
  function pick(){
    const vh = innerHeight;
    if (mode === 'center'){
      const line = vh * .5; let best = 0, bd = 1e9;
      rows.forEach((r, i) => { const b = r.getBoundingClientRect(); const d = b.top > line ? b.top - line : b.bottom < line ? line - b.bottom : 0; if (d < bd){ bd = d; best = i; } });
      return n - 1 - best;                                   // estación: 0 = más vieja (izquierda)
    }
    const list = rows[0].parentElement.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (vh * .92 - list.top) / (list.height + vh * .35)));
    return Math.min(n - 1, Math.floor(p * n));
  }
  w.tick = (dt) => {
    const st = pick();
    if (st !== active){
      active = st;
      rows.forEach((r, i) => r.classList.toggle('px-active', i === n - 1 - st));
    }
    target = stX(st, w.lw) - 16;
    if (first){ her.x = RM ? target : stX(0, w.lw) - 16; cam = Math.max(0, Math.min(worldW(w.lw) - w.lw, her.x + 16 - w.lw / 2)); first = false; }
    const d = target - her.x, sp = 70 * dt;
    if (Math.abs(d) <= sp){ her.x = target; her.moving = false; }
    else { her.x += Math.sign(d) * sp; her.moving = true; her.flip = d < 0; }
  };
  w.draw = (t) => {
    const { R } = painter(w.ctx); w.ctx.clearRect(0, 0, w.lw, LH);
    const W = worldW(w.lw), want = Math.max(0, Math.min(W - w.lw, her.x + 16 - w.lw / 2));
    cam = W === w.lw ? 0 : (RM ? want : cam + (want - cam) * .12);
    w.ctx.save(); w.ctx.translate(-Math.round(cam), 0);
    ground(R, w.lw + 1, GY, LH - GY, 3, Math.round(cam));
    for (let i = 0; i < n; i++){
      const x = stX(i, w.lw), on = i === active;
      STATION[kinds[n - 1 - i]](R, x, GY, on ? t : 0);
      if (on && !her.moving){ const b = Math.round(Math.sin(t * 5)); R(x - 2, 1 + b, 5, 2, C.olive); R(x - 1, 3 + b, 3, 1, C.olive); R(x, 4 + b, 1, 1, C.olive); }
    }
    person(R, her.x, GY, { t, pose: her.moving ? 'walk' : 'work', flip: her.moving ? her.flip : false, shirt: C.lime });
    w.ctx.restore();
  };
}

// ── 2. Hablemos: golf ───────────────────────────────────────────────────────
function initGolf(host, trigger){
  const LH = 52, GY = 38;
  const w = makeCanvas(host, LH, { fit: 'width' });
  let shot = -1;                                         // t de inicio del tiro
  const fire = () => { if (shot < 0 || w.t - shot > 3.2) shot = w.t; };
  if (trigger){ trigger.addEventListener('mouseenter', fire); trigger.addEventListener('focus', fire); trigger.addEventListener('click', fire); }
  host.addEventListener('click', fire);
  w.draw = (t) => {
    const { R } = painter(w.ctx), L = w.lw; w.ctx.clearRect(0, 0, L, LH);
    ground(R, L, GY, LH - GY, 11);
    // fade al negro del footer
    for (let j = 0; j < 5; j++){ w.ctx.globalAlpha = (j + 1) / 6; R(0, LH - 5 + j, L, 1, C.black); } w.ctx.globalAlpha = 1;
    const dx = Math.round(L * .14), hx = Math.round(L * .5), hole = Math.round(L * .84);
    // robot trabajando en la laptop
    desk(R, dx - 2, GY, 30);
    R(dx + 6, GY - 22, 16, 11, C.screen); R(dx + 7, GY - 21, 14, 9, C.off); R(dx + 8, GY - 20, 5, 3, C.olive);
    for (let i = 0; i < 4; i++){ const h = 1 + ((i * 3 + Math.floor(t * 2)) % 4); R(dx + 14 + i * 2, GY - 13 - h, 1, h, C.grey); }
    R(dx + 4, GY - 11, 20, 1, C.ink);
    const st = shot >= 0 ? t - shot : 99;
    const sunk = st > 1.25 && st < 3.2;
    robot(R, dx - 6, GY, { t, pose: sunk ? 'cheer' : 'type' });
    // banderín y hoyo
    R(hole, GY - 1, 5, 2, C.black); R(hole + 2, GY - 26, 1, 25, C.white);
    const wv = Math.round(Math.sin(t * 6)); R(hole + 3, GY - 26, 9, 5 + wv, C.lime); R(hole + 3, GY - 21 + wv, 7, 1, C.limeD);
    // ella
    let arm;
    if (st < 1.25){ const k = Math.min(1, st / .35); arm = k < .6 ? -2.4 + k * .5 : -2.1 + (k - .6) / .4 * 3.1; }
    else { const k = (t % 4) / 4; arm = k < .5 ? 1.2 - Math.sin(k * Math.PI * 2) * .6 : 1.2; }   // balanceo de práctica
    person(R, hx, GY, { t, pose: 'swing', arm, cap: C.lime, shirt: C.white });
    // pelota
    if (st < 1.25){
      const p = Math.max(0, (st - .3) / .95); const bx = hx + 12 + (hole + 2 - hx - 12) * p; const by = GY - 2 - Math.sin(p * Math.PI) * 22;
      R(bx, by, 2, 2, C.white);
    } else if (!sunk) R(hx + 12, GY - 2, 2, 2, C.white);
    if (sunk){ const k = st - 1.25; for (let i = 0; i < 12; i++){ const a = i / 12 * Math.PI * 2, d = 3 + k * 20; if (k < 1.4) R(hole + 2 + Math.cos(a) * d, GY - 6 + Math.sin(a) * d + k * k * 6, 2, 2, [C.lime, C.white, C.red, '#FFE89A'][i % 4]); } }
  };
}

// ── 3. Cómo trabajo ─────────────────────────────────────────────────────────
const PROC = [
  // 01 Descubrir: el robot recorre datos con la lupa, ella decide (✓)
  (R, t) => {
    const GY = 30, dots = [8, 16, 24, 32, 40, 48];
    const lx = 6 + ((t * 14) % 52);
    dots.forEach((x, i) => { const lit = Math.abs(lx + 6 - x) < 4 || (i % 2 === 0 && lx > x + 6); R(x, 6 + (i % 3) * 3, 3, 3, lit ? C.lime : '#3a3a3a'); });
    robot(R, lx - 6, GY, { t, pose: 'lens' });
    R(0, GY, 64, 1, '#3a3a3a');
  },
  // 02 Prototipar: ella y el robot arman bloques
  (R, t) => {
    const GY = 30, cyc = t % 5, n = Math.min(4, Math.floor(cyc / .9));
    const cols = [C.lime, C.olive, C.white, C.limeD];
    for (let i = 0; i < n; i++) R(28, GY - 6 - i * 6, 8, 6, cols[i]), R(28, GY - 6 - i * 6, 8, 1, 'rgba(255,255,255,.35)');
    const carrying = cyc % .9 < .6 && n < 4;
    person(R, 16, GY, { t, pose: carrying ? 'work' : 'stand', shirt: C.lime, pants: C.olive });
    robot(R, 44, GY, { t, pose: 'carry', flip: true });
    if (carrying) R(36, GY - 11, 5, 5, cols[n]);
    R(0, GY, 64, 1, '#3a3a3a');
  },
  // 03 Construir y medir: barras que crecen y barra de progreso
  (R, t) => {
    const GY = 30, k = Math.min(1, (t % 5) / 3.5);
    const hs = [6, 9, 8, 13, 17];
    hs.forEach((h, i) => { const hh = Math.round(h * Math.min(1, Math.max(0, k * 1.6 - i * .15))); R(26 + i * 6, GY - 4 - hh, 4, hh, i === 4 ? C.lime : C.grey); });
    R(4, GY + 3, 56, 4, '#3a3a3a'); R(5, GY + 4, Math.round(54 * k), 2, C.lime);
    person(R, 12, GY, { t, pose: k >= 1 ? 'wave' : 'stand', shirt: C.lime, pants: C.olive });
    R(0, GY, 64, 1, '#3a3a3a');
  }
];
function initProcess(step, i){
  const host = document.createElement('div'); host.className = 'px-proc';
  step.insertBefore(host, step.firstChild);
  const w = makeCanvas(host, 38, { lw: 64, s: 3 });
  w.draw = (t) => { const { R } = painter(w.ctx); w.ctx.clearRect(0, 0, 64, 38); PROC[i](R, t + i * .7); };
}

// ── 5. Franja de pasto antes del footer ─────────────────────────────────────
function initGrass(footer){
  const host = document.createElement('div'); host.className = 'px-grass';
  footer.parentNode.insertBefore(host, footer);
  const prev = host.previousElementSibling;
  const last = prev && prev.tagName === 'MAIN' ? prev.lastElementChild : prev;
  const bg = last ? getComputedStyle(last).backgroundColor : '';
  if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') host.style.background = bg;
  const LH = 22, GY = 11;
  const w = makeCanvas(host, LH, { fit: 'width' });
  w.draw = (t) => {
    const { R } = painter(w.ctx), L = w.lw; w.ctx.clearRect(0, 0, L, LH);
    ground(R, L, GY, LH - GY, 5);
    for (let j = 0; j < 4; j++){ w.ctx.globalAlpha = (j + 1) / 4; R(0, LH - 4 + j, L, 1, C.black); } w.ctx.globalAlpha = 1;
    for (let x = 9; x < L; x += 37){ R(x, GY - 2, 1, 2, C.olive); R(x - 1, GY - 3, 3, 1, (x / 37 | 0) % 2 ? C.white : '#FFE89A'); }
    const span = L + 40, cx = RM ? L * .7 : ((t * 9) % span) - 20;     // el gato cruza
    cat(R, cx, GY, t, !RM);
  };
}

// ── 6. Íconos del marquee ───────────────────────────────────────────────────
function icon(grid, pal){
  const h = grid.length, wd = grid[0].length, c = document.createElement('canvas'); c.width = wd; c.height = h;
  const x = c.getContext('2d');
  grid.forEach((row, j) => [...row].forEach((ch, i) => { if (pal[ch]){ x.fillStyle = pal[ch]; x.fillRect(i, j, 1, 1); } }));
  return c.toDataURL();
}
const PAL = { o: C.olive, d: C.oliveD, l: C.lime, k: C.black, w: C.white, s: C.skin, h: C.hair, c: C.cat, g: C.grey, b: C.wood, r: C.red };
const ICONS = {
  plane: ['..........', '....k.....', '....kk....', 'k...kkk...', 'kk.kkkkkkk', 'kkkkkkkkkk', 'k...kkk...', '....kk....', '....k.....', '..........'],
  laptop:['..........', '.kkkkkkkk.', '.kwwwwwwk.', '.kwolwwwk.', '.kwwwlwwk.', '.kwlwwwlk.', '.kkkkkkkk.', 'kkkkkkkkkk', '..........', '..........'],
  cat:   ['..........', '......c..c', '......cccc', '......ckcc', 'c.ccccccc.', '.cccccccc.', '.cccccccc.', '.c.c..c.c.', '..........', '..........'],
  block: ['llllllllll', 'lloollllol', 'olloollool', 'ddoddoddod', 'dddddddddd', 'ddbddddbdd', 'dddddddddd', 'ddddbddddd', 'dbdddddddd', 'dddddddddd'],
  pick:  ['..kkkkk...', '.kgggggk..', 'kgg...ggk.', 'kg..bb.gk.', '....bb....', '...bb.....', '...bb.....', '..bb......', '..bb......', '.bb.......']
};
function initMarquee(m){
  const urls = ['plane', 'laptop', 'cat', 'block'].map(k => icon(ICONS[k], PAL));
  urls.forEach((u, i) => m.style.setProperty('--px-i' + (i + 1), 'url("' + u + '")'));
  m.classList.add('px-on');
}

// ── 4. Cursor ───────────────────────────────────────────────────────────────
function initCursor(){
  const u = icon(ICONS.pick, { k: C.oliveD, g: C.olive, b: C.woodD });
  document.documentElement.style.setProperty('--px-cursor', 'url("' + u + '")');
  document.documentElement.classList.add('px-cursor-on');
}

// ── 7. Avatar junto a la foto ───────────────────────────────────────────────
function initAvatar(card){
  const host = document.createElement('div'); host.className = 'px-avatar';
  const bubble = document.createElement('span'); bubble.className = 'px-bubble'; host.appendChild(bubble);
  card.appendChild(host);
  let hover = false;
  const setText = () => { bubble.textContent = EN() ? 'Hi!' : '¡Hola!'; };
  setText(); document.addEventListener('langchange', setText);
  card.addEventListener('mouseenter', () => { hover = true; host.classList.add('on'); });
  card.addEventListener('mouseleave', () => { hover = false; host.classList.remove('on'); });
  const w = makeCanvas(host, 24, { lw: 20, s: 4 });
  w.draw = (t) => { const { R } = painter(w.ctx); w.ctx.clearRect(0, 0, 20, 24); R(0, 22, 20, 2, C.lime); R(0, 23, 20, 1, C.limeD); person(R, 8, 22, { t, pose: hover ? 'wave' : 'stand', shirt: C.lime, pants: C.olive }); };
}

// ── 8. 404 ──────────────────────────────────────────────────────────────────
function initLost(host){
  const LH = 60, GY = 46;
  const w = makeCanvas(host, LH, { fit: 'width' });
  w.draw = (t) => {
    const { R } = painter(w.ctx), L = w.lw, cx = Math.round(L / 2); w.ctx.clearRect(0, 0, L, LH);
    ground(R, L, GY, LH - GY, 7);
    for (let j = 0; j < 5; j++){ w.ctx.globalAlpha = (j + 1) / 6; R(0, LH - 5 + j, L, 1, C.black); } w.ctx.globalAlpha = 1;
    // carteles que apuntan a ningún lado
    R(cx - 40, GY - 22, 2, 22, C.woodD); R(cx - 50, GY - 22, 20, 5, C.wood); R(cx - 52, GY - 21, 2, 3, C.wood);
    R(cx - 31, GY - 15, 18, 5, C.wood); R(cx - 13, GY - 14, 2, 3, C.wood);
    R(cx - 48, GY - 20, 4, 1, C.woodD); R(cx - 29, GY - 13, 6, 1, C.woodD);
    // ella mira el mapa y se da vuelta
    const flip = Math.floor(t / 1.6) % 2 === 1;
    person(R, cx, GY, { t, pose: 'map', flip, shirt: C.lime });
    const b = Math.round(Math.sin(t * 4)); const qx = cx + (flip ? -6 : 4);
    R(qx, GY - 30 + b, 4, 1, C.olive); R(qx + 3, GY - 29 + b, 1, 2, C.olive); R(qx + 1, GY - 27 + b, 2, 1, C.olive); R(qx + 1, GY - 26 + b, 1, 1, C.olive); R(qx + 1, GY - 24 + b, 1, 1, C.olive);
    // el gato pasa como si nada
    cat(R, ((t * 7) % (L + 40)) - 20, GY, t, true);
  };
}

// ── 9. Barras XP en métricas ────────────────────────────────────────────────
function initXP(items){
  items.forEach((it, k) => {
    const bar = document.createElement('div'); bar.className = 'px-xp'; bar.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 10; i++){ const s = document.createElement('i'); s.style.transitionDelay = (k * .12 + i * .07) + 's'; bar.appendChild(s); }
    const num = it.querySelector('.metric-num'); num.parentNode.insertBefore(bar, num.nextSibling);
  });
  const grid = items[0].parentElement;
  if (RM || !('IntersectionObserver' in window)){ grid.classList.add('px-xp-on'); return; }
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting){ grid.classList.add('px-xp-on'); io.disconnect(); } }), { threshold: .4 });
  io.observe(grid);
}

// ── Bucle ───────────────────────────────────────────────────────────────────
let last = performance.now(), t0 = last;
function frame(now){
  const dt = Math.min(.05, (now - last) / 1000); last = now;
  const t = (now - t0) / 1000;
  widgets.forEach(w => { if (!w.vis) return; w.t = t; if (w.tick) w.tick(dt); if (w.draw) w.draw(RM ? 1.2 : t); });
  requestAnimationFrame(frame);
}
let rs; addEventListener('resize', () => { clearTimeout(rs); rs = setTimeout(() => widgets.forEach(w => w.size()), 150); });

// ── Arranque: detecta qué hay en la página ──────────────────────────────────
function boot(){
  // 1. Experiencia (home: teaser · experiencia.html: lista completa)
  const teaser = document.querySelectorAll('.exp-teaser-item');
  if (teaser.length){
    const host = document.createElement('div'); host.className = 'px-strip';
    const list = teaser[0].parentElement; list.parentNode.insertBefore(host, list);
    const map = { 'Goiar': 'laptop', 'Cooperación Seguros': 'umbrella', 'Mangoo Dev': 'monitor', 'NeuralSoft': 'easel' };
    initExp(host, [...teaser], [...teaser].map(r => map[(r.querySelector('.company') || {}).textContent] || 'monitor'), 'progress');
  }
  const full = document.querySelectorAll('.exp-list > .exp-item');
  if (full.length){
    const host = document.createElement('div'); host.className = 'px-strip px-sticky';
    const list = full[0].parentElement; list.parentNode.insertBefore(host, list);
    const kind = name => /Goiar/.test(name) ? 'laptop' : /Cooperaci/.test(name) ? 'umbrella' : /Mangoo/.test(name) ? 'monitor'
      : /ZRNI/.test(name) ? 'studio' : /NeuralSoft/.test(name) ? 'easel' : /Minist/.test(name) ? 'building' : 'pencil';
    initExp(host, [...full], [...full].map(r => kind((r.querySelector('.exp-company') || {}).textContent || '')), 'center');
  }
  // 2. Golf en "Hablemos" (solo home)
  const cta = document.querySelector('main .cta-banner#contact');
  const golfHere = cta && document.querySelector('.hero-section');
  if (golfHere){
    const host = document.createElement('div'); host.className = 'px-golf';
    cta.appendChild(host); cta.classList.add('px-has-golf');
    initGolf(host, cta.querySelector('.btn-primary'));
  }
  // 3. Cómo trabajo
  document.querySelectorAll('.process-steps .process-step').forEach((s, i) => { if (i < 3) initProcess(s, i); });
  // 4. Cursor
  if (document.getElementById('cursor')) initCursor();
  // 5. Pasto antes del footer (si no hay golf, que ya tiene su suelo)
  const footer = document.querySelector('body > footer');
  if (footer && !golfHere && !document.querySelector('[data-px-lost]')) initGrass(footer);
  // 6. Marquee
  const mq = document.querySelector('.marquee'); if (mq) initMarquee(mq);
  // 7. Avatar
  document.querySelectorAll('.portrait-card').forEach(initAvatar);
  // 8. 404
  const lost = document.querySelector('[data-px-lost]'); if (lost) initLost(lost);
  // 9. XP
  const mets = document.querySelectorAll('.metrics-grid .metric-item'); if (mets.length) initXP([...mets]);

  requestAnimationFrame(frame);
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
