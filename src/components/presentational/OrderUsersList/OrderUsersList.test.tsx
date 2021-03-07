import React from 'react';
import { render, screen } from '../../../tests/testUtils';
import '@testing-library/jest-dom/extend-expect';
import { ionFireEvent as fireEvent } from '@ionic/react-test-utils';

import OrderUsersList from './OrderUsersList';
import ViewOrder from '../../containers/ViewOrder/ViewOrder';

const orderUsers = [
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
];

const routeComponentPropsMock = {
  // add jest.fn() as needed to any of the objects
  history: {} as any,
  location: { pathname: 'admin/order/1' } as any,
  match: { params: { id: '1' } } as any,
}


test('should filter users by TA location', async () => {
  render(
    <ViewOrder {...routeComponentPropsMock}>
      <OrderUsersList orderUsers={orderUsers} />,
    </ViewOrder>,
    { route: 'admin/order/1' }
  )

  expect(await screen.findAllByTestId('order-user-list-item')).toHaveLength(2);

  fireEvent.ionChange(await screen.findByTestId('filter-user-location'), 'TA');
  expect(await screen.findAllByTestId('order-user-name')).toHaveLength(1);
  expect(await screen.findByTestId('order-user-name')).toHaveTextContent('e rimon');
});

test('should filter users by PH location', async () => {
  render(
    <ViewOrder {...routeComponentPropsMock}>
      <OrderUsersList orderUsers={orderUsers} />,
    </ViewOrder>,
    { route: 'admin/order/1' }
  )

  expect(await screen.findAllByTestId('order-user-list-item')).toHaveLength(2);

  fireEvent.ionChange(await screen.findByTestId('filter-user-location'), 'PH');
  expect(await screen.findAllByTestId('order-user-name')).toHaveLength(1);
  expect(await screen.findByTestId('order-user-name')).toHaveTextContent('moshe');
});

test('should display all order\'s users when location set to null', async () => {
  render(
    <ViewOrder {...routeComponentPropsMock}>
      <OrderUsersList orderUsers={orderUsers} />,
    </ViewOrder>,
    { route: 'admin/order/1' }
  )

  expect(await screen.findAllByTestId('order-user-list-item')).toHaveLength(2);

  fireEvent.ionChange(await screen.findByTestId('filter-user-location'), 'PH');
  expect(await screen.findAllByTestId('order-user-name')).toHaveLength(1);
  expect(await screen.findByTestId('order-user-name')).toHaveTextContent('moshe');

  fireEvent.ionChange(await screen.findByTestId('filter-user-location'), '');
  expect(await screen.findAllByTestId('order-user-name')).toHaveLength(2);
});