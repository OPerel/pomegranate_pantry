// import firebase from 'firebase';
import app from 'firebase/app';
import "firebase/database";
import 'firebase/auth';

import { User, Order, UserOrder, OrderProduct, Product } from '../types/interfaces';

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
  private auth: app.auth.Auth;

  constructor() {
    if (!app.apps.length) {
      app.initializeApp(firebaseConfig);
    }

    this.db = app.database();
    this.auth = app.auth();
  }

  // utils and refs
  private getColRef = (col: string) => this.db.ref(col);
  private getUser = (id: string) => this.db.ref(`users/${id}`);

  /**
   * Listeners  
   */ 

  // Auth and user
  public authStateListener = (cb: (user: User | null) => void) => {
    this.auth.onAuthStateChanged(user => {
      if (user) {
        this.getUser(user.uid)
        .once('value')
        .then(snapshot => {
          const dbUser = snapshot.val();

          // merge auth and db user
          const mergedUser: User = {
            _id: user?.uid,
            ...dbUser,
          };

          cb(mergedUser);
        });
      } else {
        cb(null);
      }
    })
  }

  // Admin datd
  public ordersCollectionListener = async (
    cb: (orders: Order[]) => void
  ) => {
    this.getColRef('/orders').on('value', (snapshot) => {
      // parse snapshot
      const val = snapshot.val();
      if (val) {
        const orders = Object.keys(val).map(key => ({
          ...val[key],
          _id: key,
          createdAt: new Date(val[key].createdAt),
          closingTime: new Date(val[key].closingTime)
        }))
        // console.log('orders: ', orders)
        cb(orders);
      } else {
        cb([])
      }
    });
  }

  public productsCollectionListener = async (
    cb: (products: Product[]) => void
  ) => {
    this.getColRef('/products').on('value', (snapshot) => {
      // parse snapshot
      const val = snapshot.val();
      const products = Object.keys(val).map(key => ({
        ...val[key],
        _id: key
      }))
      // console.log('products: ', products)
      cb(products);
    });
  }

  public orderListener = async (
    id: string,
    cb: (order: Order) => void
  ) => {
    this.getColRef('orders').child(id).on('value', snapshot => {
      const data = snapshot.val();
      const { closingTime, createdAt } = data;
      const order = {
        ...data,
        _id: id,
        closingTime: new Date(closingTime),
        createdAt: new Date(createdAt)
      }
      cb(order);
    })
  }

  public orderUsersCollectionListener = async (
    id: string,
    cb: (userOrders: UserOrder[]) => void
  ) => {
    this.getColRef('/userOrders')
      .orderByChild('orderRef')
      .equalTo(id)
      .on('value', snapshot => {
        // parse snapshot
        const val = snapshot.val();
        if (val) {
          const userOrders = Object.keys(val).map(key => ({
            ...val[key],
            _id: key
          }))
          cb(userOrders);
        }
      })
  }

  public orderProductsCollectionListener = async (
    id: string,
    cb: (orderProducts: OrderProduct[]) => void
  ) => {
    this.getColRef('/orderProducts')
      .orderByChild('order')
      .equalTo(id)
      .on('value', snapshot => {
        // parse snapshot
        const val = snapshot.val();
        if (val) {
          const orderProducts = Object.keys(val).map(key => ({
            ...val[key],
            _id: key
          }))
          cb(orderProducts);
        }
      })
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