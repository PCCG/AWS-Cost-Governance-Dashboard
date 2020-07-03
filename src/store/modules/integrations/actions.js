import accountsClient from '@/rest/aws/accountsClient'

export default {
  FETCH_AWS_ACCOUNTS: async (context) => {
    const integratedAccounts = await accountsClient.fetchAwsAccounts();
    context.commit('INTEGRATED_ACCOUNTS', integratedAccounts.data);
  },
  INTEGRATE_AWS_ACCOUNT: async (context, awsAccount) => {
    await accountsClient.postAwsAccount(awsAccount);
    setTimeout(() => {context.dispatch('FETCH_AWS_ACCOUNTS')}, 1000);
  }
}
