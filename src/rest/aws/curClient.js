import axios from 'axios';

const curClient = axios.create({
  baseURL: process.env.VUE_APP_AWS_CUR_BASE_URL,
  headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
  }
})

async function fetchListOfReportsConfigured (iamUserCredentials) {
  const listOfReportsConfigured = await curClient.post('/listReports', iamUserCredentials);
  return listOfReportsConfigured;
}

export default {
  fetchListOfReportsConfigured
}
