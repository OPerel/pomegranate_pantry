import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import { routes } from './routes';
import AuthStateProvider from './components/context/authState/AuthContextProvider';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './App.css';

export function RouteWithSubRoutes(route: any) {
  return (
    <Route
      path={route.path}
      render={props => (
        // pass the sub-routes down to keep nesting
        <route.component {...props} routes={route.routes} />
      )}
    />
  );
}

const App: React.FC = () => {
  
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Switch>
            {routes.map((route, i) => (
              <RouteWithSubRoutes key={i} {...route} />
            ))}
          </Switch>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
}

export default AuthStateProvider(App);

/**
 * TODO:
 * 
 * App:
 * notifications (?)
 * database rules
 * PWA
 * 
 * Tests:
 * add e2e tests for registration (maybe refactor auth test flows to emulator)
 * complete e2e test flows
 * check code coverage
 * fix cypress flaky tests
 * 
 * CI:
 * cache firebase-tools installation
 * 
 * Deploy:
 * 404 on page refresh
 * 
 * Questions for Elad:
 * how to move from completion to shopping?
 * are prices for Kg unit type per 1 or 5 or what?
 */