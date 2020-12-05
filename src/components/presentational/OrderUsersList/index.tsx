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

import { getUser } from '../../../data/users';

import { useAdminStateContext, ActionTypes } from '../../context/adminState/AdminContextProvider';
import Fire from '../../../services/Firebase';

import UserOrderListItem from '../UserOrderListItem/UserOrderListItem';
import './OrderUsersList.css';

const OrderUsersList: React.FC = () => {

  const { state: { loading, order, orderUsers }, dispatch } = useAdminStateContext();
  const [userFilter, setUserFilter] = useState<string | null>(null);
  const filteredUserOrders = userFilter ? orderUsers.filter(o => getUser(o.userRef).location === userFilter) : orderUsers;

  useEffect(() => {
    if (order) {
      Fire.orderUsersCollectionListener(order._id, orderUsers => {
        dispatch({ type: ActionTypes.SET_ORDER_USERS, payload: orderUsers })
      })
    }
  }, [dispatch, order])

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
      {!loading ? (
        orderUsers.length > 0 ? (
          filteredUserOrders?.map(o => <UserOrderListItem key={o._id} userOrder={o} />)
        ) : <h3 style={{ margin: '50px 0', textAlign: 'center' }}>לא נמצאו משתמשים להזמנה</h3>
      ) : <IonSpinner color="primary" style={{ display: 'block', margin: '50px auto' }}/>}
    </IonList>
  )
}

export default OrderUsersList;
