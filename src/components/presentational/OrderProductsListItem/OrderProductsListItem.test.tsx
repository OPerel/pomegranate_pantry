import React from 'react';
import { render, screen } from '../../../tests/testUtils';
import { ionFireEvent as fireEvent } from '@ionic/react-test-utils';
import '@testing-library/jest-dom/extend-expect';

import OrderProductsListItem from './OrderProductsListItem';
import Fire from '../../../services/Firebase';

const orderProduct = {
  _id: '456',
  productRef: 'qwerty2',
  orderRef: '1',
  totalQty: 3,
  missing: 9,
  price: 18,
}

test('should display correct product name', async () => {
  render(
    <OrderProductsListItem orderProduct={orderProduct} />,
    { route: 'admin/order/1' }
  );
  expect(await screen.findByRole('order-product-name')).toHaveTextContent('מוטי רסק עגבניות');
});

test('should display correct product totalQty', async () => {
  render(
    <OrderProductsListItem orderProduct={orderProduct} />,
    { route: 'admin/order/1' }
  );
  expect(await screen.findByRole('order-product-totalQty')).toHaveTextContent('3');
});

test('should display correct product missing qty', async () => {
  render(
    <OrderProductsListItem orderProduct={orderProduct} />,
    { route: 'admin/order/1' }
  );
  expect(await screen.findByRole('order-product-missing')).toHaveTextContent('9');
});

// test('should have price input disabled', async () => {
//   render(
//     <OrderProductsListItem orderProduct={orderProduct} />,
//     { route: 'admin/order/1' }
//   );
//   const input = await screen.findByRole('order-product-price-input');
//   expect(input).toHaveTextContent('18');
// });

test('should display correct product total price', async () => {
  render(
    <OrderProductsListItem orderProduct={orderProduct} />,
    { route: 'admin/order/1' }
  );
  expect(await screen.findByRole('order-product-total-price')).toHaveTextContent('54');
});


test('should click on item details button and render locations details', async () => {
  render(
    <OrderProductsListItem orderProduct={orderProduct} />,
    { route: 'admin/order/1' }
  );
  fireEvent.click(await screen.findByRole('open-order-product-details'));
  expect(await screen.findByTestId('order-product-locations-details')).toBeInTheDocument();
  expect(await screen.findByText('כמות לפי מיקום')).toBeInTheDocument();
});

test('should display correct qty by locations', async () => {
  render(
    <OrderProductsListItem orderProduct={orderProduct} />,
    { route: 'admin/order/1' }
  );
  fireEvent.click(await screen.findByRole('open-order-product-details'));
  expect(await screen.findByTestId('order-product-locations-details'))
    .toHaveTextContent('תל אביב - 3פרדס חנה - 0');
});

test('should type in product price and update it', async () => {
  const mockUpdatePrice = jest.spyOn(Fire, 'updateEntry');
  
  render(
    <OrderProductsListItem orderProduct={orderProduct} />,
    { route: 'admin/order/1' }
  );

  fireEvent.ionChange(await screen.findByRole('order-product-price-input'), '20')
  fireEvent.click(await screen.findByRole('update-order-product-price'));
  expect(mockUpdatePrice).toHaveBeenCalledTimes(1);
  expect(mockUpdatePrice).toHaveBeenCalledWith('orderProducts', orderProduct._id, {
    price: 20
  });
});
