<template>
    <v-container fluid>
        <v-layout row wrap v-if="integratedAccount.accessKeyId">
            <v-flex xs10 sm2 class="text-right text-sm-left">
                <img class="provider-logo" :src="require('@/assets/integrations/aws-logo.svg')" />
            </v-flex>
            <v-flex xs12 sm4 style="align-self: center" class="text-center text-sm-left">
                <header class="alias-name title" style="font-family: 'Montserrat', sans-serif !important;">{{ integratedAccount.aliasName }}</header>
            </v-flex>
            <v-flex xs12 sm6 class="text-center text-sm-right" style="align-self: center">
                <i class="clickable-icon el-icon-video-play primary-color" title="Start Aggregation" role="button"/>
                <i class="clickable-icon el-icon-edit-outline primary-color" title="Edit Integration" role="button"/>
                <i class="clickable-icon el-icon-delete primary-color" title="Delete Integration" role="button"/>
            </v-flex>
        </v-layout>
        <v-layout row wrap v-else>
            <v-flex xs10 sm1 class="text-right text-sm-left">
                <img class="provider-logo" :src="require('@/assets/integrations/gcp-logo.png')" />
            </v-flex>
            <v-flex xs12 sm5 style="align-self: center" class="text-center text-sm-left">
                <header class="alias-name title" style="font-family: 'Montserrat', sans-serif !important;">{{ integratedAccount.aliasName }}</header>
            </v-flex>
            <v-flex xs12 sm6 class="text-center text-sm-right" style="align-self: center">
                <i class="clickable-icon el-icon-video-play primary-color" title="Start Aggregation" role="button"/>
                <i class="clickable-icon el-icon-edit-outline primary-color" title="Edit Integration" role="button"/>
                <i class="clickable-icon el-icon-delete primary-color" title="Delete Integration" role="button"/>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import { mapState } from 'vuex';

export default {
    data: () => ({
        integratedAccount: null
    }),
    computed: {
        ...mapState('awsIntegrations', {
            awsIntegratedAccounts: 'integratedAccounts'
        }),
        ...mapState('gcpIntegrations', {
            gcpIntegratedAccounts: 'integratedAccounts'
        }),
    },
    created () {
        const vm = this;
        const accountId = vm.$route.params.accountId;
        [ vm.integratedAccount ] = vm.awsIntegratedAccounts.concat(vm.gcpIntegratedAccounts).filter((account) => account._id === accountId);
    }
}
</script>

<style lang="scss" scoped>
    .alias-name {
        vertical-align: middle;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .provider-logo {
        margin: 5px;
        width: 75%;
        vertical-align: middle;
    }
</style>