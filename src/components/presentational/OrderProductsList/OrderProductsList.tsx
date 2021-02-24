import React from 'react';

import {
  IonList,
  IonLabel,
  IonListHeader,
} from '@ionic/react';

import { OrderProduct } from '../../../types/interfaces';

import OrderProductListItem from '../OrderProductListItem/OrderProductListItem';

const OrderProductsList: React.FC<{ orderProducts: OrderProduct[] }> = ({ orderProducts }) => {

  return (
    <IonList>
      <h2>רשימת מוצרים</h2>
      <IonListHeader>
        <IonLabel>מוצר</IonLabel>
        <IonLabel>כמות</IonLabel>
        <IonLabel>חסר</IonLabel>
        <IonLabel>מחיר סופי ליחידה</IonLabel>
        <IonLabel>סה"כ</IonLabel>
      </IonListHeader>
      {orderProducts.length > 0 ? (
        orderProducts.map(o => <OrderProductListItem key={o.productRef} orderProduct={o} />)
      ) : (
        <h3 style={{ margin: '50px 0', textAlign: 'center' }}>לא נמצאו מוצרים להזמנה</h3>
      )}
    </IonList>
  )
}

export default OrderProductsList;