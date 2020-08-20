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
  deleteAccount: async (aliasName) => {
    await accountsClient.delete('/delete-account', {aliasName});
  },
  integrateAccount: async (gcpAccount) => {
    await accountsClient.post('/create-account', {credentials: gcpAccount});
  }
}
