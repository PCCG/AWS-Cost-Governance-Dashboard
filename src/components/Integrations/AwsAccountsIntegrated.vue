<template>
  <el-table
    :data="integratedAccounts"
    :empty-text="ACCOUNTS_NOT_SPECIFIED_TEXT"
    style="width: 100%">
    <el-table-column
      prop="accessKeyId"
      label="Access Key ID">
    </el-table-column>
    <el-table-column
      prop="awsService"
      label="AWS Service">
    </el-table-column>
    <el-table-column
      prop="pollingInterval"
      label="Polling Interval (in hours)">
    </el-table-column>
    <el-table-column
      prop="budgetsSpecified"
      label="Budgets Specified">
    </el-table-column>
  </el-table>
</template>

<script>
const ACCOUNTS_NOT_SPECIFIED_TEXT = 'No integrations have been specified';

export default {
  data () {
    return {
      ACCOUNTS_NOT_SPECIFIED_TEXT
    }
  },
  props: {
    integratedAccounts: {
      type: Array
    }
  }
}
</script>

<style scoped>

</style>
