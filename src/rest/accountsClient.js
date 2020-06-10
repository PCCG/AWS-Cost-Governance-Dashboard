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
    return accounts;
  },
  postAwsAccount: async (awsAccount) => {
    await accountsClient.post('/postAccount', {credentials: awsAccount});
  }
}
