import React from 'react';
import { render } from '@testing-library/react';
import { Router, Route } from 'react-router-dom';
import { createMemoryHistory, History, MemoryHistory } from 'history';

// import AuthStateProvider from '../components/context/authState/AuthContextProvider';


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
  }: CustomRenderPropsTypes = {} as CustomRenderPropsTypes
) => {

  const RenderWithRouter: React.FC = ({ children }) => (
    <Router history={history}>
      <Route path={route}>
        {children}
      </Route>
    </Router>
  )
  

  return { ...render(<RenderWithRouter>{ui}</RenderWithRouter>, { ...options }), history }
}

// re-export everything
export * from '@testing-library/react'

// override render method
export { customRender as render }