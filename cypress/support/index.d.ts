declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to select DOM element by data-cy attribute.
     * @example cy.dataCy('greeting')
    */
    testId(value: string): Chainable<Element>,
    getRole(value: string): Chainable<Element>,
    logout: () => void,
    login: (email: string, password: string) => void,
    createUser: (email: string, password: string) => void,
    resetDb: () => void
  }
}