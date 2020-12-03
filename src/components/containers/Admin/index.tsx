import React from 'react';
import { Switch } from 'react-router-dom';

import { RouteWithSubRoutes } from '../../../App';

import {
  IonButtons,
  IonButton,
  // IonContent,
  IonTitle,
  IonHeader,
  IonPage,
  IonToolbar,
} from '@ionic/react';

import Orders from '../Orders';
import Products from '../Products';

const Admin: React.FC<{routes: any[]}> = ({ routes }) => {
  console.log('Admin routes: ', routes)
  const [tab, setTab] = React.useState<string>('orders');
  return (
    <>
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

      <Switch>
        {routes.map((route, i) => (
          <RouteWithSubRoutes key={i} {...route} />
        ))}
      </Switch>
    </>
  )
}

export default Admin;
