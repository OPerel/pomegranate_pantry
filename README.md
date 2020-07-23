# Pomegranate Pantry
Let's help Elad help us shop for cheap!!

## Tech
- [React](https://reactjs.org/) ([Create-React-App](https://create-react-app.dev/)) - JavaScript UI framework by Facebook
- [Firebase](https://firebase.google.com/) - Database as a service (DaaS) by Google

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
  products: string[], // array of Products` ids
  userOrders: string[], // array of UserOrders` ids
  totalPrice: number // total price of UsersOrders 
}
```

### User
```ts
{
  id: string,
  name: string,
  role: string<'user' | 'rimon'> // user is either a shopper or the one we now call Elad
}
```

### UserOrder
```ts
{
  id: string,
  userRef: string, // User's id
  orderRef: string, // Order's id
  products: string[], // array of Products` ids
  totalPrice: number // total price of products
}
```

### Product
```ts
{
  id: string,
  name: string,
  price: number,
  quantityUnit: string
}
```
