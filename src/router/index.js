import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import Integrations from '@/views/Integrations.vue'
import Budgets from '@/views/Budgets.vue'
import Actions from '@/views/Actions.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Dashboard', //The name is to be used when making use of the $router API to move to a different route
    component: Home
  },
  {
    path: '/integrations',
    name: 'Integrations',
    component: Integrations
  },
  {
    path: '/budgets',
    name: 'Budgets',
    component: Budgets
  },
  {
    path: '/actions',
    name: 'Actions',
    component: Actions
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
