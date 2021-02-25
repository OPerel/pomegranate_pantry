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
import OrderUsersList from '../../presentational/OrderUsersList/OrderUsersList';
import './ViewOrder.css';

import { useAdminStateContext, AdminStateActionTypes } from '../../context/adminState/AdminContextProvider';
import Fire from '../../../services/Firebase';
import { ROUTES } from '../../../constants';
import { OrderStatus } from '../../../types/interfaces';
import { mapOrderStatusToText, orderSeq, getOrderStatusBtn } from '../../../utils/mapOrderStatus';

const ViewOrder: React.FC<RouteComponentProps<{ id: string }>> = ({ match }) => {

  const { id: orderId } = match.params;

  const [tab, setTab] = useState<string>('users');

  const { state, dispatch } = useAdminStateContext();
  const { order } = state;

  const {
    orderStatusBtnText,
    orderStatusBtnFunction
  } = getOrderStatusBtn(order?._id as string, order?.status as OrderStatus);

  useEffect(() => {
    if (orderId) {
      dispatch({ type: AdminStateActionTypes.FETCH });
      Fire.orderListener(orderId, order => {
        dispatch({ type: AdminStateActionTypes.SET_ORDER, payload: order })
      });

      return () => {
        dispatch({ type: AdminStateActionTypes.SET_ORDER, payload: null });
        Fire.orderOff(orderId);
      }
    };
  }, [orderId, dispatch])

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonTitle slot="start">אדמין</IonTitle>
          <Link to={`${ROUTES.USER}/admin`} style={{ color: 'white', marginLeft: '2%' }} slot="end">משתמש</Link>
          <IonButton slot="end" color="secondary" onClick={() => Fire.doSignOut()}>יציאה</IonButton>
        </IonToolbar>
      </IonHeader>

      {order && (<IonContent>
        <IonToolbar className="order-header">

          <nav slot="start">
            <IonButtons>
              <IonBackButton defaultHref={ROUTES.ADMIN} icon={chevronForwardOutline} text="הזמנות" />
              <IonButton onClick={() => setTab('users')} disabled={tab === 'users'}>משתמשים</IonButton>
              <IonButton onClick={() => setTab('products')} disabled={tab === 'products'}>מוצרים</IonButton>
            </IonButtons>
          </nav>

          <IonTitle size="small">
            {`הזמנה ${order.createdAt.toLocaleDateString('he')}`} &nbsp; | &nbsp;
            <b>{mapOrderStatusToText(order.status)}</b> &nbsp; | &nbsp;
            {`נסגר ב - ${order.closingTime.toLocaleDateString('he')}`}
          </IonTitle>

          {orderStatusBtnText && 
            <IonButton
              slot="primary"
              color={orderSeq(order.status) > 1 ? 'danger' : 'primary'}
              onClick={orderStatusBtnFunction}
            >
              {orderStatusBtnText}
            </IonButton>}
        
        </IonToolbar>

        <div>
          {tab === 'users' ? (
            <OrderUsersList orderUsers={order.orderUsers} />
          ) : (
            <OrderProductsList orderProducts={order.orderProducts} />
          )}
        </div>
      </IonContent>)}
    </IonPage>
  );
};

export default ViewOrder;



