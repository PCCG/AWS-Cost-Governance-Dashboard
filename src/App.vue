<template>
  <v-app id="inspire">
    <div>
          <v-navigation-drawer
            :color="primaryColor"
            dark
            app
            absolute
            permanent
            :mini-variant="displayMiniVariant"
          >
                <v-list
                  nav
                  dense
                >
                  <v-list-item>
                    <v-list-item-icon class="clickable" @click="redirectToTheDashboard">
                      <v-icon>mdi-spotlight</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content class="clickable" @click="redirectToTheDashboard">
                      <v-list-item-title class="title" style="font-family: 'Montserrat', sans-serif !important;">TORCH</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
                <v-divider class="mb-2" />
                <v-list nav expand>
                  <v-list-item link :key="route.name" v-for="route in navigationItems" :to="route.to" :title="route.name">
                    <v-list-item-icon>
                      <v-icon>{{route.icon}}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title class="subtitle-2" style="font-family: 'Montserrat', sans-serif !important;">{{route.name}}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item title="Expand drawer" v-if="displayMiniVariant" @click="displayMiniVariant = false">
                    <v-icon>mdi-chevron-right</v-icon>
                  </v-list-item>
                  <v-list-item v-else @click="displayMiniVariant = true" title="Minimize drawer">
                    <v-icon>mdi-chevron-left</v-icon>
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
            <router-view id="dashboard" class="component-within-sfc"/>
          </v-content>
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
      displayMiniVariant: true,
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

.clickable-icon {
  cursor: pointer;
  font-size: 25px !important;
  margin: 1%;
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
