<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs9 class="text-left">
        <header class="title" style="font-family: 'Montserrat', sans-serif !important">PUBLIC CLOUD INTEGRATIONS</header>
      </v-flex>
      <v-flex xs3 class="text-right">
        <i class="el-icon-plus primary-color clickable-icon" title="Add an account" @click="integrateAccount = true" role="button"></i>
        <i class="el-icon-refresh primary-color clickable-icon" title="Refresh" @click="fetchIntegratedAccounts" role="button"></i>
        <i class="el-icon-help primary-color clickable-icon" title="Help" @click="showHelpDialogForRoute(routeName)" role="button"></i>
      </v-flex>
      <v-flex xs12>
        <aws-accounts-integrated class="component-within-sfc" :integrated-accounts="awsIntegratedAccounts"></aws-accounts-integrated>
        <gcp-accounts-integrated class="component-within-sfc" :integrated-accounts="gcpIntegratedAccounts"></gcp-accounts-integrated>
      </v-flex>
      <!-- The class "component-within-sfc" should be specified in all the components that are a part of "views"-->
      <!-- The statement specified above is not applicable to this component (since it's a dialog) -->
      <integrate-account v-if="integrateAccount" @close-dialog="integrateAccount = false" :integrateAccount="integrateAccount"/>
    </v-layout>
  </v-container>
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex';

import helpDialogMixin from '@/mixins/helpDialogMixin';

import integrateAccount from '@/components/integrations/IntegrateAccount';
import awsAccountsIntegrated from '@/components/integrations/aws/AccountsIntegrated';
import gcpAccountsIntegrated from '@/components/integrations/gcp/AccountsIntegrated';

export default {
  data () {
    return {
      routeName: '',
      routeTitle: '',
      integrateAccount: false,
      integrationDialogTitle: 'Integrate AWS Account'
    }
  },
  methods: {
    ...mapMutations([
      'SET_HELP_DIALOG_CONTENTS',
      'HELP_DIALOG_STATE'
    ]),
    ...mapActions('awsIntegrations', [
      'FETCH_AWS_ACCOUNTS',
    ]),
    ...mapActions('gcpIntegrations', [
      'FETCH_GCP_ACCOUNTS',
    ]),
    fetchIntegratedAccounts () {
      const vm = this;
      vm.FETCH_AWS_ACCOUNTS();
      vm.FETCH_GCP_ACCOUNTS();
    }
  },
  components: {
    awsAccountsIntegrated,
    integrateAccount,
    gcpAccountsIntegrated
  },
  computed: {
    ...mapState('awsIntegrations', {
        awsIntegratedAccounts: 'integratedAccounts'
    }),
    ...mapState('gcpIntegrations', {
        gcpIntegratedAccounts: 'integratedAccounts'
    })
  },
  mixins: [
    helpDialogMixin
  ],
  created () {
    const vm = this;
    vm.routeName = vm.$route.name;
    vm.fetchIntegratedAccounts();
  }
}
</script>

<style scoped>

</style>
