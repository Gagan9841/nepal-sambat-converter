/**
 * Nepal Sambat Calendar Conversion Module
 *
 * This module provides functions to convert Gregorian dates to the Nepal Sambat (NS) calendar,
 * a lunisolar calendar used in Nepal. It includes calculations for NS year, month, tithi (lunar day),
 * and astronomical details such as solar and lunar longitudes.
 */

import NepalSambatCalendar from './components/NepalSambatCalendar.vue';
import { convertToNSDate, convertToNSYear, convertToNSMonth, convertToTithi } from './calendar/conversion';
import type { NSDate, NSMonth, NSTithi, NSAstronomical } from './constants/types';

export {
  NepalSambatCalendar,
  convertToNSDate,
  convertToNSYear,
  convertToNSMonth,
  convertToTithi
};

export type {
  NSDate,
  NSMonth,
  NSTithi,
  NSAstronomical
};
