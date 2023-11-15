import { createRouter, createWebHistory, RouteRecordRaw, onBeforeRouteUpdate, useRoute } from 'vue-router'

import { routeNames } from './route-names'
import { guardRoutes } from './guard.routes'
import AdminLayout from '@/layouts/AdminLayout.vue'

const routes: Array<RouteRecordRaw> = [
  // Main Layout
  {
    path: '/',
    name: routeNames.rootPage,
    redirect: { name: routeNames.home },
    meta: { requiresAuth: true },
    component: AdminLayout,
    children: guardRoutes
  },

  // 404 Layout
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: routeNames.home },
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export {
  router,
  routeNames,
  onBeforeRouteUpdate,
  useRoute
}
