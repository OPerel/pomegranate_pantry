// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';

import { mockIonicReact } from '@ionic/react-test-utils';
mockIonicReact();

jest.mock('./services/Firebase', () => {
  const ordersData = [
    {
      _id: '1',
      open: true, 
      openToUsers: true,
      createdAt: new Date(1606513716688),
      closingTime: new Date(1601241806937),
      totalPrice: 0,
      payed: false
    }
  ];

  const orderUsersData = [
    {
      _id: '1',
      products: [{ product: 'qwerty1', qty: 2 }, { product: 'qwerty2', qty: 3 }],
      userRef: 'a',
      orderRef: '1',
      totalPrice: 56,
      payed: false
    },
    {
      _id: '2',
      products: [{ product: 'qwerty3', qty: 2 }, { product: 'qwerty4', qty: 1 }],
      userRef: 'b',
      orderRef: '2',
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

  const productsData = [
    {
      _id: 'qwerty1',
      name: 'טחינה הר ברכה',
      price: 19.00,
      qtyUnit: 'unit',
      minQty: 12,
    },
    {
      _id: 'qwerty2',
      name: 'מוטי רסק עגבניות',
      price: 6.00,
      qtyUnit: 'unit',
      minQty: 12,
    },
    {
      _id: 'qwerty3',
      name: 'קשיו טבעי',
      price: 50.00,
      qtyUnit: 'Kg',
      minQty: 5,
    },
    {
      _id: 'qwerty4',
      name: 'חומוס',
      price: 38.00,
      qtyUnit: 'Kg',
      minQty: 5,
    },
    {
      _id: 'qwertt5',
      name: 'קינואה',
      price: 58.00,
      qtyUnit: 'Kg',
      minQty: 5,
    },
    {
      _id: 'qwertyy7',
      name: 'עדשים כתומות',
      price: 29.00,
      qtyUnit: 'Kg',
      minQty: 5,
    }
  ];

  const orderProductsData = [
    {
      _id: '123',
      product: 'qwerty1',
      order: '1',
      totalQty: 2,
      missing: 10,
      fixedTotalPrice: 28,
      finalTotalPrice: null,
      priceWarn: false
    },
    {
      _id: '456',
      product: 'qwerty2',
      order: '1',
      totalQty: 3,
      missing: 9,
      fixedTotalPrice: 18,
      finalTotalPrice: null,
      priceWarn: false
    },
    {
      _id: '789',
      product: 'qwerty3',
      order: '2',
      totalQty: 2,
      missing: 3,
      fixedTotalPrice: 100,
      finalTotalPrice: null,
      priceWarn: false
    },
    {
      _id: '012',
      product: 'qwerty4',
      order: '2',
      totalQty: 1,
      missing: 4,
      fixedTotalPrice: 38,
      finalTotalPrice: null,
      priceWarn: false
    }
  ];

  return {
    ordersCollectionListener: (cb) => {cb(ordersData)},
    productsCollectionListener: (cb) => {cb(productsData)},
    orderUsersCollectionListener: (id, cb) => {cb(orderUsersData)},
    orderProductsCollectionListener: (id, cb) => {cb(orderProductsData)},
    orderListener: (id, cb) => {cb(ordersData[0])},
    addNewOrder: () => {
      // const orderWithId = { ...orderDetails, _id: (ordersData.length + 1).toString() }
      // console.log('orders before push :', ordersData)
      const newOrder = {
        _id: '-MNArMQr-Jxt0gE8-Szk',
        open: true, 
        openToUsers: true,
        createdAt: new Date(),
        closingTime: new Date().setDate(new Date().getTime) + 30,
        totalPrice: 0,
        payed: false
      }
      ordersData.push(newOrder);
      // console.log('orders after push :', ordersData)
      // return orderWithId
    }
  };
});
