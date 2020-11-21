export interface Order {
  _id: string,
  open: boolean,
  openToUsers: boolean,
  createdAt: Date,
  closingTime: Date,
  orderProducts: string[], // array of OrderProducts` ids
  userOrders: string[], // array of UserOrders` ids
  totalPrice: number, // total price of UsersOrders 
  payed: boolean
}

// Order.payed = userOrdres.every(order => order.payed)
// Order.totalPrice = userOrdres.reduce((acc, order) => acc += order.totalPrice, 0)

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



