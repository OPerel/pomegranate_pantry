describe('Admin main views', () => {

  before(() => {
    cy.login('rimon@mail.com', 'testadmin');
    cy.visit('/admin');
  });
  
  after(() => {
    cy.logout();
    cy.resetDb();
  });

  describe('Orders, Products and Users list views', () => {
    it('should have one order', () => {
      cy.testId('order-list-item').should('have.lengthOf', 1);
    });

    it('should be a closed order', () => {
      cy.testId('order-item-status').should('have.text', 'ההזמנה סגורה');
    });

    it('should display products list on tab click', () => {
      cy.testId('admin-products-button').click();
      cy.testId('admin-products-list').should('be.visible').contains('מוצרים');
    });

    it('should list 6 products', () => {
      cy.testId('products-list-item').should('have.lengthOf', 6);
    });

    it('should display users list on tab click', () => {
      cy.testId('admin-users-button').click();
      cy.testId('admin-users-list').should('be.visible').contains('משתמשים');
    });

    it('should list 4 users', () => {
      cy.getRole('users-list-item').should('have.lengthOf', 4);
    });
  })

  describe('New order flow', () => {
    it('should go back to orders list', () => {
      cy.testId('admin-orders-button').click();
      cy.testId('admin-orders-list').should('be.visible').contains('הזמנות');
    });

    it('should click new order button and expect date modal', () => {
      cy.testId('add-order-button').click();
      cy.testId('date-modal').should('be.visible').contains('בחר תאריך סיום');
    });

    it('should alert when adding an order without a date', () => {
      const alert = cy.stub();
      cy.on('window:alert', alert);
      cy.contains('הוסף הזמנה').click()
        .then(() => {
          expect(alert.getCall(0)).to.be.calledWith('בחר תאריך סיום על מנת ליצור הזמנה חדשה');
        });
    })

    it('should select a date', () => {
      const date = new Date();
      date.setMonth(date.getMonth() + 1);
      const dateString = date.toLocaleDateString('he');
      cy.testId('end-order-date-selector').click();
      cy.get('ion-picker-column.picker-opts-left').children('div').children('button.picker-opt-selected').next().click();
      cy.contains('Done').click();
      cy.get('ion-datetime').shadow().find('[part="text"]').should('have.text', dateString);
    });

    it('should add the order', () => {
      const orderDate = new Date().toLocaleDateString('he');
      cy.contains('הוסף הזמנה').click();
      cy.testId('order-list-item').should('have.lengthOf', 2);
      cy.testId('order-item-createdAt').last().should('have.text', orderDate);
    });
  })
})