<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12 class="text-right">
        <i class="el-icon-circle-plus clickable-icon" title="Add an AWS account" @click="addAwsAccount = true" role="button"></i>
        <i class="el-icon-question clickable-icon" title="Help" @click="showHelpDialogForIntegratingAwsAccounts" role="button"></i>
      </v-flex>
      <el-dialog
        :title="awsAccountFormTitle"
        :visible.sync="addAwsAccount"
        :close-on-click-modal="false"
        width="40%">
        <aws-account-form></aws-account-form>
      </el-dialog>
    </v-layout>
  </v-container>
</template>

<script>
import { mapMutations } from 'vuex';
import awsAccountForm from '../components/Accounts/AwsAccountForm';
import helpDialog from '../constants/helpDialog';

export default {
  data () {
    return {
      addAwsAccount: false,
      awsAccountFormTitle: 'AWS Account Integration'
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
    awsAccountForm
  }
}
</script>

<style scoped>

.el-dialog__body {
  padding: 0 !important;
}

</style>
