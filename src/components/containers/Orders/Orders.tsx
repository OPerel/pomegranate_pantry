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
import Fire from '../../../services/Firebase';

import ListHeader from '../../common/ListHeader/ListHeader';

const Orders: React.FC = () => {

  const { state: { orders, loading } } = useAdminStateContext();

  const [showDateModal, setShowDateModal] = React.useState<boolean>(false);
  const [dateValue, setDateValue] = React.useState<string | null | undefined>(null);

  // const refresh = (e: CustomEvent) => {
  //   setTimeout(() => {
  //     e.detail.complete();
  //   }, 3000);
  // };

  const allOrdersAreClosed = orders.every(order => !order.active);

  const addOrder = async (): Promise<void> => {
    if (dateValue) {
      try {
        const res = await Fire.addNewOrder(new Date(dateValue));
        setShowDateModal(false);
        console.log('New order added: ', res);
      } catch (err) {
        console.log('Error adding new order: ', err);
      }
    } else {
      alert('בחר תאריך סיום על מנת ליצור הזמנה חדשה')
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
        <ListHeader name="Orders" headersList={['תאריך', 'סה"כ', 'סטטוס']} />
        {!loading ? (
          orders.length > 0 ? (
            orders.map(p => <OrderListItem key={p._id} order={p} />)
          ) : <h3 style={{ margin: '50px 0', textAlign: 'center' }}>לא נמצאו הזמנות</h3>
        ) : <IonSpinner color="primary" style={{ display: 'block', margin: '50px auto' }}/>}
      </IonList>

      <IonModal
        isOpen={showDateModal}
        data-testid="date-modal"
        onDidDismiss={() => setShowDateModal(false)}
      >
        <h3>בחר תאריך סיום</h3>
        <IonLabel>
          בחר תאריך
          <IonDatetime
            displayFormat="D.M.YYYY"
            pickerFormat="DD MMM"
            // doneText="בחר תאריך"
            // cancelText="ביטול"
            placeholder="Select Date"
            value={dateValue}
            onIonChange={e => setDateValue(e.detail.value)}
            data-testid="end-order-date-selector"
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
