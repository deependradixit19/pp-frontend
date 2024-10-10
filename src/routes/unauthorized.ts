import Auth from '../pages/auth/Auth'
import NotFound from '../pages/404'

export const unauthorized = [
  {
    path: '/auth',
    component: Auth
  },
  {
    path: '/auth/:type',
    component: Auth
  },
  {
    path: '*',
    component: NotFound
  }
]
