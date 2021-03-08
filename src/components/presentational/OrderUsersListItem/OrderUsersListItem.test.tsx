import React from 'react';
import { render, fireEvent, screen } from '../../../tests/testUtils';
import '@testing-library/jest-dom/extend-expect';

import OrderUsersListItem from './OrderUsersListItem';

const orderUser = {
  _id: '1',
  products: [{ productRef: 'qwerty1', qty: 2 }, { productRef: 'qwerty2', qty: 3 }],
  userRef: 'ZMTBBeoL4ja79HFVDVoTUHDtzJw1',
  orderRef: '1',
  totalPrice: 110,
  payed: false
}

// should also test for the data in the orderUser item itself
test('should display correct user name', async () => {
  render(
    <OrderUsersListItem orderUser={orderUser} />,
    { route: 'admin/order/1' }
  );
  expect(await screen.findByTestId('order-user-name')).toHaveTextContent('e rimon');
});

test('should display correct user location', async () => {
  render(
    <OrderUsersListItem orderUser={orderUser} />,
    { route: 'admin/order/1' }
  );
  expect(await screen.findByText('תל אביב')).toBeInTheDocument();
});

test('should display correct order user total price', async () => {
  render(
    <OrderUsersListItem orderUser={orderUser} />,
    { route: 'admin/order/1' }
  );
  expect(await screen.findByText('110')).toBeInTheDocument();
});

test('should display correct payed button color and icon', async () => {
  render(
    <OrderUsersListItem orderUser={orderUser} />,
    { route: 'admin/order/1' }
  );
  const button = await screen.findByRole('update-order-user-payed');
  expect(button).toHaveAttribute('color', 'primary');
  expect(button.querySelector('ion-icon')?.outerHTML).toContain('<title>Close</title>');
});

test('should display checkmark icon button for payed order', async () => {
  let payedOrder = orderUser;
  payedOrder.payed = true;

  render(
    <OrderUsersListItem orderUser={payedOrder} />,
    { route: 'admin/order/1' }
  );
  const button = await screen.findByRole('update-order-user-payed');
  expect(button.querySelector('ion-icon')?.outerHTML).toContain('<title>Checkmark</title>');
});

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