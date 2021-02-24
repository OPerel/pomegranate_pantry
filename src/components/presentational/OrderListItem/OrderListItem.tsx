import React from 'react';

import {
  IonItem,
  IonGrid,
  IonCol,
  IonRow,
  // IonIcon
} from '@ionic/react';
// import { checkmarkOutline, closeOutline } from 'ionicons/icons';
import { mapOrderStatusToText } from '../../../utils/mapOrderStatus';

import { Order } from '../../../types/interfaces';
import { ROUTES } from '../../../constants';
import './OrderListItem.css';

interface OrderListItemProps {
  order: Order;
}

const OrderListItem: React.FC<OrderListItemProps> = ({ order }) => {
  return (
    <IonItem routerLink={`${ROUTES.ORDER}/${order._id}`} detail={true} data-testid="order-list-item">
      <IonGrid>
        <IonRow>
          <IonCol>{`${order?.createdAt.getDate()}/${order?.createdAt.getMonth()}/${order?.createdAt.getFullYear()}`}</IonCol>
          <IonCol>{order.totalPrice}</IonCol>
          <IonCol>{mapOrderStatusToText(order.status)}</IonCol>
        </IonRow>
      </IonGrid>
    </IonItem>
  );
};

export default OrderListItem;
