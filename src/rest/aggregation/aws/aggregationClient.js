import axios from "axios";

const aggregationClient = axios.create({
	baseURL: process.env.VUE_APP_AWS_AGGREGATION_BASE_URL,
	headers: {
		"Content-Type": "application/json",
		"Accept": "application/json",
	},
});

async function startAggregation(accountId) {
	await aggregationClient.post("/start-collection", { accountId });
}

async function fetchProcessedData(accountId) {
	const processedData = await aggregationClient.get(`/processed-data?accountId=${accountId}`);
	return processedData.data;
}

export default {
	startAggregation,
	fetchProcessedData,
};
