<template>
  <el-form status-icon :rules="gcpAccountFormRules" :ref="formName" :model="gcpAccountFormModel">
    <el-form-item label="Alias Name" prop="aliasName">
      <el-input v-model="gcpAccountFormModel.aliasName" name="Alias Name"></el-input>
    </el-form-item>
    <el-form-item label="Bucket Name" prop="cloudStorageBucket">
      <el-input v-model="gcpAccountFormModel.cloudStorageBucket" name="Bucket Name"></el-input>
    </el-form-item>
    <el-form-item label="Report Prefix" prop="billingReportPrefix">
      <el-input v-model="gcpAccountFormModel.billingReportPrefix" name="Report Prefix"></el-input>
    </el-form-item>
    <el-form-item>
      <upload-button :processingfunction="parseServiceAccountKeyFile" @processing-complete="addServiceAccountKeyFileContentToFormModel" value="Upload Service Account Key File" accept="application/JSON"/>
    </el-form-item>
    <slot name="submit" :validateForm="validateFormData" :loading="loading" :gcpAccountFormModel="gcpAccountFormModel"></slot>
  </el-form>
</template>

<script>
import uploadButton from '@/components/common/uploadButton'

export default {
  // data: () => ({}) - Do not make use of this syntax here... We're referring to "this" inside this block.
  // "this" does not point to an instance of Vue when making use of the arrow syntax!!!
  data () {
    return {
      formName: 'gcpAccountForm',
      loading: false,
      gcpAccountFormModel: {
        aliasName: '',
        cloudStorageBucket: '',
        billingReportPrefix: '',
        serviceAccountKeyFile: null
      },
      gcpAccountFormRules: {
        aliasName: [
          {required: true, message: 'Please specify an alias', trigger: 'blur'}
        ],
        cloudStorageBucket: [
          {required: true, message: 'Please specify the name of the bucket', trigger: 'blur'}
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
          try {
            resolve(JSON.parse(serviceAccountKeyFileReader.result));
          } catch (e) {
            reject(new Error('Unable to parse the provided service account key file'))
          }
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
            if (!vm.gcpAccountFormModel.serviceAccountKeyFile) {
              reject(new Error("Please upload the service account key file"));
            } else {
              vm.loading = false;
              resolve(vm.gcpAccountFormModel);
            }
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
