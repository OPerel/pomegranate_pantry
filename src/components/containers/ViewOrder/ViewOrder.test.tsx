import React from 'react';

import { render, fireEvent } from '../../../tests/testUtils';
import '@testing-library/jest-dom/extend-expect';

import ViewOrder from './ViewOrder';
import { getOrderUsers } from '../../../data/userOrders';

const usersLength = getOrderUsers('1').length;

test('should render order user list header', async () => {
  const { findByText } = render(<ViewOrder />, { route: '/order/1' })
  await findByText('רשימת משתמשים');
});

test('should display order users list', async () => {
  const { findAllByTestId } = render(<ViewOrder />, { route: '/order/1' })
  expect(await findAllByTestId('order-user-list-item')).toHaveLength(usersLength);
});

test('should click on products button and display list', async () => {
  const { findByText, findAllByTestId } = render(<ViewOrder />, { route: '/order/1' });
  fireEvent.click(await findByText('מוצרים'));
  expect(await findAllByTestId('product-order-list-item')).toHaveLength(2);
})