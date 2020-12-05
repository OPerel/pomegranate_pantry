import React, { useState, useEffect } from 'react';
import { useHistory, RouteComponentProps } from 'react-router-dom';
import {
  IonButtons,
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonTitle,
  IonIcon
} from '@ionic/react';

import { chevronForwardOutline } from 'ionicons/icons';

import OrderProductsList from '../../presentational/OrderProductsList/OrderProductsList';
import OrderUsersList from '../../presentational/OrderUsersList';
import './ViewOrder.css';

import { useAdminStateContext, ActionTypes } from '../../context/adminState/AdminContextProvider';
import Fire from '../../../services/Firebase';

const ViewOrder: React.FC<RouteComponentProps<{ id: string }>> = ({ match }) => {

  const { id: orderId } = match.params;

  const [tab, setTab] = useState<string>('users');

  const { state, dispatch } = useAdminStateContext();
  const { order } = state;
  // const { createdAt } = order;

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
        <IonToolbar className="order-header">

          <nav slot="start">
            <IonButton onClick={() => setTab('users')} disabled={tab === 'users'}>משתמשים</IonButton>
            <IonButton onClick={() => setTab('products')} disabled={tab === 'products'}>מוצרים</IonButton>
          </nav>

          <IonTitle size="small">
            {`הזמנה ${order?.createdAt.getDate()}/${order?.createdAt.getMonth()}/${order?.createdAt.getFullYear()}`} &nbsp; | &nbsp;
            {order?.openToUsers ? 'הזמנה פעילה' : 'הזמנה סגורה'} &nbsp; | &nbsp;
            {`נסגר ב - ${order?.closingTime.getDate()}/${order?.closingTime.getMonth()}/${order?.closingTime.getFullYear()}`}
          </IonTitle>

          <IonButton color="danger" slot="primary">סגור הזמנה</IonButton>
        
        </IonToolbar>

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



