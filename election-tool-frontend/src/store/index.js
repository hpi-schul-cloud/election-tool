import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'

Vue.use(Vuex)

const vuexPersist = new VuexPersist({
  key: 'election-tool',
  storage: sessionStorage
})

export default new Vuex.Store({
  state: {
    user: {
      id: '',
      name: ''
    }
  },
  getters: {
    USER: state => {
      return state.user
    }
  },
  mutations: {
    SET_USER: (state, data) => {
      state.user.id = data.id
      state.user.name = data.name
    }
  },
  actions: {
    setUser: (context, data) => {
      context.commit('SET_USER', data)
    }
  },
  plugins: [ vuexPersist.plugin ]
})
