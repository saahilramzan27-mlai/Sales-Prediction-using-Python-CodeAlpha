import React, { useState, useMemo, useEffect } from "react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
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
  ReferenceArea,
  ReferenceLine,
  Cell,
} from "recharts";

/* ================================================================== */
/* DATA — cleaned from Unemployment_in_India.csv (CMIE, Jan–Oct 2020) */
/* ================================================================== */
const DATA = {
  months: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
  ],
  national_series: [
    9.2, 9.27, 10.78, 22.24, 23.24, 10.91, 9.83, 10.31, 8.71, 8.03,
  ],
  state_series: {
    "Andhra Pradesh": [
      5.48, 5.83, 5.79, 20.51, 17.43, 3.31, 8.34, 6.96, 6.4, 6.59,
    ],
    Assam: [4.66, 4.41, 4.77, 11.06, 9.55, 0.6, 3.77, 5.53, 1.19, 3.02],
    Bihar: [
      10.61, 10.29, 15.43, 46.64, 45.96, 17.82, 12.79, 13.44, 11.91, 9.82,
    ],
    Chhattisgarh: [
      9.65, 8.38, 7.54, 3.41, 10.5, 14.23, 10.27, 5.63, 1.96, 6.62,
    ],
    Delhi: [22.23, 14.84, 17.04, 16.68, 42.27, 18.19, 20.3, 13.79, 12.53, 6.27],
    Goa: [8.89, 2.81, 5.25, 13.31, 21.25, 9.96, 17.07, 16.21, 15.38, 11.54],
    Gujarat: [5.54, 6.38, 6.66, 18.71, 12.11, 3.2, 1.84, 1.87, 3.42, 4.03],
    Haryana: [
      20.34, 25.77, 25.05, 43.22, 29.02, 26.7, 24.18, 33.5, 19.68, 27.31,
    ],
    "Himachal Pradesh": [
      16.83, 16.84, 18.76, 2.2, 26.95, 13.47, 24.31, 15.79, 12.04, 13.46,
    ],
    "Jammu & Kashmir": [
      21.08,
      20.78,
      15.5,
      null,
      18.74,
      17.92,
      10.88,
      11.09,
      16.17,
      16.14,
    ],
    Jharkhand: [
      10.61, 11.85, 8.23, 47.09, 59.23, 20.95, 7.63, 9.76, 8.24, 11.8,
    ],
    Karnataka: [2.86, 3.61, 3.46, 29.84, 19.97, 8.44, 4.01, 0.5, 2.41, 1.58],
    Kerala: [5.31, 7.6, 8.99, 16.99, 17.88, 9.71, 7.09, 10.98, 5.91, 3.88],
    "Madhya Pradesh": [
      4.11, 4.57, 2.22, 12.36, 21.98, 6.48, 5.08, 4.7, 3.91, 3.13,
    ],
    Maharashtra: [4.95, 4.69, 5.79, 20.9, 15.46, 9.23, 3.89, 6.23, 4.55, 4.1],
    Meghalaya: [1.66, 3.59, 1.58, 10.03, 5.92, 1.15, 2.1, 3.74, 4.29, 4.6],
    Odisha: [1.9, 3.12, 13.08, 23.76, 11.41, 3.77, 1.88, 1.42, 2.1, 2.18],
    Puducherry: [0.58, 1.76, 1.2, 75.85, 58.19, 4.24, 15.47, 5.05, 10.9, 6.18],
    Punjab: [11.11, 10.97, 10.32, 2.86, 28.33, 16.55, 9.19, 10.99, 9.61, 9.88],
    Rajasthan: [
      10.97, 15.16, 11.9, 17.7, 15.74, 14.39, 15.81, 17.51, 15.35, 24.15,
    ],
    Sikkim: [null, null, 23.57, 2.28, 24.51, 4.46, 4.45, 12.49, 5.7, 0.88],
    "Tamil Nadu": [1.57, 2.09, 6.4, 49.83, 33.16, 12.2, 6.81, 2.65, 5.0, 2.16],
    Telangana: [5.49, 8.29, 5.77, 6.25, 14.7, 10.55, 5.36, 5.79, 3.27, 2.86],
    Tripura: [
      32.67, 28.4, 29.95, 41.23, 21.51, 21.71, 18.24, 27.92, 17.35, 11.57,
    ],
    "Uttar Pradesh": [
      7.58, 8.98, 10.11, 21.54, 20.41, 9.47, 5.56, 5.79, 4.18, 3.75,
    ],
    Uttarakhand: [
      5.49, 4.99, 19.85, 6.48, 8.01, 8.61, 12.38, 14.26, 22.26, 9.23,
    ],
    "West Bengal": [
      6.94, 4.92, 6.92, 17.41, 17.41, 7.29, 6.83, 14.87, 9.35, 9.98,
    ],
  },
  state_meta: {
    "Andhra Pradesh": {
      zone: "South",
      lat: 15.9129,
      lon: 79.74,
      avg_rate: 8.66,
      avg_lfpr: 38.96,
      avg_employed: 15425480,
      pre_rate: 5.7,
      post_rate: 9.93,
      peak_rate: 20.51,
      peak_month: "Apr",
      impact: 4.23,
    },
    Assam: {
      zone: "Northeast",
      lat: 26.2006,
      lon: 92.9376,
      avg_rate: 4.86,
      avg_lfpr: 43.5,
      avg_employed: 10810276,
      pre_rate: 4.61,
      post_rate: 4.96,
      peak_rate: 11.06,
      peak_month: "Apr",
      impact: 0.35,
    },
    Bihar: {
      zone: "East",
      lat: 25.0961,
      lon: 85.3131,
      avg_rate: 19.47,
      avg_lfpr: 37.17,
      avg_employed: 23606828,
      pre_rate: 12.11,
      post_rate: 22.63,
      peak_rate: 46.64,
      peak_month: "Apr",
      impact: 10.52,
    },
    Chhattisgarh: {
      zone: "West",
      lat: 21.2787,
      lon: 81.8661,
      avg_rate: 7.82,
      avg_lfpr: 41.16,
      avg_employed: 8421349,
      pre_rate: 8.52,
      post_rate: 7.52,
      peak_rate: 14.23,
      peak_month: "Jun",
      impact: -1.0,
    },
    Delhi: {
      zone: "North",
      lat: 28.7041,
      lon: 77.1025,
      avg_rate: 18.41,
      avg_lfpr: 35.86,
      avg_employed: 4632822,
      pre_rate: 18.04,
      post_rate: 18.58,
      peak_rate: 42.27,
      peak_month: "May",
      impact: 0.54,
    },
    Goa: {
      zone: "West",
      lat: 15.2993,
      lon: 74.124,
      avg_rate: 12.17,
      avg_lfpr: 39.24,
      avg_employed: 442375,
      pre_rate: 5.65,
      post_rate: 14.96,
      peak_rate: 21.25,
      peak_month: "May",
      impact: 9.31,
    },
    Gujarat: {
      zone: "West",
      lat: 22.2587,
      lon: 71.1924,
      avg_rate: 6.38,
      avg_lfpr: 45.49,
      avg_employed: 22730746,
      pre_rate: 6.19,
      post_rate: 6.45,
      peak_rate: 18.71,
      peak_month: "Apr",
      impact: 0.26,
    },
    Haryana: {
      zone: "North",
      lat: 29.0588,
      lon: 76.0856,
      avg_rate: 27.48,
      avg_lfpr: 42.1,
      avg_employed: 6844059,
      pre_rate: 23.72,
      post_rate: 29.09,
      peak_rate: 43.22,
      peak_month: "Apr",
      impact: 5.37,
    },
    "Himachal Pradesh": {
      zone: "North",
      lat: 31.1048,
      lon: 77.1734,
      avg_rate: 16.07,
      avg_lfpr: 40.25,
      avg_employed: 2033885,
      pre_rate: 17.48,
      post_rate: 15.46,
      peak_rate: 26.95,
      peak_month: "May",
      impact: -2.02,
    },
    "Jammu & Kashmir": {
      zone: "North",
      lat: 33.7782,
      lon: 76.5762,
      avg_rate: 16.48,
      avg_lfpr: 37.89,
      avg_employed: 3310032,
      pre_rate: 19.12,
      post_rate: 15.16,
      peak_rate: 21.08,
      peak_month: "Jan",
      impact: -3.96,
    },
    Jharkhand: {
      zone: "East",
      lat: 23.6102,
      lon: 85.2799,
      avg_rate: 19.54,
      avg_lfpr: 40.36,
      avg_employed: 8770642,
      pre_rate: 10.23,
      post_rate: 23.53,
      peak_rate: 59.23,
      peak_month: "May",
      impact: 13.3,
    },
    Karnataka: {
      zone: "South",
      lat: 15.3173,
      lon: 75.7139,
      avg_rate: 7.67,
      avg_lfpr: 42.0,
      avg_employed: 21624018,
      pre_rate: 3.31,
      post_rate: 9.54,
      peak_rate: 29.84,
      peak_month: "Apr",
      impact: 6.23,
    },
    Kerala: {
      zone: "South",
      lat: 10.8505,
      lon: 76.2711,
      avg_rate: 9.43,
      avg_lfpr: 33.38,
      avg_employed: 8596795,
      pre_rate: 7.3,
      post_rate: 10.35,
      peak_rate: 17.88,
      peak_month: "May",
      impact: 3.05,
    },
    "Madhya Pradesh": {
      zone: "West",
      lat: 22.9734,
      lon: 78.6569,
      avg_rate: 6.85,
      avg_lfpr: 38.93,
      avg_employed: 22318335,
      pre_rate: 3.63,
      post_rate: 8.23,
      peak_rate: 21.98,
      peak_month: "May",
      impact: 4.6,
    },
    Maharashtra: {
      zone: "West",
      lat: 19.7515,
      lon: 75.7139,
      avg_rate: 7.98,
      avg_lfpr: 41.47,
      avg_employed: 39204758,
      pre_rate: 5.14,
      post_rate: 9.19,
      peak_rate: 20.9,
      peak_month: "Apr",
      impact: 4.05,
    },
    Meghalaya: {
      zone: "Northeast",
      lat: 25.467,
      lon: 91.3662,
      avg_rate: 3.87,
      avg_lfpr: 59.86,
      avg_employed: 1349815,
      pre_rate: 2.28,
      post_rate: 4.55,
      peak_rate: 10.03,
      peak_month: "Apr",
      impact: 2.27,
    },
    Odisha: {
      zone: "East",
      lat: 20.9517,
      lon: 85.0985,
      avg_rate: 6.46,
      avg_lfpr: 37.75,
      avg_employed: 12726833,
      pre_rate: 6.03,
      post_rate: 6.65,
      peak_rate: 23.76,
      peak_month: "Apr",
      impact: 0.62,
    },
    Puducherry: {
      zone: "South",
      lat: 11.9416,
      lon: 79.8083,
      avg_rate: 17.94,
      avg_lfpr: 35.92,
      avg_employed: 365263,
      pre_rate: 1.18,
      post_rate: 25.13,
      peak_rate: 75.85,
      peak_month: "Apr",
      impact: 23.95,
    },
    Punjab: {
      zone: "North",
      lat: 31.1471,
      lon: 75.3412,
      avg_rate: 11.98,
      avg_lfpr: 39.98,
      avg_employed: 8783034,
      pre_rate: 10.8,
      post_rate: 12.49,
      peak_rate: 28.33,
      peak_month: "May",
      impact: 1.69,
    },
    Rajasthan: {
      zone: "North",
      lat: 27.0238,
      lon: 74.2179,
      avg_rate: 15.87,
      avg_lfpr: 40.59,
      avg_employed: 19731752,
      pre_rate: 12.68,
      post_rate: 17.24,
      peak_rate: 24.15,
      peak_month: "Oct",
      impact: 4.56,
    },
    Sikkim: {
      zone: "Northeast",
      lat: 27.533,
      lon: 88.5122,
      avg_rate: 9.79,
      avg_lfpr: 45.76,
      avg_employed: 234523,
      pre_rate: 23.57,
      post_rate: 7.82,
      peak_rate: 24.51,
      peak_month: "May",
      impact: -15.75,
    },
    "Tamil Nadu": {
      zone: "South",
      lat: 11.1271,
      lon: 78.6569,
      avg_rate: 12.19,
      avg_lfpr: 37.38,
      avg_employed: 21987898,
      pre_rate: 3.35,
      post_rate: 15.97,
      peak_rate: 49.83,
      peak_month: "Apr",
      impact: 12.62,
    },
    Telangana: {
      zone: "South",
      lat: 18.1124,
      lon: 79.0193,
      avg_rate: 6.83,
      avg_lfpr: 54.97,
      avg_employed: 16244082,
      pre_rate: 6.52,
      post_rate: 6.97,
      peak_rate: 14.7,
      peak_month: "May",
      impact: 0.45,
    },
    Tripura: {
      zone: "Northeast",
      lat: 23.9408,
      lon: 91.9882,
      avg_rate: 25.05,
      avg_lfpr: 57.85,
      avg_employed: 1397292,
      pre_rate: 30.34,
      post_rate: 22.79,
      peak_rate: 41.23,
      peak_month: "Apr",
      impact: -7.55,
    },
    "Uttar Pradesh": {
      zone: "North",
      lat: 26.8467,
      lon: 80.9462,
      avg_rate: 9.74,
      avg_lfpr: 37.61,
      avg_employed: 55524799,
      pre_rate: 8.89,
      post_rate: 10.1,
      peak_rate: 21.54,
      peak_month: "Apr",
      impact: 1.21,
    },
    Uttarakhand: {
      zone: "North",
      lat: 30.0668,
      lon: 79.0193,
      avg_rate: 11.16,
      avg_lfpr: 35.26,
      avg_employed: 2743275,
      pre_rate: 10.11,
      post_rate: 11.6,
      peak_rate: 22.26,
      peak_month: "Sep",
      impact: 1.49,
    },
    "West Bengal": {
      zone: "East",
      lat: 22.9868,
      lon: 87.855,
      avg_rate: 10.19,
      avg_lfpr: 45.16,
      avg_employed: 33305164,
      pre_rate: 6.26,
      post_rate: 11.88,
      peak_rate: 17.41,
      peak_month: "Apr",
      impact: 5.62,
    },
  },
  states: [
    "Andhra Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Delhi",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jammu & Kashmir",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Meghalaya",
    "Odisha",
    "Puducherry",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ],
};

const NAT_PRE = 9.76;
const NAT_POST = 13.28;
const NAT_PEAK = 23.24;
const NAT_PEAK_MONTH = "May";
const NAT_OCT = 8.03;
const CORR_UNEMP_LFPR = -0.07;
const CORR_UNEMP_EMPLOYED = -0.25;
const OUTLIER_THRESHOLD = 34.6;

/* ================================================================== */
/* DESIGN TOKENS                                                       */
/* ================================================================== */
const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Work+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');`;

const C = {
  bg: "#10141B",
  bgWash: "#0C0F14",
  panel: "#171C25",
  panelAlt: "#1D2430",
  border: "#262E3B",
  borderBright: "#38445A",
  ink: "#EBEEF3",
  sub: "#8B93A5",
  dim: "#576071",
  dim2: "#5A6274",
  marigold: "#E7A33E",
  marigoldDim: "#4A3A22",
  crisis: "#DD5C46",
  crisisDim: "#4A2A24",
  recovery: "#5FB08C",
  recoveryDim: "#22403A",
  blue: "#6FA8DC",
};

const ZONE_COLORS = {
  North: "#DD5C46",
  South: "#5FB08C",
  East: "#E7A33E",
  West: "#6FA8DC",
  Northeast: "#B98CD9",
};

const LOCKDOWN_NOTE =
  "India's nationwide lockdown began 25 Mar 2020. Pre-lockdown = Jan–Mar avg; Post-lockdown = Apr–Oct avg.";

/* ================================================================== */
/* VIEWPORT HOOK                                                       */
/* ================================================================== */
function useViewport() {
  const [w, setW] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1280
  );
  useEffect(() => {
    const onR = () => setW(window.innerWidth);
    window.addEventListener("resize", onR);
    return () => window.removeEventListener("resize", onR);
  }, []);
  return { isMobile: w < 720, isTablet: w >= 720 && w < 1040 };
}

/* ================================================================== */
/* SMALL BUILDING BLOCKS                                              */
/* ================================================================== */
function Eyebrow({ children }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: C.marigold,
        fontFamily: "'IBM Plex Mono', monospace",
      }}
    >
      {children}
    </div>
  );
}

function PanelHeading({ children, accent }) {
  return (
    <h3
      style={{
        margin: "0 0 16px",
        fontSize: 13,
        fontWeight: 600,
        color: accent || C.sub,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      {children}
    </h3>
  );
}

function KpiTile({ label, value, sub, accent, isMobile }) {
  return (
    <div
      style={{
        background: `linear-gradient(160deg, ${C.panelAlt}, ${C.panel})`,
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        padding: isMobile ? "12px 12px" : "16px 18px",
        position: "relative",
        overflow: "hidden",
        minWidth: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          background: accent,
        }}
      />
      <div
        style={{
          fontSize: 10.5,
          fontWeight: 600,
          color: C.sub,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: isMobile ? 22 : 28,
          fontWeight: 700,
          color: C.ink,
          margin: "6px 0 2px",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 11, color: C.dim2 }}>{sub}</div>
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}
    >
      {label && (
        <label
          style={{
            fontSize: 10.5,
            fontWeight: 600,
            color: C.sub,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          background: C.panelAlt,
          border: `1px solid ${C.borderBright}`,
          borderRadius: 6,
          color: C.ink,
          padding: "10px 12px",
          fontSize: 14,
          outline: "none",
          fontFamily: "'Work Sans', sans-serif",
          width: "100%",
          WebkitAppearance: "none",
          appearance: "none",
          cursor: "pointer",
        }}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function Badge({ children, color }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: 10.5,
        fontWeight: 600,
        padding: "3px 8px",
        borderRadius: 20,
        background: `${color}22`,
        color: color,
        border: `1px solid ${color}55`,
        fontFamily: "'IBM Plex Mono', monospace",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

const tooltipStyle = {
  background: C.panelAlt,
  border: `1px solid ${C.borderBright}`,
  borderRadius: 6,
  fontSize: 12,
  fontFamily: "'Work Sans', sans-serif",
  color: C.ink,
};

/* ================================================================== */
/* SIGNATURE ELEMENT — Lockdown timeline ribbon                       */
/* ================================================================== */
function LockdownRibbon({ isMobile }) {
  const W = isMobile ? 340 : 1000;
  const H = isMobile ? 92 : 110;
  const padL = isMobile ? 8 : 20;
  const padR = isMobile ? 8 : 20;
  const padT = 22;
  const padB = 26;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const n = DATA.months.length;
  const maxV = 25;

  const xAt = (i) => padL + (plotW * i) / (n - 1);
  const yAt = (v) => padT + plotH - (plotH * v) / maxV;

  const linePts = DATA.national_series
    .map((v, i) => `${xAt(i)},${yAt(v)}`)
    .join(" ");
  const areaPts = `${xAt(0)},${yAt(0)} ${linePts} ${xAt(n - 1)},${yAt(0)}`;

  // lockdown band: from between Mar(2)/Apr(3) to between May(4)/Jun(5)
  const bandX1 = xAt(2.85);
  const bandX2 = xAt(5.15);
  const peakIdx = DATA.national_series.indexOf(
    Math.max(...DATA.national_series)
  );

  return (
    <div
      style={{
        background: `linear-gradient(180deg, ${C.panelAlt}, ${C.panel})`,
        border: `1px solid ${C.border}`,
        borderRadius: 10,
        padding: isMobile ? "10px 6px 4px" : "14px 10px 6px",
        marginBottom: isMobile ? 16 : 22,
        overflow: "hidden",
      }}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height={isMobile ? 100 : 118}
        preserveAspectRatio="none"
      >
        <rect
          x={bandX1}
          y={padT - 8}
          width={bandX2 - bandX1}
          height={plotH + 16}
          fill={C.crisis}
          opacity={0.11}
        />
        <text
          x={(bandX1 + bandX2) / 2}
          y={padT - 10}
          textAnchor="middle"
          fontSize={isMobile ? 8.5 : 10}
          fontFamily="'IBM Plex Mono', monospace"
          fontWeight={600}
          fill={C.crisis}
          letterSpacing="0.06em"
        >
          {isMobile ? "LOCKDOWN" : "NATIONWIDE LOCKDOWN"}
        </text>

        {/* baseline */}
        <line
          x1={padL}
          y1={yAt(0)}
          x2={W - padR}
          y2={yAt(0)}
          stroke={C.border}
          strokeWidth={1}
        />

        <polygon points={areaPts} fill={C.marigold} opacity={0.13} />
        <polyline
          points={linePts}
          fill="none"
          stroke={C.marigold}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {DATA.national_series.map((v, i) => (
          <circle
            key={i}
            cx={xAt(i)}
            cy={yAt(v)}
            r={i === peakIdx ? 4 : 2.4}
            fill={i === peakIdx ? C.crisis : C.marigold}
            stroke={C.bg}
            strokeWidth={1}
          />
        ))}

        {/* peak callout */}
        <text
          x={xAt(peakIdx)}
          y={yAt(DATA.national_series[peakIdx]) - 10}
          textAnchor="middle"
          fontSize={isMobile ? 9.5 : 11}
          fontFamily="'IBM Plex Mono', monospace"
          fontWeight={700}
          fill={C.crisis}
        >
          {DATA.national_series[peakIdx]}%
        </text>

        {/* month ticks */}
        {DATA.months.map((m, i) => (
          <text
            key={m}
            x={xAt(i)}
            y={H - 6}
            textAnchor="middle"
            fontSize={isMobile ? 8 : 10}
            fontFamily="'IBM Plex Mono', monospace"
            fill={C.dim2}
          >
            {m}
          </text>
        ))}
      </svg>
    </div>
  );
}

/* ================================================================== */
/* TAB 1 — NATIONAL TREND                                             */
/* ================================================================== */
function TrendTab({ isMobile }) {
  const trendData = DATA.months.map((m, i) => ({
    month: m,
    rate: DATA.national_series[i],
  }));

  const zoneAvgByMonth = useMemo(() => {
    const zones = ["North", "South", "East", "West", "Northeast"];
    return DATA.months.map((m, i) => {
      const row = { month: m };
      zones.forEach((z) => {
        const vals = DATA.states
          .filter((s) => DATA.state_meta[s].zone === z)
          .map((s) => DATA.state_series[s][i])
          .filter((v) => v !== null && v !== undefined);
        row[z] = vals.length
          ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 100) /
            100
          : null;
      });
      return row;
    });
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: isMobile ? 16 : 22,
      }}
    >
      <div
        style={{
          background: C.panel,
          border: `1px solid ${C.border}`,
          borderRadius: 10,
          padding: isMobile ? 12 : 20,
        }}
      >
        <PanelHeading accent={C.marigold}>
          National Unemployment Rate — Monthly Trend
        </PanelHeading>
        <div style={{ height: isMobile ? 240 : 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={trendData}
              margin={{
                top: 10,
                right: isMobile ? 6 : 20,
                left: isMobile ? -20 : 0,
                bottom: 4,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis
                dataKey="month"
                stroke={C.dim2}
                tick={{ fontSize: isMobile ? 10 : 12 }}
              />
              <YAxis
                stroke={C.dim2}
                tick={{ fontSize: isMobile ? 10 : 12 }}
                tickFormatter={(v) => `${v}%`}
                width={isMobile ? 32 : 40}
              />
              <ReferenceArea
                x1="Mar"
                x2="Jun"
                fill={C.crisis}
                fillOpacity={0.08}
              />
              <ReferenceLine
                y={NAT_PRE}
                stroke={C.dim2}
                strokeDasharray="3 3"
                label={
                  isMobile
                    ? undefined
                    : {
                        value: "Pre-lockdown avg",
                        position: "insideTopLeft",
                        fill: C.dim2,
                        fontSize: 10,
                      }
                }
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v) => [`${v}%`, "Unemployment"]}
              />
              <Area
                type="monotone"
                dataKey="rate"
                stroke={C.marigold}
                fill={C.marigold}
                fillOpacity={0.18}
                strokeWidth={2.5}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p style={{ fontSize: 11.5, color: C.dim2, margin: "10px 2px 0" }}>
          Shaded band marks the acute lockdown shock (Mar–Jun). {LOCKDOWN_NOTE}
        </p>
      </div>

      <div
        style={{
          background: C.panel,
          border: `1px solid ${C.border}`,
          borderRadius: 10,
          padding: isMobile ? 12 : 20,
        }}
      >
        <PanelHeading accent={C.marigold}>Trend by Zone</PanelHeading>
        <div style={{ height: isMobile ? 240 : 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={zoneAvgByMonth}
              margin={{
                top: 10,
                right: isMobile ? 6 : 20,
                left: isMobile ? -20 : 0,
                bottom: 4,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis
                dataKey="month"
                stroke={C.dim2}
                tick={{ fontSize: isMobile ? 10 : 12 }}
              />
              <YAxis
                stroke={C.dim2}
                tick={{ fontSize: isMobile ? 10 : 12 }}
                tickFormatter={(v) => `${v}%`}
                width={isMobile ? 32 : 40}
              />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => `${v}%`} />
              {Object.keys(ZONE_COLORS).map((z) => (
                <Line
                  key={z}
                  type="monotone"
                  dataKey={z}
                  stroke={ZONE_COLORS[z]}
                  strokeWidth={2}
                  dot={{ r: 2.5 }}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div
          style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}
        >
          {Object.keys(ZONE_COLORS).map((z) => (
            <Badge key={z} color={ZONE_COLORS[z]}>
              ● {z}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* TAB 2 — STATE EXPLORER (sandbox)                                   */
/* ================================================================== */
function ExplorerTab({ isMobile, isTablet, selected, setSelected }) {
  const meta = DATA.state_meta[selected];
  const lineData = DATA.months.map((m, i) => ({
    month: m,
    national: DATA.national_series[i],
    state: DATA.state_series[selected][i],
  }));

  const lonExtent = [67, 99];
  const latExtent = [6, 36];
  const mapData = DATA.states.map((s) => ({
    name: s,
    lon: DATA.state_meta[s].lon,
    lat: DATA.state_meta[s].lat,
    rate: DATA.state_meta[s].avg_rate,
    zone: DATA.state_meta[s].zone,
  }));

  const impactColor =
    meta.impact === null ? C.dim2 : meta.impact >= 0 ? C.crisis : C.recovery;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: isMobile || isTablet ? "1fr" : "300px 1fr",
        gap: isMobile ? 16 : 24,
      }}
    >
      {/* Controls */}
      <div
        style={{
          background: C.panel,
          border: `1px solid ${C.border}`,
          borderRadius: 10,
          padding: isMobile ? 16 : 20,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          height: "fit-content",
        }}
      >
        <PanelHeading accent={C.marigold}>State Explorer</PanelHeading>
        <SelectField
          label="Select State / UT"
          value={selected}
          onChange={setSelected}
          options={DATA.states}
        />

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Badge color={ZONE_COLORS[meta.zone]}>{meta.zone} ZONE</Badge>
          {meta.peak_rate > OUTLIER_THRESHOLD && (
            <Badge color={C.crisis}>EXTREME SPIKE</Badge>
          )}
        </div>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
        >
          <KpiTile
            label="Avg Rate"
            value={`${meta.avg_rate}%`}
            sub="Jan–Oct 2020"
            accent={C.marigold}
            isMobile
          />
          <KpiTile
            label="Peak"
            value={`${meta.peak_rate}%`}
            sub={meta.peak_month}
            accent={C.crisis}
            isMobile
          />
          <KpiTile
            label="LFPR"
            value={`${meta.avg_lfpr}%`}
            sub="Labour participation"
            accent={C.blue}
            isMobile
          />
          <KpiTile
            label="Impact"
            value={
              meta.impact === null
                ? "—"
                : `${meta.impact > 0 ? "+" : ""}${meta.impact}pp`
            }
            sub="Post − pre lockdown"
            accent={impactColor}
            isMobile
          />
        </div>

        <p
          style={{ fontSize: 11.5, color: C.dim2, margin: 0, lineHeight: 1.5 }}
        >
          {meta.impact === null
            ? "Some months are unreported for this state/UT."
            : meta.impact >= 0
            ? `Unemployment in ${selected} averaged ${meta.impact} points higher after the lockdown began than before it.`
            : `Unemployment in ${selected} averaged ${Math.abs(
                meta.impact
              )} points lower after the lockdown began — one of the states that recovered fastest.`}
        </p>
      </div>

      {/* Charts */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? 14 : 20,
          minWidth: 0,
        }}
      >
        <div
          style={{
            background: C.panel,
            border: `1px solid ${C.border}`,
            borderRadius: 10,
            padding: isMobile ? 12 : 20,
          }}
        >
          <PanelHeading accent={C.marigold}>
            {selected} vs. National Average
          </PanelHeading>
          <div style={{ height: isMobile ? 220 : 270 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={lineData}
                margin={{
                  top: 10,
                  right: isMobile ? 6 : 20,
                  left: isMobile ? -20 : 0,
                  bottom: 4,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis
                  dataKey="month"
                  stroke={C.dim2}
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                />
                <YAxis
                  stroke={C.dim2}
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  tickFormatter={(v) => `${v}%`}
                  width={isMobile ? 32 : 40}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(v) => (v === null ? "—" : `${v}%`)}
                />
                <Line
                  type="monotone"
                  dataKey="national"
                  name="National avg"
                  stroke={C.dim2}
                  strokeWidth={2}
                  strokeDasharray="4 3"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="state"
                  name={selected}
                  stroke={C.marigold}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 10 }}>
            <span style={{ fontSize: 11, color: C.dim2 }}>
              ▬ ▬ National avg
            </span>
            <span style={{ fontSize: 11, color: C.marigold }}>
              ━━ {selected}
            </span>
          </div>
        </div>

        <div
          style={{
            background: C.panel,
            border: `1px solid ${C.border}`,
            borderRadius: 10,
            padding: isMobile ? 12 : 20,
          }}
        >
          <PanelHeading accent={C.marigold}>
            Geographic Map — bubble size = avg. unemployment rate
          </PanelHeading>
          <div style={{ height: isMobile ? 280 : 340 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{
                  top: 10,
                  right: isMobile ? 6 : 20,
                  left: isMobile ? -10 : 0,
                  bottom: 4,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis
                  type="number"
                  dataKey="lon"
                  domain={lonExtent}
                  hide={isMobile}
                  stroke={C.dim2}
                  tick={{ fontSize: 10 }}
                  name="Longitude"
                />
                <YAxis
                  type="number"
                  dataKey="lat"
                  domain={latExtent}
                  hide={isMobile}
                  stroke={C.dim2}
                  tick={{ fontSize: 10 }}
                  name="Latitude"
                  width={30}
                />
                <ZAxis
                  type="number"
                  dataKey="rate"
                  range={[60, 500]}
                  name="Avg rate"
                />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  contentStyle={tooltipStyle}
                  formatter={(v, name) => (name === "Avg rate" ? `${v}%` : v)}
                  labelFormatter={() => ""}
                />
                <Scatter
                  data={mapData}
                  onClick={(d) => d && d.name && setSelected(d.name)}
                  cursor="pointer"
                >
                  {mapData.map((d) => (
                    <Cell
                      key={d.name}
                      fill={ZONE_COLORS[d.zone]}
                      fillOpacity={d.name === selected ? 0.95 : 0.45}
                      stroke={d.name === selected ? C.ink : "transparent"}
                      strokeWidth={d.name === selected ? 2 : 0}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <p style={{ fontSize: 11, color: C.dim2, margin: "8px 2px 0" }}>
            Tap any bubble to explore that state. Color = zone, size = average
            unemployment rate.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* TAB 3 — COVID IMPACT RANKING                                       */
/* ================================================================== */
function ImpactTab({ isMobile }) {
  const ranked = useMemo(() => {
    return DATA.states
      .filter((s) => DATA.state_meta[s].impact !== null)
      .map((s) => ({
        state: isMobile
          ? s.replace("Jammu & Kashmir", "J&K").replace(" Pradesh", " Pr.")
          : s,
        impact: DATA.state_meta[s].impact,
        zone: DATA.state_meta[s].zone,
      }))
      .sort((a, b) => b.impact - a.impact);
  }, [isMobile]);

  return (
    <div
      style={{
        background: C.panel,
        border: `1px solid ${C.border}`,
        borderRadius: 10,
        padding: isMobile ? 12 : 20,
      }}
    >
      <PanelHeading accent={C.marigold}>
        COVID-19 Lockdown Impact by State (percentage-point change)
      </PanelHeading>
      <div style={{ height: isMobile ? 620 : 720 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={ranked}
            layout="vertical"
            margin={{
              top: 4,
              right: isMobile ? 20 : 30,
              left: isMobile ? 4 : 10,
              bottom: 4,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis
              type="number"
              stroke={C.dim2}
              tick={{ fontSize: isMobile ? 9 : 11 }}
              tickFormatter={(v) => `${v}pp`}
            />
            <YAxis
              type="category"
              dataKey="state"
              stroke={C.sub}
              tick={{ fontSize: isMobile ? 9 : 11 }}
              width={isMobile ? 78 : 118}
            />
            <ReferenceLine x={0} stroke={C.borderBright} />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(v) => [`${v > 0 ? "+" : ""}${v} pp`, "Impact"]}
            />
            <Bar dataKey="impact" radius={[0, 3, 3, 0]}>
              {ranked.map((d) => (
                <Cell
                  key={d.state}
                  fill={d.impact >= 0 ? C.crisis : C.recovery}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p
        style={{
          fontSize: 11.5,
          color: C.dim2,
          margin: "12px 2px 0",
          lineHeight: 1.5,
        }}
      >
        Impact = average unemployment rate Apr–Oct minus average Jan–Mar. Red
        bars worsened after the lockdown began; green bars improved. Puducherry,
        Jharkhand, Tamil Nadu and Bihar saw the sharpest deterioration; Sikkim,
        Tripura and Jammu &amp; Kashmir recovered furthest below their
        pre-lockdown baseline.
      </p>
    </div>
  );
}

/* ================================================================== */
/* TAB 4 — ZONES & CORRELATION                                        */
/* ================================================================== */
function InsightsTab({ isMobile }) {
  const zoneAvg = useMemo(() => {
    const zones = ["North", "East", "Northeast", "South", "West"];
    return zones
      .map((z) => {
        const vals = DATA.states
          .filter((s) => DATA.state_meta[s].zone === z)
          .map((s) => DATA.state_meta[s].avg_rate);
        return {
          zone: z,
          rate:
            Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 100) /
            100,
        };
      })
      .sort((a, b) => b.rate - a.rate);
  }, []);

  const scatterData = DATA.states.map((s) => ({
    name: s,
    lfpr: DATA.state_meta[s].avg_lfpr,
    rate: DATA.state_meta[s].avg_rate,
    zone: DATA.state_meta[s].zone,
  }));

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: isMobile ? 16 : 22,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: isMobile ? 16 : 24,
        }}
      >
        <div
          style={{
            background: C.panel,
            border: `1px solid ${C.border}`,
            borderRadius: 10,
            padding: isMobile ? 12 : 20,
          }}
        >
          <PanelHeading accent={C.marigold}>Average Rate by Zone</PanelHeading>
          <div style={{ height: isMobile ? 260 : 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={zoneAvg}
                margin={{
                  top: 10,
                  right: 10,
                  left: isMobile ? -20 : 0,
                  bottom: 4,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis
                  dataKey="zone"
                  stroke={C.dim2}
                  tick={{ fontSize: isMobile ? 9 : 11 }}
                />
                <YAxis
                  stroke={C.dim2}
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  tickFormatter={(v) => `${v}%`}
                  width={isMobile ? 32 : 40}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(v) => `${v}%`}
                />
                <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
                  {zoneAvg.map((d) => (
                    <Cell key={d.zone} fill={ZONE_COLORS[d.zone]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p style={{ fontSize: 11.5, color: C.dim2, margin: "10px 2px 0" }}>
            North India carried the highest average unemployment burden through
            2020; the West recovered to the lowest average.
          </p>
        </div>

        <div
          style={{
            background: C.panel,
            border: `1px solid ${C.border}`,
            borderRadius: 10,
            padding: isMobile ? 12 : 20,
          }}
        >
          <PanelHeading accent={C.marigold}>
            Unemployment vs. Labour Participation
          </PanelHeading>
          <div style={{ height: isMobile ? 260 : 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{
                  top: 10,
                  right: 10,
                  left: isMobile ? -10 : 0,
                  bottom: 4,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis
                  type="number"
                  dataKey="lfpr"
                  name="LFPR"
                  unit="%"
                  stroke={C.dim2}
                  tick={{ fontSize: isMobile ? 9 : 11 }}
                  domain={[30, 62]}
                />
                <YAxis
                  type="number"
                  dataKey="rate"
                  name="Unemployment"
                  unit="%"
                  stroke={C.dim2}
                  tick={{ fontSize: isMobile ? 9 : 11 }}
                  width={isMobile ? 32 : 40}
                />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  contentStyle={tooltipStyle}
                  formatter={(v, name) => [`${v}%`, name]}
                  labelFormatter={() => ""}
                />
                <Scatter data={scatterData}>
                  {scatterData.map((d) => (
                    <Cell
                      key={d.name}
                      fill={ZONE_COLORS[d.zone]}
                      fillOpacity={0.8}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <p style={{ fontSize: 11.5, color: C.dim2, margin: "10px 2px 0" }}>
            Correlation ≈ {CORR_UNEMP_LFPR} — essentially no linear
            relationship. States with high labour participation weren't reliably
            spared from high unemployment.
          </p>
        </div>
      </div>

      <div
        style={{
          background: C.panel,
          border: `1px solid ${C.border}`,
          borderRadius: 10,
          padding: isMobile ? 16 : 22,
        }}
      >
        <PanelHeading accent={C.marigold}>Key Findings</PanelHeading>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: 14,
          }}
        >
          {[
            {
              t: "Shock was sharp, not gradual",
              d: `National unemployment nearly tripled from ${NAT_PRE}% (Jan–Mar) to a ${NAT_PEAK}% peak in ${NAT_PEAK_MONTH}, then eased back to ${NAT_OCT}% by October.`,
              c: C.crisis,
            },
            {
              t: "Impact was regionally uneven",
              d: "Puducherry, Jharkhand, Tamil Nadu and Bihar saw the steepest deterioration, while Sikkim and Tripura ended lower than they started.",
              c: C.marigold,
            },
            {
              t: "Participation didn't predict outcomes",
              d: `Labour force participation and unemployment were weakly correlated (r ≈ ${CORR_UNEMP_LFPR}), suggesting the shock hit demand for labour broadly, not just high-participation states.`,
              c: C.recovery,
            },
          ].map((f) => (
            <div
              key={f.t}
              style={{
                borderLeft: `3px solid ${f.c}`,
                paddingLeft: 12,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: C.ink,
                  marginBottom: 4,
                }}
              >
                {f.t}
              </div>
              <div style={{ fontSize: 12, color: C.sub, lineHeight: 1.5 }}>
                {f.d}
              </div>
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
export default function LabourPulseDashboard() {
  const { isMobile, isTablet } = useViewport();
  const [activeTab, setActiveTab] = useState("trend");
  const [selectedState, setSelectedState] = useState("Maharashtra");

  const tabLabels = {
    trend: "National Trend",
    explorer: "State Explorer",
    impact: "COVID Impact",
    insights: "Zones & Insights",
  };

  return (
    <div
      style={{
        background: C.bg,
        minHeight: "100vh",
        color: C.ink,
        fontFamily: "'Work Sans', sans-serif",
        padding: isMobile ? "16px 12px 32px" : "24px 32px 40px",
        boxSizing: "border-box",
        width: "100%",
        overflowX: "hidden",
      }}
    >
      <style>{`
        ${FONT_IMPORT}
        * { box-sizing: border-box; }
        .lp-tabs::-webkit-scrollbar { display: none; }
        select { color-scheme: dark; }
        @media (max-width: 480px) {
          .lp-title { font-size: 22px !important; }
        }
      `}</style>

      {/* Header */}
      <header
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "flex-start" : "flex-end",
          gap: isMobile ? 14 : 16,
          marginBottom: isMobile ? 16 : 22,
          borderBottom: `1px solid ${C.border}`,
          paddingBottom: 16,
          flexWrap: "wrap",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <Eyebrow>India · Labour Market Analytics · Jan–Oct 2020</Eyebrow>
          <h1
            className="lp-title"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: isMobile ? 24 : 32,
              fontWeight: 700,
              margin: "4px 0 0",
              color: C.ink,
              letterSpacing: -0.5,
              lineHeight: 1.1,
            }}
          >
            Labour Pulse
          </h1>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: isMobile ? 12 : 13,
              color: C.sub,
              maxWidth: 520,
            }}
          >
            Tracking the COVID-19 lockdown shock across 27 Indian states &amp;
            union territories — unemployment rate, labour participation, and
            regional recovery.
          </p>
        </div>

        <div
          className="lp-tabs"
          style={{
            display: "flex",
            gap: 8,
            width: isMobile ? "100%" : "auto",
            overflowX: isMobile ? "auto" : "visible",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
          }}
        >
          {Object.keys(tabLabels).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flexShrink: 0,
                background: activeTab === tab ? C.marigold : C.panel,
                color: activeTab === tab ? "#1A1508" : C.ink,
                border: `1px solid ${
                  activeTab === tab ? C.marigold : C.border
                }`,
                padding: isMobile ? "9px 14px" : "9px 16px",
                borderRadius: 6,
                fontWeight: 600,
                fontSize: 12,
                cursor: "pointer",
                whiteSpace: "nowrap",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              {tabLabels[tab]}
            </button>
          ))}
        </div>
      </header>

      {/* Signature ribbon */}
      <LockdownRibbon isMobile={isMobile} />

      {/* KPI row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile
            ? "repeat(2, minmax(0,1fr))"
            : "repeat(4, minmax(0,1fr))",
          gap: isMobile ? 10 : 14,
          marginBottom: isMobile ? 18 : 26,
        }}
      >
        <KpiTile
          label="Pre-Lockdown Avg"
          value={`${NAT_PRE}%`}
          sub="Jan–Mar 2020"
          accent={C.blue}
          isMobile={isMobile}
        />
        <KpiTile
          label="Peak Shock"
          value={`${NAT_PEAK}%`}
          sub={`${NAT_PEAK_MONTH} 2020`}
          accent={C.crisis}
          isMobile={isMobile}
        />
        <KpiTile
          label="Post-Lockdown Avg"
          value={`${NAT_POST}%`}
          sub="Apr–Oct 2020"
          accent={C.marigold}
          isMobile={isMobile}
        />
        <KpiTile
          label="October Reading"
          value={`${NAT_OCT}%`}
          sub="Latest available month"
          accent={C.recovery}
          isMobile={isMobile}
        />
      </div>

      {activeTab === "trend" && <TrendTab isMobile={isMobile} />}
      {activeTab === "explorer" && (
        <ExplorerTab
          isMobile={isMobile}
          isTablet={isTablet}
          selected={selectedState}
          setSelected={setSelectedState}
        />
      )}
      {activeTab === "impact" && <ImpactTab isMobile={isMobile} />}
      {activeTab === "insights" && <InsightsTab isMobile={isMobile} />}

      <footer
        style={{
          marginTop: isMobile ? 24 : 32,
          paddingTop: 14,
          borderTop: `1px solid ${C.border}`,
          fontSize: 10.5,
          color: C.dim2,
          fontFamily: "'IBM Plex Mono', monospace",
        }}
      >
        Dataset: "Unemployment in India" (CMIE, via Kaggle) · 267 monthly state
        records, 27 states/UTs · CodeAlpha Data Science Internship project
      </footer>
    </div>
  );
}
