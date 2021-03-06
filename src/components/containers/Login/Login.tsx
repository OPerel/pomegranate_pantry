import React, { useState } from 'react';

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
} from '@ionic/react';

import AuthGuard from '../Auth/AuthGuard';
import { User } from '../../../types/interfaces';

import Fire from '../../../services/Firebase';

const Login: React.FC = () => {

  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    setError(null);
    e.preventDefault();
    try {
      await Fire.doSignIn(email, password);
    } catch (err) {
      console.warn('Error logging in: ', err);
      setError(err);
    }
  }

  return (
    <IonPage>

      <IonHeader>
        <IonToolbar>
          <IonTitle>עמוד כניסה</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <form onSubmit={handleLogin} style={{ width: '40vw', margin: '0 auto' }}>
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

          <IonButton type="submit" data-testid="login-button">כניסה</IonButton>
        </form>

        {error && <IonTitle dir="ltr" color="danger" style={{ textAlign: 'center', margin: '2%' }}>{error}</IonTitle>}
      </IonContent>

    </IonPage>
  )
}

const condition = (user: User) => !user;
export default AuthGuard(condition)(Login);
