import React, { useReducer, createContext, useContext } from 'react';

import { Order, UserOrder, OrderProduct, Product, User } from '../../../types/interfaces';

// Types
interface AdminState {
  loading: boolean,
  users: User[],
  orders: Order[],
  products: Product[],
  order: Order | null,
  orderUsers: UserOrder[],
  orderProducts: OrderProduct[]
}

export enum AdminStateActionTypes {
  FETCH = 'FETCH',
  SET_USERS = 'SET_USERS',
  SET_ORDERS = 'SET_ORDERS',
  SET_PRODUCTS = 'SET_PRODUCTS',
  SET_ORDER = 'SET_ORDER',
  SET_ORDER_USERS = 'SET_ORDER_USERS',
  SET_ORDER_PRODUCTS = 'SET_ORDER_PRODUCTS',
}

type AdminAction =
| { type: AdminStateActionTypes.FETCH, }
| { type: AdminStateActionTypes.SET_USERS, payload: User[] }
| { type: AdminStateActionTypes.SET_ORDERS, payload: Order[] }
| { type: AdminStateActionTypes.SET_PRODUCTS, payload: Product[] }
| { type: AdminStateActionTypes.SET_ORDER, payload: Order }
| { type: AdminStateActionTypes.SET_ORDER_USERS, payload: UserOrder[] }
| { type: AdminStateActionTypes.SET_ORDER_PRODUCTS, payload: OrderProduct[] }

interface AdminStateProviderType {
  state: AdminState,
  dispatch: React.Dispatch<AdminAction>
}

// State
const initialState: AdminState = {
  loading: false,
  users: [],
  orders: [],
  products: [],
  order: null,
  orderUsers: [],
  orderProducts: [],
}

const reducer = (state: AdminState, action: AdminAction): AdminState => {
  switch (action.type) {
    case AdminStateActionTypes.FETCH:
      return { ...state, loading: true };
    case AdminStateActionTypes.SET_USERS:
      return { ...state, loading: false, users: [ ...action.payload ] };
    case AdminStateActionTypes.SET_ORDERS:
      return { ...state, loading: false, orders: [ ...action.payload ] };
    case AdminStateActionTypes.SET_PRODUCTS:
      return { ...state, loading: false, products: [ ...action.payload ] };
    case AdminStateActionTypes.SET_ORDER:
      return { ...state, loading: false, order: { ...action.payload } };
    case AdminStateActionTypes.SET_ORDER_USERS:
      return { ...state, loading: false, orderUsers: [ ...action.payload ] };
    case AdminStateActionTypes.SET_ORDER_PRODUCTS:
      return { ...state, loading: false, orderProducts: [ ...action.payload ] };
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