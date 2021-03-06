import React, { useReducer, createContext, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Fire from '../../../services/Firebase';
import { Order, Product, User } from '../../../types/interfaces';

// Types
interface AdminState {
  loading: boolean,
  users: { [key: string]: User },
  orders: Order[],
  products: { [key: string]: Product },
  order: Order | null
}

export enum AdminStateActionTypes {
  FETCH = 'FETCH',
  SET_USERS = 'SET_USERS',
  SET_ORDERS = 'SET_ORDERS',
  SET_PRODUCTS = 'SET_PRODUCTS',
  SET_ORDER = 'SET_ORDER',
}

type AdminAction =
| { type: AdminStateActionTypes.FETCH, }
| { type: AdminStateActionTypes.SET_USERS, payload: { [key: string]: User } }
| { type: AdminStateActionTypes.SET_ORDERS, payload: Order[] }
| { type: AdminStateActionTypes.SET_PRODUCTS, payload: { [key: string]: Product } }
| { type: AdminStateActionTypes.SET_ORDER, payload: Order | null }

interface AdminStateProviderType {
  state: AdminState,
  dispatch: React.Dispatch<AdminAction>
}

// State
const initialState: AdminState = {
  loading: false,
  users: {},
  orders: [],
  products: {},
  order: null
}

const reducer = (state: AdminState, action: AdminAction): AdminState => {
  switch (action.type) {
    case AdminStateActionTypes.FETCH:
      return { ...state, loading: true };
    case AdminStateActionTypes.SET_USERS:
      return { ...state, loading: false, users: { ...action.payload } };
    case AdminStateActionTypes.SET_ORDERS:
      return { ...state, loading: false, orders: [ ...action.payload ] };
    case AdminStateActionTypes.SET_PRODUCTS:
      return { ...state, loading: false, products: { ...action.payload } };
    case AdminStateActionTypes.SET_ORDER:
      return { ...state, loading: false, order: action.payload };
    default:
      return state;
  }
}
  
// react context
const AdminStateContext = createContext<AdminStateProviderType>({ state: initialState, dispatch: () => {} });
export const useAdminStateContext = () => useContext(AdminStateContext);

// context provider HOC
const AdminStateProvider = <P extends {}>(Component: React.ComponentType<P>): React.FC<P> => {
  const WithAdminState: React.ComponentType<P> = (props) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { location: { pathname } } = useHistory();

    React.useEffect(() => {
      dispatch({ type: AdminStateActionTypes.FETCH })
      const ordersSubscription = Fire.ordersCollectionListener(orders => {
        dispatch({ type: AdminStateActionTypes.SET_ORDERS, payload: orders });
      });

      dispatch({ type: AdminStateActionTypes.FETCH })
      Fire.getUsers(users => {
        dispatch({ type: AdminStateActionTypes.SET_USERS, payload: users });
      });

      dispatch({ type: AdminStateActionTypes.FETCH })
      const productsSubscription = Fire.productsCollectionListener(products => {
        dispatch({ type: AdminStateActionTypes.SET_PRODUCTS, payload: products })
      });
  
      return () => {
        ordersSubscription.unsubscribe();
        productsSubscription.unsubscribe();
      }
    }, [dispatch]);

    React.useEffect(() => {
      let subscription: any;
      if (pathname.includes('order')) {
        const orderId = pathname.split('/')[3];
        dispatch({ type: AdminStateActionTypes.FETCH });
        subscription = Fire.orderListener(orderId, order => {
          dispatch({ type: AdminStateActionTypes.SET_ORDER, payload: order })
        });
      } else {
        dispatch({ type: AdminStateActionTypes.SET_ORDER, payload: null });
      }

      return () => {
        subscription?.unsubscribe();
      }
    }, [pathname])

    return Component ? (     // ternary return is fixing `Element type is invalid error on hot reloading`
      <AdminStateContext.Provider value={{ state, dispatch }}>
        <Component {...props} />
      </AdminStateContext.Provider>
    ) : null;
  }

  return WithAdminState;
}

export default AdminStateProvider;