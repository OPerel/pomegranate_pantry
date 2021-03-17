import React from 'react';
import {
  IonToolbar,
  IonTitle,
  IonList,
  IonItem,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';
import { useUserStateContext } from '../../context/userState/UserContextProvider';
import { mapOrderStatusToText } from '../../../utils/mapOrderStatus';
import { Order } from '../../../types/interfaces';

import ListHeader from '../../common/ListHeader/ListHeader';

const OrderInProgressView: React.FC<{ openOrder: Order }> = ({ openOrder }) => {
  const { state: { products, currentOrder } } = useUserStateContext();
  return (
    <div data-testid="order-in-progress-view">
      <IonToolbar className="order-header">
        <IonTitle size="small">המוצרים שלי - ההזמנה {mapOrderStatusToText(openOrder.status)}</IonTitle>
      </IonToolbar>
      <IonList>
        <ListHeader
          headersList={['שם', 'כמות', 'מחיר', 'סה"כ']}
          color="medium"
          className="ion-text-center"
        />
        {currentOrder?.products.map(product => {
          const orderProductPrice = openOrder.orderProducts.find(p => {
            return p.productRef === product.productRef
          })?.price;
          return (
            <IonItem key={product.productRef} data-testid="my-order-product-item">
              <IonGrid>
                <IonRow className="ion-text-center">
                  <IonCol>{products[product.productRef].name}</IonCol>
                  <IonCol>{product.qty}</IonCol>
                  <IonCol>{orderProductPrice || ''}</IonCol>
                  <IonCol>{orderProductPrice as number * product.qty || ''}</IonCol>
                </IonRow>
              </IonGrid>
            </IonItem>  
          )
        })}
      </IonList>
    </div>
  )
}

export default OrderInProgressView;

