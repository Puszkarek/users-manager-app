describe('Login Page', () => {
  beforeEach(() => cy.visit('/'));

  afterEach(() => cy.logout());

  it('should login with the given user', () => {
    // * Login with admin
    submitLoginForm('admin@admin', 'admin');

    // * Has navigated to Dashboard page
    cy.contains('Dashboard').should('be.visible');
  });

  it('should display a notification when gives a wrong user', () => {
    // * Fill with an invalid user
    submitLoginForm('admin@admin', 'wrong-password');

    // * A notification appears with an error message
    cy.get('div[data-test="notification-toast"]').should('be.visible');
  });
});

export const submitLoginForm = (email: string, password: string): void => {
  // * Fill the login Form
  cy.get('input[data-test="login-email-input"]').should('be.visible').type(email);
  cy.get('input[data-test="login-password-input"]').should('be.visible').type(password);

  // * Submit the login
  cy.get('button[data-test="login-submit"]').should('be.visible').click();
};
