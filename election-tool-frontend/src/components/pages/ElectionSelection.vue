<template>
  <div class="contentWrapper">
    <div class="card">
      <h2 class="title"> Meine Wahlen </h2>
      <div v-if="hasNoElections()">
        <p> Es stehen aktuell keine Wahlen an </p>
      </div>
      <div v-if="hasOpenElections()">
        <h3> offene Wahlen </h3>
        <div v-for="election in elections.openElections" :key="election.id">
          <Collapsible class="collapsible">
            <div slot="header"> {{ election.name }} </div>
            <div slot="body">
              {{ election.description }}
              <div class="btn_wrapper">
                <button v-on:click="goToRoute('Reroute', election.id)" class="btn btn_secondary"> Zur Wahl </button>
              </div>
            </div>
          </Collapsible>
        </div>
      </div>
      <div v-if="hasClosedElections()">
        <h3> beendete Wahlen </h3>
        <div v-for="election in elections.closedElections" :key="election.id">
          <Collapsible class="collapsible">
            <div slot="header"> {{ election.name }} </div>
            <div slot="body">
              {{ election.description }}
              <div class="btn_wrapper">
                <button v-on:click="goToRoute('Reroute', election.id)" class="btn btn_secondary"> Zur Wahl </button>
              </div>
            </div>
          </Collapsible>
        </div>
      </div>
      <div v-if="hasCreatedElections()">
        <h3> von dir erstellte Wahlen </h3>
        <div v-for="election in elections.createdElections" :key="election.id">
          <Collapsible class="collapsible">
            <div slot="header"> {{ election.name }} </div>
            <div slot="body">
              {{ election.description }}
              <div class="btn_wrapper">
                <button v-on:click="goToRoute('Dashboard', election.id)" class="btn btn_secondary"> Zum Dashboard </button>
              </div>
            </div>
          </Collapsible>
        </div>
      </div>
    </div>
    <button class="btn btn_primary" v-on:click="goToRoute('ElectionCreation')">
      Jetzt eine Wahl erstellen
    </button>
  </div>
</template>

<script>
import Collapsible from '../parts/BasicCollapsible'

export default {
  name: 'ElectionSelection',
  components: { Collapsible },
  data () {
    return {
      userId: '',
      userName: '',
      elections: []
    }
  },
  methods: {
    hasOpenElections () {
      return ((this.elections.openElections === undefined) || !(this.elections.openElections.length === 0))
    },
    hasClosedElections () {
      return ((this.elections.closedElections === undefined) || !(this.elections.closedElections.length === 0))
    },
    hasCreatedElections () {
      return ((this.elections.createdElections === undefined) || !(this.elections.createdElections.length === 0))
    },
    hasNoElections () {
      return !(this.hasOpenElections() || this.hasClosedElections() || this.hasCreatedElections())
    },
    goToRoute (routeName, election = null) {
      if (election === null) {
        this.$router.push({ name: routeName })
      } else {
        this.$router.push({ name: routeName, params: { electionId: election } })
      }
      this.$socket.emit('routeChosenTrigger')
    },
    // can be removed once student data is provided by Schul-Cloud
    getRandomStudent (callback) {
      let url = '/api/randomId'
      fetch(url)
        .then(response => response.json())
        .then(result => {
          let user = {
            id: result.data._id,
            name: result.data.name
          }
          this.$store.dispatch('setUser', user)
          this.$socket.emit('studentLoadedTrigger')
          callback(user.id)
        })
    },
    fetchElections (userId) {
      let url = '/api/getStudentsElections'
      let packet = {studentId: userId}
      fetch(url, this.$getPostRequest(packet))
        .then(response => response.json())
        .then(result => {
          this.elections = result.data
        })
    }
  },
  mounted () {
    this.getRandomStudent(this.fetchElections)
  }
}
</script>

<style scoped>

  .btn_wrapper {
    margin-top: 1em;
    text-align: center;
  }

  .collapsible {
    margin: 18px 0;
  }

</style>
