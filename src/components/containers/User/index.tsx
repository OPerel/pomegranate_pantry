import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import AuthGuard from '../Auth/AuthGuard';
import { User } from '../../../types/interfaces';

interface UserProps extends RouteComponentProps<{ id: string; }> { };

const UserPage: React.FC<UserProps> = ({ match }) => {
  console.log(`user ${match.params.id}`)
  return (
    <div>
      <h2>Uesr {match.params.id}</h2>
    </div>
  )
}

const condition = (user: User) => !!user;
export default AuthGuard(condition)(UserPage);
