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
// totalQty = UserOrder.products.reduce((acc, {p, qty}) => acc += aty, 0) of all UserOrders in the current Order
// fixedTotalPrice = totalQty * Product.price

export interface UserOrderProducts {
  product: string, // ref to Product
  qty: number
}

export interface UserOrder {
  _id: string;
  products: UserOrderProducts[]; // array of Products`
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