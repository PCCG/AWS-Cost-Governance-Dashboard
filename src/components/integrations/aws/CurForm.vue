<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12>
        <el-table
          v-loading="tableLoading"
          ref="singleTable"
          :data="curSetupAgainstAccount"
          highlight-current-row
          @current-change="setSelection"
          :empty-text="CUR_NOT_SETUP_IN_ACCOUNT"
          style="width: 100%;">
          <el-table-column
            prop="reportName"
            label="Report Name">
          </el-table-column>
          <el-table-column
            prop="s3Bucket"
            label="S3 Bucket">
          </el-table-column>
          <el-table-column
            prop="reportPrefix"
            label="Report Prefix">
          </el-table-column>
        </el-table>
        <br/>
        <el-alert
          v-show="validationFailed"
          title="Please choose a Cost & Usage Report"
          type="error"
          @close="validationFailed = false"
          show-icon>
        </el-alert>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex';

const CUR_NOT_SETUP_IN_ACCOUNT = "No reports found in your account";

export default {
  data () {
    return {
      CUR_NOT_SETUP_IN_ACCOUNT,
      curSetupAgainstAccount: null,
      specifiedCurMetadata: null,
      tableLoading: false,
      validationFailed: false
    }
  },
  props: {
    awsAccount: {
      required: true
    },
    integrationAccountStep: {
      type: Object,
      required: true
    }
  },
  methods: {
    setSelection (CurMetadata) {
      const vm = this;
      vm.specifiedCurMetadata = CurMetadata
    },
    ...mapActions('integrations', [
      'FETCH_CUR_ASSOCIATED_WITH_ACCOUNT'
    ]),
    validateFormData: async function () {
      const vm = this;
      const specifiedCurMetadata = vm.specifiedCurMetadata;
      if (specifiedCurMetadata) {
        return specifiedCurMetadata;
      } else {
        vm.validationFailed = true;
        throw new Error("Please choose a report");
      }
    }
  },
  mounted: async function () {
    const vm = this;
    vm.integrationAccountStep.setFunctionToExecuteOnNext(vm.validateFormData);

    const awsAccount = vm.awsAccount;
    const accessKeyId = awsAccount.accessKeyId;
    const secretAccessKey = awsAccount.secretAccessKey;
    vm.tableLoading = true;
    vm.curSetupAgainstAccount = await vm.FETCH_CUR_ASSOCIATED_WITH_ACCOUNT({accessKeyId, secretAccessKey});
    vm.tableLoading = false;
  }
}
</script>

<style scoped>

</style>
