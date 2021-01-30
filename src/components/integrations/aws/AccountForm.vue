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
const AWS_ACCESS_KEY_ID_REGEX=/(?<![A-Z0-9])[A-Z0-9]{20}(?![A-Z0-9])/;
const AWS_SECRET_ACCESS_KEY_REGEX=/(?<![A-Za-z0-9/+=])[A-Za-z0-9/+=]{40}(?![A-Za-z0-9/+=])/;

export default {
  // data: () => ({}) - Do not make use of this syntax here... We're referring to "this" inside this block.
  // "this" does not point to an instance of Vue when making use of the arrow syntax!!!
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
  props: {
    integrationAccountStep: {
      type: Object,
      required: true
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
    validateFormData: function () {
      const vm = this;
      return new Promise((resolve, reject) => {
        vm.loading = true;
        vm.$refs[vm.formName].validate((valid) => {
          if (valid) {
            vm.loading = false;
            resolve(vm.defaultAwsAccountFormModel);
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
  mounted () {
    const vm = this;
    vm.integrationAccountStep.setFunctionToExecuteOnNext(vm.validateFormData);
  }
}
</script>

<style lang="scss" scoped>
  .el-form {
    width: 100%;
  }
</style>
