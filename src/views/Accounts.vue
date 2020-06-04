<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12 sm5>
        <aws-account-form></aws-account-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import awsAccountForm from '../components/Accounts/AwsAccountForm'

export default {
  components: {
    awsAccountForm
  }
}
</script>

<style scoped>

</style>
