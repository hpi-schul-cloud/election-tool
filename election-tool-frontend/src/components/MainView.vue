<template>
  <div class="main-view">
    <div class="progress-container" id="progressDisplay" v-if="!isPageWithoutElection()">
      <ul class="progressbar">
        <li id='Application'>Bewerbung</li>
        <li id='Vote'>Wahl</li>
        <li id='Results'>Ergebnis </li>
      </ul>
    </div>
    <router-view v-on:check-route="checkRoute()"
                 v-on:check-user="checkUser()"
                 v-on:check-creator="checkCreator()"> </router-view>
  </div>
</template>

<script>
export default {
  name: 'MainView',
  methods: {
    isPageWithoutElection () {
      return ((this.$route.path === '/electionCreation') ||
        (this.$route.path === '/electionSelection') ||
        (this.$route.path === '/'))
    },
    checkUser () {
      let url = '/api/checkUser'
      let packet = {
        electionId: this.$route.params.electionId,
        studentId: this.$store.getters.USER.id
      }
      fetch(url, this.$getPostRequest(packet))
        .then(response => response.json())
        .then(result => {
          if (result.success) {
            if (!result.data.isValid) {
              this.$alertFailure(this, 'Du hast keine Wahlberechtigung in dieser Wahl.', true)
              this.$router.push({ name: 'ElectionSelection' })
            }
          } else {
            this.$alertFailure(this, result.error, true)
          }
        })
    },
    checkCreator () {
      let url = '/api/checkCreator'
      let packet = {
        electionId: this.$route.params.electionId,
        studentId: this.$store.getters.USER.id
      }
      fetch(url, this.$getPostRequest(packet))
        .then(response => response.json())
        .then(result => {
          if (result.success) {
            if (!result.data.isValid) {
              this.$alertFailure(this, 'Du bist nicht als Ersteller dieser Wahl eingetragen.', true)
              this.$router.push({ name: 'ElectionSelection' })
            }
          } else {
            this.$alertFailure(this, result.error, true)
          }
        })
    },
    checkRoute () {
      if (!this.isPageWithoutElection()) {
        if (!(this.$route.path.toLowerCase().includes('dashboard'))) {
          this.processRoutingInformation(this.setCurrentRoute, this.setActivePhases)
        } else {
          this.$router.push({name: 'Dashboard'})
          this.processRoutingInformation(this.setActivePhases)
        }
      }
    },
    processRoutingInformation (callback1, callback2 = (data) => {}) {
      let url = '/api/getRoute'
      let packet = { electionId: this.$route.params.electionId }
      fetch(url, this.$getPostRequest(packet))
        .then(response => response.json())
        .then(result => {
          if (result.success) {
            callback1(result.data)
            callback2(result.data)
          } else {
            this.$alertFailure(this, result.error, true)
          }
        })
    },
    setCurrentRoute (routingData) {
      this.$router.push({ name: routingData.routeName })
    },
    setActivePhases (routingData) {
      routingData.activePhases.forEach(this.activatePhase)
    },
    activatePhase (id) {
      document.querySelector('#' + id).setAttribute('class', 'active')
    }
  },
  created () {
    this.checkRoute()
    this.$toTop()
  },
  mounted () {
    this.$socket.on('routeUpdated', (electionId) => {
      if (!this.isPageWithoutElection()) {
        if (electionId === this.$route.params.electionId) {
          this.checkRoute()
          this.$toTop()
        }
      }
    })
  }
}
</script>

<style scoped>
  .main-view {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .progress-container {
    width: 80%;
    max-width: 700px;
    margin: 1em auto;
  }

  .progressbar {
    counter-reset: step;
    padding: 0px;
  }

  .progressbar li {
    list-style-type: none;
    width: 33.3333%;
    float: left;
    font-size: 16px;
    position: relative;
    text-align: center;
    text-transform: uppercase;
    color: var(--colorDarkerGrey);
  }

  .progressbar li:before {
    width: 30px;
    height: 30px;
    content: counter(step);
    counter-increment: step;
    line-height: 30px;
    border: 2px solid var(--colorDarkerGrey);
    display: block;
    text-align: center;
    margin: 0 auto 10px auto;
    border-radius: 50%;
    background-color: var(--colorWhite);
  }

  .progressbar li:after {
    width: 100%;
    height: 2px;
    content: "";
    position: absolute;
    background-color: var(--colorDarkerGrey);
    top: 15px;
    left: -50%;
    z-index: -1;
  }

  .progressbar li:first-child:after {
    content: none;
  }

  .progressbar li.active {
    color: var(--primaryColor);
  }

  .progressbar li.active:before {
    border-color: var(--primaryColor);
  }

  .progressbar li.active:after {
    background-color: var(--primaryColor);
  }
  @media only screen and (max-width: 450px) {
    .progressbar li {
      font-size: .8em;
    }
  }
</style>
