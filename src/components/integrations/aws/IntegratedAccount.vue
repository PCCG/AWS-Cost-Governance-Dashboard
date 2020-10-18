<template>
    <v-container fluid v-if="awsAccount" class="account-details">
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
            <v-flex xs12 sm6 class="account-details--card">
                <el-card shadow="always">
                    <el-table
                        :data="awsAccountCollectionStatus"
                        empty-text="Collection hasn't been initiated!"
                        style="width: 100%;">
                        <el-table-column label="Collection Status" align="left">
                            <template v-slot:header="{ column }">
                               <i class="table-header__icon el-icon-video-play"/> {{ column.label }}
                            </template>
                            <template v-slot="{ row }">
                                <span v-if="row.collectionStatus === 'success'" class="collection-status"><i class="el-message-box__status collection-status__icon el-icon-success"/> Success</span>
                                <span v-else class="collection-status"><i class="el-message-box__status collection-status__icon el-icon-error"/> Failed</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="Initiated" align="center">
                            <template v-slot:header="{ column }">
                               <i class="el-icon-time table-header__icon"/> {{ column.label }}
                            </template>
                            <template v-slot="{ row }">
                                {{ moment(moment.utc(row.timestamp).toDate()).local().format("lll") }}
                            </template>
                        </el-table-column>
                        <el-table-column label="Records Collected" property="number_of_records" align="center">
                            <template v-slot:header="{ column }">
                                <i class="el-icon-document table-header__icon"/> {{ column.label }}
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </v-flex>
        </v-layout>
    </v-container>    
</template>

<script>
import { mapActions, mapState } from 'vuex';

import moment from 'moment';

export default {
    data: () => ({
        awsAccountCollectionStatus: [],
        moment
    }),
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
        async fetchCollectionStatuses (accountId) {
            const vm = this;
            vm.awsAccountCollectionStatus = await vm.FETCH_COLLECTION_STATUS(accountId);
        }
    },
    computed: {
        ...mapState('awsIntegrations', {
            awsIntegratedAccounts: 'integratedAccountsMap'
        }),
        awsAccount () {
            const vm = this;
            const awsAccount = vm.account ? vm.account : vm.awsIntegratedAccounts[vm.$route.params.accountId];
            vm.fetchCollectionStatuses(awsAccount._id);
            return awsAccount;
        }
    }
}
</script>

<style lang="scss" scoped>
    .account-details {
        &--card {
            width: 95%;
            margin: 3%;
        }
    }

    .table-header__icon {
        margin-right: 2.5px;
    }

    .el-message-box__status {
        position: static !important;
        transform: translate(0) !important;
        vertical-align: bottom;
    }

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

    .collection-status {
        display: flex;
        align-items: baseline;
        &__icon {
            font-size: 15px !important;
            margin-right: 5px;
        }
    }
</style>