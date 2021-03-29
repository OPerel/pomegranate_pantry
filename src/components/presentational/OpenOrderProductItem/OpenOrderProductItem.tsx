import React, { useState } from 'react';
import {
  IonItem,
  IonGrid,
  IonCol,
  IonRow,
  IonIcon,
  IonInput,
  IonAlert,
  IonButton,
  IonText
} from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import { useUserStateContext } from '../../context/userState/UserContextProvider';
import Fire from '../../../services/Firebase';
import { Product } from '../../../types/interfaces';
import { ORDER_STATUS, UNIT_TYPE } from '../../../constants';

const OpenOrderProductItem: React.FC<{ product: Product }> = ({ product }) => {

  const { state: { currentOrder, openOrder } } = useUserStateContext();
  const [productQty, setProductQty] = useState<any>();
  const [qtyAlert, setQtyAlert] = useState<boolean>(false);
  const [inputIsValid, setInputIsValid] = useState<{ valid: boolean, message: string }>({ valid: false, message: '' });

  const currentOrderProduct = currentOrder?.products?.find(p => p.productRef === product._id);
  const missing = openOrder?.orderProducts.find(p => p.productRef === product._id)?.missing;

  const handleInputChange = (val: any) => {
    validateQty(val);
    setProductQty(val);
  }

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
    setProductQty(null);
  }

  
  const validateQty = (val: any) => {
    let valid = product.qtyUnit === UNIT_TYPE.KG ? val % 0.5 === 0 : val % 1 === 0;
    valid = valid && val > 0;
    const message =  product.qtyUnit === UNIT_TYPE.KG
      ? 'כמות בכפולות של 0.5'
      : 'כמות בכפולות של 1'
    console.log('valid: ', valid);
    setInputIsValid({ valid, message });
  }

  console.log('inputIsValid: ', inputIsValid)

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
              <IonItem className={inputIsValid ? '' : 'input-invalid'}>
                <IonInput
                  id="product-qty"
                  type="number"
                  min="0"
                  name="productQty"
                  step={product.qtyUnit === UNIT_TYPE.KG ? '0.5' : '1'}
                  placeholder={currentOrderProduct?.qty.toString()}
                  value={productQty}
                  onIonChange={e => handleInputChange(e.detail.value)}
                  role="order-product-qty-input"
                />
              </IonItem>
            </IonCol>
            <IonCol className="ion-text-center">
              <IonButton
                disabled={productQty && inputIsValid.valid ? false : true}
                onClick={handleAddProductClick}
                role="add-product-to-order-button"
                >
                <IonIcon icon={addOutline} />
              </IonButton>
            </IonCol>
            <IonCol role="missing-product-qty">{missing || ''}</IonCol>
          </IonRow>
          {!inputIsValid.valid ? (
            <IonText color="danger" className="ion-padding-start ion-text-start">
              <small>{inputIsValid.message}</small>
            </IonText>
          ) : (
            <IonText><small>{inputIsValid.message}</small></IonText>
          )}
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
