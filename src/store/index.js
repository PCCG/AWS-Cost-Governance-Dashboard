import Vue from 'vue';
import Vuex from 'vuex';

import awsIntegrations from './modules/integrations/aws';
import gcpIntegrations from './modules/integrations/gcp'

import actions from './actions';
import mutations from './mutations';
import state from './state';
import getters from './getters';

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    awsIntegrations,
    gcpIntegrations
  },
  state,
  mutations,
  actions,
  getters
})
