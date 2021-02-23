import React, { useState, useEffect } from 'react';

import {
  IonList,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonListHeader,
  IonSpinner
} from '@ionic/react';

import { useAdminStateContext, AdminStateActionTypes } from '../../context/adminState/AdminContextProvider';
import Fire from '../../../services/Firebase';
import { Order, User } from '../../../types/interfaces';
import OrderUsersListItem from '../OrderUsersListItem/OrderUsersListItem';
import './OrderUsersList.css';

const OrderUsersList: React.FC<{order: Order}> = ({ order }) => {

  const { state: { loading, orderUsers }, dispatch } = useAdminStateContext();
  const [userFilter, setUserFilter] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  
  const filteredOrderUsers = userFilter ? orderUsers.filter(({ userRef }) => (users as any)[userRef].location === userFilter) : orderUsers;

  const getUsers = async (): Promise<void> => {
    const users = await Fire.getUsers();
    setUsers(users);
  }

  useEffect(() => {
    dispatch({ type: AdminStateActionTypes.FETCH })
    Fire.orderUsersCollectionListener(order._id, orderUsers => {
      dispatch({ type: AdminStateActionTypes.SET_ORDER_USERS, payload: orderUsers });
    });
    return () => Fire.orderUsersOff(order._id);
  }, [dispatch, order._id]);

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
      {!loading ? (
        orderUsers.length > 0 ? (
          filteredOrderUsers?.map(o => <OrderUsersListItem key={o._id} orderUser={o} />)
        ) : <h3 style={{ margin: '50px 0', textAlign: 'center' }}>לא נמצאו משתמשים להזמנה</h3>
      ) : <IonSpinner color="primary" style={{ display: 'block', margin: '50px auto' }}/>}
    </IonList>
  )
}

export default OrderUsersList;
