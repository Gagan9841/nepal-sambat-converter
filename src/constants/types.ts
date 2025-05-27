/**
 * Interface representing the constants used in lunar calculations.
 *
 * @property {number} L0 - Mean longitude of the Moon.
 * @property {number} P0 - Mean longitude of the perigee.
 * @property {number} N0 - Mean longitude of the ascending node.
 * @property {number} L1 - Mean anomaly of the Moon.
 * @property {number} P1 - Mean anomaly of the perigee.
 * @property {number} N1 - Mean anomaly of the ascending node.
 * @property {number} EVECTION - Evection correction term.
 * @property {number} VARIATION - Variation correction term.
 * @property {number} YEARLY_EQ - Yearly equation correction term.
 * @property {number} PARALLACTIC - Parallactic correction term.
 */
export interface LunarConstants {
  L0: number
  P0: number
  N0: number
  L1: number
  P1: number
  N1: number
  EVECTION: number
  VARIATION: number
  YEARLY_EQ: number
  PARALLACTIC: number
}

/**
 * Interface for solar constants used in astronomical calculations.
 */
export interface SolarConstants {
  L0: number
  M0: number
  L1: number
  M1: number
  C1: number
  C2: number
  C3: number
}

/**
 * Interface for NS month data.
 */
export interface NSMonth {
  number: number
  name: string
  nepaliName: string
  anala: number
  nhala: number
}

/**
 * Interface for NS tithi data.
 */
export interface NSTithi {
  number: number
  adjustedNumber: number
  paksha: string
  name: string
  type?: number | string // '0' for normal, '8' for Anala, '9' for Nhalā
  // '8' indicates Anala (leap month), '9' indicates Nhalā (skipped month)
}

/**
 * Interface for astronomical details.
 */
export interface NSAstronomical {
  solarLongitude: number
  lunarLongitude: number
  elongation: number
}

/**
 * Interface for a complete NS date.
 */
export interface NSDate {
  nsYear: number
  month: NSMonth
  tithi: NSTithi
  astronomical: NSAstronomical
  julianDay: number
}
