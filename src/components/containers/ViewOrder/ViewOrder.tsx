import React, { useState, useEffect } from 'react';
import {
  IonBackButton,
  IonButtons,
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
} from '@ionic/react';

import { RouteComponentProps } from 'react-router';

import OrderProductsList from '../../presentational/OrderProductsList';
import OrderUsersList from '../../presentational/OrderUsersList';
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

  useEffect(() => {
    const { id: orderId } = match.params;
    const order = getOrder(orderId);
    setOrder(order);

    const orderUsers = getOrderUsers(orderId);
    setOrderUsers(orderUsers);

    const orderProducts = getOrderProducts(orderId);
    setOrderProduct(orderProducts);
  }, [match.params]);

  return (
    <IonPage>
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
          {tab === 'users' && orderUsers ? (
            <OrderUsersList orderUsers={orderUsers} />
          ) : (
            orderProducts && <OrderProductsList orderProducts={orderProducts} />
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ViewOrder;



