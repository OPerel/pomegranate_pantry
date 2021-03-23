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

  const getPriceStr = (price: number | undefined) => {
    if (price) {
      return price.toLocaleString('he-IL', {
        style: 'currency',
        currency: 'ILS'
      });
    }
    return undefined;
  }

  return (
    <div data-testid="order-in-progress-view">
      <IonToolbar color="dark">
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
            <IonItem key={product.productRef} data-testid="order-in-progress-product-item">
              <IonGrid>
                <IonRow className="ion-text-center">
                  <IonCol>{products[product.productRef].name}</IonCol>
                  <IonCol>{product.qty}</IonCol>
                  <IonCol>{getPriceStr(orderProductPrice) || ''}</IonCol>
                  <IonCol>{getPriceStr(orderProductPrice as number * product.qty) || ''}</IonCol>
                </IonRow>
              </IonGrid>
            </IonItem>  
          )
        })}
      </IonList>

      {currentOrder?.totalPrice && (
        <IonTitle
          className="ion-text-center ion-padding"
          size="large"
          data-testid="user-order-total"
        >
          סה"כ {getPriceStr(currentOrder.totalPrice)}
        </IonTitle>
      )}
    </div>
  )
}

export default OrderInProgressView;

