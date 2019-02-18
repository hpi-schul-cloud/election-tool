<template>
    <BasicCollapsible v-bind:color="color">
      <inputButton
        slot="label"
        v-if="showVoting"
        inputType="checkbox"
        inputName="vote"
        v-bind:fullWidth="false"
        v-bind:withMargin="true"
        v-bind:inputValue="candidateId"
        v-bind:disableCheckboxes="disableCheckboxes"
        v-on:checkboxClicked="checkboxClickedHandler($event)">
      </inputButton>
      <div slot="header">
        <span v-if="useGender" class="candidate-name"> {{ genderSymbol }} {{ candidateName }}</span>
        <span v-if="!useGender" class="candidate-name"> {{ candidateName }}</span>
        <span v-if="showResults && candidateVotes > 1"> ({{ candidateVotes }} Stimmen)</span>
        <span v-if="showResults && candidateVotes === 1"> ({{ candidateVotes }} Stimme)</span>
      </div>
      <div slot="body">
        <div class='about-me'>
          <h4>Wer bin ich?</h4>
          <p>{{candidateInfo}}</p>
        </div>
        <div class='why-me'>
          <h4>Warum solltet ihr mich wählen?</h4>
          <p>{{ candidateMotivation }}</p>
        </div>
      </div>
    </BasicCollapsible>
</template>

<script>

import BasicCollapsible from './BasicCollapsible'
import inputButton from './inputButton.vue'

export default {
  components: {
    BasicCollapsible,
    inputButton
  },
  methods: {
    checkboxClickedHandler (event) {
      event = JSON.parse(event)
      let eventArgs = JSON.stringify([event[0], event[1]])
      this.$emit('checkboxClicked', eventArgs)
    }
  },
  props: {
    candidateName: String,
    useGender: {
      type: Boolean,
      default: false
    },
    candidateGender: String,
    candidateId: String,
    candidateInfo: String,
    candidateMotivation: String,
    candidateVotes: Number,
    showVoting: {
      type: Boolean,
      default: false
    },
    showResults: {
      type: Boolean,
      default: false
    },
    isFirstMale: {
      type: Boolean,
      default: false
    },
    isFirstFemale: {
      type: Boolean,
      default: false
    },
    isGenderlessWinnerOrDeputy: {
      type: Boolean,
      default: false
    },
    disableCheckboxes: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    color: function () {
      if (!this.showResults) {
        return null
      } else if (this.useGender && this.isFirstMale) { // male winner
        return 'var(--maleWinnerColor)'
      } else if (this.useGender && this.isFirstFemale) { // female winner
        return 'var(--femaleWinnerColor)'
      } else if (!this.useGender && this.isGenderlessWinnerOrDeputy) { // winner and deputy if gender does not matter
        return 'var(--genderlessWinnerAndDeputyColor)'
      } else return null
    },
    genderSymbol: function () {
      if (!this.showResults) {
        if (this.candidateGender === 'Männlich') {
          return '♂'
        } else if (this.candidateGender === 'Weiblich') {
          return '♀'
        } else {
          console.log('The candidate gender ' + this.candidateGender + ' does not match any known gender!')
          return '⚠'
        }
      } else {
        return ''
      }
    }
  }
}
</script>

<style scoped>
</style>
