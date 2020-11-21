import React from 'react';

import {
  IonItem,
  IonGrid,
  IonCol,
  IonRow,
  } from '@ionic/react';

import { UserOrder } from '../../../data/userOrders';
import { getUser } from '../../../data/users';
// import './UserOrderListItem.css';

interface UserOrderListItemProps {
  userOrder: UserOrder;
}

const UserOrderListItem: React.FC<UserOrderListItemProps> = ({ userOrder }) => {

  return (
    <IonItem>
      <IonGrid>
        <IonRow>
          <IonCol><h3>{getUser(userOrder.userRef).name}</h3></IonCol>
          <IonCol><h4>{getUser(userOrder.userRef)?.location === 'TA' ? 'תל אביב' : 'פרדס חנה'}</h4></IonCol>
          <IonCol><h4>{userOrder.totalPrice}</h4></IonCol>
          <IonCol><h4>{userOrder.payed ? <span>&#10003;</span> : 'X'}</h4></IonCol>
        </IonRow>
      </IonGrid>
    </IonItem>
  );
};

export default UserOrderListItem;
