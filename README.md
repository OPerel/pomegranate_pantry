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
type OrderStatus = 'open' | 'completion' | 'shopping' | 'paying' | 'closed'

{
  id: string,
  status: OrderStatus,
  createdAt: Date,
  closingTime: Date,
  totalPrice: number, // total price of UsersOrders 
}

Order.totalPrice = userOrdres.reduce((acc, order) => acc += order.totalPrice, 0)
```

### OrderProduct
```ts
{
  id: string,
  product: string, // ref to Product
  order: string, // ref to Order
  totalQty: number,
  missing: number | null,
  price: number
}

priceWarn = fixedTotalPrice < finalTotalPrice
missing = (totalQty % Product.minQty) !== 0
  ? ((Math.floor(totalQty / Product.minQty) + 1) * Product.minQty) - totalQty
  : null
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

### OrderUser
```ts
{
  id: string,
  userRef: string, // User's id
  orderRef: string, // Order's id
  products: OrderUserProducts[],
  totalPrice: number, // total price of products
  payed: boolean
}

totalPrice = products.reduce((acc, { product, qty }) => acc += product.price, 0)
```

#### OrderUserProducts
```ts
{
  product: string, // ref to OrderProduct
  qty: number
}
```

### Product
```ts
{
  id: string,
  name: string,
  price: number,
  minQty: number,
  qtyUnit: 'unit' | 'Kg'
}
```


## State Interface
### Auth
### Admin
#### Order
```ts
type OrderStatus = 'open' | 'completion' | 'shopping' | 'paying' | 'closed';

{
  id: string,
  status: OrderStatus,
  createdAt: Date,
  closingTime: Date,
  totalPrice: number, // total price of UsersOrders
}
```
## Views
### 1 Rimon Views
Rimon's main view is divided to Orders and Products using tabs.
#### 1.1 Orders View
A list of old orders, and the active one if it exists.
![orders view](./mockups/orders_view.jpg)
Clicking on an order's row leads to its [Order](#order_view)

#### 1.2 Products View
This is only needed for creating a fixed price for every product, and then compare it to the final price Elad types in manually.  
Maybe we omit the fixed prices and the users won't know the price until after the purchase (the way it is now...?). 

#### 1.3 Order View <a id="order_view"></a>
Every order view is divided to a list of the order's users, and a list of the order's products.

##### 1.3.1 Order Users View
![order view - users](./mockups/order_view_users.jpg)

##### 1.3.2 Order Products View
![order view - products](./mockups/order_view_products.jpg)

TODO: for every product with `Product.qytUnit === 'Kg'`, `OrderProduct.totalQty` has to satisfy the minimum quantity requirement for each location independently (or maybe just for PH?).

### 2 Users Views