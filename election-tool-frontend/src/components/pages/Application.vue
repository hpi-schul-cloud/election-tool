<template>
  <div class="contentWrapper">
    <div class="card">
      <h2 class="title">Meine Bewerbung</h2>
      <div>
        <h3>Mein Geschlecht</h3>
        <div class="genderFormWrapper" v-if="!readOnlyMode">
          <inputButton inputType="radio" inputName="gender" inputValue="Männlich" v-bind:fullWidth="true" v-bind:withMargin="false" v-model="gender" v-on:checkboxClicked = handleClick>Männlich</inputButton>
          <inputButton inputType="radio" inputName="gender" inputValue="Weiblich" v-bind:fullWidth="true" v-bind:withMargin="false" v-model="gender" v-on:checkboxClicked = handleClick>Weiblich</inputButton>
        </div>
        <div v-else>
          {{ this.gender }}
        </div>
      </div>
      <div>
        <h3>Wer bin ich?</h3>
        <textField v-bind:readOnly="readOnlyMode"
                   v-model="info"
                   v-on:input="isValidInput()"
                   placeholder="Schreibe hier etwas über dich selbst!"
                   :minHeight="100"></textField>
      </div>
      <div>
        <h3>Warum mich wählen?</h3>
        <textField v-bind:readOnly="readOnlyMode"
                   v-model="motivation"
                   v-on:input="isValidInput()"
                   placeholder="Sage deinen Mitschülern hier, warum sie genau DICH wählen sollten!"
                   :minHeight="100"></textField>
      </div>
      <div class="textCentered" >
        <submitButton v-if="!readOnlyMode" content="Einreichen" v-bind:status="btnState" v-on:btnClicked="submit"></submitButton>
        <button v-if="readOnlyMode" class="btn btn_secondary" v-on:click = loadForEdit>Bewerbung bearbeiten</button>
        <button v-if="readOnlyMode" class="btn btn_secondary" v-on:click = deleteAfterAlert>Bewerbung löschen</button>
      </div>
    </div>
  </div>
</template>

<script>
import submitButton from '../parts/submitButton.vue'
import textField from '../parts/textField.vue'
import inputButton from '../parts/inputButton.vue'
export default {
  name: 'ApplicationPage',
  data () {
    return {
      editMode: false,
      id: '',
      info: '',
      motivation: '',
      name: this.$store.getters.USER.name,
      gender: '',
      readOnlyMode: false,
      btnState: 'disabled'
    }
  },
  components: {
    submitButton,
    textField,
    inputButton
  },
  methods: {
    handleClick (event) {
      event = JSON.parse(event)
      this.gender = event[1]
      this.isValidInput()
    },
    deleteAfterAlert () {
      // $swal function calls SweetAlert into the application with the specified configuration.
      this.$swal({
        title: 'Bist du dir sicher?',
        text: 'Du kannst deine Bewerbung nicht wieder herstellen!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: 'var(--primaryColor)',
        confirmButtonText: 'Ja, lösche sie!',
        cancelButtonText: 'Abbrechen'
      }).then((result) => {
        if (result.value) {
          this.deleteApplication()
        }
      })
    },
    isValidInput () {
      if (this.gender && this.info && this.motivation) {
        this.btnState = 'active'
        return true
      } else {
        this.btnState = 'disabled'
        return false
      }
    },
    resetForm () {
      this.$socket.emit('dataChangeTrigger', this.$route.params.electionId)
      this.editMode = false
      this.id = ''
      this.name = ''
      this.gender = ''
      this.info = ''
      this.motivation = ''
    },
    loadIfAlreadyApplied () {
      let url = '/api/loadApplication'
      let data = {
        name: this.$store.getters.USER.name,
        id: this.$store.getters.USER.id
      }
      let packet = {
        electionId: this.$route.params.electionId,
        data: data
      }
      fetch(url, this.$getPostRequest(packet))
        .then(response => response.json())
        .then(result => {
          if (result.success) {
            this.readOnlyMode = true
            this.id = result.data.id
            this.gender = result.data.gender
            this.info = result.data.info
            this.motivation = result.data.motivation
          }
        })
    },
    loadForEdit () {
      let url = '/api/loadApplication'
      let data = {
        name: this.$store.getters.USER.name,
        id: this.$store.getters.USER.id
      }
      this.btnState = 'disabled'
      let packet = {
        electionId: this.$route.params.electionId,
        data: data
      }
      fetch(url, this.$getPostRequest(packet))
        .then(response => response.json())
        .then(result => {
          if (!result.success) {
            this.$alertFailure(this, result.error, true)
            this.$socket.emit('routeUpdateTrigger', this.$route.params.electionId)
          } else {
            this.readOnlyMode = false
            this.editMode = true
            this.id = result.data.id
            this.gender = result.data.gender
            this.info = result.data.info
            this.motivation = result.data.motivation
          }
        })
    },
    submit () {
      if (this.btnState === 'disabled') return
      this.btnState = 'loading'
      let url = ''
      this.editMode ? url = '/api/editCandidate' : url = '/api/addCandidate'
      let data = {
        name: this.$store.getters.USER.name,
        gender: this.gender,
        id: this.$store.getters.USER.id,
        info: this.info,
        motivation: this.motivation
      }
      let packet = {
        electionId: this.$route.params.electionId,
        data: data
      }
      fetch(url, this.$getPostRequest(packet))
        .then(response => response.json())
        .then(result => {
          if (result.success) {
            setTimeout(() => {
              this.btnState = 'success'
              setTimeout(this.restoreButton(), 450)
            }, 1000)
            this.$socket.emit('dataChangeTrigger', this.$route.params.electionId)
          } else {
            this.$alertFailure(this, result.error, true)
            setTimeout(() => {
              this.btnState = 'error'
              setTimeout(this.restoreButton(), 450)
            }, 1000)
          }
        })
    },
    restoreButton () {
      setTimeout(() => {
        this.btnState = 'active'
        this.readOnlyMode = true
      }, 1250)
    },
    deleteApplication () {
      let url = '/api/deleteCandidate'
      let data = {
        name: this.$store.getters.USER.name,
        id: this.$store.getters.USER.id
      }
      let packet = {
        electionId: this.$route.params.electionId,
        data: data
      }
      fetch(url, this.$getPostRequest(packet))
        .then(response => response.json())
        .then(result => {
          if (result.success) {
            this.resetForm()
            this.readOnlyMode = false
            this.$alertSuccess(this, 'Du hast deine Bewerbung erfolgreich gelöscht!', false, 2500)
          } else {
            this.$alertFailure(this, result.error, true)
            this.$socket.emit('routeUpdateTrigger', this.$route.params.electionId)
          }
        })
    }
  },
  beforeMount () {
    this.$emit('check-route')
    this.$emit('check-user')
  },
  mounted () {
    this.loadIfAlreadyApplied()
  }
}
</script>

<style scoped>
  .textCentered {
    text-align: center;
  }

  .genderFormWrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
  }

  .btn {
    margin: 1rem;
  }

  h3 {
    margin: 1rem 0 .5rem 0;
    text-align: left;
  }
</style>
