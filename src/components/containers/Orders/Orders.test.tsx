import React from 'react';
import AdminStateProvider from '../../context/adminState/AdminContextProvider';
// import ReactDOM from 'react-dom';

import { render, fireEvent, screen } from '../../../tests/testUtils';
import '@testing-library/jest-dom/extend-expect';

import Orders from './Orders';
const OrdersWithState = AdminStateProvider(Orders);

describe('Order list view', () => {
  test('should render orders list header', async () => {
    render(<OrdersWithState />, { route: './admin' });
    await screen.findByText('הזמנות');
  });
  
  test('should display orders list', async () => {
    render(<OrdersWithState />, { route: './admin' });
    expect(await screen.findAllByTestId('order-list-item')).toHaveLength(1);
  });
  
  test('should click add order button and display new order', async () => {
    render(<OrdersWithState />, { route: './admin' });
    fireEvent.click(await screen.findByTestId('add-order-button'));
    await screen.findByText('בחר תאריך סיום');
    await screen.findByTestId('date-modal')
  });
  // should also test for modal functionality (selecting a date..)?
})
