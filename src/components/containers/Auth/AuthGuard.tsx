import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { useAuthStateContext } from '../../context/authState/AuthContextProvider';
import { User } from '../../../types/interfaces';
import { ROUTES, ROLES } from '../../../constants';

import { IonLoading } from '@ionic/react';

import './AuthGuard.css';

const AuthGuard = (condition: (user: User) => boolean) => {
  return <P extends object>(Component: React.ComponentType<P>): React.FC<P> => {
    const Guard: React.FC<P> = (props) => {
  
      const history = useHistory();
      const { state: { loading, user } } = useAuthStateContext();

      useEffect(() => {

        if (!loading && !user && history.location.pathname !== ROUTES.REGISTRATION) {
          console.log('Route guard: User not logged in. Redirecting to /login');
          history.push(ROUTES.LOGIN);
        }

        if (user && !condition(user)) {
          const redirect = user.role === ROLES.ADMIN ? ROUTES.ADMIN : `${ROUTES.USER}/${user._id}`;
          const { pathname } = history.location;
          const message =
            (pathname === ROUTES.LOGIN || pathname === ROUTES.ROOT || ROUTES.REGISTRATION)
            ? `User already logged in. Redirecting to ${redirect}`
            : `Route guard: User isn't authorized for route ${pathname}. Redirecting to ${redirect}`;
          console.log(message);
          history.push(redirect);
        }

      }, [history, user, loading]);

      if (loading) {
        return <IonLoading cssClass='auth-loader' isOpen={loading} message={'טוען נתונים...'} />;
      }

      return <Component { ...props } />;

    }
    return Guard;
  }
}

export default AuthGuard;