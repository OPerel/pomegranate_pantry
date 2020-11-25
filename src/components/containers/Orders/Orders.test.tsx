import React from 'react';

import { render } from '../../../tests/testUtils';
import '@testing-library/jest-dom/extend-expect';

import Orders from './Orders';
import { getOrders } from '../../../data/orders'

const ordersLength = getOrders().length;

test('should render orders list header', async () => {
  const { findByText } = render(<Orders />)
  await findByText('הזמנות');
});

test('should display orders list', async () => {
  const { findAllByTestId } = render(<Orders />)
  expect(await findAllByTestId('order-list-item')).toHaveLength(ordersLength);
})