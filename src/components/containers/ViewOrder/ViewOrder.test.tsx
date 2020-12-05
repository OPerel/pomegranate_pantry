import React from 'react';
import AdminStateProvider from '../../context/AdminContextProvider';

import { render, fireEvent } from '../../../tests/testUtils';
import '@testing-library/jest-dom/extend-expect';

import ViewOrder from './ViewOrder';

const ViewOrderWithState = AdminStateProvider(ViewOrder);
const routeComponentPropsMock = {
  // add jest.fn() as needed to any of the objects
  history: {} as any,
  location: {} as any,
  match: { params: { id: '1' } } as any,
}

test('should render order user list header', async () => {
  const { findByText } = render(<ViewOrderWithState {...routeComponentPropsMock} />, { route: 'admin/order/1' })
  await findByText('רשימת משתמשים');
});

test('should display order users list', async () => {
  const { findAllByTestId } = render(<ViewOrderWithState {...routeComponentPropsMock} />, { route: 'admin/order/1' })
  expect(await findAllByTestId('order-user-list-item')).toHaveLength(3);
});

test('should click on products button and display list', async () => {
  const { findByText, findAllByTestId } = render(<ViewOrderWithState {...routeComponentPropsMock} />, { route: 'admin/order/1' });
  fireEvent.click(await findByText('מוצרים'));
  expect(await findAllByTestId('product-order-list-item')).toHaveLength(4);
})