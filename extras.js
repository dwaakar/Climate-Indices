/* Drill-down (Nepal > Province > District > Local level), safe search, compare, light/dark theme.
   Layered on top of app.js; relies on its globals (geoData, tsData, geojsonLayer, map, INDEX_KB ...). */
(function () {
  "use strict";
  const $ = id => document.getElementById(id);
  const feats = geoData.features;
  const AB = window.ADMIN_BOUNDS || { districts: { features: [] }, provinces: { features: [] } };
  const byId = {}, layerById = {};
  feats.forEach(f => (byId[f.properties.id] = f));
  const provs = [...new Map(feats.map(f => [f.properties.prov_id, f.properties.prov_name])).entries()].sort((a, b) => a[0] - b[0]);
  const dists = {};
  feats.forEach(f => {
    const p = f.properties;
    (dists[p.district] = dists[p.district] || { name: p.district, prov: p.prov_id, ids: [] }).ids.push(p.id);
  });
  const S = { lvl: "nation", prov: null, dist: null, pal: null };
  const COLORS = ["#1b6b8a", "#d97706", "#7c3aed", "#059669", "#db2777"];
  let cmp = [], cmpIdx = null, distOutline, provOutline;

  /* ---------- helpers ---------- */
  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }
  const norm = s => String(s == null ? "" : s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const title = s => String(s).toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  const num = v => (v == null || isNaN(v) ? "—" : Math.abs(v) >= 100 ? v.toFixed(0) : v.toFixed(2));
  const sgn = v => (v >= 0 ? "+" : "") + num(v);
  const provName = id => (provs.find(p => p[0] === id) || [0, ""])[1];
  const dname = n => title(n);
  function lev(a, b) {
    if (Math.abs(a.length - b.length) > 2) return 9;
    let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
      const cur = [i];
      for (let j = 1; j <= b.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = cur;
    }
    return prev[b.length];
  }

  /* ---------- visibility rules for each level ---------- */
  function vis(p) {
    if (S.lvl === "nation") return "full";
    if (S.lvl === "province") return p.prov_id === S.prov ? "full" : "hide";
    if (S.lvl === "district") return p.district === S.dist ? "full" : p.prov_id === S.prov ? "ghost" : "hide";
    return p.id === S.pal ? "full" : p.district === S.dist ? "ghost" : "hide";
  }
  window.__hidden = p => vis(p) === "hide";
  const baseStyle = styleFeature;
  styleFeature = function (f) {
    const p = f.properties, v = vis(p);
    const dark = document.documentElement.getAttribute("data-theme") === "dark";
    if (v === "full") { const s = baseStyle(f); if (dark) s.color = s.weight > 2 ? "#ffffff" : "#8aa0ab"; return s; }
    if (v === "ghost") return { fillColor: "#94a3b8", fillOpacity: dark ? 0.22 : 0.14, color: "#94a3b8", weight: 0.5, opacity: 0.7 };
    return { fill: false, stroke: false, fillOpacity: 0, opacity: 0 };
  };

  /* ---------- aggregation for district / province / Nepal ---------- */
  function agg(ids, idx) {
    let w = 0, m = 0, s = 0;
    ids.forEach(id => {
      const p = byId[id].properties, a = 1;
      w += a; m += p.means[idx] * a; s += ((p.trends[idx] || {}).slope || 0) * a;
    });
    return { mean: m / w, slope: s / w };
  }

  /* ---------- navigation ---------- */
  function boundsOf(pred) {
    let b = null;
    geojsonLayer.eachLayer(l => {
      if (!pred(l.feature.properties)) return;
      const lb = l.getBounds();
      b = b ? b.extend(lb) : L.latLngBounds(lb.getSouthWest(), lb.getNorthEast());
    });
    return b;
  }
  function fit(pred, maxZoom, drawer) {
    const b = boundsOf(pred);
    if (!b) return;
    map.fitBounds(b, { paddingTopLeft: [30, 30], paddingBottomRight: [drawer && innerWidth > 760 ? 450 : 30, 30], maxZoom: maxZoom || 12 });
  }
  const origSelect = selectPalika;
  const hint = { nation: "Click any area to zoom into its province.", province: "Click an area to zoom into its district.", district: "Click a local level to see its 30-year climate story.", palika: "" };
  function refresh() {
    const bn = $("mapBanner"); if (bn) { bn.textContent = hint[S.lvl]; bn.style.display = S.lvl === "palika" ? "none" : ""; }
    updateMapStyles();
    if (provOutline) provOutline.setStyle(provStyle);
    if (distOutline) distOutline.setStyle(distStyle);
    syncControls();
    renderLevels();
    updateCount();
  }
  function goNation() {
    S.lvl = "nation"; S.prov = S.dist = S.pal = null;
    document.body.classList.remove("inspector-open");
    map.setView([28.25, 84.15], innerWidth < 760 ? 6 : 7);
    refresh();
  }
  function goProv(pid) {
    S.lvl = "province"; S.prov = pid; S.dist = S.pal = null;
    document.body.classList.remove("inspector-open");
    refresh(); fit(p => p.prov_id === pid, 9);
  }
  function goDist(name) {
    S.lvl = "district"; S.dist = name; S.prov = dists[name].prov; S.pal = null;
    document.body.classList.remove("inspector-open");
    refresh(); fit(p => p.district === name, 10);
  }
  function goPal(id) {
    const p = byId[id].properties;
    S.lvl = "palika"; S.pal = id; S.dist = p.district; S.prov = p.prov_id;
    origSelect(id, false);
    document.body.classList.add("inspector-open");
    refresh(); fit(q => q.id === id, 11, true);
    updateCmpBtn();
  }
  selectPalika = function (id, zoomTo) {
    if (!zoomTo) { origSelect(id, false); renderLevels(); updateCmpBtn(); return; }
    const p = byId[id].properties;
    if (S.lvl === "nation") goProv(p.prov_id);
    else if (S.lvl === "province") goDist(p.district);
    else goPal(id);
  };

  /* ---------- outlines (province / district borders) ---------- */
  const ink = () => (document.documentElement.getAttribute("data-theme") === "dark" ? "#e2e8f0" : "#0f172a");
  const provStyle = f => {
    const on = S.lvl === "nation" || f.properties.id === S.prov;
    return { fill: false, color: ink(), weight: on ? 2.2 : 0, opacity: on ? 0.85 : 0, interactive: false };
  };
  const distStyle = f => {
    const p = f.properties;
    const on = (S.lvl === "province" && p.prov_id === S.prov) || ((S.lvl === "district" || S.lvl === "palika") && p.name === S.dist);
    return { fill: false, color: ink(), weight: S.lvl === "province" ? 1.4 : 2.4, opacity: on ? 0.8 : 0, interactive: false };
  };

  /* ---------- dropdowns + breadcrumb ---------- */
  function fill(sel, first, items, val) {
    sel.textContent = "";
    sel.appendChild(new Option(first, ""));
    items.forEach(([v, t]) => sel.appendChild(new Option(t, v)));
    sel.value = val == null ? "" : String(val);
  }
  function syncControls() {
    fill($("provSel"), "All of Nepal", provs.map(([id, n]) => [id, n]), S.prov);
    const dsel = $("distSel"), psel = $("palSel");
    dsel.disabled = !S.prov; psel.disabled = !S.dist;
    const dl = Object.values(dists).filter(d => d.prov === S.prov).sort((a, b) => a.name.localeCompare(b.name));
    fill(dsel, S.prov ? "All districts" : "Pick a province first", dl.map(d => [d.name, dname(d.name)]), S.dist);
    const pl = S.dist ? dists[S.dist].ids.map(id => byId[id].properties).sort((a, b) => a.name.localeCompare(b.name)) : [];
    fill(psel, S.dist ? "All local levels" : "Pick a district first", pl.map(p => [p.id, p.name + " (" + p.type + ")"]), S.pal);
    const cr = $("crumbs"); cr.textContent = "";
    const parts = [["Nepal", goNation]];
    if (S.prov) parts.push([provName(S.prov), () => goProv(S.prov)]);
    if (S.dist) parts.push([dname(S.dist), () => goDist(S.dist)]);
    if (S.pal) parts.push([byId[S.pal].properties.name, null]);
    parts.forEach(([t, fn], i) => {
      if (i) cr.appendChild(el("span", "", "›"));
      if (i === parts.length - 1) cr.appendChild(el("span", "here", t));
      else { const b = el("button", "", t); b.onclick = fn; cr.appendChild(b); }
    });
  }

  /* ---------- levels panel: local level vs district vs province vs Nepal ---------- */
  function renderLevels() {
    const card = $("levelsCard");
    if (!card) return;
    card.textContent = "";
    const p = byId[selectedPalikaId] && byId[selectedPalikaId].properties;
    if (!p) return;
    const idx = activeIndex, info = INDEX_KB[idx];
    const rows = [
      [p.name + " (local level)", { mean: p.means[idx], slope: (p.trends[idx] || {}).slope || 0 }, true],
      [dname(p.district) + " district", agg(dists[p.district].ids, idx)],
      [p.prov_name, agg(feats.filter(f => f.properties.prov_id === p.prov_id).map(f => f.properties.id), idx)],
      ["All of Nepal", agg(feats.map(f => f.properties.id), idx)]
    ];
    const t = el("table"), hd = el("tr");
    ["Area", "Average", "Change / yr"].forEach(h => hd.appendChild(el("th", "", h)));
    t.appendChild(hd);
    rows.forEach(([n, v, me]) => {
      const r = el("tr", me ? "me" : ""); r.appendChild(el("td", "", n));
      r.appendChild(el("td", "", num(v.mean) + " " + info.unit)); r.appendChild(el("td", "", sgn(v.slope)));
      t.appendChild(r);
    });
    card.appendChild(t);
    const sorted = feats.map(f => f.properties.means[idx]).sort((a, b) => b - a);
    const rank = sorted.findIndex(v => v <= p.means[idx]) + 1;
    card.appendChild(el("div", "rank", "Ranks #" + rank + " of " + feats.length + " local levels for this measure (1 = highest). District and province figures are simple averages of their local levels."));
  }

  /* ---------- search (province, district, local level) ---------- */
  const entries = [];
  provs.forEach(([id, n]) => entries.push({ t: "Province", n, k: norm(n), go: () => goProv(id) }));
  Object.values(dists).forEach(d => entries.push({ t: "District", n: dname(d.name), k: norm(d.name), sub: provName(d.prov), go: () => goDist(d.name) }));
  const dupCount = {};
  feats.forEach(f => { const k = norm(f.properties.name); dupCount[k] = (dupCount[k] || 0) + 1; });
  feats.forEach(f => {
    const p = f.properties;
    entries.push({ t: "Local level", n: p.name, k: norm(p.name), sub: dname(p.district) + " district, " + p.prov_name, id: p.id, dup: dupCount[norm(p.name)] > 1, go: () => goPal(p.id) });
  });
  const order = { Province: 0, District: 1, "Local level": 2 };

  function runSearch(raw, palOnly) {
    const q = norm(String(raw || "").slice(0, 60));
    if (!q) return { empty: true, list: [] };
    const out = [];
    entries.forEach(e => {
      if (palOnly && e.t !== "Local level") return;
      let s = 9;
      if (e.k === q) s = 0; else if (e.k.startsWith(q)) s = 1; else if (e.k.includes(q)) s = 2;
      else if (q.length >= 4) {
        const tol = q.length > 6 ? 2 : 1;
        if (lev(e.k, q) <= tol || e.k.split(" ").some(w => lev(w, q) <= tol)) s = 3;
      }
      if (s < 9) out.push({ e, s });
    });
    out.sort((a, b) => a.s - b.s || order[a.e.t] - order[b.e.t] || a.e.n.localeCompare(b.e.n));
    return { empty: false, list: out.slice(0, 12).map(o => o.e) };
  }

  let hl = [];
  function clearHl() { hl.forEach(id => layerById[id] && geojsonLayer.resetStyle(layerById[id])); hl = []; }
  function setHl(ids) {
    clearHl();
    ids.forEach(id => { const l = layerById[id]; if (l) { l.setStyle({ color: "#f59e0b", weight: 3.5, opacity: 1 }); l.bringToFront(); hl.push(id); } });
  }

  function wireSearch(input, box, palOnly, onPick) {
    let active = -1, items = [], t;
    const close = () => { box.classList.add("hidden"); input.setAttribute("aria-expanded", "false"); active = -1; clearHl(); };
    function render() {
      try {
        const r = runSearch(input.value, palOnly);
        box.textContent = ""; items = []; active = -1; clearHl();
        if (r.empty) {
          if (!input.value.trim()) return close();
          box.appendChild(el("div", "search-empty", "Please type the name using English letters, for example “Pokhara”."));
          box.classList.remove("hidden"); return;
        }
        if (!r.list.length) {
          const raw = input.value.trim();
          const msg = /[^\x00-\x7F]/.test(raw) && !norm(raw) ? "Please type the name using English letters, for example “Pokhara”." : "No match found. Check the spelling, or use the Province › District › Local level menus above.";
          box.appendChild(el("div", "search-empty", msg));
        } else {
          const dupNames = [...new Set(r.list.filter(e => e.dup).map(e => e.n))];
          if (dupNames.length) {
            box.appendChild(el("div", "search-note", "⚠ More than one local level is named " + dupNames.map(n => "“" + n + "”").join(", ") + ". Please choose the right one from this list using the district shown below each name. Spelling can differ, so if yours is missing, try another spelling or search by district."));
            setHl(r.list.filter(e => e.dup).map(e => e.id));
          }
          r.list.forEach(e => {
            const it = el("div", "search-item" + (e.dup ? " dup" : ""));
            it.setAttribute("role", "option"); it.tabIndex = -1;
            const b = el("strong", "", e.n); b.appendChild(el("span", "tag", e.t));
            it.appendChild(b);
            if (e.sub) it.appendChild(el("span", "", e.sub)).style.cssText = "color:var(--muted);font-size:.8rem";
            it.onmousedown = ev => { ev.preventDefault(); pick(e); };
            box.appendChild(it); items.push({ it, e });
          });
        }
        box.classList.remove("hidden"); input.setAttribute("aria-expanded", "true");
      } catch (err) { box.textContent = ""; box.appendChild(el("div", "search-empty", "Search hit a problem. Please try a different word.")); box.classList.remove("hidden"); }
    }
    function pick(e) { close(); input.value = ""; onPick(e); input.blur(); }
    input.addEventListener("input", () => { clearTimeout(t); t = setTimeout(render, 120); });
    input.addEventListener("blur", () => setTimeout(close, 150));
    input.addEventListener("keydown", ev => {
      if (ev.key === "Escape") { close(); input.value = ""; return; }
      if (!items.length) return;
      if (ev.key === "ArrowDown" || ev.key === "ArrowUp") {
        ev.preventDefault();
        active = (active + (ev.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
        items.forEach((x, i) => x.it.classList.toggle("active", i === active));
        items[active].it.scrollIntoView({ block: "nearest" });
      } else if (ev.key === "Enter") {
        ev.preventDefault();
        if (active >= 0) pick(items[active].e);
        else if (items.length === 1) pick(items[0].e);   // several matches: make the user choose
      }
    });
  }

  /* ---------- compare ---------- */
  function updateCount() { $("cmpCount").textContent = cmp.length; }
  function updateCmpBtn() {
    const b = $("addCmpBtn"); if (!b) return;
    const has = cmp.includes(selectedPalikaId);
    b.textContent = has ? "✓ In comparison (remove)" : cmp.length >= 5 ? "Comparison is full (5 of 5)" : "+ Add to comparison";
    b.disabled = !has && cmp.length >= 5;
  }
  function toggleCmp(id) {
    if (cmp.includes(id)) cmp = cmp.filter(x => x !== id);
    else if (cmp.length < 5) cmp.push(id);
    updateCount(); updateCmpBtn(); renderCmp();
  }
  function renderCmp() {
    const chips = $("cmpChips"), body = $("cmpBody");
    chips.textContent = ""; body.textContent = "";
    cmp.forEach((id, i) => {
      const p = byId[id].properties, c = el("span", "chip");
      const dot = el("i"); dot.style.background = COLORS[i];
      const x = el("button", "", "✕"); x.setAttribute("aria-label", "Remove " + p.name); x.onclick = () => toggleCmp(id);
      c.append(dot, document.createTextNode(p.name + " (" + dname(p.district) + ")"), x); chips.appendChild(c);
    });
    if (cmp.length < 2) {
      body.appendChild(el("div", "cmp-empty", cmp.length ? "Add at least one more local level to compare." : "Search above to add local levels, or open one on the map and choose “Add to comparison”."));
      return;
    }
    const idx = cmpIdx, info = INDEX_KB[idx];
    const cv = el("canvas"); cv.id = "cmpCanvas"; body.appendChild(cv);
    const maxMean = Math.max(...cmp.map(id => byId[id].properties.means[idx]));
    const t = el("table", "cmp-table"), hd = el("tr");
    ["", "Local level", "District", "30-year average (" + info.unit + ")", "Change per year", "Is the change real?"].forEach(h => hd.appendChild(el("th", "", h)));
    t.appendChild(hd);
    cmp.forEach((id, i) => {
      const p = byId[id].properties, tr = p.trends[idx] || {}, r = el("tr");
      const d = el("td"); const dot = el("i"); dot.style.cssText = "display:inline-block;width:.8rem;height:.8rem;border-radius:50%;background:" + COLORS[i]; d.appendChild(dot);
      const m = el("td", "", num(p.means[idx])); const bar = el("div", "bar"); bar.style.cssText = "background:" + COLORS[i] + ";width:" + Math.max(3, (p.means[idx] / maxMean) * 100) + "%"; m.appendChild(bar);
      const sig = el("td", "", tr.sig ? (tr.slope >= 0 ? "↑ Rising" : "↓ Falling") : "No clear change");
      r.append(d, el("td", "", p.name), el("td", "", dname(p.district)), m, el("td", "", sgn(tr.slope || 0) + " " + info.slopeUnit), sig);
      t.appendChild(r);
    });
    body.appendChild(t);
    drawCmp(cv, idx);
  }
  function drawCmp(cv, idx) {
    const dpr = window.devicePixelRatio || 1, W = cv.clientWidth || 800, H = 290;
    cv.width = W * dpr; cv.height = H * dpr;
    const c = cv.getContext("2d"); c.scale(dpr, dpr); c.clearRect(0, 0, W, H);
    const yrs = tsData.years, series = cmp.map(id => tsData.palika_timeseries[id][idx]);
    const all = series.flat(), lo = Math.min(...all), hi = Math.max(...all), pad = (hi - lo) * 0.08 || 1;
    const L0 = 52, R0 = W - 14, T0 = 14, B0 = H - 28, mn = lo - pad, mx = hi + pad;
    const X = i => L0 + (i / (yrs.length - 1)) * (R0 - L0), Y = v => B0 - ((v - mn) / (mx - mn)) * (B0 - T0);
    c.font = "11px sans-serif"; c.fillStyle = "#475569"; c.strokeStyle = "#e2e8f0"; c.lineWidth = 1;
    for (let g = 0; g <= 4; g++) {
      const v = mn + ((mx - mn) * g) / 4, y = Y(v);
      c.beginPath(); c.moveTo(L0, y); c.lineTo(R0, y); c.stroke(); c.textAlign = "right"; c.fillText(num(v), L0 - 6, y + 4);
    }
    c.textAlign = "center";
    yrs.forEach((y, i) => { if (i % 5 === 0 || i === yrs.length - 1) c.fillText(y, X(i), H - 8); });
    series.forEach((s, k) => {
      c.strokeStyle = COLORS[k]; c.lineWidth = 2.2; c.beginPath();
      s.forEach((v, i) => (i ? c.lineTo(X(i), Y(v)) : c.moveTo(X(i), Y(v)))); c.stroke();
    });
  }
  function openCmp() {
    if (!cmp.length && S.pal) cmp.push(S.pal);
    $("cmpModal").classList.remove("hidden"); renderCmp(); updateCount(); updateCmpBtn();
    $("cmpClose").focus();
  }

  /* ---------- theme ---------- */
  function setTheme(t, save) {
    document.documentElement.setAttribute("data-theme", t);
    $("themeBtn").textContent = t === "dark" ? "☀ Light mode" : "☾ Dark mode";
    if (save) { try { localStorage.setItem("atlas-theme", t); } catch (e) {} }
    try { drawTimeSeriesChart(selectedPalikaId, activeIndex); } catch (e) {}
    try { refresh(); } catch (e) {}
  }
  (function initTheme() {
    let t = null;
    try { t = localStorage.getItem("atlas-theme"); } catch (e) {}
    if (t !== "dark" && t !== "light") t = window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", t);
  })();

  /* ---------- init ---------- */
  window.addEventListener("DOMContentLoaded", () => {
    geojsonLayer.eachLayer(l => (layerById[l.feature.properties.id] = l));
    provOutline = L.geoJSON(AB.provinces, { style: provStyle, interactive: false }).addTo(map);
    distOutline = L.geoJSON(AB.districts, { style: distStyle, interactive: false }).addTo(map);
    $("provSel").onchange = e => (e.target.value ? goProv(Number(e.target.value)) : goNation());
    $("distSel").onchange = e => (e.target.value ? goDist(e.target.value) : goProv(S.prov));
    $("palSel").onchange = e => (e.target.value ? goPal(Number(e.target.value)) : goDist(S.dist));
    $("resetMapBtn").addEventListener("click", goNation);
    $("openCmp").onclick = openCmp;
    $("cmpClose").onclick = () => $("cmpModal").classList.add("hidden");
    $("cmpModal").addEventListener("keydown", e => { if (e.key === "Escape") $("cmpModal").classList.add("hidden"); });
    $("addCmpBtn").onclick = () => toggleCmp(selectedPalikaId);
    fill($("cmpIndex"), "", Object.values(INDEX_KB).map(i => [i.code, i.name + " (" + i.code + ")"]), activeIndex);
    $("cmpIndex").remove(0); cmpIdx = activeIndex; $("cmpIndex").value = cmpIdx;
    $("cmpIndex").onchange = e => { cmpIdx = e.target.value; renderCmp(); };
    // replace the original search box with the safer one
    const old = $("palikaSearch"), fresh = old.cloneNode(true);
    old.replaceWith(fresh);
    wireSearch(fresh, $("searchResults"), false, e => e.go());
    wireSearch($("cmpSearch"), $("cmpResults"), true, e => { if (!cmp.includes(e.id) && cmp.length < 5) toggleCmp(e.id); });
    $("themeBtn").onclick = () => setTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark", true);
    setTheme(document.documentElement.getAttribute("data-theme"), false);
    refresh(); updateCmpBtn();
  });
})();
