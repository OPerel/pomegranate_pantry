// import firebase from 'firebase';
import app from 'firebase/app';
import "firebase/database";
import 'firebase/auth';

import { list, object } from 'rxfire/database';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { getOrderStatus } from '../utils/mapOrderStatus';
import { User, Order, Product } from '../types/interfaces';

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
  private getUserRef = (id: string) => this.db.ref(`/users/${id}`);

  private parseSnapshot = <T>(snapshot: app.database.DataSnapshot): T[] => {
    const val = snapshot.val();
    if (!val) {
      return [];
    }
    const objectsArray: T[] = Object.keys(val).map(key => ({
      ...val[key],
      _id: key,
    }));

    return objectsArray;
  }

  /**
   * Get collection
   */

  public getUsers = async () => (await this.getColRef('users').get()).val();
  public getProducts = async () => (await this.getColRef('products').get()).val();

  /**
   * get by id
   */

  public getUser = async (userId: string, cb: (user: User) => void) => {
    await this.getUserRef(userId).once('value', snapshot => {
      cb(snapshot.val());
    });
  };
  
  // Auth and user
  public doSignIn = (email: string, password: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      this.auth
        .signInWithEmailAndPassword(email, password)
        .then((authUser) => {
          console.log("Login success: ", authUser);
          resolve();
        })
        .catch((err: Error) => {
          console.log("Login error:", err);
          reject(err.message);
        });
    });
  };
  
  public doSignOut = () => {
    this.auth.signOut();
  }
  
  /**
   * Listeners  
   */
  // Auth
  public authStateListener = (
    cb: (user: User | null, error: string | null) => void
  ) => {
    this.auth.onAuthStateChanged(user => {
      if (user) {
        this.getUserRef(user.uid)
        .once('value')
        .then(snapshot => {
          const dbUser = snapshot.val();

          // merge auth and db user
          const mergedUser: User = {
            _id: user?.uid,
            ...dbUser,
          };

          cb(mergedUser, null);
        });
      } else {
        cb(null, null);
      }
    }, error => {
      console.log('Error listening to auth state: ', error);
      cb(null, error.message);
    })
  }

  // Admin data

  public ordersCollectionListener = async (
    cb: (orders: Order[]) => void
  ) => {
    const ordersRef = this.getColRef('/orders');
    const orders$ = list(ordersRef)
    orders$.pipe(
      map(orders => {
        const ordersList = orders.map(order => {
          const orderData = order.snapshot.val()
          return {
            ...orderData,
            _id: order.snapshot.key,
            createdAt: new Date(orderData.createdAt),
            closingTime: new Date(orderData.closingTime)
          }
        });
        return ordersList
      })
    ).subscribe(orders => {
      cb(orders)
    })
  }

  public ordersCollectionOff = () => {
    this.getColRef('/orders').off('value');
  }

  public productsCollectionListener = async (
    cb: (products: Product[]) => void
  ) => {
    this.getColRef('/products').on('value', (snapshot) => {
      cb(this.parseSnapshot(snapshot));
    });
  }

  public productsCollectionOff = () => {
    this.getColRef('/products').off('value');
  }

  /** 
   * listen to order location in DB
   * along with its users and products
   * and combines all to one object
   * @param {string} orderId - the id of the order to listen to
   * @param {function} cb - a callback that fires on every value change with the full obj
   * @returns {void}
   */
  public orderListener = async (
    orderId: string,
    cb: (order: Order) => void
  ) => {
    const orderRef = this.getColRef('orders').child(orderId);
    const orderUsersRef = this.getColRef('orderUsers')
      .orderByChild('orderRef')
      .equalTo(orderId);
    const orderProductsRef = this.getColRef('orderProducts')
      .orderByChild('orderRef')
      .equalTo(orderId);
    
    const orderState$ = object(orderRef);
    const orderUsersList$ = list(orderUsersRef);
    const orderProductsList$ = list(orderProductsRef);
    combineLatest(orderState$, orderUsersList$, orderProductsList$, (order, orderUsers, orderProducts) => {
      const val = order.snapshot.val();
      const orderObj = {
        ...val,
        createdAt: new Date(val.createdAt),
        closingTime: new Date(val.closingTime),
        _id: order.snapshot.key,
        orderUsers: orderUsers.map(user => ({
          ...user.snapshot.val(),
          _id: user.snapshot.key
        })),
        orderProducts: orderProducts.map(product => ({
          ...product.snapshot.val(),
          _id: product.snapshot.key
        }))
      }
      const updateOrderStatus = getOrderStatus(orderObj);
      if (updateOrderStatus !== orderObj.status) {
        this.updateEntry('orders', orderObj._id, {
          ...val,
          status: updateOrderStatus
        })
      }

      return orderObj;
    })
    .subscribe(async data => {
      cb(await data);
    })
  }

  public orderOff = (id: string) => {
    this.getColRef('orders').child(id).off('value');
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

  public updateEntry = async (collection: string, id: string, updatedObj: any) => {
    try {
      await this.db.ref(`${collection}/${id}`).update(updatedObj);
      console.log(`item "${collection}/${id}" updated`);
    } catch (err) {
      console.log('error updating entry: ', err)
    }
  }

}

const Fire = new FirebaseService();
export default Fire;