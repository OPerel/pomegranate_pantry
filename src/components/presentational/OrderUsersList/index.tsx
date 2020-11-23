import React, { useState} from 'react';

import {
  IonList,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonListHeader
} from '@ionic/react';

import { getUser } from '../../../data/users';
import { UserOrder } from '../../../types/interfaces';

import UserOrderListItem from '../UserOrderListItem/UserOrderListItem';
import './OrderUsersList.css';

interface OrderUsersListPropsTypes {
  orderUsers:  UserOrder[]
}

const OrderUsersList: React.FC<OrderUsersListPropsTypes> = ({ orderUsers }) => {
  const [userFilter, setUserFilter] = useState<string | null>(null);
  const filteredUserOrders = userFilter ? orderUsers.filter(o => getUser(o.userRef).location === userFilter) : orderUsers;
  return (
    <IonList>
      <div className="ion-justify-content-between">
        <h2>רשימת משתמשים</h2>
        <IonItem>
          <IonLabel position="fixed" color="primary">סנן לפי מיקום</IonLabel>
          <IonSelect interface="popover" value={userFilter} onIonChange={e => setUserFilter(e.detail.value)}>
            <IonSelectOption value={null}>הכל</IonSelectOption>
            <IonSelectOption value="TA">תל אביב</IonSelectOption>
            <IonSelectOption value="PH">פרדס חנה</IonSelectOption>
          </IonSelect>
        </IonItem>
      </div>
      <IonListHeader>
        <IonLabel>שם</IonLabel>
        <IonLabel>מקום</IonLabel>
        <IonLabel>סה"כ</IonLabel>
        <IonLabel>שולם</IonLabel>
        <IonLabel></IonLabel>
      </IonListHeader>
      {filteredUserOrders?.map(o => <UserOrderListItem key={o._id} userOrder={o} />)}
    </IonList>
  )
}

export default OrderUsersList;
