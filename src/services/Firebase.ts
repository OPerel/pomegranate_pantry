/**
 * TODO: 
 * check where and how to implement total price calculations,
 * both for OrderUser and Order
 */

import app from 'firebase/app';
import "firebase/database";
import 'firebase/auth';

import { list, object, stateChanges } from 'rxfire/database';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { getOrderStatus } from '../utils/mapOrderStatus';
import { calculateOrderUsers } from '../utils/calculateOrderPrices';
import { User, Order, Product, OrderUser, OrderProduct, OrderUserProduct } from '../types/interfaces';
import { ORDER_STATUS } from '../constants';

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
   * Get by id
   */

  public getUser = async (userId: string, cb: (user: User) => void) => {
    await this.getUserRef(userId).once('value', snapshot => {
      cb(snapshot.val());
    });
  };

  private getProduct = async (productId: string): Promise<Product> => {
    return (await this.getColRef('products').child(productId).get()).val();
  } 
  
  /**
   * Auth and User
   */
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
        
        /** TODO: sorting orders doesn't work! */
        ordersList.sort(function(a, b) {
          return a.createdAt.getTime() + b.createdAt.getTime()
        })
        // console.log('ordersList: ', ordersList)
        return ordersList;
      })
    ).subscribe(orders => {
      cb(orders)
    })
  }

  // check if needed
  public ordersCollectionOff = () => {
    this.getColRef('/orders').off('value');
  }

  /** 
   * listen to order location in DB
   * along with its users and products
   * and combines all to one object
   * @param {string} orderId - the id of the order to listen to
   * @param {function} cb - a callback that fires on every value change with the full obj
   */
  public orderListener = async (
    orderId: string,
    cb: (order: Order) => void
  ): Promise<void> => {

    // collections refs
    const orderRef = this.getColRef('orders').child(orderId);
    const orderUsersRef = this.getColRef('orderUsers')
      .orderByChild('orderRef')
      .equalTo(orderId);
    const orderProductsRef = this.getColRef('orderProducts')
      .orderByChild('orderRef')
      .equalTo(orderId);
    
    // observables
    const orderState$ = object(orderRef);
    const orderUsersList$ = list(orderUsersRef);
    const orderProductsList$ = list(orderProductsRef);

    combineLatest(orderState$, orderUsersList$, orderProductsList$)
    .pipe(
      // turns each observable into the desired object
      map(([order, orderUsers, orderProducts]): [Order, OrderUser[], OrderProduct[]] => {
        const val = order.snapshot.val();
        const orderObj = {
          ...val,
          _id: order.snapshot.key,
          createdAt: new Date(val.createdAt),
          closingTime: new Date(val.closingTime)
        };
        const orderUsersObjList = orderUsers.map(orderUser => ({
          ...orderUser.snapshot.val(),
          _id: orderUser.snapshot.key
        }));
        const orderProductsObjList = orderProducts.map(orderProduct => ({
          ...orderProduct.snapshot.val(),
          _id: orderProduct.snapshot.key 
        }));
        return [orderObj, orderUsersObjList, orderProductsObjList];
      }),
      // merge the users and products into the order object
      map(async ([order, orderUsers, orderProducts]) => {
        order = {
          ...order,
          orderUsers,
          // the order products have to be further transformed for totalQty and missing
          orderProducts: await Promise.all(orderProducts.map(async orderProduct => {
            const { minQty } = await this.getProduct(orderProduct.productRef);

            /** 
             * total qty of orderProduct
             * first reduce al product object from orderUsers to one array,
             * then filter the relevant product,
             * reduce the qty from the users' products objects
             */
            const totalQty = orderUsers.reduce((acc, orderUser) => {
              return acc.concat(orderUser.products);
            }, [] as OrderUserProduct[])
              .filter(p => p?.productRef === orderProduct.productRef)
              .reduce((acc, { qty }) => acc = acc + qty, 0);

            /**
             * calculate missing qty by total and product min
             */
            const missing = (totalQty % minQty) !== 0
            ? ((Math.floor(totalQty / minQty) + 1) * minQty) - totalQty
            : null;
            
            return {
              ...orderProduct,
              totalQty,
              missing
            }
          }))
        }
        return order;
      }),
      // check for order status and update if needed
      map(async order => {
        const orderObj = await order;
        const updateOrderStatus = getOrderStatus(orderObj);

        if (updateOrderStatus === ORDER_STATUS.PAYING && !orderObj.totalPrice) {
          // update all orderUser.totalPrice
          calculateOrderUsers(orderObj);
        }

        if (updateOrderStatus !== orderObj.status) {
          this.updateEntry('orders', orderObj._id, {
            status: updateOrderStatus
          })
        }
        return orderObj;
      })
    )
    .subscribe(async data => {
      cb(await data);
    })
  }

  // check if needed
  public orderOff = (id: string) => {
    this.getColRef('orders').child(id).off('value');
  }

  // User data

  public openOrderListener = async (cb: (orderId: Order | null) => void) => {
    const openOrderRef = this.getColRef('orders').orderByChild('status').equalTo('open');
    const openOrder$ = stateChanges(openOrderRef);
    openOrder$.subscribe(orderData => {
      const val = orderData.snapshot.val();
      cb({
        ...val,
        createdAt: new Date(val.createdAt),
        closingTime: new Date(val.closingTime),
        _id: orderData.snapshot.key
      });
    })
  }

  public userOrdersListener = async (
    userId: string,
    cb: (userOrders: OrderUser[]) => void
  ) => {
    const userOrdersRef = this.getColRef('orderUsers').orderByChild('userRef').equalTo(userId);
    const userOrders$ = list(userOrdersRef);
    userOrders$.pipe(
      map(userOrders => {
        return userOrders.map(order => ({
          ...order.snapshot.val(),
          _id: order.snapshot.key
        }))
      })
    )
    .subscribe(data => {
      cb(data)
    })
  }

  /**
   * Write
   */
  public addNewOrder = async (closingTime: Date) => {
    const newOrder = {
      status: 'open',
      createdAt: app.database.ServerValue.TIMESTAMP,
      closingTime: closingTime.getTime(),
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

  public updateOrderUsersPrice = async (bulkUpdateObj: { [key: string]: number }) => {
    try {
      await this.getColRef('orderUsers').update(bulkUpdateObj)
      console.log('orderUsers price updated');
    } catch (err) { 
      console.warn('Error updating prices: ', err);
    }
  }

}

const Fire = new FirebaseService();
export default Fire;