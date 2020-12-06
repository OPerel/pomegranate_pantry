import React, { useEffect } from 'react';

import {
  IonList,
  IonLabel,
  IonListHeader,
  IonSpinner
} from '@ionic/react';

import { OrderProduct } from '../../../types/interfaces';

import ProductOrderListItem from '../ProductOrderListItem';
import Fire from '../../../services/Firebase';
import { useAdminStateContext, AdminStateActionTypes } from '../../context/adminState/AdminContextProvider';

// interface OrderProductsListPropsTypes {
//   orderProducts: OrderProduct[]
// }
const OrderProductsList: React.FC = () => {

  const { state: { loading, order, orderProducts }, dispatch } = useAdminStateContext();

  useEffect(() => {
    if (order) {
      dispatch({ type: AdminStateActionTypes.FETCH })
      Fire.orderProductsCollectionListener(order._id, orderProducts => {
        dispatch({ type: AdminStateActionTypes.SET_ORDER_PRODUCTS, payload: orderProducts });
      });
      return () => Fire.orderProductsOff(order._id);
    }
  }, [order, dispatch]);

  return (
    <IonList>
      <h2>רשימת מוצרים</h2>
      <IonListHeader>
        <IonLabel>מוצר</IonLabel>
        <IonLabel>כמות</IonLabel>
        <IonLabel>חסר</IonLabel>
        <IonLabel>סה"כ</IonLabel>
        <IonLabel>מחיר סופי</IonLabel>
        <IonLabel></IonLabel>
      </IonListHeader>
      {loading ? (
        <IonSpinner color="primary" style={{ display: 'block', margin: '50px auto' }}/>
      ) : (
        orderProducts.map(o => <ProductOrderListItem key={o.product} orderProduct={o} />)
      )}
    </IonList>
  )
}

export default OrderProductsList;