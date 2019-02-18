<template>
  <div class="contentWrapper">
    <h3>Wahltermin</h3>
    <div>

      <InfoBox info-text="Wenn Du dich für diese Option entscheidest, kannst Du in Deinem Wahldashboard per Buttonklick festlegen, wann Du von einer Wahlphase in die nächste übergehen möchtest (z.B. von der Bewerbungs- in die Abstimmungsphase).
            Diese Option ermöglicht also eine flexible Terminwahl.
            Wenn Du lieber möchtest, dass die Phasen an einem bestimmten Datum automatisch gestartet werden, dann deaktiviere diese Option und trage unten die gewünschten Daten ein">
        <div slot="content" class="option">
          <input type="checkbox"
                 v-on:change="togglePhaseSelection()"
                 v-model="electionDate.startPhasesManually"
                 v-on:input="checkInput()">
          <div>Ich möchte die Phasen der Wahl manuell per Buttonklick starten und beenden</div>
        </div>
      </InfoBox>

      <div class="date-option">
        <h4>Bewerbungsphase</h4>
        <div class="option">
          <div class="date-option-text">
            Beginn
          </div>
          <Datepicker v-model="electionDate.applicationStartDate" v-on:input="checkInput()"/>

        </div>
      </div>

      <div  class="date-option">
        <h4 class="">Abstimmungsphase</h4>
        <div class="option">
          <div class="date-option-text">
            Beginn
          </div>
          <Datepicker class="date-option" v-model="electionDate.electionStartDate" v-on:input="checkInput()"/>

        </div>
        <div class="option">
          <div class="date-option-text">
            Ende
          </div>
          <Datepicker class="date-option" v-model="electionDate.electionEndDate" v-on:input="checkInput()"/>

        </div>
      </div>
    </div>
  </div>
</template>

<script>

import InfoBox from './InfoBox'
import moment from 'moment'
import Datepicker from './Datepicker'

export default {
  name: 'ElectionCreationElectionDate',
  components: {
    Datepicker,
    InfoBox
  },
  data: () => {
    return {
      electionDate: {
        valid: true,
        startPhasesManually: true,
        applicationStartDate: moment().startOf('hour').add(1, 'hours').format('DD.MM.YYYY HH:mm'),
        electionStartDate: moment().startOf('hour').add(1, 'hours').add(5, 'days').format('DD.MM.YYYY HH:mm'),
        electionEndDate: moment().startOf('hour').add(1, 'hours').add(10, 'days').format('DD.MM.YYYY HH:mm')
      }
    }
  },
  methods: {
    togglePhaseSelection () {
      let datepickers = document.querySelectorAll('.vdpComponent input, .date-option')
      if (this.electionDate.startPhasesManually) {
        for (let datepicker of datepickers) {
          datepicker.style.pointerEvents = 'none'
          datepicker.style.color = 'var(--lightGrey)'
        }
      } else {
        for (let datepicker of datepickers) {
          datepicker.style.pointerEvents = 'auto'
          datepicker.style.color = 'var(--fontColor)'
        }
      }
    },
    checkInput () {
      this.electionDate.valid = true
      if (!this.electionDate.startPhasesManually) {
        let applicationStart = moment(this.electionDate.applicationStartDate, 'DD.MM.YYYY HH:mm')
        let electionStart = moment(this.electionDate.electionStartDate, 'DD.MM.YYYY HH:mm')
        let electionEnd = moment(this.electionDate.electionEndDate, 'DD.MM.YYYY HH:mm')

        if (!applicationStart.isValid() || !electionStart.isValid() || !electionEnd.isValid()) {
          this.$alertFailure(this, 'Bitte wähle gültige Wahltermine aus!', true)
          this.electionDate.valid = false
        }
        if (applicationStart.isBefore(moment())) {
          this.$alertFailure(this, 'Der Wahlbeginn darf nicht in der Vergangenheit liegen!', true)
          this.electionDate.valid = false
        }

        if (!applicationStart.isBefore(electionStart)) {
          this.$alertFailure(this, 'Das Startdatum für die Bewerbungsphase muss vor dem Startdatum für die Wahlphase liegen!', true)
          this.electionDate.valid = false
        }
        if (!electionStart.isBefore(electionEnd)) {
          this.$alertFailure(this, 'Das Startdatum für die Wahlphase muss vor deren Enddatum liegen!', true)
          this.electionDate.valid = false
        }
      }

      this.$emit('input', this.electionDate)
    }
  },
  mounted () {
    this.togglePhaseSelection()
    this.$emit('input', this.electionDate)
  }
}

</script>

<style scoped>

  .date-option-text {
    width: 40%;
    max-width: 80px;
  }

</style>
