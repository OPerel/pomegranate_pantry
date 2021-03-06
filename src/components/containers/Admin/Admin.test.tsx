import React from 'react';

import { render, fireEvent } from '../../../tests/testUtils';
import '@testing-library/jest-dom/extend-expect';

// import AdminStateProvider from '../../context/adminState/AdminContextProvider';
// import AuthGuard from '../Auth/AuthGuard';
// import AuthStateProvider from '../../context/authState/AuthContextProvider';
import Admin from './Admin';

// const AdminWithState = AuthStateProvider(Admin);

test('should display admin page header', async () => {
  const { findByText } = render(<Admin routes={[]} />, { route: '/admin' });
  await findByText('אדמין');
});

test('should display orders by default', async () => {
  const { findByTestId } = render(<Admin routes={[]} />, { route: '/admin' });
  await findByTestId('admin-orders-list');
});

test('should change to products view on click button', async () => {
  const { findByTestId } = render(<Admin routes={[]} />, { route: '/admin' });
  fireEvent.click(await findByTestId('admin-products-button'));
  await findByTestId('admin-products-list');
});

test('should change to users view on click button', async () => {
  const { findByTestId } = render(<Admin routes={[]} />, { route: '/admin' });
  fireEvent.click(await findByTestId('admin-users-button'));
  await findByTestId('admin-users-list');
});