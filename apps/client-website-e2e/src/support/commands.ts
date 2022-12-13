// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/consistent-type-definitions
  interface Chainable<Subject> {
    readonly login: (email: string, password: string) => void;
    readonly logout: () => void;
    readonly loggedRequest: <T>(options: Partial<RequestOptions>) => Chainable<Cypress.Response<T>>;
  }
}

// * Add login command
Cypress.Commands.add('login', (email, password) => {
  cy.request({
    method: 'POST',
    url: '/api/users/login',
    headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json' },
    body: { email, password },
  }).then(response => {
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('token');
    expect(response.body).to.have.property('loggedUser');
    cy.wrap(localStorage).invoke('setItem', 'token', response.body.token);
  });
});

// * Add logged request command
Cypress.Commands.add('loggedRequest', requestArguments =>
  cy
    .wrap(localStorage)
    .invoke('getItem', 'token')
    .then(token => {
      return cy.request({
        ...requestArguments,
        auth: {
          ...requestArguments.auth,
          bearer: token,
        },
      });
    }),
);

// * Add logout command
Cypress.Commands.add('logout', () => {
  cy.clearLocalStorage('token');
});
