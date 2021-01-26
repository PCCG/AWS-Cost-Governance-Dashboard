<template>
  <v-container fluid>
    <v-layout row wrap v-if="$route.name === 'Integrations'">
      <v-flex xs12 sm6>
        <header class="title" style="font-family: 'Montserrat', sans-serif !important">PUBLIC CLOUD INTEGRATIONS</header>
      </v-flex>
      <v-flex xs12 sm6 class="justify-end">
        <i class="el-icon-plus primary-color clickable-icon" title="Add an account" @click="integrateAccount = true" role="button"></i>
        <i class="el-icon-refresh primary-color clickable-icon" title="Refresh" @click="fetchIntegratedAccounts" role="button"></i>
        <i class="el-icon-help primary-color clickable-icon" title="Help" @click="showHelpDialogForRoute(routeName)" role="button"></i>
      </v-flex>
      <v-flex xs12>
        <integrated-accounts/>
      </v-flex>
      <integrate-account v-if="integrateAccount" @close-dialog="integrateAccount = false" :integrateAccount="integrateAccount"/>
    </v-layout>
    <v-layout row wrap v-else>
      <v-flex xs12>
        <router-view/>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';

import helpDialogMixin from '@/mixins/helpDialogMixin';

import integrateAccount from '@/components/integrations/IntegrateAccount';
import integratedAccounts from '@/components/integrations/IntegratedAccounts'

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
    ...mapActions('gcpIntegrations', [
      'FETCH_GCP_ACCOUNTS'
    ]),
    ...mapActions('awsIntegrations', [
      'FETCH_AWS_ACCOUNTS'
    ]),
    fetchIntegratedAccounts () {
      const vm = this;
      vm.FETCH_GCP_ACCOUNTS();
      vm.FETCH_AWS_ACCOUNTS();
    }
  },
  components: {
    integrateAccount,
    integratedAccounts
  },
  mixins: [
    helpDialogMixin
  ],
  created () {
    const vm = this;
    vm.fetchIntegratedAccounts();
  }
}
</script>

<style scoped>

</style>
