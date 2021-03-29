import React, {useState} from 'react';
import {
  IonPage,
  IonInput,
  IonLabel,
  IonButton,
  IonItem,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonSelect,
  IonSelectOption
} from '@ionic/react';
import { Link } from 'react-router-dom';
import AuthGuard from '../Auth/AuthGuard';
import { User } from '../../../types/interfaces';
import { ROUTES, LOCATIONS } from '../../../constants';
import GoogleSignIn from '../../common/GoogleSignIn/GoogleSignIn';
import Fire from '../../../services/Firebase';

const Registration: React.FC = () => {

  const [userName, setUserName] = React.useState<string>('');
  const [userLocation, setUserLocation] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const formIsValid = 
    userName &&
    userLocation &&
    email &&
    password;

  const handleRegistration = () => {
    if (formIsValid) {
      Fire.doEmailRegistration(userName, userLocation, email, password)
      .then((res: any) => console.log('registration: ', res))
      .catch(err => {
        setError(err);
      });
    }
  }

  return (
    <IonPage>

      <IonHeader>
        <IonToolbar>
          <IonTitle slot="start">עמוד הרשמה</IonTitle>
          <Link slot="end" to={ROUTES.LOGIN}>
            <IonButton color="secondary">
              כניסה
            </IonButton>
          </Link>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonGrid>
          <IonRow className="ion-justify-content-center">
            <IonCol size-sm="12" size-md="3">

              <form className="ion-padding ion-text-center">
                <IonItem>
                  <IonLabel position="floating">
                    שם משתמש
                  </IonLabel>
                  <IonInput
                    type="text"
                    name="name"
                    value={userName}
                    required
                    onIonChange={e => setUserName(e.detail.value as string)}
                    data-testid="userName-registration-input"
                  />
                </IonItem>
                
                <IonItem>
                  <IonLabel position="floating">
                    אי-מייל
                  </IonLabel>
                  <IonInput
                    type="email"
                    name="email"
                    value={email}
                    required
                    onIonChange={e => setEmail(e.detail.value as string)}
                    data-testid="email-registration-input"
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="floating">
                    סיסמה
                  </IonLabel>
                  <IonInput
                    type="password"
                    name="password"
                    value={password}
                    required
                    onIonChange={e => setPassword(e.detail.value as string)}
                    data-testid="password-registration-input"
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="floating">
                    מקום מגורים
                  </IonLabel>
                  <IonSelect
                    interface="popover"
                    value={userLocation}
                    onIonChange={e => setUserLocation(e.detail.value)}
                  >
                    <IonSelectOption value={LOCATIONS.TA}>תל אביב</IonSelectOption>
                    <IonSelectOption value={LOCATIONS.PH}>פרדס חנה</IonSelectOption>
                  </IonSelect>
                </IonItem>

                <IonButton
                  className="ion-padding-vertical"
                  expand="full"
                  onClick={() => handleRegistration()}
                  data-testid="login-button"
                >
                  הרשמה
                </IonButton>

                {error && (
                  <IonText
                    dir="ltr"
                    color="danger"
                    data-testid="login-error-msg"
                  >
                    <h6>{error}</h6>
                  </IonText>
                )}

              </form>

              <GoogleSignIn />

            </IonCol>
          </IonRow>
        </IonGrid>

      </IonContent>
      
    </IonPage>
  )
}

const condition = (user: User) => !user;
export default AuthGuard(condition)(Registration);
