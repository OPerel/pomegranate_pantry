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
      });

      it('should enter qty for the first product item', () => {
        const firstProductInput = cy.getRole('order-product-qty-input')
        firstProductInput.first().type('2');
        firstProductInput.should('have.value', Number(2));
      });

      it('should add the product to the user\'s order', () => {
        cy.getRole('add-product-to-order-button').first().click();
        cy.testId('open-order-product-item').first().should('have.attr', 'color', 'medium')
          .getRole('order-product-qty-input').should('have.attr', 'placeholder', '2');
      });

      it('should click my order button and display current order modal', () => {
        cy.getRole('my-order-button').click();
        cy.testId('my-order-modal').should('be.visible');
      });

      it('should display the product added in the modal', () => {
        cy.testId('my-order-product-item').should('have.lengthOf', 1)
          .and('have.text', 'טחינה הר ברכה - 2');
      });

      it('should close modal', () => {
        cy.getRole('close-my-order-modal').click();
        cy.testId('my-order-modal').should('not.be.visible');
      });

      it('should go back to admin view', () => {
        cy.contains('אדמין').click();
        cy.testId('admin-orders-list').should('be.visible');
      });
    });

    describe('Add new product', () => {
      it('should go to products list and click add product button', () => {
        cy.testId('admin-products-button').click();
        cy.testId('add-product-button').click();
        cy.testId('add-product-modal').should('be.visible');
      });

      it('should fill in product name', () => {
        const nameInput = cy.getRole('product-name-input');
        nameInput.type('אגוז');
        nameInput.should('have.value', 'אגוז');
      });

      it('should fill in product minQty', () => {
        const nimQtyInput = cy.getRole('product-minQty-input');
        nimQtyInput.type('1');
        nimQtyInput.should('have.value', '1');
      });

      // it('should fill in product qtyUnit', () => {
      //   const qtyUnitInput = cy.getRole('product-qtyUnit-input');
      //   qtyUnitInput.click()
      //   cy.get('.select-interface-option > ion-label').last().invoke('show').click({ force: true });
      //   qtyUnitInput.should('have.value', 'Kg');
      // });
    })
  }); // end of admin actions

  describe('Regular user adding to order', () => {

    before(() => {
      cy.login('testuser1@mail.com', 'rimontesting1');
    });

    after(() => {
      cy.logout();
    });


  });
})