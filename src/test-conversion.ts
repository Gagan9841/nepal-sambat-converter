import {
  convertToNSDate,
  formatNSDate,
  convertToNSYear,
  convertToNSMonth,
  convertToTithi,
} from './calendar/conversion'

// Test case 1: Convert January 6, 2025
const today = new Date()
const date = convertToNSDate(today.getFullYear(), today.getMonth() + 1, today.getDate())
console.log(formatNSDate(date)) // Expected: "1145 पोहेला थ्व तृतीया - 3"

// Test case 2: Get individual components for January 2, 2025
const year = convertToNSYear(today.getFullYear())
const month = convertToNSMonth(today.getFullYear(), today.getMonth() + 1, today.getDate())
const tithi = convertToTithi(today.getFullYear(), today.getMonth() + 1, today.getDate())
console.log(`Year: ${year}, Month: ${month.nepaliName}, Tithi: ${tithi.name}`)
