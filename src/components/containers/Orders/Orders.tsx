import React from 'react';
import {
  IonContent,
  IonHeader,
  IonList,
  IonButtons,
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

import { useAdminStateContext } from '../../context/adminState/AdminContextProvider';
import OrderListItem from '../../presentational/OrderListItem/OrderListItem';
import { ORDER_STATUS } from '../../../constants';
import Fire from '../../../services/Firebase';

const Orders: React.FC = () => {

  const { state: { orders, loading } } = useAdminStateContext();

  const [showDateModal, setShowDateModal] = React.useState<boolean>(false);
  const [dateValue, setDateValue] = React.useState<string | null | undefined>(null);

  // const refresh = (e: CustomEvent) => {
  //   setTimeout(() => {
  //     e.detail.complete();
  //   }, 3000);
  // };

  const allOrdersAreClosed = orders.every(order => order.status === ORDER_STATUS.CLOSED);

  const addOrder = async (): Promise<void> => {
    if (dateValue) {
      try {
        const res = await Fire.addNewOrder(new Date(dateValue));
        console.log('New order added: ', res);
      } catch (err) {
        console.log('Error adding new order: ', err);
      }
    }
  }

  return (
    <IonContent fullscreen data-testid="admin-orders-list">
      {/* <IonRefresher slot="fixed" onIonRefresh={refresh}>
        <IonRefresherContent></IonRefresherContent>
      </IonRefresher> */}

      <IonHeader>
        <IonToolbar color="light">
          <IonTitle color="primary" size="large" slot="start">
            הזמנות
          </IonTitle>

          <IonLabel slot="end">
            <IonButton
              disabled={!allOrdersAreClosed}
              onClick={() => setShowDateModal(true)}
              data-testid="add-order-button"
            >
              <IonIcon slot="start" icon={addOutline} />הזמנה חדשה
            </IonButton>
          </IonLabel>
        </IonToolbar>
      </IonHeader>

      <IonList>
        <IonListHeader>
          <IonLabel>תאריך</IonLabel>
          <IonLabel>סה"כ</IonLabel>
          <IonLabel>סטטוס</IonLabel>
        </IonListHeader>
        {!loading ? (
          orders.length > 0 ? (
            orders.map(p => <OrderListItem key={p._id} order={p} />)
          ) : <h3 style={{ margin: '50px 0', textAlign: 'center' }}>לא נמצאו הזמנות</h3>
        ) : <IonSpinner color="primary" style={{ display: 'block', margin: '50px auto' }}/>}
      </IonList>

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
        <IonButtons>
          <IonButton onClick={addOrder}>הוסף הזמנה</IonButton>
          <IonButton onClick={() => setShowDateModal(false)}>ביטול</IonButton>
        </IonButtons>
      </IonModal>
    </IonContent>
  );
};

export default Orders;
