<template>
  <div class="integrations__integrate-account">
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
          class="cursor-pointer"
          style="width: 100%; font-weight: 600">
          <el-table-column>
            <template v-slot="{ row }">
              <img :class="row.class" align="center" class="h-14" :src="row.logo"/>
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
      class="integrations__integrate-account--aws"
      v-if="getCurrentStep() > 0 && selectedProvider === PROVIDER_AWS_NAME"
      :close-on-click-modal="false"
      @close="cancelIntegration"
      width="80%">
        <template v-slot:title>
          <header class="card-title">Integrate AWS Account</header>
        </template>
        <v-container fluid>
          <v-layout row wrap>
            <v-flex xs12>
              <header>{{awsAccountIntegrationSteps[integrationCurrentStep].getDescription()}}</header>
              <br/>
            </v-flex>
            <v-flex xs4 class="pt-8">
              <el-steps :active="getCurrentStep()" direction="vertical" align-center>
                <el-step v-for="accountIntegrationStep in awsAccountIntegrationSteps" :key="accountIntegrationStep.getName()" :title="accountIntegrationStep.getName()" :description="accountIntegrationStep.getDescription()"></el-step>
              </el-steps>
            </v-flex>
            <v-flex xs8 class="pt-5">
              <aws-account-form  class="pt-1 integrations__integrate-account--aws__form" :integrationAccountStep="awsAccountIntegrationSteps[1]" v-show="getCurrentStep() === 1">
                <template v-slot:fields="awsAccountForm">
                  <el-form-item label="Alias Name" prop="aliasName" :rules="[{required: true, message: 'Please specify an Alias', trigger: 'blur'}]">
                    <el-input v-model="awsAccountForm.awsAccountFormModel.aliasName" name="Alias Name"></el-input>
                  </el-form-item>
                  <el-form-item label="Polling Interval (in hours)" prop="pollingInterval" :rules="[{required: true, message: 'Please specify the Polling Interval', trigger: 'blur'}]">
                    <el-input-number controls-position="right" name="Polling interval" :min="1" v-model="awsAccountForm.awsAccountFormModel.pollingInterval"></el-input-number>
                  </el-form-item>
                </template>
              </aws-account-form>
              <aws-cur-form class="integrations__integrate-account--aws__form" :integrationAccountStep="awsAccountIntegrationSteps[2]" v-if="getCurrentStep() === 2" :awsAccount="awsAccountIntegrationSteps[1].getFormData()"/>
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
      <el-dialog
        :visible="true"
        v-if="getCurrentStep() > 0 && selectedProvider === PROVIDER_GCP_NAME"
        :close-on-click-modal="false"
        @close="cancelIntegration"
        width="40%">
          <template v-slot:title>
            <header class="card-title">Integrate GCP Account</header>
          </template>
          <gcp-account-form :integrationAccountStep="gcpAccountIntegrationSteps[1]" v-show="getCurrentStep() === 1"></gcp-account-form>
          <template v-slot:footer>
            <el-button type="primary" v-show="isNextStepAvailable" @click="actionToRunOnNext">Next</el-button>
            <el-button type="primary" v-show="!isNextStepAvailable" name="Integrate Account" @click="actionToRunOnNext">Submit</el-button>
            <el-button type="primary" v-show="getCurrentStep() > 0" @click="previousStep">Back</el-button>
            <el-button class="primary-color" @click="cancelIntegration">Cancel</el-button>
          </template>
        </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';

import awsAccountIntegrationSteps from '@/constants/integrations/aws/integrationSteps'
import gcpAccountIntegrationSteps from '@/constants/integrations/gcp/integrationSteps'

import awsAccountForm from './aws/AccountForm'
import awsCurForm from './aws/CurForm'

import gcpAccountForm from './gcp/AccountForm'

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
        gcpAccountIntegrationSteps,
        accountIntegrationSteps: null,
        supportedProviders: [
          {name: PROVIDER_GCP_NAME, class: "gcp", logo: require('@/assets/integrations/gcp-logo.png')},
          {name: PROVIDER_AWS_NAME, class: "aws", logo: require('@/assets/integrations/aws-logo.svg')}
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
      isNextStepAvailable () {
        const vm = this;
        const currentStep = vm.getCurrentStep();
        const nextStep = currentStep + 1;
        return vm.accountIntegrationSteps[nextStep];
      }
    },
    methods: {
      ...mapActions('awsIntegrations', [
        'INTEGRATE_AWS_ACCOUNT'
      ]),
      ...mapActions('gcpIntegrations', [
        'INTEGRATE_GCP_ACCOUNT'
      ]),
      ...mapMutations([
        'SET_ERROR_MESSAGE'
      ]),
      setSelectedProvider (provider) {
        const vm = this;
        vm.selectedProvider = provider.name;
        vm.accountIntegrationSteps = vm.selectedProvider === vm.PROVIDER_AWS_NAME ? vm.awsAccountIntegrationSteps : vm.gcpAccountIntegrationSteps;
      },
      actionToRunOnNext: async function () {
        const vm = this;
        const currentStep = vm.getCurrentStep();
        try {
          const formData = await vm.accountIntegrationSteps[currentStep].getFunctionToExecuteOnNext()();
          vm.accountIntegrationSteps[currentStep].setFormData(formData);
          //If there is a step after the current one, go to it. Else, submit the data specified in the form
          if (vm.isNextStepAvailable) {
            vm.nextStep();
          } else {
            if (vm.selectedProvider === vm.PROVIDER_AWS_NAME) {
              await vm.INTEGRATE_AWS_ACCOUNT(vm.accountIntegrationSteps);
            } else {
              await vm.INTEGRATE_GCP_ACCOUNT(vm.accountIntegrationSteps);
            }
            vm.cancelIntegration();
          }
        } catch (error) {
          vm.SET_ERROR_MESSAGE("Integration was unsuccessful");
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
      awsCurForm,
      gcpAccountForm
    }
}
</script>

<style lang="scss">
  .integrations__integrate-account {
    img {
      &.aws {
        margin-left: 1rem;
      }
      &.gcp {
        margin-left: 3.5rem;
      }
    }
    &--aws {
      .el-dialog {
        @apply px-5;
        @apply my-2;
      }
      &__form {
        min-height: 70vh;
      }
    }
  }
</style>
