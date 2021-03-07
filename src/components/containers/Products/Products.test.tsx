import React from 'react';
import { render, screen, act } from '../../../tests/testUtils';
import { ionFireEvent as fireEvent } from '@ionic/react-test-utils';
import Fire from '../../../services/Firebase';

import Products from './Products';

test('should render products list header', async () => {
  render(<Products />, { route: './admin' });
  expect(await screen.findByText('מוצרים')).toBeInTheDocument();
});

test('should render correct number of product items', async () => {
  render(<Products />, { route: './admin' });
  expect(await screen.findAllByTestId('products-list-item')).toHaveLength(6);
});

test('should open new product modal on clicking the new product btn', async () => {
  render(<Products />, { route: './admin' });
  fireEvent.click(await screen.findByTestId('add-product-button'));
  expect(await screen.findByText('הכנס פרטי מוצר')).toBeInTheDocument();
});

// test('should have modal new product button disabled initially', async () => {
//   render(<Products />, { route: './admin' });
//   fireEvent.click(await screen.findByTestId('add-product-button'));
//   expect(screen.getByText('הוסף מוצר')).toHaveProperty('aria-disabled', 'true')
// });

test('should fill in new product form and add product', async () => {
  const addNewProduct = jest.spyOn(Fire, 'addNewProduct');
  const addProduct = jest.fn(() => Promise.resolve());
  render(<Products />, { route: './admin' });
  fireEvent.click(await screen.findByTestId('add-product-button'));
  
  fireEvent.ionChange(await screen.findByRole('product-name-input'), 'rice');
  fireEvent.ionChange(await screen.findByRole('product-minQty-input'), '5');
  fireEvent.ionChange(await screen.findByRole('product-qtyUnit-input'), 'unit');
  
  fireEvent.click(await screen.findByText('הוסף מוצר'));
  expect(addNewProduct).toHaveBeenCalledTimes(1);
  expect(addNewProduct).toHaveBeenCalledWith({
    name: 'rice',
    minQty: 5,
    qtyUnit: 'unit'
  });
  await act(async () => await addProduct());
});