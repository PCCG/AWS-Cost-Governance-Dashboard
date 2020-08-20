import axios from 'axios'

const accountsClient = axios.create({
  baseURL: process.env.VUE_APP_GCP_ACCOUNTS_BASE_URL,
  headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
  }
});

export default {
  fetchAccounts: async () => {
    const gcpAccounts = await accountsClient.get('/fetch-accounts');
    return gcpAccounts.data;
  },
  deleteAccount: async (accountId) => {
    await accountsClient.post('/delete-account', {accountId});
  },
  integrateAccount: async (gcpAccount) => {
    await accountsClient.post('/create-account', {credentials: gcpAccount});
  }
}
