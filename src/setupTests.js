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
  // const snapshot = { val: () => data };
  return {
    ordersCollectionListener: (cb) => {cb(ordersData)},
    productsCollectionListener: (cb) => {cb([])},
    addNewOrder: () => {
      // const orderWithId = { ...orderDetails, _id: (ordersData.length + 1).toString() }
      // console.log('orders before push :', ordersData)
      const newOrder = {
        _id: '-MNArMQr-Jxt0gE8-Szk',
        open: true, 
        openToUsers: true,
        createdAt: new Date(),
        closingTime: new Date().setDate(new Date().getTime + 30),
        totalPrice: 0,
        payed: false
      }
      ordersData.push(newOrder);
      // console.log('orders after push :', ordersData)
      // return orderWithId
    }
  };
});


