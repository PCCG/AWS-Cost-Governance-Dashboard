import helpDialog from '@/constants/helpDialog';

export default {
  methods: {
    showHelpDialogForRoute (routeName) {
      const vm = this;
      vm.SET_HELP_DIALOG_CONTENTS(helpDialog[routeName.toLowerCase()]);
      vm.HELP_DIALOG_STATE(true);
    }
  }
}
