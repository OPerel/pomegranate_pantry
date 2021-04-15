import React from 'react';

import { IonList, IonHeader, IonToolbar, IonTitle } from '@ionic/react';

import { OrderProduct } from '../../../types/interfaces';

import OrderProductsListItem from '../OrderProductsListItem/OrderProductsListItem';
import ListHeader from '../../common/ListHeader/ListHeader';

interface PropsTypes {
  orderProducts: OrderProduct[]
}

const OrderProductsList: React.FC<PropsTypes> = ({ orderProducts }) => (
  <>
    <IonHeader>
      <IonToolbar color="light">
        <IonTitle color="primary">
          רשימת מוצרים
        </IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonList role="order-products-list">
      <ListHeader
        name="OrderProducts"
        headersList={['כמות', 'חסר', 'מחיר ליחידה', '', 'סה"כ', '', '']}
      />
      {orderProducts.length > 0 ? (
        orderProducts.map(o => <OrderProductsListItem key={o.productRef} orderProduct={o} />)
      ) : (
        <h3 style={{ margin: '50px 0', textAlign: 'center' }}>לא נמצאו מוצרים להזמנה</h3>
      )}
    </IonList>
  </>
)

export default OrderProductsList;