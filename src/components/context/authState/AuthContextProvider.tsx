import React, { useReducer, createContext, useContext, useEffect } from 'react';
import { User } from '../../../types/interfaces';

import Fire from '../../../services/Firebase';

// types
interface AuthState {
  loading: boolean,
  user: User | null,
  error: string | null
};

export enum AuthStateActionTypes {
  FETCH = 'FETCH',
  SET_USER = 'SET_USER',
  SET_ERROR = 'SET_ERROR'
};

type AuthAction = 
  | { type: AuthStateActionTypes.FETCH }
  | { type: AuthStateActionTypes.SET_USER, payload: User | null }
  | { type: AuthStateActionTypes.SET_ERROR, payload: string };

interface AuthProviderType {
  state: AuthState,
  dispatch: React.Dispatch<AuthAction>
}

// state
const initialState: AuthState = {
  loading: false,
  user: null,
  error: null
}

const reducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case AuthStateActionTypes.FETCH:
      return { ...state, loading: true };
    case AuthStateActionTypes.SET_USER:
      return { ...state, loading: false, error: null, user: action.payload }
    case AuthStateActionTypes.SET_ERROR:
      return { ...state, loading: false, error: action.payload }
    default:
      return state;
  }
}

// context
const AuthStateContext = createContext<AuthProviderType>({ state: initialState, dispatch: () => {} });
export const useAuthStateContext = () => useContext(AuthStateContext);

// HOC
const AuthStateProvider = <P extends {}>(Component: React.ComponentType<P>): React.FC<P> => {
  const WithAuth: React.ComponentType<P> = (props) => {

    useEffect(() => {
      dispatch({ type: AuthStateActionTypes.FETCH });
      const unsubscribe = Fire.authStateListener((user, error) => {
        if (error) {
          dispatch({ type: AuthStateActionTypes.SET_ERROR, payload: error });
        } else {
          dispatch({ type: AuthStateActionTypes.SET_USER, payload: user });
        }
      });

      return unsubscribe;
    }, []);

    const [state, dispatch] = useReducer(reducer, initialState);
    return (
      <AuthStateContext.Provider value={{ state, dispatch }}>
        <Component {...props} />
      </AuthStateContext.Provider>
    )
  }

  return WithAuth;
}

export default AuthStateProvider;
