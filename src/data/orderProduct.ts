import { OrderProduct } from '../types/interfaces';

export const orderProducts: OrderProduct[] = [
  {
    _id: '123',
    productRef: 'qwerty1',
    orderRef: '1',
    totalQty: 2,
    missing: 10,
    price: 0
  },
  {
    _id: '456',
    productRef: 'qwerty2',
    orderRef: '1',
    totalQty: 3,
    missing: 9,
    price: 0
  },
  {
    _id: '789',
    productRef: 'qwerty3',
    orderRef: '2',
    totalQty: 2,
    missing: 3,
    price: 0
  },
  {
    _id: '012',
    productRef: 'qwerty4',
    orderRef: '2',
    totalQty: 1,
    missing: 4,
    price: 0
  }
]

/**
 * get OrderProduct[] by Order id
 * @param order ref to Order
 */
export const getOrderProducts = (order: string) => orderProducts.filter(orders => orders.orderRef === order);
