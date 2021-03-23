import Admin from './components/containers/Admin/Admin';
import ViewOrder from './components/containers/ViewOrder/ViewOrder';
import User from './components/containers/User/User';
import Login from './components/containers/Login/Login';
import Registration from './components/containers/Registration/Registration';

import AdminStateProvider from './components/context/adminState/AdminContextProvider';
import UserStateProvider from './components/context/userState/UserContextProvider';

import { ROUTES } from './constants';

export const routes = [
  {
    path: ROUTES.ADMIN,
    component: AdminStateProvider(Admin),
    routes: [
      {
        path: `${ROUTES.ORDER}/:id`,
        component: ViewOrder,
        exact: true
      }
    ]
  },
  {
    path: `${ROUTES.USER}/:id`,
    component: UserStateProvider(User),
    exact: true
  },
  {
    path: ROUTES.LOGIN,
    component: Login,
    exact: true
  },
  {
    path: ROUTES.REGISTRATION,
    component: Registration,
    exact: true
  },
  {
    path: ROUTES.ROOT,
    component: Login,
    exact: true
  }
]
