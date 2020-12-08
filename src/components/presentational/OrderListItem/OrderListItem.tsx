import React from 'react';

import {
  IonItem,
  IonGrid,
  IonCol,
  IonRow,
  IonIcon
} from '@ionic/react';
import { checkmarkOutline, closeOutline } from 'ionicons/icons';

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
          <IonCol>{order.createdAt.toDateString()}</IonCol>
          <IonCol>{order.totalPrice}</IonCol>
          <IonCol><IonIcon icon={order.payed ? checkmarkOutline : closeOutline} /></IonCol>
          <IonCol><IonIcon icon={order.payed ? checkmarkOutline : closeOutline} /></IonCol>
        </IonRow>
      </IonGrid>
    </IonItem>
  );
};

export default OrderListItem;
