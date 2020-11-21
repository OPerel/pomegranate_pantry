import React, { useState } from 'react';

import {
  IonItem,
  IonGrid,
  IonCol,
  IonRow,
  // IonList,
  // IonListHeader,
  // IonLabel,
  IonIcon
  } from '@ionic/react';
  import { arrowDownCircleOutline, arrowUpCircleOutline } from 'ionicons/icons'

import { OrderProduct } from '../../../data/orderProduct';
import { getProductsById } from '../../../data/products';
import { getOrderUsers } from '../../../data/userOrders';
import { getUser } from '../../../data/users';

interface OrderProductListItemProps {
  orderProduct: OrderProduct;
}

const ProductOrderListItem: React.FC<OrderProductListItemProps> = ({ orderProduct }) => {

  const [itemOpen, setItemOpen] = useState<boolean>(false);

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
      <IonItem button onClick={() => setItemOpen(!itemOpen)}>
        <IonGrid>
          <IonRow>
            <IonCol><h3>{getProductsById(orderProduct.product)?.name}</h3></IonCol>
            <IonCol><h4>{orderProduct.totalQty}</h4></IonCol>
            <IonCol><h4>{orderProduct.missing}</h4></IonCol>
            <IonCol><h4>{orderProduct.fixedTotalPrice}</h4></IonCol>
            <IonCol><input /></IonCol>
            <IonCol><IonIcon icon={itemOpen ? arrowUpCircleOutline : arrowDownCircleOutline}></IonIcon></IonCol>
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
