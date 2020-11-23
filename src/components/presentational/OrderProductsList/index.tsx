import React from 'react';

import {
  IonList,
  IonLabel,
  IonListHeader
} from '@ionic/react';

import { OrderProduct } from '../../../types/interfaces';

import ProductOrderListItem from '../ProductOrderListItem';

interface OrderProductsListPropsTypes {
  orderProducts: OrderProduct[]
}
const OrderProductsList: React.FC<OrderProductsListPropsTypes> = ({ orderProducts }) => (
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
    {orderProducts?.map(o => <ProductOrderListItem key={o.product} orderProduct={o} />)}
  </IonList>
)

export default OrderProductsList;