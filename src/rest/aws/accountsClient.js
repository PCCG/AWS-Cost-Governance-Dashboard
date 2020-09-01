import axios from 'axios'

const accountsClient = axios.create({
  baseURL: process.env.VUE_APP_ES_AWS_ACCOUNTS_BASE_URL,
  headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
  }
})

export default {
  fetchAwsAccounts: async () => {
    const accounts = await accountsClient.get('/getAccounts');
    return accounts.data;
  },
  postAwsAccount: async (awsAccount) => {
    await accountsClient.post('/postAccount', {account: awsAccount});
  },
  deleteAwsAccount: async (accountId) => {
    await accountsClient.post('/deleteAccount', {accountId});
  }
}
