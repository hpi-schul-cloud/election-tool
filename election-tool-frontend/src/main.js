// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import socketIO from 'socket.io-client'
import store from './store/index.js'
import VueSweetalert2 from 'vue-sweetalert2'

Vue.config.productionTip = false
Vue.use(VueSweetalert2)

const config = require('../config/config.json')
const usedConfig = config.localDevelopment
// const usedConfig = config.multiDeviceDevelopment

Vue.prototype.$socket = socketIO(usedConfig.server)

Vue.prototype.$toTop = () => {
  document.body.scrollTop = 0 // For Safari
  document.documentElement.scrollTop = 0 // For Chrome, Firefox, IE and Opera
}

Vue.prototype.$alertFailure = (instance, text, wishConfirmButton, timer) => {
  instance.$swal({
    title: 'Oooops!',
    text: text,
    type: 'error',
    showConfirmButton: wishConfirmButton,
    timer: timer
  })
}

Vue.prototype.$alertSuccess = (instance, text, wishConfirmButton, timer) => {
  instance.$swal({
    title: 'Fertig!',
    text: text,
    type: 'success',
    showConfirmButton: wishConfirmButton,
    timer: timer
  })
}

Vue.prototype.$getPostRequest = (data) => {
  return {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    redirect: 'follow',
    referrer: 'no-referrer',
    body: JSON.stringify(data)
  }
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
