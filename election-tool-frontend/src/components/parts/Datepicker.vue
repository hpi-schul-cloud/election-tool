<template>
  <date-pick
    class="datepicker"
    v-model="valueData"
    v-on:input="emitInput()"
    :pickTime="true"
    :format="'DD.MM.YYYY HH:mm'"
    :months="months"
    :weekdays="weekdays"
    :setTimeCaption="setTimeCaption"
    :nextMonthCaption="nextMonthCaption"
    :prevMonthCaption="prevMonthCaption"
    :mobileBreakpointWidth=320></date-pick>
</template>

<script>

import DatePick from 'vue-date-pick'
import 'vue-date-pick/dist/vueDatePick.css'

export default {
  name: 'Datepicker',
  components: {
    DatePick
  },
  props: ['value'],
  data: () => {
    return {
      nextMonthCaption: 'Nächster Monat',
      prevMonthCaption: 'Vorheriger Monat',
      setTimeCaption: 'Zeit:',
      weekdays: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
      months: ['Januar', 'Februar', 'März', 'April',
        'Mai', 'Juni', 'Juli', 'August',
        'September', 'Oktober', 'November', 'Dezember'],
      valueData: this.value
    }
  },
  methods: {
    emitInput () {
      this.$emit('input', this.valueData)
    }
  },
  watch: {
    value (val) {
      this.valueData = val
    }
  },
  mounted () {
    this.valueData = this.value
  }
}

</script>

<style scoped>

  >>> input[type=number] {
    appearance:textfield;
  }

</style>
