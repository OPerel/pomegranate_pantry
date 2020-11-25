import OrderListItem from '../../presentational/OrderListItem/OrderListItem';
import React from 'react';
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

import { useAdminStateContext } from '../../context/AdminContextProvider'

const Home: React.FC = () => {

  const { state } = useAdminStateContext();
  console.log('Order state: ', state)

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
          {state.orders.map(p => <OrderListItem key={p._id} order={p} />)}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Home;
