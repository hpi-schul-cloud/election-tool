<template>
  <button class="btn btn_primary" v-on:click="generateProtocol()">Wahlprotokoll erstellen</button>
</template>

<script>

var pdfMake = require('pdfmake/build/pdfmake')
var pdfFonts = require('pdfmake-unicode/dist/pdfmake-unicode')
pdfMake.vfs = pdfFonts.pdfMake.vfs

export default {
  name: 'ProtocolGenerator',
  data: () => ({
    electionOffice: '',
    electionCommittee: '',
    schoolname: '',
    startDate: '',
    endDate: '',
    electionOfficer: '',
    candidates: [],
    votes: new Map(),
    validVotes: 0,
    invalidVotes: 0,
    abstentions: 0
  }),
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
            alert(result.error)
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
            this.votes = new Map(Object.entries(result.data))
          } else {
            alert(result.error)
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
            this.electionOffice = result.data.electionOffice
            this.electionCommittee = result.data.electionCommittee
            this.schoolname = result.data.schoolname
            this.electionOfficer = result.data.electionOfficer
            this.startDate = result.data.electionStart
            this.endDate = result.data.electionEnd
            this.validVotes = result.data.validVotes
            this.invalidVotes = result.data.invalidVotes
            this.abstentions = result.data.abstentions
          } else {
            alert(result.error)
          }
        })
    },
    fetchData () {
      // first clear all data, just in case there is data set that shouldn't be
      Object.assign(this.$data, this.$options.data())

      // fetch data
      this.fetchStatistics()
      this.fetchCandidates()
      this.fetchVotes()
    },
    generateProtocol () {
      var candidatesList = [[{text: 'Vorname, Name', style: 'header'}, {text: 'Anzahl der Stimmen', style: 'header'}]]
      for (let candidate of this.candidates) {
        candidatesList.push([{text: candidate.name, style: 'text'}, {text: this.votes.get(candidate.id), style: 'text'}])
      }
      var schoolPrepositon
      if (this.schoolname.toLowerCase().includes('gymnasium')) {
        schoolPrepositon = 'am'
      } else {
        schoolPrepositon = 'in der'
      }
      var docDefinition = {
        info: {
          title: 'Wahlprotokoll'
        },
        content: [
          {text: 'Wahlprotokoll \n \n', style: 'bigheader'},
          {
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              headerRows: 1,
              widths: ['25%', '75%'],

              body: [
                [{text: 'Wahlamt:', style: 'header'}, {text: this.electionOffice + '\n \n', style: 'text'}],
                [{text: 'Wahlgremium:', style: 'header'}, {text: this.electionCommittee + '\n \n', style: 'text'}],
                [{text: schoolPrepositon, style: 'text'}, {text: this.schoolname + '\n \n', style: 'text'}],
                [{text: 'Wahltermin:', style: 'header'}, {text: '\n \n', style: 'text'}],
                [{text: 'Beginn: ', style: 'text'}, {text: this.startDate, style: 'text'}],
                [{text: 'Ende: ', style: 'text'}, {text: this.endDate + '\n \n', style: 'text'}],
                [{text: 'Wahlausschuss:', style: 'header'}, {text: '\n \n', style: 'text'}],
                [{text: 'Wahlleiterin oder Wahlleiter: ', style: 'text'}, {text: this.electionOfficer, style: 'text'}],
                [{text: '\n \n', style: 'header'}, {text: '', style: 'text'}],
                [{text: 'abgegebene Stimmen: ', style: 'text'}, {text: this.validVotes + this.abstentions, style: 'text'}],
                [{text: 'gültige Stimmen: ', style: 'text'}, {text: this.validVotes, style: 'text'}],
                [{text: 'ungültige Stimmen: ', style: 'text'}, {text: 0, style: 'text'}],
                [{text: 'Enthaltungen: ', style: 'text'}, {text: this.abstentions, style: 'text'}],
                [{text: '\n \n', style: 'header'}, {text: '', style: 'text'}]
              ]
            },
            layout: 'noBorders'
          },
          {
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              headerRows: 1,
              widths: ['2%', '15%', '2%', '15%'],

              body: [
                [{text: '', style: 'text'}, {text: '', style: 'text'}, {text: '', style: 'text'}, {text: '', style: 'text'}],
                [{text: '\u2610', style: 'text'}, {text: 'offene Wahl', style: 'text'}, {text: '\u2610', style: 'text'}, {text: 'geheime Wahl \n \n', style: 'text'}]
              ]
            },
            layout: 'noBorders'
          },
          {
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              headerRows: 1,
              widths: ['25%', '75%'],

              body: candidatesList
            },
            layout: ''
          },
          {
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              headerRows: 1,
              widths: ['25%', '2%', '5%', '2%', '15%'],

              body: [
                [{text: '\n \n', style: 'text'}, {text: '', style: 'text'}, {text: '', style: 'text'}, {text: '', style: 'text'}, {text: '', style: 'text'}],
                [{text: 'Annahme der Wahl:', style: 'header'}, {text: '\u2610', style: 'text'}, {text: 'Ja', style: 'text'}, {text: '\u2610', style: 'text'}, {text: 'Nein \n \n', style: 'text'}]
              ]
            },
            layout: 'noBorders'
          },
          {text: 'Unterschriften des Wahlausschusses: \n \n \n \n', style: 'header'},
          {
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 1,
              widths: ['30%', '70%'],

              body: [
                [{border: [false, true, false, false], text: 'Wahlleiter', style: 'text'},
                  {text: '', style: 'text'}
                ]
              ]
            },
            layout: {
              defaultBorder: false
            }
          }
        ],
        styles: {
          bigheader: {
            fontSize: 13,
            bold: true,
            color: '#b10438'
          },
          header: {
            fontSize: 10,
            color: '#b10438'
          },
          text: {
            fontSize: 10
          }
        }
      }

      pdfMake.createPdf(docDefinition).download('Wahlprotokoll.pdf')
    }
  },
  mounted () {
    this.fetchData()
  }
}
</script>
