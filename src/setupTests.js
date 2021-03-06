// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';
import { mockIonicReact } from '@ionic/react-test-utils';
mockIonicReact();
const { getComputedStyle } = window;
window.getComputedStyle = (elt) => getComputedStyle(elt);


jest.mock('./services/Firebase', () => {

  const userData = {
    'ZMTBBeoL4ja79HFVDVoTUHDtzJw1': {
      name: 'e rimon',
      location: 'TA',
      role: 'rimon'
    },
    'c': {
      name: 'moshe',
      location: 'PH',
      role: 'user'
    }
  };

  const productsData = {
    'qwerty1': {
      name: 'טחינה הר ברכה',
      qtyUnit: 'unit',
      minQty: 12,
    },
    'qwerty2': {
      name: 'מוטי רסק עגבניות',
      qtyUnit: 'unit',
      minQty: 12,
    },
    'qwerty3': {
      name: 'קשיו טבעי',
      qtyUnit: 'Kg',
      minQty: 5,
    },
    'qwerty4': {
      name: 'חומוס',
      qtyUnit: 'Kg',
      minQty: 5,
    },
    'qwertt5': {
      name: 'קינואה',
      qtyUnit: 'Kg',
      minQty: 5,
    },
    'qwertyy7': {
      name: 'עדשים כתומות',
      qtyUnit: 'Kg',
      minQty: 5,
    }
  };

  const orderUsersData = [
    {
      _id: 'abc',
      products: [{ productRef: 'qwerty1', qty: 2 }, { productRef: 'qwerty2', qty: 3 }],
      userRef: 'ZMTBBeoL4ja79HFVDVoTUHDtzJw1',
      orderRef: '1',
      totalPrice: 56,
      payed: false
    },
    {
      _id: '2',
      products: [{ productRef: 'qwerty3', qty: 2 }, { productRef: 'qwerty4', qty: 1 }],
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

  const ordersData = [
    {
      _id: '1',
      status: 'open',
      createdAt: new Date(1606513716688),
      closingTime: new Date(1601241806937),
      totalPrice: null,
      orderUsers: [
        {
          _id: 'abc',
          products: [{ productRef: 'qwerty1', qty: 2 }, { productRef: 'qwerty2', qty: 3 }],
          userRef: 'ZMTBBeoL4ja79HFVDVoTUHDtzJw1',
          orderRef: '1',
          totalPrice: 110,
          payed: false
        },
        {
          _id: '3',
          products: [],
          userRef: 'c',
          orderRef: '1',
          totalPrice: 0,
          payed: true
        }
      ],
      orderProducts: [
        {
          productRef: 'qwerty1',
          orderRef: '1',
          totalQty: 2,
          missing: 10,
          price: 28,
        },
        {
          productRef: 'qwerty2',
          orderRef: '1',
          totalQty: 3,
          missing: 9,
          price: 18,
        }
      ]
    }
  ]

  const orderProductsData = [
    {
      _id: '123',
      product: 'qwerty1',
      orderRef: '1',
      totalQty: 2,
      missing: 10,
      price: 28,
    },
    {
      _id: '456',
      product: 'qwerty2',
      orderRef: '1',
      totalQty: 3,
      missing: 9,
      price: 18,
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
    authStateListener: (cb) => {cb(userData, null)},
    getUsers: (cb) => {cb(userData)},
    productsCollectionListener: (cb) => {
      cb(productsData);
      return { unsubscribe: () => {} };
    },
    ordersCollectionListener: (cb) => {
      cb(ordersData);
      return { unsubscribe: () => {} };
    },
    orderListener: (id, cb) => {cb(ordersData[0])},
    getOpenOrderId: async () => '1',
    userOrdersListener: (id, cb) => {
      cb([orderUsersData[0]]);
      return { unsubscribe: () => {} };
    },
    updateEntry: () => {},
    addNewOrder: () => {},
    addNewProduct: (product) => product,
    addProductToOrder: () => {},
    deleteProductFromOrder: (orderUserId, productRef) => {},
    doSignIn: () => {},
    doEmailRegistration: () => {},
    listenForGoogleSignIn: async () => {}
  };
});
