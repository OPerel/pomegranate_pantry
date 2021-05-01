import React from 'react';
import { Switch, RouteComponentProps } from 'react-router-dom';

import { RouteWithSubRoutes } from '../../../App';

import {
  IonButtons,
  IonButton,
  IonPage,
  IonToolbar,
} from '@ionic/react';

import Users from '../Users/Users';
import Orders from '../Orders/Orders';
import Products from '../Products/Products';
import AuthGuard from '../Auth/AuthGuard';
import AdminHeader from '../../common/AdminHeader/AdminHeader';
import { User } from '../../../types/interfaces';
import { ROLES } from '../../../constants';

const Admin: React.FC<{routes: RouteComponentProps<{ id: string }>[]}> = ({ routes }) => {
  const [tab, setTab] = React.useState<string>('orders');

  const getAdminTab = () => {
    switch (tab) {
      case 'users': return <Users />
      case 'products': return <Products />
      default: return <Orders />
    }
  }

  return (
    <>
      <IonPage>
        <AdminHeader />

        <IonToolbar color="dark">
          <IonButtons>
            <IonButton
              onClick={() => setTab('orders')}
              disabled={tab === 'orders'}
              data-testid="admin-orders-button"
            >הזמנות</IonButton>
            <IonButton
              onClick={() => setTab('products')}
              disabled={tab === 'products'}
              data-testid="admin-products-button"
            >מוצרים</IonButton>
            <IonButton
              onClick={() => setTab('users')}
              disabled={tab === 'users'}
              data-testid="admin-users-button"
            >משתמשים</IonButton>
          </IonButtons>
        </IonToolbar>
        
        {getAdminTab()}
      </IonPage>

      <Switch>
        {routes.map((route, i) => (
          <RouteWithSubRoutes key={i} {...route} />
        ))}
      </Switch>
    </>
  )
}

const condition = (user: User) => !!user && user.role === ROLES.ADMIN;
export default AuthGuard(condition)(Admin);
