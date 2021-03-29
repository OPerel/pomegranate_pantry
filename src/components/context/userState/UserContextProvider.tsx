import React, { useReducer, createContext, useContext, useEffect } from 'react';
import { Order, OrderUser, Product } from '../../../types/interfaces';

import { useAuthStateContext } from '../authState/AuthContextProvider';
import Fire from '../../../services/Firebase';

// types
interface UserState {
  loading: boolean,
  openOrder: Order | null,
  // userOrders: OrderUser[],
  currentOrder: OrderUser | null,
  products: { [key: string ]: Product },
  error: string | null
};

export enum UserStateActionTypes {
  FETCH = 'FETCH',
  SET_OPEN_ORDER = 'SET_OPEN_ORDER',
  SET_CURRENT_ORDER = 'SET_CURRENT_ORDER',
  // SET_USER_ORDERS = 'SET_USER_ORDERS',
  SET_PRODUCTS = 'SET_PRODUCTS',
  SET_ERROR = 'SET_ERROR'
};

type UserAction = 
  | { type: UserStateActionTypes.FETCH }
  | { type: UserStateActionTypes.SET_OPEN_ORDER, payload: Order | null }
  // | { type: UserStateActionTypes.SET_USER_ORDERS, payload: OrderUser[] }
  | { type: UserStateActionTypes.SET_CURRENT_ORDER, payload: OrderUser | null }
  | { type: UserStateActionTypes.SET_PRODUCTS, payload: { [key: string ]: Product } }
  | { type: UserStateActionTypes.SET_ERROR, payload: string };

interface UserProviderType {
  state: UserState,
  dispatch: React.Dispatch<UserAction>
}

// state
const initialState: UserState = {
  loading: false,
  openOrder: null,
  // userOrders: [],
  currentOrder: null,
  products: {},
  error: null
}

const reducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case UserStateActionTypes.FETCH:
      return { ...state, loading: true };
    case UserStateActionTypes.SET_OPEN_ORDER:
      return { ...state, loading: false, openOrder: action.payload };
    // case UserStateActionTypes.SET_USER_ORDERS:
    //   return { ...state, userOrders: action.payload };
      case UserStateActionTypes.SET_CURRENT_ORDER:
        return { ...state, currentOrder: action.payload };
    case UserStateActionTypes.SET_PRODUCTS:
      return { ...state, products: action.payload };
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
      let openOrderSubscription: any;
      dispatch({ type: UserStateActionTypes.FETCH });
      const productsSubscription = Fire.productsCollectionListener(productsObj => {
        dispatch({ type: UserStateActionTypes.SET_PRODUCTS, payload: productsObj });
      });
      Fire.getOpenOrderId().then(orderId => {
        if (orderId) {
          openOrderSubscription = Fire.orderListener(orderId, (order) => {
            dispatch({ type: UserStateActionTypes.SET_OPEN_ORDER, payload: order });
          });
        } 
      })

      return () => {
        productsSubscription.unsubscribe()
        if (openOrderSubscription) {
          openOrderSubscription.unsubscribe()
        }
      }
    
    }, []);

    useEffect(() => {
      let isMounted = true;
      
      const currentOrder = state.openOrder?.orderUsers.find(order => order.userRef === user?._id);
      if (currentOrder && isMounted) {
        dispatch({ type: UserStateActionTypes.SET_CURRENT_ORDER, payload: currentOrder });
      }

      return () => {
        isMounted = false;
      }
    }, [state.openOrder, user?._id])

    return (
      <UserStateContext.Provider value={{ state, dispatch }}>
        <Component {...props} />
      </UserStateContext.Provider>
    )
  }

  return WithUserState;
}

export default UserStateProvider;
