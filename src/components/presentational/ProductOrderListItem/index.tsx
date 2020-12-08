import React, { useState } from 'react';

import {
  IonItem,
  IonGrid,
  IonCol,
  IonRow,
  // IonList,
  // IonListHeader,
  // IonLabel,
  IonInput,
  IonIcon
  } from '@ionic/react';
  import { chevronDownOutline, chevronUpOutline } from 'ionicons/icons'

import { OrderProduct } from '../../../types/interfaces';

import { getProductsById } from '../../../data/products';
import { getOrderUsers } from '../../../data/userOrders';
import { getUser } from '../../../data/users';

interface OrderProductListItemProps {
  orderProduct: OrderProduct;
}

const ProductOrderListItem: React.FC<OrderProductListItemProps> = ({ orderProduct }) => {

  const [itemOpen, setItemOpen] = useState<boolean>(false);

  /**
   * for each row I need:
   * 1. the Product object for the row itself
   * 2. the UserOrders containing the Product, and the user's location, for the row's details dropdown
   */
  const userOrdersWithProduct = getOrderUsers(orderProduct.order).filter(uo => uo.products.map(p => p.product).includes(orderProduct.product));

  const orderProductLocations: { ta: number, ph: number } = userOrdersWithProduct.reduce((acc, userOrder) => {
    const { location } = getUser(userOrder.userRef);
    if (location === 'TA') {
      return { ...acc, ta: acc.ta += userOrder.products.find(p => p.product === orderProduct.product)?.qty as number}
    } else {
      return { ...acc, ph: acc.ph += userOrder.products.find(p => p.product === orderProduct.product)?.qty as number}      
    }
  }, { ta: 0, ph: 0 });

  return (
    <>
      <IonItem button onClick={() => setItemOpen(!itemOpen)} data-testid="product-order-list-item">
        <IonGrid>
          <IonRow>
            <IonCol><h4>{getProductsById(orderProduct.product)?.name}</h4></IonCol>
            <IonCol><h4>{orderProduct.totalQty}</h4></IonCol>
            <IonCol><h4>{orderProduct.missing}</h4></IonCol>
            <IonCol><h4>{orderProduct.fixedTotalPrice}</h4></IonCol>
            <IonCol><IonInput type="number" className="final-price" /></IonCol>
            <IonCol><h4><IonIcon icon={itemOpen ? chevronUpOutline : chevronDownOutline}></IonIcon></h4></IonCol>
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
