import React, { useState, useEffect } from 'react';
import {
  IonToolbar,
  IonTitle,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonModal,
  IonIcon,
  IonContent,
  IonText,
  IonSpinner
} from '@ionic/react';
import { trash, chevronForwardOutline } from 'ionicons/icons'
import { useUserStateContext, UserStateActionTypes } from '../../context/userState/UserContextProvider';
import { mapOrderStatusToText, orderSeq } from '../../../utils/mapOrderStatus';
import Fire from '../../../services/Firebase';
import { Order, Product } from '../../../types/interfaces';
import { ORDER_STATUS } from '../../../constants';

import ListHeader from '../../common/ListHeader/ListHeader';
import OpenOrderProductItem from '../OpenOrderProductItem/OpenOrderProductItem';
import OrderInProgressView from '../OrderInProgressView/OrderInProgressView';

const OpenOrderView: React.FC<{ openOrder: Order | null }> = ({ openOrder }) => {

  const { state: { products, currentOrder, loading }, dispatch } = useUserStateContext();
  const [myOrderModalIsOpen, setMyOrderModalIsOpen] = useState<boolean>(false);

  const productsList = Object.keys(products).map(key => ({
    ...products[key],
    _id: key
  }));

  if (!openOrder) {
    return !loading ? (
      <h3 data-testid="no-open-order-msg">אין הזמנה פתוחה כרגע</h3>
      ) : (
      <IonSpinner />
    )
  }

  if (orderSeq(openOrder.status) > 1) {
    return <OrderInProgressView openOrder={openOrder} />;
  }

  let productsWithMissing: Product[] = []; 
  openOrder.orderProducts.forEach(product => {
    if (product.missing) {
      const productObj = {
        ...products[product.productRef],
        _id: product.productRef
      }
      productsWithMissing.push(productObj);
    }
  });

  return (
    <div>
      <IonToolbar className="order-header">
        <IonTitle size="small" data-testid="open-order-title">
          {mapOrderStatusToText(openOrder.status)}
          {` | נסגרת ב - ${openOrder.closingTime.toLocaleDateString('he', { timeZone: 'Israel' })}`}
        </IonTitle>
        {currentOrder && (
          <IonButton
            slot="end"
            role="my-order-button"
            onClick={() => setMyOrderModalIsOpen(!myOrderModalIsOpen)}
          >
            ההזמנה שלי
          </IonButton>
        )}
      </IonToolbar>

      <IonList>
        <ListHeader
          headersList={['שם', 'כמות', 'הוסף', 'חסר']}
          className="ion-text-center"
        />
        {openOrder.status !== ORDER_STATUS.COMPLETION ? (
          productsList.map(product => <OpenOrderProductItem key={product._id} product={product} />)
        ) : (
          productsWithMissing.map(product => <OpenOrderProductItem key={product._id} product={product} />)
        )}
      </IonList>

      {openOrder.status === ORDER_STATUS.COMPLETION && (
        <IonText color="danger" className="ion-text-center">
          <h5>שים לב: בזמן ההשלמות לא ניתן להסיר מוצרים מההזמנה!</h5>
        </IonText>
      )}

      <IonModal
        isOpen={myOrderModalIsOpen}
        data-testid="my-order-modal"
        onDidDismiss={() => setMyOrderModalIsOpen(false)}
      >
        <IonToolbar>
          <IonButton
            onClick={() => setMyOrderModalIsOpen(false)}
            slot="start"
            fill="clear"
            color="light"
            role="close-my-order-modal"
          >
            <IonIcon slot="icon-only" icon={chevronForwardOutline} />
          </IonButton>
          <IonTitle>המוצרים שלי</IonTitle>
        </IonToolbar>
        <IonContent>
          <IonList>
            {currentOrder?.products?.map(product => (
              <IonItem key={product.productRef} data-testid="my-order-product-item">
                <IonLabel>{products[product.productRef].name} - {product.qty}</IonLabel>
                <IonButton
                  slot="end"
                  color="danger"
                  fill="outline"
                  role="delete-order-product-button"
                  disabled={openOrder.status === ORDER_STATUS.COMPLETION}
                  onClick={() => {
                    Fire.deleteProductFromOrder(currentOrder._id, product.productRef)
                  }}
                >
                  <IonIcon icon={trash} slot="icon-only"/>
                </IonButton>
              </IonItem>
            ))}
          </IonList>
        </IonContent>
      </IonModal>
    </div>
  )
}

export default OpenOrderView;
