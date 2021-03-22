import React, { useState } from 'react';

import {
  IonItem,
  IonGrid,
  IonCol,
  IonRow,
  IonList,
  IonIcon,
  IonButton
} from '@ionic/react';
import { chevronDownOutline, chevronUpOutline, closeOutline, checkmarkOutline } from 'ionicons/icons';

import { useAdminStateContext } from '../../context/adminState/AdminContextProvider';
import { OrderUser } from '../../../types/interfaces';
import { ORDER_STATUS } from '../../../constants';
import ListHeader from '../../common/ListHeader/ListHeader';

import Fire from '../../../services/Firebase';

interface OrderUserListItemProps {
  orderUser: OrderUser;
}

const OrderUsersListItem: React.FC<OrderUserListItemProps> = ({ orderUser }) => {
  
  const [itemOpen, setItemOpen] = useState<boolean>(false);
  const { state: { order, users, products } } = useAdminStateContext();
  
  const userInfo = users[orderUser.userRef];

  return userInfo ? (
    <>
      <IonItem>
        <IonGrid>
          <IonRow onClick={() => setItemOpen(!itemOpen)}>
            <IonCol data-testid="order-user-name"><p>{userInfo.name}</p></IonCol>
            <IonCol><p>{userInfo.location === 'TA' ? 'תל אביב' : 'פרדס חנה'}</p></IonCol>
            <IonCol><p>{orderUser.totalPrice}</p></IonCol>
            <IonCol>
              <IonButton
                fill="outline"
                disabled={order?.status !== ORDER_STATUS.PAYING}
                color={order?.status === ORDER_STATUS.PAYING && !orderUser.payed ? 'danger' : 'primary'}
                role="update-order-user-payed"
                onClick={() => {
                  Fire.updateEntry('orderUsers', orderUser._id as string, {
                    payed: !orderUser.payed
                  });
                }}
              >
                <IonIcon icon={orderUser.payed ? checkmarkOutline : closeOutline} />
              </IonButton>
            </IonCol>
            <IonCol>
              <IonButton
                fill="clear"             
                data-testid="order-user-list-item"
              >
                <IonIcon icon={itemOpen ? chevronUpOutline : chevronDownOutline} />
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonItem>
      {itemOpen ? (
        <IonList className="nested-list" data-testid="order-user-item-details">
          <ListHeader headersList={['מוצר' , 'מחיר', 'כמות', 'סה"כ']}  className="nested-list" />
          {orderUser.products?.map(({ productRef, qty }) => {
            const orderProduct = order?.orderProducts.find(p => p.productRef === productRef);
            return (
              <IonItem key={productRef} color="light-shade" data-testid="order-user-product-list-item">
                <IonGrid>
                  <IonRow>
                    <IonCol><p>{products[productRef].name}</p></IonCol>
                    <IonCol><p>{orderProduct?.price}</p></IonCol>
                    <IonCol><p>{qty}</p></IonCol>
                    <IonCol role="product-total-price">
                      <p>
                        {orderProduct?.price && (qty * (orderProduct.price as number))}
                      </p>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonItem>
            )}
          )}
        </IonList>
      ) : null}
    </>
  ) : null;
};

export default OrderUsersListItem;
