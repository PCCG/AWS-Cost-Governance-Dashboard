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
    let gcpAccountToBeIntegrated = {};
    for (let step of Object.values(accountIntegrationSteps)) {
      gcpAccountToBeIntegrated = Object.assign(gcpAccountToBeIntegrated, step.getFormData());
    }
    accountsClient.integrateAccount(gcpAccountToBeIntegrated);
  }
}
