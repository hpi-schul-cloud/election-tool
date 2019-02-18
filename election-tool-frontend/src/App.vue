<template>
  <div id="app">
    <PageHeader> </PageHeader>
    <MainView> </MainView>
  </div>
</template>

<script>
import PageHeader from './components/PageHeader'
import MainView from './components/MainView'

export default {
  name: 'App',
  components: {
    PageHeader,
    MainView
  }
}
</script>

<style>
@import '../static/styles/base.css';
@import '../static/styles/button.css';
@import '../static/styles/colors.css';

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--fontColor);
  margin-top: 0px;
  width: 100%;
}
</style>
