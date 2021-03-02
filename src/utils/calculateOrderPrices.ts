import Fire from '../services/Firebase';
import { Order } from '../types/interfaces';

const calculateOrderTotals = (order: Order): void => {
  const { orderUsers, orderProducts } = order;
  let updateObj: {[key: string]: number} = {};
  let orderTotal = 0;

  orderUsers.forEach(({ products, _id }) => {
    let orderUserTotal = 0;
    products?.forEach(({ productRef, qty }) => {
      const productPrice = orderProducts.find(p => p.productRef === productRef)?.price as number;
      const orderUserProductPrice = productPrice * qty;
      orderUserTotal += orderUserProductPrice;
    });
    updateObj[`${_id}/totalPrice`] = orderUserTotal;
    orderTotal += orderUserTotal;
  });
  Fire.updateOrderUsersPrice(updateObj);
  Fire.updateEntry('orders', order._id, { totalPrice: orderTotal });
}

export {
  calculateOrderTotals
}