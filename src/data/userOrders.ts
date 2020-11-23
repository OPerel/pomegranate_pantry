import { UserOrder } from '../types/interfaces';

const userOrders: UserOrder[] = [
  {
    _id: '1',
    products: [{ product: 'qwerty1', qty: 2 }, { product: 'qwerty2', qty: 3 }],
    userRef: 'a',
    orderRef: '1',
    totalPrice: 56,
    payed: false
  },
  {
    _id: '2',
    products: [],
    userRef: 'b',
    orderRef: '1',
    totalPrice: 0,
    payed: true
  },
  {
    _id: '3',
    products: [],
    userRef: 'c',
    orderRef: '1',
    totalPrice: 0,
    payed: true
  }
];

/**
 * get UserOrder[] by Order id
 * @param orderRef ref to Order
 */
export const getOrderUsers = (orderRef: string) => userOrders.filter(orders => orders.orderRef === orderRef);

/**
 * get UserOrder by user
 * @param _id User id
 */
export const getUserOrder = (_id: string) => userOrders.filter(m => m._id === _id)[0];