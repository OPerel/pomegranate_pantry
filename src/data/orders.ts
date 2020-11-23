import { Order } from '../types/interfaces';

const orders: Order[] = [
  {
    _id: '1',
    open: true, 
    openToUsers: true,
    createdAt: new Date(234234234),
    closingTime: new Date(234234345),
    orderProducts: ['123', '456'],
    userOrders: ['1', '2', '3'],
    totalPrice: 0,
    payed: false
  }
];


export const getOrders = () => orders;

export const getOrder = (_id: string) => orders.find(m => m._id === _id);



