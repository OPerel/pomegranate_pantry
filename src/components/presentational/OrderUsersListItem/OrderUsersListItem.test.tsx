import React from 'react';
import { render, fireEvent, screen } from '../../../tests/testUtils';
import '@testing-library/jest-dom/extend-expect';

import OrderUsersListItem from './OrderUsersListItem';
import ViewOrder from '../../containers/ViewOrder/ViewOrder';

const orderUser = {
  _id: '1',
  products: [{ productRef: 'qwerty1', qty: 2 }, { productRef: 'qwerty2', qty: 3 }],
  userRef: 'ZMTBBeoL4ja79HFVDVoTUHDtzJw1',
  orderRef: '1',
  totalPrice: 56,
  payed: false
}

const routeComponentPropsMock = {
  // add jest.fn() as needed to any of the objects
  history: {} as any,
  location: { pathname: 'admin/order/1' } as any,
  match: { params: { id: '1' } } as any,
}

test('should click details button and render user\'s products list', async () => {
  render(
    <ViewOrder {...routeComponentPropsMock}>
      <OrderUsersListItem orderUser={orderUser} />
    </ViewOrder>,
    { route: 'admin/order/1' }
  );
  fireEvent.click((await screen.findAllByTestId('order-user-list-item'))[0]);
  await screen.findByTestId('order-user-item-details');
  expect(await screen.findAllByTestId('order-user-product-list-item')).toHaveLength(2);
});

test('should display product name', async () => {
  render(
    <ViewOrder {...routeComponentPropsMock}>
      <OrderUsersListItem orderUser={orderUser} />
    </ViewOrder>,
    { route: 'admin/order/1' }
  );
  fireEvent.click((await screen.findAllByTestId('order-user-list-item'))[0]);
  expect((await screen.findAllByTestId('order-user-product-list-item'))[0]).toHaveTextContent('טחינה הר ברכה');
});

test('should render correct user products total', async () => {
  render(
    <ViewOrder {...routeComponentPropsMock}>
      <OrderUsersListItem orderUser={orderUser} />
    </ViewOrder>,
    { route: 'admin/order/1' }
  );
  fireEvent.click((await screen.findAllByTestId('order-user-list-item'))[0]);
  expect((await screen.findAllByTestId('order-user-product-list-item'))[0]).toHaveTextContent('56');
});