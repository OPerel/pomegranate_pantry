import React, { useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonList,
  IonTitle,
  IonToolbar,
  IonListHeader,
  IonLabel,
  IonSpinner,
} from '@ionic/react';

import { useAdminStateContext, AdminStateActionTypes } from '../../context/adminState/AdminContextProvider';
import UsersListItem from '../../presentational/UsersListItem/UsersListItem';
import Fire from '../../../services/Firebase';

const Orders: React.FC = () => {

  const { state: { users, loading }, dispatch } = useAdminStateContext();

  useEffect(() => {
    dispatch({ type: AdminStateActionTypes.FETCH })
    Fire.usersCollectionListener(users => {
      dispatch({ type: AdminStateActionTypes.SET_USERS, payload: users });
    });

    return () => Fire.usersCollectionOff();
  }, [dispatch])

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
          <IonLabel>מס' סידורי</IonLabel>
        </IonListHeader>
        {!loading ? (
          users.length > 0 ? (
            users.map(p => <UsersListItem key={p._id} user={p} />)
          ) : <h3 style={{ margin: '50px 0', textAlign: 'center' }}>לא נמצאו הזמנות</h3>
        ) : <IonSpinner color="primary" style={{ display: 'block', margin: '50px auto' }}/>}
      </IonList>
    </IonContent>
  );
};

export default Orders;
