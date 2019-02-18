/* Submit Button animation from  https://codepen.io/valentingalmand/pen/MYMZZK */

<template>
    <button :class="getClass()" ref="submitBtn" :style="{'--content': mycontent}" v-on:click=submit></button>
</template>

<script>
export default {
  computed: {
    button: function () {
      return this.$refs.submitBtn
    },
    mycontent: function () {
      return '"' + this.content + '"'
    }
  },
  props: {
    content: String,
    status: {
      type: String,
      required: true,
      validator: function (value) {
        return ['disabled', 'active', 'loading', 'error', 'success', 'hidden'].includes(value)
      }
    }
  },
  methods: {
    getClass () {
      return {
        btn: true,
        btn_primary: this.status === 'active' || this.status === 'loading' || this.status === 'success' || this.status === 'error',
        disabled: this.status === 'disabled',
        onclick: this.status === 'loading',
        approve: this.status === 'success',
        reject: this.status === 'error',
        hidden: this.status === 'hidden'
      }
    },
    submit () {
      this.$emit('btnClicked')
    }
  }
}
</script>

<style scoped>
  .btn {
    margin: 1rem 0;
  }
  .btn::after {
    content: var(--content);
  }
  .onclick {
    width: 40px;
    height: 40px;
    border-color:#bbbbbb;
    border-width:3px;
    font-size:0;
    border-left-color: var(--primaryColor);
    animation: rotating 2s 0.25s linear infinite;
  }
  .onclick::after {
    content:"";
  }
  .onclick:hover {
    color: var(--primaryColor);
    background: var(--colorWhite);
  }
  .approve, .reject {
    font-size: 15px;
    color: var(--colorWhite);
    background: var(--primaryColor);
    width: 150px;
  }
  .approve::after {
    font-family:'FontAwesome';
    content:'✔';
  }
  .reject::after {
    font-family:'FontAwesome';
    content:'X';
  }
  .hidden {
    display: none;
  }

  @keyframes rotating {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
