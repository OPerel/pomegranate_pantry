import React from 'react';
import { IonTitle, IonButton, IonIcon } from '@ionic/react';
import { logoGoogle } from 'ionicons/icons'; 
import './GoogleSignIn.css';

const GoogleSignIn: React.FC = () => {
  return (
    <div className="ion-text-center ion-padding google-signin-div">
      <hr />
      <IonTitle size="small" className="ion-padding">
        או היכנס באמצעות חשבון גוגל
      </IonTitle>

      <IonButton fill="solid" color="secondary" expand="full" className="ion-padding-start">
        כניסה עם גוגל
        <IonIcon slot="start" icon={logoGoogle} />
      </IonButton>
    </div>
  )
}

export default GoogleSignIn;
