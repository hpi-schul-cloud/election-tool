<template>
  <div class="contentWrapper">
    <h3>Wahlmodus</h3>
    <div>

      <div class="option">
        Anzahl der Stimmen pro Schüler
        <input
          type="number"
          id="votesPerUser"
          min="1"
          v-model="electionMode.votesPerUser"
          required="true"
          v-on:input="checkInput()">
      </div>

      <InfoBox info-text="Wenn Du diese Option aktivierst, dann werden der Junge und das Mädchen mit den meisten Stimmen die Wahlsieger.
                          Wenn Du die Option nicht aktivierst, werden die beiden Kandidaten mit den meisten Stimmen Wahlsieger, unabhängig von ihrem Geschlecht">
        <div slot="content" class="option">
          <input id="useGender" type="checkbox" v-model="electionMode.useGender" v-on:input="checkInput()">
          <div>Die Kandidatin und der Kandidat mit den meisten Stimmen sollen Wahlsieger sein</div>
        </div>
      </InfoBox>

      <InfoBox info-text="Wenn Du diese Option aktivierst, kannst Du während der Abstimmungsphase verfolgen, wie viele Stimmen bereits abgegeben wurden.
                          Wenn Du die Option nicht aktivierst, wird dir die Wahlbeteiligung erst nach dem Ende der Abstimmungsphase angezeigt">
        <div slot="content" class="option">
          <input id="useLivePreview" type="checkbox" v-model="electionMode.useLivePreview" v-on:input="checkInput()">
          <div>Zeige mir die Wahlbeteiligung während der Abstimmung an (nur Wahlleiter)</div>
        </div>
      </InfoBox>

    </div>
  </div>
</template>

<script>

import InfoBox from './InfoBox'

export default {
  name: 'ElectionCreationElectionMode',
  components: {
    InfoBox
  },
  data: () => {
    return {
      electionMode: {
        valid: true,
        votesPerUser: 1,
        useGender: false,
        useLivePreview: false
      }
    }
  },
  methods: {
    checkInput () {
      this.electionMode.valid = true
      let inputFields = document.querySelectorAll('input')
      for (let inputField of inputFields) {
        if (!inputField.validity.valid) {
          this.electionMode.valid = false
        }
      }
      this.$emit('input', this.electionMode)
    }
  },
  mounted () {
    this.$emit('input', this.electionMode)
  }
}

</script>

<style scoped>

  #votesPerUser {
    margin-left: 10px;
    width: 3.8em;
  }

</style>
