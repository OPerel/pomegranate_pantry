export interface User {
  name: string,
  role: 'user' | 'rimon',
  location: 'TA' | 'PH',
  _id: string,
  email: string
}

export type OrderStatus = 'open' | 'completion' | 'shopping' | 'paying' | 'closed';

export interface Order {
  _id: string,
  status: OrderStatus,
  active: boolean,
  createdAt: Date,
  closingTime: Date,
  totalPrice: number | null, // total price of UsersOrders 
  orderUsers: OrderUser[], // array of OrderUsers
  orderProducts: OrderProduct[], // array of OrderProducts
}

// Order.totalPrice = userOrdres.reduce((acc, order) => acc += order.totalPrice, 0)

export interface OrderProduct {
  productRef: string, // ref to Product
  orderRef: string, // ref to Order
  totalQty: number,
  missing: number | null,
  price: number,
}

// missing = (totalQty % Product.minQty) !== 0
//   ? ((Math.floor(totalQty / Product.minQty) + 1) * Product.minQty) - totalQty
//   : null
// totalQty = OrderUser.products.reduce((acc, {p, qty}) => acc += aty, 0) of all OrderUsers in the current Order
// fixedTotalPrice = totalQty * Product.price

export interface OrderUserProduct {
  productRef: string, // ref to Product
  qty: number
}

export interface OrderUser {
  _id: string,
  products: OrderUserProduct[], // array of Products`
  userRef: string, // a ref to the user
  orderRef: string, // a ref to the order
  totalPrice: number | null, // total price of products.qty
  payed: boolean
}

export interface Product {
  name: string,
  minQty: number,
  qtyUnit: 'unit' | 'Kg',
  _id?: string
}