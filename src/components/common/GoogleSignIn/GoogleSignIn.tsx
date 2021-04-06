import React from 'react';
import { IonTitle, IonButton, IonIcon } from '@ionic/react';
import { logoGoogle } from 'ionicons/icons'; 
import './GoogleSignIn.css';

import Fire from '../../../services/Firebase';

const GoogleSignIn: React.FC = () => {

  const handleGoogleSignIn = () => {
    Fire.doGoogleSignIn();
  }

  return (
    <div className="ion-text-center ion-padding google-signin-div">
      <hr />
      <IonTitle size="small" className="ion-padding">
        או היכנס באמצעות חשבון גוגל
      </IonTitle>

      <IonButton
        fill="solid"
        color="secondary"
        expand="full"
        onClick={() => handleGoogleSignIn()}
      >
        כניסה עם גוגל
        <IonIcon slot="start" icon={logoGoogle} />
      </IonButton>
    </div>
  )
}

export default GoogleSignIn;
