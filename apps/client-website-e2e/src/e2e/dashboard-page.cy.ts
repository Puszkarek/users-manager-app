describe('Dashboard Page', () => {
  beforeEach(() => {
    cy.login('admin@admin', 'admin');

    cy.visit('/');
  });

  describe('Header', () => {
    it('should OPEN a dropdown menu', () => {
      // * Open dropdown
      openHeaderDropdown();

      // * Display a Logout item
      cy.get('button[data-test="dropdown-item"]').contains('Logout');
    });

    it('should NOT display a dropdown menu AFTER logout', () => {
      // * Open dropdown
      openHeaderDropdown();

      // * Logout user
      cy.get('button[data-test="dropdown-item"]').contains('Logout').click();

      // * The dropdown trigger will disappear
      cy.get('button[data-test="dropdown-trigger"]').should('not.exist');
    });
  });
});

const openHeaderDropdown = (): void => {
  // * Click on trigger
  cy.get('button[data-test="dropdown-trigger"]').should('be.visible').click();

  // * Should display the dropdown items
  cy.get('app-dropdown').should('be.visible');
};
