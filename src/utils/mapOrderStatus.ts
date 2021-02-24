import { ORDER_STATUS } from '../constants';
import { OrderStatus, Order } from '../types/interfaces';
import Fire from '../services/Firebase';

const getOrderStatus = async (order: Order): Promise<string> => {
  if (order.status === ORDER_STATUS.OPEN || ORDER_STATUS.SHOPPING || ORDER_STATUS.PAYING) {
    if (order.closingTime < new Date()) {
      return ORDER_STATUS.COMPLETION;
    }

    if (order.status === ORDER_STATUS.PAYING) {
      const orderUsers = await Fire.getOrderUsers(order._id);
      const orderPayed = orderUsers.every(user => user.payed);
      if (orderPayed) {
        return ORDER_STATUS.CLOSED;
      }
    }

    if (order.status === ORDER_STATUS.SHOPPING) {
      const orderProducts = await Fire.getOrderProducts(order._id);
      const orderHasPrices = orderProducts.every(product => product.price > 0);
      if (orderHasPrices) {
        return ORDER_STATUS.PAYING;
      }
    }
  }

  return order.status;
}

const mapOrderStatusToText = (status: OrderStatus) => {
  return {
    [ORDER_STATUS.CLOSED]: 'ההזמנה סגורה',
    [ORDER_STATUS.COMPLETION]: 'פתוח להשלמות',
    [ORDER_STATUS.OPEN]: 'פתוח להזמנות',
    [ORDER_STATUS.PAYING]: 'בתשלום',
    [ORDER_STATUS.SHOPPING]: 'בקניות'
  }[status]
}

export {
  getOrderStatus,
  mapOrderStatusToText
}