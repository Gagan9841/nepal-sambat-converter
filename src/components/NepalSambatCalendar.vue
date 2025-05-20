<template>
  <div class="nepal-sambat-calendar">
    <!-- Calendar UI to be implemented -->
    <h1>Nepal Sambat Calendar</h1>
    <p>Display Nepal Sambat date here</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { convertToNSDate, formatNSDate } from '../calendar/conversion'

export default defineComponent({
  name: 'NepalSambatCalendar',
  data() {
    return {
      date: null as any,
    }
  },
  mounted() {
    // Example: Load today's date
    const today = new Date()
    this.loadDate(today.getFullYear(), today.getMonth() + 1, today.getDate())
  },
  methods: {
    loadDate(year: number, month: number, day: number) {
      this.date = convertToNSDate(year, month, day)
    },
    getFormattedDate() {
      return this.date ? formatNSDate(this.date) : ''
    },
  },
})
</script>

<style scoped>
.nepal-sambat-calendar {
  font-family: Arial, sans-serif;
  text-align: center;
}
</style>
