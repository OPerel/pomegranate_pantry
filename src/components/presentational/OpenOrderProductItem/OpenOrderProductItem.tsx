import React, { useState } from 'react';
import {
  IonItem,
  IonGrid,
  IonCol,
  IonRow,
  IonIcon,
  IonInput,
  IonLabel,
  IonButton
} from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import { Product } from '../../../types/interfaces';

const OpenOrderProductItem: React.FC<{ product: Product }> = ({ product }) => {

  const [productQty, setProductQty] = useState<number>();

  return (
    <>
      <IonItem>
        <IonGrid>
          <IonRow>
            <IonCol>{product.name}</IonCol>
            <IonCol className="ion-text-center">
              <IonItem>
                <IonInput
                  type="number"
                  value={productQty}
                  onIonChange={e => setProductQty(Number(e.detail.value))}
                />
              </IonItem>
            </IonCol>
            <IonCol className="ion-text-center">
              <IonButton>
                <IonIcon icon={addOutline} />
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonItem>
    </>
  )
}

export default OpenOrderProductItem;