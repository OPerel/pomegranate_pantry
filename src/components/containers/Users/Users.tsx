import React from 'react';
import {
  IonContent,
  IonHeader,
  IonList,
  IonTitle,
  IonToolbar,
  IonListHeader,
  IonLabel,
} from '@ionic/react';

import { useAdminStateContext } from '../../context/adminState/AdminContextProvider';
import UsersListItem from '../../presentational/UsersListItem/UsersListItem';

const Orders: React.FC = () => {

  const { state: { users } } = useAdminStateContext();
  console.log(users)
  return (
    <IonContent fullscreen data-testid="admin-users-list">

      <IonHeader>
        <IonToolbar color="light">
          <IonTitle color="primary" size="large" slot="start">
            משתמשים
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonList>
        <IonListHeader>
          <IonLabel>שם</IonLabel>
          <IonLabel>מיקום</IonLabel>
          {/* <IonLabel>מס' סידורי</IonLabel> */}
        </IonListHeader>
        {Object.keys(users).map(userKey => <UsersListItem key={userKey} user={users[userKey]} />)}
      </IonList>
    </IonContent>
  );
};

export default Orders;
