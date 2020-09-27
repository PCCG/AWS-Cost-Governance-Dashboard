<template>
    <v-container fluid v-if="awsAccount">
        <v-layout row wrap>
            <v-flex xs10 sm2 class="text-right text-sm-center">
                <img class="provider-logo" :src="require('@/assets/integrations/aws-logo.svg')" />
            </v-flex>
            <v-flex xs12 sm4 style="align-self: center" class="text-center text-sm-left">
                <header class="alias-name title" style="font-family: 'Montserrat', sans-serif !important;">{{ awsAccount.aliasName }}</header>
            </v-flex>
            <v-flex xs12 sm6 class="text-center text-sm-right" style="align-self: center">
                <i class="clickable-icon el-icon-video-play primary-color" title="Start Aggregation" @click="START_AWS_ACCOUNT_AGGREGATION(awsAccount._id)" role="button"/>
                <i class="clickable-icon el-icon-edit-outline primary-color" title="Edit Integration" role="button"/>
                <i class="clickable-icon el-icon-delete primary-color" title="Delete Integration" @click="DELETE_AWS_ACCOUNT(awsAccount._id)" role="button"/>
            </v-flex>
        </v-layout>
    </v-container>    
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
    props: {
        account: {
            required: true
        }
    },
    methods: {
        ...mapActions('awsIntegrations', [
            'START_AWS_ACCOUNT_AGGREGATION',
            'DELETE_AWS_ACCOUNT',
            'FETCH_COLLECTION_STATUS'
        ]),
    },
    computed: {
        ...mapState('awsIntegrations', {
            awsIntegratedAccounts: 'integratedAccountsMap'
        }),
        awsAccount () {
            const vm = this;
            return vm.account ? vm.account : vm.awsIntegratedAccounts[vm.$route.params.accountId];
        }
    }
}
</script>

<style lang="scss" scoped>
    .provider-logo {
        width: 75%;
        vertical-align: middle;
    }

    .alias-name {
        vertical-align: middle;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>