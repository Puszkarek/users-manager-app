import { getGreeting } from '../support/app.po';

describe('user-demo', () => {
  beforeEach(() => cy.visit('/'));

  it('should display a Login Form', () => {
    /*     // Custom command example, see `../support/commands.ts` file
    cy.login('my-email@something.com', 'myPassword'); */

    // Function helper example, see `../support/app.po.ts` file
    // Displays an Logo with the App Name
    getGreeting().contains('Demo');

    // Contains a `Login` title
    cy.contains('Login');
  });
});
