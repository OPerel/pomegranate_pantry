import React from 'react';
import {
  IonContent,
  IonHeader,
  IonList,
  IonTitle,
  IonToolbar,
  IonListHeader,
  IonLabel,
  IonButton,
  IonIcon,
  IonModal,
  IonItem,
  IonInput,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';
import { addOutline } from 'ionicons/icons';

import { useAdminStateContext  } from '../../context/adminState/AdminContextProvider';
import ProductListItem from '../../presentational/ProductsListItem/ProductsListItem';

import Fire from '../../../services/Firebase';

interface ProductFormState {
  name: string,
  minQty: any,
  qtyUnit: 'unit' | 'Kg'
}

type ProductFormAction =
| { type: 'name', payload: string }
| { type: 'minQty', payload: any }
| { type: 'qtyUnit', payload: 'unit' | 'Kg' };

// State
const initialState: ProductFormState = {
  name: '',
  minQty: undefined,
  qtyUnit: 'unit'
}

const reducer = (state: ProductFormState, action: ProductFormAction): ProductFormState => {
  switch (action.type) {
    case 'name':
      return { ...state, name: action.payload };
    case 'minQty':
      return { ...state, minQty: action.payload };
    case 'qtyUnit':
      return { ...state, qtyUnit: action.payload };
    default:
      return state;
  }
}

const Products: React.FC = () => {

  const { state: { products } } = useAdminStateContext();

  const [showProductForm, setShowProductForm] = React.useState<boolean>(false);
  const [{ name, minQty, qtyUnit }, dispatch] = React.useReducer(reducer, initialState);

  const addProduct = async (): Promise<void> => {
    if (newProductFormIsValid) {
      const product = {
        name,
        minQty: Number(minQty),
        qtyUnit
      }
      try {
        setShowProductForm(false);
        const res = await Fire.addNewProduct(product);
        console.log('product res: ', res);
      } catch (err) {
        console.log('Error adding product: ', err)
      }
    }
  }

  const newProductFormIsValid = name && minQty && qtyUnit;

  return (
    <IonContent fullscreen data-testid="admin-products-list">
      {/* <IonRefresher slot="fixed" onIonRefresh={refresh}>
        <IonRefresherContent></IonRefresherContent>
      </IonRefresher> */}

      <IonHeader>
        <IonToolbar color="light">
          <IonTitle color="primary" size="large" slot="start">
            מוצרים
          </IonTitle>

          <IonLabel slot="end">
            <IonButton onClick={() => setShowProductForm(true)} data-testid="open-new-product-modal">
              <IonIcon slot="start" icon={addOutline} />הוסף מוצר חדש
            </IonButton>
          </IonLabel>
        </IonToolbar>
      </IonHeader>

      <IonList>
        <IonListHeader>
          <IonLabel>שם</IonLabel>
          <IonLabel>כמות מינימום</IonLabel>
          <IonLabel>סוג יחידה</IonLabel>
        </IonListHeader>
        {Object.keys(products).map(productKey => <ProductListItem key={productKey} product={products[productKey]} />)}
      </IonList>
      
      <IonModal
        isOpen={showProductForm}
        onDidDismiss={() => setShowProductForm(false)}
        data-testid="add-product-modal"
      >
        <IonToolbar>
          <IonTitle>הכנס פרטי מוצר</IonTitle>
        </IonToolbar>
        <IonContent>
          <form>
            <IonLabel>
              שם
              <IonItem>
                <IonInput
                  type="text"
                  value={name}
                  onIonChange={e => dispatch({ type: 'name', payload: e.detail.value as string })}
                  role="product-name-input"
                />
              </IonItem>
            </IonLabel>
            
            {/* <IonItemDivider /> */}

            <IonLabel>
              כמות מינימום
              <IonItem>
                <IonInput
                  type="number"
                  value={minQty}
                  onIonChange={e => dispatch({ type: 'minQty', payload: e.detail.value })}
                  role="product-minQty-input"
                />
              </IonItem>
            </IonLabel>
            {/* <IonItemDivider /> */}

            <IonLabel>
              סוג יחידה
              <IonItem>
                <IonSelect
                  interface="popover"
                  value={qtyUnit}
                  onIonChange={e => dispatch({ type: 'qtyUnit', payload: e.detail.value as "unit" | "Kg" })}
                  role="product-qtyUnit-input"
                >
                  <IonSelectOption value="unit">יחידה</IonSelectOption>
                  <IonSelectOption value="Kg">ק"ג</IonSelectOption>
                </IonSelect>
              </IonItem>
            </IonLabel>
          </form>

            <IonButton
              onClick={addProduct}
              disabled={!newProductFormIsValid}
              role="add-product-to-db"
            >הוסף מוצר</IonButton>
            <IonButton onClick={() => setShowProductForm(false)}>ביטול</IonButton>
            {/* <IonItemDivider /> */}
        </IonContent>
      </IonModal>
    </IonContent>
  );
};

export default Products;
