<template>
  <div class="contentWrapper">
    <div class="card">
      <form id="election-creation" v-on:submit.prevent="">
        <h2 class="title">Wahlerstellung</h2>

        <ElectionCreationGeneralOptions v-model="generalOptions"></ElectionCreationGeneralOptions>

        <ElectionCreationElectionMode v-model="electionMode"></ElectionCreationElectionMode>

        <ElectionCreationElectionDate v-model="electionDate"></ElectionCreationElectionDate>

        <div class="content-center">
          <input type="submit" class="btn btn_primary" value="Wahl anlegen" v-on:click ="submitElection()"/>
        </div>
      </form>
    </div>
  </div>
</template>

<script>

import ElectionCreationGeneralOptions from '../parts/ElectionCreationGeneralOptions'
import ElectionCreationElectionMode from '../parts/ElectionCreationElectionMode'
import ElectionCreationElectionDate from '../parts/ElectionCreationElectionDate'

export default {
  name: 'ElectionCreation',
  components: {
    ElectionCreationGeneralOptions,
    ElectionCreationElectionMode,
    ElectionCreationElectionDate
  },
  data: () => {
    return {
      generalOptions: null,
      electionMode: null,
      electionDate: null
    }
  },
  methods: {
    checkForm () {
      if (this.generalOptions.valid && this.electionMode.valid && this.electionDate.valid) {
        return true
      }
      this.$alertFailure(this, 'Bitte fülle die Pflichtfelder aus!', true)
      return false
    },
    submitElection () {
      if (this.checkForm()) {
        let url = '/api/addElection'
        let data = {
          name: this.generalOptions.electionTitle,
          id: '',
          electionOfficer: this.$store.getters.USER.id,
          office: this.generalOptions.electionOffice,
          committee: this.generalOptions.electionCommittee,
          description: this.generalOptions.electionDescription,
          schoolname: this.generalOptions.schoolname,
          options: {
            votesPerUser: this.electionMode.votesPerUser,
            useGender: this.electionMode.useGender,
            useLivePreview: this.electionMode.useLivePreview,
            startPhasesManually: this.electionDate.startPhasesManually,
            applicationStartDate: this.electionDate.applicationStartDate,
            electionStartDate: this.electionDate.electionStartDate,
            electionEndDate: this.electionDate.electionEndDate
          },
          currentPhase: 0,
          eligibleVoters: this.generalOptions.eligibleVoters,
          candidates: [],
          voteId: 0
        }
        fetch(url, this.$getPostRequest(data))
          .then(response => response.json())
          .then(result => {
            if (result.success) {
              this.$alertSuccess(this, result.data.message, false, 2500)
              this.goToElectionDashboard(result.data.electionId)
            } else {
              this.$alertFailure(this, result.error, true)
            }
          })
      }
    },
    goToElectionDashboard (election) {
      this.$router.push({ name: 'Dashboard', params: { electionId: election } })
      this.$socket.emit('routeChosenTrigger')
    }
  }
}

</script>

<style scoped>

  #election-creation {
    color: var(--fontColor) !important;
  }

  .content-center{
    text-align: center;
  }

  >>> .option{
    display: flex;
    align-items: center;
    margin: .5em 0;
  }

  >>> input[type=checkbox]{
    margin-right: 25px;
  }

</style>

<style>

  input {
    padding: 8px;
    margin: 0 0 .5em;
    border: 1px solid var(--colorLightGrey);
    border-radius: 2px;
  }

</style>
