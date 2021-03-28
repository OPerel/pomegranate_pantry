import React from 'react';
import {
  IonListHeader,
  IonLabel,
} from '@ionic/react';
import './ListHeader.css';

interface ListHeaderProps extends React.HTMLAttributes<HTMLIonListHeaderElement> {
  name: string;
  headersList: string[]
}

const ListHeader: React.FC<ListHeaderProps> = (props) => {
  const { name, headersList } = props;
  return (
    <IonListHeader { ...props }>
      {headersList.map((header, idx) => (
        <IonLabel key={`${idx}-${name}-${header}`} className="list-header-label">{header}</IonLabel>
      ))}
    </IonListHeader>
  )
}

export default ListHeader;
