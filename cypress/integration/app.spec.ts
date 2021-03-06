const { baseUrl } = Cypress.config();

describe('login as admin user', () => {
  it('should login with correct credentials', () => {
    cy.visit('/');
    cy.testId('email-input').type('rimon@mail.com');
    cy.testId('password-input').type('testadmin');
    cy.testId('login-button').click();
    cy.contains('אדמין');
  })
});

describe('admin main page', () => {
  it('should have new order button disabled', () => {
    cy.testId('add-order-button').shadow().find('button').should('be.disabled');
  });

  it('checks id new order btn is working', () => {
    cy.testId('add-order-button').click();
    cy.testId('date-modal').should('have.text', 'בחר תאריך סיום')
  })
});