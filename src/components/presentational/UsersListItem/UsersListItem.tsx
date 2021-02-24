import React from 'react';

import { User } from '../../../types/interfaces';
import { LOCATIONS } from '../../../constants';

import {
  IonItem,
  IonGrid,
  IonCol,
  IonRow,
} from '@ionic/react';

const UsersListItem: React.FC<{user: User}> = ({ user }) => {
  return (
    <IonItem>
      <IonGrid>
        <IonRow>
          <IonCol><span>{user.name}</span></IonCol>
          <IonCol><span>{user.location === LOCATIONS.TA ? 'תל-אביב' : 'פרדס-חנה'}</span></IonCol>
          {/* <IonCol><span>{user._id}</span></IonCol> */}
        </IonRow>
      </IonGrid>
    </IonItem>
  )
}

export default UsersListItem;