import React, { useReducer, useEffect, createContext, useContext } from 'react';
import { RouteComponentProps } from 'react-router';

import { Order, UserOrder, OrderProduct } from '../../types/interfaces';

import { getOrders, getOrder } from '../../data/orders'; 
import { getOrderUsers } from '../../data/userOrders';
import { getOrderProducts } from '../../data/orderProduct';

// Types
interface AdminState {
  loading: boolean,
  orders: Order[],
  order: Order | null,
  orderUsers: UserOrder[],
  orderProducts: OrderProduct[]
}

export enum ActionTypes {
  FETCH = 'FETCH',
  SET_ORDERS = 'SET_ORDERS',
  SET_ORDER = 'SET_ORDER',
  SET_USER_ORDERS = 'SET_USER_ORDERS',
  SET_ORDER_PRODUCTS = 'SET_ORDER_PRODUCTS'
}

type AdminAction =
| { type: ActionTypes.FETCH, payload: { loading: boolean } }
| { type: ActionTypes.SET_ORDERS, payload: Order[] }
| { type: ActionTypes.SET_ORDER, payload: Order }
| { type: ActionTypes.SET_USER_ORDERS, payload: UserOrder[] }
| { type: ActionTypes.SET_ORDER_PRODUCTS, payload: OrderProduct[] };

interface ProviderValue {
  state: AdminState,
  dispatch: React.Dispatch<AdminAction>
}

// State
const initialState: AdminState = {
  loading: false,
  orders: [],
  order: null,
  orderUsers: [],
  orderProducts: [],
}

const reducer = (state: AdminState, action: AdminAction): AdminState => {
  switch (action.type) {
    case ActionTypes.FETCH:
      return { ...state, loading: action.payload.loading};
    case ActionTypes.SET_ORDERS:
      return { ...state, orders: [ ...action.payload ] };
    case ActionTypes.SET_ORDER:
      return { ...state, order: { ...action.payload } };
    case ActionTypes.SET_USER_ORDERS:
      return { ...state, orderUsers: [ ...action.payload ] };
    case ActionTypes.SET_ORDER_PRODUCTS:
      return { ...state, orderProducts: [ ...action.payload ] };
    default:
      return state;
  }
}
  
// react context
const AdminStateContext = createContext<ProviderValue>({ state: initialState, dispatch: () => {} });
export const useAdminStateContext = () => useContext(AdminStateContext);

interface StateContextProps extends RouteComponentProps<{ id: string; }> { children: React.ReactNode; }

export default ({ match, children }: StateContextProps) => {

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const { id: orderId } = match.params;
    
    const orders = getOrders();
    dispatch({ type: ActionTypes.SET_ORDERS, payload: orders as Order[] })

    const order = getOrder(orderId);
    dispatch({ type: ActionTypes.SET_ORDER, payload: order as Order });

    const orderUsers = getOrderUsers(orderId);
    dispatch({ type: ActionTypes.SET_USER_ORDERS, payload: orderUsers as UserOrder[] });

    const orderProducts = getOrderProducts(orderId);
    dispatch({ type: ActionTypes.SET_ORDER_PRODUCTS, payload: orderProducts as OrderProduct[] });
  }, [match.params]);

  return state.loading ? (
    <h2>Loading</h2>
  ) : (
    <AdminStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AdminStateContext.Provider>
  );
}