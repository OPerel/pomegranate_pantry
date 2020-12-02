import React from 'react';

import {
  IonButtons,
  IonButton,
  IonContent,
  IonTitle,
  IonHeader,
  IonPage,
  IonToolbar,
} from '@ionic/react';

import Orders from '../Orders';
import Products from '../Products';

const Admin: React.FC = () => {

  const [tab, setTab] = React.useState<string>('orders');
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>אדמין</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonToolbar color="dark">
        <IonButtons>
          <IonButton onClick={() => setTab('orders')} disabled={tab === 'orders'} data-testid="admin-orders-button">הזמנות</IonButton>
          <IonButton onClick={() => setTab('products')} disabled={tab === 'products'} data-testid="admin-products-button">מוצרים</IonButton>
        </IonButtons>
      </IonToolbar>
      
      
      {tab === 'orders' ? (
        <Orders />
      ) : (
        <Products />
      )}
    </IonPage>
  )
}

export default Admin;
