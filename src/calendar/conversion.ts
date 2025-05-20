import type { NSMonth, NSTithi, NSAstronomical, NSDate } from '../constants/types'
import { NS_MONTHS, TITHI_NAMES, KALIYUGA_EPOCH_JD, TROPICAL_YEAR } from '../constants/values'
import { gregorianToJD } from '../utils/julian'
import {
  getSunriseJD,
  getSolarLongitude,
  getLunarLongitude,
  findNextNewMoonJD,
} from '../astronomy/calculations'

/**
 * Calculates the Nepal Sambat (NS) month based on the given Julian Date (JD).
 *
 * @param jd - The Julian Date for which to calculate the NS month.
 * @returns The NS month as a number (1-based index).
 *
 * The function determines the solar longitude for the given Julian Date
 * and iterates through the NS_MONTHS array to find the corresponding month.
 * It handles the wrap-around case where the end degree of one month is less
 * than the start degree of the next month.
 *
 * If no match is found, the function defaults to returning the first month.
 */
export function calculateNSMonth(jd: number): number {
  const solarLong = getSolarLongitude(jd)

  for (let i = 0; i < NS_MONTHS.length; i++) {
    const nextIdx = (i + 1) % NS_MONTHS.length
    const startDeg = NS_MONTHS[i].startDeg
    const endDeg = NS_MONTHS[nextIdx].startDeg

    if (endDeg > startDeg) {
      if (solarLong >= startDeg && solarLong < endDeg) return i + 1
    } else {
      if (solarLong >= startDeg || solarLong < endDeg) return i + 1
    }
  }

  return 1
}

/**
 * Calculates the NS (Nepal Sambat) year based on the given Julian Day (JD) and NS month.
 *
 * @param jd - The Julian Day number.
 * @param nsMonth - The NS month (1-12).
 * @returns The calculated NS year.
 */
export function calculateNSYear(jd: number, nsMonth: number): number {
  const daysSinceKY = jd - KALIYUGA_EPOCH_JD
  const kyYear = Math.floor((daysSinceKY + (10 - nsMonth) * 30) / TROPICAL_YEAR)
  const sakaYear = kyYear - 3179
  const offset = 2
  return sakaYear - 800 - offset
}

/**
 * Calculates the Tithi (lunar day) based on the given Julian Date.
 *
 * @param jd - The Julian Date for which to calculate the Tithi.
 * @returns The Tithi (lunar day) as a number between 1 and 30.
 *
 * The Tithi is determined by the elongation (angular distance) between the
 * Moon and the Sun. The elongation is calculated as the difference between
 * the lunar longitude and the solar longitude, adjusted to be within the
 * range of 0 to 360 degrees. A small offset is added to handle boundary cases.
 *
 * The Tithi is then calculated by dividing the elongation by 12 and adding 1.
 * If the resulting Tithi exceeds 30, it is reset to 1.
 */
export function calculateTithi(jd: number): number {
  const sunriseJD = getSunriseJD(jd)
  const lunarLong = getLunarLongitude(sunriseJD)
  const solarLong = getSolarLongitude(sunriseJD)

  const elongation = (lunarLong - solarLong + 360) % 360
  const tithi = Math.ceil(elongation / 12)

  return tithi > 30 ? 1 : tithi
}

/**
 * Determines if the current and next NS months represent an Analā (leap month) or Nhalā (skipped month).
 *
 * @param thisMonth - The current NS month (1-12).
 * @param nextMonth - The next NS month (1-12).
 * @returns An object indicating whether the current month is an Analā or Nhalā:
 *  - `anala`: 1 if the current month is a leap month, otherwise 0.
 *  - `nhala`: 1 if the current month is a skipped month, otherwise 0.
 */
export function checkForAnalaAndNhala(
  thisMonth: number,
  nextMonth: number,
): { anala: number; nhala: number } {
  return {
    anala: thisMonth === nextMonth ? 1 : 0,
    nhala: nextMonth - thisMonth === 2 ? 1 : 0,
  }
}

/**
 * Converts a given Gregorian year and month to the corresponding Nepali Sambat (NS) year.
 *
 * @param year - The Gregorian year to convert.
 * @param month - The Gregorian month to convert (default is October).
 * @returns The corresponding Nepali Sambat (NS) year.
 */
export function convertToNSYear(year: number, month: number = 10): number {
  const jd = gregorianToJD(year, month, 1)
  const nsMonth = calculateNSMonth(jd)
  return calculateNSYear(jd, nsMonth)
}

/**
 * Converts a given Gregorian date to the corresponding Nepal Sambat (NS) month.
 *
 * @param year - The Gregorian year.
 * @param month - The Gregorian month (1-12).
 * @param day - The Gregorian day of the month.
 * @returns An object representing the NS month, including its number, name, Nepali name, and flags for Anala and Nhala.
 */
export function convertToNSMonth(year: number, month: number, day: number): NSMonth {
  const jd = gregorianToJD(year, month, day)
  const nsMonth = calculateNSMonth(jd)

  const nextNewMoonJD = findNextNewMoonJD(jd)
  const nextNsMonth = calculateNSMonth(nextNewMoonJD)
  const { anala, nhala } = checkForAnalaAndNhala(nsMonth, nextNsMonth)

  const monthInfo = NS_MONTHS[nsMonth - 1]

  return {
    number: nsMonth,
    name: monthInfo.name,
    nepaliName: monthInfo.nepali,
    anala,
    nhala,
  }
}

/**
 * Converts a given Gregorian date to the corresponding Tithi in the Nepali calendar.
 *
 * @param year - The year of the Gregorian date.
 * @param month - The month of the Gregorian date (1-12).
 * @param day - The day of the Gregorian date (1-31).
 * @returns An object representing the Tithi in the Nepali calendar, including:
 *  - `number`: The Tithi number.
 *  - `adjustedNumber`: The adjusted Tithi number (1-15).
 *  - `paksha`: The Paksha ('थ्व' for Shukla Paksha, 'गा' for Krishna Paksha).
 *  - `name`: The name of the Tithi.
 */
export function convertToTithi(year: number, month: number, day: number): NSTithi {
  const jd = gregorianToJD(year, month, day)
  const tithi = calculateTithi(jd)
  const adjustedTithi = ((tithi - 1) % 15) + 1

  return {
    number: tithi,
    adjustedNumber: adjustedTithi,
    paksha: tithi <= 15 ? 'थ्व' : 'गा',
    name: TITHI_NAMES[adjustedTithi - 1],
  }
}

/**
 * Calculates and returns astronomical details for a given Gregorian date.
 *
 * @param year - The year of the date.
 * @param month - The month of the date (1-12).
 * @param day - The day of the date (1-31).
 * @returns An object containing the solar longitude, lunar longitude, and elongation.
 */
export function getAstronomicalDetails(year: number, month: number, day: number): NSAstronomical {
  const jd = gregorianToJD(year, month, day)
  const sunriseJD = getSunriseJD(jd)
  const solarLong = getSolarLongitude(sunriseJD)
  const lunarLong = getLunarLongitude(sunriseJD)

  return {
    solarLongitude: solarLong,
    lunarLongitude: lunarLong,
    elongation: (lunarLong - solarLong + 360) % 360,
  }
}

/**
 * Converts a given Gregorian date to a Nepali date (NSDate).
 *
 * @param year - The Gregorian year.
 * @param month - The Gregorian month (1-12).
 * @param day - The Gregorian day (1-31).
 * @returns An NSDate object containing the Nepali year, month, tithi, astronomical details, and Julian day.
 */
export function convertToNSDate(year: number, month: number, day: number): NSDate {
  const jd = gregorianToJD(year, month, day)
  const nsMonth = convertToNSMonth(year, month, day)
  const nsTithi = convertToTithi(year, month, day)
  const astro = getAstronomicalDetails(year, month, day)

  return {
    nsYear: calculateNSYear(jd, nsMonth.number),
    month: nsMonth,
    tithi: nsTithi,
    astronomical: astro,
    julianDay: jd,
  }
}

/**
 * Formats an NSDate object into a string representation.
 *
 * @param date - The NSDate object to format.
 * @returns A string representing the formatted NSDate.
 */
export function formatNSDate(date: NSDate): string {
  return `${date.nsYear} ${date.month.nepaliName}${date.tithi.paksha} ${date.tithi.name} - ${date.tithi.adjustedNumber}`
}
