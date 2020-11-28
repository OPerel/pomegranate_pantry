import React from 'react';
// import ReactDOM from 'react-dom';

import { render, fireEvent } from '../../../tests/testUtils';
import '@testing-library/jest-dom/extend-expect';

import Orders from './Orders';
import { getOrders } from '../../../data/orders'

const ordersLength = getOrders().length;

describe('Order list view', () => {
  test('should render orders list header', async () => {
    const { findByText } = render(<Orders />);
    await findByText('הזמנות');
  });
  
  test('should display orders list', async () => {
    const { findAllByTestId } = render(<Orders />);
    expect(await findAllByTestId('order-list-item')).toHaveLength(ordersLength);
  });
  
  // test('should click add order button and display new order', async () => {
  //   const { findByText, findByTestId, findAllByTestId } = render(<Orders />);
  //   fireEvent.click(await findByTestId('add-order-button'));
  //   await findByText('בחר תאריך סיום');
  //   await findByTestId('date-modal')
  //   // await findByText(new Date().toDateString());
  //   // expect(await findAllByTestId('order-list-item')).toHaveLength(ordersLength + 1);
  // });
})
