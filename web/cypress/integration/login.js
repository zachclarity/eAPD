describe('login page', () => {
  beforeEach(() => {
    cy.acceptConsentBanner();
    cy.clearLocalStorage();
  });

  it('shows and hides my password if I click the checkbox', () => {
    cy.visit('http://localhost:8080');
    cy.url().should('include', '/login');

    cy.get('input[name="username"]').type('my email');
    cy.get('input[name="password"]').type('my password');

    cy.get('input[name="password"]').should('have.attr', 'type', 'password');

    // Toggle password to visible
    cy.contains('Show password').click();
    cy.get('input[name="password"]').should('have.attr', 'type', 'text');

    // Toggle back to hidden
    cy.contains('Show password').click();
    cy.get('input[name="password"]').should('have.attr', 'type', 'password');
  });

  it('shows an error if I use the wrong credentials', () => {
    cy.visit('http://localhost:8080');
    cy.url().should('include', '/login');

    cy.get('input[name="username"]').type('my email');
    cy.get('input[name="password"]').type('my password');

    cy.get('button')
      .contains('Log in')
      .click();

    cy.contains('The email or password you’ve entered is incorrect.');
  });

  it('redirects me back to the dashboard page if I use the right credentials', () => {
    cy.visit('http://localhost:8080');
    cy.url().should('include', '/login');

    cy.get('input[name="username"]').type('em@il.com');
    cy.get('input[name="password"]').type('password');

    cy.get('button')
      .contains('Log in')
      .click();

    cy.url().should('match', /\/$/);
    cy.contains('My State Dashboard');
  });
});
