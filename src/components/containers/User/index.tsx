import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

interface UserProps extends RouteComponentProps<{ id: string; }> { };

const User: React.FC<UserProps> = ({ match }) => {
  console.log(`user ${match.params.id}`)
  return (
    <div>
      <h2>Uesr {match.params.id}</h2>
    </div>
  )
}

export default User;
