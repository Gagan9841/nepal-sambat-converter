import { LunarConstants, SolarConstants } from './types';

/**
 * Core astronomical constants
 */
export const NS_EPOCH_JD = 2042404.5;
export const J2000 = 2451545.0;
export const LUNAR_SYNODIC_MONTH = 29.530588861;
export const DEG_TO_RAD = Math.PI / 180;
export const RAD_TO_DEG = 180 / Math.PI;
export const KALIYUGA_EPOCH_JD = 588465.5;
export const TROPICAL_YEAR = 365.25636;
export const KATHMANDU_LON = 85.324;
export const KATHMANDU_LAT = 27.7172;

/**
 * Lunar constants for astronomical calculations
 */
export const LUNAR_CONSTANTS: LunarConstants = {
  L0: 218.3164477,
  P0: 83.353451,
  N0: 125.044522,
  L1: 481267.88123421,
  P1: 4069.0137287,
  N1: -1934.136261,
  EVECTION: 1.2739,
  VARIATION: 0.6583,
  YEARLY_EQ: 0.1858,
  PARALLACTIC: 0.214,
};

/**
 * Solar constants for astronomical calculations
 */
export const SOLAR_CONSTANTS: SolarConstants = {
  L0: 280.46646,
  M0: 357.52911,
  L1: 36000.76983,
  M1: 35999.05029,
  C1: 1.914602,
  C2: 0.019993,
  C3: 0.000289,
};

/**
 * Array of Nepal Sambat months
 */
export const NS_MONTHS = [
  { name: "Kachhalā", nepali: "कछला", startDeg: 210 },
  { name: "Thinlā", nepali: "थिंला", startDeg: 240 },
  { name: "Pwanhelā", nepali: "पोहेला", startDeg: 270 },
  { name: "Silā", nepali: "सिला", startDeg: 300 },
  { name: "Chilā", nepali: "चिला", startDeg: 330 },
  { name: "Chaulā", nepali: "चौला", startDeg: 0 },
  { name: "Bachhalā", nepali: "बछला", startDeg: 30 },
  { name: "Tachhalā", nepali: "तछला", startDeg: 60 },
  { name: "Dilā", nepali: "दिला", startDeg: 90 },
  { name: "Gunlā", nepali: "गुंला", startDeg: 120 },
  { name: "Yanlā", nepali: "ञंला", startDeg: 150 },
  { name: "Kaulā", nepali: "कौला", startDeg: 180 },
];

/**
 * Tithi names in Devanagari
 */
export const TITHI_NAMES = [
  "पारु",
  "द्वितीया",
  "तृतीया",
  "चतुर्थी",
  "पञ्चमी",
  "षष्ठी",
  "सप्तमी",
  "अष्टमी",
  "नवमी",
  "दशमी",
  "एकादशी",
  "द्वादशी",
  "त्रयोदशी",
  "चतुर्दशी",
  "पुन्हि",
]; 