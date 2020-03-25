<template>
  <v-app id="inspire">
          <v-app-bar app clipped-left color="#235380" dark>
            <v-toolbar-title><v-icon x-large>mdi-cloud-check</v-icon> AWS Cost Governance Dashboard</v-toolbar-title>
          </v-app-bar>
          <v-navigation-drawer
            color="#235380"
            dark
            app
            clipped
            absolute
            permanent
            expand-on-hover
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
  </v-app>
</template>

<script>

export default {
  name: 'App',
  data () {
    return {
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

#dashboard {
  min-height: 89vh !important;
}
</style>