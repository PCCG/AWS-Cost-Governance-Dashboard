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
      <el-dialog
        :title="helpDialogTitle"
        :visible.sync="showHelpDialog"
        :show-close="false"
        width="50%">
        <div class="help-dialog-content" v-html="helpDialogContent"></div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="showHelpDialog = false">OK</el-button>
        </span>
      </el-dialog>
      <v-content>
        <router-view class="component-within-sfc"/>
      </v-content>
    </div>
  </v-app>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

import helpDialogMixin from '@/mixins/helpDialogMixin';

export default {
  name: 'App',
  data () {
    return {
      minimizeDrawer: true,
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
      'HELP_DIALOG_STATE'
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
      'helpDialogTitle'
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
  ]
};
</script>

<style>
.v-application {
  font-family: 'Montserrat', sans-serif !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.primary-color {
  color: #235380 !important;
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

.help-dialog-content {
  word-break: keep-all;
  text-align: justify;
}

.el-dialog__body {
  padding: 5px 20px !important;
}

.card-title {
  font-size: 1 rem !important;
}

[class*=" el-icon-"], [class^=el-icon-] {
  color: #235380 !important;
}
</style>
