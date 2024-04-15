describe('Ingredients API', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://norma.nomoreparties.space/api/ingredients/').as('getIngredients');
  });

  it('overrides the response with mock data', () => {
    cy.intercept('GET', 'https://norma.nomoreparties.space/api/ingredients/', (req) => {
      req.reply((res) => {
        cy.fixture('ingredients.json').then((ingredientsMockData) => {
          res.send({
            data: ingredientsMockData
          });
        });
      }).as('getIngredients');

      cy.visit('http://localhost:4000/');
      cy.wait('@getIngredients').then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        cy.fixture('ingredients.json').then((expectedData) => {
          expect(interception.response.body.data).to.deep.eq(expectedData);
        });
      });
    });
  });
});

describe('Adding ingredients', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4000/');
  });

  it('adds ingredients to constructor', function () {
    cy.get('[data-testid="burger-ingredient"]').eq(1).as('firstIngredient');

    cy.get('@firstIngredient').find('.text_type_main-default').invoke('text').as('ingredientName');
    cy.get('@firstIngredient').find('.text_type_digits-default').invoke('text').as('ingredientPrice');

    cy.get('@firstIngredient').contains('Добавить').click();

    cy.get('[data-testid="constructor-ingredient"]').should('have.length', 3);

    cy.get('[data-testid="constructor-ingredient"]').eq(0).within(() => {
      cy.contains(`${this.ingredientName}`);
      cy.contains(`${this.ingredientPrice}`);
    });
  });
});

describe('Opening and closing modal', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4000/');
  });

  it('opens and closes ingredient modal', () => {
    cy.get('[data-testid="burger-ingredient"]').first().click();

    cy.get('h3').contains('Детали ингредиента').should('exist');

    cy.wait(1000).then(() => {
      cy.get('[data-testid="close-button"]').click();
    })

    cy.get('.modal').should('not.exist');
  });
});

describe('creating order', () => {
  beforeEach(() => {
    cy.fixture('userData').then((userData) => {
      cy.intercept('POST', 'https://norma.nomoreparties.space/api/auth/login', {
        statusCode: 200,
        body: {
          success: true,
          accessToken: userData.accessToken,
          refreshToken: userData.refreshToken,
          user: { email: userData.email, name: userData.name, isAuthChecked: true }
        }
      }).as('authRequest');
    });

    cy.intercept('POST', 'https://norma.nomoredomains.club/api/orders/', {
      statusCode: 200,
      body: { status: 'done', orderNumber: '12345' }
    }).as('createOrder');

    cy.fixture('userData').then((userData) => {
      cy.session('user', () => {
        cy.visit('http://localhost:4000/login');
        cy.get('input[name=email]').type(userData.email);
        cy.get('input[name=password]').type(userData.password);
        cy.contains('Войти').click();
      });
    });

    cy.visit('http://localhost:4000/');
  });

  it('should create order and open modal with correct order number', () => {
    cy.get('[data-testid="burger-ingredient"]').eq(1).as('firstIngredient');
    cy.get('@firstIngredient').contains('Добавить').click();

    cy.get('[data-testid="burger-ingredient"]').eq(3).as('secondIngredient');
    cy.get('@secondIngredient').contains('Добавить').click();

    cy.get('[data-testid="burger-ingredient"]').eq(14).as('thirdIngredient');
    cy.get('@thirdIngredient').contains('Добавить').click();

    cy.contains('Оформить заказ').click();

    cy.get('h3').contains('Оформляем заказ...');

    cy.fixture('orderData').then((orderData) => {
      cy.get('h2').invoke('text', orderData.payload.number);

      cy.wait(1000).then(() => {
        cy.get('p').contains('идентификатор заказа');
      });
    });

    cy.get('[data-testid="close-button"]').click();

    cy.get('.modal').should('not.exist');

    cy.get('[data-testid="constructor-bun-top"]').contains('Выберите булки');
    cy.get('[data-testid="constructor-ingredient"]').contains('Выберите начинку');
    cy.get('[data-testid="constructor-bun-bottom"]').contains('Выберите булки');
  });
});
















