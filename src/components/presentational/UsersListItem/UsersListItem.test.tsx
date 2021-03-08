import React from 'react';
import { render, screen } from '../../../tests/testUtils';
import '@testing-library/jest-dom/extend-expect';

import UsersListItem from './UsersListItem';
import { User } from '../../../types/interfaces';

const user: User = {
  _id: 'ZMTBBeoL4ja79HFVDVoTUHDtzJw1', 
  name: 'e rimon',
  location: 'TA',
  role: 'rimon'
}

test('should display correct user name', async () => {
  render(<UsersListItem user={user} />, { route: '/admin' });
  expect(await screen.findByRole('user-item-name')).toHaveTextContent('e rimon');
});

test('should display correct user location', async () => {
  render(<UsersListItem user={user} />, { route: '/admin' });
  expect(await screen.findByRole('user-item-location')).toHaveTextContent('תל-אביב');
});
