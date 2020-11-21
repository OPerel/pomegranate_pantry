export interface UserOrder {
  _id: string;
  products: string[]; // array of Products`
  userRef: string // a ref to the user
  orderRef: string // a ref to the order
  totalPrice: number; // total price of UsersOrders
  payed: boolean;
}

const userOrders: UserOrder[] = [
  {
    _id: '1',
    products: [],
    userRef: 'a',
    orderRef: '1',
    totalPrice: 0,
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


export const getOrderUsers = (orderRef: string) => userOrders.filter(orders => orders.orderRef === orderRef);

export const getUserOrder = (_id: string) => userOrders.filter(m => m._id === _id)[0];