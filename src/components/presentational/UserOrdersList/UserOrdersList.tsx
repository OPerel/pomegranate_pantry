import React from 'react';
import { OrderUser } from '../../../types/interfaces';

const UserOrdersList: React.FC<{ userOrders: OrderUser[] }> = ({ userOrders }) => {
  
  return (
    <div data-testid="old-user-orders">
      {userOrders.map(order => (
        <p key={order._id}>{order._id} | {order.orderRef}</p>
      ))}
    </div>
  )
}

export default UserOrdersList;
