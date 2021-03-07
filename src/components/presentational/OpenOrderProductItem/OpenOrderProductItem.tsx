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
import Fire from '../../../services/Firebase';
import { Product } from '../../../types/interfaces';

const OpenOrderProductItem: React.FC<{ product: Product }> = ({ product }) => {

  const { state: { currentOrder, openOrder } } = useUserStateContext();
  const [productQty, setProductQty] = useState<number>();

  const currentOrderProduct = currentOrder?.products?.find(p => p.productRef === product._id);

  const handleAddProductClick = () => {
    const newOrderProduct = {
      orderRef: openOrder?._id as string,
      productRef: product._id as string,
      currentOrder: currentOrder ? currentOrder._id as string : null,
      qty: productQty as number
    };

    Fire.addProductToOrder(newOrderProduct);
  }

  return (
    <IonItem color={currentOrderProduct ? 'medium' : ''} data-testid="open-order-product-item">
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
              disabled={!productQty}
              onClick={handleAddProductClick}
            >
              <IonIcon icon={addOutline} />
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonItem>
  )
}

export default OpenOrderProductItem;
