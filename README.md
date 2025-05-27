# Nepal Sambat Calendar for Vue 3

> **Note**: This project is currently in the testing phase. Contributions, feedback, and suggestions are warmly welcomed to enhance its functionality and user experience.

> The date conversion and astronomical calculations in this component are heavily based on the methodologies outlined in https://nsapi.spiralogics.net/nsalgorithm.pdf.

A Vue 3 component for displaying and converting dates to the Nepal Sambat calendar system. This package provides both a Vue component for easy integration and utility functions for date conversion.

## Features

- Convert Gregorian dates to Nepal Sambat calendar
- Display NS year, month, and tithi
- Show astronomical data (solar and lunar longitudes)
- Fully typed with TypeScript
- Vue 3 compatible
- Responsive design
- Comprehensive test coverage
- CI/CD pipeline with GitHub Actions

## Installation

```bash
# Using npm
npm install nepal-sambat
```

## Usage

### Basic Usage

```vue
<template>
  <NepalSambatCalendar />
</template>

<script setup>
import { NepalSambatCalendar } from 'nepal-sambat'
</script>
```

### With Custom Date

```vue
<template>
  <NepalSambatCalendar :date="customDate" />
</template>

<script setup>
import { ref } from 'vue'
import { NepalSambatCalendar } from 'nepal-sambat'

const customDate = ref(new Date(2024, 3, 14))
</script>
```

### Using Conversion Functions

```typescript
import {
  convertToNSDate,
  convertToNSYear,
  convertToNSMonth,
  convertToTithi,
  formatNSDate,
} from 'nepal-sambat'

// Example 1: Convert current date
const today = new Date()
const date = convertToNSDate(today.getFullYear(), today.getMonth() + 1, today.getDate())
console.log(formatNSDate(date))

// Example 2: Get individual components for a date
const year = convertToNSYear(2024)
const month = convertToNSMonth(2024, 4, 14)
const tithi = convertToTithi(2024, 4, 14)
console.log(`Year: ${year}, Month: ${month.nepaliName}, Tithi: ${tithi.name}`)

// Example 3: Convert a custom date
const customDate = new Date(2024, 3, 14)
const customNSDate = convertToNSDate(
  customDate.getFullYear(),
  customDate.getMonth() + 1,
  customDate.getDate(),
)
console.log(formatNSDate(customNSDate))

// Example 4: Convert a date directly with year, month, day
const date2 = convertToNSDate(2024, 3, 14)
console.log(formatNSDate(date2))

// Example output format:
// {
//   nsYear: 1144,
//   month: {
//     number: 12,
//     name: 'Yanlā',
//     nepaliName: 'ञंला',
//     startDeg: 150
//   },
//   tithi: {
//     number: 4,
//     adjustedNumber: 4,
//     paksha: 'थ्व',
//     name: 'चतुर्थी'
//   },
//   astronomical: {
//     solarLongitude: 353.45,
//     lunarLongitude: 45.67,
//     elongation: 52.22
//   },
//   julianDay: 2460384.5
// }
```

## Props

| Prop | Type | Default    | Description                    |
| ---- | ---- | ---------- | ------------------------------ |
| date | Date | new Date() | Date to convert to NS calendar |

## Technical Details

The package uses advanced astronomical calculations to ensure accurate date conversions:

- Solar and lunar longitude calculations
- Julian Day Number conversions
- Astronomical corrections for improved accuracy
- TypeScript for type safety and better developer experience
- Vue 3 compatibility for seamless integration

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run tests for conversion
npm run convert
```

## Testing Phase

This project is currently in testing phase. We need help with:

- Testing date conversions across different years
- Verifying astronomical calculations
- Performance optimization

## License

MIT
