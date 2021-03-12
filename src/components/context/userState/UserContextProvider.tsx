import React, { useReducer, createContext, useContext, useEffect } from 'react';
import { User, Order, OrderUser, Product, OrderProduct } from '../../../types/interfaces';

import { useAuthStateContext } from '../authState/AuthContextProvider';
import Fire from '../../../services/Firebase';

// types
interface UserState {
  loading: boolean,
  user: User | null,
  openOrder: Order | null,
  userOrders: OrderUser[],
  currentOrder: OrderUser | null,
  products: { [key: string ]: Product },
  orderProducts: OrderProduct[],
  error: string | null
};

export enum UserStateActionTypes {
  FETCH = 'FETCH',
  SET_USER = 'SET_USER',
  SET_OPEN_ORDER = 'SET_OPEN_ORDER',
  SET_CURRENT_ORDER = 'SET_CURRENT_ORDER',
  SET_USER_ORDERS = 'SET_USER_ORDERS',
  SET_PRODUCTS = 'SET_PRODUCTS',
  SET_ORDER_PRODUCTS = 'SET_ORDER_PRODUCTS',
  SET_ERROR = 'SET_ERROR'
};

type UserAction = 
  | { type: UserStateActionTypes.FETCH }
  | { type: UserStateActionTypes.SET_USER, payload: User | null }
  | { type: UserStateActionTypes.SET_OPEN_ORDER, payload: Order | null }
  | { type: UserStateActionTypes.SET_USER_ORDERS, payload: OrderUser[] }
  | { type: UserStateActionTypes.SET_CURRENT_ORDER, payload: OrderUser | null }
  | { type: UserStateActionTypes.SET_PRODUCTS, payload: { [key: string ]: Product } }
  | { type: UserStateActionTypes.SET_ORDER_PRODUCTS, payload: OrderProduct[] }
  | { type: UserStateActionTypes.SET_ERROR, payload: string };

interface UserProviderType {
  state: UserState,
  dispatch: React.Dispatch<UserAction>
}

// state
const initialState: UserState = {
  loading: false,
  user: null,
  openOrder: null,
  userOrders: [],
  currentOrder: null,
  products: {},
  orderProducts: [],
  error: null
}

const reducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case UserStateActionTypes.FETCH:
      return { ...state, loading: true };
    case UserStateActionTypes.SET_USER:
      return { ...state, loading: false, error: null, user: action.payload };
    case UserStateActionTypes.SET_OPEN_ORDER:
      return { ...state, loading: false, openOrder: action.payload };
    case UserStateActionTypes.SET_USER_ORDERS:
      return { ...state, loading: false, userOrders: action.payload };
      case UserStateActionTypes.SET_CURRENT_ORDER:
        return { ...state, loading: false, currentOrder: action.payload };
    case UserStateActionTypes.SET_PRODUCTS:
      return { ...state, loading: false, products: action.payload };
    case UserStateActionTypes.SET_ORDER_PRODUCTS:
      return { ...state, loading: false, orderProducts: action.payload };
    case UserStateActionTypes.SET_ERROR:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

// context
const UserStateContext = createContext<UserProviderType>({ state: initialState, dispatch: () => {} });
export const useUserStateContext = () => useContext(UserStateContext);

// HOC
const UserStateProvider = <P extends {}>(Component: React.ComponentType<P>): React.FC<P> => {
  const WithUserState: React.ComponentType<P> = (props) => {

    const { state: { user } } = useAuthStateContext();
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {

      dispatch({ type: UserStateActionTypes.FETCH });
      const subscription = Fire.openOrderListener((order) => {
        dispatch({ type: UserStateActionTypes.SET_OPEN_ORDER, payload: order });
      });

      return () => {
        subscription.unsubscribe()
      }
    
    }, []);

    useEffect(() => {
      let subscription: any;
      let isMounted = true;
      if (user && user._id && isMounted) {
        dispatch({ type: UserStateActionTypes.FETCH });
        subscription = Fire.userOrdersListener(user._id, userOrders => {
          dispatch({ type: UserStateActionTypes.SET_USER_ORDERS, payload: userOrders });
        });
      }

      return () => {
        if (subscription) {
          subscription.unsubscribe();
        }
        isMounted = false;
      }
    }, [user]);

    useEffect(() => {
      let isMounted = true;
      let orderProductsSubscription: any;
      const currentOrder = state.userOrders.find(order => order.orderRef === state.openOrder?._id);
      if (currentOrder && isMounted) {
        dispatch({ type: UserStateActionTypes.SET_CURRENT_ORDER, payload: currentOrder });
      }

      if (state.openOrder) {
        dispatch({ type: UserStateActionTypes.FETCH });
        orderProductsSubscription = Fire.openOrderProductsListener(state.openOrder._id, orderProducts => {
          dispatch({ type: UserStateActionTypes.SET_ORDER_PRODUCTS, payload: orderProducts });
        })
      }

      return () => {
        isMounted = false;
        if (orderProductsSubscription) {
          orderProductsSubscription.unsubscribe();
        } 
      }
    }, [state.userOrders, state.openOrder])

    return (
      <UserStateContext.Provider value={{ state, dispatch }}>
        <Component {...props} />
      </UserStateContext.Provider>
    )
  }

  return WithUserState;
}

export default UserStateProvider;
