export default {
  SET_HELP_DIALOG_CONTENTS: (state, helpDialog) => {
    state.helpDialogContent = helpDialog.getContent();
    state.helpDialogTitle = helpDialog.getTitle();
    state.showHelpDialog = true;
  },
  HELP_DIALOG_STATE: (state, showHelpDialog) => {
    state.showHelpDialog = showHelpDialog;
  },
  SET_ERROR_MESSAGE: (state, errorMessage) => {
    state.errorMessage = errorMessage;
  }
}
