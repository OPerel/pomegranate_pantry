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

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await Fire.doSignIn(email, password);
    } catch (err) {
      console.warn('Error logging in: ', err)
    }
  }

  return (
    <IonPage>

      <IonHeader>
        <IonToolbar>
          <IonTitle>כניסה</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <form onSubmit={handleLogin} style={{ width: '40vw', margin: '0 auto' }}>
          <IonItem>
            <IonLabel position="floating">
              אי-מייל
            </IonLabel>
            <IonInput type="email" name="email" value={email} required onIonChange={e => setEmail(e.detail.value as string)} />
          </IonItem>

          <IonItem>
            <IonLabel position="floating">
              סיסמה
            </IonLabel>
            <IonInput type="password" name="password" value={password} required onIonChange={e => setPassword(e.detail.value as string)} />
          </IonItem>

          <IonButton type="submit">כניסה</IonButton>
        </form>
      </IonContent>

    </IonPage>
  )
}

const condition = (user: User) => !user;
export default AuthGuard(condition)(Login);
