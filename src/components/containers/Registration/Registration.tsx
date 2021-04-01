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
import useInputValidator from '../../../hooks/useInputValidator';

const Registration: React.FC = () => {

  const [userName, setUserName] = React.useState<string>('');
  const [userLocation, setUserLocation] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const userNameValidaiton = useInputValidator(userName, 'required'); 
  const emailValidation = useInputValidator(email, 'email');
  const passwordValidation = useInputValidator(password, 'password');
  const locationValidation = useInputValidator(userLocation, 'required');

  const formIsValid = 
    userNameValidaiton.valid &&
    emailValidation.valid &&
    passwordValidation.valid &&
    locationValidation.valid;

  const handleRegistration = async () => {
    try {
      Fire.doEmailRegistration(userName, userLocation, email, password)
    } catch (err) {
      console.warn('registration error: ', err)
      setError(err);
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

              <form className="ion-padding">
                <IonItem className={!userNameValidaiton.valid ? 'ion-invalid' : ''}>
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
                
                <IonItem className={!emailValidation.valid && email ? 'ion-invalid' : ''}>
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

                <IonItem className={!passwordValidation.valid && password ? 'ion-invalid' : ''}>
                  <IonLabel position="floating">
                    סיסמה
                  </IonLabel>
                  <IonInput
                    type="password"
                    name="password"
                    value={password}
                    onIonChange={e => setPassword(e.detail.value as string)}
                    data-testid="password-registration-input"
                  />
                </IonItem>
                {!passwordValidation.valid && (
                  <IonText color="danger" className="ion-text-start">
                    <small>{passwordValidation.message}</small>
                  </IonText>
                )}

                <IonItem className={!locationValidation.valid ? 'ion-invalid' : ''}>
                  <IonLabel position="floating">
                    מקום מגורים
                  </IonLabel>
                  <IonSelect
                    interface="popover"
                    value={userLocation}
                    onIonChange={e => setUserLocation(e.detail.value)}
                    data-testid="location-registration-input"
                  >
                    <IonSelectOption value={LOCATIONS.TA}>תל אביב</IonSelectOption>
                    <IonSelectOption value={LOCATIONS.PH}>פרדס חנה</IonSelectOption>
                  </IonSelect>
                </IonItem>

                <IonButton
                  className="ion-padding-vertical"
                  expand="full"
                  disabled={!formIsValid}
                  onClick={() => handleRegistration()}
                  data-testid="registration-button"
                >
                  הרשמה
                </IonButton>
                  {!formIsValid ? (
                    <div className="ion-margin-top">
                      <IonText color="danger" className="ion-text-start">
                        <small>כל השדות הינם חובה</small>
                      </IonText>
                    </div>
                  ) : <div style={{ height: '18px' }} className="ion-margin-top" />}

                {error && (
                  <IonText
                    dir="ltr"
                    color="danger"
                    className="ion-text-center"
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
