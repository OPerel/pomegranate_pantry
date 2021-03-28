import React from 'react';
import {
  IonContent,
  IonHeader,
  IonList,
  IonTitle,
  IonToolbar
} from '@ionic/react';

import { useAdminStateContext } from '../../context/adminState/AdminContextProvider';
import UsersListItem from '../../presentational/UsersListItem/UsersListItem';
import ListHeader from '../../common/ListHeader/ListHeader';

const Orders: React.FC = () => {

  const { state: { users } } = useAdminStateContext();

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
        <ListHeader name="Users" headersList={['שם' ,'מיקום']} />
        {Object.keys(users).map(userKey => <UsersListItem key={userKey} user={users[userKey]} />)}
      </IonList>
    </IonContent>
  );
};

export default Orders;
