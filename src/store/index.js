import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    helpDialogContent: '',
    showHelpDialog: false,
    helpDialogTitle: ''
  },
  mutations: {
    SET_HELP_DIALOG_CONTENTS: (state, helpDialog) => {
      state.helpDialogContent = helpDialog.getContent();
      state.helpDialogTitle = helpDialog.getTitle();
      state.showHelpDialog = true;
    },
    HELP_DIALOG_STATE: (state, showHelpDialog) => {
      state.showHelpDialog = showHelpDialog;
    }
  },
  actions: {
  },
  modules: {
  }
})
