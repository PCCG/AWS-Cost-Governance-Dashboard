<template>
  <el-form status-icon :rules="defaultAwsAccountFormRules" :ref="formName" :model="defaultAwsAccountFormModel">
    <el-form-item label="Access Key ID" prop="accessKeyId">
      <el-input v-model="defaultAwsAccountFormModel.accessKeyId" name="Access Key ID"></el-input>
    </el-form-item>
    <el-form-item label="Secret Access Key" prop="secretAccessKey">
      <el-input type="password" v-model="defaultAwsAccountFormModel.secretAccessKey" name="Secret Access Key"></el-input>
    </el-form-item>
    <slot name="fields" :awsAccountFormModel="defaultAwsAccountFormModel"></slot>
    <slot name="submit" :validateForm="validateFormData" :loading="loading" :awsAccountFormModel="defaultAwsAccountFormModel">
    </slot>
  </el-form>
</template>

<script>

const FORM_PROCESSED_CUSTOM_EVENT = 'form-processed';
const AWS_ACCESS_KEY_ID_REGEX=/(?<![A-Z0-9])[A-Z0-9]{20}(?![A-Z0-9])/;
const AWS_SECRET_ACCESS_KEY_REGEX=/(?<![A-Za-z0-9/+=])[A-Za-z0-9/+=]{40}(?![A-Za-z0-9/+=])/;

export default {
  data () {
    return {
      formName: 'awsAccountForm',
      loading: false,
      defaultAwsAccountFormModel: {
        accessKeyId: '',
        secretAccessKey: '',
      },
      defaultAwsAccountFormRules: {
        accessKeyId: [
          {required: true, validator: this.validateAwsAccessKeyId, trigger: 'blur'}
        ],
        secretAccessKey: [
          {required: true, validator: this.validateSecretAccessKey, trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    validateAwsAccessKeyId (rule, value, callback) {
      if(AWS_ACCESS_KEY_ID_REGEX.test(value)) {
        callback();
      } else {
        callback(new Error("Please specify a valid Access Key ID"));
      }
    },
    validateSecretAccessKey (rule, value, callback) {
      if(AWS_SECRET_ACCESS_KEY_REGEX.test(value)) {
        callback();
      } else {
        callback(new Error("Please specify a valid Secret Access Key"));
      }
    },
    validateFormData (processCb) {
      const vm = this;
      vm.loading = true;
      vm.$refs[vm.formName].validate( async (valid) => {
        if (valid) {
          try {
            await processCb();
            vm.loading = false;
            vm.resetForm();
            vm.$emit(FORM_PROCESSED_CUSTOM_EVENT);
          } catch (e) {
            window.console.log(e.stack);
          }
        } else {
          vm.loading = false;
          return false;
        }
      });
    },
    resetForm() {
      const vm = this;
      this.$refs[vm.formName].resetFields();
    }
  }
}
</script>

<style scoped>

</style>
