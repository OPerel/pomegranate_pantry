import React, { useReducer, useEffect, createContext, useContext } from 'react';
import { RouteComponentProps } from 'react-router';

import { Order, UserOrder, OrderProduct, Product } from '../../types/interfaces';

import { getOrder } from '../../data/orders'; 
import { getOrderUsers } from '../../data/userOrders';
import { getOrderProducts } from '../../data/orderProduct';

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

  // ADD_ORDER = '@@/admin/order/ADD_ORDER',
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
      return { ...state, orderProducts: [ ...action.payload ] };
    default:
      return state;
  }
}

export const addNewOrder = async (order: Date): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await Fire.addNewOrder(order);
      console.log('order added res: ', res);
      
      resolve(res._id);
    } catch (err) {
      console.log('Error adding order: ', err);
      reject(err);
    }
  })
}
  
// react context
const AdminStateContext = createContext<ProviderValue>({ state: initialState, dispatch: () => {} });
export const useAdminStateContext = () => useContext(AdminStateContext);

interface StateContextProps extends RouteComponentProps<{ id: string; }> { children: React.ReactNode; };

const AdminStateProvider: React.FC<StateContextProps> = ({ match, children }) => {

  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    const { id: orderId } = match.params;
    
    dispatch({ type: ActionTypes.FETCH })
    try {
      Fire.ordersCollectionListener((orders) => {
        dispatch({ type: ActionTypes.SET_ORDERS, payload: orders })
      });

      Fire.productsCollectionListener((products) => {
        dispatch({ type: ActionTypes.SET_PRODUCTS, payload: products })
      })
    } catch (err) {
      console.log('err fetching orders | products: ', err)
    }
        
    if (orderId) {
      const order = getOrder(orderId);
      dispatch({ type: ActionTypes.SET_ORDER, payload: order as Order });
      
      const orderUsers = getOrderUsers(orderId);
      dispatch({ type: ActionTypes.SET_ORDER_USERS, payload: orderUsers as UserOrder[] });
      
      const orderProducts = getOrderProducts(orderId);
      dispatch({ type: ActionTypes.SET_ORDER_PRODUCTS, payload: orderProducts as OrderProduct[] });
    }
    
  }, [match.params]);
  
  // console.log('state provider: ', state)
  return (
    <AdminStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AdminStateContext.Provider>
  )
}

export default AdminStateProvider;