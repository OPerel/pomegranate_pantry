import React from 'react';
import { render, fireEvent, screen } from '../../../tests/testUtils';
import '@testing-library/jest-dom/extend-expect';

import OrderUsersListItem from './OrderUsersListItem';

const orderUser = {
  _id: '1',
  products: [{ productRef: 'qwerty1', qty: 2 }, { productRef: 'qwerty2', qty: 3 }],
  userRef: 'ZMTBBeoL4ja79HFVDVoTUHDtzJw1',
  orderRef: '1',
  totalPrice: 56,
  payed: false
}

// should also test for the data in the orderUser item itself

test('should click details button and render user\'s products list', async () => {
  render(
    <OrderUsersListItem orderUser={orderUser} />,
    { route: 'admin/order/1' }
  );
  fireEvent.click(await screen.findByTestId('order-user-list-item'));
  await screen.findByTestId('order-user-item-details');
  expect(await screen.findAllByTestId('order-user-product-list-item')).toHaveLength(2);
});

test('should display product name', async () => {
  render(
    <OrderUsersListItem orderUser={orderUser} />,
    { route: 'admin/order/1' }
  );
  fireEvent.click(await screen.findByTestId('order-user-list-item'));
  expect((await screen.findAllByTestId('order-user-product-list-item'))[0]).toHaveTextContent('טחינה הר ברכה');
});

test('should render correct product total', async () => {
  render(
    <OrderUsersListItem orderUser={orderUser} />,
    { route: 'admin/order/1' }
  );
  fireEvent.click(await screen.findByTestId('order-user-list-item'));
  expect((await screen.findAllByRole('product-total-price'))[0]).toHaveTextContent('56');
});