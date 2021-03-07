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
  minQty: number,
  qtyUnit: 'unit' | 'Kg'
}

type ProductFormAction =
| { type: 'name', payload: string }
| { type: 'minQty', payload: number }
| { type: 'qtyUnit', payload: 'unit' | 'Kg' };

// State
const initialState: ProductFormState = {
  name: '',
  minQty: 0,
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
        name, minQty, qtyUnit
      }
      try {
        const res = await Fire.addNewProduct(product);
        console.log('product res: ', res);
        setShowProductForm(false);
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
            <IonButton onClick={() => setShowProductForm(true)} data-testid="add-product-button">
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
      
      <IonModal isOpen={showProductForm}>
        <IonTitle>הכנס פרטי מוצר</IonTitle>
        <form>
          <IonLabel>
            שם
            <IonItem>
              <IonInput
                type="text"
                value={name}
                onIonChange={e => dispatch({ type: 'name', payload: e.detail.value as string })}
                role="product-name-input"
              ></IonInput>
            </IonItem>
          </IonLabel>
          
          {/* <IonItemDivider /> */}

          <IonLabel>
            כמות מינימום
            <IonItem>
              <IonInput
                type="number"
                value={minQty}
                onIonChange={e => dispatch({ type: 'minQty', payload: Number(e.detail.value) })}
                role="product-minQty-input"
              ></IonInput>
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

          <IonButton onClick={addProduct} disabled={!newProductFormIsValid}>הוסף מוצר</IonButton>
          <IonButton onClick={() => setShowProductForm(false)}>ביטול</IonButton>
          {/* <IonItemDivider /> */}
        </form>
      </IonModal>
    </IonContent>
  );
};

export default Products;
