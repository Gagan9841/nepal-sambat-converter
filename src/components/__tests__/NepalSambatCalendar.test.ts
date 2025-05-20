import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import NepalSambatCalendar from '../NepalSambatCalendar.vue'

describe('NepalSambatCalendar', () => {
  it('renders properly', () => {
    const wrapper = mount(NepalSambatCalendar)
    expect(wrapper.exists()).toBe(true)
  })

  it('accepts date prop', () => {
    const testDate = new Date('2024-03-14')
    const wrapper = mount(NepalSambatCalendar, {
      props: {
        date: testDate,
      },
    })
    expect(wrapper.vm.date).toBe(testDate)
  })
})
