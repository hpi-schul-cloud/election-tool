import {Pie, mixins} from 'vue-chartjs'

const {reactiveProp} = mixins

export default {
  extends: Pie,
  mixins: [reactiveProp],
  data: () => ({
    options: {
      responsive: true,
      pieceLabel: {
        mode: 'percentage',
        precision: 1
      }
    }
  }),
  mounted () {
    // this.chartData is created in the mixin.
    // If you want to pass options please create a local options object
    this.renderChart(this.chartData, this.options)
  }
}
