import React from 'react';
import { render, fireEvent, screen } from '../../../tests/testUtils';
import '@testing-library/jest-dom/extend-expect';

import ViewOrder from './ViewOrder';

const routeComponentPropsMock = {
  history: {} as any,
  location: { pathname: 'admin/order/1' } as any,
  match: { params: { id: '1' } } as any,
}

test('should render order user list header', async () => {
  render(
    <ViewOrder {...routeComponentPropsMock} />,
    { route: 'admin/order/1' }
  );
  await screen.findByText('רשימת משתמשים');
});

test('should display order users list', async () => {
  render(
    <ViewOrder {...routeComponentPropsMock} />,
    { route: 'admin/order/1' }
  );
  expect(await screen.findAllByTestId('order-user-list-item')).toHaveLength(2);
});

test('should click on products button and display list', async () => {
  render(
    <ViewOrder {...routeComponentPropsMock} />,
    { route: 'admin/order/1' }
  );
  fireEvent.click(await screen.findByText('מוצרים'));
  expect(await screen.findAllByTestId('product-order-list-item')).toHaveLength(2);
})