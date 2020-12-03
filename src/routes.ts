import Admin from './components/containers/Admin';
import ViewOrder from './components/containers/ViewOrder/ViewOrder';
import User from './components/containers/User';
import Login from './components/containers/Login/Login';

export const routes = [
  {
    path: '/admin',
    component: Admin,
    routes: [
      {
        path: '/admin/order/:id',
        component: ViewOrder,
        // exact: true
      }
    ]
  },
  {
    path: '/user/:id',
    component: User,
    exact: true
  },
  {
    path: '/login',
    component: Login,
    exact: true
  },
  {
    path: '/',
    component: Login,
    exact: true
  }
]
