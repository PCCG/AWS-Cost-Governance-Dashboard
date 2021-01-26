<template>
  <v-container class="mt-5 px-10">
    <v-layout row wrap>
      <v-flex class="my-2" xs12 sm6 v-for="account in integratedAccounts" :key="account._id">
        <el-card :class="`integrated-account-card integrated-account-card__${cloudProvider(account)}`" shadow="always">
          <v-container fluid>
            <v-layout row wrap>
              <v-flex xs6>
                <header class="integrated-account-card-item" @click="openAccountDetails(account._id)">
                  <span class="clickable">
                    {{account.aliasName}}
                  </span>
                </header>
              </v-flex>
              <v-flex xs6 class="justify-end" v-if="cloudProvider(account) === 'AWS'">
                <i class="clickable-icon integrated-account-card__icon-size el-icon-video-play primary-color" @click="START_AWS_ACCOUNT_AGGREGATION(account._id)" title="Start Aggregation" role="button"/>
                <i class="clickable-icon integrated-account-card__icon-size el-icon-edit-outline primary-color" title="Edit Integration" role="button"/>
                <i class="clickable-icon integrated-account-card__icon-size el-icon-delete primary-color" @click="DELETE_AWS_ACCOUNT(account._id)" title="Delete Integration" role="button"/>
              </v-flex>
              <v-flex xs6 class="justify-end" v-else>
                <i class="clickable-icon integrated-account-card__icon-size el-icon-video-play primary-color" title="Start Aggregation" role="button"/>
                <i class="clickable-icon integrated-account-card__icon-size el-icon-edit-outline primary-color" title="Edit Integration" role="button"/>
                <i class="clickable-icon integrated-account-card__icon-size el-icon-delete primary-color" @click="DELETE_GCP_ACCOUNT(account._id)" title="Delete Integration" role="button"/>
              </v-flex>
              <el-tag class="mt-1" size="mini" effect="plain">{{cloudProvider(account)}} Account</el-tag>
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

export default {
    methods: {
        ...mapActions('gcpIntegrations', [
          'DELETE_GCP_ACCOUNT'
        ]),
        ...mapActions('awsIntegrations', [
          'START_AWS_ACCOUNT_AGGREGATION',
          'DELETE_AWS_ACCOUNT'
        ]),
        openAccountDetails (accountId) {
          const vm = this;
          vm.$router.push({name: 'Integration', params: {accountId}});
        },
        cloudProvider (account) {
          return account.accessKeyId ? 'AWS' : 'GCP';
        }
    },
    computed: {
        ...mapState('awsIntegrations', {
            awsIntegratedAccounts: 'integratedAccounts'
        }),
        ...mapState('gcpIntegrations', {
            gcpIntegratedAccounts: 'integratedAccounts'
        }),
        integratedAccounts () {
          const vm = this;
          let integratedAccounts = [];
          if (vm.awsIntegratedAccounts && vm.gcpIntegratedAccounts) {
            integratedAccounts = vm.awsIntegratedAccounts.concat(vm.gcpIntegratedAccounts);
          } else if (vm.awsIntegratedAccounts) {
            integratedAccounts = vm.awsIntegratedAccounts;
          } else if (vm.gcpIntegratedAccounts) {
            integratedAccounts = vm.gcpIntegratedAccounts;
          }
          return orderBy(integratedAccounts, ['aliasName'], ['asc']);
        }
    }
}
</script>

<style lang="scss">
  $gcp-color--primary: #3b78e7;
  $aws-color--primary: #f91;

  .integrated-account-card {
    width: 80%;
    height: 6.5rem;
    &__GCP {
      border-left: 4px solid $gcp-color--primary;
    }
    &__AWS {
      border-left: 4px solid $aws-color--primary;
    }
    &-item {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    &__icon-size {
      font-size: 22px !important;
    }
  }
</style>