/**
 * Astronomical calculations for Nepal Sambat calendar
 */

// Constants for astronomical calculations
const J2000 = 2451545.0 // Julian date for J2000.0

/**
 * Calculate solar longitude for a given date
 */
export function calculateSolarLongitude(date: Date): number {
  const jd = dateToJulianDate(date)
  const t = (jd - J2000) / 36525.0 // Julian centuries since J2000.0

  // Mean anomaly of the Sun
  const M = 357.52911 + 35999.05029 * t - 0.0001537 * t * t

  // Mean longitude of the Sun
  const L0 = 280.46646 + 36000.76983 * t + 0.0003032 * t * t

  // Equation of center
  const C =
    (1.914602 - 0.004817 * t - 0.000014 * t * t) * Math.sin((M * Math.PI) / 180) +
    (0.019993 - 0.000101 * t) * Math.sin((2 * M * Math.PI) / 180) +
    0.000289 * Math.sin((3 * M * Math.PI) / 180)

  // True longitude of the Sun
  const L = L0 + C

  return normalizeAngle(L)
}

/**
 * Calculate lunar longitude for a given date
 */
export function calculateLunarLongitude(date: Date): number {
  const jd = dateToJulianDate(date)
  const t = (jd - J2000) / 36525.0 // Julian centuries since J2000.0

  // Mean anomaly of the Moon
  const M = 134.9633964 + 477198.8675055 * t + 0.0087414 * t * t

  // Mean longitude of the Moon
  const L0 = 218.3164477 + 481267.88123421 * t - 0.0015786 * t * t

  // Equation of center
  const C =
    (6.288774 + 0.2134843 * t) * Math.sin((M * Math.PI) / 180) +
    (1.274018 + 0.0025166 * t) * Math.sin((2 * M * Math.PI) / 180) +
    0.658314 * Math.sin((3 * M * Math.PI) / 180)

  // True longitude of the Moon
  const L = L0 + C

  return normalizeAngle(L)
}

/**
 * Calculate elongation (angular distance between Sun and Moon)
 */
export function calculateElongation(solarLongitude: number, lunarLongitude: number): number {
  return normalizeAngle(lunarLongitude - solarLongitude)
}

/**
 * Convert JavaScript Date to Julian Date
 */
function dateToJulianDate(date: Date): number {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const a = Math.floor((14 - month) / 12)
  const y = year + 4800 - a
  const m = month + 12 * a - 3

  let jd =
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045

  // Add time of day
  jd += (hour - 12) / 24 + minute / 1440 + second / 86400

  return jd
}

/**
 * Normalize angle to range [0, 360)
 */
function normalizeAngle(angle: number): number {
  return ((angle % 360) + 360) % 360
}
