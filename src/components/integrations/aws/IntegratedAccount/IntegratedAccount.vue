<template>
    <v-container fluid v-if="awsAccount && !is_loading">
        <v-layout row wrap>
            <v-flex xs3 sm2 md1>
                <img class="provider-logo" :src="require('@/assets/integrations/aws-logo.svg')" />
            </v-flex>
            <v-flex xs4 sm6 md7 class="self-center">
                <header class="truncate title ml-3" style="font-family: 'Montserrat', sans-serif !important;">{{ awsAccount.aliasName }}</header>
            </v-flex>
            <v-flex xs5 sm4 class="justify-end">
                <el-tooltip transition="none" content="Initiate Collection">
                    <i class="clickable-icon el-icon-video-play primary-color pr-1" role="button" @click="START_AWS_ACCOUNT_AGGREGATION(awsAccount._id)"/>
                </el-tooltip>
                <el-tooltip transition="none" content="View Initiated Collections">
                    <el-popover
                        placement="bottom"
                        width="600"
                        trigger="click"
                    >
                        <i class="el-icon-arrow-down clickable primary-color pt-2" slot="reference"/>
                        <el-card shadow="never" class="account-details scrollbar">
                            <el-table
                                :data="collectionStatuses"
                                empty-text="Collection hasn't been initiated!">
                                <el-table-column label="Collection Status" align="left">
                                    <template v-slot="{ row }">
                                        <span v-if="row.collectionStatus === 'success'" class="collection-status"><i class="el-message-box__status collection-status__icon el-icon-success"/> Success</span>
                                        <span v-else class="collection-status"><i class="el-message-box__status collection-status__icon el-icon-error"/> Failed</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="Initiated" align="center">
                                    <template v-slot="{ row }">
                                        {{ moment(moment.utc(row.timestamp).toDate()).local().format("lll") }}
                                    </template>
                                </el-table-column>
                                <!-- <el-table-column label="Records Processed" property="number_of_records" align="center"></el-table-column> -->
                            </el-table>
                        </el-card>
                    </el-popover>
                </el-tooltip>
                <el-tooltip content="Edit Integration" transition="none">
                    <i class="clickable-icon el-icon-edit-outline primary-color pr-3" role="button"/>
                </el-tooltip>
                <el-tooltip content="Delete Integration" transition="none">
                    <i class="clickable-icon el-icon-delete primary-color pr-3" role="button" @click="DELETE_AWS_ACCOUNT(awsAccount._id)"/>
                </el-tooltip>
            </v-flex>
            <div class="flex items-center position-center" v-if="!collectionStatuses.length">
                <el-button
                    size="mini"
                    icon="el-icon-video-play"
                    class="text-base"
                    type="primary"
                    @click="START_AWS_ACCOUNT_AGGREGATION(awsAccount._id)"
                >
                    Start Collection
                </el-button>
                <el-tooltip 
                    transition="none"
                    placement="top"
                    content="A collection gathers spend for the integration by reaching out to the provider"
                >
                    <i class="el-icon-question text-2xl primary-color text-base transform translate-x-5"/>
                </el-tooltip>
            </div>
            <v-layout row v-else>
                <v-flex xs12 class="flex-centered-start mt-5">
                    <div class="flex-centered-start">
                        <el-date-picker
                            v-model="billingPeriod"
                            class="mt-3"
                            type="monthrange"
                            range-separator="-"
                            :picker-options="pickerOptions"
                            start-placeholder="Start Date"
                            end-placeholder="End Date"
                            :clearable="false"
                        >
                        </el-date-picker>
                        <i class="el-icon-question primary-color mt-3 ml-3"/>
                    </div>
                    <el-dropdown :hide-on-click="false" trigger="click" class="mt-4 ml-5">
                        <div class="el-dropdown-link">
                            <v-icon class="primary-color clickable-icon" title="Filter Spend">mdi-filter</v-icon>
                        </div>
                        <el-dropdown-menu slot="dropdown">
                            <div class="m-5">
                                <header>Cost Type</header>
                                <div class="mt-5">
                                    <el-radio v-model="costType" :label="BLENDED_COST_KEY">Blended Costs</el-radio>
                                    <el-radio v-model="costType" :label="UNBLENDED_COST_KEY">Unblended Costs</el-radio>
                                </div>
                                <header class="mt-7">Filter By</header>
                                <el-dropdown-item class="mt-3 pl-0">
                                    <el-radio 
                                        v-model="groupBy" 
                                        :label="GROUP_BY_ITEM"
                                        v-for="GROUP_BY_ITEM in groupByOptions"
                                        :key="GROUP_BY_ITEM"
                                    >
                                        {{ GROUP_BY_ITEM }}
                                    </el-radio>
                                </el-dropdown-item>
                            </div>
                        </el-dropdown-menu>
                    </el-dropdown>  
                </v-flex>
                <v-container fluid>
                    <v-layout row wrap>
                        <v-flex xs12 md5 class="mt-7 cost-breakdown-chart">
                            <el-card shadow="always">
                                <cost-breakdown-pie-chart style="min-height: 40.6vh" :billingPeriod="billingPeriod" :groupBy="groupBy" :costType="costType" :costReport="costReport"/>
                            </el-card>
                        </v-flex> 
                        <v-flex xs12 md7 class="mt-7 cost-breakdown-chart">
                            <el-card shadow="always">
                                <cost-breakdown-bar-chart style="min-height: 40.6vh" :billingPeriod="billingPeriod" :groupBy="groupBy" :costType="costType" :costReport="costReport"/>
                            </el-card>
                        </v-flex>
                    </v-layout> 
                </v-container>                
            </v-layout>
        </v-layout>
    </v-container>    
</template>

<script>
import { mapActions, mapState } from 'vuex';

import aggregationClient from "@/rest/aggregation/aws/aggregationClient";

import CostBreakdownPieChart from "./components/CostBreakdownPieChart.vue";
import CostBreakdownBarChart from "./components/CostBreakdownBarChart.vue";

//constants
const BLENDED_COST_KEY = 'blended_cost';
const UNBLENDED_COST_KEY = 'unblended_cost';

const GROUP_BY_ACCOUNT_KEY = 'Account';
const GROUP_BY_REGION_KEY = 'Region';
const GROUP_BY_SERVICE_KEY = 'Service';

export default {
    data: () => ({
        moment,
        processedData: null,
        is_loading: false,
        costType: BLENDED_COST_KEY,
        billingPeriod: null,
        groupBy: GROUP_BY_SERVICE_KEY,
        BLENDED_COST_KEY,
        UNBLENDED_COST_KEY,
        groupByOptions: [GROUP_BY_SERVICE_KEY, GROUP_BY_REGION_KEY, GROUP_BY_ACCOUNT_KEY]
    }),
    props: {
        account: {
            required: true
        }
    },
    components: {
        CostBreakdownPieChart,
        CostBreakdownBarChart
    },
    methods: {
        ...mapActions('awsIntegrations', [
            'START_AWS_ACCOUNT_AGGREGATION',
            'DELETE_AWS_ACCOUNT'
        ]),
    },
    computed: {
        pickerOptions() {
            const vm = this;
            return {
                disabledDate(time) {
                    return !(new Date(time) >= new Date(Object.keys(vm.costReport[0])[0].split('-')[0]) && new Date(time) <= new Date(Object.keys(vm.costReport[vm.costReport.length - 1])[0].split('-')[1]));
                }
            }
        },
        ...mapState('awsIntegrations', {
            awsIntegratedAccounts: 'integratedAccountsMap'
        }),
        awsAccount () {
            const vm = this;
            const awsAccount = vm.account || vm.awsIntegratedAccounts[vm.$route.params.accountId];
            return awsAccount;
        },
        collectionStatuses() {
            return this.processedData ? this.processedData.collectionStatuses : [];
        },
        costReport() {
            return this.processedData ? this.processedData.costReport : [];
        }
    },
    async created () {
        const vm = this;
        vm.is_loading = true;
        const processedData = await aggregationClient.fetchProcessedData(vm.awsAccount._id);
        vm.processedData = processedData;
        if(this.costReport.length) {
            const endDate = new Date(Object.keys(this.costReport[this.costReport.length - 1])[0].split("-")[1]).toISOString();
            const startDate = new Date(Object.keys(this.costReport[0])[0].split("-")[0]).toISOString();
            const billingPeriod = moment(endDate).diff(startDate, "months", true);
            vm.billingPeriod = billingPeriod > 6 ? [moment(endDate).subtract(6, "months"), endDate] : [startDate, endDate];
        }        
        vm.is_loading = false;
    }
}
</script>

<style lang="scss" scoped>
    .account-details {
        height: 47vh;
        overflow: scroll;
        &__initiate-collection {
            @extend .account-details;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .el-table thead {
            font-size: 10px !important;
        }
    }
    
    .position-center {
        left: 50%; 
        top: 50%; 
        transform: translate(-50%, -50%);
        @apply fixed;
    }    

    .cost-breakdown-chart {
        .el-card {
            width: 98%;
        }
    }

    .cost-filter {
        &__header {
            font-size: 14px;
            color: rgba(61, 57, 57, 0.781);
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
        vertical-align: middle;
        width: 100%;
    }

    .truncate {
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

    .el-dropdown-menu__item {
        background: none !important;
        :hover {
            @extend .el-dropdown-menu__item;
        }
    }
</style>