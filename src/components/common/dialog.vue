<template>
  <el-dialog
    :visible="dialogVisible"
    :close-on-click-modal="false"
    @close="close"
    width="40%">
    <template v-slot:title>
      <header class="card-title">
        <i :class="dialogType" class="el-message-box__status card-title" style="padding-right: 3%; vertical-align: text-top"></i>
        {{title}}
      </header>
    </template>
    <template v-slot:default>
      <span style="word-break: keep-all !important; text-align: justify; font-size: 14px;">
        <slot/>
      </span>
    </template>
    <template v-slot:footer>
      <slot name="footer"></slot>
      <el-button class="primary-color" @click="emitDialogCloseEvent()">{{cancelButtonText}}</el-button>
    </template>
  </el-dialog>
</template>

<script>
const DIALOG_CLOSE_EVENT = 'update:visible';

export default {
  props: {
    type: {
      type: String,
      required: true
    },
    visible: {
      type: Boolean,
      required: true,
      default: false
    },
    cancelButtonText: {
      type: String,
      default: 'Cancel'
    },
    title: {
      type: String,
      required: true,
      default: 'Title'
    }
  },
  methods: {
    emitDialogCloseEvent () {
      const vm = this;
      vm.$emit(DIALOG_CLOSE_EVENT, false);
    },
    close () {
      const vm = this;
      vm.$emit('close');
      vm.emitDialogCloseEvent();
    }
  },
  computed: {
    dialogVisible: {
      get () {
        const vm = this;
        return vm.visible;
      },
      set () {
        const vm = this;
        vm.emitDialogCloseEvent();
      }
    },
    dialogType () {
      const vm = this;
      return `el-icon-${vm.type}`
    }
  }
}
</script>

<style scoped>
.el-message-box__status {
  position: static !important;
  transform: translate(0) !important;
}
</style>
