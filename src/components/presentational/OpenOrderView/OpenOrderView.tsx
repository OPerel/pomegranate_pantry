import React, { useState, useEffect } from 'react';
import {
  IonToolbar,
  IonTitle,
  IonButton,
  IonList,
  IonItem,
  IonListHeader,
  IonLabel,
  IonModal,
  IonIcon,
  IonContent
} from '@ionic/react';
import { trash } from 'ionicons/icons'
import { useUserStateContext, UserStateActionTypes } from '../../context/userState/UserContextProvider';
import { mapOrderStatusToText } from '../../../utils/mapOrderStatus';
import Fire from '../../../services/Firebase';
import { Order } from '../../../types/interfaces';
import { ORDER_STATUS } from '../../../constants';

import OpenOrderProductItem from '../OpenOrderProductItem/OpenOrderProductItem';

const OpenOrderView: React.FC<{ openOrder: Order | null }> = ({ openOrder }) => {

  const { state: { products, currentOrder }, dispatch } = useUserStateContext();
  const [myOrderModalIsOpen, setMyOrderModalIsOpen] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    dispatch({ type: UserStateActionTypes.FETCH });
    const subscription = Fire.productsCollectionListener(productsObj => {
      if (isMounted) {
        dispatch({ type: UserStateActionTypes.SET_PRODUCTS, payload: productsObj });
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe()
    }
  }, [dispatch]);

  const productsList = Object.keys(products).map(key => ({
    ...products[key],
    _id: key
  }));

  if (!openOrder) {
    return <h3 data-testid="no-open-order-msg">אין הזמנה פתוחה כרגע</h3>
  }

  return (
    <div>
      <IonToolbar className="order-header">
        <IonTitle size="small" data-testid="open-order-title">
          {mapOrderStatusToText(openOrder.status)}
          {openOrder.status === ORDER_STATUS.OPEN && ` | נסגרת ב - ${openOrder.closingTime.toLocaleDateString('he', { timeZone: 'Israel' })}`}
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
        <IonListHeader className="ion-text-center">
          <IonLabel>שם</IonLabel>
          <IonLabel>כמות</IonLabel>
          <IonLabel>הוסף</IonLabel>
          <IonLabel>חסר</IonLabel>
        </IonListHeader>
        {productsList.map(product => <OpenOrderProductItem key={product._id} product={product} />)}
      </IonList>

      <IonModal
        isOpen={myOrderModalIsOpen}
        data-testid="my-order-modal"
        onDidDismiss={() => setMyOrderModalIsOpen(false)}
      >
        <IonToolbar>
          <IonTitle>המוצרים שלי</IonTitle>
        </IonToolbar>
        <IonContent>
          <IonList>
            {currentOrder?.products.map(product => (
              <IonItem key={product.productRef} data-testid="my-order-product-item">
                <IonLabel>{products[product.productRef].name} - {product.qty}</IonLabel>
                <IonButton
                  slot="end"
                  color="danger"
                  fill="outline"
                  className="delete-product-btn"
                  >
                  <IonIcon icon={trash} slot="icon-only"/>
                </IonButton>
              </IonItem>
            ))}
          </IonList>
        </IonContent>

        <IonButton
          onClick={() => setMyOrderModalIsOpen(false)}
          role="close-my-order-modal"
        >
          סגור
        </IonButton>
      </IonModal>
    </div>
  )
}

export default OpenOrderView;
