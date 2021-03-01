import React, { useState } from 'react';
import {
  IonItem,
  IonGrid,
  IonCol,
  IonRow,
  IonIcon,
  IonInput,
  // IonLabel,
  IonButton
} from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import { useUserStateContext } from '../../context/userState/UserContextProvider';
import { Product } from '../../../types/interfaces';

const OpenOrderProductItem: React.FC<{ product: Product }> = ({ product }) => {

  const { state: { currentOrder, user, openOrder, orderProducts } } = useUserStateContext();
  const [productQty, setProductQty] = useState<number>();

  const currentOrderProduct = currentOrder.products?.find(p => p.productRef === product._id);
  const cuurentProductOrderProduct = orderProducts.find(p => p.productRef === product._id);
  
  // handling user adding a product
  // requires updating / creating both an OrderUser and an OrderProduct (trx)
  const handleAddProductClick = () => {
    if (currentOrder) {

    } else {
      const newOrderUser = {
        products: [
          {
            productRef: product._id,
            qty: productQty
          }
        ], 
        userRef: user?._id, 
        orderRef: openOrder?._id, 
        payed: false
      }
    }
  }

  return (
    <>
      <IonItem color={currentOrderProduct ? 'medium' : ''}>
        <IonGrid>
          <IonRow>
            <IonCol>{product.name}</IonCol>
            <IonCol className="ion-text-center">
              <IonItem>
                <IonInput
                  type="number"
                  placeholder={currentOrderProduct?.qty.toString()}
                  value={productQty}
                  onIonChange={e => setProductQty(Number(e.detail.value))}
                />
              </IonItem>
            </IonCol>
            <IonCol className="ion-text-center">
              <IonButton
                onClick={handleAddProductClick}
              >
                <IonIcon icon={addOutline} />
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonItem>
    </>
  )
}

export default OpenOrderProductItem;
