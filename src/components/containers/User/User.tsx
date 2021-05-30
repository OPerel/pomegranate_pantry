import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonContent,
  IonModal,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption
} from '@ionic/react';
import { Link } from 'react-router-dom';
 
import { ROLES, ROUTES, LOCATIONS } from '../../../constants';

import  { useAuthStateContext, AuthStateActionTypes } from '../../context/authState/AuthContextProvider';
import AuthGuard from '../Auth/AuthGuard';
import { useUserStateContext } from '../../context/userState/UserContextProvider';
import { User } from '../../../types/interfaces';

import Fire from '../../../services/Firebase';
import OpenOrderView from '../../presentational/OpenOrderView/OpenOrderView';

const UserPage: React.FC = () => {

  const { state: { user }, dispatch } = useAuthStateContext();
  const { state: { openOrder } } = useUserStateContext();
  const [hasLocation, setHasLocation] = useState<boolean>(true);
  const [userLocation, setUserLocation] = useState<'TA' | 'PH'>('' as 'TA' | 'PH');

  const handleLocationSelection = () => {
    if (user) {
      Fire.updateUserLocation(user._id, userLocation);
      Fire.getUser(user._id).then(updatedUser => {
        dispatch({ type: AuthStateActionTypes.SET_USER, payload: updatedUser });
      })
    }
  }

  useEffect(() => {
    Fire.listenForGoogleSignIn()
      .then(res => console.log('reg res: ', res));
  }, []);

  useEffect(() => {
    const hasLocation = user && user.location ? true : false;
    setHasLocation(hasLocation);
  }, [user]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle slot="start" role="greet-user-by-name">
            שלום {user?.name}
          </IonTitle>
          {user?.role === ROLES.ADMIN && 
            <Link
              to={ROUTES.ADMIN}
              style={{ color: 'white', marginLeft: '2%' }}
              slot="end"
            >אדמין</Link>
          }
          <IonButton slot="end" color="secondary" onClick={() => Fire.doSignOut()}>יציאה</IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <OpenOrderView openOrder={openOrder} />
      </IonContent>
      
      <IonModal isOpen={!hasLocation} backdropDismiss={false} data-testid="user-location-modal">
        <IonHeader>
          <IonToolbar>
            <IonTitle>בחר מיקום</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent>
          <form>
            <IonItem>
              <IonLabel position="floating">
                מקום מגורים
              </IonLabel>
              <IonSelect
                interface="popover"
                value={userLocation}
                onIonChange={e => setUserLocation(e.detail.value)}
                data-testid="location-user-modal-input"
                >
                <IonSelectOption value={LOCATIONS.TA}>תל אביב</IonSelectOption>
                <IonSelectOption value={LOCATIONS.PH}>פרדס חנה</IonSelectOption>
              </IonSelect>
            </IonItem>

            <IonButton
              onClick={() => handleLocationSelection()}
              >
              אישור
            </IonButton>
          </form>
        </IonContent>
      </IonModal>
    </IonPage>
  )
}

const condition = (user: User) => !!user;
export default AuthGuard(condition)(UserPage);
