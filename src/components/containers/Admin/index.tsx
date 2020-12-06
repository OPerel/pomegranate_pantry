import React from 'react';
import { Switch, RouteComponentProps, Link } from 'react-router-dom';

import { RouteWithSubRoutes } from '../../../App';

import {
  IonButtons,
  IonButton,
  // IonContent,
  IonTitle,
  IonHeader,
  IonPage,
  IonToolbar,
} from '@ionic/react';

import Orders from '../Orders/Order';
import Products from '../Products';
import AuthGuard from '../Auth/AuthGuard';
import { useAuthStateContext } from '../../context/authState/AuthContextProvider';
import Fire from '../../../services/Firebase';
import { User } from '../../../types/interfaces';
import { ROLES, ROUTES } from '../../../constants';

const Admin: React.FC<{routes: RouteComponentProps<{ id: string }>[]}> = ({ routes }) => {
  const [tab, setTab] = React.useState<string>('orders');
  const { state: { user } } = useAuthStateContext();
  return (
    <>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle slot="start">אדמין</IonTitle>
            <Link to={`${ROUTES.USER}/${user?._id}`} style={{ color: 'white', marginLeft: '2%' }} slot="end">משתמש</Link>
            <IonButton slot="end" color="secondary" onClick={() => Fire.doSignOut()}>יציאה</IonButton>
          </IonToolbar>
        </IonHeader>

        <IonToolbar color="dark">
          <IonButtons>
            <IonButton onClick={() => setTab('orders')} disabled={tab === 'orders'} data-testid="admin-orders-button">הזמנות</IonButton>
            <IonButton onClick={() => setTab('products')} disabled={tab === 'products'} data-testid="admin-products-button">מוצרים</IonButton>
          </IonButtons>
        </IonToolbar>
        
        
        {tab === 'orders' ? (
          <Orders />
        ) : (
          <Products />
        )}
      </IonPage>

      <Switch>
        {routes.map((route, i) => (
          <RouteWithSubRoutes key={i} {...route} />
        ))}
      </Switch>
    </>
  )
}

const condition = (user: User) => user.role === ROLES.ADMIN;
export default AuthGuard(condition)(Admin);
