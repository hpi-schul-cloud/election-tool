<template>
  <div class="candidate-wrapper">
    <CandidateCollapsible
      class="candidate"
      v-for="candidate in candidates"
      v-bind:candidate-name="candidate.name"
      v-bind:use-gender="useGender"
      v-bind:candidate-gender="candidate.gender"
      v-bind:candidate-info="candidate.info"
      v-bind:candidate-motivation="candidate.motivation"
      v-bind:candidate-id="candidate.id"
      v-bind:key="candidate.id"
      v-bind:showVoting="showVoting"
      v-bind:showResults="showResults"
      v-bind:candidate-votes="votes.get(candidate.id)"
      v-bind:is-first-male="isFirstMale(candidate)"
      v-bind:is-first-female="isFirstFemale(candidate)"
      v-bind:is-genderless-winner-or-deputy="isGenderlessWinnerOrDeputy(candidate)"
      v-bind:disableCheckboxes="disableCheckboxes"
      v-on:checkboxClicked="checkboxClickedHandler($event)"
    ></CandidateCollapsible>
  </div>
</template>

<script>

import CandidateCollapsible from './CandidateCollapsible'

export default {
  name: 'CollapsibleList',
  components: { CandidateCollapsible },
  data: () => ({
    firstMaleFound: false,
    maleWinner: -1,
    firstFemaleFound: false,
    femaleWinner: -1,
    genderlessWinnerFound: false,
    genderlessDeputyFound: false,
    genderlessWinners: []
  }),
  props: {
    candidates: Array,
    votes: {
      type: Map,
      default: function () { return new Map() }
    },
    useGender: {
      type: Boolean,
      default: false
    },
    showVoting: {
      type: Boolean,
      default: false
    },
    showResults: {
      type: Boolean,
      default: false
    },
    disableCheckboxes: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    checkboxClickedHandler (event) {
      event = JSON.parse(event)
      let eventArgs = JSON.stringify([event[0], event[1]])
      this.$emit('checkboxClicked', eventArgs)
    },
    resetData () {
      this.maleWinner = -1
      this.firstMaleFound = false
      this.femaleWinner = -1
      this.firstFemaleFound = false
      this.genderlessWinnerFound = false
      this.genderlessDeputyFound = false
      this.genderlessWinners = []
    },
    isFirstMale (candidate) {
      if (!this.showResults) {
        return false
      }
      if (candidate.id === this.maleWinner) {
        return true
      }
      if (candidate.gender === 'Männlich') {
        if (!this.firstMaleFound) {
          this.firstMaleFound = true
          this.maleWinner = candidate.id
          return true
        }
      }
      return false
    },
    isFirstFemale (candidate) {
      if (!this.showResults) {
        return false
      }
      if (candidate.id === this.femaleWinner) {
        return true
      }
      if (candidate.gender === 'Weiblich') {
        if (!this.firstFemaleFound) {
          this.firstFemaleFound = true
          this.femaleWinner = candidate.id
          return true
        }
      }
      return false
    },
    isGenderlessWinnerOrDeputy (candidate) {
      if (!this.showResults) {
        return false
      }
      if (this.genderlessWinners.includes(candidate.id)) {
        return true
      }
      if (!this.genderlessWinnerFound) {
        this.genderlessWinnerFound = true
        this.genderlessWinners.push(candidate.id)
        return true
      } else if (!this.genderlessDeputyFound) {
        this.genderlessDeputyFound = true
        this.genderlessWinners.push(candidate.id)
        return true
      }
      return false
    }
  },
  mounted () {
    this.$socket.on('routeUpdated', (electionId) => {
      if (electionId === this.$route.params.electionId) {
        this.resetData()
      }
    })
  }
}
</script>

<style scoped>
  /*styling of the candidates*/
  .candidate {
    margin: 18px 0;
  }
</style>
