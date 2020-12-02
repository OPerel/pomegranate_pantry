import React from 'react';

import { render, fireEvent } from '../../../tests/testUtils';
import '@testing-library/jest-dom/extend-expect';

import Admin from '.';

test('should display admin page header', async () => {
  const { findByText } = render(<Admin />);
  await findByText('אדמין');
});

test('should display orders by default', async () => {
  const { findByTestId } = render(<Admin />);
  await findByTestId('admin-orders-list');
});

test('should change to products view on click button', async () => {
  const { findByTestId } = render(<Admin />);
  fireEvent.click(await findByTestId('admin-products-button'));
  await findByTestId('admin-products-list');
});