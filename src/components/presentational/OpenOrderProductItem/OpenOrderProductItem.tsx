import React, { useState } from 'react';
import {
  IonItem,
  IonGrid,
  IonCol,
  IonRow,
  IonIcon,
  IonInput,
  IonAlert,
  IonButton
} from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import { useUserStateContext } from '../../context/userState/UserContextProvider';
import Fire from '../../../services/Firebase';
import { Product } from '../../../types/interfaces';
import { ORDER_STATUS } from '../../../constants';

const OpenOrderProductItem: React.FC<{ product: Product }> = ({ product }) => {

  const { state: { currentOrder, openOrder } } = useUserStateContext();
  const [productQty, setProductQty] = useState<any>();
  const [qtyAlert, setQtyAlert] = useState<boolean>(false);

  const currentOrderProduct = currentOrder?.products?.find(p => p.productRef === product._id);
  const missing = openOrder?.orderProducts.find(p => p.productRef === product._id)?.missing;

  const handleAddProductClick = () => {
    if (openOrder?.status === ORDER_STATUS.COMPLETION && productQty > (missing as number)) {
      setQtyAlert(true);
      return;
    }
    const newOrderProduct = {
      orderRef: openOrder?._id as string,
      productRef: product._id as string,
      currentOrder: currentOrder ? currentOrder._id as string : null,
      qty: Number(productQty)
    };

    Fire.addProductToOrder(newOrderProduct);
  }

  return (
    <>
      <IonItem
        color={currentOrderProduct ? 'favorite' : ''}
        data-testid="open-order-product-item"
        >
        <IonGrid>
          <IonRow className="ion-text-center">
            <IonCol>{product.name}</IonCol>
            <IonCol>
              <IonItem>
                <IonInput
                  type="number"
                  placeholder={currentOrderProduct?.qty.toString()}
                  value={productQty}
                  onIonChange={e => setProductQty(e.detail.value)}
                  role="order-product-qty-input"
                  />
              </IonItem>
            </IonCol>
            <IonCol className="ion-text-center">
              <IonButton
                disabled={!productQty}
                onClick={handleAddProductClick}
                role="add-product-to-order-button"
                >
                <IonIcon icon={addOutline} />
              </IonButton>
            </IonCol>
            <IonCol role="missing-product-qty">{missing || ''}</IonCol>
          </IonRow>
        </IonGrid>
      </IonItem>

      <IonAlert
        isOpen={qtyAlert}
        onDidDismiss={() => setQtyAlert(false)}
        buttons={['OK']}
        message={'בזמן ההשלמות ההזמנה מוגבלת לכמות החסרה: ' + missing}
        data-testid="qty-above-missing"
      />
    </>
  )
}

export default OpenOrderProductItem;
