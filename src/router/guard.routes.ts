import { RouteRecordRaw } from 'vue-router'

const Home = () => import('@/pages/Home.vue')

export const guardRouteNames = {
  home: 'home'
}

export const guardRoutes: RouteRecordRaw[] = [
  {
    path: 'home',
    name: guardRouteNames.home,
    component: Home
  }
]
