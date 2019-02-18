<template>
  <div class="contentWrapper">
    <div v-if="!hasVoted" class="card">
      <h2 class="title">Deine Wahl</h2>
      <div v-if="votesPerUser === 1">
        Wähle aus den hier aufgelisteten Kandidaten deinen Favoriten und gib ihm deine Stimme!
      </div>
      <div v-else>
        Wähle aus den hier aufgelisteten Kandidaten deine {{ votesPerUser }} Favoriten und gib ihnen deine Stimme!
      </div>
      <CollapsibleList
        v-bind:candidates="candidates"
        v-bind:disableCheckboxes="disableCheckboxes"
        v-on:checkboxClicked="handleCheckboxClicked($event)"
        v-bind:showVoting="true"></CollapsibleList>
      <div class="button-wrapper">
        <submitButton
          v-bind:status="submitBtnState"
          v-on:btnClicked="submitVote"
          content="Stimme abgeben"></submitButton>
        <submitButton
          v-bind:status="abstentionBtnState"
          v-on:btnClicked="submitAbstention"
          content="Ich möchte mich enthalten"></submitButton>
      </div>
    </div>
    <div v-else class="card">
      <img id="check" src="../../assets/images/check.svg">
      <h2 class="title">Du hast deine Stimme erfolgreich abgegeben!</h2>
      <p>
        Dein Wahlleiter wird in den nächsten Tagen die Wahl beenden und das Wahlergebnis veröffentlichen.
        Dann kannst du an dieser Stelle sehen, ob dein Favorit die Wahl gewonnen hat.
      </p>
    </div>
  </div>
</template>

<script>
import CollapsibleList from '../parts/CollapsibleList'
import submitButton from '../parts/submitButton.vue'

export default {
  name: 'VotePage',
  components: {
    CollapsibleList,
    submitButton
  },
  data () {
    return {
      candidates: [],
      votesPerUser: 0,
      submitBtnState: 'disabled',
      abstentionBtnState: 'active',
      hasVoted: false,
      votedCandidateIDs: [],
      disableCheckboxes: false
    }
  },
  methods: {
    handleCheckboxClicked (event) {
      event = JSON.parse(event)
      // case: select candidate
      if (event[0] === 'checked') {
        if (this.votesPerUser > this.votedCandidateIDs.length) {
          this.votedCandidateIDs.push(event[1])
          if (this.votesPerUser === this.votedCandidateIDs.length) {
            this.disableCheckboxes = true
          }
        }
      // case unselect candidate
      } else {
        this.disableCheckboxes = false
        for (var i = 0; i < this.votedCandidateIDs.length; i++) {
          if (this.votedCandidateIDs[i] === event[1]) this.votedCandidateIDs.splice(i, 1)
        }
      }
      if (this.votedCandidateIDs.length > 0) this.submitBtnState = 'active'
      else this.submitBtnState = 'disabled'
    },
    fetchCandidates () {
      let url = '/api/candidates'
      let packet = { electionId: this.$route.params.electionId }
      fetch(url, this.$getPostRequest(packet))
        .then(response => response.json())
        .then(result => {
          if (result.success) {
            this.candidates = result.data.candidates
            this.votesPerUser = result.data.votesPerUser
          } else {
            this.$alertFailure(this, result.error, true)
          }
        })
    },
    hasAlreadyVoted () {
      let url = '/api/hasVoted'
      let data = {
        userID: this.$store.state.user.id
      }
      let packet = {
        data: data,
        electionId: this.$route.params.electionId
      }
      fetch(url, this.$getPostRequest(packet))
        .then(response => response.json())
        .then(result => {
          if (result.success) {
            this.hasVoted = true
          } else {
            this.hasVoted = false
          }
        })
    },
    submitVote () {
      if (this.hasVoted === true || this.submitBtnState === 'disabled') return
      let url = '/api/addVote'
      let data = {
        candidateIDs: this.votedCandidateIDs,
        userID: this.$store.state.user.id
      }
      let packet = {
        data: data,
        electionId: this.$route.params.electionId
      }
      if (data.candidateIDs.length === 0) {
        this.$alertFailure(this, 'Du hast niemanden ausgewählt. Wenn du dich enthalten möchtest kliche auf "OK" und danach "Ich möchte mich enthalten".', true)
        return
      }
      this.abstentionBtnState = 'hidden'
      this.submitBtnState = 'loading'
      fetch(url, this.$getPostRequest(packet))
        .then(response => response.json())
        .then(result => {
          if (result.success) {
            setTimeout(() => {
              this.submitBtnState = 'success'
              setTimeout(() => {
                this.restoreButton('submitBtn')
                this.hasVoted = true
              }, 1800)
            }, 1000)
            this.$socket.emit(
              'dataChangeTrigger',
              this.$route.params.electionId
            )
          } else {
            setTimeout(() => {
              this.submitBtnState = 'error'
              this.abstentionBtnState = 'active'
              setTimeout(() => {
                this.restoreButton('submitBtn')
                this.$alertFailure(this, result.error, true)
              }, 1000)
            }, 1000)
          }
        })
    },
    restoreButton (button) {
      button === 'abstentionBtn'
        ? (this.abstentionBtnState = 'active')
        : (this.submitBtnState = 'active')
    },
    submitAbstention () {
      if (this.hasVoted === true) return
      let url = '/api/addVote'
      this.submitBtnState = 'hidden'
      this.abstentionBtnState = 'loading'
      let data = {
        candidateIDs: [],
        userID: this.$store.state.user.id
      }
      let packet = {
        data: data,
        electionId: this.$route.params.electionId
      }
      fetch(url, this.$getPostRequest(packet))
        .then(response => response.json())
        .then(result => {
          if (result.success) {
            setTimeout(() => {
              this.abstentionBtnState = 'success'
              setTimeout(() => {
                this.restoreButton('abstentionBtn')
                this.hasVoted = true
              }, 1800)
            }, 1000)
            this.$socket.emit(
              'dataChangeTrigger',
              this.$route.params.electionId
            )
          } else {
            setTimeout(() => {
              this.abstentionBtnState = 'error'
              this.submitBtnState = 'active'
              setTimeout(() => {
                this.restoreButton('abstentionBtn')
                this.$alertFailure(this, result.error, true)
              }, 1000)
            }, 1000)
            this.$socket.emit(
              'routeUpdateTrigger',
              this.$route.params.electionId
            )
          }
        })
    }
  },
  created () {
    this.fetchCandidates()
    this.hasAlreadyVoted()
  },
  beforeMount () {
    this.$emit('check-route')
    this.$emit('check-user')
  }
}
</script>

<style scoped>

.button-wrapper {
  text-align: center;
}

.title {
  margin-bottom: 1em;
}

#check {
  margin: 0 auto;
  display: block;
  width: 20%;
}
</style>
