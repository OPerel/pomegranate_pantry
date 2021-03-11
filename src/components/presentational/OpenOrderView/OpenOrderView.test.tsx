import React from 'react';
import { render, screen } from '../../../tests/testUtils';
import '@testing-library/jest-dom/extend-expect';

import OpenOrderView from './OpenOrderView';
import { OrderStatus } from '../../../types/interfaces';

const order = {
  _id: '1',
  status: 'open' as OrderStatus,
  createdAt: new Date(1606513716688),
  closingTime: new Date(1601241806937),
  totalPrice: null as null | number,
  orderUsers: [
    {
      _id: '1',
      products: [{ productRef: 'qwerty1', qty: 2 }, { productRef: 'qwerty2', qty: 3 }],
      userRef: 'ZMTBBeoL4ja79HFVDVoTUHDtzJw1',
      orderRef: '1',
      totalPrice: 110,
      payed: false
    },
    {
      _id: '3',
      products: [],
      userRef: 'c',
      orderRef: '1',
      totalPrice: 0,
      payed: true
    }
  ],
  orderProducts: [
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
}

test('should display no open order msg when prop is null', async () => {
  render(<OpenOrderView openOrder={null} />, { route: '/user' }, true, 'user');
  expect(await screen.findByTestId('no-open-order-msg')).toBeInTheDocument();
  expect(await screen.findByTestId('no-open-order-msg')).toHaveTextContent('אין הזמנה פתוחה כרגע');
});

test('should display correct order closing date and status in title', async () => {
  render(<OpenOrderView openOrder={order} />, { route: '/user' }, true, 'user');
  expect(await screen.findByTestId('open-order-title')).toHaveTextContent('פתוח להזמנות | נסגרת ב - 9/28/2020');
});

test('should display correct number of products', async () => {
  render(<OpenOrderView openOrder={order} />, { route: '/user' }, true, 'user');
  expect(await screen.findAllByTestId('open-order-product-item')).toHaveLength(6);
});

// TODO: add tests for my order modal
