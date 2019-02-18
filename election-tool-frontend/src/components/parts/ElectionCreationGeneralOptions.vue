<template>
  <div class="contentWrapper">
    <h3>Allgemeine Informationen</h3>
    <div>
      <div class="option">
        Titel der Wahl
      </div>

      <textField placeholder="z.B. Schülersprecherwahl 2018"
                v-model="generalOptions.electionTitle"
                required="true"
                border="1px solid #e8e8e8"
                v-on:input="checkInput()"></textField>

      <InfoBox info-text="Bitte trage hier ein, welches Amt (z.B. Schülersprecher) gewählt werden soll (Für das Wahlprotokoll benötigt)">
        <div slot="content">Gewähltes Amt</div>
      </InfoBox>
      <textField placeholder="z.B. Schülersprecher"
                v-model="generalOptions.electionOffice"
                required="true"
                border="1px solid #e8e8e8"
                v-on:input="checkInput()"></textField>

      <InfoBox info-text="Bitte trage hier ein, welches Gremium die Wahl ausrichtet (Für das Wahlprotokoll benötigt)">
        <div slot="content">Wahlgremium</div>
      </InfoBox>
      <textField placeholder="z.B. Versammlung der Klassensprecher"
                v-model="generalOptions.electionCommittee"
                required="true"
                border="1px solid #e8e8e8"
                v-on:input="checkInput()"></textField>

      <InfoBox info-text="Hier kannst Du eine Beschreibung der Wahl einfügen, die auf der Wahlseite angezeigt werden soll">
        <div slot="content">Beschreibung der Wahl</div>
      </InfoBox>
      <textField placeholder="Schreibe hier etwas über die Wahl!"
                v-model="generalOptions.electionDescription"
                required="true"
                border="1px solid #e8e8e8"
                v-on:input="checkInput()"></textField>

      <InfoBox info-text="Bitte trage hier den Namen Deiner Schule ein (Für das Wahlprotokoll benötigt)">
        <div slot="content">Schulname</div>
      </InfoBox>
      <textField placeholder="z.B. Albert-Schweitzer Gymnasium Erfurt"
                v-model="generalOptions.schoolname"
                required="true"
                 border="1px solid #e8e8e8"
                v-on:input="checkInput()"></textField>

      <InfoBox info-text="Wähle hier alle Personen aus, die an der Wahl teilnehmen dürfen">
        <div slot="content">Wahlberechtigte</div>
      </InfoBox>
      <StudentDropdown v-model="generalOptions.eligibleVoters"/>
    </div>
  </div>
</template>

<script>

import textField from './textField'
import InfoBox from './InfoBox'
import StudentDropdown from './StudentDropdown'

export default {
  name: 'ElectionCreationGeneralOptions',
  components: {
    textField,
    InfoBox,
    StudentDropdown
  },
  data: () => {
    return {
      generalOptions: {
        valid: false,
        electionTitle: null,
        electionOffice: null,
        electionCommittee: null,
        electionDescription: null,
        schoolname: null,
        eligibleVoters: [],
        eligibleVotersId: []
      }
    }
  },
  methods: {
    checkInput () {
      this.generalOptions.valid = true
      let inputFields = document.querySelectorAll('textarea')
      for (let inputField of inputFields) {
        if (!inputField.validity.valid) {
          this.generalOptions.valid = false
        }
      }
      for (let eligibleVoter of this.generalOptions.eligibleVoters) {
        this.generalOptions.eligibleVotersId.push(eligibleVoter._id)
      }
      if (!(this.generalOptions.eligibleVotersId instanceof Array && this.generalOptions.eligibleVotersId.length && this.generalOptions.eligibleVotersId.every(function (x) {
        return typeof x === 'string'
      }))) {
        this.generalOptions.valid = false
      }
      this.$emit('input', this.generalOptions)
    }
  },
  mounted () {
    this.$emit('input', this.generalOptions)
  }
}

</script>
