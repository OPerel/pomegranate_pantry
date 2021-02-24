import React, { useState } from 'react';

import {
  IonList,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonListHeader,
} from '@ionic/react';

import Fire from '../../../services/Firebase';
import { OrderUser, User } from '../../../types/interfaces';
import OrderUsersListItem from '../OrderUsersListItem/OrderUsersListItem';
import './OrderUsersList.css';

const OrderUsersList: React.FC<{orderUsers: OrderUser[]}> = ({ orderUsers }) => {

  const [userFilter, setUserFilter] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  // const { orderUsers } = order;
  
  const filteredOrderUsers = userFilter ?
    orderUsers.filter(({ userRef }) => (users as any)[userRef].location === userFilter) :
    orderUsers;

  const getUsers = async (): Promise<void> => {
    const users = await Fire.getUsers();
    setUsers(users);
  }

  return (
    <IonList>
      <div className="ion-justify-content-between">
        <h2>רשימת משתמשים</h2>
        <IonItem>
          <IonLabel position="fixed" color="primary">סנן לפי מיקום</IonLabel>
          <IonSelect interface="popover" value={userFilter} onIonChange={e => setUserFilter(e.detail.value)} onIonFocus={getUsers}>
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
      {orderUsers.length > 0 ? (
        filteredOrderUsers?.map(o => <OrderUsersListItem key={o._id} orderUser={o} />)
      ) : (
        <h3 style={{ margin: '50px 0', textAlign: 'center' }}>לא נמצאו משתמשים להזמנה</h3>
      )}
    </IonList>
  )
}

export default OrderUsersList;
