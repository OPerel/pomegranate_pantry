import React, { useReducer, createContext, useContext } from 'react';

import { Order, UserOrder, OrderProduct, Product } from '../../types/interfaces';


import Fire from '../../services/Firebase';

// Types
interface AdminState {
  loading: boolean,
  orders: Order[],
  products: Product[],
  order: Order | null,
  orderUsers: UserOrder[],
  orderProducts: OrderProduct[]
}

export enum ActionTypes {
  FETCH = 'FETCH',
  SET_ORDERS = 'SET_ORDERS',
  SET_PRODUCTS = 'SET_PRODUCTS',
  SET_ORDER = 'SET_ORDER',
  SET_ORDER_USERS = 'SET_ORDER_USERS',
  SET_ORDER_PRODUCTS = 'SET_ORDER_PRODUCTS',
}

type AdminAction =
| { type: ActionTypes.FETCH, }
| { type: ActionTypes.SET_ORDERS, payload: Order[] }
| { type: ActionTypes.SET_PRODUCTS, payload: Product[] }
| { type: ActionTypes.SET_ORDER, payload: Order }
| { type: ActionTypes.SET_ORDER_USERS, payload: UserOrder[] }
| { type: ActionTypes.SET_ORDER_PRODUCTS, payload: OrderProduct[] }

interface ProviderValue {
  state: AdminState,
  dispatch: React.Dispatch<AdminAction>
}

// State
const initialState: AdminState = {
  loading: false,
  orders: [],
  products: [],
  order: null,
  orderUsers: [],
  orderProducts: [],
}

const reducer = (state: AdminState, action: AdminAction): AdminState => {
  switch (action.type) {
    case ActionTypes.FETCH:
      return { ...state, loading: true };
    case ActionTypes.SET_ORDERS:
      return { ...state, loading: false, orders: [ ...action.payload ] };
    case ActionTypes.SET_PRODUCTS:
      return { ...state, loading: false, products: [ ...action.payload ] };
    case ActionTypes.SET_ORDER:
      return { ...state, loading: false, order: { ...action.payload } };
    case ActionTypes.SET_ORDER_USERS:
      return { ...state, loading: false, orderUsers: [ ...action.payload ] };
    case ActionTypes.SET_ORDER_PRODUCTS:
      return { ...state, loading: false, orderProducts: [ ...action.payload ] };
    default:
      return state;
  }
}

  
// react context
const AdminStateContext = createContext<ProviderValue>({ state: initialState, dispatch: () => {} });
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