// const { baseUrl } = Cypress.config();

describe('Login and auth flows', () => {
  before(() => {
    // cy.createUser('rimon@mail.com', 'testadmin');
    cy.visit('/');
  });

  after(() => {
    console.log('clean up')
    cy.logout();
  });

  it('should display error message on incorrect login', () => {
    cy.testId('email-input').type('rimon@mail.com');
    cy.testId('password-input').type('wrongpassword');
    cy.testId('login-button').click();
    cy.testId('login-error-msg').should(
      'have.text',
      'The password is invalid or the user does not have a password.'
    );
  });

  it('should redirect to /login on un-authorized navigation to /admin', () => {
    cy.visit('/admin');
    cy.contains('עמוד כניסה')
  })

  it('should login with correct credentials', () => {
    cy.testId('email-input').type('rimon@mail.com');
    cy.testId('password-input').type('testadmin');
    cy.testId('login-button').click();
    cy.contains('אדמין');
  });

});