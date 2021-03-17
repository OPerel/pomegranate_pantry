import React from 'react';
import { render, screen } from '../../../tests/testUtils';
import '@testing-library/jest-dom/extend-expect';

import OrderListItem from './OrderListItem';
import { OrderStatus } from '../../../types/interfaces';

const order = {
  _id: '1',
  status: 'open' as OrderStatus,
  active: true,
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

test('should display correct createdAt formatted date', async () => {
  render(<OrderListItem order={order} />, { route: 'admin/' });
  expect(await screen.findByTestId('order-item-createdAt')).toHaveTextContent('27.11.2020');
});

test('should have order totalPrice empty', async () => {
  render(<OrderListItem order={order} />, { route: 'admin/' });
  expect(await screen.findByTestId('order-item-totalPrice')).toHaveTextContent('');
});

test('should display correct status text for open order', async () => {
  render(<OrderListItem order={order} />, { route: 'admin/' });
  expect(await screen.findByTestId('order-item-status')).toHaveTextContent('פתוח להזמנות');
});

test('should display correct status text for order in completion', async () => {
  let newOrder = order;
  newOrder.status = 'completion';

  render(<OrderListItem order={order} />, { route: 'admin/' });
  expect(await screen.findByTestId('order-item-status')).toHaveTextContent('פתוח להשלמות');
});

test('should display correct status text and totalPrice for closed order', async () => {
  let newOrder = order;
  newOrder.status = 'closed';
  newOrder.totalPrice = 100;

  render(<OrderListItem order={order} />, { route: 'admin/' });
  expect(await screen.findByTestId('order-item-status')).toHaveTextContent('ההזמנה סגורה');
  expect(await screen.findByTestId('order-item-totalPrice')).toHaveTextContent('100');
});
