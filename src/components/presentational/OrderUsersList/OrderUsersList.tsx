import React from 'react';

import {
  IonList,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonToolbar,
  IonHeader,
  IonTitle
} from '@ionic/react';

import { useAdminStateContext } from '../../context/adminState/AdminContextProvider';
import { OrderUser } from '../../../types/interfaces';
import OrderUsersListItem from '../OrderUsersListItem/OrderUsersListItem';
import ListHeader from '../../common/ListHeader/ListHeader';
import './OrderUsersList.css';

const OrderUsersList: React.FC<{orderUsers: OrderUser[]}> = ({ orderUsers }) => {

  const [userFilter, setUserFilter] = React.useState<string | null>(null);
  const { state: { users } } = useAdminStateContext();
  
  const filteredOrderUsers = userFilter ?
    orderUsers.filter(({ userRef }) => users[userRef].location === userFilter) :
    orderUsers;

    // console.log('filteredOrderUsers: ', filteredOrderUsers)
  return (
    <>
      <IonHeader>
        <IonToolbar color="light">
          <IonTitle slot="start" color="primary">רשימת משתמשים</IonTitle>
          <IonItem slot="end">
            <IonLabel position="fixed" color="primary">סנן לפי מיקום</IonLabel>
            <IonSelect
              interface="popover"
              value={userFilter}
              onIonChange={e => setUserFilter(e.detail.value)}
              data-testid="filter-user-location"
            >
              <IonSelectOption value={null} data-testid="filter-by-all">הכל</IonSelectOption>
              <IonSelectOption value="TA" data-testid="filter-by-ta">תל אביב</IonSelectOption>
              <IonSelectOption value="PH" data-testid="filter-by-ph">פרדס חנה</IonSelectOption>
            </IonSelect>
          </IonItem>
        </IonToolbar>
      </IonHeader>
      <IonList>
        <ListHeader
          name="OrderUsers"
          headersList={['שם', 'מקום', 'סה"כ', 'שולם', '']}
        />
        {orderUsers.length > 0 ? (
          filteredOrderUsers?.map(o => <OrderUsersListItem key={o._id} orderUser={o} />)
        ) : (
          <h3 style={{ margin: '50px 0', textAlign: 'center' }}>לא נמצאו משתמשים להזמנה</h3>
        )}
      </IonList>
    </>
  )
}

export default OrderUsersList;
