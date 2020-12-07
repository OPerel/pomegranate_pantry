import React from 'react';
import { Link } from 'react-router-dom';
 
import { ROLES, ROUTES } from '../../../constants';

import {
  IonButton
} from '@ionic/react';

import  { useAuthStateContext } from '../../context/authState/AuthContextProvider';
import AuthGuard from '../Auth/AuthGuard';
import { User } from '../../../types/interfaces';

import Fire from '../../../services/Firebase';

const UserPage: React.FC = () => {

  const { state: { user } } = useAuthStateContext();

  return (
    <div>
      <h2>Uesr {user?.name}</h2>
      <pre dir="ltr">
        {JSON.stringify(user, null, 2)}
      </pre>
      <IonButton onClick={() => Fire.doSignOut()}>יציאה</IonButton>
      &nbsp;
      {user?.role === ROLES.ADMIN && <Link to={ROUTES.ADMIN}>אדמין</Link>}
    </div>
  )
}

const condition = (user: User) => !!user;
export default AuthGuard(condition)(UserPage);
