import React from 'react';
import AdminStateProvider from '../../context/adminState/AdminContextProvider';

import { render, fireEvent } from '../../../tests/testUtils';
import '@testing-library/jest-dom/extend-expect';

import Admin from '.';

const AdminWithState = AdminStateProvider(Admin)

test('should display admin page header', async () => {
  const { findByText } = render(<AdminWithState routes={[]} />, { route: '/admin' });
  await findByText('אדמין');
});

test('should display orders by default', async () => {
  const { findByTestId } = render(<AdminWithState routes={[]} />, { route: '/admin' });
  await findByTestId('admin-orders-list');
});

test('should change to products view on click button', async () => {
  const { findByTestId } = render(<AdminWithState routes={[]} />, { route: '/admin' });
  fireEvent.click(await findByTestId('admin-products-button'));
  await findByTestId('admin-products-list');
});