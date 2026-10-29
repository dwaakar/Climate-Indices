// Nepal Local-Level Climate Extremes Atlas (1995-2024)
const INDEX_KB = {
  PRCPTOT: {
    code: "PRCPTOT",
    name: "Total Annual Wet-Day Rainfall",
    cat: "precip",
    unit: "mm",
    slopeUnit: "mm/yr",
    what: "Measures the total cumulative rainfall (in millimeters) received over the entire year on wet days (days with at least 1 mm of rain).",
    high: "Indicates abundant annual water volume. Where increasing significantly, it points to wetter monsoons—boosting hydropower potential and surface water, but elevating risks of slope saturation, landslides, and riverine flooding.",
    low: "Indicates a drier overall water regime (such as the trans-Himalayan rain-shadow or drying mid-hill pockets). Decreasing values signal potential stress on rain-fed farming, spring recharge, and dry-season drinking water.",
    policy: "Guide municipal water storage, irrigation canal sizing, and watershed conservation. Palikas with rising PRCPTOT require bio-engineering along rural roads and flood-resilient drainage."
  },
  SDII: {
    code: "SDII",
    name: "Simple Daily Rainfall Intensity Index",
    cat: "precip",
    unit: "mm/day",
    slopeUnit: "mm/day/yr",
    what: "Measures the average amount of rain that falls on a rainy day (total annual rainfall divided by the number of wet days).",
    high: "Rain is falling in harder, more concentrated bursts rather than gentle, steady showers. High or rising SDII means greater topsoil erosion, rapid surface runoff, and flash flood hazards.",
    low: "Rainfall is gentler and spread more evenly across wet days, allowing water to soak into the soil and recharge mountain aquifers and springs.",
    policy: "In Palikas where SDII is rising significantly (202 Palikas nationwide), prioritize check-dams, contour terracing, spring-shed recharge ponds, and larger roadside culverts."
  },
  CDD: {
    code: "CDD",
    name: "Maximum Consecutive Dry Days",
    cat: "precip",
    unit: "days",
    slopeUnit: "days/yr",
    what: "Measures the longest continuous stretch of days in a year with less than 1 mm of rainfall (the longest annual dry spell).",
    high: "Signals prolonged seasonal drought. Longer dry spells deplete soil moisture, wilt winter and pre-monsoon crops, dry up local stone spouts/springs, and create tinderbox conditions for forest fires.",
    low: "Indicates shorter dry periods with more regular moisture interruptions across the year.",
    policy: "Palikas with high or lengthening CDD (49 Palikas show significant increases, concentrated in eastern & central hills/mountains) need rainwater harvesting, drought-tolerant crop varieties, and community forest firebreaks."
  },
  R20mm: {
    code: "R20mm",
    name: "Heavy Precipitation Days (>= 20 mm)",
    cat: "precip",
    unit: "days",
    slopeUnit: "days/yr",
    what: "Counts the number of days each year when daily rainfall reaches or exceeds 20 mm.",
    high: "Frequent heavy downpour days. High or rising R20mm triggers recurring shallow landslides, rural road washouts, and agricultural waterlogging.",
    low: "Fewer heavy rain days per year, reducing frequent rain-triggered transport disruptions.",
    policy: "With 228 Palikas experiencing a statistically significant rise in R20mm, local governments must enforce slope-cut regulations on non-engineered rural roads and establish early-warning protocols."
  },
  RX7day: {
    code: "RX7day",
    name: "Maximum 7-Day Consecutive Rainfall",
    cat: "precip",
    unit: "mm",
    slopeUnit: "mm/yr",
    what: "Measures the highest 7-day rainfall accumulation in each year—capturing multi-day monsoon deluges.",
    high: "Sustained, week-long heavy rain saturates deep soil profiles, destabilizing entire hillsides (deep-seated landslides) and driving major river basin floods and sediment surges.",
    low: "Lower multi-day monsoon peaks, meaning less extreme multi-day basin inundation.",
    policy: "Critical design metric for bridges, hydropower headworks, riverbank embankments, and municipal disaster preparedness stockpiles."
  },
  R95pTOT: {
    code: "R95pTOT",
    name: "Very Wet Days Rainfall Share (>95th Percentile)",
    cat: "precip",
    unit: "%",
    slopeUnit: "%/yr",
    what: "Measures the percentage of a Palika's total annual rainfall that comes from the wettest 5% of days.",
    high: "A large share of the year's water arrives in a handful of violent storms. Most water runs off rapidly as destructive floodwater rather than recharging groundwater.",
    low: "Annual rainfall is contributed by moderate, manageable rain events rather than dominated by extreme storms.",
    policy: "High R95pTOT requires shifting from simple water-diversion to retention ponds and flood-buffer zones to capture intense storm runoff."
  },
  R99pTOT: {
    code: "R99pTOT",
    name: "Extremely Wet Days Rainfall Share (>99th Percentile)",
    cat: "precip",
    unit: "%",
    slopeUnit: "%/yr",
    what: "Measures the percentage of total annual rainfall contributed by the top 1% most extreme deluge/cloudburst days.",
    high: "Indicates high exposure to ultra-extreme, cloudburst-scale downpours that can overwhelm standard drainage and trigger catastrophic debris flows.",
    low: "Lower contribution from top-1% extreme rainfall anomalies.",
    policy: "Identifies municipalities needing climate-proofed critical infrastructure (hospitals, schools, bridges) and localized flash-flood sirens."
  },
  TMm: {
    code: "TMm",
    name: "Annual Mean Temperature",
    cat: "temp",
    unit: "°C",
    slopeUnit: "°C/yr",
    what: "Measures the average daily temperature across the entire year, reflecting the baseline thermal regime of the Palika.",
    high: "Warmer overall climate. A rising TMm (significant in 425 of 753 Palikas—with zero Palikas cooling) shifts agro-ecological belts upslope, accelerates snow/glacier melt, and increases crop water demand.",
    low: "Cooler baseline conditions typical of high-mountain Palikas.",
    policy: "Guides long-term agricultural zoning, introduction of heat-resilient seeds, vector-borne disease surveillance (e.g., dengue moving into hill districts), and cold-storage planning."
  },
  TXm: {
    code: "TXm",
    name: "Annual Mean Daytime Maximum Temperature",
    cat: "temp",
    unit: "°C",
    slopeUnit: "°C/yr",
    what: "Measures the average daily high temperature across the year.",
    high: "Higher daytime heat intensity. Increases evapotranspiration (drying out soils faster) and creates heat stress for outdoor agricultural and construction workers.",
    low: "Milder daytime highs.",
    policy: "Supports municipal heat-action plans, shaded public spaces, adjusted outdoor working hours during pre-monsoon peaks, and livestock cooling shelters."
  },
  TXgt50p: {
    code: "TXgt50p",
    name: "Warm Days Frequency (Above Median Daytime High)",
    cat: "temp",
    unit: "% of days",
    slopeUnit: "%/yr",
    what: "Measures the percentage of days in a year where the daytime high exceeds the historical 30-year median.",
    high: "Shows that unusually warm days are becoming the new normal (359 Palikas show a significant upward trend, averaging +5.4% more warm days per decade).",
    low: "Daytime temperatures remain closer to or below historical baseline norms.",
    policy: "Signals a persistent shift in the local growing season, pest survival rates, and urban cooling energy demand."
  },
  TX3TN3: {
    code: "TX3TN3",
    name: "Compound Hot Day & Warm Night Events (3+ Days)",
    cat: "temp",
    unit: "events/yr",
    slopeUnit: "events/yr",
    what: "Counts occurrences of at least 3 consecutive days where BOTH daytime highs and nighttime lows are extreme (>90th percentile).",
    high: "Dangerous compound heatwaves: because nights remain hot, the human body, livestock, and crops get no nighttime thermal recovery. Significantly increasing in 318 Palikas.",
    low: "Rare compound heatwaves; nights remain cool enough to provide relief from daytime heat.",
    policy: "Crucial public health indicator for Terai and low-elevation river valleys: requires heatwave early warnings, drinking water kiosks, and health-post readiness."
  },
  TXb3TNb3: {
    code: "TXb3TNb3",
    name: "Compound Cold Spell Events (3+ Days)",
    cat: "temp",
    unit: "events/yr",
    slopeUnit: "events/yr",
    what: "Counts occurrences of at least 3 consecutive days of extreme cold daytime highs AND cold nighttime lows (<10th percentile).",
    high: "Frequent prolonged cold waves (such as winter Shitlahar fog events in the Terai or severe frost spells in the mountains).",
    low: "Fewer prolonged cold waves. Nationwide, 115 Palikas show a statistically significant decrease in cold spells, and zero show an increase—a clear signature of winter warming.",
    policy: "While winter cold waves are declining overall, Palikas with high baseline TXb3TNb3 still require winter relief distribution (warm clothing, safe heating) for vulnerable households."
  }
};

const CLUSTER_NAMES = {
  1: { name: "Cluster 1: High-Mountain Cold & Dry", color: "#3b82f6", desc: "Cool temperatures (TMm ~4.4°C), lower total rainfall (~1,768 mm), and higher cold-spell/compound thermal sensitivity." },
  2: { name: "Cluster 2: Wet Mid-Hill & Orographic Belt", color: "#10b981", desc: "High annual rainfall (~2,642 mm), frequent heavy rain days (R20mm ~33 days), and temperate climate (TMm ~16.5°C)." },
  3: { name: "Cluster 3: Warm Terai & Dry-Spell Prone", color: "#f59e0b", desc: "Warm climate (TMm ~23.6°C), long consecutive dry spells (CDD ~62 days), and high extreme-storm share (R95pTOT ~32.6%)." }
};

let activeCat = "precip";
let activeIndex = "PRCPTOT";
let activeMode = "mean"; // mean | slope | sig | kmeans
let activeProvince = "all";
let selectedPalikaId = 10101;

let map, geojsonLayer;
const geoData = window.PALIKAS_GEOJSON;
const tsData = window.CLIMATE_TIMESERIES;

// Precompute national means and quantile breaks
const nationalMeans = {};
Object.keys(INDEX_KB).forEach(idx => {
  const vals = geoData.features.map(f => f.properties.means[idx]);
  nationalMeans[idx] = vals.reduce((a,b) => a+b, 0) / vals.length;
});

function initApp() {
  renderIndexPills();
  updateExplainerCard();
  initMap();
  selectPalika(10101, false);
  setupEventListeners();
}

function renderIndexPills() {
  const container = document.getElementById("indexPills");
  container.innerHTML = "";
  Object.values(INDEX_KB)
    .filter(item => item.cat === activeCat)
    .forEach(item => {
      const btn = document.createElement("button");
      btn.className = "index-pill" + (item.code === activeIndex ? " active" : "");
      btn.innerHTML = `<b>${item.name}</b><small>${item.code}</small>`;
      btn.title = item.name;
      btn.onclick = () => {
        activeIndex = item.code;
        renderIndexPills();
        updateExplainerCard();
        updateMapStyles();
        selectPalika(selectedPalikaId, false);
      };
      container.appendChild(btn);
    });
}

function updateExplainerCard() {
  const info = INDEX_KB[activeIndex];
  document.getElementById("expCode").textContent = info.code;
  document.getElementById("expUnit").textContent = info.unit;
  document.getElementById("expTitle").textContent = info.name;
  document.getElementById("expWhat").textContent = info.what;
  document.getElementById("expHigh").textContent = info.high;
  document.getElementById("expLow").textContent = info.low;
  document.getElementById("expPolicy").textContent = info.policy;

  // Compute national stats for this index
  let sigUp = 0, sigDown = 0;
  geoData.features.forEach(f => {
    const tr = f.properties.trends[activeIndex];
    if (tr && tr.sig) {
      if (tr.slope > 0) sigUp++;
      else if (tr.slope < 0) sigDown++;
    }
  });
  const totalSig = sigUp + sigDown;
  document.getElementById("natStatStrip").innerHTML =
    `<strong>National Snapshot (753 Palikas):</strong> 30-Yr Mean is <strong>${nationalMeans[activeIndex].toFixed(2)} ${info.unit}</strong>. ` +
    `Statistically significant trend (<em>p &lt; 0.05</em>) in <strong>${totalSig} Palikas</strong> ` +
    `(<span style="color:#15803d;font-weight:700;">↑ ${sigUp} increasing</span>, <span style="color:#b91c1c;font-weight:700;">↓ ${sigDown} decreasing</span>).`;
}

function getQuantiles(values, probs) {
  const sorted = [...values].sort((a, b) => a - b);
  return probs.map(p => {
    const pos = (sorted.length - 1) * p;
    const base = Math.floor(pos);
    const rest = pos - base;
    return sorted[base + 1] !== undefined ? sorted[base] + rest * (sorted[base + 1] - sorted[base]) : sorted[base];
  });
}

function getFeatureColor(props) {
  if (activeMode === "kmeans") {
    return CLUSTER_NAMES[props.km_cluster]?.color || "#94a3b8";
  }
  const tr = props.trends[activeIndex];
  if (activeMode === "sig") {
    if (!tr || !tr.sig) return "#e2e8f0";
    return tr.slope > 0 ? "#16a34a" : "#dc2626";
  }
  if (activeMode === "slope") {
    const s = tr ? tr.slope : 0;
    if (s > 0) {
      const maxPos = Math.max(...geoData.features.map(f => f.properties.trends[activeIndex]?.slope || 0.001), 0.001);
      const ratio = Math.min(Math.abs(s) / (maxPos * 0.65), 1);
      return interpolateColor("#dcfce7", "#15803d", ratio);
    } else {
      const minNeg = Math.min(...geoData.features.map(f => f.properties.trends[activeIndex]?.slope || -0.001), -0.001);
      const ratio = Math.min(Math.abs(s) / (Math.abs(minNeg) * 0.65), 1);
      return interpolateColor("#fee2e2", "#b91c1c", ratio);
    }
  }
  // Default: mean
  const allVals = geoData.features.map(f => f.properties.means[activeIndex]);
  const [q20, q40, q60, q80] = getQuantiles(allVals, [0.2, 0.4, 0.6, 0.8]);
  const v = props.means[activeIndex];
  const isTemp = INDEX_KB[activeIndex].cat === "temp" || activeIndex === "CDD";
  const palette = isTemp
    ? ["#fef08a", "#fdba74", "#f97316", "#dc2626", "#7f1d1d"]
    : ["#e0f2fe", "#7dd3fc", "#0284c7", "#1d4ed8", "#1e1b4b"];
  if (v <= q20) return palette[0];
  if (v <= q40) return palette[1];
  if (v <= q60) return palette[2];
  if (v <= q80) return palette[3];
  return palette[4];
}

function interpolateColor(hex1, hex2, factor) {
  const c1 = parseInt(hex1.slice(1), 16);
  const c2 = parseInt(hex2.slice(1), 16);
  const r = Math.round(((c1 >> 16) & 255) + factor * (((c2 >> 16) & 255) - ((c1 >> 16) & 255)));
  const g = Math.round(((c1 >> 8) & 255) + factor * (((c2 >> 8) & 255) - ((c1 >> 8) & 255)));
  const b = Math.round((c1 & 255) + factor * ((c2 & 255) - (c1 & 255)));
  return `rgb(${r},${g},${b})`;
}

function initMap() {
  map = L.map("map", { preferCanvas: true }).setView([28.25, 84.15], 7);
  // Basemaps that need no API key. OpenStreetMap is on by default; "No basemap" is
  // still available in the layer switcher for a clean choropleth or offline use.
  const noBase = L.layerGroup();
  const osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19, attribution: "&copy; OpenStreetMap contributors"
  });
  const topo = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
    maxZoom: 17, attribution: "&copy; OpenStreetMap contributors, SRTM | &copy; OpenTopoMap (CC-BY-SA)"
  });
  osm.addTo(map);   // OpenStreetMap is the default background
  L.control.layers({ "No basemap": noBase, "OpenStreetMap": osm, "Terrain (OpenTopoMap)": topo }, null, { position: "topright" }).addTo(map);

  geojsonLayer = L.geoJSON(geoData, {
    style: styleFeature,
    onEachFeature: (feature, layer) => {
      layer.on({
        mouseover: e => {
          if (window.__hidden && window.__hidden(feature.properties)) return;
          const l = e.target;
          l.setStyle({ weight: 2.2, color: "#0f172a" });
          const p = feature.properties;
          const tr = p.trends[activeIndex];
          const info = INDEX_KB[activeIndex];
          l.bindTooltip(
            `<strong>${p.name}</strong> (${p.district})<br/>` +
            `${activeIndex} Mean: <strong>${p.means[activeIndex]} ${info.unit}</strong><br/>` +
            `Trend: <strong>${tr.slope >= 0 ? "+" : ""}${tr.slope} ${info.slopeUnit}</strong> ` +
            `(${tr.sig ? "Significant, p=" + tr.p : "Not sig., p=" + tr.p})`,
            { sticky: true }
          ).openTooltip();
        },
        mouseout: e => {
          geojsonLayer.resetStyle(e.target);
        },
        click: () => {
          if (window.__hidden && window.__hidden(feature.properties)) return;
          selectPalika(feature.properties.id, true);
        }
      });
    }
  }).addTo(map);

  updateLegend();
}

function styleFeature(feature) {
  const p = feature.properties;
  const inProv = activeProvince === "all" || String(p.prov_id) === String(activeProvince);
  const isSelected = p.id === selectedPalikaId;
  return {
    fillColor: getFeatureColor(p),
    weight: isSelected ? 2.8 : (inProv ? 0.6 : 0.2),
    opacity: 1,
    color: isSelected ? "#0f172a" : "#475569",
    fillOpacity: inProv ? 0.78 : 0.12
  };
}

function updateMapStyles() {
  if (geojsonLayer) {
    geojsonLayer.setStyle(styleFeature);
  }
  updateLegend();
}

function updateLegend() {
  const leg = document.getElementById("mapLegend");
  const info = INDEX_KB[activeIndex];
  if (activeMode === "kmeans") {
    leg.innerHTML = `<div class="legend-title">Climate Regime Clusters (K-Means)</div>` +
      Object.values(CLUSTER_NAMES).map(c =>
        `<div class="legend-row"><span class="legend-swatch" style="background:${c.color}"></span><span>${c.name}</span></div>`
      ).join("");
    return;
  }
  if (activeMode === "sig") {
    leg.innerHTML = `<div class="legend-title">${info.code} Trend Significance (p &lt; 0.05)</div>
      <div class="legend-row"><span class="legend-swatch" style="background:#16a34a"></span><span>Significant Increase (p &lt; 0.05)</span></div>
      <div class="legend-row"><span class="legend-swatch" style="background:#dc2626"></span><span>Significant Decrease (p &lt; 0.05)</span></div>
      <div class="legend-row"><span class="legend-swatch" style="background:#e2e8f0"></span><span>No Statistically Significant Trend</span></div>`;
    return;
  }
  if (activeMode === "slope") {
    leg.innerHTML = `<div class="legend-title">${info.code} Annual Trend (${info.slopeUnit})</div>
      <div class="legend-row"><span class="legend-swatch" style="background:#15803d"></span><span>Strong Increasing Trend</span></div>
      <div class="legend-row"><span class="legend-swatch" style="background:#dcfce7"></span><span>Mild Increasing Trend</span></div>
      <div class="legend-row"><span class="legend-swatch" style="background:#fee2e2"></span><span>Mild Decreasing Trend</span></div>
      <div class="legend-row"><span class="legend-swatch" style="background:#b91c1c"></span><span>Strong Decreasing Trend</span></div>`;
    return;
  }
  const allVals = geoData.features.map(f => f.properties.means[activeIndex]);
  const [q20, q40, q60, q80] = getQuantiles(allVals, [0.2, 0.4, 0.6, 0.8]);
  const isTemp = info.cat === "temp" || activeIndex === "CDD";
  const palette = isTemp
    ? ["#fef08a", "#fdba74", "#f97316", "#dc2626", "#7f1d1d"]
    : ["#e0f2fe", "#7dd3fc", "#0284c7", "#1d4ed8", "#1e1b4b"];
  leg.innerHTML = `<div class="legend-title">${info.code} 30-Yr Mean (${info.unit})</div>
    <div class="legend-row"><span class="legend-swatch" style="background:${palette[0]}"></span><span>&le; ${q20.toFixed(1)} (Lowest 20%)</span></div>
    <div class="legend-row"><span class="legend-swatch" style="background:${palette[1]}"></span><span>${q20.toFixed(1)} – ${q40.toFixed(1)}</span></div>
    <div class="legend-row"><span class="legend-swatch" style="background:${palette[2]}"></span><span>${q40.toFixed(1)} – ${q60.toFixed(1)}</span></div>
    <div class="legend-row"><span class="legend-swatch" style="background:${palette[3]}"></span><span>${q60.toFixed(1)} – ${q80.toFixed(1)}</span></div>
    <div class="legend-row"><span class="legend-swatch" style="background:${palette[4]}"></span><span>&gt; ${q80.toFixed(1)} (Highest 20%)</span></div>`;
}

function selectPalika(pid, zoomTo = false) {
  selectedPalikaId = Number(pid);
  const feat = geoData.features.find(f => f.properties.id === selectedPalikaId);
  if (!feat) return;
  const p = feat.properties;
  const info = INDEX_KB[activeIndex];
  const tr = p.trends[activeIndex];

  document.getElementById("inspType").textContent = p.type;
  const clInfo = CLUSTER_NAMES[p.km_cluster];
  const clEl = document.getElementById("inspCluster");
  clEl.textContent = clInfo ? clInfo.name : `Cluster ${p.km_cluster}`;
  clEl.style.background = clInfo ? clInfo.color + "22" : "#ede9fe";
  clEl.style.color = clInfo ? clInfo.color : "#5b21b6";

  document.getElementById("inspName").textContent = `${p.name} (${p.district})`;
  document.getElementById("inspSub").textContent = `${p.prov_name} • Code: ${p.id} • Area: ${p.area} km²`;
  document.getElementById("tablePalikaName").textContent = p.name;

  // Plain-language executive summary
  const dirWord = tr.slope >= 0 ? "increasing" : "decreasing";
  const meanVal = p.means[activeIndex];
  const natMean = nationalMeans[activeIndex];
  const compWord = meanVal >= natMean ? "above" : "below";
  const sigSentence = tr.sig
    ? `Over the past 30 years (1995–2024), <strong>${info.code}</strong> in <strong>${p.name}</strong> has shown a <strong>statistically significant ${dirWord} trend</strong> of <strong>${tr.slope >= 0 ? "+" : ""}${tr.slope} ${info.slopeUnit}</strong> (<em>p = ${tr.p}</em>).`
    : `Over the past 30 years (1995–2024), <strong>${info.code}</strong> in <strong>${p.name}</strong> has fluctuated around its baseline with <strong>no statistically significant long-term trend</strong> (slope: ${tr.slope >= 0 ? "+" : ""}${tr.slope} ${info.slopeUnit}, <em>p = ${tr.p}</em>).`;

  document.getElementById("inspPlainSummary").innerHTML =
    `<strong>In plain words, for ${p.name}:</strong> Its 30-year average ${info.name.toLowerCase()} is <strong>${meanVal} ${info.unit}</strong> (${compWord} the national average of ${natMean.toFixed(1)} ${info.unit}). ${sigSentence}`;

  // KPI cards
  document.getElementById("kpiMean").textContent = `${meanVal} ${info.unit}`;
  const diffPct = (((meanVal - natMean) / Math.abs(natMean)) * 100).toFixed(1);
  document.getElementById("kpiNatComp").textContent = `${diffPct >= 0 ? "+" : ""}${diffPct}% vs National Mean`;

  document.getElementById("kpiSlope").textContent = `${tr.slope >= 0 ? "+" : ""}${tr.slope} ${info.slopeUnit}`;
  document.getElementById("kpiDecade").textContent = `${(tr.slope * 10) >= 0 ? "+" : ""}${(tr.slope * 10).toFixed(2)} ${info.unit} per decade`;

  const sigEl = document.getElementById("kpiSig");
  if (tr.sig) {
    sigEl.textContent = tr.slope >= 0 ? "↑ Significant Rise" : "↓ Significant Drop";
    sigEl.style.color = tr.slope >= 0 ? "#15803d" : "#b91c1c";
  } else {
    sigEl.textContent = "Not Significant";
    sigEl.style.color = "#475569";
  }
  document.getElementById("kpiPval").textContent = `p-value = ${tr.p} (${tr.sig ? "p < 0.05" : "ns"})`;

  document.getElementById("chartTitle").textContent = `${info.code} (${info.unit}) in ${p.name} (1995–2024)`;
  drawTimeSeriesChart(selectedPalikaId, activeIndex);
  renderPalikaIndicesTable(p);
  updateMapStyles();

  if (zoomTo && geojsonLayer) {
    geojsonLayer.eachLayer(l => {
      if (l.feature.properties.id === selectedPalikaId) {
        map.fitBounds(l.getBounds(), { maxZoom: 10, padding: [40, 40] });
      }
    });
  }
}

function drawTimeSeriesChart(pid, idxCode) {
  const canvas = document.getElementById("tsCanvas");
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const w = rect.width;
  const h = rect.height;
  ctx.clearRect(0, 0, w, h);

  const years = tsData.years;
  const yVals = tsData.palika_timeseries[pid][idxCode];
  const natVals = tsData.national_yearly[idxCode];
  const showNat = document.getElementById("showNatLine").checked;

  const allPlotVals = showNat ? [...yVals, ...natVals] : [...yVals];
  let minY = Math.min(...allPlotVals);
  let maxY = Math.max(...allPlotVals);
  if (maxY === minY) { maxY += 1; minY -= 1; }
  const padY = (maxY - minY) * 0.12;
  minY -= padY;
  maxY += padY;

  const pad = { top: 14, right: 16, bottom: 26, left: 46 };
  const pw = w - pad.left - pad.right;
  const ph = h - pad.top - pad.bottom;

  const xPos = i => pad.left + (i / (years.length - 1)) * pw;
  const yPos = v => pad.top + ph - ((v - minY) / (maxY - minY)) * ph;

  // Gridlines
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 1;
  ctx.fillStyle = "#64748b";
  ctx.font = "10px Inter, sans-serif";
  ctx.textAlign = "right";
  for (let g = 0; g <= 4; g++) {
    const val = minY + (g / 4) * (maxY - minY);
    const y = yPos(val);
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(w - pad.right, y);
    ctx.stroke();
    ctx.fillText(val.toFixed(1), pad.left - 6, y + 3);
  }

  // X-axis labels
  ctx.textAlign = "center";
  [1995, 2000, 2005, 2010, 2015, 2020, 2024].forEach(yr => {
    const i = years.indexOf(yr);
    if (i !== -1) {
      ctx.fillText(String(yr), xPos(i), h - 8);
    }
  });

  // National reference line
  if (showNat) {
    ctx.strokeStyle = "#94a3b8";
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    natVals.forEach((v, i) => {
      if (i === 0) ctx.moveTo(xPos(i), yPos(v));
      else ctx.lineTo(xPos(i), yPos(v));
    });
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Linear regression trend line for Palika series
  const n = yVals.length;
  const meanX = (n - 1) / 2;
  const meanY = yVals.reduce((a, b) => a + b, 0) / n;
  let num = 0, den = 0;
  for (let i = 0; i < n; i++) {
    num += (i - meanX) * (yVals[i] - meanY);
    den += (i - meanX) ** 2;
  }
  const regSlope = num / den;
  const regIntercept = meanY - regSlope * meanX;

  ctx.strokeStyle = "#f97316";
  ctx.setLineDash([6, 3]);
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(xPos(0), yPos(regIntercept));
  ctx.lineTo(xPos(n - 1), yPos(regIntercept + regSlope * (n - 1)));
  ctx.stroke();
  ctx.setLineDash([]);

  // Palika series line
  ctx.strokeStyle = "#0284c7";
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  yVals.forEach((v, i) => {
    if (i === 0) ctx.moveTo(xPos(i), yPos(v));
    else ctx.lineTo(xPos(i), yPos(v));
  });
  ctx.stroke();

  // Dots
  ctx.fillStyle = "#0369a1";
  yVals.forEach((v, i) => {
    ctx.beginPath();
    ctx.arc(xPos(i), yPos(v), 2.5, 0, Math.PI * 2);
    ctx.fill();
  });
}

function renderPalikaIndicesTable(props) {
  const tbody = document.getElementById("palikaIndicesTbody");
  tbody.innerHTML = "";
  Object.values(INDEX_KB).forEach(info => {
    const tr = props.trends[info.code];
    const m = props.means[info.code];
    const row = document.createElement("tr");
    if (info.code === activeIndex) row.className = "active-row";

    let badgeClass = "sig-none";
    let badgeText = `ns (p=${tr.p})`;
    if (tr.sig) {
      badgeClass = tr.slope >= 0 ? "sig-up" : "sig-down";
      badgeText = `${tr.slope >= 0 ? "↑ Sig" : "↓ Sig"} (p=${tr.p})`;
    }

    row.innerHTML = `
      <td><strong>${info.code}</strong></td>
      <td>${m} <span style="color:#64748b;font-size:0.7rem;">${info.unit}</span></td>
      <td>${tr.slope >= 0 ? "+" : ""}${tr.slope}</td>
      <td><span class="badge-sig ${badgeClass}">${badgeText}</span></td>
    `;
    row.onclick = () => {
      activeCat = info.cat;
      document.querySelectorAll(".cat-tab").forEach(t => {
        t.classList.toggle("active", t.dataset.cat === activeCat);
      });
      activeIndex = info.code;
      renderIndexPills();
      updateExplainerCard();
      selectPalika(selectedPalikaId, false);
    };
    tbody.appendChild(row);
  });
}

function setupEventListeners() {
  // Category tabs
  document.querySelectorAll(".cat-tab").forEach(tab => {
    tab.onclick = () => {
      activeCat = tab.dataset.cat;
      document.querySelectorAll(".cat-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const firstIdx = Object.values(INDEX_KB).find(i => i.cat === activeCat);
      if (firstIdx) activeIndex = firstIdx.code;
      renderIndexPills();
      updateExplainerCard();
      updateMapStyles();
      selectPalika(selectedPalikaId, false);
    };
  });

  // Map mode buttons
  document.querySelectorAll(".mode-btn").forEach(btn => {
    btn.onclick = () => {
      activeMode = btn.dataset.mode;
      document.querySelectorAll(".mode-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      updateMapStyles();
    };
  });

  // Province filter
  document.getElementById("provinceFilter").onchange = e => {
    activeProvince = e.target.value;
    updateMapStyles();
    if (activeProvince !== "all") {
      const provLayers = [];
      geojsonLayer.eachLayer(l => {
        if (String(l.feature.properties.prov_id) === String(activeProvince)) {
          provLayers.push(l);
        }
      });
      if (provLayers.length > 0) {
        const group = L.featureGroup(provLayers);
        map.fitBounds(group.getBounds(), { padding: [20, 20] });
      }
    } else {
      map.setView([28.25, 84.15], 7);
    }
  };

  // Reset button
  document.getElementById("resetMapBtn").onclick = () => {
    activeProvince = "all";
    document.getElementById("provinceFilter").value = "all";
    map.setView([28.25, 84.15], 7);
    updateMapStyles();
  };

  // Show national line toggle
  document.getElementById("showNatLine").onchange = () => {
    drawTimeSeriesChart(selectedPalikaId, activeIndex);
  };

  // Search box
  const searchInput = document.getElementById("palikaSearch");
  const searchDropdown = document.getElementById("searchResults");
  searchInput.oninput = () => {
    const q = searchInput.value.trim().toLowerCase();
    if (!q) {
      searchDropdown.classList.add("hidden");
      return;
    }
    const matches = geoData.features
      .filter(f =>
        f.properties.name.toLowerCase().includes(q) ||
        f.properties.district.toLowerCase().includes(q)
      )
      .slice(0, 12);

    if (matches.length === 0) {
      searchDropdown.innerHTML = `<div class="search-item">No matching Palika found</div>`;
    } else {
      searchDropdown.innerHTML = matches.map(f =>
        `<div class="search-item" data-id="${f.properties.id}">
          <strong>${f.properties.name}</strong>
          <span style="color:#64748b">${f.properties.district} (${f.properties.prov_name})</span>
        </div>`
      ).join("");
      searchDropdown.querySelectorAll(".search-item").forEach(item => {
        item.onclick = () => {
          const pid = Number(item.dataset.id);
          searchDropdown.classList.add("hidden");
          searchInput.value = "";
          selectPalika(pid, true);
        };
      });
    }
    searchDropdown.classList.remove("hidden");
  };

  document.addEventListener("click", e => {
    if (!e.target.closest(".search-box")) {
      searchDropdown.classList.add("hidden");
    }
  });

  window.addEventListener("resize", () => {
    drawTimeSeriesChart(selectedPalikaId, activeIndex);
  });
}

// Open the details drawer only when the person picks an area (click or search)
const _selectPalika = selectPalika;
selectPalika = function (id, zoomTo) {
  _selectPalika(id, zoomTo);
  if (zoomTo) document.body.classList.add("inspector-open");
};
window.addEventListener("DOMContentLoaded", () => {
  initApp();
  if (window.innerWidth < 760) map.setView([28.3, 84.1], 6);
  document.getElementById("closeInspector").onclick = () => document.body.classList.remove("inspector-open");
});
