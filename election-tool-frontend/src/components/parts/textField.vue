<template>
  <div>
    <div v-if="!readOnly">
      <textarea-autosize
        :placeholder="placeholder"
        :rows="rows"
        :required="required"
        :min-height="minHeight"
        v-bind:style="{ border: border}"
        v-model="valueData"
        v-on:input="emitInput()"
      ></textarea-autosize>
    </div>
    <div class="word-break" v-else>
      {{valueData}}
    </div>
  </div>
</template>

<script>

import Vue from 'vue'
import VueTextareaAutosize from 'vue-textarea-autosize'

Vue.use(VueTextareaAutosize)

export default {
  name: 'textField',
  props: {
    readOnly: {
      type: Boolean,
      default: false,
      required: false
    },
    value: {
      type: String,
      required: false
    },
    placeholder: {
      type: String,
      default: '',
      required: false
    },
    rows: {
      type: String,
      default: '1',
      required: false
    },
    required: {
      type: String,
      default: 'false',
      required: false
    },
    minHeight: {
      type: Number,
      default: 40,
      required: false
    },
    border: {
      type: String,
      default: '1px solid var(--colorDarkerGrey)',
      required: false
    }
  },
  data () {
    return {
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
  }
}
</script>

<style scoped>
  textarea {
    width: 100%;
    padding: 8px;
    border-radius: 2px;
  }

  textarea::placeholder {
    color: #bbb;
  }

  .word-break  {
    word-break: break-all;
  }
</style>
