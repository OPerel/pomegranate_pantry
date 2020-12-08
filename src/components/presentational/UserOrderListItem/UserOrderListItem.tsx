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
import { UserOrder } from '../../../types/interfaces';

import Fire from '../../../services/Firebase';

import { getUser } from '../../../data/users';
import { getProductsById } from '../../../data/products';
// import './UserOrderListItem.css';

interface UserOrderListItemProps {
  userOrder: UserOrder;
}

const UserOrderListItem: React.FC<UserOrderListItemProps> = ({ userOrder }) => {

  const [itemOpen, setItemOpen] = useState<boolean>(false);
  // const [userProducts, setUserProducts] = useState<Product[]>([]);
  const { state: { order } } = useAdminStateContext();

  /**
 * for each row I need:
 * 1. the User object for the row itself
 * 2. all the UserOrder's Products for the row's details dropdown
 */

  return (
    <>
      <IonItem>
        <IonGrid>
          <IonRow>
            <IonCol>{getUser(userOrder.userRef).name}</IonCol>
            <IonCol>{getUser(userOrder.userRef)?.location === 'TA' ? 'תל אביב' : 'פרדס חנה'}</IonCol>
            <IonCol>{userOrder.totalPrice}</IonCol>
            <IonCol>
              <IonButton
                fill="outline"
                disabled={order?.open}
                color={!order?.open && !userOrder.payed ? 'danger' : 'primary'}
                onClick={() => {
                  Fire.updateEntry('userOrders', userOrder._id, { ...userOrder, payed: !userOrder.payed });
                }}
              >
                <IonIcon icon={userOrder.payed ? checkmarkOutline : closeOutline} />
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
          {userOrder.products?.map(({ product, qty }) => (
            <IonItem key={product}>
              <IonGrid>
                <IonRow onClick={() => setItemOpen(!itemOpen)}>
                  <IonCol><h3>{getProductsById(product)?.name}</h3></IonCol>
                  <IonCol><h4>{getProductsById(product)?.price}</h4></IonCol>
                  <IonCol><h4>{qty}</h4></IonCol>
                  <IonCol><h4>{qty * (getProductsById(product)?.price as number)}</h4></IonCol>
                </IonRow>
              </IonGrid>
            </IonItem>
          ))}
        </IonList>
      ) : null}
    </>
  );
};

export default UserOrderListItem;
