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
  private getUser = (id: string) => this.db.ref(`/users/${id}`);

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
   * Listeners  
   */ 

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

  // Admin data
  public usersCollectionListener = async (cb: (users: User[]) => void) => {
    this.getColRef('users').on('value', snapshot => {
      cb(this.parseSnapshot(snapshot));
    })
  }

  public usersCollectionOff = () => {
    this.getColRef('users').off('value');
  }

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

  public orderOff = (id: string) => {
    this.getColRef('orders').child(id).off('value');
  }

  public orderUsersCollectionListener = async (
    id: string,
    cb: (userOrders: UserOrder[]) => void
  ) => {
    this.getColRef('/userOrders')
      .orderByChild('orderRef')
      .equalTo(id)
      .on('value', snapshot => {
        const objList: UserOrder[] = this.parseSnapshot(snapshot);
        cb(objList);
        this.updateOrderOnUserOrdersChange(id, objList)
      })
  }

  private updateOrderOnUserOrdersChange = async (id: string, objList: UserOrder[]) => {
    const payed = objList.every(userOrder => userOrder.payed);
    this.updateEntry('orders', id, { payed })
  }

  public orderUsersOff = (id: string) => {
    this.getColRef('/userOrders').orderByChild('orderRef').equalTo(id).off('value');
  }

  public orderProductsCollectionListener = async (
    id: string,
    cb: (orderProducts: OrderProduct[]) => void
  ) => {
    this.getColRef('/orderProducts')
      .orderByChild('order')
      .equalTo(id)
      .on('value', snapshot => {
        cb(this.parseSnapshot(snapshot));
      })
  }

  public orderProductsOff = (id: string) => {
    try {
      this.getColRef('/orderProducts').orderByChild('order').equalTo(id).off('value');
    } catch (err) {
      console.log('Error unsubscribing: ', err)
    }
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
      const res = await this.db.ref(`${collection}/${id}`).update(updatedObj);
      console.log('updated item: ', res);
    } catch (err) {
      console.log('error updating entry: ', err)
    }
  }
}

const Fire = new FirebaseService();
export default Fire;