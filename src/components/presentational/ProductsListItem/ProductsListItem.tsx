import React from 'react';

import {
  IonItem,
  IonGrid,
  IonCol,
  IonRow,
} from '@ionic/react';

import { Product } from '../../../types/interfaces';

const ProductsListItem: React.FC<{product: Product}> = ({ product }) => {
  return (
    <IonItem>
      <IonGrid>
        <IonRow>
          <IonCol><h3>{product.name}</h3></IonCol>
          <IonCol><h4>{product.minQty}</h4></IonCol>
          <IonCol><h4>{product.qtyUnit}</h4></IonCol>
        </IonRow>
      </IonGrid>
    </IonItem>
  )
}

export default ProductsListItem;