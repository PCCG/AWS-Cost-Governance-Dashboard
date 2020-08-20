import accountsClient from '@/rest/gcp/accountsClient'

export default {
  DELETE_GCP_ACCOUNT: async (context, aliasName) => {
    await accountsClient.deleteAccount(aliasName);
    context.dispatch('FETCH_GCP_ACCOUNTS');
  },
  FETCH_GCP_ACCOUNTS: async (context) => {
    const gcpAccounts = await accountsClient.fetchAccounts();
    context.commit('INTEGRATED_ACCOUNTS', gcpAccounts);
  },
  INTEGRATE_GCP_ACCOUNT: async (context, accountIntegrationSteps) => {
    const gcpAccount = accountIntegrationSteps[1].getFormData();
    accountsClient.integrateAccount(gcpAccount);
  }
}
