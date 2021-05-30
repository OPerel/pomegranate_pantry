import React from 'react';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton
} from '@ionic/react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants';
import Fire from '../../../services/Firebase';

const AdminHeader: React.FC = () => {
  return (
    <IonHeader translucent>
      <IonToolbar color="primary">
        <IonTitle slot="start">אדמין</IonTitle>
        <Link to={`${ROUTES.USER}/admin`} style={{ color: 'white', marginLeft: '2%' }} slot="end">משתמש</Link>
        <IonButton slot="end" color="secondary" onClick={() => Fire.doSignOut()}>יציאה</IonButton>
      </IonToolbar>
    </IonHeader>
  )
}

export default AdminHeader;

