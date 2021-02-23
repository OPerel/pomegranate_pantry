export interface User {
  _id: string;
  name: string;
  role: 'user' | 'rimon',
  location: 'TA' | 'PH';
}

type OrderStatus = 'open' | 'completion' | 'shopping' | 'paying' | 'closed';

export interface Order {
  _id: string,
  status: OrderStatus,
  createdAt: Date,
  closingTime: Date,
  totalPrice: number, // total price of UsersOrders 
  // orderProducts: OrderProduct[], // array of OrderProducts
  // OrderUsers: OrderUser[], // array of OrderUsers
}

// Order.payed = userOrdres.every(order => order.payed)
// Order.totalPrice = userOrdres.reduce((acc, order) => acc += order.totalPrice, 0)

export interface OrderProduct {
  _id: string,
  product: string, // ref to Product
  order: string, // ref to Order
  totalQty: number,
  missing: number | null,
  fixedTotalPrice: number,
  finalTotalPrice: number | null,
  priceWarn: boolean
}

// priceWarn = fixedTotalPrice < finalTotalPrice
// missing = (totalQty % Product.minQty) !== 0
//   ? ((Math.floor(totalQty / Product.minQty) + 1) * Product.minQty) - totalQty
//   : null
// totalQty = OrderUser.products.reduce((acc, {p, qty}) => acc += aty, 0) of all OrderUsers in the current Order
// fixedTotalPrice = totalQty * Product.price

export interface OrderUserProducts {
  product: string, // ref to Product
  qty: number
}

export interface OrderUser {
  _id: string;
  products: OrderUserProducts[]; // array of Products`
  userRef: string // a ref to the user
  orderRef: string // a ref to the order
  totalPrice: number; // total price of products.qty
  payed: boolean;
}

export interface Product {
  _id: string,
  name: string,
  price: number,
  minQty: number,
  qtyUnit: 'unit' | 'Kg'
}