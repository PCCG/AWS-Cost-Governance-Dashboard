<template>
    <div>
        <GChart
            style="min-height: inherit"
            type="BarChart"
            :data="chartData"
            :options="chartOptions"
        />
    </div>
</template>

<script>
//components
import { GChart } from 'vue-google-charts';
import moment from 'moment';

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
                isStacked: true,
                animation: {
                    duration: 1000,
                    easing: "out",
                    startup: true
                },
                vAxis: { 
                    textStyle : {
                        fontSize: 12,
                        fontName: 'Montserrat'
                    }
                },
                chartArea: {
                    width: '80%', 
                    height: '60%',
                    top: '60'
                },
                colors: ["#ffd77a", "#4c94ff", "#ff6488", "#57b84c", "#ff5f59", "#ac3fff"],
                legend: {
                    position: 'top',
                    labeledValueText: 'both',
                    textStyle: {
                        fontName: 'Montserrat',
                        fontSize: 12
                    }
                }
            }
        },
        chartData() {
            if(this.billingPeriod) {
                const billingPeriodStartDate = new Date(this.billingPeriod[0]).toLocaleDateString();
                const billingPeriodEndDate = new Date(this.billingPeriod[1]).toLocaleDateString();
                let billingPeriodObjects = [];
                for(let report of this.costReport) {
                    const billingPeriod = Object.keys(report)[0];
                    const reportStartDate = billingPeriod.split('-')[0];
                    if(reportStartDate.includes(billingPeriodStartDate) || billingPeriodObjects.length) {
                        let billingPeriodObject = null;
                        if(this.groupBy === GROUP_BY_SERVICE_KEY) {
                            billingPeriodObject = report[billingPeriod].service;
                        } else if(this.groupBy === GROUP_BY_REGION_KEY) {
                            billingPeriodObject = report[billingPeriod].region;
                        } else {
                            billingPeriodObject = report[billingPeriod].account;
                        }
                        billingPeriodObjects.push({...billingPeriodObject, month: moment(reportStartDate).format('MMM YYYY')});
                    }
                    if(billingPeriod.split('-')[1].includes(billingPeriodEndDate)) {
                        break;
                    }
                }
                let groupByItemValues = [
                    ['Month']
                ];
                billingPeriodObjects.forEach(billingPeriodObject => {
                    let groupByItemValue = [];
                    groupByItemValue.push(billingPeriodObject.month);
                    delete billingPeriodObject.month;
                    for(let service in billingPeriodObject) {
                        if(!groupByItemValues[0].includes(service)) {
                            groupByItemValues[0].push(service);
                            groupByItemValue[groupByItemValues[0].length - 1] = billingPeriodObject[service][this.costType];
                        } else {
                            const service_index = groupByItemValues[0].findIndex(existing_service => existing_service === service);
                            groupByItemValue[service_index] = billingPeriodObject[service][this.costType];
                        }
                    }
                    groupByItemValues.push(groupByItemValue);
                });
                groupByItemValues = groupByItemValues.map(groupByItemValue => {
                    const totalNumberOfServices = groupByItemValues[0].length;
                    const numberOfServicesInArray = groupByItemValue.length;
                    if(numberOfServicesInArray !== totalNumberOfServices) {
                        return [...groupByItemValue, ...new Array(totalNumberOfServices - numberOfServicesInArray)];
                    }
                    return groupByItemValue;
                });
                return groupByItemValues;
            }
            return [];
        }
    }
}
</script>