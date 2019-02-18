<template>
  <div>
    <div class="header" ref="header">
      <header class="page-head" onResize=calculateActualHeight()>
        <a href="https://schul-cloud.org/" class="back">
          <img src="../assets/images/door_transparent.png" alt="exit" class="image-head" />
          <img src="../assets/images/logo/cloud-transparent-mono.svg" alt="Schul-Cloud Logo" class="image-head" />
        </a>
        <div class="title">
          <h1 class="normalTitle"> Schul-Cloud Wahl-Tool {{ electionname }}</h1>
          <h1 class="mobileTitle"> Schul-Cloud Wahl-Tool</h1>
        </div>
        <div class="user">
          {{ username }}
        </div>
      </header>
      <div class="mobileElectionName">{{ electionname }}</div>
    </div>
    <div ref="placeholder"></div>
  </div>
</template>

<script>
export default {
  name: 'PageHeader',
  data: () => ({
    username: '',
    electionname: ''
  }),
  methods: {
    updateElectionName () {
      let url = '/api/getElectionName'
      let packet = {
        route: this.$route.path,
        electionId: this.$route.params.electionId
      }
      fetch(url, this.$getPostRequest(packet))
        .then(response => response.json())
        .then(result => {
          if (result.success) {
            this.electionname = result.data
          } else {
            this.$alertFailure(this, result.error, true)
          }
        })
    },
    calculateActualHeight () {
      this.$refs.placeholder.style.height = this.$refs.header.clientHeight + 'px'
    }
  },
  created () {
    this.updateElectionName()
    window.addEventListener('load', () => { this.calculateActualHeight() })
    window.addEventListener('resize', () => { this.calculateActualHeight() })
  },
  mounted () {
    if (this.$store.getters.USER.name) {
      this.username = this.$store.getters.USER.name
    }
    this.$socket.on('studentLoaded', () => {
      this.username = this.$store.getters.USER.name
    })
    this.$socket.on('routeChosen', () => {
      this.updateElectionName()
    })
  }
}
</script>

<style scoped>
  .header {
    position: fixed;
    width: 100%;
    z-index: 99;
    box-shadow: 1px 2px 8px rgba(93, 92, 92, 0.8);
  }
  .page-head {
    background-color: var(--primaryColor);
    color: var(--colorWhite);
    width: 100%;
    display: flex;
    padding: .5em;
    justify-content: space-between;
    align-items: center;
  }

  .back {
    display: flex;
    min-width: 10%;
    max-width: 15%;
    justify-content: center;
  }

  .image-head {
    max-height: 3em;
    height: auto;
  }

  h1 {
    font-weight: normal;
    font-size: 1.4em;
  }

  .title {
    padding: 0 2%;
    flex: 1;
  }

  .user {
    min-width: 10%;
    max-width: 15%;
    margin: 0 1%;
  }

  .mobileTitle, .mobileElectionName {
    display: none;
  }

  .mobileElectionName {
    background: var(--colorWhite);
    padding: .4em 0;
  }

   @media only screen and (max-width: 500px) {
    .title, .user {
      font-size: .7em;
    }
    .mobileTitle, .mobileElectionName {
      display: block;
    }
    .normalTitle {
      display: none;
    }
  }

</style>
