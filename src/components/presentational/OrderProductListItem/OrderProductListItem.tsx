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

import { OrderProduct, User, OrderUser, Product, Order } from '../../../types/interfaces';
import { ORDER_STATUS } from '../../../constants';
import { useAdminStateContext } from '../../context/adminState/AdminContextProvider';

import Fire from '../../../services/Firebase';

interface OrderProductListItemProps {
  orderProduct: OrderProduct;
}

const ProductOrderListItem: React.FC<OrderProductListItemProps> = ({ orderProduct }) => {

  const [itemOpen, setItemOpen] = useState<boolean>(false);
  const { state: { order } } = useAdminStateContext();
  const { orderUsers } = order as Order;
  /**
   * for each row I need:
   * 1. the Product object for the row itself
   * 2. the OrderUsers containing the Product, and the user's location, for the row's details dropdown
   */

  const [product, setProduct] = useState<Product>({} as Product);
  const [users, setUsers] = useState<User[]>([]);
  // const [orderUsers, setOrderUsers] = useState<OrderUser[]>([]);

  

  useEffect(() => {
    const getProduct = async (): Promise<void> => {
      const product = await Fire.getProduct(orderProduct.productRef);
      setProduct(product);
    }
  
    const getUsers = async (): Promise<void> => {
      const users = await Fire.getUsers();
      setUsers(users);
    }
  
    // const getOrderUsers = async () => {
    //   const orderUsers = await Fire.getOrderUsers(orderProduct.orderRef);
    //   setOrderUsers(orderUsers);
    // }
    getProduct();
    getUsers();
    // getOrderUsers();
  }, [orderProduct.orderRef, orderProduct.productRef]);

  const orderUsersWithProduct = orderUsers.filter(uo => uo.products?.map(p => p.productRef).includes(orderProduct.productRef));

  const orderProductLocations: { ta: number, ph: number } = orderUsersWithProduct.reduce((acc, orderUsers) => {
    const { location } = (users as any)[orderUsers.userRef];
    if (location === 'TA') {
      return { ...acc, ta: acc.ta += orderUsers.products.find(p => p.productRef === orderProduct.productRef)?.qty as number}
    } else {
      return { ...acc, ph: acc.ph += orderUsers.products.find(p => p.productRef === orderProduct.productRef)?.qty as number}      
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
