import axios from 'axios';

const aggregationClient = axios.create({
  baseURL: process.env.VUE_APP_AWS_AGGREGATION_BASE_URL,
  headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
  }
});

async function startAggregation (accountId) {
    await aggregationClient.post('/startAggregation', {accountId});
}

export default {
  startAggregation
}
