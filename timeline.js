/* Year-by-year map mode with smooth, Zoom Earth-style colour transitions.
   Layered on app.js / extras.js: it only adds a new map mode ("year") and does not change the other modes. */
(function () {
  "use strict";
  const $ = id => document.getElementById(id);
  const feats = geoData.features, N = tsData.years.length, Y0 = tsData.years[0];
  const PAL_RAIN = ["#e0f2fe", "#7dd3fc", "#0284c7", "#1d4ed8", "#1e1b4b"];   // same palettes as the other modes
  const PAL_TEMP = ["#fef08a", "#fdba74", "#f97316", "#dc2626", "#7f1d1d"];
  let pos = 0, playing = false, raf = 0, lastT = 0, lastPaint = 0;
  const cache = {};

  const pal = idx => (INDEX_KB[idx].cat === "temp" || idx === "CDD" ? PAL_TEMP : PAL_RAIN);
  // Colour breaks come from every palika-year value, so one colour means the same amount in every year.
  function stats(idx) {
    if (cache[idx]) return cache[idx];
    const vals = [];
    feats.forEach(f => { const s = tsData.palika_timeseries[f.properties.id]; if (s && s[idx]) s[idx].forEach(v => vals.push(v)); });
    const q = getQuantiles(vals, [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]);
    return (cache[idx] = { stops: [q[0], q[2], q[4], q[6], q[8]], breaks: [q[1], q[3], q[5], q[7]] });
  }
  function valueAt(id, idx, p) {
    const s = tsData.palika_timeseries[id], arr = s && s[idx];
    if (!arr) return null;
    const i = Math.min(N - 1, Math.floor(p)), f = p - i;
    return arr[i] + (arr[Math.min(N - 1, i + 1)] - arr[i]) * f;   // blend between two years = smooth motion
  }
  function colorFor(props) {
    const v = valueAt(props.id, activeIndex, pos);
    if (v == null) return "#e2e8f0";
    const st = stats(activeIndex).stops, pl = pal(activeIndex);
    if (v <= st[0]) return pl[0];
    for (let k = 1; k < 5; k++) if (v <= st[k]) return interpolateColor(pl[k - 1], pl[k], (v - st[k - 1]) / (st[k] - st[k - 1] || 1));
    return pl[4];
  }

  /* ---- plug the new mode into the existing map ---- */
  const origColor = getFeatureColor;
  getFeatureColor = function (props) { return activeMode === "year" ? colorFor(props) : origColor(props); };

  const origLegend = updateLegend;
  updateLegend = function () {
    if (activeMode !== "year") return origLegend();
    const leg = $("mapLegend"), info = INDEX_KB[activeIndex], b = stats(activeIndex).breaks, pl = pal(activeIndex), f = v => v.toFixed(1);
    const rows = [
      ["≤ " + f(b[0]) + " (Lowest 20%)", pl[0]], [f(b[0]) + " – " + f(b[1]), pl[1]], [f(b[1]) + " – " + f(b[2]), pl[2]],
      [f(b[2]) + " – " + f(b[3]), pl[3]], ["> " + f(b[3]) + " (Highest 20%)", pl[4]]
    ];
    leg.textContent = "";
    const t = document.createElement("div"); t.className = "legend-title"; t.textContent = activeIndex + " each year (" + info.unit + ")"; leg.appendChild(t);
    rows.forEach(([label, col]) => {
      const r = document.createElement("div"); r.className = "legend-row";
      const sw = document.createElement("span"); sw.className = "legend-swatch"; sw.style.background = col;
      const tx = document.createElement("span"); tx.textContent = label; r.append(sw, tx); leg.appendChild(r);
    });
  };

  const origUpdate = updateMapStyles;
  updateMapStyles = function () { origUpdate(); syncBar(); };

  /* ---- slider, labels and animation ---- */
  function syncBar() {
    const on = activeMode === "year";
    $("yearBar").classList.toggle("hidden", !on);
    document.body.classList.toggle("year-mode", on);
    if (!on && playing) stop();
    if (window.map || typeof map !== "undefined") { setTimeout(() => { map.invalidateSize(); if (window.__refitIfNation) window.__refitIfNation(); }, 0); }
  }
  function label() { $("yearLabel").textContent = Y0 + Math.round(pos); $("yearSlider").value = pos; }
  function paint() {
    geojsonLayer.eachLayer(l => {
      const p = l.feature.properties;
      if (window.__hidden && window.__hidden(p)) return;
      l.setStyle({ fillColor: colorFor(p) });
    });
  }
  function setPos(p) { pos = Math.max(0, Math.min(N - 1, p)); label(); paint(); }
  function stop() { playing = false; cancelAnimationFrame(raf); $("yearPlay").textContent = "▶ Play"; }
  function play() {
    if (pos >= N - 1 - 1e-6) pos = 0;
    playing = true; lastT = performance.now(); $("yearPlay").textContent = "❚❚ Pause";
    raf = requestAnimationFrame(tick);
  }
  function tick(t) {
    if (!playing) return;
    pos += ((t - lastT) / 1000) * Number($("yearSpeed").value); lastT = t;
    if (pos >= N - 1) { pos = N - 1; label(); paint(); stop(); return; }
    if (t - lastPaint > 30) { lastPaint = t; label(); paint(); }
    raf = requestAnimationFrame(tick);
  }

  window.addEventListener("DOMContentLoaded", () => {
    $("yearPlay").onclick = () => (playing ? stop() : play());
    $("yearSlider").addEventListener("input", e => { if (playing) stop(); setPos(Number(e.target.value)); });
    $("yearSlider").addEventListener("change", e => setPos(Math.round(Number(e.target.value))));   // snap to a whole year on release
    document.addEventListener("keydown", e => {
      if (activeMode !== "year" || e.target.matches("input[type=text],select,textarea")) return;
      if (e.key === " " && e.target.tagName !== "BUTTON") { e.preventDefault(); playing ? stop() : play(); }
    });
    // while in this mode, the hover tooltip shows the value for the year on screen
    geojsonLayer.eachLayer(l => l.on("mouseover", () => {
      if (activeMode !== "year") return;
      const p = l.feature.properties; if (window.__hidden && window.__hidden(p)) return;
      const v = valueAt(p.id, activeIndex, Math.round(pos)), info = INDEX_KB[activeIndex];
      l.setTooltipContent("<strong>" + p.name + "</strong> (" + p.district + ")<br/>" + activeIndex + " in " + (Y0 + Math.round(pos)) + ": <strong>" + (v == null ? "n/a" : v.toFixed(2)) + " " + info.unit + "</strong>");
    }));
    syncBar(); label();
  });
})();
