import React from 'react';

import AuthGuard from '../Auth/AuthGuard';
import { User } from '../../../types/interfaces';

const Login: React.FC = () => {
  return (
    <div>
      <h2>Login</h2>
    </div>
  )
}

const condition = (user: User) => !user;
export default AuthGuard(condition)(Login);
