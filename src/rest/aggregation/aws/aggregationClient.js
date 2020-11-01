import axios from 'axios';

const aggregationClient = axios.create({
  baseURL: process.env.VUE_APP_AWS_AGGREGATION_BASE_URL,
  headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
  }
});

async function startAggregation (accountId) {
    await aggregationClient.post('/start-collection', {accountId});
}

async function fetchCollectionStatuses (accountId) {
  const statuses = await aggregationClient.get(`/collection-status/?accountId=${accountId}`);
  return statuses.data;
}

async function fetchProcessedData (accountId) {
  const processedData = await aggregationClient.get(`/processed-data?accountId=${accountId}`);
  return processedData.data;
}

export default {
  startAggregation,
  fetchCollectionStatuses,
  fetchProcessedData
}
