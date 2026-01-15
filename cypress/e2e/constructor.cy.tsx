/// <reference types="cypress" />

const SELECTORS = {
  MODAL: '[data-cy="modal"]',
  MODAL_CLOSE: '[data-cy="modal-close"]',
  MODAL_OVERLAY: '[data-cy="modal-overlay"]',

  INGREDIENT_DETAILS: '[data-cy="ingredient-details"]',
  ORDER_NUMBER: '[data-cy="order-number"]',

  BURGER_CONSTRUCTOR: '[data-cy="burger-constructor"]',

  SELECT_BUNS_TEXT: 'Выберите булки',
  SELECT_FILLINGS_TEXT: 'Выберите начинку',

  API_INGREDIENTS: 'api/ingredients',
  API_AUTH_USER: 'api/auth/user',
  API_ORDERS: 'api/orders',

  FIXTURE_INGREDIENTS: 'ingredients.json',
  FIXTURE_USER: 'user.json',
  FIXTURE_ORDER: 'order.json',

  ACCESS_TOKEN_COOKIE: 'accessToken',
  ACCESS_TOKEN_VALUE: 'test-access-token',
  REFRESH_TOKEN_KEY: 'refreshToken',
  REFRESH_TOKEN_VALUE: 'test-refresh-token',
};

const BUTTON_TEXTS = {
  ADD: 'Добавить',
  CREATE_ORDER: 'Оформить заказ',
};

const INGREDIENTS = {
  FLUORESCENT_BUN: 'Флюоресцентная булка R2-D3',
  KRASTOR_BUN: 'Краторная булка N-200i',
  LUMINESCENT_FILLET: 'Филе Люминесцентного тетраодонтимформа',
  SPICY_SAUCE: 'Соус Spicy-X',
};

const ORDER = {
  NUMBER: '12345',
};

const getIngredientElement = (ingredientName: string) => {
  return cy.contains(ingredientName).parents('li');
};

const addIngredient = (ingredientName: string) => {
  getIngredientElement(ingredientName)
    .find(`button:contains("${BUTTON_TEXTS.ADD}")`)
    .click();
};

const checkModalClosed = () => {
  cy.get(SELECTORS.MODAL).should('not.exist');
  cy.url().should('eq', Cypress.config().baseUrl + '/');
};

describe('Конструктор бургеров', () => {
  beforeEach(() => {
    cy.intercept('GET', SELECTORS.API_INGREDIENTS, { 
      fixture: SELECTORS.FIXTURE_INGREDIENTS 
    }).as('getIngredients');

    cy.visit('/');
    cy.wait('@getIngredients');
    cy.wait(1000);
  });

  afterEach(() => {
    cy.clearCookies();
    cy.window().then((win) => {
      win.localStorage.clear();
    });
  });

  describe('Добавление ингредиента из списка в конструктор', () => {
    it('Добавляет булку по кнопке "Добавить"', () => {
      addIngredient(INGREDIENTS.FLUORESCENT_BUN);
      
      cy.get('body').should('contain', INGREDIENTS.FLUORESCENT_BUN);
    });

    it('Добавляет начинку по кнопке "Добавить"', () => {
      addIngredient(INGREDIENTS.FLUORESCENT_BUN);
      addIngredient(INGREDIENTS.LUMINESCENT_FILLET);
      
      cy.get('body').should('contain', INGREDIENTS.LUMINESCENT_FILLET);
    });

    it('Добавляет соус по кнопке "Добавить"', () => {
      addIngredient(INGREDIENTS.FLUORESCENT_BUN);
      addIngredient(INGREDIENTS.SPICY_SAUCE);
      
      cy.get('body').should('contain', INGREDIENTS.SPICY_SAUCE);
    });
  });

  describe('Работа модальных окон ингредиента', () => {
    it('Открывает модальное окно ингредиента при клике', () => {
      cy.contains(INGREDIENTS.KRASTOR_BUN).click();
      
      cy.get(SELECTORS.MODAL).should('be.visible');
      cy.get(SELECTORS.INGREDIENT_DETAILS).should('be.visible');

      cy.get(SELECTORS.MODAL_CLOSE).click();
      checkModalClosed();
    });

    it('Закрывает модальное окно по клику на крестик', () => {
      cy.contains(INGREDIENTS.KRASTOR_BUN).click();
      cy.wait(1000);
      
      cy.get(SELECTORS.MODAL_CLOSE).click();
      checkModalClosed();
    });

    it('Закрывает модальное окно по клику на оверлей', () => {
      cy.contains(INGREDIENTS.KRASTOR_BUN).click();
      cy.wait(1000);

      cy.get(SELECTORS.MODAL_OVERLAY).click({ force: true });
      checkModalClosed();
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      cy.intercept('GET', SELECTORS.API_AUTH_USER, { 
        fixture: SELECTORS.FIXTURE_USER 
      }).as('getUser');

      cy.intercept('POST', SELECTORS.API_ORDERS, { 
        fixture: SELECTORS.FIXTURE_ORDER 
      }).as('createOrder');

      cy.setCookie(SELECTORS.ACCESS_TOKEN_COOKIE, SELECTORS.ACCESS_TOKEN_VALUE);
      cy.window().then((win) => {
        win.localStorage.setItem(SELECTORS.REFRESH_TOKEN_KEY, SELECTORS.REFRESH_TOKEN_VALUE);
      });

      cy.reload();
      cy.wait('@getIngredients');
      cy.wait('@getUser');
      cy.wait(1000);
    });

    it('Создает заказ', () => {
      addIngredient(INGREDIENTS.FLUORESCENT_BUN);
      addIngredient(INGREDIENTS.SPICY_SAUCE);

      cy.get('body').should('contain', INGREDIENTS.FLUORESCENT_BUN);
      cy.get('body').should('contain', INGREDIENTS.SPICY_SAUCE);

      cy.contains(BUTTON_TEXTS.CREATE_ORDER).click();

      cy.wait('@createOrder');

      cy.get(SELECTORS.MODAL).should('be.visible');
      cy.get(SELECTORS.ORDER_NUMBER).should('contain', ORDER.NUMBER);

      cy.get(SELECTORS.MODAL_CLOSE).click();

      cy.get(SELECTORS.MODAL).should('not.exist');

      cy.get(SELECTORS.BURGER_CONSTRUCTOR).within(() => {
        cy.contains(SELECTORS.SELECT_BUNS_TEXT).should('be.visible');
        cy.contains(SELECTORS.SELECT_FILLINGS_TEXT).should('be.visible');
      });
    });
  });
});
