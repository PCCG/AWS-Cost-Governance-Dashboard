<template>
  <v-app id="inspire">
    <div>
          <v-app-bar color="#235380" dark>
            <v-app-bar-nav-icon @click.stop="showDrawer = !showDrawer"></v-app-bar-nav-icon>
            <v-toolbar-title>AWS Cost Governance Dashboard</v-toolbar-title>
          </v-app-bar>
          <v-navigation-drawer
            v-model="showDrawer"
            :color="primaryColor"
            dark
            app
            absolute
            temporary
          >
            <v-list
              nav
              dense
            >
              <v-list-item link :key="route.name" v-for="route in navigationItems" :to="route.to">
                <v-list-item-icon>
                  <v-icon>{{route.icon}}</v-icon>
                </v-list-item-icon>
                <v-list-item-title>{{route.name}}</v-list-item-title>
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
          <router-view id="dashboard"/>
    </div>
  </v-app>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'App',
  data () {
    return {
      showDrawer: false,
      primaryColor: '#235380',
      navigationItems: [
        {icon:"mdi-view-dashboard", name: "Dashboard", to: "/"},
        {icon:"mdi-playlist-plus", name: "Accounts", to: "/accounts"},
        {icon: "mdi-cash-usd", name: "Budgets", to: "/budgets"}
      ]
    }
  },
  methods: {
    ...mapMutations([
      'HELP_DIALOG_STATE'
    ])
  },
  computed: {
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
    }
  }
};
</script>

<style>
.v-application {
  font-family: 'Montserrat', sans-serif !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.component-within-sfc {
  width: 95% !important;
  margin: 3% !important;
}

.help-dialog-content {
  word-break: keep-all;
  text-align: justify;
}

.card-title {
  font-size: 1 rem !important;
}

[class*=" el-icon-"], [class^=el-icon-] {
  color: #235380 !important;
}

#dashboard {
  min-height: 89vh !important;
}
</style>
