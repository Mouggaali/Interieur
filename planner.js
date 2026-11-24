/* =========================================================
   Gegevens
   ========================================================= */
const LIB = [
  { cat: "Zitten", items: [["bank", "Bank 2,5-zits", 190, 90], ["bank", "Bank 3-zits", 220, 95], ["bank", "Bank met chaise", 260, 160], ["fauteuil", "Fauteuil", 80, 85], ["rond", "Poef", 50, 50]] },
  { cat: "Tafels", items: [["tafel", "Salontafel", 110, 60], ["rond", "Salontafel rond", 80, 80], ["tafel", "Eettafel 4 pers.", 140, 85], ["tafel", "Eettafel 6 pers.", 180, 90], ["rond", "Eettafel rond", 120, 120], ["stoel", "Eetstoel", 46, 52], ["rond", "Bijzettafel", 45, 45]] },
  { cat: "Opbergen", items: [["kast", "Tv-meubel", 180, 45], ["kast", "Dressoir", 160, 45], ["kast", "Boekenkast", 80, 35], ["kast", "Kast hoog", 100, 40], ["kast", "Kledingkast", 200, 60], ["kast", "Ladekast", 80, 45]] },
  { cat: "Slapen", items: [["bed", "Bed 140 × 200", 140, 200], ["bed", "Bed 160 × 200", 160, 200], ["bed", "Bed 180 × 200", 180, 200], ["kast", "Nachtkastje", 45, 40], ["bed", "Babybed", 66, 126], ["kast", "Commode", 90, 55]] },
  { cat: "Kind", items: [["box", "Box", 100, 100], ["kleed", "Speelmat", 120, 120], ["kast", "Speelgoedkast", 100, 35]] },
  { cat: "Keuken", items: [["kast", "Keukenblok (60 diep)", 240, 60], ["tafel", "Kookeiland", 180, 90], ["kast", "Koelkast", 60, 65], ["rond", "Barkruk", 40, 40]] },
  { cat: "Sfeer", items: [["kleed", "Vloerkleed 160 × 230", 230, 160], ["kleed", "Vloerkleed 200 × 290", 290, 200], ["plant", "Plant", 50, 50], ["kast", "Bureau", 120, 60]] },
  { cat: "Lampen", items: [
    ["lamp", "Hanglamp", 45, 45, { lamp: "hang", lumen: 1000, soort: "algemeen" }],
    ["lamp", "Plafondspot", 12, 12, { lamp: "spot", lumen: 400, soort: "algemeen" }],
    ["lamp", "Vloerlamp", 40, 40, { lamp: "vloer", lumen: 1500, soort: "algemeen" }],
    ["lamp", "Leeslamp", 35, 35, { lamp: "lees", lumen: 600, soort: "werk" }],
    ["lamp", "Tafellamp", 25, 25, { lamp: "tafel", lumen: 350, soort: "sfeer" }],
    ["lamp", "Wandlamp", 20, 12, { lamp: "wand", lumen: 400, soort: "sfeer" }],
    ["lamp", "Ledstrip (1 m)", 100, 4, { lamp: "strip", lumen: 500, soort: "werk" }]] }
];
/* Lampen: hoogte van de lichtbron in cm, en of ze op de vloer staan (obstakel). */
const LAMP = {
  hang: { naam: "Hanglamp", h: 190, vloer: false }, spot: { naam: "Plafondspot", h: 255, vloer: false },
  vloer: { naam: "Vloerlamp", h: 165, vloer: true }, lees: { naam: "Leeslamp", h: 135, vloer: true },
  tafel: { naam: "Tafellamp", h: 110, vloer: false }, wand: { naam: "Wandlamp", h: 180, vloer: false }, strip: { naam: "Ledstrip", h: 140, vloer: false }
};
const SOORT = { algemeen: ["Algemeen licht", "#F2C14E"], sfeer: ["Sfeerlicht", "#E8875A"], werk: ["Werklicht", "#7FB7E6"] };
/* Lumen per m² als grove richtwaarde (schatting) per kamer. */
const LUMEN_M2 = { woonkamer: 150, slaapkamer: 100, keuken: 250 };
/* Standaardhoogtes in cm (gangbare maten, schatting). */
const H_NAAM = { "Tv-meubel": 50, "Dressoir": 80, "Boekenkast": 180, "Kast hoog": 200, "Kledingkast": 220, "Ladekast": 90, "Nachtkastje": 50, "Commode": 90,
  "Speelgoedkast": 60, "Keukenblok (60 diep)": 90, "Koelkast": 180, "Bureau": 75, "Poef": 45, "Salontafel rond": 45, "Eettafel rond": 75, "Bijzettafel": 50, "Barkruk": 75, "Kookeiland": 90, "Babybed": 90 };
const H_TYPE = { bank: 85, fauteuil: 85, tafel: 75, stoel: 85, bed: 50, box: 75, kleed: 1, plant: 120, kast: 80, rond: 45 };
function defaultH(it) {
  if (it.type === "lamp") return LAMP[it.lamp]?.h ?? 150;
  if (H_NAAM[it.naam] != null) return H_NAAM[it.naam];
  if (it.type === "tafel" && /salontafel/i.test(it.naam)) return 45;
  return H_TYPE[it.type] ?? 80;
}
const itemH = it => Number(it.h) || defaultH(it);
const isObstacle = it => !SOFT.has(it.type) && !(it.type === "lamp" && !LAMP[it.lamp]?.vloer);
const WOBJ = {
  schilderij: { naam: "Schilderij", b: 60, h: 80, z: 110 }, spiegel: { naam: "Spiegel", b: 50, h: 120, z: 90 }, plank: { naam: "Wandplank", b: 100, h: 4, z: 150 },
  wandkast: { naam: "Wandkast", b: 80, h: 60, z: 140 }, gordijn: { naam: "Gordijn", b: 200, h: 250, z: 0 }, tv: { naam: "Tv aan muur", b: 123, h: 71, z: 100 }, wandlamp: { naam: "Wandlamp", b: 20, h: 25, z: 170 }
};
const ROOMS = [{ id: "woonkamer", label: "Woonkamer" }, { id: "slaapkamer", label: "Slaapkamer" }, { id: "keuken", label: "Keuken" }];
const ROUND = new Set(["rond", "plant"]);
const SOFT = new Set(["kleed"]);
const VP = {
  radiator: { naam: "Radiator", wall: true, breedte: 100, diepte: 10 },
  stopcontact: { naam: "Stopcontact", wall: true, point: true },
  tv: { naam: "Tv / internet", wall: true, point: true },
  schuin: { naam: "Schuine wand", wall: true, breedte: 200, diepte: 100 },
  kolom: { naam: "Kolom / nis", wall: false, w: 30, d: 30 },
  lichtpunt: { naam: "Lichtpunt plafond", wall: false, point: true }
};
/* Voorlopig palet "warm & naturel"; wordt vervangen zodra het concept er is. */
const PALET = [
  ["Eiken", "#B8875A"], ["Licht eiken", "#D4B88E"], ["Walnoot", "#6B4A33"], ["Linnen", "#E4DCCB"], ["Zand", "#D6C09B"],
  ["Klei", "#B57A5C"], ["Olijf", "#7C7F4E"], ["Salie", "#A3B18A"], ["Steengrijs", "#8E8A82"], ["Gebroken wit", "#F1EEE6"], ["Antraciet", "#3A3A38"], ["Messing", "#B59A5B"]
];
const VLOER = [["Licht eiken", "#E2CFAE"], ["Eiken", "#C9A579"], ["Walnoot", "#7B5A41"], ["Grijs PVC", "#B4B2AB"], ["Beton", "#C4C0B6"], ["Wit", "#EEECE6"]];
const WINDDIR = ["", "Noord", "Noordoost", "Oost", "Zuidoost", "Zuid", "Zuidwest", "West", "Noordwest"];
const CONTEXT = "Bewoners: een stel met een kind van 0-3 jaar. Huurwoning: verven en boren mag, de vloer blijft. Stijl: warm en naturel (eiken, linnen, klei- en zandtinten). Totaalbudget voor woonkamer, slaapkamer en keuken samen: 7.500 tot 15.000 euro. Thuiswerken gebeurt in een aparte kamer.";
const SNAP = 5, ROUTE = 80;

/* =========================================================
   Toestand
   ========================================================= */
const rect = (L, B) => [[0, 0], [L, 0], [L, B], [0, B]];
const uid = () => Math.random().toString(36).slice(2, 9);
const fresh = () => ({ schema: 2, vorm: rect(500, 400), hoogte: 260, vloer: "", windrichting: "", openingen: [], vastePunten: [], wandObjecten: [], maten: [], onderlaag: null, varianten: [{ id: "a", naam: "Variant A", items: [] }], actief: "a", voorbeeld: true });
const state = {}; ROOMS.forEach(r => state[r.id] = fresh());
let huis = { budgetMin: 7500, budgetMax: 15000 };
let cur = "woonkamer", sel = null, mode = "in", panel = "auto", comparing = false;
let db = null, sample = null, downloads = null, readOnly = false;
const dirty = {}, timers = {}, chains = {}, lastLocal = {}, hist = {}, views = {};
let dragging = null, adviceCtl = null, adviceLive = null;
let measuring = false, tempMeasure = null, elev = null, view3d = 0, assets = null;
let trace = { tool: null, pts: [], hover: null, cal: null };
const onderlaagUrl = {};

const snap = v => Math.round(v / SNAP) * SNAP;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const R = () => state[cur];
const V = (room = R()) => room.varianten.find(v => v.id === room.actief) || room.varianten[0];
const euro = n => "€ " + Math.round(n || 0).toLocaleString("nl-NL");
const wallName = i => String.fromCharCode(65 + (i % 26));

function migrate(d) {
  if (d.schema === 2) {
    const r = { ...fresh(), voorbeeld: false, ...d };
    if (!r.varianten || !r.varianten.length) r.varianten = [{ id: "a", naam: "Variant A", items: [] }];
    if (!r.varianten.some(v => v.id === r.actief)) r.actief = r.varianten[0].id;
    return r;
  }
  /* schema 1: rechthoek lengte × breedte, muren A-D, items direct op de kamer */
  const L = d.lengte || 500, B = d.breedte || 400;
  const conv = { A: [0, p => p], B: [1, p => p], C: [2, (p, w) => L - p - w], D: [3, (p, w) => B - p - w] };
  return {
    ...fresh(), vorm: rect(L, B), hoogte: d.hoogte || 260, voorbeeld: !!d.voorbeeld,
    openingen: (d.openingen || []).map(o => { const c = conv[o.wand] || conv.A; return { ...o, wand: c[0], pos: Math.max(0, c[1](o.pos, o.breedte)) }; }),
    varianten: [{ id: "a", naam: "Variant A", items: (d.items || []).map(i => ({ ...i })) }], actief: "a"
  };
}

/* =========================================================
   Geometrie
   ========================================================= */
function signedArea(v) { let s = 0; for (let i = 0; i < v.length; i++) { const a = v[i], b = v[(i + 1) % v.length]; s += a[0] * b[1] - b[0] * a[1]; } return s / 2; }
function walls(room) {
  const v = room.vorm, n = v.length, sg = signedArea(v) >= 0 ? 1 : -1;
  return v.map((p, i) => {
    const q = v[(i + 1) % n]; const dx = q[0] - p[0], dy = q[1] - p[1]; const len = Math.hypot(dx, dy) || 1;
    const d = [dx / len, dy / len]; return { i, p, q, len, d, n: [-d[1] * sg, d[0] * sg] };
  });
}
function bbox(room) { const xs = room.vorm.map(p => p[0]), ys = room.vorm.map(p => p[1]); const x0 = Math.min(...xs), y0 = Math.min(...ys), x1 = Math.max(...xs), y1 = Math.max(...ys); return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0 }; }
function pointInPoly(pt, poly) {
  let ins = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if (((yi > pt[1]) !== (yj > pt[1])) && pt[0] < (xj - xi) * (pt[1] - yi) / (yj - yi) + xi) ins = !ins;
  }
  return ins;
}
const isRound = it => it.rond ?? ROUND.has(it.type);
function itemPoly(it) {
  const a = (it.rot || 0) * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
  const loc = isRound(it) ? Array.from({ length: 16 }, (_, k) => [Math.cos(k * Math.PI / 8) * it.w / 2, Math.sin(k * Math.PI / 8) * it.d / 2])
    : [[-it.w / 2, -it.d / 2], [it.w / 2, -it.d / 2], [it.w / 2, it.d / 2], [-it.w / 2, it.d / 2]];
  return loc.map(([x, y]) => [it.cx + x * c - y * s, it.cy + x * s + y * c]);
}
function aabb(poly) { const xs = poly.map(p => p[0]), ys = poly.map(p => p[1]); return { x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) }; }
function sat(A, B) {
  for (const P of [A, B]) for (let i = 0; i < P.length; i++) {
    const a = P[i], b = P[(i + 1) % P.length]; const nx = -(b[1] - a[1]), ny = b[0] - a[0];
    let amin = Infinity, amax = -Infinity, bmin = Infinity, bmax = -Infinity;
    A.forEach(p => { const v = p[0] * nx + p[1] * ny; amin = Math.min(amin, v); amax = Math.max(amax, v); });
    B.forEach(p => { const v = p[0] * nx + p[1] * ny; bmin = Math.min(bmin, v); bmax = Math.max(bmax, v); });
    const len = Math.hypot(nx, ny) || 1;
    if ((amax - bmin) / len < 0.5 || (bmax - amin) / len < 0.5) return false;
  }
  return true;
}
const add = (a, b, k = 1) => [a[0] + b[0] * k, a[1] + b[1] * k];
function segDist(p, a, b) {
  const vx = b[0] - a[0], vy = b[1] - a[1], l2 = vx * vx + vy * vy || 1;
  const t = clamp(((p[0] - a[0]) * vx + (p[1] - a[1]) * vy) / l2, 0, 1);
  return { d: Math.hypot(p[0] - a[0] - vx * t, p[1] - a[1] - vy * t), t: t * Math.sqrt(l2) };
}
function nearestWall(room, p) {
  let best = null; walls(room).forEach(w => { const s = segDist(p, w.p, w.q); if (!best || s.d < best.d) best = { i: w.i, t: s.t, d: s.d }; }); return best;
}
function fixWand(room, o) { const n = room.vorm.length; if (!(o.wand >= 0 && o.wand < n)) o.wand = 0; }
function opGeom(room, op) {
  fixWand(room, op); const w = walls(room)[op.wand];
  const p0 = add(w.p, w.d, op.pos), p1 = add(p0, w.d, op.breedte); return { w, p0, p1 };
}
function doorPoly(room, op) { const { w, p0, p1 } = opGeom(room, op); return [p0, p1, add(p1, w.n, op.breedte), add(p0, w.n, op.breedte)]; }
function vpGeom(room, vp) {
  const def = VP[vp.type];
  if (!def.wall) return null;
  fixWand(room, vp); const w = walls(room)[vp.wand];
  if (def.point) { const p0 = add(w.p, w.d, vp.pos); return { w, p0, p1: p0 }; }
  const p0 = add(w.p, w.d, vp.pos), p1 = add(p0, w.d, vp.breedte); return { w, p0, p1 };
}
function vpPoly(room, vp) {
  if (vp.type === "kolom") return [[vp.x - vp.w / 2, vp.y - vp.d / 2], [vp.x + vp.w / 2, vp.y - vp.d / 2], [vp.x + vp.w / 2, vp.y + vp.d / 2], [vp.x - vp.w / 2, vp.y + vp.d / 2]];
  const g = vpGeom(room, vp); if (!g || VP[vp.type].point) return null;
  return [g.p0, g.p1, add(g.p1, g.w.n, vp.diepte), add(g.p0, g.w.n, vp.diepte)];
}
function clampOnWall(room, o, width) {
  fixWand(room, o); const len = walls(room)[o.wand].len;
  o.pos = clamp(o.pos, 0, Math.max(0, len - (width || 0)));
}
function clampAll(room) {
  room.openingen.forEach(o => { fixWand(room, o); o.breedte = Math.min(o.breedte, walls(room)[o.wand].len); clampOnWall(room, o, o.breedte); });
  room.vastePunten.forEach(v => { if (VP[v.type].wall) { fixWand(room, v); if (v.breedte) v.breedte = Math.min(v.breedte, walls(room)[v.wand].len); clampOnWall(room, v, VP[v.type].point ? 0 : v.breedte); } });
}

function problems(room = R(), variant = V(room)) {
  const out = [], bad = new Set();
  const items = variant.items.map(it => ({ it, poly: itemPoly(it) }));
  const solid = items.filter(x => isObstacle(x.it));
  for (let i = 0; i < solid.length; i++) for (let j = i + 1; j < solid.length; j++)
    if (sat(solid[i].poly, solid[j].poly)) { bad.add(solid[i].it.id); bad.add(solid[j].it.id); out.push(`${solid[i].it.naam} en ${solid[j].it.naam} overlappen.`); }
  room.openingen.filter(o => o.type === "deur").forEach(o => { const dp = doorPoly(room, o); solid.forEach(x => { if (sat(x.poly, dp)) { bad.add(x.it.id); out.push(`${x.it.naam} staat in de draaicirkel van de deur.`); } }); });
  room.vastePunten.forEach(v => {
    if (v.type === "radiator") {
      const g = vpGeom(room, v); const zone = [g.p0, g.p1, add(g.p1, g.w.n, 40), add(g.p0, g.w.n, 40)];
      solid.forEach(x => { if (sat(x.poly, zone)) { bad.add(x.it.id); out.push(`${x.it.naam} staat voor de radiator; dat kost warmte.`); } });
    }
    if (v.type === "kolom") { const kp = vpPoly(room, v); solid.forEach(x => { if (sat(x.poly, kp)) { bad.add(x.it.id); out.push(`${x.it.naam} overlapt met ${v.naam || "de kolom"}.`); } }); }
  });
  items.forEach(x => {
    const c = [x.it.cx, x.it.cy];
    const outside = x.poly.some(p => !pointInPoly(add(p, [c[0] - p[0], c[1] - p[1]], 0.02), room.vorm));
    if (outside) { bad.add(x.it.id); out.push(`${x.it.naam} steekt buiten de kamer.`); }
  });
  return { out: [...new Set(out)], bad };
}
function clearances(room, variant, it) {
  const f = aabb(itemPoly(it)); const mx = (f.x0 + f.x1) / 2, my = (f.y0 + f.y1) / 2;
  const obs = variant.items.filter(o => o.id !== it.id && isObstacle(o)).map(o => aabb(itemPoly(o)));
  room.vastePunten.filter(v => v.type === "kolom").forEach(v => obs.push(aabb(vpPoly(room, v))));
  const W = walls(room); const res = [];
  const vert = W.filter(w => Math.abs(w.d[0]) < 0.01), hor = W.filter(w => Math.abs(w.d[1]) < 0.01);
  const inY = w => my >= Math.min(w.p[1], w.q[1]) && my <= Math.max(w.p[1], w.q[1]);
  const inX = w => mx >= Math.min(w.p[0], w.q[0]) && mx <= Math.max(w.p[0], w.q[0]);
  let e = -Infinity; vert.forEach(w => { if (inY(w) && w.p[0] <= f.x0 + 0.5) e = Math.max(e, w.p[0]); }); obs.forEach(o => { if (o.y0 < f.y1 && o.y1 > f.y0 && o.x1 <= f.x0 + 0.5) e = Math.max(e, o.x1); });
  if (e > -Infinity) res.push({ a: [e, my], b: [f.x0, my], v: f.x0 - e });
  e = Infinity; vert.forEach(w => { if (inY(w) && w.p[0] >= f.x1 - 0.5) e = Math.min(e, w.p[0]); }); obs.forEach(o => { if (o.y0 < f.y1 && o.y1 > f.y0 && o.x0 >= f.x1 - 0.5) e = Math.min(e, o.x0); });
  if (e < Infinity) res.push({ a: [f.x1, my], b: [e, my], v: e - f.x1 });
  e = -Infinity; hor.forEach(w => { if (inX(w) && w.p[1] <= f.y0 + 0.5) e = Math.max(e, w.p[1]); }); obs.forEach(o => { if (o.x0 < f.x1 && o.x1 > f.x0 && o.y1 <= f.y0 + 0.5) e = Math.max(e, o.y1); });
  if (e > -Infinity) res.push({ a: [mx, e], b: [mx, f.y0], v: f.y0 - e });
  e = Infinity; hor.forEach(w => { if (inX(w) && w.p[1] >= f.y1 - 0.5) e = Math.min(e, w.p[1]); }); obs.forEach(o => { if (o.x0 < f.x1 && o.x1 > f.x0 && o.y0 >= f.y1 - 0.5) e = Math.min(e, o.y0); });
  if (e < Infinity) res.push({ a: [mx, f.y1], b: [mx, e], v: e - f.y1 });
  return res.filter(c => c.v > 0.5);
}
const areaM2 = room => Math.abs(signedArea(room.vorm)) / 10000;
const variantPrice = v => v.items.reduce((s, i) => s + (i.prioriteit === "heb ik" ? 0 : Number(i.prijs) || 0), 0);

/* =========================================================
   Opslaan en geschiedenis
   ========================================================= */
function setStatus(t, bad) { document.getElementById("status-text").textContent = t; document.getElementById("status").classList.toggle("bad", !!bad); }
function resetHist(id) { hist[id] = { s: [JSON.stringify(state[id])], i: 0 }; updUndo(); }
function commit() {
  const h = hist[cur] || (hist[cur] = { s: [], i: -1 }); const s = JSON.stringify(R());
  if (h.s[h.i] === s) return;
  h.s = h.s.slice(0, h.i + 1); h.s.push(s); if (h.s.length > 60) h.s.shift(); h.i = h.s.length - 1; updUndo();
}
function updUndo() { const h = hist[cur]; document.getElementById("undo").disabled = !h || h.i <= 0; document.getElementById("redo").disabled = !h || h.i >= h.s.length - 1; }
function restore(step) {
  const h = hist[cur]; if (!h) return; const ni = h.i + step; if (ni < 0 || ni >= h.s.length) return;
  h.i = ni; state[cur] = JSON.parse(h.s[ni]);
  if (sel && !findSel()) sel = null;
  updUndo(); draw(); persist(cur);
}
function save() { commit(); persist(cur); }
function persist(id) {
  if (readOnly) return;
  if (!db) { setStatus("Opslaan werkt hier niet. Open de pagina op claude.ai.", true); return; }
  dirty[id] = (dirty[id] || 0) + 1; setStatus("Wijzigingen…");
  clearTimeout(timers[id]); timers[id] = setTimeout(() => flush(id), 600);
}
function flush(id) {
  if (dragging) { timers[id] = setTimeout(() => flush(id), 400); return; }
  const mark = dirty[id]; const body = JSON.parse(JSON.stringify(state[id])); body.bijgewerkt = new Date().toISOString(); lastLocal[id] = body.bijgewerkt;
  chains[id] = (chains[id] || Promise.resolve()).then(async () => {
    try {
      await db.doc("plattegrond/" + id).set(body);
      if (dirty[id] === mark) dirty[id] = 0;
      if (!Object.values(dirty).some(Boolean)) setStatus("Opgeslagen");
    } catch (e) {
      if (e && e.code === "invalid_argument") { readOnly = true; setStatus("Je kunt deze plattegrond alleen bekijken.", true); }
      else if (e && e.code === "quota_exceeded") setStatus("De opslag is vol. Verwijder oude varianten.", true);
      else setStatus("Opslaan lukte niet. Je volgende wijziging probeert het opnieuw.", true);
    }
  });
}
let huisTimer = null;
function saveHuis() {
  if (!db || readOnly) return; clearTimeout(huisTimer);
  huisTimer = setTimeout(() => db.doc("plattegrond/huis").set({ ...huis, bijgewerkt: new Date().toISOString() }).catch(() => setStatus("Budget opslaan lukte niet.", true)), 500);
}

/* =========================================================
   Tekenen
   ========================================================= */
const NS = "http://www.w3.org/2000/svg";
const S = (tag, a = {}, txt) => { const n = document.createElementNS(NS, tag); for (const k in a) n.setAttribute(k, a[k]); if (txt != null) n.textContent = txt; return n; };
const svg = document.getElementById("svg");
const layer = S("g", { "pointer-events": "none" });
const hitRect = S("rect", { fill: "transparent", "pointer-events": "all" });
svg.append(layer, hitRect);
let WALL = 10;

function lum(hex) { const m = /^#?([0-9a-f]{6})$/i.exec(hex || ""); if (!m) return 1; const n = parseInt(m[1], 16); return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255; }
const ptsAttr = poly => poly.map(p => p.join(",")).join(" ");

/* render tekent een kamer + variant in een <g>; hergebruikt voor de editor, de vergelijking en de PNG. */
function render(g, room, variant, o = {}) {
  const bb = bbox(room); const M = Math.max(bb.w, bb.h);
  const wall = Math.max(10, M / 60), fs = o.fs || clamp(M / 48, 8, 22); const px = o.px || 1;
  const key = o.key || "m";
  g.replaceChildren();
  const poly = ptsAttr(room.vorm);
  const defs = S("defs"); const clip = S("clipPath", { id: "clip-" + key }); clip.append(S("polygon", { points: poly })); defs.append(clip); g.append(defs);
  const ond = room.onderlaag, ondUrl = ond && (onderlaagUrl[cur === o.roomId ? cur : o.roomId || cur] || (ond.asset ? "/_blob/" + ond.asset : null));
  const showOnd = ond && ond.zichtbaar !== false && ondUrl && o.onderlaag !== false;
  if (showOnd) g.append(S("image", { href: ondUrl, x: ond.x, y: ond.y, width: ond.pw * ond.cmPerPx, height: ond.ph * ond.cmPerPx, opacity: ond.doorzicht ?? 0.6, preserveAspectRatio: "none" }));
  g.append(S("polygon", { points: poly, fill: room.vloer || "var(--floor)", "fill-opacity": showOnd ? 0.25 : 1 }));
  const grid = S("g", { stroke: room.vloer && lum(room.vloer) < 0.5 ? "rgba(255,255,255,0.18)" : "var(--grid)", "clip-path": `url(#clip-${key})` });
  for (let x = Math.ceil(bb.x0 / 50) * 50; x < bb.x1; x += 50) grid.append(S("line", { x1: x, y1: bb.y0, x2: x, y2: bb.y1, "stroke-width": x % 100 ? 0.8 : 1.6 }));
  for (let y = Math.ceil(bb.y0 / 50) * 50; y < bb.y1; y += 50) grid.append(S("line", { x1: bb.x0, y1: y, x2: bb.x1, y2: y, "stroke-width": y % 100 ? 0.8 : 1.6 }));
  g.append(grid);
  const mono = { "font-family": "JetBrains Mono, Consolas, monospace", "font-size": fs, fill: "var(--muted)", "text-anchor": "middle", "dominant-baseline": "middle" };
  const W = walls(room);

  /* vaste punten onder de meubels */
  room.vastePunten.forEach(v => {
    const selected = sel && sel.kind === "vp" && sel.id === v.id && o.interactive;
    const sw = selected ? fs * 0.25 : fs * 0.08;
    if (v.type === "radiator") { const p = vpPoly(room, v); g.append(S("polygon", { points: ptsAttr(p), fill: "var(--rad)", stroke: selected ? "var(--accent)" : "none", "stroke-width": sw })); }
    else if (v.type === "schuin") {
      const p = vpPoly(room, v); const id = "hatch-" + key + v.id;
      const pat = S("pattern", { id, width: 16, height: 16, patternUnits: "userSpaceOnUse", patternTransform: "rotate(45)" }); pat.append(S("line", { x1: 0, y1: 0, x2: 0, y2: 16, stroke: "var(--muted)", "stroke-width": 2, opacity: 0.5 })); defs.append(pat);
      g.append(S("polygon", { points: ptsAttr(p), fill: `url(#${id})`, stroke: selected ? "var(--accent)" : "var(--muted)", "stroke-width": sw, "stroke-dasharray": `${fs * 0.4} ${fs * 0.3}` }));
      if (o.labels !== false) { const c = aabb(p); g.append(S("text", { ...mono, x: (c.x0 + c.x1) / 2, y: (c.y0 + c.y1) / 2, "font-size": fs * 0.75 }, `schuin${v.hoogte ? " · " + v.hoogte + " cm" : ""}`)); }
    } else if (v.type === "kolom") { g.append(S("polygon", { points: ptsAttr(vpPoly(room, v)), fill: "var(--fg)", opacity: 0.8, stroke: selected ? "var(--accent)" : "none", "stroke-width": sw * 2 })); }
    else if (v.type === "lichtpunt") {
      const r = fs * 0.6; const gg = S("g", { stroke: selected ? "var(--accent)" : "var(--fg)", "stroke-width": fs * 0.12, fill: "none" });
      gg.append(S("circle", { cx: v.x, cy: v.y, r })); gg.append(S("line", { x1: v.x - r * 0.7, y1: v.y - r * 0.7, x2: v.x + r * 0.7, y2: v.y + r * 0.7 })); gg.append(S("line", { x1: v.x - r * 0.7, y1: v.y + r * 0.7, x2: v.x + r * 0.7, y2: v.y - r * 0.7 }));
      g.append(gg);
    } else {
      const gm = vpGeom(room, v); const c = add(gm.p0, gm.w.n, wall * 1.6); const r = fs * 0.36 * (selected ? 1.5 : 1);
      g.append(v.type === "tv" ? S("rect", { x: c[0] - r, y: c[1] - r, width: r * 2, height: r * 2, fill: selected ? "var(--accent)" : "var(--fg)" }) : S("circle", { cx: c[0], cy: c[1], r, fill: selected ? "var(--accent)" : "var(--fg)" }));
    }
  });

  const { bad } = problems(room, variant);
  const items = [...variant.items].sort((a, b) => (SOFT.has(b.type) - SOFT.has(a.type)) || ((a.type === "lamp") - (b.type === "lamp")));
  items.forEach(it => g.append(drawItem(it, fs, bad.has(it.id) && o.interactive !== false, o.interactive && sel && sel.kind === "item" && sel.id === it.id, o.labels !== false)));

  if (o.light) drawLight(g, room, variant, key, fs);
  g.append(S("polygon", { points: poly, fill: "none", stroke: "var(--fg)", "stroke-width": wall, "stroke-linejoin": "miter" }));
  room.openingen.forEach(op => g.append(drawOpening(room, op, wall, fs, o.interactive && sel && sel.kind === "op" && sel.id === op.id)));

  if (o.labels !== false) W.forEach(w => {
    const m = add(add(w.p, w.d, w.len / 2), w.n, -(wall * 0.5 + fs * 1.1)); const vertical = Math.abs(w.d[0]) < 0.5;
    const t = (mode === "vorm" && o.interactive ? wallName(w.i) + " · " : "") + Math.round(w.len);
    g.append(S("text", { ...mono, x: m[0], y: m[1], transform: vertical ? `rotate(-90 ${m[0]} ${m[1]})` : "" }, t));
  });

  if (o.labels !== false) drawMaten(g, room, o, px, fs);
  if (o.interactive) drawTrace(g, px);
  if (o.interactive) {
    if (mode === "vorm" && sel && sel.kind === "wall") {
      const w = W[sel.i]; if (w) g.append(S("line", { x1: w.p[0], y1: w.p[1], x2: w.q[0], y2: w.q[1], stroke: "var(--accent)", "stroke-width": wall * 1.3, "stroke-linecap": "round", opacity: 0.8 }));
    }
    if (mode === "vorm") W.forEach(w => { const m = add(w.p, w.d, w.len / 2); g.append(S("rect", { x: m[0] - 7 * px, y: m[1] - 7 * px, width: 14 * px, height: 14 * px, rx: 3 * px, fill: "var(--handle)", stroke: "var(--accent)", "stroke-width": 2 * px })); });
    if (sel && sel.kind === "item") {
      const it = variant.items.find(i => i.id === sel.id);
      if (it) {
        if (isObstacle(it)) clearances(room, variant, it).forEach(c => {
          const warn = c.v < ROUTE; const col = warn ? "var(--warn)" : "var(--accent)";
          g.append(S("line", { x1: c.a[0], y1: c.a[1], x2: c.b[0], y2: c.b[1], stroke: col, "stroke-width": 1.6 * px, "stroke-dasharray": `${5 * px} ${4 * px}` }));
          const mx = (c.a[0] + c.b[0]) / 2, my = (c.a[1] + c.b[1]) / 2; const t = `${Math.round(c.v)}`; const bw = (7.5 * t.length + 10) * px;
          g.append(S("rect", { x: mx - bw / 2, y: my - 9 * px, width: bw, height: 18 * px, rx: 4 * px, fill: "var(--surface)", stroke: col, "stroke-width": 1.2 * px }));
          g.append(S("text", { ...mono, x: mx, y: my, fill: col, "font-size": 12 * px }, t));
        });
        handles(it, px).forEach(hd => {
          if (hd.kind === "rot") {
            g.append(S("line", { x1: hd.from[0], y1: hd.from[1], x2: hd.p[0], y2: hd.p[1], stroke: "var(--accent)", "stroke-width": 1.5 * px }));
            g.append(S("circle", { cx: hd.p[0], cy: hd.p[1], r: 7 * px, fill: "var(--accent)", stroke: "var(--handle)", "stroke-width": 2 * px }));
          } else g.append(S("rect", { x: hd.p[0] - 6 * px, y: hd.p[1] - 6 * px, width: 12 * px, height: 12 * px, fill: "var(--handle)", stroke: "var(--accent)", "stroke-width": 2 * px }));
        });
      }
    }
  }
  return { fs, wall };
}

function drawItem(it, fs, isBad, selected, labels) {
  const g = S("g", { transform: `translate(${it.cx} ${it.cy}) rotate(${it.rot || 0})` });
  if (it.type === "lamp") return drawLamp(g, it, fs, isBad, selected);
  const w = it.w, d = it.d, x = -w / 2, y = -d / 2;
  const stroke = isBad ? "var(--warn)" : selected ? "var(--accent)" : "var(--fg)";
  const sw = selected || isBad ? fs * 0.22 : fs * 0.09;
  const fill = it.kleur || ({ bank: "var(--fabric)", fauteuil: "var(--fabric)", bed: "var(--surface)", box: "var(--surface)", kleed: "var(--rug)", plant: "var(--accent-soft)" }[it.type] || "var(--wood)");
  if (isRound(it)) {
    g.append(S("ellipse", { cx: 0, cy: 0, rx: w / 2, ry: d / 2, fill, stroke, "stroke-width": sw }));
    if (it.type === "plant") for (let a = 0; a < 6; a++) { const cx = Math.cos(a) * w * 0.18, cy = Math.sin(a) * d * 0.18; g.append(S("ellipse", { cx, cy, rx: w * 0.2, ry: d * 0.09, transform: `rotate(${a * 60} ${cx} ${cy})`, fill: "var(--accent)", opacity: 0.55 })); }
  } else {
    g.append(S("rect", { x, y, width: w, height: d, rx: it.type === "kleed" ? 0 : Math.min(6, w / 10), fill, stroke, "stroke-width": sw, "stroke-dasharray": it.type === "kleed" ? `${fs * 0.5} ${fs * 0.3}` : "none", opacity: it.type === "kleed" ? 0.85 : 1 }));
    const deco = S("g", { stroke: it.kleur && lum(it.kleur) < 0.45 ? "#FFFFFF" : "var(--fg)", "stroke-opacity": 0.35, "stroke-width": fs * 0.07, fill: "none" });
    if (it.type === "bank" || it.type === "fauteuil") {
      const back = Math.min(22, d * 0.25); deco.append(S("line", { x1: x, y1: y + back, x2: x + w, y2: y + back }));
      deco.append(S("line", { x1: x + 14, y1: y + back, x2: x + 14, y2: y + d })); deco.append(S("line", { x1: x + w - 14, y1: y + back, x2: x + w - 14, y2: y + d }));
      const seats = it.type === "fauteuil" ? 1 : Math.max(2, Math.round((w - 28) / 70));
      for (let k = 1; k < seats; k++) { const sx = x + 14 + (w - 28) * k / seats; deco.append(S("line", { x1: sx, y1: y + back, x2: sx, y2: y + Math.min(d, 95) })); }
    } else if (it.type === "bed") {
      const pw = w > 100 ? (w - 30) / 2 : w - 16; const ph = Math.min(40, d * 0.2);
      deco.append(S("rect", { x: x + 10, y: y + 10, width: pw, height: ph, rx: 6 }));
      if (w > 100) deco.append(S("rect", { x: x + 20 + pw, y: y + 10, width: pw, height: ph, rx: 6 }));
      deco.append(S("line", { x1: x, y1: y + d * 0.38, x2: x + w, y2: y + d * 0.38 }));
    } else if (it.type === "box") { for (let k = 1; k < 8; k++) deco.append(S("line", { x1: x + w * k / 8, y1: y, x2: x + w * k / 8, y2: y + d })); }
    else if (it.type === "stoel") deco.append(S("line", { x1: x, y1: y + d * 0.2, x2: x + w, y2: y + d * 0.2 }));
    else if (it.type === "kast") deco.append(S("line", { x1: x, y1: y + d * 0.82, x2: x + w, y2: y + d * 0.82 }));
    g.append(deco);
  }
  if (labels && Math.min(it.w, it.d) > fs * 2.4) {
    const ink = it.kleur ? (lum(it.kleur) < 0.5 ? "#FFFFFF" : "#22261F") : "var(--fg)";
    const lbl = S("g", { transform: `rotate(${-(it.rot || 0)})` });
    const ff = { "font-family": "Inter, Segoe UI, sans-serif", "text-anchor": "middle", "dominant-baseline": "middle", fill: ink };
    lbl.append(S("text", { ...ff, x: 0, y: -fs * 0.45, "font-size": fs * 0.85, "font-weight": 600 }, it.naam));
    lbl.append(S("text", { ...ff, x: 0, y: fs * 0.6, "font-size": fs * 0.72, "font-family": "JetBrains Mono, Consolas, monospace", opacity: 0.75 }, `${it.w}×${it.d}`));
    g.append(lbl);
  }
  return g;
}

function drawOpening(room, op, wall, fs, selected) {
  const { w, p0, p1 } = opGeom(room, op); const grp = S("g");
  if (op.type === "raam") {
    grp.append(S("line", { x1: p0[0], y1: p0[1], x2: p1[0], y2: p1[1], stroke: "var(--surface)", "stroke-width": wall * 1.05 }));
    grp.append(S("line", { x1: p0[0], y1: p0[1], x2: p1[0], y2: p1[1], stroke: selected ? "var(--accent)" : "var(--glass)", "stroke-width": wall * (selected ? 0.95 : 0.6) }));
  } else {
    grp.append(S("line", { x1: p0[0], y1: p0[1], x2: p1[0], y2: p1[1], stroke: room.vloer || "var(--floor)", "stroke-width": wall * 1.1 }));
    const hinge = op.draai === "R" ? p1 : p0, free = op.draai === "R" ? p0 : p1;
    const dir = [free[0] - hinge[0], free[1] - hinge[1]]; const r = op.breedte; const q = add(hinge, w.n, r);
    const sweep = (dir[0] * w.n[1] - dir[1] * w.n[0]) > 0 ? 1 : 0;
    grp.append(S("path", { d: `M${free[0]} ${free[1]} A${r} ${r} 0 0 ${sweep} ${q[0]} ${q[1]} L${hinge[0]} ${hinge[1]}`, fill: "var(--accent-soft)", "fill-opacity": 0.5, stroke: "var(--accent)", "stroke-width": selected ? fs * 0.25 : fs * 0.1 }));
  }
  return grp;
}

/* handgrepen van het geselecteerde meubel, in kamer-cm */
function handles(it, px) {
  const a = (it.rot || 0) * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
  const tw = ([x, y]) => [it.cx + x * c - y * s, it.cy + x * s + y * c];
  const out = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([sx, sy]) => ({ kind: "size", sx, sy, p: tw([sx * it.w / 2, sy * it.d / 2]) }));
  out.push({ kind: "rot", from: tw([0, -it.d / 2]), p: tw([0, -it.d / 2 - 28 * px]) });
  return out;
}

/* =========================================================
   Weergave (zoomen en schuiven)
   ========================================================= */
function aspect() { const r = svg.getBoundingClientRect(); return r.width && r.height ? r.width / r.height : 1.5; }
function fitView(id = cur) {
  const bb = bbox(state[id]); const pad = Math.max(60, Math.max(bb.w, bb.h) * 0.1);
  let w = bb.w + 2 * pad, h = bb.h + 2 * pad; const asp = aspect();
  if (w / h < asp) w = h * asp; else h = w / asp;
  views[id] = { x: bb.x0 + bb.w / 2 - w / 2, y: bb.y0 + bb.h / 2 - h / 2, w, h };
}
function applyView() {
  if (!views[cur]) fitView();
  const v = views[cur]; svg.setAttribute("viewBox", `${v.x} ${v.y} ${v.w} ${v.h}`);
  hitRect.setAttribute("x", v.x - v.w); hitRect.setAttribute("y", v.y - v.h); hitRect.setAttribute("width", v.w * 3); hitRect.setAttribute("height", v.h * 3);
}
function zoomAt(k, cx, cy) {
  const v = views[cur]; const bb = bbox(R()); const M = Math.max(bb.w, bb.h);
  const nw = clamp(v.w * k, M * 0.15, M * 6); k = nw / v.w;
  v.x = cx - (cx - v.x) * k; v.y = cy - (cy - v.y) * k; v.w *= k; v.h *= k; draw();
}
const pxUnit = () => { const r = svg.getBoundingClientRect(); return r.width ? views[cur].w / r.width : 1; };

/* =========================================================
   Hoofdtekening en panelen
   ========================================================= */
function draw() {
  if (mode === "3d") draw3d();
  else if (elev) drawElev();
  if (mode !== "3d" && !elev) { applyView(); const o = render(layer, R(), V(), { interactive: true, px: pxUnit(), key: "main", light: mode === "licht" }); WALL = o.wall; }
  updateBar(); renderVariants(); renderProps(); updUndo();
  if (comparing) renderCompare();
}
function updateBar() {
  const r = R(), bb = bbox(r), v = V();
  document.getElementById("dims").innerHTML = `Buitenmaat <b>${Math.round(bb.w)} × ${Math.round(bb.h)} cm</b> · hoogte <b>${r.hoogte || "?"} cm</b>`;
  const price = variantPrice(v);
  document.getElementById("area").innerHTML = `<b>${areaM2(r).toLocaleString("nl-NL", { maximumFractionDigits: 1 })} m²</b> · ${v.items.length} meubel${v.items.length === 1 ? "" : "s"}${price ? ` · <b>${euro(price)}</b>` : ""}`;
  document.getElementById("banner").hidden = !r.voorbeeld;
  document.getElementById("mode-in").setAttribute("aria-pressed", String(mode === "in"));
  document.getElementById("mode-vorm").setAttribute("aria-pressed", String(mode === "vorm"));
  document.getElementById("mode-licht").setAttribute("aria-pressed", String(mode === "licht"));
  document.getElementById("mode-3d").setAttribute("aria-pressed", String(mode === "3d"));
  document.getElementById("measure").setAttribute("aria-pressed", String(measuring));
  document.getElementById("measure").disabled = mode === "3d" || !!elev;
  ["zoom-in", "zoom-out", "zoom-fit"].forEach(id => document.getElementById(id).disabled = mode === "3d" || !!elev);
}
function h(tag, attrs = {}, ...kids) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) { if (k === "text") n.textContent = v; else if (k.startsWith("on")) n.addEventListener(k.slice(2), v); else if (v != null && v !== false) n.setAttribute(k, v === true ? "" : v); }
  kids.flat().forEach(c => c != null && c !== false && n.append(c)); return n;
}
function numField(id, label, value, onset, unit = "cm", min = 1) {
  const inp = h("input", { id, type: "number", min: String(min), inputmode: "decimal", value: value ?? "" });
  inp.addEventListener("change", () => { const v = Number(inp.value); if (inp.value !== "" && v >= min) onset(v); else inp.value = value ?? ""; });
  return h("div", { class: "field" }, h("label", { for: id, text: label }), h("div", { class: "unit" }, inp, h("span", { text: unit })));
}
function textField(id, label, value, onset, type = "text", ph) {
  const inp = h("input", { id, type, value: value || "", placeholder: ph });
  inp.addEventListener("change", () => onset(inp.value.trim())); return h("div", { class: "field" }, h("label", { for: id, text: label }), inp);
}
function selectField(id, label, value, options, onset) {
  const s = h("select", { id }, options.map(o => Array.isArray(o) ? h("option", { value: o[0], text: o[1] }) : h("option", { value: o, text: o || "Kies…" })));
  s.value = value ?? ""; s.addEventListener("change", () => onset(s.value)); return h("div", { class: "field" }, h("label", { for: id, text: label }), s);
}
function swatches(list, value, onset, allowNone) {
  const box = h("div", { class: "swatches" });
  if (allowNone) box.append(h("button", { class: "sw none", type: "button", title: "Standaard", "aria-label": "Standaard", "aria-pressed": String(!value), onclick: () => onset("") }));
  list.forEach(([n, c]) => box.append(h("button", { class: "sw", type: "button", title: n, "aria-label": n, "aria-pressed": String(value === c), style: `background:${c}`, onclick: () => onset(c) })));
  return box;
}
const props = document.getElementById("props");
const put = (...n) => props.append(...n.filter(x => x != null && x !== false));
function findSel() {
  if (!sel) return null; const r = R();
  if (sel.kind === "item") return V().items.find(i => i.id === sel.id);
  if (sel.kind === "op") return r.openingen.find(o => o.id === sel.id);
  if (sel.kind === "vp") return r.vastePunten.find(o => o.id === sel.id);
  if (sel.kind === "wall") return walls(r)[sel.i];
  if (sel.kind === "wobj") return (r.wandObjecten || []).find(o => o.id === sel.id);
  return null;
}
const done = () => h("button", { class: "btn", type: "button", text: "Klaar", onclick: () => { sel = null; draw(); } });

function renderProps() {
  const keep = document.activeElement && props.contains(document.activeElement) ? document.activeElement.id : null;
  props.replaceChildren();
  if (dragging && dragging.light) { props.append(h("p", { class: "hint", text: "Bezig met slepen…" })); return; }
  const r = R(), v = V(); const obj = findSel(); if (sel && !obj) sel = null;
  if (panel === "budget") renderBudget();
  else if (mode === "3d") render3dPanel();
  else if (elev) renderElevPanel();
  else if (measuring) renderMeasurePanel();
  else if (sel && sel.kind === "item") renderItemPanel(obj);
  else if (sel && sel.kind === "op") renderOpPanel(obj);
  else if (sel && sel.kind === "vp") renderVpPanel(obj);
  else if (sel && sel.kind === "wall") renderWallPanel(obj);
  else if (mode === "vorm") renderRoomPanel();
  else if (mode === "licht") renderLightPanel();
  else renderOverview();
  if (keep) document.getElementById(keep)?.focus();
}

function renderOverview() {
  const r = R(), v = V(); const { out } = problems();
  const nm = h("input", { id: "p-vnaam", type: "text", value: v.naam });
  nm.addEventListener("change", () => { v.naam = nm.value.trim() || v.naam; save(); draw(); });
  put(h("h2", { text: ROOMS.find(x => x.id === cur).label }),
    h("div", { class: "field" }, h("label", { for: "p-vnaam", text: "Naam van deze variant" }), nm),
    h("div", { class: "btns" },
      h("button", { class: "btn sm", type: "button", text: "Dupliceer variant", onclick: () => addVariant(true) }),
      R().varianten.length > 1 ? h("button", { class: "btn sm danger", type: "button", text: "Wis variant", onclick: removeVariant }) : null,
      h("button", { class: "btn sm", type: "button", text: "Budget en winkellijst", onclick: () => { panel = "budget"; draw(); } })),
    h("h3", { text: "Meubels" }),
    v.items.length ? h("div", { class: "list" }, v.items.map(i => h("button", { type: "button", onclick: () => { sel = { kind: "item", id: i.id }; draw(); } }, i.naam, h("span", { text: `${i.w}×${i.d}${i.prijs ? " · " + euro(i.prijs) : ""}` })))) : h("p", { class: "empty", text: "Sleep links een meubel naar de kamer." }),
    out.length ? h("h3", { text: "Let op" }) : null,
    out.length ? h("ul", { class: "warnlist" }, out.map(t => h("li", { text: t }))) : null,
    renderAdvice(),
    h("p", { class: "keys" }, "Sneltoetsen: ", h("kbd", { text: "Ctrl+Z" }), " ongedaan, ", h("kbd", { text: "R" }), " draaien, ", h("kbd", { text: "Del" }), " verwijderen, pijltjes schuiven, ", h("kbd", { text: "Esc" }), " loslaten."));
}

function renderItemPanel(it) {
  put(h("h2", { text: it.naam }),
    textField("p-naam", "Naam", it.naam, val => { it.naam = val || it.naam; save(); draw(); }),
    h("div", { class: "row" },
      numField("p-w", "Breedte", it.w, x => { it.w = x; fitInside(it); save(); draw(); }),
      numField("p-d", "Diepte", it.d, x => { it.d = x; fitInside(it); save(); draw(); })),
    h("div", { class: "row" },
      numField("p-h", it.type === "lamp" ? "Hoogte lichtbron" : "Hoogte", itemH(it), x => { it.h = x; save(); draw(); }),
      numField("p-rot", "Draaiing", Math.round(it.rot || 0), x => { it.rot = ((x % 360) + 360) % 360; fitInside(it); save(); draw(); }, "°", 0)),
    it.type === "lamp" ? null : selectField("p-vorm", "Vorm", isRound(it) ? "rond" : "recht", [["recht", "Rechthoek"], ["rond", "Rond / ovaal"]], x => { it.rond = x === "rond"; save(); draw(); }),
    it.type === "lamp" ? h("div", { class: "field" },
      h("h3", { text: "Licht" }),
      h("div", { class: "row" },
        selectField("p-soort", "Soort licht", it.soort || "algemeen", Object.entries(SOORT).map(([k, v]) => [k, v[0]]), x => { it.soort = x; save(); draw(); }),
        numField("p-lumen", "Lichtsterkte", it.lumen, x => { it.lumen = x; save(); draw(); }, "lm", 0)),
      h("div", { class: "row" },
        selectField("p-kelvin", "Kleur licht", String(it.kelvin || 2700), [["2200", "2200 K, extra warm"], ["2700", "2700 K, warm wit"], ["3000", "3000 K, wit"], ["4000", "4000 K, koel wit"]], x => { it.kelvin = Number(x); save(); }),
        selectField("p-dim", "Dimbaar", it.dimbaar ? "ja" : "nee", [["ja", "Ja"], ["nee", "Nee"]], x => { it.dimbaar = x === "ja"; save(); draw(); })),
      h("p", { class: "hint", text: "Lumen staat op de verpakking. De standaardwaarde is een schatting. Voor wonen is 2700 K (warm wit) meestal het prettigst." })) : null,
    h("div", { class: "btns" },
      h("button", { class: "btn sm", type: "button", text: "Draai 90°", onclick: () => rotate(it, 90) }),
      h("button", { class: "btn sm", type: "button", text: "Dupliceer", onclick: () => duplicate(it) }),
      h("button", { class: "btn sm danger", type: "button", text: "Verwijder", onclick: remove })),
    h("p", { class: "hint", text: "Trek aan de hoekjes om het formaat te veranderen, aan het rondje om te draaien (stappen van 15°, met Shift vrij)." }),
    h("h3", { text: "Kleur" }),
    swatches(PALET, it.kleur, c => { it.kleur = c; save(); draw(); }, true),
    h("h3", { text: "Aankoop" }),
    h("div", { class: "row" },
      numField("p-prijs", "Prijs", it.prijs, x => { it.prijs = x; save(); draw(); }, "€", 0),
      selectField("p-prio", "Wanneer", it.prioriteit || "", [["", "Kies…"], ["nu", "Nu"], ["later", "Later"], ["heb ik", "Heb ik al"]], x => { it.prioriteit = x; save(); draw(); })),
    textField("p-winkel", "Winkel of zoekterm", it.winkel, x => { it.winkel = x; save(); }),
    textField("p-link", "Link", it.link, x => { it.link = x; save(); }, "url", "https://"),
    it.link && /^https?:\/\//.test(it.link) ? h("a", { href: it.link, target: "_blank", rel: "noopener", class: "hint", text: "Open link" }) : null,
    h("p", { class: "hint", text: "De stippellijnen tonen de vrije ruimte. Onder 80 cm wordt het oranje: prima tussen bank en salontafel, te krap als je erlangs moet lopen." }),
    done());
}

function wallOptions() { return walls(R()).map(w => [String(w.i), `Muur ${wallName(w.i)} (${Math.round(w.len)} cm)`]); }
function renderOpPanel(op) {
  const r = R();
  put(h("h2", { text: op.type === "raam" ? "Raam" : "Deur" }),
    h("div", { class: "row" },
      selectField("p-wand", "Muur", String(op.wand), wallOptions(), x => { op.wand = Number(x); clampAll(r); save(); draw(); }),
      numField("p-bw", "Breedte", op.breedte, x => { op.breedte = x; clampAll(r); save(); draw(); })),
    numField("p-pos", "Afstand vanaf begin muur", Math.round(op.pos), x => { op.pos = x; clampAll(r); save(); draw(); }, "cm", 0),
    op.type === "raam" ? h("div", { class: "row" },
      numField("p-bor", "Borstwering", op.borstwering ?? 90, x => { op.borstwering = x; save(); draw(); }, "cm", 0),
      numField("p-oh", "Raamhoogte", op.hoogte ?? 140, x => { op.hoogte = x; save(); draw(); })) :
      numField("p-oh", "Deurhoogte", op.hoogte ?? 211, x => { op.hoogte = x; save(); draw(); }),
    h("p", { class: "hint", text: "Elke muur loopt met de klok mee; het begin is de hoek waar de letter vandaan telt. Slepen kan ook, ook naar een andere muur." }),
    op.type === "deur" ? h("button", { class: "btn sm", type: "button", text: "Scharnier andere kant", onclick: () => { op.draai = op.draai === "R" ? "L" : "R"; save(); draw(); } }) : null,
    h("div", { class: "btns" }, h("button", { class: "btn sm danger", type: "button", text: "Verwijder", onclick: remove }), done()));
}
function renderVpPanel(vp) {
  const r = R(), def = VP[vp.type];
  put(h("h2", { text: vp.naam || def.naam }),
    def.wall ? selectField("p-vwand", "Muur", String(vp.wand), wallOptions(), x => { vp.wand = Number(x); clampAll(r); save(); draw(); }) : null,
    def.wall ? numField("p-vpos", "Afstand vanaf begin muur", Math.round(vp.pos), x => { vp.pos = x; clampAll(r); save(); draw(); }, "cm", 0) : null,
    def.wall && !def.point ? h("div", { class: "row" },
      numField("p-vb", "Breedte", vp.breedte, x => { vp.breedte = x; clampAll(r); save(); draw(); }),
      numField("p-vd", vp.type === "schuin" ? "Diepte schuine zone" : "Diepte", vp.diepte, x => { vp.diepte = x; save(); draw(); })) : null,
    vp.type === "schuin" ? numField("p-vh", "Laagste hoogte", vp.hoogte, x => { vp.hoogte = x; save(); draw(); }) : null,
    vp.type === "kolom" ? h("div", { class: "row" },
      numField("p-kw", "Breedte", vp.w, x => { vp.w = x; save(); draw(); }),
      numField("p-kd", "Diepte", vp.d, x => { vp.d = x; save(); draw(); })) : null,
    h("div", { class: "btns" }, h("button", { class: "btn sm danger", type: "button", text: "Verwijder", onclick: remove }), done()));
}
function renderWallPanel(w) {
  put(h("h2", { text: `Muur ${wallName(w.i)}` }),
    numField("p-wl", "Lengte", Math.round(w.len), x => { if (!setWallLen(w.i, x)) setStatus("Die lengte past niet bij de rest van de kamer.", true); save(); draw(); }),
    h("p", { class: "hint", text: "Sleep de muur met het vierkantje in het midden om de kamer groter of kleiner te maken. Bij een andere lengte schuift de volgende muur mee." }),
    h("div", { class: "btns" },
      h("button", { class: "btn sm", type: "button", text: "Uitbouw maken", onclick: () => splitWall(w.i, 1) }),
      h("button", { class: "btn sm", type: "button", text: "Inham maken", onclick: () => splitWall(w.i, -1) }),
      h("button", { class: "btn sm primary", type: "button", text: "Wandaanzicht", onclick: () => { elev = { i: w.i }; sel = null; measuring = false; draw(); } })),
    done());
}
function renderRoomPanel() {
  const r = R(), bb = bbox(r);
  const tpl = (name, f) => h("button", { class: "btn sm", type: "button", text: name, onclick: () => { r.vorm = f(snap(bb.w), snap(bb.h)); clampAll(r); V().items.forEach(fitInside); r.voorbeeld = false; fitView(); save(); draw(); } });
  put(h("h2", { text: "Kamer en muren" }),
    h("h3", { text: "Vorm" }),
    h("div", { class: "btns" },
      tpl("Rechthoek", rect),
      tpl("L-vorm", (L, B) => [[0, 0], [L, 0], [L, snap(B / 2)], [snap(L / 2), snap(B / 2)], [snap(L / 2), B], [0, B]]),
      tpl("U-vorm", (L, B) => [[0, 0], [L, 0], [L, B], [snap(L * 2 / 3), B], [snap(L * 2 / 3), snap(B / 2)], [snap(L / 3), snap(B / 2)], [snap(L / 3), B], [0, B]])),
    r.vorm.length === 4 ? h("div", { class: "row" },
      numField("p-L", "Lengte", Math.round(bb.w), x => { r.vorm = rect(clamp(x, 100, 3000), Math.round(bb.h)); clampAll(r); r.voorbeeld = false; fitView(); save(); draw(); }),
      numField("p-B", "Breedte", Math.round(bb.h), x => { r.vorm = rect(Math.round(bb.w), clamp(x, 100, 3000)); clampAll(r); r.voorbeeld = false; fitView(); save(); draw(); })) :
      h("p", { class: "hint", text: "Klik op een muur om de lengte te zetten, of sleep het vierkantje in het midden van een muur." }),
    h("div", { class: "row" },
      numField("p-H", "Plafondhoogte", r.hoogte || 260, x => { r.hoogte = x; save(); draw(); }),
      selectField("p-wind", "Ramen op het", r.windrichting || "", WINDDIR, x => { r.windrichting = x; save(); })),
    h("button", { class: "btn sm", type: "button", text: "Wandaanzicht bekijken", onclick: () => { elev = { i: 0 }; sel = null; measuring = false; draw(); } }),
    renderOnderlaagSection(),
    h("h3", { text: "Vloerkleur" }),
    swatches(VLOER, r.vloer, c => { r.vloer = c; save(); draw(); }, true),
    h("h3", { text: "Ramen en deuren" }),
    h("div", { class: "btns" },
      h("button", { class: "btn sm", type: "button", text: "+ Raam", onclick: () => addOpening("raam") }),
      h("button", { class: "btn sm", type: "button", text: "+ Deur", onclick: () => addOpening("deur") })),
    r.openingen.length ? h("div", { class: "list" }, r.openingen.map(o => h("button", { type: "button", onclick: () => { sel = { kind: "op", id: o.id }; draw(); } }, o.type === "raam" ? "Raam" : "Deur", h("span", { text: `muur ${wallName(o.wand)} · ${o.breedte} cm` })))) : null,
    h("h3", { text: "Vaste punten" }),
    h("div", { class: "btns" }, Object.entries(VP).map(([t, d]) => h("button", { class: "btn sm", type: "button", text: "+ " + d.naam, onclick: () => addVp(t) }))),
    r.vastePunten.length ? h("div", { class: "list" }, r.vastePunten.map(o => h("button", { type: "button", onclick: () => { sel = { kind: "vp", id: o.id }; draw(); } }, o.naam || VP[o.type].naam, h("span", { text: VP[o.type].wall ? `muur ${wallName(o.wand)}` : "plafond/vloer" })))) : null,
    h("p", { class: "hint", text: "Klik op een muur om hem te kiezen. In deze modus kun je geen meubels verschuiven; daarvoor ga je terug naar Inrichten." }));
}

function renderBudget() {
  const rows = ROOMS.map(rm => { const v = V(state[rm.id]); return { rm, v, sum: variantPrice(v), nu: v.items.filter(i => i.prioriteit === "nu").reduce((s, i) => s + (Number(i.prijs) || 0), 0) }; });
  const total = rows.reduce((s, x) => s + x.sum, 0); const max = huis.budgetMax || 1;
  const bar = h("div", { class: "budgetbar" }, h("div", { class: "fill" + (total > max ? " over" : ""), style: `width:${Math.min(100, total / max * 100)}%` }), huis.budgetMin ? h("div", { class: "min", style: `left:${Math.min(100, huis.budgetMin / max * 100)}%` }) : null);
  const v = V();
  const table = h("table", { class: "money" }, h("thead", {}, h("tr", {}, h("th", { text: "Meubel" }), h("th", { class: "num", text: "Prijs" }))),
    h("tbody", {}, v.items.filter(i => !i.prioriteit || i.prioriteit !== "heb ik").map(it => {
      const inp = h("input", { type: "number", min: "0", value: it.prijs ?? "", id: "bp-" + it.id, "aria-label": `Prijs ${it.naam}` });
      inp.addEventListener("change", () => { it.prijs = inp.value === "" ? "" : Number(inp.value); save(); draw(); });
      return h("tr", {}, h("td", { text: it.naam + (it.prioriteit === "later" ? " (later)" : "") }), h("td", { class: "num" }, inp));
    })));
  put(h("h2", { text: "Budget en winkellijst" }),
    h("div", { class: "row" },
      numField("p-bmin", "Budget vanaf", huis.budgetMin, x => { huis.budgetMin = x; saveHuis(); draw(); }, "€", 0),
      numField("p-bmax", "Budget tot", huis.budgetMax, x => { huis.budgetMax = x; saveHuis(); draw(); }, "€", 0)),
    bar,
    h("p", { class: "hint", text: `Totaal ${euro(total)} van ${euro(huis.budgetMax)}${total > max ? `: ${euro(total - max)} te veel.` : `; nog ${euro(max - total)} over.`} Telt de actieve variant per kamer; "heb ik al" telt niet mee.` }),
    h("table", { class: "money" }, h("tbody", {}, rows.map(x => h("tr", {}, h("td", { text: `${x.rm.label} · ${x.v.naam}` }), h("td", { class: "num", text: euro(x.sum) }))),
      h("tr", {}, h("td", { text: "Waarvan nu kopen" }), h("td", { class: "num", text: euro(rows.reduce((s, x) => s + x.nu, 0)) })))),
    h("h3", { text: `Prijzen ${ROOMS.find(x => x.id === cur).label.toLowerCase()} · ${v.naam}` }),
    v.items.length ? table : h("p", { class: "empty", text: "Nog geen meubels in deze variant." }),
    h("div", { class: "btns" },
      h("button", { class: "btn sm primary", type: "button", text: "Winkellijst downloaden (CSV)", onclick: exportCsv }),
      h("button", { class: "btn sm", type: "button", text: "Terug", onclick: () => { panel = "auto"; draw(); } })));
}

/* ---------- advies ---------- */
function mdToDom(text) {
  const box = h("div", { class: "advice" }); let list = null;
  const inline = s => { const frag = []; s.split(/(\*\*[^*]+\*\*)/g).forEach(part => { if (/^\*\*[^*]+\*\*$/.test(part)) frag.push(h("strong", { text: part.slice(2, -2) })); else if (part) frag.push(document.createTextNode(part)); }); return frag; };
  text.split(/\n/).forEach(line => {
    const t = line.trim();
    if (!t) { list = null; return; }
    let m;
    if ((m = /^#{1,4}\s+(.*)$/.exec(t))) { list = null; box.append(h("h4", {}, inline(m[1]))); }
    else if ((m = /^[-*•]\s+(.*)$/.exec(t)) || (m = /^\d+[.)]\s+(.*)$/.exec(t))) { if (!list) { list = h("ul"); box.append(list); } list.append(h("li", {}, inline(m[1]))); }
    else { list = null; box.append(h("p", {}, inline(t))); }
  });
  return box;
}
function renderAdvice() {
  const v = V(); const wrap = h("div", { class: "field" }, h("h3", { text: "Advies" }));
  if (!sample) { wrap.append(h("p", { class: "hint", text: "Advies van Claude werkt alleen op claude.ai." })); return wrap; }
  if (adviceLive && adviceLive.room === cur && adviceLive.variant === v.id) {
    wrap.append(adviceLive.text ? mdToDom(adviceLive.text) : h("p", { class: "thinking", text: "Claude bekijkt je indeling… dit duurt meestal 10 tot 60 seconden." }),
      h("button", { class: "btn sm", type: "button", text: "Stop", onclick: () => adviceCtl?.abort() }));
    return wrap;
  }
  if (v.advies && v.advies.tekst) {
    wrap.append(h("p", { class: "hint", text: `Gegeven op ${new Date(v.advies.datum).toLocaleString("nl-NL", { dateStyle: "medium", timeStyle: "short" })}. Daarna verschoven meubels zitten er niet in.` }), mdToDom(v.advies.tekst));
  }
  wrap.append(h("button", { class: "btn sm primary", type: "button", text: v.advies ? "Vraag opnieuw om advies" : "Vraag Claude om advies", onclick: askAdvice }));
  if (adviceLive && adviceLive.error) wrap.append(h("p", { class: "hint", style: "color:var(--warn)", text: adviceLive.error }));
  return wrap;
}
function layoutJson(room, v) {
  const W = walls(room);
  return {
    kamer: ROOMS.find(x => x.id === cur).label, plafondhoogte: room.hoogte, ramenOpHet: room.windrichting || "onbekend",
    oppervlakM2: Math.round(areaM2(room) * 10) / 10,
    muren: W.map(w => ({ muur: wallName(w.i), van: w.p, naar: w.q, lengte: Math.round(w.len) })),
    ramenEnDeuren: room.openingen.map(o => ({ type: o.type, muur: wallName(o.wand), vanafBeginMuur: Math.round(o.pos), breedte: o.breedte })),
    vastePunten: room.vastePunten.map(p => ({ type: p.naam || VP[p.type].naam, muur: VP[p.type].wall ? wallName(p.wand) : null, positie: VP[p.type].wall ? Math.round(p.pos) : [p.x, p.y], breedte: p.breedte, laagsteHoogte: p.hoogte })),
    meubels: v.items.filter(i => i.type !== "lamp").map(i => ({ naam: i.naam, breedte: i.w, diepte: i.d, hoogte: itemH(i), midden: [Math.round(i.cx), Math.round(i.cy)], draaiing: Math.round(i.rot || 0), rond: isRound(i) })),
    lampen: lampItems(v).map(l => ({ naam: l.naam, soort: l.soort || "algemeen", lumen: l.lumen, kelvin: l.kelvin || 2700, hoogte: itemH(l), midden: [Math.round(l.cx), Math.round(l.cy)] })),
    wandObjecten: (room.wandObjecten || []).map(o => ({ naam: o.naam, muur: wallName(o.wand), vanafBeginMuur: o.pos, breedte: o.breedte, hoogte: o.hoogte, onderkantVanafVloer: o.z })),
    lichtMeldingen: lightStats(room, v).out,
    meldingen: problems(room, v).out
  };
}
async function askAdvice() {
  const room = R(), v = V(); adviceCtl = new AbortController();
  adviceLive = { room: cur, variant: v.id, text: "" }; renderProps();
  const prompt = `Je bent een ervaren interieurarchitect met praktisch verstand. Beoordeel de indeling van deze kamer.

Context: ${CONTEXT}

Plattegrond in centimeters. De oorsprong is linksboven, x loopt naar rechts, y naar beneden. Muren lopen met de klok mee; "vanafBeginMuur" is de afstand vanaf het beginpunt van die muur. "midden" is het middelpunt van een meubel, "draaiing" in graden (0 = breedte langs de x-as).

${JSON.stringify(layoutJson(room, v))}

Schrijf in het Nederlands, direct en concreet, maximaal 300 woorden, met precies deze kopjes (als ## kopje): "Wat werkt", "Wat beter kan", "Veiligheid voor je peuter", "Licht". Noem meubels bij naam en geef verplaatsingen in centimeters. Houd looproutes van 80 tot 90 cm aan. Verzin geen producten of prijzen. Als iets in de gegevens ontbreekt (bijvoorbeeld geen ramen of deuren ingetekend), zeg dat kort.`;
  try {
    const { text } = await sample(prompt, { signal: adviceCtl.signal, cache: false, onText: ({ text }) => { adviceLive.text = text; if (!dragging) renderProps(); } });
    v.advies = { tekst: text, datum: new Date().toISOString() }; adviceLive = null; save(); draw();
  } catch (e) {
    const msg = { cancelled: "", not_granted: "Je hebt advies van Claude niet toegestaan op deze pagina.", sampling_disabled: "Advies van Claude is niet beschikbaar voor dit account.", rate_limited: "Even te veel vragen achter elkaar. Probeer het over een paar minuten opnieuw.", refused: "Claude kon deze vraag niet beantwoorden." }[e && e.code];
    adviceLive = { error: msg ?? "Het advies is onderbroken. Probeer het opnieuw." };
    if (e && e.code === "not_granted") sample = null;
    renderProps();
  }
}

/* ---------- varianten ---------- */
function renderVariants() {
  const box = document.getElementById("variants"); box.replaceChildren();
  R().varianten.forEach(v => box.append(h("button", { class: "vchip", type: "button", "aria-pressed": String(v.id === R().actief && !comparing), title: v.naam, text: v.naam.replace(/^Variant\s+/i, ""), onclick: () => { R().actief = v.id; comparing = false; sel = null; save(); draw(); } })));
  if (R().varianten.length < 6) box.append(h("button", { class: "vchip", type: "button", title: "Nieuwe variant (kopie van de huidige)", text: "+", onclick: () => addVariant(true) }));
  if (R().varianten.length > 1) box.append(h("button", { class: "vchip", type: "button", "aria-pressed": String(comparing), text: "Vergelijk", onclick: () => { comparing = !comparing; showCompare(); } }));
}
function addVariant(copy) {
  const r = R(); const used = new Set(r.varianten.map(v => v.naam)); let k = 0; let name; do { name = "Variant " + String.fromCharCode(65 + k++); } while (used.has(name));
  const nv = { id: uid(), naam: name, items: copy ? V().items.map(i => ({ ...i, id: uid() })) : [] };
  r.varianten.push(nv); r.actief = nv.id; sel = null; save(); draw();
}
function removeVariant() {
  const r = R(); if (r.varianten.length < 2) return;
  r.varianten = r.varianten.filter(v => v.id !== r.actief); r.actief = r.varianten[0].id; sel = null; save(); draw();
  setStatus("Variant gewist. Ongedaan maken kan met Ctrl+Z.");
}
function showCompare() {
  svg.toggleAttribute("hidden", comparing); document.getElementById("compare").hidden = !comparing;
  if (comparing) { sel = null; } draw();
}
function renderCompare() {
  const box = document.getElementById("compare"); box.replaceChildren(); const r = R(); const bb = bbox(r); const pad = Math.max(40, Math.max(bb.w, bb.h) * 0.08);
  r.varianten.forEach(v => {
    const s = S("svg", { viewBox: `${bb.x0 - pad} ${bb.y0 - pad} ${bb.w + 2 * pad} ${bb.h + 2 * pad}`, role: "img", "aria-label": `Schets ${v.naam}` });
    const g = S("g"); s.append(g); render(g, r, v, { interactive: false, labels: false, key: "cmp" + v.id, onderlaag: false });
    const pr = problems(r, v).out.length;
    box.append(h("div", { class: "vcard" + (v.id === r.actief ? " on" : "") }, h("strong", { text: v.naam }), s,
      h("dl", { class: "stats" }, h("dt", { text: "Meubels" }), h("dd", { text: String(v.items.length) }), h("dt", { text: "Meldingen" }), h("dd", { text: String(pr), style: pr ? "color:var(--warn)" : "" }), h("dt", { text: "Prijs" }), h("dd", { text: euro(variantPrice(v)) }), h("dt", { text: "Advies" }), h("dd", { text: v.advies ? "ja" : "nee" })),
      h("button", { class: "btn sm", type: "button", text: "Open deze variant", onclick: () => { r.actief = v.id; comparing = false; save(); showCompare(); } })));
  });
}

/* =========================================================
   Acties
   ========================================================= */
function fitInside(it) {
  const bb = bbox(R()); const f = aabb(itemPoly(it)); const hw = (f.x1 - f.x0) / 2, hd = (f.y1 - f.y0) / 2;
  it.cx = clamp(it.cx, bb.x0 + hw, Math.max(bb.x0 + hw, bb.x1 - hw)); it.cy = clamp(it.cy, bb.y0 + hd, Math.max(bb.y0 + hd, bb.y1 - hd));
}
function placeFree(it) {
  const r = R(); const others = V().items.filter(o => isObstacle(it) ? isObstacle(o) : (SOFT.has(it.type) && SOFT.has(o.type))).map(itemPoly);
  const ok = () => { const p = itemPoly(it); return p.every(q => pointInPoly(add(q, [it.cx - q[0], it.cy - q[1]], 0.02), r.vorm)) && !others.some(o => sat(p, o)); };
  if (ok()) return; const c0 = [it.cx, it.cy];
  for (let ring = 1; ring <= 40; ring++) { const s = ring * 25; for (let k = -ring; k <= ring; k++) for (const [dx, dy] of [[k * 25, -s], [k * 25, s], [-s, k * 25], [s, k * 25]]) { it.cx = c0[0] + dx; it.cy = c0[1] + dy; if (ok()) return; } }
  it.cx = c0[0]; it.cy = c0[1];
}
function addItem(def, at, noSave) {
  const [type, naam, w, d] = def; const bb = bbox(R());
  const it = { id: uid(), type, naam, w, d, rot: 0, ...(def[4] || {}), cx: at ? at[0] : bb.x0 + bb.w / 2, cy: at ? at[1] : bb.y0 + bb.h / 2 };
  it.cx = snap(it.cx); it.cy = snap(it.cy); fitInside(it); if (!at) placeFree(it);
  V().items.push(it); sel = { kind: "item", id: it.id }; panel = "auto"; elev = null; measuring = false; if (mode !== "in" && mode !== "licht") mode = type === "lamp" ? "licht" : "in";
  if (comparing) { comparing = false; showCompare(); }
  draw(); if (!noSave) save(); return it;
}
function rotate(it, deg) { it.rot = (((it.rot || 0) + deg) % 360 + 360) % 360; fitInside(it); save(); draw(); }
function duplicate(it) { const c = { ...it, id: uid(), cx: it.cx + 20, cy: it.cy + 20 }; fitInside(c); V().items.push(c); sel = { kind: "item", id: c.id }; save(); draw(); }
function remove() {
  const r = R(); if (!sel) return;
  if (sel.kind === "item") V().items = V().items.filter(i => i.id !== sel.id);
  else if (sel.kind === "op") r.openingen = r.openingen.filter(o => o.id !== sel.id);
  else if (sel.kind === "vp") r.vastePunten = r.vastePunten.filter(o => o.id !== sel.id);
  else return;
  sel = null; save(); draw();
}
function addOpening(type) {
  const r = R(); const W = walls(r); const wi = type === "raam" ? 0 : Math.min(2, W.length - 1);
  const breedte = Math.min(type === "raam" ? 150 : 83, W[wi].len);
  const op = { id: uid(), type, wand: wi, pos: snap((W[wi].len - breedte) / 2), breedte, draai: "L" };
  r.openingen.push(op); sel = { kind: "op", id: op.id }; save(); draw();
}
function addVp(type) {
  const r = R(), def = VP[type], bb = bbox(r), W = walls(r);
  const vp = { id: uid(), type, naam: def.naam };
  if (def.wall) { vp.wand = 0; vp.breedte = def.breedte; vp.diepte = def.diepte; vp.pos = snap((W[0].len - (def.breedte || 0)) / 2); if (type === "schuin") vp.hoogte = 120; }
  else { vp.x = snap(bb.x0 + bb.w / 2); vp.y = snap(bb.y0 + bb.h / 2); if (type === "kolom") { vp.w = def.w; vp.d = def.d; } }
  r.vastePunten.push(vp); sel = { kind: "vp", id: vp.id }; save(); draw();
}
/* muur j evenwijdig verschuiven over t cm; buurmuren veranderen mee van lengte */
function moveWall(room, j, t) {
  if (!t) return true;
  const n = room.vorm.length, W = walls(room), w = W[j], k = (j + 1) % n;
  const backup = JSON.stringify({ v: room.vorm, o: room.openingen, p: room.vastePunten });
  room.vorm[j] = add(room.vorm[j], w.n, t); room.vorm[k] = add(room.vorm[k], w.n, t);
  const next = W[k]; const shift = w.n[0] * t * next.d[0] + w.n[1] * t * next.d[1];
  [...room.openingen, ...room.vastePunten].forEach(o => { if (o.wand === k && o.pos != null) o.pos -= shift; });
  const nw = walls(room);
  if (nw.some(x => x.len < 20) || Math.abs(signedArea(room.vorm)) < 10000) { const b = JSON.parse(backup); room.vorm = b.v; room.openingen = b.o; room.vastePunten = b.p; return false; }
  clampAll(room); return true;
}
function setWallLen(i, L) {
  const r = R(), W = walls(r), n = W.length; const k = (i + 1) % n; const delta = L - W[i].len;
  const t = delta * (W[i].d[0] * W[k].n[0] + W[i].d[1] * W[k].n[1]);
  if (Math.abs(Math.abs(W[i].d[0] * W[k].n[0] + W[i].d[1] * W[k].n[1]) - 1) > 0.01) return false;
  const ok = moveWall(r, k, t); r.voorbeeld = false; V().items.forEach(fitInside); return ok;
}
function splitWall(i, dir) {
  const r = R(), W = walls(r), w = W[i]; const a = snap(w.len / 3), b = snap(w.len * 2 / 3); const depth = 40 * dir;
  const pts = [add(w.p, w.d, a), add(add(w.p, w.d, a), w.n, -depth), add(add(w.p, w.d, b), w.n, -depth), add(w.p, w.d, b)];
  r.vorm.splice(i + 1, 0, ...pts.map(p => p.map(Math.round)));
  [...r.openingen, ...r.vastePunten].forEach(o => {
    if (o.wand == null) return;
    if (o.wand > i) o.wand += 4;
    else if (o.wand === i && o.pos != null) { if (o.pos >= b) { o.wand = i + 4; o.pos -= b; } else if (o.pos + (o.breedte || 0) > a) { o.wand = i + 2; o.pos = Math.max(0, o.pos - a); } }
  });
  clampAll(r); sel = { kind: "wall", i: i + 2 }; fitView(); save(); draw();
}

/* =========================================================
   Downloaden
   ========================================================= */
async function offerFile(filename, data) {
  if (downloads) {
    try { await downloads.save({ filename, data }); setStatus("Bestand aangeboden: " + filename); }
    catch (e) { if (e && e.code !== "declined") setStatus("Downloaden lukte niet hier.", true); }
    return;
  }
  /* buiten claude.ai (lokaal testen) */
  const url = URL.createObjectURL(data instanceof Blob ? data : new Blob([data])); const a = h("a", { href: url, download: filename }); document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 4000);
}
async function exportPng() {
  if (mode === "3d" || elev) return exportView();
  const r = R(), v = V(), bb = bbox(r); const pad = Math.max(60, Math.max(bb.w, bb.h) * 0.1);
  const vbw = bb.w + 2 * pad, vbh = bb.h + 2 * pad + pad * 0.8; const scale = 1600 / Math.max(vbw, vbh);
  const s = S("svg", { viewBox: `${bb.x0 - pad} ${bb.y0 - pad * 1.8} ${vbw} ${vbh}`, width: Math.round(vbw * scale), height: Math.round(vbh * scale) });
  s.append(S("rect", { x: bb.x0 - pad, y: bb.y0 - pad * 1.8, width: vbw, height: vbh, fill: "var(--surface)" }));
  const fs = clamp(Math.max(bb.w, bb.h) / 48, 8, 22);
  s.append(S("text", { x: bb.x0, y: bb.y0 - pad * 1.15, "font-family": "Segoe UI, Inter, sans-serif", "font-size": fs * 1.5, "font-weight": 700, fill: "var(--fg)" }, `${ROOMS.find(x => x.id === cur).label} · ${v.naam}`));
  s.append(S("text", { x: bb.x0 + bb.w, y: bb.y0 - pad * 1.15, "text-anchor": "end", "font-family": "Consolas, monospace", "font-size": fs, fill: "var(--muted)" }, `${areaM2(r).toLocaleString("nl-NL", { maximumFractionDigits: 1 })} m² · raster 50 cm`));
  const g = S("g"); s.append(g); const keepSel = sel; sel = null; render(g, r, v, { interactive: false, key: "png", onderlaag: false }); sel = keepSel;
  const cs = getComputedStyle(document.documentElement);
  const xml = new XMLSerializer().serializeToString(s).replace(/var\((--[\w-]+)\)/g, (m, n) => cs.getPropertyValue(n).trim() || "#888888");
  const img = new Image(); img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(xml);
  try { await img.decode(); } catch (_) { setStatus("De afbeelding kon niet worden gemaakt.", true); return; }
  const c = document.createElement("canvas"); c.width = img.width; c.height = img.height; c.getContext("2d").drawImage(img, 0, 0);
  c.toBlob(b => b && offerFile(`plattegrond-${cur}-${v.naam.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`, b), "image/png");
}
function exportCsv() {
  const q = x => { const s = String(x ?? ""); return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
  const lines = [["Kamer", "Variant", "Meubel", "Breedte (cm)", "Diepte (cm)", "Kleur", "Prijs (EUR)", "Wanneer", "Winkel of zoekterm", "Link"].join(";")];
  ROOMS.forEach(rm => { const v = V(state[rm.id]); v.items.forEach(i => {
    const kleur = (PALET.find(p => p[1] === i.kleur) || [""])[0];
    lines.push([rm.label, v.naam, i.naam, i.w, i.d, kleur, i.prijs !== "" && i.prijs != null ? String(i.prijs).replace(".", ",") : "", i.prioriteit || "", i.winkel || "", i.link || ""].map(q).join(";"));
  }); });
  offerFile("winkellijst.csv", "﻿" + lines.join("\r\n"));
}

/* =========================================================
   Aanwijzer: selecteren, slepen, handgrepen, zoomen, schuiven
   ========================================================= */
function toSvg(e) { const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; const m = svg.getScreenCTM(); const q = m ? p.matrixTransform(m.inverse()) : { x: 0, y: 0 }; return [q.x, q.y]; }
function insideSvg(e) { const b = svg.getBoundingClientRect(); return e.clientX >= b.left && e.clientX <= b.right && e.clientY >= b.top && e.clientY <= b.bottom; }

function hitTest(p) {
  const r = R(), px = pxUnit(), tol = Math.max(10 * px, WALL * 1.2);
  if (mode === "in" || mode === "licht") {
    if (sel && sel.kind === "item") { const it = findSel(); if (it) for (const hd of handles(it, px)) if (Math.hypot(p[0] - hd.p[0], p[1] - hd.p[1]) < 11 * px) return { kind: "handle", hd, id: it.id }; }
    const hits = V().items.filter(it => pointInPoly(p, itemPoly(it))).sort((a, b) => (SOFT.has(a.type) - SOFT.has(b.type)) || (a.w * a.d - b.w * b.d));
    return hits.length ? { kind: "item", id: hits[0].id } : null;
  }
  let best = null, bd = Infinity;
  r.openingen.forEach(o => { const g = opGeom(r, o); const s = segDist(p, g.p0, g.p1); if (s.d < tol && s.d < bd) { best = { kind: "op", id: o.id }; bd = s.d; } });
  r.vastePunten.forEach(v => {
    let d = Infinity;
    if (v.type === "kolom") d = pointInPoly(p, vpPoly(r, v)) ? 0 : Infinity;
    else if (v.type === "lichtpunt") d = Math.hypot(p[0] - v.x, p[1] - v.y) < 14 * px ? 0 : Infinity;
    else { const g = vpGeom(r, v); const poly = vpPoly(r, v); d = poly && pointInPoly(p, poly) ? 0 : segDist(p, add(g.p0, g.w.n, WALL), add(g.p1, g.w.n, WALL)).d; }
    if (d < tol && d < bd) { best = { kind: "vp", id: v.id }; bd = d; }
  });
  if (best) return best;
  walls(r).forEach(w => { const s = segDist(p, w.p, w.q); if (s.d < tol * 1.3 && s.d < bd) { best = { kind: "wall", i: w.i }; bd = s.d; } });
  return best;
}

const pointers = new Map();
svg.addEventListener("pointerdown", e => {
  if (e.button > 0) return;
  pointers.set(e.pointerId, [e.clientX, e.clientY]);
  try { svg.setPointerCapture(e.pointerId); } catch (_) {}
  e.preventDefault();
  if (pointers.size === 2) {
    const [a, b] = [...pointers.values()]; const v = views[cur];
    dragging = { kind: "pinch", d0: Math.hypot(a[0] - b[0], a[1] - b[1]), m0: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], v0: { ...v } };
    return;
  }
  if (pointers.size > 2) return;
  const p = toSvg(e);
  if (mode === "3d") return;
  if (elev) {
    const o = elevHit(p); sel = o ? { kind: "wobj", id: o.id } : null;
    if (o) { const H = R().hoogte || 260; dragging = { kind: "wobj", id: o.id, off: [p[0] - o.pos, (H - p[1]) - o.z], moved: false, pid: e.pointerId }; }
    draw(); return;
  }
  if (measuring) { const a = e.shiftKey ? [Math.round(p[0]), Math.round(p[1])] : [snap(p[0]), snap(p[1])]; tempMeasure = { a, b: a }; dragging = { kind: "measure", moved: false, pid: e.pointerId }; draw(); return; }
  if (mode === "vorm" && trace.tool && tracePointer(e, p)) return;
  const hit = hitTest(p);
  if (!hit) { dragging = { kind: "pan", c0: [e.clientX, e.clientY], v0: { ...views[cur] }, moved: false, pid: e.pointerId }; return; }
  if (hit.kind === "handle") {
    const it = findSel(); const hd = hit.hd;
    if (hd.kind === "rot") dragging = { kind: "rot", id: it.id, moved: false, pid: e.pointerId };
    else { const opp = handles(it, 1).find(x => x.kind === "size" && x.sx === -hd.sx && x.sy === -hd.sy).p; dragging = { kind: "size", id: it.id, sx: hd.sx, sy: hd.sy, opp, moved: false, pid: e.pointerId }; }
    return;
  }
  sel = hit.kind === "wall" ? { kind: "wall", i: hit.i } : { kind: hit.kind, id: hit.id }; panel = "auto";
  if (hit.kind === "item") { const it = findSel(); dragging = { kind: "item", id: it.id, off: [p[0] - it.cx, p[1] - it.cy], moved: false, pid: e.pointerId }; }
  else if (hit.kind === "wall") { const w = walls(R())[hit.i]; dragging = { kind: "wall", i: hit.i, start: p, applied: 0, n: w.n, moved: false, pid: e.pointerId }; }
  else dragging = { kind: hit.kind, id: hit.id, moved: false, pid: e.pointerId };
  draw();
});
svg.addEventListener("pointermove", e => {
  if (pointers.has(e.pointerId)) pointers.set(e.pointerId, [e.clientX, e.clientY]);
  if (!dragging && mode === "vorm" && trace.tool && !elev) { trace.hover = toSvg(e); applyView(); render(layer, R(), V(), { interactive: true, px: pxUnit(), key: "main" }); return; }
  if (!dragging && (mode === "3d" || elev || measuring)) { svg.style.cursor = measuring ? "crosshair" : "default"; return; }
  if (!dragging) {
    if (e.pointerType === "mouse") { const hit = hitTest(toSvg(e)); svg.style.cursor = !hit ? "default" : hit.kind === "handle" ? (hit.hd.kind === "rot" ? "alias" : "nwse-resize") : hit.kind === "wall" ? "move" : "grab"; }
    return;
  }
  const r = R();
  if (dragging.kind === "pinch") {
    if (pointers.size < 2) return; const [a, b] = [...pointers.values()]; const d = Math.hypot(a[0] - b[0], a[1] - b[1]); const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const rc = svg.getBoundingClientRect(); const v0 = dragging.v0; const bb = bbox(r); const M = Math.max(bb.w, bb.h);
    const nw = clamp(v0.w * dragging.d0 / (d || 1), M * 0.15, M * 6); const k = nw / v0.w;
    const fx0 = (dragging.m0[0] - rc.left) / rc.width, fy0 = (dragging.m0[1] - rc.top) / rc.height, fx = (m[0] - rc.left) / rc.width, fy = (m[1] - rc.top) / rc.height;
    const P = [v0.x + fx0 * v0.w, v0.y + fy0 * v0.h];
    views[cur] = { x: P[0] - fx * nw, y: P[1] - fy * v0.h * k, w: nw, h: v0.h * k }; draw(); return;
  }
  if (dragging.pid !== undefined && e.pointerId !== dragging.pid) return;
  if (dragging.kind === "pan") {
    const rc = svg.getBoundingClientRect(); const k = dragging.v0.w / rc.width;
    const dx = e.clientX - dragging.c0[0], dy = e.clientY - dragging.c0[1]; if (Math.hypot(dx, dy) > 4) dragging.moved = true;
    if (dragging.moved) { views[cur] = { ...dragging.v0, x: dragging.v0.x - dx * k, y: dragging.v0.y - dy * k }; applyView(); }
    return;
  }
  const p = toSvg(e);
  if (dragging.kind === "measure") {
    tempMeasure.b = e.shiftKey ? [Math.round(p[0]), Math.round(p[1])] : [snap(p[0]), snap(p[1])]; dragging.moved = true;
    applyView(); render(layer, R(), V(), { interactive: true, px: pxUnit(), key: "main", light: mode === "licht" }); return;
  }
  if (dragging.kind === "ond") {
    const o = R().onderlaag; o.x = dragging.o0[0] + (p[0] - dragging.start[0]); o.y = dragging.o0[1] + (p[1] - dragging.start[1]); dragging.moved = true;
    applyView(); render(layer, R(), V(), { interactive: true, px: pxUnit(), key: "main" }); return;
  }
  if (dragging.kind === "wobj") {
    const o = (r.wandObjecten || []).find(x => x.id === dragging.id); if (!o) return; const H = r.hoogte || 260; const len = walls(r)[elev.i].len;
    o.pos = clamp(snap(p[0] - dragging.off[0]), 0, Math.max(0, len - o.breedte)); o.z = clamp(snap((H - p[1]) - dragging.off[1]), 0, Math.max(0, H - o.hoogte));
    dragging.moved = true; draw(); return;
  }
  if (dragging.kind === "item") {
    const it = V().items.find(i => i.id === dragging.id); if (!it) return;
    it.cx = snap(p[0] - dragging.off[0]); it.cy = snap(p[1] - dragging.off[1]); fitInside(it);
  } else if (dragging.kind === "rot") {
    const it = V().items.find(i => i.id === dragging.id); if (!it) return;
    let ang = Math.atan2(p[1] - it.cy, p[0] - it.cx) * 180 / Math.PI + 90; if (!e.shiftKey) ang = Math.round(ang / 15) * 15;
    it.rot = ((Math.round(ang) % 360) + 360) % 360;
  } else if (dragging.kind === "size") {
    const it = V().items.find(i => i.id === dragging.id); if (!it) return;
    const a = (it.rot || 0) * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
    const dx = p[0] - dragging.opp[0], dy = p[1] - dragging.opp[1]; const lx = dx * c + dy * s, ly = -dx * s + dy * c;
    const w = Math.max(10, snap(lx * dragging.sx)), d = Math.max(10, snap(ly * dragging.sy));
    const hx = dragging.sx * w / 2, hy = dragging.sy * d / 2;
    it.w = w; it.d = d; it.cx = dragging.opp[0] + hx * c - hy * s; it.cy = dragging.opp[1] + hx * s + hy * c;
  } else if (dragging.kind === "wall") {
    const t = snap((p[0] - dragging.start[0]) * dragging.n[0] + (p[1] - dragging.start[1]) * dragging.n[1]);
    if (t !== dragging.applied && moveWall(r, dragging.i, t - dragging.applied)) { dragging.applied = t; r.voorbeeld = false; }
  } else if (dragging.kind === "op" || dragging.kind === "vp") {
    const o = dragging.kind === "op" ? r.openingen.find(x => x.id === dragging.id) : r.vastePunten.find(x => x.id === dragging.id); if (!o) return;
    if (dragging.kind === "vp" && !VP[o.type].wall) { o.x = snap(p[0]); o.y = snap(p[1]); }
    else {
      const nwl = nearestWall(r, p); const len = walls(r)[nwl.i].len; const width = dragging.kind === "op" ? o.breedte : (VP[o.type].point ? 0 : o.breedte);
      if (width > len) return; o.wand = nwl.i; o.pos = clamp(snap(nwl.t - width / 2), 0, len - width);
    }
  }
  dragging.moved = true; draw();
});
function endPointer(e) {
  pointers.delete(e.pointerId);
  if (!dragging) return;
  if (dragging.kind === "pinch") { if (pointers.size === 0) dragging = null; return; }
  if (dragging.pid !== undefined && e.pointerId !== dragging.pid) return;
  const d = dragging; dragging = null; svg.style.cursor = "";
  if (d.kind === "pan") { if (!d.moved) { sel = null; panel = "auto"; } draw(); return; }
  if (d.kind === "measure") { draw(); return; }
  if (d.moved) { if (d.kind === "wall") { V().items.forEach(fitInside); } save(); }
  draw();
}
svg.addEventListener("pointerup", endPointer); svg.addEventListener("pointercancel", endPointer); svg.addEventListener("lostpointercapture", e => { if (pointers.has(e.pointerId)) endPointer(e); });
svg.addEventListener("wheel", e => { if (mode === "3d" || elev) return; e.preventDefault(); const p = toSvg(e); zoomAt(Math.exp(e.deltaY * 0.0015), p[0], p[1]); }, { passive: false });

/* bibliotheek */
function buildLib() {
  const lib = document.getElementById("lib");
  LIB.forEach(c => {
    lib.append(h("div", { class: "cat" }, h("h3", { text: c.cat }), c.items.map(def => {
      const b = h("button", { class: "libitem", type: "button" }, def[1], h("span", { text: `${def[2]}×${def[3]}` }));
      let st = null;
      b.addEventListener("pointerdown", e => { if (e.button > 0) return; st = { x: e.clientX, y: e.clientY, id: null }; try { b.setPointerCapture(e.pointerId); } catch (_) {} });
      b.addEventListener("pointermove", e => {
        if (!st) return;
        if (!st.id && Math.hypot(e.clientX - st.x, e.clientY - st.y) > 6 && insideSvg(e) && !comparing) {
          const p = toSvg(e); st.id = addItem(def, p, true).id; dragging = { kind: "lib", id: st.id };
        } else if (st.id) { const it = V().items.find(i => i.id === st.id); if (!it) return; const p = toSvg(e); it.cx = snap(p[0]); it.cy = snap(p[1]); fitInside(it); draw(); }
      });
      const finish = e => {
        if (!st) return; const moved = Math.hypot(e.clientX - st.x, e.clientY - st.y) > 6;
        if (st.id) { dragging = null; save(); draw(); } else if (!moved && e.type === "pointerup") addItem(def);
        st = null;
      };
      b.addEventListener("pointerup", finish); b.addEventListener("pointercancel", finish);
      b.addEventListener("click", e => { if (e.detail === 0) addItem(def); });
      return b;
    })));
  });
}
function customDialog() {
  sel = null; panel = "auto"; props.replaceChildren();
  let naam = "Eigen meubel", w = 100, d = 50, rond = false;
  const nm = h("input", { id: "c-naam", type: "text", value: naam }); nm.addEventListener("input", () => naam = nm.value);
  props.append(h("h2", { text: "Eigen meubel" }),
    h("div", { class: "field" }, h("label", { for: "c-naam", text: "Naam" }), nm),
    h("div", { class: "row" }, numField("c-w", "Breedte", w, x => w = x), numField("c-d", "Diepte", d, x => d = x)),
    selectField("c-vorm", "Vorm", "recht", [["recht", "Rechthoek"], ["rond", "Rond / ovaal"]], x => rond = x === "rond"),
    h("p", { class: "hint", text: "Meet je eigen meubel op en vul de buitenmaten in, inclusief armleuningen en poten." }),
    h("div", { class: "btns" },
      h("button", { class: "btn sm primary", type: "button", text: "Toevoegen", onclick: () => { document.activeElement?.blur(); const it = addItem([rond ? "rond" : "kast", naam.trim() || "Eigen meubel", w, d]); it.rond = rond; it.eigen = true; save(); draw(); } }),
      h("button", { class: "btn sm", type: "button", text: "Annuleren", onclick: () => draw() })));
  nm.focus(); nm.select();
}

/* toetsenbord */
document.addEventListener("keydown", e => {
  const typing = ["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement?.tagName);
  if ((e.ctrlKey || e.metaKey) && !typing) {
    if (e.key.toLowerCase() === "z") { e.preventDefault(); restore(e.shiftKey ? 1 : -1); return; }
    if (e.key.toLowerCase() === "y") { e.preventDefault(); restore(1); return; }
  }
  if (typing || !sel) return;
  if (e.key === "Escape") { sel = null; draw(); return; }
  if (e.key === "Delete" || e.key === "Backspace") { e.preventDefault(); remove(); return; }
  if (sel.kind !== "item") return;
  const it = findSel(); if (!it) return;
  if (e.key === "r" || e.key === "R") { rotate(it, e.shiftKey ? -90 : 90); return; }
  const step = e.shiftKey ? 25 : SNAP; const mv = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
  if (mv) { e.preventDefault(); it.cx += mv[0]; it.cy += mv[1]; fitInside(it); save(); draw(); }
});

/* werkbalk */
document.getElementById("undo").addEventListener("click", () => restore(-1));
document.getElementById("redo").addEventListener("click", () => restore(1));
document.getElementById("zoom-in").addEventListener("click", () => { const v = views[cur]; zoomAt(1 / 1.25, v.x + v.w / 2, v.y + v.h / 2); });
document.getElementById("zoom-out").addEventListener("click", () => { const v = views[cur]; zoomAt(1.25, v.x + v.w / 2, v.y + v.h / 2); });
document.getElementById("zoom-fit").addEventListener("click", () => { fitView(); draw(); });
document.getElementById("png").addEventListener("click", exportPng);
document.getElementById("custom-btn").addEventListener("click", customDialog);
document.getElementById("mode-in").addEventListener("click", () => setMode("in"));
document.getElementById("mode-vorm").addEventListener("click", () => setMode("vorm"));
document.getElementById("mode-licht").addEventListener("click", () => setMode("licht"));
document.getElementById("mode-3d").addEventListener("click", () => setMode("3d"));
document.getElementById("measure").addEventListener("click", () => { measuring = !measuring; tempMeasure = null; sel = null; panel = "auto"; draw(); });
function setMode(m) { mode = m; sel = null; panel = "auto"; elev = null; measuring = m === "3d" ? false : measuring; trace.tool = null; trace.pts = []; if (comparing) { comparing = false; showCompare(); } else draw(); }
window.addEventListener("resize", () => { Object.keys(views).forEach(k => delete views[k]); draw(); });

/* tabs */
function buildTabs() {
  const nav = document.getElementById("tabs");
  ROOMS.forEach(r => nav.append(h("button", { id: `tab-${r.id}`, role: "tab", type: "button", text: r.label, onclick: () => go(r.id) })));
  window.addEventListener("hashchange", () => go(location.hash.slice(1)));
  go(location.hash.slice(1));
}
function go(id) {
  if (!state[id]) id = "woonkamer"; cur = id; sel = null; panel = panel === "budget" ? "budget" : "auto"; elev = null; tempMeasure = null; trace.tool = null; trace.pts = [];
  if (comparing) { comparing = false; svg.removeAttribute("hidden"); document.getElementById("compare").hidden = true; }
  ROOMS.forEach(r => document.getElementById(`tab-${r.id}`).setAttribute("aria-selected", String(r.id === id)));
  if (location.hash.slice(1) !== id) history.replaceState(null, "", "#" + id);
  if (!hist[id]) resetHist(id);
  draw();
}

/* =========================================================
   Start
   ========================================================= */
buildLib(); buildTabs();
(async () => {
  const t = setTimeout(() => setStatus("Opgeslagen plattegronden nog niet bereikbaar. Je kunt al tekenen.", true), 10000);
  if (!window.claude) { clearTimeout(t); setStatus("Lokale versie: opslaan, advies en downloaden werken alleen op claude.ai.", true); return; }
  const [d, s, dl, as] = await Promise.all([window.claude.use("db"), window.claude.use("sample"), window.claude.use("downloads"), window.claude.use("assets")]);
  db = d; sample = s; downloads = dl; assets = as; renderProps();
  if (!db) { clearTimeout(t); setStatus("Opslaan werkt hier niet. Open de pagina op claude.ai.", true); return; }
  db.collection("plattegrond").onSnapshot(snap => {
    snap.docs.forEach(doc => {
      const id = doc.id; const data = { ...doc.data() };
      if (id === "huis") { huis = { ...huis, ...data }; delete huis.bijgewerkt; return; }
      if (!state[id] || dirty[id] || dragging) return;
      if (doc.metadata && doc.metadata.hasPendingWrites) return;
      if (lastLocal[id] && (!data.bijgewerkt || data.bijgewerkt <= lastLocal[id])) return;
      delete data.bijgewerkt;
      state[id] = migrate(data); resetHist(id);
      if (id === cur) { if (sel && !findSel()) sel = null; delete views[id]; }
    });
    if (!dragging) draw();
    if (!snap.metadata.fromCache) { clearTimeout(t); if (!Object.values(dirty).some(Boolean)) setStatus("Alles is opgeslagen"); }
  }, () => { clearTimeout(t); setStatus("Verbinding met de opslag verbroken. Herlaad de pagina.", true); });
})();

/* =========================================================
   Lampen en lichtplan
   ========================================================= */
function drawLamp(g, it, fs, isBad, selected) {
  const col = (SOORT[it.soort] || SOORT.algemeen)[1];
  const stroke = isBad ? "var(--warn)" : selected ? "var(--accent)" : "var(--fg)"; const sw = selected || isBad ? fs * 0.2 : fs * 0.09;
  if (it.lamp === "strip" || it.lamp === "wand") { g.append(S("rect", { x: -it.w / 2, y: -it.d / 2, width: it.w, height: Math.max(4, it.d), fill: col, stroke, "stroke-width": sw, rx: 2 })); return g; }
  const r = Math.max(it.w, it.d) / 2;
  g.append(S("circle", { cx: 0, cy: 0, r, fill: col, "fill-opacity": 0.85, stroke, "stroke-width": sw }));
  const k = r * 0.55; const lines = S("g", { stroke: "#22261F", "stroke-width": Math.max(1.5, fs * 0.08), "stroke-opacity": 0.7 });
  lines.append(S("line", { x1: -k, y1: -k, x2: k, y2: k })); lines.append(S("line", { x1: -k, y1: k, x2: k, y2: -k }));
  g.append(lines);
  return g;
}
const lampItems = v => v.items.filter(i => i.type === "lamp");
/* Grove benadering: lichtbron als punt, cosinuswet op een werkvlak van 75 cm. Alleen bedoeld als schatting. */
function luxAt(x, y, lamps) {
  let e = 0;
  lamps.forEach(l => {
    const dz = Math.max(0.3, (itemH(l) - 75) / 100); const dx = (x - l.cx) / 100, dy = (y - l.cy) / 100;
    const d = Math.sqrt(dx * dx + dy * dy + dz * dz); const I = (Number(l.lumen) || 0) / (2 * Math.PI);
    e += I * dz / (d * d * d);
  });
  return e;
}
function lightStats(room = R(), v = V(room), roomId = cur) {
  const lamps = lampItems(v); const bb = bbox(room); let n = 0, dark = 0, sum = 0; const cells = [];
  for (let x = bb.x0 + 12.5; x < bb.x1; x += 25) for (let y = bb.y0 + 12.5; y < bb.y1; y += 25) {
    if (!pointInPoly([x, y], room.vorm)) continue; const e = luxAt(x, y, lamps); n++; sum += e; if (e < 50) { dark++; cells.push([x, y]); }
  }
  const area = areaM2(room); const lumen = lamps.reduce((s, l) => s + (Number(l.lumen) || 0), 0);
  const target = Math.round(area * (LUMEN_M2[roomId] || 150));
  const out = [];
  if (!lamps.length) out.push("Er staan nog geen lampen in deze kamer. Kies links onder Lampen.");
  else {
    if (lumen < target * 0.7) out.push(`Totaal ${lumen} lumen is weinig voor ${area.toFixed(1).replace(".", ",")} m²; richtwaarde ongeveer ${target} lumen (schatting).`);
    if (n && dark / n > 0.3) out.push(`Ongeveer ${Math.round(dark / n * 100)}% van de vloer krijgt weinig licht (onder 50 lux, schatting). Zie de donkere vlakken.`);
    ["algemeen", "sfeer", "werk"].forEach(s => { if (!lamps.some(l => (l.soort || "algemeen") === s)) out.push(`Geen ${SOORT[s][0].toLowerCase()} gepland.`); });
    const sockets = room.vastePunten.filter(p => p.type === "stopcontact").map(p => { const g = vpGeom(room, p); return add(g.p0, g.w.n, 10); });
    const points = room.vastePunten.filter(p => p.type === "lichtpunt");
    lamps.forEach(l => {
      if (["vloer", "lees", "tafel"].includes(l.lamp)) {
        if (!sockets.length) out.push(`${l.naam}: teken je stopcontacten in (Kamer en muren) om te zien of er een in de buurt zit.`);
        else if (Math.min(...sockets.map(s => Math.hypot(s[0] - l.cx, s[1] - l.cy))) > 150) out.push(`${l.naam} staat verder dan 1,5 m van een stopcontact; dan loopt er een snoer over de vloer.`);
      }
      if (l.lamp === "hang") {
        if (!points.length) out.push(`${l.naam}: teken het lichtpunt aan het plafond in om te zien of hij erboven hangt.`);
        else if (Math.min(...points.map(p => Math.hypot(p.x - l.cx, p.y - l.cy))) > 40) out.push(`${l.naam} hangt niet onder een lichtpunt. Verplaats hem, of gebruik een verlegset (haak en kabel).`);
      }
    });
  }
  return { lamps, lumen, target, avg: n ? sum / n : 0, darkPct: n ? dark / n : 0, cells, out: [...new Set(out)] };
}
function drawLight(g, room, v, key, fs) {
  const st = lightStats(room, v);
  const dark = S("g", { "clip-path": `url(#clip-${key})` });
  st.cells.forEach(([x, y]) => dark.append(S("rect", { x: x - 12.5, y: y - 12.5, width: 25.5, height: 25.5, fill: "#000000", opacity: 0.3 })));
  g.append(dark);
  const defs = g.querySelector("defs");
  st.lamps.forEach(l => {
    const col = (SOORT[l.soort] || SOORT.algemeen)[1]; const id = `glow-${key}-${l.id}`;
    const grad = S("radialGradient", { id }); grad.append(S("stop", { offset: "0%", "stop-color": col, "stop-opacity": 0.55 })); grad.append(S("stop", { offset: "100%", "stop-color": col, "stop-opacity": 0 }));
    defs.append(grad);
    const r = clamp(Math.sqrt(Number(l.lumen) || 0) * 6 * (itemH(l) > 200 ? 0.8 : 1), 60, 420);
    g.append(S("circle", { cx: l.cx, cy: l.cy, r, fill: `url(#${id})`, "clip-path": `url(#clip-${key})` }));
  });
}
function renderLightPanel() {
  const st = lightStats();
  put(h("h2", { text: "Lichtplan" }),
    h("p", { class: "hint", text: "Zet lampen neer uit de lijst links (Lampen). Gele gloed is algemeen licht, oranje sfeerlicht, blauw werklicht. Donkere vlakken krijgen weinig licht. Alle lux- en lumenwaarden zijn grove schattingen." }),
    h("dl", { class: "light-stats" },
      h("dt", { text: "Lampen" }), h("dd", { text: String(st.lamps.length) }),
      h("dt", { text: "Totaal lumen" }), h("dd", { text: String(st.lumen) }),
      h("dt", { text: "Richtwaarde (schatting)" }), h("dd", { text: String(st.target) }),
      h("dt", { text: "Gemiddeld op tafelhoogte" }), h("dd", { text: Math.round(st.avg) + " lux" }),
      h("dt", { text: "Vloer onder 50 lux" }), h("dd", { text: Math.round(st.darkPct * 100) + "%" })),
    ["algemeen", "sfeer", "werk"].map(s => { const ls = st.lamps.filter(l => (l.soort || "algemeen") === s); return ls.length ? h("div", { class: "field" }, h("h3", { text: SOORT[s][0] }), h("div", { class: "list" }, ls.map(l => h("button", { type: "button", onclick: () => { sel = { kind: "item", id: l.id }; draw(); } }, l.naam, h("span", { text: `${l.lumen || 0} lm${l.dimbaar ? " · dimbaar" : ""}` }))))) : null; }),
    st.out.length ? h("h3", { text: "Let op" }) : null,
    st.out.length ? h("ul", { class: "warnlist" }, st.out.map(t => h("li", { text: t }))) : null);
}

/* =========================================================
   Meetlint
   ========================================================= */
function drawMaten(g, room, o, px, fs) {
  const list = (room.maten || []).map(m => ({ ...m }));
  if (o.interactive && tempMeasure) list.push({ ...tempMeasure, temp: true });
  list.forEach(m => {
    const L = Math.hypot(m.b[0] - m.a[0], m.b[1] - m.a[1]); if (L < 1) return;
    const col = m.temp ? "var(--accent)" : "var(--fg)"; const u = o.interactive ? px : fs / 12;
    const dir = [(m.b[0] - m.a[0]) / L, (m.b[1] - m.a[1]) / L], nrm = [-dir[1], dir[0]];
    g.append(S("line", { x1: m.a[0], y1: m.a[1], x2: m.b[0], y2: m.b[1], stroke: col, "stroke-width": 1.8 * u }));
    [m.a, m.b].forEach(p => g.append(S("line", { x1: p[0] - nrm[0] * 7 * u, y1: p[1] - nrm[1] * 7 * u, x2: p[0] + nrm[0] * 7 * u, y2: p[1] + nrm[1] * 7 * u, stroke: col, "stroke-width": 1.8 * u })));
    const mx = (m.a[0] + m.b[0]) / 2, my = (m.a[1] + m.b[1]) / 2; const t = `${Math.round(L)} cm`; const bw = (7.5 * t.length + 10) * u;
    g.append(S("rect", { x: mx - bw / 2, y: my - 10 * u, width: bw, height: 20 * u, rx: 4 * u, fill: m.temp ? "var(--accent)" : "var(--surface)", stroke: col, "stroke-width": 1.2 * u }));
    g.append(S("text", { x: mx, y: my, "font-family": "JetBrains Mono, Consolas, monospace", "font-size": 12.5 * u, fill: m.temp ? "var(--surface)" : "var(--fg)", "text-anchor": "middle", "dominant-baseline": "middle" }, t));
  });
}
function renderMeasurePanel() {
  const r = R(); const len = m => Math.round(Math.hypot(m.b[0] - m.a[0], m.b[1] - m.a[1]));
  put(h("h2", { text: "Meetlint" }),
    h("p", { class: "hint", text: "Sleep in de plattegrond om te meten, in stappen van 5 cm. Houd Shift ingedrukt om vrij te meten." }),
    tempMeasure ? h("p", {}, h("strong", { text: `${len(tempMeasure)} cm` })) : null,
    tempMeasure ? h("button", { class: "btn sm primary", type: "button", text: "Maat vastzetten", onclick: () => { r.maten = r.maten || []; r.maten.push({ id: uid(), a: tempMeasure.a, b: tempMeasure.b }); tempMeasure = null; save(); draw(); } }) : null,
    (r.maten || []).length ? h("h3", { text: "Vastgezette maten (klik om te wissen)" }) : null,
    (r.maten || []).length ? h("div", { class: "list" }, r.maten.map(m => h("button", { type: "button", onclick: () => { r.maten = r.maten.filter(x => x.id !== m.id); save(); draw(); } }, `${len(m)} cm`, h("span", { text: "wis" })))) : null,
    h("button", { class: "btn sm", type: "button", text: "Meetlint uit", onclick: () => { measuring = false; tempMeasure = null; draw(); } }));
}

/* =========================================================
   Wandaanzicht
   ========================================================= */
function wallItems(room, v, i) {
  const w = walls(room)[i]; if (!w) return [];
  return v.items.filter(it => it.type !== "kleed" && !(it.type === "lamp" && ["hang", "spot"].includes(it.lamp))).map(it => {
    const poly = itemPoly(it); const ds = poly.map(p => (p[0] - w.p[0]) * w.n[0] + (p[1] - w.p[1]) * w.n[1]);
    const ts = poly.map(p => (p[0] - w.p[0]) * w.d[0] + (p[1] - w.p[1]) * w.d[1]);
    return { it, dist: Math.min(...ds), t0: Math.min(...ts), t1: Math.max(...ts) };
  }).filter(x => x.dist <= 25 && x.t1 > 0 && x.t0 < w.len);
}
function elevProblems(room, i) {
  const out = []; const objs = (room.wandObjecten || []).filter(o => o.wand === i);
  const holes = room.openingen.filter(o => o.wand === i).map(o => ({ naam: o.type === "raam" ? "het raam" : "de deur", x0: o.pos, x1: o.pos + o.breedte, z0: o.type === "raam" ? (o.borstwering ?? 90) : 0, z1: o.type === "raam" ? (o.borstwering ?? 90) + (o.hoogte ?? 140) : (o.hoogte ?? 211) }));
  const near = wallItems(room, V(room), i);
  objs.forEach(ob => {
    if (ob.type !== "gordijn") holes.forEach(hl => { if (ob.pos < hl.x1 && ob.pos + ob.breedte > hl.x0 && ob.z < hl.z1 && ob.z + ob.hoogte > hl.z0) out.push(`${ob.naam} hangt voor ${hl.naam}.`); });
    if (ob.z + ob.hoogte > (room.hoogte || 260)) out.push(`${ob.naam} komt boven het plafond uit.`);
    near.forEach(x => { if (ob.type !== "gordijn" && ob.pos < x.t1 && ob.pos + ob.breedte > x.t0 && ob.z < itemH(x.it)) out.push(`${ob.naam} hangt achter of in ${x.it.naam} (die is ${itemH(x.it)} cm hoog).`); });
    if (ob.type === "schilderij" && !near.some(x => ob.pos < x.t1 && ob.pos + ob.breedte > x.t0) && Math.abs(ob.z + ob.hoogte / 2 - 150) > 25) out.push(`${ob.naam}: het midden hangt op ${Math.round(ob.z + ob.hoogte / 2)} cm. Boven een lege wand is ongeveer 150 cm (ooghoogte) prettig.`);
  });
  return [...new Set(out)];
}
function drawElev() {
  const room = R(), v = V(), W = walls(room), w = W[elev.i]; if (!w) { elev = null; return; }
  const H = room.hoogte || 260, L = w.len; const pad = Math.max(50, Math.max(L, H) * 0.12);
  const asp = aspect(); let vw = L + 2 * pad, vh = H + 2 * pad; if (vw / vh < asp) vw = vh * asp; else vh = vw / asp;
  const vb = { x: L / 2 - vw / 2, y: H / 2 - vh / 2, w: vw, h: vh };
  svg.setAttribute("viewBox", `${vb.x} ${vb.y} ${vb.w} ${vb.h}`);
  hitRect.setAttribute("x", vb.x); hitRect.setAttribute("y", vb.y); hitRect.setAttribute("width", vb.w); hitRect.setAttribute("height", vb.h);
  const g = layer; g.replaceChildren(); const Y = z => H - z; const fs = clamp(Math.max(L, H) / 40, 8, 20); const px = vb.w / (svg.getBoundingClientRect().width || 800);
  const mono = { "font-family": "JetBrains Mono, Consolas, monospace", "font-size": fs, fill: "var(--muted)", "text-anchor": "middle", "dominant-baseline": "middle" };
  g.append(S("rect", { x: 0, y: 0, width: L, height: H, fill: "var(--floor)", stroke: "var(--fg)", "stroke-width": 3 * px }));
  g.append(S("line", { x1: 0, y1: Y(150), x2: L, y2: Y(150), stroke: "var(--muted)", "stroke-dasharray": `${6 * px} ${5 * px}`, "stroke-width": px }));
  g.append(S("text", { ...mono, x: 4, y: Y(150) - fs * 0.7, "text-anchor": "start", "font-size": fs * 0.75 }, "ooghoogte 150"));
  room.vastePunten.filter(p => VP[p.type].wall && p.wand === elev.i).forEach(p => {
    if (p.type === "radiator") g.append(S("rect", { x: p.pos, y: Y(75), width: p.breedte, height: 60, fill: "var(--rad)", opacity: 0.85 }));
    else if (p.type === "schuin") g.append(S("polygon", { points: ptsAttr([[p.pos, Y(H)], [p.pos + p.breedte, Y(H)], [p.pos + p.breedte, Y(p.hoogte || 120)], [p.pos, Y(p.hoogte || 120)]]), fill: "var(--muted)", opacity: 0.3 }));
    else g.append(S("rect", { x: p.pos - 4, y: Y(p.type === "tv" ? 40 : 30) - 4, width: 8, height: 8, fill: "var(--fg)" }));
  });
  room.openingen.filter(o => o.wand === elev.i).forEach(o => {
    if (o.type === "raam") { const z0 = o.borstwering ?? 90, hh = o.hoogte ?? 140; g.append(S("rect", { x: o.pos, y: Y(z0 + hh), width: o.breedte, height: hh, fill: "var(--glass)", "fill-opacity": 0.35, stroke: "var(--glass)", "stroke-width": 2 * px })); g.append(S("line", { x1: o.pos + o.breedte / 2, y1: Y(z0 + hh), x2: o.pos + o.breedte / 2, y2: Y(z0), stroke: "var(--glass)", "stroke-width": px })); }
    else { const hh = o.hoogte ?? 211; g.append(S("rect", { x: o.pos, y: Y(hh), width: o.breedte, height: hh, fill: "var(--surface)", stroke: "var(--accent)", "stroke-width": 2 * px })); }
  });
  wallItems(room, v, elev.i).forEach(x => {
    const hh = itemH(x.it); const t0 = Math.max(0, x.t0), t1 = Math.min(L, x.t1);
    g.append(S("rect", { x: t0, y: Y(hh), width: t1 - t0, height: hh, fill: x.it.kleur || "var(--wood)", "fill-opacity": 0.9, stroke: "var(--fg)", "stroke-width": px }));
    if (t1 - t0 > fs * 3) g.append(S("text", { ...mono, x: (t0 + t1) / 2, y: Y(hh / 2), fill: x.it.kleur && lum(x.it.kleur) < 0.5 ? "#FFFFFF" : "var(--fg)", "font-size": fs * 0.75 }, `${x.it.naam} · ${hh}`));
  });
  (room.wandObjecten || []).filter(o => o.wand === elev.i).forEach(o => {
    const selected = sel && sel.kind === "wobj" && sel.id === o.id;
    const fill = o.kleur || (o.type === "gordijn" ? "var(--rug)" : o.type === "tv" ? "#222222" : o.type === "spiegel" ? "var(--glass)" : "var(--wood)");
    g.append(S("rect", { x: o.pos, y: Y(o.z + o.hoogte), width: o.breedte, height: Math.max(o.hoogte, 2), fill, "fill-opacity": o.type === "gordijn" ? 0.75 : 0.95, stroke: selected ? "var(--accent)" : "var(--fg)", "stroke-width": (selected ? 3 : 1) * px }));
    if (o.breedte > fs * 3 && o.hoogte > fs) g.append(S("text", { ...mono, x: o.pos + o.breedte / 2, y: Y(o.z + o.hoogte / 2), fill: (o.kleur && lum(o.kleur) < 0.5) || o.type === "tv" ? "#FFFFFF" : "var(--fg)", "font-size": fs * 0.7 }, o.naam));
    if (selected) g.append(S("text", { ...mono, x: o.pos + o.breedte / 2, y: Y(o.z) + fs * 0.9, fill: "var(--accent)", "font-size": fs * 0.75 }, `${o.z} cm van vloer`));
  });
  g.append(S("text", { ...mono, x: L / 2, y: H + pad * 0.5 }, `Muur ${wallName(elev.i)} · ${Math.round(L)} cm`));
  g.append(S("text", { ...mono, x: -pad * 0.5, y: H / 2, transform: `rotate(-90 ${-pad * 0.5} ${H / 2})` }, `${H} cm`));
}
function elevHit(p) {
  const room = R(), H = room.hoogte || 260; const z = H - p[1];
  const objs = (room.wandObjecten || []).filter(o => o.wand === elev.i && p[0] >= o.pos - 3 && p[0] <= o.pos + o.breedte + 3 && z >= o.z - 3 && z <= o.z + Math.max(o.hoogte, 6) + 3);
  objs.sort((a, b) => a.breedte * a.hoogte - b.breedte * b.hoogte);
  return objs[0] || null;
}
function addWobj(type) {
  const r = R(), d = WOBJ[type], w = walls(r)[elev.i];
  const o = { id: uid(), type, naam: d.naam, wand: elev.i, breedte: Math.min(d.b, Math.round(w.len)), hoogte: d.h, z: d.z, pos: Math.max(0, snap((w.len - d.b) / 2)) };
  if (type === "gordijn") o.hoogte = Math.max(50, (r.hoogte || 260) - 10);
  r.wandObjecten = r.wandObjecten || []; r.wandObjecten.push(o); sel = { kind: "wobj", id: o.id }; save(); draw();
}
function renderElevPanel() {
  const r = R(); const o = sel && sel.kind === "wobj" ? (r.wandObjecten || []).find(x => x.id === sel.id) : null;
  const W = walls(r);
  if (o) {
    const len = W[elev.i].len;
    put(h("h2", { text: o.naam }),
      textField("e-naam", "Naam", o.naam, x => { o.naam = x || o.naam; save(); draw(); }),
      h("div", { class: "row" }, numField("e-b", "Breedte", o.breedte, x => { o.breedte = Math.min(x, len); o.pos = clamp(o.pos, 0, len - o.breedte); save(); draw(); }), numField("e-h", "Hoogte", o.hoogte, x => { o.hoogte = x; save(); draw(); })),
      h("div", { class: "row" }, numField("e-z", "Onderkant vanaf vloer", o.z, x => { o.z = x; save(); draw(); }, "cm", 0), numField("e-pos", "Vanaf begin muur", Math.round(o.pos), x => { o.pos = clamp(x, 0, len - o.breedte); save(); draw(); }, "cm", 0)),
      h("h3", { text: "Kleur" }), swatches(PALET, o.kleur, c => { o.kleur = c; save(); draw(); }, true),
      h("div", { class: "btns" }, h("button", { class: "btn sm danger", type: "button", text: "Verwijder", onclick: () => { r.wandObjecten = r.wandObjecten.filter(x => x.id !== o.id); sel = null; save(); draw(); } }), h("button", { class: "btn sm", type: "button", text: "Klaar", onclick: () => { sel = null; draw(); } })));
    return;
  }
  const pr = elevProblems(r, elev.i); const near = wallItems(r, V(), elev.i);
  put(h("h2", { text: `Wandaanzicht muur ${wallName(elev.i)}` }),
    h("p", { class: "hint", text: "Je kijkt van binnen de kamer recht tegen de muur aan. Meubels tot 25 cm van de muur staan erop met hun hoogte. Sleep wandobjecten om ze te verplaatsen." }),
    h("h3", { text: "Aan de muur hangen" }),
    h("div", { class: "btns" }, Object.entries(WOBJ).map(([t, d]) => h("button", { class: "btn sm", type: "button", text: "+ " + d.naam, onclick: () => addWobj(t) }))),
    near.length ? h("h3", { text: "Meubels tegen deze muur" }) : null,
    near.length ? h("div", { class: "list" }, near.map(x => h("button", { type: "button", onclick: () => { elev = null; mode = "in"; sel = { kind: "item", id: x.it.id }; draw(); } }, x.it.naam, h("span", { text: `${itemH(x.it)} cm hoog` })))) : null,
    pr.length ? h("h3", { text: "Let op" }) : null, pr.length ? h("ul", { class: "warnlist" }, pr.map(t => h("li", { text: t }))) : null,
    h("div", { class: "btns" },
      h("button", { class: "btn sm", type: "button", text: "← Vorige muur", onclick: () => { elev.i = (elev.i - 1 + W.length) % W.length; sel = null; draw(); } }),
      h("button", { class: "btn sm", type: "button", text: "Volgende muur →", onclick: () => { elev.i = (elev.i + 1) % W.length; sel = null; draw(); } })),
    h("button", { class: "btn sm primary", type: "button", text: "Terug naar plattegrond", onclick: () => { elev = null; sel = null; draw(); } }));
}

/* =========================================================
   3D (isometrisch)
   ========================================================= */
function draw3d() {
  const room = R(), v = V(), bb = bbox(room), H = room.hoogte || 260;
  const cx = bb.x0 + bb.w / 2, cy = bb.y0 + bb.h / 2; const a = view3d * Math.PI / 2, ca = Math.cos(a), sa = Math.sin(a);
  const rot = (x, y) => [(x - cx) * ca - (y - cy) * sa, (x - cx) * sa + (y - cy) * ca];
  const C30 = Math.cos(Math.PI / 6), S30 = 0.5;
  const P = (x, y, z) => { const [rx, ry] = rot(x, y); return [(rx - ry) * C30, (rx + ry) * S30 - z]; };
  const depth = (x, y) => { const [rx, ry] = rot(x, y); return rx + ry; };
  const facesViewer = (nx, ny) => { const r = [nx * ca - ny * sa, nx * sa + ny * ca]; return r[0] + r[1] > 0.01; };
  const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const g = layer; g.replaceChildren();
  const quad = (pts, fill, extra = {}) => S("polygon", { points: pts.map(p => p.join(",")).join(" "), fill, stroke: "var(--fg)", "stroke-width": 1, "stroke-opacity": 0.35, "stroke-linejoin": "round", ...extra });
  g.append(quad(room.vorm.map(p => P(p[0], p[1], 0)), room.vloer || "var(--floor)"));
  const W = walls(room); const backWalls = [], frontWalls = [];
  W.forEach(w => (facesViewer(-w.n[0], -w.n[1]) ? frontWalls : backWalls).push(w));
  const wallFace = (w, hh) => [P(...w.p, 0), P(...w.q, 0), P(...w.q, hh), P(...w.p, hh)];
  backWalls.sort((A, B) => depth(...add(A.p, A.d, A.len / 2)) - depth(...add(B.p, B.d, B.len / 2))).forEach(w => {
    g.append(quad(wallFace(w, H), "var(--line)"));
    g.append(quad(wallFace(w, H), "#000000", { "fill-opacity": Math.abs(rot(w.n[0] + cx, w.n[1] + cy)[0]) > 0.5 ? 0.04 : 0.1, stroke: "none" }));
    room.vastePunten.filter(p => p.type === "radiator" && p.wand === w.i).forEach(p => { const g0 = vpGeom(room, p); g.append(quad([P(...g0.p0, 15), P(...g0.p1, 15), P(...g0.p1, 75), P(...g0.p0, 75)], "var(--rad)")); });
    room.openingen.filter(o => o.wand === w.i).forEach(o => {
      const p0 = add(w.p, w.d, o.pos), p1 = add(p0, w.d, o.breedte);
      const z0 = o.type === "raam" ? (o.borstwering ?? 90) : 0, z1 = o.type === "raam" ? z0 + (o.hoogte ?? 140) : (o.hoogte ?? 211);
      g.append(quad([P(...p0, z0), P(...p1, z0), P(...p1, z1), P(...p0, z1)], o.type === "raam" ? "var(--glass)" : "var(--wood)", { "fill-opacity": o.type === "raam" ? 0.45 : 0.7 }));
    });
    (room.wandObjecten || []).filter(o => o.wand === w.i).forEach(o => {
      const p0 = add(add(w.p, w.d, o.pos), w.n, 1), p1 = add(p0, w.d, o.breedte);
      g.append(quad([P(...p0, o.z), P(...p1, o.z), P(...p1, o.z + o.hoogte), P(...p0, o.z + o.hoogte)], o.kleur || (o.type === "tv" ? "#222222" : o.type === "gordijn" ? "var(--rug)" : o.type === "spiegel" ? "var(--glass)" : "var(--wood)")));
    });
  });
  const items = [...v.items].sort((A, B) => (SOFT.has(B.type) - SOFT.has(A.type)) || (depth(A.cx, A.cy) - depth(B.cx, B.cy)));
  items.forEach(it => {
    if (it.type === "lamp") {
      const c = P(it.cx, it.cy, itemH(it)); const col = (SOORT[it.soort] || SOORT.algemeen)[1];
      if (it.lamp === "hang") { const t = P(it.cx, it.cy, H); g.append(S("line", { x1: c[0], y1: c[1], x2: t[0], y2: t[1], stroke: "var(--fg)", "stroke-width": 1 })); }
      if (it.lamp === "vloer" || it.lamp === "lees") { const b = P(it.cx, it.cy, 0); g.append(S("line", { x1: c[0], y1: c[1], x2: b[0], y2: b[1], stroke: "var(--fg)", "stroke-width": 2 })); }
      g.append(S("circle", { cx: c[0], cy: c[1], r: 36, fill: col, opacity: 0.18 })); g.append(S("circle", { cx: c[0], cy: c[1], r: 13, fill: col, opacity: 0.95 }));
      return;
    }
    const poly = itemPoly(it); const hh = Math.max(1, itemH(it));
    const fill = it.kleur || css({ bank: "--fabric", fauteuil: "--fabric", bed: "--surface", box: "--surface", kleed: "--rug", plant: "--accent-soft" }[it.type] || "--wood");
    const n = poly.length;
    for (let i = 0; i < n; i++) {
      const p = poly[i], q = poly[(i + 1) % n]; let nx = q[1] - p[1], ny = -(q[0] - p[0]);
      const mid = [(p[0] + q[0]) / 2 - it.cx, (p[1] + q[1]) / 2 - it.cy]; if (nx * mid[0] + ny * mid[1] < 0) { nx = -nx; ny = -ny; }
      if (!facesViewer(nx, ny)) continue;
      const rn = [nx * ca - ny * sa, nx * sa + ny * ca]; const pts = [P(...p, 0), P(...q, 0), P(...q, hh), P(...p, hh)];
      g.append(quad(pts, fill, { stroke: n > 4 ? "none" : "var(--fg)" })); g.append(quad(pts, "#000000", { "fill-opacity": rn[0] > rn[1] ? 0.14 : 0.28, stroke: "none" }));
    }
    g.append(quad(poly.map(p => P(p[0], p[1], hh)), fill));
    if (Math.min(it.w, it.d) > 40 && it.type !== "kleed") { const c = P(it.cx, it.cy, hh); g.append(S("text", { x: c[0], y: c[1], "font-family": "Inter, Segoe UI, sans-serif", "font-size": 13, "font-weight": 600, fill: it.kleur && lum(it.kleur) < 0.5 ? "#FFFFFF" : "#22261F", "text-anchor": "middle", "dominant-baseline": "middle", opacity: 0.8 }, it.naam)); }
  });
  frontWalls.forEach(w => { g.append(quad(wallFace(w, 25), "var(--line)")); g.append(quad(wallFace(w, 25), "#000000", { "fill-opacity": 0.12, stroke: "none" })); });
  const all = [...room.vorm.map(p => P(p[0], p[1], 0)), ...room.vorm.map(p => P(p[0], p[1], H))];
  const xs = all.map(p => p[0]), ys = all.map(p => p[1]); const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const pad = Math.max(x1 - x0, y1 - y0) * 0.06; let vw = x1 - x0 + 2 * pad, vh = y1 - y0 + 2 * pad; const asp = aspect(); if (vw / vh < asp) vw = vh * asp; else vh = vw / asp;
  const vb = { x: (x0 + x1) / 2 - vw / 2, y: (y0 + y1) / 2 - vh / 2, w: vw, h: vh };
  svg.setAttribute("viewBox", `${vb.x} ${vb.y} ${vb.w} ${vb.h}`);
  hitRect.setAttribute("x", vb.x); hitRect.setAttribute("y", vb.y); hitRect.setAttribute("width", vb.w); hitRect.setAttribute("height", vb.h);
}
function render3dPanel() {
  const v = V();
  put(h("h2", { text: "3D-weergave" }),
    h("p", { class: "hint", text: "Een vereenvoudigd 3D-beeld met de hoogte en kleur van elk meubel. De muren aan jouw kant zijn laag getekend zodat je naar binnen kijkt. Bewerken doe je in Inrichten." }),
    h("div", { class: "btns" },
      h("button", { class: "btn sm", type: "button", text: "↺ Draai", onclick: () => { view3d = (view3d + 3) % 4; draw(); } }),
      h("button", { class: "btn sm", type: "button", text: "Draai ↻", onclick: () => { view3d = (view3d + 1) % 4; draw(); } })),
    h("h3", { text: "Hoogtes (klik om aan te passen)" }),
    v.items.length ? h("div", { class: "list" }, v.items.filter(i => i.type !== "kleed").map(i => h("button", { type: "button", onclick: () => { mode = "in"; sel = { kind: "item", id: i.id }; draw(); } }, i.naam, h("span", { text: `${itemH(i)} cm` })))) : h("p", { class: "empty", text: "Nog geen meubels." }));
}

/* =========================================================
   Onderlaag en overtrekken
   ========================================================= */
async function loadPdfJs() {
  if (window.pdfjsLib) return window.pdfjsLib;
  await new Promise((res, rej) => { const s = document.createElement("script"); s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"; s.onload = res; s.onerror = rej; document.head.append(s); });
  window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  return window.pdfjsLib;
}
async function pdfToPng(file) {
  const lib = await loadPdfJs(); const doc = await lib.getDocument({ data: await file.arrayBuffer() }).promise; const page = await doc.getPage(1);
  const vp0 = page.getViewport({ scale: 1 }); const scale = Math.min(3, 2400 / Math.max(vp0.width, vp0.height)); const vp = page.getViewport({ scale });
  const c = document.createElement("canvas"); c.width = vp.width; c.height = vp.height; await page.render({ canvasContext: c.getContext("2d"), viewport: vp }).promise;
  return await new Promise(r => c.toBlob(r, "image/png"));
}
async function chooseOnderlaag(file) {
  if (!file) return; const r = R(); const id = cur;
  setStatus("Onderlaag laden…");
  try {
    let blob = file;
    if (file.type === "application/pdf" || /\.pdf$/i.test(file.name)) blob = await pdfToPng(file);
    const url = URL.createObjectURL(blob); const img = new Image(); img.src = url; await img.decode();
    onderlaagUrl[id] = url; const bb = bbox(r);
    r.onderlaag = { asset: null, x: bb.x0, y: bb.y0, pw: img.naturalWidth, ph: img.naturalHeight, cmPerPx: bb.w / img.naturalWidth, doorzicht: 0.6, zichtbaar: true };
    if (assets) {
      try { const res = await assets.upload(blob); r.onderlaag.asset = res.id; setStatus("Onderlaag opgeslagen. Stel nu de schaal in."); }
      catch (e) { setStatus("De onderlaag staat er, maar kon niet worden opgeslagen; na herladen is hij weg.", true); }
    } else setStatus("Onderlaag geladen, maar niet opgeslagen in deze versie. Stel nu de schaal in.");
    trace.tool = "schaal"; trace.pts = []; save(); fitOnderlaag(); draw();
  } catch (e) { setStatus("Dit bestand kon niet worden geopend. Probeer een JPG of PNG, bijvoorbeeld een schermafbeelding van de PDF.", true); }
}
function fitOnderlaag() {
  const r = R(), o = r.onderlaag; if (!o) return; const bb = bbox(r);
  const x0 = Math.min(bb.x0, o.x), y0 = Math.min(bb.y0, o.y), x1 = Math.max(bb.x1, o.x + o.pw * o.cmPerPx), y1 = Math.max(bb.y1, o.y + o.ph * o.cmPerPx);
  const pad = Math.max(x1 - x0, y1 - y0) * 0.06; let w = x1 - x0 + 2 * pad, hh = y1 - y0 + 2 * pad; const asp = aspect(); if (w / hh < asp) w = hh * asp; else hh = w / asp;
  views[cur] = { x: (x0 + x1) / 2 - w / 2, y: (y0 + y1) / 2 - hh / 2, w, h: hh };
}
const orthoSnap = (prev, p) => !prev ? [snap(p[0]), snap(p[1])] : Math.abs(p[0] - prev[0]) >= Math.abs(p[1] - prev[1]) ? [snap(p[0]), prev[1]] : [prev[0], snap(p[1])];
function closeTrace() {
  let pts = trace.pts.slice(); if (pts.length < 3) { setStatus("Klik minstens drie hoeken aan.", true); return; }
  const first = pts[0], last = pts[pts.length - 1];
  if (last[0] !== first[0] && last[1] !== first[1]) {
    const prev = pts[pts.length - 2]; const lastHor = prev && prev[1] === last[1];
    pts.push(lastHor ? [last[0], first[1]] : [first[0], last[1]]);
  }
  /* dubbele en rechtlijnige tussenpunten weghalen */
  let changed = true;
  while (changed && pts.length > 3) {
    changed = false;
    for (let i = 0; i < pts.length; i++) {
      const a = pts[(i - 1 + pts.length) % pts.length], b = pts[i], c = pts[(i + 1) % pts.length];
      const same = a[0] === b[0] && a[1] === b[1]; const col = (a[0] === b[0] && b[0] === c[0]) || (a[1] === b[1] && b[1] === c[1]);
      if (same || col) { pts.splice(i, 1); changed = true; break; }
    }
  }
  if (pts.length < 4 || Math.abs(signedArea(pts)) < 10000) { setStatus("Die vorm is te klein of niet gesloten. Probeer opnieuw.", true); return; }
  const r = R(); r.vorm = pts; r.voorbeeld = false; clampAll(r); V().items.forEach(fitInside); trace.tool = null; trace.pts = []; trace.hover = null; save(); draw();
  setStatus("Vorm overgetrokken. Ongedaan maken kan met Ctrl+Z.");
}
function drawTrace(g, px) {
  if (!trace.tool || mode !== "vorm") return;
  if (trace.tool === "schaal" && trace.pts.length) {
    const a = trace.pts[0], b = trace.pts[1] || trace.hover; if (!b) return;
    g.append(S("line", { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: "var(--warn)", "stroke-width": 2.5 * px }));
    [a, b].forEach(p => g.append(S("circle", { cx: p[0], cy: p[1], r: 5 * px, fill: "var(--warn)" })));
  }
  if (trace.tool === "overtrek") {
    const pts = trace.hover && trace.pts.length ? [...trace.pts, orthoSnap(trace.pts[trace.pts.length - 1], trace.hover)] : trace.pts;
    if (pts.length > 1) g.append(S("polyline", { points: pts.map(p => p.join(",")).join(" "), fill: "none", stroke: "var(--warn)", "stroke-width": 3 * px }));
    trace.pts.forEach((p, i) => g.append(S("circle", { cx: p[0], cy: p[1], r: (i === 0 ? 8 : 5) * px, fill: i === 0 ? "var(--surface)" : "var(--warn)", stroke: "var(--warn)", "stroke-width": 2 * px })));
  }
}
function tracePointer(e, p) {
  const r = R(), o = r.onderlaag;
  if (trace.tool === "schaal") { if (trace.pts.length >= 2) trace.pts = []; trace.pts.push([p[0], p[1]]); draw(); return true; }
  if (trace.tool === "verschuif" && o) { dragging = { kind: "ond", start: p, o0: [o.x, o.y], moved: false, pid: e.pointerId }; return true; }
  if (trace.tool === "overtrek") {
    const px = pxUnit();
    if (trace.pts.length >= 3 && Math.hypot(p[0] - trace.pts[0][0], p[1] - trace.pts[0][1]) < 14 * px) { closeTrace(); return true; }
    trace.pts.push(orthoSnap(trace.pts[trace.pts.length - 1], p)); draw(); return true;
  }
  return false;
}
function renderOnderlaagSection() {
  const r = R(), o = r.onderlaag;
  const file = h("input", { type: "file", id: "p-ond", accept: "image/png,image/jpeg,image/webp,application/pdf" });
  file.addEventListener("change", () => chooseOnderlaag(file.files[0]));
  const box = h("div", { class: "field" }, h("h3", { text: "Plattegrond overtrekken" }),
    h("p", { class: "hint", text: "Kies een foto, scan of PDF van je plattegrond, bijvoorbeeld van de makelaar. Stel de schaal in en klik daarna de hoeken van de kamer aan." }),
    h("label", { for: "p-ond", text: o ? "Andere onderlaag kiezen" : "Onderlaag kiezen" }), file);
  if (!o) return box;
  if (!o.asset && !onderlaagUrl[cur]) box.append(h("p", { class: "hint", style: "color:var(--warn)", text: "De onderlaag is niet opgeslagen. Kies het bestand opnieuw." }));
  const op = h("input", { type: "range", min: "0.1", max: "1", step: "0.05", value: String(o.doorzicht ?? 0.6), id: "p-opac" });
  op.addEventListener("input", () => { o.doorzicht = Number(op.value); draw(); }); op.addEventListener("change", () => save());
  const vis = h("input", { type: "checkbox", id: "p-vis" }); vis.checked = o.zichtbaar !== false; vis.addEventListener("change", () => { o.zichtbaar = vis.checked; save(); draw(); });
  const tool = (t, label) => h("button", { class: "btn sm" + (trace.tool === t ? " primary" : ""), type: "button", text: label, onclick: () => { trace.tool = trace.tool === t ? null : t; trace.pts = []; trace.hover = null; sel = null; draw(); } });
  box.append(h("label", { class: "check", for: "p-vis" }, vis, "Onderlaag tonen"), h("label", { for: "p-opac", text: "Zichtbaarheid" }), op,
    h("div", { class: "btns" }, tool("schaal", "1. Schaal"), tool("verschuif", "2. Verschuiven"), tool("overtrek", "3. Hoeken aanklikken")));
  if (trace.tool === "schaal") {
    if (trace.pts.length < 2) box.append(h("p", { class: "hint", text: "Klik op het begin en het eind van een muur waarvan je de echte lengte weet." }));
    else {
      const measured = Math.hypot(trace.pts[1][0] - trace.pts[0][0], trace.pts[1][1] - trace.pts[0][1]);
      box.append(numField("p-cal", "Echte lengte van deze lijn (Enter)", Math.round(measured), x => {
        const k = x / measured; const a = trace.pts[0];
        o.cmPerPx *= k; o.x = a[0] + (o.x - a[0]) * k; o.y = a[1] + (o.y - a[1]) * k; trace.tool = "overtrek"; trace.pts = []; save(); fitOnderlaag(); draw();
        setStatus("Schaal ingesteld. Klik nu de hoeken van de kamer aan.");
      }));
    }
  }
  if (trace.tool === "verschuif") box.append(h("p", { class: "hint", text: "Sleep de onderlaag tot hij goed onder de kamer ligt." }));
  if (trace.tool === "overtrek") box.append(h("p", { class: "hint", text: "Klik de hoeken één voor één aan. Muren worden automatisch recht gezet. Klik op het eerste punt of op 'Vorm sluiten' om af te ronden." }),
    h("div", { class: "btns" },
      h("button", { class: "btn sm primary", type: "button", text: "Vorm sluiten", disabled: trace.pts.length < 3, onclick: closeTrace }),
      h("button", { class: "btn sm", type: "button", text: "Laatste punt weg", disabled: !trace.pts.length, onclick: () => { trace.pts.pop(); draw(); } })));
  box.append(h("button", { class: "btn sm danger", type: "button", text: "Onderlaag verwijderen", onclick: () => { r.onderlaag = null; trace.tool = null; save(); draw(); } }));
  return box;
}

/* PNG van wat er nu in beeld is (3D of wandaanzicht) */
async function exportView() {
  const vb = svg.getAttribute("viewBox").split(/\s+/).map(Number); const scale = 1600 / Math.max(vb[2], vb[3]);
  const s = S("svg", { viewBox: vb.join(" "), width: Math.round(vb[2] * scale), height: Math.round(vb[3] * scale) });
  s.append(S("rect", { x: vb[0], y: vb[1], width: vb[2], height: vb[3], fill: "var(--surface)" })); s.append(layer.cloneNode(true));
  const cs = getComputedStyle(document.documentElement);
  const xml = new XMLSerializer().serializeToString(s).replace(/var\((--[\w-]+)\)/g, (m, n) => cs.getPropertyValue(n).trim() || "#888888");
  const img = new Image(); img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(xml);
  try { await img.decode(); } catch (_) { setStatus("De afbeelding kon niet worden gemaakt.", true); return; }
  const c = document.createElement("canvas"); c.width = img.width; c.height = img.height; c.getContext("2d").drawImage(img, 0, 0);
  const name = elev ? `wand-${cur}-${wallName(elev.i).toLowerCase()}.png` : `3d-${cur}-${V().naam.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`;
  c.toBlob(b => b && offerFile(name, b), "image/png");
}
