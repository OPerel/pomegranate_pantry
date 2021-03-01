import React, { useReducer, createContext, useContext, useEffect } from 'react';
import { User, Order, OrderUser, Product } from '../../../types/interfaces';

import Fire from '../../../services/Firebase';

// types
interface UserState {
  loading: boolean,
  user: User | null,
  openOrder: Order | null,
  userOrders: OrderUser[],
  currentOrder: OrderUser,
  products: { [key: string ]: Product },
  error: string | null
};

export enum UserStateActionTypes {
  FETCH = 'FETCH',
  SET_USER = 'SET_USER',
  SET_OPEN_ORDER = 'SET_OPEN_ORDER',
  SET_CURRENT_ORDER = 'SET_CURRENT_ORDER',
  SET_USER_ORDERS = 'SET_USER_ORDERS',
  SET_PRODUCTS = 'SET_PRODUCTS',
  SET_ERROR = 'SET_ERROR'
};

type UserAction = 
  | { type: UserStateActionTypes.FETCH }
  | { type: UserStateActionTypes.SET_USER, payload: User | null }
  | { type: UserStateActionTypes.SET_OPEN_ORDER, payload: Order | null }
  | { type: UserStateActionTypes.SET_USER_ORDERS, payload: OrderUser[] }
  | { type: UserStateActionTypes.SET_CURRENT_ORDER, payload: OrderUser }
  | { type: UserStateActionTypes.SET_PRODUCTS, payload: { [key: string ]: Product } }
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
  currentOrder: {} as OrderUser,
  products: {},
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
        return { ...state, loading: false, currentOrder: action.payload }
    case UserStateActionTypes.SET_PRODUCTS:
      return { ...state, loading: false, products: action.payload };
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

    useEffect(() => {
      dispatch({ type: UserStateActionTypes.FETCH });
      Fire.openOrderListener((order) => {
        dispatch({ type: UserStateActionTypes.SET_OPEN_ORDER, payload: order });
      })
    }, []);

    const [state, dispatch] = useReducer(reducer, initialState);
    return (
      <UserStateContext.Provider value={{ state, dispatch }}>
        <Component {...props} />
      </UserStateContext.Provider>
    )
  }

  return WithUserState;
}

export default UserStateProvider;
