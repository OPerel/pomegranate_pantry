import React from 'react';
import { IonList } from '@ionic/react';
import { OrderUser } from '../../../types/interfaces';

import OrderUsersListItem from '../OrderUsersListItem/OrderUsersListItem';
import ListHeader from '../../common/ListHeader/ListHeader';

/**
 * Unused at the moment
 */
const UserOrdersList: React.FC<{ userOrders: OrderUser[] }> = ({ userOrders }) => {
  
  return (
    <IonList data-testid="old-user-orders">
      <ListHeader
        name="UserOrders"
        headersList={['שם', 'מקום', 'סה"כ', 'שולם', '']}
      />
      {userOrders.map(order => (
        <OrderUsersListItem key={order._id} orderUser={order} />
      ))}
    </IonList>
  )
}

export default UserOrdersList;
