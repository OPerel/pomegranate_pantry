import React from 'react';
import { render } from '@testing-library/react';
import { Router, Route } from 'react-router-dom';
import { createMemoryHistory, History, MemoryHistory } from 'history';

import { AuthStateContext } from '../components/context/authState/AuthContextProvider';
import AdminStateProvider from '../components/context/adminState/AdminContextProvider';
import UserStateProvider from '../components/context/userState/UserContextProvider';

type CustomRenderPropsTypes = {
  route?: string,
  history?: MemoryHistory<History.UnknownFacade>
}

const customRender = (
  ui: React.ReactElement,
  {
    route = '/',
    history = createMemoryHistory({ initialEntries: [route] }),
    ...options
  }: CustomRenderPropsTypes = {} as CustomRenderPropsTypes,
  auth: boolean = true,
  state: 'user' | 'rimon' = 'rimon'
) => {

  const AdminStateWrapper: React.FC = ({ children }) => <>{children}</>;
  const RenderWithAdminState = AdminStateProvider(AdminStateWrapper);

  const UserStateWrapper: React.FC = ({ children }) => <>{children}</>;
  const RenderWithUserState = UserStateProvider(UserStateWrapper);

  const RenderWithRouter: React.FC = ({ children }) => (
    <AuthStateContext.Provider value={{
      state: {
        loading: false,
        user: auth ? {
          _id: 'ZMTBBeoL4ja79HFVDVoTUHDtzJw1',
          name: 'e rimon',
          location: 'TA',
          role: 'rimon'
        } : null,
        error: null
      },
      dispatch: () => {}
    }}>
      <Router history={history}>
        <Route path={route}>
          {state === 'rimon' ? (
            <RenderWithAdminState>
              {children}
            </RenderWithAdminState>
          ) : (
            <RenderWithUserState>
              {children}
            </RenderWithUserState>
          )}
        </Route>
      </Router>
    </AuthStateContext.Provider>
  )
  

  return { ...render(<RenderWithRouter>{ui}</RenderWithRouter>, { ...options }), history }
}

// re-export everything
export * from '@testing-library/react'

// override render method
export { customRender as render }