import React from 'react';

import { IonList } from '@ionic/react';

import { OrderProduct } from '../../../types/interfaces';

import OrderProductsListItem from '../OrderProductsListItem/OrderProductsListItem';
import ListHeader from '../../common/ListHeader/ListHeader';

interface PropsTypes {
  orderProducts: OrderProduct[]
}

const OrderProductsList: React.FC<PropsTypes> = ({ orderProducts }) => (
  <IonList role="order-products-list">
    <h2>רשימת מוצרים</h2>
    <ListHeader headersList={['מוצר', 'כמות', 'חסר', 'מחיר ליחידה', 'סה"כ', '']} />
    {orderProducts.length > 0 ? (
      orderProducts.map(o => <OrderProductsListItem key={o.productRef} orderProduct={o} />)
    ) : (
      <h3 style={{ margin: '50px 0', textAlign: 'center' }}>לא נמצאו מוצרים להזמנה</h3>
    )}
  </IonList>
)

export default OrderProductsList;