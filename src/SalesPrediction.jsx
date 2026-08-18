import React, { useState, useMemo, useEffect } from "react";
import {
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  ZAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";

/* ================================================================== */
/* DATA — the marketing-mix research, unchanged                        */
/* ================================================================== */
export const SALES_DATA = {
  best_model_name: "Gradient Boosting",
  final_metrics: { MAE: 0.3993, RMSE: 0.5237, R2: 0.9913 },
  model_comparison: [
    { model: "Gradient Boosting", MAE: 0.3993, RMSE: 0.5237, R2_test: 0.9913, R2_train: 0.9995, R2_cv_mean: 0.9832, R2_cv_std: 0.0112 },
    { model: "Random Forest", MAE: 0.4562, RMSE: 0.5671, R2_test: 0.9898, R2_train: 0.9968, R2_cv_mean: 0.9829, R2_cv_std: 0.0114 },
    { model: "Lasso Regression", MAE: 0.6695, RMSE: 0.8986, R2_test: 0.9744, R2_train: 0.9656, R2_cv_mean: 0.9572, R2_cv_std: 0.0281 },
    { model: "Linear Regression", MAE: 0.6718, RMSE: 0.9025, R2_test: 0.9742, R2_train: 0.9656, R2_cv_mean: 0.957, R2_cv_std: 0.0283 },
    { model: "Ridge Regression", MAE: 0.6718, RMSE: 0.9025, R2_test: 0.9742, R2_train: 0.9656, R2_cv_mean: 0.957, R2_cv_std: 0.0283 },
  ],
  feature_importance: [
    { feature: "TV x Radio", importance: 0.9189 },
    { feature: "TV", importance: 0.0764 },
    { feature: "Newspaper", importance: 0.0037 },
    { feature: "Radio", importance: 0.001 },
  ],
  actual_vs_predicted_sample: [
    { actual: 16.9, predicted: 16.81 }, { actual: 22.4, predicted: 22.61 }, { actual: 21.4, predicted: 21.26 },
    { actual: 7.3, predicted: 6.5 }, { actual: 24.7, predicted: 23.84 }, { actual: 12.6, predicted: 12.18 },
    { actual: 22.3, predicted: 22.64 }, { actual: 8.4, predicted: 9.56 }, { actual: 11.5, predicted: 11.66 },
    { actual: 14.9, predicted: 15.43 }, { actual: 9.5, predicted: 8.05 }, { actual: 8.7, predicted: 8.71 },
    { actual: 11.9, predicted: 12.04 }, { actual: 5.3, predicted: 4.23 }, { actual: 10.3, predicted: 10.13 },
    { actual: 11.7, predicted: 12.17 }, { actual: 5.5, predicted: 5.91 }, { actual: 16.6, predicted: 16.36 },
    { actual: 11.3, predicted: 11.08 }, { actual: 18.9, predicted: 18.92 }, { actual: 19.7, predicted: 19.86 },
    { actual: 12.5, predicted: 12.23 }, { actual: 10.9, predicted: 10.37 }, { actual: 22.2, predicted: 22.13 },
    { actual: 9.3, predicted: 9.77 }, { actual: 8.1, predicted: 8.87 }, { actual: 21.7, predicted: 22.26 },
    { actual: 13.4, predicted: 12.66 }, { actual: 10.6, predicted: 10.69 }, { actual: 5.7, predicted: 5.45 },
    { actual: 10.6, predicted: 11.61 }, { actual: 11.3, predicted: 11.01 }, { actual: 23.7, predicted: 23.23 },
    { actual: 8.7, predicted: 8.51 }, { actual: 16.1, predicted: 15.86 }, { actual: 20.7, predicted: 20.72 },
    { actual: 11.6, predicted: 11.91 }, { actual: 20.8, predicted: 20.73 }, { actual: 11.9, predicted: 12.17 },
    { actual: 6.9, predicted: 7.22 },
  ],
  correlation_with_sales: { TV: 0.782, Radio: 0.576, Newspaper: 0.228, "TV x Radio": 0.964 },
  dataset_shape: { rows: 200, columns: 4 },
  channels: ["TV", "Radio", "Newspaper"],
  channel_means: { TV: 147.0, Radio: 23.3, Newspaper: 30.6 },
  feature_ranges: { TV: [0, 300], Radio: [0, 50], Newspaper: [0, 114] },
  budget_scenarios: [
    { scenario: "Print heavy", type: "Print-led", TV: 20, Radio: 20, Newspaper: 160, sales: 8.34 },
    { scenario: "All-in on TV", type: "TV-led", TV: 180, Radio: 10, Newspaper: 10, sales: 12.42 },
    { scenario: "All-in on radio", type: "Radio-led", TV: 10, Radio: 180, Newspaper: 10, sales: 13.93 },
    { scenario: "Current avg split", type: "Baseline", TV: 147, Radio: 23, Newspaper: 31, sales: 13.96 },
    { scenario: "TV heavy + radio", type: "Coordinated", TV: 140, Radio: 50, Newspaper: 10, sales: 18.44 },
    { scenario: "Balanced TV/radio", type: "Coordinated", TV: 100, Radio: 100, Newspaper: 0, sales: 22.33 },
  ],
  linear_model_export: {
    intercept: 6.72841,
    coefficients: { TV: 0.01907, Radio: 0.02799, Newspaper: 0.00144, TV_x_Radio: 0.00109 },
  },
};

/* ================================================================== */
/* DESIGN TOKENS — "Signal Room": a broadcast control-room reading of   */
/* the three ad channels (TV, radio, print) as live monitored signals. */
/* ================================================================== */
const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;1,400;1,500&family=JetBrains+Mono:wght@400;500;700&display=swap');`;

const C = {
  paper: "#0A0E17",
  card: "#121A2C",
  cardShade: "#182338",
  rule: "#2A3550",
  ruleFaint: "#1C2540",
  ink: "#EDF1FA",
  inkSoft: "#9AA7C7",
  inkFaint: "#5C6889",
  red: "#FF6B5C",
  redDeep: "#E14A3B",
  green: "#2FD9A8",
  greenDeep: "#1FAE86",
  gold: "#FFB020",
  goldDeep: "#DB8F0A",
  wire: "#4CC3FF",
};

const MODEL_COLORS = [C.red, C.ink, C.gold, C.green, C.inkFaint];

const SCENARIO_COLORS = {
  "Print heavy": C.gold,
  "All-in on TV": C.red,
  "All-in on radio": C.green,
  "Current avg split": C.inkFaint,
  "TV heavy + radio": C.goldDeep,
  "Balanced TV/radio": C.wire,
};

const CURRENCIES = {
  USD: { code: "USD", symbol: "$", rate: 1, locale: "en-US" },
  PKR: { code: "PKR", symbol: "₨", rate: 278, locale: "en-PK" },
  INR: { code: "INR", symbol: "₹", rate: 83.2, locale: "en-IN" },
  EUR: { code: "EUR", symbol: "€", rate: 0.92, locale: "de-DE" },
  GBP: { code: "GBP", symbol: "£", rate: 0.79, locale: "en-GB" },
  AED: { code: "AED", symbol: "د.إ", rate: 3.67, locale: "ar-AE" },
  CAD: { code: "CAD", symbol: "CA$", rate: 1.37, locale: "en-CA" },
  AUD: { code: "AUD", symbol: "A$", rate: 1.52, locale: "en-AU" },
  JPY: { code: "JPY", symbol: "¥", rate: 149, locale: "ja-JP" },
};
const CURRENCY_ORDER = ["USD", "PKR", "INR", "EUR", "GBP", "AED", "CAD", "AUD", "JPY"];

function useViewport() {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1280);
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return { width, isMobile: width < 720, isTablet: width >= 720 && width < 1040 };
}

const tooltipStyle = {
  background: C.card,
  border: `1px solid ${C.rule}`,
  borderRadius: 8,
  fontSize: 12,
  fontFamily: "'IBM Plex Sans', sans-serif",
  color: C.ink,
  boxShadow: "0 8px 24px -8px rgba(0,0,0,0.6)",
};

/* ================================================================== */
/* SMALL BUILDING BLOCKS                                              */
/* ================================================================== */
function Rule({ thick, style }) {
  return <div style={{ height: thick ? 2 : 1, background: C.rule, opacity: thick ? 1 : 0.7, ...style }} />;
}

function Kicker({ children, color = C.red }) {
  return (
    <div
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color,
      }}
    >
      {children}
    </div>
  );
}

function SectionHead({ children }) {
  return (
    <h3
      style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: 22,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.01em",
        margin: "4px 0 16px",
        color: C.ink,
      }}
    >
      {children}
    </h3>
  );
}

function PanelHead({ children }) {
  return (
    <h4
      style={{
        margin: "0 0 14px",
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: 15,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.01em",
        color: C.ink,
      }}
    >
      {children}
    </h4>
  );
}

function Badge({ children, color }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: 10,
        fontWeight: 700,
        padding: "3px 9px",
        borderRadius: 999,
        background: `${color}1A`,
        color,
        border: `1px solid ${color}55`,
        fontFamily: "'JetBrains Mono', monospace",
        letterSpacing: "0.04em",
        whiteSpace: "nowrap",
        textTransform: "uppercase",
      }}
    >
      {children}
    </span>
  );
}

function StatBlock({ label, value, note, accent = C.ink, fill }) {
  return (
    <div style={{ border: `1px solid ${C.rule}`, borderTop: `3px solid ${accent}`, borderRadius: 12, background: C.card, padding: "12px 14px 14px", minWidth: 0 }}>
      <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.inkFaint }}>{label}</div>
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 28, color: C.ink, lineHeight: 1.05, margin: "4px 0 6px" }}>
        {value}
      </div>
      <div style={{ height: 4, background: C.ruleFaint, borderRadius: 999, position: "relative", marginBottom: 6, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${Math.min(fill, 100)}%`, background: accent, boxShadow: `0 0 8px ${accent}99` }} />
      </div>
      <div style={{ fontSize: 11, color: C.inkSoft, fontFamily: "'IBM Plex Sans', sans-serif", fontStyle: "italic" }}>{note}</div>
    </div>
  );
}

function CurrencyPicker({ value, onChange, isMobile }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3, minWidth: isMobile ? "100%" : 148 }}>
      <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.inkFaint }}>Ad rates quoted in</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          background: C.card, border: `1px solid ${C.rule}`, borderRadius: 8, color: C.ink,
          padding: isMobile ? "9px 10px" : "6px 8px", fontSize: 12, fontWeight: 600, outline: "none",
          fontFamily: "'JetBrains Mono', monospace", width: "100%", WebkitAppearance: "none", appearance: "none", cursor: "pointer",
        }}
      >
        {CURRENCY_ORDER.map((code) => (
          <option key={code} value={code}>{code} — {CURRENCIES[code].symbol}</option>
        ))}
      </select>
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5, minWidth: 0 }}>
      <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.inkFaint }}>{label}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          background: C.card, border: `1px solid ${C.rule}`, borderRadius: 8, color: C.ink,
          padding: "9px 10px", fontSize: 13, outline: "none", fontFamily: "'IBM Plex Sans', sans-serif",
          fontWeight: 500, width: "100%", WebkitAppearance: "none", appearance: "none", cursor: "pointer",
        }}
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function RangeField({ label, value, onChange, min, max, accent, fmt }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <label style={{ fontSize: 11.5, fontWeight: 700, color: C.ink, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</label>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: accent, fontWeight: 700 }}>{fmt(value)}</span>
      </div>
      <input
        type="range" min={min} max={max} step={1} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ accentColor: accent, cursor: "pointer", width: "100%", touchAction: "pan-y" }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9.5, color: C.inkFaint, fontFamily: "'JetBrains Mono', monospace" }}>
        <span>{min.toLocaleString()}</span>
        <span>{max.toLocaleString()}</span>
      </div>
    </div>
  );
}

/* ================================================================== */
/* SIGNATURE ELEMENT — Signal Trace ribbon                             */
/* Six logged budget scenarios, ordered by sales outcome, drawn as an  */
/* oscilloscope-style trace. Glowing band marks the "coordinated       */
/* spend" zone where TV and radio compound.                            */
/* ================================================================== */
function SpendRibbon({ isMobile }) {
  const W = isMobile ? 340 : 1000;
  const H = isMobile ? 100 : 118;
  const padL = isMobile ? 10 : 24;
  const padR = isMobile ? 10 : 24;
  const padT = 26;
  const padB = 28;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const maxV = 25;

  const ordered = useMemo(
    () => [...SALES_DATA.budget_scenarios].sort((a, b) => a.sales - b.sales),
    []
  );
  const n = ordered.length;
  const xAt = (i) => padL + (plotW * i) / (n - 1);
  const yAt = (v) => padT + plotH - (plotH * v) / maxV;
  const linePts = ordered.map((d, i) => `${xAt(i)},${yAt(d.sales)}`).join(" ");
  const areaPts = `${xAt(0)},${yAt(0)} ${linePts} ${xAt(n - 1)},${yAt(0)}`;
  const peakIdx = n - 1;
  const bandX1 = xAt(n - 2.35);
  const bandX2 = xAt(n - 0.65);

  return (
    <div
      style={{
        background: `linear-gradient(180deg, ${C.card} 0%, #0E1626 100%)`,
        border: `1px solid ${C.rule}`,
        borderLeft: `4px solid ${C.wire}`,
        borderRadius: 14,
        boxShadow: `0 0 0 1px ${C.wire}14, 0 20px 40px -20px ${C.wire}40`,
        padding: isMobile ? "12px 8px 6px" : "16px 14px 8px",
        marginBottom: isMobile ? 16 : 22,
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: isMobile ? "0 6px" : "0 10px", marginBottom: 4 }}>
        <Kicker color={C.wire}>Signal spectrum &mdash; six logged campaigns, ranked</Kicker>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={isMobile ? 108 : 128} preserveAspectRatio="none">
        <defs>
          <linearGradient id="signalFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.red} stopOpacity="0.35" />
            <stop offset="100%" stopColor={C.red} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x={bandX1} y={padT - 10} width={bandX2 - bandX1} height={plotH + 18} fill={C.wire} opacity={0.12} rx={6} />
        <text x={(bandX1 + bandX2) / 2} y={padT - 12} textAnchor="middle" fontSize={isMobile ? 8.5 : 10} fontFamily="'JetBrains Mono', monospace" fontWeight={700} fill={C.wire} letterSpacing="0.06em">
          {isMobile ? "COORDINATED" : "COORDINATED SPEND ZONE"}
        </text>
        <line x1={padL} y1={yAt(0)} x2={W - padR} y2={yAt(0)} stroke={C.rule} strokeWidth={1} />
        <polygon points={areaPts} fill="url(#signalFill)" />
        <polyline points={linePts} fill="none" stroke={C.red} strokeWidth={2.25} strokeLinejoin="round" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 5px ${C.red}99)` }} />
        {ordered.map((d, i) => (
          <circle key={d.scenario} cx={xAt(i)} cy={yAt(d.sales)} r={i === peakIdx ? 5 : 2.8} fill={i === peakIdx ? C.wire : C.red} stroke={C.card} strokeWidth={1.5} style={i === peakIdx ? { filter: `drop-shadow(0 0 6px ${C.wire}CC)` } : undefined} />
        ))}
        <text x={xAt(peakIdx)} y={yAt(ordered[peakIdx].sales) - 10} textAnchor="end" fontSize={isMobile ? 9.5 : 11} fontFamily="'JetBrains Mono', monospace" fontWeight={700} fill={C.wire}>
          {ordered[peakIdx].sales}k
        </text>
        {ordered.map((d, i) => (
          <text key={d.scenario} x={xAt(i)} y={H - 6} textAnchor="middle" fontSize={isMobile ? 7 : 9.5} fontFamily="'JetBrains Mono', monospace" fill={C.inkSoft}>
            {isMobile ? d.scenario.split(" ")[0] : d.scenario}
          </text>
        ))}
      </svg>
    </div>
  );
}

/* ================================================================== */
/* TAB — CONSOLE (estimator)                                          */
/* ================================================================== */
function FrontPage({ isMobile, isTablet, currency, fmtSpend, tvSpend, radioSpend, paperSpend, setTvSpend, setRadioSpend, setPaperSpend, predictedSales, baselineSales, totalSpend }) {
  const delta = predictedSales - baselineSales;
  const curr = CURRENCIES[currency];
  return (
    <div style={{ display: "grid", gridTemplateColumns: isMobile || isTablet ? "1fr" : "320px 1fr", gap: isMobile ? 18 : 28 }}>
      <div>
        <Kicker>Uplink &mdash; compose the signal</Kicker>
        <SectionHead>Set the channel mix</SectionHead>
        <div style={{ border: `1px solid ${C.rule}`, borderRadius: 14, background: C.card, padding: isMobile ? 16 : 18, display: "flex", flexDirection: "column", gap: 18 }}>
          <RangeField label="TV spend" value={tvSpend} onChange={setTvSpend} min={SALES_DATA.feature_ranges.TV[0]} max={SALES_DATA.feature_ranges.TV[1]} accent={C.red} fmt={fmtSpend} />
          <RangeField label="Radio spend" value={radioSpend} onChange={setRadioSpend} min={SALES_DATA.feature_ranges.Radio[0]} max={SALES_DATA.feature_ranges.Radio[1]} accent={C.green} fmt={fmtSpend} />
          <RangeField label="Newspaper spend" value={paperSpend} onChange={setPaperSpend} min={SALES_DATA.feature_ranges.Newspaper[0]} max={SALES_DATA.feature_ranges.Newspaper[1]} accent={C.gold} fmt={fmtSpend} />
          <div style={{ borderTop: `1px solid ${C.ruleFaint}`, paddingTop: 12, display: "flex", justifyContent: "space-between", fontSize: 12.5 }}>
            <span style={{ color: C.inkSoft, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", fontSize: 10.5, letterSpacing: "0.06em" }}>Total monthly budget</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", color: C.ink, fontWeight: 700 }}>{fmtSpend(totalSpend)}</span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 16 : 22, minWidth: 0 }}>
        <div>
          <Kicker color={C.green}>Live &mdash; forecast readout</Kicker>
          <div
            style={{
              border: `1px solid ${C.rule}`,
              borderLeft: `4px solid ${C.red}`,
              borderRadius: 16,
              background: `linear-gradient(135deg, ${C.card} 0%, #0E1626 100%)`,
              boxShadow: `0 0 0 1px ${C.red}12, 0 24px 48px -24px ${C.red}55`,
              padding: isMobile ? "18px 16px" : "26px 30px",
              marginTop: 6,
            }}
          >
            <div style={{ fontSize: isMobile ? 12 : 13, fontWeight: 700, color: C.inkSoft, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'JetBrains Mono', monospace" }}>
              Predicted monthly sales
            </div>
            <div className="md-hero-value" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: isMobile ? 46 : 64, color: C.ink, margin: "6px 0 4px", lineHeight: 1, wordBreak: "break-word" }}>
              {predictedSales.toFixed(2)}k <span style={{ fontSize: isMobile ? 18 : 24, fontFamily: "'IBM Plex Sans', sans-serif", fontStyle: "italic", fontWeight: 500, color: C.inkSoft }}>units</span>
            </div>
            <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13.5, color: delta >= 0 ? C.green : C.red, margin: "6px 0 0" }}>
              {delta >= 0 ? "\u2191" : "\u2193"} {Math.abs(delta).toFixed(2)}k units {delta >= 0 ? "above" : "below"} the average historical split ({baselineSales.toFixed(2)}k)
            </p>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: C.inkFaint, margin: "10px 0 0" }}>
              OLS interaction model, R\u00B2 = 0.97 &middot; budget shown in {curr.code}, \u2248 1 USD = {curr.rate} {curr.code}
            </p>
          </div>
        </div>

        <div style={{ border: `1px solid ${C.rule}`, borderRadius: 14, background: C.card, padding: isMobile ? 12 : 20, flex: 1, minWidth: 0 }}>
          <PanelHead>Signal trace &mdash; actual vs. predicted</PanelHead>
          <div style={{ height: isMobile ? 220 : 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: isMobile ? 4 : 10, bottom: 10, left: isMobile ? -10 : 10 }}>
                <CartesianGrid strokeDasharray="2 3" stroke={C.ruleFaint} />
                <XAxis type="number" dataKey="actual" name="Actual sales" unit="k" stroke={C.inkFaint} tick={{ fontSize: isMobile ? 10 : 12 }} />
                <YAxis type="number" dataKey="predicted" name="Predicted sales" unit="k" stroke={C.inkFaint} tick={{ fontSize: isMobile ? 10 : 12 }} width={isMobile ? 40 : 50} />
                <Tooltip formatter={(v) => `${v}k units`} contentStyle={tooltipStyle} />
                <Scatter data={SALES_DATA.actual_vs_predicted_sample} fill={C.wire} opacity={0.7} />
                <ReferenceLine x={predictedSales} stroke={C.green} strokeDasharray="3 3" label={isMobile ? undefined : { value: "Current mix", fill: C.green, fontSize: 10 }} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <p style={{ fontSize: 11.5, color: C.inkSoft, fontFamily: "'IBM Plex Sans', sans-serif", fontStyle: "italic", margin: "10px 0 0" }}>
            Reading: forty test campaigns, actual sales plotted against the model's call. The green line marks where your current mix lands.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* TAB — EXPLORER (scenario sandbox, bubble map of the interaction)    */
/* ================================================================== */
function ExplorerTab({ isMobile, isTablet, selected, setSelected, fmtSpend }) {
  const scenario = SALES_DATA.budget_scenarios.find((s) => s.scenario === selected);
  const baseline = SALES_DATA.budget_scenarios.find((s) => s.scenario === "Current avg split");
  const best = SALES_DATA.budget_scenarios.reduce((a, b) => (b.sales > a.sales ? b : a));
  const delta = scenario.sales - baseline.sales;
  const color = SCENARIO_COLORS[scenario.scenario];

  const compareData = [
    { name: "This mix", sales: scenario.sales },
    { name: "Baseline avg", sales: baseline.sales },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: isMobile || isTablet ? "1fr" : "300px 1fr", gap: isMobile ? 16 : 24 }}>
      <div style={{ border: `1px solid ${C.rule}`, borderRadius: 14, background: C.card, padding: isMobile ? 16 : 18, display: "flex", flexDirection: "column", gap: 16, height: "fit-content" }}>
        <Kicker>Sandbox &mdash; tune a signal</Kicker>
        <SelectField label="Choose scenario" value={selected} onChange={setSelected} options={SALES_DATA.budget_scenarios.map((s) => s.scenario)} />

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <Badge color={color}>{scenario.type}</Badge>
          {scenario.scenario === best.scenario && <Badge color={C.wire}>Best on record</Badge>}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <StatBlock label="Predicted sales" value={`${scenario.sales}k`} note="units / month" accent={color} fill={(scenario.sales / 25) * 100} />
          <StatBlock label="vs. baseline" value={`${delta >= 0 ? "+" : ""}${delta.toFixed(2)}k`} note={delta >= 0 ? "ahead of the average split" : "behind the average split"} accent={delta >= 0 ? C.green : C.red} fill={Math.min(Math.abs(delta) * 6, 100)} />
        </div>

        <div style={{ borderTop: `1px solid ${C.ruleFaint}`, paddingTop: 12, display: "flex", flexDirection: "column", gap: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: C.inkFaint }}>TV</span><span style={{ color: C.ink }}>{fmtSpend(scenario.TV)}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: C.inkFaint }}>Radio</span><span style={{ color: C.ink }}>{fmtSpend(scenario.Radio)}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: C.inkFaint }}>Newspaper</span><span style={{ color: C.ink }}>{fmtSpend(scenario.Newspaper)}</span></div>
        </div>

        <p style={{ fontSize: 11.5, color: C.inkSoft, fontFamily: "'IBM Plex Sans', sans-serif", fontStyle: "italic", margin: 0, lineHeight: 1.5 }}>
          {scenario.type === "Coordinated"
            ? `Splitting spend between TV and radio lets the interaction term do its work \u2014 this mix runs ${delta >= 0 ? "ahead of" : "behind"} the average split.`
            : scenario.type === "Print-led"
            ? "Newspaper-heavy spend has the weakest solo pull on sales of the three channels."
            : "A single-channel mix \u2014 no interaction bonus, so it leans on that one channel's reach alone."}
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 14 : 20, minWidth: 0 }}>
        <div style={{ border: `1px solid ${C.rule}`, borderRadius: 14, background: C.card, padding: isMobile ? 12 : 20 }}>
          <PanelHead>This mix vs. the baseline split</PanelHead>
          <div style={{ height: isMobile ? 160 : 190 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={compareData} layout="vertical" margin={{ left: isMobile ? 0 : 10, right: 20, top: 4, bottom: 4 }}>
                <CartesianGrid strokeDasharray="2 3" stroke={C.ruleFaint} />
                <XAxis type="number" domain={[0, 25]} stroke={C.inkFaint} tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} tickFormatter={(v) => `${v}k`} />
                <YAxis type="category" dataKey="name" stroke={C.inkSoft} tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} width={isMobile ? 70 : 90} />
                <Tooltip formatter={(v) => `${v}k units`} contentStyle={tooltipStyle} />
                <Bar dataKey="sales" radius={[0, 6, 6, 0]}>
                  <Cell fill={color} />
                  <Cell fill={C.inkFaint} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ border: `1px solid ${C.rule}`, borderRadius: 14, background: C.card, padding: isMobile ? 12 : 20 }}>
          <PanelHead>Interaction map &mdash; TV vs. radio, bubble = sales</PanelHead>
          <div style={{ height: isMobile ? 260 : 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: isMobile ? 10 : 20, left: isMobile ? -10 : 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="2 3" stroke={C.ruleFaint} />
                <XAxis type="number" dataKey="TV" name="TV spend" domain={[0, 200]} stroke={C.inkFaint} tick={{ fontSize: isMobile ? 9 : 11, fontFamily: "JetBrains Mono" }} />
                <YAxis type="number" dataKey="Radio" name="Radio spend" domain={[0, 200]} stroke={C.inkFaint} tick={{ fontSize: isMobile ? 9 : 11, fontFamily: "JetBrains Mono" }} width={isMobile ? 30 : 40} />
                <ZAxis type="number" dataKey="sales" range={[80, 600]} name="Sales" />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  contentStyle={tooltipStyle}
                  formatter={(v, name) => (name === "Sales" ? `${v}k units` : `${v}k`)}
                  labelFormatter={() => ""}
                />
                <Scatter data={SALES_DATA.budget_scenarios} onClick={(d) => d && d.scenario && setSelected(d.scenario)} cursor="pointer">
                  {SALES_DATA.budget_scenarios.map((d) => (
                    <Cell
                      key={d.scenario}
                      fill={SCENARIO_COLORS[d.scenario]}
                      fillOpacity={d.scenario === selected ? 0.95 : 0.5}
                      stroke={d.scenario === selected ? C.ink : "transparent"}
                      strokeWidth={d.scenario === selected ? 2 : 0}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <p style={{ fontSize: 11, color: C.inkSoft, fontFamily: "'IBM Plex Sans', sans-serif", fontStyle: "italic", margin: "8px 2px 0" }}>
            Tap any bubble to load that signal. Bubbles toward the upper right \u2014 where TV and radio spend meet \u2014 post the largest sales figures.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* TAB — LEADERBOARD (model leaderboard)                              */
/* ================================================================== */
function StandingsTab({ isMobile }) {
  const modelData = useMemo(
    () => SALES_DATA.model_comparison.map((m) => ({ name: isMobile ? m.model.split(" ")[0] : m.model, R2: m.R2_test })),
    [isMobile]
  );
  return (
    <div>
      <Kicker>Leaderboard &mdash; five models, one held-out set</Kicker>
      <SectionHead>Standings</SectionHead>

      <div style={{ overflowX: "auto", marginBottom: 20, border: `1px solid ${C.rule}`, borderRadius: 14 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: isMobile ? 480 : "auto" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.rule}` }}>
              {["Rank", "Model", "R\u00B2 (test)", "MAE", "RMSE", ""].map((h, i) => (
                <th key={h} style={{ textAlign: i === 1 ? "left" : "right", padding: "10px 14px", fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.06em", color: C.inkFaint }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SALES_DATA.model_comparison.map((m, i) => {
              const gap = m.R2_train - m.R2_test;
              return (
                <tr key={m.model} style={{ borderBottom: `1px solid ${C.ruleFaint}`, background: i === 0 ? C.cardShade : C.card }}>
                  <td style={{ padding: "10px 14px", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 16, color: i === 0 ? C.red : C.inkFaint }}>{i + 1}</td>
                  <td style={{ padding: "10px 14px", fontWeight: i === 0 ? 600 : 400, color: C.ink, fontFamily: "'IBM Plex Sans', sans-serif" }}>{m.model}</td>
                  <td style={{ padding: "10px 14px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: C.ink }}>{m.R2_test.toFixed(4)}</td>
                  <td style={{ padding: "10px 14px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: C.inkSoft }}>{m.MAE.toFixed(2)}k</td>
                  <td style={{ padding: "10px 14px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: C.inkSoft }}>{m.RMSE.toFixed(2)}k</td>
                  <td style={{ padding: "10px 14px", textAlign: "right" }}>
                    {i === 0 && <Badge color={C.red}>Top model</Badge>}
                    {gap > 0.05 && <Badge color={C.gold}>Fit gap {gap.toFixed(2)}</Badge>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ border: `1px solid ${C.rule}`, borderRadius: 14, background: C.card, padding: isMobile ? 12 : 20 }}>
        <PanelHead>R\u00B2 by model, plotted</PanelHead>
        <div style={{ height: isMobile ? 260 : 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={modelData} margin={{ top: 10, right: isMobile ? 4 : 30, left: isMobile ? -20 : 0, bottom: isMobile ? 40 : 20 }}>
              <CartesianGrid strokeDasharray="2 3" stroke={C.ruleFaint} />
              <XAxis dataKey="name" stroke={C.inkSoft} interval={0} tick={{ fontSize: isMobile ? 9 : 11, angle: isMobile ? -35 : 0, textAnchor: isMobile ? "end" : "middle", fontFamily: "JetBrains Mono" }} height={isMobile ? 50 : 30} />
              <YAxis domain={[0.95, 1.0]} stroke={C.inkSoft} tick={{ fontSize: isMobile ? 10 : 12, fontFamily: "JetBrains Mono" }} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => Number(v).toFixed(4)} />
              <Bar dataKey="R2" radius={[6, 6, 0, 0]}>
                {modelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={MODEL_COLORS[index % MODEL_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* TAB — DIAGNOSTICS (feature importance + correlation)                */
/* ================================================================== */
function DriversTab({ isMobile }) {
  const correlationData = useMemo(
    () => Object.entries(SALES_DATA.correlation_with_sales).map(([feature, corr]) => ({ feature, correlation: corr })),
    []
  );
  return (
    <div>
      <Kicker>Diagnostics &mdash; what actually moves sales</Kicker>
      <SectionHead>Drivers</SectionHead>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 16 : 24 }}>
        <div style={{ border: `1px solid ${C.rule}`, borderRadius: 14, background: C.card, padding: isMobile ? 12 : 20 }}>
          <PanelHead>Feature importance</PanelHead>
          <div style={{ height: isMobile ? 240 : 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SALES_DATA.feature_importance} layout="vertical" margin={{ left: isMobile ? 0 : 30, right: isMobile ? 8 : 10 }}>
                <CartesianGrid strokeDasharray="2 3" stroke={C.ruleFaint} />
                <XAxis type="number" stroke={C.inkFaint} tick={{ fontSize: isMobile ? 9 : 12, fontFamily: "JetBrains Mono" }} />
                <YAxis type="category" dataKey="feature" stroke={C.inkSoft} tick={{ fontSize: isMobile ? 9 : 11, fontFamily: "JetBrains Mono" }} width={isMobile ? 92 : 100} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="importance" fill={C.red} radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div style={{ border: `1px solid ${C.rule}`, borderRadius: 14, background: C.card, padding: isMobile ? 12 : 20 }}>
          <PanelHead>Correlation with sales</PanelHead>
          <div style={{ height: isMobile ? 240 : 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={correlationData} layout="vertical" margin={{ left: isMobile ? 0 : 30, right: isMobile ? 8 : 10 }}>
                <CartesianGrid strokeDasharray="2 3" stroke={C.ruleFaint} />
                <XAxis type="number" domain={[0, 1]} stroke={C.inkFaint} tick={{ fontSize: isMobile ? 9 : 12, fontFamily: "JetBrains Mono" }} />
                <YAxis type="category" dataKey="feature" stroke={C.inkSoft} tick={{ fontSize: isMobile ? 9 : 11, fontFamily: "JetBrains Mono" }} width={isMobile ? 82 : 100} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="correlation" radius={[0, 6, 6, 0]}>
                  {correlationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.correlation > 0.7 ? C.red : C.gold} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* TAB — TRANSMISSIONS (scenario ranking + key findings)               */
/* ================================================================== */
function DispatchesTab({ isMobile }) {
  const findings = [
    {
      t: "Interaction beats addition",
      d: `TV \u00D7 radio alone carries ${(SALES_DATA.feature_importance[0].importance * 100).toFixed(0)}% of the model's predictive weight \u2014 the two channels compound rather than add.`,
      c: C.red,
    },
    {
      t: "Coordinated spend wins",
      d: "Splitting the same $200k budget evenly between TV and radio predicts nearly double the sales of an all-in-on-TV strategy.",
      c: C.wire,
    },
    {
      t: "Print underperforms alone",
      d: `Newspaper spend correlates weakest with sales on its own (${SALES_DATA.correlation_with_sales.Newspaper.toFixed(2)}) \u2014 most of its apparent lift is borrowed from campaigns that also ran radio.`,
      c: C.gold,
    },
  ];

  return (
    <div>
      <Kicker>Transmission log &mdash; six budget allocations, one total spend</Kicker>
      <SectionHead>Transmissions</SectionHead>
      <div style={{ border: `1px solid ${C.rule}`, borderRadius: 14, background: C.card, padding: isMobile ? 12 : 20, marginBottom: isMobile ? 16 : 22 }}>
        <PanelHead>Predicted sales by allocation, $200k total</PanelHead>
        <div style={{ height: isMobile ? 300 : 360 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={SALES_DATA.budget_scenarios} margin={{ top: 10, right: isMobile ? 4 : 10, left: isMobile ? -20 : 10, bottom: isMobile ? 65 : 40 }}>
              <CartesianGrid strokeDasharray="2 3" stroke={C.ruleFaint} />
              <XAxis dataKey="scenario" stroke={C.inkSoft} interval={0} tick={{ fontSize: isMobile ? 9 : 10, angle: -30, textAnchor: "end", fontFamily: "JetBrains Mono" }} height={isMobile ? 70 : 55} />
              <YAxis stroke={C.inkSoft} tickFormatter={(v) => `${v}k`} tick={{ fontSize: isMobile ? 10 : 12, fontFamily: "JetBrains Mono" }} />
              <Tooltip formatter={(v) => `${v}k units`} contentStyle={tooltipStyle} />
              <Bar dataKey="sales" radius={[6, 6, 0, 0]}>
                {SALES_DATA.budget_scenarios.map((entry) => (
                  <Cell key={entry.scenario} fill={SCENARIO_COLORS[entry.scenario]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ border: `1px solid ${C.rule}`, borderRadius: 14, background: C.card, padding: isMobile ? 16 : 20 }}>
        <PanelHead>Key findings</PanelHead>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 14 }}>
          {findings.map((f) => (
            <div key={f.t} style={{ borderLeft: `3px solid ${f.c}`, paddingLeft: 12 }}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 700, color: C.ink, marginBottom: 4, textTransform: "uppercase" }}>{f.t}</div>
              <div style={{ fontSize: 12, color: C.inkSoft, lineHeight: 1.55, fontFamily: "'IBM Plex Sans', sans-serif" }}>{f.d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* MAIN DASHBOARD                                                     */
/* ================================================================== */
export default function MediaDesk() {
  const { isMobile, isTablet } = useViewport();
  const [activeTab, setActiveTab] = useState("front");
  const [currency, setCurrency] = useState("USD");
  const [tvSpend, setTvSpend] = useState(150);
  const [radioSpend, setRadioSpend] = useState(23);
  const [paperSpend, setPaperSpend] = useState(31);
  const [selectedScenario, setSelectedScenario] = useState("Balanced TV/radio");

  const curr = CURRENCIES[currency];
  const fmtSpend = (usdThousands) => curr.symbol + (usdThousands * curr.rate).toLocaleString(curr.locale, { maximumFractionDigits: 0 }) + "k";

  const predictedSales = useMemo(() => {
    const { intercept, coefficients: c } = SALES_DATA.linear_model_export;
    const val = intercept + c.TV * tvSpend + c.Radio * radioSpend + c.Newspaper * paperSpend + c.TV_x_Radio * (tvSpend * radioSpend);
    return Math.max(0, val);
  }, [tvSpend, radioSpend, paperSpend]);

  const baselineSales = useMemo(() => {
    const { intercept, coefficients: c } = SALES_DATA.linear_model_export;
    const m = SALES_DATA.channel_means;
    return intercept + c.TV * m.TV + c.Radio * m.Radio + c.Newspaper * m.Newspaper + c.TV_x_Radio * (m.TV * m.Radio);
  }, []);

  const totalSpend = tvSpend + radioSpend + paperSpend;

  const sections = [
    { id: "front", label: "Console" },
    { id: "explorer", label: "Explorer" },
    { id: "standings", label: "Leaderboard" },
    { id: "drivers", label: "Diagnostics" },
    { id: "dispatches", label: "Transmissions" },
  ];

  const tickerItems = [
    `R\u00B2 ${(SALES_DATA.final_metrics.R2 * 100).toFixed(1)}% ON HELD-OUT SET`,
    `${SALES_DATA.best_model_name.toUpperCase()} LEADS THE FIELD`,
    `TV \u00D7 RADIO INTERACTION CARRIES ${(SALES_DATA.feature_importance[0].importance * 100).toFixed(0)}% OF SIGNAL`,
    `MAE ${SALES_DATA.final_metrics.MAE.toFixed(2)}K UNITS`,
    `${SALES_DATA.dataset_shape.rows} CAMPAIGNS IN CIRCULATION`,
    `NEWSPAPER SPEND CORRELATES WEAKEST, AT ${SALES_DATA.correlation_with_sales.Newspaper.toFixed(2)}`,
  ];

  return (
    <div
      style={{
        background: `radial-gradient(1100px 500px at 20% -10%, #16233F 0%, ${C.paper} 55%), ${C.paper}`,
        minHeight: "100vh",
        color: C.ink,
        fontFamily: "'IBM Plex Sans', sans-serif",
        padding: isMobile ? "14px 12px 32px" : "26px 40px 44px",
        boxSizing: "border-box",
        width: "100%",
        overflowX: "hidden",
      }}
    >
      <style>{`
        ${FONT_IMPORT}
        * { box-sizing: border-box; }
        .md-tabs::-webkit-scrollbar { display: none; }
        select { color-scheme: dark; }
        .md-ticker-track { display: inline-block; padding-left: 100%; animation: md-scroll 32s linear infinite; }
        @keyframes md-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-100%); } }
        @media (prefers-reduced-motion: reduce) { .md-ticker-track { animation: none; padding-left: 0; } }
        @media (max-width: 480px) { .md-hero-value { font-size: 46px !important; } }
        input[type=range] { height: 4px; }
      `}</style>

      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: C.inkSoft, letterSpacing: "0.06em", marginBottom: 10, flexWrap: "wrap", gap: 6 }}>
          <span>CHANNEL 01</span>
          <span>FEED: {SALES_DATA.dataset_shape.rows} CAMPAIGNS LOGGED</span>
          <span>{isMobile ? "MMX CONSOLE" : "MARKETING-MIX CONSOLE \u00B7 AUGUST 2026"}</span>
        </div>

        <Rule thick />
        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "flex-end", gap: 12, padding: "10px 0 8px" }}>
          <div>
            <h1
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: isMobile ? 40 : 62,
                letterSpacing: "-0.01em",
                textTransform: "uppercase",
                margin: 0,
                lineHeight: 0.94,
                background: `linear-gradient(90deg, ${C.ink} 0%, ${C.wire} 120%)`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Signal Room
            </h1>
            <p style={{ margin: "6px 0 0", fontFamily: "'IBM Plex Sans', sans-serif", fontStyle: "italic", fontSize: isMobile ? 13 : 15, color: C.inkSoft }}>
              A live control room for TV, radio &amp; print spend &mdash; what each signal actually buys in sales
            </p>
          </div>
          <CurrencyPicker value={currency} onChange={setCurrency} isMobile={isMobile} />
        </div>
        <Rule thick />

        <div style={{ background: "#060A13", border: `1px solid ${C.ruleFaint}`, borderRadius: 10, color: C.inkSoft, overflow: "hidden", padding: "7px 0", marginTop: 6, whiteSpace: "nowrap" }} aria-hidden="true">
          <div className="md-ticker-track" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: "0.04em" }}>
            {tickerItems.concat(tickerItems).map((t, i) => (
              <span key={i} style={{ marginRight: 36 }}>{t} <span style={{ color: C.gold }}>&#9679;</span></span>
            ))}
          </div>
        </div>

        <div className="md-tabs" style={{ display: "flex", gap: 0, marginTop: 18, marginBottom: 18, overflowX: isMobile ? "auto" : "visible", WebkitOverflowScrolling: "touch", scrollbarWidth: "none", borderBottom: `1px solid ${C.rule}` }}>
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveTab(s.id)}
              style={{
                flexShrink: 0, background: "transparent", color: activeTab === s.id ? C.ink : C.inkFaint,
                border: "none", borderBottom: `3px solid ${activeTab === s.id ? C.wire : "transparent"}`,
                padding: isMobile ? "10px 14px" : "8px 18px", fontWeight: 700, fontSize: 12.5, cursor: "pointer",
                textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "'JetBrains Mono', monospace",
                transition: "color 0.15s ease",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, minmax(0, 1fr))" : "repeat(4, minmax(0, 1fr))", gap: isMobile ? 8 : 14, marginBottom: isMobile ? 16 : 20 }}>
          <StatBlock label="Best model R\u00B2" value={`${(SALES_DATA.final_metrics.R2 * 100).toFixed(1)}%`} note={SALES_DATA.best_model_name} accent={C.red} fill={SALES_DATA.final_metrics.R2 * 100} />
          <StatBlock label="Mean abs. error" value={`${SALES_DATA.final_metrics.MAE.toFixed(2)}k`} note="Held-out test set" accent={C.gold} fill={72} />
          <StatBlock label="Root mean sq. error" value={`${SALES_DATA.final_metrics.RMSE.toFixed(2)}k`} note="Held-out test set" accent={C.green} fill={65} />
          <StatBlock label="Interaction weight" value={`${(SALES_DATA.feature_importance[0].importance * 100).toFixed(0)}%`} note="Share held by TV \u00D7 radio" accent={C.wire} fill={SALES_DATA.feature_importance[0].importance * 100} />
        </div>

        <SpendRibbon isMobile={isMobile} />

        {activeTab === "front" && (
          <FrontPage
            isMobile={isMobile} isTablet={isTablet} currency={currency} fmtSpend={fmtSpend}
            tvSpend={tvSpend} radioSpend={radioSpend} paperSpend={paperSpend}
            setTvSpend={setTvSpend} setRadioSpend={setRadioSpend} setPaperSpend={setPaperSpend}
            predictedSales={predictedSales} baselineSales={baselineSales} totalSpend={totalSpend}
          />
        )}
        {activeTab === "explorer" && (
          <ExplorerTab isMobile={isMobile} isTablet={isTablet} selected={selectedScenario} setSelected={setSelectedScenario} fmtSpend={fmtSpend} />
        )}
        {activeTab === "standings" && <StandingsTab isMobile={isMobile} />}
        {activeTab === "drivers" && <DriversTab isMobile={isMobile} />}
        {activeTab === "dispatches" && <DispatchesTab isMobile={isMobile} />}

        <Rule style={{ marginTop: 30, marginBottom: 8 }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.inkFaint, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.04em" }}>
          <span>SIGNAL ROOM</span>
          <span>MODEL: {SALES_DATA.best_model_name.toUpperCase()} &middot; n = {SALES_DATA.dataset_shape.rows}</span>
        </div>
      </div>
    </div>
  );
}