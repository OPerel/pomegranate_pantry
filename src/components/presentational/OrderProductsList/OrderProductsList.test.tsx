import React from 'react';
import { render, screen } from '../../../tests/testUtils';
import '@testing-library/jest-dom/extend-expect';

import OrderProductsList from './OrderProductsList';

const orderProducts = [
  {
    _id: '123',
    productRef: 'qwerty1',
    orderRef: '1',
    totalQty: 2,
    missing: 10,
    price: 28,
  },
  {
    _id: '456',
    productRef: 'qwerty2',
    orderRef: '1',
    totalQty: 3,
    missing: 9,
    price: 18,
  }
]

test('should display no order products message', async () => {
  render(
    <OrderProductsList orderProducts={[]} />,
    { route: 'admin/order/1' }
  );
  expect(await screen.findByText('לא נמצאו מוצרים להזמנה')).toBeInTheDocument();
});

test('should display order products title', async () => {
  render(
    <OrderProductsList orderProducts={orderProducts} />,
    { route: 'admin/order/1' }
  );

  expect(await screen.findByText('רשימת מוצרים')).toBeInTheDocument();
});

test('should display correct number of order product items', async () => {
  render(
    <OrderProductsList orderProducts={orderProducts} />,
    { route: 'admin/order/1' }
  );
  expect(await screen.findAllByRole('order-product-list-item')).toHaveLength(2);
});
