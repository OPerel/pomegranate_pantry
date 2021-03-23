import React from 'react';
import { render, screen } from '../../../tests/testUtils';
import '@testing-library/jest-dom/extend-expect';
import OrderInProgressView from './OrderInProgressView';
import { OrderStatus, Order } from '../../../types/interfaces';

const order: Order = {
  _id: '1',
  status: 'shopping' as OrderStatus,
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
      totalPrice: null,
      payed: false
    },
    {
      _id: '3',
      products: [],
      userRef: 'c',
      orderRef: '1',
      totalPrice: null,
      payed: true
    }
  ],
  orderProducts: [
    {
      productRef: 'qwerty1',
      orderRef: '1',
      totalQty: 2,
      missing: 10,
      price: 0,
    },
    {
      productRef: 'qwerty2',
      orderRef: '1',
      totalQty: 3,
      missing: 9,
      price: 0,
    }
  ]
}

describe('Open Order View', () => {
  test('should display two products with no prices', async () => {
    render(<OrderInProgressView openOrder={order} />, { route: '/user' }, true, 'user');
    expect(await screen.findAllByTestId('order-in-progress-product-item')).toHaveLength(2);
    expect((await screen.findAllByTestId('order-in-progress-product-item'))[0].textContent)
      .toBe('טחינה הר ברכה2');
  });

  test('should display product with prices', async () => {
    const orderWithPrice = order;
    orderWithPrice.orderProducts[0].price = 19;
    render(<OrderInProgressView openOrder={orderWithPrice} />, { route: '/user' }, true, 'user');
    expect((await screen.findAllByTestId('order-in-progress-product-item'))[0])
      .toHaveTextContent("טחינה הר ברכה2‏19.00 ₪‏38.00 ₪");
  });

  test('should display user\'s order total', async () => {
    const orderWithPrice = order;
    orderWithPrice.orderProducts[0].price = 19;
    render(<OrderInProgressView openOrder={orderWithPrice} />, { route: '/user' }, true, 'user');
    expect(await screen.findByTestId('user-order-total')).toHaveTextContent('סה"כ ‏56.00 ₪')
  });
});
