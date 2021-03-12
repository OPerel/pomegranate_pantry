import React from 'react';
import { render, screen } from '../../../tests/testUtils';
import { ionFireEvent as fireEvent } from '@ionic/react-test-utils';
import '@testing-library/jest-dom/extend-expect';

import OpenOrderProductItem from './OpenOrderProductItem';
import { Product } from '../../../types/interfaces';

import Fire from '../../../services/Firebase';

const unOrderedProduct: Product = {
  _id: 'qwerty4',
  name: 'חומוס',
  qtyUnit: 'Kg',
  minQty: 5,
}

const orderedProduct: Product = {
  _id: 'qwerty1',
  name: 'טחינה הר ברכה',
  qtyUnit: 'unit',
  minQty: 12,
}


test('should render with product\'s name', async () => {
  render(
    <OpenOrderProductItem product={unOrderedProduct} />,
    { route: '/user' }, true, 'user'
  );
  const item = await screen.findByTestId('open-order-product-item');
  expect(item).toBeInTheDocument();
  expect(item).toHaveTextContent('חומוס');
});

test('should have empty input placeholder for un-ordered product', async () => {
  render(
    <OpenOrderProductItem product={unOrderedProduct} />,
    { route: '/user' }, true, 'user'
  );
  const qtyInput = await screen.findByRole('order-product-qty-input');
  expect(qtyInput).not.toHaveProperty('placeholder', '2');
});

test('should have no color attr for un-ordered product', async () => {
  render(
    <OpenOrderProductItem product={unOrderedProduct} />,
    { route: '/user' }, true, 'user'
  );

  expect(await screen.findByTestId('open-order-product-item')).toHaveAttribute('color', '');
});

test('should have a placeholder with qty value for ordered product', async () => {
  render(
    <OpenOrderProductItem product={orderedProduct} />,
    { route: '/user' }, true, 'user'
  );

  expect(await screen.findByPlaceholderText('2')).toBeInTheDocument();
});

test('should have a "medium" color attr for ordered product', async () => {
  render(
    <OpenOrderProductItem product={orderedProduct} />,
    { route: '/user' }, true, 'user'
  );

  expect(await screen.findByTestId('open-order-product-item')).toHaveAttribute('color', 'medium');
});

test('should have correct missing qty' ,async () => {
  render(
    <OpenOrderProductItem product={orderedProduct} />,
    { route: '/user' }, true, 'user'
  );

  expect(await screen.findByRole('missing-product-qty')).toHaveTextContent('10');
});

test('should type in product qty and add to order', async () => {
  const mockHandleAddProductClick = jest.spyOn(Fire, 'addProductToOrder');

  render(
    <OpenOrderProductItem product={unOrderedProduct} />,
    { route: '/user' }, true, 'user'
  );

  fireEvent.ionChange(await screen.findByRole('order-product-qty-input'), '3');
  fireEvent.click(await screen.findByRole('add-product-to-order-button'));

  expect(mockHandleAddProductClick).toHaveBeenCalledTimes(1);
  expect(mockHandleAddProductClick).toHaveBeenCalledWith({
    orderRef: '1',
    productRef: 'qwerty4',
    currentOrder: 'abc',
    qty: 3
  })
  
});
