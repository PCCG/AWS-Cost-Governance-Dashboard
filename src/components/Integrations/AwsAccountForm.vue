<template>
  <el-form :rules="defaultAwsAccountFormRules" :ref="formName" :model="defaultAwsAccountFormModel">
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
          {required: true, message: 'Please specify the Access Key ID', trigger: 'blur'}
        ],
        secretAccessKey: [
          {required: true, message: 'Please specify the Secret Access Key', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
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
