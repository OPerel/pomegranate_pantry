import React from 'react';
import { render, fireEvent, screen, waitForElementToBeRemoved } from '../../../tests/testUtils';
import '@testing-library/jest-dom/extend-expect';

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


test('should filter users by location', async () => {
  // const mockSetState = jest.spyOn(React, "useState");
  // render(
  //   <ViewOrder {...routeComponentPropsMock}>
  //     <OrderUsersList orderUsers={orderUsers} />,
  //   </ViewOrder>,
  //   { route: 'admin/order/1' }
  // )

  // expect(mockSetState).toHaveBeenCalledTimes(1);
  // expect(mockSetState).toHaveBeenCalledWith(null);
  // expect(await screen.findAllByTestId('order-user-list-item')).toHaveLength(2);

  // fireEvent.click(await screen.findByTestId('filter-user-location'));
  // fireEvent.click(await screen.findByTestId('filter-by-ta'));

  // // expect(mockSetState).toHaveBeenCalledTimes(2);
  // // expect(mockSetState).toHaveBeenCalledWith('TA');

  // await waitForElementToBeRemoved(() => (screen.getAllByTestId('order-user-list-item'))[1])
  // expect(await screen.findAllByTestId('order-user-list-item')).toHaveLength(1);
})