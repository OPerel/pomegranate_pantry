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

  const {
    orderStatusBtnText,
    orderStatusBtnFunction
  } = getOrderStatusBtn(order?._id as string, order?.status as OrderStatus);

  return (
    <IonPage>
      <AdminHeader />

      {order && (<IonContent>
        <IonToolbar className="order-header">

          <nav slot="start">
            <IonButtons>
              <IonBackButton
                defaultHref={ROUTES.ADMIN}
                icon={chevronForwardOutline}
                text="הזמנות"
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
          </nav>

          <IonTitle size="small" role="order-details-title">
            <span>{`הזמנה ${order.createdAt.toLocaleDateString('he', { timeZone: 'Israel' })}`}</span>
            <span><b>{mapOrderStatusToText(order.status)}</b></span>
            <span>{`נסגר להזמנות ב - ${order.closingTime.toLocaleDateString('he', { timeZone: 'Israel' })}`}</span>
          </IonTitle>

          {orderStatusBtnText && 
            <IonButton
              slot="primary"
              color={orderSeq(order.status) > 1 ? 'danger' : 'primary'}
              onClick={orderStatusBtnFunction}
              data-testid="next-order-status-button"
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
