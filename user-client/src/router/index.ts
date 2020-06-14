import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import MessagesLayout from '../views/MessagesLayout.vue'

Vue.use(VueRouter)

  const routes: Array<RouteConfig> = [
  {
    path: '/m/:userId?',
    name: 'Messages',
    alias: '/',
    component: MessagesLayout,
    props: (route) => {
      return {
        userId: route.params.userId ? parseInt(route.params.userId, 10) : null
      };
    }
  },

  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
