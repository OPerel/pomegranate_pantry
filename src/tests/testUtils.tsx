import React from 'react';
import { render } from '@testing-library/react';
import { Router, Route } from 'react-router-dom';
import { createMemoryHistory, History, MemoryHistory } from 'history';
import AdminStateProvider from '../components/context/AdminContextProvider';

type CustomRenderPropsTypes = {
  route?: string,
  history?: MemoryHistory<History.UnknownFacade>
}

const customRender = (
  ui: React.ReactElement,
  {
    route = '/home',
    history = createMemoryHistory({ initialEntries: [route] }),
    ...options
  }: CustomRenderPropsTypes = {} as CustomRenderPropsTypes
) => {

  const RenderWithRouter: React.FC = ({ children }) => (
    <Router history={history}>{children}</Router>
  )
  
  const RenderWithAdminState: React.FC = ({ children }) => (
    <Route path={route === '/home' ? route : '/order/:id'} render={(props) => (
      <AdminStateProvider {...props}>
        {children}
      </AdminStateProvider>
    )}/>
  )
  
  const AllTheProviders: React.FC = ({ children }) => (
    <RenderWithRouter>
      <RenderWithAdminState>
        {children}
      </RenderWithAdminState>
    </RenderWithRouter>
  )

  return { ...render(ui, { wrapper: AllTheProviders, ...options }), history }
}

// re-export everything
export * from '@testing-library/react'

// override render method
export { customRender as render }