import React from 'react';
import { render, screen, fireEvent } from '../../../tests/testUtils';
// import { ionFireEvent as fireEvent } from '@ionic/react-test-utils';
// import Fire from '../../../services/Firebase';

import User from './User';

test('should greet user by name', async () => {
  render(<User />, { route: './user/ZMTBBeoL4ja79HFVDVoTUHDtzJw1'}, true, 'user');
  expect(await screen.findByRole('greet-user-by-name')).toHaveTextContent('שלום e rimon');
});

test('should render open order by default', async () => {
  render(<User />, { route: './user/ZMTBBeoL4ja79HFVDVoTUHDtzJw1'}, true, 'user');
  expect(await screen.findByTestId('open-order-title')).toBeInTheDocument();
});

/** removed at the moment */

// test('should click old orders tab button and render old orders list', async () => {
//   render(<User />, { route: './user/ZMTBBeoL4ja79HFVDVoTUHDtzJw1'}, true, 'user');
//   fireEvent.click(await screen.findByRole('old-orders-tab'));
//   expect(await screen.findByTestId('old-user-orders')).toBeInTheDocument();
// });