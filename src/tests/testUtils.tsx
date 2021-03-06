import React from 'react';
import { render } from '@testing-library/react';
import { Router, Route } from 'react-router-dom';
import { createMemoryHistory, History, MemoryHistory } from 'history';

import { AuthStateContext } from '../components/context/authState/AuthContextProvider';
import AdminStateProvider from '../components/context/adminState/AdminContextProvider';
// import { User, Product, Order } from '../types/interfaces';
// import { userData ,productsData, ordersData } from '../setupTests';

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
  auth: boolean = true
) => {

  const StateWrapper: React.FC = ({ children }) => <>{children}</>;
  const RenderWithAdminState = AdminStateProvider(StateWrapper);

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
          <RenderWithAdminState>
            {children}
          </RenderWithAdminState>
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