<template>
  <el-dialog
    :visible.sync="enableIntegrationDialog"
    :close-on-click-modal="false"
    width="55%">
      <template v-slot:title>
        <header class="card-title" style="font-family: 'Montserrat', sans-serif !important;">{{title}}</header>
      </template>
      <v-container fluid>
        <v-layout row wrap>
          <v-flex xs12>
            <header>{{awsAccountIntegrationSteps[integrationCurrentStep].getDescription()}}</header>
            <br/>
          </v-flex>
          <v-flex xs4>
            <el-steps :active="getCurrentStep()" direction="vertical" align-center style="margin-top: 20px">
              <el-step v-for="accountIntegrationStep in awsAccountIntegrationSteps" :key="accountIntegrationStep.getName()" :title="accountIntegrationStep.getName()" :description="accountIntegrationStep.getDescription()"></el-step>
            </el-steps>
          </v-flex>
          <v-flex xs1></v-flex>
          <v-flex xs7>
            <aws-account-form :integrationAccountStep="awsAccountIntegrationSteps[1]" v-show="getCurrentStep() === 1">
              <template v-slot:fields="awsAccountForm">
                <el-form-item label="Alias Name" prop="aliasName" :rules="[{required: true, message: 'Please specify an Alias', trigger: 'blur'}]">
                  <el-input v-model="awsAccountForm.awsAccountFormModel.aliasName" name="Alias Name"></el-input>
                </el-form-item>
                <el-form-item label="Polling Interval (in hours)" prop="pollingInterval" :rules="[{required: true, message: 'Please specify the Polling Interval', trigger: 'blur'}]">
                  <el-input-number controls-position="right" name="Polling interval" :min="1" v-model="awsAccountForm.awsAccountFormModel.pollingInterval"></el-input-number>
                </el-form-item>
              </template>
            </aws-account-form>
            <aws-cur-form :integrationAccountStep="awsAccountIntegrationSteps[2]" v-if="getCurrentStep() === 2" :awsAccount="awsAccountIntegrationSteps[1].getFormData()"/>
          </v-flex>
        </v-layout>
      </v-container>
      <template v-slot:footer>
        <el-button type="primary" v-show="isNextStepAvailable" @click="actionToRunOnNext">Next</el-button>
        <el-button type="primary" v-show="!isNextStepAvailable" name="Integrate AWS account" @click="actionToRunOnNext">Submit</el-button>
        <el-button type="primary" v-show="getCurrentStep() > 1" @click="previousStep">Back</el-button>
        <el-button class="primary-color" @click="cancelIntegration">Cancel</el-button>
      </template>
    </el-dialog>
</template>

<script>
import { mapActions } from 'vuex';

import awsAccountIntegrationSteps from '@/constants/integrations/aws/integrationSteps'

import awsAccountForm from './aws/AccountForm'
import awsCurForm from './aws/CurForm'

export default {
    data () {
      return {
        integrationCurrentStep: 1,
        awsAccount: null,
        awsAccountIntegrationSteps
      }
    },
    props: {
      title: {
        type: String
      },
      integrateAccount: {
        type: Boolean
      }
    },
    computed: {
      enableIntegrationDialog: {
        get () {
          const vm = this;
          return vm.integrateAwsAccount;
        },
        set () {
          const vm = this;
          vm.cancelIntegration();
        }
      },
      isNextStepAvailable () {
        const vm = this;
        const currentStep = vm.getCurrentStep();
        const nextStep = currentStep + 1;
        return vm.awsAccountIntegrationSteps[nextStep];
      }
    },
    methods: {
      ...mapActions('integrations', [
        'INTEGRATE_AWS_ACCOUNT'
      ]),
      actionToRunOnNext: async function () {
        const vm = this;
        const currentStep = vm.getCurrentStep();
        try {
          const formData = await vm.awsAccountIntegrationSteps[currentStep].getFunctionToExecuteOnNext()();
          vm.awsAccountIntegrationSteps[currentStep].setFormData(formData);
          //If there is a step after the current one, go to it. Else, submit the data specified in the form
          if (vm.isNextStepAvailable()) {
            vm.nextStep();
          } else {
            vm.INTEGRATE_AWS_ACCOUNT();
            vm.cancelIntegration();
          }
        } catch (error) {
          window.console.log(error.message);
        }
      },
      getCurrentStep () {
        const vm = this;
        return vm.integrationCurrentStep;
      },
      nextStep () {
        const vm = this;
        vm.integrationCurrentStep += 1;
      },
      previousStep () {
        const vm = this;
        vm.integrationCurrentStep -= 1;
      },
      cancelIntegration () {
        const vm = this;
        vm.$emit('close-dialog');
      }
    },
    components: {
      awsAccountForm,
      awsCurForm
    }
}
</script>

<style scoped>

</style>
