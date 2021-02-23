import React, { useState } from 'react';

import {
  IonItem,
  IonGrid,
  IonCol,
  IonRow,
  IonList,
  IonListHeader,
  IonLabel,
  IonIcon,
  IonButton
} from '@ionic/react';
import { chevronDownOutline, chevronUpOutline, closeOutline, checkmarkOutline } from 'ionicons/icons';

import { useAdminStateContext } from '../../context/adminState/AdminContextProvider';
import { OrderUser, User } from '../../../types/interfaces';

import Fire from '../../../services/Firebase';

// import { getUser } from '../../../data/users';
import { getProductsById } from '../../../data/products';

interface OrderUserListItemProps {
  orderUser: OrderUser;
}

const OrderUsersListItem: React.FC<OrderUserListItemProps> = ({ orderUser }) => {

  const [itemOpen, setItemOpen] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<User>({} as User);
  const { state: { order } } = useAdminStateContext();

  /**
 * for each row I need:
 * 1. the User object for the row itself
 * 2. all the OrderUsers' Products for the row's details dropdown
 */
  React.useEffect(() => {
    Fire.getUser(orderUser.userRef, user => {
      setUserInfo(user)
    });

    return () => Fire.userOff(orderUser.userRef);
  }, [orderUser.userRef])

  return (
    <>
      <IonItem>
        <IonGrid>
          <IonRow>
            <IonCol><p>{userInfo.name}</p></IonCol>
            <IonCol><p>{userInfo.location === 'TA' ? 'תל אביב' : 'פרדס חנה'}</p></IonCol>
            <IonCol><p>{orderUser.totalPrice}</p></IonCol>
            <IonCol>
              <IonButton
                fill="outline"
                disabled={order?.open}
                color={!order?.open && !orderUser.payed ? 'danger' : 'primary'}
                onClick={order ? () => {
                  Fire.updateOrderPayedStatus(order._id, orderUser._id);
                } : () => {}}
              >
                <IonIcon icon={orderUser.payed ? checkmarkOutline : closeOutline} />
              </IonButton>
            </IonCol>
            <IonCol>
              <IonButton fill="clear" onClick={() => setItemOpen(!itemOpen)} data-testid="order-user-list-item">
                <IonIcon icon={itemOpen ? chevronUpOutline : chevronDownOutline} />
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonItem>
      {itemOpen ? (
        <IonList>
          <IonListHeader className="nested-list">
            <IonLabel>מוצר</IonLabel>
            <IonLabel>מחיר</IonLabel>
            <IonLabel>כמות</IonLabel>
            <IonLabel>סה"כ</IonLabel>
          </IonListHeader>
          {orderUser.products?.map(({ product, qty }) => (
            <IonItem key={product}>
              <IonGrid>
                <IonRow onClick={() => setItemOpen(!itemOpen)}>
                  <IonCol><p>{getProductsById(product)?.name}</p></IonCol>
                  <IonCol><p>{getProductsById(product)?.price}</p></IonCol>
                  <IonCol><p>{qty}</p></IonCol>
                  <IonCol><p>{qty * (getProductsById(product)?.price as number)}</p></IonCol>
                </IonRow>
              </IonGrid>
            </IonItem>
          ))}
        </IonList>
      ) : null}
    </>
  );
};

export default OrderUsersListItem;
