<template>
  <div class="contentWrapper">
    <div class="button-wrapper">
      <button class="btn btn_primary"
              v-on:click="prevpage()"
              v-if="startPhasesManually && isAnyPhase()"> [DEBUG] prev phase </button>
      <button class="btn btn_primary"
              v-on:click="nextpage()"
              v-if="startPhasesManually && !isResult()"> {{ getNextButtonCaption() }} </button>
    </div>
    <div class="wrapper" v-if = "isAnyPhase()">
      <h2> Kandidatenübersicht </h2>
      <CollapsibleList v-bind:candidates="candidates"
                      v-bind:use-gender="useGender"
                      v-bind:votes="votes"
                      v-bind:showResults="isResult()">
      </CollapsibleList>
      <h2 v-if="(isVoteOrResult() && showLivePreview) || isResult()"> Ergebnis </h2>
      <div class="resultWrapper">
        <ResultChart
          v-if="isResult()"
          v-bind:candidates="candidates"
          v-bind:votes="votes"/>
        <ParticipationChart
          v-if="(isVoteOrResult() && showLivePreview) || isResult()"
          v-bind:validVotes="validVotes"
          v-bind:invalidVotes="invalidVotes"
          v-bind:abstentions="abstentions"/>
      </div>
      <ProtocolGenerator v-if="isResult()"/>
    </div>
  </div>
</template>

<script>
import CollapsibleList from '../parts/CollapsibleList'
import ParticipationChart from '../parts/ParticipationChart'
import ResultChart from '../parts/ResultChart'
import ProtocolGenerator from '../parts/ProtocolGenerator'

export default {
  name: 'TeacherDashboardContent',
  components: {
    CollapsibleList,
    ParticipationChart,
    ResultChart,
    ProtocolGenerator
  },
  data: () => ({
    candidates: [],
    votes: new Map(),
    validVotes: 0,
    showLivePreview: false,
    useGender: false,
    invalidVotes: 0,
    abstentions: 0,
    currentPhase: 'Info',
    startPhasesManually: true
  }),
  methods: {
    isAnyPhase () {
      return ((this.currentPhase === 'Application') ||
        (this.currentPhase === 'Vote') ||
        (this.currentPhase === 'Results'))
    },
    isVoteOrResult () {
      return ((this.currentPhase === 'Vote') ||
        (this.currentPhase === 'Results'))
    },
    isResult () {
      return (this.currentPhase === 'Results')
    },
    getNextButtonCaption () {
      if (this.currentPhase === 'Info') {
        return 'Bewerbunsphase starten'
      } else if (this.currentPhase === 'Application') {
        return 'Wahlphase starten'
      } else if (this.currentPhase === 'Vote') {
        return 'Wahl beenden'
      } else {
        return ''
      }
    },
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
    },
    fetchRoute (callback) {
      let url = '/api/getRoute'
      let packet = { electionId: this.$route.params.electionId }
      fetch(url, this.$getPostRequest(packet))
        .then(response => response.json())
        .then(result => {
          if (result.success) {
            this.currentPhase = result.data.routeName
            callback()
          } else {
            this.$alertFailure(this, result.error, true)
          }
        })
    },
    nextpage () {
      let url = '/api/nextPhase'
      let packet = { electionId: this.$route.params.electionId }
      fetch(url, this.$getPostRequest(packet))
        .then(response => response.json())
        .then(result => {
          if (result.success) {
            this.currentPhase = result.data.newPhase
            this.$socket.emit('routeUpdateTrigger', this.$route.params.electionId)
          } else {
            this.$alertFailure(this, result.error, true)
          }
        })
    },
    prevpage () {
      let url = '/api/prevPhase'
      let packet = { electionId: this.$route.params.electionId }
      fetch(url, this.$getPostRequest(packet))
        .then(response => response.json())
        .then(result => {
          if (result.success) {
            this.currentPhase = result.data.newPhase
            this.$socket.emit('routeUpdateTrigger', this.$route.params.electionId)
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
            this.showLivePreview = result.data.showLivePreview
            this.startPhasesManually = result.data.startPhasesManually
          } else {
            this.$alertFailure(this, result.error, true)
          }
        })
    },
    fetchData () {
      // first clear all data, just in case there is data set that shouldn't be
      this.candidates = []
      this.votes = new Map()
      this.validVotes = 0
      this.invalidVotes = 0
      this.abstentions = 0

      // now actually fetch all the data
      if (this.isAnyPhase()) {
        this.fetchCandidates()
      }
      if (this.isVoteOrResult()) {
        this.fetchStatistics()
      }
      if (this.isResult()) {
        this.fetchVotes()
      }
    }
  },
  created () {
    this.fetchRoute(this.fetchData)
    this.fetchConfiguration()
  },
  beforeMount () {
    this.$emit('check-creator')
  },
  mounted () {
    this.$socket.on('dataChanged', (electionId) => {
      if (electionId === this.$route.params.electionId) {
        this.fetchData()
      }
    })
    this.$socket.on('routeUpdated', (electionId) => {
      if (electionId === this.$route.params.electionId) {
        this.fetchData()
      }
    })
  }
}
</script>

<style scoped>

  .resultWrapper {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    margin: .5em auto;
  }

  /* nav-button styling*/
  .button-wrapper {
    margin: 24px 0;
  }
  .btn_primary {
    border-radius: 4px;
    margin: 0;
  }
</style>
