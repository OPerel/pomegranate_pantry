# Pomegranate Pantry
Let's help Elad help us shop for cheap!!

## Tech
- [React](https://reactjs.org/) ([Create-React-App](https://create-react-app.dev/)) - JavaScript UI framework by Facebook
- [Firebase](https://firebase.google.com/) -Backend as a service (BaaS) by Google

### Project type options
- Web App (only React and Firebase are needed)
- Progressive Web App (PWA - some mobile capabilities are available. Only React and Firebase are needed)
- Hybrid - cross platform (Web and a "native" mobile app. Some additional framework is needed, e.g [Ionic](https://ionicframework.com/))
- Mobile - cross platform (JavaScript generated native code base for both iOS and Android. Additional framework needed, e.g [React-Native](https://reactnative.dev/))

## Data Model

### Order
```ts
{
  id: string,
  open: boolean,
  openToUsers: boolean,
  createdAt: Date,
  closingTime: Date,
  orderProducts: string[], // array of OrderProducts` ids
  userOrders: string[], // array of UserOrders` ids
  totalPrice: number, // total price of UsersOrders 
  payed: boolean
}

userOrdres.every(order => order.payed) => payed = true
totalPrice = userOrdres.reduce((acc, order) => acc += order.totalPrice, 0)
```

### OrderProduct
```ts
{
  id: string,
  product: string, // ref to Product
  order: string, // ref to Order
  totalQty: number,
  missing: number | null,
  fixedTotalPrice: number,
  FinalTotalPrice: number,
  priceWarn: boolean
}

(fixedTotalPrice < FinalTotalPrice) => priceWarn = true
((totalQty % Product.minQty) !== 0) => missing = (Product.minQty - totalQty)
```

### User
```ts
{
  id: string,
  name: string,
  role: 'user' | 'rimon', // user is either a shopper or the one we now call Elad
  location: 'TA' | 'PH'
}
```

### UserOrder
```ts
{
  id: string,
  userRef: string, // User's id
  orderRef: string, // Order's id
  products: string[], // array of Products` ids
  totalPrice: number, // total price of products
  payed: boolean
}

totalPrice = products.reduce((acc, product) => acc += product.price, 0)
```

### Product
```ts
{
  id: string,
  name: string,
  price: number,
  minQty: number,
  qtyUnit: string
}
```
