import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { useAuthStateContext } from '../../context/authState/AuthContextProvider';
import { User } from '../../../types/interfaces';
import { ROUTES, ROLES } from '../../../constants'; 

const AuthGuard = (condition: (user: User) => boolean) => {
  return <P extends object>(Component: React.ComponentType<P>): React.FC<P> => {
    const Guard: React.FC<P> = (props) => {
  
      const history = useHistory();
      const { state: { loading, user } } = useAuthStateContext();

      useEffect(() => {

        if (!loading && !user) {
          console.log('Route guard: User not logged in. Redirecting to /login');
          history.push(ROUTES.LOGIN);
        }

        if (user && !condition(user)) {
          const redirect = user.role === ROLES.ADMIN ? ROUTES.ADMIN : `${ROUTES.USER}/${user._id}`;
          const { pathname } = history.location;
          const message =
            (pathname === ROUTES.LOGIN || pathname === ROUTES.ROOT)
            ? `User already logged in. Redirecting to ${redirect}`
            : `Route guard: User isn't authorized for route ${pathname}. Redirecting to ${redirect}`;
          console.log(message);
          history.push(redirect);
        }

      }, [history, user, loading]);

      return !loading ? <Component { ...props } /> : null;
    }

    return Guard;
  }
}

export default AuthGuard;