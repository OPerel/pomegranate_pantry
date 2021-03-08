import React, { useState } from 'react';

import {
  IonItem,
  IonGrid,
  IonCol,
  IonRow,
  IonButton,
  IonLabel,
  IonInput,
  IonIcon
} from '@ionic/react';
import { chevronDownOutline, chevronUpOutline } from 'ionicons/icons';

import Fire from '../../../services/Firebase';
import { OrderProduct } from '../../../types/interfaces';
import { ORDER_STATUS } from '../../../constants';
import { useAdminStateContext } from '../../context/adminState/AdminContextProvider';

interface OrderProductListItemProps {
  orderProduct: OrderProduct;
}

const ProductOrderListItem: React.FC<OrderProductListItemProps> = ({ orderProduct }) => {

  const { state: { order, users, products } } = useAdminStateContext();

  let orderUsers;
  if (order) {
    orderUsers = order.orderUsers;
  }
  const { productRef } = orderProduct;

  const [itemOpen, setItemOpen] = useState<boolean>(false);
  const [priceInput, setPriceInput] = useState<number>();

  /**
   * for each row I need:
   * 1. the Product object for the row itself
   * 2. the OrderUsers containing the Product, and the user's location, for the row's details dropdown
   */

  const orderUsersWithProduct = orderUsers?.filter(orderUser => {
    const orderUserProductsRefs = orderUser.products?.map(p => p.productRef);
    return orderUserProductsRefs?.includes(orderProduct.productRef);
  });

  const orderProductLocations: {
    ta: number, ph: number
  } | undefined = orderUsersWithProduct?.reduce((acc, orderUser) => {
    const { location } = users[orderUser.userRef];
    if (location === 'TA') {
      return { ...acc, ta: acc.ta += orderUser.products.find(p => {
        return p.productRef === orderProduct.productRef
      })?.qty as number }
    } else {
      return { ...acc, ph: acc.ph += orderUser.products.find(p => {
        return p.productRef === orderProduct.productRef
      })?.qty as number }
    }
  }, { ta: 0, ph: 0 });

  return Object.keys(products).length > 0 ? (
    <>
      <IonItem role="order-product-list-item">
        <IonGrid>
          <IonRow>
            <IonCol><p>{products[productRef].name}</p></IonCol>
            <IonCol><p>{orderProduct.totalQty}</p></IonCol>
            <IonCol><p>{orderProduct.missing}</p></IonCol>
            <IonCol>
              <IonItem  className="final-price">
                <IonInput
                  type="number"
                  value={priceInput || orderProduct.price}
                  disabled={!(order?.status === ORDER_STATUS.SHOPPING)}
                  onIonChange={e => setPriceInput(Number(e.detail.value))}
                />
              </IonItem>
            </IonCol>
            <IonCol>
              <IonButton
                disabled={!priceInput}
                onClick={() => Fire.updateEntry('orderProducts', orderProduct._id, {
                  price: priceInput
                })}
              >
                <IonLabel>קבע מחיר</IonLabel>
              </IonButton>
            </IonCol>
            <IonCol><p>{orderProduct.price * orderProduct.totalQty}</p></IonCol>
            <IonCol>
              <IonButton
                fill="clear"
                onClick={() => setItemOpen(!itemOpen)}
              >
                <IonIcon icon={itemOpen ? chevronUpOutline : chevronDownOutline} />
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonItem>
      {itemOpen && orderProductLocations ? (
        <div style={{ padding: '2%', backgroundColor: 'lightgray' }}>
          <h4 style={{ marginTop: '0' }}>כמות לפי מיקום</h4>
          <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
            <h3>תל אביב - <b>{orderProductLocations.ta}</b></h3>
            <h3>פרדס חנה - <b>{orderProductLocations.ph}</b></h3>
          </div>
        </div>
      ) : null}
    </>
  ) : null;
};

export default ProductOrderListItem;
