import React from 'react';
import {
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  // IonRefresher,
  // IonRefresherContent,
  IonTitle,
  IonToolbar,
  IonListHeader,
  IonLabel,
  IonButton,
  IonIcon,
  IonSpinner,
  IonModal,
  IonItem,
  IonInput,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';
import { addOutline } from 'ionicons/icons';
// import './Orders.css';

import { useAdminStateContext  } from '../../context/AdminContextProvider';
import ProductListItem from '../../presentational/ProductsListItem';

import Fire from '../../../services/Firebase';
// import OrderListItem from '../../presentational/OrderListItem/OrderListItem';
// import { Order } from '../../../types/interfaces';

interface ProductFormState {
  name: string,
  price: number,
  minQty: number,
  qtyUnit: 'unit' | 'Kg'
}

type ProductFormAction =
| { type: 'name', payload: string }
| { type: 'price', payload: number }
| { type: 'minQty', payload: number }
| { type: 'qtyUnit', payload: 'unit' | 'Kg' };

// State
const initialState: ProductFormState = {
  name: '',
  price: 0,
  minQty: 0,
  qtyUnit: 'unit'
}

const reducer = (state: ProductFormState, action: ProductFormAction): ProductFormState => {
  switch (action.type) {
    case 'name':
      return { ...state, name: action.payload };
    case 'price':
      return { ...state, price:  action.payload };
    case 'minQty':
      return { ...state, minQty: action.payload };
    case 'qtyUnit':
      return { ...state, qtyUnit: action.payload };
    default:
      return state;
  }
}

const Products: React.FC = () => {

  const { state: { products, loading } } = useAdminStateContext();

  const [showProductForm, setShowProductForm] = React.useState<boolean>(false);
  const [{ name, price, minQty, qtyUnit }, dispatch] = React.useReducer(reducer, initialState);
  // console.log({ name, price, minQty, qtyUnit })

  const addProduct = async (): Promise<void> => {
    const product = {
      _id: '', name, price, minQty, qtyUnit
    }
    try {
      const res = await Fire.addNewProduct(product);
      console.log('product res: ', res);
      setShowProductForm(false);
    } catch (err) {
      console.log('Error adding product: ', err)
    }
  }

  return (
    <IonContent fullscreen>
      {/* <IonRefresher slot="fixed" onIonRefresh={refresh}>
        <IonRefresherContent></IonRefresherContent>
      </IonRefresher> */}

      {/* <IonHeader collapse="condense">
        <IonToolbar>
          <IonTitle size="large">
            הזמנות
          </IonTitle>
        </IonToolbar>
      </IonHeader> */}
      <IonTitle color="primary" style={{ padding: '3% 3% 0 0', borderBottom: '1px solid' }}>מוצרים</IonTitle>
      <IonList>
        <IonListHeader>
          <IonLabel>שם</IonLabel>
          <IonLabel>מחיר</IonLabel>
          <IonLabel>כמות מינימום</IonLabel>
          <IonLabel>סוג יחידה</IonLabel>
        </IonListHeader>
        {!loading ? (
          products.length > 0 ? (
            products.map(p => <ProductListItem key={p._id} product={p} />) 
          ) : <h3 style={{ margin: '50px 0', textAlign: 'center' }}>לא נמצאו מוצרים</h3>
        ) : <IonSpinner color="primary" style={{ display: 'block', margin: '50px auto' }}/>}
      </IonList>
      <IonLabel>
        <IonButton onClick={() => setShowProductForm(true)} data-testid="add-product-button">
          <IonIcon slot="start" icon={addOutline} />הוסף מוצר
        </IonButton>
      </IonLabel>
      
      <IonModal isOpen={showProductForm} backdropDismiss={false}>product details
        <form>
          <IonLabel>
            שם
            <IonItem>
              <IonInput type="text" value={name} onIonChange={e => dispatch({ type: 'name', payload: e.detail.value as string })}></IonInput>
            </IonItem>
          </IonLabel>
          {/* <IonItemDivider /> */}

          <IonLabel>
            מחיר
            <IonItem>
              <IonInput type="number" value={price} onIonChange={e => dispatch({ type: 'price', payload: Number(e.detail.value) })}></IonInput>
            </IonItem>
          </IonLabel>
          
          {/* <IonItemDivider /> */}

          <IonLabel>
            כמות מינימום
            <IonItem>
              <IonInput type="number" value={minQty} onIonChange={e => dispatch({ type: 'minQty', payload: Number(e.detail.value) })}></IonInput>
            </IonItem>
          </IonLabel>
          {/* <IonItemDivider /> */}

          <IonLabel>
            סוג יחידה
            <IonItem>
              <IonSelect interface="popover" value={qtyUnit} onIonChange={e => dispatch({ type: 'qtyUnit', payload: e.detail.value as "unit" | "Kg" })}>
                <IonSelectOption value="unit">יחידה</IonSelectOption>
                <IonSelectOption value="Kg">ק"ג</IonSelectOption>
              </IonSelect>
            </IonItem>
          </IonLabel>

          <IonButton onClick={addProduct}>הוסף מוצר</IonButton>
          <IonButton onClick={() => setShowProductForm(false)}>ביטול</IonButton>
          {/* <IonItemDivider /> */}
        </form>
      </IonModal>
    </IonContent>
  );
};

export default Products;