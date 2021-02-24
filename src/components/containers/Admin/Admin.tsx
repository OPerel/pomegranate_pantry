/**
 * TODO:
 * 1. make sure order status changes and add buttons.
 * 2. orderProduct.totalQty should be calculated from orderUsers,
 *    maybe do not save totalQty to DB...?
 */

import React, { useEffect } from 'react';
import { Switch, RouteComponentProps, Link } from 'react-router-dom';

import { RouteWithSubRoutes } from '../../../App';

import {
  IonButtons,
  IonButton,
  IonTitle,
  IonHeader,
  IonPage,
  IonToolbar,
} from '@ionic/react';

import Users from '../Users/Users';
import Orders from '../Orders/Orders';
import Products from '../Products/Products';
import AuthGuard from '../Auth/AuthGuard';
import { useAuthStateContext } from '../../context/authState/AuthContextProvider';
import { useAdminStateContext, AdminStateActionTypes } from '../../context/adminState/AdminContextProvider';
import Fire from '../../../services/Firebase';
import { User } from '../../../types/interfaces';
import { ROLES, ROUTES } from '../../../constants';

const Admin: React.FC<{routes: RouteComponentProps<{ id: string }>[]}> = ({ routes }) => {
  const [tab, setTab] = React.useState<string>('orders');
  const { state: { user } } = useAuthStateContext();
  const { dispatch } = useAdminStateContext();

  useEffect(() => {
    dispatch({ type: AdminStateActionTypes.FETCH })
    Fire.getUsers().then(users => {
      dispatch({ type: AdminStateActionTypes.SET_USERS, payload: users });
    });

    dispatch({ type: AdminStateActionTypes.FETCH })
    Fire.getProducts().then(products => {
      dispatch({ type: AdminStateActionTypes.SET_PRODUCTS, payload: products })
    })
  }, [dispatch]);

  return (
    <>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle slot="start">אדמין</IonTitle>
            <Link to={`${ROUTES.USER}/${user?._id}`} style={{ color: 'white', marginLeft: '2%' }} slot="end">משתמש</Link>
            <IonButton slot="end" color="secondary" onClick={() => Fire.doSignOut()}>יציאה</IonButton>
          </IonToolbar>
        </IonHeader>

        <IonToolbar color="dark">
          <IonButtons>
            <IonButton onClick={() => setTab('orders')} disabled={tab === 'orders'} data-testid="admin-orders-button">הזמנות</IonButton>
            <IonButton onClick={() => setTab('products')} disabled={tab === 'products'} data-testid="admin-products-button">מוצרים</IonButton>
            <IonButton onClick={() => setTab('users')} disabled={tab === 'users'} data-testid="admin-users-button">משתמשים</IonButton>
          </IonButtons>
        </IonToolbar>
        
        
        {tab === 'orders' ? (
          <Orders />
        ) : (
          tab === 'users' ? (
            <Users />
          ) : ( 
            <Products />
          )
        )}
      </IonPage>

      <Switch>
        {routes.map((route, i) => (
          <RouteWithSubRoutes key={i} {...route} />
        ))}
      </Switch>
    </>
  )
}

const condition = (user: User) => !!user && user.role === ROLES.ADMIN;
export default AuthGuard(condition)(Admin);
