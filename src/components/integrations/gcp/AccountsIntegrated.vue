<template>
  <el-card class="box-card">
    <el-table
      :data="integratedAccounts"
      :empty-text="ACCOUNTS_NOT_SPECIFIED_TEXT"
      style="width: 100%">
      <el-table-column type="expand">
        <template v-slot="props">
          <v-container>
            <v-layout row wrap>
              <v-flex xs6>
                <header>AGGREGATION STATUS</header>
              </v-flex>
              <v-flex xs6 class="text-center jumbotron">
                <i class="el-icon-video-play clickable-icon" title="Start Aggregation" @click="START_AGGREGATION({accessKeyId: props.row.accessKeyId, secretAccessKey: props.row.secretAccessKey})" role="button"></i>
                <i class="el-icon-edit clickable-icon" title="Edit Integration" role="button"></i>
                <i class="el-icon-delete clickable-icon" title="Delete Integration" @click="deleteAccount(props.row._id)" role="button"></i>
              </v-flex>
            </v-layout>
          </v-container>
        </template>
      </el-table-column>
      <el-table-column
        prop="aliasName"
        label="Alias Name">
      </el-table-column>
      <el-table-column
        prop="cloudStorageBucket"
        label="Cloud Storage Bucket">
      </el-table-column>
      <el-table-column
        prop="billingReportPrefix"
        label="Report Prefix">
      </el-table-column>
      <el-table-column
        prop="pollingInterval"
        label="Polling Interval (in hours)">
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import { mapActions } from 'vuex';

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
  },
  methods: {
    ...mapActions('gcpIntegrations', [
      'START_AGGREGATION',
      'DELETE_GCP_ACCOUNT'
    ]),
    deleteAccount (accountId) {
      const vm = this;
      vm.$confirm('This will permanently delete all the records associated with the account. Continue?', 'WARNING', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        vm.DELETE_GCP_ACCOUNT(accountId);
      })
    }
  }
}
</script>

<style scoped>
.clickable-icon {
  font-size: 20px !important;
}
</style>
