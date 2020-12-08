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
          <IonCol><h4>{order.createdAt.toDateString()}</h4></IonCol>
          <IonCol><h4>{order.totalPrice}</h4></IonCol>
          <IonCol><h4><IonIcon icon={order.payed ? checkmarkOutline : closeOutline}></IonIcon></h4></IonCol>
        </IonRow>
      </IonGrid>
    </IonItem>
  );
};

export default OrderListItem;
