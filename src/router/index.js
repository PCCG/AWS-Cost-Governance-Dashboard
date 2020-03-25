import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Budgets from '../views/Budgets.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Home
  },
  {
    path: '/accounts',
    name: 'Accounts',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Accounts.vue')
  },
  {
    path: '/budgets',
    name: 'Budgets',
    component: Budgets
  }
]

const router = new VueRouter({
  routes
})

export default router
