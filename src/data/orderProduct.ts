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

export const orderProducts: OrderProduct[] = [
  {
    _id: '123',
    product: 'qwerty1',
    order: '1',
    totalQty: 2,
    missing: 6,
    fixedTotalPrice: 28,
    finalTotalPrice: null,
    priceWarn: false
  },
  {
    _id: '456',
    product: 'qwerty2',
    order: '1',
    totalQty: 3,
    missing: 4,
    fixedTotalPrice: 13,
    finalTotalPrice: null,
    priceWarn: false
  }
]

/**
 * get OrderProduct[] by Order id
 * @param order ref to Order
 */
export const getOrderProducts = (order: string) => orderProducts.filter(orders => orders.order === order);
