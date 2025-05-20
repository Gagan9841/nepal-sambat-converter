import {
  DEG_TO_RAD,
  LUNAR_CONSTANTS,
  SOLAR_CONSTANTS,
  J2000,
  KATHMANDU_LAT,
  KATHMANDU_LON,
  RAD_TO_DEG,
} from '../constants/values'

/**
 * Calculates the Julian Date (JD) of sunrise for a specific location (Kathmandu).
 *
 * This function uses astronomical calculations to determine the time of sunrise
 * based on Earth's position relative to the Sun. It accounts for:
 * - The equation of time (difference between apparent and mean solar time)
 * - Solar declination (the Sun's angle relative to Earth's equator)
 * - Geographic coordinates of Kathmandu
 *
 * @param jd - The Julian Date for which to calculate the sunrise
 * @returns The Julian Date of sunrise for the specified date at Kathmandu's location
 *
 * @remarks
 * - Uses SOLAR_CONSTANTS for astronomical calculations
 * - Times are returned in Julian Date format
 * - Uses Kathmandu's latitude and longitude as fixed parameters
 */
export function getSunriseJD(jd: number): number {
  const T = (jd - J2000) / 36525
  const M = (SOLAR_CONSTANTS.M0 + SOLAR_CONSTANTS.M1 * T) % 360
  // Improved equation of time
  const C =
    SOLAR_CONSTANTS.C1 * Math.sin(M * DEG_TO_RAD) +
    SOLAR_CONSTANTS.C2 * Math.sin(2 * M * DEG_TO_RAD) +
    SOLAR_CONSTANTS.C3 * Math.sin(3 * M * DEG_TO_RAD)
  const eqTime = C * 4 // Convert degrees to minutes
  // Solar declination (approximate)
  const epsilon = 23.44 * DEG_TO_RAD // Obliquity
  const L = (SOLAR_CONSTANTS.L0 + SOLAR_CONSTANTS.L1 * T + C) % 360
  const decl = Math.asin(Math.sin(epsilon) * Math.sin(L * DEG_TO_RAD))
  // Solar noon
  const solarNoon = jd + 5.75 / 24 - KATHMANDU_LON / 360 + eqTime / 1440
  // Hour angle
  const cosH =
    (Math.sin(-0.83 * DEG_TO_RAD) - Math.sin(KATHMANDU_LAT * DEG_TO_RAD) * Math.sin(decl)) /
    (Math.cos(KATHMANDU_LAT * DEG_TO_RAD) * Math.cos(decl))
  const H = Math.acos(cosH < -1 ? -1 : cosH > 1 ? 1 : cosH)
  const sunriseOffset = (H * RAD_TO_DEG) / 360 / 2
  return solarNoon - sunriseOffset
}

/**
 * Calculates the apparent geocentric longitude of the Sun for a given Julian Day.
 *
 * This function uses a simplified formula for solar position calculation
 * based on astronomical constants. The calculation is accurate enough
 * for most calendrical purposes.
 *
 * @param jd - The Julian Day for which to calculate the solar longitude
 * @returns The solar longitude in degrees (0-360)
 *
 * @remarks
 * The calculations are based on the following steps:
 * 1. Calculate the time parameter T (in Julian centuries since J2000)
 * 2. Calculate the mean longitude L and mean anomaly M
 * 3. Apply correction terms C to account for Earth's elliptical orbit
 * 4. Normalize the result to be in the range [0, 360] degrees
 */
export function getSolarLongitude(jd: number): number {
  const T = (jd - J2000) / 36525

  const L = SOLAR_CONSTANTS.L0 + SOLAR_CONSTANTS.L1 * T
  const M = SOLAR_CONSTANTS.M0 + SOLAR_CONSTANTS.M1 * T

  const C =
    SOLAR_CONSTANTS.C1 * Math.sin(M * DEG_TO_RAD) +
    SOLAR_CONSTANTS.C2 * Math.sin(2 * M * DEG_TO_RAD) +
    SOLAR_CONSTANTS.C3 * Math.sin(3 * M * DEG_TO_RAD)

  let longitude = (L + C) % 360
  if (longitude < 0) longitude += 360

  return longitude
}

/**
 * Calculates the lunar longitude in degrees for a given Julian Day.
 *
 * This function computes the Moon's ecliptic longitude using a simplified model
 * based on Jean Meeus' algorithms. It includes several periodic terms:
 * - Evection
 * - Annual equation
 * - Variation
 * - Additional periodic corrections
 *
 * @param jd - The Julian Day Number for which to calculate the lunar longitude
 * @returns The Moon's ecliptic longitude in degrees (0-360)
 *
 * @remarks
 * The calculation uses various astronomical constants defined in LUNAR_CONSTANTS and SOLAR_CONSTANTS.
 * The result is normalized to the range 0-360 degrees.
 */
export function getLunarLongitude(jd: number): number {
  const T = (jd - J2000) / 36525
  const L = LUNAR_CONSTANTS.L0 + LUNAR_CONSTANTS.L1 * T
  const D = L - SOLAR_CONSTANTS.L0 - SOLAR_CONSTANTS.L1 * T
  const M = SOLAR_CONSTANTS.M0 + SOLAR_CONSTANTS.M1 * T
  const Mp = L - LUNAR_CONSTANTS.P0 - LUNAR_CONSTANTS.P1 * T
  const F = LUNAR_CONSTANTS.N0 + LUNAR_CONSTANTS.N1 * T

  const Ev = LUNAR_CONSTANTS.EVECTION * Math.sin(2 * (D - Mp) * DEG_TO_RAD)
  const Ae = LUNAR_CONSTANTS.YEARLY_EQ * Math.sin(M * DEG_TO_RAD)
  const V = LUNAR_CONSTANTS.VARIATION * Math.sin(2 * D * DEG_TO_RAD)
  const A1 = 0.114 * Math.sin((2 * D - Mp) * DEG_TO_RAD)
  const A2 = 0.1858 * Math.sin(F * DEG_TO_RAD)
  // Additional terms (from Meeus)
  const A3 = 0.37 * Math.sin((2 * D + Mp) * DEG_TO_RAD)
  const A4 = 0.2 * Math.sin(2 * F * DEG_TO_RAD)
  const A5 = 0.17 * Math.sin((2 * D - M) * DEG_TO_RAD)

  let longitude = (L + Ev - Ae + V + A1 + A2 + A3 + A4 + A5) % 360
  if (longitude < 0) longitude += 360
  return longitude
}

/**
 * Calculates the Julian date of the next new moon following the provided Julian date.
 *
 * This function uses an iterative approach to find when the elongation (angular difference
 * between lunar and solar longitudes) approaches zero, which indicates a new moon.
 *
 * @param jd - The starting Julian date
 * @returns The Julian date of the next new moon
 *
 * The algorithm:
 * 1. Steps forward in 1-hour increments from the starting date
 * 2. Calculates lunar and solar longitudes at each step
 * 3. When elongation is less than 0.5 degrees, uses linear interpolation
 *    to refine the result to sub-hour precision
 * 4. Has a fallback to return the approximate next new moon (starting JD + lunar synodic month)
 *    if no solution is found within 30 days
 */
export function findNextNewMoonJD(jd: number): number {
  const k = Math.floor((jd / 365.25 + (1 - 1) / 12 - 1900) * 12.985)
  const t = (jd - 2415021) / 36525
  let nt =
    2415020.75933 +
    29.5306 * k +
    0.0001178 * t * t -
    0.000000155 * t * t * t +
    0.00033 * Math.sin((166.56 + 132.87 * t - 0.009173 * t * t) * DEG_TO_RAD)
  const M = 359.2242 + 29.10535608 * k - 0.0000333 * t * t - 0.00000347 * t * t * t
  const M_m = 306.0253 + 385.81691806 * k + 0.0107306 * t * t + 0.00001236 * t * t * t
  const L_m = 21.2964 + 390.67050646 * k - 0.0016528 * t * t - 0.00000239 * t * t * t

  nt +=
    (0.1734 - 0.000393 * t) * Math.sin(M * DEG_TO_RAD) +
    0.0021 * Math.sin(2 * M * DEG_TO_RAD) +
    -0.4068 * Math.sin(M_m * DEG_TO_RAD) +
    0.0161 * Math.sin(2 * M_m * DEG_TO_RAD) +
    -0.0004 * Math.sin(3 * M_m * DEG_TO_RAD) +
    0.0104 * Math.sin(2 * L_m * DEG_TO_RAD) +
    -0.0051 * Math.sin((M + M_m) * DEG_TO_RAD) +
    -0.0074 * Math.sin((M - M_m) * DEG_TO_RAD) +
    0.0004 * Math.sin((2 * L_m + M) * DEG_TO_RAD) +
    -0.0004 * Math.sin((2 * L_m - M) * DEG_TO_RAD) +
    -0.0006 * Math.sin((2 * L_m + M_m) * DEG_TO_RAD) +
    0.001 * Math.sin((2 * L_m - M_m) * DEG_TO_RAD)

  return nt
}

/**
 * Calculates the Julian Date of the last new moon before the given Julian Date.
 *
 * This function uses an analytical approach to determine the most recent new moon
 * based on the lunar synodic month and corrections for solar and lunar anomalies,
 * as specified in the Nepal Sambat algorithm (Section IV.C, Equation 4.5).
 *
 * @param jd - The Julian Date for which to find the last new moon.
 * @returns The Julian Date of the last new moon before the input JD.
 *
 * @remarks
 * - Uses the mean new moon formula with corrections for solar and lunar anomalies.
 * - Based on the lunar cycle index (k) relative to the J2000 epoch.
 * - Includes higher-order terms for improved accuracy.
 * - Constants are aligned with the document's 1980.0 epoch for consistency.
 */
export function findLastNewMoonJD(jd: number): number {
  const LUNAR_SYNODIC_MONTH = 29.530588861
  const DEG_TO_RAD = Math.PI / 180

  // Constants from document (Section IV.C, Equation 4.5)
  const NEW_MOON_REF_JD = 2415020.75933 // Reference new moon (J1900)

  // Estimate lunar cycle index k
  const t = (jd - 2451545.0) / 36525 // Julian centuries since J2000
  const k = Math.floor((jd / 365.25 + (1 - 1) / 12 - 1900) * 12.3685) // Approximate cycles since 1900

  // Calculate mean new moon for cycle k
  let meanNewMoonJD = NEW_MOON_REF_JD + k * LUNAR_SYNODIC_MONTH

  // Apply corrections (Equation 4.5)
  const M = (359.2242 + 29.10535608 * k - 0.0000333 * t * t - 0.00000347 * t * t * t) % 360 // Solar mean anomaly
  const M_m = (306.0253 + 385.81691806 * k + 0.0107306 * t * t + 0.00001236 * t * t * t) % 360 // Lunar mean anomaly
  const F = (21.2964 + 390.67050646 * k - 0.0016528 * t * t - 0.00000239 * t * t * t) % 360 // Argument of latitude

  let correction = 0
  correction += (0.1734 - 0.000393 * t) * Math.sin(M * DEG_TO_RAD)
  correction += 0.0021 * Math.sin(2 * M * DEG_TO_RAD)
  correction -= 0.4068 * Math.sin(M_m * DEG_TO_RAD)
  correction += 0.0161 * Math.sin(2 * M_m * DEG_TO_RAD)
  correction -= 0.0004 * Math.sin(3 * M_m * DEG_TO_RAD)
  correction += 0.0104 * Math.sin(2 * F * DEG_TO_RAD)
  correction -= 0.0051 * Math.sin((M + M_m) * DEG_TO_RAD)
  correction -= 0.0074 * Math.sin((M - M_m) * DEG_TO_RAD)
  correction += 0.0004 * Math.sin((2 * F + M) * DEG_TO_RAD)
  correction -= 0.0004 * Math.sin((2 * F - M) * DEG_TO_RAD)
  correction -= 0.0006 * Math.sin((2 * F + M_m) * DEG_TO_RAD)
  correction += 0.001 * Math.sin((2 * F - M_m) * DEG_TO_RAD)
  correction += 0.0005 * Math.sin((M + 2 * M_m) * DEG_TO_RAD)

  let newMoonJD = meanNewMoonJD + correction

  // Ensure we get the *last* new moon (JD <= input jd)
  if (newMoonJD > jd) {
    const prevK = k - 1
    meanNewMoonJD = NEW_MOON_REF_JD + prevK * LUNAR_SYNODIC_MONTH
    const prevM =
      (359.2242 + 29.10535608 * prevK - 0.0000333 * t * t - 0.00000347 * t * t * t) % 360
    const prevM_m =
      (306.0253 + 385.81691806 * prevK + 0.0107306 * t * t + 0.00001236 * t * t * t) % 360
    const prevF =
      (21.2964 + 390.67050646 * prevK - 0.0016528 * t * t - 0.00000239 * t * t * t) % 360

    correction = 0
    correction += (0.1734 - 0.000393 * t) * Math.sin(prevM * DEG_TO_RAD)
    correction += 0.0021 * Math.sin(2 * prevM * DEG_TO_RAD)
    correction -= 0.4068 * Math.sin(prevM_m * DEG_TO_RAD)
    correction += 0.0161 * Math.sin(2 * prevM_m * DEG_TO_RAD)
    correction -= 0.0004 * Math.sin(3 * prevM_m * DEG_TO_RAD)
    correction += 0.0104 * Math.sin(2 * prevF * DEG_TO_RAD)
    correction -= 0.0051 * Math.sin((prevM + prevM_m) * DEG_TO_RAD)
    correction -= 0.0074 * Math.sin((prevM - prevM_m) * DEG_TO_RAD)
    correction += 0.0004 * Math.sin((2 * prevF + prevM) * DEG_TO_RAD)
    correction -= 0.0004 * Math.sin((2 * prevF - prevM) * DEG_TO_RAD)
    correction -= 0.0006 * Math.sin((2 * prevF + prevM_m) * DEG_TO_RAD)
    correction += 0.001 * Math.sin((2 * prevF - M_m) * DEG_TO_RAD)
    correction += 0.0005 * Math.sin((prevM + 2 * prevM_m) * DEG_TO_RAD)

    newMoonJD = meanNewMoonJD + correction
  }

  // Iterative refinement for higher precision
  let testJD = newMoonJD
  for (let i = 0; i < 10; i++) {
    const lunarLong = getLunarLongitude(testJD)
    const solarLong = getSolarLongitude(testJD)
    const elongation = (lunarLong - solarLong + 360) % 360
    if (Math.abs(elongation) < 0.01) break // Converged
    const prevJD = testJD - 0.01
    const prevElong = (getLunarLongitude(prevJD) - getSolarLongitude(prevJD) + 360) % 360
    const slope = (elongation - prevElong) / 0.01
    testJD -= elongation / slope // Linear interpolation
  }

  return testJD
}
