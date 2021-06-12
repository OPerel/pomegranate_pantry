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
    });
  
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

      it('should display correct missing qty for first product', () => {
        const firstProductMissingQty = cy.getRole('missing-product-qty').first();
        firstProductMissingQty.should('have.text', '');
      });

      it('should enter qty for the first product item', () => {
        const firstProductInput = cy.getRole('order-product-qty-input').first();
        firstProductInput.type('2');
        firstProductInput.should('have.value', 2);
      });

      it('should add the product to the user\'s order', () => {
        cy.getRole('add-product-to-order-button').first().click();
        cy.testId('open-order-product-item').first() // .should('have.attr', 'color', 'favorite')
          .getRole('order-product-qty-input').should('have.attr', 'placeholder', '2');
      });

      it('should display correct updated missing qty for first product', () => {
        const firstProductMissingQty = cy.getRole('missing-product-qty').first();
        firstProductMissingQty.should('have.text', '10');
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

    describe('Check new order user and product are visible', () => {
      it('should click on open order', () => {
        cy.testId('order-list-item').contains('פתוח להזמנות').click();
        cy.contains('רשימת משתמשים');
        cy.testId('order-user-name').should('have.lengthOf', 1)
          .and('have.text', 'rimon');
      });

      it('should click on order user details button and see product name and qty', () => {
        cy.testId('order-user-list-item').click();
        cy.testId('order-user-product-list-item').should('have.lengthOf', 1)
          .and('have.text', 'טחינה הר ברכה020');
      });

      it('should go to order products and see the product', () => {
        cy.testId('order-products-tab-button').click();
        cy.getRole('order-product-list-item').should('have.lengthOf', 1)
          .and('have.text', '2100');
      });

      it('should click product item details button and qty by location', () => {
        cy.getRole('open-order-product-details').click();
        cy.testId('order-product-locations-details').should('have.text', 'תל אביב - 2פרדס חנה - 0');
      });

      it('should go back to main admin view', () => {
        cy.testId('back-to-orders').click();
        cy.testId('admin-orders-list').contains('הזמנות');
      });
    });

    describe('Add new product', () => {
      it('should go to products list and click add product button', () => {
        cy.testId('admin-products-button').click();
        cy.testId('open-new-product-modal').click();
        cy.testId('add-product-modal').should('be.visible');
      });

      it('should fill in product name', () => {
        const nameInput = cy.getRole('product-name-input');
        nameInput.type('אגוז');
        nameInput.should('have.value', 'אגוז');
      });

      it('should fill in product minQty', () => {
        const nimQtyInput = cy.getRole('product-minQty-input');
        nimQtyInput.type('5');
        nimQtyInput.should('have.value', '5');
      });

      // it('should fill in product qtyUnit', () => {
      //   const qtyUnitInput = cy.getRole('product-qtyUnit-input');
      //   qtyUnitInput.click()
      //   cy.get('.select-interface-option > ion-label').last().invoke('show').click({ force: true });
      //   qtyUnitInput.should('have.value', 'Kg');
      // });

      it('should click add product button and display new product', () => {
        cy.getRole('add-product-to-db').click();
        cy.testId('products-list-item').should('have.lengthOf', 7);
        cy.getRole('product-item-name').first().should('have.text', 'אגוז');
      })
    });
  }); // end of admin actions

  describe('Regular user adding to order', () => {

    before(() => {
      cy.login('testuser1@mail.com', 'rimontesting1');
      cy.visit('/')
    });

    after(() => {
      cy.logout();
    });

    it('should display open order view with 7 products', () => {
      cy.testId('open-order-product-item').should('have.lengthOf', 7)
        .each(item => {
          expect(item).to.not.have.attr('color', 'favorite');
        });
    });

    // duplicated code 
    it('should enter qty for the first product item', () => {
      const firstProductInput = cy.getRole('order-product-qty-input').first();
      firstProductInput.type('2');
      firstProductInput.should('have.value', 2);
    });

    it('should add the product to the user\'s order', () => {
      cy.getRole('add-product-to-order-button').first().click();
      cy.testId('open-order-product-item').first() // .should('have.attr', 'color', 'favorite')
        .getRole('order-product-qty-input').should('have.attr', 'placeholder', '2');
    });

  }); // end of regular user adding to order

  describe('Admin sees updated order and updates it more', () => {
    before(() => {
      cy.login('rimon@mail.com', 'testadmin');
      cy.visit('/');
    });
    
    after(() => {
      // cy.logout();
    });

    it('should navigate from /admin to /admin/order/...', () => {
      cy.testId('order-list-item').first().click();
      cy.testId('order-user-name').should('have.lengthOf', 2)
        .last().should('have.text', 'משה')
    });

    it('should go to order products and see two products', () => {
      cy.testId('order-products-tab-button').click();
      cy.getRole('order-product-list-item').should('have.lengthOf', 2)
        .first().should('have.text', '230')
    });

    it('should go to user view', () => {
      cy.contains('משתמש').click({ force: true });
      cy.testId('open-order-title').should('be.visible');
    });

    it('should update the existing order product', () => {
      const orderedProduct = cy.testId('open-order-product-item').eq(1);
      orderedProduct // .should('have.attr', 'color', 'favorite')
        .should('include.text', 'טחינה הר ברכה');

      const orderedProductInput = cy.getRole('order-product-qty-input').eq(1);
      orderedProductInput.should('have.attr', 'placeholder', '2').type('3');

      orderedProduct.should('have.value', '3');
      cy.getRole('add-product-to-order-button').eq(1).click();
    });

    it('should add the new product to the order', () => {
      const productInput = cy.getRole('order-product-qty-input').first();
      productInput.type('1');
      productInput.should('have.value', 1);
      cy.getRole('add-product-to-order-button').first().click();
    });

    it('should open my order modal and see both product', () => {
      cy.getRole('my-order-button').click();
      const productsList = cy.testId('my-order-product-item');
      productsList.should('have.lengthOf', 2);
      productsList.first().should('have.text', 'אגוז - 1');
      cy.testId('my-order-product-item').last().should('have.text', 'טחינה הר ברכה - 3');
    });

    // check for product removal from order

    it('should close my order modal and navigate back to admin daxhboard', () => {
      cy.getRole('close-my-order-modal').click();
      cy.contains('אדמין').click();
      cy.testId('admin-orders-list').should('be.visible');
    });
  });

  describe('Admin changes order status to completion', () => {
    it('clicks the order status button', () => {
      cy.testId('order-list-item').first().click();

      // check for updated products

      cy.testId('next-order-status-button').should('have.text', 'עבור להשלמות').click();
    });

    it('should display close completion button', () => {
      cy.testId('next-order-status-button').should('have.text', 'סגור השלמות');
    });

    it('should display correct order header', () => {
      const orderTitle = `הזמנה ${currentDateStr }פתוח להשלמותנסגר להזמנות ב - ${nextMonthDateStr}`;
      cy.getRole('order-details-title').should('have.text', orderTitle);      
    });

    it('should navigate to user view and see only two products', () => {
      cy.contains('משתמש').click({ force: true });
      cy.testId('open-order-product-item').should('have.lengthOf', 2);
    });

    it('should display completion status warning', () => {
      cy.testId('completion-warning').should('be.visible')
        .and('have.text', 'שים לב: בזמן ההשלמות לא ניתן להסיר מוצרים מההזמנה!');
    });

    it('should open my order model and verify delete product btn is disabled', () => {
      cy.getRole('my-order-button').click();
      cy.getRole('delete-order-product-button').first().shadow().find('button').should('be.disabled');
    });

    // it('should order remaining product qty and see its removed', () => {
    //   cy.getRole('close-my-order-modal').click();
    //   // const productInput = cy.getRole('order-product-qty-input').first();
    //   // productInput.type('3');
    //   // cy.getRole('add-product-to-order-button').first().click();
    //
    //   // const orderedProduct = cy.testId('open-order-product-item').eq(0);
    //   // orderedProduct //.should('have.attr', 'color', 'favorite')
    //   //   .should('include.text', 'אגוז');
    //
    //   const orderedProductInput = cy.getRole('order-product-qty-input').eq(0);
    //   orderedProductInput.should('have.attr', 'placeholder', '1')
    //     .type('3');
    //
    //   // orderedProductInput.should('have.value', '3');
    //   cy.getRole('add-product-to-order-button').first().click();
    //   // cy.getRole('order-product-qty-input').should('have.lengthOf', 1);
    //   cy.testId('qty-above-missing').should('be.visible');
    // })
    /**
     * move to user and check:
     * - ordering missing qty removes product from list
     */
  });
})