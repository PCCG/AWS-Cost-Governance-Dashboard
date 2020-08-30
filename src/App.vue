<template>
  <v-app id="inspire">
    <div>
      <v-app-bar
        :color="primaryColor"
        app
        clipped-left
        dark
      >
        <v-app-bar-nav-icon @click.stop="minimizeDrawer = !minimizeDrawer"></v-app-bar-nav-icon>
        <v-toolbar-title>TORCH</v-toolbar-title>
        <v-toolbar-title class="divider"></v-toolbar-title>
        <v-toolbar-title style="font-size: 1.05rem;">{{currentRouteName}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon color="white" title="Help" @click="showHelpDialogForRoute(currentRouteName)"><v-icon small>mdi-help</v-icon></v-btn>
      </v-app-bar>
      <v-navigation-drawer
        app
        clipped
        permanent
        :mini-variant="minimizeDrawer"
      >
        <v-list nav expand>
          <v-list-item :color="primaryColor" link :key="route.name" v-for="route in navigationItems" :to="route.to" :title="route.name">
            <v-list-item-icon>
              <v-icon class="primary-color">{{route.icon}}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="subtitle-2 primary-color" style="font-family: 'Montserrat', sans-serif !important;">{{route.name}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <common-dialog
        :title="helpDialogTitle"
        type="info"
        :visible.sync="showHelpDialog"
        cancelButtonText="OK">
        <div v-html="helpDialogContent"></div>
      </common-dialog>
      <common-dialog
        :visible.sync="showErrorDialog"
        cancelButtonText="OK"
        type="error"
        title="An Error Occured"
        @close="SET_ERROR_MESSAGE('')">
        <template v-slot:default>
          {{errorMessage}}
        </template>
      </common-dialog>
      <v-content style="background: rgba(175, 180, 200, 0.1);">
        <router-view class="component-within-sfc" style="min-height: 81.8vh;"/>
      </v-content>
    </div>
  </v-app>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

import helpDialogMixin from '@/mixins/helpDialogMixin';

import commonDialog from '@/components/common/dialog'

export default {
  name: 'App',
  data () {
    return {
      minimizeDrawer: true,
      showErrorDialog: false,
      currentRouteTitle: '',
      primaryColor: '#235380',
      navigationItems: [
        {icon:"mdi-view-dashboard", name: "Dashboard", to: "/"},
        {icon: "mdi-cloud-check", name: "Actions", to: "/actions"},
        {icon: "mdi-cash-usd", name: "Budgets", to: "/budgets"},
        {icon:"mdi-cloud", name: "Integrations", to: "/integrations"}
      ]
    }
  },
  methods: {
    ...mapMutations([
      'SET_HELP_DIALOG_CONTENTS',
      'HELP_DIALOG_STATE',
      'SET_ERROR_MESSAGE'
    ]),
    redirectToTheDashboard () {
      const vm = this;
      vm.$router.push({name: 'Dashboard'})
    }
  },
  computed: {
    //mapState does not function properly with non-namespaced modules. By default, state
    //properties that are defined as part of non-namespaced modules are assumed to be a
    //part of a namespace. For more information, visit https://github.com/vuejs/vuex/issues/1592
    ...mapState([
      'helpDialogContent',
      'helpDialogTitle',
      'errorMessage'
    ]),
    showHelpDialog: {
      get () {
        const vm = this;
        return vm.$store.state.showHelpDialog;
      },
      set (showHelpDialog) {
        const vm = this;
        vm.HELP_DIALOG_STATE(showHelpDialog);
      }
    },
    currentRouteName () {
      const vm = this;
      const routeName = vm.$route.name;
      return routeName.toUpperCase();
    }
  },
  mixins: [
    helpDialogMixin
  ],
  components: {
    commonDialog
  },
  watch: {
    errorMessage (message) {
      const vm = this;
      if (message && message !== '') {
        vm.showErrorDialog = true;
      }
    }
  }
};
</script>

<style lang="scss">
$app-color--primary: #235380;

.v-application {
  font-family: 'Montserrat', sans-serif !important;
}

header {
  font-weight: 600 !important;
}

.primary-color {
  color: $app-color--primary;
}

.divider {
  margin: 1%;
  width: 2px;
  height: 50%;
  border-left: 1px solid white;
}

.clickable-icon {
  cursor: pointer;
  font-size: 25px !important;
  margin: 2%;
}

.clickable-icon:hover {
  opacity: 0.6;
}

.clickable {
  cursor: pointer;
}

.component-within-sfc {
  width: 95% !important;
  margin: 2% !important;
}

.el-step__description {
  word-break: keep-all !important;
}

.el-dialog__body {
  padding: 5px 20px !important;
  color: black !important;
}

.el-icon-info {
  color: $app-color--primary !important;
}

.card-title {
  font-size: 1.15rem !important;
}
</style>
