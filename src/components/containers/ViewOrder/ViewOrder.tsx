import React, { useState, useEffect } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import {
  IonButtons,
  IonButton,
  IonBackButton,
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonTitle,
} from '@ionic/react';

import { chevronForwardOutline } from 'ionicons/icons';

import OrderProductsList from '../../presentational/OrderProductsList/OrderProductsList';
import OrderUsersList from '../../presentational/OrderUsersList';
import './ViewOrder.css';

import { useAdminStateContext, AdminStateActionTypes } from '../../context/adminState/AdminContextProvider';
import Fire from '../../../services/Firebase';
import { ROUTES } from '../../../constants'; 

const ViewOrder: React.FC<RouteComponentProps<{ id: string }>> = ({ match }) => {

  const { id: orderId } = match.params;

  const [tab, setTab] = useState<string>('users');

  const { state, dispatch } = useAdminStateContext();
  const { order } = state;

  useEffect(() => {
    if (orderId) {
      dispatch({ type: AdminStateActionTypes.FETCH });
      Fire.orderListener(orderId, order => {
        dispatch({ type: AdminStateActionTypes.SET_ORDER, payload: order })
      });

      return () => Fire.orderOff(orderId)
    };
  }, [orderId, dispatch])
  // console.log('viewOrder state: ', state)

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonTitle slot="start">אדמין</IonTitle>
          <Link to={`${ROUTES.USER}/admin`} style={{ color: 'white', marginLeft: '2%' }} slot="end">משתמש</Link>
          <IonButton slot="end" color="secondary" onClick={() => Fire.doSignOut()}>יציאה</IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonToolbar className={`order-header ${order?.open ? 'order-header-open' : (order?.payed ? 'order-header-success' : 'order-header-danger')}`}>

          <nav slot="start">
            <IonButtons>
              <IonBackButton defaultHref={ROUTES.ADMIN} icon={chevronForwardOutline} text="הזמנות" />
              <IonButton onClick={() => setTab('users')} disabled={tab === 'users'}>משתמשים</IonButton>
              <IonButton onClick={() => setTab('products')} disabled={tab === 'products'}>מוצרים</IonButton>
            </IonButtons>
          </nav>

          <IonTitle size="small">
            {`הזמנה ${order?.createdAt.getDate()}/${order?.createdAt.getMonth()}/${order?.createdAt.getFullYear()}`} &nbsp; | &nbsp;
            <b>{order?.open ? 'הזמנה פעילה' : 'הזמנה סגורה'}</b> &nbsp; | &nbsp;
            {`נסגר ב - ${order?.closingTime.getDate()}/${order?.closingTime.getMonth()}/${order?.closingTime.getFullYear()}`}
          </IonTitle>

          {order?.open && <IonButton color="danger" slot="primary">סגור הזמנה</IonButton>}
        
        </IonToolbar>

        <div>
          {tab === 'users' && order ? (
            <OrderUsersList order={order} />
          ) : (
            <OrderProductsList />
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ViewOrder;



