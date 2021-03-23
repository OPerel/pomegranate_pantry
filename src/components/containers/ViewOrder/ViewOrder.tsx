import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  IonButtons,
  IonButton,
  IonBackButton,
  IonContent,
  IonPage,
  IonToolbar,
  IonTitle,
} from '@ionic/react';
import AdminHeader from '../../common/AdminHeader/AdminHeader';

import { chevronForwardOutline } from 'ionicons/icons';

import OrderProductsList from '../../presentational/OrderProductsList/OrderProductsList';
import OrderUsersList from '../../presentational/OrderUsersList/OrderUsersList';
import './ViewOrder.css';

import { useAdminStateContext } from '../../context/adminState/AdminContextProvider';
import { ROUTES } from '../../../constants';
import { OrderStatus } from '../../../types/interfaces';
import { mapOrderStatusToText, orderSeq, getOrderStatusBtn } from '../../../utils/mapOrderStatus';

const ViewOrder: React.FC<RouteComponentProps<{ id: string }>> = () => {

  const [tab, setTab] = useState<string>('users');

  const { state: { order } } = useAdminStateContext();

  const getLocalDateStr = (date: Date) => {
    return date.toLocaleDateString('he', { timeZone: 'Israel' });
  }

  const {
    orderStatusBtnText,
    orderStatusBtnFunction
  } = getOrderStatusBtn(order?._id as string, order?.status as OrderStatus);

  return (
    <IonPage>
      <AdminHeader />

      {order && (<IonContent>
        <IonToolbar color="dark">

            <IonButtons slot="start">
              <IonBackButton
                defaultHref={ROUTES.ADMIN}
                icon={chevronForwardOutline}
                text="הזמנות"
                data-testid="back-to-orders"
              />
              <IonButton
                onClick={() => setTab('users')}
                disabled={tab === 'users'}
                data-testid="order-users-tab-button"
              >
                משתמשים
              </IonButton>
              <IonButton
                onClick={() => setTab('products')}
                disabled={tab === 'products'}
                data-testid="order-products-tab-button"
              >
                מוצרים
              </IonButton>
            </IonButtons>

          <IonTitle size="small" role="order-details-title" className="ion-hide-md-down">
            <span>{`הזמנה ${getLocalDateStr(order.createdAt)}`}</span>
            <span><b>{mapOrderStatusToText(order.status)}</b></span>
            <span>{`נסגר להזמנות ב - ${getLocalDateStr(order.closingTime)}`}</span>
          </IonTitle>

          {orderStatusBtnText && 
            <IonButton
              slot="end"
              color={orderSeq(order.status) > 1 ? 'danger' : 'primary'}
              onClick={orderStatusBtnFunction}
              data-testid="next-order-status-button"
            >
              {orderStatusBtnText}
            </IonButton>}
        
        </IonToolbar>

        <IonToolbar color="dark" className="ion-hide-md-up">
          <IonTitle size="small">
            <span>{`הזמנה ${getLocalDateStr(order.createdAt)}`}</span>
            <span><b>{mapOrderStatusToText(order.status)}</b></span>
            <span>{`נסגר להזמנות ב - ${getLocalDateStr(order.closingTime)}`}</span>
          </IonTitle>
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
