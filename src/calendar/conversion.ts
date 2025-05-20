import type { NSDate, NSMonth, NSTithi, NSAstronomical } from '../constants/types'
import {
  calculateSolarLongitude,
  calculateLunarLongitude,
  calculateElongation,
} from '../astronomy/calculations'
import { NS_MONTHS, TITHI_NAMES } from '../constants/values'
import { gregorianToJD } from '../utils/julian'

export function convertToNSDate(date: Date): NSDate {
  const year = date.getFullYear()
  const month = date.getMonth() + 1 // JavaScript months are 0-based
  const day = date.getDate()

  const nsYear = convertToNSYear(year, month)
  const nsMonth = convertToNSMonth(year, month)
  const tithi = convertToTithi(date)
  const astronomical = calculateAstronomicalData(date)
  const julianDay = gregorianToJD(year, month, day)

  return {
    nsYear,
    month: nsMonth,
    tithi,
    astronomical,
    julianDay,
  }
}

export function convertToNSYear(year: number, month: number): number {
  // NS year starts in mid-April
  return month < 4 ? year - 879 : year - 878
}

export function convertToNSMonth(_year: number, month: number): NSMonth {
  const monthIndex = (month + 8) % 12 // Adjust for NS month start
  const monthNumber = monthIndex + 1
  const monthData = NS_MONTHS[monthNumber - 1]

  // Check for Analā (leap month)
  const isLeap = checkForAnala()
  // Check for Nhalā (skipped month)
  const isSkipped = checkForNhala()

  return {
    number: monthNumber,
    name: monthData.name,
    nepaliName: monthData.nepali,
    startDeg: monthData.startDeg,
    isLeap,
    isSkipped,
  }
}

export function convertToTithi(date: Date): NSTithi {
  const astronomical = calculateAstronomicalData(date)
  const tithiNumber = Math.floor(astronomical.elongation / 12) + 1
  const adjustedNumber = tithiNumber > 15 ? tithiNumber - 15 : tithiNumber
  const paksha = tithiNumber <= 15 ? 'थ्व' : 'गा'

  return {
    number: tithiNumber,
    adjustedNumber,
    paksha,
    name: TITHI_NAMES[adjustedNumber - 1],
  }
}

function calculateAstronomicalData(date: Date): NSAstronomical {
  const solarLongitude = calculateSolarLongitude(date)
  const lunarLongitude = calculateLunarLongitude(date)
  const elongation = calculateElongation(solarLongitude, lunarLongitude)

  return {
    solarLongitude,
    lunarLongitude,
    elongation,
  }
}

function checkForAnala(): boolean {
  // Implementation for checking if the current month is Analā
  // This is a placeholder - actual implementation would use astronomical calculations
  return false
}

function checkForNhala(): boolean {
  // Implementation for checking if the current month is Nhalā
  // This is a placeholder - actual implementation would use astronomical calculations
  return false
}
