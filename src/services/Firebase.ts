/**
 * TODO: 
 * check where and how to implement total price calculations,
 * both for OrderUser and Order
 */

import app from 'firebase/app';
import "firebase/database";
import 'firebase/auth';

import { list, object } from 'rxfire/database';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { getOrderStatus } from '../utils/mapOrderStatus';
import { calculateOrderTotals } from '../utils/calculateOrderPrices';
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

interface NewOrderProduct {
  orderRef: string;
  productRef: string;
  currentOrder: string | null;
  qty: number;
}

class FirebaseService {
  private db: app.database.Database;
  private auth: app.auth.Auth;

  constructor() {
    if (!app.apps.length) {
      app.initializeApp(firebaseConfig);
    }

    this.db = app.database();
    this.auth = app.auth();

    // if ((window as any).Cypress) {
    //   console.log('running in cypress browser!!');
    //   // this.auth.useEmulator('http://localhost:9099');
    //   this.db.useEmulator('localhost', 9000);
    // }
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

  private getOrderProductCalcs = async (
    productId: string,
    orderUsers: OrderUser[]
  ) => {
    const { minQty } = await this.getProduct(productId);

    /** 
     * total qty of orderProduct
     * first reduce all product objects from orderUsers to one array,
     * then filter the relevant products,
     * reduce the total qty from the users' product objects
     */
    const totalQty = orderUsers.reduce((acc, orderUser) => {
      return acc.concat(orderUser.products);
    }, [] as OrderUserProduct[])
      .filter(p => p?.productRef === productId)
      .reduce((acc, { qty }) => acc = acc + qty, 0);

    /**
     * calculate missing qty by total and product min
     */
    const missing = (totalQty % minQty) !== 0
    ? ((Math.floor(totalQty / minQty) + 1) * minQty) - totalQty
    : null;

    return {
      totalQty,
      missing
    }
  }

  /**
   * Get collection
   */

  public getUsers = async (cb: (users: { [key: string]: User }) => void) => {
    const snapshot = await this.getColRef('users').get();
    cb(snapshot.val());
  };

  /**
   * Get by id
   */

  public getUser = async (userId: string) => {
    return (await this.getUserRef(userId).get()).val();
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
  
  public doGoogleSignIn = () => {
    const provider = new app.auth.GoogleAuthProvider()
    this.auth.signInWithRedirect(provider);
  }

  public listenForGoogleSignIn = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const authUser = await this.auth.getRedirectResult();
        const { user } = authUser;
        if (user) {
          const userRef = this.getUserRef(user.uid);
          if (authUser.additionalUserInfo?.isNewUser) {
            return userRef.set({
              name: user.displayName,
              role: 'user',
              email: user.email
            })
            .then(() => {
              resolve('register new user via Google: ' + user.displayName);
            })
          } else {
            resolve('user exists: ' + user.displayName)
          }
        }
      } catch (err) {
        reject(err);
      }
    })
  }

  public doSignOut = () => {
    this.auth.signOut();
  }

  public doEmailRegistration = (
    userName: string,
    location: string,
    email: string,
    password: string
  ) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { user } = await this.auth
          .createUserWithEmailAndPassword(email, password);
        
        if (user) {
          return this.getUserRef(user.uid).set({
            name: userName,
            role: 'user',
            email,
            location
          })
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            console.warn('Error inserting new user to DB: ', err);
            reject(err);
          })
        }

      } catch (err) {
        console.warn('Error registering user: ', err);
        reject(err);
      }
    });
  }

  /**
   * Listeners
   */

  // General
  public productsCollectionListener = (cb: (products: { [key: string]: Product }) => void) => {
    const productsRef = this.getColRef('products');
    const products$ = object(productsRef);
    const subscription = products$
      .subscribe(products => {
        cb(products.snapshot.val());
      });

    return subscription;
  };
  
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
  public ordersCollectionListener = (
    cb: (orders: Order[]) => void
  ) => {
    const ordersRef = this.getColRef('/orders');
    const orders$ = list(ordersRef)
    const subscription = orders$.pipe(
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
        
        ordersList.sort(function(a, b) {
          return b.createdAt.getTime() - a.createdAt.getTime()
        })
        return ordersList;
      })
    ).subscribe(orders => {
      cb(orders)
    });

    return subscription;
  }

  /** 
   * listen to order location in DB
   * along with its users and products
   * and combines all to one object
   * @param {string} orderId - the id of the order to listen to
   * @param {function} cb - a callback that fires on every value change with the full obj
   */
  public orderListener = (
    orderId: string,
    cb: (order: Order) => void
  ) => {

    // collections refs
    const orderRef = this.getColRef('orders').child(orderId);
    const orderUsersRef = this.getColRef('orderUsers')
      .orderByChild('orderRef')
      .equalTo(orderId);
    const orderProductsRef = this.getColRef('orderProducts').child(orderId);
    
    // observables
    const orderState$ = object(orderRef);
    const orderUsersList$ = list(orderUsersRef);
    const orderProductsList$ = list(orderProductsRef);

    const subscription = combineLatest(orderState$, orderUsersList$, orderProductsList$)
    .pipe(
      // turns each observable into the desired object / list of objects
      map(([order, orderUsers, orderProducts]): [Order, OrderUser[], OrderProduct[]] => {
        const val = order.snapshot.val();
        const orderObj = {
          ...val,
          _id: order.snapshot.key,
          createdAt: new Date(val.createdAt),
          closingTime: new Date(val.closingTime)
        };
        const orderUsersObjList = orderUsers.map(orderUser => {
          const val = orderUser.snapshot.val();
          return {
            ...val,
            _id: orderUser.snapshot.key,
            products: val.products && Object.keys(val.products).map(key => ({
              productRef: key,
              qty: val.products[key]
            }))
          }
        });
        const orderProductsObjList = orderProducts.map(orderProduct => ({
          ...orderProduct.snapshot.val(),
          productRef: orderProduct.snapshot.key,
          orderRef: order.snapshot.key
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
            
            const { totalQty, missing } = await this.getOrderProductCalcs(orderProduct.productRef, orderUsers);
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
          calculateOrderTotals(orderObj);
        }

        if (updateOrderStatus !== orderObj.status) {
          await this.updateEntry('orders', orderObj._id, {
            status: updateOrderStatus,
            active: updateOrderStatus !== ORDER_STATUS.CLOSED
          })
        }
        return orderObj;
      })
    )
    .subscribe(async data => {
      cb(await data);
    });

    return subscription;
  }

  // User data

  public getOpenOrderId = async () => {
    const openOrderRef = this.getColRef('orders').orderByChild('active').equalTo(true);
    const order = (await openOrderRef.get()).val();
    if (order) {
      return Object.keys(order)[0];
    }

    return null;
  }

  public userOrdersListener = (
    userId: string,
    cb: (userOrders: OrderUser[]) => void
  ) => {
    const userOrdersRef = this.getColRef('orderUsers').orderByChild('userRef').equalTo(userId);
    const userOrders$ = list(userOrdersRef);
    const subscription = userOrders$.pipe(
      map(userOrders => {
        return userOrders.map(order => {
          const val = order.snapshot.val();
          return {
            ...val,
            _id: order.snapshot.key,
            products: val.products && Object.keys(val.products).map(key => ({
              productRef: key,
              qty: val.products[key]
            }))
          }
        })
      })
    )
    .subscribe(data => {
      cb(data)
    });

    return subscription;
  }

  /**
   * Write
   */

  // General writes
  public updateEntry = async (collection: string, id: string, updatedObj: any) => {
    try {
      await this.db.ref(`${collection}/${id}`).update(updatedObj);
      console.log(`item "${collection}/${id}" updated`);
    } catch (err) {
      console.log('error updating entry: ', err)
    }
  }

  // Admin writes
  public addNewOrder = async (closingTime: Date) => {
    const newOrder = {
      active: true,
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

  public updateOrderUsersPrice = async (bulkUpdateObj: { [key: string]: number }) => {
    try {
      await this.getColRef('orderUsers').update(bulkUpdateObj)
      console.log('orderUsers price updated');
    } catch (err) { 
      console.warn('Error updating prices: ', err);
    }
  }


  // User writes

  public updateUserLocation = async (userId: string, location: 'TA' | 'PH') => {
    try {
      await this.getUserRef(userId).update({ location })
      console.log('user Location updated');
    } catch (err) { 
      console.warn('Error updating user location: ', err);
    }
  }
  
  public addProductToOrder = async ({
    orderRef, productRef, qty, currentOrder
  }: NewOrderProduct) => {
    await this.db.ref(`orderProducts/${orderRef}/${productRef}`)
      .transaction(currentProduct => {
        if (currentProduct === null) {
          return { price: 0 };
        } else {
          console.log('product exists');
          return;
        }
      }, (error) => {
        if (error) {
          console.warn('Transaction failed: ', error)
        } else {
          // update orderUser.products
          this.db.ref(`orderUsers/${currentOrder}`).transaction(currentOrder => {
            console.log('currentOrder: ', currentOrder);
            if (currentOrder === null) {
              this.getColRef('orderUsers').push({
                orderRef,
                userRef: this.auth.currentUser?.uid,
                payed: false,
                products: {
                  [productRef]: qty
                }
              })
            } else {
              const existingQty = currentOrder.products[productRef];
              return {
                ...currentOrder,
                products: {
                  ...currentOrder.products,
                  [productRef]: (existingQty || 0) + qty
                }
              }
            }
          }, (error) => {
            if (error) {
              console.warn('Error updating / creating orderUser')
            }
          })
        }
      })    
  }

  public deleteProductFromOrder = (
    orderUserId: string,
    productRef: string
  ) => {
    this.db.ref(`orderUsers/${orderUserId}/products`).child(productRef).remove(err => {
      if (err) {
        console.warn('Error removing product: ', err)
      } else {
        console.log('Product removed from order')
      }
    })
  }

}

const Fire = new FirebaseService();
export default Fire;