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
import { arrowDownCircleOutline, arrowUpCircleOutline } from 'ionicons/icons';

import { UserOrder } from '../../../data/userOrders';
import { getUser } from '../../../data/users';
import { getProductsById } from '../../../data/products';
// import './UserOrderListItem.css';

interface UserOrderListItemProps {
  userOrder: UserOrder;
}

const UserOrderListItem: React.FC<UserOrderListItemProps> = ({ userOrder }) => {

  const [itemOpen, setItemOpen] = useState<boolean>(false);
  // const [userProducts, setUserProducts] = useState<Product[]>([]);

  return (
    <>
      <IonItem button onClick={() => setItemOpen(!itemOpen)}>
        <IonGrid>
          <IonRow>
            <IonCol><h3>{getUser(userOrder.userRef).name}</h3></IonCol>
            <IonCol><h4>{getUser(userOrder.userRef)?.location === 'TA' ? 'תל אביב' : 'פרדס חנה'}</h4></IonCol>
            <IonCol><h4>{userOrder.totalPrice}</h4></IonCol>
            <IonCol><h4>{userOrder.payed ? <span>&#10003;</span> : 'X'}</h4></IonCol>
            <IonCol><IonIcon icon={itemOpen ? arrowUpCircleOutline : arrowDownCircleOutline}></IonIcon></IonCol>
          </IonRow>
        </IonGrid>
      </IonItem>
      {itemOpen ? (
        <IonList style={{ backgroundColor: 'lightgray' }}>
          <IonListHeader>
            <IonLabel>מוצר</IonLabel>
            <IonLabel>מחיר</IonLabel>
            <IonLabel>כמות</IonLabel>
            <IonLabel>סה"כ</IonLabel>
          </IonListHeader>
          {userOrder.products.map(({ product, qty }) => (
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
