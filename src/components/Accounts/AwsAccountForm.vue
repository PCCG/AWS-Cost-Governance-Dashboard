<template>
  <v-container fluid class="component-within-sfc">
    <v-layout row wrap>
        <el-card style="width: 100% !important">
          <header class="card-title">AWS Account Integration  <i @click="showHelpDialogForIntegratingAwsAccounts" class="el-icon-question" style="cursor: pointer;" title="More info"></i></header>
          <el-form :rules="awsAccountFormrules" :ref="formName" :model="awsAccountForm">
            <el-form-item label="Access Key ID" prop="accessKeyId">
              <el-input v-model="awsAccountForm.accessKeyId" name="Access Key ID"></el-input>
            </el-form-item>
            <el-form-item label="Secret Access Key" prop="secretAccessKey">
              <el-input type="password" v-model="awsAccountForm.secretAccessKey" name="Secret Access Key"></el-input>
            </el-form-item>
            <el-form-item label="AWS service to integrate with">
              <el-radio-group v-model="awsAccountForm.awsService">
                <el-radio v-once :label="COST_EXPLORER_SERVICE"></el-radio>
                <el-radio v-once :label="COST_AND_USAGE_REPORTS_SERVICE"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="Polling interval (in hours)" prop="pollingInterval">
              <el-input-number :min="1" controls-position="right" v-model="awsAccountForm.pollingInterval"></el-input-number>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="loading" @click="validateFormData" name="Integrate AWS account">Submit</el-button>
            </el-form-item>
          </el-form>
        </el-card>
    </v-layout>
  </v-container>
</template>

<script>
import { mapMutations } from 'vuex';
import helpDialog from '../../constants/helpDialog';
import accountsClient from '../../rest/accountsClient'

const COST_EXPLORER_SERVICE = 'Cost Explorer (CE)';
const COST_AND_USAGE_REPORTS_SERVICE = 'Cost and Usage Reports (CUR)';

export default {
  data () {
    return {
      formName: 'awsAccountForm',
      COST_EXPLORER_SERVICE,
      COST_AND_USAGE_REPORTS_SERVICE,
      loading: false,
      showHelpDrawer: true,
      awsAccountForm: {
        accessKeyId: '',
        secretAccessKey: '',
        awsService: COST_EXPLORER_SERVICE,
        pollingInterval: null
      },
      awsAccountFormrules: {
        accessKeyId: [
          {required: true, message: 'Please specify the Access Key ID', trigger: 'blur'}
        ],
        secretAccessKey: [
          {required: true, message: 'Please specify the Secret Access Key', trigger: 'blur'}
        ],
        pollingInterval: [
          {required: true, message: 'Please specify the polling interval', trigger: 'blur'},
        ]
      }
    }
  },
  methods: {
    ...mapMutations([
      'SET_HELP_DIALOG_CONTENTS',
      'HELP_DIALOG_STATE'
    ]),
    showHelpDialogForIntegratingAwsAccounts () {
      const vm = this;
      vm.SET_HELP_DIALOG_CONTENTS(helpDialog.getHelpForIntegratingAwsAccounts());
      vm.HELP_DIALOG_STATE(true);
    },
    validateFormData () {
      const vm = this;
      vm.$refs[vm.formName].validate((valid) => {
        if (valid) {
          vm.integrateAwsAccount();
        } else {
          return false;
        }
      });
    },
    integrateAwsAccount: async function () {
      const vm = this;
      try {
        vm.loading = true;
        await accountsClient.postAwsAccount(vm.awsAccountForm);
      } catch (e) {
        vm.loading = false;
        window.console.log(e.stack);
      }
    }
  }
}
</script>

<style scoped>

</style>
