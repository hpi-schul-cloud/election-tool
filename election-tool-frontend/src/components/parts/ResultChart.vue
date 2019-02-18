<template>
    <div class="graph" id="resultsBar">
      <h2>Stimmenverteilung</h2>
      <bar-chart :chart-data="absoluteVotes"></bar-chart>
    </div>
</template>

<script>
import BarChart from './barChart.js'

export default {
  name: 'ResultChart',
  components: {
    BarChart
  },
  props: {
    candidates: Array,
    votes: Map
  },
  computed: {
    absoluteVotes: function () {
      let labels = []
      let data = []
      let color = []
      for (let candidate of this.candidates) {
        labels.push(candidate.name)
        data.push(this.votes.get(candidate.id))
        color.push('#b10438')
      }

      return {
        labels: labels,
        datasets: [{label: 'Stimmenanzahl', data: data, backgroundColor: color}]}
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
