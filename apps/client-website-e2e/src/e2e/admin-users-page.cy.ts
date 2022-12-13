import { CreatableUser, USER_ROLE } from '@api-interfaces';

import { deleteAllUsers } from '../support/delete-all-users';

describe('Admin Users Page', () => {
  beforeEach(() => {
    cy.login('admin@admin', 'admin');

    deleteAllUsers();

    cy.visit('/admin/users');
  });

  it('should CREATE a new user', () => {
    // Click on `New` button
    cy.get('[data-test="new-user-button"]').click();

    // The form is opened
    cy.get('[data-test="user-form-modal"]').should('be.visible');

    // Fill all the required inputs in the form
    fillUserForm(bob_user);

    // Click on save
    cy.get('[data-test="form-submit-button"]').should('be.visible').click();

    // Check if the card with the new user has been added
    cy.contains('[data-test="user-card"]', 'bob@bob').should('be.visible');

    // Reload the page
    cy.reload();

    // Check if the card with the new user still exist after reload
    cy.contains('[data-test="user-card"]', 'bob@bob').should('be.visible');
  });

  it('should DELETE an user', () => {
    // Post an user to be deleted
    cy.loggedRequest({
      method: 'POST',
      url: '/api/users',
      body: bob_user,
    });

    // Reload the page
    cy.reload();

    // Check if the card with the new user still exist after reload
    cy.contains('[data-test="user-card"]', 'bob@bob').should('be.visible');

    // Delete the user
    cy.get('[data-test="delete-user-button"]').click();

    // Check if the card with the new user was deleted
    cy.contains('[data-test="user-card"]', 'bob@bob').should('not.exist');

    // Reload the page
    cy.reload();

    // Check if the card with the new user still deleted
    cy.contains('[data-test="user-card"]', 'bob@bob').should('not.exist');
  });
});

const getRoleLabel = (role: USER_ROLE): string => {
  switch (role) {
    case USER_ROLE.admin: {
      return 'Administrator';
    }
    case USER_ROLE.employee: {
      return 'Employee';
    }
    default: {
      return 'Manager';
    }
  }
};

const fillUserForm = ({ name, email, password, role }: CreatableUser): void => {
  // Fill the name
  cy.get('[data-test="user-name-input"]').should('be.visible').type(name);

  // Fill the email
  cy.get('[data-test="user-email-input"]').should('be.visible').type(email);

  // Fill the role
  cy.contains('Employee').should('be.visible').click();
  cy.contains(getRoleLabel(role)).should('be.visible').click();

  // Fill the password
  cy.get('[data-test="user-password-input"]').should('be.visible').type(password);

  // Fill the confirmation password
  cy.get('[data-test="user-confirmation-password-input"]').should('be.visible').type(password);
};

// * Mock data
const bob_user: CreatableUser = {
  name: 'Bob',
  email: 'bob@bob',
  role: USER_ROLE.admin,
  password: 'abcd',
};
