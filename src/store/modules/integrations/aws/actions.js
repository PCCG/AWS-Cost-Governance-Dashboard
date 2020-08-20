import accountsClient from '@/rest/aws/accountsClient'
import aggregationClient from '@/rest/aggregation/aggregationClient'
import curClient from '@/rest/aws/curClient'

import Cur from '@/models/aws/curModel'

export default {
  FETCH_AWS_ACCOUNTS: async (context) => {
    const integratedAccounts = await accountsClient.fetchAwsAccounts();
    context.commit('INTEGRATED_ACCOUNTS', integratedAccounts.data);
  },
  INTEGRATE_AWS_ACCOUNT: async (context, accountMetadata) => {
    await accountsClient.postAwsAccount(accountMetadata);
    setTimeout(() => {context.dispatch('FETCH_AWS_ACCOUNTS')}, 1000);
  },
  START_AGGREGATION: async (context, iamUserCredentials) => {
    await aggregationClient.startAggregation(iamUserCredentials);
  },
  DELETE_AWS_ACCOUNT: async (context, accessKeyId) => {
    await accountsClient.deleteAwsAccount(accessKeyId);
    setTimeout(() => {context.dispatch('FETCH_AWS_ACCOUNTS')}, 1000);
  },
  FETCH_CUR_ASSOCIATED_WITH_ACCOUNT: async (context, iamUserCredentials) => {
    let listOfConfiguredReports = await curClient.fetchListOfReportsConfigured(iamUserCredentials);
    listOfConfiguredReports = listOfConfiguredReports.data.map(report => new Cur(report));
    return listOfConfiguredReports;
  }
}
