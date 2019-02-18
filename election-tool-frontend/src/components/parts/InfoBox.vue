<template>
  <div>
    <div class="option">
      <slot name="content"></slot>
      <span class="info-icon"
            v-on:mouseover="showInfo()"
            v-on:mouseleave="hideInfo()">&#9432;</span>
    </div>
    <transition name="fade">
      <div class="info-box-wrapper" v-show="showInfoBox">
        <div class="info-box"> {{infoText}} </div>
      </div>
    </transition>
  </div>
</template>

<script>

export default {
  name: 'InfoBox',
  props: {
    infoText: {
      type: String,
      required: true
    }
  },
  data: () => {
    return {
      showInfoBox: false
    }
  },
  methods: {
    showInfo () {
      this.showInfoBox = true
    },
    hideInfo () {
      setTimeout(() => {
        this.showInfoBox = false
      }, 2000)
    }
  }
}

</script>

<style scoped>

  .info-icon {
    margin-left: 10px;
  }

  .info-box-wrapper {
    width: 100%;
    color: var(--fontColor);
    background-color: var(--HoverColor);
    border-radius: 4px;
    margin: .5em 0;
    overflow: hidden;
  }

  .info-box {
    font-size: 0.8em;
    text-align: justify;
    padding: 8px;
  }

  .fade-enter, .fade-leave-to {
    max-height: 0;
  }

  .fade-leave-active, .fade-enter-active{
    transition: all 1s linear;
  }

  .fade-enter-to, .fade-leave {
    max-height: 100px;
  }
</style>
