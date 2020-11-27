import firebase from 'firebase/app';
import "firebase/database";

import { Order, UserOrder, OrderProduct } from '../types/interfaces';

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
  private db: firebase.database.Database;

  constructor() {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    this.db = firebase.database();
  }

  private getColRef = (col: string) => this.db.ref(col);

  public ordersCollectionListener = async (
    cb: (snap: Order[]) => void
  ) => {
    this.getColRef('/orders').on('value', (snapshot) => {
      // parse snapshot
      const vals = snapshot.val();
      let orders: Order[] = [];
      vals.forEach((val: any) => {
        const { createdAt, closingTime } = val;
        orders.push({
          ...val,
          createdAt: new Date(createdAt),
          closingTime: new Date(closingTime)
        })
      });
      console.log('orders: ', orders)
      cb(orders);
    });
  } 
}

const Fire = new FirebaseService();
export default Fire;