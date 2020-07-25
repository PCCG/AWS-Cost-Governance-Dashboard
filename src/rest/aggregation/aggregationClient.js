import axios from 'axios';

const aggregationClient = axios.create({
  baseURL: process.env.VUE_APP_AGGREGATION_BASE_URL,
  headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
  }
});

async function startAggregation (iamUserCredentials) {
    await aggregationClient.post('/startAggregation', iamUserCredentials);
}

export default {
  startAggregation
}
