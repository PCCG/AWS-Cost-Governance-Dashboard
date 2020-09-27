<template>
    <v-container fluid v-if="integratedAccount">
        <v-layout row wrap>
            <v-flex xs12 v-if="integratedAccount.accessKeyId">
                <aws-integrated-account :account="integratedAccount"/>
            </v-flex>
            <v-flex xs12 v-else>
                <gcp-integrated-account :account="integratedAccount"/>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import { mapState } from 'vuex';
import AwsIntegratedAccount from './aws/IntegratedAccount';
import GcpIntegratedAccount from './gcp/IntegratedAccount';

export default {
    computed: {
        ...mapState('awsIntegrations', {
            awsIntegratedAccounts: 'integratedAccountsMap'
        }),
        ...mapState('gcpIntegrations', {
            gcpIntegratedAccounts: 'integratedAccountsMap'
        }),
        integratedAccount () {
            const vm = this;
            const integratedAccounts = { ...vm.awsIntegratedAccounts, ...vm.gcpIntegratedAccounts};
            return integratedAccounts ? integratedAccounts[vm.$route.params.accountId] : null;
        }
    },
    components: {
        GcpIntegratedAccount,
        AwsIntegratedAccount
    }
}
</script>