import axios from 'axios'

const costExplorerClient = axios.create({
  baseURL: process.env.VUE_APP_COST_BASE_URL,
  headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
  }
})

module.exports = {
  fetchSpendAggregationOptions: async () => {
    const spendAggregationOptions = await costExplorerClient.get('/spendAggregationOptions');
    return spendAggregationOptions;
  },
  fetchAwsCostExplorerFilters: async () => {
    const awsCostExplorerFilters = await costExplorerClient.get('/serviceFilters');
    return awsCostExplorerFilters;
  }
}
