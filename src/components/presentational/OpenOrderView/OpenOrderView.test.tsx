import React from 'react';
import { render, screen, fireEvent } from '../../../tests/testUtils';
import '@testing-library/jest-dom/extend-expect';
import Fire from '../../../services/Firebase';
import OpenOrderView from './OpenOrderView';
import { OrderStatus, Order } from '../../../types/interfaces';

const order: Order = {
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
      productRef: 'qwerty1',
      orderRef: '1',
      totalQty: 2,
      missing: 10,
      price: 28,
    },
    {
      productRef: 'qwerty2',
      orderRef: '1',
      totalQty: 3,
      missing: 9,
      price: 18,
    }
  ]
}

describe('Open Order View', () => {
  test('should display no open order msg when prop is null', async () => {
    render(<OpenOrderView openOrder={null} />, { route: '/user' }, true, 'user');
    expect(await screen.findByTestId('no-open-order-msg')).toBeInTheDocument();
    expect(await screen.findByTestId('no-open-order-msg')).toHaveTextContent('אין הזמנה פתוחה כרגע');
  });

  test('should display correct order closing date and status in title', async () => {
    render(<OpenOrderView openOrder={order} />, { route: '/user' }, true, 'user');
    expect(await screen.findByTestId('open-order-title')).toHaveTextContent('פתוח להזמנות | נסגרת ב - 28.9.2020');
  });

  test('should display correct number of products', async () => {
    render(<OpenOrderView openOrder={order} />, { route: '/user' }, true, 'user');
    expect(await screen.findAllByTestId('open-order-product-item')).toHaveLength(6);
  });

  test('should only display two orderProducts in completion mode', async () => {
    let orderInComp = order;
    orderInComp.status = 'completion';

    render(<OpenOrderView openOrder={orderInComp} />, { route: '/user' }, true, 'user');
    expect(await screen.findAllByTestId('open-order-product-item')).toHaveLength(2);
  });

  test('should only display one orderProducts in completion mode', async () => {
    let orderInComp = order;
    orderInComp.status = 'completion';
    orderInComp.orderProducts[0].missing = null;

    render(<OpenOrderView openOrder={orderInComp} />, { route: '/user' }, true, 'user');
    expect(await screen.findAllByTestId('open-order-product-item')).toHaveLength(1);
  });

  test('should open my order modal and display modal title', async () => {
    render(<OpenOrderView openOrder={order} />, { route: '/user' }, true, 'user');
    fireEvent.click(await screen.findByRole('my-order-button'));
    expect(await screen.findByTestId('my-order-modal')).toHaveTextContent('המוצרים שלי');
  });

  test('should display 2 products in my order modal', async () => {
    render(<OpenOrderView openOrder={order} />, { route: '/user' }, true, 'user');
    fireEvent.click(await screen.findByRole('my-order-button'));
    expect(await screen.findAllByTestId('my-order-product-item')).toHaveLength(2);
  });

  test('should delete product on click delete button', async () => {
    const mockDeleteProduct = jest.spyOn(Fire, 'deleteProductFromOrder');
    
    render(<OpenOrderView openOrder={order} />, { route: '/user' }, true, 'user');
    fireEvent.click(await screen.findByRole('my-order-button'));
    fireEvent.click((await screen.findAllByRole('delete-order-product-button'))[0]);

    expect(mockDeleteProduct).toHaveBeenCalledTimes(1);
    expect(mockDeleteProduct).toHaveBeenCalledWith('abc', 'qwerty1');
  });

  test('should display order in progress view after completion' ,async () => {
    let orderInProg = order;
    orderInProg.status = 'shopping';
    
    render(<OpenOrderView openOrder={orderInProg} />, { route: '/user' }, true, 'user');
    expect(await screen.findByTestId('order-in-progress-view')).toBeInTheDocument();
  });
})

// TODO: add tests for my order modal
