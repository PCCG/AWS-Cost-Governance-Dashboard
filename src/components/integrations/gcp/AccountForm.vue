<template>
  <el-form status-icon :rules="gcpAccountFormRules" :ref="formName" :model="gcpAccountFormModel">
    <el-form-item label="Alias Name" prop="aliasName">
      <el-input v-model="gcpAccountFormModel.aliasName" name="Alias Name"></el-input>
    </el-form-item>
    <el-form-item label="BigQuery Dataset ID" prop="bigQueryDataset">
      <el-input v-model="gcpAccountFormModel.bigQueryDataset" name="BigQuery Dataset ID"></el-input>
    </el-form-item>
    <el-form-item label="Polling Interval (in hours)" prop="pollingInterval">
      <el-input-number controls-position="right" name="Polling interval" :min="1" v-model="gcpAccountFormModel.pollingInterval"></el-input-number>
    </el-form-item>
    <el-form-item>
      <upload-button :processingfunction="parseServiceAccountKeyFile" value="Upload Service Account Key File" accept="application/JSON"/>
    </el-form-item>
    <slot name="submit" :validateForm="validateFormData" :loading="loading" :gcpAccountFormModel="gcpAccountFormModel"></slot>
  </el-form>
</template>

<script>
import uploadButton from '@/components/common/uploadButton'

import camelCase from 'lodash/camelCase';

export default {
  // data: () => ({}) - Do not make use of this syntax here... We're referring to "this" inside this block.
  // "this" does not point to an instance of Vue when making use of the arrow syntax!!!
  data () {
    return {
      formName: 'gcpAccountForm',
      loading: false,
      gcpAccountFormModel: {
        aliasName: '',
        privateKey: '',
        clientEmail: '',
        bigQueryDataset: '',
        pollingInterval: null
      },
      gcpAccountFormRules: {
        aliasName: [
          {required: true, message: 'Please specify an alias', trigger: 'blur'}
        ],
        bigQueryDataset: [
          {required: true, message: 'Please specify the BigQuery Dataset ID', trigger: 'blur'}
        ]
      }
    }
  },
  props: {
    integrationAccountStep: {
      type: Object,
      required: true
    }
  },
  methods: {
    parseServiceAccountKeyFile (serviceAccountKeyFile) {
      return new Promise((resolve, reject) => {
        const serviceAccountKeyFileReader = new FileReader();
        serviceAccountKeyFileReader.onload = () => {
          const vm = this;
          const serviceAccountKeyFileRequiredFields = ["client_email", "private_key", "project_id"];
          const serviceAccountCredentials = JSON.parse(serviceAccountKeyFileReader.result);
          for(let field of serviceAccountKeyFileRequiredFields) {
            const fieldValue = serviceAccountCredentials[field];
            if(fieldValue) {
              vm.gcpAccountFormModel[camelCase(field)] = fieldValue;
            } else {
              reject(new Error("Invalid Service Account key file"));
            }
          }
          resolve();
        }
        serviceAccountKeyFileReader.readAsText(serviceAccountKeyFile);
      })
    },
    addServiceAccountKeyFileContentToFormModel (serviceAccountKeyFileContent) {
      const vm = this;
      vm.gcpAccountFormModel.serviceAccountKeyFile = serviceAccountKeyFileContent;
    },
    validateFormData: function () {
      const vm = this;
      return new Promise((resolve, reject) => {
        vm.loading = true;
        vm.$refs[vm.formName].validate((valid) => {
          if (valid) {
            vm.loading = false;
            resolve(vm.gcpAccountFormModel);
          } else {
            vm.loading = false;
            reject(new Error("Please specify valid values against the fields"));
          }
        });
      })
    },
    resetForm() {
      const vm = this;
      this.$refs[vm.formName].resetFields();
    }
  },
  components: {
    uploadButton
  },
  mounted () {
    const vm = this;
    vm.integrationAccountStep.setFunctionToExecuteOnNext(vm.validateFormData);
  }
}

</script>

<style scoped>
</style>
