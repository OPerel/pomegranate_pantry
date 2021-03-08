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
    <IonItem data-testid="products-list-item">
      <IonGrid>
        <IonRow>
          <IonCol role="product-item-name"><h3>{product.name}</h3></IonCol>
          <IonCol role="product-item-minQty"><h4>{product.minQty}</h4></IonCol>
          <IonCol role="product-item-qtyUnit"><h4>{product.qtyUnit}</h4></IonCol>
        </IonRow>
      </IonGrid>
    </IonItem>
  )
}

export default ProductsListItem;