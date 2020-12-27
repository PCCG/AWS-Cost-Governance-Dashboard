import axios from "axios";

const aggregationClient = axios.create({
	baseURL: process.env.VUE_APP_GCP_AGGREGATION_BASE_URL,
	headers: {
		"Content-Type": "application/json",
		"Accept": "application/json",
	},
});

async function startAggregation(accountId) {
	await aggregationClient.post("/start-collection", { accountId });
}

async function fetchCollectionStatuses() {}

async function fetchProcessedData() {}

export default {
	startAggregation,
	fetchCollectionStatuses,
	fetchProcessedData,
};
