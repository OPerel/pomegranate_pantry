import { OrderUser } from '../types/interfaces';

const userOrders: OrderUser[] = [
  {
    _id: '1',
    products: [{ productRef: 'qwerty1', qty: 2 }, { productRef: 'qwerty2', qty: 3 }],
    userRef: 'a',
    orderRef: '1',
    totalPrice: 56,
    payed: false
  },
  {
    _id: '2',
    products: [{ productRef: 'qwerty3', qty: 2 }, { productRef: 'qwerty4', qty: 1 }],
    userRef: 'b',
    orderRef: '-MNArMQr-Jxt0gE8-Szk',
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