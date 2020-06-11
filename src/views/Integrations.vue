<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs9 class="text-left">
        <header class="headline" style="font-family: 'Montserrat', sans-serif !important">INTEGRATIONS</header>
      </v-flex>
      <v-flex xs3 class="text-right">
        <i class="el-icon-circle-plus clickable-icon" title="Add an AWS account" @click="addAwsAccount = true" role="button"></i>
        <i class="el-icon-question clickable-icon" title="Help" @click="showHelpDialogForIntegratingAwsAccounts" role="button"></i>
      </v-flex>
      <v-flex xs12>
        <aws-accounts-integrated class="component-within-sfc"></aws-accounts-integrated>
      </v-flex>
      <!-- The class "component-within-sfc" should be specified in all the components that are a part of "views"-->
      <!-- The statement specified above is not applicable to this component (since it's a dialog) -->
      <el-dialog
        :title="awsAccountFormTitle"
        :visible.sync="addAwsAccount"
        :close-on-click-modal="false"
        width="40%">
        <aws-account-form @form-processed='addAwsAccount = false'></aws-account-form>
      </el-dialog>
    </v-layout>
  </v-container>
</template>

<script>
import { mapMutations } from 'vuex';

import awsAccountForm from '@/components/integrations/AwsAccountForm';
import awsAccountsIntegrated from '@/components/integrations/AwsAccountsIntegrated';

import helpDialog from '../constants/helpDialog';

export default {
  data () {
    return {
      awsAccountFormTitle: 'Integrate AWS Account',
      addAwsAccount: false
    }
  },
  methods: {
    showHelpDialogForIntegratingAwsAccounts () {
      const vm = this;
      vm.SET_HELP_DIALOG_CONTENTS(helpDialog.getHelpForIntegratingAwsAccounts());
      vm.HELP_DIALOG_STATE(true);
    },
    ...mapMutations([
      'SET_HELP_DIALOG_CONTENTS',
      'HELP_DIALOG_STATE'
    ])
  },
  components: {
    awsAccountForm,
    awsAccountsIntegrated
  }
}
</script>

<style scoped>

.el-dialog__body {
  padding: 0 !important;
}

</style>
