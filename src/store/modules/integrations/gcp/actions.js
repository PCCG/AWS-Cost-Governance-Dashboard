import accountsClient from "@/rest/gcp/accountsClient";
import gcpAggregationClient from "@/rest/aggregation/gcp/aggregationClient";

export default {
	DELETE_GCP_ACCOUNT: async (context, aliasName) => {
		await accountsClient.deleteAccount(aliasName);
		context.dispatch("FETCH_GCP_ACCOUNTS");
	},
	FETCH_GCP_ACCOUNTS: async (context) => {
		const gcpAccounts = await accountsClient.fetchAccounts();
		context.commit("INTEGRATED_ACCOUNTS", gcpAccounts);
	},
	INTEGRATE_GCP_ACCOUNT: async (context, accountIntegrationSteps) => {
		let gcpAccountToBeIntegrated = {};
		for (let step of Object.values(accountIntegrationSteps)) {
			gcpAccountToBeIntegrated = Object.assign(gcpAccountToBeIntegrated, step.getFormData());
		}
		await accountsClient.integrateAccount(gcpAccountToBeIntegrated);
		context.dispatch("FETCH_GCP_ACCOUNTS");
	},
	START_GCP_ACCOUNT_AGGREGATION: async (context, accountId) => {
		await gcpAggregationClient.startAggregation(accountId);
	},
};
