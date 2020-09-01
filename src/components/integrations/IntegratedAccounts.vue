<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 sm6 v-for="account in integratedAccounts" :key="account.aliasName">
        <el-card :class="`integrated-account-card integrated-account-card__${account.provider.toLowerCase()}`" shadow="always">
          <v-container fluid>
            <v-layout row wrap>
              <v-flex xs6 style="align-self: center">
                <header class="integrated-account-card-item" @click="openAccountDetails(account)"><span class="clickable">{{account.aliasName}}</span></header>
              </v-flex>
              <v-flex xs6 class="text-right" v-if="account.provider === AWS_ACCOUNT_IDENTIFIER">
                <i class="clickable-icon integrated-account-card__icon-size el-icon-video-play primary-color" title="Start Aggregation" role="button"/>
                <i class="clickable-icon integrated-account-card__icon-size el-icon-edit-outline primary-color" title="Edit Integration" role="button"/>
                <i class="clickable-icon integrated-account-card__icon-size el-icon-delete primary-color" @click="DELETE_AWS_ACCOUNT(account._id)" title="Delete Integration" role="button"/>
              </v-flex>
              <v-flex xs6 class="text-right" v-else>
                <i class="clickable-icon integrated-account-card__icon-size el-icon-video-play primary-color" title="Start Aggregation" role="button"/>
                <i class="clickable-icon integrated-account-card__icon-size el-icon-edit-outline primary-color" title="Edit Integration" role="button"/>
                <i class="clickable-icon integrated-account-card__icon-size el-icon-delete primary-color" @click="DELETE_GCP_ACCOUNT(account._id)" title="Delete Integration" role="button"/>
              </v-flex>
              <v-flex xs12 class="text-left" style="align-self: center">
                <el-tag size="mini" effect="plain">{{account.provider}} Account</el-tag>
              </v-flex>
            </v-layout>
          </v-container>
        </el-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { orderBy } from 'lodash';

const AWS_ACCOUNT_IDENTIFIER = 'AWS';
const GCP_ACCOUNT_IDENTIFIER = 'GCP';

export default {
    data: () => ({
        integratedAccounts: [],
        AWS_ACCOUNT_IDENTIFIER,
        GCP_ACCOUNT_IDENTIFIER
    }),
    methods: {
        ...mapActions('gcpIntegrations', [
        'START_AGGREGATION',
        'DELETE_GCP_ACCOUNT',
        'FETCH_GCP_ACCOUNTS'
        ]),
        ...mapActions('awsIntegrations', [
        'START_AGGREGATION',
        'DELETE_AWS_ACCOUNT',
        'FETCH_AWS_ACCOUNTS'
        ]),
        updateListOfIntegratedAccounts () {
          const vm = this;
          if (vm.awsIntegratedAccounts && vm.gcpIntegratedAccounts) {
            const awsIntegratedAccounts = vm.awsIntegratedAccounts.map(account => {
              account.provider = AWS_ACCOUNT_IDENTIFIER;
              return account;
            })
            const gcpIntegratedAccounts = vm.gcpIntegratedAccounts.map(account => {
              account.provider = GCP_ACCOUNT_IDENTIFIER;
              return account;
            })
            const integratedAccounts = awsIntegratedAccounts.concat(gcpIntegratedAccounts);
            vm.integratedAccounts = orderBy(integratedAccounts, ['aliasName'], ['asc']);
          }
        },
        openAccountDetails () {

        }
    },
    computed: {
        ...mapState('awsIntegrations', {
            awsIntegratedAccounts: 'integratedAccounts'
        }),
        ...mapState('gcpIntegrations', {
            gcpIntegratedAccounts: 'integratedAccounts'
        }),
    },
    created: async function () {
        const vm = this;
        await Promise.all([vm.FETCH_AWS_ACCOUNTS(), vm.FETCH_GCP_ACCOUNTS()]);
        vm.updateListOfIntegratedAccounts();
    },
    watch: {
      awsIntegratedAccounts () {
        const vm = this;
        vm.updateListOfIntegratedAccounts();
      },
      gcpIntegratedAccounts () {
        const vm = this;
        vm.updateListOfIntegratedAccounts();
      }
    }
}
</script>

<style lang="scss">
  $gcp-color--primary: #3b78e7;
  $aws-color--primary: #f91;

  .integrated-account-card {
    margin: 2% !important;
    &__gcp {
      border-left: 4px solid $gcp-color--primary;
    }
    &__aws {
      border-left: 4px solid $aws-color--primary;
    }
    &-item {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    &__icon-size {
      font-size: 26px !important;
    }
  }
</style>