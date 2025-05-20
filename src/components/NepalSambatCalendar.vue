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
  props: {
    date: {
      type: Date,
      default: () => new Date(),
    },
  },
  data() {
    return {
      internalDate: null as any,
    }
  },
  mounted() {
    this.loadDate(this.date.getFullYear(), this.date.getMonth() + 1, this.date.getDate())
  },
  methods: {
    loadDate(year: number, month: number, day: number) {
      this.internalDate = convertToNSDate(year, month, day)
    },
    getFormattedDate() {
      return this.internalDate ? formatNSDate(this.internalDate) : ''
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
