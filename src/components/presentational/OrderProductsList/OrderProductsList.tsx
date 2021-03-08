import React from 'react';

import {
  IonList,
  IonLabel,
  IonListHeader,
} from '@ionic/react';

import { OrderProduct } from '../../../types/interfaces';

import OrderProductsListItem from '../OrderProductsListItem/OrderProductsListItem';

const OrderProductsList: React.FC<{ orderProducts: OrderProduct[] }> = ({ orderProducts }) => {

  return (
    <IonList role="order-products-list">
      <h2>רשימת מוצרים</h2>
      <IonListHeader>
        <IonLabel>מוצר</IonLabel>
        <IonLabel>כמות</IonLabel>
        <IonLabel>חסר</IonLabel>
        <IonLabel>מחיר ליחידה</IonLabel>
        <IonLabel>סה"כ</IonLabel>
        <IonLabel></IonLabel>
      </IonListHeader>
      {orderProducts.length > 0 ? (
        orderProducts.map(o => <OrderProductsListItem key={o.productRef} orderProduct={o} />)
      ) : (
        <h3 style={{ margin: '50px 0', textAlign: 'center' }}>לא נמצאו מוצרים להזמנה</h3>
      )}
    </IonList>
  )
}

export default OrderProductsList;