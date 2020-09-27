export default {
  INTEGRATED_ACCOUNTS (state, listOfAccounts) {
    const listOfAccountsMap = {};
    listOfAccounts.forEach(account => {
      listOfAccountsMap[account._id] = account;
    });
    state.integratedAccountsMap = listOfAccountsMap;
    state.integratedAccounts = listOfAccounts;
  }
}
