import React from 'react';
import {
  IonToolbar,
  IonTitle,
  IonList,
  IonItem,
  IonListHeader,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';
import { useUserStateContext } from '../../context/userState/UserContextProvider';
import { mapOrderStatusToText } from '../../../utils/mapOrderStatus';
import { Order } from '../../../types/interfaces';

const OrderInProgressView: React.FC<{ openOrder: Order }> = ({ openOrder }) => {
  const { state: { products, currentOrder } } = useUserStateContext();
  return (
    <div data-testid="order-in-progress-view">
      <IonToolbar className="order-header">
        <IonTitle size="small">המוצרים שלי - ההזמנה {mapOrderStatusToText(openOrder.status)}</IonTitle>
      </IonToolbar>
      <IonList>
        <IonListHeader className="ion-text-center" color="medium">
          <IonLabel>שם</IonLabel>
          <IonLabel>כמות</IonLabel>
          <IonLabel>מחיר</IonLabel>
          <IonLabel>סה"כ</IonLabel>
        </IonListHeader>
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

