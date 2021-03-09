// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })


/** Firebase support */
import firebase from 'firebase';

firebase.initializeApp({
  apiKey: Cypress.env('REACT_APP_API_KEY'),
  authDomain: Cypress.env('REACT_APP_AUTH_DOMAIN'),
  databaseURL: Cypress.env('REACT_APP_DATABASE_URL'),
  projectId: Cypress.env('REACT_APP_PROJECT_ID'),
  storageBucket: Cypress.env('REACT_APP_STORAGE_BUCKET'),
  messagingSenderId: Cypress.env('REACT_APP_MESSAGING_SENDER_ID'),
  appId: Cypress.env('REACT_APP_APP_ID,Cypress')
})

Cypress.Commands.add('createUser', (email='rimon@mail.com', password='testadmin') => {
  return firebase.auth().createUserWithEmailAndPassword(email, password);
})

Cypress.Commands.add('login', (email='rimon@mail.com', password='testadmin') => {
  return firebase.auth().signInWithEmailAndPassword(email, password);
})

Cypress.Commands.add('logout', () => {
  return firebase.auth().signOut();
})

/** DOM query support */
Cypress.Commands.add('testId', (value) => {
  return cy.get(`[data-testid=${value}]`);
});