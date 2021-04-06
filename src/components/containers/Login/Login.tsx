import React, { useState, useEffect, useCallback } from 'react';
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
  IonText
} from '@ionic/react';
import { Link } from 'react-router-dom';
import AuthGuard from '../Auth/AuthGuard';
import GoogleSignIn from '../../common/GoogleSignIn/GoogleSignIn';
import { User } from '../../../types/interfaces';
import useInputValidator from '../../../hooks/useInputValidator';
import Fire from '../../../services/Firebase';
import { ROUTES } from '../../../constants';

const Login: React.FC = () => {

  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const emailValidation = useInputValidator(email, 'email');
  const passwordValidation = useInputValidator(password, 'password');
  const valid = emailValidation.valid && passwordValidation.valid;

  const handleLogin = useCallback(async () => {
    setError(null);
    try {
      await Fire.doSignIn(email, password);
    } catch (err) {
      console.warn('Error logging in: ', err);
      setError(err);
      setEmail('');
      setPassword('');
    }
  }, [email, password]);

  useEffect(() => {
    const form = document.querySelector('form');
    const enterKeyPressCallback = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && valid) {
        handleLogin();
      }
    }

    form?.addEventListener('keypress', enterKeyPressCallback);

    return () => {
      form?.removeEventListener('keypress', enterKeyPressCallback);
    }

  }, [handleLogin, valid])

  return (
    <IonPage>

      <IonHeader>
        <IonToolbar>
          <IonTitle slot="start">עמוד כניסה</IonTitle>
          <Link slot="end" to={ROUTES.REGISTRATION}>
            <IonButton color="secondary">
              הרשמה
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
                    אי-מייל
                  </IonLabel>
                  <IonInput
                    type="email"
                    name="email"
                    value={email}
                    required
                    onIonChange={e => setEmail(e.detail.value as string)}
                    data-testid="email-input"
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
                    data-testid="password-input"
                  />
                </IonItem>

                <IonButton
                  className="ion-padding-vertical"
                  expand="full"
                  onClick={() => handleLogin()}
                  disabled={!valid}
                  data-testid="login-button"
                >
                  כניסה
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
export default AuthGuard(condition)(Login);
