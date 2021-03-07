import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonContent,
  IonButtons
} from '@ionic/react';
import { Link } from 'react-router-dom';
 
import { ROLES, ROUTES } from '../../../constants';

import  { useAuthStateContext } from '../../context/authState/AuthContextProvider';
import AuthGuard from '../Auth/AuthGuard';
import { useUserStateContext } from '../../context/userState/UserContextProvider';
import { User } from '../../../types/interfaces';

import Fire from '../../../services/Firebase';
import OpenOrderView from '../../presentational/OpenOrderView/OpenOrderView';
import UserOrdersList from '../../presentational/UserOrdersList/UserOrdersList';

const UserPage: React.FC = () => {

  const [tab, setTab] = useState<string>('openOrder');

  const { state: { user } } = useAuthStateContext();
  const { state: { openOrder, userOrders } } = useUserStateContext();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle slot="start" role="greet-user-by-name">
            שלום {user?.name}
          </IonTitle>
          {user?.role === ROLES.ADMIN && 
            <Link
              to={ROUTES.ADMIN}
              style={{ color: 'white', marginLeft: '2%' }}
              slot="end"
            >אדמין</Link>
          }
          <IonButton slot="end" color="secondary" onClick={() => Fire.doSignOut()}>יציאה</IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonToolbar color="dark">
          <IonButtons>
            <IonButton
              onClick={() => setTab('openOrder')}
              disabled={tab === 'openOrder'}
              role="open-order-tab"
            >הזמנה נוכחית</IonButton>
            <IonButton
              onClick={() => setTab('oldOrders')}
              disabled={tab === 'oldOrders'}
              role="old-orders-tab"
            >הזמנות ישנות</IonButton>
          </IonButtons>
        </IonToolbar>
        
        {
          tab === 'openOrder' ? (
            <OpenOrderView openOrder={openOrder} />
          ) : (
            <UserOrdersList userOrders={userOrders} />
          )
        }
      </IonContent>
            
    </IonPage>
  )
}

const condition = (user: User) => !!user;
export default AuthGuard(condition)(UserPage);
