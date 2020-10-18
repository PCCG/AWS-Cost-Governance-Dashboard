import accountsClient from '@/rest/aws/accountsClient'
import awsAggregationClient from '@/rest/aggregation/aws/aggregationClient'
import curClient from '@/rest/aws/curClient'

import Cur from '@/models/aws/curModel'

export default {
  FETCH_AWS_ACCOUNTS: async (context) => {
    const integratedAccounts = await accountsClient.fetchAwsAccounts();
    context.commit('INTEGRATED_ACCOUNTS', integratedAccounts);
  },
  INTEGRATE_AWS_ACCOUNT: async (context, accountIntegrationSteps) => {
    let awsAccountToBeIntegrated = {};
    for (let step of Object.values(accountIntegrationSteps)) {
      awsAccountToBeIntegrated = Object.assign(awsAccountToBeIntegrated, step.getFormData());
    }
    await accountsClient.postAwsAccount(awsAccountToBeIntegrated);
    context.dispatch('FETCH_AWS_ACCOUNTS');
  },
  START_AWS_ACCOUNT_AGGREGATION: async (context, iamUserCredentials) => {
    await awsAggregationClient.startAggregation(iamUserCredentials);
  },
  FETCH_COLLECTION_STATUS: async (context, accountId) => {
    return await awsAggregationClient.fetchCollectionStatuses(accountId);
  },
  DELETE_AWS_ACCOUNT: async (context, accountId) => {
    await accountsClient.deleteAwsAccount(accountId);
    context.dispatch('FETCH_AWS_ACCOUNTS');
  },
  FETCH_CUR_ASSOCIATED_WITH_ACCOUNT: async (context, iamUserCredentials) => {
    let listOfConfiguredReports = await curClient.fetchListOfReportsConfigured(iamUserCredentials);
    listOfConfiguredReports = listOfConfiguredReports.data.map(report => new Cur(report));
    return listOfConfiguredReports;
  }
}
