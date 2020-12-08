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
    <IonItem routerLink={`${ROUTES.ORDER}/${order._id}`} detail={true} color={!order.open && !order.payed ? 'warning' : ''} data-testid="order-list-item">
      <IonGrid>
        <IonRow>
          <IonCol>{`${order?.createdAt.getDate()}/${order?.createdAt.getMonth()}/${order?.createdAt.getFullYear()}`}</IonCol>
          <IonCol>{order.totalPrice}</IonCol>
          <IonCol><IonIcon icon={order.open ? checkmarkOutline : closeOutline} /></IonCol>
          <IonCol><IonIcon icon={order.payed ? checkmarkOutline : closeOutline} /></IonCol>
        </IonRow>
      </IonGrid>
    </IonItem>
  );
};

export default OrderListItem;
