<template>
  <div class="graph" id="statisticsPie">
    <h2>Wahlbeteiligung</h2>
    <pie-chart :chart-data="electionPart"></pie-chart>
  </div>
</template>

<script>
import PieChart from './pieChart.js'

export default {
  name: 'ParticipationChart',
  components: {
    PieChart
  },
  props: {
    validVotes: Number,
    invalidVotes: Number,
    abstentions: Number
  },
  computed: {
    electionPart: function () {
      return {
        labels: ['Gültige Stimme', 'Keine Stimmabgabe', 'Enthaltungen'],
        datasets: [{data: [this.validVotes, this.invalidVotes, this.abstentions], backgroundColor: ['#b10438', '#b10438ce', '#ccc']}]
      }
    }
  }
}
</script>

<style scoped>
  h2 {
    font-size: 20px;
  }

  .graph {
    outline: 1px solid gainsboro;
    padding: 10px;
    margin: .5em;
    width: 80%;
    max-width: 300px;
  }
</style>
