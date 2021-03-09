import React from 'react';
import { render, screen } from '../../../tests/testUtils';
import { ionFireEvent as fireEvent } from '@ionic/react-test-utils';
import '@testing-library/jest-dom/extend-expect';
import Fire from '../../../services/Firebase';

import Orders from './Orders';

describe('Order list view', () => {
  test('should render orders list header', async () => {
    render(<Orders />, { route: './admin' });
    await screen.findByText('הזמנות');
  });
  
  test('should display orders list', async () => {
    render(<Orders />, { route: './admin' });
    expect(await screen.findAllByTestId('order-list-item')).toHaveLength(1);
  });
  
  test('should click add order button and display new order modal', async () => {
    render(<Orders />, { route: './admin' });
    fireEvent.click(await screen.findByTestId('add-order-button'));
    expect(await screen.findByText('בחר תאריך סיום')).toBeInTheDocument();
    expect(await screen.findByTestId('date-modal')).toBeInTheDocument();
  });
  
  /** IonDateTime not rendering in test environment! */
  
  // test('should select date and add order to db', async () => {
  //   const mockAddOrder = jest.spyOn(Fire, 'addNewOrder');
  //   const dateString = new Date().setDate(new Date().getTime() + 30).toString();
  //   render(<Orders />, { route: './admin' });
  //   fireEvent.click(await screen.findByTestId('add-order-button'));
  //   fireEvent.ionChange(await screen.findByTestId(
  //     'end-order-date-selector'),
  //     dateString
  //   );
  //   expect(mockAddOrder).toHaveBeenCalledWith(new Date(dateString));
  // });
})
