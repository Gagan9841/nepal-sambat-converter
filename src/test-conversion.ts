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
console.log(formatNSDate(date)) 

// Test case 2: Get individual components for January 2, 2025
const year = convertToNSYear(today.getFullYear())
const month = convertToNSMonth(today.getFullYear(), today.getMonth() + 1, today.getDate())
const tithi = convertToTithi(today.getFullYear(), today.getMonth() + 1, today.getDate())
console.log(`Year: ${year}, Month: ${month.nepaliName}, Tithi: ${tithi.name}`)

// Test case 3: Convert a custom date
const customDate = new Date(2024, 3, 14)
const customNSDate = convertToNSDate(customDate.getFullYear(), customDate.getMonth() + 1, customDate.getDate())
console.log(formatNSDate(customNSDate)) 

// Test case 4: Convert a date Directly
const date2 = convertToNSDate(2024, 3, 14)
console.log(formatNSDate(date2)) 

// Test case 5: Format a converted date
const formattedDate = formatNSDate(customNSDate)
console.log(formattedDate)


