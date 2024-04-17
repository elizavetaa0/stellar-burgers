const BURGER_INGREDIENT_SELECTOR = '[data-testid="burger-ingredient"]';
const CLOSE_BUTTON_SELECTOR = '[data-testid="close-button"]';
const CONSTRUCTOR_INGREDIENT_SELECTOR = '[data-testid="constructor-ingredient"]';
const BUN_TOP_SELECTOR = '[data-testid="constructor-bun-top"]';
const BUN_BOTTOM_SELECTOR = '[data-testid="constructor-bun-bottom"]';

describe('Ingredients API', () => {
  beforeEach(() => {
    cy.fixture('ingredients').then((ingredients) => {
      cy.intercept('GET', 'api/ingredients', {
        statusCode: 200,
        body: {
          success: true,
          data: ingredients
        }
      }).as('getIngredients');

      cy.visit('/');
      cy.wait('@getIngredients');
    });
  });

  it('должен отображать моковые данные из api/ingredients', function () {
    cy.get('[data-testid="burger-ingredients-comp"]').should('exist');

    cy.get(BURGER_INGREDIENT_SELECTOR).should('have.length', 15);
  });
});


describe('Adding ingredients', () => {
  beforeEach(() => {
    cy.fixture('ingredients').then((ingredients) => {
      cy.intercept('GET', 'api/ingredients', {
        statusCode: 200,
        body: {
          success: true,
          data: ingredients
        }
      }).as('getIngredients');

      cy.visit('/');
      cy.wait('@getIngredients');
    });
  });

  it('adds ingredients to constructor', function () {
    cy.get(BURGER_INGREDIENT_SELECTOR).eq(1).as('firstIngredient');

    cy.get('@firstIngredient').find('.text_type_main-default').invoke('text').as('ingredientName');
    cy.get('@firstIngredient').find('.text_type_digits-default').invoke('text').as('ingredientPrice');

    cy.get('@firstIngredient').contains('Добавить').click();

    cy.get(CONSTRUCTOR_INGREDIENT_SELECTOR).should('have.length', 3);

    cy.get(CONSTRUCTOR_INGREDIENT_SELECTOR).eq(0).within(() => {
      cy.contains(`${this.ingredientName}`);
      cy.contains(`${this.ingredientPrice}`);
    });
  });
});

describe('Opening and closing modal', () => {
  beforeEach(() => {
    cy.fixture('ingredients').then((ingredients) => {
      cy.intercept('GET', 'api/ingredients', {
        statusCode: 200,
        body: {
          success: true,
          data: ingredients
        }
      }).as('getIngredients');

      cy.visit('/');
      cy.wait('@getIngredients');
    });
  });

  it('opens and closes ingredient modal', () => {
    cy.get(BURGER_INGREDIENT_SELECTOR).first().click();

    cy.get('h3').contains('Детали ингредиента').should('exist');

    cy.wait(1000).then(() => {
      cy.get(CLOSE_BUTTON_SELECTOR).click();
    });

    cy.get('.modal').should('not.exist');
  });
});

describe('creating order', () => {
  beforeEach(() => {
    cy.fixture('userData').then((userData) => {
      cy.intercept('POST', 'api/auth/login', {
        statusCode: 200,
        body: {
          success: true,
          accessToken: userData.accessToken,
          refreshToken: userData.refreshToken,
          user: { email: userData.email, name: userData.name, isAuthChecked: true }
        }
      }).as('authRequest');
    });

    cy.fixture('loginData').then((loginData) => {
      cy.session('user', () => {
        cy.visit('login');
        cy.get('input[name=email]').type(loginData.email);
        cy.get('input[name=password]').type(loginData.password);
        cy.contains('Войти').click();
        cy.wait('@authRequest');
      });
    });

    cy.fixture('userData').then((userData) => {
      cy.intercept('GET', 'api/auth/user', {
        statusCode: 200,
        body: {
          success: true,
          user: {
            email: userData.email,
            name: userData.name,
            isAuthChecked: userData.isAuthChecked
          }
        }
      })
    });

    cy.fixture('ingredients').then((ingredients) => {
      cy.intercept('GET', 'api/ingredients', {
        statusCode: 200,
        body: {
          success: true,
          data: ingredients
        }
      }).as('getIngredients');

      cy.visit('/');
      cy.wait('@getIngredients');
    });

    cy.intercept('POST', 'api/orders', { fixture: 'orderResponse.json' }).as('createOrder');

  });

  it('should create order and open modal with correct order number', () => {
    cy.get(BURGER_INGREDIENT_SELECTOR).eq(1).as('firstIngredient');
    cy.get('@firstIngredient').contains('Добавить').click();

    cy.get(BURGER_INGREDIENT_SELECTOR).eq(3).as('secondIngredient');
    cy.get('@secondIngredient').contains('Добавить').click();

    cy.get(BURGER_INGREDIENT_SELECTOR).eq(14).as('thirdIngredient');
    cy.get('@thirdIngredient').contains('Добавить').click();

    cy.contains('Оформить заказ').click();

    cy.get('p').should('contain', 'идентификатор заказа');

    cy.get(BUN_TOP_SELECTOR).contains('Выберите булки');
    cy.get(CONSTRUCTOR_INGREDIENT_SELECTOR).contains('Выберите начинку');
    cy.get(BUN_BOTTOM_SELECTOR).contains('Выберите булки');
  });
});

