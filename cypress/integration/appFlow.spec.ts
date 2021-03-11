const currentDate = new Date();
const currentDateStr = currentDate.toLocaleDateString('he');
const nextMonthDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
const nextMonthDateStr = nextMonthDate.toLocaleDateString('he');

describe('Complete app flow', () => {
  
  after(() => {
    cy.resetDb();
  });

  describe('Admin actions', () => {

    before(() => {
      cy.login('rimon@mail.com', 'testadmin');
      cy.visit('/admin');
    });
    
    after(() => {
      cy.logout();
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
        cy.testId('end-order-date-selector').click();
        cy.get('ion-picker-column.picker-opts-left').find('button.picker-opt-selected').next().click();
        cy.contains('Done').click();
        cy.get('ion-datetime').shadow().find('[part="text"]').should('have.text', nextMonthDateStr);
      });

      it('should add the order', () => {
        cy.contains('הוסף הזמנה').click();
        cy.testId('order-list-item').should('have.lengthOf', 2);
        cy.testId('order-item-createdAt').first().should('have.text', currentDateStr);
        cy.testId('order-item-status').first().should('have.text', 'פתוח להזמנות');
      });

      it('should now have new order button disabled', () => {
        cy.testId('add-order-button').shadow().find('button').should('be.disabled');
      });
    });

    describe('New order init with no users nor products', () => {
      it('should click new order row and display order', () => {
        const orderTitle = `הזמנה ${currentDateStr }פתוח להזמנותנסגר להזמנות ב - ${nextMonthDateStr}`;
        cy.testId('order-list-item').contains('פתוח להזמנות').click();
        cy.getRole('order-details-title').should('have.text', orderTitle)
      });
      
      it('should have correct next order status button', () => {
        cy.testId('next-order-status-button').should('have.text', 'עבור להשלמות');
      });

      it('should display empty order users list', () => {
        cy.testId('order-users-tab-button').shadow().find('button').should('be.disabled');
        cy.contains('רשימת משתמשים');
        cy.contains('לא נמצאו משתמשים להזמנה');
      });
      
      it('should click the products tab button and display empty list', () => {
        const productsBtn = cy.testId('order-products-tab-button');
        productsBtn.click();
        productsBtn.shadow().find('button').should('be.disabled');
        cy.contains('רשימת מוצרים');
        cy.contains('לא נמצאו מוצרים להזמנה');
      });

      it('should go back to main admin view', () => {
        cy.testId('back-to-orders').click();
        cy.testId('admin-orders-list').should('be.visible').contains('הזמנות');
      });
    });

    describe('Admin in user views', () => {
      it('should click user button and see the open order view', () => {
        cy.contains('משתמש').click();
        cy.testId('open-order-title')
          .should('have.text', `פתוח להזמנות | נסגרת ב - ${nextMonthDateStr}`)
      });

      it('should display 6 product items', () => {
        cy.testId('open-order-product-item').should('have.lengthOf', 6);
      });

      it('should have item\'s add button disabled', () => {
        cy.testId('open-order-product-item').each(item => {
          expect(item.find('[role="add-product-to-order-button"]')).to.have.attr('aria-disabled')
        })
      })
    });
  }); // end of admin actions


})