import React, { useState, useEffect } from 'react';
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
import { useUserStateContext, UserStateActionTypes } from '../../context/userState/UserContextProvider';
import { User } from '../../../types/interfaces';

import Fire from '../../../services/Firebase';
import OpenOrderView from '../../presentational/OpenOrderView/OpenOrderView';
import UserOrdersList from '../../presentational/UserOrdersList/UserOrdersList';

const UserPage: React.FC = () => {

  const [tab, setTab] = useState<string>('openOrder');

  const { state: { user } } = useAuthStateContext();
  const { state, dispatch } = useUserStateContext();
  const { openOrder, userOrders } = state;

  useEffect(() => {
    if (user && user._id) {
      dispatch({ type: UserStateActionTypes.FETCH });
      Fire.userOrdersListener(user._id, userOrders => {
        dispatch({ type: UserStateActionTypes.SET_USER_ORDERS, payload: userOrders });
      });
    }
  }, [dispatch, user]);

  useEffect(() => {
      const currentOrder = userOrders.find(order => order.orderRef === openOrder?._id);
      if (currentOrder) {
        dispatch({ type: UserStateActionTypes.SET_CURRENT_ORDER, payload: currentOrder });
      }
  }, [dispatch, openOrder?._id, userOrders]);

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
