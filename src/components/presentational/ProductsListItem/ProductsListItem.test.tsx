import React from 'react';
import { render, screen } from '../../../tests/testUtils';
import '@testing-library/jest-dom/extend-expect';

import ProductsListItem from './ProductsListItem';
import { Product } from '../../../types/interfaces';

const product: Product = {
  _id: 'qwerty4',
  name: 'חומוס',
  qtyUnit: 'Kg',
  minQty: 5,
}

test('should display correct product name', async () => {
  render(<ProductsListItem product={product} />, { route: '/admin' });
  expect(await screen.findByRole('product-item-name')).toHaveTextContent('חומוס');
});

test('should display correct product minQty', async () => {
  render(<ProductsListItem product={product} />, { route: '/admin' });
  expect(await screen.findByRole('product-item-minQty')).toHaveTextContent('5');
});

test('should display correct product qtyUnit', async () => {
  render(<ProductsListItem product={product} />, { route: '/admin' });
  expect(await screen.findByRole('product-item-qtyUnit')).toHaveTextContent('Kg');
});
