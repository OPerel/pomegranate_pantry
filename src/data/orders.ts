import { Order } from '../types/interfaces';

const orders: Order[] = [
  {
    _id: '1',
    open: true, 
    openToUsers: true,
    createdAt: new Date(234234234),
    closingTime: new Date(234234345),
    totalPrice: 0,
    payed: false
  }
];


export const getOrders = () => orders;

export const getOrder = (_id: string) => orders.find(m => m._id === _id);

export const addOrder = async (orderDetails: Order): Promise<Order> => {
  const orderWithId = { ...orderDetails, _id: (orders.length + 1).toString() }
  console.log('orders before push :', orders)
  orders.push(orderWithId);
  console.log('orders after push :', orders)
  return orderWithId
}



