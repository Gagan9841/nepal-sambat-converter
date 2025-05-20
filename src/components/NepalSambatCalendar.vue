<template>
  <div class="nepal-sambat-calendar">
    <div class="calendar-header">
      <h2>{{ formatDate }}</h2>
    </div>
    <div class="calendar-body">
      <div class="ns-date">
        <div class="ns-year">NS {{ nsDate.nsYear }}</div>
        <div class="ns-month">{{ nsDate.month.nepaliName }}</div>
        <div class="ns-tithi">{{ nsDate.tithi.name }}</div>
      </div>
      <div class="astronomical-info">
        <div class="solar-longitude">
          Solar Longitude: {{ nsDate.astronomical.solarLongitude.toFixed(2) }}°
        </div>
        <div class="lunar-longitude">
          Lunar Longitude: {{ nsDate.astronomical.lunarLongitude.toFixed(2) }}°
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { convertToNSDate } from '../calendar/conversion';
import type { NSDate } from '../constants/types';

const props = defineProps<{
  date?: Date;
}>();

const currentDate = computed(() => props.date || new Date());
const nsDate = computed<NSDate>(() => convertToNSDate(currentDate.value));

const formatDate = computed(() => {
  return currentDate.value.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});
</script>

<style scoped>
.nepal-sambat-calendar {
  font-family: system-ui, -apple-system, sans-serif;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  max-width: 400px;
  margin: 0 auto;
}

.calendar-header {
  text-align: center;
  margin-bottom: 1rem;
}

.calendar-header h2 {
  margin: 0;
  color: #2d3748;
  font-size: 1.25rem;
}

.calendar-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.ns-date {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background-color: #f7fafc;
  border-radius: 4px;
}

.ns-year {
  font-weight: bold;
  color: #4a5568;
}

.ns-month {
  color: #2d3748;
}

.ns-tithi {
  color: #4a5568;
}

.astronomical-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #718096;
}

.solar-longitude,
.lunar-longitude {
  display: flex;
  justify-content: space-between;
}
</style> 