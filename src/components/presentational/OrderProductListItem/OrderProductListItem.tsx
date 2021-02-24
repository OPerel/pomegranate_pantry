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

import { OrderProduct, Product, Order } from '../../../types/interfaces';
import { ORDER_STATUS } from '../../../constants';
import { useAdminStateContext } from '../../context/adminState/AdminContextProvider';

import Fire from '../../../services/Firebase';

interface OrderProductListItemProps {
  orderProduct: OrderProduct;
}

const ProductOrderListItem: React.FC<OrderProductListItemProps> = ({ orderProduct }) => {

  const [itemOpen, setItemOpen] = useState<boolean>(false);
  const { state } = useAdminStateContext();
  const { order, users } = state;
  const { orderUsers } = order as Order;
  /**
   * for each row I need:
   * 1. the Product object for the row itself
   * 2. the OrderUsers containing the Product, and the user's location, for the row's details dropdown
   */

  const [product, setProduct] = useState<Product>({} as Product);

  useEffect(() => {
    const getProduct = async (): Promise<void> => {
      const product = await Fire.getProduct(orderProduct.productRef);
      setProduct(product);
    }
    getProduct();
  }, [orderProduct.orderRef, orderProduct.productRef]);

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
            <IonCol><p>{product?.name}</p></IonCol>
            <IonCol><p>{orderProduct.totalQty}</p></IonCol>
            <IonCol><p>{orderProduct.missing}</p></IonCol>
            {/* <IonCol><p>{orderProduct.fixedTotalPrice}</p></IonCol> */}
            <IonCol><IonItem disabled={order?.status !== ORDER_STATUS.SHOPPING} className="final-price"><IonInput type="number" /></IonItem></IonCol>
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
