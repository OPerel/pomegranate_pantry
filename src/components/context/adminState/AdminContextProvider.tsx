import React, { useReducer, createContext, useContext } from 'react';

import { Order, Product, User } from '../../../types/interfaces';

// Types
interface AdminState {
  loading: boolean,
  users: { [key: string]: User },
  orders: Order[],
  products: Product[],
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
| { type: AdminStateActionTypes.SET_PRODUCTS, payload: Product[] }
| { type: AdminStateActionTypes.SET_ORDER, payload: Order }

interface AdminStateProviderType {
  state: AdminState,
  dispatch: React.Dispatch<AdminAction>
}

// State
const initialState: AdminState = {
  loading: false,
  users: {},
  orders: [],
  products: [],
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
      return { ...state, loading: false, products: [ ...action.payload ] };
    case AdminStateActionTypes.SET_ORDER:
      return { ...state, loading: false, order: { ...action.payload } };
    default:
      return state;
  }
}
  
// react context
const AdminStateContext = createContext<AdminStateProviderType>({ state: initialState, dispatch: () => {} });
export const useAdminStateContext = () => useContext(AdminStateContext);

// context provider HOC
const AdminStateProvider = <P extends {}>(Component: React.ComponentType<P>): React.FC<P> => {
  const WithState: React.ComponentType<P> = (props) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
      <AdminStateContext.Provider value={{ state, dispatch }}>
        <Component {...props} />
      </AdminStateContext.Provider>
    )
  }

  return WithState;
}

export default AdminStateProvider;