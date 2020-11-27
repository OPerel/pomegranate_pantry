jest.mock('./services/Firebase', () => {
  const data = [
    {
      _id: '1',
      open: true, 
      openToUsers: true,
      createdAt: new Date(234234234),
      closingTime: new Date(234234345),
      totalPrice: 0,
      payed: false
    }
  ];
  // const snapshot = { val: () => data };
  return {
    ordersCollectionListener: (cb) => {cb(data)}
  };
});


