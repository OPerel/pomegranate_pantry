import React from 'react';
import { render, screen } from '../../../tests/testUtils';
import '@testing-library/jest-dom/extend-expect';

import Users from './Users';

test('should render users list header', async () => {
  render(<Users />, { route: '/admin' });
  expect(await screen.findByText('משתמשים')).toBeInTheDocument();
});

test('should display order users list', async () => {
  render(<Users />, { route: '/admin' });
  expect(await screen.findAllByRole('users-list-item')).toHaveLength(2);
});
