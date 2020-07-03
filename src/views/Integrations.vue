<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs9 class="text-left">
        <header class="title" style="font-family: 'Montserrat', sans-serif !important">AWS INTEGRATIONS</header>
      </v-flex>
      <v-flex xs3 class="text-right">
        <i class="el-icon-plus clickable-icon" title="Add an AWS account" @click="addAwsAccount = true" role="button"></i>
        <i class="el-icon-refresh clickable-icon" title="Refresh" @click="FETCH_AWS_ACCOUNTS" role="button"></i>
        <i class="el-icon-help clickable-icon" title="Help" @click="showHelpDialogForRoute(routeName)" role="button"></i>
      </v-flex>
      <v-flex xs12>
        <aws-accounts-integrated class="component-within-sfc" :integrated-accounts="integratedAccounts"></aws-accounts-integrated>
      </v-flex>
      <!-- The class "component-within-sfc" should be specified in all the components that are a part of "views"-->
      <!-- The statement specified above is not applicable to this component (since it's a dialog) -->
      <el-dialog
        :visible.sync="addAwsAccount"
        :close-on-click-modal="false"
        destroy-on-close
        width="40%">
        <template v-slot:title>
          <header class="subtitle-1" style="font-family: 'Montserrat', sans-serif !important;"><v-icon x-large>mdi-aws</v-icon> Account Integration</header>
        </template>
        <aws-account-form @form-processed='addAwsAccount = false'>
          <template v-slot:fields="awsAccountForm">
            <el-form-item label="Alias Name" prop="aliasName" :rules="[{required: true, message: 'Please specify an Alias', trigger: 'blur'}]">
              <el-input v-model="awsAccountForm.awsAccountFormModel.aliasName" name="Alias Name"></el-input>
            </el-form-item>
            <el-form-item label="AWS Service" prop="awsService" :rules="[{required: true, message: 'Please choose a AWS Service', trigger: 'change'}]">
              <el-radio-group  v-model="awsAccountForm.awsAccountFormModel.awsService">
                <el-radio name="Cost Explorer" v-once :label="COST_EXPLORER_SERVICE"></el-radio>
                <el-radio name="CUR" v-once :label="COST_AND_USAGE_REPORTS_SERVICE"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="Polling Interval (in hours)" prop="pollingInterval" :rules="[{required: true, message: 'Please specify the Polling Interval', trigger: 'blur'}]">
              <el-input-number controls-position="right" name="Polling interval" :min="1" v-model="awsAccountForm.awsAccountFormModel.pollingInterval"></el-input-number>
            </el-form-item>
          </template>
          <template v-slot:submit="awsAccountForm">
            <el-form-item class="text-right">
              <el-button type="primary" :loading="awsAccountForm.loading" @click="awsAccountForm.validateForm(() => {INTEGRATE_AWS_ACCOUNT(awsAccountForm.awsAccountFormModel)})" name="Integrate AWS account">Submit</el-button>
              <el-button class="primary-color" :loading="awsAccountForm.loading" @click="addAwsAccount = false" name="Cancel">Cancel</el-button>
            </el-form-item>
          </template>
        </aws-account-form>
      </el-dialog>
    </v-layout>
  </v-container>
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex';

import helpDialogMixin from '@/mixins/helpDialogMixin';

import awsAccountForm from '@/components/integrations/AwsAccountForm';
import awsAccountsIntegrated from '@/components/integrations/AwsAccountsIntegrated';

const COST_EXPLORER_SERVICE = 'Cost Explorer (CE)';
const COST_AND_USAGE_REPORTS_SERVICE = 'Cost & Usage Reports (CUR)';

export default {
  data () {
    return {
      awsAccountFormTitle: 'Integrate AWS Account',
      routeName: '',
      COST_EXPLORER_SERVICE,
      COST_AND_USAGE_REPORTS_SERVICE,
      addAwsAccount: false,
      routeTitle: ''
    }
  },
  methods: {
    ...mapMutations([
      'SET_HELP_DIALOG_CONTENTS',
      'HELP_DIALOG_STATE'
    ]),
    ...mapActions('integrations', [
      'FETCH_AWS_ACCOUNTS',
      'INTEGRATE_AWS_ACCOUNT'
    ])
  },
  components: {
    awsAccountForm,
    awsAccountsIntegrated
  },
  computed: {
    ...mapState('integrations', [
      'integratedAccounts'
    ])
  },
  mixins: [
    helpDialogMixin
  ],
  created () {
    const vm = this;
    vm.routeName = vm.$route.name;
    vm.FETCH_AWS_ACCOUNTS();
  }
}
</script>

<style scoped>

</style>
