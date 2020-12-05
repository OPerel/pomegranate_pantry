import React, { useState, useEffect } from 'react';
import { useHistory, RouteComponentProps } from 'react-router-dom';
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

import OrderProductsList from '../../presentational/OrderProductsList/OrderProductsList';
import OrderUsersList from '../../presentational/OrderUsersList';
import './ViewOrder.css';

import { useAdminStateContext, ActionTypes } from '../../context/AdminContextProvider';
import Fire from '../../../services/Firebase';

const ViewOrder: React.FC<RouteComponentProps<{ id: string }>> = ({ match }) => {

  const { id: orderId } = match.params;

  const [tab, setTab] = useState<string>('users');

  const { state, dispatch } = useAdminStateContext();
  const { order } = state;

  const history = useHistory();

  useEffect(() => {
    dispatch({ type: ActionTypes.FETCH })
    Fire.orderListener(orderId, order => {
      dispatch({ type: ActionTypes.SET_ORDER, payload: order })
    })
  }, [orderId, dispatch])
  // console.log('viewOrder state: ', state)

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
            <OrderUsersList />
          ) : (
            <OrderProductsList />
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ViewOrder;



