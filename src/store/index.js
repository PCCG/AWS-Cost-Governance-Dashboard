import Vue from 'vue';
import Vuex from 'vuex';

import integrations from './modules/integrations';

import actions from './actions';
import mutations from './mutations';
import state from './state';
import getters from './getters';

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    integrations
  },
  state,
  mutations,
  actions,
  getters
})
