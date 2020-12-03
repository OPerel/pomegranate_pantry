import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonButtons,
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonIcon
} from '@ionic/react';

import { chevronForwardOutline } from 'ionicons/icons';

import OrderProductsList from '../../presentational/OrderProductsList';
import OrderUsersList from '../../presentational/OrderUsersList';
import './ViewOrder.css';

import { useAdminStateContext } from '../../context/AdminContextProvider';

const ViewOrder: React.FC = () => {

  const [tab, setTab] = useState<string>('users');

  const { state } = useAdminStateContext();
  const { order, orderUsers, orderProducts } = state;

  const history = useHistory();
  // console.log('provided order: ', order)

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons>
            <IonButton onClick={() => history.goBack()}>
              <IonIcon icon={chevronForwardOutline} slot="start"></IonIcon>
              הזמנות
            </IonButton>
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
          {tab === 'users' ? (
            <OrderUsersList orderUsers={orderUsers} />
          ) : (
            <OrderProductsList orderProducts={orderProducts} />
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ViewOrder;



