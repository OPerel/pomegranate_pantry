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
  IonCol
} from '@ionic/react';
import { Link } from 'react-router-dom';
import AuthGuard from '../Auth/AuthGuard';
import { User } from '../../../types/interfaces';
import { ROUTES } from '../../../constants';
import GoogleSignIn from '../../common/GoogleSignIn/GoogleSignIn';
import Fire from '../../../services/Firebase';

const Registration: React.FC = () => {

  const [userName, setUserName] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleRegistration = () => {}

  return (
    <IonPage>

      <IonHeader>
        <IonToolbar>
          <IonTitle slot="start">עמוד הרשמה</IonTitle>
          <Link slot="end" to={ROUTES.LOGIN}>
            <IonButton>
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

                <IonButton
                  className="ion-padding"
                  onClick={() => handleRegistration()}
                  data-testid="login-button"
                >
                  הרשמה
                </IonButton>
              </form>

              <GoogleSignIn></GoogleSignIn>

            </IonCol>
          </IonRow>
        </IonGrid>

        {error && (
          <IonTitle
            dir="ltr"
            color="danger"
            style={{ textAlign: 'center', margin: '2%' }}
            data-testid="login-error-msg"
          >
            {error}
          </IonTitle>
        )}
      </IonContent>
      
    </IonPage>
  )
}

const condition = (user: User) => !user;
export default AuthGuard(condition)(Registration);
