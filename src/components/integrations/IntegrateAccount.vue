<template>
  <div>
    <el-dialog
      :visible="true"
      @close="cancelIntegration"
      v-show="getCurrentStep() === 0"
      :close-on-click-modal="false"
      width="40%">
      <template v-slot:title>
        <header class="card-title">Choose a Provider</header>
      </template>
      <el-table
          :show-header="false"
          :data="supportedProviders"
          highlight-current-row
          @current-change="setSelectedProvider"
          style="width: 100%; font-weight: 600">
          <el-table-column align="center">
            <template v-slot="{ row }">
              <img align="center" height="50px" :src="row.logo" class="image">
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            property="name">
          </el-table-column>
      </el-table>
      <template v-slot:footer>
        <el-button v-show="selectedProvider" type="primary" @click="nextStep()">Next</el-button>
        <el-button class="primary-color" @click="cancelIntegration">Cancel</el-button>
      </template>
    </el-dialog>
    <el-dialog
      :visible="true"
      selectedProvider
      v-if="getCurrentStep() > 0 && selectedProvider === PROVIDER_AWS_NAME"
      :close-on-click-modal="false"
      @close="cancelIntegration"
      width="55%">
        <template v-slot:title>
          <header class="card-title">Integrate AWS Account</header>
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
          <el-button type="primary" v-show="getCurrentStep() > 0" @click="previousStep">Back</el-button>
          <el-button class="primary-color" @click="cancelIntegration">Cancel</el-button>
        </template>
      </el-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

import awsAccountIntegrationSteps from '@/constants/integrations/aws/integrationSteps'

import awsAccountForm from './aws/AccountForm'
import awsCurForm from './aws/CurForm'

const PROVIDER_AWS_NAME = 'Amazon Web Services';
const PROVIDER_GCP_NAME = 'Google Cloud Platform';

export default {
    data () {
      return {
        integrationCurrentStep: 0,
        awsAccount: null,
        PROVIDER_AWS_NAME,
        PROVIDER_GCP_NAME,
        awsAccountIntegrationSteps,
        supportedProviders: [
          {name: PROVIDER_AWS_NAME, logo: require('@/assets/integrations/aws-logo.png')},
          {name: PROVIDER_GCP_NAME, logo: require('@/assets/integrations/gcp-logo.png')}
        ],
        selectedProvider: null
      }
    },
    props: {
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
      setSelectedProvider (provider) {
        const vm = this;
        vm.selectedProvider = provider.name;
      },
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
