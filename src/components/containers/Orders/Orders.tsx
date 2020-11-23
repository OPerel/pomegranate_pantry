import OrderListItem from '../../presentational/OrderListItem/OrderListItem';
import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  // IonRefresher,
  // IonRefresherContent,
  IonTitle,
  IonToolbar,
  IonListHeader,
  IonLabel
} from '@ionic/react';
import './Orders.css';

import { Order, getOrders } from '../../../data/orders';

const Home: React.FC = () => {

  const [orders, setOrders] = useState<Order[]>([]);

  React.useEffect(() => {
    const orders = getOrders();
    setOrders(orders);
  }, []);

  // const refresh = (e: CustomEvent) => {
  //   setTimeout(() => {
  //     e.detail.complete();
  //   }, 3000);
  // };

  return (
    <IonPage id="home-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>הזמנות</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {/* <IonRefresher slot="fixed" onIonRefresh={refresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher> */}

        {/* <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">
              הזמנות
            </IonTitle>
          </IonToolbar>
        </IonHeader> */}

        <IonList>
          <IonListHeader>
            <IonLabel>תאריך</IonLabel>
            <IonLabel>סה"כ</IonLabel>
            <IonLabel>שולם</IonLabel>
          </IonListHeader>
          {orders.map(p => <OrderListItem key={p._id} order={p} />)}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Home;
