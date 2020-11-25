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
  IonLabel,
  IonButton,
  IonIcon,
} from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import './Orders.css';

import { useAdminStateContext, addNewOrder, ActionTypes } from '../../context/AdminContextProvider';
// import { Order } from '../../../types/interfaces';

const Home: React.FC = () => {

  const { state, dispatch } = useAdminStateContext();
  // console.log('Order state: ', state)

  // const refresh = (e: CustomEvent) => {
  //   setTimeout(() => {
  //     e.detail.complete();
  //   }, 3000);
  // };

  const addOrder = (): void => {
    const today = new Date();
    const monthFromToday = new Date().setDate(today.getDate() + 30);
    const newOrder = {
      _id: '2',
      open: true, 
      openToUsers: true,
      createdAt: today,
      closingTime: new Date(monthFromToday),
      totalPrice: 0,
      payed: false
    }
    addNewOrder(newOrder);
    dispatch({ type: ActionTypes.ADD_ORDER, payload: newOrder })
  } 

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
        <IonLabel>
          <IonButton onClick={addOrder} data-testid="add-order-button">
            <IonIcon icon={addOutline} />
          </IonButton>
          הזמנה חדשה
        </IonLabel>
      </IonContent>
    </IonPage>
  );
};

export default Home;
