import { guardRouteNames } from './guard.routes'

export const routeNames = {
  rootPage: 'root',
  auth: 'auth',
  ...guardRouteNames
}
