import React, { useState } from 'react';

import {
  IonItem,
  IonGrid,
  IonCol,
  IonRow,
  IonList,
  IonListHeader,
  IonLabel,
  IonIcon
} from '@ionic/react';
import { chevronDownOutline, chevronUpOutline, closeOutline, checkmarkOutline } from 'ionicons/icons';

import { UserOrder } from '../../../types/interfaces';

import { getUser } from '../../../data/users';
import { getProductsById } from '../../../data/products';
// import './UserOrderListItem.css';

interface UserOrderListItemProps {
  userOrder: UserOrder;
}

const UserOrderListItem: React.FC<UserOrderListItemProps> = ({ userOrder }) => {

  const [itemOpen, setItemOpen] = useState<boolean>(false);
  // const [userProducts, setUserProducts] = useState<Product[]>([]);

  /**
 * for each row I need:
 * 1. the User object for the row itself
 * 2. all the UserOrder's Products for the row's details dropdown
 */

  return (
    <>
      <IonItem button onClick={() => setItemOpen(!itemOpen)} data-testid="order-user-list-item">
        <IonGrid>
          <IonRow>
            <IonCol><h4>{getUser(userOrder.userRef).name}</h4></IonCol>
            <IonCol><h4>{getUser(userOrder.userRef)?.location === 'TA' ? 'תל אביב' : 'פרדס חנה'}</h4></IonCol>
            <IonCol><h4>{userOrder.totalPrice}</h4></IonCol>
            <IonCol><h4><IonIcon icon={userOrder.payed ? checkmarkOutline : closeOutline}></IonIcon></h4></IonCol>
            <IonCol><h4><IonIcon icon={itemOpen ? chevronUpOutline : chevronDownOutline}></IonIcon></h4></IonCol>
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
            <IonItem>
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
