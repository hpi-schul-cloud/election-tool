<template>
  <div v-bind:class="{ fullWidth : fullWidth, margin : withMargin}">
     <label>
        <input v-bind:type="inputType" class="option-input" :checked="value === inputValue" @click="handleClick($event)" v-bind:name="inputName" v-bind:value="inputValue"/>
          <slot></slot>
      </label>
  </div>
</template>

<script>
export default {
  name: 'inputButton',
  props: {
    inputValue: String,
    inputType: String,
    inputName: String,
    value: String,
    fullWidth: Boolean,
    withMargin: Boolean,
    disableCheckboxes: Boolean
  },
  methods: {
    handleClick (event) {
      let state = ''
      if (event.target.checked) {
        state = 'checked'
      } else {
        state = 'unchecked'
      }
      if (state === 'checked' && this.disableCheckboxes === true) {
        event.target.checked = false
      } else {
        this.$emit('checkboxClicked', JSON.stringify([state, event.target.value]))
      }
    }
  }
}
</script>

<style scoped>
  label {
    display: flex;
    align-items: center;
  }

  .option-input {
    appearance: none;
    height: var(--radioBtnHeight);
    width: var(--radioBtnHeight);
    transition: all 0.15s ease-out 0s;
    background: var(--lightGrey);
    color: #fff;
    cursor: pointer;
    outline: none;
    margin: 0;
    margin-right: 1em;
    border-radius: 50%;
  }

  .option-input:hover {
    background: var(--HoverColor);
  }

  .option-input:checked {
    background: var(--primaryColor);
  }

  .option-input:checked::before {
    height: var(--radioBtnHeight);
    width: var(--radioBtnHeight);
    position: absolute;
    content: '✔';
    display: inline-block;
    font-size: calc(var(--radioBtnHeight) / 1.8);
    text-align: center;
    line-height: var(--radioBtnHeight);
  }

  .fullWidth {
    flex: 1;
  }

  .margin {
    margin: 1.1rem .5rem 1.1rem 0;
  }
</style>
