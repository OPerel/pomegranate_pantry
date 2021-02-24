import { Order } from '../types/interfaces';

const orders: Order[] = [
  // {
  //   _id: '1',
  //   status: 'open',
  //   // open: true, 
  //   // openToUsers: true,
  //   createdAt: new Date(1606513716688),
  //   closingTime: new Date(1601241806937),
  //   totalPrice: 0,
  //   // payed: false
  // },
  // {
  //   _id: '-MNArMQr-Jxt0gE8-Szk',
  //   status: 'open',
  //   closingTime: new Date(1609108824798),
  //   createdAt: new Date(1606516832167),
  //   // open: true,
  //   // openToUsers: true,
  //   // payed: false,
  //   totalPrice: 0
  // }
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



