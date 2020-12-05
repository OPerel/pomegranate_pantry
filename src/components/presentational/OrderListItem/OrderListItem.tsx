import React from 'react';

import {
  IonItem,
  IonGrid,
  IonCol,
  IonRow,
  } from '@ionic/react';

import { Order } from '../../../types/interfaces';
import './OrderListItem.css';

interface OrderListItemProps {
  order: Order;
}

const OrderListItem: React.FC<OrderListItemProps> = ({ order }) => {
  return (
    <IonItem routerLink={`/admin/order/${order._id}`} detail={true} data-testid="order-list-item">
      <IonGrid>
        <IonRow>
          <IonCol><h3>{order.createdAt.toDateString()}</h3></IonCol>
          <IonCol><h4>{order.totalPrice}</h4></IonCol>
          <IonCol><h4>{order.payed ? <span>&#10003;</span> : 'X'}</h4></IonCol>
        </IonRow>
      </IonGrid>
    </IonItem>
  );
};

export default OrderListItem;
