<template>
  <div class="collapsibleWrapper">
    <slot name="label"></slot>
    <div class="buttonWrapper">
      <button class='collapsible-button' v-on:click='expand' v-bind:style="{ 'background-color': color }">
        <div class="collapsible-header">
          <div class="collapsible-text">
            <slot name="header"></slot>
          </div>
          <div class="icon">+</div>
        </div>
      </button>
      <div class='collapsible-content-wrapper'>
        <div class='collapsible-content'>
          <slot name="body"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    color: String
  },
  methods: {
    expand (event) {
      let content = event.target.nextElementSibling
      let icon = event.target.firstChild.querySelectorAll('.icon')[0]
      let button = event.target

      if (content.style.maxHeight) {
        content.style.maxHeight = null
        icon.innerHTML = '+'
      } else {
        content.style.maxHeight = content.scrollHeight + 'px'
        icon.innerHTML = '-'
      }
      button.classList.toggle('active')
      content.classList.toggle('expanded')
    }
  },
  updated () {
    let content = this.$el.querySelector('.collapsible-content-wrapper')
    if (content.style.maxHeight) {
      content.style.maxHeight = content.scrollHeight + 'px'
    }
  }
}
</script>

<style scoped>

/* Style the button that is used to open and close the collapsible content */
.collapsible-button {
  background: var(--CollapsibleBodyColor);
  color: var(--CollapsibleHeaderColor);
  cursor: pointer;
  padding: 1.1rem;
  width: 100%;
  height: auto;
  border: 1px solid black;
  text-align: left;
  outline: none;
  font-size: 1em;
  border-radius: 4px;
}

/* Add a background color to the button when you move the mouse over it (hover) */
.collapsible-button:hover {
  background-color: var(--HoverColor);
}

.active {
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
}

.expanded {
  border-color: black !important;
}

/* Style the collapsible content. Note: hidden by default */
.collapsible-content-wrapper {
  max-height: 0;
  width: 100%;
  overflow: hidden;
  text-align: left;
  outline: none;
  margin: auto;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  transition: max-height 0.2s ease-out;
  border: 1px solid transparent;
  border-top: none;
}

.collapsible-content-wrapper h4 {
  margin: 1.5rem 0 .5rem 0;
}
.collapsible-content-wrapper p {
  margin: 0;
}

.collapsible-content {
  margin: 24px 16px;
}

.collapsible-header {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: flex-start;
  pointer-events: none;
}

.collapsible-text {
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: flex-start;
  pointer-events: none;
}

.icon {
  font-weight: bold;
  float: right;
  margin-left: 5px;
  pointer-events: none;
}

/*styling of radio buttons*/
.collapsibleWrapper {
  display: flex;
  align-items: flex-start;
}

.buttonWrapper {
  width: 100%;
}
</style>
