<template>
    <div>
        <GChart
            style="min-height: inherit"
            type="PieChart"
            :data="chartData"
            :options="chartOptions"
        />
    </div>
</template>

<script>
//components
import { GChart } from 'vue-google-charts';

// const GROUP_BY_ACCOUNT_KEY = 'Account';
const GROUP_BY_REGION_KEY = 'Region';
const GROUP_BY_SERVICE_KEY = 'Service';

export default {
    data: () => ({

    }),
    props: {
        costReport: {
            type: Array,
            required: true
        },
        billingPeriod: {
            required: true
        },
        groupBy: {
            required: true
        },
        costType: {
            required: true
        }
    },
    components: {
        GChart
    },
    computed: {
        chartOptions() {
            return {
                title: `Cost Breakdown By ${this.groupBy}`,
                titleTextStyle : {
                    fontSize: 16,
                    fontName: 'Montserrat',
                    bold: true
                },
                tooltip: {
                    textStyle : {
                        fontSize: 12,
                        fontName: 'Montserrat'
                    }
                },
                pieHole: 0.4,
                animation: {
                    duration: 1000,
                    easing: "out",
                    startup: true
                },
                chartArea: {
                    width: '95%', 
                    height: '70%',
                    top: '47'
                },
                colors: ["#ffd77a", "#4c94ff", "#ff6488", "#57b84c", "#ff5f59", "#ac3fff"],
                legend: {
                position:'labeled',
                labeledValueText: 'both',
                textStyle: {
                    fontName: 'Montserrat',
                    fontSize: 12
                }
                },
                sliceVisibilityThreshold: 0,
                pieSliceText: "none"
            }
        },
        chartData() {
            if(this.billingPeriod) {
                const billingPeriodStartDate = moment(this.billingPeriod[0]).format("MM/DD/YYYY");
                const billingPeriodEndDate = moment(this.billingPeriod[1]).format("MM/DD/YYYY");
                let billingPeriodObjects = [];
                for(let report of this.costReport) {
                    const billingPeriod = Object.keys(report)[0];
                    if(billingPeriod.split('-')[0].includes(billingPeriodStartDate) || billingPeriodObjects.length) {
                        let billingPeriodObject = null;
                        if(this.groupBy === GROUP_BY_SERVICE_KEY) {
                            billingPeriodObject = report[billingPeriod].service;
                        } else if(this.groupBy === GROUP_BY_REGION_KEY) {
                            billingPeriodObject = report[billingPeriod].region;
                        } else {
                            billingPeriodObject = report[billingPeriod].account;
                        }
                        billingPeriodObjects.push(billingPeriodObject);
                    }
                    if(billingPeriod.split('-')[1].includes(billingPeriodEndDate)) {
                        break;
                    }
                }
                let groupByItemValuesMap = {};
                billingPeriodObjects.forEach(billingPeriodObject => {
                    Object.keys(billingPeriodObject).forEach(groupByItemValue => {
                        groupByItemValuesMap[groupByItemValue] = groupByItemValuesMap[groupByItemValue] ? [groupByItemValue, groupByItemValuesMap[groupByItemValue][1]+=billingPeriodObject[groupByItemValue][this.costType]] : [groupByItemValue, billingPeriodObject[groupByItemValue][this.costType]];
                    });
                });
                return [[this.groupBy, 'Cost'], ...Object.values(groupByItemValuesMap)];
            }
            return [];
        }
    }
}
</script>