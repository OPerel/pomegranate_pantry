import React, { useState, useEffect } from 'react';

import {
  IonItem,
  IonGrid,
  IonCol,
  IonRow,
  // IonList,
  IonButton,
  // IonLabel,
  IonInput,
  IonIcon
} from '@ionic/react';
import { chevronDownOutline, chevronUpOutline } from 'ionicons/icons'

import { OrderProduct, Order } from '../../../types/interfaces';
import { ORDER_STATUS } from '../../../constants';
import { useAdminStateContext } from '../../context/adminState/AdminContextProvider';

interface OrderProductListItemProps {
  orderProduct: OrderProduct;
}

const ProductOrderListItem: React.FC<OrderProductListItemProps> = ({ orderProduct }) => {

  const [itemOpen, setItemOpen] = useState<boolean>(false);
  const { state: { order, users, products } } = useAdminStateContext();
  const { orderUsers } = order as Order;
  const { productRef } = orderProduct;
  /**
   * for each row I need:
   * 1. the Product object for the row itself
   * 2. the OrderUsers containing the Product, and the user's location, for the row's details dropdown
   */

  const orderUsersWithProduct = orderUsers.filter(orderUser => {
    const orderUserProductsRefs = orderUser.products?.map(p => p.productRef);
    return orderUserProductsRefs?.includes(orderProduct.productRef);
  });

  const orderProductLocations: { ta: number, ph: number } = orderUsersWithProduct.reduce((acc, orderUser) => {
    const { location } = users[orderUser.userRef];
    if (location === 'TA') {
      return { ...acc, ta: acc.ta += orderUser.products.find(p => p.productRef === orderProduct.productRef)?.qty as number}
    } else {
      return { ...acc, ph: acc.ph += orderUser.products.find(p => p.productRef === orderProduct.productRef)?.qty as number}      
    }
  }, { ta: 0, ph: 0 });

  return (
    <>
      <IonItem>
        <IonGrid>
          <IonRow>
            <IonCol><p>{products[productRef].name}</p></IonCol>
            <IonCol><p>{orderProduct.totalQty}</p></IonCol>
            <IonCol><p>{orderProduct.missing}</p></IonCol>
            <IonCol>
              <IonItem  className="final-price">
                <IonInput
                  type="number"
                  value={orderProduct.price}
                  disabled={!(order?.status === ORDER_STATUS.SHOPPING)} 
                />
              </IonItem>
            </IonCol>
            <IonCol><p>{orderProduct.price * orderProduct.totalQty}</p></IonCol>
            <IonCol>
              <IonButton fill="clear" onClick={() => setItemOpen(!itemOpen)} data-testid="product-order-list-item">
                <IonIcon icon={itemOpen ? chevronUpOutline : chevronDownOutline} />
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonItem>
      {itemOpen ? (
        <div style={{ padding: '2%', backgroundColor: 'lightgray' }}>
          <h4 style={{ marginTop: '0' }}>כמות לפי מיקום</h4>
          <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
            <h3>תל אביב - <b>{orderProductLocations.ta}</b></h3>
            <h3>פרדס חנה - <b>{orderProductLocations.ph}</b></h3>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ProductOrderListItem;
