import Fire from '../services/Firebase';
import { ORDER_STATUS } from '../constants';
import { OrderStatus, Order } from '../types/interfaces';

const orderSeq = (status: OrderStatus) => ({
  [ORDER_STATUS.OPEN]: 0,
  [ORDER_STATUS.COMPLETION]: 1,
  [ORDER_STATUS.SHOPPING]: 2,
  [ORDER_STATUS.PAYING]: 3,
  [ORDER_STATUS.CLOSED]: 4
}[status]);

const getOrderStatus = (order: Order): OrderStatus => {
  if (order.status === ORDER_STATUS.OPEN) {
    if (order.closingTime.getTime() < new Date().getTime()) {
      return ORDER_STATUS.COMPLETION;
    }
  }

  if (order.status === ORDER_STATUS.PAYING) {
    const orderPayed = order.orderUsers.every(user => user.payed);
    if (orderPayed) {
      return ORDER_STATUS.CLOSED;
    }
  }

  if (order.status === ORDER_STATUS.SHOPPING) {
    const orderHasPrices = order.orderProducts.every(product => product.price > 0);
    if (orderHasPrices) {
      return ORDER_STATUS.PAYING;
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

const getOrderStatusBtn = (orderId: string, status: OrderStatus) => {

  const btnCb = (orderId: string, newStatus: OrderStatus) => {
    Fire.updateEntry('orders', orderId, { status: newStatus });
  }

  if (status === ORDER_STATUS.OPEN) {
    return {
      orderStatusBtnText: 'עבור להשלמות',
      orderStatusBtnFunction: () => btnCb(orderId, ORDER_STATUS.COMPLETION)
    }
  }

  if (status === ORDER_STATUS.COMPLETION) {
    return {
      orderStatusBtnText: 'סגור השלמות',
      orderStatusBtnFunction: () => btnCb(orderId, ORDER_STATUS.SHOPPING)
    }
  }

  if (status === ORDER_STATUS.CLOSED) {
    return {
      orderStatusBtnText: '',
      orderStatusBtnFunction: () => {}
    }
  }

  return {
    orderStatusBtnText: 'סגור הזמנה',
    orderStatusBtnFunction: () => {
      Fire.updateEntry('orders', orderId, {
        status: ORDER_STATUS.CLOSED,
        active: false,
        closingTime: new Date().getTime()
      });
    }
  }
}

export {
  getOrderStatus,
  orderSeq,
  mapOrderStatusToText,
  getOrderStatusBtn
}