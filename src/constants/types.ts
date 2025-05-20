/**
 * Core interfaces for Nepal Sambat calendar calculations
 */

export interface LunarConstants {
  L0: number;
  P0: number;
  N0: number;
  L1: number;
  P1: number;
  N1: number;
  EVECTION: number;
  VARIATION: number;
  YEARLY_EQ: number;
  PARALLACTIC: number;
}

export interface SolarConstants {
  L0: number;
  M0: number;
  L1: number;
  M1: number;
  C1: number;
  C2: number;
  C3: number;
}

export interface NSMonth {
  number: number;
  name: string;
  nepaliName: string;
  isLeap?: boolean;
  isSkipped?: boolean;
  startDeg: number;
}

export interface NSTithi {
  number: number;
  adjustedNumber: number;
  paksha: string;
  name: string;
}

export interface NSAstronomical {
  solarLongitude: number;
  lunarLongitude: number;
  elongation: number;
}

export interface NSDate {
  nsYear: number;
  month: NSMonth;
  tithi: NSTithi;
  astronomical: NSAstronomical;
  julianDay: number;
}

export interface ConversionResult {
  nsYear: number;
  month: NSMonth;
  tithi: NSTithi;
  astronomical: NSAstronomical;
}
