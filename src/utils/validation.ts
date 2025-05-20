/**
 * Validation utilities for Nepal Sambat calculations
 */
import type { NSDate, NSMonth, NSTithi } from '../constants/types'

/**
 * Validates if a number is within a specified range
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max
}

/**
 * Validates if a solar longitude is valid
 */
export function isValidSolarLongitude(longitude: number): boolean {
  return isInRange(longitude, 0, 360)
}

/**
 * Validates if a lunar longitude is valid
 */
export function isValidLunarLongitude(longitude: number): boolean {
  return isInRange(longitude, 0, 360)
}

/**
 * Validates if a tithi number is valid
 */
export function isValidTithi(tithi: number): boolean {
  return isInRange(tithi, 1, 30)
}

/**
 * Validates if an NS month number is valid
 */
export function isValidNSMonth(month: number): boolean {
  return isInRange(month, 1, 12)
}

/**
 * Validates if an NS year is valid
 */
export function isValidNSYear(year: number): boolean {
  // NS year should be positive and reasonable
  return year > 0 && year < 2000
}

/**
 * Calculates error bounds for solar longitude
 */
export function getSolarLongitudeErrorBounds(longitude: number): { min: number; max: number } {
  // Based on astronomical accuracy
  const errorMargin = 0.1 // degrees
  return {
    min: longitude - errorMargin,
    max: longitude + errorMargin,
  }
}

/**
 * Calculates error bounds for lunar longitude
 */
export function getLunarLongitudeErrorBounds(longitude: number): { min: number; max: number } {
  // Based on astronomical accuracy
  const errorMargin = 0.2 // degrees
  return {
    min: longitude - errorMargin,
    max: longitude + errorMargin,
  }
}

/**
 * Validates if a date conversion result is within acceptable error bounds
 */
export function validateConversionResult(
  result: NSDate,
  expected: {
    astronomical?: {
      solarLongitude?: number
      lunarLongitude?: number
    }
    tithi?: Partial<NSTithi>
    month?: Partial<NSMonth>
    nsYear?: number
  },
): boolean {
  if (expected.astronomical) {
    if (expected.astronomical.solarLongitude) {
      const bounds = getSolarLongitudeErrorBounds(expected.astronomical.solarLongitude)
      if (!isInRange(result.astronomical.solarLongitude, bounds.min, bounds.max)) {
        return false
      }
    }
    if (expected.astronomical.lunarLongitude) {
      const bounds = getLunarLongitudeErrorBounds(expected.astronomical.lunarLongitude)
      if (!isInRange(result.astronomical.lunarLongitude, bounds.min, bounds.max)) {
        return false
      }
    }
  }

  if (expected.tithi) {
    if (expected.tithi.number && result.tithi.number !== expected.tithi.number) {
      return false
    }
    if (
      expected.tithi.adjustedNumber &&
      result.tithi.adjustedNumber !== expected.tithi.adjustedNumber
    ) {
      return false
    }
    if (expected.tithi.paksha && result.tithi.paksha !== expected.tithi.paksha) {
      return false
    }
    if (expected.tithi.name && result.tithi.name !== expected.tithi.name) {
      return false
    }
  }

  if (expected.month) {
    if (expected.month.number && result.month.number !== expected.month.number) {
      return false
    }
    if (expected.month.name && result.month.name !== expected.month.name) {
      return false
    }
    if (expected.month.nepaliName && result.month.nepaliName !== expected.month.nepaliName) {
      return false
    }
    if (expected.month.startDeg && result.month.startDeg !== expected.month.startDeg) {
      return false
    }
    if (expected.month.isLeap !== undefined && result.month.isLeap !== expected.month.isLeap) {
      return false
    }
    if (
      expected.month.isSkipped !== undefined &&
      result.month.isSkipped !== expected.month.isSkipped
    ) {
      return false
    }
  }

  if (expected.nsYear && result.nsYear !== expected.nsYear) {
    return false
  }

  return true
}
