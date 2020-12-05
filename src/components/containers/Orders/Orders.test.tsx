import React from 'react';
import AdminStateProvider from '../../context/AdminContextProvider';
// import ReactDOM from 'react-dom';

import { render, fireEvent } from '../../../tests/testUtils';
import '@testing-library/jest-dom/extend-expect';

import Orders from './Order';
const OrdersWithState = AdminStateProvider(Orders);

describe('Order list view', () => {
  test('should render orders list header', async () => {
    const { findByText } = render(<OrdersWithState />, { route: './admin' });
    await findByText('הזמנות');
  });
  
  test('should display orders list', async () => {
    const { findAllByTestId } = render(<OrdersWithState />, { route: './admin' });
    expect(await findAllByTestId('order-list-item')).toHaveLength(1);
  });
  
  test('should click add order button and display new order', async () => {
    const { findByText, findByTestId } = render(<OrdersWithState />, { route: './admin' });
    fireEvent.click(await findByTestId('add-order-button'));
    await findByText('בחר תאריך סיום');
    await findByTestId('date-modal')
    // await findByText(new Date().toDateString());
    // expect(await findAllByTestId('order-list-item')).toHaveLength(ordersLength + 1);
  });
})
