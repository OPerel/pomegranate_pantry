import React from 'react';

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
      <pre>
        {JSON.stringify(user, null, 2)}
      </pre>
      <IonButton onClick={() => Fire.doSignOut()}>יציאה</IonButton>
    </div>
  )
}

const condition = (user: User) => !!user;
export default AuthGuard(condition)(UserPage);
