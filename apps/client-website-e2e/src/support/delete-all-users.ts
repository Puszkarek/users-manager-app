import { User } from '@api-interfaces';

/** Delete all users, except the logged one */
export const deleteAllUsers = (): void => {
  // * Get the logged user
  cy.loggedRequest<{ readonly id: string }>({
    method: 'GET',
    url: '/api/users/me',
  }).then(meResponse => {
    // * Get all the users
    cy.loggedRequest<ReadonlyArray<User>>({
      method: 'GET',
      url: '/api/users',
    }).then(response => {
      const {
        body: { id },
      } = meResponse;

      // * Remove the logged user from the list
      const users = response.body.filter(user => user.id !== id);

      // * Delete all the users in the list
      for (const user of users) {
        cy.loggedRequest({
          method: 'DELETE',
          url: `/api/users/${user.id}`,
        });
      }
    });
  });
};
