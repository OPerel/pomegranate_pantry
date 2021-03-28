import React from 'react';
import {
  IonListHeader,
  IonLabel,
} from '@ionic/react';
import './ListHeader.css';

interface ListHeaderProps extends React.HTMLAttributes<HTMLIonListHeaderElement> {
  headersList: string[]
}

const ListHeader: React.FC<ListHeaderProps> = (props) => {
  const { headersList } = props;
  return (
    <IonListHeader { ...props }>
      {headersList.map(header => (
        <IonLabel key={header} className="list-header-label">{header}</IonLabel>
      ))}
    </IonListHeader>
  )
}

export default ListHeader;
