import React from 'react';
import { render, fireEvent, screen } from '../../../tests/testUtils';
import '@testing-library/jest-dom/extend-expect';

import ViewOrder from './ViewOrder';

const routeComponentPropsMock = {
  history: {} as any,
  location: { pathname: 'admin/order/1' } as any,
  match: { params: { id: '1' } } as any,
}

test('should display correct order title', async () => {
  render(
    <ViewOrder {...routeComponentPropsMock} />,
    { route: 'admin/order/1' }
  );
  const title = await screen.findByRole('order-details-title');
  expect(title).toHaveTextContent('הזמנה 11.27.2020פתוח להזמנותנסגר להזמנות ב - 9.28.2020');
});

test('should render order user list by default', async () => {
  render(
    <ViewOrder {...routeComponentPropsMock} />,
    { route: 'admin/order/1' }
  );
  expect(await screen.findByText('רשימת משתמשים')).toBeInTheDocument();
});


test('should click on products button and display list', async () => {
  render(
    <ViewOrder {...routeComponentPropsMock} />,
    { route: 'admin/order/1' }
  );
  fireEvent.click(await screen.findByText('מוצרים'));
  expect(await screen.findByRole('order-products-list')).toBeInTheDocument();
  expect(await screen.findByText('רשימת מוצרים')).toBeInTheDocument();
})