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
  IonSpinner,
  IonModal,
  IonDatetime
} from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import './Orders.css';

import { useAdminStateContext, addNewOrder } from '../../context/AdminContextProvider';
import OrderListItem from '../../presentational/OrderListItem/OrderListItem';
// import { Order } from '../../../types/interfaces';

const Orders: React.FC = () => {

  const { state: { orders, loading } } = useAdminStateContext();
  // console.log('Order state: ', state)

  const [showDateModal, setShowDateModal] = React.useState<boolean>(false);
  const [dateValue, setDateValue] = React.useState<string | null | undefined>(null);

  // const refresh = (e: CustomEvent) => {
  //   setTimeout(() => {
  //     e.detail.complete();
  //   }, 3000);
  // };

  const addOrder = (): void => {
    if (dateValue) {
      addNewOrder(new Date(dateValue));
    }
  }

  return (
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
      <IonTitle color="primary" style={{ padding: '3% 3% 0 0', borderBottom: '1px solid' }}>הזמנות</IonTitle>
      <IonList>
        <IonListHeader>
          <IonLabel>תאריך</IonLabel>
          <IonLabel>סה"כ</IonLabel>
          <IonLabel>שולם</IonLabel>
        </IonListHeader>
        {!loading ? (
          orders.length > 0 ? (
            orders.map(p => <OrderListItem key={p._id} order={p} />) 
          ) : <h3 style={{ margin: '50px 0', textAlign: 'center' }}>לא נמצאו הזמנות</h3>
        ) : <IonSpinner color="primary" style={{ display: 'block', margin: '50px auto' }}/>}
      </IonList>
      <IonLabel>
        <IonButton onClick={() => setShowDateModal(true)} data-testid="add-order-button">
          <IonIcon slot="start" icon={addOutline} />הזמנה חדשה
        </IonButton>
      </IonLabel>

      <IonModal isOpen={showDateModal} backdropDismiss={false} data-testid="date-modal">
        <h3>בחר תאריך סיום</h3>
        <IonLabel>
          בחר תאריך
          <IonDatetime
            displayFormat="DD MM YYYY"
            placeholder="Select Date"
            value={dateValue}
            onIonChange={e => setDateValue(e.detail.value)}
          ></IonDatetime>
        </IonLabel>
        <IonButton onClick={addOrder}>הוסף הזמנה</IonButton>
        <IonButton onClick={() => setShowDateModal(false)}>ביטול</IonButton>
      </IonModal>
    </IonContent>
  );
};

export default Orders;
