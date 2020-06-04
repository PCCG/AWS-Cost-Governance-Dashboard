<template>
  <v-app id="inspire">
    <div>
          <v-app-bar color="#235380" dark>
            <v-app-bar-nav-icon @click.stop="showDrawer = !showDrawer"></v-app-bar-nav-icon>
            <v-toolbar-title>AWS Cost Governance Dashboard</v-toolbar-title>
          </v-app-bar>
          <v-navigation-drawer
            v-model="showDrawer"
            color="#235380"
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
          <router-view id="dashboard"/>
    </div>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  data () {
    return {
      showDrawer: false,
      navigationItems: [
        {icon:"mdi-view-dashboard", name: "Dashboard", to: "/"},
        {icon:"mdi-playlist-plus", name: "Accounts", to: "/accounts"},
        {icon: "mdi-cash-usd", name: "Budgets", to: "/budgets"}
      ]
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

.card-title {
  font-size: 1 rem;
}

[class*=" el-icon-"], [class^=el-icon-] {
  color: #235380 !important;
}

#dashboard {
  min-height: 89vh !important;
}
</style>
