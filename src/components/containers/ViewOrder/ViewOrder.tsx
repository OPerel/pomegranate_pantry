import React, { useState } from 'react';
import {
  IonBackButton,
  IonButtons,
  IonButton,
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonToolbar,
  useIonViewWillEnter
} from '@ionic/react';

import UserOrderListItem from '../../presentational/UserOrderListItem/UserOrderListItem';
import { RouteComponentProps } from 'react-router';
import './ViewOrder.css';

import { UserOrder, getOrderUsers } from '../../../data/userOrders';
import { Order, getOrder } from '../../../data/orders'; 

interface ViewOrderProps extends RouteComponentProps<{ id: string; }> { }

const ViewOrder: React.FC<ViewOrderProps> = ({ match }) => {

  const [order, setOrder] = useState<Order>();
  const [orderUsers, setOrderUsers ] = useState<UserOrder[]>();

  const [tab, setTab] = useState<string>('users');

  useIonViewWillEnter(() => {
    const order = getOrder(match.params.id);
    setOrder(order);

    const orderUsers = getOrderUsers(match.params.id);
    setOrderUsers(orderUsers);
  });

  return (
    <IonPage id="view-message-page">
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons>
            <IonBackButton text="הזמנות" defaultHref="/home"></IonBackButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div style={{ textAlign: 'center', paddingTop: '20px', backgroundColor: 'lightgray' }}>
          {order?.createdAt.toDateString()} &nbsp; | &nbsp; {order?.openToUsers ? 'Open' : 'Close'} &nbsp; | &nbsp; {order?.closingTime.toDateString()}
          <nav style={{ display: 'flex' }}>
            <IonButton onClick={() => setTab('users')} disabled={tab === 'users'} expand="full">משתמשים</IonButton>
            <IonButton onClick={() => setTab('products')} disabled={tab === 'products'} expand="full">מוצרים</IonButton>
          </nav>
        </div>

        <div>
          <div>
            {tab === 'users' ? (
              <OrderUsersList orderUsers={orderUsers as UserOrder[]} />
            ) : (
              <h2>Order {order?._id} Products</h2>
            )}
          </div>
        </div>
          
      </IonContent>
    </IonPage>
  );
};

export default ViewOrder;

const OrderUsersList = ({ orderUsers }: { orderUsers: UserOrder[] }) => (
  <IonList>
    <h2>רשימת משתמשים</h2>
    {orderUsers ? orderUsers.map(o => <UserOrderListItem key={o._id} userOrder={o} />) : <div>Order not found</div>}
  </IonList>
)