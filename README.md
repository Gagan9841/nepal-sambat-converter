# Nepal Sambat Calendar for Vue 3

> **Note**: This project is currently in the testing phase. Contributions, feedback, and suggestions are warmly welcomed to enhance its functionality and user experience.

> The date conversion and astronomical calculations in this component are heavily based on the methodologies outlined in https://nsapi.spiralogics.net/nsalgorithm.pdf.

A Vue 3 component for displaying and converting dates to the Nepal Sambat calendar system.

## Installation

```bash
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
import { convertToNSDate } from 'nepal-sambat'

const date = new Date(2024,3,14)
const nsDate = convertToNSDate(date)

console.log(nsDate)
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

## Features

- Convert Gregorian dates to Nepal Sambat calendar
- Display NS year, month, and tithi
- Show astronomical data (solar and lunar longitudes)
- Fully typed with TypeScript
- Vue 3 compatible
- Responsive design

## Props

| Prop | Type | Default    | Description                    |
| ---- | ---- | ---------- | ------------------------------ |
| date | Date | new Date() | Date to convert to NS calendar |

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
```

## License

MIT
