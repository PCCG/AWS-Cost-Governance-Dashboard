<template>
  <confirmation-dialog
    :visible.sync="showConfirmationDialog"
    type="warning"
    title="Delete Account"
    okButtonText="Cancel"
    >
    <template v-slot:default>
      All data associated with the account will be deleted when you delete the account. Do you still wish to proceed?
    </template>
    <template v-slot:footer>
      <el-button type="primary" @click="deleteIntegratedAccount">OK</el-button>
    </template>
  </confirmation-dialog>
</template>

<script>
import confirmationDialog from '@/components/common/dialog'

import { mapActions } from 'vuex'

export default {
  props: {
    accountId: {
      type: String,
      required: true,
      default: ''
    },
    showDeleteDialog: {
      type: Boolean,
      default: false
    }
  },
  components: {
    confirmationDialog
  },
  computed: {
    showConfirmationDialog: {
      get () {
        const vm = this;
        return vm.showDeleteDialog;
      },
      set () {
        const vm = this;
        vm.closeConfirmationDialog();
      }
    }
  },
  methods: {
    ...mapActions('gcpIntegrations', [
      'DELETE_GCP_ACCOUNT'
    ]),
    deleteIntegratedAccount: async function () {
      const vm = this;
      try {
        await vm.DELETE_GCP_ACCOUNT(vm.accountId);
        vm.closeConfirmationDialog();
      } catch (e) {
        window.console.log(e.message);
      }
    },
    closeConfirmationDialog () {
      const vm = this;
      vm.$emit('update:showDeleteDialog', false);
    }
  }
}
</script>
