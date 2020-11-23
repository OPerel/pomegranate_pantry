import { OrderProduct } from '../types/interfaces';

export const orderProducts: OrderProduct[] = [
  {
    _id: '123',
    product: 'qwerty1',
    order: '1',
    totalQty: 2,
    missing: 10,
    fixedTotalPrice: 28,
    finalTotalPrice: null,
    priceWarn: false
  },
  {
    _id: '456',
    product: 'qwerty2',
    order: '1',
    totalQty: 3,
    missing: 9,
    fixedTotalPrice: 18,
    finalTotalPrice: null,
    priceWarn: false
  }
]

/**
 * get OrderProduct[] by Order id
 * @param order ref to Order
 */
export const getOrderProducts = (order: string) => orderProducts.filter(orders => orders.order === order);
