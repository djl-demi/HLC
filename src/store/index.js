import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tab: 0,
    menuTheme: "light"
  },
  getters: {
    getTab: (state, getter) => {
      return state.tab
    }
  },
  mutations: {
    setTab(state, index) {
      state.tab = index
    }
  },
  actions: {},
  modules: {}
})
