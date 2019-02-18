<template>
  <div class="contentWrapper">
    <div class="wrapper">
      <h2>Ergebnis</h2>
      <div class="resultWrapper">
        <ResultChart
          v-bind:candidates="candidates"
          v-bind:votes="votes"/>
        <ParticipationChart
          v-bind:validVotes="validVotes"
          v-bind:invalidVotes="invalidVotes"
          v-bind:abstentions="abstentions"/>
      </div>
      <h2>Kandidaten</h2>
      <CollapsibleList
        v-bind:candidates="candidates"
        v-bind:use-gender="useGender"
        v-bind:votes="votes"
        v-bind:showResults="true"> </CollapsibleList>
    </div>
  </div>
</template>

<script>
import ParticipationChart from '../parts/ParticipationChart'
import ResultChart from '../parts/ResultChart'
import CollapsibleList from '../parts/CollapsibleList'

export default {
  components: {
    ParticipationChart,
    ResultChart,
    CollapsibleList
  },
  data () {
    return {
      useGender: false,
      candidates: [],
      votes: new Map(),
      validVotes: 0,
      invalidVotes: 0,
      abstentions: 0
    }
  },
  methods: {
    fetchCandidates () {
      let url = '/api/candidates'
      let packet = { electionId: this.$route.params.electionId }
      fetch(url, this.$getPostRequest(packet))
        .then(response => response.json())
        .then(result => {
          if (result.success) {
            this.candidates = result.data.candidates
          } else {
            this.$alertFailure(this, result.error, true)
          }
        })
    },
    fetchVotes () {
      let url = '/api/votes'
      let packet = { electionId: this.$route.params.electionId }
      fetch(url, this.$getPostRequest(packet))
        .then(response => response.json())
        .then(result => {
          if (result.success) {
            this.votes = new Map(Object.entries(result.data.votes))
          } else {
            this.$alertFailure(this, result.error, true)
          }
        })
    },
    fetchConfiguration () {
      let url = '/api/getElectionConfiguration'
      let packet = { electionId: this.$route.params.electionId }
      fetch(url, this.$getPostRequest(packet))
        .then(response => response.json())
        .then(result => {
          if (result.success) {
            this.useGender = result.data.useGender
          } else {
            this.$alertFailure(this, result.error, true)
          }
        })
    },
    fetchStatistics () {
      let url = '/api/statistics'
      let packet = { electionId: this.$route.params.electionId }
      fetch(url, this.$getPostRequest(packet))
        .then(response => response.json())
        .then(result => {
          if (result.success) {
            this.validVotes = result.data.validVotes
            this.invalidVotes = result.data.invalidVotes
            this.abstentions = result.data.abstentions
          } else {
            this.$alertFailure(this, result.error, true)
          }
        })
    }
  },
  created () {
    this.fetchConfiguration()
    this.fetchCandidates()
    this.fetchVotes()
    this.fetchStatistics()
  },
  beforeMount () {
    this.$emit('check-route')
    this.$emit('check-user')
  }
}
</script>

<style scoped>

.resultWrapper {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin: 20px auto;
}

</style>
