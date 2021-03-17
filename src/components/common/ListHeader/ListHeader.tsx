import React from 'react';
import {
  IonListHeader,
  IonLabel,
} from '@ionic/react';

interface ListHeaderProps extends React.HTMLAttributes<HTMLIonListHeaderElement> {
  headersList: string[]
}

const ListHeader: React.FC<ListHeaderProps> = (props) => {
  const { headersList } = props;
  return (
    <IonListHeader { ...props }>
      {headersList.map(header => (
        <IonLabel key={header}>{header}</IonLabel>
      ))}
    </IonListHeader>
  )
}

export default ListHeader;
