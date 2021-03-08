import React, { useEffect } from 'react';
import {
  IonToolbar,
  IonTitle,
  IonButton,
  IonList,
  // IonItem,
  IonListHeader,
  IonLabel,
  // IonIcon
} from '@ionic/react';
import { useUserStateContext, UserStateActionTypes } from '../../context/userState/UserContextProvider';
import { mapOrderStatusToText } from '../../../utils/mapOrderStatus';
import Fire from '../../../services/Firebase';
import { Order } from '../../../types/interfaces';
import { ORDER_STATUS } from '../../../constants';

import OpenOrderProductItem from '../OpenOrderProductItem/OpenOrderProductItem';

const OpenOrderView: React.FC<{ openOrder: Order | null }> = ({ openOrder }) => {

  const { state: { products, currentOrder }, dispatch } = useUserStateContext();

  useEffect(() => {
    dispatch({ type: UserStateActionTypes.FETCH });
    Fire.getProducts(productsObj => {
      dispatch({ type: UserStateActionTypes.SET_PRODUCTS, payload: productsObj });
    });
  }, [dispatch]);

  const productsList = Object.keys(products).map(key => ({
    ...products[key],
    _id: key
  }));

  if (!openOrder) {
    return <h3 data-testid="no-open-order-msg">אין הזמנה פתוחה כרגע</h3>
  }

  return (
    <div>
      <IonToolbar className="order-header">
        <IonTitle size="small" data-testid="open-order-title">
          {mapOrderStatusToText(openOrder.status)}
          {openOrder.status === ORDER_STATUS.OPEN && ` | נסגרת ב - ${openOrder.closingTime.toLocaleDateString('he', { timeZone: 'Israel' })}`}
        </IonTitle>
        {currentOrder && <IonButton slot="end">ההזמנה שלי</IonButton>}
      </IonToolbar>

      <IonList>
        <IonListHeader className="ion-text-center">
          <IonLabel>שם</IonLabel>
          <IonLabel>כמות</IonLabel>
          <IonLabel>הוסף</IonLabel>
        </IonListHeader>
        {productsList.map(product => <OpenOrderProductItem key={product._id} product={product} />)}
      </IonList>
    </div>
  )
}

export default OpenOrderView;
