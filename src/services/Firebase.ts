// import firebase from 'firebase';
import app from 'firebase/app';
import "firebase/database";

import { Order, UserOrder, OrderProduct, Product } from '../types/interfaces';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

class FirebaseService {
  private db: app.database.Database;

  constructor() {
    if (!app.apps.length) {
      app.initializeApp(firebaseConfig);
    }

    this.db = app.database();
  }

  // utils and refs
  private getColRef = (col: string) => this.db.ref(col);

  // listeners
  public ordersCollectionListener = async (
    cb: (snap: Order[]) => void
  ) => {
    this.getColRef('/orders').on('value', (snapshot) => {
      // parse snapshot
      const val = snapshot.val();
      const orders = Object.keys(val).map(key => ({
        ...val[key],
        _id: key,
        createdAt: new Date(val[key].createdAt),
        closingTime: new Date(val[key].closingTime)
      }))
      console.log('orders: ', orders)
      cb(orders);
    });
  }

  public productsCollectionListener = async (
    cb: (snap: Product[]) => void
  ) => {
    this.getColRef('/products').on('value', (snapshot) => {
      // parse snapshot
      const val = snapshot.val();
      const products = Object.keys(val).map(key => ({
        ...val[key],
        _id: key
      }))
      console.log('products: ', products)
      cb(products);
    });
  }

  // write
  public addNewOrder = async (closingTime: Date) => {
    const newOrder = {
      open: true, 
      openToUsers: true,
      createdAt: app.database.ServerValue.TIMESTAMP,
      closingTime: closingTime.getTime(),
      totalPrice: 0,
      payed: false
    }

    try {
      const res = await this.getColRef('/orders').push(newOrder);
      return (await res.get()).val();
    } catch (err) {
      console.log('Error adding new order: ', err)
    }
  }

  public addNewProduct = async (product: Product) => {
    try {
      const res = await this.getColRef('/products').push(product);
      return (await res.get()).val();
    } catch (err) {
      console.log('Error adding new product: ', err)
    }
  }
}

const Fire = new FirebaseService();
export default Fire;