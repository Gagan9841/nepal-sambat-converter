/**
 * Converts a Gregorian calendar date to Julian Day (JD).
 *
 * @param year - The Gregorian year (must be an integer)
 * @param month - The month number (1-12, must be an integer)
 * @param day - The day of the month (1-31, must be an integer and valid for the given month/year)
 * @returns The Julian Day number as a decimal value
 * @throws {Error} If year, month, or day are not integers or out of valid ranges
 * @throws {Error} If the day is invalid for the given month and year
 */
export function gregorianToJD(year: number, month: number, day: number): number {
  if (!Number.isInteger(year)) {
    throw new Error("Year must be an integer.");
  }
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new Error("Month must be between 1 and 12.");
  }
  if (!Number.isInteger(day) || day < 1 || day > 31) {
    throw new Error("Day must be between 1 and 31.");
  }

  const daysInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  if (month === 2) {
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    daysInMonth[2] = isLeapYear ? 29 : 28;
  }

  if (day > daysInMonth[month]) {
    throw new Error(`Invalid day ${day} for month ${month} in year ${year}.`);
  }

  let y = year;
  let m = month;

  if (m <= 2) {
    y -= 1;
    m += 12;
  }

  const a = Math.floor(y / 100);
  const b = Math.floor(a / 4);

  if (
    year > 1582 ||
    (year === 1582 && month > 10) ||
    (year === 1582 && month === 10 && day >= 15)
  ) {
    const c = 2 - a + b;
    return (
      Math.floor(365.25 * (y + 4716)) +
      Math.floor(30.6001 * (m + 1)) +
      day +
      c -
      1524.5
    );
  } else {
    return (
      Math.floor(365.25 * (y + 4716)) +
      Math.floor(30.6001 * (m + 1)) +
      day -
      1524.5
    );
  }
} 