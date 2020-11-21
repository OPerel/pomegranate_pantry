import React, { useState } from 'react';
import {
  IonBackButton,
  IonButtons,
  IonButton,
  IonContent,
  IonHeader,
  IonList,
  IonItem,
  IonPage,
  IonToolbar,
  useIonViewWillEnter
} from '@ionic/react';

import UserOrderListItem from '../../presentational/UserOrderListItem/UserOrderListItem';
import { RouteComponentProps } from 'react-router';
import './ViewOrder.css';

import { Order, getOrder } from '../../../data/orders'; 
import { UserOrder, getOrderUsers } from '../../../data/userOrders';
import { OrderProduct, getOrderProducts } from '../../../data/orderProduct';

interface ViewOrderProps extends RouteComponentProps<{ id: string; }> { }

const ViewOrder: React.FC<ViewOrderProps> = ({ match }) => {

  const [order, setOrder] = useState<Order>();
  const [orderUsers, setOrderUsers] = useState<UserOrder[]>();
  const [orderProducts, setOrderProduct] = useState<OrderProduct[]>();

  const [tab, setTab] = useState<string>('users');

  useIonViewWillEnter(() => {
    const { id: orderId } = match.params;
    const order = getOrder(orderId);
    setOrder(order);

    const orderUsers = getOrderUsers(orderId);
    setOrderUsers(orderUsers);

    const orderProducts = getOrderProducts(orderId);
    setOrderProduct(orderProducts);
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
          <nav style={{ display: 'flex', borderBottom: '1px solid' }}>
            <IonButton onClick={() => setTab('users')} disabled={tab === 'users'} expand="full">משתמשים</IonButton>
            <IonButton onClick={() => setTab('products')} disabled={tab === 'products'} expand="full">מוצרים</IonButton>
          </nav>
        </div>

        <div>
          <div>
            {tab === 'users' ? (
              <OrderUsersList orderUsers={orderUsers as UserOrder[]} />
            ) : (
              <OrderProductsList orderProducts={orderProducts as OrderProduct[]} />
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
);

const OrderProductsList = ({ orderProducts }: { orderProducts: OrderProduct[] }) => (
  <IonList>
    <h2>רשימת מוצרים</h2>
    {orderProducts ? orderProducts.map(o => <IonItem key={o.product}>{o.product}</IonItem>) : <div>Order not found</div>}
  </IonList>
)