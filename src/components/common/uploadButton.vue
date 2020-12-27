<template>
  <div>
    <label class="full-width el-button is-plain primary-color" @click="clearInput">
      <i class="el-icon-upload2"></i> {{value}}
      <input :ref="fieldName" style="display: none" type="file" @change="handleSuccess" :accept="accept"/>
    </label>
    <el-alert
      style="margin-top: 1%;"
      v-if="fileName"
      :title="fileName"
      type="success"
      :closable="false"
      show-icon>
    </el-alert>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  data: () => ({
    fileName: null,
    fieldName: 'fileInput'
  }),
  props: {
    value: {
      default: "Choose a file",
      type: String
    },
    accept: {
      default: "*",
      type: String
    },
    processingfunction: {
      default: () => {},
      type: Function
    }
  },
  methods: {
    ...mapMutations([
      'SET_ERROR_MESSAGE'
    ]),
    handleSuccess: async function ($event) {
      const vm = this;
      vm.fileName = null; //The user uploaded a new file
      const uploadedFile = $event.target.files[0];
      try {
        await vm.processingfunction(uploadedFile);
        vm.fileName = uploadedFile.name; //Indicates that the file was processed successfully
      } catch (e) {
        vm.SET_ERROR_MESSAGE(e.message);
      }
      return;
    },
    clearInput () {
      const vm = this;
      vm.$refs[vm.fieldName].value = null;
    }
  }
}
</script>

<style scoped>

.full-width {
  width: 100% !important;
}

.el-alert {
  padding: 1px 2px;
}

</style>
